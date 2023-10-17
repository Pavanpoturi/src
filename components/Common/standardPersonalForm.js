import { useState, useEffect } from "react";
import { Form, Input, Row, Col, Select, DatePicker } from "antd";
import { isArray, isEmpty, first } from "lodash";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import masterDataActions from "@redux/masterData/actions";
import { CaretDownOutlined } from "@ant-design/icons";
import { config } from "@config/site.config";
import { DATE_FORMAT } from "@containers/FirDetails/fir-util";
import { standardPersonalForm, textFieldRules } from "./formOptions";
import { disableFutureDates } from "./helperMethods";

const Option = Select.Option;

const {
  getGendersList,
  getCasteList,
  getSubCasteList,
  getNationalityList,
  getReligionList,
  getOccupationList,
  getEducationQualificationList,
} = masterDataActions;

const optionType = {
  GENDER: "GENDER",
  CASTE: "CASTE",
  SUB_CASTE: "SUB_CASTE",
  NATIONALITY: "NATIONALITY",
  RELIGION: "RELIGION",
  OCCUPATION: "OCCUPATION",
  EDUCATIONAL_QUALIFICATION: "EDUCATIONAL_QUALIFICATION",
};

export default function StandardPersonalForm({
  showMoreOption,
  colWidth,
  changeValue,
  disabled = false,
  age,
  setAge,
  formName,
  validationFields = ["Name", "Gender", "Age", "Nationality"],
}) {
  const [serchText, setSerchText] = useState("");
  const [showMore, setShowMore] = useState(false);
  const dispatch = useDispatch();
  const [selectedCaste, setSelectedCaste] = useState("");
  const isCCL = age && age < 18;

  const {
    gendersList,
    casteList,
    subCasteList,
    nationalityList,
    religionList,
    occupationList,
    educationQualificationList,
  } = useSelector((state) => state.MasterData);

  useEffect(() => {
    const url = config.getMasterData;
    dispatch(getGendersList(`${url}/${optionType.GENDER}`));
    dispatch(getCasteList(`${url}/${optionType.CASTE}`));
    dispatch(getSubCasteList(`${url}/${optionType.SUB_CASTE}`));
    dispatch(getNationalityList(`${url}/${optionType.NATIONALITY}`));
    dispatch(getReligionList(`${url}/${optionType.RELIGION}`));
    dispatch(getOccupationList(`${url}/${optionType.OCCUPATION}`));
    dispatch(
      getEducationQualificationList(
        `${url}/${optionType.EDUCATIONAL_QUALIFICATION}`
      )
    );
  }, [dispatch]);

  const handleSearch = (text) => {
    setSerchText(text);
  };

  const relationTypeAccused = [
    { label: "Father" },
    { label: "Guardian" },
    { label: "Mother" },
    { label: "Spouse" },
  ];

  const relationTypeCCL = [
    { label: "Father" },
    { label: "Guardian" },
    { label: "Mother" },
  ];

  const relationTypeList = isCCL ? relationTypeCCL : relationTypeAccused;

  const selectedCasteDetails =
    !isEmpty(casteList) &&
    first(casteList.filter((s) => s.label === selectedCaste));

  const filteredSubCasteList =
    selectedCasteDetails &&
    !isEmpty(subCasteList) &&
    subCasteList.filter(
      (s) => s.caste_tribe_code === selectedCasteDetails?._id
    );

  const onCasteChange = (val) => {
    setSelectedCaste(val);
  };

  const renderCasteFieldsWithDropDown = (menuOptions, selectAction) => {
    return (
      <Select
        suffixIcon={<CaretDownOutlined className="dropDownIcon" />}
        showSearch
        allowClear
        onSearch={handleSearch}
        style={{ width: 250 }}
        onSelect={(item) => {
          selectAction && selectAction(item);
        }}
        disabled={disabled}
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

  const renderFieldsWithDropDown = (menuOptions, name) => {
    return (
      <Select
        suffixIcon={<CaretDownOutlined className="dropDownIcon" />}
        showSearch
        disabled={disabled}
        onSearch={handleSearch}
        style={{ width: 250 }}
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
          menuOptions.map((item, index) => (
            <Option key={index} value={item.label} label={item.label}>
              {item.label}
            </Option>
          ))}
      </Select>
    );
  };

  const onDateChange = (_date, dateString) => {
    const calculatedAge = moment().diff(
      moment(dateString, "DD/MM/YYYY"),
      "years"
    );
    setAge(calculatedAge);
    formName.setFieldsValue({
      age: calculatedAge,
    });
    changeValue();
  };

  const onAgeChange = (e) => {
    setAge(e.target.value);
    formName.setFieldsValue({
      dateOfBirth: "",
    });
    changeValue();
  };

  const displayFormItems = (name) => {
    switch (name) {
      case "gender":
        return renderFieldsWithDropDown(gendersList, "gender");
      case "dateOfBirth":
        return (
          <DatePicker
            format={DATE_FORMAT}
            showToday={false}
            onChange={onDateChange}
            style={{ width: 250 }}
            disabledDate={disableFutureDates}
            disabled={disabled}
          />
        );
      case "occupation":
        return renderFieldsWithDropDown(occupationList, "occupation");
      case "educationQualification":
        return renderFieldsWithDropDown(
          educationQualificationList,
          "educationQualification"
        );
      case "relationType":
        return renderFieldsWithDropDown(relationTypeList, "relationType");
      case "caste":
        return renderCasteFieldsWithDropDown(casteList, onCasteChange);
      case "subCaste":
        return renderFieldsWithDropDown(filteredSubCasteList, "subCaste");
      case "religion":
        return renderFieldsWithDropDown(religionList, "religion");
      case "nationality":
        return renderFieldsWithDropDown(nationalityList, "nationality");
      case "age":
        return (
          <Input
            onChange={onAgeChange}
            maxLength={textFieldRules.maxLength}
            disabled={disabled}
            style={{ width: 250 }}
            type="number"
          />
        );
      default:
        return (
          <Input
            onChange={changeValue}
            maxLength={textFieldRules.maxLength}
            disabled={disabled}
            style={{ width: 250 }}
            type="text"
          />
        );
    }
  };

  return (
    <div>
      <Row
        gutter={24}
        className={!showMore && showMoreOption ? "showLess" : ""}
      >
        {standardPersonalForm.map((s, i) => {
          const isLabel =
            isArray(validationFields) && validationFields.indexOf(s.label) >= 0;
          return (
            <Col span={colWidth} key={i} style={{ marginBottom: 10 }}>
              <Form.Item
                name={s.name}
                label={s.label}
                rules={[
                  {
                    required: isLabel,
                  },
                ]}
              >
                {displayFormItems(s.name)}
              </Form.Item>
            </Col>
          );
        })}
      </Row>
      {showMoreOption && !showMore && (
        <div onClick={() => setShowMore(true)} className="linkStyle">
          more details
        </div>
      )}
    </div>
  );
}
