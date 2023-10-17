import { useState, useEffect } from "react";
import { Container } from "../style";
import { Form, Space, Radio, DatePicker, Row, Col, Button } from "antd";
import Table from "./table";
import ChargesheetStatus from "./chargeSheetStatus";
import FilterComponent from "./filterComponent";
import { DATE_FORMAT } from "@containers/FirDetails/fir-util";
import moment from "moment";
import { addPayload } from "../payload";
import IcjsDataActions from "@redux/IcjsRepots/actions";
import { useDispatch } from "react-redux";
import { config } from "@config/site.config";
import { isArray } from "lodash";
import { disableFutureDates } from "@components/Common/helperMethods";
export default function ICJSReport() {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [chargesheetVisble, setChargesheetVisble] = useState(false);
  const [reportVisble, setReportVisble] = useState(false);
  const [dates, setDates] = useState({ from_date: "", to_date: "" });
  const [payloadObj, setPayLoadObj] = useState({});
  const [status, setStatus] = useState(true);
  const [psCode, setPsCode] = useState([]);
  const { fetchReportedChargeSheet, fetchCasesChargeSheet } = IcjsDataActions;
  useEffect(() => {
    form.setFieldsValue({ search: "FIR" });
  }, []);
  const onHandlesubmit = async () => {
    const value = await form.validateFields();
    const payload = addPayload(
      value.from_date,
      value.to_date,
      psCode,
      value.search
    );
    setPayLoadObj(value);
    dispatch(
      fetchReportedChargeSheet(`${config.getChargesheetConsumeStatus}`, payload)
    );
    setChargesheetVisble(false);
    setReportVisble(true);
  };
  return (
    <Container>
      <div style={{ margin: "0,10px,0,10px" }}>
        <Row span={24}>
          <Col span={8}>
            <h4 style={{ fontFamily: "sans-serif", fontSize: "35px" }}>
              Charge sheet Status
            </h4>
          </Col>
          {chargesheetVisble ? (
            <>
              <Col span={14}>
                <Space size={[20, 20]} wrap style={{ marginTop: 15 }}>
                  <div>
                    Results for: FIR Date From Date{" "}
                    {!!dates?.from_date
                      ? moment(new Date(dates?.from_date)).format(DATE_FORMAT)
                      : null}
                    , To Date{" "}
                    {!!dates?.to_date
                      ? moment(new Date(dates?.to_date)).format(DATE_FORMAT)
                      : null}{" "}
                  </div>
                  <div
                    className="tableRowTextUl"
                    onClick={() => {
                      setChargesheetVisble(false);
                      setReportVisble(true);
                      setStatus(true);
                    }}
                  >
                    Modify Search
                  </div>
                </Space>
              </Col>
              <Col span={2}>
                <Space size={[20, 20]} wrap style={{ marginTop: 15 }}>
                  <Button
                    className="stepsButtonInActive"
                    style={{
                      background: "transparent",
                      color: "#02599C",
                      border: "none",
                      boxShadow: "none",
                    }}
                    onClick={() => {
                      form.resetFields();
                      setChargesheetVisble(false);
                      setReportVisble(false);
                      setDates({});
                      setStatus(true);
                    }}
                  >
                    Back
                  </Button>
                </Space>
              </Col>
            </>
          ) : null}
        </Row>

        <div
          style={{
            width: "100%",
            backgroundColor: "white",
            padding: 10,
          }}
        >
          {!chargesheetVisble ? (
            <Form form={form} layout="vertical">
              <Row span={24}>
                <Col span={20}>
                  <FilterComponent
                    form={form}
                    setStatus={setStatus}
                    status={status}
                    setPsCode={setPsCode}
                  />
                </Col>
              </Row>
              <Row span={24} style={{ marginTop: 10 }}>
                <Col span={18}>
                  <Space size={[20, 20]} wrap>
                    <Form.Item name="search" label="Search Type Based On">
                      <Radio.Group name="search">
                        <Radio value={"FIR"}>FIR Date</Radio>
                        <Radio value={"CS"}>Cs Date</Radio>
                        <Radio value={"Filing"}>Filing Date</Radio>
                      </Radio.Group>
                    </Form.Item>
                    <Form.Item
                      name={"from_date"}
                      label="From Date"
                      rules={[{ required: true }]}
                    >
                      <DatePicker
                        style={{ width: 150 }}
                        onChange={(date) => {
                          setDates({ ...dates, ["from_date"]: date });
                        }}
                        value={
                          moment(new Date(dates?.from_date)).isValid()
                            ? moment(new Date(dates?.from_date))
                            : ""
                        }
                        allowClear={true}
                        format={DATE_FORMAT}
                        disabledDate={disableFutureDates}
                      />
                    </Form.Item>
                    <Form.Item
                      name="to_date"
                      label="To Date"
                      rules={[{ required: true }]}
                    >
                      <DatePicker
                        style={{ width: 150 }}
                        onChange={(date) => {
                          setDates({ ...dates, ["to_date"]: date });
                        }}
                        value={
                          moment(new Date(dates?.to_date)).isValid()
                            ? moment(new Date(dates?.to_date))
                            : ""
                        }
                        allowClear={true}
                        format={DATE_FORMAT}
                        disabledDate={disableFutureDates}
                      />
                    </Form.Item>

                    <Button
                      type="primary"
                      className="submitButton"
                      style={{ marginTop: 15 }}
                      onClick={() => {
                        onHandlesubmit();
                      }}
                    >
                      Search
                    </Button>
                    <span
                      className="tableRowTextUl"
                      style={{ marginTop: 15, display: "block" }}
                      onClick={() => {
                        form.resetFields();
                        setChargesheetVisble(false);
                        setReportVisble(false);
                        setDates({});
                        setStatus(true);
                      }}
                    >
                      Reset
                    </span>
                  </Space>
                </Col>
              </Row>
            </Form>
          ) : null}
          <Row span={24} style={{ marginTop: "20px" }}>
            {!chargesheetVisble && reportVisble ? (
              <Table
                setChargesheetVisble={setChargesheetVisble}
                setReportVisble={setReportVisble}
                fetchCasesChargeSheet={fetchCasesChargeSheet}
                dispatch={dispatch}
                payloadObj={payloadObj}
              />
            ) : chargesheetVisble ? (
              <ChargesheetStatus />
            ) : null}
          </Row>
        </div>
      </div>
    </Container>
  );
}
