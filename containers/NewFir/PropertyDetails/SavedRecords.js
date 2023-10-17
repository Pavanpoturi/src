import { EyeFilled, EditFilled, DeleteFilled } from "@ant-design/icons";
import { isEmpty } from "lodash";
import TableWrapper from "@containers/Tables/AntTables/AntTables.styles";
import { TableWidgetWrapper } from "@containers/FirDetails/CommonSections/TableWidget.styles";
import { Popconfirm } from "antd";
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
  setselectedStolenProperty,
  setvieiwClicked,
  seteditClicked,
  setFormValid,
  selectedRecord,
  setselectedStolenPropertyIndex,
  isMedia = false,
  disable,
  handleDeleteStolen,
}) {
  const recordSelected =
    stolenPropertyApiList.length > 1
      ? `${stolenPropertyApiList.length} Record(s) Added`
      : `${stolenPropertyApiList.length} Record Added`;

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
              style={{
                color: "#033c68",
                cursor: "pointer",
                position: "absolute",
                marginTop: 40,
                marginLeft: 100,
              }}
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
      title: "Property Status",
      dataIndex: "propertyStatus",
      rowKey: "propertyStatus",
      render: (propertyStatus) => (
        <span className="tableRowText wordWrap">{propertyStatus}</span>
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
      title: "Actions",
      dataIndex: "actions",
      rowKey: "actions",
      render: (_value, item, index) => {
        return (
          <div key={index} style={styles.widgetPageStyle}>
            <div
              style={{ cursor: "pointer", color: "#02599C" }}
              onClick={() => {
                setselectedStolenProperty(item);
                setvieiwClicked(true);
                seteditClicked(false);
                setselectedStolenPropertyIndex(index + 1);
                setFormValid(false);
              }}
            >
              <EyeFilled style={{ marginRight: 5 }} />
              View
            </div>
            {!disable ? (
              <div
                style={{ cursor: "pointer", color: "#02599C", marginLeft: 10 }}
                onClick={() => {
                  setselectedStolenProperty(item);
                  setvieiwClicked(false);
                  seteditClicked(true);
                  setselectedStolenPropertyIndex(index + 1);
                  setFormValid(true);
                }}
              >
                <EditFilled style={{ marginRight: 5 }} />
                Edit
              </div>
            ) : null}
            {!disable ? (
              <Popconfirm
                title="Are you sure?"
                onConfirm={() => {
                  handleDeleteStolen(index, item);
                }}
                okText="Yes"
                cancelText="No"
              >
                <div
                  style={{
                    cursor: "pointer",
                    color: "#02599C",
                    marginLeft: 10,
                  }}
                >
                  <DeleteFilled style={{ marginRight: 5 }} />
                  Delete
                </div>
              </Popconfirm>
            ) : null}
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
          size="small"
        />
      </div>
    </TableWidgetWrapper>
  );
}
