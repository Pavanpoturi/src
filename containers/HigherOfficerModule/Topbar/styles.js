import styled from "styled-components";
import { palette } from "styled-theme";
import { transition, borderRadius } from "@lib/helpers/style_utils";
import DashboardBg from "@assets/images/dashbard_bg.png";
import WithDirection from "@lib/helpers/rtl";
import { variables } from "@assets/styles/variables";

const TopbarWrapper = styled.div`
  background: url(${DashboardBg});
  .topbar {
    display: flex;
    justify-content: space-between;
    background-color: transparent;
    padding: ${(props) =>
      props["data-rtl"] === "rtl" ? "0 265px 0 31px" : "20px 31px 0 30px"};
    z-index: 1000;
    ${transition()};

    .newFirActive {
      color: rgb(255, 255, 255);
      background-color: rgb(37, 140, 11);
      border-radius: 5px;
      border-color: rgb(37, 140, 11);
      margin-top: 22px;
      height: 35px;
      padding-left: 5px;
      padding-right: 5px;
    }

    .newFirInActive {
      color: #6b6b6b;
      background: #d6d6d6;
      border-color: #d6d6d6;
      border-radius: 5px;
      margin-top: 27px;
      height: 35px;
      padding-left: 5px;
      padding-right: 5px;
    }

    .escopLogo {
      margin-left: 10px;
      width: 100px;
      height: 100px;
    }

    .dashboardTitle {
      margin-left: 5px;
      color: ${variables.WHITE_COLOR};
      letter-spacing: 1px;
      font-size: 16px;
      font-weight: bold;
    }

    @media only screen and (max-width: 767px) {
      padding: ${(props) =>
        props["data-rtl"] === "rtl"
          ? "0px 260px 0px 15px !important"
          : "0px 15px 0px 260px !important"};
    }

    &.collapsed {
      padding: ${(props) =>
        props["data-rtl"] === "rtl" ? "0 109px 0 31px" : "20px 31px 0 30px"};
      @media only screen and (max-width: 767px) {
        padding: ${(props) =>
          props["data-rtl"] === "rtl"
            ? "0px 15px !important"
            : "0px 15px !important"};
      }
    }

    .left {
      display: flex;
      align-items: center;

      @media only screen and (max-width: 767px) {
        margin: ${(props) =>
          props["data-rtl"] === "rtl" ? "0 0 0 20px" : "0 20px 0 0"};
      }

      .triggerBtn {
        width: 24px;
        height: 100%;
        display: -webkit-inline-flex;
        display: -ms-inline-flex;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background-color: transparent;
        border: 0;
        outline: 0;
        position: relative;
        cursor: pointer;

        &:before {
          content: "\f20e";
          font-family: "Ionicons";
          font-size: 26px;
          color: inherit;
          line-height: 0;
          position: absolute;
        }
      }
    }

    .center {
      text-transform: uppercase;
      font-size: 22px;
      width: 30%;
      color: ${variables.WHITE_COLOR};

      .ant-input-affix-wrapper {
        border-radius: 5px;

        .ant-input {
          font-size: 20px;
          font-weight: 300;
        }

        .ant-btn[disabled],
        .ant-btn[disabled]:hover,
        .ant-btn[disabled]:focus,
        .ant-btn[disabled]:active {
          color: #6b6b6b;
          background: #d6d6d6;
          border-color: #d6d6d6;
          border-radius: 5px;
          margin-right: 5px;
          height: 40px;
        }

        .ant-btn > .anticon + span,
        .ant-btn > span + .anticon {
          margin-left: 40px;
        }
      }
    }

    .right {
      display: flex;
      align-items: center;

      .caretDown {
        color: ${variables.WHITE_COLOR};
        font-size: 18px;
      }

      li {
        margin-left: ${(props) => (props["data-rtl"] === "rtl" ? "35px" : "0")};
        margin-right: ${(props) =>
          props["data-rtl"] === "rtl" ? "0" : "20px"};
        cursor: pointer;
        line-height: normal;
        position: relative;
        display: inline-block;

        @media only screen and (max-width: 360px) {
          margin-left: ${(props) =>
            props["data-rtl"] === "rtl" ? "25px" : "0"};
          margin-right: ${(props) =>
            props["data-rtl"] === "rtl" ? "0" : "25px"};
        }

        &:last-child {
          margin: 0;
        }

        &.userDetails {
          .userName {
            color: white;
            font-weight: bold;
            letterspacing: 0.5;
          }

          .userInfo {
            color: #b7bdc3;
            font-size: 14px;
            text=align: center;
            margin-top: 2px;
          }
        }

        &.user {
          margin-right: 10px;

          .imgWrapper {
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            background-color: ${palette("grayscale", 9)};
            ${borderRadius("50%")};

            img {
              height: 100%;
              object-fit: cover;
            }
          }
        }
      }
    }
  }
`;

export default WithDirection(TopbarWrapper);
