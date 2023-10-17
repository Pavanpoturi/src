/* eslint-disable array-callback-return */
import {
  Row,
  Col,
  Form,
  Input,
  DatePicker,
  Upload,
  Button,
  notification,
  Spin,
  Alert,
} from "antd";
import { useState, useEffect } from "react";
import { textFieldRules } from "@components/Common/formOptions";
import {
  DATE_FORMAT,
  renderFieldsWithDropDown,
  dummyRequest,
  onFileChange,
  folderName,
  getMediaPayload,
  getMediaUploadError,
} from "@containers/FirDetails/fir-util";
import axios from "axios";
import { isEmpty, isArray, first } from "lodash";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { config } from "@config/site.config";
import Loader from "@components/utility/loader";
import audioVideoActions from "@redux/investigations/collectionOfEvidence/digitalEvidence/audioVideoClipping/actions";
import { loadState } from "@lib/helpers/localStorage";
import { CameraFilled } from "@ant-design/icons";
import { getAuditHistoryPayload } from "@containers/const";
import auditHistoryActions from "@redux/auditHistory/actions";
import { getFileById } from "@containers/media-util";
import { audioVideoClippingForm } from "./const";
import SaveResetButton from "../SaveResetButton";
import { getEvidenceListData } from "../const";
import SavedAudioVideoClippingsRecords from "./SavedAudioVideoClippingsRecords";

