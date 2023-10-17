import moment from "moment";
import TableWrapper from "@containers/Tables/AntTables/AntTables.styles";
import {
  DATE_TIME_FORMAT,
  isValidHttpUrl,
} from "@containers/FirDetails/fir-util";
import { getFileById } from "@containers/media-util";
import { TableWidgetWrapper } from "./styles";

const styles = { marginLeft: 20, color: "#033c68", cursor: "pointer" };

export default function RequisitionsDetails({ dataSource }) {
  const columns = [
    {
      title: "Report Name",
      dataIndex: "name",
      rowKey: "name",
      render: (_i, item) => (
        <span className="tableRowTextFir">{item.name}</span>
      ),
    },
    {
      title: "Template Version",
      dataIndex: "version",
      rowKey: "version",
      render: (_i, item) => (
        <span className="tableRowTextFir">{item.version || ""}</span>
      ),
    },
    {
      title: "Last Updated",
      dataIndex: "createdAt",
      rowKey: "createdAt",
      render: (createdAt) => (
        <span className="tableRowText">
          {moment(createdAt).format(DATE_TIME_FORMAT)}
        </span>
      ),
    },
    {
      title: "ACTIONS",
      dataIndex: "actions",
      rowKey: "actions",
      render: (_i, item) => {
        return (
          <>
            <span
              className="tableRowTextFir"
              style={styles}
              onClick={() => getFileById(item?.fileId, item?.name, item?.url)}
            >
              View
            </span>
            {isValidHttpUrl(item.url) ? (
              <span
                className="tableRowTextFir"
                style={styles}
                onClick={() => getFileById(item?.fileId, item?.name, item?.url)}
              >
                Download
              </span>
            ) : (
              <span
                className="tableRowTextFir"
                style={{ marginLeft: 20, color: "#9c9c9c" }}
              >
                Download
              </span>
            )}
          </>
        );
      },
    },
  ];

  return (
    <TableWidgetWrapper>
      <div className="widgetContainer1">
        <TableWrapper
          dataSource={dataSource}
          columns={columns}
          pagination={true}
          rowKey={(obj) => obj._id}
          style={{ bordeRadius: 5 }}
          size="small"
        />
      </div>
    </TableWidgetWrapper>
  );
}
