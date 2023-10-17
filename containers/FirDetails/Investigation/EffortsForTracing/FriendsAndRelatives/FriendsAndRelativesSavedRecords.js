import { EyeFilled, EditFilled } from "@ant-design/icons";
import moment from "moment";
import TableWrapper from "@containers/Tables/AntTables/AntTables.styles";
import { TableWidgetWrapper } from "@containers/FirDetails/CommonSections/TableWidget.styles";
import { DATE_FORMAT } from "@containers/FirDetails/fir-util";
import { getFileById } from "@containers/media-util";

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

export default function FriendsAndRelativesSavedRecords({
  dataSource,
  editDetails,
  setViewDetails,
  selectedRecord,
  setSelectedIndex,
}) {
  const recordSelected =
    dataSource.length > 1
      ? `${dataSource.length} Record(s) Added`
      : `${dataSource.length} Record Added`;

  const columns = [
    {
      title: "S.No",
      dataIndex: "",
      rowKey: "",
      render: (_propertyStatus, _item, i) => (
        <span className="tableRowText wordWrap">{i + 1}</span>
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      rowKey: "date",
      render: (date) => (
        <span className="tableRowText wordWrap">
          {date ? moment(date).format(DATE_FORMAT) : ""}
        </span>
      ),
    },
    {
      title: "Personnel Deputed",
      dataIndex: "personnelDeputed",
      rowKey: "personnelDeputed",
      render: (personnelDeputed) => (
        <span className="tableRowText wordWrap">
          {personnelDeputed.join(" , ") || ""}
        </span>
      ),
    },
    {
      title: "Relation To Person",
      dataIndex: "relationToPerson",
      rowKey: "relationToPerson",
      render: (relationToPerson) => (
        <span className="tableRowText wordWrap">{relationToPerson || ""}</span>
      ),
    },
    {
      title: "Uploaded Version",
      dataIndex: "uploadVersion",
      rowKey: "uploadVersion",
      render: (_value, item, i) => {
        return (
          <div key={i} style={{ cursor: "pointer", color: "#02599C" }}>
            <span
              onClick={() =>
                getFileById(
                  item?.uploadVersion?.fileId,
                  item?.uploadVersion?.name,
                  item?.uploadVersion?.url
                )
              }
            >
              {item?.uploadVersion?.name}
            </span>
          </div>
        );
      },
    },
    {
      title: "Actions",
      dataIndex: "actions",
      rowKey: "actions",
      render: (_value, item, i) => {
        return (
          <div key={i} style={styles.widgetPageStyle}>
            <div
              style={{ cursor: "pointer", color: "#02599C" }}
              onClick={() => {
                editDetails(item);
                setViewDetails(true);
                setSelectedIndex(i);
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
                setSelectedIndex(i);
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
    </TableWidgetWrapper>
  );
}
