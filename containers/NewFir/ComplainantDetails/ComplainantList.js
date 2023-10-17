import { Card } from "antd";
import { isUndefined, isEmpty, isNull } from "lodash";
import Scrollbars from "@components/utility/customScrollBar";
import { SelectedRecordsWidgetWrapper } from "../styles";
import { EyeFilled, EditFilled } from "@ant-design/icons";
import moment from "moment";
import { getFileById } from "@containers/media-util";

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

export default function ComplainantList({
  minHeight,
  records,
  editDetails,
  selectedRecord,
  setViewDetails,
  setIsEditRecord,
  disable,
}) {
  return (
    <SelectedRecordsWidgetWrapper
      style={{ padding: 15, minHeight: minHeight, height: minHeight }}
    >
      <Scrollbars style={{ width: "100%" }}>
        {records &&
          records.length > 0 &&
          records.map((item, index) => {
            const { person } = item;
            const { contactDetails, personalDetails, presentAddress } =
              !isUndefined(person) && !isNull(person) && person;
            const mediaDetails =
              !isUndefined(person) && !isEmpty(person?.media) && person?.media;
            const { name, surname, gender, dateOfBirth, occupation } =
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
                        {name} {surname || ""}
                      </div>
                      <div
                        style={{ cursor: "pointer", color: "#02599C" }}
                        onClick={() => {
                          editDetails(item);
                          setViewDetails(true);
                          setIsEditRecord(false);
                        }}
                      >
                        <EyeFilled style={{ marginRight: 5 }} />
                        View
                      </div>
                      {!disable ? (
                        <div
                          style={{ cursor: "pointer", color: "#02599C" }}
                          onClick={() => {
                            editDetails(item);
                            setViewDetails(false);
                            setIsEditRecord(true);
                          }}
                        >
                          <EditFilled style={{ marginRight: 5 }} />
                          Edit
                        </div>
                      ) : null}
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
                {!isEmpty(mediaDetails) &&
                  mediaDetails.map((item, i) => {
                    return (
                      <div
                        key={i}
                        style={{
                          cursor: "pointer",
                          color: "#02599C",
                          marginTop: 10,
                        }}
                        onClick={() =>
                          getFileById(item?.fileId, item?.name, item?.url)
                        }
                      >
                        {item.name}
                      </div>
                    );
                  })}
              </Card>
            );
          })}
      </Scrollbars>
    </SelectedRecordsWidgetWrapper>
  );
}
