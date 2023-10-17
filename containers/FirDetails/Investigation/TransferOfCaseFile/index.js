/* eslint-disable array-callback-return */
import { useState, useEffect } from "react";
import { disableFutureDates } from "@components/Common/helperMethods";
import { textFieldRules } from "@components/Common/formOptions";
import Loader from "@components/utility/loader";
import { config } from "@config/site.config";
import axios from "axios";
import {
  Row,
  Card,
  Col,
  Form,
  Select,
  Input,
  DatePicker,
  Upload,
  Button,
  notification,
} from "antd";
import {
  CameraFilled,
  FilePdfOutlined,
  CaretDownOutlined,
} from "@ant-design/icons";
import {
  dummyRequest,
  renderFieldsWithDropDown,
  DATE_FORMAT,
} from "@containers/FirDetails/fir-util";
import masterDataActions from "@redux/masterData/actions";
import { useDispatch, useSelector } from "react-redux";
import { loadState } from "@lib/helpers/localStorage";
import createFIRActions from "@redux/createFir/actions";
import transferOfCaseFileActions from "@redux/investigations/transferOfCaseFile/actions";
import { getFileById } from "@containers/media-util";
import moment from "moment";
import { first } from "lodash";
import reportsActions from "@redux/reports/actions";
import {
  transferOfCaseTemplates,
  transferOfCaseTemplatesForm,
  reasonForTransfer,
  transferTo,
} from "./const";
import ContentHeader from "../../ContentHeader";
import { addTransferOfCasePayload } from "./TransferOfCasePayloads";
import { ModuleWrapper } from "../CommonDetails/styles";
import TemplatesModal from "../CommonForms/TemplatesModal";
import { getDataForDocument, getHTMLFromTemplate } from "./const";
import SavedRecords from "./SavedRecords";

