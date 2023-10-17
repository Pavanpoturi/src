import { useState } from "react";
import { EyeFilled, EditFilled, DeleteFilled } from "@ant-design/icons";
import { isEmpty } from "lodash";
import TableWrapper from "@containers/Tables/AntTables/AntTables.styles";
import { TableWidgetWrapper } from "@containers/FirDetails/CommonSections/TableWidget.styles";
import { Popconfirm } from "antd";
import { getFileById } from "@containers/media-util";

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
  editDetails,
  setViewDetails,
  selectedRecord,
  recordVisible,
  isVictim,
  typeLabel,
  disable,
  complainantDetails = {},
  deletePersonDetailsFromFir,
}) {
  const [selectedMedia, setSelectedMedia] = useState(null);

  const recordSelected =
    dataSource.length > 1
      ? `${dataSource.length} Record(s) Added`
      : `${dataSource.length} Record Added`;

  const columns = [
    {
      title: typeLabel,
      dataIndex: "typeLabel",
      rowKey: "typeLabel",
      render: (_i, item) => {
        const type = isVictim
          ? item?.selectedRecord?.victimType
          : item?.selectedRecord?.isSuspectOrAccused;
        return <span className="tableRowText wordWrap">{type || ""}</span>;
      },
    },
    {
      title: "Name/Occupation/Gender/Age ",
      dataIndex: "personalDetails",
      rowKey: "personalDetails",
      render: (personalDetails) => (
        <span className="tableRowText wordWrap">{personalDetails}</span>
      ),
    },
    {
      title: "S/o",
      dataIndex: "fatherName",
      rowKey: "fatherName",
      render: (fatherName) => (
        <span className="tableRowText wordWrap">{fatherName}</span>
      ),
    },
    {
      title: "Address",
      dataIndex: "personAddress",
      rowKey: "personAddress",
      render: (personAddress) => (
        <span className="tableRowText wordWrap">{personAddress}</span>
      ),
    },
    {
      title: "Uploaded Media",
      dataIndex: "mediaDetails",
      rowKey: "mediaDetails",
      render: (_i, item) => {
        return (
          !isEmpty(item.mediaDetails) &&
          item.mediaDetails.map((media, i) => {
            return (
              <div
                key={i}
                style={{ cursor: "pointer", color: "#02599C" }}
                onClick={() => {
                  setSelectedMedia(item.selectedRecord);
                  getFileById(media?.fileId, media?.name, media?.url);
                }}
              >
                {media.name}
              </div>
            );
          })
        );
      },
    },
    {
      title: "Actions",
      dataIndex: "actions",
      rowKey: "actions",
      render: (_value, item, index) => {
        const isComplainantExist =
          complainantDetails?.person?._id === item?.selectedRecord?.person?._id;
        return (
          <div key={index} style={styles.widgetPageStyle}>
            <div
              style={{ cursor: "pointer", color: "#02599C" }}
              onClick={() => {
                editDetails(item.selectedRecord, index);
                setViewDetails(true);
                recordVisible && recordVisible(false);
              }}
            >
              <EyeFilled style={{ marginRight: 5 }} />
              View
            </div>
            {!disable && !isComplainantExist ? (
              <div
                style={{ cursor: "pointer", color: "#02599C", marginLeft: 10 }}
                onClick={() => {
                  editDetails(item.selectedRecord, index);
                  setViewDetails(false);
                  recordVisible && recordVisible(false);
                }}
              >
                <EditFilled style={{ marginRight: 5 }} />
                Edit
              </div>
            ) : null}
            {deletePersonDetailsFromFir && !disable && !isComplainantExist ? (
              <Popconfirm
                title="Are you sure?"
                onConfirm={() => {
                  deletePersonDetailsFromFir(item.selectedRecord?.person?._id);
                }}
                okText="Yes"
                cancelText="No"
              >
                <div
                  style={{
                    cursor: "pointer",
                    color: "#02599C",
                    marginLeft: 10,
                  }}
                >
                  <DeleteFilled style={{ marginRight: 5 }} />
                  Delete
                </div>
              </Popconfirm>
            ) : null}
          </div>
        );
      },
    },
  ];

  let uniqueId = 0;

  return (
    <TableWidgetWrapper>
      <div className="widgetContainer">
        <div style={{ marginBottom: 10, marginLeft: 10 }}>
          <p>{recordSelected}</p>
        </div>
        <TableWrapper
          rowClassName={(record, _index) =>
            selectedRecord?.person?._id === record.selectedRecord?.person?._id
              ? "editMode"
              : ""
          }
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          rowKey={(record) => {
            if (!record.__uniqueId) record.__uniqueId = ++uniqueId;
            return record.__uniqueId;
          }}
          size="small"
        />
      </div>
    </TableWidgetWrapper>
  );
}
