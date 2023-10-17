import { useState, useEffect } from "react";
import Loader from "@components/utility/loader";
import { Row, Col } from "antd";
import { isEmpty } from "lodash";
import { reportTableConfig } from "../tableConfig";
import { useSelector, useDispatch } from "react-redux";
import reportsActions from "@redux/reports/actions";
import TableWrapper from "@containers/Tables/AntTables/AntTables.styles";
import { DATE_YY_MM_DD } from "@containers/FirDetails/fir-util";
import { config } from "@config/site.config";
import moment from "moment";
import ColumnGroup from "antd/lib/table/ColumnGroup";
import Column from "antd/lib/table/Column";
import { loadState } from "@lib/helpers/localStorage";
import ContentHeader from "../ContentHeader";
import { getReportDate } from "../const";
import {
  IS_IO,
  IS_SHO,
  IS_INVESTIGATION_OFFICER,
} from "@containers/FirDetails/fir-util";

export default function CaseStatus() {
  const dispatch = useDispatch();
  const [selectedDate, setSelectedDate] = useState("");
  const [SelectedDefaultDate, setSelectedDefaultDate] = useState(new Date());
  const { fetchCasesStatus, downloadReports } = reportsActions;
  const { caseStatus, isFetching } = useSelector((state) => state.Reports);
  const { updatedPsCode, dropDownData } = useSelector((state) => state.FIR);
  const currentUser = loadState("currentUser");
  const getpsCode = dropDownData.map((data) => data?.ps_code).join(",");
  const psCode = !isEmpty(updatedPsCode) ? updatedPsCode : getpsCode;
  const { data } = caseStatus;
  const userRole = [IS_SHO, IS_IO, IS_INVESTIGATION_OFFICER];
  const IS_HIGHER_SHO_USER = !userRole?.includes(currentUser?.ecopsv2_role)

  useEffect(() => {
    if (selectedDate !== "") {
      console.log(selectedDate, "selectedDate");
      getCasesStatus(selectedDate);
    }
  }, [psCode]);
  const getCasesStatus = (date) => {
    if (IS_HIGHER_SHO_USER && !!currentUser?.isIo === false) {
      dispatch(
        fetchCasesStatus(
          `${config.getCasesStatus}?psCode=${psCode}&date=${date}&higherOfficer=true`
        )
      );
    } else {
      dispatch(
        fetchCasesStatus(
          `${config.getCasesStatus}?psCode=${currentUser?.cctns_unit_id}&date=${date}`
        )
      );
    }
  };

  const downloadAsXls = () => {
    if (IS_HIGHER_SHO_USER && !!currentUser?.isIo === false) {
      dispatch(
        downloadReports(
          `${config.downloadCasesStatus}?psCode=${psCode}&date=${selectedDate}&higherOfficer=true`,
          "DSR_CaseStatus_Report"
        )
      );
    } else {
      dispatch(
        downloadReports(
          `${config.downloadCasesStatus}?psCode=${currentUser?.cctns_unit_id}&date=${selectedDate}`,
          "DSR_CaseStatus_Report"
        )
      );
    }
  };
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
      getCasesStatus(dateFormat);
    }
  };

  const tableConfig = reportTableConfig.find(
    (c) => c.typeName === "Case Status"
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
        case "No. of UI Cases":
          columns.push({
            title: "No. of UI Cases",
            dataIndex: "No.of UI Cases",
            rowKey: "No.of UI Cases",
            render: (_i, item) => (
              <span className="tableRowText">{item?.uiCases}</span>
            ),
          });
          break;
        case "No.of Cases Charged":
          columns.push({
            title: "No.of Cases Charged",
            dataIndex: "No.of Cases Charged",
            rowKey: "No.of Cases Charged.",
            render: (_i, item) => (
              <span className="tableRowText">{item?.charged}</span>
            ),
          });
          break;
        case "No. of PT Cases":
          columns.push({
            title: "No. of PT Cases",
            dataIndex: "No. of PT Cases",
            rowKey: "No. of PT Cases",
            render: (_i, item) => (
              <span className="tableRowText">{item?.ptCases}</span>
            ),
          });
          break;
        case "No. of Ref Cases":
          columns.push({
            title: "No. of Ref Cases",
            dataIndex: "No. of Ref Cases",
            rowKey: "No. of Ref Cases",
            render: (_i, item) => (
              <span className="tableRowText">{item?.refCases}</span>
            ),
          });
          break;
        case "No. of Court Disposals":
          columns.push({
            title: "No. of Court Disposals",
            dataIndex: "No. of Court Disposals",
            rowKey: "No. of Court Disposals",
            render: (_i, item) => (
              <span className="tableRowText">{item?.courtDisposals}</span>
            ),
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
        headerTitle="Case Status Details"
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
            {getReportDate("Case Details on:", selectedDate)}
            <Row gutter={24} style={{ paddingLeft: 10 }}>
              <TableWrapper
                dataSource={data?.caseStatus}
                columns={columns}
                rowKey={(record) => {
                  if (!record.__uniqueId) record.__uniqueId = ++uniqueId;
                  return record.__uniqueId;
                }}
                style={{ bordeRadius: 5, width: "99%" }}
                showSorterTooltip={false}
                pagination={false}
                size="small"
              />
            </Row>
            <Row gutter={24} style={{ marginTop: 15 }}>
              <Col span={24} style={{ marginBottom: 10 }}>
                <h3 className="pageTitle" style={{ color: "#454647" }}>
                  Reasons for UI
                </h3>
              </Col>
              <Col span={24}>
                <TableWrapper
                  dataSource={data?.reasonForUI}
                  pagination={false}
                  rowKey={(record) => {
                    if (!record.__uniqueId) record.__uniqueId = ++s_no;
                    return record.__uniqueId;
                  }}
                  style={{ bordeRadius: 5 }}
                  showSorterTooltip={false}
                  size="small"
                >
                  <Column
                    title="S.No"
                    dataIndex="__uniqueId"
                    key="__uniqueId"
                  />
                  <ColumnGroup
                    title={
                      <div>
                        PMEs<br></br>post-mortem examination
                      </div>
                    }
                  >
                    <Column
                      title="Pending"
                      dataIndex="pmePending"
                      key="pmePending"
                    />
                    <Column
                      title="Received"
                      dataIndex="pmeRecived"
                      key="pmeRecived"
                    />
                  </ColumnGroup>
                  <ColumnGroup
                    title={
                      <div>
                        MCs<br></br>medical certificate
                      </div>
                    }
                  >
                    <Column
                      title="Pending"
                      dataIndex="mcPending"
                      key="mcPending"
                    />
                    <Column
                      title="Received"
                      dataIndex="mcRecived"
                      key="mcRecived"
                    />
                  </ColumnGroup>
                  <ColumnGroup
                    title={
                      <div>
                        FSLs<br></br>Forensic science
                      </div>
                    }
                  >
                    <Column
                      title="Pending"
                      dataIndex="fslPending"
                      key="fslPending"
                    />
                    <Column
                      title="Received"
                      dataIndex="fslRecived"
                      key="fslRecived"
                    />
                  </ColumnGroup>
                  <ColumnGroup
                    title={
                      <div>
                        CC/SC/PRC No.s<br></br>cc number
                      </div>
                    }
                  >
                    <Column
                      title="Pending"
                      dataIndex="ccPending"
                      key="ccPending"
                    />
                    <Column
                      title="Received"
                      dataIndex="ccRecived"
                      key="ccRecived"
                    />
                  </ColumnGroup>
                  <ColumnGroup
                    title={
                      <div>
                        MVIs<br></br>Motor vehicle inspector collection of
                        evidence (scientific evidence)
                      </div>
                    }
                  >
                    <Column
                      title="Pending"
                      dataIndex="mviPending"
                      key="mviPending"
                    />
                    <Column
                      title="Received"
                      dataIndex="mviRecived"
                      key="mviRecived"
                    />
                  </ColumnGroup>
                  <ColumnGroup
                    title={
                      <div>
                        Others<br></br>(scientific evidence)
                      </div>
                    }
                  >
                    <Column
                      title="Pending"
                      dataIndex="otherPending"
                      key="otherPending"
                    />
                    <Column
                      title="Received"
                      dataIndex="otherRecived"
                      key="otherRecived"
                    />
                  </ColumnGroup>
                </TableWrapper>
              </Col>
            </Row>
          </>
        )
      )}
    </>
  );
}
