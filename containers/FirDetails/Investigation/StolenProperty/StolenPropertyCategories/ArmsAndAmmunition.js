import { useState, useEffect } from "react";
import {
  Row,
  Col,
  Form,
  Input,
  Select,
  DatePicker,
  Radio,
  Upload,
  Button,
} from "antd";
import { CaretDownOutlined, CameraFilled } from "@ant-design/icons";
import { disableFutureDates } from "@components/Common/helperMethods";
import { useSelector } from "react-redux";
import { armsMake, armsBoreValues, natureOFStolenCoins } from "../const";

const { TextArea } = Input;

export default function ArmsAndAmmunition({
  handleUpload,
  setUploadedArmsInsuranceCertificateMedia,
  viewClicked,
}) {
  const [serchText, setSerchText] = useState("");
  const [licensedState, setlicensedState] = useState(false);
  const [isManufacturingUnitState, setIsManufacturingUnitState] =
    useState(false);

  const [armsInsuranceCertificateMedia, setArmsInsuranceCertificateMedia] =
    useState([]);
  const { savedFir } = useSelector((state) => state.createFIR);
  const { actionType, successMessage } = useSelector(
    (state) => state.stolenProperty
  );

  const isSuccess =
    actionType === "ADD_STOLEN_PROPERTY_SUCCESS" ||
    actionType === "UPDATE_STOLEN_PROPERTY_SUCCESS";

  const isError =
    actionType === "ADD_STOLEN_PROPERTY_ERROR" ||
    actionType === "UPDATE_STOLEN_PROPERTY_ERROR";

  useEffect(() => {
    if (isSuccess || isError) {
      if (
        successMessage === "Stolen Property Successfully Added" ||
        successMessage === "Stolen Property Successfully Updated"
      ) {
        setArmsInsuranceCertificateMedia([]);
      }
    }
  }, [actionType]);

  const handleSearch = (text) => {
    setSerchText(text);
  };

  const disableForm =
    savedFir?.caseStatus === "Disposal" ||
    savedFir?.isTransferOfCaseFile === true ||
    savedFir?.isChargeSheetTakenOrFiled === true;

  return (
    <div style={{ marginTop: "24px" }}>
      <Row>
        <Col span={8} style={{ padding: "12px" }}>
          <Form.Item name="armsManufacturer" label="Make (Manufacturer)">
            <Select
              allowClear
              placeholder="Select"
              suffixIcon={<CaretDownOutlined className="dropDownIcon" />}
              showSearch
              onSearch={handleSearch}
              filterOption={(input, option) =>
                serchText &&
                option.props.label.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
              }
              disabled={viewClicked || disableForm}
            >
              {armsMake.map((item, _index) => (
                <Select.Option key={item} value={item} label={item}>
                  {item}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8} style={{ padding: "12px" }}>
          <Form.Item name="armsMade" label="Made">
            <Select
              allowClear
              placeholder="Select"
              suffixIcon={<CaretDownOutlined className="dropDownIcon" />}
              showSearch
              onSearch={handleSearch}
              filterOption={(input, option) =>
                serchText &&
                option.props.label.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
              }
              disabled={viewClicked || disableForm}
            >
              {armsMake.map((item, _index) => (
                <Select.Option key={item} value={item} label={item}>
                  {item}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8} style={{ padding: "12px" }}>
          <Form.Item name="armsBore" label="Bore">
            <Select
              allowClear
              placeholder="Select"
              suffixIcon={<CaretDownOutlined className="dropDownIcon" />}
              showSearch
              onSearch={handleSearch}
              filterOption={(input, option) =>
                serchText &&
                option.props.label.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
              }
              disabled={viewClicked || disableForm}
            >
              {armsBoreValues.map((item, _index) => (
                <Select.Option key={item} value={item} label={item}>
                  {item}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8} style={{ padding: "12px" }}>
          <Form.Item name="armsModel" label="Model">
            <Input
              placeholder="Enter here"
              disabled={viewClicked || disableForm}
            />
          </Form.Item>
        </Col>
        <Col span={8} style={{ padding: "12px" }}>
          <Form.Item name="armsQuantity" label="Quantity">
            <Input
              placeholder="Enter here"
              disabled={viewClicked || disableForm}
            />
          </Form.Item>
        </Col>
        <Col span={10} style={{ padding: "12px" }}>
          <Form.Item name="armsLicensed" label="Licensed?">
            <Radio.Group
              disabled={viewClicked || disableForm}
              defaultValue={licensedState}
              onChange={(e) => setlicensedState(e.target.value)}
            >
              <Radio value={true}>Yes</Radio>
              <Radio value={false}>No</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
        <Col span={10} style={{ padding: "12px" }}>
          <Form.Item
            name="armsisManufacturingUnit"
            label="Is it Manufacturing Unit?"
          >
            <Radio.Group
              disabled={viewClicked || disableForm}
              defaultValue={isManufacturingUnitState}
              onChange={(e) => setIsManufacturingUnitState(e.target.value)}
            >
              <Radio value={true}>Yes</Radio>
              <Radio value={false}>No</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>

        {isManufacturingUnitState ? (
          <Col span={12} style={{ padding: "12px" }}>
            <Form.Item name="manufacturingUnitName" label="Name of the Unit">
              <Input
                placeholder="Enter here"
                disabled={viewClicked || disableForm}
              />
            </Form.Item>
          </Col>
        ) : null}

        {licensedState ? (
          <>
            <Col span={12} style={{ padding: "12px" }}>
              <Form.Item name="licenceNo" label="Licence No.">
                <Input
                  placeholder="Enter here"
                  disabled={viewClicked || disableForm}
                />
              </Form.Item>
            </Col>
            <Col span={12} style={{ padding: "12px" }}>
              <Form.Item name="expiryDate" label="Expiry Date">
                <DatePicker
                  placeholder="Select Date "
                  style={{ width: 222 }}
                  disabledDate={disableFutureDates}
                  disabled={viewClicked || disableForm}
                />
              </Form.Item>
            </Col>
            <Col span={12} style={{ padding: "12px" }}>
              <Form.Item name="licenceIssuedBy" label="Licence issued by">
                <Input
                  placeholder="Enter here"
                  disabled={viewClicked || disableForm}
                />
              </Form.Item>
            </Col>
          </>
        ) : null}
        <Col span={8} style={{ padding: "12px" }}>
          <Form.Item name="sourceOfArm" label="Source Of Arm">
            <Input
              placeholder="Enter here"
              disabled={viewClicked || disableForm}
            />
          </Form.Item>
        </Col>
        <Col span={8} style={{ padding: "12px" }}>
          <Form.Item name="countryOfDesign" label="Country Of Design">
            <Select
              allowClear
              placeholder="Select"
              suffixIcon={<CaretDownOutlined className="dropDownIcon" />}
              showSearch
              onSearch={handleSearch}
              filterOption={(input, option) =>
                serchText &&
                option.props.label.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
              }
              disabled={viewClicked || disableForm}
            >
              {natureOFStolenCoins.map((item, _index) => (
                <Select.Option key={item} value={item} label={item}>
                  {item}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8} style={{ padding: "12px" }}>
          <Form.Item name="weaponNumber" label="Weapon Number">
            <Input
              placeholder="Enter here"
              disabled={viewClicked || disableForm}
            />
          </Form.Item>
        </Col>
        <Col span={8} style={{ padding: "12px" }}>
          <Form.Item name="armsInsuranceCerNo" label="Insurance Certificate NO">
            <Input
              placeholder="Enter here"
              disabled={viewClicked || disableForm}
            />
          </Form.Item>
        </Col>
        <Col span={8} style={{ padding: "12px" }}>
          <Form.Item
            name="armsspecialMarksOfIdentification"
            label="Special Marks Of Identification"
          >
            <Input
              placeholder="Enter here"
              disabled={viewClicked || disableForm}
            />
          </Form.Item>
        </Col>
        <Col span={8} style={{ padding: "12px" }}>
          <Form.Item
            name="armsNameOfInsurance"
            label="Name of Insurance Company"
          >
            <Input
              placeholder="Enter here"
              disabled={viewClicked || disableForm}
            />
          </Form.Item>
        </Col>
        <Col span={20}>
          <Form.Item name="armsRemarks" label="Remarks">
            <TextArea
              placeholder="Enter here"
              disabled={viewClicked || disableForm}
            />
          </Form.Item>
        </Col>
        <Col span={8} style={{ padding: "12px" }}>
          <Form.Item>
            <Upload
              onChange={async (info) => {
                await setArmsInsuranceCertificateMedia(info.fileList);
              }}
              customRequest={(options) =>
                handleUpload(
                  options,
                  armsInsuranceCertificateMedia,
                  setArmsInsuranceCertificateMedia,
                  setUploadedArmsInsuranceCertificateMedia
                )
              }
              multiple={false}
              maxCount={1}
            >
              <Button
                className="saveButton"
                disabled={
                  armsInsuranceCertificateMedia.length === 1 ||
                  viewClicked ||
                  disableForm
                }
                style={{ width: "100%" }}
              >
                <div style={{ display: "flex" }}>
                  <div>
                    <CameraFilled />
                  </div>
                  <div style={{ marginLeft: "12px" }}>
                    Upload Insurance Certificate
                  </div>
                </div>
              </Button>
            </Upload>
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
}
