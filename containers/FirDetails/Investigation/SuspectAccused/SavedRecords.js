import { useState } from "react";
import { EyeFilled, EditFilled } from "@ant-design/icons";
import { isUndefined, isEmpty, first } from "lodash";
import { Tabs } from "antd";
import Loader from "@components/utility/loader";
import moment from "moment";
import { getFileById } from "@containers/media-util";
import {
  getPersonPersonalAddress,
  getAccusedStatus,
  getCCLStatus,
  displayStatusDetailsAccused,
} from "@containers/FirDetails/fir-util";
import TableWrapper from "@containers/Tables/AntTables/AntTables.styles";
import { TableWidgetWrapper } from "@containers/FirDetails/CommonSections/TableWidget.styles";
import { ModuleWrapper } from "../CommonDetails/styles";

const { TabPane } = Tabs;

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
  editSuspectAccusedDetails,
  setViewSuspectAccused,
  selectedRecord,
  recordVisible,
  arrestList,
  juvenileApprehensionList,
  disableForm,
}) {
  const [selectedTab, setSelectedTab] = useState("1");
  const [isTabChanged, setIsTabChanged] = useState(false);
  const accusedData =
    !isEmpty(dataSource) &&
    dataSource.filter((s) => s.selectedRecord.isSuspectOrAccused !== "CCL");
  const cclData =
    !isEmpty(dataSource) &&
    dataSource.filter((s) => s.selectedRecord.isSuspectOrAccused === "CCL");

  const recordSelected =
    dataSource.length > 1
      ? `${dataSource.length} record(s) added`
      : `${dataSource.length} Record(s) Added`;

  const getName = (item) => (
    <span className="tableRowText wordWrap">
      {!isUndefined(item?.selectedRecord?.person?.personalDetails) &&
        item?.selectedRecord?.person?.personalDetails?.name}{" "}
      {!isUndefined(item?.selectedRecord?.person?.personalDetails) &&
        item?.selectedRecord?.person?.personalDetails?.surname}
    </span>
  );

  const getAge = (item) => {
    const personalDetails =
      !isUndefined(item?.selectedRecord?.person?.personalDetails) &&
      item?.selectedRecord?.person?.personalDetails;
    const doB = personalDetails?.dateOfBirth
      ? `${moment().diff(personalDetails?.dateOfBirth, "years")} Years `
      : "";
    const ageDetails = personalDetails?.age
      ? `${personalDetails?.age} Years`
      : doB;
    return <span className="tableRowText wordWrap">{ageDetails}</span>;
  };

  const getPersonAddress = (personAddress, item) => {
    return (
      <>
        <span className="tableRowText wordWrap">{personAddress}</span>
        <span className="tableRowText wordWrap">
          {!isUndefined(item?.selectedRecord?.person) &&
            item?.selectedRecord?.person?.permanentAddress &&
            "n/o: " +
              getPersonPersonalAddress(
                !isUndefined(item?.selectedRecord?.person) &&
                  item?.selectedRecord?.person?.permanentAddress
              )}
        </span>
      </>
    );
  };

  const getStatus = (item) => {
    const accusedDetails =
      !isUndefined(item?.selectedRecord?.person) &&
      item?.selectedRecord?.person;
    const accusedCode =
      !isUndefined(item?.selectedRecord?.accusedCode) &&
      item?.selectedRecord?.accusedCode;
    const filteredArrestList =
      !isEmpty(arrestList) &&
      first(
        arrestList.filter((s) => s?.accusedId?._id === accusedDetails?._id)
      );
    const result = !filteredArrestList
      ? item?.selectedRecord
      : filteredArrestList;

    const filteredjuvenileApprehensionList =
      !isEmpty(juvenileApprehensionList) &&
      first(
        juvenileApprehensionList.filter(
          (s) => s?.accusedId?._id === accusedDetails?._id
        )
      );
    const result1 = !filteredjuvenileApprehensionList
      ? item?.selectedRecord
      : filteredjuvenileApprehensionList;

    const dispayStatus =
      item?.selectedRecord?.isSuspectOrAccused === "CCL"
        ? getCCLStatus(result1)
        : getAccusedStatus(result);

    return displayStatusDetailsAccused(
      dispayStatus,
      item?.selectedRecord?.isDied,
      accusedCode
    );
  };

  const getMediaResult = (media) => {
    return (
      !isEmpty(media.mediaDetails) &&
      media.mediaDetails.map((item, i) => {
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
            editSuspectAccusedDetails(item.selectedRecord);
            setViewSuspectAccused(true);
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
              editSuspectAccusedDetails(item.selectedRecord);
              setViewSuspectAccused(false);
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

  const getCode = (item) => (
    <span className="tableRowText wordWrap">
      {item.selectedRecord.accusedCode
        ? item.selectedRecord.accusedCode
        : item.selectedRecord.suspectCode}
    </span>
  );

  const accusedColumns = [
    {
      title: "S.No.",
      dataIndex: "",
      rowKey: "",
      render: (_propertyStatus, _item, i) => (
        <span className="tableRowText wordWrap">{i + 1}</span>
      ),
    },
    {
      title: "Accused/Suspect",
      dataIndex: "isSuspectOrAccused",
      rowKey: "isSuspectOrAccused",
      render: (_i, item) => (
        <span className="tableRowText wordWrap">
          {item.selectedRecord.isSuspectOrAccused}
        </span>
      ),
    },
    {
      title: "Code",
      dataIndex: "accusedCode",
      rowKey: "accusedCode",
      render: (_i, item) => getCode(item),
    },
    {
      title: "Name",
      dataIndex: "name",
      rowKey: "name",
      render: (_i, item) => getName(item),
    },
    {
      title: "Age",
      dataIndex: "age",
      rowKey: "age",
      render: (_i, item) => getAge(item),
    },
    {
      title: "Address",
      dataIndex: "personAddress",
      rowKey: "personAddress",
      render: (personAddress, item) => getPersonAddress(personAddress, item),
    },
    {
      title: "Accused Status",
      dataIndex: "status",
      rowKey: "status",
      render: (_i, item) => getStatus(item),
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

  const cclColumns = [
    {
      title: "S.No.",
      dataIndex: "",
      rowKey: "",
      render: (_propertyStatus, _item, i) => (
        <span className="tableRowText wordWrap">{i + 1}</span>
      ),
    },
    {
      title: "CCL",
      dataIndex: "isSuspectOrAccused",
      rowKey: "isSuspectOrAccused",
      render: (_i, item) => (
        <span className="tableRowText wordWrap">
          {item.selectedRecord.isSuspectOrAccused}
        </span>
      ),
    },
    {
      title: "Code",
      dataIndex: "accusedCode",
      rowKey: "accusedCode",
      render: (_i, item) => getCode(item),
    },
    {
      title: "Name",
      dataIndex: "name",
      rowKey: "name",
      render: (_i, item) => getName(item),
    },
    {
      title: "Age",
      dataIndex: "age",
      rowKey: "age",
      render: (_i, item) => getAge(item),
    },
    {
      title: "Address",
      dataIndex: "personAddress",
      rowKey: "personAddress",
      render: (personAddress, item) => getPersonAddress(personAddress, item),
    },
    {
      title: "CCL Status",
      dataIndex: "status",
      rowKey: "status",
      render: (_i, item) => getStatus(item),
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

  const changeTab = (activeKey) => {
    setSelectedTab(activeKey);
    setIsTabChanged(true);
    setTimeout(() => {
      setIsTabChanged(false);
    }, 1000);
  };

  const displayAccusedContent = () => {
    return (
      <TableWidgetWrapper>
        <TableWrapper
          rowClassName={(record, _index) =>
            selectedRecord?.person?._id === record.selectedRecord?.person?._id
              ? "editMode"
              : ""
          }
          dataSource={accusedData}
          columns={accusedColumns}
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

  const displayCCLContent = () => {
    return (
      <TableWidgetWrapper>
        <TableWrapper
          rowClassName={(record, _index) =>
            selectedRecord?.person?._id === record.selectedRecord?.person?._id
              ? "editMode"
              : ""
          }
          dataSource={cclData}
          columns={cclColumns}
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
      <Tabs
        defaultActiveKey={selectedTab}
        activeKey={selectedTab}
        onChange={changeTab}
      >
        <TabPane tab={`Accused List ${accusedData?.length}`} key="1">
          {isTabChanged ? (
            <div className="widgetContainer" style={{ minHeight: 300 }}>
              <Loader />
            </div>
          ) : (
            displayAccusedContent()
          )}
        </TabPane>
        <TabPane tab={`CCL List ${cclData?.length}`} key="2">
          {isTabChanged ? (
            <div className="widgetContainer" style={{ minHeight: 300 }}>
              <Loader />
            </div>
          ) : (
            displayCCLContent()
          )}
        </TabPane>
      </Tabs>
    </ModuleWrapper>
  );
}
