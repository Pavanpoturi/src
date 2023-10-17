/* eslint-disable array-callback-return */
import { useState, useEffect } from "react";
import axios from "axios";
import { isArray } from "lodash";
import moment from "moment";
import {
  Form,
  DatePicker,
  Select,
  Button,
  Radio,
  Upload,
  Input,
  notification,
  Collapse,
  Space,
  Divider,
  Result,
  Card,
} from "antd";
import { getFileById } from "@containers/media-util";
import {
  IS_SHO,
  IS_IO,
  DATE_FORMAT,
  dummyRequest,
  onFileChange,
  getMediaPayloadWithoutCategory,
  getStaffsDetails,
  IS_INVESTIGATION_OFFICER,
} from "@containers/FirDetails/fir-util";
import { useDispatch, useSelector } from "react-redux";
import TableWrapper from "@containers/Tables/AntTables/AntTables.styles";
import { TableWidgetWrapper } from "@containers/FirDetails/CommonSections/TableWidget.styles";
import {
  CaretDownOutlined,
  DoubleRightOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { ModuleWrapper } from "@containers/FirDetails/Investigation/CommonDetails/styles";
import suspectAccusedAction from "@redux/investigations/suspectAccused/actions";
import { config } from "@config/site.config";
import { loadState } from "@lib/helpers/localStorage";
import servingOfSummons from "@redux/CourtAndProsecution/ServingOfSummons/action";
import masterDataActions from "@redux/masterData/actions";
import Loader from "@components/utility/loader";
import { PendingList, ReturnToCourtList, getHeaderTitle } from "./const";

const Option = Select.Option;
const { TextArea } = Input;
const { Panel } = Collapse;

export default function ServingOfSummons({ setSelectedSiderMenu }) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const crimeId = loadState("selectedFirId");
  const selectedFir = loadState("selectedFir");
  const { savedFir } = useSelector((state) => state.createFIR);
  const { savedData, isFetching, successMessage, errorMessage, actionType } =
    useSelector((state) => state?.ServingOfSummons);
  const [formValid, setFormValid] = useState(false);
  const { staffList } = useSelector((state) => state.MasterData);
  const selectedCourtAndProsecution = loadState("selectedCourtAndProsecution");
  const { getStaffList } = masterDataActions;
  const [servingOfSummonsPayloadData, setServingOfSummonsPayloadData] =
    useState([]);
  const currentUser = loadState("currentUser");
  const userRole = [IS_SHO, IS_IO, IS_INVESTIGATION_OFFICER];
  const IS_HIGHER_SHO_USER = !userRole?.includes(currentUser?.ecopsv2_role);

  const disableForm =
    (IS_HIGHER_SHO_USER &&
      currentUser?.isPersnolized === false &&
      currentUser?.isIo === false) ||
    savedFir?.caseStatus === "Disposal" ||
    selectedCourtAndProsecution.isCourtDisposal;
  const { getservingOfSummonsData, updateservingOfSummons, resetActionType } =
    servingOfSummons;
  const [summonsServed, setSummonsServed] = useState({});
  const [summonsAssignedBy, setSummonsAssignedBy] = useState({});
  const [summonsStatus, setSummonsStatus] = useState({});
  const [summonsUpload, setSummonsUpload] = useState({});
  const [summonsOther, setSummonsOther] = useState({});
  const { getAccusedList } = suspectAccusedAction;
  const [accusedLists, setAccusedLists] = useState([]);
  const [summonsIssued, setSummonsIssued] = useState({});
  const [activeKey, setActiveKey] = useState("1");
  const [servingOfSummonsAccusedData, setServingOfSummonsAccusedData] =
    useState([]);
  const [servingOfSummonsWitnessData, setServingOfSummonsWitnessData] =
    useState([]);
  const [servingOfSummonsIOData, setServingOfSummonsIOData] = useState([]);
  const [servingOfSummonsSHOData, setServingOfSummonsSHOData] = useState([]);
  const staffMembers = staffList && getStaffsDetails(staffList);

  const openNotificationWithIcon = (type, message) => {
    return notification[type]({
      message: message,
    });
  };

  const isSuccess =
    actionType === "ADD_SERVING_OF_SUMMONS_SUCCESS" ||
    actionType === "UPDATE_SERVING_OF_SUMMONS_SUCCESS";

  const isError =
    actionType === "ADD_SERVING_OF_SUMMONS_ERROR" ||
    actionType === "UPDATE_SERVING_OF_SUMMONS_ERROR";

  const fetchAccusedList = () => {
    dispatch(
      getAccusedList(
        `${config.getPostCrimeSceneDetails}/ACCUSED/?crimeId=${crimeId}`
      )
    );
    dispatch(
      getservingOfSummonsData(
        `${config.courtSummons}?crimeId=${crimeId}&updateChargesheetId=${selectedCourtAndProsecution?.updateChargesheetId}`
      )
    );
    dispatch(
      getStaffList(
        `${config.getSupportStaffFromHrms}?policestationcode=${selectedFir?.psCode}`
      )
    );
  };

  useEffect(() => {
    if (isSuccess || isError) {
      if (!!successMessage) {
        openNotificationWithIcon("success", successMessage);
        form.resetFields();
        setSelectedSiderMenu("courtandprosecution");
        dispatch(resetActionType());
      } else if (!!errorMessage) {
        openNotificationWithIcon("error", errorMessage);
        dispatch(resetActionType());
      }
    }
  }, [actionType]);

  useEffect(() => {
    fetchAccusedList();
  }, []);

  const fetchAccusedListData = () => {
    let summonsIssuedData = [];
    let accusedListData = [];

    for (let i = 0; i < savedData?.length; i++) {
      if (
        !summonsIssuedData.some(
          (item) => item?.value === savedData[i]?.summonsTo
        )
      ) {
        summonsIssuedData.push({
          label: savedData[i]?.summonsTo,
          value: savedData[i]?.summonsTo,
        });
      }
      if (
        (savedData[i]?.summonsTo === "SHO" ||
          savedData[i]?.summonsTo === "IO") &&
        !accusedListData.some(
          (item) => item?.value === savedData[i]?.other?.paoCode
        ) &&
        !!savedData[i]?.other?.paoCode
      ) {
        accusedListData.push({
          label: savedData[i]?.other?.name,
          value: savedData[i]?.other?.paoCode,
        });
      } else if (
        (savedData[i]?.summonsTo !== "SHO" ||
          savedData[i]?.summonsTo !== "IO") &&
        !accusedListData.some(
          (item) => item?.value === savedData[i]?.person?._id
        ) &&
        !!savedData[i]?.person?._id
      ) {
        accusedListData.push({
          label: savedData[i]?.person?.personalDetails?.name,
          value: savedData[i]?.person?._id,
        });
      }
    }
    setAccusedLists(accusedListData);
  };

  useEffect(() => {
    let summonsServedData = {};
    let statusData = {};
    let disableData = [];
    let ServingOfSummonsAccusedDataList = [];

    for (let i = 0; i < savedData?.length; i++) {
      var obj = {
        crimeId: crimeId,
        assignedTo: savedData[i]?.summonsTo,
        isSummonsServed: !!savedData[i]?.served?.isSummonsServed
          ? savedData[i]?.served?.isSummonsServed
          : "",
        status: !!savedData[i]?.served?.status
          ? savedData[i]?.served?.status
          : "",
        reason: !!savedData[i]?.served?.reason
          ? savedData[i]?.served?.reason
          : "",
        otherReason: !!savedData[i]?.served?.otherReason
          ? savedData[i]?.served?.otherReason
          : "",
        dateOfService: !!savedData[i]?.served?.dateOfService
          ? savedData[i]?.served?.dateOfService
          : "",
        dateOfVisit: !!savedData[i]?.served?.dateOfVisit
          ? savedData[i]?.served?.dateOfVisit
          : "",
        courtSummonsId: savedData[i]?._id,
        media: savedData[i]?.served?.media,
      };
      ServingOfSummonsAccusedDataList.push(obj);
      form.setFieldsValue({
        [`${savedData[i]?._id}_issuedBy`]:
          savedData[i]?.served?.assignedBy?.paoCode,
        [`${savedData[i]?._id}_assigned`]: !!savedData[i]?.person?._id
          ? savedData[i]?.person?._id
          : savedData[i]?.other?.paoCode,
        [`${savedData[i]?._id}_issuedTo`]: savedData[i]?.summonsTo,
        [`${savedData[i]?._id}_served`]: savedData[i]?.served?.isSummonsServed,
        [`${savedData[i]?._id}_dateOfService`]: !!savedData[i]?.served
          ?.dateOfService
          ? moment(new Date(savedData[i]?.served?.dateOfService))
          : null,
        [`${savedData[i]?._id}_status`]: savedData[i]?.served?.status,
        [`${savedData[i]?._id}_reason`]: savedData[i]?.served?.reason,
        [`${savedData[i]?._id}_other`]: savedData[i]?.served?.otherReason,
        [`${savedData[i]?._id}_upload`]: savedData[i]?.served?.media,
        [`${savedData[i]?._id}_dateOfVisit`]: !!savedData[i]?.served
          ?.dateOfVisit
          ? moment(new Date(savedData[i]?.served?.dateOfVisit))
          : null,
      });

      if (!!savedData[i]?.served?.isSummonsServed && !!savedData[i]?.served) {
        summonsServedData[`${savedData[i]?._id}_summonsServed`] =
          savedData[i]?.served?.isSummonsServed;
        statusData[`${savedData[i]?._id}_status`] =
          savedData[i]?.served?.status;
        disableData.push(true);
        if (!!savedData[i]?.served?.media) {
          setSummonsUpload((prev) => ({
            ...prev,
            [`${savedData[i]?._id}_upload`]: savedData[i]?.served?.media,
          }));
        }
        setSummonsIssued((prev) => ({
          ...prev,
          [`${savedData[i]?._id}_issuedBy`]:
            savedData[i]?.served?.assignedBy?.paoCode,
        }));
        setSummonsAssignedBy((prev) => ({
          ...prev,
          [`${savedData[i]?._id}_issuedBy`]:
            savedData[i]?.served?.assignedBy?.paoCode,
        }));
        if (savedData[i]?.served?.reason === "Other") {
          setSummonsOther((prev) => ({
            ...prev,
            [`${savedData[i]?._id}_reason`]: savedData[i]?.served?.reason,
          }));
        }
      }
    }
    setServingOfSummonsPayloadData(ServingOfSummonsAccusedDataList);
    const summonsAccusedData = ServingOfSummonsAccusedDataList?.filter(
      (item) => item?.assignedTo === "Accused"
    );
    setServingOfSummonsAccusedData(summonsAccusedData);
    const summonsIOData = ServingOfSummonsAccusedDataList?.filter(
      (item) => item?.assignedTo === "IO"
    );
    setServingOfSummonsIOData(summonsIOData);
    const summonsWitnessData = ServingOfSummonsAccusedDataList?.filter(
      (item) => item?.assignedTo === "Witness"
    );
    setServingOfSummonsWitnessData(summonsWitnessData);
    const summonsSHOData = ServingOfSummonsAccusedDataList?.filter(
      (item) => item?.assignedTo === "SHO"
    );
    setServingOfSummonsSHOData(summonsSHOData);
    setSummonsServed(summonsServedData);
    setSummonsStatus(statusData);
    fetchAccusedListData();
  }, [savedData]);

  const handleSearch = (text) => {
    // setSerchText(text);
  };

  const checkFields = async (e, key, i, item) => {
    const values = await form.validateFields();
    setFormValid(!Object.values(values).every((v) => v == null || v === ""));
  };

  const handlingStatus = (e, key, i, item) => {
    const summonsServe = { ...summonsServed };
    setSummonsServed({});
    setSummonsServed({
      ...summonsServe,
      [`${item?.courtSummonsId}_summonsServed`]: e.target.value,
    });
    setSummonsStatus({
      ...summonsStatus,
      [`${item?.courtSummonsId}_status`]: "",
    });
    if (!!key === true) {
      form.setFieldsValue({
        [`${item?.courtSummonsId}_dateOfService`]: null,
        [`${item?.courtSummonsId}_status`]: null,
        [`${item?.courtSummonsId}_reason`]: null,
        [`${item?.courtSummonsId}_other`]: "",
        [`${item?.courtSummonsId}_dateOfVisit`]: null,
      });
      setFormValid(true);
      delete summonsOther[`${item?.courtSummonsId}_reason`];
      setSummonsOther(summonsOther);
    }
  };

  const uploadFunction = async (values, key, objKey) => {
    let payLoad = [];
    let payLoadObj = { [objKey]: [] };
    let payloadDataObj = servingOfSummonsPayloadData.filter(
      (item) => !!item?.courtSummonsId === true && item?.assignedTo === key
    );
    payloadDataObj.forEach((item) => {
      if (!!values[`${item?.courtSummonsId}_served`] === true) {
        if (values[`${item?.courtSummonsId}_served`] === "Yes") {
          payLoad.push({
            crimeId: crimeId,
            courtSummonsId: item?.courtSummonsId,
            assignedTo: values[`${item?.courtSummonsId}_issuedTo`],
            assignedBy: values[`${item?.courtSummonsId}_issuedBy`],
            isSummonsServed: values[`${item?.courtSummonsId}_served`],
            numberOfAttemptsMade: "",
            dateOfService: values[`${item?.courtSummonsId}_dateOfService`],
            media: !!values[`${item?.courtSummonsId}_upload`]
              ? values[`${item?.courtSummonsId}_upload`]
              : [],
          });
        }
        if (values[`${item?.courtSummonsId}_served`] === "No") {
          payLoad.push({
            crimeId: crimeId,
            courtSummonsId: item?.courtSummonsId,
            assignedTo: values[`${item?.courtSummonsId}_issuedTo`],
            assignedBy: values[`${item?.courtSummonsId}_issuedBy`],
            isSummonsServed: values[`${item?.courtSummonsId}_served`],
            status: values[`${item?.courtSummonsId}_status`],
            reason: values[`${item?.courtSummonsId}_reason`],
            otherReason: values[`${item?.courtSummonsId}_other`],
            dateOfVisit: values[`${item?.courtSummonsId}_dateOfVisit`],
          });
        }
      }
    });

    Object.assign(payLoadObj, { [objKey]: payLoad });

    dispatch(
      updateservingOfSummons(
        `${config.courtSummons}/serve/v2?crimeId=${crimeId}`,
        payLoadObj
      )
    );
  };

  const submit = async (key) => {
    const values = await form.validateFields();
    let objKey =
      key === "Accused"
        ? "accusedList"
        : key === "Witness"
        ? "witnessList"
        : key === "IO"
        ? "ioList"
        : "shoList";
    let upload = {};
    let uploadObj = Object.entries(values);
    for (let i = 0; i < uploadObj?.length; i++) {
      if (
        uploadObj[i][0].split("_").includes("upload") &&
        !!uploadObj[i][1] &&
        !!uploadObj[i][1]?.fileList &&
        uploadObj[i][1]?.fileList?.length !== 0
      ) {
        upload[uploadObj[i][0]] = uploadObj[i][1]?.fileList;
      }
      if (
        uploadObj[i][0].split("_").includes("issuedBy") &&
        !!uploadObj[i][1]
      ) {
        let assignByObj = staffList?.find(
          (item) => item?.paoCode === uploadObj[i][1]
        );
        assignByObj = JSON.parse(JSON.stringify(assignByObj));
        Object.assign(assignByObj, {
          ["name"]: !!assignByObj?.empRoleName ? assignByObj?.empRoleName : "",
          ["unitId"]: !!assignByObj?.cctns_unit_id
            ? assignByObj?.cctns_unit_id
            : "",
        });
        Object.assign(values, { [uploadObj[i][0]]: assignByObj });
      }
    }

    if (Object.keys(upload)?.length === 0) {
      uploadFunction(values, key, objKey);
    } else {
      Object.keys(upload)?.forEach((item) => {
        const uploadCourtOrder = new FormData();
        upload[item]?.forEach((file) => {
          uploadCourtOrder.append("file", file.originFileObj);
        });
        uploadCourtOrder.append("prefixFolder", crimeId);
        uploadCourtOrder.append(
          "folderPath",
          `${crimeId}/${"courtCommittal"}/file`
        );
        axios
          .post(`${config.fileUpload}/upload`, uploadCourtOrder)
          .then((res) => {
            if (res.status === 200) {
              const { data } = res.data;
              Object.assign(values, {
                [item]: getMediaPayloadWithoutCategory(data),
              });
              Object.assign(upload, {
                [item]: getMediaPayloadWithoutCategory(data),
              });
              if (
                Object.values(upload).every(
                  (value) => !!value[0]?.fileId === true
                )
              ) {
                uploadFunction(values, key, objKey);
              }
            } else {
              Object.assign(values, { [item]: [] });
              Object.assign(upload, { [item]: [] });
              if (
                Object.values(upload).every(
                  (value) => !!value[0]?.fileId === true
                )
              ) {
                uploadFunction(values, key, objKey);
              }
            }
          })
          .catch(() => {
            Object.assign(values, { [item]: [] });
            Object.assign(upload, { [item]: [] });
            if (
              Object.values(upload).every(
                (value) => !!value[0]?.fileId === true
              )
            ) {
              uploadFunction(values, key, objKey);
            }
          });
      });
    }
  };

  const handleSelect = (data, key, i, item) => {
    var assigneData = savedData?.find((value) =>
      !!value?.person?._id
        ? value?.person?._id === data
        : value?.other?.paoCode === data
    );
    if (key === "courtSummonsId") {
      if (!!key === true) {
        form.setFieldsValue({
          [`${assigneData?._id}_assigned`]: data,
          [`${assigneData?._id}_issuedTo`]: assigneData?.summonsTo,
        });
      }
    } else if (key === "status") {
      let summonsStatusData = { ...summonsStatus };
      form.setFieldsValue({
        [`${item?.courtSummonsId}_reason`]: null,
        [`${item?.courtSummonsId}_other`]: "",
      });
      setSummonsStatus({
        ...summonsStatusData,
        [`${item?.courtSummonsId}_status`]: data,
      });
      setSummonsOther((prev) => ({
        ...prev,
        [`${item?.courtSummonsId}_reason`]: "",
      }));
    } else if (key === "issuedBy") {
      form.setFieldsValue({ [`${item?.courtSummonsId}_issuedBy`]: data });
      setSummonsIssued((prev) => ({
        ...prev,
        [`${item?.courtSummonsId}_issuedBy`]: data,
      }));
    } else if (key === "reason") {
      setSummonsOther((prev) => ({
        ...prev,
        [`${item?.courtSummonsId}_reason`]: data,
      }));
    }
  };

  const handleUpload = (data, i, _item) => {
    setSummonsUpload((prev) => ({
      ...prev,
      [`${_item?.courtSummonsId}_upload`]: data,
    }));
  };

  const handleDownload = (file) => {
    getFileById(file?.fileId, file?.name, file?.url);
  };

  const getColumns = (name) => [
    {
      title: "Summons Issued By",
      render: (_, item, i) => {
        return (
          <Form.Item name={`${item?.courtSummonsId}_issuedBy`} label="">
            <Select
              suffixIcon={<CaretDownOutlined className="dropDownIcon" />}
              showSearch
              allowClear
              showArrow
              onSearch={handleSearch}
              onChange={(data) => handleSelect(data, "issuedBy", i, item)}
              style={{ width: 150 }}
              disabled={
                disableForm ||
                summonsAssignedBy[`${item?.courtSummonsId}_issuedBy`]
              }
              placeholder={"Summons Issued By"}
            >
              {isArray(staffMembers) &&
                staffMembers.map((item, index) => (
                  <Option key={index} value={item.paoCode} label={item.label}>
                    {item.label}
                  </Option>
                ))}
            </Select>
          </Form.Item>
        );
      },
    },
    {
      title: `${name} Name`,
      dataIndex: "summonAssignedTo",
      key: "summonAssignedTo",
      render: (_, _item, i) => {
        return (
          <Form.Item name={`${_item?.courtSummonsId}_assigned`} label="">
            <Select
              suffixIcon={<CaretDownOutlined className="dropDownIcon" />}
              showSearch
              allowClear
              showArrow
              onSearch={handleSearch}
              onChange={(data) =>
                handleSelect(data, "courtSummonsId", i, _item)
              }
              style={{ width: 145 }}
              disabled={true}
            >
              {isArray(accusedLists) &&
                accusedLists.map((item, index) => (
                  <Option key={index} value={item.value} label={item.label}>
                    {item.label}
                  </Option>
                ))}
            </Select>
          </Form.Item>
        );
      },
    },
    {
      title: "Summons served or not?",
      dataIndex: "summonsServedOrNot",
      key: "summonsServedOrNot",
      render: (_, item, i) => {
        return (
          <Form.Item
            name={`${item?.courtSummonsId}_served`}
            label=""
            required={true}
          >
            <Radio.Group
              disabled={
                disableForm ||
                !summonsIssued[`${item?.courtSummonsId}_issuedBy`]
              }
              style={{ width: 130 }}
              onChange={(e) => {
                handlingStatus(e, "isSummonsServed", i, item);
                setSummonsUpload((prev) => ({
                  ...prev,
                  [`${item?.courtSummonsId}_upload`]: [],
                }));
              }}
            >
              <Radio value={"Yes"}>Yes</Radio>
              <Radio value={"No"}>No</Radio>
            </Radio.Group>
          </Form.Item>
        );
      },
    },
    {
      title: "Date of Service",
      dataIndex: "dateOfService",
      key: "dateOfService",
      render: (_, item, i) => {
        return (
          <Form.Item name={`${item?.courtSummonsId}_dateOfService`} label="">
            <DatePicker
              format={DATE_FORMAT}
              placeholder="Date"
              onChange={(data) => checkFields(data, "dateOfService", i, item)}
              style={{ width: 130 }}
              disabled={
                disableForm ||
                summonsServed[`${item?.courtSummonsId}_summonsServed`] ===
                  "No" ||
                !summonsServed[`${item?.courtSummonsId}_summonsServed`]
              }
            />
          </Form.Item>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_, item, i) => {
        return (
          <Form.Item name={`${item?.courtSummonsId}_status`} label="">
            <Select
              suffixIcon={<CaretDownOutlined className="dropDownIcon" />}
              showSearch
              allowClear
              showArrow
              onSearch={handleSearch}
              onChange={(data) => handleSelect(data, "status", i, item)}
              style={{ width: 138 }}
              placeholder={"Status"}
              disabled={
                disableForm ||
                summonsServed[`${item?.courtSummonsId}_summonsServed`] ===
                  "Yes" ||
                !summonsServed[`${item?.courtSummonsId}_summonsServed`]
              }
            >
              {[{ label: "Pending" }, { label: "Return to court" }].map(
                (item, index) => (
                  <Option key={index} value={item.label} label={item.label}>
                    {item.label}
                  </Option>
                )
              )}
            </Select>
          </Form.Item>
        );
      },
    },
    {
      title: "Reason",
      dataIndex: "reason",
      key: "reason",
      render: (_, item, i) => {
        return (
          <>
            <Form.Item name={`${item?.courtSummonsId}_reason`} label="">
              <Select
                suffixIcon={<CaretDownOutlined className="dropDownIcon" />}
                showSearch
                allowClear
                showArrow
                onSearch={handleSearch}
                onChange={(data) => handleSelect(data, "reason", i, item)}
                style={{ width: 165 }}
                placeholder={"Reason"}
                disabled={
                  disableForm ||
                  summonsServed[`${item?.courtSummonsId}_summonsServed`] ===
                    "Yes" ||
                  !summonsServed[`${item?.courtSummonsId}_summonsServed`]
                }
              >
                {(!!summonsStatus[`${item?.courtSummonsId}_status`] &&
                summonsStatus[`${item?.courtSummonsId}_status`] === "Pending"
                  ? PendingList
                  : !!summonsStatus[`${item?.courtSummonsId}_status`] &&
                    summonsStatus[`${item?.courtSummonsId}_status`] ===
                      "Return to court"
                  ? ReturnToCourtList
                  : []
                )?.map((item, index) => (
                  <Option key={index} value={item.label} label={item.label}>
                    {item.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            {summonsOther[`${item?.courtSummonsId}_reason`] !== undefined &&
            summonsOther[`${item?.courtSummonsId}_reason`] === "Other" ? (
              <Form.Item name={`${item?.courtSummonsId}_other`} label="">
                <TextArea
                  placeholder="Enter Reason"
                  rows={2}
                  columns={3}
                  style={{ width: 165, marginTop: 10 }}
                  onChange={(data) =>
                    checkFields(data?.target?.value, "otherReason", i, item)
                  }
                />
              </Form.Item>
            ) : null}
          </>
        );
      },
    },
    {
      title: "Date of Visit",
      dataIndex: "dateOfVisit",
      key: "dateOfVisit",
      render: (_, item, i) => {
        return (
          <Form.Item name={`${item?.courtSummonsId}_dateOfVisit`} label="">
            <DatePicker
              format={DATE_FORMAT}
              placeholder="Date"
              onChange={(data) => checkFields(data, "dateOfVisit", i, item)}
              style={{ width: 120 }}
              disabled={
                disableForm ||
                summonsServed[`${item?.courtSummonsId}_summonsServed`] ===
                  "Yes" ||
                !summonsServed[`${item?.courtSummonsId}_summonsServed`]
              }
            />
          </Form.Item>
        );
      },
    },
    {
      title: "",
      dataIndex: "upload",
      key: "upload",
      render: (_, item, i) => {
        return (
          <Form.Item name={`${item?.courtSummonsId}_upload`} label="">
            <Upload
              fileList={summonsUpload[`${item?.courtSummonsId}_upload`]}
              customRequest={dummyRequest}
              onChange={(info) =>
                onFileChange(info, (data) => handleUpload(data, i, item))
              }
              multiple={false}
              onPreview={handleDownload}
            >
              <Button
                className="saveButton"
                style={{ width: 80, marginLeft: 10 }}
                disabled={
                  disableForm ||
                  summonsServed[`${item?.courtSummonsId}_summonsServed`] ===
                    "No" ||
                  !summonsServed[`${item?.courtSummonsId}_summonsServed`]
                }
              >
                Upload
              </Button>
            </Upload>
          </Form.Item>
        );
      },
    },
  ];

  return (
    <ModuleWrapper>
      <div className="contentHeaderContainer">
        <div>
          <h2 className="pageTitle">Serving Of Summons</h2>
        </div>
        <div>
          <Button
            type="link"
            onClick={() => setSelectedSiderMenu("courtandprosecution")}
          >
            Cancel
          </Button>
        </div>
      </div>
      <TableWidgetWrapper>
        <Space direction="vertical">
          {isFetching ? (
            <Loader />
          ) : (
            <>
              <Collapse
                accordion
                defaultActiveKey={[1]}
                activeKey={[activeKey]}
                expandIconPosition={"right"}
                expandIcon={({ isActive }) => (
                  <DoubleRightOutlined rotate={isActive ? 90 : 0} />
                )}
              >
                {servingOfSummonsAccusedData?.length !== 0 ? (
                  <Panel
                    style={{ padding: "3" }}
                    className="panelHeader"
                    header={getHeaderTitle("Accused List", setActiveKey, "1")}
                    key="1"
                  >
                    <Form form={form} layout="vertical">
                      <TableWrapper
                        dataSource={servingOfSummonsAccusedData}
                        columns={getColumns("Accused")}
                        size="small"
                      />
                      <Button
                        type="primary"
                        className="saveButton"
                        size="large"
                        style={{ marginTop: 10 }}
                        icon={<SaveOutlined className="saveButtonIcon" />}
                        onClick={() => submit("Accused")}
                        disabled={disableForm}
                      >
                        SAVE
                      </Button>
                    </Form>
                  </Panel>
                ) : null}
                {servingOfSummonsWitnessData.length !== 0 ? (
                  <Panel
                    style={{ padding: "3" }}
                    className="panelHeader"
                    header={getHeaderTitle("Witness List", setActiveKey, "2")}
                    key="2"
                  >
                    <Form form={form} layout="vertical">
                      <TableWrapper
                        dataSource={servingOfSummonsWitnessData}
                        columns={getColumns("Witness")}
                        size="small"
                      />
                      <Divider style={{ marginTop: "75px" }} />
                      <Button
                        type="primary"
                        className="saveButton"
                        style={{ marginTop: 10 }}
                        size="large"
                        icon={<SaveOutlined className="saveButtonIcon" />}
                        onClick={() => submit("Witness")}
                        disabled={disableForm}
                      >
                        SAVE
                      </Button>
                    </Form>
                  </Panel>
                ) : null}
                {servingOfSummonsIOData.length !== 0 ? (
                  <Panel
                    style={{ padding: "3" }}
                    className="panelHeader"
                    header={getHeaderTitle("IO List", setActiveKey, "3", true)}
                    key="3"
                  >
                    <Form form={form} layout="vertical">
                      <TableWrapper
                        dataSource={servingOfSummonsIOData}
                        columns={getColumns("IO")}
                        size="small"
                      />
                      <Button
                        type="primary"
                        className="saveButton"
                        style={{ marginTop: 10 }}
                        size="large"
                        icon={<SaveOutlined className="saveButtonIcon" />}
                        onClick={() => submit("IO")}
                        disabled={disableForm}
                      >
                        SAVE
                      </Button>
                    </Form>
                  </Panel>
                ) : null}
                {servingOfSummonsSHOData.length !== 0 ? (
                  <Panel
                    style={{ padding: "3" }}
                    className="panelHeader"
                    header={getHeaderTitle("SHO List", setActiveKey, "4", true)}
                    key="4"
                  >
                    <Form form={form} layout="vertical">
                      <TableWrapper
                        dataSource={servingOfSummonsSHOData}
                        columns={getColumns("SHO")}
                        size="small"
                      />
                      <Divider style={{ marginTop: "75px" }} />
                      <Button
                        type="primary"
                        className="saveButton"
                        size="large"
                        style={{ marginTop: 10 }}
                        icon={<SaveOutlined className="saveButtonIcon" />}
                        onClick={() => submit("SHO")}
                        disabled={disableForm}
                      >
                        SAVE
                      </Button>
                    </Form>
                  </Panel>
                ) : null}
              </Collapse>
            </>
          )}
        </Space>
        {!isFetching &&
        servingOfSummonsAccusedData.length === 0 &&
        servingOfSummonsWitnessData.length === 0 &&
        servingOfSummonsIOData.length === 0 &&
        servingOfSummonsSHOData.length === 0 ? (
          <Card style={{ height: 400 }}>
            <Result
              status="warning"
              style={{ marginTop: 30 }}
              subTitle="Issue of summons information is missing. Please add summons for associated person to access this module!!"
              extra={
                <Button
                  type="primary"
                  className="stepsButtonActive"
                  style={{
                    backgroundColor: "#258C0B",
                    marginLeft: 15,
                    borderColor: "#258C0B",
                    width: 250,
                  }}
                  onClick={() => setSelectedSiderMenu("issueOfSummons")}
                >
                  Please Visit Issue Of Summons
                </Button>
              }
            />
          </Card>
        ) : null}
      </TableWidgetWrapper>
    </ModuleWrapper>
  );
}
