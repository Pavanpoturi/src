import styled from "styled-components";
import { palette } from "styled-theme";
import { variables } from "@assets/styles/variables";

const FormWidgetWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: ${variables.WHITE_COLOR};
  overflow: hidden;
  padding: 15px;
  height: 410px;
  border: 1px solid ${palette("border", 2)};

  .titleStyle {
    color: lightgray;
    font-weight: bold;
  }

  .buttonsView {
    padding: 10px;
    width: 100px;
    display: flex;
    flex-direction: inherit;
  }

  .addExternalLink {
    width: 100%;
    height: auto;

    .addExternalLinkText {
      text-decoration: underline;
      color: ${variables.LINK_COLOR};
      font-size: 16px;
    }
  }

  .ant-form-item-label > label {
    font-size: 16px;
    color: ${variables.FORM_LABEL_COLOR};
    padding: 0px;
  }

  .ant-form-vertical .ant-form-item-label,
  .ant-col-24.ant-form-item-label,
  .ant-col-xl-24.ant-form-item-label {
    padding: 0px;
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
  }

  .ant-input {
    padding: 6px 11px;
    border-radius: 5px;
  }

  .ant-input:hover,
  .ant-input:active,
  .ant-input:focus {
    border-color: ${variables.PRIMARY_BLUE};
  }

  .wordBreak {
    word-wrap: break-word;
  }
`;

export { FormWidgetWrapper };
