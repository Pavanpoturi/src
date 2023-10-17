/* eslint-disable array-callback-return */
import { useEffect, useState } from "react";
import {
  Select,
  Radio,
  Form,
  Table,
  Tag,
  Button,
  Modal,
  notification,
  Popover,
  Row,
  Col,
  Upload,
  Input,
} from "antd";
import { CameraFilled, FilePdfOutlined } from "@ant-design/icons";
import { first, isUndefined } from "lodash";
import Loader from "@components/utility/loader";
import ManiInVestigation from "@components/Common/miniinvestigation";
import StepsIndicator from "@components/Common/StepsIndicator";
import axios from "axios";
import { variables } from "@assets/styles/variables";
import { useDispatch, useSelector } from "react-redux";
import reGeneratedFirActions from "@redux/reGeneratedFir/actions";
import { loadState } from "@lib/helpers/localStorage";
import {
  IS_SHO,
  IS_CI,
  IS_DSP,
  IS_SP,
  IS_DGP,
  dummyRequest,
} from "@containers/FirDetails/fir-util";
import { isEmpty } from "lodash";
import { config, API_KEY } from "@config/site.config";
import { getFileById } from "@containers/media-util";
import { Link } from "react-router-dom";
import dashboardActions from "@redux/dashboard/actions";
import { CaseTrasferContainer } from "./case.styles";
import { transferOfCaseTemplates } from "./utils";
import { IS_IO } from "../FirDetails/fir-util";

