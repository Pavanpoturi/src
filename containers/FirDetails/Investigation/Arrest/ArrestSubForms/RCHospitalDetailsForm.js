import { useState, useEffect } from "react";
import { Col, Form, Input, Select } from "antd";
import { isArray, first, isUndefined, isNull } from "lodash";
import { CaretDownOutlined } from "@ant-design/icons";
import { RChospitalDetailsForm } from "@components/Common/formOptions";
import { setRules } from "@components/Common/helperMethods";
import masterDataActions from "@redux/masterData/actions";
import { useDispatch, useSelector } from "react-redux";
import { config } from "@config/site.config";

const Option = Select.Option;

export default function RCHospitalDetailsForm(props) {
  const dispatch = useDispatch();
  const { checkFields, disabled, form, selectedRecord } = props;
  const [serchText, setSerchText] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [addressform] = Form.useForm();
  const { getOccupationList, getEducationQualificationList, getHospitalsList } =
    masterDataActions;

  const { occupationList, educationQualificationList, hospitalsList } =
    useSelector((state) => state.MasterData);
  const optionType = {
    OCCUPATION: "OCCUPATION",
    EDUCATIONAL_QUALIFICATION: "EDUCATIONAL_QUALIFICATION",
    HOSPITALS: "HOSPITALS",
  };
  useEffect(() => {
    const url = config.getMasterData;
    dispatch(getOccupationList(`${url}/${optionType.OCCUPATION}`));
    dispatch(
      getEducationQualificationList(
        `${url}/${optionType.EDUCATIONAL_QUALIFICATION}`
      )
    );
    dispatch(getHospitalsList(`${url}/${optionType.HOSPITALS}`));
  }, [dispatch]);

  useEffect(() => {
    const { rapeCase } =
      !isUndefined(selectedRecord) && !isNull(selectedRecord) && selectedRecord;
    const { hospitalLocation } =
      !isUndefined(rapeCase) && !isNull(rapeCase) && rapeCase;
    setSelectedState(hospitalLocation?.state);
    addressform.setFieldsValue({
      name: hospitalLocation?.name,
      surname: hospitalLocation?.surname,
      occupation: hospitalLocation?.occupation,
      educationQualification: hospitalLocation?.education,
      phoneNumber: hospitalLocation?.phone,
      emailId: hospitalLocation?.emailId,
      placeOfWork: hospitalLocation?.placeOfWork,
      houseNo: hospitalLocation?.houseNo,
      streetRoadNo: hospitalLocation?.street,
      wardColony: hospitalLocation?.ward,
      landmarkMilestone: hospitalLocation?.landmark,
      localityVillage: hospitalLocation?.village,
      areaMandal: hospitalLocation?.mandal,
      district: hospitalLocation?.district,
      stateUt: hospitalLocation?.state,
      residenceType: hospitalLocation?.residencyType,
      pinCode: hospitalLocation?.pincode,
    });
  }, [selectedRecord]);

  const handleSearch = (text) => {
    setSerchText(text);
  };

  const onHospitalChange = (val) => {
    const result = first(hospitalsList.filter((s) => s.label === val));
    form.setFieldsValue({
      RChospitalLocation: result?.hospitalAddress || "",
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
          option.props.label
            .toString()
            .toLowerCase()
            .indexOf(input.toString().toLowerCase()) >= 0
        }
        onSelect={(item) => {
          selectAction && selectAction(item);
        }}
        disabled={disabled}
        onChange={checkFields}
        style={{ width: 250 }}
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
      case "RChospitalName":
        return renderFieldsWithDropDown(hospitalsList, onHospitalChange);
      case "RChospitalLocation":
        return renderFieldsWithDropDown([]);
      case "occupation":
        return renderFieldsWithDropDown(occupationList, null);
      case "educationQualification":
        return renderFieldsWithDropDown(educationQualificationList, null);
      default:
        return (
          <Input
            onChange={checkFields}
            style={{ width: 250 }}
            maxLength={150}
            disabled={disabled}
          />
        );
    }
  };

  return RChospitalDetailsForm.map((s, i) => {
    return (
      <>
        <Col
          span={8}
          key={i}
          style={{
            marginBottom: 10,
            paddingRight: 100,
          }}
        >
          <Form.Item name={s.name} label={s.label} rules={setRules(s.type)}>
            {displayFormItems(s.name)}
          </Form.Item>
        </Col>
      </>
    );
  });
}
