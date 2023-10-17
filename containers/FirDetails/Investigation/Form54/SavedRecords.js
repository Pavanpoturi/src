import { EyeFilled, EditFilled } from "@ant-design/icons";
import { isEmpty } from "lodash";
import moment from "moment";
import { DATE_FORMAT } from "@containers/FirDetails/fir-util";
import TableWrapper from "@containers/Tables/AntTables/AntTables.styles";
import { TableWidgetWrapper } from "@containers/FirDetails/CommonSections/TableWidget.styles";
import { getFileById } from "@containers/media-util";
import { ModuleWrapper } from "../CommonDetails/styles";

const styles = {
  widgetPageStyle: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    overflow: "hidden",
    marginBottom: 10,
    marginTop: 10,
  },
};

export default function SavedRecords({
  dataSource,
  editForm54Details,
  viewForm54Details,
  selectedRecord,
  recordVisible,
  disableForm,
}) {
  const recordSelected =
    dataSource.length > 1
      ? `${dataSource.length} record(s) added`
      : `${dataSource.length} Record(s) Added`;

  const getMediaResult = (item) => {
    const links = [];

    if (item?.acknowledgementLetter) {
      const acknowledgementLetter = item?.acknowledgementLetter;
      links.push({
        name: acknowledgementLetter?.name,
        url: acknowledgementLetter?.url,
        fileId: acknowledgementLetter?.fileId,
      });
    }
    if (item?.formOneLetter) {
      const formOneLetter = item?.formOneLetter;
      links.push({
        name: formOneLetter?.name,
        url: formOneLetter?.url,
        fileId: formOneLetter?.fileId,
      });
    }
    if (item?.formTwoLetter) {
      const formTwoLetter = item?.formTwoLetter;
      links.push({
        name: formTwoLetter?.name,
        url: formTwoLetter?.url,
        fileId: formTwoLetter?.fileId,
      });
    }

    return (
      !isEmpty(links) &&
      links.map((item, i) => {
        return (
          <div
            key={i}
            style={{ cursor: "pointer", color: "#02599C" }}
            onClick={() => getFileById(item?.fileId, item?.name, item?.url)}
          >
            {item.name}
          </div>
        );
      })
    );
  };

  const getActions = (item, i) => {
    return (
      <div key={i} style={styles.widgetPageStyle}>
        <div
          style={{ cursor: "pointer", color: "#02599C" }}
          onClick={() => {
            editForm54Details(item);
            viewForm54Details(true);
            recordVisible(false);
          }}
        >
          <EyeFilled style={{ marginRight: 5 }} />
          View
        </div>
        {!disableForm ? (
          <div
            style={{ cursor: "pointer", color: "#02599C", marginLeft: 10 }}
            onClick={() => {
              editForm54Details(item);
              viewForm54Details(false);
              recordVisible(false);
            }}
          >
            <EditFilled style={{ marginRight: 5 }} />
            Edit
          </div>
        ) : null}
      </div>
    );
  };

  const form54Columns = [
    {
      title: "S.No.",
      dataIndex: "",
      rowKey: "",
      render: (_propertyStatus, _item, i) => (
        <span className="tableRowText wordWrap">{i + 1}</span>
      ),
    },
    {
      title: "Reference Number (File No)",
      dataIndex: "referenceNumber",
      rowKey: "referenceNumber",
      render: (_i, item) => (
        <span className="tableRowText wordWrap">{item?.referenceNumber}</span>
      ),
    },
    {
      title: "Generation Date",
      dataIndex: "generationDate",
      rowKey: "generationDate",
      render: (_i, item) => (
        <span className="tableRowText wordWrap">
          {item?.generationDate
            ? moment(item?.generationDate).format(DATE_FORMAT)
            : ""}
        </span>
      ),
    },
    {
      title: "Date Sent to Tribunal",
      dataIndex: "dateSentToTribunal",
      rowKey: "dateSentToTribunal",
      render: (_i, item) => (
        <span className="tableRowText wordWrap">
          {item?.dateSentToTribunal
            ? moment(item?.dateSentToTribunal).format(DATE_FORMAT)
            : ""}
        </span>
      ),
    },
    {
      title: "Uploaded Media",
      dataIndex: "mediaDetails",
      rowKey: "mediaDetails",
      render: (_i, item) => getMediaResult(item),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      rowKey: "actions",
      render: (i, item) => getActions(item, i),
    },
  ];

  const displayForm54Content = () => {
    return (
      <TableWidgetWrapper>
        <TableWrapper
          rowClassName={(record, _index) =>
            selectedRecord?._id === record?._id ? "editMode" : ""
          }
          dataSource={dataSource}
          columns={form54Columns}
          pagination={false}
          rowKey={(record) => {
            if (!record.__uniqueId) record.__uniqueId = ++uniqueId;
            return record.__uniqueId;
          }}
          size="small"
        />
      </TableWidgetWrapper>
    );
  };

  let uniqueId = 0;

  return (
    <ModuleWrapper>
      <div style={{ marginBottom: 10, marginLeft: 10, fontSize: 16 }}>
        <p>{recordSelected}</p>
      </div>
      {displayForm54Content()}
    </ModuleWrapper>
  );
}
