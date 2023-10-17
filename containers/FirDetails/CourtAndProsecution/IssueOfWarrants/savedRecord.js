import moment from "moment";
import TableWrapper from "@containers/Tables/AntTables/AntTables.styles";
import { TableWidgetWrapper } from "@containers/FirDetails/CommonSections/TableWidget.styles";
import { EyeFilled, EditFilled } from "@ant-design/icons";

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
  setSelectedData,
  setViewClicked,
  setFormValid,
  setIsRecordModalVisible,
  disabled,
}) {
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
      title: "Warrants To",
      dataIndex: "warrantsTo",
      rowKey: "warrantsTo",
      render: (warrantsTo) => (
        <span className="tableRowText wordWrap">{warrantsTo}</span>
      ),
    },
    {
      title: "Warrant Person",
      render: (_, item) => (
        <span className="tableRowText wordWrap">
          {!!item?.person?.personalDetails?.name
            ? item?.person?.personalDetails?.name
            : item?.other?.name}
        </span>
      ),
    },
    {
      title: "Warrant Type",
      dataIndex: "warrantType",
      rowKey: "warrantType",
      render: (warrantType) => (
        <span className="tableRowText wordWrap">{warrantType}</span>
      ),
    },
    {
      title: "Date of Trial",
      dataIndex: "dateOfTrial",
      rowKey: "dateOfTrial",
      render: (dateOfTrial) => (
        <span className="tableRowText wordWrap">
          {dateOfTrial ? moment(dateOfTrial).format("DD/MM/YYYY") : null}
        </span>
      ),
    },
    {
      title: "Warrant Issued Date",
      dataIndex: "warrantIssuedDate",
      rowKey: "warrantIssuedDate",
      render: (warrantIssuedDate) => (
        <span className="tableRowText wordWrap">
          {warrantIssuedDate
            ? moment(warrantIssuedDate).format("DD/MM/YYYY")
            : null}
        </span>
      ),
    },
    {
      title: "PS Received Date",
      dataIndex: "psReceivedDate",
      rowKey: "psReceivedDate",
      render: (psReceivedDate) => (
        <span className="tableRowText wordWrap">
          {psReceivedDate ? moment(psReceivedDate).format("DD/MM/YYYY") : null}
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
                setSelectedData(item);
                setViewClicked(true);
                setFormValid(false);
                setIsRecordModalVisible(false);
              }}
            >
              <EyeFilled style={{ marginRight: 5 }} />
              View
            </div>
            {!disabled && (
              <div
                style={{ cursor: "pointer", color: "#02599C", marginLeft: 10 }}
                onClick={() => {
                  setSelectedData(item);
                  setViewClicked(false);
                  setFormValid(true);
                  setIsRecordModalVisible(false);
                }}
              >
                <EditFilled style={{ marginRight: 5 }} />
                Edit
              </div>
            )}
          </div>
        );
      },
    },
  ];

  let uniqueId = 0;

  return (
    <TableWidgetWrapper>
      <TableWrapper
        dataSource={dataSource}
        columns={columns}
        pagination={true}
        rowKey={(record) => {
          if (!record.__uniqueId) record.__uniqueId = ++uniqueId;
          return record.__uniqueId;
        }}
        size="small"
      />
    </TableWidgetWrapper>
  );
}
