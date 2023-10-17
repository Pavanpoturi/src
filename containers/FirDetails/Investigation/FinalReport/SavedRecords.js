import TableWrapper from "@containers/Tables/AntTables/AntTables.styles";
import moment from "moment";
import { DATE_FORMAT } from "@containers/FirDetails/fir-util";

const styles = {
  widgetPageStyle: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    overflow: "hidden",
    marginBottom: 10,
    marginTop: 10,
  },
};

export default function SavedRecords({
  dataSource,
  editDetails,
  setViewDetails,
  selectedRecord,
  onPrintFinalReport,
}) {
  const dataSourceData = dataSource?.filter(
    (data) =>
      // !!data?.finalReport?.finalReportNo === true &&// as finalReportNo is not mandatory
      !!data?.finalReport?.finalReportDate === true
  );
  const columns = [
    {
      title: "FR No",
      dataIndex: "finalReportNo",
      rowKey: "finalReportNo",
      render: (_i, item) => (
        <span className="tableRowText">{item?.finalReport?.finalReportNo}</span>
      ),
    },
    {
      title: "FR Date",
      dataIndex: "finalReportDate",
      rowKey: "finalReportDate",
      render: (_i, item) => (
        <span className="tableRowText">
          {item?.finalReport?.finalReportDate
            ? moment(item?.finalReport?.finalReportDate).format(DATE_FORMAT)
            : ""}
        </span>
      ),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      rowKey: "actions",
      render: (i, item) => {
        return (
          <div key={i} style={styles.widgetPageStyle}>
            <div
              style={{
                cursor: "pointer",
                color: "#02599C",
                textDecoration: "underline",
              }}
              onClick={() => {
                editDetails(item);
                setViewDetails(true);
              }}
            >
              View
            </div>
            {item.isDraft ? (
              <div
                style={{
                  cursor: "pointer",
                  color: "#02599C",
                  marginLeft: 5,
                  textDecoration: "underline",
                }}
                onClick={() => {
                  editDetails(item);
                  setViewDetails(false);
                }}
              >
                Edit
              </div>
            ) : null}
            <div
              style={{
                cursor: "pointer",
                color: "#02599C",
                marginLeft: 5,
                textDecoration: "underline",
              }}
              onClick={() => onPrintFinalReport(item)}
            >
              {item.isDraft ? "Print Draft" : "Print"}
            </div>
          </div>
        );
      },
    },
  ];

  let uniqueId = 0;

  return (
    <TableWrapper
      rowClassName={(record, _index) =>
        selectedRecord?._id === record?._id ? "editMode" : ""
      }
      dataSource={dataSourceData}
      columns={columns}
      pagination={false}
      rowKey={(record) => {
        if (!record.__uniqueId) record.__uniqueId = ++uniqueId;
        return record.__uniqueId;
      }}
      size="small"
    />
  );
}
