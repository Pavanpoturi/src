import {
  Row,
  Col,
  Form,
  Upload,
  Button,
  notification,
  Spin,
  Alert,
} from "antd";
import { CameraFilled, SaveOutlined } from "@ant-design/icons";
import { useState } from "react";
import {
  renderFieldsWithDropDown,
  dummyRequest,
  getMediaUploadError,
} from "@containers/FirDetails/fir-util";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { isEmpty } from "lodash";
import { loadState } from "@lib/helpers/localStorage";
import { config } from "@config/site.config";
import SavedDocuments from "./SavedDocuments";

export default function UploadInterrogationReport({
  disabled,
  selectedAccused,
  selectedRecord,
  addDetails,
  deleteInterrogationReport,
}) {
  const [serchText, setSerchText] = useState("");
  const dispatch = useDispatch();
  const [uploadForm] = Form.useForm();
  const crimeId = loadState("selectedFirId");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedDocument, setUploadedDocument] = useState([]);
  const { savedFir } = useSelector((state) => state.createFIR);

  const openNotificationWithIcon = (type, message) => {
    return notification[type]({
      message: message,
    });
  };

  const handleSearch = (text) => {
    setSerchText(text);
  };

  const categoryList = [{ label: "Accused", name: "Accused" }];

  const getCommonPayload = (photographs) => {
    const payload = {
      crimeId: savedFir?._id,
      person: selectedAccused,
      photographs: photographs,
    };
    return payload;
  };

  const deleteMediaFile = (mediaPayload) => {
    const payload = getCommonPayload(mediaPayload);
    dispatch(deleteInterrogationReport(config.interrogation, payload));
  };

  const submitDocumentDetails = async () => {
    const formData = new FormData();
    uploadedDocument.forEach((file) => {
      formData.append("file", file.originFileObj);
    });
    formData.append("prefixFolder", crimeId);
    formData.append(
      "folderPath",
      `${crimeId}/interrogationReport/uploadedReports`
    );
    setIsUploading(true);
    axios
      .post(`${config.fileUpload}/upload`, formData)
      .then((res) => {
        if (res.status) {
          setIsUploading(false);
          const { data } = res.data;
          const mediaPayload = data.map((file) => {
            return {
              category: selectedCategory,
              mimeType: file?.mimeType,
              name: file?.name,
              url: file?.url,
              fileId: file?.id,
            };
          });
          const existingUploadedDoc = selectedRecord;
          if (isEmpty(existingUploadedDoc)) {
            const payload = getCommonPayload(mediaPayload);
            dispatch(addDetails(config.interrogation, payload));
          } else {
            const existingMedia = [...existingUploadedDoc, ...mediaPayload];
            const payload = getCommonPayload(existingMedia);
            dispatch(addDetails(config.interrogation, payload));
          }
        }
      })
      .catch((err) => {
        getMediaUploadError(err, openNotificationWithIcon);
        setIsUploading(false);
      });
  };

  const allowedFormat = [
    "image/png",
    "image/jpeg",
    "image/gif",
    "application/pdf",
    "application/msword",
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
      setUploadedDocument(fileList);
    } else {
      openNotificationWithIcon(
        "error",
        "Supported File Format is PNG/JPEG/JPG/GIF/PDF/MS Word Document"
      );
    }
  };

  return (
    <Form form={uploadForm} layout="vertical">
      <Row gutter={24}>
        {!isEmpty(selectedRecord) ? (
          <Col span={10}>
            <div style={{ overflowY: "scroll", maxHeight: 175 }}>
              <SavedDocuments
                dataSource={selectedRecord}
                disable={disabled}
                openNotificationWithIcon={openNotificationWithIcon}
                deleteMediaFile={deleteMediaFile}
              />
            </div>
          </Col>
        ) : null}
        <Col span={6} style={{ marginBottom: 20 }}>
          <Form.Item
            name="category"
            label="Upload Reports"
            rules={[
              {
                required: true,
                message: "Please Upload Document!",
              },
            ]}
          >
            {renderFieldsWithDropDown(
              categoryList,
              setSelectedCategory,
              handleSearch,
              serchText,
              222,
              disabled
            )}
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item name="uploadDocument" label="">
            <Upload
              accept="application/msword, application/pdf, image/*"
              fileList={uploadedDocument}
              customRequest={dummyRequest}
              onChange={(info) => onFileChange(info)}
              multiple={true}
            >
              <Button
                disabled={disabled}
                className="saveButton"
                style={{ marginTop: 23 }}
                icon={<CameraFilled className="saveButtonIcon" />}
              >
                Select File
              </Button>
            </Upload>
          </Form.Item>
        </Col>
        {isUploading ? (
          <Col span={6} style={{ marginTop: 25 }}>
            <Spin tip="Uploading...">
              <Alert
                message="Document upload is in progress. Please wait!!"
                type="info"
              />
            </Spin>
          </Col>
        ) : null}
      </Row>
      {!disabled ? (
        <Button
          disabled={disabled || isEmpty(uploadedDocument) || isUploading}
          className="saveButton"
          style={{ marginTop: 28 }}
          icon={<SaveOutlined className="saveButtonIcon" />}
          onClick={submitDocumentDetails}
        >
          Save
        </Button>
      ) : null}
    </Form>
  );
}
