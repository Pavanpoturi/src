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
  TIPAccusedList,
  setclickedDetails,
  setvieiwClicked,
  seteditClicked,
  setFormValid,
  isMedia = false,
  visibleModal,
}) {
  const recordSelected =
    TIPAccusedList.length > 1
      ? `${TIPAccusedList.length}Record(s) Added`
      : `${TIPAccusedList.length} Record Added`;

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
      title: "Witness Code",
      dataIndex: "witnessList",
      rowKey: "witnessList",
      render: (witnessList, item) =>
        witnessList.map((w1) => {
          return (
            <span>
              {item.tipCodes && item.tipCodes[w1._id]
                ? `${item.tipCodes[w1._id]}`
                : "A"}
              <br></br>
            </span>
          );
        }),
    },
    {
      title: "Witness Name",
      dataIndex: "witnessList",
      rowKey: "witnessList",
      render: (witnessList, _item) =>
        witnessList.map((ele) => {
          return (
            <span>
              {ele.personalDetails?.name} {ele.personalDetails?.surname}
              <br></br>
            </span>
          );
        }),
    },
    {
      title: "Articles Identified",
      dataIndex: "natureOfItems",
      rowKey: "natureOfItems",
      render: (natureOfItems, _item) =>
        natureOfItems.map((ele) => {
          return (
            <span>
              {ele?.type}{" "}
              <small>
                {!isUndefined(ele?.subType) ? `(${ele?.subType})` : ""}
              </small>
              <br></br>
            </span>
          );
        }),
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
                setclickedDetails(item);
                setvieiwClicked(true);
                seteditClicked(false);
                setFormValid(false);
                visibleModal(false);
              }}
            >
              <EyeFilled style={{ marginRight: 5 }} />
              View
            </div>
            <div
              style={{ cursor: "pointer", color: "#02599C", marginLeft: 10 }}
              onClick={() => {
                setclickedDetails(item);
                setvieiwClicked(false);
                seteditClicked(true);
                setFormValid(true);
                visibleModal(false);
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
  let uniqueId = 0;

  return (
    <TableWidgetWrapper>
      <div className="widgetContainer">
        <div style={{ marginBottom: 10, marginLeft: 10 }}>
          <p>{recordSelected}</p>
        </div>
        <TableWrapper
          dataSource={TIPAccusedList}
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
