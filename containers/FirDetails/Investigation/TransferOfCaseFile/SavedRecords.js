import { EyeFilled, EditFilled } from "@ant-design/icons";
import TableWrapper from "@containers/Tables/AntTables/AntTables.styles";
import { TableWidgetWrapper } from "@containers/FirDetails/CommonSections/TableWidget.styles";
import moment from "moment";
import { DATE_TIME_FORMAT } from "@containers/FirDetails/fir-util";

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
  transferOfCaseFileList,
  setEditTransferOfCaseDetails,
  setViewClicked,
  setFormValid,
  disableForm,
}) {
  const recordSelected =
    transferOfCaseFileList.length > 1
      ? `${transferOfCaseFileList.length} Record(s) Added`
      : `${transferOfCaseFileList.length} Record Added`;

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
      title: "Transfer To",
      dataIndex: "transferTo",
      rowKey: "transferTo",
      render: (transferTo) => (
        <span className="tableRowText wordWrap">{transferTo}</span>
      ),
    },
    {
      title: "Police Station Name",
      dataIndex: "transferToName",
      rowKey: "transferToName",
      render: (transferToName) => (
        <span className="tableRowText wordWrap">{transferToName}</span>
      ),
    },
    {
      title: "Reason",
      dataIndex: "reason",
      rowKey: "reason",
      render: (reason) => (
        <span className="tableRowText wordWrap">{reason}</span>
      ),
    },
    {
      title: "Transfered Date",
      dataIndex: "reportDatedToUnitOfficerForTransfer",
      rowKey: "reportDatedToUnitOfficerForTransfer",
      render: (reportDatedToUnitOfficerForTransfer) => (
        <span className="tableRowText wordWrap">
          {moment(reportDatedToUnitOfficerForTransfer).format(DATE_TIME_FORMAT)}
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
                setEditTransferOfCaseDetails(item);
                setViewClicked(true);
                setFormValid(true);
              }}
            >
              <EyeFilled style={{ marginRight: 5 }} />
              View
            </div>
            {disableForm === false ? (
              <div
                style={{ cursor: "pointer", color: "#02599C", marginLeft: 10 }}
                onClick={() => {
                  setEditTransferOfCaseDetails(item);
                  setViewClicked(false);
                  setFormValid(false);
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
      <div className="widgetContainer">
        <div style={{ marginBottom: 10, marginLeft: 10 }}>
          <p>{recordSelected}</p>
        </div>
        <TableWrapper
          dataSource={transferOfCaseFileList}
          columns={columns}
          pagination={false}
          rowKey={(obj) => obj._id}
          size="small"
        />
      </div>
    </TableWidgetWrapper>
  );
}
