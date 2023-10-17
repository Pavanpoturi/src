import styled from "styled-components";

export const CrPcNotice91Wrapper = styled.div`
  .contentHeaderContainer {
    padding-left: 0px;
  }
  .ant-checkbox-wrapper {
    vertical-align: top;
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
      margin-top: 38px;
      .text-area {
        margin-left: 150px;
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
        font-size: 14px;
        color: #02599c;
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
  .courtOrders{
    margin-top: 20px;
  }
  
  
`;
