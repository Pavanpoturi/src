import { EyeFilled, EditFilled } from "@ant-design/icons";
import moment from "moment";
import TableWrapper from "@containers/Tables/AntTables/AntTables.styles";
import { TableWidgetWrapper } from "@containers/FirDetails/CommonSections/TableWidget.styles";
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
  isModalVisible,
}) {
  const recordSelected =
    dataSource.length > 1
      ? `${dataSource.length} Record(s) Added`
      : `${dataSource.length} Record Added`;

  const columns = [
    {
      title: "PP Name",
      dataIndex: "ppName",
      rowKey: "ppName",
      render: (ppName) => (
        <span className="tableRowText wordWrap">{ppName}</span>
      ),
    },
    {
      title: "Court Name",
      dataIndex: "courtName",
      rowKey: "courtName",
      render: (courtName) => (
        <span className="tableRowText wordWrap">{courtName}</span>
      ),
    },
    {
      title: "Date of sending CD file to PP",
      dataIndex: "dateOfSendingCD",
      rowKey: "dateOfSendingCD",
      render: (dateOfSendingCD) => (
        <span className="tableRowText wordWrap">
          {dateOfSendingCD ? moment(dateOfSendingCD).format(DATE_FORMAT) : ""}
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
                isModalVisible(false);
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
                isModalVisible(false);
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
