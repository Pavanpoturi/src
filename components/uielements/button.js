import { Button } from 'antd';
import { Buttons, ButtonsGroup } from './styles/button.style';
import WithDirection from '@lib/helpers/rtl';
const AntButton = Buttons(Button);
const button = WithDirection(AntButton);
const AntButtonGroup = ButtonsGroup(Button.Group);
const ButtonGroup = WithDirection(AntButtonGroup);

export default button;
export { ButtonGroup };
