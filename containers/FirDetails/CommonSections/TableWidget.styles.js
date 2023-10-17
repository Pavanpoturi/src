import styled from "styled-components";
import { palette } from "styled-theme";
import { variables } from "@assets/styles/variables";

const TableWidgetWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: ${variables.WHITE_COLOR};
  overflow: hidden;
  border: 1px solid ${palette("border", 2)};

  .widgetContainer {
    width: 100%;
    min-height: 350px;
  }

  .tableTitle {
    padding: 5px;
    background: #E8E8E8;
    text-align: center;
    font-size: 15px;
    font-weight: 500;
  }

  .widgetLabel {
    font-size: 20px;
    color: ${palette("text", 0)};
    font-weight: 400;
    line-height: 1.2;
    margin: 0 0 25px;
  }

  .ant-table-thead > tr > th {
    background-color: #E8E8E8;
    color: rgba(0, 0, 0, 0.85);
    font-weight: 300;
    font-size: 16px;
  }

  .tableRowText {
    color: #363636;
    font-weight: normal;
    font-size: 14px;
  }

  .wordWrap {
    display: block;
    word-wrap: break-word;
    width: 140px;
    white-space: normal;
  }

  .tableRowTextFir {
    color: #033C68;
    font-weight: bold;
    text-decoration: underline;
    font-size: 14px;
  }
`;

export { TableWidgetWrapper };
