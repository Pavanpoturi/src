import { Card } from "antd";
import { isUndefined } from "lodash";
import Scrollbars from "@components/utility/customScrollBar";
import { SelectedRecordsWidgetWrapper } from "./styles";
import UploadForm from "@components/Common/uploadForm";
import { EyeFilled, EditFilled } from "@ant-design/icons";
import moment from "moment";

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

export default function PanchWitnessList({
  isDisplayed,
  inputFileList,
  handleFileChange,
  minHeight,
  showRecords,
  records,
  editPanchWitness,
  selectedRecord,
  setViewPanchWitness,
  disableEdit,
}) {

  const recordSelected =
    records.length > 1
      ? `${records.length} Record(s) Selected`
      : `${records.length} record selected`;

  return (
    <SelectedRecordsWidgetWrapper
      style={{ padding: 15, minHeight: minHeight, height: minHeight }}
    >
      <Scrollbars style={{ width: "100%" }}>
        {records && records.length > 0 && showRecords && (
          <div style={{ marginBottom: 10 }}>
            <p>{recordSelected}</p>
          </div>
        )}

        {showRecords &&
          records &&
          records.length > 0 &&
          records.map((item, index) => {
            const { person } = item;
            const { contactDetails, personalDetails, presentAddress } = person;
            const { name, alias, gender, dateOfBirth, occupation } =
              !isUndefined(personalDetails) && personalDetails;
            const { houseNo, streetRoadNo, wardColony, stateUt, pinCode } =
              !isUndefined(presentAddress) && presentAddress;
            return (
              <Card
                style={{ marginBottom: 10 }}
                key={index}
                className={
                  selectedRecord?.person?._id === person?._id ? "editMode" : ""
                }
              >
                {personalDetails && (
                  <>
                    <div style={styles.widgetPageStyle}>
                      <div>
                        {name} {alias || ""}
                      </div>
                      <div
                        style={{ cursor: "pointer", color: "#02599C" }}
                        onClick={() => {
                          editPanchWitness(item);
                          setViewPanchWitness(true);
                        }}
                      >
                        <EyeFilled style={{ marginRight: 5 }} />
                        View
                      </div>
                      {!disableEdit && (
                        <div
                          style={{ cursor: "pointer", color: "#02599C" }}
                          onClick={() => {
                            editPanchWitness(item);
                            setViewPanchWitness(false);
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
                    <p>{occupation || ""}</p>
                  </>
                )}
                <p>
                  {contactDetails?.length > 0
                    ? contactDetails[0]?.phoneNumber
                    : ""}
                </p>
                {presentAddress && (
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
