import styled from "styled-components";
import { palette } from "styled-theme";
import { variables } from "@assets/styles/variables";
import WithDirection from "@lib/helpers/rtl";

const SignInStyleWrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  height: 100vh;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  position: relative;
  background: ${variables.PRIMARY_BLUE};
  background-size: cover;

  &:before {
    content: "";
    width: 100%;
    height: 100%;
    display: flex;
    background-color: ${variables.PRIMARY_BLUE};
    position: absolute;
    z-index: 1;
    top: 0;
    left: ${(props) => (props["data-rtl"] === "rtl" ? "inherit" : "0")};
    right: ${(props) => (props["data-rtl"] === "rtl" ? "0" : "inherit")};
  }

  .loginContentWrapper {
    width: 550px;
    overflow-y: hidden;
    z-index: 10;
    position: relative;
    border-radius: 10px;
    margin: 0 auto;
  }

  .loginContent {
    min-height: 100%;
    display: flex;
    flex-direction: column;
    padding: 30px;
    position: relative;
    background-color: #ffffff;

    @media only screen and (max-width: 767px) {
      width: 100%;
      padding: 70px 20px;
    }

    .logoWrapper {
      height: 150px;
      width: 150px;
    }

    .signInForm {
      width: 100%;
      display: flex;
      flex-shrink: 0;
      flex-direction: column;

      .inputWrapper {
        margin-bottom: 15px;

        &:last-of-type {
          margin-bottom: 0;
        }

        .ant-checkbox {
          top: 0.4em;
        }

        input {
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
      }

      .helperWrapper {
        margin-top: 35px;
        flex-direction: column;
      }

      .forgotPass {
        font-size: 12px;
        color: ${palette("text", 3)};
        text-decoration: none;

        &:hover {
          color: ${palette("primary", 0)};
        }
      }

      button {
        font-weight: 500;
        background-color: ${variables.PRIMARY_BLUE};
        border-color: ${variables.PRIMARY_BLUE};
        color: ${variables.WHITE_COLOR};

        &:hover {
          background-color: ${variables.PRIMARY_BLUE};
          border-color: ${variables.PRIMARY_BLUE};
        }
      }
    }
  }
`;

export default WithDirection(SignInStyleWrapper);
