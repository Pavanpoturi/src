import TableWrapper from "@containers/Tables/AntTables/AntTables.styles";
import { TableWidgetWrapper } from "@containers/FirDetails/CommonSections/TableWidget.styles";
import { useState } from "react";
import { first } from "lodash";

export default function SavedRecords({
  dataSource,
  personDetailsSelected,
  personType,
  showRadioOnchange,
}) {
  const [selectedRow, setSelectedRow] = useState("");

  const recordSelected =
    dataSource.length > 1
      ? `${dataSource.length} Record(s) Added`
      : `${dataSource.length} Record Added`;

  const columns = [
    {
      title: "Name/Occupation/Gender/Age",
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
  ];
  let uniqueId = 0;

  const rowSelection = {
    selectedRow,
    onChange: (_selectedRowKeys, selectedRows) => {
      const selectedRecord = first(selectedRows)?.selectedRecord;
      setSelectedRow(selectedRecord);
      personDetailsSelected(selectedRecord?.person, true, personType);
    },
    getCheckboxProps: (record) => ({
      key: record.key,
    }),
    type: "radio",
  };

  return (
    <TableWidgetWrapper>
      <div style={{ marginBottom: 10, marginLeft: 10 }}>
        <p>{recordSelected}</p>
      </div>
      <TableWrapper
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        rowSelection={showRadioOnchange ? rowSelection : ""}
        rowKey={(record) => {
          if (!record.__uniqueId) record.__uniqueId = ++uniqueId;
          return record.__uniqueId;
        }}
        size="small"
      />
    </TableWidgetWrapper>
  );
}
