import { useState, useEffect, useMemo } from "react";
import {
  Row,
  Card,
  Col,
  Form,
  Select,
  DatePicker,
  Input,
  Radio,
  Modal,
  Button,
} from "antd";
import {
  isArray,
  isEmpty,
  isUndefined,
  isNull,
  isBoolean,
  first,
  uniqBy,
} from "lodash";
import {
  disableFutureDates,
  disableFutureTime,
} from "@components/Common/helperMethods";
import { textFieldRules } from "@components/Common/formOptions";
import { config } from "@config/site.config";
import moment from "moment";
import {
  CaretDownOutlined,
  ExclamationCircleOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import {
  OffenceInformation,
  OffenceDateTime,
  PlaceOfOffenceOne,
  PlaceOfOffenceTwo,
  OutsideRadio,
  informationType,
  disableFIRDateDays,
  directionsFromPs,
} from "./Const";
import { occurenceDataPayload } from "../createFIRPayload";
import {
  DATE_TIME_FORMAT,
  DATE_FORMAT_MM,
  renderFieldsWithDropDown,
  getStateNames,
  getDistrictsWithStatesNames,
} from "@containers/FirDetails/fir-util";
import { useDispatch, useSelector } from "react-redux";
import { FirDetailsModuleWrapper } from "../styles";
import createFIRActions from "@redux/createFir/actions";
import masterDataActions from "@redux/masterData/actions";
import GDNumberSearch from "./GDNumberSearch";
import { loadState } from "@lib/helpers/localStorage";

const Option = Select.Option;
const { TextArea } = Input;
const { confirm } = Modal;

const optionType = {
  STATES: "STATES",
  DIRECTION_FROM_PS: "DIRECTION_FROM_PS",
  UNITS: "UNITS",
  DISTRICTS: "DISTRICTS",
};

export default function OccurrenceOfOffence({
  occurenceForm,
  placeOfOffence,
  setPlaceOfOffence,
  disable,
  firType,
  isConsumed,
}) {
  const dispatch = useDispatch();
  const [GDForm] = Form.useForm();
  const currentUser = loadState("currentUser");
  const [gDFormValues, setGDFromValues] = useState("");
  const [serchText, setSerchText] = useState("");
  const [isError, setIsError] = useState(false);
  const [isCustomError, setIsCustomError] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formValid, setFormValid] = useState(false);
  const [selectedFIRDate, setSelectedFIRDate] = useState("");
  const [selectedFromDate, setSelectedFromDate] = useState("");
  const [selectedToDate, setSelectedToDate] = useState("");
  const [unitsFromDistrictState, setunitsFromDistrictState] = useState([]);
  const [selectedPriorDate, setSelectedPriorDate] = useState("");
  const [selectedinformationReceivedDate, setSelectedinformationReceivedDate] =
    useState("");
  const [selectedGDDate, setSelectedGDDate] = useState("");
  const [placeOfOffenceAPiValue, setplaceOfOffenceAPiValue] = useState("");
  const [wardColonyAPiValue, setwardColonyAPiValue] = useState("");
  const [clickedHandlePs, setclickedHandlePs] = useState(false);
  const [districtList, setDistrictList] = useState([]);
  const [ward_colonyData, setward_colonyData] = useState([]);
  const { savedFir } = useSelector((state) => state.createFIR);
  const [stateName, setStateName] = useState("");
  const { addOccurrenceOfOffence } = createFIRActions;
  const {
    getStateDistrictList,
    getStatesName,
    getUnitsList,
    getVillageFromPsList,
    getUnitsFromDistrict,
    getDistrictVillage,
  } = masterDataActions;
  const {
    stateDistrictList,
    statesNameList,
    villageFromPSList,
    unitsFromDistrict,
    villagePincodeList,
  } = useSelector((state) => state.MasterData);

  const fetchMasterData = () => {
    dispatch(getStatesName(`${config.getMasterData}/${optionType.STATES}`));
    dispatch(
      getStateDistrictList(`${config.getMasterData}/${optionType.DISTRICTS}`)
    );
    dispatch(getUnitsList(`${config.getMasterData}/${optionType.UNITS}`));
    dispatch(
      getVillageFromPsList(
        `${config.masterData}/getVillageonLoginPs?psCode=${currentUser?.cctns_unit_id}`
      )
    );
  };

  useEffect(() => {
    fetchMasterData();
  }, []);

  useEffect(() => {
    setclickedHandlePs(false);
    if (placeOfOffence === "inside") {
      dispatch(
        getVillageFromPsList(
          `${config.masterData}/getVillageonLoginPs?psCode=${currentUser?.cctns_unit_id}`
        )
      );
    } else {
      setward_colonyData([]);
      dispatch(
        getVillageFromPsList(
          `${config.masterData}/getVillageonLoginPs?psCode=0`
        )
      );
    }
    if (placeOfOffenceAPiValue !== placeOfOffence) {
      occurenceForm.setFieldsValue({
        Ward_Colony_Village: "",
        pinCode: "",
      });
    } else {
      setward_colonyData([]);
      let values = occurenceForm.validateFields();
      occurenceForm.setFieldsValue({
        Ward_Colony_Village: values?.Ward_Colony_Village
          ? values?.Ward_Colony_Village
          : wardColonyAPiValue,
      });
    }
  }, [placeOfOffence]);

  useEffect(() => {
    let n1 = [];
    isArray(villageFromPSList) &&
      villageFromPSList.forEach((item) => {
        const container = {};
        container["label"] = item.village;
        container["name"] = item.village;
        n1.push(container);
      });
    setward_colonyData(n1);
  }, [villageFromPSList]);

  const pincode = useMemo(() => {
    if (isArray(villageFromPSList)) {
      const pincodes = villageFromPSList.map((item) => ({
        label: item?.pincode,
        value: item?.pincode,
      }));
      return uniqBy(pincodes, "label");
    }
    return [];
  }, [villageFromPSList]);

  const handleSearch = (text) => {
    setSerchText(text);
  };

  const changeValue = () => {
    checkFields();
  };

  const getDistrictVillageList = (district) => {
    let districtName = district ? district.toUpperCase() : "";
    dispatch(
      getDistrictVillage(
        `${config.getStateDistrict}?state=${stateName}&district=${districtName}`
      )
    );
  };

  useEffect(() => {
    getDistrictVillageList();
  }, []);

  const pinCode = useMemo(() => {
    if (isArray(villagePincodeList) && !isEmpty(villagePincodeList)) {
      const uniqLst = uniqBy(villagePincodeList, "Pincode");
      return uniqLst.map((item) => item.Pincode);
    }
    return [];
  }, [villagePincodeList]);

  const handleDistrictCityChange = (district) => {
    setclickedHandlePs(true);
    occurenceForm.setFieldsValue({
      PS: "",
      Ward_Colony_Village: "",
    });
    setunitsFromDistrictState([]);
    setward_colonyData([]);
    getDistrictVillageList(district);
    let districtName = district ? district.toUpperCase() : "";
    dispatch(
      getDistrictVillage(
        `${config.getStateDistrict}?state=${stateName}&district=${districtName}`
      )
    );
    dispatch(
      getUnitsFromDistrict(
        `${config.masterData}/getUnitsFromDistrict?district=${district}`
      )
    );
  };

  useEffect(() => {
    let n1 = [];
    isArray(unitsFromDistrict) &&
      unitsFromDistrict.forEach((item) => {
        const container = {};
        container["label"] = item.UNIT_NAME;
        container["name"] = item.UNIT_NAME;
        container["psCode"] = item.UNIT_CD;
        n1.push(container);
      });
    setunitsFromDistrictState(n1);
  }, [unitsFromDistrict]);

  const handleOk = async () => {
    GDForm.validateFields()
      .then((values) => {
        setFormValid(
          !Object.values(values).every((v) => v == null || v === "")
        );
        setGDFromValues(values);
        const gdDateFormat = moment(values?.GD_entry_date).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        setSelectedGDDate(gdDateFormat);
        occurenceForm.setFieldsValue({
          GD_number: values.GD_entry_number,
          GD_date_time: values.GD_entry_date,
        });
        setIsModalVisible(false);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
    fetchMasterData();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    fetchMasterData();
  };

  const checkFields = async () => {
    const values = await occurenceForm.validateFields();
    setFormValid(!Object.values(values).every((v) => v == null || v === ""));
  };

  const displayOffenceInformationFields = (name) => {
    switch (name) {
      case "Information_received_at_PS":
        return (
          <DatePicker
            showTime
            format={DATE_TIME_FORMAT}
            placeholder="Select Date and Time"
            onChange={onInformationReceivedDateChange}
            style={{ width: 222 }}
            disabledDate={disableFutureDates}
            disabled={disable}
          />
        );
      case "Information_type":
        return renderFieldsWithDropDown(
          informationType,
          null,
          handleSearch,
          serchText,
          222,
          disable
        );
      case "GD_date_time":
        return (
          <DatePicker
            showTime
            format={DATE_TIME_FORMAT}
            placeholder="Select Date and Time"
            style={{ width: 222 }}
            disabled={true}
          />
        );
      default:
        return (
          <Input
            onChange={checkFields}
            style={{ width: 222 }}
            maxLength={textFieldRules.maxLength}
            disabled={disable || name === "GD_number"}
          />
        );
    }
  };

  const offenceFromDateChange = (date, _dateString) => {
    if (selectedPriorDate) {
      showConfirm();
      occurenceForm.setFieldsValue({
        Prior_to: "",
      });
      setSelectedPriorDate("");
    }
    const fromDate = moment(date).format("YYYY-MM-DD");
    const fromDateTime = moment(date).format("YYYY-MM-DD HH:mm:ss");
    setSelectedFromDate(fromDateTime);
    setIsError(false);
    occurenceForm.setFieldsValue({
      Prior_to: "",
      FIR_date_time: "",
    });
    setSelectedPriorDate("");
    const startDate = new Date(fromDate);
    const endDate = new Date(moment(selectedToDate).format("YYYY-MM-DD"));
    const differenceInTime = endDate.getTime() - startDate.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
    if (!isNaN(differenceInDays)) {
      occurenceForm.setFieldsValue({
        Time_period: differenceInDays,
      });
    }
    checkFields();
  };

  const offenceToDateChange = (date, _dateString) => {
    if (selectedPriorDate) {
      showConfirm();
      occurenceForm.setFieldsValue({
        Prior_to: "",
      });
      setSelectedPriorDate("");
    }
    const toDate = moment(date).format("YYYY-MM-DD");
    const toDateTime = moment(date).format("YYYY-MM-DD HH:mm:ss");
    setSelectedToDate(toDateTime);
    setIsError(false);
    occurenceForm.setFieldsValue({
      Prior_to: "",
      FIR_date_time: "",
    });
    setSelectedPriorDate("");
    const fromDate = new Date(moment(selectedFromDate).format("YYYY-MM-DD"));
    const endDate = new Date(toDate);
    const differenceInTime = endDate.getTime() - fromDate.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
    if (!isNaN(differenceInDays)) {
      occurenceForm.setFieldsValue({
        Time_period: differenceInDays,
      });
    }
    checkFields();
  };

  const showConfirm = () => {
    confirm({
      title: "You can enter either From/To Date or Prior Date",
      icon: <ExclamationCircleOutlined />,
      content: "From/To Date will be cleared once Prior Date will be filled",
      width: 500,
    });
  };

  const offencePriorToChange = (date, _dateString) => {
    const priorToDateChange = moment(date).format("YYYY-MM-DD HH:mm:ss");
    if (selectedFromDate || selectedToDate) {
      setSelectedFromDate("");
      setSelectedToDate("");
      setSelectedPriorDate(priorToDateChange);
      setIsError(false);
      occurenceForm.setFieldsValue({
        Time_period: "",
        From_date: "",
        End_date: "",
      });
      showConfirm();
    } else {
      setSelectedPriorDate(priorToDateChange);
    }
    checkFields();
  };

  const onInformationReceivedDateChange = (date, _dateString) => {
    const informationReceivedDateChange = moment(date).format(
      "YYYY-MM-DD HH:mm:ss"
    );
    setSelectedinformationReceivedDate(informationReceivedDateChange);
    checkFields();
  };

  const onFirDateChange = (date, _dateString) => {
    const firDate = moment(date).format("YYYY-MM-DD HH:mm:ss");
    setSelectedFIRDate(firDate);
    checkFields();
  };

  const displayOffenceDateTimeFields = (name) => {
    switch (name) {
      case "From_date":
        return (
          <DatePicker
            showTime
            allowClear={false}
            format={DATE_TIME_FORMAT}
            placeholder="Select Date and Time"
            onChange={offenceFromDateChange}
            style={{ width: 222 }}
            disabledDate={disableFutureDates}
            disabled={disable}
          />
        );
      case "End_date":
        return (
          <DatePicker
            showTime
            allowClear={false}
            format={DATE_TIME_FORMAT}
            placeholder="Select Date and Time"
            onChange={offenceToDateChange}
            style={{ width: 222 }}
            disabledDate={disableFutureDates}
            disabled={disable}
          />
        );
      case "Prior_to":
        return (
          <DatePicker
            showTime
            allowClear={false}
            format={DATE_TIME_FORMAT}
            placeholder="Select Date and Time"
            onChange={offencePriorToChange}
            style={{ width: 222 }}
            disabledDate={disableFutureDates}
            disabled={disable}
          />
        );
      case "FIR_date_time":
        return (
          <DatePicker
            showTime
            format={DATE_TIME_FORMAT}
            placeholder="Select Date and Time"
            onChange={onFirDateChange}
            style={{ width: 222 }}
            disabledDate={disableFIRDateDays}
            disabledTime={disableFutureTime}
            disabled={disable}
          />
        );
      default:
        return (
          <Input
            onChange={checkFields}
            style={{ width: 222 }}
            maxLength={textFieldRules.maxLength}
            disabled={disable}
          />
        );
    }
  };

  const displayPlaceOfOffenceFields = (name) => {
    switch (name) {
      case "Directions_from_ps":
        return renderFieldsWithDropDown(
          directionsFromPs,
          null,
          handleSearch,
          serchText,
          222,
          disable
        );
      case "Ward_Colony_Village":
        return placeOfOffence === "inside" ? (
          renderFieldsWithDropDown(
            ward_colonyData,
            null,
            handleSearch,
            serchText,
            222,
            disable
          )
        ) : clickedHandlePs ? (
          renderFieldsWithDropDown(
            ward_colonyData,
            null,
            handleSearch,
            serchText,
            222,
            disable
          )
        ) : (
          <Input
            onChange={checkFields}
            style={{ width: 222 }}
            maxLength={textFieldRules.maxLength}
            disabled={disable}
          />
        );
      case "pinCode":
        return renderFieldsWithDropDown(
          pincode,
          null,
          handleSearch,
          serchText,
          222,
          disable
        );
      default:
        return (
          <Input
            onChange={checkFields}
            style={{ width: 222 }}
            maxLength={textFieldRules.maxLength}
            disabled={disable}
          />
        );
    }
  };

  const displayError = (errorMessage) => (
    <div
      className="ant-form-item-explain-error occurrenceError"
      style={{ marginLeft: 5, marginTop: 5 }}
    >
      {errorMessage}
    </div>
  );

  const isDateValid =
    selectedFromDate &&
    selectedToDate &&
    moment(selectedToDate).isAfter(selectedFromDate);

  const isFirDateValid =
    selectedFromDate &&
    selectedFIRDate &&
    moment(selectedFIRDate).isAfter(selectedFromDate);

  const isFirDateValidForToDate =
    selectedToDate &&
    selectedFIRDate &&
    moment(selectedFIRDate).isAfter(selectedToDate);

  const isToDateValid =
    selectedinformationReceivedDate &&
    selectedToDate &&
    moment(selectedinformationReceivedDate).isAfter(selectedToDate);

  const isInformationReceivedDateValid =
    selectedinformationReceivedDate &&
    selectedFIRDate &&
    moment(selectedFIRDate).isSameOrAfter(selectedinformationReceivedDate);

  const isPriorDateValid =
    selectedPriorDate &&
    selectedFIRDate &&
    moment(selectedFIRDate).isAfter(selectedPriorDate);

  const isGDDateValid =
    selectedGDDate &&
    selectedFIRDate &&
    moment(selectedFIRDate).isSameOrAfter(selectedGDDate);

  const displayOccurrenceOfOffenceState = (
    data,
    actionName,
    spanIndex,
    width
  ) => {
    return (
      <>
        {data.map((s, i) => {
          const isLabel =
            s.name === "FIR_date_time" ||
            s.name === "Information_received_at_PS" ||
            s.name === "GD_number" ||
            s.name === "Directions_from_ps" ||
            s.name === "distanceFromPS";
          return (
            <Col span={spanIndex} key={i} style={{ marginBottom: 20 }}>
              <Form.Item
                name={s.name}
                label={s.label}
                style={{ width: width }}
                rules={[
                  {
                    required: isLabel ? true : false,
                    message: isLabel ? `${s.label} is required.` : "",
                  },
                ]}
              >
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
              {s.name === "End_date" && isBoolean(isDateValid) && !isDateValid
                ? displayError("To Date should be greater than From Date")
                : null}
              {s.name === "FIR_date_time" &&
              isBoolean(isFirDateValid) &&
              !isFirDateValid
                ? displayError("FIR Date should be later than From Date")
                : null}
              {s.name === "FIR_date_time" &&
              isBoolean(isFirDateValidForToDate) &&
              !isFirDateValidForToDate
                ? displayError("FIR Date should be later than To Date")
                : null}
              {s.name === "End_date" &&
              isBoolean(isToDateValid) &&
              !isToDateValid
                ? displayError(
                    "To Date should be less than Information Received at PS"
                  )
                : null}
              {s.name === "Information_received_at_PS" &&
              isBoolean(isInformationReceivedDateValid) &&
              !isInformationReceivedDateValid
                ? displayError(
                    "Information Received at PS Should be less than FIR Date"
                  )
                : null}
              {s.name === "Prior_to" &&
              isBoolean(isPriorDateValid) &&
              !isPriorDateValid
                ? displayError("Prior To Should be less than FIR Date")
                : null}
              {s.name === "GD_date_time" &&
              isBoolean(isGDDateValid) &&
              !isGDDateValid
                ? displayError("GD Date & Time should be less than FIR Date")
                : null}
            </Col>
          );
        })}
      </>
    );
  };

  useEffect(() => {
    if (!isEmpty(savedFir) && !isUndefined(savedFir)) {
      const gdDateTime =
        !isEmpty(gDFormValues?.GD_entry_date) &&
        moment(gDFormValues?.GD_entry_date).isValid()
          ? moment(gDFormValues?.GD_entry_date)
          : "";
      const gdFormData = {
        GD_entry_number: gDFormValues?.GD_entry_number,
        GD_entry_date: gdDateTime,
        entryOfficerName: gDFormValues?.entryOfficerName,
        typeOfGDEntry: gDFormValues?.typeOfGDEntry,
        GDBriefDetails: gDFormValues?.GDBriefDetails,
      };
      GDForm.setFieldsValue(gdFormData);
    }
  }, [isModalVisible]);

  useEffect(() => {
    if (!isEmpty(savedFir) && !isUndefined(savedFir)) {
      const firDetail = savedFir?.firDetail;
      const occurenceOfOffence =
        !isUndefined(firDetail?.occurenceOfOffence) &&
        firDetail?.occurenceOfOffence;
      const placeOfOccurence =
        !isUndefined(firDetail?.placeOfOccurence) &&
        firDetail?.placeOfOccurence;
      const offencePlace = isUndefined(placeOfOccurence?.psLimits)
        ? placeOfOffence
        : placeOfOccurence?.psLimits;
      setPlaceOfOffence(offencePlace);
      setplaceOfOffenceAPiValue(offencePlace);
      setwardColonyAPiValue(placeOfOccurence?.wardColony);
      const gdDateTime =
        !isEmpty(occurenceOfOffence?.gdDate) &&
        moment(occurenceOfOffence?.gdDate).isValid()
          ? moment(occurenceOfOffence?.gdDate)
          : "";
      const gdFormData = {
        GD_entry_number: occurenceOfOffence?.gdNumber,
        GD_entry_date: gdDateTime,
        entryOfficerName: occurenceOfOffence?.entryOfficerName,
        typeOfGDEntry: occurenceOfOffence?.typeOfGdntry,
        GDBriefDetails: occurenceOfOffence?.gdEntryDetails,
      };
      GDForm.setFieldsValue(gdFormData);
      setGDFromValues(gdFormData);
      setSelectedGDDate(gdDateTime);
      setSelectedFromDate(
        !isEmpty(occurenceOfOffence?.fromDate) &&
          moment(occurenceOfOffence?.fromDate).isValid()
          ? moment(occurenceOfOffence?.fromDate)
          : ""
      );
      setSelectedToDate(
        !isEmpty(occurenceOfOffence?.toDate) &&
          moment(occurenceOfOffence?.toDate).isValid()
          ? moment(occurenceOfOffence?.toDate)
          : ""
      );
      setSelectedPriorDate(
        !isNull(occurenceOfOffence?.priorToDate) &&
          moment(occurenceOfOffence?.priorToDate).isValid()
          ? moment(occurenceOfOffence?.priorToDate)
          : ""
      );
      occurenceForm.setFieldsValue({
        From_date:
          !isEmpty(occurenceOfOffence?.fromDate) &&
          moment(occurenceOfOffence?.fromDate).isValid()
            ? moment(occurenceOfOffence?.fromDate)
            : "",
        End_date:
          !isEmpty(occurenceOfOffence?.toDate) &&
          moment(occurenceOfOffence?.toDate).isValid()
            ? moment(occurenceOfOffence?.toDate)
            : "",
        Prior_to:
          !isEmpty(occurenceOfOffence?.priorToDate) &&
          moment(occurenceOfOffence?.priorToDate).isValid()
            ? moment(occurenceOfOffence?.priorToDate)
            : "",
        FIR_date_time:
          !isEmpty(occurenceOfOffence?.firDate) &&
          moment(occurenceOfOffence?.firDate).isValid()
            ? moment(occurenceOfOffence?.firDate)
            : "",
        Time_period: occurenceOfOffence?.timePeriod,
        Information_received_at_PS:
          !isEmpty(occurenceOfOffence?.informationReceivedAtPS) &&
          moment(occurenceOfOffence?.informationReceivedAtPS).isValid()
            ? moment(occurenceOfOffence?.informationReceivedAtPS)
            : "",
        Information_type: occurenceOfOffence?.informationType,
        GD_number: occurenceOfOffence?.gdNumber,
        GD_date_time: gdDateTime,
        reasonForDelay: occurenceOfOffence?.reasonForDelay,
        psLimits: placeOfOccurence?.psLimits,
        state: placeOfOccurence?.state,
        City: placeOfOccurence?.cityDistrict,
        pinCode: placeOfOccurence?.pinCode,
        PS: placeOfOccurence?.ps,
        Directions_from_ps_text: placeOfOccurence?.directions,
        Directions_from_ps: placeOfOccurence?.directionsFromPS,
        distanceFromPS: placeOfOccurence?.distanceFromPS,
        latitude: placeOfOccurence?.latitude,
        longitude: placeOfOccurence?.longitude,
        Beat_no: placeOfOccurence?.beatNo,
        Pleace_house_no: placeOfOccurence?.houseNo,
        Street_road_no: placeOfOccurence?.streetRoadNo,
        Landmark_milestone: placeOfOccurence?.landmarkMilestone,
        Ward_Colony_Village: placeOfOccurence?.wardColony,
        Jurisdiction_mandal: placeOfOccurence?.areaMandal,
      });
    } else {
      occurenceForm.resetFields();
    }
  }, [savedFir]);

  const stateNames = () => getStateNames(statesNameList);
  const districtsNames = () => getDistrictsWithStatesNames(stateDistrictList);

  const setState = (state) => {
    setStateName(state);
    const stateCode =
      !isEmpty(stateNames()) &&
      first(stateNames().filter((s) => s.label === state))?.stateCode;
    const districtList =
      !isEmpty(districtsNames()) &&
      districtsNames().filter((s) => s.stateCode === parseInt(stateCode));
    setDistrictList(districtList);
    changeValue();
  };

  const renderFieldsWithDropDownOutside = (menuOptions, name, setValue) => {
    return (
      <Select
        suffixIcon={<CaretDownOutlined className="dropDownIcon" />}
        showSearch
        disabled={disable}
        onSearch={handleSearch}
        style={{ width: 150 }}
        filterOption={(input, option) =>
          serchText &&
          option.props?.label
            ?.toString()
            ?.toLowerCase()
            ?.indexOf(input.toString().toLowerCase()) >= 0
        }
        onSelect={(item) => {
          setValue(item);
          occurenceForm.setFieldsValue({
            City: "",
            PS: "",
            pinCode: "",
            Ward_Colony_Village: "",
          });
          setunitsFromDistrictState([]);
          setward_colonyData([]);
        }}
      >
        {isArray(menuOptions) && name !== "states"
          ? menuOptions.map((item, index) => (
              <Option key={index} value={item} label={item}>
                {item}
              </Option>
            ))
          : isArray(menuOptions) &&
            menuOptions.map((item, index) => (
              <Option key={index} value={item.label} label={item.label}>
                {item.label}
              </Option>
            ))}
      </Select>
    );
  };

  const hanldeClickPS = (item, totalItem) => {
    occurenceForm.setFieldsValue({
      Ward_Colony_Village: "",
    });
    dispatch(
      getVillageFromPsList(
        `${config.masterData}/getVillageonLoginPs?psCode=${totalItem?.psCode}`
      )
    );
  };

  const renderFieldsWithDropDownPS = (
    menuOptions,
    selectAction,
    handleSearch,
    serchText,
    width = "",
    disabled = false,
    name
  ) => {
    return (
      <Select
        suffixIcon={<CaretDownOutlined className="dropDownIcon" />}
        showSearch
        allowClear
        onSearch={handleSearch}
        filterOption={(input, option) =>
          serchText &&
          option.props.label
            .toString()
            .toLowerCase()
            .indexOf(input.toString().toLowerCase()) >= 0
        }
        style={{ width: width || 150 }}
        onSelect={(item, totalItem) => {
          selectAction && selectAction(item, totalItem);
        }}
        disabled={disabled}
      >
        {isArray(menuOptions) && name === "district"
          ? menuOptions.map((item, index) => (
              <Option key={index} value={item} label={item}>
                {item}
              </Option>
            ))
          : isArray(menuOptions) &&
            menuOptions.map((item, index) => (
              <Option
                key={index}
                value={item.label}
                label={item.label}
                psCode={item?.psCode}
              >
                {item.label}
              </Option>
            ))}
      </Select>
    );
  };

  const displayFormItems = (name) => {
    switch (name) {
      case "City":
        return renderFieldsWithDropDown(
          districtList,
          handleDistrictCityChange,
          handleSearch,
          serchText,
          150,
          disable
        );
      case "state":
        return renderFieldsWithDropDownOutside(
          stateNames(),
          "states",
          setState,
          150
        );
      case "pinCode":
        return !isEmpty(pinCode) && !isUndefined(pinCode).length != 0 ? (
          renderFieldsWithDropDownOutside(pinCode, "pinCode")
        ) : (
          <Input
            onChange={changeValue}
            maxLength={textFieldRules.maxLength}
            disabled={disable}
            style={{ width: 150 }}
          />
        );
      case "PS":
        return renderFieldsWithDropDownPS(
          unitsFromDistrictState,
          hanldeClickPS,
          handleSearch,
          serchText,
          150,
          disable
        );
      case "Ward_Colony_Village":
        return ward_colonyData &&
          isArray(ward_colonyData) &&
          ward_colonyData.length > 0 ? (
          renderFieldsWithDropDown(
            ward_colonyData,
            null,
            handleSearch,
            serchText,
            150,
            disable
          )
        ) : (
          <Input
            onChange={changeValue}
            style={{ width: 150 }}
            maxLength={textFieldRules.maxLength}
            disabled={disable}
          />
        );
      default:
        return (
          <Input
            onChange={changeValue}
            style={{ width: 150 }}
            maxLength={textFieldRules.maxLength}
            disabled={disable}
          />
        );
    }
  };

  const displayFromToPriorError = () => (
    <div
      style={{ marginTop: 10, marginLeft: 5, color: "#FF4D4F", fontSize: 14 }}
    >
      Please Enter Either Of From Date and To Date (Or) Prior to date
    </div>
  );

  const displayCustomError = () => (
    <div
      style={{ marginTop: 10, marginLeft: 5, color: "#FF4D4F", fontSize: 14 }}
    >
      Please Enter Valid Details!
    </div>
  );

  // Used For Manual Validation
  const validationError = document.getElementsByClassName("occurrenceError");

  const submitOccurrenceOfOffence = async () => {
    const values = await occurenceForm.validateFields();
    await GDForm.validateFields();
    if (
      selectedFromDate === "" &&
      selectedToDate === "" &&
      selectedPriorDate === ""
    ) {
      setIsError(true);
    } else {
      setIsError(false);
      const occurenceData = occurenceDataPayload(
        values,
        placeOfOffence,
        gDFormValues
      );
      const firDetail = savedFir?.firDetail;
      const payload = {
        crimeId: savedFir?._id,
        preCrimeId: savedFir?.preCrime?._id,
        crimeSceneId: savedFir?.crimeScene,
        planOfActionId: savedFir?.planOfAction,
        crimeLocationId: savedFir?.crimeLocationId,
        firType: firType,
        isDraft: !isUndefined(isConsumed) ? true : savedFir?.isDraft,
        firDetail: {
          crimeType: firDetail?.crimeType,
          crimeSubType: firDetail?.crimeSubType,
          petitionNo: firDetail?.petitionNo,
          gravity: firDetail?.gravity,
          actsAndSections: firDetail?.actsAndSections,
          majorMinorClassification: firDetail?.majorMinorClassification,
          occurenceOfOffence: occurenceData?.occurenceOfOffence,
          placeOfOccurence: occurenceData?.placeOfOccurance,
          briefFacts: firDetail?.briefFacts,
          uploadDocuments: firDetail?.uploadDocuments,
          crimeShownBy: !isEmpty(savedFir?.complainantDetails)
            ? first(savedFir?.complainantDetails).person?.personalDetails?.name
            : "",
          firNum: firDetail?.firNum,
          district: firDetail?.district,
          districtCode: firDetail?.districtCode,
          firStatus: firDetail?.firStatus,
          psCode: firDetail?.psCode,
          psName: firDetail?.psName,
          dateOfReport: firDetail?.dateOfReport,
          firRegnum: firDetail?.firRegnum,
          lastmodifieddate: moment().format(DATE_FORMAT_MM),
          isRelatedToLicense: firDetail?.isRelatedToLicense,
          isSentToCourt: firDetail?.isSentToCourt,
          sentToCourtAt: firDetail?.sentToCourtAt,
          licenseNo: firDetail?.licenseNo,
          isPropertyStolen: firDetail?.isPropertyStolen,
        },
        preCrime: {
          patrolCarsBlueColts: false,
          toolkit: false,
        },
        accusedDetails: savedFir?.accusedDetails,
        victimDetails: savedFir?.victimDetails,
        complainantDetails: savedFir?.complainantDetails,
        stolenProperties: savedFir?.stolenProperties,
      };
      if (validationError.length === 0) {
        setIsCustomError(false);
        dispatch(addOccurrenceOfOffence(config.updateFIR, payload));
      } else {
        setIsCustomError(true);
      }
    }
  };

  return (
    <FirDetailsModuleWrapper>
      <Form form={occurenceForm} layout="vertical">
        <Card
          title="Offence Occurrence Date & Time"
          style={{ marginBottom: 20 }}
        >
          <Row gutter={24} style={{ padding: 10 }}>
            {displayOccurrenceOfOffenceState(
              OffenceDateTime,
              displayOffenceDateTimeFields,
              6
            )}
            {isError && displayFromToPriorError()}
          </Row>
        </Card>
        <Card title="Offence Information Received" style={{ marginBottom: 20 }}>
          <Row gutter={24} style={{ padding: 10 }}>
            {displayOccurrenceOfOffenceState(
              OffenceInformation,
              displayOffenceInformationFields,
              6,
              250
            )}
          </Row>
          <Row gutter={24} style={{ paddingLeft: 10, paddingBottom: 10 }}>
            <Col span={10}>
              <Form.Item
                name="reasonForDelay"
                label="Reason for Delay"
                rules={[
                  {
                    required: true,
                    message: `Reasons For Delay is required.`,
                  },
                ]}
              >
                <TextArea rows={5} disabled={disable} />
              </Form.Item>
            </Col>
          </Row>
        </Card>
        <Card title="Place of Offence" style={{ marginBottom: 20 }}>
          <Row gutter={24} style={{ padding: 10 }}>
            <Col span={4}>
              <Radio.Group
                onChange={(e) => {
                  setPlaceOfOffence(e.target.value);
                  if (isEmpty(savedFir)) {
                    occurenceForm.resetFields();
                  }
                }}
                value={placeOfOffence}
                name="psLimits"
                disabled={disable}
              >
                <Radio
                  value="inside"
                  style={{ marginBottom: 20 }}
                  disabled={disable || firType === "Zero"}
                >
                  Within Police Station Limits
                </Radio>
                <Radio value="outside">Outside Police Station Limits</Radio>
              </Radio.Group>
            </Col>
            {placeOfOffence === "inside" && (
              <>
                <Col span={6}>
                  {displayOccurrenceOfOffenceState(
                    PlaceOfOffenceOne,
                    displayPlaceOfOffenceFields,
                    6,
                    250
                  )}
                </Col>
                <Col span={6}>
                  {displayOccurrenceOfOffenceState(
                    PlaceOfOffenceTwo,
                    displayPlaceOfOffenceFields,
                    6,
                    250
                  )}
                </Col>
                <Col span={6} style={{ zIndex: 1 }}>
                  <Form.Item
                    style={{ marginLeft: 20 }}
                    name="latitude"
                    label="Latitude"
                    rules={[textFieldRules.textFieldMaxLength]}
                  >
                    <Input
                      style={{ width: 200 }}
                      maxLength={textFieldRules.maxLength}
                      disabled={disable}
                    />
                  </Form.Item>
                  <Form.Item
                    style={{ marginLeft: 20 }}
                    name="longitude"
                    label="Longitude"
                    rules={[textFieldRules.textFieldMaxLength]}
                  >
                    <Input
                      style={{ width: 200 }}
                      maxLength={textFieldRules.maxLength}
                      disabled={disable}
                    />
                  </Form.Item>
                </Col>
              </>
            )}
            {placeOfOffence === "outside" && (
              <>
                {OutsideRadio.map((s, i) => {
                  return (
                    <Col span={4} key={i} style={{ marginBottom: 10 }}>
                      <Form.Item name={s.name} label={s.label}>
                        {displayFormItems(s.name)}
                      </Form.Item>
                    </Col>
                  );
                })}
              </>
            )}
          </Row>
        </Card>
        {!disable ? (
          <Button
            disabled={disable}
            className="saveButton"
            style={{ marginTop: 5 }}
            icon={<SaveOutlined className="saveButtonIcon" />}
            onClick={submitOccurrenceOfOffence}
          >
            Save
          </Button>
        ) : null}
        {isError && displayFromToPriorError()}
        {isCustomError && displayCustomError()}
      </Form>
      {isModalVisible && (
        <GDNumberSearch
          title="Search GD Record"
          isModalVisible={isModalVisible}
          handleOk={handleOk}
          handleCancel={handleCancel}
          formName={GDForm}
          disable={disable}
        />
      )}
    </FirDetailsModuleWrapper>
  );
}
