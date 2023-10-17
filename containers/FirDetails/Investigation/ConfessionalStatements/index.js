import { useState, useEffect } from "react";
import ContentHeader from "../../ContentHeader";
import moment from "moment";
import axios from "axios";
import {
  first,
  isEmpty,
  isUndefined,
  uniqBy,
  filter,
  isArray,
  isNull,
} from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { config } from "@config/site.config";
import Loader from "@components/utility/loader";
import firActions from "@redux/fir/actions";
import confessionalStatementsAction from "@redux/investigations/confessionalStatements/actions";
import AccusedCard from "../CommonForms/AccusedCard";
import { loadState } from "@lib/helpers/localStorage";
import suspectAccusedAction from "@redux/investigations/suspectAccused/actions";
import { textFieldRules } from "@components/Common/formOptions";
import { disableFutureDates } from "@components/Common/helperMethods";
import AddAddress from "../CommonForms/AddAddress";

import {
  Row,
  Card,
  Col,
  Form,
  Input,
  DatePicker,
  Upload,
  Button,
  notification,
  Select,
  Modal,
} from "antd";
import {
  CaretDownOutlined,
  CameraFilled,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  DATE_TIME_FORMAT,
  DATE_FORMAT,
  renderFieldsWithDropDown,
  renderFieldsWithMultipleDropDownPanchWitness,
  getDate,
  getAccuseds,
  masterDataType,
  getStaffsDetails,
  DATE_YY_MM_DD,
  folderName,
  getMediaPayload,
  getMediaUploadError,
  getSavedDataResult,
  getStateNames,
} from "@containers/FirDetails/fir-util";
import masterDataActions from "@redux/masterData/actions";
import { confessionalStatementsForm } from "./const";
import { ModuleWrapper } from "../CommonDetails/styles";
import mediaManagerActions from "@redux/fir/mediaManager/actions";
import UploadForm from "@components/Common/uploadForm";
import SavedRecords from "./SavedRecords";
import { getAuditHistoryPayload } from "@containers/const";
import auditHistoryActions from "@redux/auditHistory/actions";
import OtherLinks from "./OtherLinks";

const Option = Select.Option;

