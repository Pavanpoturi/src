import ReportedCases from "./ReportsForm/ReportedCases";
import CaseStatus from "./ReportsForm/CaseStatus";
import MissingCases from "./ReportsForm/MissingCases";
import WantedPersons from "./ReportsForm/WantedPersons";

export default function ReportsContainer({
  selectedSiderMenu,
  setSelectedSiderMenu,
}) {
  const displayContent = () => {
    // eslint-disable-next-line default-case
    switch (selectedSiderMenu) {
      case "reportedCases":
        return <ReportedCases setSelectedSiderMenu={setSelectedSiderMenu} />;
      case "caseStatusDetails":
        return <CaseStatus setSelectedSiderMenu={setSelectedSiderMenu} />;
      case "missingUnknwon":
        return <MissingCases setSelectedSiderMenu={setSelectedSiderMenu} />;
      case "arrestWantedPerson":
        return <WantedPersons setSelectedSiderMenu={setSelectedSiderMenu} />;
    }
  };
  return displayContent();
}
