/* eslint-disable array-callback-return */
import {
  Row,
  Col,
  Form,
  Input,
  DatePicker,
  Radio,
  Upload,
  Button,
  notification,
  Spin,
  Alert,
  Divider,
  Card,
} from "antd";
import { useState, useEffect } from "react";
import { textFieldRules, textAreaRules } from "@components/Common/formOptions";
import {
  DATE_FORMAT,
  renderFieldsWithDropDown,
  dummyRequest,
  shortAddress,
  folderName,
  getMediaPayload,
  getMediaUploadError,
  getPersonDetails,
  onFileChange,
} from "@containers/FirDetails/fir-util";
import axios from "axios";
import { isEmpty, isArray, first, isUndefined, isNull } from "lodash";
import moment from "moment";
import { config } from "@config/site.config";
import Loader from "@components/utility/loader";
import { useDispatch, useSelector } from "react-redux";
import AddPerson from "@containers/FirDetails/Investigation/CommonForms/AddPerson";
import cctvFootageActions from "@redux/investigations/collectionOfEvidence/digitalEvidence/cctvFootage/actions";
import { loadState } from "@lib/helpers/localStorage";
import AddPersonAddress from "@containers/FirDetails/Investigation/CommonForms/AddPersonAddress";
import { CameraFilled, SaveOutlined } from "@ant-design/icons";
import { getAuditHistoryPayload } from "@containers/const";
import auditHistoryActions from "@redux/auditHistory/actions";
import { getFileById } from "@containers/media-util";
import { cctvFootageForm } from "./const";
import SaveResetButton from "../SaveResetButton";
import SavedCCTVFootageRecords from "./SavedCCTVFootageRecords";
import { getEvidenceListData } from "../const";

const { TextArea } = Input;
const { RangePicker } = DatePicker;

