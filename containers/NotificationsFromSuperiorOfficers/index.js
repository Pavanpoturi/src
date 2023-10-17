import { useEffect, useState, useCallback, useMemo } from "react";
import Loader from "@components/utility/loader";
import { CameraFilled, FilePdfOutlined } from "@ant-design/icons";
import reGeneratedFirActions from "@redux/reGeneratedFir/actions";
import StepsIndicator from "@components/Common/StepsIndicator";
import {
  Form,
  Row,
  Col,
  Table,
  Modal,
  Button,
  notification,
  Select,
  Upload,
  Input,
  Popover,
} from "antd";
import { useSelector, useDispatch } from "react-redux";
import { config, API_KEY } from "@config/site.config";
import moment from "moment";
import { isEmpty, first, last, isUndefined, isNull, isArray } from "lodash";
import { getActsAndSectionsDetails } from "@containers/const";
import {
  actDatalocal,
  showPSName,
  DATE_TIME_FORMAT,
  IS_IO,
  IS_DSP,
  IS_CI,
  IS_SP,
  IS_SHO,
  IS_DGP,
  IS_INVESTIGATION_OFFICER,
} from "@containers/FirDetails/fir-util";
import { Link } from "react-router-dom";
import appActions from "@redux/app/actions";
import axios from "axios";
import { loadState } from "@lib/helpers/localStorage";
import firActions from "@redux/fir/actions";
import casePropertyManagementActions from "@redux/investigations/casePropertyManagement/actions";
import masterDataActions from "@redux/masterData/actions";
import { CaretDownOutlined } from "@ant-design/icons";
import { getFileById } from "@containers/media-util";
import ContentHeader from "./ContentHeader";
import createFIRActions from "@redux/createFir/actions";
import { dummyRequest } from "@containers/FirDetails/fir-util";
import {
  transferOfCaseTemplates,
  getHTMLFromTemplate1,
} from "@containers/CaseTransfer/utils";
import {
  uploadLetter,
  getDataForDocument,
  getHTMLFromTemplate,
  actionList,
  tableConfig,
  transferOfCaseActionList,
  transferOfCaseInitietedActionList,
} from "./const";
import UploadLetters from "./uploadLetters";
import TemplatesModal from "../FirDetails/Investigation/CommonForms/TemplatesModal";
import { AINotificationContainer } from "./Styles";
import { notificationTableConfig } from "./tableConfig";
import ManiInVestigation from "@components/Common/miniinvestigation";
import form54Action from "@redux/investigations/form54/actions";
import { object } from "prop-types";
import SimpleFilter from "@containers/HigherOfficerModule/SharedComponents/SimpleFilter";

const Option = Select.Option;

