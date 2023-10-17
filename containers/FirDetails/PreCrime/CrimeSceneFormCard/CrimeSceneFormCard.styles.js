import styled from "styled-components";
import { palette } from "styled-theme";
import { variables } from "@assets/styles/variables";

const CrimeSceneFormCardWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: ${variables.WHITE_COLOR};
  overflow: hidden;
  border: 1px solid ${palette("border", 2)};

  .ant-checkbox-checked .ant-checkbox-inner {
    background-color: ${variables.LIGHT_BLUE};
    border-color: ${variables.LIGHT_BLUE};
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

  .ant-checkbox-inner {
    top: 3px;
    width: 22px;
    height: 22px;
    border: 2px solid ${variables.LIGHT_BLUE};
    border-radius: 5px;

    &:hover,
    &:focus,
    &:active {
      top: 3px;
      width: 22px;
      height: 22px;
      border: 2px solid ${variables.LIGHT_BLUE};
      border-radius: 5px;
    }
  }

  .ant-input-affix-wrapper {
    border-radius: 5px;
  }

  .ant-input-affix-wrapper:focus,
  .ant-input-affix-wrapper:hover,
  .ant-input-affix-wrapper:active,
  .ant-input-affix-wrapper:not(.ant-input-affix-wrapper-disabled):hover,
  .ant-input-affix-wrapper-focused {
    border-color: ${variables.LIGHT_BLUE};
    border-radius: 5px;
  }

  .ant-checkbox-wrapper:hover .ant-checkbox-inner,
  .ant-checkbox:hover .ant-checkbox-inner,
  .ant-checkbox-input:focus + .ant-checkbox-inner {
    top: 3px;
    border-color: ${variables.LIGHT_BLUE};
    border-radius: 5px;
  }

  .ant-checkbox-checked::after {
    top: 3px;
    border: 2px solid ${variables.LIGHT_BLUE};
    border-radius: 5px;
  }
`;

export { CrimeSceneFormCardWrapper };
