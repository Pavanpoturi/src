import styled from "styled-components";
import { variables } from "@assets/styles/variables";

export const CaseTrasferContainer = styled.div`
  width: 100%;
  display: flex;
  padding: 30px;
  flex-direction: column;
  overflow: auto;

  .widgetContainer {
    width: 100%;
    min-height: 350px;
  }

  .truncate {
    display: inline-block;
    max-width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .pageTitle {
    color: ${variables.TITLE_TEXT_COLOR};
    font-size: 16px;
    margin-bottom: 20px;
  }

  .ant-table-thead > tr > th {
    background-color: ${variables.LIGHT_BLUE};
    color: ${variables.WHITE_COLOR};
    font-weight: 300;
    font-size: 16px;

    .firSorting {
      position: absolute;
      left: 43px;
      top: 19px;
    }

    .firDateSorting {
      position: absolute;
      left: 85px;
      top: 19px;
    }
  }

  .ant-table-column-sort.ant-table-column-has-sorters {
    background-color: ${variables.LIGHT_BLUE} !important;
    color: ${variables.WHITE_COLOR}!important;
    font-weight: 300 !important;
  }

  .ant-table-pagination.ant-pagination {
    margin: 16px 15px;
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
`;
