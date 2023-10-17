import styled from "styled-components";
import { palette } from "styled-theme";
import { variables } from "@assets/styles/variables";

const AdvisoryWrapper = styled.div`
  boxshadow: "0px 27px 19px -28px";
  height: 375px;
  /* width: 275px; */
  display: flex;
  flex-direction: column;
  padding: 10px;
  margin-top: 30px;
  background-color: ${variables.WHITE_COLOR};
  overflow: hidden;
  border: 1px solid ${palette("border", 2)};

  .widgetContainer {
    width: 100%;
    min-height: 250px;
  }

  .widgetLabel {
    font-size: 20px;
    color: ${palette("text", 0)};
    font-weight: 400;
    line-height: 1.2;
    margin: 0 0 25px;
  }

  .widgetText {
    color: #525252;
    font-weight: bold;
    font-size: 16px;
  }
`;

export { AdvisoryWrapper };
