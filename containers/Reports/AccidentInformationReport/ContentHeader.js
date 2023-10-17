import { DatePicker, Row, Col, Form, Button } from "antd";
import {
  DATE_FORMAT,
  DATE_YY_MM_DD,
  renderFieldsWithDropDown,
} from "@containers/FirDetails/fir-util";
import moment from "moment";
import { useSelector } from "react-redux";
import { disableFutureDates } from "@components/Common/helperMethods";

export default function ContentHeader({
  headerTitle,
  submitReport,
  disabled,
  form,
  setSelectedForm54,
  fromDateChange,
  toDateChange,
  selectedFromDate,
}) {
  const { collapsed } = useSelector((state) => state.App);
  return (
    <Row gutter={24}>
      <Col style={{ width: !collapsed ? "80%" : "24%" }}>
        <h3 className="pageTitle" style={{ color: "#454647" }}>
          {headerTitle}
        </h3>
      </Col>
      <Form
        form={form}
        style={{ display: "flex", marginTop: !collapsed ? "1%" : "0%" }}
      >
        <Col span={6}>
          <Form.Item name="fromDate" label="From Date">
            <DatePicker
              format={DATE_FORMAT}
              onChange={fromDateChange}
              disabledDate={disableFutureDates}
              placeholder="Select Date"
              style={{ width: 180 }}
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="toDate" label="To Date" style={{ marginLeft: 30 }}>
            <DatePicker
              format={DATE_FORMAT}
              onChange={toDateChange}
              disabledDate={(current) => {
                let customDate = moment(selectedFromDate).format(DATE_YY_MM_DD);
                return (
                  current &&
                  (current < moment(customDate, DATE_YY_MM_DD) ||
                    current.valueOf() > Date.now())
                );
              }}
              placeholder="Select Date"
              style={{ width: 180 }}
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="form54" label="Form-54" style={{ marginLeft: 40 }}>
            {renderFieldsWithDropDown(
              [
                { label: "All" },
                { label: "Created" },
                { label: "Not Created" },
              ],
              setSelectedForm54,
              null,
              null,
              180,
              false
            )}
          </Form.Item>
        </Col>
        <Col span={4}>
          <Button
            type="primary"
            className="submitButton"
            style={{ marginLeft: 50 }}
            onClick={submitReport}
            disabled={disabled}
          >
            GO
          </Button>
        </Col>
      </Form>
    </Row>
  );
}
