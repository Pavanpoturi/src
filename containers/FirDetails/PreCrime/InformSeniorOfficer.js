import CrimeSceneFormCard from "./CrimeSceneFormCard/CrimeSceneFormCard";

export default function InformSeniorOfficer({
  handleSubmit,
  handleRemove,
  seniorOfficer,
  setSeniorOfficer,
  disableEdit,
}) {
  const seniorOfficersSelected = (value, checked) => {
    let seniorOfficerList = [...seniorOfficer];
    seniorOfficerList.filter((x) => x.assignedIoCd === value.assignedIoCd)[0].checked =
      checked;
    setSeniorOfficer(seniorOfficerList);
    checked ? handleSubmit(value, "officer") : handleRemove(value, "officer");
  };

  return (
    <div className="widgetPageStyle">
      <CrimeSceneFormCard
        checkBoxData={seniorOfficer}
        isSearchRequired={false}
        checkBoxSelected={seniorOfficersSelected}
        minHeight={410}
        disableEdit={disableEdit}
        title="SeniorOfficer"
      />
    </div>
  );
}
