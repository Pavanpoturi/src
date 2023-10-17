import { useState, useEffect } from "react";
import Loader from "@components/utility/loader";
import { Row, Col, Table, Popover } from "antd";
import { reportTableConfig } from "../tableConfig";
import { useSelector, useDispatch } from "react-redux";
import reportsActions from "@redux/reports/actions";
import TableWrapper from "@containers/Tables/AntTables/AntTables.styles";
import { DATE_YY_MM_DD } from "@containers/FirDetails/fir-util";
import { config } from "@config/site.config";
import moment from "moment";
import { isEmpty } from "lodash";
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

export default function MissingCases() {
  const dispatch = useDispatch();
  const [selectedDate, setSelectedDate] = useState("");
  const [SelectedDefaultDate, setSelectedDefaultDate] = useState(new Date());
  const { fetchMissingCases, downloadReports } = reportsActions;
  const { updatedPsCode, dropDownData } = useSelector((state) => state.FIR);
  const { missngCases, isFetching } = useSelector((state) => state.Reports);
  const { actList } = useSelector((state) => state.MasterData);
  const { getActList } = masterDataActions;
  const currentUser = loadState("currentUser");
  const getpsCode = dropDownData.map((data) => data?.ps_code).join(",");
  const psCode = !isEmpty(updatedPsCode) ? updatedPsCode : getpsCode;
  const { data } = missngCases;
  const userRole = [IS_SHO, IS_IO, IS_INVESTIGATION_OFFICER];
  const IS_HIGHER_SHO_USER = !userRole?.includes(currentUser?.ecopsv2_role)

  useEffect(() => {
    if (selectedDate !== "") {
      console.log(selectedDate, "selectedDate");
      getMissingCases(selectedDate);
    }
  }, [psCode]);
  const getMissingCases = (date) => {
    if (IS_HIGHER_SHO_USER && !!currentUser?.isIo === false) {
      dispatch(
        fetchMissingCases(
          `${config.getMissingCases}?psCode=${psCode}&date=${date}&higherOfficer=true`
        )
      );
    } else {
      dispatch(
        fetchMissingCases(
          `${config.getMissingCases}?psCode=${currentUser?.cctns_unit_id}&date=${date}`
        )
      );
    }
  };

  const downloadAsXls = () => {
    if (IS_HIGHER_SHO_USER && !!currentUser?.isIo === false) {
      dispatch(
        downloadReports(
          `${config.downloadMissingCases}?psCode=${psCode}&date=${selectedDate}&higherOfficer=true`,
          "DSR_Missing_Report"
        )
      );
    } else {
      dispatch(
        downloadReports(
          `${config.downloadMissingCases}?psCode=${currentUser?.cctns_unit_id}&date=${selectedDate}`
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
      getMissingCases(dateFormat);
    }
  };

  const tableConfig = reportTableConfig.find(
    (c) => c.typeName === "Missing Cases"
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
        case "Cr.No & Sec.Of.Law":
          columns.push({
            title: "Cr.No & Sec.Of.Law",
            dataIndex: "Cr.No",
            rowKey: "Cr.No",
            render: (_i, item) => {
              const firDetail = item?.firDetail;
              const actsAndSections = firDetail?.actsAndSections;
              return (
                <>
                  {firDetail?.firNum}
                  {", "}
                  {getActsAndSectionsDetails(actsAndSections, actList)}
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
            render: (i, item) => {
              const firDetail = item?.firDetail;
              return (
                <span className="tableRowText" key={i}>
                  {getDateOfOccurence(firDetail)}
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
        case "Name of Complainant":
          columns.push({
            title: "Name of Complainant",
            dataIndex: "Name of Complainant",
            rowKey: "Name of Complainant",
            render: (i, item) => {
              const personalDetails =
                item?.complainantDetailPerson?.personalDetails;
              const firstName = personalDetails?.name
                ? personalDetails?.name
                : "";
              const lastName = personalDetails?.surname
                ? personalDetails?.surname
                : "";
              return (
                <span className="tableRowText" key={i}>
                  {`${firstName} ${lastName}`}
                </span>
              );
            },
          });
          break;
        case "Name of Missing Person":
          columns.push({
            title: "Name of Missing Person",
            dataIndex: "Name of Missing Person",
            rowKey: "Name of Missing Person",
            render: (i, item) => (
              <span className="tableRowText" key={i}>
                {item?.missingPerson?.personalDetails?.name}
              </span>
            ),
          });
          break;
        case "Age":
          columns.push({
            title: "Age",
            dataIndex: "Age",
            rowKey: "Age",
            render: (_i, item) => (
              <span className="tableRowText">
                {item?.missingPerson?.personalDetails?.age}
              </span>
            ),
          });
          break;
        case "Brief Facts":
          columns.push({
            title: "Brief Facts",
            dataIndex: "Brief Facts",
            rowKey: "Brief Facts",
            render: (i, item) => {
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
                    key={i}
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
        case "IO Name & Rank":
          columns.push({
            title: "IO Name & Rank",
            dataIndex: "IO Name & Rank",
            rowKey: "IO Name & Rank",
            render: (i, item) => {
              const briefFacts = item?.firDetail?.briefFacts;
              return (
                <span className="tableRowText" key={i}>
                  {(briefFacts?.ioAssignedName
                    ? briefFacts?.ioAssignedName
                    : "") +
                    (briefFacts?.ioAssignedRank
                      ? briefFacts?.ioAssignedRank
                      : "")}
                </span>
              );
            },
          });
          break;
        case "Missing Person Photo":
          columns.push({
            title: "Missing Person Photo",
            dataIndex: "Missing Person Photo",
            rowKey: "Missing Person Photo",
            render: (_i, item) => (
              <img
                src={item?.missingPerson?.media[0]?.url}
                width="25%"
                alt=""
              />
            ),
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

  const deadBodyColumns = [];
  let s_no = 0;

  const tableContent = reportTableConfig.find(
    (c) => c.typeName === "Unknown Dead Bodies"
  )?.data;

  tableContent &&
    tableContent.map((headTitle, _index) => {
      switch (headTitle) {
        case "S.No":
          deadBodyColumns.push({
            title: "S.No",
            dataIndex: "S.NO",
            rowKey: "S.NO",
            render: (i, item) => (
              <span className="tableRowText" key={i}>
                {item.__uniqueId}
              </span>
            ),
          });
          break;
        case "Cr.No & Sec.Of.Law":
          deadBodyColumns.push({
            title: "Cr.No & Sec.Of.Law",
            dataIndex: "Cr.No & Sec.Of.Law",
            rowKey: "Cr.No & Sec.Of.Law",
            render: (_i, item) => {
              const firDetail = item?.firDetail;
              const actsAndSections = firDetail?.actsAndSections;
              return (
                <>
                  {firDetail?.firNum}
                  {", "}
                  {getActsAndSectionsDetails(actsAndSections, actList)}
                </>
              );
            },
          });
          break;
        case "Date of Occ.":
          deadBodyColumns.push({
            title: "Date of Occ.",
            dataIndex: "Date of Occ.",
            rowKey: "Date of Occ.",
            render: (i, item) => {
              const firDetail = item?.firDetail;
              return (
                <span className="tableRowText" key={i}>
                  {getDateOfOccurence(firDetail)}
                </span>
              );
            },
          });
          break;
        case "Place of Occ.":
          deadBodyColumns.push({
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
        case "Name of Complainant":
          deadBodyColumns.push({
            title: "Name of Complainant",
            dataIndex: "Name of Complainant",
            rowKey: "Name of Complainant",
            render: (i, item) => {
              const personalDetails =
                item?.complainantDetailPerson?.personalDetails;
              const firstName = personalDetails?.name
                ? personalDetails?.name
                : "";
              const lastName = personalDetails?.surname
                ? personalDetails?.surname
                : "";
              return (
                <span className="tableRowText" key={i}>
                  {`${firstName} ${lastName}`}
                </span>
              );
            },
          });
          break;
        case "Unknown DeadBody Details":
          deadBodyColumns.push({
            title: "Unknown DeadBody Details",
            dataIndex: "Unknown DeadBody Details",
            rowKey: "Unknown DeadBody Details",
            render: (_i, _item) => <span className="tableRowText" />,
          });
          break;
        case "Age":
          deadBodyColumns.push({
            title: "Age",
            dataIndex: "Age",
            rowKey: "Age",
            render: (i, item) => {
              return <span className="tableRowText" key={i} />;
            },
          });
          break;
        case "Brief Facts":
          deadBodyColumns.push({
            title: "Brief Facts",
            dataIndex: "Brief Facts",
            rowKey: "Brief Facts",
            render: (i, item) => {
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
                    key={i}
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
        case "IO Name & Rank":
          deadBodyColumns.push({
            title: "IO Name & Rank",
            dataIndex: "IO Name & Rank",
            rowKey: "IO Name & Rank",
            render: (i, item) => {
              const briefFacts = item?.firDetail?.briefFacts;
              return (
                <span className="tableRowText" key={i}>
                  {(briefFacts?.ioAssignedName
                    ? `${briefFacts?.ioAssignedName} - `
                    : "") +
                    (briefFacts?.ioAssignedRank
                      ? briefFacts?.ioAssignedRank
                      : "")}
                </span>
              );
            },
          });
          break;
        case "Unknown DeadBody Photo":
          deadBodyColumns.push({
            title: "Unknown DeadBody Photo",
            dataIndex: "Unknown DeadBody Photo",
            rowKey: "Unknown DeadBody Photo",
            render: (_i, item) => (
              <img
                src={
                  item?.crimescenes?.crimeClassification?.deadBody
                    ?.photographs[0]
                }
                width="25%"
                alt=""
              />
            ),
          });
          break;
        case "District":
          IS_HIGHER_SHO_USER &&
            deadBodyColumns.push({
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
            deadBodyColumns.push({
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

  return (
    <>
      <ContentHeader
        headerTitle="Missing Persons"
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
            {getReportDate("Missing Persons Details on:", selectedDate)}
            <Row gutter={24} style={{ paddingLeft: 10 }}>
              <Table
                dataSource={data?.missngCases}
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
                  Unknown Dead Bodies
                </h3>
              </Col>
              <Col span={24}>
                <TableWrapper
                  dataSource={data?.deadbodyCases}
                  columns={deadBodyColumns}
                  scroll={{
                    x: 1300,
                  }}
                  rowKey={(record) => {
                    if (!record.__uniqueId) record.__uniqueId = ++s_no;
                    return record.__uniqueId;
                  }}
                  style={{ bordeRadius: 5, width: "99%" }}
                  showSorterTooltip={false}
                  pagination={false}
                  size="small"
                />
              </Col>
            </Row>
          </>
        )
      )}
    </>
  );
}
