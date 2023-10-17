import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { config, API_ARREST_BASE_URL } from "@config/site.config";
import { first, isEmpty, isUndefined, isArray, isNull } from "lodash";
import moment from "moment";
import axios from "axios";
import Loader from "@components/utility/loader";
import crpcNotice41AReportAction from "@redux/investigations/crpcNotice41A/actions";
import { loadState } from "@lib/helpers/localStorage";
import { getFileById } from "@containers/media-util";
import suspectAccusedAction from "@redux/investigations/suspectAccused/actions";
import {
  Row,
  Card,
  Col,
  Form,
  Input,
  Select,
  DatePicker,
  Radio,
  Upload,
  Button,
  Checkbox,
  notification,
  Modal,
} from "antd";
import { CaretDownOutlined, CameraFilled } from "@ant-design/icons";
import {
  dummyRequest,
  renderFieldsWithDropDown,
  getAccuseds,
  getStaffsDetails,
  getDate,
  masterDataType,
  getSavedDataResult,
  onFileChange,
  folderName,
  getMediaUploadError,
  getFilePayload,
  DATE_FORMAT,
} from "@containers/FirDetails/fir-util";
import { getAuditHistoryPayload } from "@containers/const";
import auditHistoryActions from "@redux/auditHistory/actions";
import masterDataActions from "@redux/masterData/actions";
import DisplayReportGenerations from "@containers/FirDetails/CommonSections/DisplayReportGenerations";
import SavedRecords from "./SavedRecords";
import { ModuleWrapper } from "../CommonDetails/styles";
import TemplatesModal from "../CommonForms/TemplatesModal";
import ProcedureForNonComplaince from "./ProcedureForNonComplaince";
import AccusedCard from "../CommonForms/AccusedCard";
import ContentHeader from "../../ContentHeader";
import {
  CRPC41ATemplates,
  CRPC41ATemplatesNo,
  condisonImposedList,
  getDataForDocument,
  getHTMLFromTemplate,
} from "./const";

const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;

