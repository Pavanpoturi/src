import { isArray, first, isUndefined, isNull, isEmpty } from "lodash";
import {
  DATE_FORMAT,
  showPSName,
  getPersonPersonalAddress,
} from "@containers/FirDetails/fir-util";
import moment from "moment";
import { config } from "@config/site.config";
import { useSelector } from "react-redux";
import NoImage from "@assets/images/noImage.jpg";

export default function AccusedDetailsCard({ tableData, reportType }) {
  const firDetail = tableData;
  const { cisActList } = useSelector((state) => state.MasterData);
  const { personalDetails } =
    !isUndefined(tableData?.person) && tableData?.person;
  const { gender, name, surname, fatherHusbandGuardianName, age } =
    !isUndefined(personalDetails) && personalDetails;
  const physicalFeatures = tableData?.victim?.physicalFeatures;
  const occurrenceOfOffence = firDetail?.occurenceOfOffence;
  const fromDate = occurrenceOfOffence?.fromDate;
  const toDate = occurrenceOfOffence?.toDate;
  const priorToDate = occurrenceOfOffence?.priorToDate;
  const isUnknownDeadBody = reportType === "Unknown Dead Body";
  const isMissingPerson = reportType === "Missing";
  const selectedNoticeFor = isUndefined(reportType) ? "" : reportType; //TODO: need to remove this later
  let occurrenceOfOffenceDay = "";
  if (fromDate && toDate) {
    occurrenceOfOffenceDay = moment(toDate).format(DATE_FORMAT);
  } else if (!toDate && fromDate) {
    occurrenceOfOffenceDay = moment(fromDate).format(DATE_FORMAT);
  } else if (toDate && !fromDate) {
    occurrenceOfOffenceDay = moment(toDate).format(DATE_FORMAT);
  } else if (!isUndefined(priorToDate) && !isNull(priorToDate)) {
    occurrenceOfOffenceDay = moment(priorToDate).format(DATE_FORMAT);
  } else {
    occurrenceOfOffenceDay = "";
  }
  const factsOfComplainant = firDetail?.briefFacts?.factsOfComplainant;
  const personDetails = firDetail?.placeOfOccurence;
  const address = getPersonPersonalAddress(personDetails);
  const complainantPersonDetails = firDetail?.complainatDetails?.presentAddress;
  const Address = getPersonPersonalAddress(complainantPersonDetails);
  const complainantContactDetails =
    firDetail?.complainatDetails?.contactDetails[0]?.phoneNumber;
  const firNum = firDetail?.fiNum;
  const PsName = firDetail?.psName;
  const psName = PsName !== "" && showPSName(PsName);
  const district = firDetail?.district;
  const otherCrimeClassification = tableData?.crimeClassification?.other;
  const Media = isArray(firDetail?.person?.media)
    ? firDetail?.person?.media
    : [];
  const Image =
    Media.length > 0 &&
    !isUndefined(first(Media).fileId) &&
    first(Media).fileId !== ""
      ? `${config?.resizedImageDownload}?fileId=${first(Media).fileId}`
      : NoImage;

  const tableStyle = {
    border: "1px solid #262626",
    borderCollapse: "collapse",
    textAlign: "left",
    width: "100%",
    fontSize: 17,
    fontFamily: "Arial",
  };

  const tableStyleBody = {
    width: "30vw",
    borderCollapse: "collapse",
    textAlign: "left",
    fontSize: 13,
    fontFamily: "Arial",
  };

  const tableStyleBodyRight = {
    width: "22vw",
    border: "1px solid #262626",
    borderCollapse: "collapse",
    textAlign: "left",
    paddingLeft: "5px",
    fontSize: 13,
    fontFamily: "Arial",
    verticalAlign: "top",
    fontWeight: "600",
  };

  const tableStyleLeft = {
    width: "38vw",
    border: "1px solid #262626",
    borderCollapse: "collapse",
    textAlign: "left",
    paddingLeft: "5px",
    fontSize: 13,
    fontFamily: "Arial",
    verticalAlign: "top",
  };

  const tableStyleLeftLast = {
    border: "1px solid #262626",
    borderCollapse: "collapse",
    textAlign: "left",
    fontSize: 13,
    fontFamily: "Arial",
  };

  let RWRequired = "";
  const resultTemp = firDetail?.actsAndSections.reduce(
    (acc, { actDescription, section, rwRequired, accShortName }) => {
      if (rwRequired) {
        RWRequired = "r/w ";
      } else {
        RWRequired = "";
      }

      var namesWithGreeting = (arr) => {
        return arr.map((name) => RWRequired + name);
      };
      const getActName = (actDescription) =>
        !isEmpty(cisActList) &&
        first(cisActList.filter((s) => s.ACT_LONG === actDescription))
          ?.ACT_SHORT;
      section = namesWithGreeting(section);

      acc[actDescription] = {
        actDescription: actDescription ? actDescription : "",
        accShortName: getActName(actDescription)
          ? getActName(actDescription)
          : "",
        section:
          typeof acc[actDescription] !== "undefined"
            ? acc[actDescription].section.concat(section)
            : section,
      };
      acc[actDescription].section = acc[actDescription].section.filter(
        (item, index) => acc[actDescription].section.indexOf(item) === index
      );
      return acc;
    },
    {}
  );

  let resp = Object.values(resultTemp);
  return (
    <div>
      <table style={tableStyle}>
        <tbody>
          <tr style={tableStyleBody}>
            <td style={tableStyleBodyRight}>Crime NO., U/S, PS, District </td>
            <td style={tableStyleLeft} colspan="3">
              {firNum + " for U/S "}
              {resp.map((t, index) => (
                <span key={index}>
                  {t.section + " " + t.accShortName + ", "}
                </span>
              ))}
              {" of the case of " + psName + " PS" + ", " + district}
            </td>
          </tr>
          {isUnknownDeadBody ? (
            <>
              <tr style={tableStyleBody}>
                <td style={tableStyleBodyRight}>
                  <div>Category</div>
                  <div>Gender</div>
                </td>

                <td style={tableStyleLeft}>
                  <div>{firDetail?.victim?.victimType}</div>
                  <div>{gender || "-"}</div>
                </td>
                <td
                  style={{
                    ...tableStyleLeftLast,
                    verticalAlign: "center",
                    textAlign: "center",
                  }}
                  rowspan={isUnknownDeadBody ? "19" : "22"}
                >
                  <div
                    style={{
                      display: "flex",
                      width: "265px",
                      height: "415px",
                      justifyContent: "center",
                      alignItems: "center",
                      border: "2px solid black",
                      margin: "10px 10px 10px 13px",
                      padding: "5px",
                    }}
                  >
                    <img
                      style={{ maxWidth: "250px", maxHeight: "400px" }}
                      src={Image}
                      onError={({ currentTarget }) => {
                        currentTarget.onerror = null; // prevents looping
                        currentTarget.src = NoImage;
                      }}
                    />
                  </div>
                </td>
              </tr>
              <tr style={tableStyleBody}>
                <td style={tableStyleBodyRight}>Found Date</td>
                <td style={tableStyleLeft}>{occurrenceOfOffenceDay}</td>
              </tr>
              <tr style={tableStyleBody}>
                <td style={tableStyleBodyRight}>Found Location</td>
                <td style={tableStyleLeft}>{address}</td>
              </tr>
            </>
          ) : null}
          <tr style={tableStyleBody}>
            {!isUnknownDeadBody && (
              <>
                <td style={tableStyleBodyRight}>Name of Missing person</td>
                <td style={tableStyleLeft}>
                  {name ? name : ""} {surname ? surname : ""}
                </td>
                <td
                  style={{
                    ...tableStyleLeftLast,
                    textAlign: "center",
                    verticalAlign: "center",
                  }}
                  rowspan={isUnknownDeadBody ? "19" : "22"}
                >
                  <div
                    style={{
                      display: "flex",
                      width: "265px",
                      height: "415px",
                      justifyContent: "center",
                      alignItems: "center",
                      border: "2px solid black",
                      margin: "10px 10px 10px 13px",
                      padding: "5px",
                    }}
                  >
                    <img
                      style={{ maxWidth: "250px", maxHeight: "400px" }}
                      src={Image}
                      onError={({ currentTarget }) => {
                        currentTarget.onerror = null; // prevents looping
                        currentTarget.src = NoImage;
                      }}
                    />
                  </div>
                </td>
              </>
            )}
          </tr>

          {!isUnknownDeadBody ? (
            <tr style={tableStyleBody}>
              <td style={tableStyleBodyRight}>Father / husband name</td>
              <td style={tableStyleLeft}>{fatherHusbandGuardianName}</td>
            </tr>
          ) : null}
          {!isUnknownDeadBody ? (
            <tr style={tableStyleBody}>
              <td style={tableStyleBodyRight}>Age</td>
              <td style={tableStyleLeft}>
                {otherCrimeClassification?.approximateAge
                  ? otherCrimeClassification?.approximateAge
                  : age}
              </td>
            </tr>
          ) : null}
          {isUnknownDeadBody ? (
            <>
              <tr style={tableStyleBody}>
                <td style={tableStyleBodyRight}>Approximate Age</td>
                <td style={tableStyleLeft}>
                  {otherCrimeClassification?.approximateAge
                    ? otherCrimeClassification?.approximateAge
                    : age}
                </td>
              </tr>
              <tr style={tableStyleBody}>
                <td style={tableStyleBodyRight}>Complexion</td>
                <td style={tableStyleLeft}>
                  {otherCrimeClassification?.complexion
                    ? otherCrimeClassification?.complexion
                    : physicalFeatures?.complexion}
                </td>
              </tr>
            </>
          ) : null}
          {!isUnknownDeadBody ? (
            <>
              <tr style={tableStyleBody}>
                <td style={tableStyleBodyRight}>Gender</td>
                <td style={tableStyleLeft}>{gender}</td>
              </tr>
              <tr style={tableStyleBody}>
                <td style={tableStyleBodyRight}>Missing Date</td>
                <td style={tableStyleLeft}>{occurrenceOfOffenceDay}</td>
              </tr>
              <tr style={tableStyleBody}>
                <td style={tableStyleBodyRight}>Missing from Location</td>
                <td style={tableStyleLeft}>{address}</td>
              </tr>
              <tr style={tableStyleBody}>
                <td style={tableStyleBodyRight}>Contact Phone</td>
                <td style={tableStyleLeft}>{complainantContactDetails}</td>
              </tr>
              <tr style={tableStyleBody}>
                <td style={tableStyleBodyRight}>Contact Address</td>
                <td style={tableStyleLeft}>{Address}</td>
              </tr>
              <tr style={tableStyleBody}>
                <td style={tableStyleBodyRight}>Complexion</td>
                <td style={tableStyleLeft}>
                  {otherCrimeClassification?.complexion
                    ? otherCrimeClassification?.complexion
                    : physicalFeatures?.complexion}
                </td>
              </tr>
            </>
          ) : null}
          {selectedNoticeFor === "Missing Person" ? (
            <>
              {!isUnknownDeadBody ? (
                <>
                  <tr style={tableStyleBody}>
                    <td style={tableStyleBodyRight}>Complexion</td>
                    <td style={tableStyleLeft}>
                      {otherCrimeClassification?.complexion
                        ? otherCrimeClassification?.complexion
                        : physicalFeatures?.complexion}
                    </td>
                  </tr>
                </>
              ) : null}
              <tr style={tableStyleBody}>
                <td style={tableStyleBodyRight}>Height</td>
                <td style={tableStyleLeft}>
                  {otherCrimeClassification?.height
                    ? otherCrimeClassification?.height
                    : physicalFeatures?.height}
                </td>
              </tr>
              <tr style={tableStyleBody}>
                <td style={tableStyleBodyRight}>Body Built type</td>
                <td style={tableStyleLeft}>
                  {otherCrimeClassification?.bodyBuiltType
                    ? otherCrimeClassification?.bodyBuiltType
                    : physicalFeatures?.bodyBuiltType}
                </td>
              </tr>
              {/* {isUnknownDeadBody ? ( */}
              <tr style={tableStyleBody}>
                <td style={tableStyleBodyRight}>Complexion</td>
                <td style={tableStyleLeft}>
                  {otherCrimeClassification?.complexion
                    ? otherCrimeClassification?.complexion
                    : physicalFeatures?.complexion}
                </td>
              </tr>
              {/* ) : null} */}
              <tr style={tableStyleBody}>
                <td style={tableStyleBodyRight}>Color of Hair </td>
                <td style={tableStyleLeft}>
                  {otherCrimeClassification?.hairColor
                    ? otherCrimeClassification?.hairColor
                    : physicalFeatures?.hair}
                </td>
              </tr>
              <tr style={tableStyleBody}>
                <td style={tableStyleBodyRight}>Color of Eyes </td>
                <td style={tableStyleLeft}>
                  {otherCrimeClassification?.eyeColor
                    ? otherCrimeClassification?.eyeColor
                    : physicalFeatures?.eyes}
                </td>
              </tr>
              {!isUnknownDeadBody ? (
                <tr style={tableStyleBody}>
                  <td style={tableStyleBodyRight}>
                    Whether physically, mentally, visually challenged?
                  </td>
                  <td style={tableStyleLeft}></td>
                </tr>
              ) : null}
              {!isMissingPerson ? (
                <tr style={tableStyleBody}>
                  <td style={tableStyleBodyRight}>Teeth</td>
                  <td style={tableStyleLeft}>
                    {otherCrimeClassification?.teeth
                      ? otherCrimeClassification?.teeth
                      : physicalFeatures?.teeth}
                  </td>
                </tr>
              ) : null}
              <tr style={tableStyleBody}>
                <td style={tableStyleBodyRight}>Moles</td>
                <td style={tableStyleLeft}>
                  {otherCrimeClassification?.moles
                    ? otherCrimeClassification?.moles
                    : physicalFeatures?.mole}
                </td>
              </tr>
              {isUnknownDeadBody ? (
                <tr style={tableStyleBody}>
                  <td style={tableStyleBodyRight}>Deformities</td>
                  <td style={tableStyleLeft}>
                    {otherCrimeClassification?.deformities
                      ? otherCrimeClassification?.deformities
                      : physicalFeatures?.deformities}
                  </td>
                </tr>
              ) : null}
              {!isMissingPerson ? (
                <tr style={tableStyleBody}>
                  <td style={tableStyleBodyRight}>
                    Visible Injuries on the person
                  </td>
                  <td style={tableStyleLeft}>
                    {otherCrimeClassification?.visibleInjuries
                      ? otherCrimeClassification?.visibleInjuries
                      : physicalFeatures?.visibleInjuries}
                  </td>
                </tr>
              ) : null}
              {!isMissingPerson ? (
                <tr style={tableStyleBody}>
                  <td style={tableStyleBodyRight}>Any valuables on the body</td>
                  <td style={tableStyleLeft}>
                    {otherCrimeClassification?.anyValuables
                      ? otherCrimeClassification?.anyValuables
                      : physicalFeatures?.anyValuables}
                  </td>
                </tr>
              ) : null}
              {!isMissingPerson && !isUnknownDeadBody ? (
                <tr style={tableStyleBody}>
                  <td style={tableStyleBodyRight}>Wallet/Id No.</td>
                  <td style={tableStyleLeft}>
                    {otherCrimeClassification?.walletOrIdFoundText
                      ? otherCrimeClassification?.walletOrIdFoundText
                      : physicalFeatures?.walletOrIdFoundText}
                  </td>
                </tr>
              ) : null}
              {!isUnknownDeadBody ? (
                <tr style={tableStyleBody}>
                  <td style={tableStyleBodyRight}>Languages known</td>
                  <td style={tableStyleLeft}>
                    {otherCrimeClassification?.languagesSpeak
                      ? `Can Speak : ${otherCrimeClassification?.languagesSpeak.join(
                          ","
                        )}`
                      : "-"}
                    <br></br>
                    {otherCrimeClassification?.languagesWrite
                      ? `Can Write : ${otherCrimeClassification?.languagesWrite.join(
                          ","
                        )}`
                      : "-"}
                  </td>
                </tr>
              ) : null}
              {isMissingPerson ? (
                <>
                  <tr style={tableStyleBody}>
                    <td style={tableStyleBodyRight}>Date of FIR</td>
                    <td style={tableStyleLeft}></td>
                  </tr>
                  <tr style={tableStyleBody}>
                    <td style={tableStyleBodyRight}>PS Phone</td>
                    <td style={tableStyleLeft} />
                  </tr>
                  <tr style={tableStyleBodyRight}>
                    <td
                      style={{
                        tableStyleLeftLast,
                        fontFamily: "Arial",
                        paddingLeft: "5px",
                        borderRight: "1px solid black",
                      }}
                      colspan="3"
                    >
                      <span>Brief Facts of the Case</span>
                      <br />
                      <span style={{ fontWeight: "400" }}>
                        {factsOfComplainant ? factsOfComplainant : ""}
                      </span>
                    </td>
                  </tr>
                  {/* <tr style={tableStyleLeft}>
                    <td style={tableStyleLeftLast} colspan="3">
                      {factsOfComplainant ? factsOfComplainant : ""}
                    </td>
                  </tr> */}
                </>
              ) : null}
              {isUnknownDeadBody ? (
                <>
                  <tr style={tableStyleBody}>
                    <td style={tableStyleBodyRight}>FIR Date</td>
                    <td style={tableStyleLeft}>
                      {occurrenceOfOffence?.firDate
                        ? moment(occurrenceOfOffence?.firDate).format(
                            DATE_FORMAT
                          )
                        : ""}
                    </td>
                  </tr>
                  <tr style={tableStyleBody}>
                    <td style={tableStyleBodyRight}>PS Phone</td>
                    <td style={tableStyleLeft} />
                  </tr>
                  <tr style={tableStyleBodyRight}>
                    <td
                      style={{
                        tableStyleLeftLast,
                        fontFamily: "Arial",
                        paddingLeft: "5px",
                        borderRight: "1px solid black",
                      }}
                      colspan="3"
                    >
                      <span>Brief Facts of the Case</span>
                      <br />
                      <span style={{ fontWeight: "400" }}>
                        {factsOfComplainant ? factsOfComplainant : ""}
                      </span>
                    </td>
                  </tr>
                  {/* <tr style={tableStyleLeft}>
                    <td style={tableStyleLeftLast} colspan="3">
                      {factsOfComplainant ? factsOfComplainant : ""}
                    </td>
                  </tr> */}
                </>
              ) : null}
            </>
          ) : (
            <>
              <tr style={tableStyleBody}>
                <td style={tableStyleBodyRight}>Beard</td>
                <td style={tableStyleLeft}>
                  {otherCrimeClassification?.beard
                    ? otherCrimeClassification?.beard
                    : physicalFeatures?.beard}
                </td>
              </tr>
              <tr style={tableStyleBody}>
                <td style={tableStyleBodyRight}>Build</td>
                <td style={tableStyleLeft}>
                  {otherCrimeClassification?.build
                    ? otherCrimeClassification?.build
                    : physicalFeatures?.build}
                </td>
              </tr>
              <tr style={tableStyleBody}>
                <td style={tableStyleBodyRight}>Color</td>
                <td style={tableStyleLeft}>{physicalFeatures?.color}</td>
              </tr>
              <tr style={tableStyleBody}>
                <td style={tableStyleBodyRight}>Eyes</td>
                <td style={tableStyleLeft}>
                  {otherCrimeClassification?.eyeColor
                    ? otherCrimeClassification?.eyeColor
                    : physicalFeatures?.eyes}
                </td>
              </tr>
              <tr style={tableStyleBody}>
                <td style={tableStyleBodyRight}>Face</td>
                <td style={tableStyleLeft}>{physicalFeatures?.face}</td>
              </tr>
              <tr style={tableStyleBody}>
                <td style={tableStyleBodyRight}>Hair</td>
                <td style={tableStyleLeft}>
                  {otherCrimeClassification?.hairColor
                    ? otherCrimeClassification?.hairColor
                    : physicalFeatures?.hair}
                </td>
              </tr>
              <tr style={tableStyleBody}>
                <td style={tableStyleBodyRight}>Height</td>
                <td style={tableStyleLeft}>
                  {otherCrimeClassification?.height
                    ? otherCrimeClassification?.height
                    : physicalFeatures?.height}
                </td>
              </tr>
              <tr style={tableStyleBody}>
                <td style={tableStyleBodyRight}>Teeth</td>
                <td style={tableStyleLeft}>
                  {otherCrimeClassification?.teeth
                    ? otherCrimeClassification?.teeth
                    : physicalFeatures?.teeth}
                </td>
              </tr>
              <tr style={tableStyleBody}>
                <td style={tableStyleBodyRight}>Mole</td>
                <td style={tableStyleLeft}>
                  {otherCrimeClassification?.moles
                    ? otherCrimeClassification?.moles
                    : physicalFeatures?.mole}
                </td>
              </tr>
              <tr style={tableStyleBody}>
                <td style={tableStyleBodyRight}>Mustache</td>
                <td style={tableStyleLeft}>
                  {otherCrimeClassification?.mustache
                    ? otherCrimeClassification?.mustache
                    : physicalFeatures?.mustache}
                </td>
              </tr>
              <tr style={tableStyleBody}>
                <td style={tableStyleBodyRight}>Nose</td>
                <td style={tableStyleLeft}>
                  {otherCrimeClassification?.nose
                    ? otherCrimeClassification?.nose
                    : physicalFeatures?.nose}
                </td>
              </tr>
              <tr style={tableStyleBody}>
                <td style={tableStyleBodyRight}>FIR Date</td>
                <td style={tableStyleLeft}>
                  {occurrenceOfOffence?.firDate
                    ? moment(occurrenceOfOffence?.firDate).format(DATE_FORMAT)
                    : ""}
                </td>
              </tr>
              <tr style={tableStyleBody}>
                <td style={tableStyleBodyRight}>PS Phone</td>
                <td style={tableStyleLeft} />
              </tr>
              <tr style={tableStyleBodyRight}>
                <td
                  style={{
                    tableStyleLeftLast,
                    fontFamily: "Arial",
                    paddingLeft: "5px",
                    borderRight: "1px solid black",
                  }}
                  colspan="3"
                >
                  <span>Brief Facts of the Case</span>
                  <br />
                  <span style={{ fontWeight: "400" }}>
                    {factsOfComplainant ? factsOfComplainant : ""}
                  </span>
                </td>
              </tr>
            </>
          )}
        </tbody>
      </table>
    </div>
  );
}
