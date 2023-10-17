/* eslint-disable array-callback-return */
import { useEffect, useMemo, useState } from "react";
import {
  Row,
  Col,
  Badge,
  notification,
  Popconfirm,
  Drawer,
  Radio,
  message,
  Form,
  Input,
  Modal,
  Button,
  Select,
  Space,
  Pagination,
  Typography,
} from "antd";
import { Link, useHistory } from "react-router-dom";
import moment from "moment";
import { HomeOutlined, CaretDownOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  isArray,
  isEmpty,
  isNull,
  isUndefined,
  orderBy,
  includes,
  filter,
  isPlainObject,
} from "lodash";
import firActions from "@redux/fir/actions";
import newFirActions from "@redux/createFir/actions";
import WidgetsWrapper from "@containers/Widgets/WidgetsWrapper";
import masterDataActions from "@redux/masterData/actions";
import Loader from "@components/utility/loader";
import { config } from "@config/site.config";
import dashboardActions from "@redux/dashboard/actions";
import appActions from "@redux/app/actions";
import form54Action from "@redux/investigations/form54/actions";
import { loadState, loadStringState } from "@lib/helpers/localStorage";
import chargesheetActions from "@redux/investigations/chargesheet/actions";
import ChargeSheetDataActions from "@redux/CourtAndProsecution/ChargeSheetData/actions";
import DisposalCaseCount from "./disposalCount";
import {
  IS_DGP,
  IS_SHO,
  IS_CI,
  IS_DSP,
  IS_SP,
  IS_IO,
  IS_INVESTIGATION_OFFICER,
  actDatalocal,
  DATE_TIME_FORMAT,
  DATE_FORMAT,
  getIONameAndRank,
  showPSName,
  sortByNumber,
  DATE_FORMAT_MM,
} from "@containers/FirDetails/fir-util";
import { getFileById } from "@containers/media-util";
import ReopeningOfCase from "@containers/FirDetails/Investigation/ReopeningOfCase";
import UpdateChargeSheetStatus from "@containers/FirDetails/Investigation/UpdateChargeSheetStatus";
import TableWrapper from "@containers/Tables/AntTables/AntTables.styles";
import { variables } from "@assets/styles/variables";
import {
  filteredDataList,
  getDataForActs,
  getDateOfOccurence,
  getActsAndSectionsDetails,
  getActName,
} from "@containers/const";
import {
  firTableConfig,
  firTableConfigHigherOfficer,
  historyTableConfig,
  historyTableColumsConfig,
} from "./firTableConfig";

import { FirsContainer } from "./Firs.styles";
import CaseCount from "./CaseCount";
import TransferOrForwardFIR from "./TransferOrForwardFIR";
import CourtDisposalFormAction from "@redux/CourtAndProsecution/CourtDisposalForm/actions.js";

const Search = Input.Search;
const Option = Select.Option;
const {
  getGraveList,
  getGraveCrimeCount,
  fetchFIRList,
  updateDashboardTopBar,
  updateDashboardData,
  updateSelectedWidget,
  fetchTransferredZeroFIRHistory,
  fetchReceivedZeroFIRHistory,
  setSelectedSiderMenu,
  fetchHigherFIRList,
} = firActions;
const { deleteFIRData, resetActionType } = newFirActions;
const { fetchDashboardDetails } = dashboardActions;
const { setChargeSheetData } = ChargeSheetDataActions;
const ALL = "ALL";

