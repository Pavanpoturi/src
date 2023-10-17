import NameContactForm from "@components/Common/standardNameContactForm";
import { FormWidgetWrapper } from "./FormWidgetWrapper.styles";
import CrimeSceneFormCard from "./CrimeSceneFormCard/CrimeSceneFormCard";

export default function ExpertTeam({
  handleSubmit,
  handleRemove,
  expertTeam,
  setExpertTeam,
  noninternalExpertTeamData,
  disableEdit,
}) {
  const expertteamSelected = (value, checked) => {
    let expertTeamList = [...expertTeam];
    expertTeamList.filter((x) => x.label === value.label)[0].checked = checked;
    setExpertTeam(expertTeamList);
    checked ? handleSubmit(value, "expert") : handleRemove(value, "expert");
  };

  return (
    <div className="widgetPageStyle">
      <CrimeSceneFormCard
        checkBoxData={expertTeam}
        isSearchRequired={false}
        checkBoxSelected={expertteamSelected}
        minHeight={410}
        disableEdit={disableEdit}
        title="ExpertTeam"
      />
      <FormWidgetWrapper
        style={{ minHeight: 410, maxHeight: 410, overflowY: "auto" }}
      >
        <NameContactForm
          buttonTitle="Add External Services"
          listTitle="Expert Team"
          showLink={true}
          onSubmit={(values) => handleSubmit(values, "expert")}
          onRemove={(values) => handleRemove(values, "expert")}
          existingData={noninternalExpertTeamData}
          checkBoxData={expertTeam}
          disableEdit={disableEdit}
        />
      </FormWidgetWrapper>
    </div>
  );
}
