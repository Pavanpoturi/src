import { Space } from "antd";
import { EyeFilled, EditFilled, CheckCircleOutlined } from "@ant-design/icons";
import { isEmpty } from "lodash";
import TableWrapper from "@containers/Tables/AntTables/AntTables.styles";
import { TableWidgetWrapper } from "@containers/FirDetails/CommonSections/TableWidget.styles";
import moment from "moment";
import { DATE_FORMAT } from "@containers/FirDetails/fir-util";
import { getFileById } from "@containers/media-util";

export default function SavedRecordsNonFSL({
  dataSource,
  editDetails,
  setViewDetails,
  selectedRecord,
  disableForm,
  onQuestionnaireClick,
}) {
  const recordSelected =
    dataSource.length > 1
      ? `${dataSource.length} Record(s) Added`
      : `${dataSource.length} Record Added`;

  const columns = [
    {
      title: "S.No.",
      rowKey: "sNo",
      render: (_value, _record, ind) => ind + 1,
    },
    {
      title: "Expert Type",
      dataIndex: "expertType",
      rowKey: "expertType",
      render: (expertType) => (
        <span className="tableRowText wordWrap">{expertType || ""}</span>
      ),
    },
    {
      title: "Nature Of Report",
      dataIndex: "natureOfReport",
      rowKey: "natureOfReport",
      render: (natureOfReport) => (
        <span className="tableRowText wordWrap">{natureOfReport || ""}</span>
      ),
    },
    {
      title: "Date of Requisition",
      dataIndex: ["requisition", "dateOfRequisitionForReport"],
      render: (date) => (
        <span className="tableRowText wordWrap">
          {!isEmpty(date) ? moment(date).format(DATE_FORMAT) : ""}
        </span>
      ),
    },
    {
      title: "Date of Report",
      dataIndex: ["uploadExpertReport", "dateOfReceiptOfReport"],
      render: (date) => (
        <span className="tableRowText wordWrap">
          {!isEmpty(date) ? moment(date).format(DATE_FORMAT) : ""}
        </span>
      ),
    },
    {
      title: "Strength Of Evidence",
      dataIndex: ["uploadExpertReport", "strengthOfEvidence"],
      render: (strength) => (
        <span className="tableRowText wordWrap">{strength}</span>
      ),
    },
    {
      title: "Date And Time Of Sending To FSL",
      dataIndex: "sendDate",
      render: (value) => {
        let text = !isEmpty(value) ? moment(value).format(DATE_FORMAT) : "";
        return <span className="tableRowText wordWrap">{text}</span>;
      },
    },
    {
      title: "Questionnaire ",
      rowKey: "questionnaire",
      render: (_value, item, ind) => {
        const onClick = () => onQuestionnaireClick(item);
        if (item?.expertType !== "FSL Expert") return null;
        return (
          <Space className="link" onClick={onClick}>
            <CheckCircleOutlined />
            <span>Questionnaire</span>
          </Space>
        );
      },
    },
    {
      title: "Uploads",
      dataIndex: ["uploadExpertReport", "uploadReport"],
      render: (file, _item, i) => {
        const onClick = () => getFileById(file?.fileId, file?.name, file?.url);
        return (
          <span className="tableRowText wordWrap link" onClick={onClick}>
            {file?.name}
          </span>
        );
      },
    },
    {
      title: "Actions",
      rowKey: "actions",
      render: (_value, item, i) => {
        const onView = () => {
          editDetails(item);
          setViewDetails(true);
        };
        const onEdit = () => {
          editDetails(item);
          setViewDetails(false);
        };
        return (
          <Space key={i} size="large">
            <Space className="link" onClick={onView}>
              <EyeFilled />
              <span>View</span>
            </Space>
            {!disableForm ? (
              <Space className="link" onClick={onEdit}>
                <EditFilled />
                <span>Edit</span>
              </Space>
            ) : null}
          </Space>
        );
      },
    },
  ];

  return (
    <TableWidgetWrapper>
      <div style={{ marginBottom: 10, marginLeft: 10 }}>
        <p>{recordSelected}</p>
      </div>
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
