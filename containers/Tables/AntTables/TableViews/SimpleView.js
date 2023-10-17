import React from "react";
import TableWrapper from "../AntTables.styles";

// eslint-disable-next-line import/no-anonymous-default-export
export default function (props) {
  const dataSource = props.dataSource || props.dataList.getAll();
  const columns = props.columns || props.tableInfo.columns;
  return (
    <TableWrapper
      pagination={false}
      columns={columns}
      dataSource={dataSource}
      className="simpleTable"
      size="small"
    />
  );
}
