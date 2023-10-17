import React from "react";
import styled from "styled-components";
// eslint-disable-next-line import/no-anonymous-default-export
export default function ({ children, ...props }) {
  return (
    <Container className="widgetsHolder" {...props}>
      {children}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-flow: row wrap;
  padding: 0 15px;
  margin-top: ${(props) => props.gutterTop}px;
  margin-bottom: ${(props) => props.gutterBottom}px;
  width: ${(props) => props.width}px;
`;
