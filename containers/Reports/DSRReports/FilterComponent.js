import { useEffect, useState, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Row, Col, Form, Select, notification, Button, DatePicker } from "antd";
import moment from "moment";
import { isEmpty, isUndefined, isPlainObject } from "lodash";
import { loadState, loadStringState } from "@lib/helpers/localStorage";
import { getDatesDropdownOptions } from "@containers/HigherOfficerModule/SharedComponents/util";
import { dropdownOptins } from "../../HigherOfficerModule/const";
import firActions from "@redux/fir/actions";
import config from "../../../config/site.config";
import {
  IS_IO,
  IS_SHO,
  DATE_FORMAT_MM,
  DATE_YY_MM_DD,
  IS_INVESTIGATION_OFFICER,
} from "@containers/FirDetails/fir-util";
import dashboardActions from "@redux/dashboard/actions";
import { downloadXlButtons } from "../../Reports/DSRReports/ContentHeader";
import reportsActions from "@redux/reports/actions";

const { Option } = Select;
const {
  updatePsCode,
  fetchHigherFIRList,
  getbetweenDates,
  getGraveList,
  getGraveCrimeCount,
  fetchFIRList,
} = firActions;
const { fetchCaseCountList, isPersnolizedView } = dashboardActions;

export default function FilterComponent(props) {
  const [form] = Form.useForm();
  const { downloadReports } = reportsActions;
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [selectZone, setSelectZone] = useState([]);
  const [selectDivision, setSelectDivision] = useState([]);
  const [selectCircle, setSelectCircle] = useState([]);
  const [selectPSList, setSelectPSList] = useState([]);
  const [filteredZones, setfilteredZones] = useState([]);
  const [isDateFilterDisable, setIsDateFilterDisable] = useState(true);
  const [selectDropdown, setSelectDropdown] = useState({
    dist_code: "All",
    district_commissionerate: "All",
    sub_zone_code: "All",
    sdpo_code: "All",
    circle_code: "All",
  });
  const today = moment();
  const [selectDate, setSelectDate] = useState({
    fromDate: "",
    toDate: today.format(DATE_FORMAT_MM),
  });

  const dispatch = useDispatch();
  const { selectedDashboard } = useSelector((state) => state.Dashboard);
  const { dropDownData, updatedPsCode, betweenDates, selectedWidgetStatus } =
    useSelector((state) => state.FIR);
  const { currentUser } = useSelector((state) => state.Auth);
  const disposal_Type = loadStringState("disposalType");
  const caseStatus = localStorage.getItem("selectedCaseStatus");
  const storedUser = loadState("currentUser");
  const activeUser = currentUser.employee_name ? currentUser : storedUser;
  const userRole = [IS_SHO, IS_IO, IS_INVESTIGATION_OFFICER];
  const IS_HIGHER_SHO_USER = !userRole?.includes(activeUser?.ecopsv2_role);
  const IS_ROLE = activeUser?.emp_role_name_multiple;
  const IS_ROLE_MULTIPLE =
    !isUndefined(activeUser?.emp_role_name_multiple) &&
    IS_ROLE.includes("INVESTIGATION OFFICER") &&
    !IS_ROLE.includes("STATION HOUSE OFFICER (SHO)");
  const isGraveDashbard = selectedDashboard === "grave-crimes";
  const isJurisdictionDashbard = selectedDashboard === "jurisdiction-dashboard";
  const isPersonalizedView = IS_HIGHER_SHO_USER && IS_ROLE_MULTIPLE;
  const getpsCode = dropDownData.map((data) => data?.ps_code).join(",");
  const ps_code = !isUndefined(updatedPsCode) ? updatedPsCode : getpsCode;
  let filteredPsCode = [];

  const handleFilter = () => {
    let district = [];
    let policeStation = [];
    let getsubZone = [];
    let getdivision = [];
    let getcircle = [];

    dropDownData.forEach((item) => {
      const dist = district.some(
        (data) =>
          data.district_commissionerate === item.district_commissionerate
      );
      const subZone = getsubZone.some(
        (data) => data?.sub_zone_code === item?.sub_zone_code
      );
      const division = getdivision.some(
        (data) => data?.sdpo_code === item?.sdpo_code
      );
      const circle = getcircle.some(
        (data) => data?.circle_code === item?.circle_code
      );
      const policestation = policeStation.some(
        (data) => data.ps_code === item.ps_code
      );

      if (!dist) {
        district.push(item);
      }
      setFilteredOptions(district);

      if (!subZone) {
        if (item?.sub_zone_code !== "") getsubZone.push(item);
      }
      setSelectZone(getsubZone);

      if (!division) {
        if (item?.sdpo_code !== "") {
          getdivision.push(item);
        }
      }
      setSelectDivision(getdivision);

      if (!circle) {
        if (item?.circle_code !== "") getcircle.push(item);
      }
      setSelectCircle(getcircle);

      if (!policestation) {
        policeStation.push(item);
      }
      setSelectPSList(policeStation);
    });

    if (getsubZone?.length === 1) {
      form.setFieldsValue({ zone: getsubZone[0].sub_zone });
    }
    if (getdivision?.length === 1) {
      form.setFieldsValue({ division: getdivision[0].sdpo });
    }
    if (getcircle?.length === 1) {
      form.setFieldsValue({ circle: getcircle[0].circle });
    }

    if (district?.length === 1) {
      setSelectDropdown((prevState) => ({
        ...prevState,
        district_commissionerate: district[0].district_commissionerate,
        dist_code: district[0].dist_code,
      }));
      let zones = [];
      const filteredData = dropDownData.filter(
        (item) =>
          item?.district_commissionerate ===
          district[0].district_commissionerate
      );
      filteredData.map((item) => {
        filteredPsCode.push(item?.ps_code);
        const isDuplicate = zones.some(
          (zoneItem) => zoneItem.sub_zone === item.sub_zone
        );
        if (!isDuplicate) {
          if (item?.sub_zone !== "") zones.push(item);
        }
      });
      setSelectZone(zones);
      form.setFieldsValue({ district: district[0].district_commissionerate });

      if (zones?.length === 1) {
        setSelectDropdown((prevState) => ({
          ...prevState,
          district_commissionerate: district[0].district_commissionerate,
          sub_zone_code: zones[0].sub_zone_code,
        }));
        let sdpo = [];
        const filteredData = dropDownData.filter(
          (item) => item?.sub_zone_code === zones[0].sub_zone_code
        );
        filteredData.map((item) => {
          filteredPsCode.push(item?.ps_code);
          const isDuplicate = sdpo.some(
            (sdpoItem) => sdpoItem.sdpo === item.sdpo
          );
          if (!isDuplicate) {
            if (item?.sdpo !== "") sdpo.push(item);
          }
        });
        setSelectDivision(sdpo);
        form.setFieldsValue({ zone: sdpo[0].sub_zone });

        if (sdpo?.length === 1) {
          setSelectDropdown((prevState) => ({
            ...prevState,
            district_commissionerate: district[0].district_commissionerate,
            sub_zone_code: zones[0].sub_zone_code,
            sdpo_code: sdpo[0].sdpo_code,
          }));
          let circleDataList = [];
          const filteredData = dropDownData.filter(
            (item) => item?.sdpo_code === sdpo[0].sdpo_code
          );
          filteredData.map((item) => {
            filteredPsCode.push(item?.ps_code);
            const isDuplicate = circleDataList.some(
              (data) => data.circle === item.circle
            );
            if (!isDuplicate) {
              if (item?.circle !== "") circleDataList.push(item);
            }
          });
          setSelectCircle(circleDataList);
          form.setFieldsValue({ division: sdpo[0].sdpo });

          if (circleDataList.length === 1) {
            setSelectDropdown((prevState) => ({
              ...prevState,
              district_commissionerate: district[0].district_commissionerate,
              sub_zone_code: zones[0].sub_zone_code,
              sdpo_code: sdpo[0].sdpo_code,
              circle_code: circleDataList[0].circle_code,
            }));
            let policeStation = [];
            const filteredData = dropDownData.filter(
              (item) => item?.circle_code === circleDataList[0].circle_code
            );
            filteredData.map((item) => {
              filteredPsCode.push(item?.ps_code);
              const isDuplicate = policeStation.some(
                (data) => data.ps_name === item.ps_name
              );
              if (!isDuplicate) {
                if (item?.ps_name !== "") policeStation.push(item);
              }
            });

            form.setFieldsValue({ circle: circleDataList[0].circle });
            setSelectPSList(policeStation);
          }
        }
      }
    }
  };

  useEffect(() => {
    dispatch(getbetweenDates({}));
  }, []);

  const setPsCode = (data, fromDate, toDate, type) => {
    var psData = !!data ? data : updatePsCode;
    dispatch(updatePsCode(""));
    dispatch(updatePsCode(psData));
    if (selectedDashboard === "jurisdiction-dashboard") {
      if (!isUndefined(props?.getCaseDetails))
        props.getCaseDetails(localStorage.getItem("selectedCaseStatus"), {
          fromDate,
          toDate,
        });
      const datesParms = getDatesParms({ fromDate, toDate });
      dispatch(
        fetchHigherFIRList(
          `${config.getCaseMetricsByEMail}/?psCode=${
            !!data ? data : updatePsCode
          }&higherOfficer=true${datesParms}`
        )
      );
      dispatch(
        fetchCaseCountList(
          `${config.getCasesCountByYear}/?psCode=${
            !!data ? data : updatePsCode
          }&caseStatus=${localStorage.getItem(
            "selectedCaseStatus"
          )}&isDraft=false`
        )
      );
      dispatch(
        fetchFIRList(
          `${
            config.getRecentFirList
          }/?psCode=${psData}&fromDate=${fromDate}&toDate=${toDate}&caseStatus=${selectedWidgetStatus}&firType=${"Regular"}&page=1&limit=50&isDraft=${false}&higherOfficer=true`
        )
      );
    }

    if (props.isDate !== undefined) {
      let payload = {
        ecopsv2_unit_id: activeUser?.ecopsv2_unit_id,
        ecopsv2_role: activeUser?.ecopsv2_role,
        ecopsv2_hierarchy_key: activeUser?.ecopsv2_hierarchy_key,
        pao_code: activeUser?.pao_code,
        search_ps_code: data,
        counts: true,
        dsr_category_type: true,
        category_type: true,
        from_date: fromDate ? fromDate : "",
        to_date: toDate ? toDate : today.format(DATE_FORMAT_MM),
        graveType: localStorage.getItem("selectedCaseStatus"),
        page: 1,
        limit: 50,
        higherOfficer: true,
      };
      dispatch(getGraveCrimeCount(config?.getGraveCrimeCount, payload));
      dispatch(getGraveList(config?.fetchGravecrimeData, payload));
    }
  };
  useEffect(() => {
    handleFilter();
  }, [dropDownData]);

  const onChangeDistrict = (event) => {
    form.setFieldsValue({
      zone: null,
      division: null,
      circle: null,
      ps_name: null,
    });
    let filteredZonesData = [];
    let zones = [];
    let divisonData = [];
    let circleData = [];
    filteredPsCode = [];
    if (!isEmpty(event) && event !== "All") {
      const filteredData = dropDownData.filter(
        (item) => item?.district_commissionerate === event
      );

      filteredData.map((item) => {
        filteredPsCode.push(item?.ps_code);
        filteredZonesData.push(item);

        const setzoneData = zones.some(
          (zoneItem) =>
            zoneItem.sub_zone_code === item.sub_zone_code &&
            zoneItem.dist_code === item.dist_code
        );

        const setDivisonData = divisonData.some(
          (zoneItem) => zoneItem.sdpo === item?.sdpo
        );

        const setCircleData = circleData.some(
          (zoneItem) => zoneItem.circle === item?.circle
        );

        if (!setzoneData) {
          if (item?.sub_zone_code !== "") zones.push(item);
        }

        if (!setDivisonData) {
          if (item?.sdpo !== "") divisonData.push(item);
        }

        if (!setCircleData) {
          if (item?.circle !== "") circleData.push(item);
        }
        setSelectZone(zones);
        setSelectDivision(divisonData);
        setSelectCircle(circleData);
        setSelectPSList(filteredZonesData);
        setSelectDropdown((prevState) => ({
          ...prevState,
          district_commissionerate: event,
          dist_code: item.dist_code,
        }));
      });
      const setpslist = !isEmpty(filteredZonesData)
        ? filteredZonesData
        : dropDownData;
      setPsCode(
        filteredPsCode.join(","),
        selectDate.fromDate,
        selectDate.toDate
      );
      setfilteredZones(setpslist);
    } else {
      var psList = dropDownData.map((item) => item.ps_code).join(",");
      dropDownData.map((item) => {
        filteredZonesData.push(item);
        const setzoneData = zones.some(
          (zoneItem) =>
            zoneItem.sub_zone_code === item.sub_zone_code &&
            zoneItem.dist_code === item.dist_code
        );

        const setDivisonData = divisonData.some(
          (zoneItem) => zoneItem.sdpo === item?.sdpo
        );

        const setCircleData = circleData.some(
          (zoneItem) => zoneItem.circle === item?.circle
        );

        if (!setzoneData) {
          if (item?.sub_zone_code !== "") zones.push(item);
        }

        if (!setDivisonData) {
          if (item?.sdpo !== "") divisonData.push(item);
        }

        if (!setCircleData) {
          if (item?.circle !== "") circleData.push(item);
        }
      });
      if (props.isDate !== undefined) {
        setPsCode(psList, selectDate.fromDate, selectDate.toDate);
      }
      dispatch(updatePsCode(psList));
      if (event === "All") {
        form.setFieldsValue({
          zone: "All",
          division: "All",
          circle: "All",
          ps_name: "All",
        });
      }
      setSelectZone(zones);
      setSelectDivision(divisonData);
      setSelectCircle(circleData);
      setSelectPSList(filteredZonesData);
    }
  };

  const onChangeZone = (event) => {
    form.setFieldsValue({
      division: null,
      circle: null,
      ps_name: null,
    });
    let zones = [];
    let sdpo = [];
    let circleData = [];
    filteredPsCode = [];
    if (!isEmpty(event) && event !== "All") {
      const filterDataList = !isEmpty(filteredZones)
        ? filteredZones
        : dropDownData;
      const filteredData = filterDataList.filter(
        (item) => item?.sub_zone_code === event
      );
      form.setFieldsValue({
        district: filteredData[0].district_commissionerate,
      });

      const getDefaultData = [...dropDownData];

      const filterDefaultData = getDefaultData.filter((item) =>
        filteredData[0].district_commissionerate.includes(
          item["district_commissionerate"]
        )
      );
      filterDefaultData.map((item) => {
        const setZoneData = zones.some(
          (data) => data.sub_zone_code === item.sub_zone_code
        );
        if (!setZoneData) {
          if (item?.sub_zone_code !== "") zones.push(item);
        }
      });

      filteredData.map((item) => {
        filteredPsCode.push(item?.ps_code);
        const setDivisonData = sdpo.some(
          (sdpoItem) => sdpoItem.sdpo_code === item.sdpo_code
        );
        const setCircleData = circleData.some(
          (zoneItem) => zoneItem.circle === item?.circle
        );

        if (!setDivisonData) {
          if (item?.sdpo !== "") sdpo.push(item);
        }

        if (!setCircleData) {
          if (item?.circle !== "") circleData.push(item);
        }
      });
      setSelectDropdown((prevState) => ({
        ...prevState,
        sub_zone_code: event,
        district_commissionerate: filteredData[0].district_commissionerate,
      }));
      setSelectZone(zones);
      setSelectDivision(sdpo);
      setSelectCircle(circleData);
      setSelectPSList(filteredData);
      setPsCode(
        filteredPsCode.join(","),
        selectDate.fromDate,
        selectDate.toDate
      );
    } else {
      let psList;
      const filteredData = dropDownData.filter(
        (item) =>
          item?.district_commissionerate ===
          selectDropdown?.district_commissionerate
      );

      if (!isEmpty(filteredData)) {
        psList = filteredData.map((item) => item.ps_code).join(",");
      } else {
        psList = dropDownData.map((item) => item.ps_code).join(",");
      }

      const setpslist = !isEmpty(filteredData) ? filteredData : dropDownData;

      setpslist.map((item) => {
        filteredPsCode.push(item);

        const setDivisonData = sdpo.some(
          (sdpoItem) => sdpoItem.sdpo_code === item.sdpo_code
        );

        const setCircleData = circleData.some(
          (zoneItem) => zoneItem.circle === item?.circle
        );

        if (!setDivisonData) {
          if (item?.sdpo !== "") sdpo.push(item);
        }

        if (!setCircleData) {
          if (item?.circle !== "") circleData.push(item);
        }
      });

      if (props.isDate !== undefined) {
        setPsCode(psList, selectDate.fromDate, selectDate.toDate);
      }

      if (event === "All") {
        form.setFieldsValue({
          division: "All",
          circle: "All",
          ps_name: "All",
        });
      }
      setSelectDivision(sdpo);
      setSelectCircle(circleData);
      setSelectPSList(filteredPsCode);
      dispatch(updatePsCode(psList));
    }
  };

  const onChangeDivision = (event) => {
    form.setFieldsValue({ circle: null, ps_name: null });
    filteredPsCode = [];
    let zones = [];
    let circle = [];
    let sdpo = [];
    if (!isEmpty(event) && event !== "All") {
      const filteredData = dropDownData.filter(
        (item) => item?.sdpo_code === event
      );

      form.setFieldsValue({
        district: filteredData[0].district_commissionerate,
      });
      form.setFieldsValue({ zone: filteredData[0].sub_zone });

      const getDefaultData = [...dropDownData];

      const filterDefaultData = getDefaultData.filter((item) =>
        filteredData[0].district_commissionerate.includes(
          item["district_commissionerate"]
        )
      );

      filterDefaultData.map((item) => {
        const setzoneData = zones.some(
          (zoneItem) =>
            zoneItem.sub_zone_code === item.sub_zone_code &&
            zoneItem.dist_code === item.dist_code
        );

        if (!setzoneData) {
          if (item?.sub_zone_code !== "") zones.push(item);
        }
        const setDivisonData = sdpo.some(
          (sdpoItem) => sdpoItem.sdpo_code === item.sdpo_code
        );
        if (!setDivisonData) {
          if (item?.sdpo !== "") sdpo.push(item);
        }
      });

      filteredData.map((item) => {
        filteredPsCode.push(item?.ps_code);

        const setCircleData = circle.some(
          (data) => data.circle === item.circle
        );

        if (!setCircleData) {
          if (item?.circle !== "") circle.push(item);
        }
      });
      setSelectZone(zones);
      setSelectDivision(sdpo);
      setSelectCircle(circle);
      setSelectPSList(filteredData);
      setSelectDropdown((prevState) => ({
        ...prevState,
        sdpo_code: event,
        district_commissionerate: filteredData[0].district_commissionerate,
        sub_zone_code: filteredData[0].sub_zone_code,
        dist_code: filteredData[0].dist_code,
      }));
      setPsCode(
        filteredPsCode.join(","),
        selectDate.fromDate,
        selectDate.toDate
      );
      form.setFieldsValue({ circle: null, ps_name: null });
    } else {
      let filteredData = [];
      let psList;

      filteredData = dropDownData.filter(
        (item) => item?.sub_zone_code === selectDropdown.sub_zone_code
      );
      if (isEmpty(filteredData)) {
        filteredData = dropDownData.filter(
          (item) =>
            item?.district_commissionerate ===
            selectDropdown.district_commissionerate
        );
      }

      if (!isEmpty(filteredData)) {
        psList = filteredData.map((item) => item.ps_code).join(",");
      } else {
        psList = dropDownData.map((item) => item.ps_code).join(",");
      }
      if (props.isDate !== undefined) {
        setPsCode(psList, selectDate.fromDate, selectDate.toDate);
      }
      const setpslist = !isEmpty(filteredData) ? filteredData : dropDownData;

      setpslist.map((item) => {
        filteredPsCode.push(item);

        const setCircleData = circle.some(
          (data) => data.circle === item.circle
        );

        if (!setCircleData) {
          if (item?.circle !== "") circle.push(item);
        }
      });
      setSelectCircle(circle);
      setSelectPSList(filteredPsCode);
      if (event === "All") {
        form.setFieldsValue({
          circle: "All",
          ps_name: "All",
        });
      }
      dispatch(updatePsCode(psList));
    }
  };

  const onChangeCircle = (event) => {
    form.setFieldsValue({ ps_name: null });
    filteredPsCode = [];
    let zones = [];
    let circle = [];
    let sdpo = [];
    if (!isEmpty(event) && event !== "All") {
      const filteredData = dropDownData.filter(
        (item) => item?.circle_code === event
      );

      form.setFieldsValue({
        district: filteredData[0].district_commissionerate,
      });
      form.setFieldsValue({ zone: filteredData[0].sub_zone });
      form.setFieldsValue({ division: filteredData[0].sdpo });

      const getDefaultData = [...dropDownData];
      const filterDefaultData = getDefaultData.filter((item) =>
        filteredData[0].district_commissionerate.includes(
          item["district_commissionerate"]
        )
      );

      filterDefaultData.map((item) => {
        const setCircleData = circle.some(
          (data) => data.circle === item.circle
        );

        if (!setCircleData) {
          if (item?.circle !== "") circle.push(item);
        }

        const setzoneData = zones.some(
          (zoneItem) =>
            zoneItem.sub_zone_code === item.sub_zone_code &&
            zoneItem.dist_code === item.dist_code
        );

        if (!setzoneData) {
          if (item?.sub_zone_code !== "") zones.push(item);
        }
        const setDivisonData = sdpo.some(
          (sdpoItem) => sdpoItem.sdpo_code === item.sdpo_code
        );
        if (!setDivisonData) {
          if (item?.sdpo !== "") sdpo.push(item);
        }
      });
      filteredData.map((item) => {
        filteredPsCode.push(item?.ps_code);
      });
      if (filteredPsCode.length === 1) {
        form.setFieldsValue({ ps_name: filteredPsCode[0]?.ps_name });
      }
      setSelectZone(zones);
      setSelectDivision(sdpo);
      setSelectCircle(circle);
      setSelectPSList(filteredData);
      setSelectDropdown((prevState) => ({
        ...prevState,
        circle_code: event,
        sdpo_code: filteredData[0].sdpo_code,
        sub_zone_code: filteredData[0].sub_zone_code,
        district_commissionerate: filteredData[0].district_commissionerate,
      }));
      setPsCode(
        filteredPsCode.join(","),
        selectDate.fromDate,
        selectDate.toDate
      );
      form.setFieldsValue({ ps_name: null });
    } else {
      let psList;
      const filteredData = dropDownData.filter(
        (item) => item?.sdpo_code === selectDropdown.sdpo_code
      );

      if (!isEmpty(filteredData)) {
        psList = filteredData.map((item) => item.ps_code).join(",");
      } else {
        psList = dropDownData.map((item) => item.ps_code).join(",");
      }

      const setpslist = !isEmpty(filteredData) ? filteredData : dropDownData;
      setSelectPSList(setpslist);
      if (props.isDate !== undefined) {
        setPsCode(psList, selectDate.fromDate, selectDate.toDate);
      }
      if (event === "All") {
        form.setFieldsValue({
          ps_name: "All",
        });
      }
      dispatch(updatePsCode(psList));
    }
  };

  const onChangePoliceStation = (event, type) => {
    let zones = [];
    let divisonData = [];
    let circleData = [];
    filteredPsCode = [];
    if (!isEmpty(event) && event !== "All") {
      const filteredData = dropDownData.filter(
        (item) => item?.ps_code === event
      );
      form.setFieldsValue({
        district: filteredData[0].district_commissionerate,
      });
      form.setFieldsValue({ zone: filteredData[0].sub_zone });
      form.setFieldsValue({ division: filteredData[0].sdpo });
      form.setFieldsValue({ circle: filteredData[0].circle });
      filteredData.map((item) => {
        filteredPsCode.push(item?.ps_code);
      });
      setPsCode(
        filteredPsCode.join(","),
        selectDate.fromDate,
        selectDate.toDate
      );
    } else if (!isEmpty(event) && event === "All") {
      if (props.isDate !== undefined) {
        if (type === "reset") {
          setPsCode(getpsCode, "", today.format(DATE_FORMAT_MM));
        } else {
          setPsCode(getpsCode, selectDate.fromDate, selectDate.toDate);
        }
      }
      if (event === "All") {
        form.setFieldsValue({
          district: "All",
          zone: "All",
          division: "All",
          circle: "All",
        });
      }

      if (type === "reset") {
        form.setFieldsValue({
          ps_name: "All",
          betweenDates: null,
          range: ["", ""],
        });
      }

      dropDownData.map((item) => {
        const setzoneData = zones.some(
          (zoneItem) => zoneItem.sub_zone_code === item.sub_zone_code
        );

        const setDivisonData = divisonData.some(
          (zoneItem) => zoneItem.sdpo === item?.sdpo
        );

        const setCircleData = circleData.some(
          (zoneItem) => zoneItem.circle === item?.circle
        );

        if (!setzoneData) {
          if (item?.sub_zone_code !== "") zones.push(item);
        }

        if (!setDivisonData) {
          if (item?.sdpo !== "") divisonData.push(item);
        }

        if (!setCircleData) {
          if (item?.circle !== "") circleData.push(item);
        }
        setSelectZone(zones);
        setSelectDivision(divisonData);
        setSelectCircle(circleData);
      });
      setSelectPSList(dropDownData);
      dispatch(updatePsCode(getpsCode));
    } else {
      const codes = selectPSList.map((data) => data.ps_code);
      const filteredData = dropDownData.filter((data) =>
        codes.includes(data.ps_code)
      );
      setSelectPSList(filteredData);
      setPsCode(
        filteredPsCode.join(","),
        selectDate.fromDate,
        selectDate.toDate
      );
    }
  };

  const getDatesParms = (dates = null) => {
    dates = !isEmpty(dates) && isPlainObject(dates) ? dates : betweenDates;

    const { fromDate = null, toDate = null } =
      !isEmpty(dates) && isPlainObject(dates) ? dates : {};

    return (!isEmpty(fromDate) || fromDate === "") && !isEmpty(toDate)
      ? `&fromDate=${fromDate}&toDate=${toDate}`
      : "";
  };

  const handleDateFilter = (dates = []) => {
    const formatString = isGraveDashbard ? DATE_FORMAT_MM : DATE_YY_MM_DD;

    const [from = null, to = null] = dates;
    const fromDate = !isEmpty(from) ? from.format(formatString) : "";
    const toDate = !isEmpty(to)
      ? to.format(formatString)
      : today.format(formatString);

    setSelectDate({ fromDate, toDate });
    dispatch(getbetweenDates({ fromDate, toDate }));
    if (!isUndefined(props?.isDate)) props?.isDate({ fromDate, toDate });
    setPsCode(ps_code, fromDate, toDate, "psCode");
  };

  const handelBetweenDates = (e) => {
    const setBetweenDates = {};
    const value = e;
    if (isUndefined(e)) {
      dispatch(
        getbetweenDates({
          fromDate: "",
          toDate: today.format(DATE_FORMAT_MM),
        })
      );
    }
    switch (value) {
      case "today":
        setBetweenDates.fromDate = getFormattedDate(new Date());
        setBetweenDates.toDate = getFormattedDate(new Date());
        setSelectDate({
          fromDate: getFormattedDate(new Date()),
          toDate: getFormattedDate(new Date()),
        });
        dispatch(
          getbetweenDates({
            fromDate: getFormattedDate(new Date()),
            toDate: getFormattedDate(new Date()),
          })
        );
        setPsCode(
          ps_code,
          getFormattedDate(new Date()),
          getFormattedDate(new Date()),
          "psCode"
        );
        if (!isUndefined(props?.isDate)) {
          props.isDate({
            fromDate: getFormattedDate(new Date()),
            toDate: getFormattedDate(new Date()),
          });
        }
        setIsDateFilterDisable(true);
        break;
      case "yesterday":
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        setBetweenDates.fromDate = getFormattedDate(yesterday);
        setBetweenDates.toDate = getFormattedDate(new Date());
        setSelectDate({
          fromDate: getFormattedDate(yesterday),
          toDate: getFormattedDate(new Date()),
        });
        dispatch(
          getbetweenDates({
            fromDate: getFormattedDate(yesterday),
            toDate: getFormattedDate(new Date()),
          })
        );
        if (!isUndefined(props?.isDate)) {
          props.isDate({
            fromDate: getFormattedDate(yesterday),
            toDate: getFormattedDate(new Date()),
          });
        }
        setPsCode(
          ps_code,
          getFormattedDate(yesterday),
          getFormattedDate(new Date()),
          "psCode"
        );
        setIsDateFilterDisable(true);
        break;
      case "lastWeek":
        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);
        setBetweenDates.fromDate = getFormattedDate(lastWeek);
        setBetweenDates.toDate = getFormattedDate(new Date());
        setSelectDate({
          fromDate: getFormattedDate(lastWeek),
          toDate: getFormattedDate(new Date()),
        });
        dispatch(
          getbetweenDates({
            fromDate: getFormattedDate(lastWeek),
            toDate: getFormattedDate(new Date()),
          })
        );
        if (!isUndefined(props?.isDate)) {
          props.isDate({
            fromDate: getFormattedDate(lastWeek),
            toDate: getFormattedDate(new Date()),
          });
        }
        setPsCode(
          ps_code,
          getFormattedDate(lastWeek),
          getFormattedDate(new Date()),
          "psCode"
        );
        setIsDateFilterDisable(true);
        break;
      case "currentMonth":
        const currentMonthStart = new Date();
        currentMonthStart.setDate(1);
        setBetweenDates.fromDate = getFormattedDate(currentMonthStart);
        setBetweenDates.toDate = getFormattedDate(new Date());
        setSelectDate({
          fromDate: getFormattedDate(currentMonthStart),
          toDate: getFormattedDate(new Date()),
        });
        if (!isUndefined(props?.isDate)) {
          props.isDate({
            fromDate: getFormattedDate(currentMonthStart),
            toDate: getFormattedDate(new Date()),
          });
        }
        setPsCode(
          ps_code,
          getFormattedDate(currentMonthStart),
          getFormattedDate(new Date()),
          "psCode"
        );
        setIsDateFilterDisable(true);
        break;
      case "previousMonth":
        const previousMonthStart = new Date();
        previousMonthStart.setMonth(previousMonthStart.getMonth() - 1);
        previousMonthStart.setDate(1);
        setBetweenDates.fromDate = getFormattedDate(previousMonthStart);
        setBetweenDates.toDate = getFormattedDate(new Date());
        setSelectDate({
          fromDate: getFormattedDate(previousMonthStart),
          toDate: getFormattedDate(new Date()),
        });
        if (!isUndefined(props?.isDate)) {
          props.isDate({
            fromDate: getFormattedDate(previousMonthStart),
            toDate: getFormattedDate(new Date()),
          });
        }
        dispatch(
          getbetweenDates({
            fromDate: getFormattedDate(previousMonthStart),
            toDate: getFormattedDate(new Date()),
          })
        );
        setPsCode(
          ps_code,
          getFormattedDate(previousMonthStart),
          getFormattedDate(new Date()),
          "psCode"
        );
        setIsDateFilterDisable(true);
        break;
      case "datedBetween":
        setIsDateFilterDisable(false);
        break;
      default:
        setBetweenDates.fromDate = "";
        setBetweenDates.toDate = today.format(DATE_FORMAT_MM);
        setPsCode(ps_code, "", today.format(DATE_FORMAT_MM), "psCode");
        setSelectDate({
          fromDate: "",
          toDate: today.format(DATE_FORMAT_MM),
        });
        if (!isUndefined(props?.isDate)) {
          props.isDate({
            fromDate: "",
            toDate: today.format(DATE_FORMAT_MM),
          });
        }
        break;
    }
  };

  const datesDropdownOptions = useMemo(
    () => getDatesDropdownOptions(DATE_YY_MM_DD),
    []
  );

  const onDatesDropdownChange = useCallback((_value, option) => {
    const { from = null, to = null } = option?.date;
    if (isEmpty(from) && isEmpty(to)) setIsDateFilterDisable(false);
    else {
      dispatch(getbetweenDates({ fromDate: from, toDate: to }));
      setSelectDate({ fromDate: from, toDate: to });
      setPsCode(ps_code, from, to, "psCode");
      if (!isUndefined(props?.isDate)) {
        props.isDate({ fromDate: from, toDate: to });
      }
      setIsDateFilterDisable(true);
    }
  }, []);

  useEffect(() => {
    form.setFieldsValue({
      range: [
        betweenDates?.fromDate ? moment(betweenDates?.fromDate) : null,
        betweenDates?.toDate ? moment(betweenDates?.toDate) : null,
      ],
    });
  }, [betweenDates]);

  const openNotificationWithIcon = (type, message) => {
    return notification[type]({
      message: message,
    });
  };

  const downloadAsXls = () => {
    const firType = caseStatus === "Zero FIRs" ? "Zero" : "Regular";
    const fromDate = !isEmpty(betweenDates?.fromDate)
      ? betweenDates?.fromDate
      : "";
    const toDate = !isEmpty(betweenDates?.toDate) ? betweenDates?.toDate : "";
    if (
      isEmpty(selectDropdown?.district_commissionerate) ||
      selectDropdown?.district_commissionerate === "All"
    ) {
      openNotificationWithIcon(
        "error",
        "Please Select Particular District to Download XL"
      );
    } else if (
      !isEmpty(selectedDashboard) &&
      selectedDashboard === "jurisdiction-dashboard" &&
      IS_HIGHER_SHO_USER
    ) {
      let url = `${
        config.RecentFirListDownloadToExcel
      }?firType=${firType}&isDraft=${false}&psCode=${ps_code}&caseStatus=${caseStatus}&fromDate=${fromDate}&toDate=${toDate}&higherOfficer=true`;

      if (caseStatus === "Disposal" && disposal_Type === "court_disposal") {
        url = `${
          config.RecentFirListDownloadToExcel
        }?firType=${firType}&isDraft=${false}&psCode=${ps_code}&caseStatus=${caseStatus}&fromDate=${fromDate}&toDate=${toDate}&caseType=${disposal_Type}&higherOfficer=true`;
      }

      dispatch(downloadReports(url, "Jurisdiction_DashBoard_Cases"));
    }
  };

  const getFormattedDate = (date) => {
    let year;
    let month;
    let day;
    if (date) {
      year = date.getFullYear().toString();
      month = (date.getMonth() + 1).toString().padStart(2, "0");
      day = date.getDate().toString().padStart(2, "0");
    }
    return `${month}-${day}-${year}`;
  };

  return (
    <Form form={form}>
      <Row
        gutter={16}
        justify="center"
        align="middle"
        style={{ backgroundColor: "#8CB6D6" }}
      >
        {isGraveDashbard && (
          <Col span={2}>
            <Form.Item name={"betweenDates"}>
              <Select
                allowClear={true}
                placeholder="Between Dates"
                onSelect={handelBetweenDates}
              >
                {dropdownOptins.map((data) => (
                  <Select.Option key={data.value} value={data?.value}>
                    {data?.item}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        )}

        {isJurisdictionDashbard && (
          <Col span={2}>
            <Form.Item name={"betweenDates"}>
              <Select
                onSelect={onDatesDropdownChange}
                options={datesDropdownOptions}
                placeholder={"Between Dates"}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
        )}

        {(isGraveDashbard || isJurisdictionDashbard) && (
          <Col span={4}>
            <Form.Item name={"range"}>
              <DatePicker.RangePicker
                onChange={handleDateFilter}
                placeholder={["From", "To"]}
                disabled={isDateFilterDisable}
              />
            </Form.Item>
          </Col>
        )}

        <Col span={3}>
          <Form.Item name="district">
            <Select
              showSearch
              placeholder={"District"}
              allowClear={true}
              onSelect={(event) => onChangeDistrict(event)}
              filterOption={(input, option) => {
                return (
                  option.key
                    .toString()
                    .toLowerCase()
                    .indexOf(input.toString().toLowerCase()) >= 0 ||
                  option.children
                    .toString()
                    .toLowerCase()
                    .indexOf(input.toString().toLowerCase()) >= 0
                );
              }}
            >
              <Option key="All" value="All">
                All
              </Option>
              {filteredOptions?.map((data) => (
                <Option
                  key={data?.district_commissionerate}
                  value={data?.district_commissionerate}
                >
                  {data?.district_commissionerate}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={3}>
          <Form.Item name={"zone"}>
            <Select
              showSearch
              placeholder={"Zones"}
              allowClear={true}
              onSelect={(event) => onChangeZone(event)}
              filterOption={(input, option) => {
                return (
                  option.key
                    .toString()
                    .toLowerCase()
                    .indexOf(input.toString().toLowerCase()) >= 0 ||
                  option.children
                    .toString()
                    .toLowerCase()
                    .indexOf(input.toString().toLowerCase()) >= 0
                );
              }}
            >
              <Option key="All" value="All">
                All
              </Option>
              {selectZone?.map((data) => (
                <Option key={data?.sub_zone} value={data?.sub_zone_code}>
                  {data?.sub_zone}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={2}>
          <Form.Item name={"division"}>
            <Select
              showSearch
              placeholder={"Division"}
              allowClear={true}
              onSelect={(event) => onChangeDivision(event)}
              filterOption={(input, option) => {
                return (
                  option.key
                    .toString()
                    .toLowerCase()
                    .indexOf(input.toString().toLowerCase()) >= 0 ||
                  option.children
                    .toString()
                    .toLowerCase()
                    .indexOf(input.toString().toLowerCase()) >= 0
                );
              }}
            >
              <Option key="All" value="All">
                All
              </Option>
              {selectDivision?.map((data) => (
                <Option key={data?.sdpo} value={data?.sdpo_code}>
                  {data?.sdpo}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={2}>
          <Form.Item name={"circle"}>
            <Select
              showSearch
              placeholder={"Circle"}
              allowClear={true}
              onSelect={(event) => onChangeCircle(event)}
              filterOption={(input, option) => {
                return (
                  option.key
                    .toString()
                    .toLowerCase()
                    .indexOf(input.toString().toLowerCase()) >= 0 ||
                  option.children
                    .toString()
                    .toLowerCase()
                    .indexOf(input.toString().toLowerCase()) >= 0
                );
              }}
            >
              <Option key="All" value="All">
                All
              </Option>
              {selectCircle?.map((data) => (
                <Option key={data?.circle} value={data?.circle_code}>
                  {data?.circle}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={3}>
          <Form.Item name={"ps_name"}>
            <Select
              showSearch
              placeholder={"Select Police Station"}
              defaultValue="All"
              allowClear={true}
              onSelect={(event) => onChangePoliceStation(event)}
              filterOption={(input, option) => {
                return (
                  option.key
                    .toString()
                    .toLowerCase()
                    .indexOf(input.toString().toLowerCase()) >= 0 ||
                  option.children
                    .toString()
                    .toLowerCase()
                    .indexOf(input.toString().toLowerCase()) >= 0
                );
              }}
            >
              <Option key="All" value="All">
                All
              </Option>
              {selectPSList?.map((data) => (
                <Option key={data?.ps_name} value={data?.ps_code}>
                  {data?.ps_name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        <Col span={2}>
          <Form.Item name={"btn"}>
            <Button
              style={{
                backgroundColor: "#02599C",
                color: "white",
              }}
              onClick={(e) => onChangePoliceStation("All", "reset")}
            >
              Reset
            </Button>
          </Form.Item>
        </Col>
        {isJurisdictionDashbard && caseStatus !== "Total Cases" ? (
          <Col span={3}>{downloadXlButtons(false, downloadAsXls)}</Col>
        ) : null}
      </Row>
    </Form>
  );
}
