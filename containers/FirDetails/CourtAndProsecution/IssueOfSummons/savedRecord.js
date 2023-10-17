import TableWrapper from "@containers/Tables/AntTables/AntTables.styles";
import { TableWidgetWrapper } from "@containers/FirDetails/CommonSections/TableWidget.styles";
import moment from "moment";
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
      title: "Summons to",
      dataIndex: "summonsTo",
      rowKey: "summonsTo",
      render: (summonsTo) => (
        <span className="tableRowText wordWrap">{summonsTo}</span>
      ),
    },
    {
      title: "Name",
      render: (_, item) => (
        <span className="tableRowText wordWrap">
          {!!item?.person?.personalDetails?.name
            ? item?.person?.personalDetails?.name
            : item?.other?.name}
        </span>
      ),
    },
    {
      title: "Summons Issued on",
      dataIndex: "issuedOn",
      rowKey: "issuedOn",
      render: (issuedOn) => (
        <span className="tableRowText wordWrap">
          {issuedOn ? moment(issuedOn).format("DD/MM/YYYY") : null}
        </span>
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
      title: "PS Received Date",
      dataIndex: "datePSReceived",
      rowKey: "datePSReceived",
      render: (datePSReceived) => (
        <span className="tableRowText wordWrap">
          {datePSReceived ? moment(datePSReceived).format("DD/MM/YYYY") : null}
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
