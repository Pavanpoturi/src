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
          onClick={() => setSelectedSiderMenu("suspectAccused")}
        >
          Accused Details
        </div>
        <div
          className="popupLink"
          onClick={() => setSelectedSiderMenu("interrogationReport")}
        >
          Interrogation Report
        </div>
        <div
          className="popupLink"
          onClick={() => setSelectedSiderMenu("confessionalStatements")}
        >
          Confession cum Seizure Panchnama
        </div>
        <div
          className="popupLink"
          onClick={() => setSelectedSiderMenu("MOSeizures")}
        >
          MO Seizure
        </div>
        <div
          className="popupLink"
          onClick={() => setSelectedSiderMenu("policeCustody")}
        >
          Police Custody
        </div>
        <div
          className="popupLink"
          onClick={() => setSelectedSiderMenu("crPcNotice41A")}
        >
          41A Cr.P.C Notice
        </div>
      </Panel>
    </Collapse>
  );
}