export default function CRPCNotice41A({ setSelectedSiderMenu }) {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const selectedFir = loadState("selectedFir");
  const currentUser = loadState("currentUser");
  const [formValid, setFormValid] = useState(false);
  const [addAnother, setAddAnother] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTemplateName, setSelectedTemplateName] = useState("");
  const [recordsIsModalVisible, setrecordsIsModalVisible] = useState(false);
  const [
    isExplanationSubmittedWithInTime,
    setIsExplanationSubmittedWithInTime,
  ] = useState(true);

  const [checkedList, setCheckedList] = useState([]);
  const [indeterminate, setIndeterminate] = useState(true);
  const [checkAll, setCheckAll] = useState(false);

  const [isAddressCorrect, setIsAddressCorrect] = useState(true);
  const { savedFir } = useSelector((state) => state.createFIR);
  const disableForm =
    savedFir?.caseStatus === "Disposal" ||
    savedFir?.isTransferOfCaseFile === true ||
    savedFir?.isChargeSheetTakenOrFiled === true;

  const [selectedFileName, setSelectedFileName] = useState("");
  const [selectedAccusedValue, setSelectedAccusedValue] = useState("");
  const [identityURL, setIdentityURL] = useState([]);
  const [ackURL, setackURL] = useState([]);
  const [selectedIdentityURL, setSelectedIdentityURL] = useState([]);
  const [selectedAckURL, setSelectedAckURL] = useState([]);
  const [statementUrl, setStatementUrl] = useState([]);
  const [selectedStatementUrl, setSelectedStatementUrl] = useState([]);
  const { staffList, courtsFromPSList } = useSelector(
    (state) => state.MasterData
  );
  const [editCRPCNotice41AReportObj, setEditCRPCNotice41AReportObj] =
    useState(null);
  const [viewCRPCNotice41AReportDetails, setViewCRPCNotice41AReportDetails] =
    useState(false);
  const crimeId = loadState("selectedFirId");
  const [searchText, setsearchText] = useState("");
  const staffMembersList = staffList && getStaffsDetails(staffList);
  const { suspectAccusedList } = useSelector((state) => state.SuspectAccused);
  const { getAccusedList } = suspectAccusedAction;
  const { getStaffList, getCourtsBasedonPsCode } = masterDataActions;
  const { createAuditHistory } = auditHistoryActions;
  const { crpc41AList, isFetching, actionType, successMessage, errorMessage } =
    useSelector((state) => state.CRPCNotice41A);
  const {
    add41ACrpcDetails,
    update41ACrpcDetails,
    get41ACrpcList,
    resetActionType,
  } = crpcNotice41AReportAction;

  const isSuccess =
    actionType === "ADD_41A_CRPC_SUCCESS" ||
    actionType === "UPDATE_41A_CRPC_SUCCESS";

  const isError =
    actionType === "ADD_41A_CRPC_ERROR" ||
    actionType === "UPDATE_41A_CRPC_ERROR";

  const openNotificationWithIcon = (type, message) => {
    return notification[type]({
      message: message,
    });
  };

  const fetchAccusedList = () => {
    dispatch(
      getAccusedList(
        `${config.getPostCrimeSceneDetails}/ACCUSED/?crimeId=${crimeId}`
      )
    );
  };

  const fetch41ACrpcDetailsList = () => {
    dispatch(
      get41ACrpcList(`${API_ARREST_BASE_URL}/api/41ACRPC?crimeId=${crimeId}`)
    );
  };

  const auditHistoryEntry = () => {
    const auditType =
      actionType === "ADD_41A_CRPC_SUCCESS"
        ? "41A Cr.P.C Notice Created"
        : "41A Cr.P.C Notice Updated";
    dispatch(
      createAuditHistory(
        config.createAudits,
        getAuditHistoryPayload(crimeId, "investigation/41ACr.P.C", auditType)
      )
    );
  };

  useEffect(() => {
    if (isSuccess || isError) {
      if (
        successMessage === "41A Cr.P.C Notice Successfully Added" ||
        successMessage === "41A Cr.P.C Notice Successfully Updated"
      ) {
        openNotificationWithIcon("success", successMessage);
        auditHistoryEntry();
        fetchAccusedList();
        form.resetFields();
        if (!addAnother) {
          setSelectedSiderMenu("investigation");
        } else {
          form.resetFields();
          setSelectedAccusedValue("");
          setViewCRPCNotice41AReportDetails(false);
          setEditCRPCNotice41AReportObj(null);
          fetch41ACrpcDetailsList();
        }
        dispatch(resetActionType());
      } else if (errorMessage) {
        openNotificationWithIcon("error", errorMessage);
        dispatch(resetActionType());
      }
    }
  }, [actionType]);

  const handleSearch = (text) => {
    setsearchText(text);
  };

  useEffect(() => {
    dispatch(getStaffList(`${config.getMasterData}/${masterDataType.STAFF}`));
    dispatch(
      getCourtsBasedonPsCode(
        `${config.masterData}/getCourtsBasedonPsCode?psCode=${currentUser?.cctns_unit_id}`
      )
    );
    fetchAccusedList();
    fetch41ACrpcDetailsList();
  }, []);

  const filterList =
    !isEmpty(suspectAccusedList) &&
    suspectAccusedList.filter((s) => !s.is41ACRPC);

  const nonArrestRelatedAccused = () => {
    //The accused who has been worked in any of the Arrest related pages  should not come into the 41A CrPC page again.
    let result = [];
    if (suspectAccusedList.length > 0) {
      result = suspectAccusedList.filter(
        (ele) => !ele?.isArrestRelated && !ele.isDied
      );
    }
    return result;
  };

  const getAccusedDropdownData = () =>
    !isEmpty(nonArrestRelatedAccused()) &&
    getAccuseds(nonArrestRelatedAccused());
  const accusedPersonalDetails =
    !isEmpty(filterList) &&
    selectedAccusedValue &&
    isArray(getAccusedDropdownData()) &&
    getAccusedDropdownData().length > 0 &&
    first(
      getAccusedDropdownData().filter((s) => s._id === selectedAccusedValue)
    );

  const existingStatementUrl =
    !isUndefined(editCRPCNotice41AReportObj?.statementURL) &&
    editCRPCNotice41AReportObj?.statementURL?.url !== ""
      ? editCRPCNotice41AReportObj?.statementURL
      : "";

  const getCommonPayload = (values, identityURL, ackURL, statementUrl) => {
    const commonPayload = {
      crimeId: crimeId,
      isAddressCorrect: values.isAddressCorrect,
      dateOfIssue: values?.dateOfIssue ? getDate(values.dateOfIssue) : "",
      noOfDaysGivenForExplanation: values?.noOfDaysGivenForExplanation,
      intimateSuperiorOfficer: values?.intimateSuperiorOfficer,
      explanationSubmittedWithInTime:
        values?.explanationSubmittedWithInTime === undefined
          ? true
          : values?.explanationSubmittedWithInTime,
      deputedPC: values.deputedPC,
      conditionsImposed: checkedList,
      identityURL: identityURL,
      ackURL: ackURL,
      statementURL: statementUrl,
      falseAddressNotResiding: values?.falseAddressNotResiding,
      againCommittedOtherOffence: values?.againCommittedOtherOffence,
      crNumber: values?.crNumber,
      us: values?.us,
      againThreatened: values?.againThreatened,
      requistionFieldDate:
        values?.requistionFieldDate &&
        moment(new Date(values?.requistionFieldDate)).isValid()
          ? moment(new Date(values?.requistionFieldDate))
          : "",
      courtName: values?.courtName,
      courtOrderNo: values?.courtOrderNo,
      date:
        values?.date && moment(new Date(values?.date)).isValid()
          ? moment(new Date(values?.date))
          : "",
      conditionsImposedByCourt: values?.conditionsImposedByCourt,
      toAppearBeforeIo: values?.toAppearBeforeIo,
      selectDaysOfWeek: values?.selectDaysOfWeek,
      selectPeriod: !isUndefined(values.selectPeriod)
        ? [getDate(values?.selectPeriod[0]), getDate(values?.selectPeriod[1])]
        : "",
      cooperateWithIo: values?.cooperateWithIo,
    };
    return commonPayload;
  };

  const submit = async () => {
    const values = await form.validateFields();
    const identityURLData = new FormData();
    identityURL.forEach((file) => {
      identityURLData.append("file", file.originFileObj);
    });
    identityURLData.append("prefixFolder", crimeId);
    identityURLData.append(
      "folderPath",
      `${crimeId}/${folderName.CRPC_NOTICE41A}/file`
    );

    const ackURLData = new FormData();
    ackURL.forEach((file) => {
      ackURLData.append("file", file.originFileObj);
    });
    ackURLData.append("prefixFolder", crimeId);
    ackURLData.append(
      "folderPath",
      `${crimeId}/${folderName.CRPC_NOTICE41A}/file`
    );

    const statementUrlData = new FormData();
    statementUrl.forEach((file) => {
      statementUrlData.append("file", file.originFileObj);
    });
    statementUrlData.append("prefixFolder", crimeId);
    statementUrlData.append(
      "folderPath",
      `${crimeId}/${folderName.CRPC_NOTICE41A}/file`
    );

    const addCRPCNotice41A = {
      accusedId: accusedPersonalDetails?._id,
    };

    const updateCRPCNotice41A = {
      accusedId: editCRPCNotice41AReportObj?.accusedId,
      _id: editCRPCNotice41AReportObj?._id,
    };

    const savedIdentifyUrl =
      editCRPCNotice41AReportObj?.identityURL?.url !== ""
        ? editCRPCNotice41AReportObj?.identityURL
        : {};
    const savedackURL =
      editCRPCNotice41AReportObj?.ackURL?.identityURL?.url !== ""
        ? editCRPCNotice41AReportObj?.ackURL
        : {};

    if (!isEmpty(identityURL) && !isEmpty(ackURL) && !isEmpty(statementUrl)) {
      axios
        .all([
          axios.post(`${config.fileUpload}/upload`, identityURLData),
          axios.post(`${config.fileUpload}/upload`, ackURLData),
          axios.post(`${config.fileUpload}/upload`, statementUrlData),
        ])
        .then(
          axios.spread((data1, data2, data3) => {
            if (
              data1.status === 200 &&
              data2.status === 200 &&
              data3.status === 200
            ) {
              const identityURLResult = first(data1.data?.data);
              const ackURLResult = first(data2.data?.data);
              const statementUrlResult = first(data3.data?.data);
              const addCRPCNotice41AReportPayload = {
                ...addCRPCNotice41A,
                ...getCommonPayload(
                  values,
                  getFilePayload(identityURLResult),
                  getFilePayload(ackURLResult),
                  getFilePayload(statementUrlResult)
                ),
              };
              const updateCRPCNotice41AReportPayload = {
                ...updateCRPCNotice41A,
                ...getCommonPayload(
                  values,
                  getFilePayload(identityURLResult),
                  getFilePayload(ackURLResult),
                  getFilePayload(statementUrlResult)
                ),
              };

              if (editCRPCNotice41AReportObj?._id) {
                dispatch(
                  update41ACrpcDetails(
                    `${API_ARREST_BASE_URL}/api/41ACRPC`,
                    updateCRPCNotice41AReportPayload
                  )
                );
              } else {
                dispatch(
                  add41ACrpcDetails(
                    `${API_ARREST_BASE_URL}/api/41ACRPC`,
                    addCRPCNotice41AReportPayload
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
      !isEmpty(identityURL) &&
      !isEmpty(ackURL) &&
      isEmpty(statementUrl)
    ) {
      axios
        .all([
          axios.post(`${config.fileUpload}/upload`, identityURLData),
          axios.post(`${config.fileUpload}/upload`, ackURLData),
        ])
        .then(
          axios.spread((data1, data2) => {
            if (data1.status === 200 && data2.status === 200) {
              const identityURLResult = first(data1.data?.data);
              const ackURLResult = first(data2.data?.data);

              const addCRPCNotice41AReportPayload = {
                ...addCRPCNotice41A,
                ...getCommonPayload(
                  values,
                  getFilePayload(identityURLResult),
                  getFilePayload(ackURLResult),
                  existingStatementUrl
                ),
              };
              const updateCRPCNotice41AReportPayload = {
                ...updateCRPCNotice41A,
                ...getCommonPayload(
                  values,
                  getFilePayload(identityURLResult),
                  getFilePayload(ackURLResult),
                  existingStatementUrl
                ),
              };

              if (editCRPCNotice41AReportObj?._id) {
                dispatch(
                  update41ACrpcDetails(
                    `${API_ARREST_BASE_URL}/api/41ACRPC`,
                    updateCRPCNotice41AReportPayload
                  )
                );
              } else {
                dispatch(
                  add41ACrpcDetails(
                    `${API_ARREST_BASE_URL}/api/41ACRPC`,
                    addCRPCNotice41AReportPayload
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
      !isEmpty(ackURL) &&
      isEmpty(identityURL) &&
      isEmpty(statementUrl)
    ) {
      axios
        .post(`${config.fileUpload}/upload`, ackURLData)
        .then((res) => {
          if (res.status === 200) {
            const { data } = res.data;
            const payloadData = first(data);
            const addCRPCNotice41AReportPayload = {
              ...addCRPCNotice41A,
              ...getCommonPayload(
                values,
                savedIdentifyUrl,
                getFilePayload(payloadData),
                existingStatementUrl
              ),
            };
            const updateCRPCNotice41AReportPayload = {
              ...updateCRPCNotice41A,
              ...getCommonPayload(
                values,
                savedIdentifyUrl,
                getFilePayload(payloadData),
                existingStatementUrl
              ),
            };

            if (editCRPCNotice41AReportObj?._id) {
              dispatch(
                update41ACrpcDetails(
                  `${API_ARREST_BASE_URL}/api/41ACRPC`,
                  updateCRPCNotice41AReportPayload
                )
              );
            } else {
              dispatch(
                add41ACrpcDetails(
                  `${API_ARREST_BASE_URL}/api/41ACRPC`,
                  addCRPCNotice41AReportPayload
                )
              );
            }
          }
        })
        .catch((err) => {
          getMediaUploadError(err, openNotificationWithIcon);
        });
    } else if (
      !isEmpty(identityURL) &&
      isEmpty(ackURL) &&
      isEmpty(statementUrl)
    ) {
      axios
        .post(`${config.fileUpload}/upload`, identityURLData)
        .then((res) => {
          if (res.status === 200) {
            const { data } = res.data;
            const payloadData = first(data);
            const addCRPCNotice41AReportPayload = {
              ...addCRPCNotice41A,
              ...getCommonPayload(
                values,
                getFilePayload(payloadData),
                savedackURL,
                existingStatementUrl
              ),
            };
            const updateCRPCNotice41AReportPayload = {
              ...updateCRPCNotice41A,
              ...getCommonPayload(
                values,
                getFilePayload(payloadData),
                savedackURL,
                existingStatementUrl
              ),
            };

            if (editCRPCNotice41AReportObj?._id) {
              dispatch(
                update41ACrpcDetails(
                  `${API_ARREST_BASE_URL}/api/41ACRPC`,
                  updateCRPCNotice41AReportPayload
                )
              );
            } else {
              dispatch(
                add41ACrpcDetails(
                  `${API_ARREST_BASE_URL}/api/41ACRPC`,
                  addCRPCNotice41AReportPayload
                )
              );
            }
          }
        })
        .catch((err) => {
          getMediaUploadError(err, openNotificationWithIcon);
        });
    } else if (
      !isEmpty(statementUrl) &&
      isEmpty(identityURL) &&
      isEmpty(ackURL)
    ) {
      axios
        .post(`${config.fileUpload}/upload`, statementUrlData)
        .then((res) => {
          if (res.status === 200) {
            const { data } = res.data;
            const payloadData = first(data);
            const addCRPCNotice41AReportPayload = {
              ...addCRPCNotice41A,
              ...getCommonPayload(
                values,
                savedIdentifyUrl,
                savedackURL,
                getFilePayload(payloadData)
              ),
            };
            const updateCRPCNotice41AReportPayload = {
              ...updateCRPCNotice41A,
              ...getCommonPayload(
                values,
                savedIdentifyUrl,
                savedackURL,
                getFilePayload(payloadData)
              ),
            };

            if (editCRPCNotice41AReportObj?._id) {
              dispatch(
                update41ACrpcDetails(
                  `${API_ARREST_BASE_URL}/api/41ACRPC`,
                  updateCRPCNotice41AReportPayload
                )
              );
            } else {
              dispatch(
                add41ACrpcDetails(
                  `${API_ARREST_BASE_URL}/api/41ACRPC`,
                  addCRPCNotice41AReportPayload
                )
              );
            }
          }
        })
        .catch((err) => {
          getMediaUploadError(err, openNotificationWithIcon);
        });
    } else if (
      isEmpty(identityURL) &&
      isEmpty(ackURL) &&
      isEmpty(statementUrl)
    ) {
      const addCRPCNotice41AReportPayload = {
        ...addCRPCNotice41A,
        ...getCommonPayload(
          values,
          savedIdentifyUrl,
          savedackURL,
          existingStatementUrl
        ),
      };
      const updateCRPCNotice41AReportPayload = {
        ...updateCRPCNotice41A,
        ...getCommonPayload(
          values,
          savedIdentifyUrl,
          savedackURL,
          existingStatementUrl
        ),
      };

      if (editCRPCNotice41AReportObj?._id) {
        dispatch(
          update41ACrpcDetails(
            `${API_ARREST_BASE_URL}/api/41ACRPC`,
            updateCRPCNotice41AReportPayload
          )
        );
      } else {
        dispatch(
          add41ACrpcDetails(
            `${API_ARREST_BASE_URL}/api/41ACRPC`,
            addCRPCNotice41AReportPayload
          )
        );
      }
    }
  };

  const handleEditCRPCNotice41AReport = (value) => {
    if (value) {
      setEditCRPCNotice41AReportObj(value);
      setSelectedAccusedValue(value.accusedId?._id);
      setCheckedList(value?.conditionsImposed);
      setIndeterminate(
        !!value?.conditionsImposed.length &&
          value?.conditionsImposed.length < condisonImposedList.length
      );
      setCheckAll(
        value?.conditionsImposed.length === condisonImposedList.length
      );
      setIsExplanationSubmittedWithInTime(
        value?.explanationSubmittedWithInTime
      );
      setIsAddressCorrect(value?.isAddressCorrect);
      const identityURL = value?.identityURL;
      if (identityURL && identityURL?.name !== "") {
        setSelectedIdentityURL([identityURL]);
      } else {
        setSelectedIdentityURL([]);
      }
      const ackURL = value?.ackURL;
      if (ackURL && ackURL?.name !== "") {
        setSelectedAckURL([ackURL]);
      } else {
        setSelectedAckURL([]);
      }
      const statementURL = value?.statementURL;
      if (statementURL && statementURL?.name !== "") {
        setSelectedStatementUrl([statementURL]);
      } else {
        setSelectedStatementUrl([]);
      }

      const dateList = [];
      const selectPeriod = value?.selectPeriod;
      if (selectPeriod?.length > 0 && selectPeriod[0] && selectPeriod[1]) {
        dateList.push(
          moment(new Date(selectPeriod[0])).isValid()
            ? moment(new Date(selectPeriod[0]))
            : ""
        );
        dateList.push(
          moment(new Date(selectPeriod[1])).isValid()
            ? moment(new Date(selectPeriod[1]))
            : ""
        );
      }
      const accusedDetails = value?.accusedId;
      const personalDetails =
        !isUndefined(accusedDetails) && accusedDetails?.personalDetails;
      const accusedPerson =
        (personalDetails?.name ? personalDetails?.name : "") +
        " " +
        (personalDetails?.surname ? personalDetails?.surname : "");

      form.setFieldsValue({
        accusedId: accusedPerson,
        dateOfIssue: moment(new Date(value?.dateOfIssue)).isValid()
          ? moment(new Date(value?.dateOfIssue))
          : "",
        noOfDaysGivenForExplanation: value?.noOfDaysGivenForExplanation,
        intimateSuperiorOfficer: value?.intimateSuperiorOfficer,
        explanationSubmittedWithInTime: value?.explanationSubmittedWithInTime,
        deputedPC: value?.deputedPC,
        isAddressCorrect: value?.isAddressCorrect,
        falseAddressNotResiding: value?.falseAddressNotResiding,
        againCommittedOtherOffence: value?.againCommittedOtherOffence,
        crNumber: value?.crNumber,
        us: value?.us,
        againThreatened: value?.againThreatened,
        requistionFieldDate:
          value?.requistionFieldDate &&
          moment(new Date(value?.requistionFieldDate)).isValid()
            ? moment(new Date(value?.requistionFieldDate))
            : "",
        courtName: value?.courtName,
        courtOrderNo: value?.courtOrderNo,
        date:
          value?.date && moment(new Date(value?.date)).isValid()
            ? moment(new Date(value?.date))
            : "",
        conditionsImposedByCourt: value?.conditionsImposedByCourt,
        toAppearBeforeIo: value?.toAppearBeforeIo,
        selectDaysOfWeek: value?.selectDaysOfWeek,
        selectPeriod: dateList,
        cooperateWithIo: value?.cooperateWithIo,
      });
    }
  };

  const checkFields = async () => {
    const values = await form.validateFields();
    setFormValid(!Object.values(values).every((v) => v == null || v === ""));
  };

  function onChange(e) {
    console.log(`checked = ${e.target.checked}`);
  }

  const showModal = (templateName, fileName, templateAvailable = false) => {
    if (templateAvailable) {
      setIsModalVisible(true);
      setSelectedTemplateName(`${templateName} - Preview`);
      setSelectedFileName(fileName);
    } else {
      setIsModalVisible(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const reportData = getDataForDocument(
    editCRPCNotice41AReportObj,
    selectedFileName,
    selectedFir,
    currentUser,
    savedFir
  );

  const displayUploadReports = (name, title, fileList, setData, disabled) => {
    return (
      <Col className="file-upload" style={{ marginLeft: 0 }}>
        <Form.Item name={name}>
          <Upload
            fileList={fileList}
            customRequest={dummyRequest}
            onPreview={handleDownload}
            onChange={(info) => onFileChange(info, setData)}
            multiple={false}
          >
            <Button
              className="saveButton"
              style={{ marginTop: 10, width: 300 }}
              icon={<CameraFilled />}
              disabled={disabled || disableForm}
            >
              {title}
            </Button>
          </Upload>
        </Form.Item>
      </Col>
    );
  };

  const getSavedData = () => {
    let savedData = [];
    isArray(crpc41AList) &&
      !isEmpty(crpc41AList) &&
      // eslint-disable-next-line array-callback-return
      crpc41AList.map((data) => {
        const { personalDetails, presentAddress } =
          !isUndefined(data?.accusedId) &&
          !isNull(data?.accusedId) &&
          data?.accusedId;
        savedData.push(
          getSavedDataResult(data, personalDetails, presentAddress, [])
        );
      });
    return savedData;
  };

  const onChangeCheckbox = (list) => {
    setCheckedList(list);
    setIndeterminate(!!list.length && list.length < condisonImposedList.length);
    setCheckAll(list.length === condisonImposedList.length);
  };

  const onCheckAllChange = (e) => {
    setCheckedList(e.target.checked ? condisonImposedList : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };

  const handleDownload = (file) => {
    getFileById(file?.fileId, file?.name, file?.url);
  };

  return (
    <ModuleWrapper>
      <ContentHeader
        headerTitle="41A Cr.P.C Notice"
        addAnother
        addAnotherText="Add Another"
        disableButton={disableForm}
        onSubmitClick={submit}
        isInvestigation={true}
        setAddAnother={setAddAnother}
        onCancel={() => setSelectedSiderMenu("investigation")}
      />
      {isFetching ? (
        <Loader />
      ) : (
        <Row>
          <Card style={{ width: "70%" }} className="cardLeftStyle">
            <Form form={form} layout="vertical">
              <Col>
                <Row>
                  <Col span={6}>
                    <Form.Item
                      name="accusedId"
                      label="Select Accused"
                      rules={[
                        { required: true, message: "Please Select Accused!" },
                      ]}
                    >
                      <Select
                        suffixIcon={
                          <CaretDownOutlined className="dropDownIcon" />
                        }
                        showSearch
                        onSearch={handleSearch}
                        filterOption={(input, option) =>
                          searchText &&
                          option.props.label
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                        onSelect={(item) => {
                          setSelectedAccusedValue(item);
                          checkFields();
                        }}
                        disabled={
                          viewCRPCNotice41AReportDetails ||
                          editCRPCNotice41AReportObj?._id ||
                          disableForm
                        }
                      >
                        {!isEmpty(getAccusedDropdownData()) &&
                          getAccusedDropdownData().map((item, index) => (
                            <Option
                              key={index}
                              value={item._id}
                              label={item.label}
                            >
                              {item.label}
                            </Option>
                          ))}
                      </Select>
                    </Form.Item>
                    {selectedAccusedValue !== "" && (
                      <AccusedCard
                        accusedPersonalDetails={accusedPersonalDetails}
                        title="Accused Details"
                      />
                    )}
                  </Col>
                </Row>
                <Card className="card-style">
                  <Row>
                    <Col span={10}>
                      <Col className="custody-col" style={{ marginBottom: 15 }}>
                        <Form.Item
                          name="dateOfIssue"
                          label="Date of issue of 41A Cr.P.C.notice"
                          rules={[
                            {
                              required: true,
                            },
                          ]}
                        >
                          <DatePicker
                            onChange={checkFields}
                            placeholder="Select Date"
                            style={{ width: 250 }}
                            disabled={
                              viewCRPCNotice41AReportDetails || disableForm
                            }
                            format={DATE_FORMAT}
                          />
                        </Form.Item>
                      </Col>
                      <Col className="custody-col" style={{ marginBottom: 15 }}>
                        <Form.Item
                          name="noOfDaysGivenForExplanation"
                          label="No of days given for explanation"
                          rules={[
                            {
                              required: true,
                            },
                          ]}
                        >
                          <Input
                            onChange={checkFields}
                            style={{ width: 100 }}
                            disabled={
                              viewCRPCNotice41AReportDetails || disableForm
                            }
                          />
                        </Form.Item>
                      </Col>
                      <Col className="custody-col" style={{ marginBottom: 15 }}>
                        <Form.Item
                          name="intimateSuperiorOfficer"
                          valuePropName="checked"
                        >
                          <Checkbox
                            onChange={onChange}
                            disabled={
                              viewCRPCNotice41AReportDetails || disableForm
                            }
                          >
                            Intimation to Superior Officer about issuing of 41A
                            Cr.P.C
                          </Checkbox>
                        </Form.Item>
                      </Col>
                      <Col className="custody-col" style={{ marginBottom: 15 }}>
                        <Form.Item
                          name="explanationSubmittedWithInTime"
                          label="Whether explanations submitted within stipulated time and cooperating with investigation."
                        >
                          <Radio.Group
                            defaultValue={true}
                            onChange={(e) =>
                              setIsExplanationSubmittedWithInTime(
                                e.target.value
                              )
                            }
                            disabled={
                              viewCRPCNotice41AReportDetails || disableForm
                            }
                          >
                            <Radio value={true}>Yes</Radio>
                            <Radio value={false}>No</Radio>
                          </Radio.Group>
                        </Form.Item>
                      </Col>
                      {isExplanationSubmittedWithInTime === true &&
                        displayUploadReports(
                          "identityURL",
                          "Upload Photo Identity Of Accused",
                          editCRPCNotice41AReportObj?._id &&
                            editCRPCNotice41AReportObj?.identityURL &&
                            editCRPCNotice41AReportObj?.identityURL !== ""
                            ? selectedIdentityURL
                            : identityURL,
                          setIdentityURL,
                          viewCRPCNotice41AReportDetails ||
                            !isEmpty(identityURL)
                        )}
                      {isExplanationSubmittedWithInTime === true &&
                        displayUploadReports(
                          "ackURL",
                          "Upload Ack. of 41A Cr.P.C. in Court",
                          editCRPCNotice41AReportObj?._id &&
                            editCRPCNotice41AReportObj?.ackURL &&
                            editCRPCNotice41AReportObj?.ackURL !== ""
                            ? selectedAckURL
                            : ackURL,
                          setackURL,
                          viewCRPCNotice41AReportDetails || !isEmpty(ackURL)
                        )}
                      {isExplanationSubmittedWithInTime === true ? (
                        <>
                          <Col
                            className="custody-col"
                            style={{ marginTop: 15 }}
                          >
                            <Form.Item
                              name="deputedPC"
                              label="Deputed PC for Address Verification"
                            >
                              {renderFieldsWithDropDown(
                                staffMembersList,
                                null,
                                handleSearch,
                                searchText,
                                250,
                                viewCRPCNotice41AReportDetails || disableForm,
                                null
                              )}
                            </Form.Item>
                          </Col>
                          <Col
                            className="custody-col"
                            style={{ marginTop: 15 }}
                          >
                            Address correct or not?
                            <Form.Item
                              name="isAddressCorrect"
                              defaultValue={true}
                            >
                              <Radio.Group
                                onChange={(e) =>
                                  setIsAddressCorrect(e.target.value)
                                }
                                disabled={
                                  viewCRPCNotice41AReportDetails || disableForm
                                }
                              >
                                <Radio value={true}>Yes</Radio>
                                <Radio value={false}>No</Radio>
                              </Radio.Group>
                            </Form.Item>
                          </Col>
                        </>
                      ) : null}
                    </Col>
                    {isExplanationSubmittedWithInTime === true ? (
                      <Col span={14}>
                        <Checkbox
                          indeterminate={indeterminate}
                          onChange={onCheckAllChange}
                          checked={checkAll}
                          disabled={
                            viewCRPCNotice41AReportDetails || disableForm
                          }
                        >
                          <h4>Conditions imposed</h4>
                        </Checkbox>
                        <span>
                          <hr style={{ backgroundColor: "#d8d8d8" }} />
                        </span>
                        <CheckboxGroup
                          options={condisonImposedList}
                          value={checkedList}
                          onChange={onChangeCheckbox}
                          disabled={
                            viewCRPCNotice41AReportDetails || disableForm
                          }
                        />
                      </Col>
                    ) : null}
                  </Row>
                </Card>
              </Col>
              {isExplanationSubmittedWithInTime === false ? (
                <ProcedureForNonComplaince
                  checkFields={checkFields}
                  disabled={viewCRPCNotice41AReportDetails || disableForm}
                  form={form}
                  handleSearch={handleSearch}
                  searchText={searchText}
                  fileList={
                    editCRPCNotice41AReportObj?._id &&
                    editCRPCNotice41AReportObj?.statementURL &&
                    editCRPCNotice41AReportObj?.statementURL !== ""
                      ? selectedStatementUrl
                      : statementUrl
                  }
                  setData={setStatementUrl}
                  courtsFromPSList={courtsFromPSList}
                />
              ) : null}
            </Form>
          </Card>
          <Card
            style={{ width: "30%" }}
            className="right-section cardRightStyle"
          >
            <DisplayReportGenerations
              templateLists={
                isExplanationSubmittedWithInTime === true
                  ? CRPC41ATemplates
                  : CRPC41ATemplatesNo
              }
              showModal={showModal}
              disabled={
                viewCRPCNotice41AReportDetails ||
                !editCRPCNotice41AReportObj?._id ||
                disableForm
              }
              selectedRecord={editCRPCNotice41AReportObj}
              selectedModule="crPcNotice41A"
              accusedId={editCRPCNotice41AReportObj?.accusedId?._id}
            />
            {!isEmpty(crpc41AList) ? (
              <Button
                style={{ marginTop: "40px", width: "100%" }}
                onClick={() => setrecordsIsModalVisible(true)}
              >
                {crpc41AList && crpc41AList.length > 0 ? crpc41AList.length : 0}{" "}
                41A Cr.P.C Records
              </Button>
            ) : null}

            <Modal
              title="41A Cr.P.C Records"
              visible={recordsIsModalVisible}
              onOk={() => setrecordsIsModalVisible(false)}
              onCancel={() => setrecordsIsModalVisible(false)}
              style={{ minWidth: "95vw" }}
              footer={null}
            >
              <div style={{ maxHeight: 650, overflowY: "auto" }}>
                <SavedRecords
                  dataSource={getSavedData()}
                  editDetails={handleEditCRPCNotice41AReport}
                  setViewDetails={setViewCRPCNotice41AReportDetails}
                  selectedRecord={editCRPCNotice41AReportObj}
                  isMedia={false}
                  recordVisible={setrecordsIsModalVisible}
                />
              </div>
            </Modal>
          </Card>
        </Row>
      )}
      {isModalVisible && (
        <TemplatesModal
          reportData={reportData}
          selectedTemplateName={selectedTemplateName}
          selectedFileName={selectedFileName}
          getHTMLFromTemplate={getHTMLFromTemplate}
          handleCancel={handleCancel}
          isModalVisible={isModalVisible}
        />
      )}
    </ModuleWrapper>
  );
}
