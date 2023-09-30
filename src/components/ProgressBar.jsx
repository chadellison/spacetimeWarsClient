import React from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 5em;
`;

const StyledProgressBar = styled.div`
  width: 250px;
  height: 25px;
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: stretch;
  border-radius: 60px;
  background-color: #494b52;
  box-shadow: 0px 0px 20px #111;
  overflow: hidden;
`;

const StyledBar = styled.div`
  width: ${({ percent }) => percent};
  background: linear-gradient(
    180deg, rgba(44, 102, 178, 1) 0%, rgba(0, 64, 128, 1) 32%, rgba(0, 25, 51, 1) 100%
  );
`;

const Text = styled.div`
  position: absolute;
  font-weight: 700;
`;

export const ProgressBar = ({ percent }) => {
  return (
    <Container>
      <Text>{`${percent}%`}</Text>
      <StyledProgressBar>
        <StyledBar percent={`${percent}%`}></StyledBar>
      </StyledProgressBar>
    </Container>
  );
};
