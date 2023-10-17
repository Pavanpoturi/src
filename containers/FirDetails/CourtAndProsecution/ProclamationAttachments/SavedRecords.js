import TableWrapper from "@containers/Tables/AntTables/AntTables.styles";
import { TableWidgetWrapper } from "@containers/FirDetails/CommonSections/TableWidget.styles";
import { EyeFilled, EditFilled } from "@ant-design/icons";
import moment from "moment";

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
  viewClicked,
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
      render: (_, item) => {
        const personalDetails =
          item?.accusedId && item?.accusedId?.personalDetails;
        return (
          <span className="tableRowText wordWrap">{personalDetails?.name}</span>
        );
      },
    },
    {
      title: "Property type",
      dataIndex: "typesOfPropertyToAttached",
      rowKey: "typesOfPropertyToAttached",
      render: (_, item) => (
        <span className="tableRowText wordWrap">
          {item?.proclamation?.typesOfPropertyToAttached}
        </span>
      ),
    },
    {
      title: "Date of issue of 82 Cr.P.C proceedings",
      dataIndex: "dateOfIssueOf82CRPCProceedings",
      rowKey: "dateOfIssueOf82CRPCProceedings",
      render: (_, item) => (
        <span className="tableRowText wordWrap">
          {item?.proclamation?.dateOfIssueOf82CRPCProceedings
            ? moment(item?.proclamation?.dateOfIssueOf82CRPCProceedings).format(
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
            {!viewClicked && (
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
