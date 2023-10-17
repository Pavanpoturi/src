import TableWrapper from "@containers/Tables/AntTables/AntTables.styles";
import { TableWidgetWrapper } from "@containers/FirDetails/CommonSections/TableWidget.styles";
import { config } from "@config/site.config";
import moment from "moment";
import { DATE_FORMAT } from "@containers/FirDetails/fir-util";
import { first } from "lodash";
import { Upload } from "antd";
import axios from "axios";
import { useDispatch } from "react-redux";
import { loadState } from "@lib/helpers/localStorage";
import caseDiaryActions from "@redux/investigations/caseDiary/actions";
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

export default function SavedRecords({
  dataSource,
  editDetails,
  setViewDetails,
  selectedRecord,
  generateCaseDiary,
  openNotificationWithIcon,
  printCaseDiary,
}) {
  const dispatch = useDispatch();
  const crimeId = loadState("selectedFirId");
  const { uploadCaseDiary } = caseDiaryActions;
  const columns = [
    {
      title: "CD No.",
      dataIndex: "cdNum",
      rowKey: "cdNum",
      render: (_i, item) => (
        <span className="tableRowText">{`0${item?.cdNo}`}</span>
      ),
    },
    {
      title: "CD Part 1 Date",
      dataIndex: "cdPartOneDate",
      rowKey: "cdPartOneDate",
      render: (_i, item) => (
        <span className="tableRowText">
          {item?.cdPartOneDate
            ? moment(item?.cdPartOneDate).format(DATE_FORMAT)
            : ""}
        </span>
      ),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      rowKey: "actions",
      render: (_value, item, i) => {
        const generateInSequence =
          dataSource.length > 1 && dataSource[i - 1]?.state === "new";
        return (
          <div key={i} style={styles.widgetPageStyle}>
            {item.state !== "new" ? (
              <div
                style={{
                  cursor: "pointer",
                  color: "#02599C",
                  textDecoration: "underline",
                }}
                onClick={() => {
                  editDetails(item);
                  setViewDetails(true);
                }}
              >
                View
              </div>
            ) : null}
            {item.state === "new" ? (
              <div
                style={{
                  cursor: "pointer",
                  color: "#02599C",
                  marginLeft: 5,
                  textDecoration: "underline",
                }}
                onClick={() => {
                  editDetails(item);
                  setViewDetails(false);
                }}
              >
                Edit
              </div>
            ) : null}
            {item.state === "generated" || item.state === "uploaded" ? (
              <div
                style={{
                  cursor: "pointer",
                  color: "#02599C",
                  marginLeft: 5,
                  textDecoration: "underline",
                }}
                onClick={() => printCaseDiary(item)}
              >
                Print
              </div>
            ) : null}

            {item.state === "new" ? (
              <div
                style={{
                  cursor: generateInSequence ? "not-allowed" : "pointer",
                  color: generateInSequence ? "#A8A8A8" : "#02599C",
                  marginLeft: 5,
                  textDecoration: "underline",
                }}
                onClick={() => {
                  if (generateInSequence) {
                    console.log("Please generate CD in sequence");
                  } else {
                    generateCaseDiary(item);
                  }
                }}
              >
                Generate
              </div>
            ) : null}

            {item.state === "uploaded" ? (
              <div
                style={{
                  cursor: "pointer",
                  color: "#02599C",
                  marginLeft: 5,
                  textDecoration: "underline",
                }}
              >
                <span
                  onClick={() =>
                    getFileById(
                      item?.uploadedPart1CD?.fileId,
                      item?.uploadedPart1CD?.name,
                      item?.uploadedPart1CD?.url
                    )
                  }
                  style={{ color: "#02599C" }}
                >
                  View Uploaded Part 1 CD
                </span>
              </div>
            ) : null}

            {item.state === "generated" ? (
              <Upload
                accept="application/msword, application/pdf, image/*"
                customRequest={(options) => {
                  let formData = new FormData();
                  formData.append("file", options.file);
                  formData.append("prefixFolder", selectedRecord?.crimeId);
                  const folderPath = `${crimeId}/caseDiary/CDPart1`;
                  formData.append("folderPath", folderPath);
                  axios
                    .post(`${config.fileUpload}/upload`, formData)
                    .then((res) => {
                      if (res.status) {
                        const { data } = res.data;
                        const payloadData = first(data);
                        const payload = {
                          crimeId: crimeId,
                          caseDiaryId: item?._id,
                          caseDiary: {
                            state: "uploaded",
                            cdDate: item.cdDate,
                            cdPartOneDate: item.cdPartOneDate,
                            reasonUI: item.reasonUI,
                            subReason: item.subReason,
                            gistInvestigation: item.gistInvestigation,
                            uploadedPart1CD: {
                              mimeType: payloadData.mimeType,
                              name: payloadData.name,
                              url: payloadData.url,
                              fileId: payloadData?.id,
                            },
                          },
                        };
                        dispatch(
                          uploadCaseDiary(config.updateCaseDiary, payload)
                        );
                        setTimeout(() => {
                          options.onSuccess("ok");
                        }, 0);
                      }
                    })
                    .catch((err) => {
                      if (err && err?.response?.status === 400) {
                        const errorDetails = JSON.parse(
                          err.response?.data?.error.description
                        );
                        const errorKey = errorDetails?.error?.errorKey;
                        openNotificationWithIcon("error", errorKey);
                        setTimeout(() => {
                          options.onError("ok");
                        }, 0);
                      }
                    });
                }}
              >
                <div
                  style={{
                    cursor: "pointer",
                    color: "#02599C",
                    marginLeft: 5,
                    textDecoration: "underline",
                  }}
                >
                  Upload
                </div>
              </Upload>
            ) : null}
          </div>
        );
      },
    },
  ];

  let uniqueId = 0;

  return (
    <TableWidgetWrapper>
      <TableWrapper
        rowClassName={(record, _index) =>
          selectedRecord?._id === record?.selectedRecord?._id ? "editMode" : ""
        }
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        rowKey={(record) => {
          if (!record.__uniqueId) record.__uniqueId = ++uniqueId;
          return record.__uniqueId;
        }}
        size="small"
      />
    </TableWidgetWrapper>
  );
}
