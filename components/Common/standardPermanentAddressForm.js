/* eslint-disable array-callback-return */
import { useState } from "react";
import { Form, Input, Row, Col, Select } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { CaretDownOutlined } from "@ant-design/icons";
import masterDataActions from "@redux/masterData/actions";
import { config } from "@config/site.config";
import { standardPermanentAddressForm } from "./formOptions";
import { isArray, uniqBy } from "lodash";
import { residencyType } from "@containers/const";
import {
  getStateNames,
  getDistrictsNames,
  getMandalNames,
  getPincodeList,
  getVillageList,
} from "@containers/FirDetails/fir-util";

const Option = Select.Option;
const { getStateDistrictList, getMandalList, getDistrictVillage } =
  masterDataActions;

export default function StandardPermanentAddressForm({
  showMoreOption,
  changeValue,
  disabled = false,
  selectedPermanentState,
  setSelectedPermanentState,
  validationFields = ["Ward/Colony", "State/UT", "District", "Area/Mandal"],
  personType = "",
}) {
  const dispatch = useDispatch();
  const [serchText, setSerchText] = useState("");
  const [showMore, setShowMore] = useState(false);
  const isTelangana =
    selectedPermanentState !== "" && selectedPermanentState === "TELANGANA";
  const [villgeListState, setvillgeListState] = useState([]);
  const [pincodeListState, setpincodeListState] = useState([]);
  const { stateDistrictList, statesNameList, mandalList, villagePincodeList } =
    useSelector((state) => state.MasterData);

  const handleSearch = (text) => {
    setSerchText(text);
  };

  const stateNames = () => getStateNames(statesNameList);
  const districtsNames = () =>
    selectedPermanentState !== "" ? getDistrictsNames(stateDistrictList) : [];
  const pinCodeList = () =>
    isTelangana ? getPincodeList(villagePincodeList) : [];
  const areaMandalList = () => (isTelangana ? getMandalNames(mandalList) : []);
  const villegeList = () =>
    isTelangana ? getVillageList(villagePincodeList) : [];

  const onStateChange = (state) => {
    setSelectedPermanentState && setSelectedPermanentState(state);
    dispatch(
      getStateDistrictList(
        `${config.masterData}/getStateDistrict?state=${state}`
      )
    );
    changeValue();
  };

  const onMandalChange = (mandal) => {
    console.log(mandal, getMandalNames(mandalList));
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

  const onDistrictChange = (val) => {
    setpincodeListState([]);
    setvillgeListState([]);
    dispatch(
      getMandalList(
        `${config.getMandalVillage}?state=${selectedPermanentState}&district=${val}`
      )
    );
    dispatch(
      getDistrictVillage(
        `${config.getDistrictVillage}?state=${selectedPermanentState}&district=${val}`
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
      case "p_stateUt":
        return renderFieldsWithDropDown(stateNames(), onStateChange);
      case "p_district":
        return renderFieldsWithDropDown(districtsNames(), onDistrictChange);
      case "p_localityVillage":
        return displayAdditionalFields(villgeListState, null);
      case "p_areaMandal":
        return displayAdditionalFields(areaMandalList(), onMandalChange);
      case "p_pinCode":
        return displayAdditionalFields(uniqBy(pincodeListState, "label"), null);
      case "p_residencyType":
        return renderFieldsWithDropDown(residencyType, null);
      default:
        return (
          <Input
            onChange={changeValue}
            style={{ width: 250 }}
            disabled={disabled}
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
        {standardPermanentAddressForm.map((s, i) => {
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
