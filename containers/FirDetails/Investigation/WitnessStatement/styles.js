import styled from "styled-components";
import { palette } from "styled-theme";
import { variables } from "@assets/styles/variables";

const SelectedRecordsWidgetWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: ${variables.WHITE_COLOR};
  overflow: hidden;
  border-left: 1px solid ${palette("border", 2)};

  .editMode {
    background-color: ${variables.LIGHT_GRAY_COLOR} !important ;
  }
`;

export { SelectedRecordsWidgetWrapper };
