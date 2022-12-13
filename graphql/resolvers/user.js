const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');

const { validateRegisterInput } = require('../../utilities/validators')
const { validateLoginInput } = require('../../utilities/validators')


const { SECRET_KEY } = require('../../config');

const user = require('../../models/user');

function generateToken(user) {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        username: user.username
      },
      SECRET_KEY,
      { expiresIn: '1h' }
    );
  }

module.exports = {
    Mutation: {
        async login(_, { username, password }) {
            const { errors, valid } = validateLoginInput(username, password);
      
            if (!valid) {
              throw new UserInputError('Errors', { errors });
            }
      
            const User = await user.findOne({ username });
      
            if (!User) {
              errors.general = 'Invalid username';
              throw new UserInputError('Invalid username', { errors });
            }
      
            const match = await bcrypt.compare(password, User.password);
            if (!match) {
              errors.general = 'Incorrect Password';
              throw new UserInputError('Incorrect Password', { errors });
            }
      
            const token = generateToken(User);
      
            return {
              ...User._doc,
              id: User._id,
              token
            };
          },
        //--------------
        async register(_,
            { registerInput : { username, email, password, confirmPassword }}, 
            context, 
            info){

                const { valid, errors } = validateRegisterInput(username, email, password, confirmPassword);
                if(!valid){
                    throw new UserInputError('Errors', { errors });
                }

                const User = await user.findOne({ username });
                if(User){
                    throw new UserInputError('Username already exists', {
                        errors: {
                            username: 'Username already exists'
                        }
                    })

                }


                password = await bcrypt.hash(password, 12);
                const newUser = new user({
                    email,
                    username,
                    password,
                    createdAt: new Date().toISOString()
                });

                const res = await newUser.save();

                const token = generateToken(res);

                return {
                  ...res._doc,
                  id: res._id,
                  token
                }


        }
    }
}