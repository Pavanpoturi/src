import { useState, useEffect } from "react";
import { isEmpty, isArray, first, isNull, isUndefined } from "lodash";
import { Checkbox, Select, Form } from "antd";
import { CrimeSceneFormCardWrapper } from "./CrimeSceneFormCard.styles";
import { CaretDownOutlined } from "@ant-design/icons";
import masterDataActions from "@redux/masterData/actions";
import { useDispatch, useSelector } from "react-redux";
import { config } from "@config/site.config";
import { getPersonPersonalDetails } from "../../fir-util";
const Option = Select.Option;

export default function CrimeSceneShownByCard(props) {
  const dispatch = useDispatch();
  const [shownByForm] = Form.useForm();
  const { getPersonTypeList } = masterDataActions;
  const { personTypeList } = useSelector((state) => state.MasterData);
  const { checkBoxData, minHeight } = props;
  const [searchText, setSearchText] = useState("");

  const handleSearch = (text) => {
    setSearchText(text);
  };

  function clearSelection(value) {
    var typeObj = personTypeList.filter((x) => x._id === value);
    props.setPersonType(value, typeObj[0].type);
    if (typeObj[0].type === "Others") {
      checkBoxData.forEach((element) => {
        props.checkBoxSelected(element, false);
      });
    }
  }

  useEffect(() => {
    dispatch(getPersonTypeList(`${config.masterData}/personTypes`));
  }, []);

  useEffect(() => {
    if (!isEmpty(checkBoxData)) {
      const personData = first(checkBoxData);
      shownByForm.setFieldsValue({
        personType:
          personData?.selectedPersonType === "" ||
          isNull(personData?.selectedPersonType) ||
          isUndefined(personData?.selectedPersonType)
            ? "Complainant"
            : personData?.selectedPersonType,
      });
    }
  }, []);

  const renderFieldsWithDropDown = (menuOptions, selectAction) => {
    return (
      <Select
        suffixIcon={<CaretDownOutlined className="dropDownIcon" />}
        showSearch
        value={props.personType}
        onSelect={(item) => {
          selectAction && selectAction(item);
          props.setShowRadioOnchange(true)
        }}
        onSearch={handleSearch}
        filterOption={(input, option) =>
          searchText &&
          option.props.type.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        disabled={props.disableEdit}
        style={{ width: 250 }}
      >
        {isArray(menuOptions) &&
          menuOptions.map((item, index) => (
            <Option key={index} value={item._id} label={item.type}>
              {item.type}
            </Option>
          ))}
      </Select>
    );
  };

  const displaySearchResult = (dataItem) => {
    return (
      !isEmpty(dataItem) &&
      dataItem.map((data, index) => (
        <div key={index}>
          <Checkbox
            style={{ padding: 5 }}
            onClick={(e) => props.checkBoxSelected(data, e.target.checked)}
            checked={data.checked}
            disabled={props.disableEdit}
          />{" "}
          {getPersonPersonalDetails(data?.person?.personalDetails)}
          {data?.person?.contactDetails[0]?.phoneNumber &&
            "Ph: " + data?.person?.contactDetails[0]?.phoneNumber}
        </div>
      ))
    );
  };

  return (
    <CrimeSceneFormCardWrapper
      className="followUpWidget"
      style={{ width: "100%", minHeight: minHeight }}
    >
      <Form form={shownByForm} layout="vertical">
        <div style={{ padding: 30 }}>
          <Form.Item name="personType" label="Select Person Type">
            {renderFieldsWithDropDown(personTypeList, clearSelection)}
          </Form.Item>
        </div>
      </Form>
    </CrimeSceneFormCardWrapper>
  );
}
