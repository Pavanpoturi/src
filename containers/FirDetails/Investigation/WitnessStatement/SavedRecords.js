import { EyeFilled, EditFilled } from "@ant-design/icons";
import { isEmpty, isArray, isUndefined } from "lodash";
import TableWrapper from "@containers/Tables/AntTables/AntTables.styles";
import { TableWidgetWrapper } from "@containers/FirDetails/CommonSections/TableWidget.styles";
import moment from "moment";
import { DATE_TIME_FORMAT } from "../../fir-util";
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
  recordVisible,
  dataSource,
  editDetails,
  setViewDetails,
  selectedRecord,
}) {
  const recordSelected =
    dataSource.length > 1
      ? `${dataSource.length} Record(s) Added`
      : `${dataSource.length} Record Added`;

  const witnessList =
    !isEmpty(dataSource) &&
    dataSource.sort(function (a, b) {
      return a.witnessCode.localeCompare(b.witnessCode, undefined, {
        numeric: true,
        sensitivity: "base",
      });
    });

  const columns = [
    {
      title: "Witness Code",
      dataIndex: "witnessCode",
      rowKey: "witnessCode",
      render: (witnessCode) => (
        <span className="tableRowText wordWrap">{witnessCode}</span>
      ),
    },
    {
      title: "Witness Name",
      dataIndex: "witnessName",
      rowKey: "witnessName",
      render: (witnessName) => (
        <span className="tableRowText wordWrap">{witnessName}</span>
      ),
    },
    {
      title: "Type Of Witness",
      dataIndex: "typeOfWitness",
      rowKey: "typeOfWitness",
      render: (typeOfwitness, val) => {
        let label = "";
        if (typeOfwitness === "Official witnesses / Experts") {
          label = `${val?.typeOfWitness} (${val?.subTypeOfWitness})`;
        } else if (val?.typeOfWitness === "Panch witness") {
          label = `${
            val?.typeOfWitness
          } (${val?.panchSubTypeOfWitness.join()})`;
        } else if (val?.typeOfWitness) {
          label = val?.typeOfWitness;
        } else {
          label = "";
        }
        return <span className="tableRowText wordWrap">{label}</span>;
      },
    },
    {
      title: "Category",
      dataIndex: "categoryOfWitness",
      rowKey: "categoryOfWitness",
      render: (categoryOfWitness) => (
        <span className="tableRowText wordWrap">{categoryOfWitness}</span>
      ),
    },
    {
      title: "Date & Time of Examination",
      dataIndex: "dateTimeofRecording",
      rowKey: "dateTimeofRecording",
      render: (_i, item) => {
        return (
          !isEmpty(item.dateTimeofRecording) &&
          item.dateTimeofRecording.map((item) => {
            return (
              <span className="tableRowText wordWrap">
                {item ? moment(item).format(DATE_TIME_FORMAT) : ""}
              </span>
            );
          })
        );
      },
    },
    {
      title: "Strength of Witness",
      dataIndex: "strengthOfWitness",
      rowKey: "strengthOfWitness",
      render: (_i, item) => {
        return (
          !isEmpty(item.strengthOfWitness) &&
          item.strengthOfWitness.map((item) => {
            return <span className="tableRowText wordWrap">{item}</span>;
          })
        );
      },
    },
    {
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
                editDetails(item.selectedRecord);
                setViewDetails(true);
                recordVisible(false);
              }}
            >
              <EyeFilled style={{ marginRight: 5 }} />
              View
            </div>
            <div
              style={{ cursor: "pointer", color: "#02599C", marginLeft: 10 }}
              onClick={() => {
                editDetails(item.selectedRecord);
                setViewDetails(false);
                recordVisible(false);
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
      <div className="widgetContainer">
        <div style={{ marginBottom: 10, marginLeft: 10 }}>
          <p>{recordSelected}</p>
        </div>
        <TableWrapper
          rowClassName={(record, _index) =>
            selectedRecord?._id === record.selectedRecord._id ? "editMode" : ""
          }
          dataSource={witnessList}
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
