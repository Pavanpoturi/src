import styled from "styled-components";

const CourtAndProsecutionWrapper = styled.div`
  .ant-form .accusedGrid {
    margin-top: 20px;
  }

  .ant-form .accusedGrid label {
    font-size: 14px !important;
  }

  .accusedGrid .ant-table-thead > tr > th,
  .accusedGrid .ant-table-tbody > tr > td {
    font-size: 14px !important;
  }

  .updateRecord {
    cursor: pointer;
    color: #02599c;
    text-decoration: underline;
  }

  .dividerStyle {
    margin: 10px 0px;
    border-top: 1px solid rgba(0, 0, 0, 0.06);
  }

  .requiredField p:after {
    content: " *";
    color: red;
  }

  .ant-btn > span + .anticon {
    top: 10px;
  }

  .ant-checkbox-group {
    display: grid;

    .ant-checkbox-group-item {
      margin-bottom: 15px;
    }

    .ant-checkbox {
      top: 0.4em;
    }
  }

  .noticeToSuerty .ant-card-body,
  .executionOfWarrant .ant-card-body {
    padding: 0px;
  }
`;

export { CourtAndProsecutionWrapper };
