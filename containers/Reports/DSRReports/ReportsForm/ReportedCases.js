import { useState, useEffect } from "react";
import Loader from "@components/utility/loader";
import { Row, Col, Table, Popover } from "antd";
import { first, isEmpty, isUndefined, isArray, sumBy } from "lodash";
import { reportTableConfig } from "../tableConfig";
import { getPersonPersonalAddress } from "@containers/FirDetails/fir-util";
import { DATE_YY_MM_DD } from "@containers/FirDetails/fir-util";
import { useSelector, useDispatch } from "react-redux";
import reportsActions from "@redux/reports/actions";
import TableWrapper from "@containers/Tables/AntTables/AntTables.styles";
import { config } from "@config/site.config";
import moment from "moment";
import { loadState } from "@lib/helpers/localStorage";
import masterDataActions from "@redux/masterData/actions";
import ContentHeader from "../ContentHeader";
import { getDateOfOccurence, getActsAndSectionsDetails } from "../../../const";
import { getReportDate } from "../const";
import {
  IS_IO,
  IS_SHO,
  IS_INVESTIGATION_OFFICER,
} from "@containers/FirDetails/fir-util";

export default function ReportedCases() {
  const dispatch = useDispatch();
  const [selectedDate, setSelectedDate] = useState("");
  const [SelectedDefaultDate, setSelectedDefaultDate] = useState(new Date());
  const { fetchReportedCases, downloadReports } = reportsActions;
  const { updatedPsCode, dropDownData } = useSelector((state) => state.FIR);
  const { reportedCases, isFetching } = useSelector((state) => state.Reports);
  const { actList } = useSelector((state) => state.MasterData);
  const { getActList } = masterDataActions;
  const currentUser = loadState("currentUser");
  const getpsCode = dropDownData.map((data) => data?.ps_code).join(",");
  const psCode = !isEmpty(updatedPsCode) ? updatedPsCode : getpsCode;
  const { data } = reportedCases;
  const userRole = [IS_SHO, IS_IO, IS_INVESTIGATION_OFFICER];
  const IS_HIGHER_SHO_USER = !userRole?.includes(currentUser?.ecopsv2_role)

  useEffect(() => {
    if (selectedDate !== "") {
      console.log(selectedDate, "selectedDate");
      getReportedCases(selectedDate);
    }
  }, [psCode]);
  const getReportedCases = (date) => {
    if (IS_HIGHER_SHO_USER && !!currentUser?.isIo === false) {
      dispatch(
        fetchReportedCases(
          `${config.getReportedCases}?psCode=${psCode}&date=${date}&higherOfficer=true`
        )
      );
    } else {
      dispatch(
        fetchReportedCases(
          `${config.getReportedCases}?psCode=${currentUser?.cctns_unit_id}&date=${date}`
        )
      );
    }
  };

  const downloadAsXls = () => {
    if (IS_HIGHER_SHO_USER && !!currentUser?.isIo === false) {
      dispatch(
        downloadReports(
          `${config.downloadReportedCases}?psCode=${psCode}&date=${selectedDate}&higherOfficer=true`,
          "DSR_Reported_Cases_Report"
        )
      );
    } else {
      dispatch(
        downloadReports(
          `${config.downloadReportedCases}?psCode=${currentUser?.cctns_unit_id}&date=${selectedDate}`,
          "DSR_Reported_Cases_Report"
        )
      );
    }
  };

  useEffect(() => {
    const url = config.getMasterData;
    dispatch(getActList(`${url}/ACT`));
  }, []);

  useEffect(() => {
    const date = new Date()
    const dateFormat = moment(date).format(DATE_YY_MM_DD);
    onChange(date, dateFormat)
  }, []);
  const onChange = (date, dateString) => {
    if (dateString !== "") {
      setSelectedDefaultDate(date)
      const dateFormat = moment(date).format(DATE_YY_MM_DD);
      setSelectedDate(dateFormat);
      getReportedCases(dateFormat);
    }
  };

  const tableConfig = reportTableConfig.find(
    (c) => c.typeName === "cases"
  )?.data;

  let uniqueId = 0;
  const columns = [];

  tableConfig &&
    tableConfig.map((headTitle, _index) => {
      switch (headTitle) {
        case "S.No":
          columns.push({
            title: "S.No",
            dataIndex: "S.NO",
            rowKey: "S.NO",
            render: (_i, item) => (
              <span className="tableRowText">{item.__uniqueId}</span>
            ),
          });
          break;
        case "Cr.No & Sec.of Law, Crime Head,Gravity of Case":
          columns.push({
            title: "Cr.No & Sec. of Law, Crime Head, Gravity of Case",
            dataIndex: "CR.NO",
            rowKey: "CR.NO",
            render: (_i, item) => {
              const firDetail = item?.firDetail;
              const actsAndSections = firDetail?.actsAndSections;
              const majorMinorClassification =
                firDetail?.majorMinorClassification;
              return (
                <>
                  {firDetail?.firNum}
                  {", "}
                  {getActsAndSectionsDetails(actsAndSections, actList)}
                  {", "}
                  {majorMinorClassification[0]
                    ? majorMinorClassification[0].majorHead +
                    ", " +
                    majorMinorClassification[0].minorHead
                    : ""}
                  {", "}
                  {firDetail?.gravity ? firDetail?.gravity : ""}
                </>
              );
            },
          });
          break;
        case "Date of Occ.":
          columns.push({
            title: "Date of Occ.",
            dataIndex: "Date of Occ.",
            rowKey: "Date of Occ.",
            render: (_i, item) => {
              return (
                <span className="tableRowText">
                  {getDateOfOccurence(item?.firDetail)}
                </span>
              );
            },
          });
          break;
        case "Place of Occ.":
          columns.push({
            title: "Place of Occ.",
            dataIndex: "Place of Occ.",
            rowKey: "Place of Occ.",
            render: (i, item) => {
              const placeOfOccurence = item?.firDetail?.placeOfOccurence;
              return (
                <span className="tableRowText" key={i}>
                  {placeOfOccurence
                    ? placeOfOccurence?.wardColony
                      ? placeOfOccurence?.wardColony
                      : ""
                    : ""}
                </span>
              );
            },
          });
          break;
        case "Brief Facts":
          columns.push({
            title: "Brief Facts",
            dataIndex: "Brief Facts",
            rowKey: "Brief Facts",
            render: (_i, item) => {
              const briefFacts = item?.firDetail?.briefFacts;
              const content = (
                <div style={{ whiteSpace: "break-spaces" }}>
                  {briefFacts?.factsOfComplainant}
                </div>
              );
              return (
                <Popover
                  content={content}
                  title="Brief Facts"
                  trigger="hover"
                  overlayStyle={{
                    width: "50vw",
                  }}
                >
                  <div
                    className="tableRowText"
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: 100,
                      cursor: "pointer",
                    }}
                  >
                    {briefFacts?.factsOfComplainant}
                  </div>
                </Popover>
              );
            },
          });
          break;
        case "Accused Name & Address":
          columns.push({
            title: "Accused Name & Address",
            dataIndex: "Accused Name & Address",
            rowKey: "Accused Name& Address",
            render: (_value, item, _i) => {
              const accusedDetailsPerson = item?.accusedDetailsPerson;
              return (
                <div style={{ maxHeight: 200, overflowY: "auto" }}>
                  {!isEmpty(accusedDetailsPerson) &&
                    accusedDetailsPerson.map((person, i) => {
                      const personalDetails =
                        !isUndefined(person?.personalDetails) &&
                        person?.personalDetails;
                      const presentAddress =
                        !isUndefined(person?.presentAddress) &&
                        person?.presentAddress;
                      const name =
                        (personalDetails?.name ? personalDetails?.name : "") +
                        " " +
                        (personalDetails?.surname
                          ? personalDetails?.surname
                          : "");
                      const address = getPersonPersonalAddress(presentAddress);
                      return (
                        <div
                          className="tableRowText wordWrap"
                          key={i}
                          style={{
                            minWidth: 200,
                            marginBottom: 3,
                            display: "flex",
                          }}
                        >
                          {name !== " " ? (
                            <>
                              <div style={{ width: 20, minWidth: 20 }}>
                                {i + 1} -
                              </div>
                              <div
                                style={{ marginLeft: 5 }}
                              >{`${name}, ${address}`}</div>
                            </>
                          ) : null}
                        </div>
                      );
                    })}
                </div>
              );
            },
          });
          break;
        case "Complainant Name & Address":
          columns.push({
            title: "Complainant Name & Address",
            dataIndex: "Complainant Name & Address",
            rowKey: "Complainant Name & Address",
            render: (_value, item, _i) => {
              const complainantDetailPerson =
                !isEmpty(item?.complainantDetailPerson) &&
                first(item?.complainantDetailPerson);
              const personalDetails =
                !isUndefined(complainantDetailPerson) &&
                complainantDetailPerson?.personalDetails;
              const presentAddress =
                !isUndefined(complainantDetailPerson) &&
                complainantDetailPerson?.presentAddress;
              const name =
                (personalDetails?.name ? personalDetails?.name : "") +
                " " +
                (personalDetails?.surname ? personalDetails?.surname : "");
              const address = getPersonPersonalAddress(presentAddress);
              return (
                <div
                  className="tableRowText wordWrap"
                  style={{ maxHeight: 200, overflowY: "auto" }}
                >
                  {`${name}, ${address}`}
                </div>
              );
            },
          });
          break;
        case "Prop.Lost(Rs.)":
          columns.push({
            title: "Prop.Lost(Rs.)",
            dataIndex: "Prop.Lost(Rs.)",
            rowKey: "Prop.Lost(Rs.)",
            render: (_i, item) => {
              const isPropertyOffence =
                item?.firDetail?.crimeType === "Property Offence";
              const stolenProperties = item?.stolenProperties;
              const stolenValues =
                isArray(stolenProperties) &&
                stolenProperties.length > 0 &&
                stolenProperties.filter(
                  (s) =>
                    s.propertyStatus === "Lost" || s.propertyStatus === "Stolen"
                );
              const estimatedValue =
                stolenValues.length === 1
                  ? parseInt(first(stolenValues)?.estimateValue)
                  : sumBy(stolenValues, function (o) {
                    return parseInt(o?.estimateValue);
                  });
              return (
                <div className="tableRowText" style={{ textAlign: "center" }}>
                  {isPropertyOffence ? estimatedValue : ""}
                </div>
              );
            },
          });
          break;
        case "Prop.Recd(Rs.)":
          columns.push({
            title: "Prop.Recd(Rs.)",
            dataIndex: "Prop.Recd(Rs.)",
            rowKey: "Prop.Recd(Rs.)",
            render: (_i, item) => {
              const isPropertyOffence =
                item?.firDetail?.crimeType === "Property Offence";
              const stolenProperties = item?.stolenProperties;
              const stolenValues =
                isArray(stolenProperties) &&
                stolenProperties.length > 0 &&
                stolenProperties.filter(
                  (s) =>
                    s.propertyStatus === "Lost" || s.propertyStatus === "Stolen"
                );
              const recoveredValue =
                stolenValues.length === 1
                  ? parseInt(first(stolenValues)?.recoveredValue)
                  : sumBy(stolenValues, function (o) {
                    return parseInt(o?.recoveredValue);
                  });
              return (
                <div className="tableRowText" style={{ textAlign: "center" }}>
                  {isPropertyOffence ? recoveredValue : ""}
                </div>
              );
            },
          });
          break;
        case "District":
          IS_HIGHER_SHO_USER &&
            columns.push({
              title: "District Name",
              dataIndex: "District Name",
              rowKey: "DistrictName",
              render: (_i, item) => {
                return (
                  <div className="tableRowText" style={{ textAlign: "center" }}>
                    {item?.firDetail?.district}
                  </div>)
              },
            });
          break;
        case "PS Name":
          IS_HIGHER_SHO_USER &&
            columns.push({
              title: "PS Name",
              dataIndex: "PS Name",
              rowKey: "PSName",
              render: (_i, item) => {
                return (
                  <div className="tableRowText" style={{ textAlign: "center" }}>
                    {item?.firDetail?.psName?.split(" PS(")[0]}
                  </div>)
              },
            });
          break;
        default:
          break;
      }
    });

  const columnsSummary = [];
  let s_no = 0;

  const tableConfigSummary = reportTableConfig.find(
    (c) => c.typeName === "Summary"
  )?.data;

  tableConfigSummary &&
    tableConfigSummary.map((headTitle) => {
      switch (headTitle) {
        case "S.No":
          columnsSummary.push({
            title: "S.No",
            dataIndex: "S.NO",
            rowKey: "S.NO",
            render: (_i, item) => (
              <span className="tableRowText">{item.__uniqueId}</span>
            ),
          });
          break;
        case "Crime Head":
          columnsSummary.push({
            title: "Crime Head",
            dataIndex: "Crime Head",
            rowKey: "Crime Head",
            render: (_i, item) => {
              return (
                <span className="tableRowText">
                  {item?.crimeHead === "undefined" ? "Nil" : item?.crimeHead}
                </span>
              );
            },
          });
          break;
        case "No.Of Cases Reported":
          columnsSummary.push({
            title: "No.Of Cases Reported",
            dataIndex: "No.Of Cases Reported",
            rowKey: "No.Of Cases Reported",
            render: (_i, item) => (
              <span className="tableRowText">{item?.noOfCases}</span>
            ),
          });
          break;
        default:
          break;
      }
    });

  return (
    <>
      <ContentHeader
        headerTitle="Reported Cases"
        onChange={onChange}
        downloadAsXls={downloadAsXls}
        disabled={selectedDate === ""}
        defaultDate={SelectedDefaultDate}
      />
      {isFetching ? (
        <Loader />
      ) : (
        selectedDate !== "" &&
        selectedDate !== "Invalid date" && (
          <>
            {getReportDate("Reported Cases on:", selectedDate)}
            <Row gutter={24} style={{ paddingLeft: 10 }}>
              <Table
                dataSource={data?.cases}
                columns={columns}
                rowKey={(record) => {
                  if (!record.__uniqueId) record.__uniqueId = ++uniqueId;
                  return record.__uniqueId;
                }}
                style={{ bordeRadius: 5, width: "99%" }}
                showSorterTooltip={false}
                pagination={false}
                scroll={{
                  x: 1300,
                }}
              />
            </Row>
            <Row gutter={24} style={{ marginTop: 15, overflow: "scroll" }}>
              <Col span={24} style={{ marginBottom: 10 }}>
                <h3 className="pageTitle" style={{ color: "#454647" }}>
                  Summary
                </h3>
              </Col>
              <Col span={24}>
                <TableWrapper
                  dataSource={data?.summary}
                  columns={columnsSummary}
                  scroll={{
                    x: 1300,
                  }}
                  pagination={false}
                  rowKey={(record) => {
                    if (!record.__uniqueId) {
                      record.__uniqueId = ++s_no;
                    }
                    return record.__uniqueId;
                  }}
                  size="small"
                  style={{ bordeRadius: 5, width: "99%" }}
                  showSorterTooltip={false}
                  summary={(pageData) => {
                    let totalNoOfCases = 0;
                    pageData.forEach(({ noOfCases }) => {
                      totalNoOfCases += noOfCases;
                    });
                    return data?.summary?.length > 0 ? (
                      <Table.Summary.Row>
                        <Table.Summary.Cell />
                        <Table.Summary.Cell>
                          <span className="tableRowText">Total</span>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell colSpan={2}>
                          <span className="tableRowText">{totalNoOfCases}</span>
                        </Table.Summary.Cell>
                      </Table.Summary.Row>
                    ) : (
                      ""
                    );
                  }}
                />
              </Col>
            </Row>
          </>
        )
      )}
    </>
  );
}
