import { useEffect } from "react";
import { Row, Form, Upload, Button, notification, Col } from "antd";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { first } from "lodash";
import { config } from "@config/site.config";
import { CameraFilled, FilePdfOutlined } from "@ant-design/icons";
import mediaManagerActions from "@redux/fir/mediaManager/actions";

export default function DisplayReportGenerations({
  templateLists,
  showModal,
  disabled,
  selectedRecord,
  selectedModule,
  accusedId,
  setIsModalVisible,
  selectedAccusedValue,
  crimeId,
  setisTemplateUploaded,
  personTemplates,
  handleDownload,
  getInitialDiaptch,
}) {
  const dispatch = useDispatch();
  const { uploadTemplates, resetTemplatesActionType } = mediaManagerActions;
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
        setisTemplateUploaded(true);
        openNotificationWithIcon("success", uploadSuccessMessage);
        dispatch(resetTemplatesActionType());
      } else if (
        uploadErrorMessage &&
        uploadActionType === "UPLOAD_TEMPLATES_ERROR"
      ) {
        setisTemplateUploaded(false);
        openNotificationWithIcon("error", uploadErrorMessage);
        dispatch(resetTemplatesActionType());
      }
    }
  }, [uploadActionType]);

  const displayReportGenerations = () => {
    return templateLists.map((item, i) => {
      const { fileName, label } = item;
      return (
        <Row className="row-item" key={i}>
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
            <span
              onClick={() => {
                if (selectedAccusedValue?.person?._id) {
                  setIsModalVisible(true);
                }
              }}
              style={{ marginLeft: 5 }}
            >
              {label}
            </span>
          </Col>
          <Col span={8}>
            <Form.Item name="left_upload">
              {personTemplates.length === 0 ? (
                <small
                  style={{ fontSize: "20px", padding: "4px", color: "red" }}
                >
                  *
                </small>
              ) : (
                ""
              )}
              <Upload
                fileList={
                  personTemplates && personTemplates?.name !== ""
                    ? personTemplates
                    : []
                }
                onPreview={handleDownload}
                customRequest={(options) => {
                  let formData = new FormData();
                  formData.append("file", options.file);
                  formData.append("prefixFolder", crimeId);
                  const folderPath = `${crimeId}/${selectedModule}/reports`;
                  formData.append("folderPath", folderPath);
                  axios
                    .post(`${config.fileUpload}/upload`, formData)
                    .then(async (res) => {
                      if (res.status) {
                        const { data } = res.data;
                        const payloadData = first(data);
                        const payload = {
                          _id: selectedAccusedValue?.person?._id,
                          crimeId: crimeId,
                          accusedId: selectedAccusedValue?.person?._id,
                          action: selectedModule,
                          actionSubType: selectedModule,
                          templates: [
                            {
                              category: "Templates",
                              mimeType: payloadData.mimeType,
                              name: payloadData.name,
                              url: payloadData.url,
                              templateCode: fileName,
                              templateName: label,
                              fileId: payloadData.id,
                            },
                          ],
                        };
                        await dispatch(
                          uploadTemplates(config.templatesUpload, payload)
                        );
                        getInitialDiaptch();
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
                  disabled={disabled}
                  className="saveButton"
                  style={{
                    backgroundColor: disabled ? "#f5f5f5" : "#02599C",
                    borderColor: disabled ? "#d9d9d9" : "#02599C",
                    color: disabled ? "rgba(0, 0, 0, 0.25)" : "#FFF",
                  }}
                >
                  <CameraFilled style={{ float: "left" }} /> Upload
                </Button>
              </Upload>
            </Form.Item>
          </Col>
        </Row>
      );
    });
  };

  return displayReportGenerations();
}