export default function TransferOfCaseFile({ setSelectedSiderMenu }) {
  const [form] = Form.useForm();
  const { fetchPsDetails } = reportsActions;
  const crimeId = loadState("selectedFirId");
  const [formValid, setFormValid] = useState(false);
  const [selectedTemplateName, setSelectedTemplateName] = useState("");
  const [districtDetails, setDistrictDetails] = useState([]);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTransferTo, setSelectedTransferTo] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [psDetails, setPsDetails] = useState([]);
  const [filteredPsDetails, setFilteredPsDetails] = useState([]);
  const [transferOfCaseDataList, setTransferOfCaseDataList] = useState([]);
  const [uploadingData, setUploadingData] = useState({
    Letter_to_Unit_Officer_for_Transfer_of_case_file: {},
    Intimation_to_Court_Transfer_of_case_file: {},
  });

  const userData = JSON.parse(localStorage.getItem("currentUser"));
  const selectedFirData = JSON.parse(localStorage.getItem("selectedFir"));
  const dispatch = useDispatch();
  const [editTransferOfCaseDetails, setEditTransferOfCaseDetails] = useState({
    _id: "",
  });
  const [vieiwClicked, setvieiwClicked] = useState(false);
  const { getUnitsList } = masterDataActions;
  const { savedFir } = useSelector((state) => state.createFIR);
  const { transferOfCaseFileList } = useSelector(
    (state) => state?.TransferOfCaseFile
  );
  const disableForm =
    savedFir?.caseStatus === "Disposal" ||
    savedFir?.isTransferOfCaseFile === true ||
    savedFir?.isChargeSheetTakenOrFiled === true;
  const reportsData = useSelector((state) => state.Reports);
  const {
    addTransferOfCaseFileDetails,
    updateTransferOfCaseFileDetails,
    resetActionType,
    getTransferOfCaseFileList,
  } = transferOfCaseFileActions;
  const { getFIRData } = createFIRActions;
  const { actionType, errorMessage, isFetching } = useSelector(
    (state) => state.TransferOfCaseFile
  );
  const [serchText, setSerchText] = useState("");

  const isSuccess =
    actionType === "ADD_TRANSFER_OF_CASE_FILE_SUCCESS" ||
    actionType === "UPDATE_TRANSFER_OF_CASE_FILE_SUCCESS";
  const isError =
    actionType === "ADD_TRANSFER_OF_CASE_FILE_ERROR" ||
    actionType === "UPDATE_TRANSFER_OF_CASE_FILE_ERROR";

  const openNotificationWithIcon = (type, message) => {
    return notification[type]({
      message: message,
    });
  };

  useEffect(() => {
    dispatch(getUnitsList(`${config.getMasterData}/UNITS`));
    dispatch(getFIRData(`${config.getFIR}?crimeId=${crimeId}`));
    dispatch(
      getTransferOfCaseFileList(
        `${config.getTransferOfArrestCaseFile}?crimeId=${crimeId}`
      )
    );
  }, []);

  useEffect(() => {
    if (
      !!editTransferOfCaseDetails?._id &&
      Object.keys(uploadingData?.Intimation_to_Court_Transfer_of_case_file)
        .length !== 0
    ) {
      setFormValid(true);
    }
  }, [uploadingData]);

  useEffect(() => {
    let transferFileList = [];
    if (!Array.isArray(transferOfCaseFileList)) {
      if (Object.keys(transferOfCaseFileList)?.length !== 0) {
        transferFileList.push(transferOfCaseFileList);
        setTransferOfCaseDataList(transferFileList);
        setvieiwClicked(true);
      } else {
        setTransferOfCaseDataList([]);
        setvieiwClicked(false);
      }
    } else {
      setTransferOfCaseDataList([]);
      setvieiwClicked(false);
    }
  }, [transferOfCaseFileList]);

  useEffect(() => {
    dispatch(fetchPsDetails(`${config.getTsHierarchyList}`));
  }, [dispatch]);

  const handleDownload = (file) => {
    getFileById(file?.fileId, file?.name, file?.url);
  };

  useEffect(() => {
    let res = reportsData?.psDetails;
    var district = [];
    var ps = [];
    for (let i = 0; i < res?.length; i++) {
      if (
        !district.some((data) => data?.value === res[i]?.dist_code) &&
        !!res[i]?.district_commissionerate === true
      ) {
        district.push({
          value: res[i]?.dist_code,
          label: res[i]?.district_commissionerate,
        });
      }
      if (
        !ps.some((data) => data?.value === res[i]?.ps_code) &&
        !!res[i]?.ps_name === true
      ) {
        ps.push({
          value:
            res[i]?.ps_code + "," + res[i]?.ps_name + "," + res[i]?.dist_code,
          label: res[i]?.ps_name,
        });
      }
    }

    const sortedDistrictNames = district.sort(function (a, b) {
      if (a.label < b.label) {
        return -1;
      }
      if (a.label > b.label) {
        return 1;
      }
      return 0;
    });

    const sortedNames = ps.sort(function (a, b) {
      if (a.label < b.label) {
        return -1;
      }
      if (a.label > b.label) {
        return 1;
      }
      return 0;
    });
    setPsDetails(sortedNames);
    setFilteredPsDetails(sortedNames);
    setDistrictDetails(sortedDistrictNames);
  }, [reportsData?.psDetails]);

  useEffect(() => {
    if (isSuccess || isError) {
      if (isSuccess) {
        openNotificationWithIcon("success", "Case transferred successfully");
        setSelectedSiderMenu("investigation");
        dispatch(resetActionType());
      } else if (isError) {
        openNotificationWithIcon("error", errorMessage);
        dispatch(resetActionType());
      }
    }
  }, [actionType]);

  const submit = async () => {
    let values = await form.validateFields();
    if (
      Object.keys(
        uploadingData?.Letter_to_Unit_Officer_for_Transfer_of_case_file
      )?.length === 0
    ) {
      openNotificationWithIcon("error", "Upload Letter To Unit Officer");
    } else if (
      !!values?.dateOfintimationToCourt &&
      Object.keys(uploadingData?.Intimation_to_Court_Transfer_of_case_file)
        ?.length === 0
    ) {
      openNotificationWithIcon("error", "Upload Intimation To Court File");
    } else if (
      Object.keys(
        uploadingData?.Letter_to_Unit_Officer_for_Transfer_of_case_file
      )?.length !== 0
    ) {
      var psdata;
      if (!!values.transferToName) {
        psdata = values.transferToName.split(",");
      } else {
        psdata = "";
      }

      if (!!psdata) {
        Object.assign(values, {
          transferToName: psdata[1],
          transferToPSCode: psdata[0],
          requestedBy: userData?.pao_code,
          requestedByName: userData?.employee_name,
          requestedByRole: userData?.emp_role_name,
          requestedByRank: userData?.rank_name,
          letterToUnitOfficer:
            uploadingData?.Letter_to_Unit_Officer_for_Transfer_of_case_file,
          intimationToCourt:
            uploadingData?.Intimation_to_Court_Transfer_of_case_file,
        });
      } else {
        Object.assign(values, {
          transferToName: "",
          transferToPSCode: "",
          requestedBy: userData?.pao_code,
          requestedByName: userData?.employee_name,
          requestedByRole: userData?.emp_role_name,
          requestedByRank: userData?.rank_name,
          letterToUnitOfficer:
            uploadingData?.Letter_to_Unit_Officer_for_Transfer_of_case_file,
          intimationToCourt:
            uploadingData?.Intimation_to_Court_Transfer_of_case_file,
        });
      }
      const addPayload = addTransferOfCasePayload(values, crimeId);
      const updatePayload = {
        crimeId: crimeId,
        _id: editTransferOfCaseDetails?._id,
        update: "Court",
        dateOfintimationToCourt: values?.dateOfintimationToCourt,
        intimationToCourt:
          uploadingData?.Intimation_to_Court_Transfer_of_case_file,
      };
      if (editTransferOfCaseDetails?._id) {
        dispatch(
          updateTransferOfCaseFileDetails(
            config.transferOfArrestCaseFile,
            updatePayload
          )
        );
        form.resetFields();
        setUploadingData({
          Letter_to_Unit_Officer_for_Transfer_of_case_file: {},
          Intimation_to_Court_Transfer_of_case_file: {},
        });
      } else {
        dispatch(
          addTransferOfCaseFileDetails(
            config.transferOfArrestCaseFile,
            addPayload
          )
        );
        form.resetFields();
        setUploadingData({
          Letter_to_Unit_Officer_for_Transfer_of_case_file: {},
          Intimation_to_Court_Transfer_of_case_file: {},
        });
      }
    }
  };

  const reportData = getDataForDocument(
    transferOfCaseDataList[0],
    selectedFileName,
    savedFir
  );

  const showModal = (templateName, fileName, templateAvailable = false) => {
    if (templateAvailable) {
      setIsModalVisible(true);
      setSelectedTemplateName(`${templateName} - Preview`);
      setSelectedFileName(fileName);
    } else {
      setIsModalVisible(false);
    }
  };

  useEffect(() => {
    form.setFieldsValue({
      statusofCase: savedFir?.caseStatus,
    });
  }, [savedFir]);

  const handleSearch = (text) => {
    setSerchText(text);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const checkFields = async () => {
    const values = await form.validateFields();
    const filterValues = JSON.parse(JSON.stringify(values));
    delete filterValues["crimeNumOfTransferredPoliceStation"];
    delete filterValues["reRegistrationDate"];
    delete filterValues["transferToName"];
    delete filterValues["dateOfintimationToCourt"];
    delete filterValues["transferToDistrict"];
    console.log("filterValues", Object.values(filterValues));
    setFormValid(Object.values(filterValues).every((v) => !!v === true));
  };

  const handleSelect = (value) => {
    form.setFieldsValue({ transferToName: null, transferToDistrict: null });
    setSelectedTransferTo(value);
    setSelectedDistrict(null);
  };

  const handleChange = (value) => {
    setFilteredPsDetails(
      psDetails.filter(
        (data) =>
          data.value.split(",")[2] === value &&
          data.value.split(",")[0] !== selectedFirData?.psCode
      )
    );
    form.setFieldsValue({ transferToName: "" });
    setSelectedDistrict(value);
  };

  const displayFields = (name) => {
    switch (name) {
      case "reason":
        return renderFieldsWithDropDown(
          reasonForTransfer,
          null,
          handleSearch,
          serchText,
          250,
          vieiwClicked || disableForm
        );
      case "transferOption":
        return renderFieldsWithDropDown(
          transferTo,
          handleSelect,
          handleSearch,
          serchText,
          250,
          vieiwClicked || disableForm
        );
      case "transferToDistrict":
        return (
          <Select
            suffixIcon={<CaretDownOutlined className="dropDownIcon" />}
            onChange={handleChange}
            style={{ width: 250 }}
            showSearch={true}
            filterOption={(input, option) =>
              (option?.label.toLowerCase() ?? "").includes(input.toLowerCase())
            }
            disabled={
              selectedTransferTo === "Other Police Station" ? false : true
            }
            options={districtDetails}
          />
        );
      case "transferToName":
        return (
          <Select
            suffixIcon={<CaretDownOutlined className="dropDownIcon" />}
            showSearch
            allowClear
            showArrow
            onSearch={handleSearch}
            filterOption={(input, option) =>
              serchText &&
              option.props.label
                .toString()
                .toLowerCase()
                .indexOf(input.toString().toLowerCase()) >= 0
            }
            style={{ width: 250 }}
            disabled={
              !!selectedDistrict &&
              selectedTransferTo === "Other Police Station"
                ? false
                : true
            }
            options={filteredPsDetails}
          />
        );
      case "reportDatedToUnitOfficerForTransfer":
        return (
          <DatePicker
            format={DATE_FORMAT}
            placeholder="Select Date"
            onChange={checkFields}
            style={{ width: 250 }}
            disabledDate={disableFutureDates}
            disabled={vieiwClicked || disableForm}
          />
        );
      case "competentAuthorityDate":
        return (
          <DatePicker
            format={DATE_FORMAT}
            placeholder="Select Date"
            onChange={checkFields}
            style={{ width: 250 }}
            disabledDate={disableFutureDates}
            disabled={true}
          />
        );
      case "reRegistrationDate":
        return (
          <DatePicker
            format={DATE_FORMAT}
            placeholder="Select Date"
            onChange={checkFields}
            style={{ width: 250 }}
            disabledDate={disableFutureDates}
            disabled={true}
          />
        );
      case "dateOfintimationToCourt":
        return (
          <DatePicker
            format={DATE_FORMAT}
            placeholder="Select Date"
            onChange={checkFields}
            style={{ width: 250 }}
            disabledDate={disableFutureDates}
            disabled={
              disableForm || (formValid && !!editTransferOfCaseDetails?._id)
            }
          />
        );
      default:
        return (
          <Input
            onChange={checkFields}
            style={{ width: 250 }}
            maxLength={textFieldRules.maxLength}
            disabled={
              name === "crimeNumOfTransferredPoliceStation" ||
              "statusofCase" ||
              vieiwClicked ||
              disableForm
            }
          />
        );
    }
  };

  const displayState = (data, actionName) => {
    return (
      <Row className="custody-reasons-row">
        {data.map((s, i) => {
          return (
            <Col span={12} key={i} style={{ marginBottom: 20 }}>
              <Form.Item name={s.name} label={s.label}>
                {actionName(s.name)}
              </Form.Item>
            </Col>
          );
        })}
      </Row>
    );
  };

  const handleEdit = (item) => {
    const selectedPSDistCode = psDetails.filter(
      (ps) => ps.label === item?.transferToName
    );
    const distCode = selectedPSDistCode[0]?.value?.split(",")[2];
    form.setFieldsValue({
      reason: item?.reason,
      transferOption: item?.transferTo,
      transferToDistrict: first(
        districtDetails.filter((data) => data?.value === distCode)
      )?.label,
      transferToName: item?.transferToName,
      reportDatedToUnitOfficerForTransfer: moment(
        new Date(item?.reportDatedToUnitOfficerForTransfer)
      ).isValid()
        ? moment(new Date(item?.reportDatedToUnitOfficerForTransfer))
        : "",
      competentAuthorityDate: moment(
        new Date(item?.competentAuthorityDate)
      ).isValid()
        ? moment(new Date(item?.competentAuthorityDate))
        : "",
      crimeNumOfTransferredPoliceStation:
        item?.crimeNumOfTransferredPoliceStation,
      reRegistrationDate: moment(new Date(item?.reRegistrationDate)).isValid()
        ? moment(new Date(item?.reRegistrationDate))
        : "",
      statusofCase: savedFir?.caseStatus,
      dateOfintimationToCourt: moment(
        new Date(item?.dateOfintimationToCourt)
      ).isValid()
        ? moment(new Date(item?.dateOfintimationToCourt))
        : "",
    });
    setEditTransferOfCaseDetails(item);
    setUploadingData({
      Letter_to_Unit_Officer_for_Transfer_of_case_file:
        item?.letterToUnitOfficer,
      Intimation_to_Court_Transfer_of_case_file: !!item?.intimationToCourt
        ? item?.intimationToCourt
        : {},
    });
  };

  const handleMediaChange = (options, label, fileName) => {
    let formData = new FormData();
    formData.append("file", options.file?.originFileObj);
    formData.append("prefixFolder", crimeId);
    const folderPath = `${crimeId}/transferOfCase/reports`;
    formData.append("folderPath", folderPath);
    axios
      .post(`${config.fileUpload}/upload`, formData)
      .then((res) => {
        if (res.status) {
          const { data } = res.data;
          const payloadData = first(data);
          const payload = {
            mimeType: payloadData.mimeType,
            name: payloadData.name,
            url: payloadData.url,
            templateCode: fileName,
            templateName: label,
            fileId: payloadData.id,
          };
          console.log("payload", payload);

          setUploadingData({
            ...uploadingData,
            [fileName]: payload,
          });
        }
      })
      .catch((err) => {
        if (err && err?.response?.status === 400) {
          const errorDetails = JSON.parse(
            err.response?.data?.error.description
          );
          const errorKey = errorDetails?.error?.errorKey;
          openNotificationWithIcon("error", errorKey);
        }
      });
  };
  const onRemoveFile = (e, label, fileNam) => {
    if (!!fileNam === true && !!editTransferOfCaseDetails?._id === false) {
      const mediaData = { ...uploadingData };
      console.log("e, index, label, fileNam", e, label, fileNam);
      delete mediaData[fileNam];
      mediaData[fileNam] = {};
      setUploadingData({});
      setUploadingData(mediaData);
    }
  };
  const displayReportGenerations = () => {
    return transferOfCaseTemplates.map((item, i) => {
      const { label, fileName } = item;
      var mediaData = [];
      return (
        <Row className="row-item" key={i}>
          <FilePdfOutlined />
          <span
            onClick={() => showModal(label, fileName, item.templateAvailable)}
          >
            {label}
            {fileName === "Letter_to_Unit_Officer_for_Transfer_of_case_file" ? (
              <span style={{ color: "red" }}>*</span>
            ) : null}
          </span>
          <Form.Item name="left_upload" style={{ width: "30%" }}>
            <Upload
              customRequest={dummyRequest}
              onPreview={handleDownload}
              fileList={
                Object.keys(uploadingData[fileName]).length !== 0
                  ? [uploadingData[fileName]]
                  : []
              }
              onChange={(options) =>
                handleMediaChange(options, label, fileName)
              }
              onRemove={(e) => onRemoveFile(e, label, fileName)}
            >
              <Button
                className="saveButton"
                icon={<CameraFilled />}
                disabled={
                  disableForm ||
                  (Object.keys(
                    uploadingData?.Letter_to_Unit_Officer_for_Transfer_of_case_file
                  )?.length !== 0 &&
                    fileName ===
                      "Letter_to_Unit_Officer_for_Transfer_of_case_file" &&
                    !!editTransferOfCaseDetails?._id) ||
                  (Object.keys(
                    uploadingData?.Intimation_to_Court_Transfer_of_case_file
                  )?.length !== 0 &&
                    fileName === "Intimation_to_Court_Transfer_of_case_file" &&
                    !!editTransferOfCaseDetails?._id)
                }
              >
                Upload
              </Button>
            </Upload>
          </Form.Item>
        </Row>
      );
    });
  };

  return (
    <ModuleWrapper>
      <ContentHeader
        headerTitle="Transfer of Case File"
        onSubmitClick={submit}
        isInvestigation={true}
        onCancel={() => setSelectedSiderMenu("investigation")}
        disableButton={!formValid || disableForm}
      />
      {isFetching ? (
        <Loader />
      ) : (
        <Row>
          <Card style={{ width: "70%" }} className="cardLeftStyle">
            <Form form={form} layout="vertical">
              <Row glutter={24} style={{ width: "100%", marginTop: 10 }}>
                <Col>
                  {displayState(transferOfCaseTemplatesForm, displayFields)}
                </Col>
              </Row>
            </Form>
          </Card>
          <Card
            style={{ width: "30%" }}
            className="right-section cardRightStyle"
          >
            {displayReportGenerations()}
            {transferOfCaseDataList?.length !== 0 &&
            !!transferOfCaseDataList[0] ? (
              <div style={{ maxHeight: 650, overflowY: "auto", marginTop: 45 }}>
                <SavedRecords
                  transferOfCaseFileList={transferOfCaseDataList}
                  setEditTransferOfCaseDetails={handleEdit}
                  setvieiwClicked={setvieiwClicked}
                  seteditClicked={""}
                  setFormValid={setFormValid}
                  setrecordsIsModalVisible={""}
                  disableForm={savedFir?.caseStatus === "Disposal"}
                />
              </div>
            ) : null}
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
