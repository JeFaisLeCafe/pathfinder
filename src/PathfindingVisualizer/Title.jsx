import React from "react";
import styled from "styled-components";

const Container = styled.div`
  text-align: center;
  padding: 20px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
`;
const _Title = styled.h1`
  font-size: 34px;
`;
const Explanation = styled.p`
  font-size: 22px;
`;

export default function Title(props) {
  return (
    <Container>
      <_Title>Pathfinding Algorithms Visualizer</_Title>
      <Explanation>
        Hi, and welcome here ! You can play with this tool to visualize
        different pathfinding algorithms. <br />
        With a right click on start or finish point, you can deplace them.{" "}
        <br />
        With a left click, you can create walls ! Then just choose an algorithm
        and see what happens !
      </Explanation>
    </Container>
  );
}
