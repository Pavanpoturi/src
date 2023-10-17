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
  suspectAccusedList,
  setSelectedData,
  setViewClicked,
  setFormValid,
  setIsRecordModalVisible,
}) {
  const getAccusedName = (item) => {
    const accused = suspectAccusedList.find(
      (accused) =>
        accused?.person?._id?.toString() === item?.accusedId?.toString()
    );
    return accused ? accused?.person?.personalDetails?.name : "";
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
      title: "Accused Name",
      render: (_, item) => (
        <span className="tableRowText wordWrap">{getAccusedName(item)}</span>
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
      title: "Date of Death",
      dataIndex: "dateOfDeath",
      rowKey: "dateOfDeath",
      render: (dateOfDeath) => (
        <span className="tableRowText wordWrap">
          {dateOfDeath ? moment(dateOfDeath).format("DD/MM/YYYY") : null}
        </span>
      ),
    },
    {
      title: "Date of filing Report with Copy of death certificate",
      dataIndex: "dateOfFilingReportWithCopyOfDeathCertificate",
      rowKey: "dateOfFilingReportWithCopyOfDeathCertificate",
      render: (dateOfFilingReportWithCopyOfDeathCertificate) => (
        <span className="tableRowText wordWrap">
          {dateOfFilingReportWithCopyOfDeathCertificate
            ? moment(dateOfFilingReportWithCopyOfDeathCertificate).format(
                "DD/MM/YYYY"
              )
            : null}
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
