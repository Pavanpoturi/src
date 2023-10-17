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
  stolenPropertyApiList,
  setSelectedStolenProperty,
  setViewClicked,
  setEditClicked,
  setFormValid,
  selectedRecord,
  isMedia = false,
  setIsRecordsModalVisible,
}) {
  const recordSelected =
    stolenPropertyApiList?.length > 1
      ? `${stolenPropertyApiList?.length}Record(s) Added`
      : `${stolenPropertyApiList?.length} Record Added`;

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
              onClick={() => getFileById(item?.fileId, item?.name, item?.url)}
            >
              {item.name}
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
      title: "Property Category",
      dataIndex: "propertytCategory",
      rowKey: "propertytCategory",
      render: (propertytCategory) => (
        <span className="tableRowText wordWrap">{propertytCategory}</span>
      ),
    },
    {
      title: "Nature of Stolen Property",
      dataIndex: "natureofStolen",
      rowKey: "natureofStolen",
      render: (natureofStolen) => (
        <span className="tableRowText wordWrap">{natureofStolen}</span>
      ),
    },
    {
      title: "Property Status",
      dataIndex: "propertyStatus",
      rowKey: "propertyStatus",
      render: (propertyStatus) => (
        <span className="tableRowText wordWrap">{propertyStatus}</span>
      ),
    },
    {
      title: "Estimated Value",
      dataIndex: "estimateValue",
      rowKey: "estimateValue",
      render: (estimateValue) => (
        <span className="tableRowText wordWrap">{estimateValue}</span>
      ),
    },
    {
      title: "Recovered Value",
      dataIndex: "recoveredValue",
      rowKey: "recoveredValue",
      render: (recoveredValue) => (
        <span className="tableRowText wordWrap">{recoveredValue}</span>
      ),
    },
    {
      title: "Media",
      dataIndex: "seizureReportMedia",
      rowKey: "seizureReportMedia",
      render: (_i, item) => {
        console.log("item", item);
        return (
          !isEmpty(item.media) &&
          item.media.map((item, i) => {
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
                setSelectedStolenProperty(item);
                setViewClicked(true);
                setEditClicked(false);
                setFormValid(false);
                setIsRecordsModalVisible(false);
              }}
            >
              <EyeFilled style={{ marginRight: 5 }} />
              View
            </div>
            <div
              style={{ cursor: "pointer", color: "#02599C", marginLeft: 10 }}
              onClick={() => {
                setSelectedStolenProperty(item);
                setViewClicked(false);
                setEditClicked(true);
                setFormValid(true);
                setIsRecordsModalVisible(false);
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
  // console.log("=======columnResult============");
  // console.log(columnResult);

  return (
    <TableWidgetWrapper>
      <div className="widgetContainer">
        <div style={{ marginBottom: 10, marginLeft: 10 }}>
          <p>{recordSelected}</p>
        </div>
        <TableWrapper
          dataSource={stolenPropertyApiList}
          columns={columns}
          pagination={false}
          rowKey={(obj) => obj._id}
          size="small"
        />
      </div>
    </TableWidgetWrapper>
  );
}
