import styled from "styled-components";
import { variables } from "@assets/styles/variables";

const Form54Wrapper = styled.div`
  .ant-checkbox {
    top: 0.4em !important;
  }

  .approvalFromSrOfficer .ant-checkbox-wrapper {
    margin-top: 20px !important;
  }

  .isDied .ant-checkbox-wrapper {
    margin-top: 10px !important;
  }

  .cardLeftStyle {
    width: 70%;
    min-height: 500px;
    border-top-right-radius: unset !important;
    border-bottom-right-radius: unset !important;
  }

  .cardRightStyle {
    width: 30%;
    min-height: 500px;
    border-left: transparent !important;
    border-top-left-radius: unset !important;
    border-bottom-left-radius: unset !important;
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
        margin-left: 0;
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
        margin-left: 0;
      }
    }
    .records-count {
      margin-top: 25px;
    }
  }

  .ant-collapse {
    .panelHeader {
      background-color: ${variables.LIGHT_GRAY};
      border-radius: 5px;
      margin-bottom: 20px;
    }

    .headerTextContainer {
      display: flex;
      flex-direction: row;
    }

    .panelTitle {
      min-width: 200px;
    }
  }
`;

const SelectedRecordsWidgetWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: ${variables.WHITE_COLOR};
  overflow: hidden;
`;

export { Form54Wrapper, SelectedRecordsWidgetWrapper };
