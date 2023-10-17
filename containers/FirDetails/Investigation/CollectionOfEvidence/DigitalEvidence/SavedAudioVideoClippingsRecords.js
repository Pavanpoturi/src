import { EyeFilled, EditFilled } from "@ant-design/icons";
import moment from "moment";
import TableWrapper from "@containers/Tables/AntTables/AntTables.styles";
import { TableWidgetWrapper } from "@containers/FirDetails/CommonSections/TableWidget.styles";
import { DATE_FORMAT } from "@containers/FirDetails/fir-util";
import { isEmpty } from "lodash";
import { getFileById } from "@containers/media-util";

const styles = {
  widgetPageStyle: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    overflow: "hidden",
    margin: 10,
  },
};

export default function SavedAudioVideoClippingsRecords({
  dataSource,
  editDetails,
  setViewDetails,
  selectedRecord,
  disableForm,
}) {
  const recordSelected =
    dataSource.length > 1
      ? `${dataSource.length} Record(s) Added`
      : `${dataSource.length} Record Added`;

  const columns = [
    {
      title: "Source of Audio / Video",
      dataIndex: "sourceofAudioVideo",
      rowKey: "sourceofAudioVideo",
      render: (sourceofAudioVideo) => (
        <span className="tableRowText wordWrap">
          {sourceofAudioVideo || ""}
        </span>
      ),
    },
    {
      title: "Device Collected",
      dataIndex: "deviceCollected",
      rowKey: "deviceCollected",
      render: (deviceCollected) => (
        <span className="tableRowText wordWrap">{deviceCollected || ""}</span>
      ),
    },
    {
      title: "Date of Collection",
      dataIndex: "dateOfCollection",
      rowKey: "dateOfCollection",
      render: (dateOfCollection) => (
        <span className="tableRowText wordWrap">
          {dateOfCollection ? moment(dateOfCollection).format(DATE_FORMAT) : ""}
        </span>
      ),
    },
    {
      title: "Audio",
      dataIndex: "audioVideoClipping",
      rowKey: "audioVideoClipping",
      render: (audioVideoClipping) => {
        return (
          !isEmpty(audioVideoClipping) &&
          audioVideoClipping.map((item, i) => {
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
      render: (_value, item, i) => {
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
            {!disableForm ? (
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
            ) : null}
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
