import { Select } from 'antd';
import { AntSelect } from './styles/select.style';
import WithDirection from '@lib/helpers/rtl';
const WDSelect = AntSelect(Select);
const select = WithDirection(WDSelect);
const SelectOption = Select.Option;

export default select;
export { SelectOption };
