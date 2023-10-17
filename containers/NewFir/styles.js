import styled from "styled-components";
import { variables } from "@assets/styles/variables";

const FirDetailsModuleWrapper = styled.div`
  width: 100%;
  display: flex;
  padding: 20px;
  flex-direction: column;
  overflow: auto;
  .cardLeftStyle {
    border-top-right-radius: unset !important;
    border-bottom-right-radius: unset !important;
    float: left;
  }

  .requiredField::after {
    content: "*";
    color: red;
    padding: 5px;
  }

  .cardRightStyle {
    border-left: transparent !important;
    border-top-left-radius: unset !important;
    border-bottom-left-radius: unset !important;
    float: right;
  }
  .ant-checkbox-wrapper {
    vertical-align: top;
  }

  .ant-input,
  .ant-picker,
  .ant-select-selector {
    border-radius: 5px !important;
  }

  .mediaButton {
    background-color: ${variables.LIGHT_BLUE};
    border-color: ${variables.LIGHT_BLUE};
    color: ${variables.WHITE_COLOR};
    border-radius: 5px;
    width: 165px;
    height: 35px;
    font-size: 12px;

    &:hover,
    &:active,
    &:focus {
      background-color: ${variables.LIGHT_BLUE};
      border-color: ${variables.LIGHT_BLUE};
      color: ${variables.WHITE_COLOR};
    }

    .mediaButtonIcon {
      top: -3px;
      position: relative;
      font-size: 18px;
      color: ${variables.WHITE_COLOR};
    }

    span:nth-child(2) {
      left: 40px !important;
    }
  }

  .heading {
    color: #949494;
    margin-bottom: 10px;
    font-size: 16px;
  }

  .saveButton {
    background-color: ${variables.LIGHT_BLUE};
    border-color: ${variables.LIGHT_BLUE};
    color: ${variables.WHITE_COLOR};
    border-radius: 5px;
    width: 130px;
    height: 35px;
    font-size: 12px;

    &:hover,
    &:active,
    &:focus {
      background-color: ${variables.LIGHT_BLUE};
      border-color: ${variables.LIGHT_BLUE};
      color: ${variables.WHITE_COLOR};
    }

    .saveButtonIcon {
      top: -3px;
      position: relative;
      font-size: 18px;
      color: ${variables.WHITE_COLOR};
    }

    span:nth-child(2) {
      left: 40px !important;
    }
  }

  .selectFile {
    background-color: ${variables.LIGHT_BLUE};
    border-color: ${variables.LIGHT_BLUE};
    color: ${variables.WHITE_COLOR};
    border-radius: 5px;
    width: 130px;
    height: 35px;
    font-size: 16px;

    &:hover,
    &:active,
    &:focus {
      background-color: ${variables.LIGHT_BLUE};
      border-color: ${variables.LIGHT_BLUE};
      color: ${variables.WHITE_COLOR};
    }

    .selectFileButtonIcon {
      top: -3px;
      position: relative;
      left: 8px;
      font-size: 18px;
      color: ${variables.WHITE_COLOR};
    }
  }

  .resetLink {
    margin-left: 3%;
    position: absolute;
    font-size: 16px;
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

  .stepsButtonActive {
    background-color: ${variables.DARK_GREEN};
    border-color: ${variables.DARK_GREEN};
    border-radius: 5px;
    width: 110px;
    height: 35px;

    &:hover,
    &:active,
    &:focus {
      background-color: ${variables.DARK_GREEN};
      border-color: ${variables.DARK_GREEN};
    }
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

  .contentHeaderContainer {
    padding-left: 10px;
    padding-right: 10px;
    padding-bottom: 10px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    .ant-checkbox {
      top: 0.5em;
    }
  }

  .link {
    cursor: pointer;
    color: #02599c;
    text-decoration: underline;
    font-size: 16px;
  }

  .updateRecord {
    cursor: pointer;
    color: #02599c;
    text-decoration: underline;
  }

  .ant-table-thead > tr > th {
    background-color: #e8e8e8;
    color: rgba(0, 0, 0, 0.85);
    font-weight: 300;
    font-size: 16px;
  }

  .ant-card-body {
    padding: 10px !important;
  }

  .panelHeader {
    background-color: #e8e8e8;
    margin-bottom: 10px;
  }

  .ant-upload-list-item {
    max-width: 460px !important;
  }

  .selected-record-text {
    margin-left: 18px;
    display: flex;
    align-items: center;
    margin-top: 10px;
  }
  .card-style {
    margin-top: 10px;
    background: #ffffff 0% 0% no-repeat padding-box;
    box-shadow: 0px 2px 3px #00000029;
    border: 1px solid #e4e4e4;
    border-radius: 7px;
    opacity: 1;
    .ant-card-body {
      padding: 12px;
    }
    .sub-heading {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 18px;
    }
    .text-area-row {
      .text-area {
      }
    }
    .file-upload {
      margin-left: 31px;
      .saveButton {
        width: 205px;
        display: flex;
        margin-top: 22px;
        .anticon-camera {
          display: flex;
          margin-top: 7px;
        }
      }
      .saveButton span:nth-child(2) {
        margin-left: 0px;
      }
    }
  }
  .custody-reasons-row .custody-col:not(:first-child) {
    margin-left: 15px;
  }
  .right-section {
    .row-item {
      > span:nth-child(1) {
        width: 10%;
        font-size: 20px;
        display: flex;
        color: #02599c;
      }
      > span:nth-child(2) {
        text-decoration: underline;
        width: 60%;
        margin-top: -3px;
        color: #02599c;
        font-size: 14px;
        cursor: pointer;
      }
      .anticon-camera {
        display: flex;
      }
      .ant-upload-select-text {
        width: 110px;
      }
      .saveButton {
        width: 110px;
      }
      .saveButton span:nth-child(2) {
        margin-left: 0px;
      }
    }
    .row-item:not(first-child) {
      margin-top: 25px;
    }
    .select-file {
      .saveButton {
        margin-top: 11px;
      }
      .saveButton span:nth-child(1) {
        display: flex;
      }
      .saveButton span:nth-child(2) {
        margin-left: 0px;
      }
    }
    .records-count {
      margin-top: 25px;
    }
  }
  .checkboxcontent {
    margin-top: 20px;
    margin-left: 20px;
  }
  .link {
    color: #02599c;
    text-decoration: underline;
    margin-top: 10px;
    cursor: pointer;
    font-size: 16px;
  }
  .linkWithPointer {
    margin-top: 5px;
    margin-left: 5px;
    cursor: pointer;
    font-size: 16px;
  }
  .staticContent {
    color: #49c104;
    margin-top: 5px;
  }
`;

const SelectedRecordsWidgetWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: ${variables.WHITE_COLOR};
  overflow: hidden;
`;

export { FirDetailsModuleWrapper, SelectedRecordsWidgetWrapper };
