import styled from "styled-components";
import { palette } from "styled-theme";
import { variables } from "@assets/styles/variables";

const NotificationsWidgetWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 30px;
  margin-bottom: 10px;
  background-color: ${variables.WHITE_COLOR};
  overflow: hidden;
  border: 1px solid ${palette("border", 2)};

  .widgetContainer {
    width: 100%;
    min-height: 50px;
  }

  .widgetLabel {
    font-size: 18px;
    color: ${palette("text", 0)};
    font-weight: 400;
    line-height: 1.2;
    margin: 0 0 25px;
  }

  .widgetText {
    color: #525252;
    font-weight: bold;
    font-size: 14px;
  }
`;

export { NotificationsWidgetWrapper };