export default function NotificationsFromSuperiorOfficers(props) {
  const [form] = Form.useForm();
  const crimeId = loadState("selectedFirId");
  const { fetchDashboardTransferOfCase } = reGeneratedFirActions;
  const dispatch = useDispatch();
  const { getFIRData } = createFIRActions;
  const { savedFir } = useSelector((state) => state.createFIR);
  const { currentUser } = useSelector((state) => state.Auth);
  const storedUser = loadState("currentUser");
  const { TextArea } = Input;
  const { hideSideMenu } = appActions;
  const { resetAccidentInformationReport } = form54Action;
  const [submitData, setSubmitData] = useState({});
  const [transferCasesData, setTransferCasesData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSubmitModalVisible, setIsSubmitModalVisible] = useState(false);
  const [selectedAction, setSelectedAction] = useState("");
  const [serchText, setSerchText] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [selectedFIR, setSelectedFIR] = useState(null);
  const [isTemplateModalVisible, setTemplateIsModalVisible] = useState(false);
  const { postDashboardTransferOfCase } = reGeneratedFirActions;
  const [caseType, setCaseType] = useState("");
  const [selectedTemplateName, setSelectedTemplateName] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");
  const [uploadedLeterFromACP, setUploadedLetterFromACP] = useState([]);
  const [ackHistory, setAckHistory] = useState([]);
  const [paginationData, setPaginationData] = useState({
    page: 1,
    pageSize: 10,
  });
  const TransferCasesDashboard = useSelector((state) => state.ReGeneratedFIR);
  const activeUser = currentUser.employee_name ? currentUser : storedUser;
  const userRole = [IS_SHO, IS_IO, IS_INVESTIGATION_OFFICER];
  const IS_HIGHER_SHO_USER = !userRole?.includes(activeUser?.ecopsv2_role);
  const IS_SHO_USER = currentUser.emp_role_name === IS_SHO;

  const { actList } = useSelector((state) => state.MasterData);
  const { getActList } = masterDataActions;
  const { fetchApprovalFIRList } = firActions;
  const { approvalFIRList, isFetching, updatedPsCode, dropDownData } =
    useSelector((state) => state.FIR);
  const [uploadingData, setUploadingData] = useState([]);
  const { actionType, errorMessage, successMessage, isUpdating } = useSelector(
    (state) => state.casePropertyManagement
  );
  const getpsCode = dropDownData.map((data) => data?.ps_code).join(",");
  const ps_code = !isUndefined(updatedPsCode) ? updatedPsCode : getpsCode;
  const [isPermissionModalVisible, setIsPermissionModalVisible] =
    useState(false);
  const [selectedPermissionRecord, setSelectedPermissionRecord] = useState([]);
  const { actionAckFSL, resetActionType } = casePropertyManagementActions;
  const [addRemarks, setAddRemarks] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFirData, setSelectedFirData] = useState({});
  const openNotificationWithIcon = (type, message) => {
    return notification[type]({
      message: message,
    });
  };
  const allHierarchyLevels = ![
    "INVESTIGATION OFFICER",
    "STATION HOUSE OFFICER (SHO)",
    "STATION HOUSE OFFICER (SHO)",
    "CIRCLE INSPECTOR",
    "SDPO/ACP",
  ].includes(activeUser.ecopsv2_role);
  const allTransferHierarchyLevels = [
    "ADCP",
    "ADDL.DCP-CRIMES",
    "ADG",
    "ADGP",
    "DG-CID",
    "DGP HOPF",
    "DGP-HOPF",
    "DGP",
    "DIG Zone",
    "DIG-ZONE",
    "DIG",
    "DISTRICT COMMISSIONERATE",
    "DISTRICT",
    "DY.SUPERINTENDENT OF POLICE COE",
    "IGP Multi Zone - I",
    "IGP Multi Zone - II",
    "IGP-MULTI ZONE",
    "IGPNZ",
    "IGPWZ",
    "MULTI ZONE",
    "RANGE",
    "ZONE",
  ].includes(activeUser.ecopsv2_role);
  const getTags = (data, cursor) => {
    return (
      <div
        className="tableRowText"
        style={{
          backgroundColor: `${
            data?.transferTo?.toLowerCase() ===
            "Other Police Station"?.toLowerCase()
              ? data?.status?.split(" ").includes("Pending")
                ? "#ffcb2e"
                : data?.status?.split(" ").includes("Returned")
                ? "#FF0000"
                : data?.status?.split("").includes("Overdue")
                ? "#ff7a7e"
                : "#87ff8f"
              : "#c2e5ff"
          }`,
          borderRadius: 5,
          padding: 5,
          textAlign: "center",
          fontSize: "small",
          cursor: cursor,
          fontWeight: "normal",
        }}
      >
        <span>{data?.status.toUpperCase()}</span>
        {/* <CaretDownOutlined
          style={{
            float: "right",
            marginTop: 5,
          }}
        /> */}
      </div>
    );
  };

  useEffect(() => {
    let transferData = [];
    let receivedData = [];
    if (isArray(TransferCasesDashboard?.DashboardTransferCases)) {
      transferData = JSON.parse(
        JSON.stringify(TransferCasesDashboard?.DashboardTransferCases)
      ).map((data) => Object.assign(data, { isTransFer: true }));
    }
    if (isArray(TransferCasesDashboard?.DashboardReceiveCases)) {
      receivedData = JSON.parse(
        JSON.stringify(TransferCasesDashboard?.DashboardReceiveCases)
      ).map((data) => Object.assign(data, { isTransFer: true }));
    }
    if (!!transferData === false) {
      transferData = [];
    }
    if (!!receivedData === false) {
      receivedData = [];
    }
    transferData = [...transferData, ...receivedData];
    setTransferCasesData([]);
    setTransferCasesData(!!transferData ? transferData : []);
  }, [TransferCasesDashboard?.DashboardTransferCases]);
  const getFirData = (data, newCrimeId) => {
    if (!!newCrimeId) {
      axios
        .get(`${config.getMiniInvestigation}?crimeId=${newCrimeId}`, {
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
    } else {
      if (!!data?.crimeId) {
        dispatch(getFIRData(`${config.getFIR}?crimeId=${data?.crimeId}`));
      } else {
        dispatch(getFIRData(`${config.getFIR}?crimeId=${data?._id}`));
      }
    }
  };
  const tableConfigData = tableConfig.find((c) => c.type === caseType)?.data;
  const permissionColumns = [
    {
      title: <div style={{ width: 100 }}>Sl No</div>,
      render: (_, data, i) => <p>{i + 1}</p>,
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

  const isSuccess =
    actionType === "APPROVE_ACK_SUCCESS" ||
    TransferCasesDashboard?.actionType ===
      "DASHBOARD_TRANSFER_OF_CASE_POST_SUCCESS";
  const isError =
    actionType === "APPROVE_ACK_ERROR" ||
    TransferCasesDashboard?.actionType ===
      "DASHBOARD_TRANSFER_OF_CASE_POST_ERROR";
  const fetchApprovalFIRs = () => {
    if (IS_SHO_USER) {
      dispatch(
        fetchApprovalFIRList(
          `${config.getApprovalFIRList}/?psCode=${activeUser?.cctns_unit_id}&emp_role_name=${activeUser?.emp_role_name}&userName=${activeUser?.pao_code}&rank=${activeUser?.rank_name}`
        )
      );
    } else if (props.ISHIGHERSHOUSER) {
      dispatch(
        fetchApprovalFIRList(
          `${config.getApprovalFIRList}/?psCode=${activeUser?.cctns_unit_id}&emp_role_name=${activeUser?.emp_role_name}&userName=${activeUser?.pao_code}&rank=${activeUser?.rank_name}&higherOfficer=true`
        )
      );
    }
  };

  const handleDownload = (file) => {
    getFileById(file?.fileId, file?.name, file?.url);
  };

  const handleMediaChange = (options, label, fileName) => {
    if (options?.file?.percent === 100) {
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
            setUploadingData([]);
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
    }
  };

  const onFilterChange = useCallback((paramsString) => {
    dispatch(
      fetchApprovalFIRList(`${config.getApprovalFIRList}/?${paramsString}`)
    );
    const paramsObj = Object.fromEntries(new URLSearchParams(paramsString));
    dispatch(
      fetchDashboardTransferOfCase(
        `${config?.getDashboardTransferOfCase}`,
        paramsObj
      )
    );
  }, []);

  const baseUrl = useMemo(() => {
    const paramsObj = {
      psCode: activeUser?.cctns_unit_id,
      emp_role_name: activeUser?.emp_role_name,
      userName: activeUser?.pao_code,
      rank: activeUser?.rank_name,
      pao_code: activeUser?.pao_code,
      ecopsv2_role: activeUser?.ecopsv2_role,
      ecopsv2_hierarchy_key: activeUser?.ecopsv2_hierarchy_key,
      ecopsv2_unit_id: activeUser?.ecopsv2_unit_id?.toString(),
      ecopsv2_hierarchy_role: activeUser?.ecopsv2_hierarchy_role,
    };
    if (props.ISHIGHERSHOUSER) paramsObj.higherOfficer = true;
    return paramsObj;
  }, [props.ISHIGHERSHOUSER, activeUser]);

  const displayReportGenerations = (data) => {
    return transferOfCaseTemplates.map((item, i) => {
      const { label, fileName } = item;
      var mediaData = [];

      return data === fileName ? (
        <>
          <Row className="row-item" key={i}>
            <a style={{ marginTop: 5 }}>
              <FilePdfOutlined />
              <span
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
  const getDataDetails = () => {
    !isUndefined(approvalFIRList) &&
      !isEmpty(approvalFIRList) &&
      approvalFIRList.map((item, _i) => {
        const caseProperties =
          !isEmpty(item?.caseproperties) && first(item?.caseproperties);
        const approvalAck = caseProperties?.sendToFSL?.approvalAck;
        const filteresResult =
          !isEmpty(approvalAck) &&
          first(
            approvalAck.filter(
              (item) => item.approvedByRank === activeUser?.rank_name
            )
          );
        const selectedAck = !isEmpty(approvalAck) && first(approvalAck);
        let actionName = "";
        if (!isUndefined(filteresResult)) {
          actionName = filteresResult?.action;
        } else {
          actionName = "";
        }
        const resultData = {
          crimeId: caseProperties?.crimeId,
          casePropertyId: caseProperties?._id,
          [`${caseProperties?._id}_action`]: actionName,
          disableFields: isUndefined(filteresResult) ? false : true,
          showSubmitButton:
            (actionList.includes(filteresResult?.action) &&
              selectedAck?.action !== "") ||
            selectedAction !== ""
              ? true
              : false,
        };
        setAckHistory((prev) => [...prev, resultData]);
        if (actionList.includes(actionName)) {
          form.setFieldsValue({
            [`${caseProperties?._id}_action`]: actionName,
          });
        } else {
          form.setFieldsValue({
            [`${caseProperties?._id}_action`]: "",
          });
        }
      });
  };

  const getDropdownDataTransferOfCaseActionList = (approvalsObj) => {
    const finalActionList =
      Object.keys(approvalsObj)[0] === storedUser?.ecopsv2_hierarchy_role
        ? transferOfCaseInitietedActionList
        : transferOfCaseActionList;
    return finalActionList;
  };

  useEffect(() => {
    if (isSuccess || isError) {
      if (
        isSuccess &&
        (!!errorMessage === false ||
          TransferCasesDashboard?.errorMessage === false)
      ) {
        if (selectedAction === "Forwarded") {
          openNotificationWithIcon(
            "success",
            !!successMessage ? successMessage : "Case Transferred SuccessFully"
          );
        } else if (selectedAction === "Returned with Remarks") {
          openNotificationWithIcon(
            "success",
            !!successMessage ? successMessage : "Case Returned SuccessFully"
          );
        }
        setIsSubmitModalVisible(false);
        setSelectedFIR(null);
        form.resetFields();
        fetchApprovalFIRs();
        setSubmitData({});
        setAddRemarks("");
        setUploadingData([]);
        dispatch(resetActionType());
        const body = {
          pao_code: activeUser?.pao_code,
          ecopsv2_role: activeUser?.ecopsv2_role,
          ecopsv2_hierarchy_key: activeUser?.ecopsv2_hierarchy_key,
          ecopsv2_unit_id: activeUser?.ecopsv2_unit_id?.toString(),
          ecopsv2_hierarchy_role: activeUser?.ecopsv2_hierarchy_role,
        };
        dispatch(
          fetchDashboardTransferOfCase(
            `${config?.getDashboardTransferOfCase}`,
            body
          )
        );
      } else {
        openNotificationWithIcon(
          "error",
          !!errorMessage ? errorMessage : TransferCasesDashboard?.errorMessage
        );
        dispatch(resetActionType());
      }
    }
  }, [actionType, isSuccess, isError]);

  const handleSearch = (text) => {
    setSerchText(text);
  };

  useEffect(() => {
    dispatch(getActList(`${config.getMasterData}/ACT`));
    fetchApprovalFIRs();
    const body = {
      pao_code: activeUser?.pao_code,
      ecopsv2_role: activeUser?.ecopsv2_role,
      ecopsv2_hierarchy_key: activeUser?.ecopsv2_hierarchy_key,
      ecopsv2_unit_id: activeUser?.ecopsv2_unit_id?.toString(),
      ecopsv2_hierarchy_role: activeUser?.ecopsv2_hierarchy_role,
    };
    dispatch(
      fetchDashboardTransferOfCase(
        `${config?.getDashboardTransferOfCase}`,
        body
      )
    );
  }, []);

  useEffect(() => {
    getDataDetails();
  }, [approvalFIRList]);

  useEffect(() => {
    localStorage.setItem("selectedFir", JSON.stringify(savedFir?.firDetail));
    setSelectedFIR(savedFir);
  }, [savedFir]);

  const columns = [];

  const onActionSubmit = async (item) => {
    if (!!item?.isTransFer === false) {
      const values = await form.validateFields();
      const selectedRecordData =
        !!selectedFIR?.caseproperties === false &&
        !isArray(selectedFIR?.caseproperties)
          ? item
          : selectedFIR;
      selectedRecordData?.caseproperties.forEach((caseProperty) => {
        const approvalAck = caseProperty?.sendToFSL?.approvalAck;
        const approvalAckResult = !isEmpty(approvalAck) && last(approvalAck);
        const payLoad = {
          crimeId: caseProperty?.crimeId,
          casePropertyId: caseProperty?._id,
          ackId: approvalAckResult?._id,
          action:
            values[`${first(selectedRecordData?.caseproperties)?._id}_action`],
          requisitionLetter: uploadedLeterFromACP,
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
        dispatch(actionAckFSL(config.actionAckFSL, payLoad));
      });
    } else {
      if (!!item?.allowUpload === true && uploadingData?.length === 0) {
        openNotificationWithIcon("error", "Please Upload Template");
      } else if (
        (selectedAction === "Returned with Remarks" && isEmpty(addRemarks)) ||
        (selectedAction === "Returned with Remarks" && isUndefined(addRemarks))
      ) {
        openNotificationWithIcon("error", "Please Enter Remarks");
      } else {
        var obj = {
          workflowId: item?.workflowId,
          taskId: item?.taskId,
          action: selectedAction,
          media: uploadingData,
          remarks: !!addRemarks ? addRemarks : "",
          approvedBy: activeUser?.pao_code,
          approvedByName: activeUser?.employee_name,
          approvedByRole: activeUser?.ecopsv2_role,
          approvedByRank: activeUser?.rank_name,
          approvedByPhone: activeUser?.mobile_no,
          approvedByUnitId: activeUser?.ecopsv2_unit_id,
          approvedByHKey: activeUser?.ecopsv2_hierarchy_key,
          approvedByHRole: activeUser?.ecopsv2_hierarchy_role,
          approvedByEmail: "",
          isDefaultApproval:
            Object.keys(item?.approvals)[0] ===
            storedUser?.ecopsv2_hierarchy_role
              ? true
              : false,
        };
        dispatch(postDashboardTransferOfCase(config.approvalAction, obj));
      }
    }
  };
  const handleClick = (data, newCrimeId) => {
    getFirData(data, !!newCrimeId === true ? newCrimeId : data?.crimeId);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  notificationTableConfig &&
    notificationTableConfig.map((headTitle, _index) => {
      switch (headTitle) {
        case "S.No":
          columns.push({
            title: "S.No",
            rowKey: "S.NO",
            render: (_data, _row, index) =>
              (paginationData.page - 1) * paginationData.pageSize + index + 1,
          });
          break;
        case "psName":
          columns.push({
            title: "Police Station",
            dataIndex: "psName",
            rowKey: "psName",
            render: (_i, item) => {
              const psName = !!item?.firDetail?.psName
                ? item?.firDetail?.psName
                : item?.psName;
              return (
                <span className="tableRowText">{showPSName(psName) || ""}</span>
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
              return props.ISHIGHERSHOUSER === true ? (
                <>
                  <Link
                    to={{
                      pathname: `Fir/${
                        !!item?.crimeId === false ? item._id : item?.crimeId
                      }`,
                    }}
                    onClick={() => {
                      getFirData(item);

                      localStorage.setItem(
                        "selectedActDetails",
                        JSON.stringify(
                          actDatalocal(savedFir?.firDetail, actList)
                        )
                      );
                      // localStorage.setItem(
                      //   "selectedFir",
                      //   JSON.stringify(savedFir.firDetail)
                      // );
                      {
                        !!item?.crimeId === false
                          ? localStorage.setItem(
                              "selectedFirId",
                              JSON.stringify(item._id)
                            )
                          : localStorage.setItem(
                              "selectedFirId",
                              JSON.stringify(item.crimeId)
                            );
                      }
                      if (item?.isCourtDisposal) {
                        localStorage.setItem(
                          "iscourtAndProsecutionVisible",
                          true
                        );
                      } else {
                        localStorage.setItem(
                          "iscourtAndProsecutionVisible",
                          false
                        );
                      }
                      dispatch(hideSideMenu());
                      dispatch(resetAccidentInformationReport());
                    }}
                  >
                    {!!item?.firDetail?.firNum ? (
                      <span className="tableRowTextUl">
                        {item?.firDetail?.firNum}
                      </span>
                    ) : (
                      <span className="tableRowTextUl">{item?.firNum}</span>
                    )}
                  </Link>
                </>
              ) : (
                <span className="tableRowText">
                  {!!item?.firDetail?.firNum ? (
                    item?.firDetail?.firNum
                  ) : (
                    <span
                      className="tableRowTextUl"
                      onClick={() => handleClick(item)}
                      style={{ cursor: "pointer" }}
                    >
                      {item?.firNum}
                    </span>
                  )}
                </span>
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
              return !!item?.firDetail?.actsAndSections
                ? getActsAndSectionsDetails(actsAndSections, actList)
                : item?.actsAndSections;
            },
          });
          break;
        case "dateOfInitiation":
          columns.push({
            title: "Date of Initiation",
            dataIndex: "dateOfInitiation",
            rowKey: "dateOfInitiation",
            render: (_i, item) => {
              const caseProperties =
                !isEmpty(item?.caseproperties) && last(item?.caseproperties);
              return (
                <div className="tableRowText">
                  {!!caseProperties?.sendDate
                    ? !!caseProperties?.sendDate
                      ? moment(caseProperties?.sendDate).format(
                          DATE_TIME_FORMAT
                        )
                      : ""
                    : !!item?.dateOfTransfer
                    ? item?.dateOfTransfer
                    : ""}
                </div>
              );
            },
          });
          break;
        case "natureOfAcknowledgementPermission":
          columns.push({
            title: (
              <div style={{ width: 150 }}>
                Name of Acknowledgement / Permission
              </div>
            ),
            dataIndex: "natureOfAcknowledgementPermission",
            rowKey: "natureOfAcknowledgementPermission",
            render: (_i, item) => (
              <span className="tableRowText">
                {item?.isTransFer === true ? (
                  <span
                    className="tableRowTextUl"
                    onClick={() => {
                      setIsPermissionModalVisible(true);
                      setSelectedPermissionRecord(item?.history);
                      const majorHead = item?.majorMinorClassification
                        ?.map((item) => item.majorHead)
                        .join(", ");
                      const minorHead = item?.majorMinorClassification
                        .map((item) => item.minorHead)
                        .join(", ");
                      Object.assign(item, {
                        minorHead: minorHead,
                        majorHead: majorHead,
                      });
                      setSubmitData(item);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    Transfer Of Case
                  </span>
                ) : (
                  "FSL"
                )}
              </span>
            ),
          });
          break;
        case "document":
          columns.push({
            title: "Document",
            dataIndex: "document",
            rowKey: "document",
            render: (_i, item) => (
              <span
                className="tableRowTextUl"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  if (!!item?.isTransFer === false) {
                    const caseProperties =
                      !isEmpty(item?.caseproperties) &&
                      first(item?.caseproperties);
                    setIsModalVisible(true);
                    const result = {
                      casePropertiesList: item?.caseproperties,
                      casePropertyDoc: caseProperties,
                    };
                    setSelectedRecord([result]);
                    setCaseType("fsl");
                  } else {
                    setIsModalVisible(true);
                    setSubmitData(item);
                    setCaseType("transFerofcase");
                    setSelectedRecord(
                      !!item?.notice && Object.keys(item?.notice)?.length !== 0
                        ? Array.isArray(item?.notice)
                          ? item?.notice
                          : [item?.notice]
                        : []
                    );
                  }
                }}
              >
                VIEW NOTICE
              </span>
            ),
          });
          break;
        case "actions":
          columns.push({
            title: "Actions",
            dataIndex: "actions",
            rowKey: "actions",
            render: (_i, item) => {
              if (!!item?.isTransFer === false) {
                var caseProperties =
                  !isEmpty(item?.caseproperties) && first(item?.caseproperties);
                var filterRecord =
                  (!isEmpty(ackHistory) &&
                    first(
                      ackHistory.filter(
                        (s) => s?.casePropertyId === caseProperties?._id
                      )
                    )) ||
                  IS_HIGHER_SHO_USER === false;
              }
              return (
                <Row gutter={24}>
                  <Col>
                    <Form.Item
                      name={
                        !!item?.isTransFer === false
                          ? `${caseProperties?._id}_action`
                          : null
                      }
                      label=""
                    >
                      <Select
                        suffixIcon={
                          <CaretDownOutlined className="dropDownIcon" />
                        }
                        showSearch
                        allowClear
                        onSearch={handleSearch}
                        filterOption={(input, option) =>
                          serchText &&
                          option.props.label
                            .toString()
                            .toLowerCase()
                            .indexOf(input.toString().toLowerCase()) >= 0
                        }
                        style={{ width: 140 }}
                        disabled={
                          !!item?.isTransFer === false
                            ? filterRecord?.disableFields || allHierarchyLevels
                            : !item?.allowAction || allTransferHierarchyLevels
                        }
                        onSelect={(data) => {
                          if (!!item?.isTransFer === false) {
                            filterRecord.showSubmitButton = true;
                            setSelectedAction(data);
                          } else {
                            setSelectedAction(data);
                            const trasferData = [...transferCasesData];
                            const idx = trasferData?.findIndex(
                              (data) => data.crimeId === item?.crimeId
                            );
                            if (idx !== -1) {
                              Object.assign(item, { showSubmitButton: true });
                              trasferData.splice(idx, 1, item);
                              setTransferCasesData(trasferData);
                            }
                          }
                        }}
                      >
                        {!!item?.isTransFer === false ? (
                          <>
                            {actionList.map((item, index) => (
                              <Option key={index} value={item} label={item}>
                                {item}
                              </Option>
                            ))}
                          </>
                        ) : (
                          <>
                            {!isNull(item?.approvals) &&
                            !isUndefined(item?.approvals)
                              ? getDropdownDataTransferOfCaseActionList(
                                  item?.approvals
                                ).map((item, index) => (
                                  <Option key={index} value={item} label={item}>
                                    {item}
                                  </Option>
                                ))
                              : null}
                          </>
                        )}
                      </Select>
                    </Form.Item>
                  </Col>
                  {(!!filterRecord && !!filterRecord?.showSubmitButton) ||
                  (item?.isTransFer &&
                    (!item?.allowAction ||
                      (!!selectedAction && item?.showSubmitButton))) ? (
                    <Col
                      className="tableRowTextUl"
                      style={{ cursor: "pointer", paddingLeft: 5 }}
                    >
                      <Form.Item>
                        <Button
                          type="dashed"
                          style={{ fontSize: 12 }}
                          disabled={
                            !!item?.isTransFer === false
                              ? filterRecord?.disableFields ||
                                allHierarchyLevels
                              : !item?.allowAction || allTransferHierarchyLevels
                          }
                          onClick={() => {
                            if (!!item?.isTransFer === false) {
                              filterRecord.disableFields = true;
                            }
                            if (
                              (!!item?.isTransFer === false &&
                                activeUser?.emp_role_name === IS_DSP) ||
                              (!!item?.isTransFer === true &&
                                item?.allowUpload === true)
                            ) {
                              if (!!item?.isTransFer === false) {
                                setIsSubmitModalVisible(true);
                                setSubmitData(item);
                              } else {
                                setIsSubmitModalVisible(true);
                                setSubmitData(item);
                                getFirData(item);
                              }
                            } else {
                              if (!!item?.isTransFer === false) {
                                localStorage.setItem(
                                  "selectedFir",
                                  JSON.stringify(item?.firDetail)
                                );
                                setSelectedFIR(item);
                                onActionSubmit(item);
                                setSubmitData(item);
                              } else {
                                setIsSubmitModalVisible(true);
                                setSubmitData(item);
                                getFirData(item);
                              }
                            }
                          }}
                        >
                          CLICK TO SUBMIT
                        </Button>
                      </Form.Item>
                    </Col>
                  ) : null}
                </Row>
              );
            },
          });
          break;
        case "status":
          columns.push({
            title: "Status",
            dataIndex: "status",
            rowKey: "status",
            render: (_i, item) => {
              if (!!item?.isTransFer === false) {
                const caseProperties =
                  !isEmpty(item?.caseproperties) && first(item?.caseproperties);
                const sendToFSL = caseProperties?.sendToFSL;
                let bgColor = "#C7E7FF";
                return !isUndefined(sendToFSL?.approvalAckStatus) ||
                  !!item?.status ? (
                  <div
                    className="tableRowText"
                    style={{
                      backgroundColor: bgColor,
                      borderRadius: 5,
                      padding: 5,
                      textAlign: "center",
                      fontSize: "small",
                      cursor: "pointer",
                      fontWeight: "normal",
                    }}
                  >
                    <span>
                      {!!sendToFSL?.approvalAckStatus
                        ? sendToFSL?.approvalAckStatus
                        : null}
                    </span>
                  </div>
                ) : null;
              } else {
                return !isUndefined(item?.approvals) ? (
                  <Popover
                    placement="bottom"
                    content={
                      item?.transferTo?.toLowerCase() ===
                      "Other Police Station"?.toLowerCase() ? (
                        <StepsIndicator
                          data={
                            item?.approvals?.length !== 0 ? item?.approvals : []
                          }
                          status={item?.status}
                          with={item?.with}
                        />
                      ) : null
                    }
                    trigger="click"
                    arrowPointAtCenter
                  >
                    {getTags(item, "pointer")}
                  </Popover>
                ) : (
                  getTags(item, "default")
                );
              }
            },
          });
          break;
        default:
          break;
      }
    });

  const docColumns = [];

  tableConfigData &&
    tableConfigData.map((headTitle, _index) => {
      switch (headTitle) {
        case "propertiesList":
          docColumns.push({
            title: <div style={{ width: 100 }}>No of Property</div>,
            dataIndex: "propertiesList",
            key: "propertiesList",
            render: (i, item) => {
              const numberOfProperty =
                item?.casePropertiesList && item?.casePropertiesList.length;
              return <span key={i}>{numberOfProperty}</span>;
            },
          });
          break;
        case "letterToAcp":
          docColumns.push({
            title: "Letter to ACP",
            dataIndex: "letterToAcp",
            key: "letterToAcp",
            render: (i, item) => {
              const requisitionLetter =
                item?.casePropertyDoc?.sendToFSL?.requisitionLetter;
              return (
                <span
                  key={i}
                  style={{ cursor: "pointer", color: "#02599C" }}
                  onClick={() =>
                    getFileById(
                      requisitionLetter?.fileId,
                      requisitionLetter?.name,
                      requisitionLetter?.url
                    )
                  }
                >
                  {requisitionLetter?.name}
                </span>
              );
            },
          });
          break;
        case "letterOfAdvice":
          docColumns.push({
            title: "Letter of Advice",
            dataIndex: "letterOfAdvice",
            key: "letterOfAdvice",
            render: (i, item) => {
              const letterOfAdvice =
                item?.casePropertyDoc?.sendToFSL?.letterOfAdvice;
              return (
                <span
                  key={i}
                  style={{ cursor: "pointer", color: "#02599C" }}
                  onClick={() =>
                    getFileById(
                      letterOfAdvice?.fileId,
                      letterOfAdvice?.name,
                      letterOfAdvice?.url
                    )
                  }
                >
                  {letterOfAdvice?.name}
                </span>
              );
            },
          });
          break;
        case "slno":
          docColumns.push({
            title: <div style={{ width: 100 }}>No of Property</div>,

            render: (_, item, i) => {
              return <span key={i}>{i + 1}</span>;
            },
          });
          break;
        case "lettertounitofficer":
          docColumns.push({
            title: "Letter to Unit Officer",
            render: (i, item) => {
              return (
                <span
                  key={i}
                  style={{ cursor: "pointer", color: "#02599C" }}
                  onClick={() =>
                    getFileById(item?.fileId, item?.name, item?.url)
                  }
                >
                  {item?.name}
                </span>
              );
            },
          });
          break;
      }
    });

  const showModal = (templateName, fileName, templateAvailable = false) => {
    if (templateAvailable) {
      setTemplateIsModalVisible(true);
      setSelectedTemplateName(`${templateName} - Preview`);
      setSelectedFileName(fileName);
    } else {
      setTemplateIsModalVisible(false);
    }
  };

  const handleTemplateCancel = () => {
    setTemplateIsModalVisible(false);
  };

  const reportData = getDataForDocument(selectedFileName, selectedFIR, actList);

  const dataSource = useMemo(() => {
    let result = [];
    if (isArray(approvalFIRList)) result = result.concat(approvalFIRList);
    if (isArray(transferCasesData)) result = result.concat(transferCasesData);
    return result.sort((a, b) => b.sortDate - a.sortDate);
  }, [approvalFIRList, transferCasesData]);

  return (
    <AINotificationContainer>
      <SimpleFilter onFilterChange={onFilterChange} baseUrl={baseUrl} />
      {(isFetching || isUpdating) && transferCasesData?.length === 0 ? (
        <Loader />
      ) : (
        <Form form={form} layout="vertical">
          <Row gutter={24} style={{ paddingLeft: 10, marginTop: 10 }}>
            <div style={{ backgroundColor: "white" }}>
              <Table
                dataSource={dataSource}
                columns={columns}
                style={{ bordeRadius: 5, width: "100%" }}
                showSorterTooltip={false}
                pagination={{
                  onChange: (page, pageSize) =>
                    setPaginationData({ page, pageSize }),
                }}
                size="small"
              />
            </div>
          </Row>

          {isModalOpen ? (
            <Modal
              title="Mini investigation Reports"
              visible={isModalOpen}
              onOk={handleOk}
              onCancel={handleCancel}
              width={1000}
            >
              <ManiInVestigation selectedFirData={selectedFirData} />
            </Modal>
          ) : null}
          {isSubmitModalVisible ? (
            <Modal
              title={
                <Row gutter={24}>
                  <Col style={{ color: "#022A49" }}>
                    {`Cr. No. ${
                      !!submitData?.isTransFer === false
                        ? selectedFIR?.firDetail?.firNum
                        : submitData?.firNum
                    } - ${selectedAction}`}
                  </Col>
                </Row>
              }
              visible={isSubmitModalVisible}
              onOk={() => {
                setIsSubmitModalVisible(false);
                setAddRemarks("");
                setSubmitData({});
              }}
              onCancel={() => {
                if (!!submitData?.isTransFer === false) {
                  const caseProperties =
                    !isEmpty(selectedFIR?.caseproperties) &&
                    first(selectedFIR?.caseproperties);
                  const filterRecord =
                    !isEmpty(ackHistory) &&
                    first(
                      ackHistory.filter(
                        (s) => s?.casePropertyId === caseProperties?._id
                      )
                    );
                  filterRecord.disableFields = false;
                  setIsSubmitModalVisible(false);
                } else {
                  setIsSubmitModalVisible(false);
                  setAddRemarks("");
                  setSubmitData({});
                }
              }}
              footer={[
                <Button
                  key="back"
                  onClick={() => {
                    if (!!submitData?.isTransFer === false) {
                      const caseProperties =
                        !isEmpty(selectedFIR?.caseproperties) &&
                        first(selectedFIR?.caseproperties);
                      const filterRecord =
                        !isEmpty(ackHistory) &&
                        first(
                          ackHistory.filter(
                            (s) => s?.casePropertyId === caseProperties?._id
                          )
                        );
                      filterRecord.disableFields = false;
                      setIsSubmitModalVisible(false);
                    } else {
                      setIsSubmitModalVisible(false);
                      setAddRemarks("");
                      setSubmitData({});
                    }
                  }}
                >
                  Close
                </Button>,
                <>
                  {!!submitData?.isTransFer === false ? (
                    <>
                      <Button
                        onClick={() => onActionSubmit(submitData)}
                        disabled={isEmpty(uploadedLeterFromACP)}
                        style={{
                          backgroundColor: isEmpty(uploadedLeterFromACP)
                            ? "#f5f5f5"
                            : "#02599C",
                          borderColor: isEmpty(uploadedLeterFromACP)
                            ? "#d9d9d9"
                            : "#02599C",
                          color: isEmpty(uploadedLeterFromACP)
                            ? "rgba(0, 0, 0, 0.25)"
                            : "#FFF",
                        }}
                      >
                        Submit
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => onActionSubmit(submitData)}>
                      Submit
                    </Button>
                  )}
                </>,
              ]}
              width={!!submitData?.isTransFer === true ? 550 : 500}
            >
              <Row gutter={24}>
                {(!!submitData?.isTransFer === false &&
                  activeUser?.emp_role_name === IS_DSP) ||
                !!submitData?.isTransFer === true ? (
                  <>
                    {!!submitData?.isTransFer === false ? (
                      <Form.Item name="approvalsAndAcknowledgement" label="">
                        <UploadLetters
                          templateLists={uploadLetter}
                          showModal={showModal}
                          disabled={false}
                          selectedRecord={{ crimeId: crimeId }}
                          selectedModule="approvalsAndAcknowledgement"
                          setUploadedItem={setUploadedLetterFromACP}
                        />
                      </Form.Item>
                    ) : !!submitData?.isTransFer === true ? (
                      <>
                        <Row>
                          <Col style={{ marginBottom: 10 }}>
                            <Form.Item
                              name="add_remarks"
                              label="Add Remarks"
                              rules={[
                                {
                                  required:
                                    selectedAction === "Returned with Remarks"
                                      ? true
                                      : false,
                                },
                              ]}
                            >
                              <TextArea
                                style={{
                                  width: 500,
                                  height: 200,
                                  resize: "none",
                                }}
                                rows={100}
                                columns={10}
                                value={addRemarks}
                                onChange={(data) =>
                                  setAddRemarks(data?.target?.value)
                                }
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                        {!!submitData?.allowUpload === true
                          ? displayReportGenerations(submitData?.uploadFileName)
                          : null}
                      </>
                    ) : null}
                  </>
                ) : (
                  false
                )}
              </Row>
            </Modal>
          ) : null}
        </Form>
      )}
      {isModalVisible ? (
        <Modal
          title={
            <Row gutter={24}>
              <Col span={12} style={{ color: "#022A49" }}>
                Uploaded Notice
              </Col>
            </Row>
          }
          visible={isModalVisible}
          onOk={() => {
            setIsModalVisible(false);
            setSelectedRecord([]);
            setSubmitData({});
          }}
          onCancel={() => {
            setIsModalVisible(false);
            setSelectedRecord([]);
            setSubmitData({});
          }}
          footer={[
            <Button
              key="back"
              onClick={() => {
                setIsModalVisible(false);
                setSelectedRecord([]);
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
        <AINotificationContainer>
          <div>
            <Row style={{ marginBottom: 10 }}>
              <Col span={5}>
                <Row>
                  <label style={{ color: "#707070", fontSize: "13px" }}>
                    FIR Number
                  </label>
                </Row>
                <Row>
                  <strong style={{ fontSize: "18px" }}>
                    {!!submitData?.firNum ? submitData?.firNum : ""}
                  </strong>
                </Row>
              </Col>
              <Col span={5}>
                <Row>
                  <label style={{ color: "#707070", fontSize: "13px" }}>
                    Section of Law
                  </label>
                </Row>
                <Row>
                  <strong style={{ fontSize: "18px" }}>
                    {!!submitData?.actsAndSections
                      ? submitData?.actsAndSections
                      : ""}
                  </strong>
                </Row>
              </Col>
              <Col span={5}>
                <Row>
                  <label style={{ color: "#707070", fontSize: "13px" }}>
                    Unit Name
                  </label>
                </Row>
                <Row>
                  <strong style={{ fontSize: "18px" }}>
                    {!!submitData?.unitName ? submitData?.unitName : ""}
                  </strong>
                </Row>
              </Col>
              <Col span={5}>
                <Row>
                  <label style={{ color: "#707070", fontSize: "13px" }}>
                    Status
                  </label>
                </Row>
                <Row>
                  <strong style={{ fontSize: "18px" }}>
                    {!!submitData?.caseStatus ? submitData?.caseStatus : ""}
                  </strong>
                </Row>
              </Col>
              <Col span={4}>
                <Row>
                  <label style={{ color: "#707070", fontSize: "13px" }}>
                    PS Name
                  </label>
                </Row>
                <Row>
                  <strong style={{ fontSize: "18px" }}>
                    {!!submitData?.psName ? submitData?.psName : ""}
                  </strong>
                </Row>
              </Col>
            </Row>
            <Row style={{ marginBottom: 10 }}>
              <Col span={5}>
                <Row>
                  <label style={{ color: "#707070", fontSize: "13px" }}>
                    Date of Report
                  </label>
                </Row>
                <Row>
                  <strong style={{ fontSize: "18px" }}>
                    {submitData?.dateOfReport}
                  </strong>
                </Row>
              </Col>
              <Col span={5}>
                <Row>
                  <label style={{ color: "#707070", fontSize: "13px" }}>
                    Date of Offence
                  </label>
                </Row>
                <Row>
                  <strong style={{ fontSize: "18px" }}>
                    {submitData?.dateOfOffence}
                  </strong>
                </Row>
              </Col>
              <Col span={5}>
                <Row>
                  <label style={{ color: "#707070", fontSize: "13px" }}>
                    Crime Classification
                  </label>
                </Row>
                <Row>
                  <strong style={{ fontSize: "18px" }}>
                    {submitData?.crimeClassification}
                  </strong>
                </Row>
              </Col>
              <Col span={5}>
                <Row>
                  <label style={{ color: "#707070", fontSize: "13px" }}>
                    Major Head
                  </label>
                </Row>
                <Row>
                  <strong style={{ fontSize: "18px" }}>
                    {submitData?.majorHead}
                  </strong>
                </Row>
              </Col>
              <Col span={4}>
                <Row>
                  <label style={{ color: "#707070", fontSize: "13px" }}>
                    Minor Head
                  </label>
                </Row>
                <Row>
                  <strong style={{ fontSize: "18px" }}>
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
        </AINotificationContainer>
      </Modal>
      {isTemplateModalVisible && (
        <TemplatesModal
          reportData={reportData}
          selectedTemplateName={selectedTemplateName}
          selectedFileName={selectedFileName}
          getHTMLFromTemplate={
            !!submitData?.isTransFer === false
              ? getHTMLFromTemplate
              : getHTMLFromTemplate1
          }
          handleCancel={handleTemplateCancel}
          isModalVisible={isTemplateModalVisible}
        />
      )}
    </AINotificationContainer>
  );
}
