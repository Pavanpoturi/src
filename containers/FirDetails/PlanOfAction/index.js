import { Card, Checkbox } from "antd";
import { CaretDownOutlined } from "@ant-design/icons";
import ContentHeader from "../ContentHeader";

const physicalEvidenceOptions = [
  "Blood",
  "Blood stained earth",
  "Seizure Report Template",
  "Letter of Advice",
  "Notice to witness U/s 160 Cr.P.C",
  "Request to Record the statement of witnesses U/s 160 Cr.P.C",
  "Request to Court for Search Proceeding U/s 165 Cr.P.C",
];

const victimInjuredOptions = [
  {
    name: "Requisition to Medical Officer for examination of Injured person",
  },
  {
    name: "Requisition to Magistrate for recording Dying Declaration",
  },
];

const assaultedOptions = [
  {
    name: "Requisition to Lady Medical Officer (For examination of rape victim)",
  },
];

export default function PlanOfAction() {
  const renderPhysicalEvidence = () => {
    return physicalEvidenceOptions.map((evidence, i) => {
      return (
        <div key={i} className="contentCheckboxContainer">
          <Checkbox>{evidence}</Checkbox>
        </div>
      );
    });
  };

  const rendervictimInjured = () => {
    return victimInjuredOptions.map((opt, i) => {
      return (
        <div key={i} className="contentCheckboxContainer">
          <Checkbox>{opt.name}</Checkbox>
        </div>
      );
    });
  };

  const renderAssaulted = () => {
    return assaultedOptions.map((opt, i) => {
      return (
        <div key={i} className="contentCheckboxContainer">
          <Checkbox>{opt.name}</Checkbox>
        </div>
      );
    });
  };

  return (
    <>
      <ContentHeader headerTitle="Plan of Action" />
      <Card>
        <div className="planOfActionsContainer">
          <div className="planOfActionsTitle">
            <CaretDownOutlined className="planOfActionDownArrow" />
            PHYSICAL EVIDENCE TO BE COLLECTED
            {renderPhysicalEvidence()}
          </div>
          <div className="planOfActionsTitle">
            <CaretDownOutlined className="planOfActionDownArrow" />
            IS VICTIM/ACCUSED INJURED?
            {rendervictimInjured()}
          </div>
          <div className="planOfActionsTitle">
            <CaretDownOutlined className="planOfActionDownArrow" />
            IS VICTIM/ACCUSED SEXUALLY ASSAULTED?
            {renderAssaulted()}
          </div>
        </div>
      </Card>
    </>
  );
}