export default function AudioVideoClippings({
  editAudioVideoClippingObj,
  setEditAudioVideoClippingObj,
  viewAudioVideoClippingDetails,
  setViewAudioVideoClippingDetails,
  selectedTab,
}) {
  const [audioVideoClipForms] = Form.useForm();
  const dispatch = useDispatch();
  const crimeId = loadState("selectedFirId");
  const [formValid, setFormValid] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [serchText, setSerchText] = useState("");
  const [upload65BCertificate, setUpload65BCertificate] = useState([]);
  const [selectedUpload65BCertificate, setSelectedUpload65BCertificate] =
    useState([]);
  const [uploadAudioVideoClipping, setUploadAudioVideoClipping] = useState([]);
  const [
    selectedUploadAudioVideoClipping,
    setSelectedUploadAudioVideoClipping,
  ] = useState([]);
  const { createAuditHistory } = auditHistoryActions;
  const { evidenceCollectionList } = useSelector((state) => state.MasterData);
  const { savedFir } = useSelector((state) => state.createFIR);
  const disableForm =
    savedFir?.caseStatus === "Disposal" ||
    savedFir?.isTransferOfCaseFile === true ||
    savedFir?.isChargeSheetTakenOrFiled === true;

  const {
    addAudioVideoClippingDetails,
    updateAudioVideoClippingDetails,
    getAudioVideoClippingList,
    resetActionType,
  } = audioVideoActions;
  const {
    actionType,
    errorMessage,
    successMessage,
    audioVideoClippingList,
    isFetching,
  } = useSelector((state) => state.AudioVideoClipping);

  const isSuccess =
    actionType === "ADD_AUDIO_VIDEO_CLIPPINGS_SUCCESS" ||
    actionType === "UPDATE_AUDIO_VIDEO_CLIPPINGS_SUCCESS";
  const isError =
    actionType === "ADD_AUDIO_VIDEO_CLIPPINGS_ERROR" ||
    actionType === "UPDATE_AUDIO_VIDEO_CLIPPINGS_ERROR";

  const checkFields = async () => {
    const values = await audioVideoClipForms.validateFields();
    setFormValid(!Object.values(values).every((v) => v == null || v === ""));
  };

  const openNotificationWithIcon = (type, message) => {
    return notification[type]({
      message: message,
    });
  };

  const auditHistoryEntry = () => {
    const auditType =
      actionType === "ADD_AUDIO_VIDEO_CLIPPINGS_SUCCESS"
        ? "Audio/Video Clippings Added"
        : "Audio/Video Clippings Updated";
    dispatch(
      createAuditHistory(
        config.createAudits,
        getAuditHistoryPayload(
          crimeId,
          "investigation/digitalEvidence/audioVideoClippings",
          auditType
        )
      )
    );
  };

  const fetchAudioVideoClippingsList = () => {
    dispatch(
      getAudioVideoClippingList(
        `${config.getEvidenceDetails}/AV/?crimeId=${crimeId}`
      )
    );
  };

  useEffect(() => {
    fetchAudioVideoClippingsList();
  }, []);

  useEffect(() => {
    if (isSuccess || isError) {
      if (
        successMessage === "Audio/Video clippings successfully added" ||
        successMessage === "Audio/Video clippings successfully updated"
      ) {
        openNotificationWithIcon("success", successMessage);
        auditHistoryEntry();
        audioVideoClipForms.resetFields();
        setViewAudioVideoClippingDetails(false);
        setEditAudioVideoClippingObj(null);
        setUpload65BCertificate([]);
        setSelectedUpload65BCertificate([]);
        setUploadAudioVideoClipping([]);
        setSelectedUploadAudioVideoClipping([]);
        dispatch(resetActionType());
        fetchAudioVideoClippingsList();
      } else if (errorMessage) {
        openNotificationWithIcon("error", errorMessage);
        dispatch(resetActionType());
      }
    }
  }, [actionType]);

  const handleSearch = (text) => {
    setSerchText(text);
  };

  const displayState = (data, actionName) => {
    return (
      <Row gutter={24}>
        {data.map((s, i) => {
          return (
            <Col span={8} key={i} style={{ marginBottom: 10, padding: 0 }}>
              <Form.Item name={s.name} label={s.label}>
                {actionName(s.name)}
              </Form.Item>
            </Col>
          );
        })}
      </Row>
    );
  };

  const getDropdownValues = (entity) => {
    return (
      !isEmpty(evidenceCollectionList) &&
      evidenceCollectionList.filter((s) => s.entity === entity)
    );
  };

  const videoSourceList = getEvidenceListData(getDropdownValues("videoSource"));
  const deviceCollectedList = getEvidenceListData(
    getDropdownValues("deviceCollected")
  );
  const strengthOfEvidence = getEvidenceListData(
    getDropdownValues("strengthOfEvidence")
  );

  const displayFields = (name) => {
    switch (name) {
      case "sourceofAudioVideo":
        return renderFieldsWithDropDown(
          videoSourceList,
          null,
          handleSearch,
          serchText,
          230,
          viewAudioVideoClippingDetails || disableForm
        );
      case "deviceCollected":
        return renderFieldsWithDropDown(
          deviceCollectedList,
          null,
          handleSearch,
          serchText,
          230,
          viewAudioVideoClippingDetails || disableForm
        );
      case "dateOfCollection":
        return (
          <DatePicker
            format={DATE_FORMAT}
            style={{ width: 230 }}
            onChange={checkFields}
            disabled={viewAudioVideoClippingDetails || disableForm}
          />
        );
      case "strengthOfEvidence":
        return renderFieldsWithDropDown(
          strengthOfEvidence,
          null,
          handleSearch,
          serchText,
          230,
          viewAudioVideoClippingDetails || disableForm
        );
      default:
        return (
          <Input
            onChange={checkFields}
            style={{ width: 230 }}
            maxLength={textFieldRules.maxLength}
            disabled={viewAudioVideoClippingDetails || disableForm}
          />
        );
    }
  };

  const onReset = () => {
    audioVideoClipForms.resetFields();
    setViewAudioVideoClippingDetails(false);
    setEditAudioVideoClippingObj(null);
    setUpload65BCertificate([]);
    setSelectedUpload65BCertificate([]);
    setUploadAudioVideoClipping([]);
    setSelectedUploadAudioVideoClipping([]);
    dispatch(resetActionType());
    checkFields();
  };

  useEffect(() => {
    onReset();
  }, [selectedTab]);

  const getPayloadData = (values, upload65BCertificate, audioVideoClipping) => {
    const payload = {
      crimeId: crimeId,
      data: {
        sourceofAudioVideo: values?.sourceofAudioVideo,
        deviceCollected: values?.deviceCollected,
        dateOfCollection: values?.dateOfCollection,
        strengthOfEvidence: values?.strengthOfEvidence,
        upload65BCertificate: upload65BCertificate,
        audioVideoClipping: audioVideoClipping,
      },
    };

    return payload;
  };

  const submit = async () => {
    const values = await audioVideoClipForms.validateFields();
    const audioVideoClippingFormData = new FormData();
    uploadAudioVideoClipping.forEach((file) => {
      audioVideoClippingFormData.append("file", file.originFileObj);
    });
    audioVideoClippingFormData.append("prefixFolder", crimeId);
    audioVideoClippingFormData.append(
      "folderPath",
      `${crimeId}/${folderName.DIGITAL_EVIDENCE}/audioVideoClippings`
    );

    const upload65BCertificateFormData = new FormData();
    upload65BCertificate.forEach((file) => {
      upload65BCertificateFormData.append("file", file.originFileObj);
    });
    upload65BCertificateFormData.append("prefixFolder", crimeId);
    upload65BCertificateFormData.append(
      "folderPath",
      `${crimeId}/${folderName.DIGITAL_EVIDENCE}/file`
    );

    if (!isEmpty(uploadAudioVideoClipping) && !isEmpty(upload65BCertificate)) {
      setIsUploading(true);
      axios
        .all([
          axios.post(`${config.fileUpload}/upload`, audioVideoClippingFormData),
          axios.post(
            `${config.fileUpload}/upload`,
            upload65BCertificateFormData
          ),
        ])
        .then(
          axios.spread((data1, data2) => {
            if (data1.status === 200 && data2.status === 200) {
              setIsUploading(false);
              const audioVideoClippingResult = data1.data?.data;
              const upload65BResult = data2.data?.data;
              const uploadAudioVideoReport = getMediaPayload(
                audioVideoClippingResult,
                folderName.DIGITAL_EVIDENCE
              );
              const upload65BReportResult = first(
                getMediaPayload(upload65BResult, folderName.DIGITAL_EVIDENCE)
              );

              if (editAudioVideoClippingObj?._id) {
                const updatePayload = {
                  avId: editAudioVideoClippingObj?._id,
                  ...getPayloadData(
                    values,
                    upload65BReportResult,
                    uploadAudioVideoReport
                  ),
                };
                dispatch(
                  updateAudioVideoClippingDetails(
                    config.updateAudioVideo,
                    updatePayload
                  )
                );
              } else {
                dispatch(
                  addAudioVideoClippingDetails(
                    config.addAudioVideo,
                    getPayloadData(
                      values,
                      upload65BReportResult,
                      uploadAudioVideoReport
                    )
                  )
                );
              }
            }
          })
        )
        .catch((err) => {
          getMediaUploadError(err, openNotificationWithIcon);
        });
    } else if (
      isEmpty(uploadAudioVideoClipping) &&
      !isEmpty(upload65BCertificate)
    ) {
      setIsUploading(true);
      axios
        .post(`${config.fileUpload}/upload`, upload65BCertificateFormData)
        .then((res) => {
          if (res.status === 200) {
            setIsUploading(false);
            const existingAudioVideo =
              !isEmpty(editAudioVideoClippingObj?.audioVideoClipping) &&
              editAudioVideoClippingObj?.audioVideoClipping;
            const { data } = res.data;
            const upload65BReportResult = first(
              getMediaPayload(data, folderName.DIGITAL_EVIDENCE)
            );

            if (editAudioVideoClippingObj?._id) {
              const updatePayload = {
                avId: editAudioVideoClippingObj?._id,
                ...getPayloadData(
                  values,
                  upload65BReportResult,
                  existingAudioVideo
                ),
              };
              dispatch(
                updateAudioVideoClippingDetails(
                  config.updateAudioVideo,
                  updatePayload
                )
              );
            } else {
              dispatch(
                addAudioVideoClippingDetails(
                  config.addAudioVideo,
                  getPayloadData(
                    values,
                    upload65BReportResult,
                    existingAudioVideo
                  )
                )
              );
            }
          }
        })
        .catch((err) => {
          getMediaUploadError(err, openNotificationWithIcon);
        });
    } else if (
      !isEmpty(uploadAudioVideoClipping) &&
      isEmpty(upload65BCertificate)
    ) {
      setIsUploading(true);
      axios
        .post(`${config.fileUpload}/upload`, upload65BCertificateFormData)
        .then((res) => {
          if (res.status === 200) {
            setIsUploading(false);
            const existing65BCertificate =
              editAudioVideoClippingObj?.upload65BCertificate &&
              editAudioVideoClippingObj?.upload65BCertificate;
            const { data } = res.data;
            const uploadAudioVideoReport = getMediaPayload(
              data,
              folderName.DIGITAL_EVIDENCE
            );

            if (editAudioVideoClippingObj?._id) {
              const updatePayload = {
                avId: editAudioVideoClippingObj?._id,
                ...getPayloadData(
                  values,
                  existing65BCertificate,
                  uploadAudioVideoReport
                ),
              };
              dispatch(
                updateAudioVideoClippingDetails(
                  config.updateAudioVideo,
                  updatePayload
                )
              );
            } else {
              dispatch(
                addAudioVideoClippingDetails(
                  config.addAudioVideo,
                  getPayloadData(
                    values,
                    existing65BCertificate,
                    uploadAudioVideoReport
                  )
                )
              );
            }
          }
        })
        .catch((err) => {
          getMediaUploadError(err, openNotificationWithIcon);
        });
    } else if (
      isEmpty(uploadAudioVideoClipping) &&
      isEmpty(upload65BCertificate)
    ) {
      const audioVideo =
        !isEmpty(editAudioVideoClippingObj?.audioVideoClipping) &&
        editAudioVideoClippingObj?.audioVideoClipping;
      const certificate65B =
        editAudioVideoClippingObj?.upload65BCertificate &&
        editAudioVideoClippingObj?.upload65BCertificate;
      const existingAudioVideo = !isEmpty(audioVideo) ? audioVideo : [];
      const existing65BCertificate = certificate65B ? certificate65B : {};
      if (editAudioVideoClippingObj?._id) {
        const updatePayload = {
          avId: editAudioVideoClippingObj?._id,
          ...getPayloadData(values, existing65BCertificate, existingAudioVideo),
        };
        dispatch(
          updateAudioVideoClippingDetails(
            config.updateAudioVideo,
            updatePayload
          )
        );
      } else {
        dispatch(
          addAudioVideoClippingDetails(
            config.addAudioVideo,
            getPayloadData(values, existing65BCertificate, existingAudioVideo)
          )
        );
      }
    }
  };

  const handleEditAudioVideoClippings = (values) => {
    if (values) {
      setEditAudioVideoClippingObj(values);
      setViewAudioVideoClippingDetails(false);
      if (
        values?.upload65BCertificate &&
        values?.upload65BCertificate?.url !== ""
      ) {
        setSelectedUpload65BCertificate([values?.upload65BCertificate]);
      } else {
        setSelectedUpload65BCertificate([]);
      }
      if (values?.audioVideoClipping) {
        setSelectedUploadAudioVideoClipping(values.audioVideoClipping);
      } else {
        setSelectedUploadAudioVideoClipping([]);
      }
      audioVideoClipForms.setFieldsValue({
        sourceofAudioVideo: values?.sourceofAudioVideo,
        deviceCollected: values?.deviceCollected,
        strengthOfEvidence: values?.strengthOfEvidence,
        dateOfCollection: moment(new Date(values?.dateOfCollection)).isValid()
          ? moment(new Date(values?.dateOfCollection))
          : "",
      });
    }
  };

  const handleDownload = (file) => {
    getFileById(file?.fileId, file?.name, file?.url);
  };

  return isFetching ? (
    <Loader />
  ) : (
    <div>
      <Form
        form={audioVideoClipForms}
        layout="vertical"
        style={{ padding: 20 }}
      >
        {displayState(audioVideoClippingForm, displayFields)}
        <Row gutter={24}>
          <Col span={12} style={{ marginBottom: 10, padding: 0 }}>
            <Form.Item name="upload65BCertificate" label="">
              <Upload
                fileList={
                  editAudioVideoClippingObj?._id &&
                  editAudioVideoClippingObj?.upload65BCertificate &&
                  editAudioVideoClippingObj?.upload65BCertificate?.url !== ""
                    ? selectedUpload65BCertificate
                    : upload65BCertificate
                }
                onPreview={handleDownload}
                customRequest={dummyRequest}
                onChange={(info) => onFileChange(info, setUpload65BCertificate)}
                multiple={false}
              >
                <Button
                  className="saveButton"
                  style={{ marginTop: 22, width: 320, marginBottom: 10 }}
                  icon={<CameraFilled style={{ float: "left" }} />}
                  disabled={
                    viewAudioVideoClippingDetails ||
                    !isEmpty(upload65BCertificate) ||
                    disableForm
                  }
                >
                  Upload 65B Evidence Act Certificate
                </Button>
              </Upload>
            </Form.Item>
          </Col>
          <Col span={12} style={{ marginBottom: 10, padding: 0 }}>
            <Form.Item name="audioVideoClipping" label="">
              <Upload
                accept="video/*, audio/*"
                fileList={
                  editAudioVideoClippingObj?._id &&
                  editAudioVideoClippingObj?.audioVideoClipping &&
                  !isEmpty(editAudioVideoClippingObj?.audioVideoClipping)
                    ? selectedUploadAudioVideoClipping
                    : uploadAudioVideoClipping
                }
                onPreview={handleDownload}
                customRequest={dummyRequest}
                onChange={(info) =>
                  onFileChange(info, setUploadAudioVideoClipping)
                }
                multiple={true}
              >
                <Button
                  className="saveButton"
                  style={{ marginTop: 22, width: 280, marginBottom: 10 }}
                  icon={<CameraFilled style={{ float: "left" }} />}
                  disabled={
                    viewAudioVideoClippingDetails || isUploading || disableForm
                  }
                >
                  Upload Audio / Video clippings
                </Button>
              </Upload>
            </Form.Item>
          </Col>
          {isUploading ? (
            <Spin tip="Uploading...">
              <Alert
                message="File upload is in progress. Please wait!!"
                type="info"
              />
            </Spin>
          ) : null}
        </Row>
      </Form>
      <SaveResetButton
        onSubmit={submit}
        disabled={
          viewAudioVideoClippingDetails ||
          disableForm ||
          isUploading ||
          (isEmpty(uploadAudioVideoClipping) &&
            isEmpty(selectedUploadAudioVideoClipping)) ||
          (isEmpty(upload65BCertificate) &&
            isEmpty(selectedUpload65BCertificate))
        }
        onReset={onReset}
      />
      {isArray(audioVideoClippingList) && !isEmpty(audioVideoClippingList) ? (
        <div style={{ maxHeight: 400, overflowY: "auto", marginTop: 20 }}>
          <SavedAudioVideoClippingsRecords
            dataSource={audioVideoClippingList}
            editDetails={handleEditAudioVideoClippings}
            setViewDetails={setViewAudioVideoClippingDetails}
            selectedRecord={editAudioVideoClippingObj}
            disableForm={disableForm}
          />
        </div>
      ) : null}
    </div>
  );
}
