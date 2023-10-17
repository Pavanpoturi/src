import { useState, useEffect } from "react";
import { EyeFilled, EditFilled } from "@ant-design/icons";
import { isEmpty } from "lodash";
import TableWrapper from "@containers/Tables/AntTables/AntTables.styles";
import { TableWidgetWrapper } from "@containers/FirDetails/CommonSections/TableWidget.styles";
import { getFileById } from "@containers/media-util";
import moment from "moment";
import { Tooltip } from "antd";

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
  isMedia = false,
  recordVisible,
}) {
  const [dataSourceState, setDataSourceState] = useState([]);
  const recordSelected =
    dataSource.length > 1
      ? `${dataSource.length} Record(s) Added`
      : `${dataSource.length} Record Added`;

  useEffect(() => {
    let total = [];
    dataSource.forEach((ele) => {
      let totalObj = {};
      const pushData = () => {
        totalObj.accusedCodeNumber = ele?.accusedCodeNumber;
        totalObj.actions = ele?.actions;
        totalObj.accusedId = ele?.selectedRecord?.accusedId?._id;
        totalObj.dateOfArrest = ele?.dateOfArrest;
        totalObj.mediaDetails = ele?.mediaDetails;
        totalObj.personAddress = ele?.personAddress;
        totalObj.personalDetails = ele?.personalDetails;
        totalObj.accusedGroup = [ele?.selectedRecord];
        total.push(totalObj);
      };
      if (total && total.length > 0) {
        total.forEach((t1) => {
          //grouping accused if exists
          if (
            t1?.accusedId.toString() ===
            ele?.selectedRecord?.accusedId?._id.toString()
          ) {
            t1.accusedGroup = t1.accusedGroup.concat([ele?.selectedRecord]);
          } else {
            //pusing unique accused
            let x1 = total.find(
              (f1) =>
                f1?.accusedId.toString() ===
                ele?.selectedRecord?.accusedId?._id.toString()
            );
            if (!x1) {
              pushData();
            }
          }
        });
      } else {
        //inserting find accused
        pushData();
      }
    });
    setDataSourceState(total);
  }, [dataSource]);

  const mediaDetails = {
    title: "Uploaded Media",
    dataIndex: "mediaDetails",
    rowKey: "mediaDetails",
    render: (_i, item) => {
      return (
        !isEmpty(item.mediaDetails) &&
        item.mediaDetails.map((item, i) => {
          return (
            <div
              key={i}
              style={{ cursor: "pointer", color: "#02599C" }}
              onClick={() => getFileById(item?.fileId, item?.name, item?.url)}
            >
              {item.name}
            </div>
          );
        })
      );
    },
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
      title: "Name/Occupation/Gender/Age ",
      dataIndex: "personalDetails",
      rowKey: "personalDetails",
      render: (personalDetails) => (
        <span className="tableRowText wordWrap">{personalDetails}</span>
      ),
    },
    {
      title: "S/O (or) s/o",
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
      title: "Date of issue of 41A Cr.P.C.notice",
      dataIndex: "accusedGroup",
      rowKey: "accusedGroup",
      render: (accusedGroup) => (
        <>
          {accusedGroup.map((ele) => {
            return (
              <span
                style={styles.widgetPageStyle}
                className="tableRowText wordWrap"
              >
                {moment(ele?.dateOfIssue).format("DD/MM/YYYY")}
              </span>
            );
          })}
        </>
      ),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      rowKey: "actions",
      render: (i, item) => (
        <>
          {item?.accusedGroup.map((ele) => {
            return (
              <div key={i} style={styles.widgetPageStyle}>
                <Tooltip
                  placement="topLeft"
                  title={moment(ele?.dateOfIssue).format("DD/MM/YYYY")}
                >
                  <div
                    style={{ cursor: "pointer", color: "#02599C" }}
                    onClick={() => {
                      editDetails(ele);
                      setViewDetails(true);
                      recordVisible && recordVisible(false);
                    }}
                  >
                    <EyeFilled style={{ marginRight: 5 }} />
                    View
                  </div>
                </Tooltip>
                <Tooltip
                  placement="topRight"
                  title={moment(ele?.dateOfIssue).format("DD/MM/YYYY")}
                >
                  <div
                    style={{
                      cursor: "pointer",
                      color: "#02599C",
                      marginLeft: 10,
                    }}
                    onClick={() => {
                      editDetails(ele);
                      setViewDetails(false);
                      recordVisible && recordVisible(false);
                    }}
                  >
                    <EditFilled style={{ marginRight: 5 }} />
                    Edit
                  </div>
                </Tooltip>
              </div>
            );
          })}
        </>
      ),
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
            selectedRecord?._id === record?.selectedRecord?._id
              ? "editMode"
              : ""
          }
          dataSource={dataSourceState}
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
