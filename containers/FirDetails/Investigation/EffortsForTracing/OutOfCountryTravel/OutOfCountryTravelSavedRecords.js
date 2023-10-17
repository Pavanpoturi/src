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

export default function OutOfCountryTravelSavedRecords({
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
      title: "Date of Requisition to Immigration",
      dataIndex: "dateOfImmigrationRequisition",
      rowKey: "dateOfImmigrationRequisition",
      render: (dateOfImmigrationRequisition) => (
        <span className="tableRowText wordWrap">
          {dateOfImmigrationRequisition
            ? moment(dateOfImmigrationRequisition).format(DATE_FORMAT)
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
      title: "Date of Departure From India",
      dataIndex: "dateOfDeparture",
      rowKey: "dateOfDeparture",
      render: (dateOfDeparture) => (
        <span className="tableRowText wordWrap">
          {dateOfDeparture ? moment(dateOfDeparture).format(DATE_FORMAT) : ""}
        </span>
      ),
    },
    {
      title: "Place of Country",
      dataIndex: "placeOfCountry",
      rowKey: "placeOfCountry",
      render: (placeOfCountry) => (
        <span className="tableRowText wordWrap">{placeOfCountry || ""}</span>
      ),
    },
    {
      title: "Date of Reaching",
      dataIndex: "dateOfReaching",
      rowKey: "dateOfReaching",
      render: (dateOfReaching) => (
        <span className="tableRowText wordWrap">
          {dateOfReaching ? moment(dateOfReaching).format(DATE_FORMAT) : ""}
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
