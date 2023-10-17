import { useEffect } from "react";
import { Row, Form, Upload, Button, notification, Col } from "antd";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { first, isEmpty, isUndefined } from "lodash";
import { config } from "@config/site.config";
import { getFileById } from "@containers/media-util";
import { CameraFilled, FilePdfOutlined } from "@ant-design/icons";
import mediaManagerActions from "@redux/fir/mediaManager/actions";

export default function UploadLetters({
  templateLists,
  showModal,
  disabled,
  selectedRecord,
  selectedModule,
  accusedId,
  setIsform1Uploaded,
  setIsform2Uploaded,
  setIsformReportUploaded,
  isform1Uploaded,
  isform2Uploaded,
  isformReportUploaded,
  setIsFormUpload,
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

  const getFilesList = (fileName) => {
    let fileList = undefined;
    const ackLetter =
      !isEmpty(isformReportUploaded) && first(isformReportUploaded);
    const formOneLetter = !isEmpty(isform1Uploaded) && first(isform1Uploaded);
    const formTwoLetter = !isEmpty(isform2Uploaded) && first(isform2Uploaded);
    switch (fileName) {
      case "Acknowledgement_template_letter":
        if (ackLetter) {
          fileList = [
            {
              name: ackLetter?.name,
              url: ackLetter?.url,
              fileId: ackLetter?.fileId,
            },
          ];
        }
        break;
      case "Road_accident_insurance_template_letter":
        if (formOneLetter) {
          fileList = [
            {
              name: formOneLetter?.name,
              url: formOneLetter?.url,
              fileId: formOneLetter?.fileId,
            },
          ];
        }
        break;
      case "Detailed_Accident_Report_template_letter":
        if (formTwoLetter) {
          fileList = [
            {
              name: formTwoLetter?.name,
              url: formTwoLetter?.url,
              fileId: formTwoLetter?.fileId,
            },
          ];
        }
        break;
      default:
        fileList = [];
    }
    return fileList;
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
  }, [
    uploadActionType,
    isform1Uploaded,
    isform2Uploaded,
    isformReportUploaded,
  ]);

  const handleDownload = (file) => {
    getFileById(file?.fileId, file?.name, file?.url);
  };

  const displayReportGenerations = () => {
    return templateLists.map((item, i) => {
      const { fileName, label, fieldName } = item;
      return (
        <Row className="row-item" key={i}>
          <Col
            span={16}
            style={{
              color: "#02599c",
              fontSize: 15,
              cursor: "pointer",
            }}
          >
            <FilePdfOutlined />
            <span
              onClick={() =>
                showModal && showModal(label, fileName, item.templateAvailable)
              }
              style={{ marginLeft: 5, textDecoration: "underline" }}
            >
              {label}
            </span>
            <small
              style={{
                fontSize: "20px",
                padding: "4px",
                color: "red",
                textDecoration: "none",
              }}
            >
              *
            </small>
          </Col>
          <Col span={8}>
            <Form.Item name={fieldName}>
              <Upload
                fileList={getFilesList(fileName)}
                onPreview={(file) => handleDownload(file)}
                customRequest={(options) => {
                  const { crimeId, _id } =
                    !isUndefined(selectedRecord) && selectedRecord;
                  let formData = new FormData();
                  formData.append("file", options.file);
                  formData.append("prefixFolder", selectedRecord?.crimeId);
                  const folderPath = `${crimeId}/${selectedModule}/reports`;
                  formData.append("folderPath", folderPath);
                  setIsFormUpload(true);
                  axios
                    .post(`${config.fileUpload}/upload`, formData)
                    .then((res) => {
                      if (res.status) {
                        const { data } = res.data;
                        const payloadData = first(data);
                        if (fileName === "Acknowledgement_template_letter") {
                          setIsformReportUploaded(data);
                        } else if (
                          fileName === "Road_accident_insurance_template_letter"
                        ) {
                          setIsform1Uploaded(data);
                        } else if (
                          fileName ===
                          "Detailed_Accident_Report_template_letter"
                        ) {
                          setIsform2Uploaded(data);
                        }
                        const payload = {
                          _id: _id,
                          crimeId: crimeId,
                          accusedId: accusedId,
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
                        dispatch(
                          uploadTemplates(config.templatesUpload, payload)
                        );
                        setTimeout(() => {
                          options.onSuccess("ok");
                        }, 0);
                        setIsFormUpload(false);
                      }
                    })
                    .catch((err) => {
                      setIsFormUpload(false);
                      if (err && err?.response?.status === 400) {
                        const errorDetails = JSON.parse(
                          err?.response?.data?.error.description
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