export default function CCTVFootage({
  editCCTVFootageObj,
  setEditCCTVFootageObj,
  viewCCTVFootageDetails,
  setViewCCTVFootageDetails,
  selectedTab,
}) {
  const dispatch = useDispatch();
  const crimeId = loadState("selectedFirId");
  const [cctvFootageForms] = Form.useForm();
  const [requisitionForm] = Form.useForm();
  const [enhancedVideoForm] = Form.useForm();
  const [addressForm] = Form.useForm();
  const [ownerForm] = Form.useForm();
  const [nameAndDesignationForm] = Form.useForm();
  const [person65BForm] = Form.useForm();
  const [age, setAge] = useState("");
  const [inputList, setInputList] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isEnhancedUploading, setIsEnhancedUploading] = useState(false);
  const [isAddressModalVisible, setIsAddressModalVisible] = useState(false);
  const [
    isNameAndDesignationModalVisible,
    setIsNameAndDesignationModalVisible,
  ] = useState(false);
  const [isOwnerModalVisible, setIsOwnerModalVisible] = useState(false);
  const [isPerson65BNameModalVisible, setIsPerson65BNameModalVisible] =
    useState(false);
  const [isNoticeRequired, setIsNoticeRequired] = useState("");
  const [formValid, setFormValid] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState({});
  const [selectedOwner, setSelectedOwner] = useState({});
  const [selectedPerson65B, setSelectedPerson65B] = useState({});
  const [upload65BCertificate, setUpload65BCertificate] = useState([]);
  const [selectedItemsForRequisition, setSelectedItemsForRequisition] =
    useState([]);
  const [selectedItemsForEnhanced, setSelectedItemsForEnhanced] = useState([]);
  const [selectedUpload65BCertificate, setSelectedUpload65BCertificate] =
    useState([]);
  const [uploadVideoFootage, setUploadVideoFootage] = useState([]);
  const [selectedUploadVideoFootage, setSelectedUploadVideoFootage] = useState(
    []
  );
  const [uploadEnhanced65BCertificate, setUploadEnhanced65BCertificate] =
    useState([]);
  const [uploadEnhancedVideoFootage, setUploadEnhancedVideoFootage] = useState(
    []
  );
  const [isEnhancedVideoModalVisible, setIsEnhancedVideoModalVisible] =
    useState(false);
  const [
    selectedNameAndDesignationOfPerson,
    setSelectedNameAndDesignationOfPerson,
  ] = useState([]);

  const [serchText, setSerchText] = useState("");
  const { evidenceCollectionList } = useSelector((state) => state.MasterData);
  const { createAuditHistory } = auditHistoryActions;
  const { savedFir } = useSelector((state) => state.createFIR);
  const disableForm =
    savedFir?.caseStatus === "Disposal" ||
    savedFir?.isTransferOfCaseFile === true ||
    savedFir?.isChargeSheetTakenOrFiled === true;

  const {
    addCCTVFootageDetails,
    updateCCTVFootageDetails,
    getCCTVFootageList,
    resetActionType,
    sendRequisitionDetails,
    uploadEnhancedDetails,
    resetRequisitionActionType,
    resetEnhancedActionType,
  } = cctvFootageActions;

  const {
    actionType,
    errorMessage,
    successMessage,
    cctvFootageList,
    isFetching,
    requisitionErrorMessage,
    requisitionSuccessMessage,
    requisitionActionType,
    enhancedErrorMessage,
    enhancedSuccessMessage,
    enhancedActionType,
  } = useSelector((state) => state.CCTVFootage);

  const isSuccess =
    actionType === "ADD_CCTV_SUCCESS" || actionType === "UPDATE_CCTV_SUCCESS";
  const isError =
    actionType === "ADD_CCTV_ERROR" || actionType === "UPDATE_CCTV_ERROR";

  const isRequisitionSuccess =
    requisitionActionType === "SEND_REQUISITION_SUCCESS";
  const isRequisitionError = requisitionActionType === "SEND_REQUISITION_ERROR";

  const isEnhancedSuccess = enhancedActionType === "UPLOAD_ENHANCED_SUCCESS";
  const isEnhancedError = enhancedActionType === "UPLOAD_ENHANCED_ERROR";

  const auditHistoryEntry = () => {
    const auditType =
      actionType === "ADD_CCTV_SUCCESS"
        ? "CCTV Footage Added"
        : "CCTV Footage Updated";
    dispatch(
      createAuditHistory(
        config.createAudits,
        getAuditHistoryPayload(
          crimeId,
          "investigation/digitalEvidence/CCTVFootage",
          auditType
        )
      )
    );
  };

  const handleDownload = (file) => {
    getFileById(file?.fileId, file?.name, file?.url);
  };

  const handlePerson65BOk = async () => {
    const values = await person65BForm.validateFields();
    setSelectedPerson65B(values);
    const address = shortAddress(values);
    const name =
      (values?.name ? values?.name : "") +
      " " +
      (values?.surname ? values?.surname : "");
    cctvFootageForms.setFieldsValue({
      person65BName: `${name} ${address}`,
    });
    setIsPerson65BNameModalVisible(false);
    person65BForm.resetFields();
  };

  const handlePerson65BCancel = () => {
    setIsPerson65BNameModalVisible(false);
    person65BForm.resetFields();
  };

  const handleAddressOk = async () => {
    const values = await addressForm.validateFields();
    setSelectedAddress(values);
    const address = shortAddress(values);
    cctvFootageForms.setFieldsValue({
      placeOfCCTV: address,
    });
    setIsAddressModalVisible(false);
    addressForm.resetFields();
  };

  const handleAddressCancel = () => {
    setIsAddressModalVisible(false);
    addressForm.resetFields();
  };

  const handleNameAndDesignationModalVisibleOk = async () => {
    const values = await nameAndDesignationForm.validateFields();
    setSelectedNameAndDesignationOfPerson(values);
    const occupation = values?.occupation || "";
    const name =
      (values?.name ? values?.name : "") +
      " " +
      (values?.surname ? values?.surname : "");
    enhancedVideoForm.setFieldsValue({
      nameAndDesignationOfPerson: `${name} ${occupation}`,
    });
    setIsNameAndDesignationModalVisible(false);
    nameAndDesignationForm.resetFields();
  };

  const handleNameAndDesignationModalVisibleCancel = () => {
    setIsNameAndDesignationModalVisible(false);
    nameAndDesignationForm.resetFields();
  };

  const handleOwnerOk = async () => {
    const values = await ownerForm.validateFields();
    setSelectedOwner(values);
    const address = shortAddress(values);
    const name =
      (values?.name ? values?.name : "") +
      " " +
      (values?.surname ? values?.surname : "");
    cctvFootageForms.setFieldsValue({
      ownerOfCCTV: `${name} ${address}`,
    });
    setIsOwnerModalVisible(false);
    ownerForm.resetFields();
  };

  const handleOwnerCancel = () => {
    setIsOwnerModalVisible(false);
    ownerForm.resetFields();
  };

  const getDropdownValues = (entity) => {
    return (
      !isEmpty(evidenceCollectionList) &&
      evidenceCollectionList.filter((s) => s.entity === entity)
    );
  };

  const cctvStorageList = getEvidenceListData(getDropdownValues("cctvStorage"));
  const strengthOfEvidence = getEvidenceListData(
    getDropdownValues("strengthOfEvidence")
  );

  const checkFields = async () => {
    const values = await cctvFootageForms.validateFields();
    setFormValid(!Object.values(values).every((v) => v == null || v === ""));
  };

  const openNotificationWithIcon = (type, message) => {
    return notification[type]({
      message: message,
    });
  };

  const fetchCCTVFootageList = () => {
    dispatch(
      getCCTVFootageList(
        `${config.getEvidenceDetails}/CCTV/?crimeId=${crimeId}`
      )
    );
  };

  useEffect(() => {
    fetchCCTVFootageList();
  }, []);

  useEffect(() => {
    if (isSuccess || isError) {
      if (
        successMessage === "CCTV Footage successfully added" ||
        successMessage === "CCTV Footage successfully updated"
      ) {
        openNotificationWithIcon("success", successMessage);
        auditHistoryEntry();
        cctvFootageForms.resetFields();
        setViewCCTVFootageDetails(false);
        setEditCCTVFootageObj(null);
        setUpload65BCertificate([]);
        setSelectedUpload65BCertificate([]);
        setUploadVideoFootage([]);
        setSelectedUploadVideoFootage([]);
        dispatch(resetActionType());
        fetchCCTVFootageList();
      } else if (errorMessage) {
        openNotificationWithIcon("error", errorMessage);
        dispatch(resetActionType());
      }
    }
  }, [actionType]);

  useEffect(() => {
    if (isRequisitionSuccess || isRequisitionError) {
      if (requisitionSuccessMessage === "Requisition send successfully") {
        openNotificationWithIcon("success", requisitionSuccessMessage);
        setSelectedItemsForRequisition([]);
        dispatch(resetRequisitionActionType());
        fetchCCTVFootageList();
      } else if (errorMessage) {
        openNotificationWithIcon("error", requisitionErrorMessage);
        dispatch(resetActionType());
      }
    }
  }, [requisitionActionType]);

  useEffect(() => {
    if (isEnhancedSuccess || isEnhancedError) {
      if (
        enhancedSuccessMessage === "Enhanced details are successfully updated"
      ) {
        openNotificationWithIcon("success", enhancedSuccessMessage);
        setSelectedItemsForEnhanced([]);
        enhancedVideoForm.resetFields();
        setIsEnhancedVideoModalVisible(false);
        setUploadEnhanced65BCertificate([]);
        setUploadEnhancedVideoFootage([]);
        dispatch(resetEnhancedActionType());
        fetchCCTVFootageList();
      } else if (errorMessage) {
        openNotificationWithIcon("error", enhancedErrorMessage);
        dispatch(resetActionType());
      }
    }
  }, [enhancedActionType]);

  const handleSearch = (text) => {
    setSerchText(text);
  };

  const checkIsNoticeRequired = (e) => {
    setIsNoticeRequired(e.target.value);
    checkFields();
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
              {s.actionLink && (
                <span
                  className="linkStyle"
                  onClick={() => {
                    if (s.name === "placeOfCCTV") {
                      setIsAddressModalVisible(disableForm ? false : true);
                    } else if (s.name === "ownerOfCCTV") {
                      setIsOwnerModalVisible(disableForm ? false : true);
                    } else if (s.name === "person65BName") {
                      setIsPerson65BNameModalVisible(
                        disableForm ? false : true
                      );
                    } else {
                      return;
                    }
                  }}
                >
                  {s.actionName}
                </span>
              )}
            </Col>
          );
        })}
      </Row>
    );
  };

  const displayFields = (name) => {
    switch (name) {
      case "placeOfCCTV":
        return renderFieldsWithDropDown(
          [],
          null,
          handleSearch,
          serchText,
          230,
          viewCCTVFootageDetails || disableForm
        );
      case "ownerOfCCTV":
        return renderFieldsWithDropDown(
          [],
          null,
          handleSearch,
          serchText,
          230,
          viewCCTVFootageDetails || disableForm
        );
      case "cctvFootageReqDates":
        return (
          <RangePicker
            format={DATE_FORMAT}
            style={{ width: 230 }}
            onChange={checkFields}
            disabled={viewCCTVFootageDetails || disableForm}
          />
        );
      case "dateOfCollection":
        return (
          <DatePicker
            format={DATE_FORMAT}
            style={{ width: 230 }}
            onChange={checkFields}
            disabled={viewCCTVFootageDetails || disableForm}
          />
        );
      case "crpc91Required":
        return (
          <Radio.Group
            name="radiogroup"
            onChange={checkIsNoticeRequired}
            defaultValue={isNoticeRequired}
            disabled={viewCCTVFootageDetails || disableForm}
          >
            <Radio value="Yes">Yes</Radio>
            <Radio value="No">No</Radio>
          </Radio.Group>
        );
      case "cctvFootageCollectedDevice":
        return renderFieldsWithDropDown(
          cctvStorageList,
          null,
          handleSearch,
          serchText,
          230,
          viewCCTVFootageDetails || disableForm
        );
      case "person65BName":
        return renderFieldsWithDropDown(
          [],
          null,
          handleSearch,
          serchText,
          230,
          viewCCTVFootageDetails || disableForm
        );
      case "strengthOfEvidence":
        return renderFieldsWithDropDown(
          strengthOfEvidence,
          null,
          handleSearch,
          serchText,
          230,
          viewCCTVFootageDetails || disableForm
        );
      default:
        return (
          <Input
            onChange={checkFields}
            style={{ width: 230 }}
            maxLength={textFieldRules.maxLength}
            disabled={viewCCTVFootageDetails || disableForm}
          />
        );
    }
  };

  const onRecordSelect = async (item) => {
    const values = await requisitionForm.getFieldValue();
    item.dateOfRequisition = values[`${item?._id}_dateOfRequisition`];
    setSelectedItemsForRequisition([...selectedItemsForRequisition, item]);
  };

  const onEnhancedRecordSelect = (item) => {
    setSelectedItemsForEnhanced(item);
  };

  const sendRequisition = () => {
    !isEmpty(selectedItemsForRequisition) &&
      selectedItemsForRequisition.map((values) => {
        values.requisitionSent = true;
        const payload = {
          crimeId: crimeId,
          footageId: values?._id,
          data: {
            placeOfCCTV: values?.placeOfCCTV,
            ownerOfCCTV: values?.ownerOfCCTV,
            cctvFootageReqDates: values?.cctvFootageReqDates,
            dateOfCollection: values?.dateOfCollection,
            crpc91Required: values?.crpc91Required === "Yes" ? true : false,
            cctvFootageCollectedDevice: values?.cctvFootageCollectedDevice,
            person65BName: values?.person65BName,
            strengthOfEvidence: values?.strengthOfEvidence,
            dateOfNotice: values?.dateOfNotice,
            upload65BCertificate: values?.upload65BCertificate,
            cctvFootageRaw: values?.cctvFootageRaw,
            dateOfRequisition: values?.dateOfRequisition,
            requisitionSent: values?.requisitionSent,
          },
        };
        dispatch(sendRequisitionDetails(config.updateCCTVFootage, payload));
      });
  };

  const onReset = () => {
    cctvFootageForms.resetFields();
    setViewCCTVFootageDetails(false);
    setEditCCTVFootageObj(null);
    setUpload65BCertificate([]);
    setSelectedUpload65BCertificate([]);
    setUploadVideoFootage([]);
    setSelectedUploadVideoFootage([]);
    setIsEnhancedVideoModalVisible(false);
    setSelectedItemsForRequisition([]);
    setSelectedItemsForEnhanced([]);
    dispatch(resetActionType());
    dispatch(resetEnhancedActionType());
    dispatch(resetRequisitionActionType());
    checkFields();
  };

  useEffect(() => {
    onReset();
  }, [selectedTab]);

  const getPayloadData = (values, upload65BCertificate, cctvFootageRaw) => {
    let selectedOW = getPersonDetails(selectedOwner, inputList);
    let { personalDetails } = selectedOW;
    personalDetails.createdFrom = "Digital Evidence";
    personalDetails.createdFor = "Add Person";

    let person65 = getPersonDetails(selectedPerson65B, inputList);
    let { personalDetails: personalDetails65 } = person65;
    personalDetails65.createdFrom = "Digital Evidence";
    personalDetails65.createdFor = "Add Person";
    const payload = {
      crimeId: crimeId,
      data: {
        placeOfCCTV: !isEmpty(selectedAddress)
          ? selectedAddress
          : editCCTVFootageObj?.placeOfCCTV,
        ownerOfCCTV: !isEmpty(selectedOwner)
          ? selectedOW
          : editCCTVFootageObj?.ownerOfCCTV,
        cctvFootageReqDates: values?.cctvFootageReqDates,
        dateOfCollection: values?.dateOfCollection,
        crpc91Required: values?.crpc91Required === "Yes" ? true : false,
        cctvFootageCollectedDevice: values?.cctvFootageCollectedDevice,
        person65BName: !isEmpty(selectedPerson65B)
          ? person65
          : editCCTVFootageObj?.person65BName,
        strengthOfEvidence: values?.strengthOfEvidence,
        dateOfNotice: values?.dateOfNotice,
        upload65BCertificate: upload65BCertificate,
        cctvFootageRaw: cctvFootageRaw,
        dateOfRequisition: "",
        requisitionSent: false,
      },
    };

    return payload;
  };

  const submit = async () => {
    const values = await cctvFootageForms.validateFields();
    const videoFootageFormData = new FormData();
    uploadVideoFootage.forEach((file) => {
      videoFootageFormData.append("file", file.originFileObj);
    });
    videoFootageFormData.append("prefixFolder", crimeId);
    videoFootageFormData.append(
      "folderPath",
      `${crimeId}/${folderName.DIGITAL_EVIDENCE}/videoFootage`
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

    if (!isEmpty(uploadVideoFootage) && !isEmpty(upload65BCertificate)) {
      setIsUploading(true);
      axios
        .all([
          axios.post(`${config.fileUpload}/upload`, videoFootageFormData),
          axios.post(
            `${config.fileUpload}/upload`,
            upload65BCertificateFormData
          ),
        ])
        .then(
          axios.spread((data1, data2) => {
            if (data1.status === 200 && data2.status === 200) {
              setIsUploading(false);
              const videoFootageResult = data1.data?.data;
              const upload65BResult = data2.data?.data;
              const uploadVideoFootageReport = getMediaPayload(
                videoFootageResult,
                folderName.DIGITAL_EVIDENCE
              );
              const upload65BReportResult = first(
                getMediaPayload(upload65BResult, folderName.DIGITAL_EVIDENCE)
              );

              if (editCCTVFootageObj?._id) {
                const updatePayload = {
                  footageId: editCCTVFootageObj?._id,
                  ...getPayloadData(
                    values,
                    upload65BReportResult,
                    uploadVideoFootageReport
                  ),
                };
                dispatch(
                  updateCCTVFootageDetails(
                    config.updateCCTVFootage,
                    updatePayload
                  )
                );
              } else {
                dispatch(
                  addCCTVFootageDetails(
                    config.addCCTVFootage,
                    getPayloadData(
                      values,
                      upload65BReportResult,
                      uploadVideoFootageReport
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
    } else if (isEmpty(uploadVideoFootage) && !isEmpty(upload65BCertificate)) {
      setIsUploading(true);
      axios
        .post(`${config.fileUpload}/upload`, upload65BCertificateFormData)
        .then((res) => {
          if (res.status === 200) {
            setIsUploading(false);
            const existingVideoFootage =
              !isEmpty(editCCTVFootageObj?.cctvFootageRaw) &&
              editCCTVFootageObj?.cctvFootageRaw;
            const { data } = res.data;
            const upload65BReportResult = first(
              getMediaPayload(data, folderName.DIGITAL_EVIDENCE)
            );

            if (editCCTVFootageObj?._id) {
              const updatePayload = {
                footageId: editCCTVFootageObj?._id,
                ...getPayloadData(
                  values,
                  upload65BReportResult,
                  existingVideoFootage
                ),
              };
              dispatch(
                updateCCTVFootageDetails(
                  config.updateCCTVFootage,
                  updatePayload
                )
              );
            } else {
              dispatch(
                addCCTVFootageDetails(
                  config.addCCTVFootage,
                  getPayloadData(
                    values,
                    upload65BReportResult,
                    existingVideoFootage
                  )
                )
              );
            }
          }
        })
        .catch((err) => {
          getMediaUploadError(err, openNotificationWithIcon);
        });
    } else if (!isEmpty(uploadVideoFootage) && isEmpty(upload65BCertificate)) {
      setIsUploading(true);
      axios
        .post(`${config.fileUpload}/upload`, upload65BCertificateFormData)
        .then((res) => {
          if (res.status === 200) {
            setIsUploading(false);
            const existing65BCertificate =
              editCCTVFootageObj?.upload65BCertificate &&
              editCCTVFootageObj?.upload65BCertificate;
            const { data } = res.data;
            const uploadVideoFootageReport = getMediaPayload(
              data,
              folderName.DIGITAL_EVIDENCE
            );

            if (editCCTVFootageObj?._id) {
              const updatePayload = {
                footageId: editCCTVFootageObj?._id,
                ...getPayloadData(
                  values,
                  existing65BCertificate,
                  uploadVideoFootageReport
                ),
              };
              dispatch(
                updateCCTVFootageDetails(
                  config.updateCCTVFootage,
                  updatePayload
                )
              );
            } else {
              dispatch(
                addCCTVFootageDetails(
                  config.addCCTVFootage,
                  getPayloadData(
                    values,
                    existing65BCertificate,
                    uploadVideoFootageReport
                  )
                )
              );
            }
          }
        })
        .catch((err) => {
          getMediaUploadError(err, openNotificationWithIcon);
        });
    } else if (isEmpty(uploadVideoFootage) && isEmpty(upload65BCertificate)) {
      const rawVideo =
        !isEmpty(editCCTVFootageObj?.cctvFootageRaw) &&
        editCCTVFootageObj?.cctvFootageRaw;
      const certificate65B =
        editCCTVFootageObj?.upload65BCertificate &&
        editCCTVFootageObj?.upload65BCertificate;
      const existingVideoFootage = !isEmpty(rawVideo) ? rawVideo : [];
      const existing65BCertificate = certificate65B ? certificate65B : {};

      if (editCCTVFootageObj?._id) {
        const updatePayload = {
          footageId: editCCTVFootageObj?._id,
          ...getPayloadData(
            values,
            existing65BCertificate,
            existingVideoFootage
          ),
        };
        dispatch(
          updateCCTVFootageDetails(config.updateCCTVFootage, updatePayload)
        );
      } else {
        dispatch(
          addCCTVFootageDetails(
            config.addCCTVFootage,
            getPayloadData(values, existing65BCertificate, existingVideoFootage)
          )
        );
      }
    }
  };

  const getEnhancedPayloadData = (
    values,
    uploadEnhanced65BCertificate,
    cctvFootageEnhanced
  ) => {
    let nameAndDe = getPersonDetails(
      selectedNameAndDesignationOfPerson,
      inputList
    );
    let { personalDetails } = nameAndDe;
    personalDetails.createdFrom = "Digital Evidence";
    const payload = {
      crimeId: crimeId,
      footageId: selectedItemsForEnhanced?._id,
      data: {
        placeOfCCTV: selectedItemsForEnhanced?.placeOfCCTV,
        ownerOfCCTV: selectedItemsForEnhanced?.ownerOfCCTV,
        cctvFootageReqDates: selectedItemsForEnhanced?.cctvFootageReqDates,
        dateOfCollection: selectedItemsForEnhanced?.dateOfCollection,
        crpc91Required:
          selectedItemsForEnhanced?.crpc91Required === "Yes" ? true : false,
        cctvFootageCollectedDevice:
          selectedItemsForEnhanced?.cctvFootageCollectedDevice,
        person65BName: selectedItemsForEnhanced?.person65BName,
        strengthOfEvidence: selectedItemsForEnhanced?.strengthOfEvidence,
        dateOfNotice: selectedItemsForEnhanced?.dateOfNotice,
        upload65BCertificate: selectedItemsForEnhanced?.upload65BCertificate,
        cctvFootageRaw: selectedItemsForEnhanced?.cctvFootageRaw,
        dateOfRequisition: selectedItemsForEnhanced?.dateOfRequisition,
        requisitionSent: selectedItemsForEnhanced?.requisitionSent,
        enhancedVideo: {
          cctvFootageEnhanced: cctvFootageEnhanced,
          uploadEnhanced65BCertificate: uploadEnhanced65BCertificate,
          nameAndDesignationOfPerson: nameAndDe,
          dateOfReceipt: values?.dateOfReceipt,
          result: values?.result,
        },
      },
    };

    return payload;
  };

  const submitEnhancedForm = async () => {
    const values = await enhancedVideoForm.getFieldValue();
    const enhancedVideoFootageFormData = new FormData();
    uploadEnhancedVideoFootage.forEach((file) => {
      enhancedVideoFootageFormData.append("file", file.originFileObj);
    });
    enhancedVideoFootageFormData.append("prefixFolder", crimeId);
    enhancedVideoFootageFormData.append(
      "folderPath",
      `${crimeId}/${folderName.DIGITAL_EVIDENCE}/enhancedVideoFootage`
    );

    const uploadEnhanced65BCertificateFormData = new FormData();
    uploadEnhanced65BCertificate.forEach((file) => {
      uploadEnhanced65BCertificateFormData.append("file", file.originFileObj);
    });
    uploadEnhanced65BCertificateFormData.append("prefixFolder", crimeId);
    uploadEnhanced65BCertificateFormData.append(
      "folderPath",
      `${crimeId}/${folderName.DIGITAL_EVIDENCE}/enhancedFile`
    );

    if (
      !isEmpty(uploadEnhancedVideoFootage) &&
      !isEmpty(uploadEnhanced65BCertificate)
    ) {
      setIsEnhancedUploading(true);
      axios
        .all([
          axios.post(
            `${config.fileUpload}/upload`,
            enhancedVideoFootageFormData
          ),
          axios.post(
            `${config.fileUpload}/upload`,
            uploadEnhanced65BCertificateFormData
          ),
        ])
        .then(
          axios.spread((data1, data2) => {
            if (data1.status === 200 && data2.status === 200) {
              setIsEnhancedUploading(false);
              const enhancedVideoFootageResult = data1.data?.data;
              const uploadEnhanced65BResult = data2.data?.data;
              const uploadEnhancedVideoFootageReport = getMediaPayload(
                enhancedVideoFootageResult,
                folderName.DIGITAL_EVIDENCE
              );
              const uploadEnhanced65BReportResult = first(
                getMediaPayload(
                  uploadEnhanced65BResult,
                  folderName.DIGITAL_EVIDENCE
                )
              );

              const payloadResult = getEnhancedPayloadData(
                values,
                uploadEnhanced65BReportResult,
                uploadEnhancedVideoFootageReport
              );
              dispatch(
                uploadEnhancedDetails(config.updateCCTVFootage, payloadResult)
              );
            }
          })
        )
        .catch((err) => {
          getMediaUploadError(err, openNotificationWithIcon);
        });
    }
  };

  const handleEditCCTVFootage = (values) => {
    if (values) {
      setEditCCTVFootageObj(values);
      setViewCCTVFootageDetails(false);
      if (
        values?.upload65BCertificate &&
        values?.upload65BCertificate?.url !== ""
      ) {
        setSelectedUpload65BCertificate([values?.upload65BCertificate]);
      } else {
        setSelectedUpload65BCertificate([]);
      }
      if (values?.cctvFootageRaw) {
        setSelectedUploadVideoFootage(values?.cctvFootageRaw);
      } else {
        setSelectedUploadVideoFootage([]);
      }
      const ownerPersonalDetails =
        !isUndefined(values?.ownerOfCCTV) &&
        values?.ownerOfCCTV?.personalDetails;
      const ownerPresentAddress =
        !isUndefined(values?.ownerOfCCTV) &&
        values?.ownerOfCCTV?.presentAddress;
      const ownerName =
        (ownerPersonalDetails?.name ? ownerPersonalDetails?.name : "") +
        " " +
        (ownerPersonalDetails?.surname ? ownerPersonalDetails?.surname : "");
      const ownerAddress = shortAddress(ownerPresentAddress);

      const personPersonalDetails =
        !isUndefined(values?.person65BName) &&
        values?.person65BName?.personalDetails;
      const personPresentAddress =
        !isUndefined(values?.person65BName) &&
        values?.person65BName?.presentAddress;
      const personName =
        (personPersonalDetails?.name ? personPersonalDetails?.name : "") +
        " " +
        (personPersonalDetails?.surname ? personPersonalDetails?.surname : "");
      const personAddress = shortAddress(personPresentAddress);

      const dateList = [];
      if (values?.cctvFootageReqDates?.length > 0) {
        dateList.push(
          moment(new Date(values.cctvFootageReqDates[0])).isValid()
            ? moment(new Date(values.cctvFootageReqDates[0]))
            : ""
        );
        dateList.push(
          moment(new Date(values.cctvFootageReqDates[1])).isValid()
            ? moment(new Date(values.cctvFootageReqDates[1]))
            : ""
        );
      }

      const crpc91Required = values?.crpc91Required ? "Yes" : "No";
      setIsNoticeRequired(crpc91Required);

      cctvFootageForms.setFieldsValue({
        placeOfCCTV: shortAddress(values?.placeOfCCTV),
        ownerOfCCTV: `${ownerName}, ${ownerAddress}`,
        person65BName: `${personName}, ${personAddress}`,
        strengthOfEvidence: values?.strengthOfEvidence,
        cctvFootageReqDates: dateList,
        crpc91Required: crpc91Required,
        cctvFootageCollectedDevice: values?.cctvFootageCollectedDevice,
        dateOfCollection: moment(new Date(values?.dateOfCollection)).isValid()
          ? moment(new Date(values?.dateOfCollection))
          : "",
        dateOfNotice: moment(new Date(values?.dateOfNotice)).isValid()
          ? moment(new Date(values?.dateOfNotice))
          : "",
      });
    }
  };

  const renderEnhancedVideoForm = () => (
    <Card>
      <Form form={enhancedVideoForm} layout="vertical">
        <Row>
          <div style={{ marginBottom: 10, fontWeight: "bold", fontSize: 18 }}>
            Upload Enhanced Video
          </div>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="result"
              label="Result"
              rules={[textAreaRules.textAreaMaxLength]}
            >
              <TextArea
                rows={4}
                columns={3}
                style={{ height: 150 }}
                maxLength={textAreaRules.maxLength}
                disabled={viewCCTVFootageDetails || disableForm}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <div>
              <Form.Item
                name="nameAndDesignationOfPerson"
                label="Name and Designation of Person"
              >
                {renderFieldsWithDropDown(
                  [],
                  null,
                  handleSearch,
                  serchText,
                  230,
                  viewCCTVFootageDetails || disableForm
                )}
              </Form.Item>
              <span
                className="linkStyle"
                onClick={() => setIsNameAndDesignationModalVisible(true)}
              >
                Add Professional
              </span>
            </div>
            <div style={{ marginTop: 20 }}>
              <Form.Item name="dateOfReceipt" label="Date of Receipt">
                <DatePicker
                  format={DATE_FORMAT}
                  style={{ width: 230 }}
                  onChange={checkFields}
                  disabled={viewCCTVFootageDetails || disableForm}
                />
              </Form.Item>
            </div>
          </Col>
        </Row>
        <Row gutter={24} style={{ marginLeft: 5 }}>
          <Col span={12} style={{ marginBottom: 10, padding: 0 }}>
            <Form.Item name="uploadEnhanced65BCertificate" label="">
              <Upload
                fileList={uploadEnhanced65BCertificate}
                customRequest={dummyRequest}
                onChange={(info) =>
                  onFileChange(info, setUploadEnhanced65BCertificate)
                }
                onPreview={handleDownload}
                multiple={false}
              >
                <Button
                  className="saveButton"
                  style={{ marginTop: 22, width: 320, marginBottom: 10 }}
                  icon={<CameraFilled style={{ float: "left" }} />}
                  disabled={
                    viewCCTVFootageDetails ||
                    !isEmpty(uploadEnhanced65BCertificate) ||
                    disableForm
                  }
                >
                  Upload 65B Evidence Act Certificate
                </Button>
              </Upload>
            </Form.Item>
          </Col>
          <Col span={8} style={{ marginBottom: 10, padding: 0 }}>
            <Form.Item name="cctvFootageEnhanced" label="">
              <Upload
                accept="video/*"
                fileList={uploadEnhancedVideoFootage}
                customRequest={dummyRequest}
                onChange={(info) =>
                  onFileChange(info, setUploadEnhancedVideoFootage)
                }
                onPreview={handleDownload}
                multiple={true}
              >
                <Button
                  className="saveButton"
                  style={{ marginTop: 22, width: 230, marginBottom: 10 }}
                  icon={<CameraFilled style={{ float: "left" }} />}
                  disabled={
                    viewCCTVFootageDetails || isEnhancedUploading || disableForm
                  }
                >
                  Upload Enhanced Video
                </Button>
              </Upload>
            </Form.Item>
          </Col>
          {isEnhancedUploading ? (
            <Spin tip="Uploading...">
              <Alert
                message="Enhanced Video upload is in progress. Please wait!!"
                type="info"
              />
            </Spin>
          ) : null}
        </Row>
        <Divider />
        <Form.Item>
          <Button
            type="primary"
            className="saveButton"
            size="large"
            icon={<SaveOutlined className="saveButtonIcon" />}
            onClick={submitEnhancedForm}
            disabled={
              viewCCTVFootageDetails ||
              isEmpty(uploadEnhanced65BCertificate) ||
              isEmpty(uploadEnhancedVideoFootage) ||
              disableForm
            }
          >
            SAVE
          </Button>
          <span className="linkStyle resetLink" onClick={onReset}>
            Close
          </span>
        </Form.Item>
      </Form>
    </Card>
  );

  return isFetching ? (
    <Loader />
  ) : (
    <>
      <div style={{ padding: 20 }}>
        <Form form={cctvFootageForms} layout="vertical">
          {displayState(cctvFootageForm, displayFields)}
          {isNoticeRequired === "Yes" ? (
            <Row gutter={24}>
              <Col span={6} style={{ marginBottom: 10, padding: 0 }}>
                <Form.Item name="dateOfNotice" label="Date of Notice">
                  <DatePicker
                    format={DATE_FORMAT}
                    style={{ width: 230 }}
                    onChange={checkFields}
                    disabled={viewCCTVFootageDetails || disableForm}
                  />
                </Form.Item>
              </Col>
            </Row>
          ) : null}
          <Row gutter={24}>
            <Col span={12} style={{ marginBottom: 10, padding: 0 }}>
              <Form.Item name="65BEvidence" label="">
                <Upload
                  fileList={
                    editCCTVFootageObj?._id &&
                    editCCTVFootageObj?.upload65BCertificate &&
                    editCCTVFootageObj?.upload65BCertificate?.url !== ""
                      ? selectedUpload65BCertificate
                      : upload65BCertificate
                  }
                  onPreview={handleDownload}
                  customRequest={dummyRequest}
                  onChange={(info) =>
                    onFileChange(info, setUpload65BCertificate)
                  }
                  multiple={false}
                >
                  <Button
                    className="saveButton"
                    style={{ marginTop: 22, width: 320, marginBottom: 10 }}
                    icon={<CameraFilled style={{ float: "left" }} />}
                    disabled={
                      viewCCTVFootageDetails ||
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
              <Form.Item name="cctvFootage" label="">
                <Upload
                  accept="video/*"
                  fileList={
                    editCCTVFootageObj?._id &&
                    editCCTVFootageObj?.cctvFootageRaw &&
                    !isEmpty(editCCTVFootageObj?.cctvFootageRaw)
                      ? selectedUploadVideoFootage
                      : uploadVideoFootage
                  }
                  onPreview={handleDownload}
                  customRequest={dummyRequest}
                  onChange={(info) => onFileChange(info, setUploadVideoFootage)}
                  multiple={true}
                >
                  <Button
                    className="saveButton"
                    style={{ marginTop: 22, width: 230, marginBottom: 10 }}
                    icon={<CameraFilled style={{ float: "left" }} />}
                    disabled={
                      viewCCTVFootageDetails || isUploading || disableForm
                    }
                  >
                    Select CCTV Footage
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
            viewCCTVFootageDetails ||
            disableForm ||
            isUploading ||
            (isEmpty(uploadVideoFootage) &&
              isEmpty(selectedUploadVideoFootage)) ||
            (isEmpty(upload65BCertificate) &&
              isEmpty(selectedUpload65BCertificate))
          }
          onReset={onReset}
        />
        {isOwnerModalVisible ? (
          <AddPerson
            title="Add Owner of CCTV Footage"
            isModalVisible={isOwnerModalVisible}
            handleOk={handleOwnerOk}
            handleCancel={handleOwnerCancel}
            formName={ownerForm}
            checkFields={checkFields}
            disabled={viewCCTVFootageDetails || disableForm}
            setInputList={setInputList}
            editObj={editCCTVFootageObj}
            age={age}
            setAge={setAge}
          />
        ) : null}
        {isPerson65BNameModalVisible ? (
          <AddPerson
            title="Add Details Of person who gave 65B certificate"
            isModalVisible={isPerson65BNameModalVisible}
            handleOk={handlePerson65BOk}
            handleCancel={handlePerson65BCancel}
            formName={person65BForm}
            checkFields={checkFields}
            disabled={viewCCTVFootageDetails || disableForm}
            setInputList={setInputList}
            editObj={editCCTVFootageObj}
            age={age}
            setAge={setAge}
          />
        ) : null}
        {isAddressModalVisible ? (
          <AddPersonAddress
            title="Place of CCTV"
            isModalVisible={isAddressModalVisible}
            handleOk={handleAddressOk}
            handleCancel={handleAddressCancel}
            formName={addressForm}
            checkFields={checkFields}
            disabled={viewCCTVFootageDetails || disableForm}
          />
        ) : null}
      </div>
      {isArray(cctvFootageList) && !isEmpty(cctvFootageList) ? (
        <div style={{ maxHeight: 400, overflowY: "auto", marginTop: 20 }}>
          <Form form={requisitionForm} layout="vertical">
            <SavedCCTVFootageRecords
              dataSource={cctvFootageList}
              onRecordSelect={onRecordSelect}
              editDetails={handleEditCCTVFootage}
              setViewDetails={setViewCCTVFootageDetails}
              selectedRecord={
                isNull(editCCTVFootageObj)
                  ? selectedItemsForEnhanced
                  : editCCTVFootageObj
              }
              setIsEnhancedVideoModalVisible={setIsEnhancedVideoModalVisible}
              onEnhancedRecordSelect={onEnhancedRecordSelect}
              isEnhancedVideoModalVisible={isEnhancedVideoModalVisible}
              setEditCCTVFootageObj={setEditCCTVFootageObj}
              formName={cctvFootageForms}
              disableForm={disableForm}
            />
            {!isEmpty(selectedItemsForRequisition) ? (
              <div style={{ marginTop: 20 }}>
                <Form.Item>
                  <Button
                    type="primary"
                    className="saveButton"
                    style={{ width: 160 }}
                    size="large"
                    onClick={sendRequisition}
                    disabled={disableForm}
                  >
                    Send Requisition
                  </Button>
                </Form.Item>
              </div>
            ) : null}
          </Form>
        </div>
      ) : null}
      {isEnhancedVideoModalVisible ? (
        <div style={{ margin: 20 }}>{renderEnhancedVideoForm()}</div>
      ) : null}
      {isNameAndDesignationModalVisible ? (
        <AddPerson
          title="Add Name and Designation"
          isModalVisible={isNameAndDesignationModalVisible}
          handleOk={handleNameAndDesignationModalVisibleOk}
          handleCancel={handleNameAndDesignationModalVisibleCancel}
          formName={nameAndDesignationForm}
          checkFields={checkFields}
          disabled={viewCCTVFootageDetails || disableForm}
          setInputList={setInputList}
          editObj={editCCTVFootageObj}
          age={age}
          setAge={setAge}
        />
      ) : null}
    </>
  );
}
