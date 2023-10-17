/* eslint-disable array-callback-return */
import { Form, Input, Row, Col, Select } from "antd";
import { standardSceneOfOffenceForm } from "./formOptions";
import masterDataActions from "@redux/masterData/actions";
import { useDispatch, useSelector } from "react-redux";
import { config } from "@config/site.config";
import { useState, useEffect } from "react";
import { isArray, isEmpty, isNull, uniqBy, isUndefined } from "lodash";
import { CaretDownOutlined } from "@ant-design/icons";
import {
  getDistrictsNames,
  getStateNames,
  masterDataType,
} from "@containers/FirDetails/fir-util";

const Option = Select.Option;

export default function StandardSceneOfOffenceForm({
  changeValue,
  disabled = false,
  currentData,
  validationFields,
  sceneofoffenseForm,
}) {
  const dispatch = useDispatch();
  const [serchText, setSerchText] = useState("");
  const {
    getStateDistrictList,
    getMandalList,
    getDistrictVillage,
    getStatesName,
  } = masterDataActions;
  const { stateDistrictList, statesNameList, villagePincodeList } = useSelector(
    (state) => state.MasterData
  );
  const [state, setState] = useState("");
  const [pincodeListState, setpincodeListState] = useState([]);
  const handleSearch = (text) => {
    setSerchText(text);
  };
  const stateNames = () => getStateNames(statesNameList);
  useEffect(() => {
    dispatch(getStatesName(`${config.getMasterData}/${masterDataType.STATES}`));
    dispatch(
      getStateDistrictList(
        `${config.masterData}/getStateDistrict?state=TELANGANA`
      )
    );
    !!sceneofoffenseForm &&
      sceneofoffenseForm.setFieldsValue({ state: "TELANGANA" });
  }, []);
  const getPincodeList = (dataList) => {
    let result = [];
    !isUndefined(dataList) &&
      !isEmpty(dataList) && dataList?.length > 0 &&
      dataList?.map((x) => {
        const data = {
          label: x.Pincode,
          state: x.State,
          _id: x._id,
        };
        result.push(data);
      });
    return uniqBy(result, "label");
  };
  const onStateChange = (state) => {
    dispatch(
      getStateDistrictList(
        `${config.masterData}/getStateDistrict?state=${state}`
      )
    );
    setState(state);
    !!sceneofoffenseForm && sceneofoffenseForm.setFieldsValue({
      district: "",
      pincode: "",
      city: "",
      landmark: "",
    });
  };

  const getDistrictMandalList = (district, stateData) => {
    const data = !!state ? state : currentData?.address?.state;
    dispatch(
      getMandalList(
        `${config.getMandalVillage}?state=${data}&district=${district}`
      )
    );
    !!sceneofoffenseForm && sceneofoffenseForm.setFieldsValue({
      pincode: "",
      city: "",
      landmark: "",
    });
  };

  const getDistrictVillageList = (district, stateData) => {
    const data = !!state ? state : currentData?.address?.state;
    dispatch(
      getDistrictVillage(
        `${config.getStateDistrict}?state=${data}&district=${district}`
      )
    );
  };

  useEffect(() => {
    if (!isNull(currentData)) {
      getDistrictMandalList(currentData?.address?.district);
      getDistrictVillageList(currentData?.address?.district);
    }
  }, [currentData]);

  const onDistrictChange = (val) => {
    const data = !!state ? state : currentData?.address?.state;
    setpincodeListState([]);
    getDistrictMandalList(val, data);
    getDistrictVillageList(val, data);
  };
  console.log(villagePincodeList);
  const districtsNames = () =>
    !isEmpty(stateDistrictList) && getDistrictsNames(stateDistrictList);
  const pinCodeList = () =>
    !isEmpty(villagePincodeList) && getPincodeList(villagePincodeList);

  const renderFieldsWithDropDown = (menuOptions, setValue) => {
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

  const displayFormItems = (name) => {
    switch (name) {
      case "state":
        return renderFieldsWithDropDown(stateNames(), onStateChange);
      case "district":
        return renderFieldsWithDropDown(districtsNames(), onDistrictChange);
      case "pincode":
        return renderFieldsWithDropDown(pinCodeList(), null);
      default:
        return <Input onChange={changeValue} disabled={disabled} />;
    }
  };

  return (
    <div>
      <Row gutter={24}>
        {standardSceneOfOffenceForm.map((s, i) => {
          let isLabel =
            isArray(validationFields) && validationFields.indexOf(s.label) >= 0
              ? true
              : false;
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
    </div>
  );
}
