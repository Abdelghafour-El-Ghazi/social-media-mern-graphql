import gql from "graphql-tag";

export const FETCH_POSTS_QUERY = gql`
  {
    getPosts {
      id
      body
      selectedFile
      createdAt
      username
      likeCount
      likes {
        username
      }
      commentCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;
export const FETCH_USER_QUERY = gql`
  query($username: String!) {
    getUser(username: $username) {
      email
      id
      username
      createdAt
    }
  }
`;
