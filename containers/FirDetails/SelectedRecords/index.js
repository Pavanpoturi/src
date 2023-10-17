import { Card, Divider, Button } from "antd";
import { Link } from "react-router-dom";
import Scrollbars from "@components/utility/customScrollBar";
import { isEmpty } from "lodash";
import { SelectedRecordsWidgetWrapper } from "./styles";
import UploadForm from "@components/Common/uploadForm";
import {
  EyeFilled,
  AudioFilled,
  VideoCameraFilled,
  EditFilled,
  SaveFilled,
} from "@ant-design/icons";
import ImagesTable from "@components/Common/imagesTable";
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

export default function SelectedRecords({
  moduleTitle,
  isDisplayed,
  showLinks,
  folderName = "",
  minHeight,
  showImages,
  SelectedCount,
  ArchievedCount,
  AllPhotosCount,
  showRecords,
  markSelected,
  imageTable,
  records,
  editExpertTeam,
  editPanchWitness,
  editWitnessStatement,
  editMaterialObject,
  selectedRecord,
  setInputFileList,
  selectedCategory,
  setSelectedCategory,
  disabled,
}) {
  const recordSelected =
    !isEmpty(records) && records.length > 1
      ? `${records.length} Record(s) Selected`
      : `${records.length} record selected`;

  return (
    <SelectedRecordsWidgetWrapper
      style={{ padding: 15, minHeight: minHeight, height: minHeight }}
    >
      <Scrollbars style={{ width: "100%" }}>
        {!isEmpty(records) && showRecords ? (
          <div style={{ marginBottom: 10 }}>
            <p>{recordSelected}</p>
          </div>
        ) : null}
        {moduleTitle === "Expert Team" && records && records.length > 0 && (
          <div>
            {records.map(
              (item, index) =>
                item.length > 0 && (
                  <div key={index}>
                    <label style={{ margin: 5, marginRight: 20 }}>
                      {" "}
                      <b> {item[0].role} </b>
                    </label>{" "}
                    <label>
                      <b>
                        {item[0].lastupdateddatetime
                          ? moment(item[0].lastupdateddatetime).format(
                              "MMMM DD, YYYY"
                            )
                          : ""}
                      </b>
                    </label>
                  </div>
                )
            )}
            <Divider />
          </div>
        )}

        {(moduleTitle === "Panch Witness" ||
          moduleTitle === "Witness Details") &&
          showRecords &&
          records &&
          records.length && (
            <div>
              {records.map((item, index) => (
                <>
                  <Card
                    style={{ marginBottom: 10 }}
                    key={index}
                    className={
                      selectedRecord?.person?._id === item.person?._id
                        ? "editMode"
                        : ""
                    }
                  >
                    {moduleTitle === "Witness Statement" && (
                      <div style={styles.widgetPageStyle}>
                        <div>{item.witness_master_record[0]?.witnessCode}</div>
                        <div>
                          <EditFilled
                            onClick={() => editWitnessStatement(item)}
                            className="iconStyle"
                          />
                        </div>
                        <div>
                          <EyeFilled style={{ color: "grey" }} />
                        </div>
                      </div>
                    )}
                    <span>
                      {item.person && item.person.personal_detail && (
                        <>
                          <p>
                            {item.person?.personal_detail?.name}
                            {item.person?.personal_detail?.aliasName
                              ? `(${item.person?.personal_detail?.aliasName})`
                              : ""}
                          </p>
                          <p>
                            {item.person?.personal_detail?.gender
                              ? `${item.person?.personal_detail?.gender}`
                              : ""}
                            {item.person?.personal_detail?.gender ? ", " : ""}{" "}
                            {item.person?.personal_detail?.dateOfBirth
                              ? `${moment().diff(
                                  item.person?.personal_detail?.dateOfBirth,
                                  "years"
                                )} Years`
                              : ""}
                          </p>
                          <p>{item.person?.personal_detail?.occupation}</p>
                        </>
                      )}
                      <p>
                        {item.person?.contact_details?.length > 0
                          ? item.person?.contact_details[0]?.phoneNumber
                          : ""}
                      </p>
                      {item.person && item.person.present_address && (
                        <>
                          <p>
                            {item.person.present_address?.houseNo}
                            {item.person.present_address?.houseNo ? ", " : ""}
                            {item.person?.present_address?.streetRoadNo
                              ? `${item.person?.present_address?.streetRoadNo}`
                              : ""}
                            {item.person?.present_address?.streetRoadNo
                              ? ", "
                              : ""}{" "}
                            {item.person?.present_address?.wardColony
                              ? `${item.person?.present_address?.wardColony}`
                              : ""}
                          </p>
                          <p>
                            {item.person.present_address?.stateUt}
                            {item.person.present_address?.stateUt
                              ? ", "
                              : ""}{" "}
                            {item.person?.present_address?.pinCode
                              ? `${item.person?.present_address?.pinCode}`
                              : ""}
                          </p>
                        </>
                      )}
                    </span>
                    {moduleTitle === "Panch Witness" && (
                      <div>
                        <label
                          onClick={() => editPanchWitness(item)}
                          className="linkStyle"
                        >
                          Edit Details{" "}
                        </label>
                      </div>
                    )}
                    {item.witness_statement &&
                      item.filename &&
                      item.witness_statement.map((item, index) => (
                        <>
                          {item.filename && item.filetype === "VIDEO" && (
                            <div style={{ padding: 10 }}>
                              <VideoCameraFilled className="iconStyle" />{" "}
                              {item.filename}
                            </div>
                          )}
                          {item.filename && item.filetype === "AUDIO" && (
                            <div style={{ padding: 10 }}>
                              <AudioFilled className="iconStyle" />
                              {item.filename}
                            </div>
                          )}
                        </>
                      ))}
                  </Card>
                </>
              ))}
            </div>
          )}

        {showLinks && (
          <div>
            <div>
              <Link
                className="linkStyle"
                onClick={() => showImages("Selected")}
              >
                Selected {SelectedCount}
              </Link>
            </div>
            <div>
              <Link
                className="linkStyle"
                onClick={() => showImages("Archived")}
              >
                Archived {ArchievedCount}
              </Link>
            </div>
            <div>
              <Link className="linkStyle" onClick={() => showImages("Photos")}>
                All Photos {AllPhotosCount}
              </Link>
            </div>
            <Divider />
          </div>
        )}

        {isDisplayed && (
          <UploadForm
            colWidth={22}
            enableMediaManager={true}
            folderName={folderName}
            setInputFileList={setInputFileList}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            disabled={disabled}
          />
        )}
        {markSelected && (
          <>
            <Divider />
            <div>
              <Button
                className="markSelectedButton"
                size="large"
                icon={<SaveFilled className="markSelectedButtonIcon" />}
                onClick={markSelected}
              >
                Mark Selected
              </Button>
            </div>
          </>
        )}
        {imageTable && records && records.length && (
          <ImagesTable
            records={records}
            editMaterialObject={editMaterialObject}
            selectedRecord={selectedRecord}
          />
        )}
      </Scrollbars>
    </SelectedRecordsWidgetWrapper>
  );
}
