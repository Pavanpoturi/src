import { EyeFilled, EditFilled } from "@ant-design/icons";
import { isEmpty, isUndefined } from "lodash";
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
  isMedia = false,
  setIsModalVisible,
}) {
  const recordSelected =
    dataSource.length > 1
      ? `${dataSource.length} Record(s) Added`
      : `${dataSource.length} Record Added`;

  const mediaDetails = {
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
              onClick={() => getFileById(item?.fileId, item?.team, item?.url)}
            >
              {item.name}]{" "}
            </div>
          );
        })
      );
    },
  };

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
      title: "Name/Occupation/Gender/Age ",
      dataIndex: "personalDetails",
      rowKey: "personalDetails",
      render: (personalDetails) => (
        <span className="tableRowText wordWrap">{personalDetails}</span>
      ),
    },
    {
      title: "S/O (or) s/o",
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
      title: "Nature of Permission",
      dataIndex: "selectedRecord",
      rowKey: "selectedRecord",
      render: (selectedRecord) => (
        <span
          className="tableRowText wordWrap"
          style={{
            color:
              selectedRecord?.natureOfPermissionRequired === "Closure of Case"
                ? "red"
                : "",
          }}
        >
          {selectedRecord?.natureOfPermissionRequired}
          <br />
          {!isUndefined(selectedRecord?.forClosureOfCase?.natureOfClosure)
            ? `(${selectedRecord?.forClosureOfCase?.natureOfClosure})`
            : ""}
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
                editDetails(item.selectedRecord);
                setViewDetails(true);
                setIsModalVisible(false);
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
                setIsModalVisible(false);
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

  const columnResult = isMedia ? columns.splice(3, 0, mediaDetails) : columns;
  console.log("=======columnResult============");
  console.log(columnResult);
  let uniqueId = 0;

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
