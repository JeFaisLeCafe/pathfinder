import React from "react";
import styled from "styled-components";

const NodeContainer = styled.div`
  width: 40px;
  height: 40px;
  border: solid 1px black;
  margin: 1px;
  background-color: ${props =>
    props.isStart
      ? "green"
      : props.isFinish
      ? "red"
      : props.isShortedPath
      ? "#D2A1B8"
      : props.isVisited
      ? "#011638"
      : props.isWall
      ? "grey"
      : "white"};
  transition: 1s easy-in-out;
  animation-name: ${props =>
    props.isStart
      ? ""
      : props.isFinish
      ? ""
      : props.isShortedPath
      ? "shortestPathAnimation"
      : props.isVisited
      ? "visitedAnimation"
      : props.isWall
      ? ""
      : ""};
  animation-duration: 0.8s;
  animation-timing-function: ease-out;
  animation-delay: 0;
  animation-direction: alternate;
  animation-iteration-count: 1;
  animation-fill-mode: fowards;
  animation-play-state: running;
`;

export default function Node(props) {
  return <NodeContainer {...props}></NodeContainer>;
}
