import { EyeFilled, EditFilled } from "@ant-design/icons";
import moment from "moment";
import TableWrapper from "@containers/Tables/AntTables/AntTables.styles";
import { TableWidgetWrapper } from "@containers/FirDetails/CommonSections/TableWidget.styles";
import { DATE_FORMAT } from "@containers/FirDetails/fir-util";

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
  visibleModel,
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
      render: (propertyStatus, item, i) => (
        <span className="tableRowText wordWrap">{i + 1}</span>
      ),
    },
    {
      title: "Name of Complainant",
      dataIndex: "nameOfComplainant",
      rowKey: "nameOfComplainant",
      render: (_value, item, _i) => {
        const personalDetails = item?.nameOfComplainant?.personalDetails;
        const firstName = personalDetails?.name ? personalDetails?.name : "";
        const lastName = personalDetails?.surname
          ? personalDetails?.surname
          : "";
        return (
          <span className="tableRowText wordWrap">{`${firstName} ${lastName}`}</span>
        );
      },
    },
    {
      title: "Purpose of issue",
      dataIndex: "purposeOfIssue",
      rowKey: "purposeOfIssue",
      render: (purposeOfIssue) => (
        <span className="tableRowText wordWrap">{purposeOfIssue}</span>
      ),
    },
    {
      title: "Date of notice",
      dataIndex: "dateOfNotice",
      rowKey: "dateOfNotice",
      render: (dateOfNotice) => (
        <span className="tableRowText wordWrap">
          {dateOfNotice ? moment(dateOfNotice).format(DATE_FORMAT) : ""}
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
                editDetails(item);
                setViewDetails(true);
                visibleModel(false);
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
                visibleModel(false);
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
      <div className="widgetContainer">
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
