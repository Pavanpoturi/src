import { EyeFilled, EditFilled } from "@ant-design/icons";
import { isEmpty } from "lodash";
import TableWrapper from "@containers/Tables/AntTables/AntTables.styles";
import { TableWidgetWrapper } from "@containers/FirDetails/CommonSections/TableWidget.styles";

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
  suretyList,
  setviewEditObj,
  setviewEditObjIndex,
  setviewSuretyClicked,
  seteditSuretyClicked,
  disable,
}) {
  const recordSelected =
    suretyList.length > 1
      ? `${suretyList.length} Record(s) Added`
      : `${suretyList.length} Record Added`;

  const columns = [
    {
      title: "Name",
      dataIndex: "person",
      rowKey: "person",
      render: (person) => (
        <span className="tableRowText wordWrap">
          {person?.personalDetails?.name} {person?.personalDetails?.surname}
        </span>
      ),
    },

    {
      title: "Actions",
      dataIndex: "actions",
      rowKey: "actions",
      render: (_value, item, index) => {
        return (
          <div key={index} style={styles.widgetPageStyle}>
            <div
              style={{ cursor: "pointer", color: "#02599C" }}
              onClick={() => {
                setviewEditObj(item);
                setviewEditObjIndex(index + 1);
                setviewSuretyClicked(true);
                seteditSuretyClicked(false);
              }}
            >
              <EyeFilled style={{ marginRight: 5 }} />
              View
            </div>
            {!disable ? (
              <div
                style={{ cursor: "pointer", color: "#02599C", marginLeft: 10 }}
                onClick={() => {
                  setviewEditObj(item);
                  setviewEditObjIndex(index + 1);
                  setviewSuretyClicked(false);
                  seteditSuretyClicked(true);
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
          dataSource={suretyList}
          columns={columns}
          pagination={false}
          size="small"
        />
      </div>
    </TableWidgetWrapper>
  );
}
