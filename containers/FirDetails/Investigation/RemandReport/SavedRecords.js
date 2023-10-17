import { EyeFilled, EditFilled } from "@ant-design/icons";
import { isEmpty } from "lodash";
import TableWrapper from "@containers/Tables/AntTables/AntTables.styles";
import { TableWidgetWrapper } from "@containers/FirDetails/CommonSections/TableWidget.styles";

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
  recordVisible,
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
      title: "Name/Occupation/Gender/Age ",
      dataIndex: "personalDetails",
      rowKey: "personalDetails",
      render: (_personalDetails, item) =>
        item?.selectedRecord?.accusedId.map((ele) => {
          return (
            <span className="tableRowText wordWrap">
              {ele?.personalDetails?.name}
            </span>
          );
        }),
    },
    {
      title: "S/O (or) s/o",
      dataIndex: "fatherName",
      rowKey: "fatherName",
      render: (_fatherName, item) =>
        item?.selectedRecord?.accusedId.map((ele) => {
          return (
            <span className="tableRowText wordWrap">
              {ele?.personalDetails?.fatherHusbandGuardianName}
            </span>
          );
        }),
    },
    {
      title: "Address",
      dataIndex: "personAddress",
      rowKey: "personAddress",
      render: (_personAddress, item) =>
        item?.selectedRecord?.accusedId.map((ele) => {
          return (
            <span className="tableRowText wordWrap">
              {ele?.permanentAddress?.houseNo}{" "}
              {ele?.permanentAddress?.streetRoadNo}
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

  // const columnResult = isMedia ? columns.splice(3, 0, mediaDetails) : columns;
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
    </TableWidgetWrapper>
  );
}
