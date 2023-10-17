import TableWrapper from "@containers/Tables/AntTables/AntTables.styles";
import { TableWidgetWrapper } from "@containers/FirDetails/CommonSections/TableWidget.styles";

export default function TableRecords({
  dataSource,
  columns,
  selectedIndex,
  tableTitle = "",
}) {
  return (
    <TableWidgetWrapper>
      {tableTitle && <div className="tableTitle">{tableTitle}</div>}
      <TableWrapper
        rowClassName={(_record, index) =>
          index === selectedIndex ? "editMode" : ""
        }
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        rowKey={(_object, index) => index}
        size="small"
      />
    </TableWidgetWrapper>
  );
}
