import TableWrapper from "@containers/Tables/AntTables/AntTables.styles";
import { TableWidgetWrapper } from "@containers/FirDetails/CommonSections/TableWidget.styles";
import { Form, Checkbox } from "antd";
import { EyeFilled, EditFilled } from "@ant-design/icons";
import { isUndefined } from "lodash";
import { getFileById } from "@containers/media-util";

const styles = {
  widgetPageStyle: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    overflow: "hidden",
    margin: 10,
  },
};

export default function SavedCDRRecords({
  dataSource,
  onRecordSelect,
  editDetails,
  setViewDetails,
  selectedRecord,
  checkFields,
  onUploadResultSelect,
  disableForm,
}) {
  const columns = [
    {
      title: "",
      dataIndex: "checkbox",
      rowKey: "checkbox",
      render: (_value, item, index) => {
        return (
          <div key={index}>
            <Form.Item
              name={`${item?._id}_checkbox`}
              valuePropName="checked"
              onChange={checkFields}
            >
              <Checkbox
                style={{ color: "#949494", fontWeight: 300 }}
                onChange={(e) => {
                  onRecordSelect(e.target.checked, item);
                }}
                disabled={item?.cdrRequested}
              />
            </Form.Item>
          </div>
        );
      },
    },
    {
      title: "Mobile No.",
      dataIndex: "mobileNo",
      rowKey: "mobileNo",
      render: (mobileNo) => (
        <span className="tableRowText wordWrap">{mobileNo}</span>
      ),
    },
    {
      title: "IMEI No.",
      dataIndex: "imeiNo",
      rowKey: "imeiNo",
      render: (imeiNo) => (
        <span className="tableRowText wordWrap">{imeiNo}</span>
      ),
    },
    {
      title: "Tower ID No.",
      dataIndex: "towerIdNo",
      rowKey: "towerIdNo",
      render: (towerIdNo) => (
        <span className="tableRowText wordWrap">{towerIdNo}</span>
      ),
    },
    {
      title: "Telecom Service Proviider",
      dataIndex: "telecomServiceProvider",
      rowKey: "telecomServiceProvider",
      render: (telecomServiceProvider) => (
        <span className="tableRowText wordWrap">{telecomServiceProvider}</span>
      ),
    },
    {
      title: "CDR/CAF Of Whom",
      dataIndex: "nickName",
      rowKey: "nickName",
      render: (nickName) => (
        <span className="tableRowText wordWrap">{nickName}</span>
      ),
    },
    {
      title: "Upload Result",
      dataIndex: "uploadResult",
      rowKey: "uploadResult",
      render: (_value, item, i) => {
        return (
          <div key={i} style={styles.widgetPageStyle}>
            {item?.cdrRequested && isUndefined(item?.uploadResultCDR) ? (
              <div
                className="link"
                style={{ marginRight: 20 }}
                onClick={() => onUploadResultSelect(item)}
              >
                Upload Result
              </div>
            ) : null}
            {item?.cdrRequested && !isUndefined(item?.uploadResultCDR) ? (
              <div
                key={i}
                style={{ cursor: "pointer", color: "#02599C" }}
                onClick={() =>
                  getFileById(
                    item?.uploadResultCDR?.fileId,
                    item?.uploadResultCDR?.name,
                    item?.uploadResultCDR?.url
                  )
                }
              >
                {item?.uploadResultCDR?.name}
              </div>
            ) : null}
          </div>
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
              style={{
                cursor: "pointer",
                color: "#02599C",
                marginTop: 8,
              }}
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
                style={{
                  cursor: "pointer",
                  color: "#02599C",
                  marginLeft: 10,
                  marginTop: 8,
                }}
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
