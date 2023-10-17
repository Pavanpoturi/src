import Table from "@components/uielements/table";
import styled from "styled-components";
import { palette } from "styled-theme";
import { transition, boxShadow, borderRadius } from "@lib/helpers/style_utils";
import { variables } from "@assets/styles/variables";
import WithDirection from "@lib/helpers/rtl";

const TableWrapper = styled(Table)`
  overflow: hidden;
  overflow-x: auto;
  background-color: ${variables.WHITE_COLOR};

  .ant-table-body {
    overflow-x: auto;
    overflow-y: auto;
  }

  .ant-table-thead > tr > th {
    color: ${palette("secondary", 2)};
    font-size: 14px;
    background-color: ${palette("secondary", 1)};
    border-bottom: 0;
    font-size: 16px;

    &.ant-table-column-sort {
      background: ${palette("secondary", 1)};
      margin: ${(props) =>
        props["data-rtl"] === "rtl" ? "0 4px 0 0" : "0 0 0 4px"};
    }
  }

  .ant-table-thead > tr > th,
  .ant-table-tbody > tr > td {
    white-space: break-spaces;
    text-align: ${(props) => (props["data-rtl"] === "rtl" ? "right" : "left")};
    font-size: 16px !important;
    color: #373737;

    p {
      margin-bottom: 0;
    }
  }

  .ant-table-thead
    > tr
    > th:not(:last-child):not(.ant-table-selection-column):not(
      .ant-table-row-expand-icon-cell
    ):not([colspan])::before {
    position: absolute;
    top: 50%;
    right: 0;
    width: 1px;
    transform: translateY(-50%);
    transition: background-color 0.3s;
    content: "";
  }

  .ant-table-tbody > tr > td {
    font-size: 16px !important;
    color: #373737;
    border-bottom: 1px solid ${palette("border", 0)};

    a {
      color: ${palette("primary", 0)};
      ${transition()};

      &:hover {
        color: ${palette("primary", 4)};
      }
    }
  }

  .ant-table-thead > tr.ant-table-row-hover > td,
  .ant-table-tbody > tr.ant-table-row-hover > td,
  .ant-table-thead > tr:hover > td,
  .ant-table-tbody > tr:hover > td {
    background-color: transparent;
  }

  .ant-table-bordered .ant-table-thead > tr > th {
    border-bottom: 1px solid ${palette("border", 0)};
    font-size: 16px !important;
  }

  .ant-table-bordered .ant-table-thead > tr > th,
  .ant-table-bordered .ant-table-tbody > tr > td {
    border-right: 1px solid ${palette("border", 0)};
    font-size: 16px !important;
    color: #373737;
  }

  .ant-table-pagination {
    float: ${(props) => (props["data-rtl"] === "rtl" ? "left" : "right")};
  }

  .ant-pagination-prev,
  .ant-pagination-next {
    border: 1px solid ${palette("border", 0)};
  }

  .ant-pagination-disabled,
  .ant-pagination-prev.ant-pagination-disabled,
  .ant-pagination-next.ant-pagination-disabled {
    border: 1px solid ${palette("border", 0)};

    a {
      border: 0;
    }
  }

  .ant-pagination-prev,
  .ant-pagination-next,
  .ant-pagination-jump-prev,
  .ant-pagination-jump-next {
    transform: ${(props) =>
      props["data-rtl"] === "rtl" ? "rotate(180deg)" : "rotate(0)"};
  }

  .ant-pagination-prev,
  .ant-pagination-jump-prev,
  .ant-pagination-jump-next {
    margin: ${(props) =>
      props["data-rtl"] === "rtl" ? "0 0 0 8px" : "0 8px 0 0"};
  }

  .ant-pagination-item {
    margin: ${(props) =>
      props["data-rtl"] === "rtl" ? "0 0 0 8px" : "0 8px 0 0"};

    &:hover {
      border-color: ${palette("primary", 0)};
      ${transition()};
    }

    &:hover a {
      color: ${palette("primary", 0)};
    }
  }

  .ant-pagination-item-active {
    background-color: ${palette("primary", 0)};
    border-color: ${palette("primary", 0)};

    a {
      color: ${variables.WHITE_COLOR};
    }

    &:hover a {
      color: ${variables.WHITE_COLOR};
    }
  }

  .ant-table-expanded-row {
    background: ${palette("grayscale", 6)};

    p {
      color: ${palette("text", 3)};
    }
  }

  .ant-spin-nested-loading > div > .ant-spin {
    max-height: none;

    .ant-spin-dot i {
      color: ${palette("primary", 0)};
    }
  }

  .ant-table-header {
    background-color: transparent;
  }

  .ant-table-title {
    background: ${palette("secondary", 1)};
    color: ${palette("secondary", 2)};
    font-size: 13px;
    font-weight: 500;
    padding: 16px 30px;
    ${borderRadius()};
  }

  .ant-table-footer {
    background: ${palette("secondary", 1)};
    color: ${palette("secondary", 2)};
    font-size: 12px;
    font-weight: 400;
    padding: 16px 30px;
    ${borderRadius()};
  }

  .ant-table-content {
    overflow-x: auto;
  }

  .ant-table-column-sorter-up.on .anticon-caret-up,
  .ant-table-column-sorter-down.on .anticon-caret-up,
  .ant-table-column-sorter-up.on .anticon-caret-down,
  .ant-table-column-sorter-down.on .anticon-caret-down {
    color: ${palette("primary", 0)};
  }

  &.searchableTable {
    .tableSearchBox {
      padding: 20px;
      display: flex;
      background: ${variables.WHITE_COLOR};
      border: 1px solid ${palette("border", 0)};
      ${boxShadow("0 1px 6px rgba(0,0,0,0.2)")};

      input {
        font-size: 14px;
        font-weight: 400;
        color: ${palette("text", 3)};
        line-height: inherit;
        height: 36px;
        width: 100%;
        padding: 0 15px;
        margin: 0;
        border: 1px solid ${palette("secondary", 7)};
        outline: 0 !important;
        overflow: hidden;
        background-color: ${variables.WHITE_COLOR};
        ${borderRadius("3px 0 0 3px")};
        ${transition()};
        ${boxShadow("none")};

        &:focus,
        &:hover {
          border-color: ${palette("secondary", 7)};
          ${boxShadow("none")};
        }

        &::-webkit-input-placeholder {
          color: ${palette("grayscale", 0)};
        }

        &:-moz-placeholder {
          color: ${palette("grayscale", 0)};
        }

        &::-moz-placeholder {
          color: ${palette("grayscale", 0)};
        }
        &:-ms-input-placeholder {
          color: ${palette("grayscale", 0)};
        }
      }

      button {
        font-size: 12px;
        font-weight: 400;
        padding: 0;
        text-transform: uppercase;
        color: ${variables.WHITE_COLOR};
        background-color: ${palette("primary", 0)};
        border: 0;
        outline: 0;
        height: 36px;
        padding: 0 15px;
        margin-left: -1px;
        cursor: pointer;
        border-radius: ${(props) =>
          props["data-rtl"] === "rtl" ? "3px 0 0 3px" : "0 3px 3px 0"};
        ${transition()};

        &:hover {
          background-color: ${palette("primary", 1)};
        }
      }
    }

    .ant-table-thead > tr > th {
      word-break: keep-all;
      font-size: 16px;

      span {
        display: flex;
        justify-content: flex-start;
        align-items: center;

        i {
          margin: ${(props) =>
            props["data-rtl"] === "rtl" ? "0 0 0 10px" : "0 10px 0 0"};
          order: -1;
        }
      }
    }
  }

  &.groupTable {
    .ant-table-thead > tr {
      th {
        border: 1px solid ${palette("border", 0)};
        border-left: 0;

        &[rowspan] {
          text-align: center;
        }

        &.imageCell {
          padding: 3px;
        }
      }

      &:first-child {
        th {
          &:first-child {
            border-left: ${(props) =>
                props["data-rtl"] === "rtl" ? "0" : "1px"}
              solid ${palette("border", 0)};
          }
        }
      }

      &:last-child {
        th {
          border-top: 0;
        }
      }
    }

    .ant-table-tbody {
      .ant-table-row {
        td {
          border-right: 1px solid ${palette("border", 0)};

          &:first-child {
            border-left: ${(props) =>
                props["data-rtl"] === "rtl" ? "0" : "1px"}
              solid ${palette("border", 0)};
          }

          &:last-child {
            border-left: ${(props) =>
                props["data-rtl"] === "rtl" ? "1px" : "0"}
              solid ${palette("border", 0)};
          }

          &.imageCell {
            padding: 3px;
          }
        }
      }
    }
  }

  &.editableTable {
    .editData {
      .editDataWrapper {
        display: flex;
        align-items: center;

        input {
          font-size: 12px;
          font-weight: 400;
          color: ${palette("text", 3)};
          line-height: inherit;
          padding: 7px 10px;
          margin: ${(props) =>
            props["data-rtl"] === "rtl" ? "0 0 0 10px" : "0 10px 0 0"};
          border: 1px solid ${palette("border", 0)};
          outline: 0 !important;
          overflow: hidden;
          background-color: ${variables.WHITE_COLOR};
          ${borderRadius("3px")};
          ${boxShadow()};
          ${transition()};

          &:focus,
          &:hover {
            border-color: ${palette("border", 0)};
            ${boxShadow()};
          }

          &::-webkit-input-placeholder {
            color: ${palette("grayscale", 0)};
          }

          &:-moz-placeholder {
            color: ${palette("grayscale", 0)};
          }

          &::-moz-placeholder {
            color: ${palette("grayscale", 0)};
          }
          &:-ms-input-placeholder {
            color: ${palette("grayscale", 0)};
          }
        }

        .editIcon {
          cursor: pointer;
        }
      }

      .dataWrapper {
        display: flex;
        align-items: center;

        .editIcon {
          margin: ${(props) =>
            props["data-rtl"] === "rtl" ? "0 auto 0 0" : "0 0 0 auto"};
          cursor: pointer;
          flex-shrink: 0;
        }
      }
    }
  }
  .link {
    cursor: pointer;
    color: #02599c !important;
  }
`;

const WDCustomizedTableWrapper = styled.div`
  .customizedTableControlBar {
    margin-bottom: 40px;

    .ant-form-item {
      margin: ${(props) =>
        props["data-rtl"] === "rtl" ? "0 0 0 16px" : "0 16px 0 0"};
    }

    .ant-form-item-label {
      label {
        color: ${palette("secondary", 2)};

        &:after {
          margin: ${(props) =>
            props["data-rtl"] === "rtl" ? "0 2px 0 8px" : "0 8px 0 2px"};
        }
      }
    }

    .ant-switch-checked {
      border-color: ${palette("primary", 0)};
      background-color: ${palette("primary", 0)};
    }
  }
`;

const CustomizedTableWrapper = WithDirection(WDCustomizedTableWrapper);

export { CustomizedTableWrapper };
export default WithDirection(TableWrapper);
