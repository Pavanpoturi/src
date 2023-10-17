import styled from 'styled-components';
import { palette } from 'styled-theme';
import { variables } from "@assets/styles/variables";

const LayoutContentStyle = styled.div`
  width: 100%;
  padding: 35px;
  background-color: ${variables.WHITE_COLOR};
  border: 1px solid ${palette('border', 0)};
  height: 100%;
`;

export default LayoutContentStyle;
