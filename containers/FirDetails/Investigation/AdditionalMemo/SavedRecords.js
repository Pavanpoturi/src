import TableWrapper from "@containers/Tables/AntTables/AntTables.styles";
import { TableWidgetWrapper } from "@containers/FirDetails/CommonSections/TableWidget.styles";
import moment from "moment";
import { DATE_TIME_FORMAT } from "@containers/FirDetails/fir-util";
import { loadState } from "@lib/helpers/localStorage";
import { EyeFilled, EditFilled } from "@ant-design/icons";

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
  recordVisible,
  editDetails,
  setViewDetails,
  selectedRecord,
}) {
  const crimeId = loadState("selectedFirId");
  const columns = [
    {
      title: "S. NO",
      dataIndex: "index",
      key: "index",
      render: (_value, _item, index) => (
        <span className="tableRowText wordWrap">{++index}</span>
      ),
    },
    {
      title: "Information Received Date",
      dataIndex: "informationReceivedDate",
      rowKey: "informationReceivedDate",
      render: (_i, item) => (
        <span className="tableRowText">
          {item?.informationReceivedDate
            ? moment(item?.informationReceivedDate).format(DATE_TIME_FORMAT)
            : ""}
        </span>
      ),
    },
    {
      title: "Additional Memo Date",
      dataIndex: "additionalMemoDate",
      rowKey: "additionalMemoDate",
      render: (_i, item) => (
        <span className="tableRowText">
          {item?.additionalMemoDate
            ? moment(item?.additionalMemoDate).format(DATE_TIME_FORMAT)
            : ""}
        </span>
      ),
    },
    {
      title: "Court Name",
      dataIndex: "courtName",
      rowKey: "courtName",
      render: (courtName) => (
        <span className="tableRowText wordWrap">
          {courtName ? courtName : ""}
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
                recordVisible && recordVisible(false);
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
                recordVisible && recordVisible(false);
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

  let uniqueId = 0;

  return (
    <TableWidgetWrapper>
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
      />
    </TableWidgetWrapper>
  );
}
