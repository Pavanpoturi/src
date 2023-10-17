import ChargesheetReport from "./chargeSheetReport/index";

export default function ReportsContainer({
  selectedSiderMenu,
  setSelectedSiderMenu,
}) {
  const displayContent = () => {
    // eslint-disable-next-line default-case
    switch (selectedSiderMenu) {
      case "chargeSheetReport":
        return (
          <ChargesheetReport setSelectedSiderMenu={setSelectedSiderMenu} />
        );
    }
  };
  return displayContent();
}