export default function CaseTransfer() {
  const [form] = Form.useForm();
  const { TextArea } = Input;
  const dispatch = useDispatch();
  const { dashboardDetails } = useSelector((state) => state.Dashboard);
  const { fetchDashboardDetails } = dashboardActions;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const crimeId = loadState("selectedFirId");
  const userData = JSON.parse(localStorage.getItem("currentUser"));
  const [selectedCaseTransFerType, setSelectedCaseTransFerType] = useState("");
  const [selectedRecord, setSelectedRecord] = useState([]);
  const [selectedPermissionRecord, setSelectedPermissionRecord] = useState([]);
  const [selectedFirData, setSelectedFirData] = useState({});
  const [transferCasesData, setTransferCasesData] = useState([]);
  const [receiveCasesData, setReceiveCasesData] = useState([]);
  const [selectedActionType, setSelectedActionType] = useState("");
  const { currentUser } = useSelector((state) => state.Auth);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDocumentModalVisible, setIsDocumentModalVisible] = useState(false);
  const [isPermissionModalVisible, setIsPermissionModalVisible] =
    useState(false);
  const [selectedTemplateName, setSelectedTemplateName] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");
  const [addRemarks, setAddRemarks] = useState("");
  const [submitData, setSubmitData] = useState({});
  const [uploadingData, setUploadingData] = useState([]);
  const [open, setOpen] = useState(false);
  const storedUser = loadState("currentUser");
  const activeUser = currentUser.employee_name ? currentUser : storedUser;
  const { fetchDashboardTransferOfCase, postDashboardTransferOfCase } =
    reGeneratedFirActions;
  const {
    DashboardTransferCases,
    DashboardReceiveCases,
    actionType,
    successMessage,
    errorMessage,
    isFetching,
  } = useSelector((state) => state.ReGeneratedFIR);

  const isSuccess = actionType === "DASHBOARD_TRANSFER_OF_CASE_POST_SUCCESS";
  const isError = actionType === "DASHBOARD_TRANSFER_OF_CASE_POST_ERROR";

  useEffect(() => {
    setTransferCasesData(DashboardTransferCases);
    setReceiveCasesData(DashboardReceiveCases);
  }, [DashboardTransferCases, DashboardReceiveCases]);

  const docColumns = [
    {
      title: <div style={{ width: 100 }}>Sl No</div>,
      render: (_, data, i) => <p>{i + 1}</p>,
    },
    {
      title: "Letter to Unit Officer",
      render: (i, item) => {
        return (
          <span
            key={i}
            style={{ cursor: "pointer", color: "#02599C" }}
            onClick={() => getFileById(item?.fileId, item?.name, item?.url)}
          >
            {item?.name}
          </span>
        );
      },
    },
  ];

  const permissionColumns = [
    {
      title: <div style={{ width: 100 }}>Sl No</div>,
      render: (_, _data, i) => <p>{i + 1}</p>,
    },
    {
      title: "Transferred to District",
      dataIndex: "transferToDistrict",
      key: "transferToDistrict",
    },
    {
      title: "Transferred to PS",
      dataIndex: "transferToPS",
      key: "transferToPS",
    },
    {
      title: "Transferred Reason",
      dataIndex: "transferReason",
      key: "transferReason",
    },
    {
      title: "Remarks By",
      dataIndex: "remarksBy",
      key: "remarksBy",
    },
    {
      title: "Transfer Remarks",
      dataIndex: "transferRemarks",
      key: "transferRemarks",
    },
  ];

  const options = [
    {
      value: "All",
      label: "All",
    },
    {
      value: "Pending",
      label: "Pending",
    },
    {
      value: "Approved",
      label: "Approved",
    },
  ];

  const handleModalOk = (data) => {
    if (!!submitData?.allowUpload === true && uploadingData?.length !== 0) {
      openNotificationWithIcon("error", "please upload Media file");
    } else {
      var obj = {
        workflowId: data?.workflowId,
        taskId: data?.taskId,
        action: selectedActionType,
        media: uploadingData,
        remarks: !!addRemarks ? addRemarks : "",
        approvedBy: userData?.pao_code, // pao_code
        approvedByName: userData?.employee_name, // employee_name
        approvedByRole: userData?.ecopsv2_role, // ecopsv2_role
        approvedByRank: userData?.rank_name, // rank_name
        approvedByUnitId: activeUser?.ecopsv2_unit_id,
        approvedByHKey: activeUser?.ecopsv2_hierarchy_key,
        approvedByHRole: activeUser?.ecopsv2_hierarchy_role,
        approvedByPhone: userData?.mobile_no, // mobile_no
        approvedByEmail: "",
      };
      dispatch(postDashboardTransferOfCase(config.approvalAction, obj));
      setAddRemarks("");
      setSubmitData({});
      setSelectedActionType("");
      setOpen(false);
    }
  };

  const handleModalCancel = () => {
    setOpen(false);
  };

  const openNotificationWithIcon = (type, message) => {
    return notification[type]({
      message: message,
    });
  };
  const handleChange = (e) => {
    setSelectedCaseTransFerType(e.target.value);
  };
  useEffect(() => {
    if (isSuccess || isError) {
      if (isSuccess) {
        openNotificationWithIcon("success", successMessage);
        form.resetFields();
        const body = {
          pao_code: userData?.pao_code,
          ecopsv2_role: userData?.ecopsv2_role,
          ecopsv2_hierarchy_key: userData?.ecopsv2_hierarchy_key,
          ecopsv2_unit_id: userData?.ecopsv2_unit_id?.toString(),
          ecopsv2_hierarchy_role: userData?.ecopsv2_hierarchy_role,
        };
        dispatch(
          fetchDashboardTransferOfCase(
            `${config?.getDashboardTransferOfCase}`,
            body
          )
        );
      } else if (isError) {
        openNotificationWithIcon("error", errorMessage);
      }
    }
  }, [actionType]);

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
    form.setFieldsValue({ zeroFirField: "transferredFir" });
    setSelectedCaseTransFerType("transferredFir");
    const body = {
      pao_code: userData?.pao_code,
      ecopsv2_role: userData?.ecopsv2_role,
      ecopsv2_hierarchy_key: userData?.ecopsv2_hierarchy_key,
      ecopsv2_unit_id: userData?.ecopsv2_unit_id?.toString(),
      ecopsv2_hierarchy_role: userData?.ecopsv2_hierarchy_role,
    };
    dispatch(
      fetchDashboardTransferOfCase(
        `${config?.getDashboardTransferOfCase}`,
        body
      )
    );
  }, []);

  const IS_SHO_USER = activeUser.emp_role_name === IS_SHO;
  const IS_HIGHER_SHO_USER = activeUser?.emp_role_name !== IS_SHO || IS_IO;
  const nonSHO = ["Draft Cases"];
  const nonSHODashboard =
    !isEmpty(dashboardDetails) &&
    dashboardDetails.filter((item) => !nonSHO?.includes(item.caseStatus));
  const filteredDashboard =
    IS_SHO_USER || IS_HIGHER_SHO_USER ? dashboardDetails : nonSHODashboard;
  const dashboardStatsTransform =
    filteredDashboard &&
    filteredDashboard.length > 0 &&
    filteredDashboard.map(function (item) {
      let fontColor = "";
      let key = "";
      let title = "";
      // eslint-disable-next-line default-case
      switch (item.caseStatus) {
        case "New":
          fontColor = "#349F30";
          key = "new-firs";
          title =
            item?.caseCount > 1
              ? "Newly ASSIGNED FIR(s)"
              : "Newly ASSIGNED FIR";
          break;
        case "UI Cases":
          fontColor = "#D69B24";
          key = "ui-cases";
          title = "UI CASES";
          break;
        case "CC Nos Awaited":
          fontColor = "#0081CC";
          key = "cc-nos-awaited";
          title = "CC Nos Awaited";
          break;
        case "Disposal":
          fontColor = "#0081CC";
          key = "disposed";
          title = "DISPOSAL";
          break;
        case "PT Cases":
          fontColor = "#D69B24";
          key = "pt-cases";
          title = "PT CASES";
          break;
        case "Trial of Cases for the day":
          fontColor = "#0081CC";
          key = "trial-of-cases";
          title = "TRIAL OF CASES FOR THE DAY";
          break;
        case "Total Cases":
          fontColor = "#0081CC";
          key = "total-cases";
          title = "TOTAL CASES";
          break;
        case "Draft Cases":
          fontColor = "#349F30";
          key = "draft-cases";
          title = "DRAFT FIR";
          break;
        case "Zero FIRs":
          fontColor = "#349F30";
          key = "zeroCases";
          title = "Zero FIR(s)";
      }
      return {
        key: key,
        title: title,
        caseStatus: item.caseStatus,
        value: item.caseCount,
        fontColor: fontColor,
        bgColor: variables.WHITE_COLOR,
      };
    });

  const getCaseMetricsList = () => {
    let arr = [];
    if (IS_SHO_USER) {
      arr.push(dashboardStatsTransform[5]);
      arr.push(dashboardStatsTransform[1]);
      arr.push(dashboardStatsTransform[0]);
      arr.push(dashboardStatsTransform[2]);
      arr.push(dashboardStatsTransform[4]);
      arr.push(dashboardStatsTransform[3]);
      arr.push(dashboardStatsTransform[10]);
      arr.push(dashboardStatsTransform[8]);
      localStorage.setItem(
        "draftCount",
        JSON.stringify(dashboardStatsTransform[8]?.value)
      );
      arr.push(dashboardStatsTransform[11]);
    } else {
      arr.push(dashboardStatsTransform[5]);
      arr.push(dashboardStatsTransform[0]);
      arr.push(dashboardStatsTransform[2]);
      arr.push(dashboardStatsTransform[4]);
      arr.push(dashboardStatsTransform[3]);
      arr.push(dashboardStatsTransform[10]);
      arr.push(dashboardStatsTransform[11]);
    }
    return arr;
  };

  const checkIsDraft = () => {
    //checking isDraft is aviailable or not
    let isDraftConst = getCaseMetricsList().find(
      (ele) => ele?.key === "draft-cases"
    );
    if (isDraftConst && isDraftConst?.value >= 1) {
      return true;
    } else {
      return false;
    }
  };

  const getTags = (data, cursor) => {
    return (
      <Tag
        style={{
          color: "black",
          width: 300,
          textAlign: "center",
          cursor: cursor,
        }}
        color={
          data?.transferTo?.toLowerCase() ===
          "Other Police Station"?.toLowerCase()
            ? data?.status?.split(" ").includes("Pending")
              ? "#ffcb2e"
              : data?.status?.split(" ").includes("Returned")
              ? "#FF0000"
              : data?.status?.split(" ").includes("Overdue")
              ? "#ff7a7e"
              : "#87ff8f"
            : "#c2e5ff"
        }
        key={data?.status}
      >
        {data?.status.toUpperCase()}
      </Tag>
    );
  };

  const columns_ = [
    {
      title: "Sl.No",
      render: (_, _data, i) => <p>{i + 1}</p>,
    },
    {
      title: "Cr.No",
      render: (_, data) => (
        <span
          className="tableRowTextUl"
          onClick={() => handleClick(data)}
          style={{ cursor: "pointer" }}
        >
          {data?.firNum}
        </span>
      ),
    },
    {
      title: "Sec.of law",
      dataIndex: "actsAndSections",
      key: "actsAndSections",
    },
    {
      title: "Date of Transfer",
      dataIndex: "dateOfTransfer",
      key: "dateOfTransfer",
    },
    {
      title: "Transferred to Unit/Agency",
      dataIndex: "transferTo",
      key: "transferTo",
    },
    {
      title: "Transferred to PS",
      dataIndex: "transferToName",
      key: "transferToName",
    },
    {
      title: "Name of Acknowledgement/Permission",
      render: (_, data, _i) => (
        <span
          className="tableRowTextUl"
          style={{ cursor: "pointer" }}
          onClick={() => {
            setIsPermissionModalVisible(true);
            setSelectedPermissionRecord(data?.history);
            const majorHead = data?.majorMinorClassification
              ?.map((item) => item.majorHead)
              .join(", ");
            const minorHead = data?.majorMinorClassification
              .map((item) => item.minorHead)
              .join(", ");
            Object.assign(data, { minorHead: minorHead, majorHead: majorHead });
            setSubmitData(data);
          }}
        >
          Transfer Of Case
        </span>
      ),
    },
    {
      title: "Document",
      render: (_, data, i) => (
        <span
          key={i}
          className="tableRowTextUl"
          style={{ cursor: "pointer" }}
          onClick={() => {
            setIsDocumentModalVisible(true);
            setSubmitData(data);
            setSelectedRecord(
              !!data?.notice && Object.keys(data?.notice)?.length !== 0
                ? Array.isArray(data?.notice)
                  ? data?.notice
                  : [data?.notice]
                : []
            );
          }}
        >
          VIEW NOTICE
        </span>
      ),
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
      render: (_, data, _i) => {
        return !isUndefined(data?.approvals) ? (
          <Popover
            placement="bottom"
            content={
              data?.transferTo?.toLowerCase() ===
              "Other Police Station"?.toLowerCase() ? (
                <StepsIndicator
                  data={data?.approvals?.length !== 0 ? data?.approvals : []}
                  status={data?.status}
                  with={data?.with}
                />
              ) : null
            }
            trigger="click"
            arrowPointAtCenter
          >
            {getTags(data, "pointer")}
          </Popover>
        ) : (
          getTags(data, "default")
        );
      },
    },
  ];

  const columns = [
    {
      title: "Sl.No",
      render: (_, _data, i) => <p>{i + 1}</p>,
    },
    {
      title: "Cr.No",
      render: (_, data) => (
        <span
          className="tableRowTextUl"
          onClick={() => handleClick(data)}
          style={{ cursor: "pointer" }}
        >
          {data?.firNum}
        </span>
      ),
    },
    {
      title: "New Cr.No",
      render: (_, data) => {
        if (data?.newFirNum.includes("DR") === true) {
          return (
            <Link
              to={{ pathname: `./draft-fir/${data.newCrimeId}` }}
              className="tableRowTextUl"
              onClick={() => [
                localStorage.setItem(
                  "selectedDraftedFirId",
                  JSON.stringify(data.newCrimeId)
                ),
                localStorage.removeItem("selectedCaseStatus"),
              ]}
            >
              <span className="tableRowTextUl">{data?.newFirNum}</span>
            </Link>
          );
        } else {
          return (
            <span
              className="tableRowTextUl"
              onClick={() => handleClick(data, data?.newCrimeId)}
              style={{ cursor: "pointer" }}
            >
              {data?.newFirNum}
            </span>
          );
        }
      },
    },
    {
      title: "Unit Name",
      dataIndex: "transferToName",
      key: "transferToName",
    },

    {
      title: "Transferred From",
      dataIndex: "transferFromName",
      key: "transferFromName",
    },
    {
      title: "Date of Transfer",
      dataIndex: "dateOfTransfer",
      key: "dateOfTransfer",
    },
    {
      title: "Date of Approval From Unit Officer",
      dataIndex: "approvalDate",
      key: "approvalDate",
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <>
          {!!record?.allowReregister === true ? (
            <span
              className="tableRowTextUl"
              onClick={() =>
                checkIsDraft() === false
                  ? dispatch(
                      postDashboardTransferOfCase(
                        `${config.reRegistrationFir}?crimeId=${record?.crimeId}&psCode=${userData?.cctns_unit_id}&psName=${userData?.unit_name}`,
                        {}
                      )
                    )
                  : openNotificationWithIcon(
                      "error",
                      "Please continue with Draft FIR or delete Draft FIR to reRegister New FIR."
                    )
              }
            >
              <strong className="tableRowTextUl">
                <u>RE-REGISTER-FIR</u>
              </strong>
            </span>
          ) : (
            <span className="tableRowTextUl">
              <strong className="tableRowTextUl">
                <u>REGISTERED</u>
              </strong>
            </span>
          )}
        </>
      ),
    },
  ];

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const displayReportGenerations = (data) => {
    return transferOfCaseTemplates.map((item, i) => {
      const { label, fileName } = item;

      return data === fileName ? (
        <>
          <Row className="row-item" key={i}>
            <a style={{ marginTop: 5 }}>
              <FilePdfOutlined />
              <span
                className="tableRowTextUl"
                onClick={() =>
                  showModal(label, fileName, item.templateAvailable)
                }
              >
                <u>{label}</u>
              </span>
            </a>
            <Form.Item
              name="left_upload"
              style={{ width: "30%", marginLeft: 10 }}
            >
              <Upload
                customRequest={dummyRequest}
                onPreview={handleDownload}
                onChange={(options) =>
                  handleMediaChange(options, label, fileName)
                }
              >
                <Button
                  className="saveButton"
                  icon={<CameraFilled />}
                  style={{ backgroundColor: "#0049a0", color: "#ffffff" }}
                >
                  Upload
                </Button>
              </Upload>
            </Form.Item>
          </Row>
        </>
      ) : null;
    });
  };

  const getFirData = (data, crimeId) => {
    axios
      .get(`${config.getMiniInvestigation}?crimeId=${crimeId}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          apikey: `${API_KEY}`,
        },
      })
      .then((data) => {
        setSelectedFirData(data?.data?.data);
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const handleClick = (data, newCrimeId) => {
    getFirData(data, !!newCrimeId === true ? newCrimeId : data?.crimeId);
    setIsModalOpen(true);
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

          setUploadingData([payload]);
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

  const fetchDataDetails = () => {
    if (IS_SHO_USER) {
      dispatch(
        fetchDashboardDetails(
          `${config.getCaseMetricsByEMail}/?psCode=${activeUser?.cctns_unit_id}`
        )
      );
    } else if (IS_HIGHER_SHO_USER) {
      dispatch(
        fetchDashboardDetails(
          `${config.getCaseMetricsByEMail}/?userName=${activeUser?.pao_code}`
        )
      );
    } else {
      dispatch(
        fetchDashboardDetails(
          `${config.getCaseMetricsByEMail}/?psCode=${activeUser?.cctns_unit_id}&userName=${activeUser?.pao_code}`
        )
      );
    }
  };

  useEffect(() => {
    fetchDataDetails();
  }, [dispatch]);

  const selectData = (data) => {
    if (data === "All") {
      setTransferCasesData(DashboardTransferCases);
    } else if (data === "Pending") {
      const filterData = DashboardTransferCases?.filter(
        (item) => item?.isPending === true
      );
      setTransferCasesData(filterData);
    } else {
      const filterData = DashboardTransferCases?.filter(
        (item) => item?.isApproved === true
      );
      setTransferCasesData(filterData);
    }
  };

  const handleDownload = (file) => {
    getFileById(file?.fileId, file?.name, file?.url);
  };

  return (
    <>
      <Modal
        title="Mini investigation Reports"
        visible={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={1000}
      >
        <ManiInVestigation selectedFirData={selectedFirData} />
      </Modal>

      <Modal
        title="Transfer Of Case Remarks"
        visible={open}
        onCancel={handleModalCancel}
        footer={[
          <Button key="back" onClick={handleModalCancel}>
            Cancel
          </Button>,
          <Button
            key="submit"
            style={{ backgroundColor: "#0049a0", color: "#ffffff" }}
            onClick={() => handleModalOk(submitData)}
          >
            Submit
          </Button>,
        ]}
      >
        <>
          <Row>
            <Col style={{ marginBottom: 10 }}>
              <Form.Item label={"Add Remarks"}>
                <TextArea
                  style={{ width: 500, height: 200, resize: "none" }}
                  rows={100}
                  columns={10}
                  value={addRemarks}
                  onChange={(data) => setAddRemarks(data?.target?.value)}
                />
              </Form.Item>
            </Col>
          </Row>
          {!!submitData?.allowUpload
            ? displayReportGenerations(submitData?.uploadFileName)
            : null}
        </>
      </Modal>
      <Modal
        title={
          <Row gutter={24}>
            <Col span={12} style={{ color: "#022A49" }}>
              Transfer Details
            </Col>
          </Row>
        }
        visible={isPermissionModalVisible}
        onOk={() => {
          setIsPermissionModalVisible(false);
          setSelectedPermissionRecord([]);
          setSubmitData({});
        }}
        onCancel={() => {
          setIsPermissionModalVisible(false);
          setSelectedPermissionRecord([]);
          setSubmitData({});
        }}
        footer={[
          <Button
            key="back"
            onClick={() => {
              setIsPermissionModalVisible(false);
              setSelectedPermissionRecord([]);
              setSubmitData({});
            }}
          >
            Close
          </Button>,
        ]}
        width={1500}
      >
        <CaseTrasferContainer>
          <div>
            <Row style={{ marginBottom: 10 }}>
              <Col span={5}>
                <Row>
                  <label style={{ color: "#707070", fontSize: 13 }}>
                    FIR Number
                  </label>
                </Row>
                <Row>
                  <strong style={{ fontSize: 18 }}>
                    {!!submitData?.firNum ? submitData?.firNum : ""}
                  </strong>
                </Row>
              </Col>
              <Col span={5}>
                <Row>
                  <label style={{ color: "#707070", fontSize: 13 }}>
                    Section of Law
                  </label>
                </Row>
                <Row>
                  <strong style={{ fontSize: 18 }}>
                    {!!submitData?.actsAndSections
                      ? submitData?.actsAndSections
                      : ""}
                  </strong>
                </Row>
              </Col>
              <Col span={5}>
                <Row>
                  <label style={{ color: "#707070", fontSize: 13 }}>
                    Unit Name
                  </label>
                </Row>
                <Row>
                  <strong style={{ fontSize: 18 }}>
                    {!!submitData?.unitName ? submitData?.unitName : ""}
                  </strong>
                </Row>
              </Col>
              <Col span={5}>
                <Row>
                  <label style={{ color: "#707070", fontSize: 13 }}>
                    Status
                  </label>
                </Row>
                <Row>
                  <strong style={{ fontSize: 18 }}>
                    {!!submitData?.caseStatus ? submitData?.caseStatus : ""}
                  </strong>
                </Row>
              </Col>
              <Col span={4}>
                <Row>
                  <label style={{ color: "#707070", fontSize: 13 }}>
                    PS Name
                  </label>
                </Row>
                <Row>
                  <strong style={{ fontSize: 18 }}>
                    {!!submitData?.psName ? submitData?.psName : ""}
                  </strong>
                </Row>
              </Col>
            </Row>
            <Row style={{ marginBottom: 10 }}>
              <Col span={5}>
                <Row>
                  <label style={{ color: "#707070", fontSize: 13 }}>
                    Date of Report
                  </label>
                </Row>
                <Row>
                  <strong style={{ fontSize: 18 }}>
                    {submitData?.dateOfReport}
                  </strong>
                </Row>
              </Col>
              <Col span={5}>
                <Row>
                  <label style={{ color: "#707070", fontSize: 13 }}>
                    Date of Offence
                  </label>
                </Row>
                <Row>
                  <strong style={{ fontSize: 18 }}>
                    {submitData?.dateOfOffence}
                  </strong>
                </Row>
              </Col>
              <Col span={5}>
                <Row>
                  <label style={{ color: "#707070", fontSize: 13 }}>
                    Crime Classification
                  </label>
                </Row>
                <Row>
                  <strong style={{ fontSize: 18 }}>
                    {submitData?.crimeClassification}
                  </strong>
                </Row>
              </Col>
              <Col span={5}>
                <Row>
                  <label style={{ color: "#707070", fontSize: 13 }}>
                    Major Head
                  </label>
                </Row>
                <Row>
                  <strong style={{ fontSize: 18 }}>
                    {submitData?.majorHead}
                  </strong>
                </Row>
              </Col>
              <Col span={4}>
                <Row>
                  <label style={{ color: "#707070", fontSize: 13 }}>
                    Minor Head
                  </label>
                </Row>
                <Row>
                  <strong style={{ fontSize: 18 }}>
                    {submitData?.minorHead}
                  </strong>
                </Row>
              </Col>
            </Row>
          </div>
          <Table
            scroll={{ x: 400 }}
            dataSource={selectedPermissionRecord}
            columns={permissionColumns}
            style={{ bordeRadius: 5 }}
            showSorterTooltip={false}
            pagination={false}
          />
        </CaseTrasferContainer>
      </Modal>

      {isDocumentModalVisible ? (
        <Modal
          title={
            <Row gutter={24}>
              <Col span={12} style={{ color: "#022A49" }}>
                Uploaded Notice
              </Col>
            </Row>
          }
          visible={isDocumentModalVisible}
          onOk={() => {
            setIsDocumentModalVisible(false);
            setSelectedRecord([]);
          }}
          onCancel={() => {
            setIsDocumentModalVisible(false);
            setSelectedRecord([]);
          }}
          footer={[
            <Button
              key="back"
              onClick={() => {
                setIsDocumentModalVisible(false);
                setSelectedRecord([]);
                setSubmitData({});
              }}
            >
              Close
            </Button>,
          ]}
          width={700}
        >
          <Table
            scroll={{ x: 400 }}
            dataSource={selectedRecord}
            columns={docColumns}
            style={{ bordeRadius: 5 }}
            showSorterTooltip={false}
            pagination={false}
          />
        </Modal>
      ) : null}
      <CaseTrasferContainer>
        <div
          style={{
            width: "100%",
            marginBottom: 30,
            display: "inline-block",
            justifyContent: "space-between",
          }}
        >
          <Form form={form} layout="vertical">
            <div style={{ width: "50%", display: "inline-flex" }}>
              <p style={{ fontSize: 20, marginRight: 10 }}>Case Transfer</p>
              <Form.Item name="zeroFirField">
                <Radio.Group name="radiogroup" onChange={handleChange}>
                  <Radio value="transferredFir">TRANSFERRED FIR'S</Radio>
                  <Radio value="receivedFir">RECEIVED FIR'S</Radio>
                </Radio.Group>
              </Form.Item>
            </div>
            <div
              style={{
                width: "50%",
                display: "inline-flex",
                justifyContent: "right",
              }}
            >
              {selectedCaseTransFerType === "transferredFir" && (
                <div style={{ display: "inline-flex" }}>
                  <Select
                    style={{ width: 250, marginRight: 100 }}
                    onSelect={selectData}
                    options={options}
                    placeholder={"Select"}
                  />
                  <div
                    style={{
                      height: 17,
                      width: 35,
                      borderRadius: 5,
                      backgroundColor: "#ffcb2e",
                      margin: "8px 5px 0px 5px",
                    }}
                    onClick={() => selectData("Pending")}
                  />
                  <span
                    onClick={() => selectData("Pending")}
                    style={{ margin: "5px 5px 0px 5px" }}
                  >
                    Pending
                  </span>
                  <div
                    style={{
                      height: 17,
                      width: 35,
                      borderRadius: 5,
                      backgroundColor: "#87ff8f",
                      margin: "10px 5px 0px 5px",
                    }}
                    onClick={() => selectData("Approved")}
                  />
                  <span
                    onClick={() => selectData("Approved")}
                    style={{ margin: "5px 5px 0px 5px" }}
                  >
                    Approved
                  </span>
                </div>
              )}
            </div>
          </Form>
        </div>
        {isFetching ? (
          <Loader />
        ) : (
          <Table
            columns={
              selectedCaseTransFerType === "transferredFir" ? columns_ : columns
            }
            dataSource={
              selectedCaseTransFerType === "transferredFir"
                ? transferCasesData
                : receiveCasesData
            }
          />
        )}
      </CaseTrasferContainer>
    </>
  );
}
