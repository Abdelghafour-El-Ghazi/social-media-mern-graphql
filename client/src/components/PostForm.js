import React, { useState } from "react";
import { Button, Form } from "semantic-ui-react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import FileBase from "react-file-base64";

import { useForm } from "../util/hooks";
import { FETCH_POSTS_QUERY } from "../util/graphql";

const PostForm = () => {
  const [selectedFile, setSelectedFile] = useState("");
  const { values, onChange, onSubmit } = useForm(createPostCallback, {
    body: "",
    selectedFile,
  });

  const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
    variables: { body: values.body, selectedFile },
    update(proxy, result) {
      const data = proxy.readQuery({
        query: FETCH_POSTS_QUERY,
      });
      const posts = [result.data.createPost, ...data.getPosts];
      proxy.writeQuery({ query: FETCH_POSTS_QUERY, data: { getPosts: posts } });

      values.body = "";
      setSelectedFile("");
    },
    onError(err) {
      console.log(err);
    },
  });

  function createPostCallback() {
    console.log(values.body);
    console.log(selectedFile);
    createPost();
  }

  return (
    <>
      <Form onSubmit={onSubmit}>
        <h2>Create a post:</h2>
        <Form.Field>
          <Form.Input
            placeholder='Hi World!'
            name='body'
            onChange={onChange}
            value={values.body}
            error={error ? true : false}
          />
          <div style={{ marginBottom: "20px" }}>
            <FileBase
              type='file'
              multiple={false}
              onDone={({ base64 }) => {
                setSelectedFile(base64);
              }}
            />
          </div>

          <Button type='submit' color='teal'>
            Submit
          </Button>
        </Form.Field>
      </Form>
      {error && (
        <div className='ui error message' style={{ marginBottom: 20 }}>
          <ul className='list'>
            <li>{error.graphQLErrors[0].message}</li>
          </ul>
        </div>
      )}
    </>
  );
};

const CREATE_POST_MUTATION = gql`
  mutation createPost($body: String!, $selectedFile: String!) {
    createPost(body: $body, selectedFile: $selectedFile) {
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

export default PostForm;
