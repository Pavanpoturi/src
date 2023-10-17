import { useState } from "react";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import { Form, Table, Row } from "antd";
import Loader from "@components/utility/loader";
import { isEmpty } from "lodash";
import { config } from "@config/site.config";
import { DATE_YY_MM_DD, DATE_FORMAT } from "@containers/FirDetails/fir-util";
import reportsActions from "@redux/reports/actions";
import ContentHeader from "./ContentHeader";
import { FSLStatusReportContainer } from "./styles";
import { loadState } from "@lib/helpers/localStorage";

export default function FSLStatusReport() {
  const [form] = Form.useForm();
  const { fetchFSLReports } = reportsActions;
  const dispatch = useDispatch();
  const currentUserData = loadState("currentUser");

  const { FSLReports, isFetching } = useSelector((state) => state.Reports);
  const [selectedFromDate, setSelectedFromDate] = useState("");
  const [selectedToDate, setSelectedToDate] = useState("");
  const [selectedFSLStatus, setSelectedFSLStatus] = useState("");
  const disableButton =
    selectedFromDate === "" ||
    selectedToDate === "" ||
    selectedFSLStatus === "";

  const fromDateChange = (date, _dateString) => {
    setSelectedFromDate(moment(date).format(DATE_YY_MM_DD));
  };

  const toDateChange = (date, _dateString) => {
    setSelectedToDate(moment(date).format(DATE_YY_MM_DD));
  };

  const submitReport = async () => {
    const values = await form.validateFields();
    const fromDate = moment(values?.fromDate).format(DATE_FORMAT);
    const toDate = moment(values?.toDate).format(DATE_FORMAT);
    if (selectedFSLStatus === "All") {
      dispatch(
        fetchFSLReports(
          `${config.getFSLCasesInfo}?fromdate=${fromDate}&todate=${toDate}&statecode=TS&ecopsv2_unit_id=${currentUserData.ecopsv2_unit_id}&ecopsv2_hierarchy_key=${currentUserData.ecopsv2_hierarchy_key}&ecopsv2_role=${currentUserData.ecopsv2_role}`
        )
      );
    } else {
      dispatch(
        fetchFSLReports(
          `${config.getFSLCasesInfo}?fromdate=${fromDate}&todate=${toDate}&statecode=TS&ecopsv2_unit_id=${currentUserData.ecopsv2_unit_id}&ecopsv2_hierarchy_key=${currentUserData.ecopsv2_hierarchy_key}&ecopsv2_role=${currentUserData.ecopsv2_role}&casestatus=${selectedFSLStatus}`
        )
      );
    }
  };

  let uniqueId = 0;
  const columnTitles = [
    "S.No",
    "PS",
    "FIR NO.",
    "FIR Date",
    "FSL NO",
    "Receipt Date",
    "Case Status",
    "Despatch Date",
    "Messenger Name",
    "NO of Parcels",
    "FSL Address",
  ];

  const columns = [];

  columnTitles &&
    columnTitles.forEach((headTitle, _index) => {
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
        case "PS":
          columns.push({
            title: "PS",
            dataIndex: "PS",
            rowKey: "PS",
            render: (_i, item) => {
              return (
                <span className="tableRowText">{item?.policestation}</span>
              );
            },
          });
          break;
        case "FIR NO.":
          columns.push({
            title: "FIR NO.",
            dataIndex: "FIR NO.",
            rowKey: "FIR NO.",
            render: (_i, item) => {
              return <span className="tableRowText">{item?.firno}</span>;
            },
          });
          break;
        case "FIR Date":
          columns.push({
            title: "FIR Date",
            dataIndex: "FIR Date",
            rowKey: "FIR Date",
            render: (_i, item) => {
              return (
                <span className="tableRowText">
                  {moment(item?.firdate).format(DATE_FORMAT)}
                </span>
              );
            },
          });
          break;
        case "FSL NO":
          columns.push({
            title: "FSL NO",
            dataIndex: "FSLNo",
            rowKey: "FSLNo",
            render: (_i, item) => {
              return <span className="tableRowText">{item?.fslid}</span>;
            },
          });
          break;
        case "Receipt Date":
          columns.push({
            title: "Receipt Date",
            dataIndex: "receiptDate",
            rowKey: "receiptDate",
            render: (_i, item) => {
              return (
                <span className="tableRowText">
                  {item?.entrydate
                    ? moment(item?.entrydate).format(DATE_FORMAT)
                    : "--"}
                </span>
              );
            },
          });
          break;
        case "Case Status":
          columns.push({
            title: "Case Status",
            dataIndex: "caseStatus",
            rowKey: "caseStatus",
            render: (_i, item) => {
              return <span className="tableRowText">{item?.casestatus}</span>;
            },
          });
          break;
        case "Despatch Date":
          columns.push({
            title: "Despatch Date",
            dataIndex: "despatchDate",
            rowKey: "despatchDate",
            render: (_i, item) => {
              return (
                <span className="tableRowText">
                  {item?.despdate
                    ? moment(item?.despdate).format(DATE_FORMAT)
                    : "--"}
                </span>
              );
            },
          });
          break;
        case "Messenger Name":
          columns.push({
            title: "Messenger Name",
            dataIndex: "messengerName",
            rowKey: "messengerName",
            render: (_i, item) => {
              return (
                <span className="tableRowText">
                  {item?.messengername || "--"}
                </span>
              );
            },
          });
          break;
        case "NO of Parcels":
          columns.push({
            title: "NO of Parcels",
            dataIndex: "noOfParcels",
            rowKey: "noOfParcels",
            render: (_i, item) => {
              return (
                <span className="tableRowText">
                  {item?.noofparcels || "--"}
                </span>
              );
            },
          });
          break;
        case "FSL Address":
          columns.push({
            title: "FSL Address",
            dataIndex: "FSLAddress",
            rowKey: "FSLAddress",
            render: (_i, item) => {
              return (
                <span className="tableRowText">{item?.fsladdress || "--"}</span>
              );
            },
          });
          break;
        default:
          break;
      }
    });

  return (
    <FSLStatusReportContainer>
      <ContentHeader
        headerTitle="FSL REPORTS"
        submitReport={submitReport}
        disabled={disableButton}
        form={form}
        setSelectedFSLStatus={setSelectedFSLStatus}
        fromDateChange={fromDateChange}
        toDateChange={toDateChange}
        selectedFromDate={selectedFromDate}
      />
      {isFetching ? (
        <Loader />
      ) : (
        !isEmpty(FSLReports) && (
          <Row gutter={24} style={{ paddingLeft: 10, marginTop: 15 }}>
            <Table
              dataSource={FSLReports}
              columns={columns}
              rowKey={(record) => {
                if (!record.__uniqueId) record.__uniqueId = ++uniqueId;
                return record.__uniqueId;
              }}
              style={{ bordeRadius: 5, width: "99%" }}
              showSorterTooltip={false}
              pagination={true}
            />
          </Row>
        )
      )}
    </FSLStatusReportContainer>
  );
}
