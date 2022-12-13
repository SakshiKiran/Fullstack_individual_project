import React from 'react';
import { Button, Form } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
// import { Mutation } from 'react-apollo'


import { useForm } from '../util/hooks';
import { FETCH_POSTS_QUERY } from '../util/graphql';


function PostForm() {
  const { values, onChange, onSubmit } = useForm(createPostCallback, {
    body: ''
  });

  const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
    variables: values,
    update(proxy, result) {
      const data = proxy.readQuery({
        query: FETCH_POSTS_QUERY
      });
      data.getPosts = [result.data.createPost, ...data.getPosts];
      proxy.writeQuery({ query: FETCH_POSTS_QUERY, data });
      values.body = '';
    }
  });

  function createPostCallback() {
    createPost();
  }

  return (
    <>
      <Form onSubmit={onSubmit}>
        <h2>Create a post:</h2>
        <Form.Field>
          <Form.Input
            placeholder="write a caption...."
            name="body"
            onChange={onChange}
            value={values.body}
            error={error ? true : false}
          />
          
          
          <Button type="submit" color="orange">
            Submit
          </Button>
          <button class="ui button active" ><i class="upload icon"></i></button>


        </Form.Field>
      </Form>
      {error && (
        <div className="ui error message" style={{ marginBottom: 20 }}>
          <ul className="list">
            <li>{error.graphQLErrors[0].message}</li>
          </ul>
        </div>
      )}
    </>
  );
}

const CREATE_POST_MUTATION = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
      id
      body
      createdAt
      username
      likes {
        id
        username
        createdAt
      }
      likeCount
      comments {
        id
        body
        username
        createdAt
      }
      commentCount
    }
  }
`;

/* const uploadOneFile = () => {
  return (   
    <>
    <Mutation mutation={UPLOAD_FILE}>
      {uploadFile => (
        <input
        type="file"
        required
        onChange={({ target: { validity, files: [file] } }) =>
          validity.valid && uploadFile({ variables: { file } })
        }
       />
    
       
      )}
    </Mutation>
    </>
  );
}; */

/* export const UPLOAD_FILE = gql`
  mutation uploadFile($file: Upload!) {
    uploadFile(file: $file) {
      filename
    }
  }
`; */

export default PostForm;