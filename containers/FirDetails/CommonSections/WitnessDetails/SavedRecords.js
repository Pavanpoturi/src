import { EyeFilled, EditFilled } from "@ant-design/icons";
import { isEmpty, isUndefined } from "lodash";
import TableWrapper from "@containers/Tables/AntTables/AntTables.styles";
import { TableWidgetWrapper } from "@containers/FirDetails/CommonSections/TableWidget.styles";
import moment from "moment";
import { getFileById2 } from "@containers/media-util";

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
  disableForm,
  setSelectedSiderMenu,
}) {
  const recordSelected =
    dataSource.length > 1
      ? `${dataSource.length} Record(s) Added`
      : `${dataSource.length} Record Added`;

  const columns = [
    {
      title: <div style={{ width: 35, maxWidth: 35 }}>S.No.</div>,
      dataIndex: "",
      rowKey: "",
      width: 80,
      render: (_propertyStatus, _item, i) => (
        <span className="tableRowText wordWrap">{i + 1}</span>
      ),
    },
    {
      title: "Witness Name",
      dataIndex: "name",
      rowKey: "name",
      width: 80,
      render: (_i, item) => (
        <span className="tableRowText wordWrap">
          {!isUndefined(item?.selectedRecord?.person?.personalDetails) &&
            item?.selectedRecord?.person?.personalDetails?.name}{" "}
          {!isUndefined(item?.selectedRecord?.person?.personalDetails) &&
            item?.selectedRecord?.person?.personalDetails?.surname}
        </span>
      ),
    },
    {
      title: "Father/Husband/Guardian",
      dataIndex: "fatherName",
      rowKey: "fatherName",
      render: (_i, item) => (
        <span className="tableRowText wordWrap">
          {!isUndefined(item?.selectedRecord?.person?.personalDetails) &&
            item?.selectedRecord?.person?.personalDetails
              ?.fatherHusbandGuardianName}{" "}
        </span>
      ),
    },
    {
      title: "Age",
      dataIndex: "age",
      rowKey: "age",
      width: 80,
      render: (_i, item) => {
        const personalDetails =
          !isUndefined(item?.selectedRecord?.person?.personalDetails) &&
          item?.selectedRecord?.person?.personalDetails;
        const doB = personalDetails?.dateOfBirth
          ? `${moment().diff(personalDetails?.dateOfBirth, "years")} Years `
          : "";
        const ageDetails = personalDetails?.age
          ? `${personalDetails?.age} Years`
          : doB;
        return <span className="tableRowText wordWrap">{ageDetails}</span>;
      },
    },
    {
      title: "Caste",
      dataIndex: "caste",
      rowKey: "caste",
      width: 80,
      render: (_i, item) => (
        <span className="tableRowText wordWrap">
          {!isUndefined(item?.selectedRecord?.person?.personalDetails) &&
            item?.selectedRecord?.person?.personalDetails?.caste}{" "}
        </span>
      ),
    },
    {
      title: "Occupation",
      dataIndex: "occupation",
      rowKey: "occupation",
      width: 80,
      render: (_i, item) => (
        <span className="tableRowText wordWrap">
          {!isUndefined(item?.selectedRecord?.person?.personalDetails) &&
            item?.selectedRecord?.person?.personalDetails?.occupation}{" "}
        </span>
      ),
    },
    {
      title: "Address",
      dataIndex: "personAddress",
      rowKey: "personAddress",
      render: (personAddress, item) => {
        return <span className="tableRowText wordWrap">{personAddress}</span>;
      },
    },
    {
      title: "Witness Examination Status",
      dataIndex: "witnessExaminationStatus",
      rowKey: "witnessExaminationStatus",
      render: (_i, item) => {
        return (
          <div className="tableRowText wordWrap">
            {item?.selectedRecord?.isExamined ? (
              <>
                <span>EXAMINED/</span>
                <span
                  style={{ cursor: "pointer", color: "#02599C" }}
                  onClick={() => {
                    setViewDetails(false);
                    recordVisible(false);
                    setSelectedSiderMenu("witnessStatement");
                    localStorage.setItem(
                      "witness_code",
                      item?.selectedRecord?.witnessCode
                    );
                  }}
                >
                  RE-examine
                </span>
              </>
            ) : (
              <span>NOT YET EXAMINED</span>
            )}
          </div>
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
                onClick={() =>
                  getFileById2(item?.fileId, item?.name, item?.mimeType)
                }
              >
                <EyeFilled style={{ marginRight: 5 }} /> {item.name}
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
            {!disableForm ? (
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
