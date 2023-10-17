import { Steps } from "antd";
import { isUndefined, isNull } from "lodash";
import { CheckCircleFilled, InfoCircleFilled } from "@ant-design/icons";

const { Step } = Steps;

export default function StepsIndicator(props) {
  const dates = !isUndefined(props?.data) ? props?.data : [];
  const roles = Object.keys(dates);

  const status = !isUndefined(props?.status) ? props?.status : "";
  const withRole = !isUndefined(props?.with) ? props?.with : "";
  let flag = false;
  const steps = roles.map((role) => {
    const step = {
      title: role,
      description: !isNull(dates[role]) ? dates[role] : "",
    };

    //encountered with
    if (!flag && withRole === role) {
      flag = true;
    }
    //Icon
    if (status.includes("Returned")) {
      //gray
      if (flag && isNull(dates[role]) && withRole !== role) {
        step["icon"] = <InfoCircleFilled />;
      }
      //red
      if (flag && !isNull(dates[role])) {
        step["icon"] = <InfoCircleFilled style={{ color: "#FF0000" }} />;
      }
      //yellow
      if (withRole === role) {
        step["icon"] = <InfoCircleFilled style={{ color: "#ffc44e" }} />;
      }
      //green
      if (!flag && !isNull(dates[role])) {
        step["icon"] = <CheckCircleFilled style={{ color: "#31BC0E" }} />;
      }
    } else if (status.includes("Pending with")) {
      //gray
      if (flag && isNull(dates[role]) && withRole !== role) {
        step["icon"] = <InfoCircleFilled />;
      }
      //yellow
      if (withRole === role) {
        step["icon"] = <InfoCircleFilled style={{ color: "#ffc44e" }} />;
      }
      //green
      if (!flag && !isNull(dates[role])) {
        step["icon"] = <CheckCircleFilled style={{ color: "#31BC0E" }} />;
      }
    } else if (status.includes("Transfer")) {
      step["icon"] = <CheckCircleFilled style={{ color: "#31BC0E" }} />;
    } //Trouble condition
    else {
      step["icon"] = <CheckCircleFilled style={{ color: "#31BC0E" }} />;
    }
    return step;
  });

  return (
    <Steps size="small" labelPlacement="vertical">
      {steps &&
        steps.map((item, index) => (
          <Step
            key={index}
            title={item.title}
            description={item?.description}
            icon={item?.icon}
          />
        ))}
    </Steps>
  );
}
