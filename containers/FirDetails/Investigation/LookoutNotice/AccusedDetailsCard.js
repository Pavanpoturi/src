import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Col, Upload } from "antd";
import { isEmpty } from "lodash";
import { first, isUndefined, isNull } from "lodash";
import { displayFileBasedOnFileId } from "@containers/media-util";
import {
  dummyRequest,
  DATE_FORMAT,
  showPSName,
  getPersonPersonalAddress,
} from "@containers/FirDetails/fir-util";
import moment from "moment";

export default function AccusedDetailsCard({
  physicalFeatures,
  clickedMedia,
  selectedNoticeFor,
  selectedAccusedPerson,
}) {
  const { personalDetails } =
    !isUndefined(selectedAccusedPerson?.person) &&
    selectedAccusedPerson?.person;
  const { gender, name, surname, fatherHusbandGuardianName, age } =
    !isUndefined(personalDetails) && personalDetails;
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [imagesUploadedListState, setimagesUploadedListState] = useState([]);
  const { crimeclassification } = useSelector((state) => state.FIR);
  const { savedFir } = useSelector((state) => state.createFIR);
  const placeOfOccurence = savedFir?.firDetail?.placeOfOccurence;
  const occurrenceOfOffence = savedFir?.firDetail?.occurenceOfOffence;
  const fromDate = occurrenceOfOffence?.fromDate;
  const toDate = occurrenceOfOffence?.toDate;
  const priorToDate = occurrenceOfOffence?.priorToDate;
  const isUnknownDeadBody = selectedNoticeFor === "Unknown Deadbody";
  const isNotUnknwonDeadBody = selectedNoticeFor !== "Unknown Deadbody";
  const isNotMissingPerson = selectedNoticeFor !== "Missing Person";
  const otherCrimeClassification = crimeclassification?.other;
  const bodilyCrimeClassification = crimeclassification?.deadBody;
  const factsOfComplainant =
    savedFir?.firDetail?.briefFacts?.factsOfComplainant;
  let occurrenceOfOffenceDay = "";
  if (fromDate && toDate) {
    occurrenceOfOffenceDay = moment(toDate).format("DD-MM-YYYY");
  } else if (!toDate && fromDate) {
    occurrenceOfOffenceDay = moment(fromDate).format("DD-MM-YYYY");
  } else if (toDate && !fromDate) {
    occurrenceOfOffenceDay = moment(toDate).format("DD-MM-YYYY");
  } else if (!isUndefined(priorToDate) && !isNull(priorToDate)) {
    occurrenceOfOffenceDay = moment(priorToDate).format("DD-MM-YYYY");
  } else {
    occurrenceOfOffenceDay = "";
  }
  const complainantDetails =
    !isEmpty(savedFir?.complainantDetails) &&
    first(savedFir?.complainantDetails)?.person;
  const complainantPersonDetails = complainantDetails?.presentAddress;
  const Address = getPersonPersonalAddress(complainantPersonDetails);
  const complainantContactDetails = complainantDetails?.contactDetails;
  const personDetails = savedFir?.firDetail?.placeOfOccurence;
  const address = getPersonPersonalAddress(personDetails);
  const firDetail = savedFir?.firDetail;
  const firNum = firDetail?.firNum;
  const PsName = firDetail?.psName;
  const psName = PsName !== "" && showPSName(PsName);
  const district = firDetail?.district;
  const stateName =
    savedFir?.firType === "Regular" ? "Telangana" : placeOfOccurence?.state;
  const { actList } = useSelector((state) => state.MasterData);

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
        !isEmpty(actList) &&
        first(actList.filter((s) => s.ACT_LONG === actDescription))?.ACT_SHORT;
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

  const [displayPhotos, setDisplayPhotos] = useState({
    previewVisible: false,
    previewImage: "",
    previewTitle: "",
    fileList: [clickedMedia?.[0]],
  });

  useEffect(() => {
    setDisplayPhotos({
      previewVisible: false,
      previewImage: "",
      previewTitle: "",
      fileList: [clickedMedia?.[0]],
    });
    displayFileBasedOnFileId([clickedMedia?.[0]], setUploadedFiles);
  }, []);

  useEffect(() => {
    setDisplayPhotos({
      previewVisible: false,
      previewImage: "",
      previewTitle: "",
      fileList: [clickedMedia?.[0]],
    });
  }, [clickedMedia]);

  useEffect(() => {
    displayFileBasedOnFileId(displayPhotos?.fileList, setUploadedFiles);
  }, [displayPhotos]);

  useEffect(() => {
    const imagesUploadedList =
      uploadedFiles &&
      !isEmpty(uploadedFiles) &&
      uploadedFiles.filter((file) => file.mimeType !== "application/pdf");
    if (imagesUploadedList && imagesUploadedList.length > 0) {
      let n1 = imagesUploadedList[imagesUploadedList.length - 1];
      if (n1?.name !== imagesUploadedListState[0]?.name) {
        setimagesUploadedListState([n1]);
      }
    } else {
      setimagesUploadedListState([]);
    }
  }, [uploadedFiles]);

  const tableStyle = {
    border: "1px solid #262626",
    borderCollapse: "collapse",
    textAlign: "left",
    width: "100%",
    padding: "5px",
    fontSize: 17,
    fontFamily: "Arial",
    marginTop: 15,
  };

  const tableStyleBody = {
    width: "30vw",
    borderCollapse: "collapse",
    textAlign: "left",
    padding: "5px",
    fontSize: 13,
    fontFamily: "Arial",
    verticalAlign: "top",
  };

  const tableStyleBodyRight = {
    width: "30vw",
    border: "1px solid #262626",
    borderCollapse: "collapse",
    textAlign: "left",
    padding: "5px",
    fontSize: 13,
    fontFamily: "Arial",
    verticalAlign: "top",
    fontWeight: "800",
  };

  const tableStyleLeft = {
    width: "30vw",
    border: "1px solid #262626",
    borderCollapse: "collapse",
    textAlign: "left",
    padding: "5px",
    fontSize: 13,
    fontFamily: "Arial",
    verticalAlign: "top",
  };

  const tableStyleLeftLast = {
    border: "1px solid #262626",
    borderCollapse: "collapse",
    textAlign: "left",
    padding: "5px",
    fontSize: 13,
    fontFamily: "Arial",
  };

  console.log("bodilyCrimeClassification", otherCrimeClassification);

  return (
    <table style={tableStyle}>
      <tbody>
        <tr style={tableStyleBody}>
          <td style={tableStyleBodyRight}>Crime NO., U/S, PS, Distrct </td>
          <td style={tableStyleLeft} colspan="3">
            {firNum + " for U/S "}
            {resp.map((t, index) => (
              <span key={index}>{t.section + " " + t.accShortName + ", "}</span>
            ))}{" "}
            {" of the case of " +
              psName +
              " PS" +
              ", " +
              district +
              ", " +
              stateName}
          </td>
        </tr>
        {isNotMissingPerson ? (
          <>
            <tr style={tableStyleBody}>
              <td style={tableStyleBodyRight}>
                <div>Category</div>
                <div>Gender</div>
              </td>
              <td style={tableStyleLeft}>
                <div>{selectedNoticeFor}</div>
                <div>{gender || "-"}</div>
              </td>
              {imagesUploadedListState && imagesUploadedListState.length > 0 ? (
                <td
                  style={{ ...tableStyleLeftLast, marginLeft: "10px" }}
                  rowspan="16"
                >
                  <Col span={24}>
                    <Upload
                      listType="picture-card"
                      customRequest={dummyRequest}
                      fileList={imagesUploadedListState}
                      disabled={false}
                      showUploadList={{
                        showRemoveIcon: false,
                        showPreviewIcon: false,
                      }}
                    >
                      {displayPhotos.length - 1 <= displayPhotos.length
                        ? null
                        : null}
                    </Upload>
                  </Col>
                </td>
              ) : (
                <td
                  style={{ ...tableStyleLeftLast, marginLeft: "10px" }}
                  rowspan="16"
                />
              )}
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
        {isNotUnknwonDeadBody && selectedNoticeFor !== "Others" ? (
          <tr style={tableStyleBody}>
            <td style={tableStyleBodyRight}>Name of Missing person</td>
            <td style={tableStyleLeft}>
              {name} {surname}
            </td>
            {imagesUploadedListState && imagesUploadedListState.length > 0 ? (
              <td
                style={{ ...tableStyleLeftLast, marginLeft: "10px" }}
                rowspan="18"
              >
                <Col span={24}>
                  <Upload
                    listType="picture-card"
                    customRequest={dummyRequest}
                    fileList={imagesUploadedListState}
                    disabled={false}
                    showUploadList={{
                      showRemoveIcon: false,
                      showPreviewIcon: false,
                    }}
                  >
                    {displayPhotos.length - 1 <= displayPhotos.length
                      ? null
                      : null}
                  </Upload>
                </Col>
              </td>
            ) : (
              <td
                style={{ ...tableStyleLeftLast, marginLeft: "10px" }}
                rowspan="18"
              />
            )}
          </tr>
        ) : null}
        {isNotUnknwonDeadBody ? (
          <tr style={tableStyleBody}>
            <td style={tableStyleBodyRight}>Father / husband name</td>
            <td style={tableStyleLeft}>{fatherHusbandGuardianName}</td>
          </tr>
        ) : null}
        {isNotUnknwonDeadBody ? (
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
          <tr style={tableStyleBody}>
            <td style={tableStyleBodyRight}>Approximate Age</td>
            <td style={tableStyleLeft}>
              {otherCrimeClassification?.approximateAge
                ? otherCrimeClassification?.approximateAge
                : bodilyCrimeClassification?.approxAge}
            </td>
          </tr>
        ) : null}
        {isNotUnknwonDeadBody ? (
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
              <td style={tableStyleLeft}>
                {complainantContactDetails &&
                first(complainantContactDetails)?.phoneNumber
                  ? first(complainantContactDetails).phoneNumber
                  : ""}
              </td>
            </tr>
            <tr style={tableStyleBody}>
              <td style={tableStyleBodyRight}>Contact Address</td>
              <td style={tableStyleLeft}>{Address}</td>
            </tr>
          </>
        ) : null}
        {(selectedNoticeFor === crimeclassification?.majorHead &&
          isNotUnknwonDeadBody) ||
        "Missing Person" ? (
          <>
            {isNotUnknwonDeadBody ? (
              <>
                <tr style={tableStyleBody}>
                  <td style={tableStyleBodyRight}>Complexion</td>
                  <td style={tableStyleLeft}>
                    {otherCrimeClassification?.complexion
                      ? otherCrimeClassification?.complexion
                      : bodilyCrimeClassification?.complexion
                      ? bodilyCrimeClassification?.complexion
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
                  : bodilyCrimeClassification?.height
                  ? bodilyCrimeClassification?.height
                  : physicalFeatures?.height}
              </td>
            </tr>
            <tr style={tableStyleBody}>
              <td style={tableStyleBodyRight}>Body Built type</td>
              <td style={tableStyleLeft}>
                {otherCrimeClassification?.bodyBuiltType
                  ? otherCrimeClassification?.bodyBuiltType
                  : bodilyCrimeClassification?.bodyBuiltType
                  ? bodilyCrimeClassification?.bodyBuiltType
                  : physicalFeatures?.bodyBuiltType}
              </td>
            </tr>
            {isUnknownDeadBody ? (
              <tr style={tableStyleBody}>
                <td style={tableStyleBodyRight}>Complexion</td>
                <td style={tableStyleLeft}>
                  {otherCrimeClassification?.complexion
                    ? otherCrimeClassification?.complexion
                    : bodilyCrimeClassification?.complexion
                    ? bodilyCrimeClassification?.complexion
                    : physicalFeatures?.complexion}
                </td>
              </tr>
            ) : null}
            <tr style={tableStyleBody}>
              <td style={tableStyleBodyRight}>Color of Hair </td>
              <td style={tableStyleLeft}>
                {otherCrimeClassification?.hairColor
                  ? otherCrimeClassification?.hairColor
                  : bodilyCrimeClassification?.hairColor
                  ? bodilyCrimeClassification?.hairColor
                  : physicalFeatures?.hair}
              </td>
            </tr>
            <tr style={tableStyleBody}>
              <td style={tableStyleBodyRight}>Color of Eyes </td>
              <td style={tableStyleLeft}>
                {otherCrimeClassification?.eyeColor
                  ? otherCrimeClassification?.eyeColor
                  : bodilyCrimeClassification?.eyeColor
                  ? bodilyCrimeClassification?.eyeColor
                  : physicalFeatures?.eyes}
              </td>
            </tr>
            {isNotUnknwonDeadBody ? (
              <tr style={tableStyleBody}>
                <td style={tableStyleBodyRight}>
                  Whether physically, mentally, visually challenged?
                </td>
                <td style={tableStyleLeft}>
                  {otherCrimeClassification?.whether
                    ? otherCrimeClassification?.whether
                    : bodilyCrimeClassification?.whether}
                </td>
              </tr>
            ) : null}
            {isNotMissingPerson ? (
              <tr style={tableStyleBody}>
                <td style={tableStyleBodyRight}>Teeth</td>
                <td style={tableStyleLeft}>
                  {otherCrimeClassification?.teeth
                    ? otherCrimeClassification?.teeth
                    : bodilyCrimeClassification?.teeth
                    ? bodilyCrimeClassification?.teeth
                    : physicalFeatures?.teeth}
                </td>
              </tr>
            ) : null}
            <tr style={tableStyleBody}>
              <td style={tableStyleBodyRight}>Moles</td>
              <td style={tableStyleLeft}>
                {otherCrimeClassification?.moles
                  ? otherCrimeClassification?.moles
                  : bodilyCrimeClassification?.moles
                  ? bodilyCrimeClassification?.moles
                  : physicalFeatures?.moles}
              </td>
            </tr>
            {isUnknownDeadBody ? (
              <tr style={tableStyleBody}>
                <td style={tableStyleBodyRight}>Deformities</td>
                <td style={tableStyleLeft}>
                  {otherCrimeClassification?.deformities
                    ? otherCrimeClassification?.deformities
                    : bodilyCrimeClassification?.deformities
                    ? bodilyCrimeClassification?.deformities
                    : physicalFeatures?.deformities}
                </td>
              </tr>
            ) : null}
            {isNotMissingPerson ? (
              <tr style={tableStyleBody}>
                <td style={tableStyleBodyRight}>
                  Visible Injuries on the person
                </td>
                <td style={tableStyleLeft}>
                  {otherCrimeClassification?.visibleInjuries
                    ? otherCrimeClassification?.visibleInjuries
                    : bodilyCrimeClassification?.visibleInjuries
                    ? bodilyCrimeClassification?.visibleInjuries
                    : physicalFeatures?.visibleInjuries}
                </td>
              </tr>
            ) : null}
            {isNotMissingPerson ? (
              <tr style={tableStyleBody}>
                <td style={tableStyleBodyRight}>Any valuables on the body</td>
                <td style={tableStyleLeft}>
                  {otherCrimeClassification?.anyValuables
                    ? otherCrimeClassification?.anyValuables
                    : bodilyCrimeClassification?.valuables
                    ? bodilyCrimeClassification?.valuables
                    : physicalFeatures?.anyValuables}
                </td>
              </tr>
            ) : null}
            {isNotMissingPerson && isNotUnknwonDeadBody ? (
              <tr style={tableStyleBody}>
                <td style={tableStyleBodyRight}>Wallet/Id No.</td>
                <td style={tableStyleLeft}>
                  {otherCrimeClassification?.walletOrIdFoundText
                    ? otherCrimeClassification?.walletOrIdFoundText
                    : bodilyCrimeClassification?.wallet
                    ? bodilyCrimeClassification?.wallet
                    : physicalFeatures?.walletOrIdFoundText}
                </td>
              </tr>
            ) : null}
            {isNotUnknwonDeadBody ? (
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
            {selectedNoticeFor === "Missing Person" ? (
              <>
                <tr style={tableStyleBody}>
                  <td style={tableStyleBodyRight}>Date of FIR</td>
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
                      padding: "5px",
                      borderRight: "1px solid black",
                    }}
                    colspan="3"
                  >
                    Brief Facts of the Case
                  </td>
                </tr>
                <tr style={tableStyleLeft}>
                  <td style={tableStyleLeftLast} colspan="3">
                    {factsOfComplainant ? factsOfComplainant : ""}
                  </td>
                </tr>
              </>
            ) : null}
            {isNotMissingPerson ? (
              <>
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
                      padding: "5px",
                      borderRight: "1px solid black",
                    }}
                    colspan="3"
                  >
                    Brief Facts of the Case
                  </td>
                </tr>
                <tr style={tableStyleLeft}>
                  <td style={tableStyleLeftLast} colspan="3">
                    {factsOfComplainant ? factsOfComplainant : ""}
                  </td>
                </tr>
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
                  : bodilyCrimeClassification?.beard
                  ? bodilyCrimeClassification?.beard
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
              <td style={tableStyleLeft}>
                {otherCrimeClassification?.hair
                  ? otherCrimeClassification?.hair
                  : bodilyCrimeClassification?.hairColor
                  ? bodilyCrimeClassification?.hairColor
                  : physicalFeatures?.hair}
              </td>
            </tr>
            <tr style={tableStyleBody}>
              <td style={tableStyleBodyRight}>Ear</td>
              <td style={tableStyleLeft}>
                {otherCrimeClassification?.ear
                  ? otherCrimeClassification?.ear
                  : physicalFeatures?.ear}
              </td>
            </tr>
            <tr style={tableStyleBody}>
              <td style={tableStyleBodyRight}>Eyes</td>
              <td style={tableStyleLeft}>
                {otherCrimeClassification?.eyeColor
                  ? otherCrimeClassification?.eyeColor
                  : bodilyCrimeClassification?.eyeColor
                  ? bodilyCrimeClassification?.eyeColor
                  : physicalFeatures?.eyes}
              </td>
            </tr>
            <tr style={tableStyleBody}>
              <td style={tableStyleBodyRight}>Face</td>
              <td style={tableStyleLeft}>
                {otherCrimeClassification?.face
                  ? otherCrimeClassification?.face
                  : physicalFeatures?.face}
              </td>
            </tr>
            <tr style={tableStyleBody}>
              <td style={tableStyleBodyRight}>Hair</td>
              <td style={tableStyleLeft}>
                {otherCrimeClassification?.hairColor
                  ? otherCrimeClassification?.hairColor
                  : bodilyCrimeClassification?.hairColor
                  ? bodilyCrimeClassification?.hairColor
                  : physicalFeatures?.hair}
              </td>
            </tr>
            <tr style={tableStyleBody}>
              <td style={tableStyleBodyRight}>Height</td>
              <td style={tableStyleLeft}>
                {otherCrimeClassification?.height
                  ? otherCrimeClassification?.height
                  : bodilyCrimeClassification?.height
                  ? bodilyCrimeClassification?.height
                  : physicalFeatures?.height}
              </td>
            </tr>
            <tr style={tableStyleBody}>
              <td style={tableStyleBodyRight}>Leucodema</td>
              <td style={tableStyleLeft}>
                {otherCrimeClassification?.leucodema
                  ? otherCrimeClassification?.leucodema
                  : physicalFeatures?.leucodema}
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
                {otherCrimeClassification?.mole
                  ? otherCrimeClassification?.mole
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
              <td style={tableStyleBodyRight}>Other Body Features</td>
              <td style={tableStyleLeft}>
                {otherCrimeClassification?.otherBodyFeatures
                  ? otherCrimeClassification?.otherBodyFeatures
                  : physicalFeatures?.otherBodyFeatures}
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
                  padding: "5px",
                  borderRight: "1px solid black",
                }}
                colspan="3"
              >
                Brief Facts of the Case
              </td>
            </tr>
            <tr style={tableStyleLeft}>
              <td style={tableStyleLeftLast} colspan="3">
                {factsOfComplainant ? factsOfComplainant : ""}
              </td>
            </tr>
          </>
        )}
      </tbody>
    </table>
  );
}
