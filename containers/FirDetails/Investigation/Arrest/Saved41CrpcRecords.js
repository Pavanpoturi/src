import TableWrapper from "@containers/Tables/AntTables/AntTables.styles";
import { TableWidgetWrapper } from "@containers/FirDetails/CommonSections/TableWidget.styles";
import moment from "moment";
import { displayStatusDetails } from "@containers/FirDetails/fir-util";

export default function Saved41CrpcRecords({ dataSource }) {
  const recordSelected =
    dataSource.length > 1
      ? `${dataSource.length} Record(s) Added`
      : `${dataSource.length} Record Added`;

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
      title: "Status",
      dataIndex: "status",
      rowKey: "status",
      render: (_i, item) => {
        const dateOfIssue41CRPC = item?.selectedRecord?.dateOfIssue
          ? moment(item?.selectedRecord?.dateOfIssue).format("DD/MM/YYYY")
          : "";
        const dispayStatus = item?.selectedRecord?.dateOfIssue
          ? `41A Cr.P.C issued on ${dateOfIssue41CRPC}`
          : `41A Cr.P.C issued`;
        return displayStatusDetails(
          dispayStatus,
          item?.selectedRecord?.accusedId?.personalDetails?.isDied
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
