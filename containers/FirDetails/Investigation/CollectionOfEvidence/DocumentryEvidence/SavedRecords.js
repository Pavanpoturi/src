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
  disableForm,
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
      title: "Nature of document",
      dataIndex: "nameOfDocument",
      rowKey: "nameOfDocument",
      render: (nameOfDocument) => (
        <span className="tableRowText wordWrap">{nameOfDocument || ""}</span>
      ),
    },
    {
      title: "Purpose",
      dataIndex: "purpose",
      rowKey: "purpose",
      render: (purpose) => (
        <span className="tableRowText wordWrap">{purpose || ""}</span>
      ),
    },
    {
      title: "Date of Requisition",
      dataIndex: "dateOfRequisition",
      rowKey: "dateOfRequisition",
      render: (dateOfRequisition) => (
        <span className="tableRowText wordWrap">
          {dateOfRequisition
            ? moment(dateOfRequisition).format(DATE_FORMAT)
            : ""}
        </span>
      ),
    },
    {
      title: "Date of Receipt",
      dataIndex: "dateOfReceipt",
      rowKey: "dateOfReceipt",
      render: (dateOfReceipt) => (
        <span className="tableRowText wordWrap">
          {dateOfReceipt ? moment(dateOfReceipt).format(DATE_FORMAT) : ""}
        </span>
      ),
    },
    {
      title: "Strength Of Evidence",
      dataIndex: "strengthOfEvidence",
      rowKey: "strengthOfEvidence",
      render: (strengthOfEvidence) => (
        <span className="tableRowText wordWrap">
          {strengthOfEvidence || ""}
        </span>
      ),
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
