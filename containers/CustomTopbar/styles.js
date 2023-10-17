import styled from "styled-components";
import WithDirection from "@lib/helpers/rtl";
import { variables } from "@assets/styles/variables";

const CustomTopBarWrapper = styled.div`
  .topbar {
    display: flex;
    justify-content: space-between;
    box-shadow: 0 3px 5px -3px #000;
    z-index: 1000;
    background-color: ${variables.WHITE_COLOR};
    padding: 10px;
    box-shadow: rgb(215 0 0 / 40%) 0px 27px 19px -28px;

    .escopLogo {
      margin-left: 10px;
    }

    .headerContainer {
      line-height: 20px;
      margin: auto;
      width: 50%;
      padding-left: 10px;
    }

    .headerTitle {
      font-size: 15px;
      color: ${variables.FORM_LABEL_COLOR};
    }

    .headerValue {
      font-size: 17px;
      color: ${variables.BLACK};
      max-height: 60px;
      overflow-y: auto;
      font-weight: 500;
    }

    .headerContent {
      width: 100%;
      display: flex;
      justify-content: space-around;
      margin-top: 10px;
      flexdirection: "row";
    }
  }
`;

export default WithDirection(CustomTopBarWrapper);
