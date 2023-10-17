import { Table, Typography } from "antd";
import moment from "moment";
import { DATE_FORMAT } from "@containers/FirDetails/fir-util";
import { useSelector } from "react-redux";
import Loader from "@components/utility/loader";
const { Text } = Typography;

const ChargesheetStatus = () => {
  const { isFetching = false, chargeSheetStatus = [] } = useSelector(
    (state) => state.IcjsReports
  );

  const columns = [
    {
      title: "S.No",
      render: (_, data, i) => <Text>{i + 1}</Text>,
    },
    {
      title: "Cr.No",
      render: (_, data, i) => (
        <span className="tableRowTextUl">{data.firNum}</span>
      ),
    },
    {
      title: "FIR Date",
      render: (_i, item) => (
        <span className="tableRowText">
          {item?.firDate ? moment(item?.firDate).format(DATE_FORMAT) : ""}
        </span>
      ),
    },
    {
      title: "Crime Classification",
      dataIndex: "crimeType",
    },
    {
      title: "CS.No",
      dataIndex: "csno",
      render: (_, data, i) => (
        <span className="tableRowText">{data.chargeSheetNo}</span>
      ),
    },
    {
      title: "CS Date",
      render: (_i, item) => (
        <span className="tableRowText">
          {item?.chargeSheetDate
            ? moment(item?.chargeSheetDate).format(DATE_FORMAT)
            : ""}
        </span>
      ),
    },
    {
      title: "CS Confirmed Date",
      render: (_i, item) => (
        <span className="tableRowText">
          {item?.csConfirmedDate
            ? moment(item?.csConfirmedDate).format(DATE_FORMAT)
            : ""}
        </span>
      ),
    },
    {
      title: "CS Consumed Date",
      render: (_i, item) => (
        <span className="tableRowText">
          {moment(new Date(item?.dateOfFiling)).isValid()
            ? moment(new Date(item?.dateOfFiling)).format(DATE_FORMAT)
            : !!item?.dateOfFiling
            ? item?.dateOfFiling
            : ""}
        </span>
      ),
    },
    {
      title: "CS Status",
      dataIndex: "status",
    },
    {
      title: "Date of Filing",
      render: (_i, item) => (
        <span className="tableRowText">
          {console.log(item)}
          {moment(new Date(item?.dateOfFiling)).isValid()
            ? moment(new Date(item?.dateOfFiling)).format(DATE_FORMAT)
            : !!item?.dateOfFiling
            ? item?.dateOfFiling
            : ""}
        </span>
      ),
    },
    {
      title: "CNR Number",
      dataIndex: "cnr",
    },
  ];

  return (
    <div style={{ width: "100%" }}>
      {isFetching ? (
        <Loader />
      ) : (
        <Table columns={columns} dataSource={chargeSheetStatus} />
      )}
    </div>
  );
};
export default ChargesheetStatus;
