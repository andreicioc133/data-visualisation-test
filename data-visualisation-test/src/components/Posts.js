import { gql } from "@apollo/client";

export const GET_POSTS = (countSize) => gql`{
    allPosts(count: ${countSize}) {
      id
      title
      body
      published
      createdAt
      author {
        id
        firstName
        lastName
        avatar
      }
    }
  }`;