export default function ConfessionalStatements({ setSelectedSiderMenu }) {
  const [form] = Form.useForm();
  const [addressForm] = Form.useForm();
  const crimeId = loadState("selectedFirId");
  const dispatch = useDispatch();
  const [formValid, setFormValid] = useState(false);
  const [addAnother, setAddAnother] = useState(false);
  const [pwList, setPwList] = useState([]);
  const [selectedAccusedValue, setSelectedAccusedValue] = useState("");
  const [isAddressModalVisible, setIsAddressModalVisible] = useState(false);
  const [addressDetails, setAddressDetails] = useState([]);

  const [editConfessionalStatementsObj, setEditConfessionalStatementsObj] =
    useState(null);
  const [
    viewConfessionalStatementsDetails,
    setViewConfessionalStatementsDetails,
  ] = useState(false);
  const { createAuditHistory } = auditHistoryActions;
  const { getAccusedList } = suspectAccusedAction;
  const { fetchPanchWitnessList } = firActions;
  const { getPlaceOfRecordingsList, getStatesName, getUnitsList } =
    masterDataActions;
  const { suspectAccusedList } = useSelector((state) => state.SuspectAccused);
  const {
    placeOfRecordingsList,
    staffList,
    statesNameList,
    unitList,
    stateDistrictList,
  } = useSelector((state) => state.MasterData);
  const {
    addConfessionalStatementsDetails,
    updateConfessionalStatementsDetails,
    getConfessionalStatementsList,
    resetActionType,
  } = confessionalStatementsAction;
  const {
    confessionalStatementsList,
    isFetching,
    actionType,
    successMessage,
    errorMessage,
  } = useSelector((state) => state.ConfessionalStatements);
  const { uploadTemplates, resetTemplatesActionType } = mediaManagerActions;
  const { uploadSuccessMessage, uploadActionType, uploadErrorMessage } =
    useSelector((state) => state.MediaManager);
  const [inputFileList, setInputFileList] = useState([]);
  const [confessionInputList, setConfessionInputList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("confessional");
  const [placeOfRec_Conf_state, setplaceOfRec_Conf_state] = useState("");
  const [selectedState, setselectedState] = useState("");
  const [selectedUnit_dis, setselectedUnit_dis] = useState("");
  const [selectedUnit_disList, setselectedUnit_disList] = useState([]);
  const [selectedDivList, setselectedDivList] = useState([]);
  const [recordsIsModalVisible, setrecordsIsModalVisible] = useState(false);
  const [selectedAddressState, setSelectedAddressState] = useState("");
  const [selectedPermanentState, setSelectedPermanentState] = useState("");

  const { savedFir } = useSelector((state) => state.createFIR);
  const disableForm =
    savedFir?.caseStatus === "Disposal" ||
    savedFir?.isTransferOfCaseFile === true ||
    savedFir?.isChargeSheetTakenOrFiled === true;

  const isSuccessUpload = uploadActionType === "UPLOAD_TEMPLATES_SUCCESS";
  const isErrorUpload = uploadActionType === "UPLOAD_TEMPLATES_ERROR";

  const { panchWitnessList } = useSelector((state) => state.FIR);

  const isSuccess =
    actionType === "ADD_CONFESSIONAL_STATEMENTS_SUCCESS" ||
    actionType === "UPDATE_CONFESSIONAL_STATEMENTS_SUCCESS";

  const isError =
    actionType === "ADD_CONFESSIONAL_STATEMENTS_ERROR" ||
    actionType === "UPDATE_CONFESSIONAL_STATEMENTS_ERROR";

  const openNotificationWithIcon = (type, message) => {
    return notification[type]({
      message: message,
    });
  };

  const auditHistoryEntry = () => {
    const auditType =
      actionType === "ADD_CONFESSIONAL_STATEMENTS_SUCCESS"
        ? "Confessional Statements Created"
        : "Confessional Statements Updated";
    dispatch(
      createAuditHistory(
        config.createAudits,
        getAuditHistoryPayload(
          crimeId,
          "investigation/confessionalStatements",
          auditType
        )
      )
    );
  };

  const [thisPoliceStationList, setThisPoliceStationList] = useState([
    {
      crNo_0: "",
      sectionOfLaw_0: "",
      dateOfOffence_0: null,
    },
  ]);

  const [thisPoliceStationObj, setThisPoliceStationObj] = useState([]);
  const [OtherPoliceStationList, setOtherPoliceStationList] = useState([
    {
      OPcrNo_0: "",
      OPsectionOfLaw_0: "",
      OPstate_0: null,
      OPunitDistrict_0: null,
      OPdivision_0: null,
      OPcircle_0: null,
      OPpsName_0: null,
    },
  ]);
  const [OtherPoliceStationObj, setOtherPoliceStationObj] = useState([]);
  const [serchText, setSerchText] = useState("");
  const handleSearch = (text) => {
    setSerchText(text);
  };

  const fetchAccusedList = () => {
    dispatch(
      getAccusedList(
        `${config.getPostCrimeSceneDetails}/ACCUSED/?crimeId=${crimeId}`
      )
    );
  };

  const fetchConfessionalStatementsList = () => {
    dispatch(
      getConfessionalStatementsList(
        `${config.confessionalStatement}?crimeId=${crimeId}`
      )
    );
  };

  const fetchPanchWitnessDetails = () => {
    dispatch(
      fetchPanchWitnessList(
        `${config.getPostCrimeSceneDetails}/PUNCHWITNESS/?crimeId=${crimeId}`
      )
    );
  };

  const getMasterDataList = () => {
    dispatch(
      getPlaceOfRecordingsList(
        `${config.getMasterData}/${masterDataType.PLACE_OF_RECORDINGS}`
      )
    );
  };

  useEffect(() => {
    const url = config.getMasterData;
    dispatch(getUnitsList(`${url}/UNITS`));
    dispatch(getStatesName(`${url}/STATES`));
    fetchAccusedList();
    fetchPanchWitnessDetails();
    getMasterDataList();
    fetchConfessionalStatementsList();
  }, []);

  useEffect(() => {
    setselectedUnit_disList(uniqBy(stateDistrictList, "District"));
  }, [stateDistrictList]);

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

  useEffect(() => {
    if (isSuccess || isError) {
      if (
        successMessage === "Confessional Statements Successfully Added" ||
        successMessage === "Confessional Statements Successfully Updated"
      ) {
        openNotificationWithIcon("success", successMessage);
        auditHistoryEntry();
        form.resetFields();
        if (!addAnother) {
          setSelectedSiderMenu("investigation");
        } else {
          form.resetFields();
          setSelectedAccusedValue("");
          setViewConfessionalStatementsDetails(false);
          setEditConfessionalStatementsObj(null);
          fetchConfessionalStatementsList();
          setInputFileList([]);
          setConfessionInputList([]);
        }
        dispatch(resetActionType());
      } else if (errorMessage) {
        openNotificationWithIcon("error", errorMessage);
        dispatch(resetActionType());
      }
    }
  }, [actionType]);

  useEffect(() => {
    let panchList = [];
    panchWitnessList &&
      panchWitnessList.length &&
      panchWitnessList.forEach((pw) => {
        const { personalDetails } = !isUndefined(pw.person) && pw.person;
        const label = `${personalDetails?.name} ${
          personalDetails?.surname || ""
        }`;
        const createdFrom = personalDetails?.createdFrom
          ? `(${personalDetails?.createdFrom})`
          : "";
        panchList.push({
          _id: pw.person?._id,
          label: label + createdFrom,
        });
      });
    setPwList(panchList);
  }, [panchWitnessList]);

  const staffMembersList = staffList && getStaffsDetails(staffList);

  const getAccusedDropdownData = () => {
    const getAccusedData = () => getAccuseds(suspectAccusedList);
    return getAccusedData();
  };

  useEffect(() => {
    const a1 = first(
      getAccusedDropdownData().filter((s) => s._id === selectedAccusedValue)
    );

    if (a1 && a1.status && a1.status === "Arrest By Police") {
      form.setFieldsValue({
        dateTimeofApprehension: moment(new Date(a1?.userDate)).isValid()
          ? moment(new Date(a1?.userDate))
          : "",
      });
    } else {
      form.setFieldsValue({
        dateTimeofApprehension: "",
      });
    }
  }, [selectedAccusedValue]);

  const accusedPersonalDetails = first(
    getAccusedDropdownData().filter((s) => s._id === selectedAccusedValue)
  );

  const getCommonPayload = (values, confessionMedia) => {
    const commonPayload = {
      crimeId: crimeId,
      panchWitness: values?.panchWitness,
      dateOfConfession: values?.dateOfConfession,
      dateTimeofApprehension: values?.dateTimeofApprehension
        ? getDate(values.dateTimeofApprehension)
        : "",
      apprehendedBy: [values.apprehendedBy],
      placeOfApprehension: values.placeOfApprehension,
      placeOfRecordingConfession: values.placeOfRecordingConfession,
      offencesConfessedofThisPoliceStation: thisPoliceStationObj,
      offencesConfessedofOtherPoliceStation: OtherPoliceStationObj,
      confessionMedia: confessionMedia,
    };

    return commonPayload;
  };

  const submit = async () => {
    const values = await form.validateFields();
    const mediaFormData = new FormData();
    inputFileList.forEach((file) => {
      mediaFormData.append("file", file.originFileObj);
    });
    mediaFormData.append("prefixFolder", crimeId);
    mediaFormData.append(
      "folderPath",
      `${crimeId}/${folderName.CONFESSIONAL_STATEMENTS}/media`
    );

    const addConfessionalStatements = {
      accusedId: accusedPersonalDetails?._id,
    };
    const updateaddConfessionalStatements = {
      accusedId: editConfessionalStatementsObj?.accusedId,
      _id: editConfessionalStatementsObj?._id,
    };

    if (!isEmpty(inputFileList)) {
      axios
        .post(`${config.fileUpload}/upload`, mediaFormData)
        .then((res) => {
          if (res.status === 200) {
            const { data } = res.data;
            const confessionMedia =
              editConfessionalStatementsObj?.confessionMedia;
            const mediaResult = isUndefined(confessionMedia)
              ? getMediaPayload(data, selectedCategory)
              : [
                  ...confessionMedia,
                  ...getMediaPayload(data, selectedCategory),
                ];
            const updateMediaResult = isEmpty(confessionMedia)
              ? getMediaPayload(data, selectedCategory)
              : mediaResult;

            const addConfessionalStatementsPayload = {
              ...addConfessionalStatements,
              ...getCommonPayload(
                values,
                getMediaPayload(data, selectedCategory)
              ),
            };

            const updateConfessionalStatementsPayload = {
              ...updateaddConfessionalStatements,
              ...getCommonPayload(values, updateMediaResult),
              confessionTemplateReportMedia: confessionInputList,
            };

            if (editConfessionalStatementsObj?._id) {
              dispatch(
                updateConfessionalStatementsDetails(
                  config.confessionalStatement,
                  updateConfessionalStatementsPayload
                )
              );
            } else {
              dispatch(
                addConfessionalStatementsDetails(
                  config.confessionalStatement,
                  addConfessionalStatementsPayload
                )
              );
            }
          }
        })
        .catch((err) => {
          getMediaUploadError(err, openNotificationWithIcon);
        });
    } else if (isEmpty(inputFileList)) {
      const updateMediaResult = isEmpty(
        editConfessionalStatementsObj?.confessionMedia
      )
        ? []
        : editConfessionalStatementsObj?.confessionMedia;
      const addConfessionalStatementsPayload = {
        ...addConfessionalStatements,
        ...getCommonPayload(values, []),
      };

      const updateConfessionalStatementsPayload = {
        ...updateaddConfessionalStatements,
        ...getCommonPayload(values, updateMediaResult),
        confessionTemplateReportMedia: confessionInputList,
      };

      if (editConfessionalStatementsObj?._id) {
        dispatch(
          updateConfessionalStatementsDetails(
            config.confessionalStatement,
            updateConfessionalStatementsPayload
          )
        );
      } else {
        dispatch(
          addConfessionalStatementsDetails(
            config.confessionalStatement,
            addConfessionalStatementsPayload
          )
        );
      }
    }
  };

  const checkFields = async () => {
    const values = await form.validateFields();
    setFormValid(!Object.values(values).every((v) => v == null || v === ""));
  };

  const onChangeDate = (date, _dateString) => {
    console.log(moment(date).format(DATE_YY_MM_DD));
    checkFields();
  };

  const displayConfessionalStatementsFields = (name) => {
    switch (name) {
      case "dateTimeofApprehension":
        return (
          <DatePicker
            showTime
            format={DATE_TIME_FORMAT}
            placeholder="Select Date & Time"
            onChange={onChangeDate}
            style={{ width: 200 }}
            disabled={viewConfessionalStatementsDetails || disableForm}
            disabledDate={disableFutureDates}
          />
        );
      case "panchWitness":
        return renderFieldsWithMultipleDropDownPanchWitness(
          pwList,
          null,
          handleSearch,
          serchText,
          200,
          viewConfessionalStatementsDetails || disableForm
        );
      case "apprehendedBy":
        return renderFieldsWithDropDown(
          staffMembersList,
          null,
          handleSearch,
          serchText,
          200,
          viewConfessionalStatementsDetails || disableForm
        );
      case "placeOfRecordingConfession":
        return renderFieldsWithDropDown(
          placeOfRecordingsList,
          setplaceOfRec_Conf_state,
          handleSearch,
          serchText,
          200,
          viewConfessionalStatementsDetails || disableForm
        );
      default:
        return (
          <Input
            onChange={checkFields}
            style={{ width: 200 }}
            maxLength={textFieldRules.maxLength}
            disabled={viewConfessionalStatementsDetails || disableForm}
          />
        );
    }
  };

  const displayReportGenerations = () => {
    return (
      <Row className="row-item">
        <Form.Item name="left_upload" style={{ width: "80%" }}>
          <Upload
            fileList={confessionInputList}
            customRequest={(options) => {
              const { crimeId, _id } =
                !isUndefined(editConfessionalStatementsObj) &&
                editConfessionalStatementsObj;
              let formData = new FormData();
              formData.append("file", options.file);
              formData.append(
                "prefixFolder",
                editConfessionalStatementsObj?.crimeId
              );
              const folderPath = `${crimeId}/confessionalStatements/reports`;
              formData.append("folderPath", folderPath);
              axios
                .post(`${config.fileUpload}/upload`, formData)
                .then((res) => {
                  if (res.status) {
                    const { data } = res.data;
                    const payloadData = first(data);
                    setConfessionInputList([payloadData]);
                    const payload = {
                      _id: _id,
                      crimeId: crimeId,
                      accusedId: editConfessionalStatementsObj?.accusedId?._id,
                      action: "confessionalStatements",
                      actionSubType: "confessionalStatements",
                      templates: [
                        {
                          category: "Templates",
                          mimeType: payloadData.mimeType,
                          name: payloadData.name,
                          url: payloadData.url,
                          templateCode: payloadData.name,
                          templateName: payloadData.name,
                          fileId: payloadData?.id,
                        },
                      ],
                    };
                    dispatch(uploadTemplates(config.templatesUpload, payload));
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
              className="saveButton"
              icon={<CameraFilled />}
              style={{ width: 245 }}
              disabled={
                !editConfessionalStatementsObj?._id ||
                viewConfessionalStatementsDetails ||
                disableForm
              }
            >
              Upload Confession Report
            </Button>
          </Upload>
        </Form.Item>
      </Row>
    );
  };

  const handleConfessionalStatement = (value) => {
    if (value) {
      setEditConfessionalStatementsObj(value);
      setSelectedAccusedValue(value.accusedId?._id);
      const panchWitnessLabelList = [];
      if (pwList) {
        pwList.forEach((s) => {
          value?.panchWitness.forEach((pw) => {
            if (s._id === pw?._id) {
              panchWitnessLabelList.push(pw?._id);
            }
          });
        });
      }
      setConfessionInputList(value?.confessionTemplateReportMedia);
      form.setFieldsValue({
        // accusedId: value.accusedId?._id,
        accusedId: value?.accusedId?.personalDetails?.name,
        dateOfConfession: moment(new Date(value?.dateOfConfession)).isValid()
          ? moment(new Date(value?.dateOfConfession))
          : "",
        dateTimeofApprehension: moment(
          new Date(value?.dateTimeofApprehension)
        ).isValid()
          ? moment(new Date(value?.dateTimeofApprehension))
          : "",
        placeOfApprehension: value?.placeOfApprehension,
        placeOfRecordingConfession: value?.placeOfRecordingConfession,
        apprehendedBy: first(value?.apprehendedBy),
        panchWitness: panchWitnessLabelList,
      });
      if (value?.offencesConfessedofThisPoliceStation?.length > 0) {
        var List1 = [];
        value?.offencesConfessedofThisPoliceStation?.forEach(
          (element, index) => {
            const identityObj = {};
            identityObj[`crNo_${index}`] = element.crNo;
            identityObj[`sectionOfLaw_${index}`] = element.sectionOfLaw;
            identityObj[`dateOfOffence_${index}`] = moment(
              new Date(element?.dateOfOffence)
            ).isValid()
              ? moment(new Date(element?.dateOfOffence))
              : "";
            List1.push(identityObj);
            form && form.setFieldsValue(identityObj);
          }
        );
        setThisPoliceStationList(List1);
        setThisPoliceStationObj(value?.offencesConfessedofThisPoliceStation);
      } else {
        const list1 = [];
        list1.push({
          crNo_0: "",
          sectionOfLaw_0: "",
          dateOfOffence_0: null,
        });
        setThisPoliceStationList(list1);

        const identityObj = {};
        identityObj[`crNo_0`] = "";
        identityObj[`sectionOfLaw_0`] = "";
        identityObj[`dateOfOffence_0`] = null;
        form && form.setFieldsValue(identityObj);
      }

      if (value?.offencesConfessedofOtherPoliceStation?.length > 0) {
        var List2 = [];
        value?.offencesConfessedofOtherPoliceStation?.forEach(
          (element, index) => {
            const identityObj = {};
            identityObj[`OPcrNo_${index}`] = element.crNo;
            identityObj[`OPsectionOfLaw_${index}`] = element?.sectionOfLaw;
            identityObj[`OPstate_${index}`] = element?.state;
            identityObj[`OPunitDistrict_${index}`] = element?.unitDistrict;
            identityObj[`OPdivision_${index}`] = element?.division;
            identityObj[`OPcircle_${index}`] = element?.circle;
            identityObj[`OPpsName_${index}`] = element?.psNAme;
            List2.push(identityObj);
            form && form.setFieldsValue(identityObj);
          }
        );
        setOtherPoliceStationList(List2);
        setOtherPoliceStationObj(value?.offencesConfessedofOtherPoliceStation);
      } else {
        const list2 = [];
        list2.push({
          OPcrNo_0: "",
          OPsectionOfLaw_0: "",
          OPstate_0: null,
          OPunitDistrict_0: null,
          OPdivision_0: null,
          OPcircle_0: null,
          OPpsName_0: null,
        });
        setOtherPoliceStationList(list2);

        const identityObj2 = {};
        identityObj2[`OPcrNo_0`] = "";
        identityObj2[`OPsectionOfLaw_0`] = "";
        identityObj2[`OPstate_0`] = null;
        identityObj2[`OPunitDistrict_0`] = null;
        identityObj2[`OPdivision_0`] = null;
        identityObj2[`OPcircle_0`] = null;
        identityObj2[`OPpsName_0`] = null;
        form && form.setFieldsValue(identityObj2);
      }
    }
  };

  const displayConfessionalFormFields = (data, actionName) => {
    return (
      <Row className="custody-reasons-row">
        {data.map((s, i) => {
          return (
            <Col span={8} key={i} style={{ marginBottom: 10 }}>
              <Form.Item name={s.name} label={s.label}>
                {actionName(s.name)}
              </Form.Item>
            </Col>
          );
        })}
      </Row>
    );
  };

  const displayThisPoliceStationForm = (i, type) => {
    return (
      <>
        <Col span={8} style={{ marginBottom: 10 }}>
          <Form.Item name={`crNo_${i}`} label="Cr. No">
            <Input
              onChange={(e) => handleInputChange(e, i, type)}
              style={{ width: 200 }}
              disabled={viewConfessionalStatementsDetails || disableForm}
            />
          </Form.Item>
        </Col>
        <Col span={8} style={{ marginBottom: 10 }}>
          <Form.Item name={`sectionOfLaw_${i}`} label="Section Of Law">
            <Input
              style={{ width: 200 }}
              disabled={viewConfessionalStatementsDetails || disableForm}
            />
          </Form.Item>
        </Col>
      </>
    );
  };

  const displayOtherPoliceStationForm = (i, type) => {
    return (
      <>
        <Col span={8} style={{ marginBottom: 10 }}>
          <Form.Item name={`OPcrNo_${i}`} label="Cr. No">
            <Input
              onChange={(e) => handleInputChange(e, i, type)}
              style={{ width: 200 }}
              disabled={viewConfessionalStatementsDetails || disableForm}
            />
          </Form.Item>
        </Col>
        <Col span={8} style={{ marginBottom: 10 }}>
          <Form.Item name={`OPsectionOfLaw_${i}`} label="Section Of Law">
            <Input
              style={{ width: 200 }}
              disabled={viewConfessionalStatementsDetails || disableForm}
            />
          </Form.Item>
        </Col>
      </>
    );
  };

  const handleInputChange = (e, index, type) => {
    checkFields();
    const { value } = e.target;
    var list = null;
    switch (type) {
      case "thisPoliceStation":
        list = [...thisPoliceStationList];
        list[index][`crNo_${index}`] = value;

        setThisPoliceStationList(list);
        var identityList = [];
        list.forEach((element, i) => {
          var singleIdentity = {};
          singleIdentity.crNo = element[`crNo_${i}`];
          singleIdentity.sectionOfLaw = element[`sectionOfLaw_${i}`];
          singleIdentity.dateOfOffence = element[`dateOfOffence_${i}`];
          identityList.push(singleIdentity);
        });
        setThisPoliceStationObj(identityList);
        break;
      case "otherPoliceStation":
        list = [...OtherPoliceStationList];
        list[index][`OPcrNo_${index}`] = value;
        setOtherPoliceStationList(list);
        var identityList = [];
        list.forEach((element, i) => {
          var singleIdentity = {};
          singleIdentity.crNo = element[`OPcrNo_${i}`];
          singleIdentity.sectionOfLaw = element[`OPsectionOfLaw_${i}`];
          singleIdentity.state = element[`OPstate_${i}`];
          singleIdentity.unitDistrict = element[`OPunitDistrict_${i}`];
          singleIdentity.division = element[`OPdivision_${i}`];
          singleIdentity.circle = element[`OPcircle_${i}`];
          singleIdentity.psName = element[`OPpsName_${i}`];
          identityList.push(singleIdentity);
        });
        setOtherPoliceStationObj(identityList);
        break;
      default:
        break;
    }
  };

  const setDateofOffence = (e, index) => {
    const list = [...thisPoliceStationList];
    list[index][`dateOfOffence_${index}`] = e;
    setOtherPoliceStationList(list);
    var identityList = [];
    list.forEach((element, i) => {
      var singleIdentity = {};
      singleIdentity.crNo = element[`crNo_${i}`];
      singleIdentity.sectionOfLaw = element[`sectionOfLaw_${i}`];
      singleIdentity.dateOfOffence = element[`dateOfOffence_${i}`];
      identityList.push(singleIdentity);
    });
    setThisPoliceStationObj(identityList);
    checkFields();
  };

  const handleRemoveClick = (index, type) => {
    checkFields();
    var list = null;
    switch (type) {
      case "thisPoliceStation":
        list = [...thisPoliceStationList];
        list.splice(index, 1);

        var newList1 = [];
        var identityList1 = [];
        list.forEach((element, i) => {
          var keys = Object.keys(element);
          var input = {};
          input[`crNo_${i}`] = element[keys[0]];
          input[`sectionOfLaw_${i}`] = element[keys[1]];
          input[`dateOfOffence_${i}`] = element[keys[2]];
          form.setFieldsValue(input);
          newList1.push(input);

          var singleIdentity = {};
          singleIdentity.crNo = element[keys[0]];
          singleIdentity.sectionOfLaw = element[keys[1]];
          singleIdentity.dateOfOffence = element[keys[2]];
          identityList1.push(singleIdentity);
        });
        setThisPoliceStationList(newList1);
        setThisPoliceStationObj(identityList1);
        break;
      case "otherPoliceStation":
        list = [...OtherPoliceStationList];
        list.splice(index, 1);
        var newList2 = [];
        var identityList2 = [];
        list.forEach((element, i) => {
          var keys = Object.keys(element);
          var input = {};
          input[`OPcrNo_${i}`] = element[keys[0]];
          input[`OPsectionOfLaw_${i}`] = element[keys[1]];
          input[`OPstate_${i}`] = element[keys[2]];
          input[`OPunitDistrict${i}`] = element[keys[3]];
          input[`OPdivision${i}`] = element[keys[4]];
          input[`OPpsName${i}`] = element[keys[5]];
          form.setFieldsValue(input);
          newList2.push(input);

          var singleIdentity = {};
          singleIdentity.crNo = element[keys[0]];
          singleIdentity.sectionOfLaw = element[keys[1]];
          singleIdentity.state = element[keys[2]];
          singleIdentity.unitDistrict = element[keys[3]];
          singleIdentity.division = element[keys[4]];
          singleIdentity.psName = element[keys[5]];
          identityList2.push(singleIdentity);
        });
        setOtherPoliceStationList(newList2);
        setOtherPoliceStationObj(identityList2);
        break;
      default:
        break;
    }
  };

  const handleAddressOk = async () => {
    const values = await addressForm.validateFields();
    setAddressDetails(values);
    setIsAddressModalVisible(false);
  };

  const handleAddressCancel = () => {
    setIsAddressModalVisible(false);
  };

  const handleAddClick = (type) => {
    checkFields();
    switch (type) {
      case "thisPoliceStation":
        var input = {};
        input[`crNo_${thisPoliceStationList.length}`] = "";
        input[`sectionOfLaw_${thisPoliceStationList.length}`] = "";
        input[`dateOfOffence_${thisPoliceStationList.length}`] = "";
        form.setFieldsValue(input);
        setThisPoliceStationList([...thisPoliceStationList, input]);
        break;
      case "otherPoliceStation":
        var input = {};
        input[`OPcrNo_${OtherPoliceStationList.length}`] = "";
        input[`OPsectionOfLaw_${OtherPoliceStationList.length}`] = "";
        input[`OPdateOfOffence_${OtherPoliceStationList.length}`] = "";
        form.setFieldsValue(input);
        setOtherPoliceStationList([...OtherPoliceStationList, input]);
        break;
      default:
        break;
    }
  };

  const getSavedData = () => {
    let savedData = [];
    isArray(confessionalStatementsList) &&
      !isEmpty(confessionalStatementsList) &&
      // eslint-disable-next-line array-callback-return
      confessionalStatementsList.map((data) => {
        const { personalDetails, presentAddress } =
          !isUndefined(data?.accusedId) &&
          !isNull(data?.accusedId) &&
          data?.accusedId;
        const confessionMedia =
          data.confessionMedia && !isEmpty(data.confessionMedia)
            ? data.confessionMedia
            : [];
        savedData.push(
          getSavedDataResult(
            data,
            personalDetails,
            presentAddress,
            confessionMedia
          )
        );
      });
    return savedData;
  };

  const getAccusedDropDownList = getAccusedDropdownData().filter(
    (s) =>
      !getSavedData().some((e) => s._id === e?.selectedRecord?.accusedId?._id)
  );

  return (
    <ModuleWrapper>
      <ContentHeader
        headerTitle="Confessional Statements"
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
                  <Col span={8}>
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
                          serchText &&
                          option.props.label
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                        onSelect={(item) => {
                          setSelectedAccusedValue(item);
                          checkFields();
                        }}
                        disabled={
                          viewConfessionalStatementsDetails ||
                          editConfessionalStatementsObj?._id ||
                          disableForm
                        }
                        style={{ width: 200 }}
                      >
                        {!isEmpty(getAccusedDropDownList) &&
                          getAccusedDropDownList.map((item, index) => (
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
                  <Col span={6}>
                    <Form.Item
                      name="dateOfConfession"
                      label="Date Of Confession"
                    >
                      <DatePicker
                        showTime
                        format={DATE_TIME_FORMAT}
                        placeholder="Select Date & Time"
                        onChange={onChangeDate}
                        style={{ width: 200 }}
                        disabled={
                          viewConfessionalStatementsDetails || disableForm
                        }
                        disabledDate={disableFutureDates}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Card className="card-style">
                  {displayConfessionalFormFields(
                    confessionalStatementsForm,
                    displayConfessionalStatementsFields
                  )}
                  <Row gutter={24}>
                    {" "}
                    <Col span={8}></Col>
                    <Col span={8}></Col>
                    <Col span={8}>
                      {placeOfRec_Conf_state === "Hospital" ||
                      placeOfRec_Conf_state === "Any Other" ? (
                        <div
                          className="link linkWithPointer"
                          onClick={() =>
                            setIsAddressModalVisible(disableForm ? false : true)
                          }
                          style={{ marginTop: "-32px" }}
                        >
                          Add Address
                        </div>
                      ) : (
                        ""
                      )}
                    </Col>
                  </Row>
                </Card>

                <Card className="card-style">
                  <Row>
                    <div style={{ marginBottom: 10 }}>
                      Offences Confessed of This Police Station?
                    </div>
                  </Row>
                  {thisPoliceStationList.map((x, i) => {
                    return (
                      <Row key={i}>
                        <>
                          {displayThisPoliceStationForm(i, "thisPoliceStation")}
                          <Col span={8}>
                            <Form.Item
                              name={`dateOfOffence_${i}`}
                              label="Date Of Offence"
                            >
                              <DatePicker
                                format={DATE_FORMAT}
                                placeholder="Select Date"
                                onChange={(e) => setDateofOffence(e, i)}
                                style={{ width: 200 }}
                                disabled={
                                  viewConfessionalStatementsDetails ||
                                  disableForm
                                }
                              />
                            </Form.Item>
                          </Col>
                          <Col span={4} style={{ marginBottom: 10 }}>
                            {thisPoliceStationList.length - 1 === i ? (
                              <Button
                                className="saveButton"
                                size="large"
                                onClick={() =>
                                  handleAddClick("thisPoliceStation")
                                }
                                disabled={
                                  viewConfessionalStatementsDetails ||
                                  disableForm
                                }
                                style={{ marginTop: 20, width: 150 }}
                                icon={
                                  <PlusOutlined className="saveButtonIcon" />
                                }
                              >
                                Add Another
                              </Button>
                            ) : (
                              <Button
                                type="primary"
                                className="removeButton"
                                onClick={() =>
                                  handleRemoveClick(i, "thisPoliceStation")
                                }
                                style={{ marginTop: 20 }}
                                disabled={
                                  viewConfessionalStatementsDetails ||
                                  disableForm
                                }
                                icon={
                                  <DeleteOutlined className="removeButtonIcon" />
                                }
                                danger
                              />
                            )}
                          </Col>
                        </>
                      </Row>
                    );
                  })}
                </Card>
                <Card className="card-style">
                  <Row>
                    <div style={{ marginBottom: 10 }}>
                      Offences Confessed of Other Police Station?{" "}
                    </div>
                  </Row>
                  {OtherPoliceStationList.map((x, i) => {
                    return (
                      <Row key={i} style={{ marginBottom: 10 }}>
                        <>
                          {displayOtherPoliceStationForm(
                            i,
                            "otherPoliceStation"
                          )}
                          <Col span={8} style={{ marginBottom: 10 }}>
                            <Form.Item name={`OPstate_${i}`} label="State">
                              <Select
                                allowClear
                                placeholder="Select"
                                suffixIcon={
                                  <CaretDownOutlined className="dropDownIcon" />
                                }
                                showSearch
                                onSearch={handleSearch}
                                style={{ width: 200 }}
                                disabled={
                                  viewConfessionalStatementsDetails ||
                                  disableForm
                                }
                                onChange={(e) => {
                                  if (e) {
                                    setselectedState(e);
                                  } else {
                                    setselectedState("");
                                  }
                                }}
                              >
                                {!isEmpty(statesNameList) &&
                                  getStateNames(statesNameList).map(
                                    (item, index) => (
                                      <Option
                                        key={index}
                                        value={item.label}
                                        label={item.label}
                                      >
                                        {item.label}
                                      </Option>
                                    )
                                  )}
                              </Select>
                            </Form.Item>
                          </Col>

                          <Col span={8} style={{ marginBottom: 10 }}>
                            <Form.Item
                              name={`OPunitDistrict_${i}`}
                              label="Unit/Distirict"
                            >
                              {selectedState === "TELANGANA" ? (
                                <Select
                                  allowClear
                                  placeholder="Select"
                                  suffixIcon={
                                    <CaretDownOutlined className="dropDownIcon" />
                                  }
                                  showSearch
                                  style={{ width: 200 }}
                                  onSearch={handleSearch}
                                  filterOption={(input, option) =>
                                    serchText &&
                                    option.props.label
                                      .toLowerCase()
                                      .indexOf(input.toLowerCase()) >= 0
                                  }
                                  disabled={
                                    viewConfessionalStatementsDetails ||
                                    disableForm
                                  }
                                  onChange={(e) => {
                                    if (e) {
                                      setselectedUnit_dis(e);
                                      if (unitList.length > 0) {
                                        setselectedDivList(
                                          filter(unitList, { dist_name: e })
                                        );
                                      } else {
                                        setselectedDivList([]);
                                      }
                                    } else {
                                      setselectedUnit_dis("");
                                    }
                                  }}
                                >
                                  {uniqBy(unitList, "dist_name").map(
                                    (item, index) => (
                                      <Option
                                        key={index}
                                        value={item.dist_name}
                                        label={item.dist_name}
                                      >
                                        {item.dist_name}
                                      </Option>
                                    )
                                  )}
                                </Select>
                              ) : (
                                <Input
                                  onChange={(e) =>
                                    handleInputChange(
                                      e,
                                      i,
                                      "otherPoliceStation"
                                    )
                                  }
                                  placeholder="Enter here"
                                  style={{ width: 200 }}
                                  disabled={
                                    viewConfessionalStatementsDetails ||
                                    disableForm
                                  }
                                />
                              )}
                            </Form.Item>
                          </Col>
                          <Col span={8}>
                            <Form.Item
                              name={`OPdivision_${i}`}
                              label="Division"
                            >
                              {selectedState === "TELANGANA" ? (
                                <Select
                                  allowClear
                                  placeholder="Select"
                                  suffixIcon={
                                    <CaretDownOutlined className="dropDownIcon" />
                                  }
                                  showSearch
                                  style={{ width: 200 }}
                                  onSearch={handleSearch}
                                  filterOption={(input, option) =>
                                    serchText &&
                                    option.props.label
                                      .toLowerCase()
                                      .indexOf(input.toLowerCase()) >= 0
                                  }
                                  disabled={
                                    viewConfessionalStatementsDetails ||
                                    disableForm
                                  }
                                >
                                  {uniqBy(selectedDivList, "sdpo_name").map(
                                    (item, index) => (
                                      <Option
                                        key={index}
                                        value={item.sdpo_name}
                                        label={item.sdpo_name}
                                      >
                                        {item.sdpo_name}
                                      </Option>
                                    )
                                  )}
                                </Select>
                              ) : (
                                <Input
                                  style={{ width: 200 }}
                                  onChange={(e) =>
                                    handleInputChange(
                                      e,
                                      i,
                                      "otherPoliceStation"
                                    )
                                  }
                                  placeholder="Enter here"
                                  disabled={
                                    viewConfessionalStatementsDetails ||
                                    disableForm
                                  }
                                />
                              )}
                            </Form.Item>
                          </Col>

                          <Col span={8}>
                            <Form.Item name={`OPcircle_${i}`} label="Circle">
                              {selectedState === "TELANGANA" ? (
                                <Select
                                  allowClear
                                  placeholder="Select"
                                  suffixIcon={
                                    <CaretDownOutlined className="dropDownIcon" />
                                  }
                                  showSearch
                                  style={{ width: 200 }}
                                  onSearch={handleSearch}
                                  filterOption={(input, option) =>
                                    serchText &&
                                    option.props.label
                                      .toLowerCase()
                                      .indexOf(input.toLowerCase()) >= 0
                                  }
                                  disabled={
                                    viewConfessionalStatementsDetails ||
                                    disableForm
                                  }
                                >
                                  {uniqBy(selectedDivList, "circle_name").map(
                                    (item, index) => (
                                      <Option
                                        key={index}
                                        value={item.circle_name}
                                        label={item.circle_name}
                                      >
                                        {item.circle_name}
                                      </Option>
                                    )
                                  )}
                                </Select>
                              ) : (
                                <Input
                                  style={{ width: 200 }}
                                  onChange={(e) =>
                                    handleInputChange(
                                      e,
                                      i,
                                      "otherPoliceStation"
                                    )
                                  }
                                  placeholder="Enter here"
                                  disabled={
                                    viewConfessionalStatementsDetails ||
                                    disableForm
                                  }
                                />
                              )}
                            </Form.Item>
                          </Col>

                          <Col span={8}>
                            <Form.Item
                              name={`OPpsName_${i}`}
                              label="Police Station"
                            >
                              {selectedState === "TELANGANA" ? (
                                <Select
                                  allowClear
                                  placeholder="Select"
                                  suffixIcon={
                                    <CaretDownOutlined className="dropDownIcon" />
                                  }
                                  showSearch
                                  onSearch={handleSearch}
                                  style={{ width: 200 }}
                                  filterOption={(input, option) =>
                                    serchText &&
                                    option.props.label
                                      .toLowerCase()
                                      .indexOf(input.toLowerCase()) >= 0
                                  }
                                  disabled={
                                    viewConfessionalStatementsDetails ||
                                    disableForm
                                  }
                                >
                                  {uniqBy(selectedDivList, "ps_name").map(
                                    (item, index) => (
                                      <Option
                                        key={index}
                                        value={item.ps_name}
                                        label={item.ps_name}
                                      >
                                        {item.ps_name}
                                      </Option>
                                    )
                                  )}
                                </Select>
                              ) : (
                                <Input
                                  style={{ width: 200 }}
                                  onChange={(e) =>
                                    handleInputChange(
                                      e,
                                      i,
                                      "otherPoliceStation"
                                    )
                                  }
                                  placeholder="Enter here"
                                  disabled={
                                    viewConfessionalStatementsDetails ||
                                    disableForm
                                  }
                                />
                              )}
                            </Form.Item>
                          </Col>

                          <Col span={4} style={{ marginBottom: 10 }}>
                            {OtherPoliceStationList.length - 1 === i ? (
                              <Button
                                className="saveButton"
                                size="large"
                                onClick={() =>
                                  handleAddClick("otherPoliceStation")
                                }
                                disabled={
                                  viewConfessionalStatementsDetails ||
                                  disableForm
                                }
                                style={{ marginTop: 20, width: 150 }}
                                icon={
                                  <PlusOutlined className="saveButtonIcon" />
                                }
                              >
                                Add Another
                              </Button>
                            ) : (
                              <Button
                                type="primary"
                                className="removeButton"
                                onClick={() =>
                                  handleRemoveClick(i, "otherPoliceStation")
                                }
                                style={{ marginTop: 20 }}
                                disabled={
                                  viewConfessionalStatementsDetails ||
                                  disableForm
                                }
                                icon={
                                  <DeleteOutlined className="removeButtonIcon" />
                                }
                                danger
                              />
                            )}
                          </Col>
                        </>
                      </Row>
                    );
                  })}
                </Card>
                <Card className="card-style">
                  <Row>
                    <Col span={8}>
                      <div>Is Scene Re-Constructed?</div>
                      <div
                        className="link"
                        onClick={() => setSelectedSiderMenu("crimeScene")}
                      >
                        Crime Scene
                      </div>
                    </Col>
                    <Col span={8}>
                      <div>Is Property Recovered?</div>
                      <div
                        className="link"
                        onClick={() => setSelectedSiderMenu("stolenProperty")}
                      >
                        Stolen/Recovered Property
                      </div>
                    </Col>
                    <Col span={8}>
                      <div>Is MO Seized?</div>
                      <div
                        className="link"
                        onClick={() => setSelectedSiderMenu("MOSeizures")}
                      >
                        MO Seizure
                      </div>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Form>
          </Card>
          <Card
            style={{ width: "30%" }}
            className="right-section cardRightStyle"
          >
            {displayReportGenerations()}
            <div style={{ padding: 10 }}>
              <UploadForm
                colWidth={22}
                enableMediaManager={true}
                setInputFileList={setInputFileList}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                disabled={viewConfessionalStatementsDetails || disableForm}
              />
            </div>
            <OtherLinks setSelectedSiderMenu={setSelectedSiderMenu} />
            {!isEmpty(confessionalStatementsList) ? (
              <Button
                style={{ marginTop: "40px", width: "100%" }}
                onClick={() => setrecordsIsModalVisible(true)}
              >
                {confessionalStatementsList &&
                confessionalStatementsList.length > 0
                  ? confessionalStatementsList.length
                  : 0}{" "}
                Confessional Statements Records
              </Button>
            ) : null}
            <Modal
              title="Confessional Statements Records"
              visible={recordsIsModalVisible}
              onOk={() => setrecordsIsModalVisible(false)}
              onCancel={() => setrecordsIsModalVisible(false)}
              style={{ minWidth: "95vw" }}
              footer={null}
            >
              <div style={{ maxHeight: 650, overflowY: "auto" }}>
                <SavedRecords
                  dataSource={getSavedData()}
                  editDetails={handleConfessionalStatement}
                  setViewDetails={setViewConfessionalStatementsDetails}
                  selectedRecord={editConfessionalStatementsObj}
                  isMedia={true}
                  recordVisible={setrecordsIsModalVisible}
                />
              </div>
            </Modal>
            {isAddressModalVisible ? (
              <AddAddress
                title="Add Address"
                isModalVisible={isAddressModalVisible}
                handleOk={handleAddressOk}
                handleCancel={handleAddressCancel}
                formName={addressForm}
                checkFields={checkFields}
                disabled={viewConfessionalStatementsDetails || disableForm}
                selectedState={selectedAddressState}
                setSelectedState={setSelectedAddressState}
                selectedPermanentState={selectedPermanentState}
                setSelectedPermanentState={setSelectedPermanentState}
              />
            ) : null}
          </Card>
        </Row>
      )}
    </ModuleWrapper>
  );
}
