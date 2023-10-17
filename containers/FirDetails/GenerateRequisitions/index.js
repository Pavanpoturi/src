/* eslint-disable array-callback-return */
import { useState } from "react";
import { Row, Card, Col, Form, Select, Button } from "antd";
import { moduleNameOptions } from "./Constants";
import Loader from "@components/utility/loader";
import { isEmpty } from "lodash";
import { config } from "@config/site.config";
import { loadState } from "@lib/helpers/localStorage";
import { useDispatch, useSelector } from "react-redux";
import generateRequisitionsAction from "@redux/generateRequisitions/actions";
import { CaretDownOutlined } from "@ant-design/icons";
import { ModuleWrapper } from "../Investigation/CommonDetails/styles";
import RequisitionsDetails from "./RequisitionsDetails";
import { getAuditHistoryPayload } from "@containers/const";
import auditHistoryActions from "@redux/auditHistory/actions";

const Option = Select.Option;

const styles = {
  widgetPageStyle: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    overflow: "hidden",
    padding: 10,
  },
};

export default function GenerateRequisitions() {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const crimeId = loadState("selectedFirId");
  const [selectedModuleName, setSelectedModuleName] = useState("");
  const { getRequisitionsList } = generateRequisitionsAction;
  const { isFetching, requisitionsList } = useSelector(
    (state) => state.GenerateRequisitions
  );
  const [formValid, setFormValid] = useState(false);
  const [serchText, setSerchText] = useState("");
  const { createAuditHistory } = auditHistoryActions;

  const auditHistoryEntry = () => {
    dispatch(
      createAuditHistory(
        config.createAudits,
        getAuditHistoryPayload(
          crimeId,
          "requisitionsDetails",
          "Requisitions Details Fetched"
        )
      )
    );
  };

  const fetchRequisitionsList = (actionName) => {
    if (actionName === "Arrest on Anticipatory Bail") {
      actionName = "Arrest";
    }
    dispatch(
      getRequisitionsList(
        `${config.templatesUpload}?crimeId=${crimeId}&action=${actionName}`
      )
    );
    auditHistoryEntry();
  };

  const handleSearch = (text) => {
    setSerchText(text);
  };

  const checkFields = async () => {
    const values = await form.validateFields();
    setFormValid(!Object.values(values).every((v) => v == null || v === ""));
  };

  const displayDropdown = (list, actionName) => {
    return (
      <Select
        suffixIcon={<CaretDownOutlined className="dropDownIcon" />}
        style={{ width: 250 }}
        showSearch
        onSearch={handleSearch}
        filterOption={(input, option) =>
          serchText &&
          option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        onSelect={(item) => {
          actionName(item);
          checkFields();
        }}
      >
        {list.map((item, index) => (
          <Option key={index} value={item.value} label={item.label}>
            {item.label}
          </Option>
        ))}
      </Select>
    );
  };

  const renderTableDetails = () => {
    return isFetching ? (
      <Loader />
    ) : (
      <RequisitionsDetails dataSource={requisitionsList} />
    );
  };

  return (
    <ModuleWrapper>
      <div style={styles.widgetPageStyle}>
        <h2 className="pageTitle">Requisitions Details</h2>
      </div>
      <Row>
        <Card style={{ width: "100%" }} className="cardLeftStyle">
          <Form form={form} layout="vertical">
            <Row glutter={24} style={{ marginBottom: 20 }}>
              <Col span={6}>
                <Form.Item name="moduleName" label="Select Module">
                  {displayDropdown(moduleNameOptions, setSelectedModuleName)}
                </Form.Item>
              </Col>
              <Col span={6}>
                <Button
                  className="saveButton"
                  style={{ marginTop: 18 }}
                  disabled={selectedModuleName === ""}
                  onClick={() => fetchRequisitionsList(selectedModuleName)}
                >
                  Submit
                </Button>
              </Col>
            </Row>
          </Form>
          {selectedModuleName !== "" &&
            requisitionsList &&
            !isEmpty(requisitionsList) &&
            renderTableDetails()}
        </Card>
      </Row>
    </ModuleWrapper>
  );
}
