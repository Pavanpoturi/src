import { EyeFilled, EditFilled } from "@ant-design/icons";
import TableWrapper from "@containers/Tables/AntTables/AntTables.styles";

export default function ImagesTable({
  records,
  editMaterialObject,
  selectedRecord,
  setViewMaterialObjectDetails,
  disableEdit,
}) {
  const columns = [
    {
      dataIndex: "main_type",
      render: (_i, item) => (
        <span>
          <p style={{ fontSize: 15 }}>{item?.type}</p>
          <p style={{ fontSize: 12 }}>{item?.subType}</p>
        </span>
      ),
      key: "main_type",
    },
    {
      render: (_i, item) => (
        <EyeFilled
          className="iconStyle"
          onClick={() => {
            editMaterialObject(item);
            setViewMaterialObjectDetails(true);
          }}
        />
      ),
    },
    {
      render: (_i, item) =>
        !disableEdit && (
          <EditFilled
            className="iconStyle"
            onClick={() => {
              editMaterialObject(item);
              setViewMaterialObjectDetails(false);
            }}
          />
        ),
    },
  ];

  return (
    <TableWrapper
      style={{ paddingTop: 5 }}
      rowClassName={(record, index) =>
        record.mo_id === selectedRecord?.mo_id ? "editMode" : ""
      }
      showHeader={false}
      dataSource={records}
      columns={columns}
      pagination={true}
      rowKey={(obj) => obj._id}
      size="small"
    />
  );
}
