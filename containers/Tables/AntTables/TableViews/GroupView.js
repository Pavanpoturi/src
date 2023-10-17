import React from "react";
import TableWrapper from "../AntTables.styles";

// eslint-disable-next-line import/no-anonymous-default-export
export default function (props) {
  return (
    <TableWrapper
      columns={props.tableInfo.columns}
      dataSource={props.dataList.getAll()}
      className="groupTable"
      size="small"
    />
  );
}
