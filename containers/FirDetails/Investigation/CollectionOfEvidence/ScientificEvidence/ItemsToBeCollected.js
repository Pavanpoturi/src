import {
  Row,
  Card,
  Col,
  Form,
  Input,
  Checkbox,
  DatePicker,
  Upload,
  Divider,
  Button,
  Select,
} from "antd";
import { CameraFilled, CaretDownOutlined } from "@ant-design/icons";
import { isArray, isEmpty } from "lodash";
import { textFieldRules } from "@components/Common/formOptions";
import { disableFutureDates } from "@components/Common/helperMethods";
import {
  DATE_FORMAT,
  dummyRequest,
  renderFieldsWithDropDown,
} from "@containers/FirDetails/fir-util";
import { getFileById } from "@containers/media-util";
import { dnaSamplingForm, otherCourts } from "./const";

const Option = Select.Option;

const styles = {
  widgetPageStyle: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    overflow: "hidden",
    width: 250,
  },
};

export default function ItemsToBeCollected({
  disableForm,
  checkFields,
  handleSearch,
  serchText,
  accusedList,
  witnessList,
  setIsModalVisible,
  isDocuments,
  setIsDocuments,
  isSampleHandwritings,
  setIsSampleHandwritings,
  isSampleThumbImpressions,
  setIsSampleThumbImpressions,
  isSampleVoiceRecordings,
  setIsSampleVoiceRecordings,
  isOthersDetails,
  setIsOthersDetails,
  isDNASampling,
  setIsDNASampling,
  editScientificObj,
  selectedUploadAcknowledgement,
  uploadAcknowledgement,
  onFileChange,
  setUploadAcknowledgement,
}) {
  const renderFieldsWithMultipleDropDown = (
    menuOptions,
    selectAction,
    handleSearch,
    serchText,
    width = "",
    disabled = false
  ) => {
    return (
      <Select
        suffixIcon={<CaretDownOutlined className="dropDownIcon" />}
        showSearch
        mode="multiple"
        showArrow
        onSearch={handleSearch}
        onChange={(item) => {
          selectAction && selectAction(item);
        }}
        filterOption={(input, option) =>
          serchText &&
          option.props.label
            .toString()
            .toLowerCase()
            .indexOf(input.toString().toLowerCase()) >= 0
        }
        style={{ width: width || 150 }}
        disabled={disabled}
      >
        {isArray(menuOptions) &&
          menuOptions.map((item, index) => (
            <Option key={index} value={item._id} label={item.label}>
              {item.label}
            </Option>
          ))}
      </Select>
    );
  };

  const displayState = (data, actionName) => {
    return (
      <Row gutter={24} style={{ marginLeft: 10 }}>
        {data.map((s, i) => {
          return (
            <Col span={8} key={i} style={{ marginBottom: 10 }}>
              <Form.Item name={s.name} label={s.label}>
                {actionName(s.name)}
              </Form.Item>
              {s.actionLink && (
                <span
                  className="linkStyle"
                  onClick={() => setIsModalVisible(true)}
                >
                  {s.actionName}
                </span>
              )}
            </Col>
          );
        })}
      </Row>
    );
  };

  const displayFields = (name) => {
    switch (name) {
      case "fsldnaWitnessList":
        return renderFieldsWithMultipleDropDown(
          witnessList,
          null,
          handleSearch,
          serchText,
          200,
          disableForm
        );
      case "fsldnaAccusedList":
        return renderFieldsWithMultipleDropDown(
          accusedList,
          null,
          handleSearch,
          serchText,
          200,
          disableForm
        );
      case "fslbabyOfWitness":
        return renderFieldsWithDropDown(
          [],
          null,
          handleSearch,
          serchText,
          200,
          disableForm
        );
      case "fsldateOfAcknowledgement":
        return (
          <DatePicker
            format={DATE_FORMAT}
            style={{ width: 200 }}
            onChange={checkFields}
            disabled={disableForm}
          />
        );
      case "fsldateOfDNACollection":
        return (
          <DatePicker
            format={DATE_FORMAT}
            style={{ width: 200 }}
            onChange={checkFields}
            disabled={disableForm}
          />
        );
      default:
        return (
          <Input
            onChange={checkFields}
            style={{ width: 200 }}
            maxLength={textFieldRules.maxLength}
            disabled={disableForm}
          />
        );
    }
  };

  const renderDocumentsDetails = () => {
    return (
      <>
        <Col>
          <Form.Item name="documentNames" label="Document Type">
            {renderFieldsWithDropDown(
              otherCourts,
              null,
              handleSearch,
              serchText,
              200,
              disableForm
            )}
          </Form.Item>
        </Col>
        <Col>
          <Form.Item
            name="dateOfReceiptOfDocuments"
            label="Date Of Receipt Of Documents in Court"
          >
            <DatePicker
              format={DATE_FORMAT}
              placeholder="Select Date"
              onChange={checkFields}
              style={{ width: 200 }}
              disabledDate={disableFutureDates}
              disabled={disableForm}
            />
          </Form.Item>
        </Col>
      </>
    );
  };

  const renderSampleHandwritings = () => {
    return (
      <Row gutter={24} style={{ marginBottom: 10 }}>
        <Col style={{ marginTop: 20 }}>
          <Form.Item
            name="sampleHandwritingWitnessList"
            label="List of Witnesses"
          >
            {renderFieldsWithMultipleDropDown(
              witnessList,
              null,
              handleSearch,
              serchText,
              200,
              disableForm
            )}
          </Form.Item>
        </Col>
        <Col style={{ marginTop: 20 }}>
          <Form.Item
            name="sampleHandwritingAccusedList"
            label="List of Accused"
          >
            {renderFieldsWithMultipleDropDown(
              accusedList,
              null,
              handleSearch,
              serchText,
              200,
              disableForm
            )}
          </Form.Item>
        </Col>
        <Col style={{ marginTop: 20 }}>
          <div style={{ width: 340 }}>
            Date Of Collection Of Sample(s) in Court
          </div>
          <Form.Item name="dateOfCollection" label="">
            <DatePicker
              disabledDate={disableFutureDates}
              format={DATE_FORMAT}
              style={{ width: 200 }}
              onChange={checkFields}
              disabled={disableForm}
            />
          </Form.Item>
        </Col>
      </Row>
    );
  };

  const renderCheckbox = (formName, actionName, title) => {
    return (
      <Col style={{ marginLeft: 10 }}>
        <div style={styles.widgetPageStyle}>
          <Form.Item name={formName} valuePropName="checked">
            <Checkbox
              onChange={(e) => actionName(e.target.checked)}
              disabled={disableForm}
            />
          </Form.Item>
          <div style={{ paddingTop: 5 }}>
            <span
              style={{
                paddingLeft: 10,
                verticalAlign: "text-bottom",
              }}
            >
              {title}
            </span>
          </div>
        </div>
      </Col>
    );
  };

  const handleDownload = (file) => {
    getFileById(file?.fileId, file?.name, file?.url);
  };

  return (
    <Card style={{ width: "100%", marginTop: 20 }}>
      <div style={{ marginTop: 2, marginBottom: 10 }}>
        Name of items to be Collected
      </div>
      <Row gutter={24}>
        {renderCheckbox("isDocuments", setIsDocuments, "Documents")}
        {isDocuments ? renderDocumentsDetails() : null}
      </Row>
      <Divider />
      <div style={{ float: "left" }}>
        {renderCheckbox(
          "isSampleHandwritings",
          setIsSampleHandwritings,
          "Handwriting Samples"
        )}
        {renderCheckbox(
          "isSampleThumbImpressions",
          setIsSampleThumbImpressions,
          "Thumb Impression Samples"
        )}
        {renderCheckbox(
          "isSampleVoiceRecordings",
          setIsSampleVoiceRecordings,
          "Voice Recording Samples"
        )}
      </div>
      {isSampleHandwritings ||
      isSampleThumbImpressions ||
      isSampleVoiceRecordings ? (
        <div style={{ float: "right" }}>{renderSampleHandwritings()}</div>
      ) : null}
      <Divider />
      <div>
        {renderCheckbox(
          "isDNASampling",
          setIsDNASampling,
          "DNA Sampling - FSL"
        )}
      </div>
      {isDNASampling ? displayState(dnaSamplingForm, displayFields) : null}
      <Divider />
      <Row gutter={24}>
        <Col span={4}>
          {renderCheckbox("isOthersDetails", setIsOthersDetails, "Others")}
        </Col>
        {isOthersDetails ? (
          <Col span={6}>
            <Form.Item name="others" label="">
              <Input
                onChange={checkFields}
                style={{ width: 250 }}
                maxLength={textFieldRules.maxLength}
                disabled={disableForm}
              />
            </Form.Item>
          </Col>
        ) : null}
      </Row>
      <Row>
        <Upload
          fileList={
            editScientificObj?._id &&
            editScientificObj?.uploadAcknowledgement &&
            editScientificObj?.uploadAcknowledgement?.url !== ""
              ? selectedUploadAcknowledgement
              : uploadAcknowledgement
          }
          onPreview={handleDownload}
          customRequest={dummyRequest}
          onChange={(info) => onFileChange(info, setUploadAcknowledgement)}
          multiple={false}
        >
          <Button
            className="saveButton"
            style={{
              marginTop: 22,
              width: 320,
              marginLeft: 20,
              marginBottom: 10,
            }}
            icon={<CameraFilled style={{ float: "left" }} />}
            disabled={disableForm || !isEmpty(uploadAcknowledgement)}
          >
            Upload Acknowledgement of Court
          </Button>
        </Upload>
      </Row>
    </Card>
  );
}
