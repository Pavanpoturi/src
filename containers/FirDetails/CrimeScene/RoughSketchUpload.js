import Scrollbars from "@components/utility/customScrollBar";
import { isEmpty } from "lodash";
import { FileAddFilled } from "@ant-design/icons";
import { Row, Col, Upload, Button, notification } from "antd";
import {
  dummyRequest,
  renderFieldsWithDropDown,
} from "@containers/FirDetails/fir-util";

export default function RoughSketchUpload({
  minHeight,
  records,
  setInputFileList,
  disabled,
  fileList,
}) {
  const recordSelected =
    !isEmpty(records) && records.length > 1
      ? `${records.length} Record(s) Uploaded`
      : `${records.length} record uploaded`;

  const openNotificationWithIcon = (type, message) => {
    return notification[type]({
      message: message,
    });
  };

  const allowedFormat = [
    "image/png",
    "image/jpeg",
    "image/gif",
    "application/pdf",
  ];

  const onFileChange = (info) => {
    if (allowedFormat.includes(info?.file?.type)) {
      let fileList = [...info.fileList];
      fileList = fileList.map((file) => {
        if (file.response) {
          file.url = file.response.url;
        }
        return file;
      });
      setInputFileList(fileList);
    } else {
      openNotificationWithIcon(
        "error",
        "Supported File Format is PNG/JPEG/JPG/GIF/PDF"
      );
    }
  };

  return (
    <div style={{ padding: 15, minHeight: minHeight, height: minHeight }}>
      <Scrollbars style={{ width: "100%" }}>
        {!isEmpty(records) ? (
          <div style={{ marginBottom: 10 }}>
            <p>{recordSelected}</p>
          </div>
        ) : null}
        <Row gutter={24}>
          <Col span={22} style={{ marginBottom: 10 }}>
            <div className="heading" style={{ marginBottom: 10, fontSize: 16 }}>
              Select Category
            </div>
            {renderFieldsWithDropDown([], null, null, null, 200, disabled, "")}
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={10} style={{ marginLeft: 25 }}>
            <Upload
              accept="application/pdf, image/*"
              fileList={fileList}
              customRequest={dummyRequest}
              onChange={(info) => onFileChange(info)}
              multiple={true}
            >
              <Button
                type="primary"
                className="selectFile"
                style={{ backgroundColor: "#02599C", borderColor: "#02599C" }}
                disabled={disabled}
                icon={<FileAddFilled className="selectFileButtonIcon" />}
              >
                Select File
              </Button>
            </Upload>
          </Col>
        </Row>
      </Scrollbars>
    </div>
  );
}
