import { Row, Form, Upload, Button, notification, Col } from "antd";
import { useEffect } from "react";
import { CameraFilled, FilePdfOutlined } from "@ant-design/icons";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { first } from "lodash";
import { config } from "@config/site.config";
import mediaManagerActions from "@redux/fir/mediaManager/actions";
import { camelizeText } from "@containers/FirDetails/fir-util";
import Red_corner_notice from "../../GenerateTemplates/Arrest/AccusedOutOfCountry/Red_corner_notice.doc";
import Blue_corner_notice from "../../GenerateTemplates/Arrest/AccusedOutOfCountry/Blue_corner_notice.doc";

export default function DisplayArrestReportGenerations({
  templateLists,
  showModal,
  crimeId,
  selectedModule,
  selectedSubModule,
  selectedRecord,
  category = "Templates",
  actionName,
  actionUrl,
}) {
  const dispatch = useDispatch();
  const { resetTemplatesActionType } = mediaManagerActions;
  const { uploadSuccessMessage, uploadActionType, uploadErrorMessage } =
    useSelector((state) => state.MediaManager);

  const isSuccessUpload = uploadActionType === "UPLOAD_TEMPLATES_SUCCESS";
  const isErrorUpload = uploadActionType === "UPLOAD_TEMPLATES_ERROR";

  const openNotificationWithIcon = (type, message) => {
    return notification[type]({
      message: message,
    });
  };

  useEffect(() => {
    if (isSuccessUpload || isErrorUpload) {
      if (
        uploadSuccessMessage === "Template Uploaded Successfully" &&
        uploadActionType === "UPLOAD_TEMPLATES_SUCCESS"
      ) {
        openNotificationWithIcon("success", uploadSuccessMessage);
        dispatch(resetTemplatesActionType());
      } else if (
        uploadErrorMessage &&
        uploadActionType === "UPLOAD_TEMPLATES_ERROR"
      ) {
        openNotificationWithIcon("error", uploadErrorMessage);
        dispatch(resetTemplatesActionType());
      }
    }
  }, [uploadActionType]);

  const displayReportGenerationsTemplates = () => {
    return templateLists.map((item, i) => {
      const { fileName, label } = item;
      const isDirectDownload =
        fileName === "Red_corner_notice" || fileName === "Blue_corner_notice";
      const filePath =
        isDirectDownload && fileName === "Blue_corner_notice"
          ? Blue_corner_notice
          : Red_corner_notice;
      return (
        <Row className="row-item" key={i} style={{ padding: 0 }}>
          <Col
            span={16}
            style={{
              color: "#02599c",
              textDecoration: "underline",
              fontSize: 15,
              cursor: "pointer",
            }}
          >
            <FilePdfOutlined />
            {isDirectDownload ? (
              <a href={filePath} style={{ marginLeft: 5 }}>
                {label}
              </a>
            ) : (
              <span
                onClick={() =>
                  showModal(label, fileName, item.templateAvailable)
                }
                style={{ marginLeft: 5 }}
              >
                {label}
              </span>
            )}
          </Col>
          <Col span={8}>
            <Form.Item name="left_upload">
              <Upload
                customRequest={(options) => {
                  let formData = new FormData();
                  formData.append("file", options.file);
                  formData.append("prefixFolder", crimeId);
                  const folderPath =
                    selectedModule === "Arrest"
                      ? `${crimeId}/${camelizeText(
                          selectedModule
                        )}/${camelizeText(selectedModule)}/reports`
                      : `${crimeId}/${camelizeText(selectedSubModule)}/reports`;
                  formData.append("folderPath", folderPath);
                  axios
                    .post(`${config.fileUpload}/upload`, formData)
                    .then((res) => {
                      if (res.status) {
                        const { data } = res.data;
                        const payloadData = first(data);
                        const payload = {
                          _id: selectedRecord?._id,
                          crimeId: selectedRecord.crimeId,
                          accusedId: selectedRecord.accusedId._id,
                          action: selectedRecord.action,
                          actionSubType: selectedRecord.arrestType
                            ? selectedRecord.arrestType
                            : selectedRecord.action,
                          templates: [
                            {
                              category: category,
                              mimeType: payloadData.mimeType,
                              name: payloadData.name,
                              url: payloadData.url,
                              templateCode: fileName,
                              templateName: label,
                              fileId: payloadData.id,
                            },
                          ],
                        };
                        dispatch(actionName(actionUrl, payload));
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
                <Button
                  className="saveButton"
                  icon={<CameraFilled />}
                  disabled={!selectedRecord?._id}
                >
                  Upload
                </Button>
              </Upload>
            </Form.Item>
          </Col>
        </Row>
      );
    });
  };
  return displayReportGenerationsTemplates();
}
