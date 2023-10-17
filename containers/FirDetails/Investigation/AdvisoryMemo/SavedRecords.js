import { EyeFilled, EditFilled } from "@ant-design/icons";
import TableWrapper from "@containers/Tables/AntTables/AntTables.styles";
import { TableWidgetWrapper } from "@containers/FirDetails/CommonSections/TableWidget.styles";
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
  recordVisible,
}) {
  const recordSelected =
    dataSource.length > 1
      ? `${dataSource.length} Record(s) Added`
      : `${dataSource.length} Record Added`;

  const columns = [
    {
      title: "Present IO Name and Rank",
      dataIndex: "presentIONameAndRank",
      rowKey: "presentIONameAndRank",
      render: (presentIONameAndRank) => (
        <span className="tableRowText wordWrap">
          {presentIONameAndRank || ""}
        </span>
      ),
    },
    {
      title: "Date of Re-assignment",
      dataIndex: "dateOfReAssignment",
      rowKey: "dateOfReAssignment",
      render: (dateOfReAssignment) => (
        <span className="tableRowText wordWrap">
          {dateOfReAssignment
            ? moment(dateOfReAssignment).format(DATE_FORMAT)
            : ""}
        </span>
      ),
    },
    {
      title: "Name and Rank of New IO",
      dataIndex: "newIONameAndRank",
      rowKey: "newIONameAndRank",
      render: (newIONameAndRank, item) => (
        <span className="tableRowText wordWrap">{`${item?.newIOName} ${
          item?.newIORank ? `(${item.newIORank})` : ""
        }`}</span>
      ),
    },
    {
      title: "Reason for Re-assigning",
      dataIndex: "reasonForReAssigning",
      rowKey: "reasonForReAssigning",
      render: (reasonForReAssigning) => (
        <span className="tableRowText wordWrap">
          {reasonForReAssigning || ""}
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
              style={{ cursor: "pointer", color: "#02599C" }}
              onClick={() => {
                editDetails(item);
                setViewDetails(true);
                recordVisible(false);
              }}
            >
              <EyeFilled style={{ marginRight: 5 }} />
              View
            </div>
            <div
              style={{ cursor: "pointer", color: "#02599C", marginLeft: 10 }}
              onClick={() => {
                editDetails(item);
                setViewDetails(false);
                recordVisible(false);
              }}
            >
              <EditFilled style={{ marginRight: 5 }} />
              Edit
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <TableWidgetWrapper>
      <div className="widgetContainer">
        <div style={{ marginBottom: 10, marginLeft: 10 }}>
          <p>{recordSelected}</p>
        </div>
        <TableWrapper
          rowClassName={(record, _index) =>
            selectedRecord?._id === record._id ? "editMode" : ""
          }
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          rowKey={(obj) => obj._id}
          size="small"
        />
      </div>
    </TableWidgetWrapper>
  );
}
