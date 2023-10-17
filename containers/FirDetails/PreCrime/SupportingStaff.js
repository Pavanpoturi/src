import { cloneDeep } from "lodash";
import NameContactForm from "@components/Common/standardNameContactForm";
import CrimeSceneFormCard from "./CrimeSceneFormCard/CrimeSceneFormCard";
import { FormWidgetWrapper } from "./FormWidgetWrapper.styles";

export default function SupportingStaff({
  handleSubmit,
  handleRemove,
  supportingStaff,
  setSupportingStaff,
  noninternalSupportStaffData,
  disableEdit,
}) {
  const supportStaffSelected = (value, checked) => {
    let supportStaff = cloneDeep(supportingStaff);
    supportStaff.filter((x) => x.paoCode === value.paoCode)[0].checked =
      checked;
    setSupportingStaff(supportStaff);
    checked ? handleSubmit(value, "staff") : handleRemove(value, "staff");
  };

  return (
    <div className="widgetPageStyle">
      <CrimeSceneFormCard
        checkBoxData={supportingStaff}
        isSearchRequired={true}
        checkBoxSelected={supportStaffSelected}
        minHeight={410}
        hideButton={true}
        disableEdit={disableEdit}
        title="Supportstaff"
      />
      <FormWidgetWrapper
        style={{ minHeight: 410, maxHeight: 410, overflowY: "auto" }}
      >
        <NameContactForm
          buttonTitle="Add External Supporting Staff"
          showLink={true}
          listTitle="External Supporting Staff"
          onSubmit={(values) => handleSubmit(values, "staff")}
          onRemove={(values) => handleRemove(values, "staff")}
          existingData={noninternalSupportStaffData}
          disableEdit={disableEdit}
        />
      </FormWidgetWrapper>
    </div>
  );
}
