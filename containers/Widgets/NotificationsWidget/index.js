import { useState, useEffect } from "react";
import {
  Row,
  Col,
  Tag,
  Modal,
  Table,
  Form,
  Button,
  Input,
  Upload,
  Select,
  DatePicker,
  notification,
  Popover,
} from "antd";
import axios from "axios";
import { isEmpty, first, isUndefined, isNull, last, isArray } from "lodash";
import { config } from "@config/site.config";
import Scrollbars from "@components/utility/customScrollBar";
import Loader from "@components/utility/loader";
import { useSelector, useDispatch } from "react-redux";
import { getFileById } from "@containers/media-util";
import advisoryActions from "@redux/advisoryMemo/actions";
import { CaretDownOutlined, CameraFilled } from "@ant-design/icons";
import { loadState } from "@lib/helpers/localStorage";
import {
  dummyRequest,
  DATE_FORMAT,
  DATE_TIME_FORMAT,
  onFileChange,
  getMediaUploadError,
  IS_DSP,
  IS_CI,
  IS_SHO,
} from "@containers/FirDetails/fir-util";
import moment from "moment";
import { NotificationsWidgetWrapper } from "./styles";
import {
  advisoryTableConfig,
  advisoryHistoryTableConfig,
  actionList,
  getRoleName,
  dataType,
  enableReturnWithRemarkActions,
  enablePendingWithActions,
  getAdvisoryInstructionRoleName,
  joinStrings,
} from "./const";
import { getActsAndSectionsDetails } from "../../const";

const Option = Select.Option;
const { TextArea } = Input;

