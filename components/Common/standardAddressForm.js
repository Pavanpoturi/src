import { useState, useEffect } from "react";
import { Form, Input, Row, Col, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { CaretDownOutlined } from "@ant-design/icons";
import { config } from "@config/site.config";
import masterDataActions from "@redux/masterData/actions";
import { standardAddressForm, textFieldRules } from "./formOptions";
import { isArray, uniqBy } from "lodash";
import {
  masterDataType,
  getStateNames,
  getDistrictsNames,
  getMandalNames,
} from "@containers/FirDetails/fir-util";
import { residencyType } from "@containers/const";

const Option = Select.Option;

const {
  getStateDistrictList,
  getStatesName,
  getMandalList,
  getDistrictVillage,
} = masterDataActions;

export default function StandardAddressForm({
  showMoreOption,
  changeValue,
  disabled = false,
  selectedState,
  setSelectedState,
  validationFields = ["Ward/Colony", "State/UT", "District", "Area/Mandal"],
  personType = "",
}) {
  const dispatch = useDispatch();
  const [serchText, setSerchText] = useState("");
  const [showMore, setShowMore] = useState(false);
  const [villgeListState, setvillgeListState] = useState([]);
  const [pincodeListState, setpincodeListState] = useState([]);
  const isTelangana = selectedState !== "" && selectedState === "TELANGANA";

  const { stateDistrictList, statesNameList, mandalList } = useSelector(
    (state) => state.MasterData
  );

  useEffect(() => {
    dispatch(getStatesName(`${config.getMasterData}/${masterDataType.STATES}`));
  }, []);

  const handleSearch = (text) => {
    setSerchText(text);
  };

  const stateNames = () => getStateNames(statesNameList);
  const districtsNames = () =>
    selectedState !== "" ? getDistrictsNames(stateDistrictList) : [];
  const areaMandalList = () => (isTelangana ? getMandalNames(mandalList) : []);

  const onMandalChange = (mandal) => {
    if (getMandalNames(mandalList)) {
      let n1 = [];
      let n2 = [];
      mandalList.forEach((ele) => {
        if (ele.revenueMandal === mandal) {
          let x1 = {};
          let x2 = {};
          x1.label = ele?.village;
          x1._id = ele?._id;
          x2.label = ele?.pincode;
          x2._id = ele?._id;
          n1.push(x1);
          n2.push(x2);
        }
      });
      setvillgeListState([...n1]);
      setpincodeListState([...n2]);
    } else {
      setvillgeListState([]);
      setpincodeListState([]);
    }
  };

  const onStateChange = (state) => {
    setSelectedState && setSelectedState(state);
    dispatch(
      getStateDistrictList(
        `${config.masterData}/getStateDistrict?state=${state}`
      )
    );
    changeValue();
  };

  const onDistrictChange = (val) => {
    setpincodeListState([]);
    setvillgeListState([]);
    dispatch(
      getMandalList(
        `${config.getMandalVillage}?state=${selectedState}&district=${val}`
      )
    );
    dispatch(
      getDistrictVillage(
        `${config.getDistrictVillage}?state=${selectedState}&district=${val}`
      )
    );
  };

  const renderFieldsWithDropDown = (menuOptions, setValue) => {
    return (
      <Select
        suffixIcon={<CaretDownOutlined className="dropDownIcon" />}
        showSearch
        allowClear
        disabled={disabled}
        onSearch={handleSearch}
        style={{ width: 250 }}
        filterOption={(input, option) =>
          serchText &&
          option.props?.label
            ?.toString()
            ?.toLowerCase()
            ?.indexOf(input.toString().toLowerCase()) >= 0
        }
        onSelect={setValue}
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

  const displayAdditionalFields = (dataList, onMandalChange) => {
    return isTelangana ? (
      renderFieldsWithDropDown(dataList, onMandalChange)
    ) : (
      <Input
        onChange={changeValue}
        disabled={disabled}
        style={{ width: 250 }}
      />
    );
  };

  const displayFormItems = (name) => {
    switch (name) {
      case "stateUt":
        return renderFieldsWithDropDown(stateNames(), onStateChange);
      case "district":
        return renderFieldsWithDropDown(districtsNames(), onDistrictChange);
      case "localityVillage":
        return displayAdditionalFields(villgeListState, null);
      case "areaMandal":
        return displayAdditionalFields(areaMandalList(), onMandalChange);
      case "pinCode":
        return displayAdditionalFields(uniqBy(pincodeListState, "label"), null);
      case "residencyType":
        return renderFieldsWithDropDown(residencyType, null);
      default:
        return (
          <Input
            onChange={changeValue}
            maxLength={textFieldRules.maxLength}
            disabled={disabled}
            style={{ width: 250 }}
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
        {standardAddressForm.map((s, i) => {
          const isLabel =
            personType !== "Accused" &&
            isArray(validationFields) &&
            validationFields.indexOf(s.label) >= 0;
          return (
            <Col span={8} key={i} style={{ marginBottom: 10 }}>
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
