import { Card } from "antd";
import { isUndefined } from "lodash";
import Scrollbars from "@components/utility/customScrollBar";
import { SelectedRecordsWidgetWrapper } from "./styles";
import UploadForm from "@components/Common/uploadForm";
import { EyeFilled, EditFilled } from "@ant-design/icons";
import moment from "moment";
import { DATE_TIME_FORMAT_WITHOUT_SECONDS } from "@containers/FirDetails/fir-util";

const styles = {
  widgetPageStyle: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    overflow: "hidden",
    marginBottom: 10,
  },
};

export default function SceneofOffenseList({
  isDisplayed,
  inputFileList,
  handleFileChange,
  minHeight,
  showRecords,
  records,
  editSceneofOffense,
  selectedRecord,
  setViewSceneofOffense,
}) {
  const recordList =
    records &&
    records.length > 0 &&
    records.filter((s) => s !== null && s.lastupdateddatetime !== null);
  const recordSelected =
    recordList.length > 1
      ? `${recordList.length} Record(s) Selected`
      : `${recordList.length} record selected`;

  return (
    <SelectedRecordsWidgetWrapper
      style={{ padding: 15, minHeight: minHeight, height: minHeight }}
    >
      <Scrollbars style={{ width: "100%" }}>
        {recordList && recordList.length > 0 && showRecords && (
          <div style={{ marginBottom: 10 }}>
            <p>{recordSelected}</p>
          </div>
        )}
        {showRecords &&
          recordList &&
          recordList.length > 0 &&
          recordList.map((item, index) => {
            const { address, sceneRecreated, userDate } = item;
            const {
              address1,
              address2,
              landmark,
              district,
              state,
              latitude,
              longitude,
              city,
              pincode,
            } = !isUndefined(address) && address;
            return (
              <Card
                style={{ marginBottom: 10 }}
                key={index}
                className={
                  selectedRecord?.address === item?.address ? "editMode" : ""
                }
              >
                <div style={styles.widgetPageStyle}>
                  <div>
                    <b>
                      {" "}
                      {sceneRecreated ? "Scene Recreated" : `Scene of Offence`}
                    </b>
                  </div>
                  <div
                    style={{ cursor: "pointer", color: "#02599C" }}
                    onClick={() => {
                      editSceneofOffense(item);
                      setViewSceneofOffense(true);
                    }}
                  >
                    <EyeFilled style={{ marginRight: 5 }} />
                    View
                  </div>
                  {!sceneRecreated && (
                    <div
                      style={{ cursor: "pointer", color: "#02599C" }}
                      onClick={() => {
                        editSceneofOffense(item);
                        setViewSceneofOffense(false);
                      }}
                    >
                      <EditFilled style={{ marginRight: 5 }} />
                      Edit
                    </div>
                  )}
                </div>
                <span>
                  {address && (
                    <>
                      <p>
                        {address1}
                        {address2 ? ", " : ""}
                        {address2 ? `${address2}` : ""}
                        {landmark ? ", " : ""} {landmark ? `${landmark}` : ""}
                        {latitude ? ", " : ""} {latitude ? `${latitude}` : ""}
                        {longitude ? ", " : ""}{" "}
                        {longitude ? `${longitude}` : ""}
                      </p>
                      <span>
                        {state}
                        {`,${district}`}
                        {city ? `,${city} ` : ""} {pincode ? `${pincode}` : ""}
                      </span>
                    </>
                  )}
                </span>
                <div style={{ marginTop: 10 }}>
                  <span>
                    {moment(userDate).isValid() ? (
                      <b>
                        {moment(userDate).format(
                          DATE_TIME_FORMAT_WITHOUT_SECONDS
                        )}
                      </b>
                    ) : (
                      ""
                    )}
                  </span>
                </div>
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
