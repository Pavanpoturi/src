import { EyeFilled, EditFilled } from "@ant-design/icons";
import TableWrapper from "@containers/Tables/AntTables/AntTables.styles";
import { getFileById } from "@containers/media-util";
import { isArray } from "lodash";

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
  TableWidgetWrapperStyle: {width: "100%",
      display: "flex",
      flexDirection: "column",
      backgroundColor: "white",
      overflow: "hidden"
      }
};

export default function SavedRecords({
  dataSource,
  editDetails,
  setViewDetails,
  selectedRecord,
  isMedia = false,
  recordVisible,
}) {
  console.log("dataSource", dataSource);
  const recordSelected =
    dataSource.length > 1
      ? `${dataSource.length} Record(s) Added`
      : `${dataSource.length} Record Added`;

  const columns = [
    {
      title: "S.No.",
      dataIndex: "",
      rowKey: "",
      render: (propertyStatus, item, i) => (
        <span className="tableRowText wordWrap">{i + 1}</span>
      ),
    },
    {
      title: "Deceased Type",
      dataIndex: "selectedRecord",
      rowKey: "selectedRecord",
      render: (selectedRecord) => (
        <span className="tableRowText wordWrap">
          {selectedRecord?.deceasedType}
        </span>
      ),
    },
    {
      title: "Place of Exhumation",
      dataIndex: "selectedRecord",
      rowKey: "selectedRecord",
      render: (selectedRecord) => (
        <span className="tableRowText wordWrap">
          {selectedRecord?.placeOfExhumation}
        </span>
      ),
    },
    {
      title: "Name/Occupation/Gender/Age ",
      dataIndex: "personalDetails",
      rowKey: "personalDetails",
      render: (personalDetails) => (
        <span className="tableRowText wordWrap">{personalDetails}</span>
      ),
    },
    {
      title: "S/O (or) D/O",
      dataIndex: "fatherName",
      rowKey: "fatherName",
      render: (fatherName) => (
        <span className="tableRowText wordWrap">{fatherName}</span>
      ),
    },
    {
      title: "Address",
      dataIndex: "personAddress",
      rowKey: "personAddress",
      render: (personAddress) => (
        <span className="tableRowText wordWrap">{personAddress}</span>
      ),
    },
    {
      title: "Uploaded Media",
      dataIndex: "mediaDetails",
      rowKey: "mediaDetails",
      render: (_i, item) => {
        return (
          <>
          {isArray(item?.mediaDetails) && item?.mediaDetails.map((media) => 
            ( <div
                key={_i}
                style={{ cursor: "pointer", color: "#02599C" }}
                onClick={() =>
                  getFileById(
                    media?.fileId,
                    media?.name,
                    media?.url
                  )
                }
              >
                {media?.name}
              </div>))}
          </>
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
                recordVisible && recordVisible(false);
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
    <div style={styles.TableWidgetWrapperStyle}>
      <div className="widgetContainer">
        <div style={{ marginBottom: 10, marginLeft: 10 }}>
          <p>{recordSelected}</p>
        </div>
        <TableWrapper
          rowClassName={(record, _index) =>
            selectedRecord?._id === record?.selectedRecord?._id
              ? "editMode"
              : ""
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
      </div>
    </div>
  );
}
