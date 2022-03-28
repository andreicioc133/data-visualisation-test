import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import moment from "moment";
import { useQuery } from "@apollo/client";
import { GET_POSTS } from "../Posts";
import { groupBy } from "lodash";
import { Container, Row, Col, Button } from "react-bootstrap";
import "./MainScreenStyles.css";

export default function MainScreen() {
  const [countSize, setCountSize] = useState(300);
  const [countText, setCountText] = useState("");
  const [postsToRender, setpostsToRender] = useState([]);

  const { loading, error, data } = useQuery(GET_POSTS(countSize), {
    notifyOnNetworkStatusChange: true,
  });
  const d3chart = useRef();
  console.log("data: ", data);

  function sortByMonth(arr) {
    let months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    arr.sort(function (a, b) {
      return months.indexOf(a.month) - months.indexOf(b.month);
    });
  }

  const handleSubmit = () => {
    setCountSize(countText);
  };

  function formatPosts() {
    if (loading) return;
    else {
      const formattedData = data?.allPosts.map((post) => {
        return {
          id: post.id,
          createdAt: moment(new Date(parseInt(post.createdAt))).format("MMM"),
        };
      });
      const createdAt = (item) => item.createdAt;
      const groupedByMonthArray = groupBy(formattedData, createdAt);
      const res = Object.entries(groupedByMonthArray).map((elem) => {
        return { month: elem[0], numberOfPosts: elem[1].length };
      });
      sortByMonth(res);
      setpostsToRender(res);
      console.log("posts: ", postsToRender);
    }
  }

  function createChart() {
    const margin = {
      top: 20,
      right: 30,
      bottom: 30,
      left: 30,
    };
    const width = parseInt(d3.select(".d3chart").style("width")) -  margin.left -  margin.right;
    const height =  parseInt(d3.select(".d3chart").style("height")) -  margin.top -  margin.bottom;
    const svg = d3
      .select(d3chart.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.bottom + margin.top)
      .style("background-color", "#570A9D")
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const x = d3
      .scaleBand()
      .domain(
        postsToRender.map(function (post) {
          return post.month;
        })
      )
      .range([0, width]);

    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .attr("font-size", 15)
      .attr("color", "white");

    const numberOfPostsToRender = d3.max(postsToRender, function (postsArr) {
      return postsArr.numberOfPosts;
    });
    const y = d3
      .scaleLinear()
      .domain([0, numberOfPostsToRender])
      .range([height, 0]);

    svg
      .append("g")
      .call(d3.axisLeft(y))
      .attr("font-size", 15)
      .attr("color", "white");

    svg
      .selectAll(".bar")
      .data(postsToRender)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", function (d) {
        return x(d.month);
      })
      .attr("width", x.bandwidth() - 10)
      .attr("margin-left", "5px")
      .attr("y", function (d) {
        return y(d.numberOfPosts);
      })
      .attr("height", function (d) {
        return height - y(d.numberOfPosts);
      });
  }

  useEffect(() => {
    if (postsToRender.length > 0) {
      formatPosts();
      createChart();
    }
  }, [loading, countSize]);

  if (error) console.log("Error from useQuery: ", error.message);

  return (
    <Container fluid className="container">
      <Button
        variant="primary"
        onClick={() => {
          formatPosts();
          createChart();
        }}
      >
        FETCH DATA
      </Button>
      <form onSubmit={handleSubmit}>
        <label>
          Number of posts:
          <input
            type="text"
            value={countText}
            onChange={(e) => setCountText(parseInt(e.target.value))}
          />
        </label>
        <input type="submit" value="Submit" />
      </form>{" "}
      {loading ? (
        <h1>"Loading..."</h1>
      ) : (
        <Row className="container-chart">
          <Col className="d3chart">
            <svg ref={d3chart}></svg>
          </Col>
        </Row>
      )}
    </Container>
  );
}
