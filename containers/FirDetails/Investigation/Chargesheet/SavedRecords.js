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
  onPrintChargesheet,
}) {
  const columns = [
    {
      title: "CS No",
      dataIndex: "chargeSheetNo",
      rowKey: "chargeSheetNo",
      render: (_i, item) => (
        <span className="tableRowText">{item?.chargeSheet?.chargeSheetNo}</span>
      ),
    },
    {
      title: "CS Date",
      dataIndex: "chargeSheetDate",
      rowKey: "chargeSheetDate",
      render: (_i, item) => (
        <span className="tableRowText">
          {item?.chargeSheet?.chargeSheetDate
            ? moment(item?.chargeSheet?.chargeSheetDate).format(DATE_FORMAT)
            : ""}
        </span>
      ),
    },
    {
      title: "CS Type",
      dataIndex: "chargeSheetType",
      rowKey: "chargeSheetType",
      render: (_i, item) => (
        <span className="tableRowText">
          {item?.chargeSheet?.chargeSheetType}
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
              onClick={() => onPrintChargesheet(item)}
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
      dataSource={dataSource}
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
