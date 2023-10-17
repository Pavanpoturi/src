import styled from "styled-components";
import { variables } from "@assets/styles/variables";

export const CasePropertyManagementContainer = styled.div`
  .cardLeftStyle {
    min-height: 700px;
    border-top-right-radius: unset !important;
    border-bottom-right-radius: unset !important;
  }
  .cardRightStyle {
    min-height: 700px;
    border-left: transparent !important;
    border-top-left-radius: unset !important;
    border-bottom-left-radius: unset !important;

    .ant-card-body {
      padding: 0 !important;
    }
  }
  .widgetContainer {
    width: 100%;
    min-height: 350px;
  }
  .pageTitle {
    color: ${variables.TITLE_TEXT_COLOR} !important;
    margin-bottom: 20px !important;
  }
  .ant-radio-wrapper {
    width: 100%;
    margin-bottom: 5px;
  }
  .ant-table-thead > tr > th {
    background-color: ${variables.LIGHT_BLUE} !important;
    color: ${variables.WHITE_COLOR} !important;
    font-weight: 300 !important;
    font-size: 16px;
    .firSorting {
      position: absolute !important;
      left: 43px !important;
      top: 19px !important;
    }
    .firDateSorting {
      position: absolute !important;
      left: 85px !important;
      top: 19px !important;
    }
  }
  .ant-table-pagination.ant-pagination {
    margin: 16px 15px !important;
  }
  .ant-badge-status-dot {
    height: 10px;
    width: 10px;
  }
  .tableRowText {
    color: #373737;
    font-weight: 500;
    font-size: 14px;
  }
  .tableRowTextUl {
    color: ${variables.LIGHT_BLUE};
    text-decoration: underline;
    font-weight: 500;
    font-size: 14px;
  }
  .tableRowStatus {
    color: ${variables.LIGHT_PINK};
    font-weight: 400;
    font-size: 16px;
  }
  .sendToButton {
    background-color: ${variables.LIGHT_BLUE};
    border-color: ${variables.LIGHT_BLUE};
    color: ${variables.WHITE_COLOR};
    border-radius: 5px;
    width: 200px;
    height: 35px;
    font-size: 12px;
    &:hover,
    &:active,
    &:focus {
      background-color: ${variables.LIGHT_BLUE};
      border-color: ${variables.LIGHT_BLUE};
      color: ${variables.WHITE_COLOR};
    }

    span:nth-child(2) {
      left: 40px !important;
    }
  }
`;
