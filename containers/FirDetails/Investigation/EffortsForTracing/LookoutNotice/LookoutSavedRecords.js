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

export default function LookoutSavedRecords({
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
      title: "Lookout Notice/Poster",
      dataIndex: "lookoutNotice",
      rowKey: "lookoutNotice",
      render: (lookoutNotice) => (
        <span className="tableRowText wordWrap">{lookoutNotice || ""}</span>
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
      title: "Date of Poster Sticked",
      dataIndex: "dateOfPoster",
      rowKey: "dateOfPoster",
      render: (dateOfPoster) => (
        <span className="tableRowText wordWrap">
          {dateOfPoster ? moment(dateOfPoster).format(DATE_FORMAT) : ""}
        </span>
      ),
    },
    {
      title: "Evidence Uploaded",
      dataIndex: "uploadEvidence",
      rowKey: "uploadEvidence",
      render: (_value, item, i) => {
        return (
          <div key={i} style={{ cursor: "pointer", color: "#02599C" }}>
            <span
              onClick={() =>
                getFileById(
                  item?.uploadEvidence?.fileId,
                  item?.uploadEvidence?.name,
                  item?.uploadEvidence?.url
                )
              }
            >
              {item?.uploadEvidence?.name}
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
