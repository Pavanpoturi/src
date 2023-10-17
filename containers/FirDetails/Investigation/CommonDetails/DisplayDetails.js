import { Card } from "antd";
import { isUndefined } from "lodash";
import Scrollbars from "@components/utility/customScrollBar";
import { SelectedRecordsWidgetWrapper } from "./styles";
import UploadForm from "@components/Common/uploadForm";
import { EyeFilled, EditFilled } from "@ant-design/icons";
import moment from "moment";
import { useEffect, useState } from "react";

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

export default function DisplayDetails({
  isDisplayed,
  inputFileList,
  handleFileChange,
  minHeight,
  showRecords,
  records,
  editDetails,
  selectedRecord,
  setViewDetails,
  disableEdit,
}) {
  const [filteredRecords, setFilteredRecords] = useState(records);

  useEffect(() => {
    if (records && records.length > 0) {
      setFilteredRecords(records);
    }
  }, [records]);

  const recordSelected =
    filteredRecords.length > 1
      ? `${filteredRecords.length}Record(s) Added`
      : `${filteredRecords.length} Record Added`;

  return (
    <SelectedRecordsWidgetWrapper
      style={{ padding: 15, minHeight: minHeight, height: minHeight }}
    >
      <Scrollbars style={{ width: "100%" }}>
        {filteredRecords && filteredRecords.length > 0 && showRecords && (
          <div style={{ marginBottom: 10 }}>
            <p>{recordSelected}</p>
          </div>
        )}

        {showRecords &&
          filteredRecords &&
          filteredRecords.length > 0 &&
          filteredRecords.map((item, index) => {
            const { _id } = item;
            const { personalDetails, contactDetails, permanentAddress } =
              !isUndefined(item?.accusedId) && item?.accusedId;
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
            return (
              <Card
                style={{ marginBottom: 10 }}
                key={index}
                className={selectedRecord?._id === _id ? "editMode" : ""}
              >
                {item?.accusedId && (
                  <>
                    <div style={styles.widgetPageStyle}>
                      <div>
                        {name} {surname || ""}
                      </div>
                      <div
                        style={{ cursor: "pointer", color: "#02599C" }}
                        onClick={() => {
                          editDetails(item);
                          setViewDetails(true);
                        }}
                      >
                        <EyeFilled style={{ marginRight: 5 }} />
                        View
                      </div>
                      {!disableEdit && (
                        <div
                          style={{ cursor: "pointer", color: "#02599C" }}
                          onClick={() => {
                            editDetails(item);
                            setViewDetails(false);
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
                {/* <div style={{ marginTop: 10 }}>
                  <span>
                    <b> {status} </b>
                  </span>
                </div> */}
              </Card>
            );
          })}
        {isDisplayed && (
          <UploadForm
            colWidth={22}
            enableMediaManager={true}
            inputFileList={inputFileList}
            handleFileChange={handleFileChange}
          />
        )}
      </Scrollbars>
    </SelectedRecordsWidgetWrapper>
  );
}
