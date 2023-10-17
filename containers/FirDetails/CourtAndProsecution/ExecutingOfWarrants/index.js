/* eslint-disable array-callback-return */
import { useState, useEffect } from "react";
import { isArray, isEmpty } from "lodash";
import axios from "axios";
import moment from "moment";
import {
  Row,
  Card,
  Form,
  DatePicker,
  Button,
  Table,
  Input,
  Select,
  Upload,
  notification,
} from "antd";
import {
  IS_SHO,
  IS_IO,
  DATE_FORMAT,
  renderFieldsWithDropDown,
  getStaffsDetails,
  dummyRequest,
  getMediaUploadError,
  getMediaPayloadWithoutCategory,
  onFileChange,
  IS_INVESTIGATION_OFFICER,
} from "@containers/FirDetails/fir-util";
import Loader from "@components/utility/loader";
import ContentHeader from "@containers/FirDetails/ContentHeader";
import { CaretDownOutlined } from "@ant-design/icons";
import suspectAccusedAction from "@redux/investigations/suspectAccused/actions";
import { config } from "@config/site.config";
import { loadState } from "@lib/helpers/localStorage";
import { useDispatch, useSelector } from "react-redux";
import issueOfWarrant from "@redux/CourtAndProsecution/IssueOfWarrants/actions";
import masterDataActions from "@redux/masterData/actions";
import { getFileById } from "@containers/media-util";
import {
  statusList,
  pendingReason,
  returningReason,
  confirmationList,
} from "../const";
import { CourtAndProsecutionWrapper } from "../styles";

const Option = Select.Option;
const { TextArea } = Input;

