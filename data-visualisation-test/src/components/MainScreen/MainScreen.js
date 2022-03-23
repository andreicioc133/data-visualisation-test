import React, { useState, useEffect } from "react";
import moment from "moment";
import { useQuery, gql } from "@apollo/client";

export default function MainScreen() {
  const [countSize, setCountSize] = useState(10);
  const [postsToRender, setPostsToRender] = useState([])
  
  const GET_POSTS = gql`{
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

const { loading, error, data } = useQuery(GET_POSTS);
console.log("data: ", data)

function formatPosts () {
  if(!loading) {
    const formattedData = data.allPosts.map((post) => {
        return {
          id : post.id,
          title : post.title,
          body: post.body,
          published: post.published,
          createdAt: moment(new Date(parseInt(post.createdAt))).format("YYYY-MM-DD")
        }
    })
    setPostsToRender(formattedData)
  }
}


useEffect(() =>{
  formatPosts()
  console.log("postsTorender: ", postsToRender)
}, [])
  

if (loading) return <h1>"Loading..."</h1>;
if (error) console.log("Error from useQuery: ", error.message)
  
  return (
    <div>
      <h1>MainScreen</h1>
      {
        postsToRender.map(element => {
          return <p>{element.title}</p>  //debug purposes
        })
      }
    </div>
  );
}
