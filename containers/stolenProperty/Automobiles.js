import { useState } from "react";
import { Row, Col, Form, Input, Select } from "antd";
import { isEmpty } from "lodash";
import { CaretDownOutlined } from "@ant-design/icons";

const { TextArea } = Input;

export default function Automobiles({ disable, vieiwClicked, changeValue }) {
  const [searchText, setSearchText] = useState("");

  const handleSearch = (text) => {
    setSearchText(text);
  };

  const renderDropdownFields = (data) => (
    <Select
      allowClear
      suffixIcon={<CaretDownOutlined className="dropDownIcon" />}
      showSearch
      onSearch={handleSearch}
      filterOption={(input, option) =>
        searchText &&
        option.props?.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
      onSelect={changeValue}
      disabled={vieiwClicked || disable}
      placeholder="Select"
    >
      {!isEmpty(data) &&
        data.map((item, _index) => (
          <Select.Option key={item} value={item} label={item}>
            {item}
          </Select.Option>
        ))}
    </Select>
  );

  return (
    <div style={{ marginTop: "24px" }}>
      <Row>
        <Col span={20} style={{ marginLeft: 12 }}>
          <Form.Item
            name="specialIdentifiactionDetails"
            label="Special Identification Details"
          >
            <TextArea
              placeholder="Enter here"
              disabled={vieiwClicked || disable}
              onChange={changeValue}
            />
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
}
