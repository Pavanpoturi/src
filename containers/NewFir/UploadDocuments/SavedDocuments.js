import TableWrapper from "@containers/Tables/AntTables/AntTables.styles";
import { Button } from "antd";
import { isUndefined } from "lodash";
import { getFileById, deleteFileById } from "@containers/media-util";

export default function SavedDocuments({
  dataSource,
  disable,
  openNotificationWithIcon,
  deleteMediaFile,
}) {
  const columns = [
    {
      title: "Document Name",
      dataIndex: "team",
      rowKey: "team",
      render: (i, item) => (
        <div
          key={i}
          style={{ cursor: "pointer", color: "#02599C" }}
          onClick={() => getFileById(item?.fileId, item?.team, item?.url)}
        >
          {item.team}
        </div>
      ),
    },
    {
      title: "Document Type",
      dataIndex: "category",
      rowKey: "category",
      render: (i, item) => (
        <div key={i} style={{ cursor: "pointer", color: "#02599C" }}>
          {item.category}
        </div>
      ),
    },
    {
      title: "Actions",
      dataIndex: "action",
      key: "action",
      render: (_value, item, _index) => {
        if (!isUndefined(item?.fileId) && item?.fileId !== "") {
          return (
            <Button
              disabled={disable}
              className="stepsButtonInActive"
              onClick={() =>
                deleteFileById(
                  item,
                  dataSource,
                  deleteMediaFile,
                  openNotificationWithIcon
                )
              }
            >
              Delete
            </Button>
          );
        }
      },
    },
  ];

  return (
    <TableWrapper
      dataSource={dataSource}
      columns={columns}
      pagination={false}
      rowKey={(obj) => obj._id}
      size="small"
    />
  );
}
