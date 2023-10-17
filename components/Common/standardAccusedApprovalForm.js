import { useState } from "react";
import { Form, Row, Col, Checkbox, Upload, Button, Select } from "antd";
import { isArray, isEmpty } from "lodash";
import { useSelector } from "react-redux";
import { CameraOutlined, CaretDownOutlined } from "@ant-design/icons";
import { dummyRequest, onFileChange } from "@containers/FirDetails/fir-util";
import { getFileById } from "@containers/media-util";
import { accusedApprovalForm } from "./formOptions";

const Option = Select.Option;

export default function StandardAccusedApprovalForm({
  colWidth,
  changeValue,
  disabled,
  fileList = [],
  actionName,
  disableUpload = false,
  isDied,
  setIsDied,
  disableDied,
}) {
  const dashBoardData = useSelector(
    (state) => state.Dashboard.dashboardDetails
  );
  const [serchText, setSerchText] = useState("");
  const handleSearch = (text) => {
    setSerchText(text);
  };

  const getStageOfCaseList = () => {
    let list = [];
    !isEmpty(dashBoardData) &&
      // eslint-disable-next-line array-callback-return
      dashBoardData.map((s) => {
        let label = "";
        if (s.caseStatus === "Pending Refs") {
          label = "Pending References";
        } else {
          label = s.caseStatus;
        }
        const result = {
          label: label,
          name: label,
        };
        list.push(result);
      });
    return list;
  };

  const renderFieldsWithDropDown = (menuOptions) => {
    return (
      <Select
        suffixIcon={<CaretDownOutlined className="dropDownIcon" />}
        showSearch
        onSearch={handleSearch}
        filterOption={(input, option) =>
          serchText &&
          option.props.label
            .toString()
            .toLowerCase()
            .indexOf(input.toString().toLowerCase()) >= 0
        }
        disabled={disabled}
        onSelect={changeValue}
      >
        {isArray(menuOptions) &&
          menuOptions.map((item, index) => (
            <Option key={index} value={item.label} label={item.label}>
              {item.label}
            </Option>
          ))}
      </Select>
    );
  };

  const onIsDiedChange = (e) => {
    setIsDied(e.target.checked);
  };

  const displayFormItems = (name) => {
    switch (name) {
      case "stageOfCase":
        return renderFieldsWithDropDown(getStageOfCaseList());
      case "isDied":
        return (
          <Checkbox
            disabled={disabled || disableDied}
            onChange={onIsDiedChange}
          >
            Is Dead?
          </Checkbox>
        );
      case "approvalFromSrOfficer":
        return (
          <Checkbox disabled={disabled}>Approval from Senior Officer</Checkbox>
        );
      default:
        return null;
    }
  };

  const handleDownload = (file) => {
    getFileById(file?.fileId, file?.name, file?.url);
  };

  return (
    <div>
      <Row gutter={24}>
        {accusedApprovalForm.map((s, i) => {
          return (
            <Col span={colWidth} key={i} style={{ marginBottom: 10 }}>
              {s.name === "isDied" || s.name === "approvalFromSrOfficer" ? (
                <Form.Item
                  name={s.name}
                  label={s.label}
                  valuePropName={
                    s.name === "isDied" || s.name === "approvalFromSrOfficer"
                      ? "checked"
                      : ""
                  }
                  className={s.name}
                >
                  {displayFormItems(s.name)}
                </Form.Item>
              ) : (
                <Form.Item name={s.name} label={s.label} className={s.name}>
                  {displayFormItems(s.name)}
                </Form.Item>
              )}
            </Col>
          );
        })}
      </Row>
      {isDied ? (
        <Form.Item
          name="uploadDeathCertificate"
          label=""
          rules={[
            { required: true, message: "Please Upload Death Certificate!" },
          ]}
        >
          <Upload
            fileList={fileList}
            customRequest={dummyRequest}
            onChange={(info) =>
              actionName ? onFileChange(info, actionName) : console.log(info)
            }
            onPreview={handleDownload}
            multiple={false}
          >
            <Button
              className="saveButton"
              size="large"
              style={{ width: 250 }}
              icon={<CameraOutlined className="saveButtonIcon" />}
              disabled={disableUpload || disabled}
            >
              Upload Death Certificate
            </Button>
          </Upload>
        </Form.Item>
      ) : null}
    </div>
  );
}
