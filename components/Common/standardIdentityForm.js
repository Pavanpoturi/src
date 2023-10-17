import { useState, useEffect } from "react";
import {
  Form,
  Input,
  Row,
  Col,
  Select,
  Upload,
  Button,
  notification,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { isArray, first, isEmpty, isUndefined, isNull } from "lodash";
import masterDataActions from "@redux/masterData/actions";
import {
  CameraOutlined,
  CaretDownOutlined,
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { config } from "@config/site.config";
import { textFieldRules } from "./formOptions";
import { loadState } from "@lib/helpers/localStorage";
import { getFileById } from "@containers/media-util";

const Option = Select.Option;
const { getIdentityTypeList } = masterDataActions;

export default function StandardIdentityForm({
  colWidth,
  setidentityList,
  disabled = false,
  currentData,
  form,
  changeValue,
  resetFiles = false,
  setResetFiles,
  identityFieldsStatus,
}) {
  const [inputList, setInputList] = useState([
    {
      type_0: "",
      number_0: "",
      name_0: "",
      fileId_0: "",
      identityProof_0: null,
      identityProofs_0: [],
    },
  ]);
  const crimeId = loadState("selectedFirId");
  const dispatch = useDispatch();
  const [serchText, setSerchText] = useState("");
  const handleSearch = (text) => {
    setSerchText(text);
  };

  const openNotificationWithIcon = (type, message) => {
    return notification[type]({
      message: message,
    });
  };

  useEffect(() => {
    if (resetFiles) {
      setInputList([
        {
          type_0: "",
          number_0: "",
          name_0: "",
          url_0: "",
          fileId_0: "",
          identityProof_0: null,
          identityProofs_0: [],
        },
      ]);
      setResetFiles(false);
    }
  }, [resetFiles]);

  const { identityTypeList } = useSelector((state) => state.MasterData);
  const identityDetail =
    currentData?.person &&
    !isUndefined(currentData?.person) &&
    !isUndefined(currentData?.person?.identityDetails) &&
    !isEmpty(currentData?.person?.identityDetails) &&
    currentData?.person?.identityDetails;

  useEffect(() => {
    if (identityDetail?.length > 0) {
      var identityList = [];
      identityDetail.forEach((element, index) => {
        const identityObj = {};
        identityObj[`type_${index}`] = element?.type;
        identityObj[`number_${index}`] = element?.number;
        identityObj[`name_${index}`] = element?.name;
        identityObj[`url_${index}`] = element?.url;
        identityObj[`fileId_${index}`] = element?.fileId;
        identityList.push(identityObj);
        form && form.setFieldsValue(identityObj);
      });
      setInputList(identityList);
      setidentityList(identityDetail);
    } else {
      const list = [];
      list.push({
        type_0: "",
        number_0: "",
        name_0: "",
        url_0: "",
        fileId_0: "",
        identityProof_0: null,
        identityProofs_0: [],
      });
      setInputList(list);

      const identityObj = {};
      identityObj[`type_0`] = "";
      identityObj[`number_0`] = "";
      identityObj[`name_0`] = "";
      identityObj[`url_0`] = "";
      identityObj[`fileId_0`] = "";
      form && form.setFieldsValue(identityObj);
    }
  }, [currentData]);

  const handleInputChange = (e, index) => {
    const { value } = e.target;
    const list = [...inputList];
    list[index][`number_${index}`] = value;
    setInputList(list);
    setidentityList(list);
    changeValue();
  };

  const setIdentityType = (e, index) => {
    const list = [...inputList];
    list[index][`type_${index}`] = e;
    setInputList(list);
    setidentityList(list);
    changeValue();
  };

  const handleRemoveClick = (index) => {
    const list = [...inputList];
    list.splice(index, 1);
    setInputList(list);
    setidentityList(list);
    changeValue();
  };

  const handleAddClick = () => {
    var input = {};
    input[`number_${inputList.length}`] = "";
    input[`name_${inputList.length}`] = "";
    input[`type_${inputList.length}`] = "";
    input[`url_${inputList.length}`] = "";
    input[`fileId_${inputList.length}`] = "";
    input.identityProof = null;
    input.identityProofs = [];

    setInputList([...inputList, input]);
    changeValue();
  };

  useEffect(() => {
    dispatch(getIdentityTypeList(`${config.getMasterData}/ID_PROOF_DETAILS`));
  }, [dispatch]);

  const renderFieldsWithDropDown = (menuOptions, i, item) => {
    return (
      <Select
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
        onSelect={(e) => setIdentityType(e, i)}
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

  const onChange = (info, i) => {
    const list = [...inputList];
    switch (info.file.status) {
      case "uploading":
        list[i]["identityProof"] = info.file;
        list[i]["identityProofs"] = [info.file];
        break;
      case "done":
        list[i]["identityProof"] = info.file;
        list[i]["identityProofs"] = [info.file];
        break;
      default:
        list[i]["identityProof"] = null;
        list[i]["identityProofs"] = [];
    }
    setInputList(list);
    setidentityList(list);
  };

  const handleDownload = (file) => {
    getFileById(file?.fileId, file?.name, file?.url);
  };

  return (
    <>
      {inputList.map((x, i) => {
        return (
          <Row gutter={24} key={i}>
            <Col span={colWidth} style={{ marginBottom: 10 }}>
              <Form.Item
                name={`type_${i}`}
                label="Identity Type"
                rules={[{ required: identityFieldsStatus }]}
              >
                {renderFieldsWithDropDown(identityTypeList, i, x)}
              </Form.Item>
            </Col>
            <Col span={colWidth} style={{ marginBottom: 10 }}>
              <Form.Item
                name={`number_${i}`}
                label="Identity Number"
                rules={[
                  textFieldRules.textFieldMaxLength,
                  { required: identityFieldsStatus },
                ]}
              >
                <Input
                  maxLength={textFieldRules.maxLength}
                  onChange={(e) => handleInputChange(e, i)}
                  disabled={disabled}
                />
              </Form.Item>
            </Col>
            <Col span={4} style={{ marginBottom: 10 }}>
              <Form.Item
                name={`identityProof_${i}`}
                label="Identity Proof"
                rules={[{ required: identityFieldsStatus }]}
              >
                <Upload
                  fileList={
                    currentData?.person?._id &&
                    !isEmpty(identityDetail) &&
                    !isEmpty(identityDetail[i]?.url) &&
                    !isNull(identityDetail[i]?.url) &&
                    !isUndefined(identityDetail[i]?.url)
                      ? [
                          {
                            name: identityDetail[i]?.name,
                            url: identityDetail[i]?.url,
                            fileId: identityDetail[i]?.fileId,
                          },
                        ]
                      : inputList[i].identityProofs
                  }
                  onPreview={handleDownload}
                  onChange={(info) => onChange(info, i)}
                  customRequest={(options) => {
                    let formData = new FormData();
                    formData.append("file", options.file);
                    formData.append("prefixFolder", crimeId);
                    const type = x[`type_${i}`];
                    const number = x[`number_${i}`];
                    const folderPath = `${crimeId}/${
                      type + `_` + number + `_ID_PROOF_DETAILS`
                    }/file`;
                    formData.append("folderPath", folderPath);
                    axios
                      .post(`${config.fileUpload}/upload`, formData)
                      .then((res) => {
                        if (res.status) {
                          const { data } = res.data;
                          const payloadData = first(data);
                          inputList[i][`url_${i}`] = payloadData.url;
                          inputList[i][`name_${i}`] = payloadData.name;
                          inputList[i][`fileId_${i}`] = payloadData.id;
                          setTimeout(() => {
                            options.onSuccess("ok");
                          }, 0);
                        }
                      })
                      .catch((err) => {
                        if (err && err?.response?.status === 400) {
                          const errorDetails = JSON.parse(
                            err.response?.data?.error.description
                          );
                          const errorKey = errorDetails?.error?.errorKey;
                          openNotificationWithIcon("error", errorKey);
                          setTimeout(() => {
                            options.onError("ok");
                          }, 0);
                        }
                      });
                  }}
                >
                  <Button
                    className="saveButton"
                    size="large"
                    disabled={disabled}
                    icon={<CameraOutlined className="saveButtonIcon" />}
                  >
                    Select File
                  </Button>
                </Upload>
              </Form.Item>
            </Col>
            <Col span={4} style={{ marginBottom: 10 }}>
              {inputList.length - 1 === i ? (
                <Button
                  className="saveButton"
                  size="large"
                  onClick={handleAddClick}
                  disabled={disabled}
                  style={{ marginTop: 25, width: 150 }}
                  icon={<PlusOutlined className="saveButtonIcon" />}
                >
                  Add Another
                </Button>
              ) : (
                <Button
                  type="primary"
                  className="removeButton"
                  onClick={() => handleRemoveClick(i)}
                  style={{ marginTop: 20 }}
                  disabled={disabled}
                  icon={<DeleteOutlined className="removeButtonIcon" />}
                  danger
                />
              )}
            </Col>
          </Row>
        );
      })}
    </>
  );
}
