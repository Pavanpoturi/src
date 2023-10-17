import { useState, useEffect } from "react";
import { Modal, Form, Row, Col, DatePicker, Button, Input, Card } from "antd";
import { disableFutureDates } from "@components/Common/helperMethods";
import { useDispatch, useSelector } from "react-redux";
import { loadState } from "@lib/helpers/localStorage";
import { DATE_FORMAT, DATE_YY_MM_DD } from "@containers/FirDetails/fir-util";
import { SearchOutlined } from "@ant-design/icons";
import { textFieldRules } from "@components/Common/formOptions";
import createFIRActions from "@redux/createFir/actions";
import moment from "moment";
import Loader from "@components/utility/loader";
import { config } from "@config/site.config";
import TableWrapper from "@containers/Tables/AntTables/AntTables.styles";
import { TableWidgetWrapper } from "@containers/FirDetails/CommonSections/TableWidget.styles";

import {
  DATE_TIME_FORMAT,
  renderFieldsWithDropDown,
} from "@containers/FirDetails/fir-util";
import masterDataActions from "@redux/masterData/actions";
import { gdDetails } from "./Const";
import { isEmpty } from "lodash";

const { TextArea } = Input;
const { RangePicker } = DatePicker;

export default function GDNumberSearch({
  title,
  isModalVisible,
  handleOk,
  handleCancel,
  formName,
  disable,
}) {
  const dispatch = useDispatch();
  const currentUser = loadState("currentUser");
  const [serchText, setSerchText] = useState("");
  const [formValid, setFormValid] = useState(false);
  const [gdFromToDate, setGdFromToDate] = useState([]);
  const { getStaffList } = masterDataActions;
  const { getGDNumbers } = createFIRActions;
  const { gdNumberList, isGdFetching } = useSelector(
    (state) => state.createFIR
  );

  const { staffList } = useSelector((state) => state.MasterData);

  const handleSearch = (text) => {
    setSerchText(text);
  };

  const columns = [
    {
      title: "GD Entry Number",
      dataIndex: "gdNumber",
      rowKey: "gdNumber",
      render: (gdNumber) => (
        <span className="tableRowText wordWrap">
          {gdNumber ? gdNumber : ""}
        </span>
      ),
    },
    {
      title: "GD Entry Date",
      dataIndex: "gdDate",
      rowKey: "gdDate",
      render: (gdDate) => (
        <span className="tableRowText wordWrap">
          {gdDate ? moment(gdDate).format(DATE_FORMAT) : ""}
        </span>
      ),
    },
    {
      title: "Type of GD Entry",
      dataIndex: "typeOfGdntry",
      rowKey: "typeOfGdntry",
      render: (typeOfGdntry) => (
        <span className="tableRowText wordWrap">
          {typeOfGdntry ? typeOfGdntry : ""}
        </span>
      ),
    },
    {
      title: "GD Entry Officer Name",
      dataIndex: "entryOfficerName",
      rowKey: "entryOfficerName",
      render: (entryOfficerName) => (
        <span className="tableRowText wordWrap">
          {entryOfficerName ? entryOfficerName : ""}
        </span>
      ),
    },
    {
      title: "GD Entry Details in Brief",
      dataIndex: "gdEntryDetails",
      rowKey: "gdEntryDetails",
      render: (gdEntryDetails) => (
        <span className="tableRowText wordWrap">
          {gdEntryDetails ? gdEntryDetails : ""}
        </span>
      ),
    },
  ];

  const checkFields = async () => {
    const values = await formName.validateFields();
    setFormValid(!Object.values(values).every((v) => v == null || v === ""));
  };

  useEffect(() => {
    dispatch(
      getStaffList(
        `${config.getSupportStaffFromHrms}?policestationcode=${currentUser?.cctns_unit_id}`
      )
    );
  }, []);

  const onChangeDate = (date, _dateString) => {
    setGdFromToDate(date);
  };

  const getGDNumberList = () => {
    if (!isEmpty(gdFromToDate)) {
      const payload = {
        fromDate: moment(gdFromToDate[0]).format(DATE_YY_MM_DD),
        toDate: moment(gdFromToDate[1]).format(DATE_YY_MM_DD),
      };
      dispatch(getGDNumbers(config.getGDNumbers, payload));
    }
  };

  const staffListData = staffList.map((item) => {
    const container = {
      label: item.employeeName,
      name: item.paoCode,
    };
    return container;
  });

  const displayGdDetailsFields = (name) => {
    switch (name) {
      case "GD_entry_date":
        return (
          <DatePicker
            showTime
            format={DATE_TIME_FORMAT}
            placeholder="Select Date and Time"
            onChange={checkFields}
            style={{ width: 222 }}
            disabledDate={disableFutureDates}
            disabled={disable}
          />
        );
      case "entryOfficerName":
        return renderFieldsWithDropDown(
          staffListData,
          null,
          handleSearch,
          serchText,
          222,
          disable
        );
      case "typeOfGDEntry":
        return renderFieldsWithDropDown(
          [{ label: "FIR/Criminal case" }],
          null,
          handleSearch,
          serchText,
          222,
          disable
        );
      case "GD_entry_number":
        return (
          <Input
            onChange={checkFields}
            style={{ width: 222 }}
            type="number"
            maxLength={textFieldRules.maxLength}
            disabled={disable}
          />
        );
      default:
        return (
          <Input
            onChange={checkFields}
            style={{ width: 222 }}
            maxLength={textFieldRules.maxLength}
            disabled={disable}
          />
        );
    }
  };

  const displayGDDetailsState = (data, actionName, spanIndex, width) => {
    return (
      <>
        {data.map((s, i) => {
          return (
            <Col span={spanIndex} key={i} style={{ marginBottom: 20 }}>
              <Form.Item
                name={s.name}
                label={s.label}
                style={{ width: width }}
                rules={[
                  {
                    required: true,
                    message: `${s.label} is required.`,
                  },
                ]}
              >
                {actionName(s.name)}
              </Form.Item>
            </Col>
          );
        })}
      </>
    );
  };

  let uniqueId = 0;

  return (
    <Modal
      title={title}
      visible={isModalVisible}
      onOk={handleOk}
      okButtonProps={{ disabled: disable }}
      onCancel={handleCancel}
      width={1000}
      okText="Add"
    >
      <Form form={formName} layout="vertical">
        <Row gutter={24}>
          <Col span={7}>
            <Form.Item name="fromToDate">
              <RangePicker
                format={DATE_FORMAT}
                onChange={onChangeDate}
                style={{ width: 250 }}
                disabledDate={disableFutureDates}
                disabled={disable}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Button
              type="primary"
              className="submitButton"
              icon={<SearchOutlined className="saveButtonIcon" />}
              onClick={getGDNumberList}
              disabled={disable}
            >
              Search
            </Button>
          </Col>
        </Row>
        {isGdFetching ? (
          <Row style={{ marginTop: 20 }}>
            <Loader />
          </Row>
        ) : (
          <Row style={{ marginTop: 20, maxHeight: 300, overflowY: "auto" }}>
            <TableWidgetWrapper>
              <TableWrapper
                dataSource={gdNumberList}
                columns={columns}
                pagination={false}
                rowKey={(record) => {
                  if (!record.__uniqueId) record.__uniqueId = ++uniqueId;
                  return record.__uniqueId;
                }}
                size="small"
              />
            </TableWidgetWrapper>
          </Row>
        )}

        <Card style={{ marginTop: 20, padding: 10 }}>
          <Row gutter={24}>
            {displayGDDetailsState(gdDetails, displayGdDetailsFields, 12, 250)}
          </Row>

          <Row gutter={24} style={{ paddingBottom: 10 }}>
            <Col span={24}>
              <Form.Item
                name="GDBriefDetails"
                label="GD Entry Details in Brief"
                rules={[
                  { required: true, message: "GD Brief Detail is required!" },
                ]}
              >
                <TextArea rows={5} disabled={disable} />
              </Form.Item>
            </Col>
          </Row>
        </Card>
      </Form>
    </Modal>
  );
}
