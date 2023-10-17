import TableWrapper from "@containers/Tables/AntTables/AntTables.styles";
import { TableWidgetWrapper } from "@containers/FirDetails/CommonSections/TableWidget.styles";
import { Form, DatePicker } from "antd";
import { DATE_FORMAT, shortAddress } from "@containers/FirDetails/fir-util";
import { EyeFilled, EditFilled } from "@ant-design/icons";
import moment from "moment";
import { isUndefined, isEmpty } from "lodash";
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

export default function SavedCCTVFootageRecords({
  dataSource,
  onRecordSelect,
  editDetails,
  setViewDetails,
  selectedRecord,
  setIsEnhancedVideoModalVisible,
  onEnhancedRecordSelect,
  isEnhancedVideoModalVisible,
  setEditCCTVFootageObj,
  formName,
  disableForm,
}) {
  const getRawVideoDetails = (item) => {
    return (
      <>
        {item?.requisitionSent ? (
          <div
            className="link"
            onClick={() => {
              setIsEnhancedVideoModalVisible(true);
              onEnhancedRecordSelect(item);
              setEditCCTVFootageObj(null);
              setViewDetails(false);
              formName.resetFields();
            }}
          >
            Upload Enhanced Video
          </div>
        ) : (
          <Form.Item
            name={`${item?._id}_dateOfRequisition`}
            label="Date of Requisition"
          >
            <DatePicker
              format={DATE_FORMAT}
              style={{ width: 200 }}
              onChange={() => onRecordSelect(item)}
              disabled={false}
            />
          </Form.Item>
        )}
      </>
    );
  };
  const columns = [
    {
      title: "Place of CCTV",
      dataIndex: "placeOfCCTV",
      rowKey: "placeOfCCTV",
      render: (_value, item, i) => {
        const placeOfCCTV = shortAddress(item?.placeOfCCTV);
        return (
          <span key={i} className="tableRowText wordWrap">
            {placeOfCCTV}
          </span>
        );
      },
    },
    {
      title: "Owner of CCTV",
      dataIndex: "ownerOfCCTV",
      rowKey: "ownerOfCCTV",
      render: (_value, item, i) => {
        const personalDetails =
          !isUndefined(item?.ownerOfCCTV) && item?.ownerOfCCTV?.personalDetails;
        const name =
          (personalDetails?.name ? personalDetails?.name : "") +
          " " +
          (personalDetails?.surname ? personalDetails?.surname : "");
        return (
          <span key={i} className="tableRowText wordWrap">
            {name || ""}
          </span>
        );
      },
    },
    {
      title: "Date of Collection",
      dataIndex: "dateOfCollection",
      rowKey: "dateOfCollection",
      render: (dateOfCollection) => (
        <span className="tableRowText wordWrap">
          {dateOfCollection ? moment(dateOfCollection).format(DATE_FORMAT) : ""}
        </span>
      ),
    },
    {
      title: "Details Of person who gave 65B certificate",
      dataIndex: "person65BName",
      rowKey: "person65BName",
      render: (_value, item, i) => {
        const personalDetails =
          !isUndefined(item?.person65BName) &&
          item?.person65BName?.personalDetails;
        const presentAddress =
          !isUndefined(item?.person65BName) &&
          item?.person65BName?.presentAddress;
        const name =
          (personalDetails?.name ? personalDetails?.name : "") +
          " " +
          (personalDetails?.surname ? personalDetails?.surname : "");
        const address = shortAddress(presentAddress);

        return (
          <span
            key={i}
            className="tableRowText wordWrap"
            style={{ width: "auto" }}
          >
            {`${name}, ${address}`}
          </span>
        );
      },
    },
    {
      title: "Raw Video",
      dataIndex: "cctvFootageRaw",
      rowKey: "cctvFootageRaw",
      render: (cctvFootageRaw) => {
        return (
          !isEmpty(cctvFootageRaw) &&
          cctvFootageRaw.map((item, i) => {
            return (
              <div
                key={i}
                style={{ cursor: "pointer", color: "#02599C" }}
                onClick={() => getFileById(item?.fileId, item?.name, item?.url)}
              >
                {item?.name}
              </div>
            );
          })
        );
      },
    },
    {
      title: "Enhanced Video",
      dataIndex: "enhancedVideo",
      rowKey: "enhancedVideo",
      render: (_value, item, _i) => {
        if (isEmpty(item?.enhancedVideo?.cctvFootageEnhanced)) {
          return <div>{getRawVideoDetails(item)}</div>;
        } else {
          return (
            !isEmpty(item?.enhancedVideo?.cctvFootageEnhanced) &&
            item?.enhancedVideo?.cctvFootageEnhanced.map((item, i) => {
              return (
                <div
                  key={i}
                  style={{ cursor: "pointer", color: "#02599C" }}
                  onClick={() =>
                    getFileById(item?.fileId, item?.name, item?.url)
                  }
                >
                  {item.name}
                </div>
              );
            })
          );
        }
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
                cursor: isEnhancedVideoModalVisible ? "not-allowed" : "pointer",
                color: isEnhancedVideoModalVisible ? "" : "#02599C",
              }}
              onClick={() => {
                if (!isEnhancedVideoModalVisible) {
                  editDetails(item);
                  setViewDetails(true);
                  setIsEnhancedVideoModalVisible(false);
                } else {
                  return;
                }
              }}
            >
              <EyeFilled style={{ marginRight: 5 }} />
              View
            </div>
            {!disableForm ? (
              <div
                style={{
                  cursor: isEnhancedVideoModalVisible
                    ? "not-allowed"
                    : "pointer",
                  color: isEnhancedVideoModalVisible ? "" : "#02599C",
                  marginLeft: 10,
                }}
                onClick={() => {
                  if (!isEnhancedVideoModalVisible) {
                    editDetails(item);
                    setViewDetails(false);
                    setIsEnhancedVideoModalVisible(false);
                  } else {
                    return;
                  }
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
