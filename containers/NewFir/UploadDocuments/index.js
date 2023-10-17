import {
  Row,
  Col,
  Form,
  Upload,
  Button,
  notification,
  Spin,
  Alert,
  Input,
} from "antd";
import { FirDetailsModuleWrapper } from "../styles";
import { CameraFilled, SaveOutlined } from "@ant-design/icons";
import { useState } from "react";
import {
  renderFieldsWithDropDown,
  dummyRequest,
  DATE_FORMAT_MM,
  getMediaUploadError,
} from "@containers/FirDetails/fir-util";
import axios from "axios";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { first, isEmpty, isUndefined } from "lodash";
import { config } from "@config/site.config";
import createFIRActions from "@redux/createFir/actions";
import SavedDocuments from "./SavedDocuments";
import { textFieldRules } from "@components/Common/formOptions";

export default function UploadDocuments({
  crimeId,
  uploadForm,
  disable,
  firType,
  isConsumed,
}) {
  const [serchText, setSerchText] = useState("");
  const dispatch = useDispatch();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedDocument, setUploadedDocument] = useState([]);
  const { savedFir } = useSelector((state) => state.createFIR);
  const { uploadDocumentDetails, deleteDocumentDetails } = createFIRActions;
  const openNotificationWithIcon = (type, message) => {
    return notification[type]({
      message: message,
    });
  };

  const handleSearch = (text) => {
    setSerchText(text);
  };

  const categoryList = [
    { label: "Complaint", name: "Complaint" },
    { label: "Statement", name: "Statement" },
    { label: "Panchnama", name: "Panchnama" },
    { label: "Suo moto", name: "Suo moto" },
    { label: "Others", name: "Others" },
  ];

  const getCommonPayload = (uploadDocuments) => {
    const firDetail = savedFir?.firDetail;
    const payload = {
      crimeId: savedFir?._id,
      preCrimeId: savedFir?.preCrime?._id,
      crimeSceneId: savedFir?.crimeScene,
      planOfActionId: savedFir?.planOfAction,
      crimeLocationId: savedFir?.crimeLocationId,
      firType: firType,
      isDraft: !isUndefined(isConsumed) ? true : savedFir?.isDraft,
      firDetail: {
        crimeType: firDetail?.crimeType,
        crimeSubType: firDetail?.crimeSubType,
        petitionNo: firDetail?.petitionNo,
        gravity: firDetail?.gravity,
        actsAndSections: firDetail?.actsAndSections,
        majorMinorClassification: firDetail?.majorMinorClassification,
        occurenceOfOffence: firDetail?.occurenceOfOffence,
        placeOfOccurence: firDetail?.placeOfOccurence,
        briefFacts: firDetail?.briefFacts,
        uploadDocuments: uploadDocuments,
        crimeShownBy: !isEmpty(savedFir?.complainantDetails)
          ? first(savedFir?.complainantDetails).person?.personalDetails?.name
          : "",
        firNum: firDetail?.firNum,
        district: firDetail?.district,
        districtCode: firDetail?.districtCode,
        firStatus: firDetail?.firStatus,
        psCode: firDetail?.psCode,
        psName: firDetail?.psName,
        dateOfReport: firDetail?.dateOfReport,
        firRegnum: firDetail?.firRegnum,
        lastmodifieddate: moment().format(DATE_FORMAT_MM),
        isRelatedToLicense: firDetail?.isRelatedToLicense,
        isSentToCourt: firDetail?.isSentToCourt,
        sentToCourtAt: firDetail?.sentToCourtAt,
        licenseNo: firDetail?.licenseNo,
        isPropertyStolen: firDetail?.isPropertyStolen,
      },
      preCrime: {
        patrolCarsBlueColts: false,
        toolkit: false,
      },
      accusedDetails: savedFir?.accusedDetails,
      victimDetails: savedFir?.victimDetails,
      complainantDetails: savedFir?.complainantDetails,
      stolenProperties: savedFir?.stolenProperties,
    };
    return payload;
  };

  const deleteMediaFile = (mediaPayload) => {
    const payload = getCommonPayload(mediaPayload);
    dispatch(deleteDocumentDetails(config.updateFIR, payload));
  };

  const submitDocumentDetails = async () => {
    const values = await uploadForm.validateFields();
    const formData = new FormData();
    uploadedDocument.forEach((file) => {
      formData.append("file", file.originFileObj);
    });
    formData.append("prefixFolder", crimeId);
    formData.append("folderPath", `${crimeId}/newFir/uploadDocuments`);
    setIsUploading(true);
    axios
      .post(`${config.fileUpload}/upload`, formData)
      .then((res) => {
        if (res.status) {
          setIsUploading(false);
          const { data } = res.data;
          const mediaPayload = data.map((file) => ({
            category: selectedCategory,
            otherCategory: values?.otherCategory,
            mimeType: file?.mimeType,
            team: file?.name,
            url: file?.url,
            fileId: file?.id,
          }));
          const existingUploadedDoc = savedFir?.firDetail?.uploadDocuments;
          if (isEmpty(existingUploadedDoc)) {
            const payload = getCommonPayload(mediaPayload);
            dispatch(uploadDocumentDetails(config.updateFIR, payload));
          } else {
            const existingMedia = [...existingUploadedDoc, ...mediaPayload];
            const payload = getCommonPayload(existingMedia);
            dispatch(uploadDocumentDetails(config.updateFIR, payload));
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
        "Supported File Format is PNG/JPEG/JPG/GIF/PDF"
      );
    }
  };

  return (
    <FirDetailsModuleWrapper>
      <Form form={uploadForm} layout="vertical">
        <Row gutter={24}>
          {!isEmpty(savedFir?.firDetail?.uploadDocuments) ? (
            <Col span={10}>
              <div style={{ overflowY: "scroll", maxHeight: 175 }}>
                <SavedDocuments
                  dataSource={savedFir?.firDetail?.uploadDocuments}
                  disable={disable}
                  openNotificationWithIcon={openNotificationWithIcon}
                  deleteMediaFile={deleteMediaFile}
                />
              </div>
            </Col>
          ) : null}
          <Col span={5} style={{ marginBottom: 20 }}>
            <Form.Item
              name="category"
              label="Upload Documents"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              {renderFieldsWithDropDown(
                categoryList,
                setSelectedCategory,
                handleSearch,
                serchText,
                180,
                disable
              )}
            </Form.Item>
          </Col>
          {selectedCategory === "Others" ? (
            <>
              <Col span={5} style={{ marginBottom: 10 }}>
                <Form.Item name="otherCategory" label="Others">
                  <Input
                    style={{ width: 180 }}
                    disabled={disable}
                    maxLength={textFieldRules.maxLength}
                  />
                </Form.Item>
              </Col>
            </>
          ) : null}
          <Col span={6}>
            <Form.Item name="uploadDocument" label="">
              <Upload
                accept="application/msword, application/pdf, image/*"
                fileList={uploadedDocument}
                customRequest={dummyRequest}
                onChange={(info) => onFileChange(info)}
              >
                <Button
                  disabled={disable}
                  className="saveButton"
                  style={{ marginTop: 30, width: 150 }}
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
        {!disable ? (
          <Button
            disabled={disable || isEmpty(uploadedDocument) || isUploading}
            className="saveButton"
            style={{ marginTop: 28 }}
            icon={<SaveOutlined className="saveButtonIcon" />}
            onClick={submitDocumentDetails}
          >
            Save
          </Button>
        ) : null}
      </Form>
    </FirDetailsModuleWrapper>
  );
}
