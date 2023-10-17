import { useEffect } from "react";
import { Row, Col } from "antd";
import { isUndefined } from "lodash";
import { useSelector } from "react-redux";
import Loader from "@components/utility/loader";
import { getMiniInvestigationData } from "../const";
import { loadState } from "@lib/helpers/localStorage";
import Box from "../../../components/utility/box";

const styles = {
  widgetPageStyle: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    overflow: "hidden",
  },

  widgetColumnStyle: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    overflow: "hidden",
    marginLeft: 20,
  },
};

export default function MiniInvestgation() {
  const { isFetching } = useSelector((state) => state.FIR);
  const selectedFir = loadState("selectedFir");
  const complainantList = loadState("complainantList");
  const placeOfOccurence = selectedFir?.placeOfOccurence;
  const { savedFir } = useSelector((state) => state.createFIR);
  const cityDistricts =
    savedFir?.firType === "Regular"
      ? savedFir?.firDetail?.district
      : placeOfOccurence?.cityDistrict;
  const stateName =
    savedFir?.firType === "Regular" ? "Telangana" : placeOfOccurence?.state;

  const getPlaceOfOccurrence = (value) => {
    let result = "";
    const DistanceNDirectionsFromPS = value?.distanceFromPS
      ? "Distance & Directions From PS: " +
        value?.distanceFromPS +
        ", " +
        value?.directionsFromPS +
        ", "
      : "";
    const BeatNo = value?.beatNo ? "beat.no " + value?.beatNo + ", " : "";
    const AddressPlace =
      (!isUndefined(value?.houseNo) ? "H.no: " + value?.houseNo + ", " : "") +
      (!isUndefined(value?.wardColony)
        ? "ward/colony " + value?.wardColony + ", "
        : " ") +
      (!isUndefined(value?.landmarkMilestone)
        ? "landmark " + value?.landmarkMilestone + ", "
        : "");
    const AreaNMandal = value?.areaMandal
      ? "Area/Mandal " + value?.areaMandal + ", "
      : "";
    const StreetNVillage = !isUndefined(value?.streetRoadNo)
      ? value?.streetRoadNo + ", "
      : "";
    const CityDistrict = cityDistricts + ", ";
    const State = stateName + " ";
    const PIN = !isUndefined(value?.pinCode) ? value?.pinCode : "";
    result =
      DistanceNDirectionsFromPS +
      BeatNo +
      AddressPlace +
      AreaNMandal +
      StreetNVillage +
      CityDistrict +
      State +
      PIN;
    return result.toLowerCase();
  };

  const getPersonalDetails = (value) => {
    let result = "";
    const surname = value?.surname ? value?.surname + " " : "";
    const name = value ? value?.name + "," : "";
    const age = value?.age ? value?.age + "years, " : "";
    const landmarkMilestone = value?.landmarkMilestone
      ? value?.landmarkMilestone + ","
      : "";
    const caste = value?.caste ? "caste " + value?.caste + "," : "";
    const subCaste = value?.subCaste
      ? "sub caste " + value?.subCaste + ","
      : "";
    const occupation = value?.occupation
      ? "occ " + value?.occupation + ", "
      : "";
    const fatherHusbandGuardianName = value?.fatherHusbandGuardianName
      ? "Father/ Husband/ GuardianName " + value?.fatherHusbandGuardianName
      : "";

    result = `${surname} ${name} ${age} ${landmarkMilestone} ${caste} ${subCaste} ${occupation} ${fatherHusbandGuardianName}`;
    return result.toLowerCase();
  };

  const getAddressDetail = (value) => {
    let result = "";
    const houseNo = value?.houseNo ? "H.no " + value?.houseNo + ", " : "";
    const streetRoadNo = !isUndefined(value?.streetRoadNo)
      ? "street.no " + value?.streetRoadNo + ","
      : "";
    const wardColony = value?.wardColony
      ? "ward.no " + value?.wardColony + "years, "
      : "";
    const landmarkMilestone = value?.landmarkMilestone
      ? "landmark " + value?.landmarkMilestone + ","
      : "";
    const localityVillage = value?.localityVillage
      ? "locality/ Village " + value?.localityVillage + ","
      : "";
    const areaMandal = value?.areaMandal
      ? "area/ Mandal " + value?.areaMandal + ","
      : "";
    const pinCode = value?.pinCode ? "pin code " + value?.pinCode + ", " : "";
    const district = value?.district ? "district " + value?.district : "";

    result =
      houseNo +
      streetRoadNo +
      wardColony +
      landmarkMilestone +
      localityVillage +
      areaMandal +
      pinCode +
      district;
    return result.toLowerCase();
  };

  const dashboardStatsTransform =
    getMiniInvestigationData &&
    getMiniInvestigationData.map((data) => {
      let value = "";
      let key = "";
      // eslint-disable-next-line default-case
      switch (data?.title) {
        case "Place of Occurence":
          key = "Place of Occurence";
          value =
            selectedFir?.placeOfOccurence?.length !== 0
              ? getPlaceOfOccurrence(placeOfOccurence)
              : "NA";
          break;
        case "Name of the Complainant":
          key = "Name of the Complainant";
          value =
            complainantList && complainantList[0]?.person !== 0
              ? getPersonalDetails(
                  complainantList[0]?.person?.personalDetails
                ) +
                " " +
                getAddressDetail(complainantList[0]?.person?.presentAddress)
              : "NA";
          break;
        case "Victim Details":
          key = "Victim Details";
          value =
            Array.isArray(selectedFir?.victimList) &&
            selectedFir?.victimList?.length !== 0
              ? selectedFir?.victimList.map((a, i) =>
                  (
                    i +
                    1 +
                    "  " +
                    a +
                    " " +
                    "crime type " +
                    selectedFir?.crimeType
                  ).toLowerCase()
                )
              : "NA";
          break;
        case "Accused Details":
          key = "Accused Details";
          value =
                Array.isArray(selectedFir?.accusedList) &&
                selectedFir?.accusedList?.length !== 0
                ? selectedFir?.accusedList
                .map((accused, i) => {
                const values = accused.split(' ').filter(item => item !== "undefined");
                const formattedValues = values.length !== 0 ? values.join(' ') : '';
                return `${i + 1} ${formattedValues}`;
              })
              .join(",")
            : "NA";

          if (value === "1 ") {
            value = "NA";
            }

          break;
        case "Witness Details":
          key = "Witness Details";
          value =
            Array.isArray(selectedFir?.witness) &&
            selectedFir?.witness?.length !== 0
              ? selectedFir?.witness
                  .map((a, i) => " " + (i + 1) + "  " + a)
                  .join(",")
              : "NA";
          break;
      }
      return {
        key: key,
        value: value,
      };
    });
  return (
    <>
      {isFetching ? <Loader /> : <></>}
      <div style={styles.widgetPageStyle}>
        <h2 className="pageTitle" style={{ color: "#454647" }}>
          Mini Investigation Report
        </h2>
      </div>
      <div>
        {dashboardStatsTransform.map((data) => (
          <Row
            style={{
              display: "flex",
              margin: "1% 5% 1% 5%",
              justifyContent: "space-between",
            }}
          >
            <Col>{data?.key}</Col>

            <Col
              style={{
                width: "100%",
              }}
            >
              <Box>{data?.value}</Box>
            </Col>
          </Row>
        ))}
      </div>
    </>
  );
}
