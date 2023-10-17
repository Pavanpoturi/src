import { isEmpty } from "lodash";
import { EyeFilled, EditFilled } from "@ant-design/icons";
import moment from "moment";
import TableWrapper from "@containers/Tables/AntTables/AntTables.styles";
import { TableWidgetWrapper } from "@containers/FirDetails/CommonSections/TableWidget.styles";
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

export default function ExpertTeamSavedRecords({
  dataSource,
  editDetails,
  setViewDetails,
  selectedRecord,
}) {
  const recordSelected =
    dataSource.length > 1
      ? `${dataSource.length} Record(s) Added`
      : `${dataSource.length} Record Added`;

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      rowKey: "name",
      render: (name) => (
        <span className="tableRowText wordWrap">{name || ""}</span>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      rowKey: "role",
      render: (role) => (
        <span className="tableRowText wordWrap">{role || ""}</span>
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      rowKey: "date",
      render: (date) => (
        <span className="tableRowText wordWrap">
          {date ? moment(date).format("MMMM DD, YYYY") : ""}
        </span>
      ),
    },
    {
      title: "Uploaded Media",
      dataIndex: "mediaDetails",
      rowKey: "mediaDetails",
      render: (_i, item) => {
        return (
          !isEmpty(item.mediaDetails) &&
          item.mediaDetails.map((item, i) => {
            return (
              <div
                key={i}
                style={{ cursor: "pointer", color: "#02599C" }}
                onClick={() => getFileById(item?.fileId, item?.name, item?.url)}
              >
                {item.name}
              </div>
            );
          })
        );
      },
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
      <div className="widgetContainer" style={{ minHeight: 325 }}>
        <div style={{ marginBottom: 10, marginLeft: 10 }}>
          <p>{recordSelected}</p>
        </div>
        <TableWrapper
          dataSource={dataSource}
          rowClassName={(record, _index) =>
            selectedRecord?.name === record?.name ? "editMode" : ""
          }
          columns={columns}
          pagination={false}
          rowKey={(record) => {
            if (!record.__uniqueId) record.__uniqueId = ++uniqueId;
            return record.__uniqueId;
          }}
          size="small"
        />
      </div>
    </TableWidgetWrapper>
  );
}