export default function NotificationsWidget({
  label,
  labelColor,
  shadowColor,
  dataSource,
}) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [serchText, setSerchText] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [closingRemarks, setClosingRemarks] = useState("");
  const [isFormUploading, setIsFormUploading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [selectedAction, setSelectedAction] = useState("");
  const [isSubmitModalVisible, setIsSubmitModalVisible] = useState(false);
  const [selectedFIR, setSelectedFIR] = useState(null);
  const [uploadComplianceReport, setUploadComplianceReport] = useState([]);
  const { actList } = useSelector((state) => state.MasterData);
  const [isComplianceModalVisible, setIsComplianceModalVisible] =
    useState(false);
  const { currentUser } = useSelector((state) => state.Auth);
  const storedUser = loadState("currentUser");
  const activeUser = currentUser.employee_name ? currentUser : storedUser;
  const {
    getAdvisoryList,
    sendComplianceUpdate,
    resetComplianceUpdate,
    actionAdvisoryAck,
  } = advisoryActions;
  const { selectedDashboard } = useSelector((state) => state.Dashboard);
  const { actionType, errorMessage, successMessage } = useSelector(
    (state) => state.AdvisoryMemo
  );

  const columns = [];
  const historyColumns = [];

  const handleSearch = (text) => {
    setSerchText(text);
  };

  const isSuccess =
    actionType === "SEND_COMPLIANCE_SUCCESS" ||
    actionType === "APPROVE_ADVISORY_SUCCESS";
  const isError =
    actionType === "SEND_COMPLIANCE_ERROR" ||
    actionType === "APPROVE_ADVISORY_ERROR";

  const openNotificationWithIcon = (type, message) => {
    return notification[type]({
      message: message,
    });
  };

  const fetchAdvisoryList = () => {
    dispatch(
      getAdvisoryList(
        `${config.getAdvisoryFIRList}?ecopsv2_role=${activeUser?.ecopsv2_role}&ecopsv2_hierarchy_key=${activeUser?.ecopsv2_hierarchy_key}&cctns_unit_id=${activeUser?.cctns_unit_id}&pao_code=${activeUser?.pao_code}`
      )
    );
  };

  useEffect(() => {
    fetchAdvisoryList();
  }, []);

  useEffect(() => {
    if (isSuccess || isError) {
      if (successMessage !== "") {
        openNotificationWithIcon("success", successMessage);
        setIsComplianceModalVisible(false);
        setIsModalVisible(false);
        setIsSubmitModalVisible(false);
        setSelectedRecord(null);
        fetchAdvisoryList();
        form.resetFields();
        dispatch(resetComplianceUpdate());
      } else if (errorMessage) {
        openNotificationWithIcon("error", errorMessage);
        dispatch(resetComplianceUpdate());
      }
    }
  }, [actionType]);

  const onSubmit = (payload) => {
    const advisory = selectedRecord?.advisory;
    const workflow = advisory?.workflow;
    const withCurrentRole = getRoleName(workflow, activeUser);
    if (advisory?.allowComply && advisory?.updateClosed) {
      const updatePayLoad = {
        ...payload,
        advisoryId: advisory?._id,
        updateClosed: true,
      };
      dispatch(sendComplianceUpdate(config.upsertCrimeAdvisory, updatePayLoad));
    } else {
      dispatch(sendComplianceUpdate(config.upsertCrimeAdvisory, payload));
    }
  };

  const onComplianceSubmit = async () => {
    const values = await form.validateFields();
    const crimeId = selectedRecord?._id;
    const complianceReportFormData = new FormData();
    uploadComplianceReport.forEach((file) => {
      complianceReportFormData.append("file", file.originFileObj);
    });
    complianceReportFormData.append("prefixFolder", crimeId);
    complianceReportFormData.append(
      "folderPath",
      `${crimeId}/advisoryMemo/media`
    );
    if (!isEmpty(uploadComplianceReport)) {
      setIsFormUploading(true);
      axios
        .post(`${config.fileUpload}/upload`, complianceReportFormData)
        .then((res) => {
          if (res.status === 200) {
            const { data } = res.data;
            const uploadResult = !isEmpty(data) && first(data);
            const payload = {
              crimeId: crimeId,
              status: "Closed",
              from: selectedRecord?.advisory.from,
              closingRemarks: values?.closingRemarks,
              complianceReport: {
                mimeType: uploadResult?.mimeType,
                name: uploadResult?.name,
                fileId: uploadResult?.id,
              },
              complianceTo: selectedRecord?.advisory.from,
              compliedBy: activeUser?.pao_code,
              compliedName: activeUser?.employee_name,
              compliedRank: activeUser?.rank_name,
              compliedRole: activeUser?.ecopsv2_role,
            };
            onSubmit(payload);
            setIsFormUploading(false);
          }
        })
        .catch((err) => {
          getMediaUploadError(err, openNotificationWithIcon);
          setIsFormUploading(false);
        });
    } else {
      const payload = {
        crimeId: crimeId,
        status: "Closed",
        from: selectedRecord?.advisory.from,
        closingRemarks: values?.closingRemarks,
        complianceReport: {},
        complianceTo: selectedRecord?.advisory.from,
        compliedBy: activeUser?.pao_code,
        compliedName: activeUser?.employee_name,
        compliedRank: activeUser?.rank_name,
        compliedRole: activeUser?.ecopsv2_role,
      };
      onSubmit(payload);
    }
  };

  const submitComplyingRequest = () => {
    if (isEmpty(uploadComplianceReport) && closingRemarks === "") {
      openNotificationWithIcon(
        "error",
        "Please Provide Compliance Remarks or Upload Compliance Report"
      );
    } else {
      onComplianceSubmit();
    }
  };

  const onActionSubmit = async (item) => {
    const values = await form.validateFields();
    const selectedRecordData = isNull(selectedFIR) ? item : selectedFIR;
    const workflow = selectedRecordData?.advisory?.workflow;
    const payLoad = {
      crimeId: selectedRecordData?._id,
      workflowId: workflow?.workflowId,
      taskId: workflow?.taskId,
      action: values[`${selectedRecordData?.advisory?._id}_action`],
      remarks: values?.remarks ? values?.remarks : "",
      approvedBy: activeUser?.pao_code,
      approvedByName: activeUser?.employee_name,
      approvedByRole: activeUser?.ecopsv2_role,
      approvedByRank: activeUser?.rank_name,
      approvedByUnitId: activeUser?.ecopsv2_unit_id,
      approvedByHKey: activeUser?.ecopsv2_hierarchy_key,
      approvedByHRole: activeUser?.ecopsv2_hierarchy_role,
      approvedByPhone: activeUser?.mobile_no,
      approvedByEmail: "",
    };
    dispatch(actionAdvisoryAck(config.approvalAction, payLoad));
  };

  advisoryHistoryTableConfig &&
    advisoryHistoryTableConfig.map((headTitle, _index) => {
      switch (headTitle) {
        case "remarkDate":
          historyColumns.push({
            title: "Remark Date",
            dataIndex: "remarkDate",
            rowKey: "remarkDate",
            render: (i, item) => {
              return (
                <span key={i} className="tableRowText">
                  {item?.date
                    ? moment(item?.date).format(DATE_TIME_FORMAT)
                    : ""}
                </span>
              );
            },
          });
          break;
        case "remarkFrom":
          historyColumns.push({
            title: "Remark From",
            dataIndex: "remarkFrom",
            rowKey: "remarkFrom",
            render: (i, item) => {
              return (
                <span key={i} className="tableRowText">
                  {`${item?.from || ""} ${joinStrings(
                    [item?.from_unit_name],
                    ["( ", " )"]
                  )}`}
                </span>
              );
            },
          });
          break;
        case "remarkTo":
          historyColumns.push({
            title: "Remark To",
            dataIndex: "remarkTo",
            rowKey: "remarkTo",
            render: (i, item) => {
              return (
                <span key={i} className="tableRowText">
                  {`${item?.to || ""} ${joinStrings(
                    [item?.to_unit_name],
                    ["( ", " )"]
                  )}`}
                </span>
              );
            },
          });
          break;
        case "status":
          historyColumns.push({
            title: "Status",
            dataIndex: "status",
            rowKey: "status",
            render: (i, item) => {
              return (
                <span key={i} className="tableRowText">
                  {item?.status || "-"}
                </span>
              );
            },
          });
          break;
        case "Remark":
          historyColumns.push({
            title: "Remark",
            dataIndex: "Remark",
            rowKey: "Remark",
            render: (i, item) => {
              return (
                <span key={i} className="tableRowText">
                  {item?.remark || ""}
                </span>
              );
            },
          });
          break;
        case "uploadedDocs":
          historyColumns.push({
            title: "Uploaded Documents",
            dataIndex: "uploadedDocs",
            rowKey: "uploadedDocs",
            render: (i, item) => {
              const mediaResult =
                !isUndefined(item?.media) && isArray(item?.media)
                  ? first(item?.media)
                  : item?.media;
              return (
                <span
                  key={i}
                  style={{ cursor: "pointer", color: "#02599C" }}
                  onClick={() =>
                    getFileById(
                      mediaResult?.fileId,
                      mediaResult?.name,
                      mediaResult?.url
                    )
                  }
                >
                  {mediaResult?.name}
                </span>
              );
            },
          });
          break;
        default:
          break;
      }
    });

  const getContent = (workFlowHistory) => {
    return (
      <Table
        dataSource={workFlowHistory}
        columns={historyColumns}
        style={{ bordeRadius: 5 }}
        showSorterTooltip={false}
        pagination={true}
      />
    );
  };

  const displayRemarks = (workFlowHistory, titleText) => {
    return (
      <Tag>
        <Popover
          content={getContent(workFlowHistory)}
          title="Approval History"
          trigger="hover"
        >
          <span
            style={{
              cursor: "pointer",
            }}
          >
            {titleText}
          </span>
        </Popover>
      </Tag>
    );
  };

  const getFilteredResult = (item, withWhoom) => {
    return (
      !isEmpty(item) &&
      last(
        item.filter((s) => s.with === withWhoom && s.action !== "In Progress")
      )
    );
  };

  const getDataFromRole = (item) => {
    const advisoryList = item?.advisory;
    const workflowTasks = advisoryList?.workflow?.tasks;
    const employeeRoleName = activeUser?.emp_role_name;
    const SITasks = getFilteredResult(workflowTasks, dataType.SI);
    const CITasks = getFilteredResult(workflowTasks, dataType.CI);
    const ACPTasks = getFilteredResult(workflowTasks, dataType.ACP);

    let filteredResult = "";
    if (employeeRoleName === IS_SHO) {
      filteredResult = SITasks;
    } else if (employeeRoleName === IS_CI) {
      filteredResult = CITasks;
    } else if (employeeRoleName === IS_DSP) {
      filteredResult = ACPTasks;
    }
    return filteredResult;
  };

  const getDataDetails = () => {
    if (!isUndefined(dataSource) && !isEmpty(dataSource?.Open)) {
      const openAdvisoryList = dataSource?.Open;
      openAdvisoryList.map((item, _i) => {
        const filteredResult = getDataFromRole(item);
        const enableReturnAction = enableReturnWithRemarkActions(
          item,
          activeUser
        );
        const enablePendingAction = enablePendingWithActions(item, activeUser);
        form.setFieldsValue({
          [`${item?.advisory?._id}_action`]:
            filteredResult !== "" && !enableReturnAction && !enablePendingAction
              ? filteredResult?.action
              : "",
        });
      });
    }
  };

  useEffect(() => {
    getDataDetails();
  }, [isModalVisible, dataSource]);

  advisoryTableConfig &&
    advisoryTableConfig.map((headTitle, _index) => {
      switch (headTitle) {
        case "S.No":
          columns.push({
            title: "S.No",
            dataIndex: "S.NO",
            rowKey: "S.NO",
            render: (_i, _x, sn) => {
              return <span className="tableRowText">{sn + 1}</span>;
            },
          });
          break;
        case "PsName":
          columns.push({
            title: "Ps Name",
            dataIndex: "PsName",
            rowKey: "PsName",
            render: (_i, item) => {
              console.log("item", item);
              return (
                <span className="tableRowText">{item?.firDetail?.psName}</span>
              );
            },
          });
          break;
        case "Cr.No":
          columns.push({
            title: "Cr.No",
            dataIndex: "Cr.No",
            rowKey: "Cr.No",
            render: (_i, item) => {
              return (
                <span className="tableRowText">{item?.firDetail?.firNum}</span>
              );
            },
          });
          break;
        case "sectionOfLaw":
          columns.push({
            title: "Sec.of Law",
            dataIndex: "sectionsofLaw",
            rowKey: "sectionsofLaw",
            render: (_i, item) => {
              const actsAndSections = item?.firDetail?.actsAndSections;
              return getActsAndSectionsDetails(actsAndSections, actList);
            },
          });
          break;
        case "advisoryMemoIssuedBy":
          columns.push({
            title: "Advisory Memo Issued By",
            rowKey: "advisoryMemoIssuedBy",
            render: (_i, item) => {
              return (
                <span className="tableRowText">
                  {`${item?.advisory?.fromRole || ""} ${joinStrings(
                    [item?.advisory?.from_unit_name],
                    ["( ", " )"]
                  )}`}
                </span>
              );
            },
          });
          break;
        case "advisoryMemoIssuedTo":
          columns.push({
            title: "Advisory Memo Issued To",
            rowKey: "advisoryMemoIssuedTo",
            render: (_i, item) => {
              return (
                <span className="tableRowText">
                  {`${item?.advisory?.instructionTo || ""}                  
                  ${joinStrings([item?.advisory?.to_unit_name], ["( ", " )"])}`}
                </span>
              );
            },
          });
          break;
        case "remarks":
          columns.push({
            title: "Approval History",
            dataIndex: "remarks",
            rowKey: "remarks",
            render: (_i, item) => {
              const advisory = item?.advisory;
              const workFlowHistory = advisory?.history;
              return displayRemarks(workFlowHistory, "View History");
            },
          });
          break;
        case "advisoryMemo":
          columns.push({
            title: "Advisory Memo",
            dataIndex: "advisoryMemo",
            rowKey: "advisoryMemo",
            render: (i, item) => {
              const advisoryMemo = item?.advisory?.memo;
              return (
                <span
                  key={i}
                  style={{ cursor: "pointer", color: "#02599C" }}
                  onClick={() =>
                    getFileById(
                      advisoryMemo?.fileId,
                      advisoryMemo?.name,
                      advisoryMemo?.url
                    )
                  }
                >
                  {advisoryMemo?.name}
                </span>
              );
            },
          });
          break;
        case "complianceTime":
          columns.push({
            title: "Compliance time specified",
            dataIndex: "complianceTime",
            rowKey: "complianceTime",
            render: (_i, item) => {
              return (
                <span className="tableRowText">
                  {item?.advisory?.complyWithin}
                </span>
              );
            },
          });
          break;
        case "complianceStatus":
          columns.push({
            title: "Compliance Status",
            dataIndex: "complianceStatus",
            rowKey: "complianceStatus",
            render: (_i, item) => {
              const advisory = item?.advisory;
              const complyStatus = advisory?.complyStatus;
              let color = "green";
              if (complyStatus && complyStatus.includes("Overdue")) {
                color = "orange";
              } else if (
                complyStatus &&
                complyStatus.includes("Complied after")
              ) {
                color = "red";
              }
              return (
                <div style={{ textAlign: "center" }}>
                  <Tag color={color}>
                    {complyStatus ? complyStatus : advisory?.status}
                  </Tag>
                </div>
              );
            },
          });
          break;
        case "workflowStatus":
          columns.push({
            title: "Status",
            dataIndex: "workflowStatus",
            rowKey: "workflowStatus",
            render: (_i, item) => {
              const workflowStatus = item?.advisory?.workflow?.status;
              let color = "green";
              if (workflowStatus && workflowStatus.includes("Pending")) {
                color = "orange";
              }
              return workflowStatus ? (
                <div style={{ textAlign: "center" }}>
                  <Tag color={color}>
                    {item?.advisory?.workflow?.status
                      ? item?.advisory?.workflow?.status
                      : "-"}
                  </Tag>
                </div>
              ) : (
                <div style={{ textAlign: "center" }}>N/A</div>
              );
            },
          });
          break;
        case "actions":
          if (selectedTag === "OPEN") {
            columns.push({
              title: <div style={{ width: 300 }}>ACTIONS</div>,
              dataIndex: "actions",
              rowKey: "actions",
              render: (_i, item) => {
                const advisory = item?.advisory;
                const workflow = advisory?.workflow;
                const withCurrentRole = getRoleName(workflow, activeUser);
                const instructionTo = getAdvisoryInstructionRoleName(
                  advisory,
                  activeUser
                );
                const enableAction = enableReturnWithRemarkActions(
                  item,
                  activeUser
                );
                const enablePendingAction = enablePendingWithActions(
                  item,
                  activeUser
                );
                const disableActions =
                  withCurrentRole === "" ||
                  (!enableAction && !enablePendingAction);
                if (advisory?.allowComply) {
                  return (
                    <Button
                      style={{
                        marginTop: 0,
                        backgroundColor: "rgb(2, 89, 156)",
                        borderColor: "rgb(2, 89, 156)",
                        color: "rgb(255, 255, 255)",
                      }}
                      onClick={() => {
                        setIsComplianceModalVisible(true);
                        setSelectedRecord(item);
                      }}
                    >
                      COMPLY
                    </Button>
                  );
                } else if (!advisory?.allowComply) {
                  return (
                    <Row>
                      <Col>
                        <Form.Item
                          name={`${item?.advisory?._id}_action`}
                          label=""
                        >
                          <Select
                            suffixIcon={
                              <CaretDownOutlined className="dropDownIcon" />
                            }
                            showSearch
                            allowClear
                            disabled={!advisory?.allowAction}
                            onSearch={handleSearch}
                            filterOption={(input, option) =>
                              serchText &&
                              option.props.label
                                .toString()
                                .toLowerCase()
                                .indexOf(input.toString().toLowerCase()) >= 0
                            }
                            style={{ width: 190 }}
                            onSelect={(data) => {
                              setSelectedAction(data);
                            }}
                          >
                            {actionList.map((item, index) => (
                              <Option key={index} value={item} label={item}>
                                {item}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col style={{ cursor: "pointer", marginLeft: 10 }}>
                        <Form.Item>
                          <Button
                            type="dashed"
                            style={{ fontSize: 12 }}
                            disabled={
                              !advisory?.allowAction || selectedAction === ""
                            }
                            onClick={() => {
                              if (
                                selectedAction === dataType?.RETURN_WITH_REMARKS
                              ) {
                                setIsSubmitModalVisible(true);
                              } else {
                                onActionSubmit(item);
                              }
                              setSelectedFIR(item);
                            }}
                          >
                            SUBMIT
                          </Button>
                        </Form.Item>
                      </Col>
                    </Row>
                  );
                } else {
                  return <p>Error</p>;
                }
              },
            });
          }
          break;
        default:
          break;
      }
    });

  const displayTags = (colorCode, status, count) => {
    return (
      <Col flex="none">
        <Tag
          color={colorCode}
          style={{ cursor: count > 0 ? "pointer" : "not-allowed" }}
          onClick={() => {
            if (count > 0) {
              setIsModalVisible(true);
              setSelectedTag(status);
            } else {
              setIsModalVisible(false);
            }
          }}
        >
          <span style={{ fontWeight: "bold" }}>{status}</span>
          <span style={{ marginLeft: 5, fontWeight: "bold" }}>{count}</span>
        </Tag>
      </Col>
    );
  };

  const displayNotificationList = () => {
    return (
      <Row
        wrap={false}
        style={{
          padding: 10,
          borderRadius: 5,
          marginBottom: 8,
        }}
      >
        <Col
          flex="auto"
          className={
            selectedDashboard !== "advisory-and-ack" ? "widgetText" : ""
          }
        >
          Advisory Memo
        </Col>
        {displayTags("#258C0B", "OPEN", dataSource?.Open?.length)}
        {displayTags("#828282", "CLOSED", dataSource?.Closed?.length)}
      </Row>
    );
  };

  const setModal = () => {
    return (
      <Form form={form} layout="vertical">
        {isModalVisible ? (
          <Modal
            title="Advisory Memo List"
            visible={isModalVisible}
            onOk={() => {
              setIsModalVisible(false);
              setSelectedTag("");
            }}
            onCancel={() => {
              setIsModalVisible(false);
              setSelectedTag("");
            }}
            style={{
              minWidth: "95vw",
              top: 20,
              whiteSpace: "nowrap",
            }}
            bodyStyle={{ padding: 0 }}
            footer={null}
          >
            <div style={{ maxHeight: 500, overflowY: "auto" }}>
              <Table
                dataSource={
                  selectedTag === "OPEN" ? dataSource?.Open : dataSource?.Closed
                }
                columns={columns}
                style={{ bordeRadius: 5, width: "99%" }}
                showSorterTooltip={false}
                pagination={true}
              />
            </div>
          </Modal>
        ) : null}
        {isComplianceModalVisible ? (
          <Modal
            title="Send Compliance Update"
            visible={isComplianceModalVisible}
            onOk={() => {
              setIsComplianceModalVisible(false);
            }}
            onCancel={() => {
              setIsComplianceModalVisible(false);
            }}
            style={{ minWidth: "55vw" }}
            footer={[
              <Button
                onClick={() => {
                  setIsComplianceModalVisible(false);
                }}
              >
                Close
              </Button>,
              <Button
                style={{
                  backgroundColor: "#02599C",
                  borderColor: "#02599C",
                  color: "#FFF",
                }}
                disabled={isFormUploading}
                onClick={submitComplyingRequest}
              >
                Submit
              </Button>,
            ]}
          >
            <Row gutter={24}>
              <Col span={16}>
                <Form.Item name="closingRemarks" label="Compliance Remarks">
                  <TextArea
                    style={{ width: 500, height: 300, resize: "none" }}
                    rows={100}
                    columns={10}
                    onChange={(e) => setClosingRemarks(e.target.value)}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="uploadComplianceReport"
                  label="Compliance Report"
                >
                  <Upload
                    fileList={uploadComplianceReport}
                    customRequest={dummyRequest}
                    onChange={(info) =>
                      onFileChange(info, setUploadComplianceReport)
                    }
                    multiple={false}
                  >
                    <Button
                      icon={<CameraFilled />}
                      style={{
                        marginTop: 0,
                        backgroundColor: "rgb(2, 89, 156)",
                        borderColor: "rgb(2, 89, 156)",
                        color: "rgb(255, 255, 255)",
                      }}
                    >
                      Upload Compliance Report
                    </Button>
                  </Upload>
                </Form.Item>
              </Col>
            </Row>
            {isFormUploading ? <Loader /> : null}
            <Row gutter={24} style={{ paddingTop: 20 }}>
              <Col span={8}>
                <Form.Item name="dateOfCompliance" label="Date of Compliance">
                  <DatePicker
                    format={DATE_FORMAT}
                    style={{ width: 230 }}
                    defaultValue={moment()}
                    disabled
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="sendTo" label="Send To">
                  <Select
                    suffixIcon={<CaretDownOutlined className="dropDownIcon" />}
                    showSearch
                    allowClear
                    defaultValue={selectedRecord?.advisory.fromName}
                    disabled
                    onSearch={handleSearch}
                    filterOption={(input, option) =>
                      serchText &&
                      option.props.label
                        .toString()
                        .toLowerCase()
                        .indexOf(input.toString().toLowerCase()) >= 0
                    }
                    style={{ width: 230 }}
                  >
                    {[].map((item, index) => (
                      <Option key={index} value={item} label={item}>
                        {item}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Modal>
        ) : null}
        {isSubmitModalVisible ? (
          <Modal
            title={
              <Row gutter={24}>
                <Col style={{ color: "#022A49" }}>
                  {`Cr. No. ${selectedFIR?.firDetail?.firNum} - ${selectedAction}`}
                </Col>
              </Row>
            }
            visible={isSubmitModalVisible}
            onOk={() => {
              setIsSubmitModalVisible(false);
            }}
            onCancel={() => {
              setIsSubmitModalVisible(false);
            }}
            footer={[
              <Button
                key="back"
                onClick={() => {
                  setIsSubmitModalVisible(false);
                }}
              >
                Close
              </Button>,
              <Button
                onClick={onActionSubmit}
                style={{
                  backgroundColor: "#02599C",
                  borderColor: "#02599C",
                  color: "#FFF",
                }}
              >
                Return
              </Button>,
            ]}
            width={550}
          >
            <Row gutter={24}>
              <Form.Item
                name="remarks"
                label="Enter Remarks"
                rules={[
                  {
                    required: true,
                    message: "Please enter remarks!",
                  },
                ]}
              >
                <TextArea
                  style={{ width: 530, height: 300, resize: "none" }}
                  rows={100}
                  columns={10}
                />
              </Form.Item>
            </Row>
          </Modal>
        ) : null}
      </Form>
    );
  };

  return selectedDashboard === "advisory-and-ack" ? (
    <div>
      <Row style={{ marginLeft: "-10px" }}>{displayNotificationList()}</Row>
      {setModal()}
    </div>
  ) : (
    <NotificationsWidgetWrapper
      style={{ boxShadow: `0px 27px 19px -28px ${shadowColor}` }}
    >
      <h3 className="widgetLabel" style={{ color: labelColor }}>
        {label}
      </h3>
      <Scrollbars className="widgetContainer">
        {displayNotificationList()}
      </Scrollbars>
      {setModal()}
    </NotificationsWidgetWrapper>
  );
}
