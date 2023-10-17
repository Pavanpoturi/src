import StickerWidget from "../../Widgets/Sticker/StickerWidget";
import WidgetsWrapper from "../../Widgets/WidgetsWrapper";
import { variables } from "@assets/styles/variables";
import { Row, Col } from "antd";
import { useSelector, useDispatch } from "react-redux";
import firActions from "@redux/fir/actions";
import dashboardActions from "@redux/dashboard/actions";
import { useState, useEffect } from "react";
import { isUndefined, isEmpty, isArray } from "lodash";
import { Link } from "react-router-dom";
import { tableConfig } from "../const";
import FilterComponent from "../../Reports/DSRReports/FilterComponent";
import config from "../../../config/site.config";
import Firs from "../../Firs";
import { loadStringState, loadState } from "@lib/helpers/localStorage";
import {
  DATE_FORMAT_MM,
  IS_SHO,
  IS_INVESTIGATION_OFFICER,
  IS_IO,
} from "../../FirDetails/fir-util";
import moment from "moment";

const { getSelectedDashboard } = dashboardActions;
const { updateSelectedWidget, getGraveList, getGraveCrimeCount } = firActions;

export default function GraveCrimes() {
  const dispatch = useDispatch();
  const [graveData, setGraveData] = useState([]);
  const [specialCasesData, setSpecialCasesData] = useState([]);
  const [isDate, setIsDate] = useState({});
  const { dropDownData, updatedPsCode, graveCrimeCount } = useSelector(
    (state) => state.FIR
  );
  const today = moment();
  const getpsCode = dropDownData.map((data) => data?.ps_code).join(",");
  const selectedCaseStatus = loadStringState("selectedCaseStatus");
  const { currentUser } = useSelector((state) => state.Auth);
  const storedUser = loadState("currentUser");
  const activeUser = currentUser.employee_name ? currentUser : storedUser;
  const userRole = [IS_SHO, IS_IO, IS_INVESTIGATION_OFFICER];
  const IS_HIGHER_SHO_USER = !userRole?.includes(activeUser?.ecopsv2_role);
  let columns = [];
  let psCode =
    !isUndefined(updatedPsCode) || !isEmpty(updatedPsCode)
      ? updatedPsCode
      : getpsCode;

  const handleIsDate = (data) => {
    setIsDate(data);
  };

  const { data } = graveCrimeCount;
  useEffect(() => {
    if (data?.counts) {
      const caseKeys = [
        "bodily",
        "property",
        "cyberCrime",
        "crimeSCST",
        "crimeWomen",
        "ndps",
        "pocso",
      ];
      let array = caseKeys.map((key) => ({
        type: key,
        number: data.counts[key],
      }));
      setSpecialCasesData(array);
    }
  }, [data]);

  useEffect(() => {
    getCaseDetails("Grave");
  }, [updatedPsCode]);

  useEffect(() => {
    dispatch(getSelectedDashboard("grave-crimes"));
  }, []);

  const dashboardStatsTransform =
    specialCasesData &&
    specialCasesData.map(function (item) {
      let fontColor = "";
      let key = "";
      let title = "";
      let fontSize = "";
      let keyWord = "";
      // eslint-disable-next-line default-case
      switch (item?.type) {
        case "bodily":
          fontColor = "#D69B24";
          key = "Bodily_Grave";
          title = "Bodily_Grave";
          keyWord = "Bodily Grave";
          break;
        case "property":
          fontColor = "#D69B24";
          key = "Property_Grave";
          title = "Property_Grave";
          keyWord = "Property Grave";
          break;
        case "cyberCrime":
          fontColor = "#D69B24";
          key = "new-firs";
          title = "Cyber_Crime";
          keyWord = "Cyber Crime";
          break;
        case "pocso":
          fontColor = "#D69B24";
          key = "disposed";
          title = "Pocso";
          keyWord = "POCSO Cases";
          break;
        case "ndps":
          fontColor = "#D69B24";
          key = "pt-cases";
          title = "Ndps";
          keyWord = "NDPS Cases";
          break;
        case "crimeSCST":
          fontColor = "#D69B24";
          key = "trial-of-cases";
          title = "Crime Against SC/ST";
          keyWord = "Crime Against SC/ST";
          break;
        case "crimeWomen":
          fontColor = "#D69B24";
          key = "total-cases";
          title = "Crime Against Women";
          keyWord = "Crime Against Women";
          break;
      }
      return {
        key: key,
        title: title,
        caseStatus: item,
        value: item.number,
        fontColor: fontColor,
        isGraveCrime: true,
        bgColor: variables.WHITE_COLOR,
        keyWord: keyWord,
      };
    });

  tableConfig &&
    tableConfig.map((headTitle) => {
      switch (headTitle) {
        case "Cr.No.":
          columns.push({
            title: <div style={{ minWidth: 80 }}>Cr.No.</div>,
            dataIndex: "crimeNumber",
            key: "crimeNumber",
            showSorterTooltip: false,
            backgroundColor: "blue",
            render: (i, item) => (
              <span className="">
                <Link>
                  <span
                    className="tableRowTextUl"
                    style={{ cursor: "pointer" }}
                  >
                    123/2022
                  </span>
                </Link>
              </span>
            ),
          });
          break;
        case "sectionOfLaw":
          columns.push({
            title: "Sec.of Law",
            dataIndex: "sectionsofLaw",
            rowKey: "sectionsofLaw",
            render: (_i, item) => {
              const actsAndSections = "300CrPC";
              return <span className="tableRowText">{actsAndSections}</span>;
            },
          });
          break;
        case "dateOfOccurence":
          columns.push({
            title: "Date of Occurrence",
            dataIndex: "dateOfOccurence",
            rowKey: "dateOfOccurence",
            render: (_i, item) => {
              return <span className="tableRowText">{"20/03/2023"}</span>;
            },
          });
          break;
        case "dateOfReport":
          columns.push({
            title: "Date of Report",
            dataIndex: "dateOfReport",
            rowKey: "dateOfReport",
            render: (_i, item) => {
              const firDate = "20/03/2023";
              return <span className="tableRowText">{firDate}</span>;
            },
          });
          break;
        case "unitName":
          columns.push({
            title: "PS Name",
            dataIndex: "unitName",
            rowKey: "unitName",
            render: (_i, item) => {
              const psName = "Madhapur";
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
              // const wardColony = item?.firDetail?.placeOfOccurence?.wardColony;
              return <span className="tableRowText">{"Madhapur"}</span>;
            },
          });
          break;
        case "IOName":
          columns.push({
            title: "IO Name",
            dataIndex: "IOName",
            rowKey: "IOName",
            render: (_i, item) => {
              return <span className="tableRowText">{"Sateesh Kumar"}</span>;
            },
          });
          break;
        case "nameAndRankOfIO":
          columns.push({
            title: "Date of Occurrence",
            dataIndex: "dateOfOccurence",
            rowKey: "dateOfOccurence",
            render: (_i, item) => {
              return <span className="tableRowText">{"Sateesh Kumar"}</span>;
            },
          });
          break;
        case "actions":
          columns.push({
            title: "ACTIONS",
            dataIndex: "complainant",
            rowKey: "complainant",
            render: (i, item) => (
              <span className="">
                <Link>
                  <span className="tableRowTextUl">VIEW</span>
                </Link>
                <Link>
                  <span
                    className="tableRowTextUl"
                    style={{ cursor: "pointer", marginLeft: 20 }}
                  >
                    Advisory Memo
                  </span>
                </Link>
              </span>
            ),
          });
          break;
      }
    });

  const getCaseDetails = (caseStatus) => {
    let payload = {
      ecopsv2_unit_id: activeUser?.ecopsv2_unit_id,
      ecopsv2_role: activeUser?.ecopsv2_role,
      ecopsv2_hierarchy_key: activeUser?.ecopsv2_hierarchy_key,
      pao_code: activeUser?.pao_code,
      search_ps_code: psCode,
      counts: true,
      dsr_category_type: true,
      category_type: true,
      from_date: !isEmpty(isDate) ? isDate?.fromDate : "",
      to_date: !isEmpty(isDate) ? isDate?.toDate : today.format(DATE_FORMAT_MM),
      graveType: caseStatus,
      page: 1,
      limit: 50,
      higherOfficer: true,
    };
    dispatch(getGraveCrimeCount(config?.getGraveCrimeCount, payload));
    dispatch(getGraveList(config?.fetchGravecrimeData, payload));
    localStorage.setItem("selectedCaseStatus", caseStatus);
    dispatch(updateSelectedWidget(caseStatus));
  };

  return (
    <div>
      <div
        style={{
          backgroundColor: "#8CB6D6",
        }}
      >
        <div class="forms">
          <FilterComponent isDate={handleIsDate} />
        </div>

        <Row
          gutter={5}
          justify="center"
          style={{ backgroundColor: "#8CB6D6", maxHeight: 130 }}
        >
          {dashboardStatsTransform?.map(
            (item, idx) =>
              item && (
                <Col
                  style={{
                    marginBottom: 15,
                    marginTop: 5,
                    width: "12%",
                    marginLeft: "1%",
                  }}
                  key={idx}
                >
                  <WidgetsWrapper
                    style={{
                      marginTop: 3,
                      width: "100%",
                      padding: 0,
                    }}
                  >
                    {item?.value > 0 ? (
                      <div
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          getCaseDetails(item?.title);
                        }}
                      >
                        <StickerWidget
                          value={item?.value}
                          title={item?.keyWord}
                          fontColor={item?.fontColor}
                          bgColor={
                            selectedCaseStatus === item?.title
                              ? "#FCFBDD"
                              : item?.bgColor
                          }
                          isGraveCrime={item?.isGraveCrime}
                          isGraveHeight={true}
                        />
                      </div>
                    ) : (
                      <StickerWidget
                        value={item?.value}
                        title={item?.keyWord}
                        fontColor={item?.fontColor}
                        bgColor={item?.bgColor}
                        isGraveCrime={item?.isGraveCrime}
                        isGraveHeight={true}
                      />
                    )}
                  </WidgetsWrapper>
                </Col>
              )
          )}
        </Row>
      </div>
      <Firs
        style={{ marginTop: "-20px" }}
        ISHIGHERSHOUSER={IS_HIGHER_SHO_USER}
      />
    </div>
  );
}
