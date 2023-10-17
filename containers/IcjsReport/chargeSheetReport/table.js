import { Table, Typography } from "antd";
import { useSelector } from "react-redux";
import Loader from "@components/utility/loader";
import { addPayload } from "../payload";
import { config } from "@config/site.config";
const { Text } = Typography;
const TableData = ({
  setChargesheetVisble,
  setReportVisble,
  fetchCasesChargeSheet,
  dispatch,
  payloadObj,
}) => {
  const { isFetching = false, reportedChargeSheet = [] } = useSelector(
    (state) => state.IcjsReports
  );
  const onChargeSheetChange = (value, type) => {
    const payload = addPayload(
      payloadObj.from_date,
      payloadObj.to_date,
      value.ps_code,
      payloadObj.search,
      type
    );
    dispatch(
      fetchCasesChargeSheet(`${config.getChargesheetConsumeStatus}`, payload)
    );
    setChargesheetVisble(true);
    setReportVisble(false);
  };
  const columns = [
    {
      title: "S.No.",
      key: "sNo",
      render: (_, __, i) => <Text>{i + 1}</Text>,
    },
    {
      title: "District",
      dataIndex: "district_commissionerate",
      render: (text) => <Text>{text}</Text>,
    },
    {
      title: "Zone",
      dataIndex: "sub_zone",
      render: (text) => <Text>{text}</Text>,
    },
    {
      title: "Division",
      dataIndex: "sdpo",
      render: (text) => <Text>{text}</Text>,
    },
    {
      title: "Circle",
      dataIndex: "circle",
      render: (text) => <Text>{text}</Text>,
    },
    {
      title: "PS Name",
      dataIndex: "ps_name",
      render: (text) => <Text>{text}</Text>,
    },
    {
      title: "Consumed",
      dataIndex: "consumed",
      render: (_, data) => (
        <span
          className="tableRowTextUl"
          onClick={() => {
            onChargeSheetChange(data, "Consumed");
          }}
        >
          {data.consumed}
        </span>
      ),
    },
    {
      title: "Accepted",
      dataIndex: "accepted",
      render: (_, data) => (
        <span
          className="tableRowTextUl"
          onClick={() => {
            onChargeSheetChange(data, "Accepted");
          }}
        >
          {data.accepted}
        </span>
      ),
    },
    {
      title: "Returned",
      dataIndex: "rejected",
      render: (_, data) => (
        <span
          className="tableRowTextUl"
          onClick={() => {
            onChargeSheetChange(data, "Rejected");
          }}
        >
          {data.rejected}
        </span>
      ),
    },
  ];

  const Summary = (currentData) => {
    const counts = {
      consumed: 0,
      accepted: 0,
      rejected: 0,
    };
    currentData.forEach(({ consumed = 0, accepted = 0, rejected = 0 }) => {
      counts.consumed += consumed;
      counts.accepted += accepted;
      counts.rejected += rejected;
    });
    return (
      <Table.Summary.Row>
        <Table.Summary.Cell index={0}>{""}</Table.Summary.Cell>
        <Table.Summary.Cell index={1}>{""}</Table.Summary.Cell>
        <Table.Summary.Cell index={2}>{""}</Table.Summary.Cell>
        <Table.Summary.Cell index={3}>{""}</Table.Summary.Cell>
        <Table.Summary.Cell index={4}>{""}</Table.Summary.Cell>
        <Table.Summary.Cell index={5}>
          <Text>
            <b>Total</b>
          </Text>
        </Table.Summary.Cell>
        <Table.Summary.Cell index={6}>
          <b>{counts.consumed}</b>
        </Table.Summary.Cell>
        <Table.Summary.Cell index={7}>
          <b>{counts.accepted}</b>
        </Table.Summary.Cell>
        <Table.Summary.Cell index={8}>
          <b>{counts.rejected}</b>
        </Table.Summary.Cell>
      </Table.Summary.Row >
    );
  };
  return (
    <div style={{ width: "100%" }}>
      {
        isFetching ? (
          <Loader />
        ) : (
          <Table
            columns={columns}
            dataSource={reportedChargeSheet}
            summary={Summary}
          />
        )
      }
    </div >
  );
};
export default TableData;
