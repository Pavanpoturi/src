import { useState } from "react";
import ContentHeader from "../../ContentHeader";
import {
  Row,
  Card,
  Col,
  Form,
  Select,
  DatePicker,
  Upload,
  Button,
  Input,
  Radio,
} from "antd";
import {
  CaretDownOutlined,
  CameraFilled,
  FilePdfOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { CrPcNotice91Wrapper } from "./styles";
import { dummyRequest } from "@containers/FirDetails/fir-util";

const Option = Select.Option;

export default function CRPCNotice91({ setSelectedSiderMenu }) {
  const [form] = Form.useForm();
  const [rightForm] = Form.useForm();
  const [formValid, setFormValid] = useState(false);

  const [serchText, setSerchText] = useState("");
  const handleSearch = (text) => {
    setSerchText(text);
  };

  const submit = async () => {
    form.resetFields();
    setSelectedSiderMenu("investigation");
  };

  const checkFields = async () => {
    const values = await form.validateFields();
    setFormValid(!Object.values(values).every((v) => v == null || v === ""));
  };

  function onChange(e) {
    console.log(`checked = ${e.target.checked}`);
  }

  return (
    <CrPcNotice91Wrapper>
      <ContentHeader
        headerTitle="91 Cr.P.C Notice"
        addAnother
        addAnotherText="Add Another"
        onSubmitClick={submit}
        isInvestigation={true}
        onCancel={() => setSelectedSiderMenu("investigation")}
      />
      <Row style={{ minHeight: 550 }}>
        <Card style={{ width: "75%" }}>
          <Form form={form} layout="vertical">
            <Col>
              <Row>
                <Col span={7}>
                  <Form.Item
                    name="name_address_person"
                    label="Name and Address of Person to Issue Notice"
                  >
                    <Select
                      defaultValue="(list Witness/Suspect/Accused)"
                      style={{ width: 250 }}
                      suffixIcon={
                        <CaretDownOutlined className="dropDownIcon" />
                      }
                      showSearch
                      onSearch={handleSearch}
                      filterOption={(input, option) =>
                        serchText &&
                        option.props.label
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                      onSelect={checkFields}
                    >
                      {[
                        { label: "Raj Kumar(Raju)" },
                        { label: "(list Witness/Suspect/Accused)" },
                      ].map((item, index) => (
                        <Option
                          key={index}
                          value={item.label}
                          label={item.label}
                        >
                          {item.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col style={{ paddingTop: 25 }}>
                  <div style={{ color: "blue" }}>Add Person</div>
                </Col>
                <Col style={{ paddingTop: 25, paddingLeft: 20 }}>
                  <div style={{ color: "blue" }}>Add Professional</div>
                </Col>
              </Row>

              <Row gutter={[16, 16]}>
                <Col className="custody-col">
                  <Form.Item name="dateOfIssueOf160" label="Date of issue">
                    <DatePicker
                      onChange={checkFields}
                      style={{ width: 250 }}
                      placeholder="Select Date"
                    />
                  </Form.Item>
                </Col>

                <Col className="custody-col">
                  <Form.Item name="dateOfIssueOf160" label="Date of Compliance">
                    <DatePicker
                      onChange={checkFields}
                      style={{ width: 250 }}
                      placeholder="Select Date"
                    />
                  </Form.Item>
                </Col>

                <Col className="custody-col">
                  <Form.Item name="placeOfComplianc" label="Place of Complianc">
                    <Select
                      style={{ width: 250 }}
                      suffixIcon={
                        <CaretDownOutlined className="dropDownIcon" />
                      }
                      showSearch
                      onSearch={handleSearch}
                      filterOption={(input, option) =>
                        serchText &&
                        option.props.label
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                      onSelect={checkFields}
                    >
                      {[{ label: " Haidrabad" }, { label: "other state" }].map(
                        (item, index) => (
                          <Option
                            key={index}
                            value={item.label}
                            label={item.label}
                          >
                            {item.label}
                          </Option>
                        )
                      )}
                    </Select>
                  </Form.Item>
                  <Row className="row-item">
                    <div style={{ color: "blue" }}>Add Address</div>
                  </Row>
                </Col>
                <Col style={{ paddingTop: 25 }}>
                  <div style={{ color: "red" }}>
                    default to PS,if other
                    <br />
                    capture address
                  </div>
                </Col>
              </Row>
              <br />
              <Col className="custody-col text-area">
                <Form.Item
                  name="listOfDocuments"
                  label="List of documents, information, other things required to produced"
                >
                  <Input.TextArea
                    onChange={checkFields}
                    style={{ width: 780 }}
                    autoSize={{ minRows: 5, maxRows: 8 }}
                    rows={5}
                  />
                </Form.Item>
              </Col>
              <div className="courtOrders">
                <p>
                  Whether all requisite documents, information, things produced
                  or not?
                </p>
                <Radio.Group name="radiogroup" defaultValue={2}>
                  <Radio value={1}>Yes</Radio>
                  <Radio value={2}>No</Radio>
                </Radio.Group>
              </div>

              <Row>
                <Col className="custody-col">
                  <Form.Item name="left_upload">
                    <Upload customRequest={dummyRequest}>
                      <Button
                        className="saveButton"
                        // icon={<CameraFilled />}
                        style={{ width: 250, marginTop: 21 }}
                      >
                        {" "}
                        {<CameraFilled />}
                        Upload Requisite Documents
                      </Button>
                    </Upload>
                  </Form.Item>
                </Col>
                <Col className="custody-col" style={{ paddingLeft: 50 }}>
                  <Form.Item
                    name="dateOfIssueOf160"
                    label="Date of Issue of Reminder Notices"
                  >
                    <DatePicker
                      onChange={checkFields}
                      style={{ width: 250 }}
                      placeholder="Select Date"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Form>
        </Card>
        <Card style={{ width: "25%" }} className="right-section">
          <Form form={rightForm} layout="vertical">
            <Col className="first-col">
              <Row className="row-item">
                <FilePdfOutlined />
                <span>Generate 91 Cr.P.C.Notice</span>
                <Form.Item name="left_upload" style={{ width: "30%" }}>
                  <Upload customRequest={dummyRequest}>
                    <Button className="saveButton" icon={<CameraFilled />}>
                      Upload
                    </Button>
                  </Upload>
                </Form.Item>
              </Row>
              <div className="records-count">
                <span>0 Total Record(s)</span>
              </div>
            </Col>
          </Form>
        </Card>
      </Row>
    </CrPcNotice91Wrapper>
  );
}