export default function ExecutingOfWarrants({ setSelectedSiderMenu }) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const crimeId = loadState("selectedFirId");
  const selectedCourtAndProsecution = loadState("selectedCourtAndProsecution");
  const { savedFir } = useSelector((state) => state.createFIR);
  const [serchText, setSerchText] = useState("");
  const currentUser = loadState("currentUser");
  const userRole = [IS_SHO, IS_IO, IS_INVESTIGATION_OFFICER];
  const IS_HIGHER_SHO_USER = !userRole?.includes(currentUser?.ecopsv2_role);

  const disableForm =
    (IS_HIGHER_SHO_USER &&
      currentUser?.isPersnolized === false &&
      currentUser?.isIo === false) ||
    savedFir?.caseStatus === "Disposal" ||
    selectedCourtAndProsecution.isCourtDisposal;
  const [summonsServed, setSummonsServed] = useState({});
  const [summonsUpload, setSummonsUpload] = useState({});
  const [summonsOther, setSummonsOther] = useState({});
  const [accusedListsData, setAccusedListsData] = useState([]);
  const [formValid, setFormValid] = useState(false);
  const { getAccusedList } = suspectAccusedAction;
  const { getStaffList } = masterDataActions;
  const { staffList } = useSelector((state) => state.MasterData);
  const { suspectAccusedList } = useSelector((state) => state.SuspectAccused);
  const { actionType, errorMessage, successMessage, isFetching } = useSelector(
    (state) => state.IssueOfWarrants
  );
  const selectedFir = loadState("selectedFir");
  const filterAccusedList = suspectAccusedList?.filter(
    (item) => !!item?.isDied === false
  );
  const filterChargeSheetAccusedData = [];
  filterAccusedList.forEach((item) => {
    if (
      selectedCourtAndProsecution?.data?.accusedParticulars.some(
        (data) =>
          data?.accusedPersonId?._id === item?.person?._id &&
          data?.chargeStatus === "Charged"
      ) === true
    ) {
      filterChargeSheetAccusedData.push(item);
    }
  });
  const { getIssueOfWarrantsList, updateIssueOfWarrants, resetActionType } =
    issueOfWarrant;
  const { issueOfWarrantsList } = useSelector(
    (state) => state?.IssueOfWarrants
  );
  const staffMembers = staffList && getStaffsDetails(staffList);

  const openNotificationWithIcon = (type, message) => {
    return notification[type]({
      message: message,
    });
  };

  const isSuccess =
    actionType === "ADD_ISSUE_OF_WARRANTS_SUCCESS" ||
    actionType === "UPDATE_ISSUE_OF_WARRANTS_SUCCESS";

  const isError =
    actionType === "ADD_ISSUE_OF_WARRANTS_ERROR" ||
    actionType === "UPDATE_ISSUE_OF_WARRANTS_ERROR";

  useEffect(() => {
    if (isSuccess || isError) {
      if (
        !isEmpty(successMessage) &&
        successMessage === "Issue Of Warrants Successfully Added"
      ) {
        openNotificationWithIcon(
          "success",
          "Executing Of Warrants Successfully Added"
        );
        form.resetFields();
        setSelectedSiderMenu("courtandprosecution");
        dispatch(resetActionType());
      } else if (
        !isEmpty(successMessage) &&
        successMessage === "Issue Of Warrants Successfully Updated"
      ) {
        openNotificationWithIcon(
          "success",
          "Executing Of Warrants Successfully Updated"
        );
        form.resetFields();
        setSelectedSiderMenu("courtandprosecution");
        dispatch(resetActionType());
      } else if (!!errorMessage) {
        openNotificationWithIcon("error", errorMessage);
        dispatch(resetActionType());
      }
    }
  }, [actionType]);

  const fetchDetails = () => {
    dispatch(
      getAccusedList(
        `${config.getPostCrimeSceneDetails}/ACCUSED/?crimeId=${crimeId}`
      )
    );
    dispatch(
      getIssueOfWarrantsList(
        `${config.IssueOfWarrants}?crimeId=${crimeId}&updateChargesheetId=${selectedCourtAndProsecution?.updateChargesheetId}`
      )
    );
    dispatch(
      getStaffList(
        `${config.getSupportStaffFromHrms}?policestationcode=${selectedFir?.psCode}`
      )
    );
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  useEffect(() => {
    let summonsServeAll = {};
    let summonsUploadAll = {};
    let summonsOthersAll = {};
    let accusedListData = [];
    for (let i = 0; i < issueOfWarrantsList?.length; i++) {
      const getSetFieldObj = (key) => {
        const execution = issueOfWarrantsList[i]?.execution;
        let setFieldObj = {
          [`${key}_entrustedTo`]: execution?.entrustedTo?.paoCode,
          [`${key}_status`]: execution?.status,
          [`${key}_dateOfExecution`]: moment(
            new Date(execution?.dateOfExecution)
          ).isValid()
            ? moment(new Date(execution?.dateOfExecution))
            : moment(new Date(execution?.dateOfPending)).isValid()
            ? moment(new Date(execution?.dateOfPending))
            : moment(new Date(execution?.dateOfReturningToCourt)).isValid()
            ? moment(new Date(execution?.dateOfReturningToCourt))
            : "",
          [`${key}_numberOfAttempts`]:
            execution?.numberOfAttempts ||
            execution?.reasonForPending ||
            execution?.reasonForReturning,
          [`${key}_other`]:
            execution?.reasonForPendingOther ||
            execution?.reasonForReturningOthers,
          [`${key}_isAddress`]: execution?.isAddressVerified,
          [`${key}_upload`]: execution?.report,
        };

        Object.assign(summonsServeAll, {
          [`${key}_summonsServe`]: execution?.status,
        });
        Object.assign(summonsUploadAll, {
          [`${key}_upload`]: execution?.report,
        });

        Object.assign(summonsOthersAll, {
          [`${key}_other`]:
            execution?.numberOfAttempts ||
            execution?.reasonForPending ||
            execution?.reasonForReturning,
        });
        return setFieldObj;
      };
      const selectedIssueOfWarrant = issueOfWarrantsList[i];
      const otherIssueOfWarrant = selectedIssueOfWarrant?.other;
      if (
        (selectedIssueOfWarrant?.warrantsTo === "SHO" ||
          selectedIssueOfWarrant?.warrantsTo === "IO") &&
        !accusedListData.some(
          (item) => item?.value === otherIssueOfWarrant?.paoCode
        ) &&
        !!otherIssueOfWarrant?.paoCode
      ) {
        accusedListData.push({
          label: otherIssueOfWarrant?.name,
          value: otherIssueOfWarrant?.paoCode,
        });
        let setFieldObj1 = {
          [`${otherIssueOfWarrant?.paoCode}_assigned`]:
            otherIssueOfWarrant?.paoCode,
        };
        Object.assign(
          setFieldObj1,
          getSetFieldObj(otherIssueOfWarrant?.paoCode)
        );
        form.setFieldsValue(setFieldObj1);
      } else if (
        (selectedIssueOfWarrant?.warrantsTo !== "SHO" ||
          selectedIssueOfWarrant?.warrantsTo !== "IO") &&
        !accusedListData.some(
          (item) => item?.value === selectedIssueOfWarrant?.person?._id
        ) &&
        !!selectedIssueOfWarrant?.person?._id
      ) {
        accusedListData.push({
          label: selectedIssueOfWarrant?.person?.personalDetails?.name,
          value: selectedIssueOfWarrant?.person?._id,
        });
        let setFieldObj2 = {
          [`${selectedIssueOfWarrant?.person?._id}_assigned`]:
            selectedIssueOfWarrant?.person?._id,
        };
        Object.assign(
          setFieldObj2,
          getSetFieldObj(selectedIssueOfWarrant?.person?._id)
        );
        form.setFieldsValue(setFieldObj2);
      }
    }
    //triggering similar to handlingStatus method
    setSummonsServed({ ...summonsServeAll });
    setSummonsUpload({ ...summonsUploadAll });
    setSummonsOther({ ...summonsOthersAll });
    setAccusedListsData(accusedListData);
  }, [issueOfWarrantsList]);

  const handleSearch = (text) => {
    setSerchText(text);
  };

  const checkFields = async () => {
    const values = await form.validateFields();
    setFormValid(!Object.values(values).every((v) => v == null || v === ""));
  };

  const handleUpload = (data, i, item) => {
    setSummonsUpload((prev) => ({
      ...prev,
      [`${item?.value}_upload`]: data,
    }));
  };

  const handlingStatus = (val, item) => {
    const summonsServe = { ...summonsServed };
    setSummonsServed({});
    setSummonsServed({ ...summonsServe, [`${item?.value}_summonsServe`]: val });
  };

  const handleDownload = (file) => {
    getFileById(file?.fileId, file?.name, file?.url);
  };

  const uploadFunction = async (values) => {
    let payLoad = [];
    const valueKeys = Object.keys(values);
    const getStaffData = (paoCode) => {
      const assignByObj =
        staffList?.find((item) => item?.paoCode === paoCode) || {};
      const obj = JSON.parse(JSON.stringify(assignByObj));
      obj["name"] = !!obj?.empRoleName ? obj?.empRoleName : "";
      obj["unitId"] = !!obj?.cctns_unit_id ? obj?.cctns_unit_id : "";
      return obj;
    };

    const getPlayLoadObj = (warrantToId, issueOfWarrantObj) => {
      let executinWarrantPayloadObj = {
        crimeId: crimeId,
        issueOfWarrantId: issueOfWarrantObj?._id,
        entrustedTo: getStaffData(values[`${warrantToId}_entrustedTo`]),
        status: values[`${warrantToId}_status`],
      };
      if (values[`${warrantToId}_status`] === "Executed") {
        Object.assign(executinWarrantPayloadObj, {
          numberOfAttempts: values[`${warrantToId}_numberOfAttempts`],
          dateOfExecution: values[`${warrantToId}_dateOfExecution`],
          isAddressVerified: values[`${warrantToId}_isAddress`],
          report: values[`${warrantToId}_upload`],
        });
      } else if (values[`${warrantToId}_status`] === "Pending") {
        Object.assign(executinWarrantPayloadObj, {
          reasonForPending: values[`${warrantToId}_numberOfAttempts`],
          reasonForPendingOther: values[`${warrantToId}_other`],
          dateOfPending: values[`${warrantToId}_dateOfExecution`],
        });
      } else if (values[`${warrantToId}_status`] === "Returned to Court") {
        Object.assign(executinWarrantPayloadObj, {
          reasonForReturning: values[`${warrantToId}_numberOfAttempts`],
          reasonForReturningOthers: values[`${warrantToId}_other`],
          dateOfReturningToCourt: values[`${warrantToId}_dateOfExecution`],
          isAddressVerified: values[`${warrantToId}_isAddress`],
        });
      }
      return executinWarrantPayloadObj;
    };

    accusedListsData?.forEach((ele) => {
      //this it realted to accused/witness
      issueOfWarrantsList.forEach((issueOfWarrantObj) => {
        if (
          issueOfWarrantObj?.person?._id?.toString() === ele?.value?.toString()
        ) {
          payLoad.push(getPlayLoadObj(ele?.value, issueOfWarrantObj));
        } else if (issueOfWarrantObj?.other?.paoCode === ele?.value) {
          payLoad.push(getPlayLoadObj(ele?.value, issueOfWarrantObj));
        }
      });
    });

    // filtering "payload" without entrustedTo details
    const filteredPayload = payLoad.filter(
      (ele) => !isEmpty(ele?.entrustedTo?.name)
    );

    dispatch(
      updateIssueOfWarrants(
        `${config.IssueOfWarrants}/execution?crimeId=${crimeId}`,
        filteredPayload
      )
    );
  };

  const submit = async () => {
    const values = await form.validateFields();
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
    }

    if (Object.keys(upload)?.length === 0) {
      uploadFunction(values);
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
                uploadFunction(values);
              }
            } else {
              Object.assign(values, { [item]: [] });
              Object.assign(upload, { [item]: [] });
              if (
                Object.values(upload).every(
                  (value) => !!value[0]?.fileId === true
                )
              ) {
                uploadFunction(values);
              }
            }
          })
          .catch((err) => {
            getMediaUploadError(err, openNotificationWithIcon);
            Object.assign(values, { [item]: [] });
            Object.assign(upload, { [item]: [] });
            if (
              Object.values(upload).every(
                (value) => !!value[0]?.fileId === true
              )
            ) {
              uploadFunction(values);
            }
          });
      });
    }
  };

  const handleSelect = (value, item) => {
    const other = { ...summonsOther };
    setSummonsOther({});
    setSummonsOther({ ...other, [`${item?.value}_other`]: value });
  };

  const displayDateField = (fieldName, placeholder) => {
    return (
      <Form.Item name={fieldName} label="">
        <DatePicker
          format={DATE_FORMAT}
          placeholder={placeholder}
          onChange={checkFields}
          style={{ width: 170 }}
          disabled={disableForm}
        />
      </Form.Item>
    );
  };

  const columns = [
    {
      title: "Warrants to",
      dataIndex: "warrantsTo",
      key: "warrantsTo",
      render: (_, _item, _i) => {
        return (
          <Form.Item name={`${_item?.value}_assigned`} label="">
            <Select
              suffixIcon={<CaretDownOutlined className="dropDownIcon" />}
              showSearch
              allowClear
              showArrow
              onSearch={handleSearch}
              style={{ width: 145 }}
              disabled={true}
            >
              {isArray(accusedListsData) &&
                accusedListsData.map((item, index) => (
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
      title: "Entrusted to",
      dataIndex: "entrustedTo",
      key: "entrustedTo",
      render: (_, item, _i) => {
        return (
          <Form.Item name={`${item?.value}_entrustedTo`} label="">
            <Select
              suffixIcon={<CaretDownOutlined className="dropDownIcon" />}
              showSearch
              allowClear
              showArrow
              onSearch={handleSearch}
              style={{ width: 150 }}
              placeholder={"Summons Issued By"}
              disabled={disableForm}
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
      title: "Warrant Status",
      dataIndex: "status",
      key: "status",
      render: (_, item, _i) => {
        return (
          <Form.Item name={`${item?.value}_status`} label="">
            {renderFieldsWithDropDown(
              statusList,
              (val) => {
                handlingStatus(val, item);
              },
              handleSearch,
              serchText,
              140,
              disableForm,
              "",
              "Status"
            )}
          </Form.Item>
        );
      },
    },
    {
      title: "Number of Attempts made / Reason",
      dataIndex: "NumberOfAttempts",
      key: "NumberOfAttempts",
      render: (_, item, i) => {
        if (summonsServed[`${item?.value}_summonsServe`] === "Executed") {
          return (
            <Form.Item name={`${item?.value}_numberOfAttempts`} label="">
              <Input
                onChange={checkFields}
                disabled={disableForm}
                style={{ width: 180 }}
                placeholder="Number of Attempts"
              />
            </Form.Item>
          );
        } else if (summonsServed[`${item?.value}_summonsServe`] === "Pending") {
          return (
            <>
              <Form.Item name={`${item?.value}_numberOfAttempts`} label="">
                {renderFieldsWithDropDown(
                  pendingReason,
                  (data) => handleSelect(data, item),
                  handleSearch,
                  serchText,
                  180,
                  disableForm,
                  "",
                  "Reason for Pending"
                )}
              </Form.Item>
              {summonsOther[`${item?.value}_other`] === "Others" ? (
                <Form.Item name={`${item?.value}_other`} label="">
                  <TextArea
                    placeholder="Enter Reason"
                    rows={2}
                    columns={3}
                    style={{ width: 180, marginTop: 10 }}
                    disabled={disableForm}
                    onChange={(data) =>
                      checkFields(data?.target?.value, "otherReason", i, item)
                    }
                  />
                </Form.Item>
              ) : null}
            </>
          );
        } else if (
          summonsServed[`${item?.value}_summonsServe`] === "Returned to Court"
        ) {
          return (
            <>
              <Form.Item name={`${item?.value}_numberOfAttempts`} label="">
                {renderFieldsWithDropDown(
                  returningReason,
                  (data) => handleSelect(data, item),
                  handleSearch,
                  serchText,
                  180,
                  disableForm,
                  "",
                  "Reason for Returning"
                )}
              </Form.Item>
              {summonsOther[`${item?.value}_other`] === "Others" ? (
                <Form.Item name={`${item?.value}_other`} label="">
                  <TextArea
                    placeholder="Enter Reason"
                    rows={2}
                    columns={3}
                    style={{ width: 165, marginTop: 10 }}
                    disabled={disableForm}
                    onChange={(data) =>
                      checkFields(data?.target?.value, "otherReason", i, item)
                    }
                  />
                </Form.Item>
              ) : null}
            </>
          );
        } else {
          return null;
        }
      },
    },
    {
      title: "Date",
      dataIndex: "dateOfExecution",
      key: "dateOfExecution",
      render: (_, item, _i) => {
        if (summonsServed[`${item?.value}_summonsServe`] === "Executed") {
          return displayDateField(
            `${item?.value}_dateOfExecution`,
            "Date Of Execution"
          );
        } else if (summonsServed[`${item?.value}_summonsServe`] === "Pending") {
          return displayDateField(
            `${item?.value}_dateOfExecution`,
            "Date of Pending"
          );
        } else if (
          summonsServed[`${item?.value}_summonsServe`] === "Returned to Court"
        ) {
          return displayDateField(
            `${item?.value}_dateOfExecution`,
            "Date Returned to Court"
          );
        } else {
          return null;
        }
      },
    },
    {
      title: "Is address verified?",
      dataIndex: "isAddress",
      key: "isAddress",
      render: (_, item, _i) => {
        if (summonsServed[`${item?.value}_summonsServe`] === "Executed") {
          return (
            <Form.Item name={`${item?.value}_isAddress`} label="">
              {renderFieldsWithDropDown(
                confirmationList,
                null,
                handleSearch,
                serchText,
                100,
                disableForm,
                "",
                "Address"
              )}
            </Form.Item>
          );
        } else if (
          summonsServed[`${item?.value}_summonsServe`] === "Returned to Court"
        ) {
          return (
            <Form.Item name={`${item?.value}_isAddress`} label="">
              {renderFieldsWithDropDown(
                [{ label: "Yes" }, { label: "No" }],
                null,
                handleSearch,
                serchText,
                100,
                disableForm,
                "",
                "Address"
              )}
            </Form.Item>
          );
        } else if (summonsServed[`${item?.value}_summonsServe`] === "Pending") {
          return "N/A";
        } else {
          return null;
        }
      },
    },
    {
      title: "",
      dataIndex: "upload",
      key: "upload",
      render: (_, item, i) => {
        if (summonsServed[`${item?.value}_summonsServe`] === "Executed") {
          return (
            <Form.Item name={`${item?.value}_upload`} label="">
              <Upload
                fileList={summonsUpload[`${item?.value}_upload`]}
                customRequest={dummyRequest}
                multiple={false}
                onPreview={handleDownload}
                onChange={(info) =>
                  onFileChange(info, (data) => handleUpload(data, i, item))
                }
              >
                <Button
                  className="saveButton"
                  style={{ width: 80, marginLeft: 10 }}
                  disabled={disableForm}
                >
                  Upload
                </Button>
              </Upload>
            </Form.Item>
          );
        }
      },
    },
  ];

  return (
    <CourtAndProsecutionWrapper>
      <ContentHeader
        headerTitle="Executing Of Warrants"
        onSubmitClick={submit}
        isInvestigation={true}
        onCancel={() => setSelectedSiderMenu("courtandprosecution")}
        disableButton={disableForm || isEmpty(accusedListsData)}
      />
      {isFetching ? (
        <Loader />
      ) : (
        <Card
          style={{ width: "100%", height: 400, minHeight: 400 }}
          className="executionOfWarrant"
        >
          <Form form={form} colon={false} layout="vertical">
            <Table columns={columns} dataSource={accusedListsData}></Table>
          </Form>
        </Card>
      )}
    </CourtAndProsecutionWrapper>
  );
}
