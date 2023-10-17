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
  disableForm,
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
      title: "Accused Name",
      render: (_, item) => (
        <span className="tableRowText wordWrap">
          {item?.accusedId?.personalDetails?.name}
        </span>
      ),
    },
    {
      title: "Date of Judgement ",
      dataIndex: "dateOfJudgement",
      rowKey: "dateOfJudgement",
      render: (dateOfJudgement) => (
        <span className="tableRowText wordWrap">
          {dateOfJudgement
            ? moment(dateOfJudgement).format("DD/MM/YYYY")
            : null}
        </span>
      ),
    },
    {
      title: "Disposal type",
      dataIndex: "disposalType",
      rowKey: "disposalType",
      render: (disposalType) => (
        <span className="tableRowText wordWrap">{disposalType}</span>
      ),
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      rowKey: "remarks",
      render: (remarks) => (
        <span className="tableRowText wordWrap">{remarks}</span>
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
            {!disableForm && (
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
