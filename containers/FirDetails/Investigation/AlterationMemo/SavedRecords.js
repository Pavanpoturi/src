import { EyeFilled, EditFilled, CheckOutlined } from "@ant-design/icons";
import { first, isEmpty, isUndefined } from "lodash";
import TableWrapper from "@containers/Tables/AntTables/AntTables.styles";
import { TableWidgetWrapper } from "@containers/FirDetails/CommonSections/TableWidget.styles";
import moment from "moment";
import { Popconfirm, Button } from "antd";
import { DATE_FORMAT } from "../../fir-util";

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
  recordVisible,
  dataSource,
  editDetails,
  setViewDetails,
  selectedRecord,
  confirmDetails,
}) {
  const recordSelected =
    dataSource.length > 1
      ? `${dataSource.length} Record(s) Added`
      : `${dataSource.length} Record Added`;

  const columns = [
    {
      title: "S. NO",
      dataIndex: "index",
      key: "index",
      render: (_value, _item, index) => (
        <span className="tableRowText wordWrap">{++index}</span>
      ),
    },
    {
      title: "Previous Acts & Sections",
      dataIndex: "alteredActsAndSections",
      rowKey: "alteredActsAndSections",
      render: (_value, item, index) => {
        const actListData = item.actListData;

        if (index === 0) {
          const previousAlteredSections =
            !isUndefined(item.prevActs) && item?.prevActs;
          let RWRequired = "";
          const result = previousAlteredSections.reduce(
            (acc, { actDescription, section, rwRequired, accShortName }) => {
              if (rwRequired) {
                RWRequired = "r/w ";
              } else {
                RWRequired = "";
              }
              const namesWithGreeting = (arr) => {
                return arr.map((name) => RWRequired + name);
              };
              const actShortName = (arr) => {
                return arr.filter(
                  (item, _index) => item.ACT_LONG === actDescription
                );
              };
              accShortName = actShortName(actListData);
              section = namesWithGreeting(section);

              acc[actDescription] = {
                actDescription: actDescription,
                accShortName: accShortName?.[0]?.["ACT_SHORT"],
                section:
                  typeof acc[actDescription] !== "undefined"
                    ? acc[actDescription].section.concat(section)
                    : section,
              };

              acc[actDescription].section = acc[actDescription].section.filter(
                (item, index) =>
                  acc[actDescription].section.indexOf(item) === index
              );
              return acc;
            },
            {}
          );
          let resp = Object.values(result);
          const final = resp.map((t, _index) => {
            return t.section.toString() + " " + t.accShortName + "";
          });
          let finalresult = final.toString().replace(/,*$/, ".");
          return <>{finalresult}</>;
        } else if (index > 0) {
          const previousResult = dataSource[index - 1];
          const previousAlteredSections =
            previousResult?.alteredActsAndSections;
          let RWRequired = "";
          const result = previousAlteredSections.reduce(
            (acc, { actDescription, section, rwRequired, accShortName }) => {
              if (rwRequired) {
                RWRequired = "r/w ";
              } else {
                RWRequired = "";
              }
              const namesWithGreeting = (arr) => {
                return arr.map((name) => RWRequired + name);
              };
              const actShortName = (arr) => {
                return arr.filter(
                  (item, _index) => item.ACT_LONG === actDescription
                );
              };
              accShortName = actShortName(actListData);
              section = namesWithGreeting(section);

              acc[actDescription] = {
                actDescription: actDescription,
                accShortName: accShortName?.[0]?.["ACT_SHORT"],
                section:
                  typeof acc[actDescription] !== "undefined"
                    ? acc[actDescription].section.concat(section)
                    : section,
              };

              acc[actDescription].section = acc[actDescription].section.filter(
                (item, index) =>
                  acc[actDescription].section.indexOf(item) === index
              );
              return acc;
            },
            {}
          );
          let resp = Object.values(result);

          return (
            <>
              {resp.map((t, index) => (
                <span key={index}>
                  {t.accShortName ? t.section + " " : ","}
                  {t.accShortName !== "undefined" ? t.accShortName + "," : ""}
                </span>
              ))}
            </>
          );
        }
      },
    },
    {
      title: "Altered Acts & Sections",
      dataIndex: "alteredActsAndSections",
      rowKey: "alteredActsAndSections",
      render: (_value, item, _index) => {
        const actListData = item.actListData;
        const actsSection = item.alteredActsAndSections;
        let RWRequired = "";
        const result = actsSection.reduce(
          (acc, { actDescription, section, rwRequired, accShortName }) => {
            if (rwRequired) {
              RWRequired = "r/w ";
            } else {
              RWRequired = "";
            }
            const namesWithGreeting = (arr) => {
              return arr.map((name) => RWRequired + name);
            };
            const getActName = (actDescription) =>
              !isEmpty(actListData) &&
              first(actListData.filter((s) => s.ACT_LONG === actDescription))
                ?.ACT_SHORT;
            section = namesWithGreeting(section);
            acc[actDescription] = {
              actDescription: actDescription,
              accShortName: getActName(actDescription),
              section:
                typeof acc[actDescription] !== "undefined"
                  ? acc[actDescription].section.concat(section)
                  : section,
            };
            acc[actDescription].section = acc[actDescription].section.filter(
              (item, index) =>
                acc[actDescription].section.indexOf(item) === index
            );
            return acc;
          },
          {}
        );
        let resp = Object.values(result);
        return (
          <>
            {resp.map((t, index) => (
              <span key={index}>
                {t?.accShortName ? t?.section.toString() + " " : ","}
              </span>
            ))}
          </>
        );
      },
    },
    {
      title: "Gravity",
      dataIndex: "gravity",
      rowKey: "gravity",
      render: (gravity) => (
        <span className="tableRowText wordWrap">{gravity ? gravity : ""}</span>
      ),
    },
    {
      title: "Alteration Date",
      dataIndex: "alterationDate",
      rowKey: "alterationDate",
      render: (alterationDate) => (
        <span className="tableRowText wordWrap">
          {alterationDate ? moment(alterationDate).format(DATE_FORMAT) : ""}
        </span>
      ),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      rowKey: "actions",
      render: (i, item) => {
        return (
          <div key={i} style={styles.widgetPageStyle}>
            <div
              style={{ cursor: "pointer", color: "#02599C" }}
              onClick={() => {
                editDetails(item.selectedRecord);
                setViewDetails(true);
                recordVisible(false);
              }}
            >
              <EyeFilled style={{ marginRight: 5 }} />
              View
            </div>
            {item.confirmAlteration === false ? (
              <>
                <div
                  style={{
                    cursor: "pointer",
                    color: "#02599C",
                    marginLeft: 10,
                  }}
                  onClick={() => {
                    editDetails(item.selectedRecord);
                    setViewDetails(false);
                    recordVisible(false);
                  }}
                >
                  <EditFilled style={{ marginRight: 5 }} />
                  Edit
                </div>
                <div>
                  <Popconfirm
                    title="Are you sure?"
                    onConfirm={() => {
                      confirmDetails(item.selectedRecord);
                    }}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button
                      type="primary"
                      className={"stepsButtonActive"}
                      style={{ width: 150 }}
                    >
                      Confirm
                    </Button>
                  </Popconfirm>
                </div>
              </>
            ) : (
              <div>
                <CheckOutlined style={{ fontSize: "30px", color: "green" }} />
                Confirmed
              </div>
            )}
          </div>
        );
      },
    },
  ];

  let uniqueId = 0;
  console.log("dataSource", dataSource);
  return (
    <TableWidgetWrapper>
      <div className="widgetContainer">
        <div style={{ marginBottom: 10, marginLeft: 10 }}>
          <p>{recordSelected}</p>
        </div>
        <TableWrapper
          rowClassName={(record, _index) =>
            selectedRecord?._id === record.selectedRecord._id ? "editMode" : ""
          }
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
