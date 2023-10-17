import { useEffect } from "react";
import { Row, Form, Upload, Button, notification, Col } from "antd";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { first, isUndefined, isEmpty } from "lodash";
import { config } from "@config/site.config";
import { CameraFilled, FilePdfOutlined } from "@ant-design/icons";
import mediaManagerActions from "@redux/fir/mediaManager/actions";

export default function UploadLetters({
  templateLists,
  showModal,
  disabled,
  selectedRecord,
  selectedModule,
  accusedId,
  forwardingThrough,
  selectedMOList,
  setSelectedLetterOfAdvice,
  setSelectedrRequisitionLetter,
  setSelectedLetterOfExpert,
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

  const displayReportGenerations = () => {
    return templateLists.map((item, i) => {
      const { fileName, label, fieldName } = item;
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
              onClick={() =>
                showModal && showModal(label, fileName, item.templateAvailable)
              }
              style={{ marginLeft: 5 }}
            >
              {label}
            </span>
          </Col>
          <Col span={8}>
            <Form.Item name={fieldName}>
              <Upload
                customRequest={(options) => {
                  const { crimeId, _id } =
                    !isUndefined(selectedRecord) && selectedRecord;
                  let formData = new FormData();
                  formData.append("file", options.file);
                  formData.append("prefixFolder", selectedRecord?.crimeId);
                  const folderPath = `${crimeId}/${selectedModule}/reports`;
                  formData.append("folderPath", folderPath);
                  axios
                    .post(`${config.fileUpload}/upload`, formData)
                    .then((res) => {
                      if (res.status) {
                        const { data } = res.data;
                        const payloadData = first(data);
                        if (fileName === "Generate_Letter_to_ACP") {
                          setSelectedrRequisitionLetter(data);
                        } else if (fileName === "Generate_Letter_of_Advice") {
                          setSelectedLetterOfAdvice(data);
                        } else if (fileName === "Generate_Letter_of_Expert") {
                          setSelectedLetterOfExpert(data);
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
                        const result = {
                          mimeType: payloadData.mimeType,
                          name: payloadData.name,
                          fileId: payloadData.id,
                        };
                        !isEmpty(selectedMOList) &&
                          selectedMOList.map((item) => {
                            if (forwardingThrough === "ACP") {
                              if (fileName === "Generate_Letter_to_ACP") {
                                item.requisitionLetter = result;
                              } else if (
                                fileName === "Generate_Letter_of_Advice"
                              ) {
                                item.letterOfAdvice = result;
                              }
                            }
                            if (fileName === "Generate_Letter_of_Expert") {
                              item.letterOfExpert = result;
                            }
                          });
                        dispatch(
                          uploadTemplates(config.templatesUpload, payload)
                        );
                        setTimeout(() => {
                          options.onSuccess("ok");
                        }, 0);
                      }
                    })
                    .catch((err) => {
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
