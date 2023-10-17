import { Collapse } from "antd";
import { DoubleRightOutlined } from "@ant-design/icons";

const { Panel } = Collapse;

export default function OtherLinks({ setSelectedSiderMenu }) {
  return (
    <Collapse
      accordion
      style={{ marginTop: 20 }}
      defaultActiveKey={["1"]}
      expandIconPosition={"right"}
      expandIcon={({ isActive }) => (
        <DoubleRightOutlined rotate={isActive ? 90 : 0} />
      )}
    >
      <Panel
        className="panelHeader"
        header={
          <div className="headerTextContainer">
            {" "}
            <div className="panelTitle">Other Links </div>{" "}
          </div>
        }
        key="1"
      >
        <div
          className="popupLink"
          onClick={() => setSelectedSiderMenu("PPOpinion")}
        >
          PP Opinion
        </div>
        <div className="popupLink">Draft Final Result</div>
      </Panel>
    </Collapse>
  );
}
