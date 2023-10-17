import React from "react";
import TableWrapper from "../AntTables.styles";

// eslint-disable-next-line import/no-anonymous-default-export
export default function ({ dataList, tableInfo }) {
  const [state, setState] = React.useState(dataList.getAll());

  function onChange(sorter) {
    if (sorter && sorter.columnKey && sorter.order) {
      if (sorter.order === "ascend") {
        dataList.getSortAsc(sorter.columnKey);
      } else {
        dataList.getSortDesc(sorter.columnKey);
      }
      setState(dataList.getAll());
    }
  }
  return (
    <TableWrapper
      columns={tableInfo.columns}
      onChange={onChange}
      dataSource={state}
      className="sortingTable"
      size="small"
    />
  );
}