export default function Firs(props) {
  const [form] = Form.useForm();
  const history = useHistory();
  const dispatch = useDispatch();
  const { hideSideMenu } = appActions;

  const { resetAccidentInformationReport } = form54Action;
  const [visible, setVisible] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [reason, setReason] = useState("");
  const [selectedIo, setSelectedIo] = useState(ALL);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [caseStatus, setCaseStatus] = useState("");
  const [editReopeningOfCaseObj, setEditReopeningOfCaseObj] = useState(null);
  const [selectedZeroFirType, setSelectedZeroFirType] = useState("");
  const [searchText, setSearchText] = useState("");
  const [disposalType, setDisposalType] = useState(false);
  const [disposalFlag, setDisposalFlag] = useState("police_disposal");
  const [searchData, setSearchData] = useState([]);
  const [firData, setFirData] = useState({});
  const [Police_disposal, setPolice_disposal] = useState([]);
  const [court_disposal, setCourt_disposal] = useState([]);
  const [chargeSheetDate, setChargeSheetDate] = useState(null);
  const [nature_disposal, setNature_disposal] = useState([]);
  const { currentUser } = useSelector((state) => state.Auth);
  const storedUser = loadState("currentUser");
  const draftCount = loadState("draftCount");
  const activeUser = currentUser.employee_name ? currentUser : storedUser;
  const IS_SHO_USER = activeUser.emp_role_name === IS_SHO;
  const userRole = [IS_SHO, IS_IO, IS_INVESTIGATION_OFFICER];
  const IS_HIGHER_SHO_USER = !userRole?.includes(activeUser?.ecopsv2_role);
  const selectedCaseStatus = loadStringState("selectedCaseStatus");
  const { actionType, errorMessage, successMessage } = useSelector(
    (state) => state.createFIR
  );
  const { getChargesheetList } = chargesheetActions;
  const Chargesheet = useSelector((state) => state.Chargesheet);
  const { getUnitsList, getIoDetails } = masterDataActions;
  const { actList, unitList, IOList } = useSelector(
    (state) => state.MasterData
  );
  const {
    graveCrimeListData,
    firList,
    isFetching,
    selectedWidgetStatus,
    transferredZeroFIRHistoryList,
    receivedZeroFIRHistoryList,
    graveCrimeCount,
    higherfirList,
    updatedPsCode,
    dropDownData,
    betweenDates,
    selectedYear,
    searchedFir,
  } = useSelector((state) => state.FIR);

  const getpsCode = dropDownData.map((data) => data?.ps_code).join(",");
  const psData =
    isEmpty(updatedPsCode) || isUndefined(updatedPsCode)
      ? getpsCode
      : updatedPsCode;
  const { caseCountList, selectedDashboard, dashboardDetails } = useSelector(
    (state) => state.Dashboard
  );

  const isGrave = selectedDashboard === "grave-crimes";
  const { data = [] } =
    selectedDashboard === "grave-crimes" && graveCrimeListData?.data
      ? graveCrimeListData
      : firList;
  const today = moment();

  useEffect(() => {
    if (isArray(data)) {
      if (firList.status === true) {
        data?.forEach((item) => {
          if (item?.isLokAdalatDisposal || item?.isCourtDisposal) {
            if (item?.isLokAdalatDisposal) {
              Object.assign(item, {
                isDisposalCourt: true,
                courtDisposalType: "Lok Adalat",
              });
            } else {
              Object.assign(item, {
                isDisposalCourt: true,
              });
            }
          }
          if (!!item?.isChargeSheetDone) {
            Object.assign(item, {
              isDisposalCourt: true,
              courtDisposalType: "Lok Adalat",
            });
          }
        });
      }
      const policeDisposal = data?.filter(
        (item) => !!item?.isDisposalCourt === false
      );

      const natureDisposal = data?.reduce((acc, cur, i) => {
        if (!!cur?.courtDisposalType) {
          const key = cur?.courtDisposalType;
          if (!(key in acc)) {
            acc[key] = 1;
          } else {
            acc[key] = acc[key] + 1;
          }
        }
        return acc;
      }, {});
      setNature_disposal(natureDisposal);
      setPolice_disposal(policeDisposal);
    }

    if (selectedCaseStatus !== caseStatus) {
      setPageSize(50);
      setPage(1);
    }
    setCourt_disposal(data?.filter((item) => !!item?.isDisposalCourt === true));
  }, [data]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [disposalTittle, setDisposalTittle] = useState({
    tittle: "POLICE DISPOSAL",
    count: Police_disposal?.length,
  });

  const openNotificationWithIcon = (type, message) => {
    return notification[type]({
      message: message,
    });
  };

  useEffect(() => {
    dispatch(
      getIoDetails(
        `${config.getIoDetails}?psCode=${activeUser?.cctns_working_unit_id}&caseStatus=${selectedCaseStatus}`
      )
    );
  }, []);

  const getZeroFirList = () => {
    if (IS_HIGHER_SHO_USER) {
      dispatch(
        fetchFIRList(
          `${
            config.getRecentFirList
          }/?psCode=${psData}&page=1&limit=50&firType=Zero&isDraft=${false}`
        )
      );
    } else {
      dispatch(
        fetchFIRList(
          `${config.getRecentFirList}/?psCode=${
            activeUser?.cctns_unit_id
          }&isDraft=${false}&firType=Zero`
        )
      );
    }
  };

  const ioListDetails = useMemo(() => {
    if (isArray(IOList) && !isEmpty(IOList)) {
      return IOList.map((item) => ({
        label: item?.ioAssignedName,
        paoCode: item.ioAssigned,
      }));
    }
    return [];
  }, [IOList]);

  const getChargesheetListData = () => {
    const list = [];
    !isEmpty(Chargesheet?.chargesheetList) &&
      Chargesheet?.chargesheetList
        .filter((item) => !item?.isDraft)
        .map((item) => {
          const courtAndProsecution = item?.courtAndProsecution;
          if (
            !isUndefined(courtAndProsecution) &&
            !!courtAndProsecution?.updateChargesheetId
          ) {
            const result = {
              _id: item?._id,
              value: courtAndProsecution?.updateChargesheetId,
              label: courtAndProsecution?.chargesheetNo,
              chargesheetNo: courtAndProsecution?.chargesheetNo,
              caseType: courtAndProsecution?.caseType,
              chargesheetDate: courtAndProsecution?.chargesheetDate,
              courtCaseNo: courtAndProsecution?.courtCaseNo,
              courtName: courtAndProsecution?.courtName,
              updateChargesheetId: courtAndProsecution?.updateChargesheetId,
              isCourtDisposal: courtAndProsecution?.isDisposalCourt,
              data: item,
            };
            list.push(result);
          }
        });
    return list;
  };
  const chargesheetDropDown = getChargesheetListData();
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
          `${config.getCaseMetricsByEMail}/?userName=${activeUser?.pao_code}&page=1&limit=50&higherOfficer=true`
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

  const warning = () => {
    message.warning(
      "Please continue with Draft FIR or delete Draft FIR to generate New FIR."
    );
  };

  const fetchRecentFirDetails = () => {
    if (IS_SHO_USER) {
      dispatch(
        fetchFIRList(
          `${config.getRecentFirList}/?psCode=${
            activeUser?.cctns_unit_id
          }&caseStatus=New&isDraft=${true}`
        )
      );
    } else if (IS_HIGHER_SHO_USER) {
      dispatch(
        fetchFIRList(
          `${config.getRecentFirList}/?userName=${
            activeUser?.pao_code
          }&caseStatus=New&isDraft=${true}&page=1&limit=50&higherOfficer=true`
        )
      );
    } else {
      dispatch(
        fetchFIRList(
          `${config.getRecentFirList}/?psCode=${
            activeUser?.cctns_unit_id
          }&userName=${activeUser?.pao_code}&caseStatus=New&isDraft=${true}`
        )
      );
    }
  };

  const isSuccess = actionType === "DELETE_FIR_SUCCESS";
  const isError = actionType === "DELETE_FIR_ERROR";

  useEffect(() => {
    if (isSuccess || isError) {
      if (successMessage !== "") {
        openNotificationWithIcon("success", successMessage);
        history.push("/dashboard");
        dispatch(updateDashboardTopBar(false));
        dispatch(updateDashboardData(true));
        localStorage.removeItem("selectedFir");
        localStorage.removeItem("selectedActDetails");
        localStorage.removeItem("selectedCaseStatus");
        localStorage.removeItem("selectedFirId");
        localStorage.removeItem("draftCount");
        dispatch(resetActionType());
        fetchDataDetails();
      } else if (errorMessage) {
        openNotificationWithIcon("error", errorMessage);
        dispatch(resetActionType());
      }
    }
  }, [actionType]);

  const getColorByCount = (val) => {
    if (val < 0) return variables.RED;
    if (val >= 0 && val <= 5) return variables.YELLOW_AMBER;
    if (val > 5) return variables.LIGHT_GREEN;
  };

  const displayDrawer = () => {
    setVisible(true);
  };

  const fetchDisposalFirDetails = () => {
    const psCode = activeUser?.cctns_unit_id;
    if (!IS_HIGHER_SHO_USER) {
      dispatch(
        fetchFIRList(
          `${
            config.getRecentFirList
          }/?psCode=${psCode}&caseStatus=${selectedCaseStatus}&isDraft=${false}`
        )
      );
    } else {
      dispatch(
        fetchFIRList(
          `${config.getRecentFirList}/?psCode=${psCode}&userName=${
            currentUser?.pao_code
          }&caseStatus=${selectedCaseStatus}&isDraft=${false}&page=1&limit=50&higherOfficer=true`
        )
      );
    }
  };

  const onClose = () => {
    setVisible(false);
    setEditReopeningOfCaseObj(null);
    setReason("");
    if (isFormSubmitted) {
      fetchDataDetails();
      if (selectedCaseStatus === "Disposal") {
        fetchDisposalFirDetails();
      } else {
        dispatch(updateDashboardData(true));
        dispatch(updateSelectedWidget(""));
      }
    }
  };

  const handleZeroTranfrredFIR = (item) => {
    const uploadFirReport = item?.firDetail?.uploadFirReport;
    if (uploadFirReport?.url !== "") {
      getFileById(
        uploadFirReport?.fileId,
        uploadFirReport?.name,
        uploadFirReport?.url
      );
    } else {
      openNotificationWithIcon("warning", "Upload FIR Report");
    }
  };

  const showYearTable =
    selectedWidgetStatus === "UI Cases" ||
    selectedWidgetStatus === "Disposal" ||
    selectedWidgetStatus === "PT Cases" ||
    selectedWidgetStatus === "Total Cases";

  const dataList = disposalFlag === "police_disposal" ? "data" : "data1";

  useEffect(() => {
    if (selectedCaseStatus !== "Disposal") {
      setDisposalType(false);
      setDisposalFlag("police_disposal");
    }
  }, [data]);

  const tableConfig =
    IS_HIGHER_SHO_USER &&
    !!storedUser?.isPersnolized === false &&
    !!storedUser?.isIo === false
      ? firTableConfigHigherOfficer.find(
          (c) => c.typeName === selectedCaseStatus
        )?.[selectedCaseStatus === "Disposal" ? dataList : "data"]
      : firTableConfig.find((c) => c.typeName === selectedCaseStatus)?.[
          selectedCaseStatus === "Disposal" ? dataList : "data"
        ];

  const isDraftCase = selectedCaseStatus === "Draft Cases";
  const isPTCase = selectedCaseStatus === "PT Cases";
  const registeredZeroFir = selectedZeroFirType === "registeredZeroFir";
  const receivedZeroFir = selectedZeroFirType === "receivedZeroFir";
  const transferredZeroFirHistory =
    selectedZeroFirType === "transferredZeroFirHistory";
  const receivedZeroFirHistory =
    selectedZeroFirType === "receivedZeroFirHistory";
  const isZeroFir = selectedWidgetStatus === "Zero FIRs";
  const isDisposal = selectedWidgetStatus === "Disposal";
  const historyTableColumnConfig = historyTableConfig.find(
    (c) => c.type === selectedZeroFirType
  )?.data;

  const registeredZeroFirData = !isEmpty(searchData)
    ? searchData?.filter((s) => s.isTransferred === false)
    : [];

  const registeredZeroFirList = orderBy(
    registeredZeroFirData,
    (item) => moment(item?.dateCreated).unix(),
    ["asc"]
  );

  const receivedZeroFirValue = !isEmpty(searchData)
    ? searchData?.filter((s) => s.isTransferred === true)
    : [];

  const receivedZeroFirList = orderBy(
    receivedZeroFirValue,
    (item) => moment(item?.dateCreated).unix(),
    ["asc"]
  );

  const transferredZeroFIRHistory = !isEmpty(transferredZeroFIRHistoryList)
    ? transferredZeroFIRHistoryList.filter((s) => s.firType === "Zero")
    : [];

  const transferedHistoryList = orderBy(
    transferredZeroFIRHistory,
    (item) => moment(item?.dateCreated).unix(),
    ["asc"]
  );

  const receivedZeroFIRHistory = !isEmpty(receivedZeroFIRHistoryList)
    ? receivedZeroFIRHistoryList.filter((s) => s.firType === "Zero")
    : [];

  const receivedHistoryList = orderBy(
    receivedZeroFIRHistory,
    (item) => moment(item?.dateCreated).unix(),
    ["asc"]
  );

  const zeroFirDataList = registeredZeroFir
    ? registeredZeroFirList
    : receivedZeroFir
    ? receivedZeroFirList
    : transferredZeroFirHistory
    ? transferedHistoryList
    : receivedZeroFirHistory
    ? receivedHistoryList
    : [];

  useEffect(() => {
    if (registeredZeroFirList.length >= 0 && receivedZeroFirList.length === 0) {
      setSelectedZeroFirType("registeredZeroFir");
      form?.setFieldsValue({
        zeroFirField: "registeredZeroFir",
      });
    } else if (
      registeredZeroFirList.length >= 0 &&
      receivedZeroFirList.length >= 0
    ) {
      setSelectedZeroFirType("receivedZeroFir");
      form.setFieldsValue({
        zeroFirField: "receivedZeroFir",
      });
    } else {
      setSelectedZeroFirType("");
      form.setFieldsValue({
        zeroFirField: "",
      });
    }
    !isEmpty(data) &&
      data.forEach((item, i) => Object.assign(item, { key: i + 1 }));
    setSearchData(data);
    const Police_disposal = data?.filter(
      (item) => item?.isCourtDisposal === false
    );
    setDisposalTittle({
      tittle: "POLICE DISPOSAL",
      count: Police_disposal?.length,
    });
  }, [data]);

  useEffect(() => {
    if (transferredZeroFirHistory || receivedZeroFirHistory) {
      dispatch(getUnitsList(`${config.getMasterData}/UNITS`));
    }
  }, [selectedZeroFirType]);

  const onSearch = (e) => {
    if (!IS_HIGHER_SHO_USER || storedUser?.isIo) {
      const val = e.target.value;
      const filteredData = filter(searchData, (record) =>
        includes(record?.firDetail?.firNum, val)
      );
      const exactMatchData =
        !isEmpty(searchData) &&
        searchData.filter((s) => s?.firDetail?.firNum === val);
      if (isEmpty(exactMatchData)) {
        const values = isEmpty(val) ? data : filteredData;
        setSearchData(values);
      } else {
        const values = isEmpty(val) ? data : exactMatchData;
        setSearchData(values);
      }
      setSearchText(val);
    } else {
      const txt = e.target.value;
      if (txt) {
        if (storedUser?.isPersnolized === false) {
          dispatch(
            fetchFIRList(
              `${config?.getRecentFirList}/?psCode=${psData}&caseStatus=${caseStatus}&page=1&limit=5&firType=Regular&isDraft=false&firNum=${txt}`
            )
          );
        } else {
          dispatch(
            fetchFIRList(
              `${config?.getRecentFirList}/?userName=${activeUser?.pao_code}&psCode=${activeUser?.cctns_working_unit_id}&caseStatus=${caseStatus}&page=1&limit=5&firType=Regular&isDraft=false&firNum=${txt}`
            )
          );
        }
      } else {
        dispatch(
          fetchFIRList(
            `${config?.getRecentFirList}/?userName=${activeUser?.pao_code}&psCode=${activeUser?.cctns_working_unit_id}&caseStatus=${caseStatus}&page=1&limit=5&firType=Regular&isDraft=false`
          )
        );
      }

      setSearchText(txt);
      setSearchData(data);
    }
  };

  const columns = [];

  isArray(tableConfig) &&
    tableConfig.forEach((headTitle) => {
      switch (headTitle) {
        case "Cr.No.":
          columns.push({
            title: <div style={{ minWidth: 80 }}>Cr.No.</div>,
            dataIndex: "crimeNumber",
            key: "crimeNumber",
            showSorterTooltip: false,
            render: (_i, item) => {
              const actsAndSections = item?.firDetail?.actsAndSections;
              let uniqActs = [];
              let diffActs = [];
              let uniqActName = [];
              !isEmpty(actsAndSections) &&
                actsAndSections.map((actSection, _index) => {
                  const filteredList = filteredDataList(
                    actsAndSections,
                    actSection?.actDescription
                  );
                  getDataForActs(
                    filteredList,
                    actSection?.actDescription,
                    getActName,
                    uniqActName,
                    uniqActs,
                    diffActs,
                    actList
                  );
                });

              if (isDraftCase) {
                return (
                  <span className="tableRowTextUl">
                    {item.firDetail.firNum}
                  </span>
                );
              } else {
                if (isZeroFir && receivedZeroFir) {
                  return (
                    <span
                      className="tableRowTextUl"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleZeroTranfrredFIR(item)}
                    >
                      {item.firDetail.firNum}
                    </span>
                  );
                } else if (
                  isZeroFir &&
                  registeredZeroFir &&
                  !item?.firDetail?.uploadFirReport?.url
                ) {
                  return (
                    <span
                      className="tableRowTextUl"
                      onClick={() =>
                        openNotificationWithIcon("warning", "Upload FIR Report")
                      }
                    >
                      {item.firDetail.firNum}
                    </span>
                  );
                } else {
                  return isPTCase === false &&
                    !item.isCourtDisposal &&
                    item.caseStatus !== "PT Cases" ? (
                    <>
                      <Link
                        to={{
                          pathname: props.ISHIGHERSHOUSER
                            ? `./Fir/${item._id}`
                            : `./dashboard/fir/${item._id}`,
                        }}
                        onClick={() => {
                          localStorage.setItem(
                            "selectedActDetails",
                            JSON.stringify(
                              actDatalocal(item.firDetail, actList)
                            )
                          );
                          localStorage.setItem(
                            "selectedFir",
                            JSON.stringify(item.firDetail)
                          );
                          localStorage.setItem(
                            "selectedFirId",
                            JSON.stringify(item._id)
                          );
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
                        <span className="tableRowTextUl">
                          {item.firDetail.firNum}
                        </span>
                      </Link>
                    </>
                  ) : (
                    <Link
                      onClick={() => {
                        dispatch(
                          getChargesheetList(
                            `${config.getChargeSheet}?crimeId=${item._id}`
                          )
                        );
                        setFirData(item);
                        setIsModalOpen(true);
                      }}
                    >
                      <span className="tableRowTextUl">
                        {item?.firDetail?.firNum}
                      </span>
                    </Link>
                  );
                }
              }
            },
            sorter: (a, b) =>
              sortByNumber(a?.firDetail?.firNum, b?.firDetail?.firNum),
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
        case "dateOfOccurence":
          columns.push({
            title: "Date of Occurrence",
            dataIndex: "dateOfOccurence",
            rowKey: "dateOfOccurence",
            render: (_i, item) => {
              return (
                <span className="tableRowText">
                  {getDateOfOccurence(item?.firDetail)}
                </span>
              );
            },
          });
          break;
        case "dateOfReport":
          columns.push({
            title: "Date of Report",
            dataIndex: "dateOfReport",
            rowKey: "dateOfReport",
            render: (_i, item) => {
              const firDate = item?.firDetail?.occurenceOfOffence?.firDate;
              return (
                <span className="tableRowText">
                  {!isUndefined(firDate) && !isNull(firDate)
                    ? moment(firDate).format(DATE_TIME_FORMAT)
                    : ""}
                </span>
              );
            },
          });
          break;
        case "unitName":
          columns.push({
            title: "PS Name",
            dataIndex: "unitName",
            rowKey: "unitName",
            render: (_i, item) => {
              const psName = item?.firDetail?.psName;
              return <span className="tableRowText">{psName}</span>;
            },
          });
          break;
        case "placeOfOccurence":
          columns.push({
            title: "Place of Occurrence",
            dataIndex: "placeOfOccurence",
            rowKey: "placeOfOccurence",
            render: (_i, item) => {
              const wardColony = item?.firDetail?.placeOfOccurence?.wardColony;
              return (
                <span className="tableRowText">
                  {wardColony ? wardColony : ""}
                </span>
              );
            },
          });
          break;
        case "nameAndRankOfIO":
          columns.push({
            title: "Name & Rank of IO",
            dataIndex: "complainant",
            rowKey: "complainant",
            render: (i, item) => (
              <span className="tableRowText" key={i}>
                {getIONameAndRank(item?.firDetail?.briefFacts)}
              </span>
            ),
          });
          break;
        case "actions":
          columns.push({
            title: "ACTIONS",
            dataIndex: "complainant",
            rowKey: "complainant",
            render: (i, item) => (
              <span className="">
                {IS_SHO_USER && (
                  <Link>
                    <span className="tableRowTextUl">VIEW</span>
                  </Link>
                )}
                {IS_HIGHER_SHO_USER && (
                  <Link
                    to={{
                      pathname: `./Fir/${item._id}`,
                    }}
                    onClick={() => {
                      localStorage.setItem(
                        "selectedActDetails",
                        JSON.stringify(actDatalocal(item.firDetail, actList))
                      );
                      localStorage.setItem(
                        "selectedFir",
                        JSON.stringify(item.firDetail)
                      );
                      localStorage.setItem(
                        "selectedFirId",
                        JSON.stringify(item._id)
                      );
                    }}
                    style={{ width: "auto" }}
                  >
                    <span
                      className="tableRowTextUl"
                      style={{
                        cursor: "pointer",
                        marginLeft: 20,
                      }}
                    >
                      {"Advisory Memo"}
                    </span>
                  </Link>
                )}
              </span>
            ),
          });
          break;
        case "nameOfcomplainant":
          columns.push({
            title: "Name of Complainant",
            dataIndex: "complainant",
            rowKey: "complainant",
            render: (i, item) => (
              <span className="tableRowText" key={i}>
                {item?.firDetail?.crimeShownBy}
              </span>
            ),
          });
          break;
        case "victimDetails":
          columns.push({
            title: "Victim Details",
            dataIndex: "victimDetails",
            rowKey: "victimDetails",
            render: (_i, item) => {
              const victimList = item?.firDetail?.victimList;
              return (
                !isEmpty(victimList) &&
                victimList.map((name, i) => {
                  if (name === "undefined undefined") {
                    return <span className="tableRowText" />;
                  } else {
                    return (
                      <div className="tableRowText">
                        {`${i + 1}- ${name}`.replace(" undefined", "")}
                      </div>
                    );
                  }
                })
              );
            },
          });
          break;
        case "nameOfAccused":
          columns.push({
            title: "Name of Accused",
            dataIndex: "nameOfAccused",
            rowKey: "nameOfAccused",
            render: (_i, item) => {
              const accusedList =
                !isEmpty(item?.firDetail?.accusedList) &&
                item?.firDetail?.accusedList;
              return (
                <div
                  style={{ maxHeight: 145, overflowY: "auto", minWidth: 150 }}
                >
                  {!isEmpty(accusedList) &&
                    accusedList.map((name, i) => {
                      if (name === "undefined undefined") {
                        return <span className="tableRowText" />;
                      } else {
                        return (
                          <div className="tableRowText" key={i}>{`${
                            i + 1
                          }- ${name.replace(" undefined", "")}`}</div>
                        );
                      }
                    })}
                </div>
              );
            },
          });
          break;
        case "viewAction":
          columns.push({
            title: "Actions",
            dataIndex: "nameOfAccused",
            rowKey: "nameOfAccused",
            render: (_i, item) => {
              return (
                <Link
                  to={{
                    pathname: props.ISHIGHERSHOUSER
                      ? `./generated-fir/${item._id}`
                      : `./dashboard/generated-fir/${item._id}`,
                  }}
                  onClick={() => {
                    !!props.ISHIGHERSHOUSER &&
                      dispatch(updateDashboardData(true));
                    localStorage.setItem(
                      "selectedFirId",
                      JSON.stringify(item._id)
                    );
                    localStorage.setItem(
                      "selectedFir",
                      JSON.stringify(item.firDetail)
                    );
                    localStorage.setItem(
                      "selectedActDetails",
                      JSON.stringify(actDatalocal(item.firDetail, actList))
                    );
                    localStorage.removeItem("selectedCaseStatus");
                  }}
                >
                  <span className="tableRowTextUl">VIEW</span>
                </Link>
              );
            },
          });
          break;
        case "firDate":
          columns.push({
            title: "FIR Date",
            dataIndex: "firDate",
            rowKey: "firDate",
            render: (_i, item) => {
              const firDate = item?.firDetail?.occurenceOfOffence?.firDate;
              return (
                <span className="tableRowText">
                  {!isUndefined(firDate) && !isNull(firDate)
                    ? moment(firDate).format(DATE_FORMAT)
                    : ""}
                </span>
              );
            },
          });
          break;
        case "lastUpdated":
          columns.push({
            title: "Last Updated",
            dataIndex: "updated",
            rowKey: "updated",
            render: (_i, item) => (
              <span className="tableRowText">
                {moment(item?.firDetail?.lastmodifieddate).format(DATE_FORMAT)}
              </span>
            ),
          });
          break;
        case "targetDaysLeft":
          columns.push({
            title: "Target Days Left",
            dataIndex: "targetdaysleft",
            rowKey: "targetdaysleft",
            render: (_i, item) => {
              const targetdaysleft = item?.firDetail?.targetdaysleft;
              return (
                <span className="tableRowText">
                  <Badge
                    color={getColorByCount(targetdaysleft)}
                    text={targetdaysleft}
                  />
                </span>
              );
            },
          });
          break;
        case "unitName":
          columns.push({
            title: "PS Name",
            dataIndex: "unitName",
            rowKey: "unitName",
            render: (_i, item) => {
              const psName = item?.firDetail?.psName;
              return <span className="tableRowText">{psName}</span>;
            },
          });
        case "stageOfCase":
          columns.push({
            title: "Stage of the Case",
            dataIndex: "stageOfCase",
            rowKey: "stageOfCase",
            render: (_i, item) => {
              return (
                <span className="tableRowText">
                  {!isUndefined(item?.stageOfCase) ? item?.stageOfCase : ""}
                </span>
              );
            },
          });
          break;
        case "psName":
          if (IS_HIGHER_SHO_USER) {
            columns.push({
              title: "Police Station",
              dataIndex: "psName",
              rowKey: "psName",
              render: (_i, item) => {
                const psName = item?.firDetail?.psName;
                return (
                  <span className="tableRowText">
                    {showPSName(psName) || ""}
                  </span>
                );
              },
            });
          }
          break;
        case "IOName":
          if (IS_SHO_USER) {
            columns.push({
              title: "IO Name",
              dataIndex: "IOName",
              rowKey: "IOName",
              render: (_i, item) => {
                const briefFacts = item?.firDetail?.briefFacts;
                return (
                  <span className="tableRowText">
                    {getIONameAndRank(briefFacts)}
                  </span>
                );
              },
            });
          }
          break;
        case "caseProgressSheet":
          columns.push({
            title: "Case Progress Sheet",
            dataIndex: "caseProgressSheet",
            rowKey: "caseProgressSheet",
            render: (_i) => (
              <span className="tableRowTextUl">Case Progress Sheet</span>
            ),
          });
          break;
        case "planOfAction":
          columns.push({
            title: "Plan of Action",
            dataIndex: "planOfAction",
            rowKey: "planOfAction",
            render: (_i, _item) => (
              <span className="tableRowTextUl">Plan of Action</span>
            ),
          });
          break;
        case "ccSCNum":
          columns.push({
            title: "CC No / SC No",
            dataIndex: "ccSCNum",
            rowKey: "ccSCNum",
            render: () => <span className="tableRowTextUl" />,
          });
          break;
        case "crimeClassification":
          columns.push({
            title: "Crime Classification",
            dataIndex: "crimeClassification",
            rowKey: "crimeClassification",
            render: (_i, item) => {
              return (
                <span className="tableRowText">
                  {item?.firDetail?.crimeType || ""}
                </span>
              );
            },
          });
          break;
        case "finalReportType":
          columns.push({
            title: `${
              disposalFlag === "police_disposal"
                ? "Final Report Type"
                : "Disposal Type"
            }`,

            render: (_i, item) => {
              return (
                <span className="tableRowText">
                  {disposalFlag === "police_disposal"
                    ? item?.finalReportType || ""
                    : item?.isLokAdalatDisposal === false
                    ? item?.courtDisposalType || ""
                    : item?.lokAdalathDispoalType || ""}
                </span>
              );
            },
          });
          break;
        case "disposalAction":
          if (!IS_HIGHER_SHO_USER || storedUser.isPersnolized === true) {
            columns.push({
              title: "Actions",
              dataIndex: "disposalAction",
              rowKey: "disposalAction",
              render: (_i, item) => {
                return (
                  <>
                    <Link
                      to={{
                        pathname: props.ISHIGHERSHOUSER
                          ? `./generated-fir/${item._id}`
                          : `./dashboard/generated-fir/${item._id}`,
                      }}
                      onClick={() => {
                        !!props.ISHIGHERSHOUSER &&
                          dispatch(updateDashboardData(true));
                        localStorage.setItem(
                          "selectedActDetails",
                          JSON.stringify(actDatalocal(item.firDetail, actList))
                        );
                        localStorage.setItem(
                          "selectedFir",
                          JSON.stringify(item.firDetail)
                        );
                        localStorage.setItem(
                          "selectedFirId",
                          JSON.stringify(item._id)
                        );
                      }}
                    >
                      <span className="tableRowTextUl">View</span>
                    </Link>
                    <span> / </span>
                    <span
                      className="tableRowTextUl"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        localStorage.setItem(
                          "selectedFirId",
                          JSON.stringify(item._id)
                        );
                        localStorage.setItem(
                          "selectedFir",
                          JSON.stringify(item.firDetail)
                        );
                        displayDrawer();
                      }}
                    >
                      Reopen
                    </span>
                  </>
                );
              },
            });
          }
          break;
        case "stageOfDisposedCase":
          columns.push({
            title: "Stage of the Case",
            dataIndex: "stageOfDisposedCase",
            rowKey: "stageOfDisposedCase",
            render: (_i, item) => {
              const isDisposal = item?.caseStatus === "Disposal";
              return (
                <>
                  {isDisposal && item?.reopenInitiated ? (
                    <span className="tableRowText">Reopen Initiated</span>
                  ) : (
                    <span className="tableRowText">
                      {!isEmpty(item?.disposalDate)
                        ? `Closed on ${moment(item?.disposalDate).format(
                            DATE_FORMAT
                          )}`
                        : ""}
                    </span>
                  )}
                </>
              );
            },
          });
          break;
        case "crSCNum":
          columns.push({
            title: "CC No/PRC No/SC No",
            dataIndex: "crSCNum",
            rowKey: "crSCNum",
            render: (_i, item) => {
              const { chargeSheet } = item;
              const courtCaseNo =
                isArray(chargeSheet) && !!chargeSheet
                  ? chargeSheet
                      .filter((value) => !!value.courtCaseNo === true)
                      .map((val) => val.courtCaseNo)
                      .join("\r\n")
                  : "";
              return (
                <span className="tableRowText" style={{ whiteSpace: "pre" }}>
                  {courtCaseNo || ""}
                </span>
              );
            },
          });
          break;
        case "courtName":
          columns.push({
            title: "Court Name",
            dataIndex: "courtName",
            rowKey: "courtName",
            render: (_i, item) => {
              const { chargeSheet } = item;
              const courtName =
                isArray(chargeSheet) && !!chargeSheet
                  ? chargeSheet
                      .filter((value) => !!value.courtName === true)
                      .map((val) => val.courtName)
                      .join("\r\n")
                  : "";
              return (
                <span className="tableRowText" style={{ whiteSpace: "pre" }}>
                  {courtName || ""}
                </span>
              );
            },
          });
          break;
        case "draftActions":
          columns.push({
            title: "Actions",
            dataIndex: "actions",
            rowKey: "actions",
            render: (_i, item) => {
              return (
                <>
                  <Link
                    to={{
                      pathname: props.ISHIGHERSHOUSER
                        ? `./draft-fir/${item._id}`
                        : `./dashboard/draft-fir/${item._id}`,
                    }}
                    onClick={() => [
                      localStorage.setItem(
                        "selectedDraftedFirId",
                        JSON.stringify(item._id)
                      ),
                      localStorage.removeItem("selectedCaseStatus"),
                    ]}
                  >
                    <span className="tableRowTextUl">Click to Continue</span>
                  </Link>
                  <Popconfirm
                    title="Are you sure?"
                    onConfirm={() => {
                      const payload = {
                        crimeId: item._id,
                      };
                      dispatch(deleteFIRData(config.deleteFIR, payload));
                      fetchDataDetails();
                      fetchRecentFirDetails();
                      dispatch(updateDashboardData(true));
                      dispatch(updateSelectedWidget(""));
                    }}
                    okText="Yes"
                    cancelText="No"
                  >
                    <span
                      className="tableRowTextUl"
                      style={{ marginLeft: 20, cursor: "pointer" }}
                    >
                      DELETE
                    </span>
                  </Popconfirm>
                </>
              );
            },
          });
          break;
        case "status":
          columns.push({
            title: "Stage of the Case",
            dataIndex: "status",
            rowKey: "status",
            render: (_i, item) => (
              <span className="tableRowStatus">
                {isDraftCase ? "Draft Cases" : item.caseStatus}
              </span>
            ),
          });
          break;
        case "dateOfCharge":
          columns.push({
            title: "Date of Charge",
            dataIndex: "dateOfCharge",
            rowKey: "dateOfCharge",
            render: (_i, item) => {
              return (
                <span>{moment(item?.chargeSheetDate).format(DATE_FORMAT)}</span>
              );
            },
          });
          break;
        case "ccActions":
          columns.push({
            title: "Actions",
            dataIndex: "ccActions",
            rowKey: "ccActions",
            render: (_i, item) => {
              return (
                <span
                  className="tableRowTextUl"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    localStorage.setItem(
                      "selectedFirId",
                      JSON.stringify(item._id)
                    );
                    localStorage.setItem(
                      "selectedFir",
                      JSON.stringify(item.firDetail)
                    );
                    displayDrawer();
                  }}
                >
                  Update Chargesheet Status
                </span>
              );
            },
          });
          break;
        case "gravity":
          if (isZeroFir && registeredZeroFir) {
            columns.push({
              title: "Gravity",
              dataIndex: "gravity",
              rowKey: "gravity",
              render: (_i, item) => {
                return (
                  <span className="tableRowText">
                    {item?.firDetail?.gravity}
                  </span>
                );
              },
            });
          }
          break;
        case "registeredAction":
          if (isZeroFir && registeredZeroFir) {
            if (!IS_HIGHER_SHO_USER || storedUser.isPersnolized === true) {
              columns.push({
                title: "Action",
                dataIndex: "registeredAction",
                rowKey: "registeredAction",
                render: (_i, item) => {
                  return (
                    <>
                      <Link
                        to={{
                          pathname: props.ISHIGHERSHOUSER
                            ? `./generated-fir/${item._id}`
                            : `./dashboard/generated-fir/${item._id}`,
                        }}
                        onClick={() => {
                          localStorage.setItem(
                            "selectedActDetails",
                            JSON.stringify(
                              actDatalocal(item.firDetail, actList)
                            )
                          );
                          localStorage.setItem(
                            "selectedFir",
                            JSON.stringify(item.firDetail)
                          );
                          localStorage.setItem(
                            "selectedFirId",
                            JSON.stringify(item._id)
                          );
                          localStorage.removeItem("selectedCaseStatus");
                        }}
                      >
                        <span className="tableRowTextUl">VIEW</span>
                      </Link>
                      <span
                        className="tableRowTextUl"
                        style={{ cursor: "pointer", marginLeft: 20 }}
                        onClick={() => {
                          localStorage.setItem(
                            "selectedFirId",
                            JSON.stringify(item._id)
                          );
                          localStorage.setItem(
                            "selectedFir",
                            JSON.stringify(item.firDetail)
                          );
                          displayDrawer();
                        }}
                      >
                        TRANSFER
                      </span>
                    </>
                  );
                },
              });
            }
          }
          break;
        case "CC NO / SC NO":
          columns.push({
            title: "CC NO / SC NO",
            render: (_i, item) => {
              return (
                <span className="tableRowText">{item?.courtCaseNo || ""}</span>
              );
            },
          });
          break;
        case "Disposal Type":
          columns.push({
            title: "Disposal Type",
            render: (_i, item) => {
              return (
                <span className="tableRowText">
                  {item?.isLokAdalatDisposal === false ? "Court" : "Lok Adalat"}
                </span>
              );
            },
          });
          break;
        case "Court Name":
          columns.push({
            title: "Court Name",
            render: (_i, item) => {
              return (
                <span className="tableRowText">{item?.courtName || ""}</span>
              );
            },
          });
          break;
        case "Nature of Disposal":
          columns.push({
            title: "Nature of Disposal",
            render: (_i, item) => {
              return (
                <span className="tableRowText">
                  {item?.isLokAdalatDisposal === false
                    ? item?.courtDisposalType || ""
                    : item?.lokAdalathDispoalType || ""}
                </span>
              );
            },
          });
          break;
        case "receivedAction":
          if (isZeroFir && receivedZeroFir) {
            columns.push({
              title: "Action",
              dataIndex: "receivedAction",
              rowKey: "receivedAction",
              render: (_i, item) => {
                return (
                  <>
                    {Number(draftCount) > 0 ? (
                      <span className="tableRowTextUl" onClick={warning}>
                        CONSUME
                      </span>
                    ) : (
                      <Link
                        to={{
                          pathname: props.ISHIGHERSHOUSER
                            ? `./generated-fir/${item._id}`
                            : `./dashboard/generated-fir/${item._id}`,
                        }}
                        onClick={() => [
                          localStorage.setItem(
                            "selectedFirId",
                            JSON.stringify(item._id)
                          ),
                          localStorage.removeItem("selectedCaseStatus"),
                          localStorage.setItem("isConsumed", true),
                        ]}
                      >
                        <span className="tableRowTextUl">CONSUME</span>
                      </Link>
                    )}
                    <span
                      className="tableRowTextUl"
                      style={{ cursor: "pointer", marginLeft: 20 }}
                      onClick={() => {
                        localStorage.setItem(
                          "selectedFirId",
                          JSON.stringify(item._id)
                        );
                        localStorage.setItem(
                          "selectedFir",
                          JSON.stringify(item.firDetail)
                        );
                        displayDrawer();
                      }}
                    >
                      FORWARD
                    </span>
                  </>
                );
              },
            });
          }
          break;
        default:
          break;
      }
    });

  let uniqueId = 0;
  const getTitleName = () => {
    let txt = "";
    // eslint-disable-next-line default-case
    switch (selectedWidgetStatus) {
      case "New":
        txt = "NEW FIR ASSIGNED";
        break;
      case "UI Cases":
        txt = "UI CASES";
        break;
      case "CC Nos Awaited":
        txt = "CC Numbers Awaited";
        break;
      case "Disposal":
        txt = "POLICE DISPOSAL";
        break;
      case "PT Cases":
        txt = "PT CASES";
        break;
      case "Trial of Cases for the day":
        txt = "TRIAL OF CASES FOR THE DAY";
        break;
      case "Total Cases":
        txt = "TOTAL CASES";
        break;
      case "Draft Cases":
        txt = "DRAFT CASE";
        break;
      case "Grave":
        txt = "Grave";
        break;
      case "Pocso":
        txt = "Posco Crimes";
        break;
      case "Ndps":
        txt = "Ndps Crimes";
        break;
      case "Crime Againest SC/ST":
        txt = "Crime Againest SC/ST";
        break;
      case "Crime Againest Woman":
        txt = "Crime Againest Woman";
        break;
    }
    return txt;
  };

  const displayDrawerContent = () => {
    // eslint-disable-next-line default-case
    switch (selectedWidgetStatus) {
      case "CC Nos Awaited":
        return (
          <UpdateChargeSheetStatus
            onCancel={onClose}
            isDashboard={true}
            loadData={visible}
            setIsFormSubmitted={setIsFormSubmitted}
          />
        );
      case "Disposal":
        return (
          <ReopeningOfCase
            onCancel={onClose}
            loadData={visible}
            reason={reason}
            setReason={setReason}
            editReopeningOfCaseObj={editReopeningOfCaseObj}
            setEditReopeningOfCaseObj={setEditReopeningOfCaseObj}
            setIsFormSubmitted={setIsFormSubmitted}
          />
        );
      case "Zero FIRs":
        return (
          <TransferOrForwardFIR
            setIsFormSubmitted={setIsFormSubmitted}
            isTransfered={registeredZeroFir ? true : false}
            setVisible={setVisible}
            getZeroFirList={getZeroFirList}
          />
        );
    }
  };

  const checkSelectedZeroFirType = (e) => {
    const selectedVal = e.target.value;
    setSelectedZeroFirType(selectedVal);
    if (selectedVal === "transferredZeroFirHistory") {
      dispatch(
        fetchTransferredZeroFIRHistory(
          `${config.getTransferredZeroFIRHistory}?psCode=${
            activeUser?.cctns_unit_id
          }&isDraft=${false}`
        )
      );
    } else if (selectedVal === "receivedZeroFirHistory") {
      dispatch(
        fetchReceivedZeroFIRHistory(
          `${config.getReceivedZeroFIRHistory}?psCode=${activeUser?.cctns_unit_id}`
        )
      );
    }
  };
  const firTotalCount = () => {
    let countDetails = [];
    if (
      selectedDashboard === "myPersonalInvestigation" ||
      activeUser.isHigherOfficerView
    ) {
      countDetails = higherfirList.data;
    } else {
      countDetails = dashboardDetails;
    }
    const higherFirListCount =
      !isEmpty(countDetails) && !!countDetails
        ? countDetails.find((item) => item?.caseStatus === selectedCaseStatus)
        : {};
    return higherFirListCount;
  };

  const displayTable = (dataList, columns) => (
    <div style={{ backgroundColor: "white", height: "100%" }}>
      <TableWrapper
        dataSource={dataList}
        columns={columns}
        rowKey={(record) => {
          if (Object.isExtensible(record)) {
            if (!record._uniqueId) record._uniqueId = ++uniqueId;
            return record.__uniqueId;
          }
        }}
        pagination={{
          showSizeChanger: true,
          pageSizeOptions: ["50", "100", "150", "200", "250", "300"],
          onChange: (page, pageSize) => onTabChange(page, pageSize),
          current: page,
          pageSize: pageSize,
          total:
            selectedDashboard === "grave-crimes" ||
            selectedYear !== "" ||
            (activeUser.isHigherOfficerView &&
              selectedCaseStatus === "Disposal")
              ? setPageNumber()
              : firTotalCount()?.caseCount,
        }}
        style={{ bordeRadius: 5 }}
        showSorterTooltip={false}
        size="small"
      />
    </div>
  );

  const setPageNumber = () => {
    let count;
    let txt = "";
    if (selectedDashboard !== "jurisdiction-dashboard") {
      switch (selectedWidgetStatus) {
        case "Grave":
          txt = "grave";
          break;
        case "Pocso":
          txt = "pocso";
          break;
        case "Ndps":
          txt = "ndps";
          break;
        case "Crime Against SC/ST":
          txt = "crimeSCST";
          break;
        case "Crime Against Women":
          txt = "crimeWomen";
          break;
        case "Bodily_Grave":
          txt = "bodily";
          break;
        case "Property_Grave":
          txt = "property";
          break;
        case "Cyber_Crime":
          txt = "cyberCrime";
          break;
        default:
          txt = "grave";
      }
      if (txt !== "grave") {
        count = graveCrimeCount?.data?.counts[txt];
      } else {
        count =
          graveCrimeCount?.data?.counts?.bodily +
          graveCrimeCount?.data?.counts?.crimeSCST +
          graveCrimeCount?.data?.counts?.crimeWomen +
          graveCrimeCount?.data?.counts?.cyberCrime +
          graveCrimeCount?.data?.counts?.ndps +
          graveCrimeCount?.data?.counts?.pocso +
          graveCrimeCount?.data?.counts?.property;
      }
    } else if (
      selectedCaseStatus === "Disposal" &&
      storedUser?.isPersnolized === false
    ) {
      let setData = higherfirList?.data;
      let disposalType;
      if (isArray(setData)) {
        setData?.map((s) => {
          if (disposalFlag !== "police_disposal") {
            if (s["caseStatus"] === "Disposal True Count") {
              disposalType = s["caseCount"];
            }
          } else {
            if (s["caseStatus"] === "Disposal False Count") {
              disposalType = s["caseCount"];
            }
          }
        });
        count = disposalType;
      }
    } else {
      const caseCount = [...caseCountList];
      let selectedYearCount;
      caseCount.some((data) => {
        const getYear = selectedYear === data._id;
        if (getYear) {
          selectedYearCount = data?.Count;
        }
      });
      count = selectedYearCount;
    }
    return count;
  };

  useEffect(() => {
    let url;
    const firType = caseStatus === "Zero FIRs" ? "Zero" : "Regular";
    if (
      !isEmpty(selectedCaseStatus) &&
      selectedCaseStatus !== "Draft Cases" &&
      selectedCaseStatus !== "Zero FIRs"
    ) {
      if (
        selectedIo === ALL &&
        selectedDashboard !== "myPersonalInvestigation"
      ) {
        if(!activeUser?.ecopsv2_role.includes("SHO")) {
          url = `${config?.getRecentFirList}/?psCode=${
            activeUser?.cctns_working_unit_id
          }&caseStatus=${selectedCaseStatus}&firType=${firType}&isDraft=${false}&userName=${activeUser?.pao_code}&page=1&limit=50`;
        } else {
          url = `${config?.getRecentFirList}/?psCode=${
            activeUser?.cctns_working_unit_id
          }&caseStatus=${selectedCaseStatus}&firType=${firType}&isDraft=${false}&page=1&limit=50`;
        
        }
       } else if (selectedDashboard !== "myPersonalInvestigation") {
        url = `${config?.getRecentFirList}/?userName=${selectedIo}&psCode=${
          activeUser?.cctns_working_unit_id
        }&caseStatus=${selectedCaseStatus}&firType=${firType}&isDraft=${false}&page=1&limit=50`;
      }
      dispatch(fetchFIRList(url));
    }
  }, [selectedIo]);

  const onIoSelect = (paocode) => {
    setSelectedIo(paocode);
  };

  const getDatesParms = () => {
    if (props?.ISHIGHERSHOUSER) {
      const { fromDate = null, toDate = null } =
        !isEmpty(betweenDates) && isPlainObject(betweenDates)
          ? betweenDates
          : {};

      return (!isEmpty(fromDate) || fromDate === "") && !isEmpty(toDate)
        ? `&fromDate=${fromDate}&toDate=${toDate}`
        : "";
    }
    return "";
  };

  const onTabChange = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
    setCaseStatus(selectedCaseStatus);
    const paoCode = activeUser?.pao_code;
    const firType = caseStatus === "Zero FIRs" ? "Zero" : "Regular";
    const baseUrl = config.getRecentFirList;
    const datesParms = getDatesParms();
    const HigherSHOBaseUrl = `${baseUrl}/?psCode=${psData}&caseStatus=${caseStatus}&firType=${firType}${datesParms}&page=${page}&limit=${pageSize}`;
    const nonSHOBaseUrl = `${baseUrl}/?userName=${paoCode}&psCode=${activeUser?.cctns_working_unit_id}&caseStatus=${caseStatus}${datesParms}&page=${page}&limit=${pageSize}`;
    let url;
    if (!IS_HIGHER_SHO_USER) {
      url = nonSHOBaseUrl;
    } else {
      url = HigherSHOBaseUrl;
    }
    if (caseStatus === "New") {
      dispatch(fetchFIRList(`${url}&isDraft=${false}`));
    } else if (caseStatus === "UI Cases") {
      if (selectedYear === "") {
        dispatch(
          fetchFIRList(`${url}&page=${page}&limit=${pageSize}&isDraft=${false}`)
        );
      } else {
        dispatch(
          fetchFIRList(
            `${url}&page=${page}&limit=${pageSize}&isDraft=${false}&year=${selectedYear}`
          )
        );
      }
    } else if (caseStatus === "Disposal") {
      dispatch(
        fetchFIRList(`${url}&page=${page}&limit=${pageSize}&&isDraft=${false}`)
      );
    } else if (caseStatus === "Total Cases") {
      if (selectedYear === "") {
        dispatch(
          fetchFIRList(`${url}&page=${page}&limit=${pageSize}&isDraft=${false}`)
        );
      } else {
        dispatch(
          fetchFIRList(
            `${url}&page=${page}&limit=${pageSize}&isDraft=${false}&year=${selectedYear}`
          )
        );
      }
    } else if (caseStatus === "Zero FIRs") {
      dispatch(
        fetchFIRList(
          `${baseUrl}/?psCode=${psData}&page=${page}&limit=${pageSize}&isDraft=${false}&firType=${firType}${datesParms}`
        )
      );
    } else if (caseStatus === "CC Nos Awaited") {
      dispatch(
        fetchFIRList(`${url}&page=${page}&limit=${pageSize}&isDraft=${false}`)
      );
    } else if (caseStatus === "PT Cases") {
      if (selectedYear === "") {
        dispatch(
          fetchFIRList(`${url}&page=${page}&limit=${pageSize}&isDraft=${false}`)
        );
      } else {
        dispatch(
          fetchFIRList(
            `${url}&page=${page}&limit=${pageSize}&isDraft=${false}&year=${selectedYear}`
          )
        );
      }
    } else if (caseStatus === "Trial of Cases for the day") {
      dispatch(
        fetchFIRList(`${url}&page=${page}&limit=${pageSize}&isDraft=${false}`)
      );
    } else if (selectedDashboard === "grave-crimes") {
      let payload = {
        ecopsv2_unit_id: activeUser?.ecopsv2_unit_id,
        ecopsv2_role: activeUser?.ecopsv2_role,
        ecopsv2_hierarchy_key: activeUser?.ecopsv2_hierarchy_key,
        pao_code: activeUser?.pao_code,
        search_ps_code: psData,
        counts: true,
        dsr_category_type: true,
        category_type: true,
        from_date: betweenDates?.fromDate ? betweenDates?.fromDate : "",
        to_date: betweenDates?.toDate
          ? betweenDates?.toDate
          : today.format(DATE_FORMAT_MM),
        page: page,
        limit: pageSize,
        higherOfficer: true,
        graveType: selectedCaseStatus,
      };
      dispatch(getGraveCrimeCount(config?.getGraveCrimeCount, payload));
      dispatch(getGraveList(config?.fetchGravecrimeData, payload));
    } else {
      dispatch(
        fetchFIRList(
          `${baseUrl}/?psCode=${psData}&caseStatus=${selectedCaseStatus}&page=${page}&limit=${pageSize}&firType=${firType}&isDraft=${false}`
        )
      );
      dispatch(
        fetchHigherFIRList(
          `${config.getCaseMetricsByEMail}/?psCode=${psData}&page=${page}&limit=${pageSize}&higherOfficer=true`
        )
      );
    }
  };

  const displayTableContents = () => {
    if (isZeroFir) {
      if (registeredZeroFir || receivedZeroFir) {
        return selectedZeroFirType !== ""
          ? displayTable(zeroFirDataList, columns)
          : null;
      } else if (transferredZeroFirHistory || receivedZeroFirHistory) {
        return selectedZeroFirType !== ""
          ? displayTable(
              zeroFirDataList,
              historyTableColumsConfig(
                historyTableColumnConfig,
                actList,
                unitList
              )
            )
          : null;
      }
    } else {
      if (isDisposal === true && disposalType === false) {
        return displayTable(Police_disposal, columns);
      } else if (disposalType === true) {
        if (disposalFlag === "police_disposal") {
          if (
            IS_HIGHER_SHO_USER &&
            isDisposal === true &&
            storedUser?.isPersnolized === false
          ) {
            return displayTable(data, columns);
          } else {
            return displayTable(Police_disposal, columns);
          }
        } else if (disposalFlag === "court_disposal") {
          if (
            IS_HIGHER_SHO_USER &&
            isDisposal === true &&
            storedUser?.isPersnolized === false
          ) {
            return displayTable(data, columns);
          } else {
            return displayTable(court_disposal, columns);
          }
        } else {
          const filterData = searchData?.filter(
            (item) => item?.courtDisposalType === disposalFlag
          );
          return displayTable(filterData, columns);
        }
      } else {
        return displayTable(searchData, columns);
      }
    }
  };
  const tableStyle = [
    "Special Cases",
    "Pocso",
    "Ndps",
    "Crime Against SC/ST",
    "Crime Against Women",
    "Grave",
  ].includes(selectedCaseStatus);

  return (
    <FirsContainer $paddingTop={tableStyle ? "10px" : "30px"}>
      {isFetching ? (
        <Loader />
      ) : (
        <Row gutter={24}>
          {isPTCase || isModalOpen || firData.caseStatus !== "PT Cases" ? (
            <Modal
              title="Select Charge Sheet Number"
              visible={isModalOpen}
              onOk={() => {
                setIsModalOpen(false);
                setChargeSheetDate(null);
              }}
              onCancel={() => {
                setIsModalOpen(false);
                setChargeSheetDate(null);
              }}
              footer={[
                <Space>
                  <Button
                    onClick={() => {
                      setIsModalOpen(false);
                      setChargeSheetDate(null);
                    }}
                  >
                    Close
                  </Button>
                  <Link
                    to={{
                      pathname: props.ISHIGHERSHOUSER
                        ? `./Fir/${firData._id}`
                        : `./dashboard/fir/${firData._id}`,
                    }}
                    onClick={() => {
                      const obj =
                        !isEmpty(chargesheetDropDown) &&
                        chargesheetDropDown.find(
                          (data) =>
                            data?.updateChargesheetId === chargeSheetDate
                        );
                      localStorage.setItem(
                        "selectedCourtAndProsecution",
                        !!chargeSheetDate === true
                          ? JSON.stringify(obj)
                          : JSON.stringify({})
                      );
                      localStorage.setItem(
                        "selectedActDetails",
                        JSON.stringify(actDatalocal(firData.firDetail, actList))
                      );
                      localStorage.setItem(
                        "selectedFir",
                        JSON.stringify(firData.firDetail)
                      );
                      localStorage.setItem(
                        "selectedFirId",
                        JSON.stringify(firData._id)
                      );
                      localStorage.setItem(
                        "iscourtAndProsecutionVisible",
                        !!chargeSheetDate === true ? true : false
                      );
                      dispatch(
                        setChargeSheetData({
                          courtName: obj?.courtName,
                          courtCaseNo: obj?.courtCaseNo,
                        })
                      );
                      dispatch(hideSideMenu());
                      dispatch(resetAccidentInformationReport());
                      setIsModalOpen(false);
                      setChargeSheetDate(null);
                    }}
                  >
                    <Button
                      disabled={isNull(chargeSheetDate)}
                      style={{
                        backgroundColor: isNull(chargeSheetDate)
                          ? "rgba(0,0,0,.04)"
                          : "#02599C",
                        borderColor: isNull(chargeSheetDate)
                          ? "#d9d9d9"
                          : "#02599C",
                        color: isNull(chargeSheetDate)
                          ? "rgba(0,0,0,.25)"
                          : "#fff",
                      }}
                    >
                      Continue
                    </Button>
                  </Link>
                </Space>,
              ]}
            >
              <Select
                showSearch
                placeholder="Select a Charge Sheet Number"
                style={{ width: 240 }}
                onSelect={(data) => setChargeSheetDate(data)}
                value={chargeSheetDate}
                options={!isEmpty(chargesheetDropDown) && chargesheetDropDown}
              />
            </Modal>
          ) : null}
          <Col
            span={
              showYearTable && isDisposal === false ? 20 : isDisposal ? 17 : 24
            }
          >
            {data && !isGrave ? (
              <div style={{ marginBottom: 7 }}>
                <HomeOutlined
                  style={{
                    color: "#083E69",
                    fontSize: 20,
                    float: "left",
                    marginTop: 3,
                  }}
                  onClick={() => {
                    dispatch(updateDashboardData(true));
                    dispatch(updateSelectedWidget(""));
                  }}
                />
                {!isZeroFir ? (
                  <Row gutter={24}>
                    <>
                      {isDisposal ? (
                        <>
                          <Col span={6}>
                            <label
                              className="pageTitle"
                              style={{
                                marginLeft: 5,
                                position: "absolute",
                                marginTop: 3,
                              }}
                            >
                              {disposalTittle?.tittle} :{" "}
                              {!IS_HIGHER_SHO_USER
                                ? disposalTittle?.count
                                : firTotalCount()?.caseCount}
                            </label>
                          </Col>
                        </>
                      ) : (
                        <Col span={6}>
                          <label
                            className="pageTitle"
                            style={{
                              marginLeft: 5,
                              position: "absolute",
                              marginTop: 3,
                              width: 200,
                            }}
                          >
                            {getTitleName()} :{" "}
                            {!IS_HIGHER_SHO_USER
                              ? data?.length
                              : firTotalCount()?.caseCount}
                          </label>
                        </Col>
                      )}
                    </>
                    {selectedWidgetStatus !== "Draft Cases" &&
                    selectedDashboard !== "myPersonalInvestigation" ? (
                      <>
                        <Col span={4}>
                          <Search
                            onChange={onSearch}
                            allowClear
                            placeholder="Search By Cr.No"
                            value={searchText}
                            style={{ paddingLeft: "20px", width: 180 }}
                            enterButton={null}
                          />
                        </Col>

                        {activeUser.ecopsv2_role.includes(
                          "STATION HOUSE OFFICER (SHO)"
                        ) && (
                          <Col span={8} offset={4}>
                            <Space>
                              <Typography.Text>IO Names :</Typography.Text>
                              <Select
                                suffixIcon={
                                  <CaretDownOutlined className="dropDownIcon" />
                                }
                                placeholder="Select IO Name"
                                showSearch
                                onSelect={onIoSelect}
                                defaultValue={ALL}
                                value={selectedIo}
                                style={{ width: 180 }}
                                filterOption={(input, option) =>
                                  option.props?.label
                                    .toLowerCase()
                                    .includes(input.toLowerCase())
                                }
                              >
                                <Option key={ALL} value={ALL} label={ALL}>
                                  All
                                </Option>
                                {isArray(ioListDetails) &&
                                  !isEmpty(ioListDetails) &&
                                  ioListDetails.map((item, index) => (
                                    <Option
                                      key={index}
                                      value={item.paoCode}
                                      label={item.label}
                                    >
                                      {item.label}
                                    </Option>
                                  ))}
                              </Select>
                            </Space>
                          </Col>
                        )}
                      </>
                    ) : null}
                  </Row>
                ) : (
                  <Form form={form} layout="vertical">
                    <Form.Item name="zeroFirField">
                      <Radio.Group
                        name="radiogroup"
                        defaultValue={selectedZeroFirType}
                        onChange={checkSelectedZeroFirType}
                        style={{ marginLeft: 20 }}
                      >
                        <Radio value="registeredZeroFir">
                          REGISTERED ZERO FIR'S
                        </Radio>
                        <Radio value="receivedZeroFir">
                          RECEIVED ZERO FIR'S
                        </Radio>
                        <Radio value="transferredZeroFirHistory">
                          TRANSFERRED ZERO FIR'S HISTORY
                        </Radio>
                        <Radio value="receivedZeroFirHistory">
                          RECEIVED ZERO FIR'S HISTORY
                        </Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Form>
                )}
              </div>
            ) : null}
            {displayTableContents()}
          </Col>
          {showYearTable && isDisposal === false ? (
            <Col span={4} style={{ padding: 0 }}>
              <WidgetsWrapper style={{ marginTop: 42 }}>
                <CaseCount
                  taskList={caseCountList}
                  caseStatus={selectedWidgetStatus}
                />
              </WidgetsWrapper>
            </Col>
          ) : null}
          {isDisposal ? (
            <Col span={7}>
              <WidgetsWrapper
                style={{ marginTop: 60, width: "100%", padding: 0 }}
              >
                <DisposalCaseCount
                  Police_disposal={Police_disposal?.length}
                  court_disposal={court_disposal?.length}
                  nature_disposal={nature_disposal}
                  setDisposalFlag={setDisposalFlag}
                  setDisposalType={setDisposalType}
                  setDisposalTittle={setDisposalTittle}
                  ISHIGHERSHOUSER={props.ISHIGHERSHOUSER}
                />
              </WidgetsWrapper>
            </Col>
          ) : null}
        </Row>
      )}
      <Drawer
        placement="right"
        size="large"
        onClose={onClose}
        visible={visible}
        width="80%"
      >
        {displayDrawerContent()}
      </Drawer>
    </FirsContainer>
  );
}
