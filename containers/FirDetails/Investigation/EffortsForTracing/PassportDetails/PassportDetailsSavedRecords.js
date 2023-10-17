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

export default function PassportDetailsSavedRecords({
  dataSource,
  editDetails,
  setViewDetails,
  selectedRecord,
  setSelectedIndex,
}) {
  const recordSelected =
    dataSource.length > 1
      ? `${dataSource.length} Record(s) Added`
      : `${dataSource.length} Record Added`;

  const columns = [
    {
      title: "S.No",
      dataIndex: "",
      rowKey: "",
      render: (_propertyStatus, _item, i) => (
        <span className="tableRowText wordWrap">{i + 1}</span>
      ),
    },
    {
      title: "Date of Requisition to RPO",
      dataIndex: "dateOfRPORequisition",
      rowKey: "dateOfRPORequisition",
      render: (dateOfRPORequisition) => (
        <span className="tableRowText wordWrap">
          {dateOfRPORequisition
            ? moment(dateOfRPORequisition).format(DATE_FORMAT)
            : ""}
        </span>
      ),
    },
    {
      title: "Date of Reply",
      dataIndex: "dateOfReply",
      rowKey: "dateOfReply",
      render: (dateOfReply) => (
        <span className="tableRowText wordWrap">
          {dateOfReply ? moment(dateOfReply).format(DATE_FORMAT) : ""}
        </span>
      ),
    },
    {
      title: "Passport No",
      dataIndex: "passportNo",
      rowKey: "passportNo",
      render: (passportNo) => (
        <span className="tableRowText wordWrap">{passportNo || ""}</span>
      ),
    },
    {
      title: "Date of Issue",
      dataIndex: "dateOfIssue",
      rowKey: "dateOfIssue",
      render: (dateOfIssue) => (
        <span className="tableRowText wordWrap">
          {dateOfIssue ? moment(dateOfIssue).format(DATE_FORMAT) : ""}
        </span>
      ),
    },
    {
      title: "Valid Upto",
      dataIndex: "dateOfValidity",
      rowKey: "dateOfValidity",
      render: (dateOfValidity) => (
        <span className="tableRowText wordWrap">
          {dateOfValidity ? moment(dateOfValidity).format(DATE_FORMAT) : ""}
        </span>
      ),
    },
    {
      title: "Address as per Passport",
      dataIndex: "addressFromPassport",
      rowKey: "addressFromPassport",
      render: (_i, item) => {
        const addressFromPassport = item?.addressFromPassport;
        const address1 = addressFromPassport?.address1
          ? addressFromPassport?.address1
          : "";
        const address2 = addressFromPassport?.address2
          ? addressFromPassport?.address2
          : "";
        return (
          <span className="tableRowText wordWrap">
            {address1 || ""} {address2 || ""}
          </span>
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
                setSelectedIndex(i);
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
                setSelectedIndex(i);
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
