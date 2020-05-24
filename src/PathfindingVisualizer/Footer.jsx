import React from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  height: 50px;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  background-color: #1e2019;
`;

const Text = styled.p`
  font-size: 24px;
  color: white;
`;
const HoverText = styled(Text)`
  :hover {
    color: #1e2019;
    background-color: lightgrey;
    cursor: pointer;
  }
`;

export default function Footer(props) {
  return (
    <Container>
      <Text>Made by Pierre-Étienne Soury</Text>
      <HoverText
        onClick={() =>
          window.open("https://github.com/JeFaisLeCafe/pathfinder", "_blank")
        }
      >
        Github
      </HoverText>
      <HoverText
        onClick={() =>
          window.open(
            "https://www.linkedin.com/in/pierre-etienne-soury-66050511b/",
            "_blank"
          )
        }
      >
        LinkedIn
      </HoverText>
    </Container>
  );
}
