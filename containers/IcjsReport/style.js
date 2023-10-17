import styled from "styled-components";
import { variables } from "@assets/styles/variables";

export const Container = styled.div`
  width: 100%;
  display: flex;
  padding: 10px;
  flex-direction: column;
  overflow: auto;

  .widgetContainer {
    width: 100%;
    min-height: 350px;
  }
  .submitButton {
    background-color: ${variables.LIGHT_BLUE};
    border-color: ${variables.LIGHT_BLUE};
    border-radius: 5px;

    &:hover,
    &:active,
    &:focus {
      background-color: ${variables.PRIMARY_BLUE};
    }

    .saveButtonIcon {
      top: -3px;
      font-size: 18px;
      position: relative;
      color: ${variables.WHITE_COLOR};
    }
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
  /*.ant-table-tbody {
    tr.ant-table-row.ant-table-row-level-0:last-child {
      background-color: gray;
      color: white;
    }
  }*/
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

  .stepsButtonInActive {
    margin: 0px 8px;
    background: transparent;
    color: ${variables.LIGHT_BLUE};
    border: none;
    box-shadow: none;
    font-size: 18px;

    &:hover,
    &:active,
    &:focus {
      background: transparent;
    }
  }
`;

export const ReportsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: auto;

  .dropDownIcon {
    font-size: 14px;
    color: "#8D8D8D";
  }

  .heading {
    color: #949494;
    margin-bottom: 10px;
    font-size: 16px;
  }

  .siderItemDisabled {
    text-align: left;
    height: 40px;
    background: ${variables.SIDER_GRAY};
    color: ${variables.WHITE_COLOR};
    border-radius: 5px;
    padding: 10px;
    font-size: 14px;
  }

  .siderContainer {
    height: 100%;
    background-color: ${variables.LIGHT_GRAY};
    padding: 15px;
    font-size: 16px;
  }

  .siderItems {
    text-align: left;
    height: 40px;
    background: ${variables.LIGHT_BLUE};
    color: ${variables.WHITE_COLOR};
    border-radius: 5px;
    font-size: 14px;
    padding: 10px;
  }

  .pageTitle {
    color: ${variables.DARK_GRAY};
  }

  .ant-table-thead > tr > th {
    background-color: ${variables.LIGHT_BLUE} !important;
    color: ${variables.WHITE_COLOR} !important;
    font-weight: 400;
    font-size: 14px;
    white-space: nowrap;
  }

  .ant-table-thead > tr > td {
    font-size: 14px;
  }

  .ant-table-thead > tr > th,
  .ant-table-tbody > tr > td,
  .ant-table tfoot > tr > th,
  .ant-table tfoot > tr > td {
    padding: 10px 10px;
    font-size: 14px;
  }
  .ant-table tfoot.ant-table-summary {
    background-color: #eeeeee;
  }
  .contentContainer {
    min-height: 70vh;
    background: ${variables.BG_LAYOUT_COLOR};
    padding: 10px;
  }

  .contentHeaderContainer {
    paddingtop: 10px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    .ant-checkbox {
      top: 0.5em;
    }
  }

  .ant-picker {
    border-radius: 5px;
  }

  .ant-picker:hover,
  .ant-picker-focused {
    border-color: ${variables.LIGHT_BLUE};
  }

  .ant-form-item-label {
    padding: 0px !important;
  }

  .ant-input,
  .ant-select-selector,
  .ant-picker {
    border-radius: 5px !important;
  }

  .textCenter {
    padding: 25%;
    width: 100%;
    height: auto;
  }

  .resetLink {
    margin-left: 3%;
    position: absolute;
    font-size: 16px;
  }

  .wordBreak {
    word-wrap: break-word;
  }
  .tableRowTextUl {
    color: ${variables.LIGHT_BLUE};
    font-weight: 500;
    font-size: 14px;
  }
`;
