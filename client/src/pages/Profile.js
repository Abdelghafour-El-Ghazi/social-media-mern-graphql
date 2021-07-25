import React, { useState, useEffect } from "react";
import { Grid, Transition, Image, Card } from "semantic-ui-react";
import PostCard from "../components/PostCard";
import { useQuery } from "@apollo/react-hooks";
import { FETCH_POSTS_QUERY, FETCH_USER_QUERY } from "../util/graphql";
const Profile = (props) => {
  const username = props.match.params.username;
  const { loading, data: dataPosts } = useQuery(FETCH_POSTS_QUERY);
  const { data: dataUser } = useQuery(FETCH_USER_QUERY, {
    variables: {
      username,
    },
  });
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState([]);
  useEffect(() => {
    if (dataPosts) {
      const { getPosts } = dataPosts;
      setPosts(getPosts);
    }
    if (dataUser) {
      const { getUser } = dataUser;
      setUser(getUser);
    }
  }, [dataPosts, dataUser]);

  return (
    <Grid columns={3}>
      <Grid.Column>
        <Image
          src='https://react.semantic-ui.com/images/avatar/large/molly.png'
          size='small'
          float='right'
        />
        <Card fluid>
          <Card.Content>
            <Card.Header>Username: {user.username}</Card.Header>
          </Card.Content>
          <Card.Content>
            <Card.Header>Email: {user.email}</Card.Header>
          </Card.Content>
        </Card>
      </Grid.Column>
      <Grid.Column>
        {loading ? (
          <h1>Loading posts..</h1>
        ) : (
          <Transition.Group className='post-wrapper'>
            {posts &&
              posts.map((post) =>
                post.username === user.username ? (
                  <Grid.Column key={post.id} style={{ marginBottom: 20 }}>
                    <PostCard post={post} />
                  </Grid.Column>
                ) : null
              )}
          </Transition.Group>
        )}
      </Grid.Column>
    </Grid>
  );
};

export default Profile;
