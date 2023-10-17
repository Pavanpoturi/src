/* eslint-disable array-callback-return */
import { useState, useEffect } from "react";
import { Col, Form, Input, Select } from "antd";
import { isArray, first } from "lodash";
import { CaretDownOutlined } from "@ant-design/icons";
import { hospitalDetailsForm } from "@components/Common/formOptions";
import { setRules } from "@components/Common/helperMethods";
import masterDataActions from "@redux/masterData/actions";
import { useDispatch, useSelector } from "react-redux";
import { config } from "@config/site.config";
import { isUndefined, isNull } from "lodash";

const Option = Select.Option;

export default function HospitalDetailsForm(props) {
  const dispatch = useDispatch();
  const { checkFields, disabled, form, selectedRecord } = props;
  const [serchText, setSerchText] = useState("");
  const [selectedHospital, setSelectedHospital] = useState(false);
  const { getHospitalsList } = masterDataActions;

  const { occupationList, educationQualificationList, hospitalsList } =
    useSelector((state) => state.MasterData);

  const optionType = {
    HOSPITALS: "HOSPITALS",
  };

  useEffect(() => {
    const url = config.getMasterData;
    dispatch(getHospitalsList(`${url}/${optionType.HOSPITALS}`));
  }, [dispatch]);

  useEffect(() => {
    const { medicalExamination } =
      !isUndefined(selectedRecord) && !isNull(selectedRecord) && selectedRecord;
    form.setFieldsValue({
      hospitalName: medicalExamination?.hospitalName,
      hospitalLocation: medicalExamination?.hospitalLocation,
      otherHospitalName: medicalExamination?.otherHospitalName
    });
    setSelectedHospital(medicalExamination?.hospitalName);
  }, [selectedRecord]);

  const handleSearch = (text) => {
    setSerchText(text);
  };

  const onHospitalChange = (val) => {
    setSelectedHospital(val);
    const result = first(hospitalsList.filter((s) => s.label === val));
    form.setFieldsValue({
      hospitalLocation: result?.hospitalAddress || "",
    });
  };

  const renderFieldsWithDropDown = (menuOptions, selectAction) => {
    return (
      <Select
        suffixIcon={<CaretDownOutlined className="dropDownIcon" />}
        showSearch
        onSearch={handleSearch}
        filterOption={(input, option) =>
          serchText &&
          option?.props?.label
            .toString()
            .toLowerCase()
            .indexOf(input.toString().toLowerCase()) >= 0
        }
        onSelect={(item) => {
          selectAction && selectAction(item);
        }}
        disabled={disabled}
        onChange={checkFields}
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

  const displayFormItems = (name) => {
    switch (name) {
      case "hospitalName":
        return renderFieldsWithDropDown(hospitalsList, onHospitalChange);
      case "occupation":
        return renderFieldsWithDropDown(occupationList, null);
      case "educationQualification":
        return renderFieldsWithDropDown(educationQualificationList, null);
      default:
        return (
          <Input onChange={checkFields} maxLength={150} disabled={disabled} />
        );
    }
  };

  return hospitalDetailsForm.map((s, i) => {
    const isLabel = s.label === "Hospital Name";

    if (s.label === "Other Hospital Name") {
      return (<>
        {selectedHospital === "Other"
          && (<Col
            span={8}
            key={i}
            style={{
              marginBottom: 10,
              paddingRight: 10,
            }}
          >
            <Form.Item
              name={s.name}
              label={s.label}
              rules={(setRules(s.type), [{ required: isLabel }])}
            >
              {displayFormItems(s.name)}
            </Form.Item>
          </Col>)}
      </>);
    }

    return (
      <Col
        span={8}
        key={i}
        style={{
          marginBottom: 10,
          paddingRight: 10,
        }}
      >
        <Form.Item
          name={s.name}
          label={s.label}
          rules={(setRules(s.type), [{ required: isLabel }])}
        >
          {displayFormItems(s.name)}
        </Form.Item>
      </Col>
    );
  });
}
