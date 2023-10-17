import { Progress } from 'antd';
import AntProgress from './styles/progress.style';
import WithDirection from '@lib/helpers/rtl';
const WDProgress = AntProgress(Progress);
const progress = WithDirection(WDProgress);

export default progress;
