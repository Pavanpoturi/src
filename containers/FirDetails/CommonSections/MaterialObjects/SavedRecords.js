import { EyeFilled, EditFilled } from "@ant-design/icons";
import { isEmpty } from "lodash";
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

export default function SavedRecords({
  dataSource,
  editDetails,
  setViewDetails,
  selectedRecord,
  visibleRecords,
}) {
  const recordSelected =
    dataSource.length > 1
      ? `${dataSource.length} Record(s) Added`
      : `${dataSource.length} Record Added`;

  const columns = [
    {
      title: "S.No.",
      dataIndex: "",
      rowKey: "",
      render: (_propertyStatus, _item, i) => (
        <span className="tableRowText wordWrap">{i + 1}</span>
      ),
    },
    {
      title: "Material Object Type",
      dataIndex: "materialObjectsType",
      rowKey: "materialObjectsType",
      render: (materialObjectsType) => (
        <span className="tableRowText wordWrap">{materialObjectsType}</span>
      ),
    },
    {
      title: "Material Object Sub-Type",
      dataIndex: "materialObjectsSubType",
      rowKey: "materialObjectsSubType",
      render: (materialObjectsSubType) => (
        <span className="tableRowText wordWrap">{materialObjectsSubType}</span>
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
                editDetails(item.selectedRecord);
                setViewDetails(true);
                visibleRecords(false);
              }}
            >
              <EyeFilled style={{ marginRight: 5 }} />
              View
            </div>
            <div
              style={{ cursor: "pointer", color: "#02599C", marginLeft: 10 }}
              onClick={() => {
                editDetails(item.selectedRecord);
                setViewDetails(false);
                visibleRecords(false);
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
            selectedRecord?._id === record.selectedRecord._id ? "editMode" : ""
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
