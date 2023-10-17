import { useState, useEffect } from "react";
import { Form, Input, Row, Col, Select } from "antd";
import { isArray } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import masterDataActions from "@redux/masterData/actions";
import { CaretDownOutlined } from "@ant-design/icons";
import { config } from "@config/site.config";
import {
  expertTeamDetailsForm,
  textAreaRules,
  textFieldRules,
} from "./formOptions";
import { setRules } from "@components/Common/helperMethods";

const Option = Select.Option;
const { TextArea } = Input;
const { getExpertRoleList } = masterDataActions;

const styles = {
  widgetPageStyle: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    overflow: "hidden",
    marginBottom: 10,
  },
};

export default function StandardExpertTeamDetailsForm({
  colWidth,
  changeValue,
  disabled,
}) {
  const [serchText, setSerchText] = useState("");
  const dispatch = useDispatch();
  const handleSearch = (text) => {
    setSerchText(text);
  };

  const { expertRoleList } = useSelector((state) => state.MasterData);

  useEffect(() => {
    dispatch(getExpertRoleList(`${config.getMasterData}/NAME_OF_THE_EXPERT`));
  }, [dispatch]);

  const renderFieldsWithDropDown = (menuOptions) => {
    return (
      <Select
        style={{ width: 250 }}
        suffixIcon={<CaretDownOutlined className="dropDownIcon" />}
        showSearch
        disabled={disabled}
        onSearch={handleSearch}
        filterOption={(input, option) =>
          serchText &&
          option.props.label
            .toString()
            .toLowerCase()
            .indexOf(input.toString().toLowerCase()) >= 0
        }
        onSelect={changeValue}
      >
        {isArray(menuOptions) &&
          menuOptions &&
          menuOptions.length &&
          menuOptions.map((item, index) => (
            <Option key={index} value={item.label} label={item.label}>
              {item.label}
            </Option>
          ))}
      </Select>
    );
  };

  const displayFormItems = (name) => {
    switch (name) {
      case "role":
        return renderFieldsWithDropDown(expertRoleList);
      case "initialObservation":
        return (
          <TextArea
            style={{ width: 500, height: 350 }}
            rows={100}
            columns={10}
            onChange={changeValue}
            disabled={disabled}
            maxLength={textAreaRules.maxLength}
          />
        );
      default:
        return (
          <Input
            onChange={changeValue}
            disabled={disabled}
            maxLength={textFieldRules.maxLength}
            style={{ width: 250 }}
          />
        );
    }
  };

  return (
    <div>
      <Row gutter={24}>
        {expertTeamDetailsForm.map((s, i) => {
          return (
            <Col span={colWidth} key={i} style={styles.widgetPageStyle}>
              <Form.Item name={s.name} label={s.label} rules={setRules(s.type)}>
                {displayFormItems(s.name)}
              </Form.Item>
            </Col>
          );
        })}
      </Row>
    </div>
  );
}
