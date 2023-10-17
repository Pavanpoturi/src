import { Card } from "antd";
import { isUndefined, isNull } from "lodash";
import UploadForm from "@components/Common/uploadForm";
import { EyeFilled, EditFilled } from "@ant-design/icons";
import moment from "moment";
import {
  getAccusedStatus,
  getCCLStatus,
  displayStatusDetails,
  DATE_TIME_FORMAT,
} from "@containers/FirDetails/fir-util";
import { SelectedRecordsWidgetWrapper } from "./styles";
import { arrestOption, arrestTypeOption } from "./utils";

const styles = {
  widgetPageStyle: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    overflow: "hidden",
    marginBottom: 10,
    marginTop: 10,
  },
};

export default function ArrestList({
  isDisplayed,
  inputFileList,
  handleFileChange,
  minHeight,
  showRecords,
  records,
  editArrestDetails,
  selectedRecord,
  setViewArrestDetails,
  disableEdit,
  setviewEditObj,
  setviewEditObjIndex,
  showRecordsInCCLApprehension,
}) {
  const recordSelected =
    records.length > 1
      ? `${records.length} Record(s) Selected`
      : `${records.length} record selected`;
  console.log("records", records);

  const CCLLabel = showRecordsInCCLApprehension?.label;

  return (
    <SelectedRecordsWidgetWrapper
      style={{ padding: 15, minHeight: minHeight, height: minHeight }}
    >
      <div style={{ width: "100%", minHeight: minHeight, overflowY: "auto" }}>
        {records && records.length > 0 && showRecords && (
          <div style={{ marginBottom: 10 }}>
            {CCLLabel === "CCL Apprehension" ? <p>{recordSelected}</p> : ""}
          </div>
        )}

        {showRecords &&
          records &&
          records.length > 0 &&
          records.map((item, index) => {
            const {
              action,
              arrestType,
              _id,
              accusedId,
              arrestByPolice,
              arrestByOtherPolice,
              arrestOnAnticipatoryBail,
              arrestOnSurrenderInPoliceStation,
              surrenderInCourt,
              highCourtDirections,
              surrenderBeforeCourt,
              accusedOutOfCountry,
            } = item;
            const { personalDetails, contactDetails, permanentAddress } =
              !isUndefined(accusedId) && !isNull(accusedId) && accusedId;
            const {
              gender,
              name,
              surname,
              dateOfBirth,
              occupation,
              fatherHusbandGuardianName,
              caste,
            } = !isUndefined(personalDetails) && personalDetails;
            const { houseNo, streetRoadNo, wardColony, stateUt, pinCode } =
              !isUndefined(permanentAddress) && permanentAddress;
            const dispayStatus = getCCLStatus(item);
            const accusedStatus = displayStatusDetails(
              dispayStatus,
              personalDetails?.isDied
            );
            if (CCLLabel === "CCL Apprehension") {
              return (
                <Card
                  style={{ marginBottom: 10 }}
                  key={index}
                  className={selectedRecord?._id === _id ? "editMode" : ""}
                >
                  {item && (
                    <>
                      <div style={styles.widgetPageStyle}>
                        <div>
                          {name} {surname || ""}
                        </div>
                        <div
                          style={{ cursor: "pointer", color: "#02599C" }}
                          onClick={() => {
                            editArrestDetails(item);
                            setViewArrestDetails(true);
                            setviewEditObj("");
                            setviewEditObjIndex("");
                          }}
                        >
                          <EyeFilled style={{ marginRight: 5 }} />
                          View
                        </div>
                        {!disableEdit && (
                          <div
                            style={{ cursor: "pointer", color: "#02599C" }}
                            onClick={() => {
                              editArrestDetails(item);
                              setViewArrestDetails(false);
                              setviewEditObj("");
                              setviewEditObjIndex("");
                            }}
                          >
                            <EditFilled style={{ marginRight: 5 }} />
                            Edit
                          </div>
                        )}
                      </div>
                      <p>
                        {gender || ""}
                        {gender ? ", " : ""}{" "}
                        {dateOfBirth
                          ? `${moment().diff(dateOfBirth, "years")} Years`
                          : ""}
                      </p>
                      <p>
                        {fatherHusbandGuardianName
                          ? "Father/Husband/Guardian: " +
                            fatherHusbandGuardianName
                          : ""}
                      </p>
                      <p>{caste ? "Caste: " + caste : ""}</p>
                      <p>{occupation || ""}</p>
                    </>
                  )}
                  <p>
                    {contactDetails?.length > 0
                      ? contactDetails[0]?.phoneNumber
                      : ""}
                  </p>
                  {permanentAddress && (
                    <>
                      <p>
                        {houseNo || ""}
                        {houseNo ? ", " : ""}
                        {streetRoadNo || ""}
                        {streetRoadNo ? ", " : ""} {wardColony || ""}
                      </p>
                      <p>
                        {stateUt || ""}
                        {stateUt ? ", " : ""} {pinCode || ""}
                      </p>
                    </>
                  )}
                  <div style={{ marginTop: 10 }}>
                    {(arrestType === arrestTypeOption.ARREST_BY_POLICE ||
                      action === arrestTypeOption.ARREST_BY_POLICE) && (
                      <span>
                        {arrestByPolice?.dateAndTimeOfArrest &&
                        moment(
                          arrestByPolice?.dateAndTimeOfArrest
                        ).isValid() ? (
                          <b>
                            {" "}
                            {moment(arrestByPolice?.dateAndTimeOfArrest).format(
                              DATE_TIME_FORMAT
                            )}{" "}
                          </b>
                        ) : (
                          ""
                        )}
                      </span>
                    )}
                    {(arrestType === arrestTypeOption.ARREST_BY_OTHER_POLICE ||
                      action === arrestTypeOption.ARREST_BY_OTHER_POLICE) && (
                      <span>
                        {arrestByOtherPolice?.dateTimeOfArrestByOtherPolice &&
                        moment(
                          arrestByOtherPolice?.dateTimeOfArrestByOtherPolice
                        ).isValid() ? (
                          <b>
                            {" "}
                            {moment(
                              arrestByOtherPolice?.dateTimeOfArrestByOtherPolice
                            ).format(DATE_TIME_FORMAT)}{" "}
                          </b>
                        ) : (
                          ""
                        )}
                      </span>
                    )}
                    {(arrestType ===
                      arrestTypeOption.ARREST_ON_ANTICIPATORY_BAIL ||
                      action ===
                        arrestTypeOption.ARREST_ON_ANTICIPATORY_BAIL) && (
                      <span>
                        {arrestOnAnticipatoryBail?.dateAndTimeOfSurrender &&
                        moment(
                          arrestOnAnticipatoryBail?.dateAndTimeOfSurrender
                        ).isValid() ? (
                          <b>
                            {moment(
                              arrestOnAnticipatoryBail?.dateAndTimeOfSurrender
                            ).format(DATE_TIME_FORMAT)}
                          </b>
                        ) : (
                          ""
                        )}
                      </span>
                    )}
                    {(arrestType ===
                      arrestTypeOption.ARREST_ON_SURRENDER_IN_POLICE_STATION ||
                      action ===
                        arrestTypeOption.ARREST_ON_SURRENDER_IN_POLICE_STATION) && (
                      <span>
                        {arrestOnSurrenderInPoliceStation?.stationBailDate &&
                        moment(
                          arrestOnSurrenderInPoliceStation?.stationBailDate
                        ).isValid() ? (
                          <b>
                            {moment(
                              arrestOnSurrenderInPoliceStation?.stationBailDate
                            ).format(DATE_TIME_FORMAT)}
                          </b>
                        ) : (
                          ""
                        )}
                      </span>
                    )}
                    {(arrestType === arrestOption.SURRENDER_IN_COURT ||
                      action === arrestOption.SURRENDER_IN_COURT) && (
                      <span>
                        {surrenderInCourt?.dateTime &&
                        moment(surrenderInCourt?.dateTime).isValid() ? (
                          <b>
                            {moment(surrenderInCourt?.dateTime).format(
                              DATE_TIME_FORMAT
                            )}
                          </b>
                        ) : (
                          ""
                        )}
                      </span>
                    )}
                    {(arrestType === arrestOption.HIGH_COURT_DIRECTIONS ||
                      action === arrestOption.HIGH_COURT_DIRECTIONS) && (
                      <span>
                        {highCourtDirections?.dateTime &&
                        moment(highCourtDirections?.dateTime).isValid() ? (
                          <b>
                            {moment(highCourtDirections?.dateTime).format(
                              DATE_TIME_FORMAT
                            )}
                          </b>
                        ) : (
                          ""
                        )}
                      </span>
                    )}
                    {(arrestType === arrestOption.SURRENDER_BEFORE_COURT ||
                      action === arrestOption.SURRENDER_BEFORE_COURT) && (
                      <span>
                        {surrenderBeforeCourt?.dateTime &&
                        moment(surrenderBeforeCourt?.dateTime).isValid() ? (
                          <b>
                            {moment(surrenderBeforeCourt?.dateTime).format(
                              DATE_TIME_FORMAT
                            )}
                          </b>
                        ) : (
                          ""
                        )}
                      </span>
                    )}
                    {(arrestType === arrestOption.ACCUSED_OUT_OF_COUNTRY ||
                      action === arrestOption.ACCUSED_OUT_OF_COUNTRY) && (
                      <span>
                        {accusedOutOfCountry?.dateTime &&
                        moment(accusedOutOfCountry?.dateTime).isValid() ? (
                          <b>
                            {moment(accusedOutOfCountry?.dateTime).format(
                              DATE_TIME_FORMAT
                            )}
                          </b>
                        ) : (
                          ""
                        )}
                      </span>
                    )}
                  </div>

                  <div style={{ marginTop: 10 }}>
                    <span>
                      <b> {accusedStatus} </b>
                    </span>
                  </div>
                  <div style={{ marginTop: 10, fontSize: 15 }}>
                    {arrestByPolice?.media?.map((data) => {
                      return (
                        <a>
                          {data?.name} <br />
                        </a>
                      );
                    })}
                  </div>
                </Card>
              );
            }
            return null;
          })}

        {isDisplayed && (
          <UploadForm
            colWidth={22}
            enableMediaManager={true}
            inputFileList={inputFileList}
            handleFileChange={handleFileChange}
          />
        )}
      </div>
    </SelectedRecordsWidgetWrapper>
  );
}
