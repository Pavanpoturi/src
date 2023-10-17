import { useState, useEffect } from "react";
import { Card, Col, Form, Select, notification, Modal, Button } from "antd";
import { isEmpty, isArray, isUndefined, isNull } from "lodash";
import { CaretDownOutlined } from "@ant-design/icons";
import firActions from "@redux/fir/actions";
import UploadForm from "@components/Common/uploadForm";
import axios from "axios";
import StandardWitnessDetailsForm from "@components/Common/standardWitnessDetailsForm";
import Loader from "@components/utility/loader";
import { config } from "@config/site.config";
import { useSelector, useDispatch } from "react-redux";
import { loadState } from "@lib/helpers/localStorage";
import {
  getWitnessStatementDetails,
  folderName,
  getMediaPayload,
  getMediaUploadError,
} from "@containers/FirDetails/fir-util";
import moment from "moment";
import { getAuditHistoryPayload } from "@containers/const";
import auditHistoryActions from "@redux/auditHistory/actions";
import ContentHeader from "../../ContentHeader";
import SavedRecords from "./SavedRecords";

const Option = Select.Option;

export default function WitnessStatement({ setSelectedSiderMenu }) {
  const crimeId = loadState("selectedFirId");
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [professionalForm] = Form.useForm();
  const { savedFir } = useSelector((state) => state.createFIR);
  const [serchText, setSerchText] = useState("");
  const [formValid, setFormValid] = useState(false);
  const [addAnother, setAddAnother] = useState(false);
  const [selectedWitness, setSelectedWitness] = useState("");
  const [statementDetailsState, setStatementDetailsState] = useState("");
  const [inputFileList, setInputFileList] = useState([]);
  const [selectedWitnessType, setSelectedWitnessType] = useState("");
  const [selectedSubTypeWitness, setSelectedSubTypeWitness] = useState("");
  const [selectedSubTypePanchWitness, setSelectedSubTypePanchWitness] =
    useState([]);
  const [selectedPlaceOfRecordings, setSelectedPlaceOfRecordings] =
    useState("");
  const [selectedstatementRecordedBy, setSelectedstatementRecordedBy] =
    useState("");
  const [professionalDetails, setProfessionalDetails] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("witnessStatement");
  const [editWitnessStatementObj, setEditWitnessStatementObj] = useState(null);
  const [editWitnessObj, setEditWitnessObj] = useState({});

  const { createAuditHistory } = auditHistoryActions;
  const [viewWitnessStatementDetails, setViewWitnessStatementDetails] =
    useState(false);
  const [recordsIsModalVisible, setrecordsIsModalVisible] = useState(false);
  const [Reexamination, setReexamination] = useState([]);
  const [ReexaminationData, setReexaminationData] = useState([]);
  const [showFormFiled, setShowFormFiled] = useState(false);
  const {
    fetchWitnessDetailsList,
    updateWitnessStatement,
    editWitnessStatement,
    fetchWitnessStatementsList,
    resetActionType,
  } = firActions;
  const {
    witnessStatementList,
    witnessStatementListNew,
    actionType,
    successMessage,
    errorMessage,
    isFetching,
  } = useSelector((state) => state.FIR);

  const disableForm =
    savedFir?.caseStatus === "Disposal" ||
    savedFir?.isTransferOfCaseFile === true ||
    savedFir?.isChargeSheetTakenOrFiled === true;

  const { panchWitnessList, professionalList } = useSelector(
    (state) => state.FIR
  );
  const { fetchPanchWitnessList, fetchProfessionalList } = firActions;
  const [pwList, setPwList] = useState([]);

  useEffect(() => {
    const panchList =
      panchWitnessList &&
      isArray(panchWitnessList) &&
      !isEmpty(panchWitnessList) &&
      !isNull(panchWitnessList) &&
      !isUndefined(panchWitnessList)
        ? panchWitnessList
        : [];
    const profList =
      professionalList &&
      !isEmpty(professionalList) &&
      !isNull(professionalList) &&
      !isUndefined(professionalList)
        ? professionalList
        : [];
    let witnessStatementListArray = isArray(witnessStatementList)
      ? witnessStatementList
      : [];
    const concatenated = [
      ...profList,
      ...panchList,
      ...witnessStatementListArray,
    ];
    const filteredList =
      !isEmpty(concatenated) &&
      concatenated.filter(
        (s) =>
          !s.isExamined &&
          (s?.person?.personalDetails?.name ||
            s?.person?.personalDetails?.surname)
      );
    setPwList(filteredList);
  }, [panchWitnessList, witnessStatementList, professionalList]);

  const fetchWitnessDetails = () => {
    dispatch(
      fetchWitnessDetailsList(
        `${config.getPostCrimeSceneDetails}/WITNESSDETAILS/?crimeId=${crimeId}`
      )
    );
  };

  const fetchStatementsList = () => {
    dispatch(
      fetchWitnessStatementsList(
        `${config.getWitnessStatements}/?crimeId=${crimeId}`
      )
    );
  };

  const isSuccess =
    actionType === "WITNESS_UPDATE_SUCCESS" ||
    actionType === "WITNESS_EDIT_SUCCESS";
  const isError =
    actionType === "WITNESS_UPDATE_ERROR" ||
    actionType === "WITNESS_EDIT_ERROR";

  const openNotificationWithIcon = (type, message) => {
    getInitialApis();
    return notification[type]({
      message: message,
    });
  };

  const auditHistoryEntry = () => {
    const auditType =
      actionType === "WITNESS_UPDATE_SUCCESS"
        ? "Witness Examination Created"
        : "Witness Examination Updated";
    dispatch(
      createAuditHistory(
        config.createAudits,
        getAuditHistoryPayload(
          crimeId,
          "investigation/WitnessExamination",
          auditType
        )
      )
    );
  };

  useEffect(() => {
    if (isSuccess || isError) {
      if (
        successMessage === "successfully updated" ||
        successMessage === "successfully added"
      ) {
        openNotificationWithIcon("success", successMessage);
        auditHistoryEntry();
        form.resetFields();
        setProfessionalDetails({});
        dispatch(resetActionType());
        if (!addAnother) {
          setSelectedSiderMenu("investigation");
        }
      } else if (errorMessage) {
        openNotificationWithIcon("error", errorMessage);
        dispatch(resetActionType());
      }
      if (
        actionType === "WITNESS_UPDATE_SUCCESS" ||
        actionType === "WITNESS_EDIT_SUCCESS"
      ) {
        setEditWitnessStatementObj(null);
        setEditWitnessObj({});
        fetchStatementsList();
        setProfessionalDetails({});
      }
    }
  }, [actionType]);

  const handleEditWitnessStatementDetails = (value) => {
    setEditWitnessStatementObj(value);
    setReexamination(value?.reExaminationDetails);
    setReexaminationData(value?.reExaminationDetails);
    const statementDetails = value?.statementDetails;
    const typeOfWitness = statementDetails?.typeOfWitness;
    const recordedAtPlace = statementDetails?.placeOfRecordingStatement;
    setSelectedWitnessType(typeOfWitness);
    setSelectedPlaceOfRecordings(recordedAtPlace);
    const { witnessId } = value;
    const { personalDetails } = witnessId;
    const witnessName =
      !isUndefined(personalDetails) &&
      `${personalDetails?.name} ${personalDetails?.surname || ""}`;
    setStatementDetailsState(statementDetails);
    setSelectedWitness(witnessId);
    setSelectedstatementRecordedBy(statementDetails?.statementRecordedBy);
    setSelectedSubTypeWitness(statementDetails?.subTypeOfWitness);
    setSelectedSubTypePanchWitness(statementDetails?.panchSubTypeOfWitness);
    const statementRecordedByOther = statementDetails?.statementRecordedByOther;
    setProfessionalDetails(statementRecordedByOther);
    form.setFieldsValue({
      select_witness_details: witnessName,
      witnessCode: statementDetails?.witnessCode,
      typeOfWitness: typeOfWitness,
      subTypeOfWitness: statementDetails?.subTypeOfWitness,
      panchSubTypeOfWitness: statementDetails?.panchSubTypeOfWitness,
      categoryOfWitness: statementDetails?.categoryOfWitness,
      statementRecordedBy: statementDetails?.statementRecordedBy,
      statementRecordedByOther:
        (statementRecordedByOther?.personalDetails?.name
          ? statementRecordedByOther?.personalDetails?.name
          : "") +
        " " +
        (statementRecordedByOther?.personalDetails?.surname
          ? statementRecordedByOther?.personalDetails?.surname
          : ""),
      recordedAtPlace: recordedAtPlace,
      anyOtherPlace: statementDetails?.anyOtherPlace,
      recordedOnDatetime: moment(
        new Date(statementDetails?.dateTimeofRecording)
      ).isValid()
        ? moment(new Date(statementDetails?.dateTimeofRecording))
        : "",
      selectScribe: statementDetails?.scribeIfPC,
      relationToVictim: statementDetails?.relationToVictim,
      selectVictim: statementDetails?.victim,
      strengthOfWitness: statementDetails?.strengthOfWitness,
    });
    professionalForm.setFieldsValue(statementRecordedByOther);
    setEditWitnessObj({
      select_witness_details: witnessName,
      witnessCode: statementDetails?.witnessCode,
      typeOfWitness: typeOfWitness,
      subTypeOfWitness: statementDetails?.subTypeOfWitness,
      panchSubTypeOfWitness: statementDetails?.panchSubTypeOfWitness,
      categoryOfWitness: statementDetails?.categoryOfWitness,
      statementRecordedBy: statementDetails?.statementRecordedBy,
      statementRecordedByOther:
        (statementRecordedByOther?.personalDetails?.name
          ? statementRecordedByOther?.personalDetails?.name
          : "") +
        " " +
        (statementRecordedByOther?.personalDetails?.surname
          ? statementRecordedByOther?.personalDetails?.surname
          : ""),
      recordedAtPlace: recordedAtPlace,
      anyOtherPlace: statementDetails?.anyOtherPlace,
      recordedOnDatetime: moment(
        new Date(statementDetails?.dateTimeofRecording)
      ).isValid()
        ? moment(new Date(statementDetails?.dateTimeofRecording))
        : "",
      selectScribe: statementDetails?.scribeIfPC,
      relationToVictim: statementDetails?.relationToVictim,
      selectVictim: statementDetails?.victim,
      strengthOfWitness: statementDetails?.strengthOfWitness,
    });
  };

  useEffect(() => {
    const witnessdata = localStorage.getItem("witness_code");
    if (
      !!witnessdata === true &&
      Array.isArray(witnessStatementListNew) === true
    ) {
      const value = witnessStatementListNew.find(
        (data) => data.statementDetails.witnessCode === witnessdata
      );
      console.log("value", value, witnessStatementListNew);
      localStorage.removeItem("witness_code");
      setEditWitnessStatementObj(value);
      setReexaminationData(value?.reExaminationDetails);
      setShowFormFiled(false);
      const WitnessCode = value?.statementDetails?.witnessCode;
      const statementDetails = value?.statementDetails;
      const typeOfWitness = statementDetails?.typeOfWitness;
      const recordedAtPlace = statementDetails?.placeOfRecordingStatement;
      setSelectedWitnessType(typeOfWitness);
      setSelectedPlaceOfRecordings(recordedAtPlace);
      const { witnessId } = value;
      const { personalDetails } = witnessId;
      const witnessName =
        !isUndefined(personalDetails) &&
        `${personalDetails?.name} ${personalDetails?.surname || ""}`;
      setStatementDetailsState(statementDetails);
      setSelectedWitness(witnessId);
      setSelectedstatementRecordedBy(statementDetails?.statementRecordedBy);
      setSelectedSubTypeWitness(statementDetails?.subTypeOfWitness);
      setSelectedSubTypePanchWitness(statementDetails?.panchSubTypeOfWitness);
      const statementRecordedByOther =
        statementDetails?.statementRecordedByOther;
      setProfessionalDetails(statementRecordedByOther);
      form.setFieldsValue({
        select_witness_details: witnessName,
        witnessCode: WitnessCode,
        typeOfWitness: typeOfWitness,
        subTypeOfWitness: statementDetails?.subTypeOfWitness,
        panchSubTypeOfWitness: statementDetails?.panchSubTypeOfWitness,
        categoryOfWitness: statementDetails?.categoryOfWitness,
        statementRecordedBy: statementDetails?.statementRecordedBy,
        statementRecordedByOther:
          (statementRecordedByOther?.personalDetails?.name
            ? statementRecordedByOther?.personalDetails?.name
            : "") +
          " " +
          (statementRecordedByOther?.personalDetails?.surname
            ? statementRecordedByOther?.personalDetails?.surname
            : ""),
        recordedAtPlace: recordedAtPlace,
        anyOtherPlace: statementDetails?.anyOtherPlace,
        recordedOnDatetime: moment(
          new Date(statementDetails?.dateTimeofRecording)
        ).isValid()
          ? moment(new Date(statementDetails?.dateTimeofRecording))
          : "",
        selectScribe: statementDetails?.scribeIfPC,
        relationToVictim: statementDetails?.relationToVictim,
        selectVictim: statementDetails?.victim,
        strengthOfWitness: statementDetails?.strengthOfWitness,
      });
      professionalForm.setFieldsValue(statementRecordedByOther);
      setViewWitnessStatementDetails(false);
      setrecordsIsModalVisible(false);
      setEditWitnessObj({
        select_witness_details: witnessName,
        witnessCode: WitnessCode,
        typeOfWitness: typeOfWitness,
        subTypeOfWitness: statementDetails?.subTypeOfWitness,
        panchSubTypeOfWitness: statementDetails?.panchSubTypeOfWitness,
        categoryOfWitness: statementDetails?.categoryOfWitness,
        statementRecordedBy: statementDetails?.statementRecordedBy,
        statementRecordedByOther:
          (statementRecordedByOther?.personalDetails?.name
            ? statementRecordedByOther?.personalDetails?.name
            : "") +
          " " +
          (statementRecordedByOther?.personalDetails?.surname
            ? statementRecordedByOther?.personalDetails?.surname
            : ""),
        recordedAtPlace: recordedAtPlace,
        anyOtherPlace: statementDetails?.anyOtherPlace,
        recordedOnDatetime: moment(
          new Date(statementDetails?.dateTimeofRecording)
        ).isValid()
          ? moment(new Date(statementDetails?.dateTimeofRecording))
          : "",
        selectScribe: statementDetails?.scribeIfPC,
        relationToVictim: statementDetails?.relationToVictim,
        selectVictim: statementDetails?.victim,
        strengthOfWitness: statementDetails?.strengthOfWitness,
      });
    } else {
      setShowFormFiled(true);
    }
  }, [witnessStatementListNew]);

  useEffect(() => {
    getInitialApis();
  }, []);

  const getInitialApis = () => {
    fetchWitnessDetails();
    fetchStatementsList();
    dispatch(
      fetchPanchWitnessList(
        `${config.getPostCrimeSceneDetails}/PUNCHWITNESS/?crimeId=${crimeId}`
      )
    );
    dispatch(
      fetchProfessionalList(
        `${config.getPostCrimeSceneDetails}/PROFESSIONAL/?crimeId=${crimeId}`
      )
    );
  };

  useEffect(() => {
    form.setFieldsValue({
      witnessCode: statementDetailsState?.witnessCode,
    });
  }, [statementDetailsState, form]);

  const handleSearch = (text) => {
    setSerchText(text);
  };

  const checkFields = async (values, data) => {
    setFormValid(
      !Object.values(values).every(
        (v) => v == null || (typeof v === "string" && v.trim() === "")
      )
    );
    const values111 = await form.validateFields();
    if (!!data === true) {
      const array = JSON.parse(JSON.stringify(data));
      const i = array.length;
      array[i] = {};
      Object.assign(array[i], values);
      array.splice(i, 1, array[i]);
      setReexamination(array);
    } else {
      setReexamination(values);
      setReexaminationData(values);
    }
  };

  const submit = async () => {
    const values = await form.validateFields();
    Object.assign(editWitnessObj, values);
    const mediaFormData = new FormData();
    inputFileList.forEach((file) => {
      mediaFormData.append("file", file.originFileObj);
    });
    mediaFormData.append("prefixFolder", crimeId);
    mediaFormData.append(
      "folderPath",
      `${crimeId}/${folderName.WITNESS_STATEMENT}/media`
    );

    if (!isEmpty(inputFileList)) {
      axios
        .post(`${config.fileUpload}/upload`, mediaFormData)
        .then((res) => {
          if (res.status === 200) {
            const { data } = res.data;
            const witnessStatementMedia =
              editWitnessStatementObj?.witnessStatementMedia;
            const mediaResult = isUndefined(witnessStatementMedia)
              ? getMediaPayload(data, selectedCategory)
              : [
                  ...witnessStatementMedia,
                  ...getMediaPayload(data, selectedCategory),
                ];
            const updateMediaResult =
              !isUndefined(witnessStatementMedia) &&
              isEmpty(witnessStatementMedia)
                ? getMediaPayload(data, selectedCategory)
                : mediaResult;
            const addWitnessStatementPayload = {
              crimeId: crimeId,
              witnessId: selectedWitness?._id,
              statementDetails: getWitnessStatementDetails(
                editWitnessObj,
                professionalDetails,
                crimeId
              ),
              internalFlag: false,
              reExaminationDetails: Reexamination,
              witnessStatementMedia: getMediaPayload(data, selectedCategory),
            };

            const updateWitnessStatementPayload = {
              statementId: editWitnessStatementObj?._id || "",
              statementDetails: getWitnessStatementDetails(
                editWitnessObj,
                professionalDetails,
                crimeId
              ),
              internalFlag: false,
              reExaminationDetails: Reexamination,
              witnessStatementMedia: updateMediaResult,
            };

            if (editWitnessStatementObj?._id) {
              dispatch(
                editWitnessStatement(
                  config.updateWitnessStatement,
                  updateWitnessStatementPayload
                )
              );
            } else {
              dispatch(
                updateWitnessStatement(
                  config.addWitnessStatement,
                  addWitnessStatementPayload
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
        editWitnessStatementObj?.witnessStatementMedia
      )
        ? []
        : editWitnessStatementObj?.witnessStatementMedia;
      const addWitnessStatementPayload = {
        crimeId: crimeId,
        witnessId: selectedWitness?._id,
        statementDetails: getWitnessStatementDetails(
          editWitnessObj,
          professionalDetails,
          crimeId
        ),
        internalFlag: false,
        reExaminationDetails: Reexamination,
        witnessStatementMedia: [],
      };
      const updateWitnessStatementPayload = {
        statementId: editWitnessStatementObj?._id || "",
        statementDetails: getWitnessStatementDetails(
          editWitnessObj,
          professionalDetails,
          crimeId
        ),
        internalFlag: false,
        reExaminationDetails: Reexamination,
        witnessStatementMedia: updateMediaResult,
      };
      if (editWitnessStatementObj?._id) {
        dispatch(
          editWitnessStatement(
            config.updateWitnessStatement,
            updateWitnessStatementPayload
          )
        );
      } else {
        dispatch(
          updateWitnessStatement(
            config.addWitnessStatement,
            addWitnessStatementPayload
          )
        );
      }
    }
  };

  const renderFieldsWithDropDown = (menuOptions) => {
    return (
      <Select
        suffixIcon={<CaretDownOutlined className="dropDownIcon" />}
        showSearch
        disabled={
          isEmpty(menuOptions) ||
          viewWitnessStatementDetails ||
          editWitnessStatementObj?._id ||
          disableForm
        }
        onSearch={handleSearch}
        placeholder="Select a witness"
        filterOption={(input, option) =>
          serchText &&
          option.props.label
            .toString()
            .toLowerCase()
            .indexOf(input.toString().toLowerCase()) >= 0
        }
        style={{ width: 250 }}
        onSelect={(_item, options) => {
          setSelectedWitness(options.props?.persondetails?.person);
        }}
      >
        {isArray(menuOptions) &&
          !isEmpty(menuOptions) &&
          menuOptions.map((item, index) => {
            const { personalDetails } =
              !isNull(item?.person) &&
              !isEmpty(item?.person) &&
              !isUndefined(item?.person) &&
              item?.person;
            if (personalDetails) {
              const witnessName =
                personalDetails &&
                !isEmpty(personalDetails) &&
                !isUndefined(personalDetails) &&
                `${personalDetails?.name} ${personalDetails?.surname || ""}`;
              const createdFor = personalDetails?.createdFor
                ? `(${personalDetails?.createdFor})`
                : "";
              return (
                <Option
                  key={!isUndefined(witnessName) && index}
                  value={!isUndefined(witnessName) && item._id}
                  label={!isUndefined(witnessName) && witnessName}
                  persondetails={!isEmpty(witnessName) && item}
                >
                  {witnessName + " " + createdFor}
                </Option>
              );
            }
          })}
      </Select>
    );
  };

  const getSavedData = () => {
    let savedData = [];
    isArray(witnessStatementListNew) &&
      !isEmpty(witnessStatementListNew) &&
      // eslint-disable-next-line array-callback-return
      witnessStatementListNew.map((data) => {
        const { statementDetails } = data;
        const { witnessId } = data;
        const witnessName =
          !isUndefined(witnessId?.personalDetails) &&
          `${witnessId?.personalDetails?.name} ${
            witnessId?.personalDetails?.surname || ""
          }`;
        const result = {
          selectedRecord: data,
          witnessName: witnessName,
          witnessCode: statementDetails?.witnessCode || "",
          typeOfWitness: statementDetails?.typeOfWitness || "",
          subTypeOfWitness: statementDetails?.subTypeOfWitness || "",
          panchSubTypeOfWitness: statementDetails?.panchSubTypeOfWitness || [],
          reExaminationDetails: data?.reExaminationDetails,
          categoryOfWitness: statementDetails?.categoryOfWitness || "",
          dateTimeofRecording: statementDetails?.dateTimeofRecording || "",
          strengthOfWitness: statementDetails?.strengthOfWitness || "",
          mediaDetails: data.witnessStatementMedia || [],
          actions: "",
        };
        savedData.push(result);
      });
    for (let i = 0; i < savedData?.length; i++) {
      var date = [];
      var witness = [];
      if (!!savedData[i]?.dateTimeofRecording === true) {
        date.push(savedData[i]?.dateTimeofRecording);
      }
      if (!!savedData[i]?.strengthOfWitness === true) {
        witness.push(savedData[i]?.strengthOfWitness);
      }
      if (savedData[i]?.reExaminationDetails?.length !== 0) {
        savedData[i]?.reExaminationDetails?.map((savedData) =>
          date?.push(savedData?.recordingStmtDate)
        );
      }
      if (savedData[i]?.reExaminationDetails?.length !== 0) {
        savedData[i]?.reExaminationDetails?.map((savedData) =>
          witness?.push(savedData?.strengthOfWitness)
        );
      }
      Object.assign(savedData[i], {
        dateTimeofRecording: date,
        strengthOfWitness: witness,
      });
    }
    console.log("savedData", savedData);
    return savedData;
  };

  return (
    <>
      <ContentHeader
        headerTitle="Witness Examination"
        addAnother
        addAnotherText="Add Another"
        onSubmitClick={submit}
        disableButton={viewWitnessStatementDetails || disableForm}
        setAddAnother={setAddAnother}
        isInvestigation={true}
        onCancel={() => setSelectedSiderMenu("investigation")}
      />
      {isFetching ? (
        <Loader />
      ) : (
        <Form form={form} layout="vertical">
          <Card style={{ minHeight: "45vh" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-start",
                overflow: "hidden",
                marginBottom: 10,
              }}
            >
              <Col span={16}>
                <Col span={24}>
                  <Form.Item
                    name="select_witness_details"
                    label="Select Witness Details"
                    rules={[
                      { required: true, message: "Please Select Witness!" },
                    ]}
                  >
                    {renderFieldsWithDropDown(pwList)}
                  </Form.Item>
                </Col>
                {selectedWitness?._id ? (
                  <div style={{ marginTop: 20 }}>
                    <StandardWitnessDetailsForm
                      showMoreOption={false}
                      changeValue={checkFields}
                      disabled={viewWitnessStatementDetails}
                      selectedWitnessType={selectedWitnessType}
                      setSelectedWitnessType={setSelectedWitnessType}
                      selectedPlaceOfRecordings={selectedPlaceOfRecordings}
                      setSelectedPlaceOfRecordings={
                        setSelectedPlaceOfRecordings
                      }
                      formName={form}
                      selectedstatementRecordedBy={selectedstatementRecordedBy}
                      setSelectedstatementRecordedBy={
                        setSelectedstatementRecordedBy
                      }
                      setProfessionalDetails={setProfessionalDetails}
                      professionalForm={professionalForm}
                      selectedSubTypeWitness={selectedSubTypeWitness}
                      setSelectedSubTypeWitness={setSelectedSubTypeWitness}
                      selectedSubTypePanchWitness={selectedSubTypePanchWitness}
                      setSelectedSubTypePanchWitness={
                        setSelectedSubTypePanchWitness
                      }
                      selectedRecord={ReexaminationData}
                      showFormFields={showFormFiled}
                    />
                  </div>
                ) : null}
              </Col>
              <Col span={8}>
                <div style={{ marginLeft: 50 }}>
                  <UploadForm
                    colWidth={20}
                    enableMediaManager={true}
                    setInputFileList={setInputFileList}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    disabled={viewWitnessStatementDetails || disableForm}
                  />
                  {!isEmpty(witnessStatementListNew) ? (
                    <Button
                      style={{ marginTop: "40px", width: "90%" }}
                      onClick={() => setrecordsIsModalVisible(true)}
                    >
                      {witnessStatementListNew &&
                      witnessStatementListNew.length > 0
                        ? witnessStatementListNew.length
                        : 0}{" "}
                      Witness Records
                    </Button>
                  ) : null}
                </div>
                <Modal
                  title="Witness Examination Records"
                  visible={recordsIsModalVisible}
                  onOk={() => setrecordsIsModalVisible(false)}
                  onCancel={() => setrecordsIsModalVisible(false)}
                  style={{ minWidth: "95vw" }}
                  footer={null}
                >
                  <div style={{ maxHeight: 650, overflowY: "auto" }}>
                    <SavedRecords
                      dataSource={getSavedData()}
                      editDetails={handleEditWitnessStatementDetails}
                      setViewDetails={setViewWitnessStatementDetails}
                      selectedRecord={editWitnessStatementObj}
                      recordVisible={setrecordsIsModalVisible}
                    />
                  </div>
                </Modal>
              </Col>
            </div>
          </Card>
        </Form>
      )}
    </>
  );
}
