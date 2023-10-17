import { Row, Form, Upload, Button, notification, Col } from "antd";
import axios from "axios";
import { first, isUndefined } from "lodash";
import { getFilePayload } from "@containers/FirDetails/fir-util";
import { config } from "@config/site.config";
import { CameraFilled, FilePdfOutlined } from "@ant-design/icons";

export default function UploadLetters({
  templateLists,
  showModal,
  disabled,
  selectedRecord,
  selectedModule,
  setUploadedItem,
}) {
  const openNotificationWithIcon = (type, message) => {
    return notification[type]({
      message: message,
    });
  };

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
              onClick={() =>
                showModal && showModal(label, fileName, item.templateAvailable)
              }
              style={{ marginLeft: 5 }}
            >
              {label}
            </span>
          </Col>
          <Col span={8}>
            <Form.Item name="left_upload">
              <Upload
                customRequest={(options) => {
                  const { crimeId } =
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
                        const payloadData = getFilePayload(first(data));
                        openNotificationWithIcon(
                          "success",
                          "File Uploaded Successfully"
                        );
                        setUploadedItem(payloadData);
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
                  style={{
                    backgroundColor: disabled ? "#f5f5f5" : "#02599C",
                    borderColor: disabled ? "#d9d9d9" : "#02599C",
                    color: disabled ? "rgba(0, 0, 0, 0.25)" : "#FFF",
                    marginLeft: 10,
                  }}
                >
                  <CameraFilled style={{ float: "left", marginTop: 4 }} />{" "}
                  Upload
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
