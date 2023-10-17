import styled from "styled-components";
import { variables } from "@assets/styles/variables";

const MapsWidgetWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: ${variables.WHITE_COLOR};
  overflow: hidden;
  padding: 10px;
  height: 300px;
  margin-left: 10px;
`;

export { MapsWidgetWrapper };
