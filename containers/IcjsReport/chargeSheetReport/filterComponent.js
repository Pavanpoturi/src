import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Row, Space, Form, Select } from "antd";
import { isEmpty } from "lodash";
import firActions from "@redux/fir/actions";
import moment from "moment";
const { Option } = Select;
const { updatePsCode } = firActions;
export default function FilterComponent({
  form,
  setStatus,
  status,
  setPsCode: setPsCodeData,
}) {
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [selectZone, setSelectZone] = useState([]);
  const [selectDivision, setSelectDivision] = useState([]);
  const [selectCircle, setSelectCircle] = useState([]);
  const [selectPSList, setSelectPSList] = useState([]);
  const [filteredZones, setfilteredZones] = useState([]);
  const [selectDropdown, setSelectDropdown] = useState({
    dist_code: "All",
    district_commissionerate: "All",
    sub_zone_code: "All",
    sdpo_code: "All",
    circle_code: "All",
  });
  const dispatch = useDispatch();
  const { dropDownData } = useSelector((state) => state.FIR);
  const getpsCode = dropDownData.map((data) => data?.ps_code).join(",");
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
      setStatus(false);
      setPsCodeData("");
      setPsCodeData(getpsCode);
    }
  };

  useEffect(() => {
    if (status) {
      handleFilter();
    }
  }, [dropDownData, status]);

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
        
      setPsCode(filteredPsCode.join(","));
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
      setPsCodeData("");
      setPsCodeData(psList);
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
      console.warn(filterDefaultData);
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
      setPsCode(filteredPsCode.join(","));
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
      setPsCodeData("");
      setPsCodeData(psList);
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

      console.warn(filterDefaultData);
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
      setPsCode(filteredPsCode.join(","));
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
      setPsCodeData("");
      setPsCodeData(psList);
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

      console.warn(filterDefaultData);
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
      setPsCode(filteredPsCode.join(","));
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

      if (event === "All") {
        form.setFieldsValue({
          ps_name: "All",
        });
      }
      setPsCodeData("");
      setPsCodeData(psList);
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
      setPsCode(filteredPsCode.join(","));
    } else if (!isEmpty(event) && event === "All") {
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
          range: null,
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
      setPsCodeData("");
      setPsCodeData(getpsCode);
      dispatch(updatePsCode(getpsCode));
    } else {
      const codes = selectPSList.map((data) => data.ps_code);
      const filteredData = dropDownData.filter((data) =>
        codes.includes(data.ps_code)
      );
      setSelectPSList(filteredData);
      setPsCode(filteredPsCode.join(","));
    }
  };

  const setPsCode = (data) => {
    setPsCodeData("");
    setPsCodeData(data);
    dispatch(updatePsCode(data));
  };

  return (
    <div>
      <Row>
        <Space size={[20, 20]} wrap>
          <Form.Item name="district">
            <Select
              showSearch
              style={{ width: "150px" }}
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
              {filteredOptions
                .filter((item) => !!item?.district_commissionerate == true)
                ?.map((data) => (
                  <Option
                    key={data?.district_commissionerate}
                    value={data?.district_commissionerate}
                  >
                    {data?.district_commissionerate}
                  </Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item name={"zone"}>
            <Select
              showSearch
              style={{ width: "150px" }}
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
              {selectZone
                .filter((item) => !!item?.sub_zone == true)
                ?.map((data) => (
                  <Option key={data?.sub_zone} value={data?.sub_zone_code}>
                    {data?.sub_zone}
                  </Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item name={"division"}>
            <Select
              showSearch
              style={{ width: "150px" }}
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
              {selectDivision
                .filter((item) => !!item?.sdpo == true)
                ?.map((data) => (
                  <Option key={data?.sdpo} value={data?.sdpo_code}>
                    {data?.sdpo}
                  </Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item name={"circle"}>
            <Select
              showSearch
              style={{ width: "150px" }}
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
              {selectCircle
                .filter((item) => !!item?.circle == true)
                ?.map((data) => (
                  <Option key={data?.circle} value={data?.circle_code}>
                    {data?.circle}
                  </Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item
            name={"ps_name"}
            // rules={[{ required: true, message: "Please enter Ps Name" }]}
          >
            <Select
              showSearch
              style={{ width: "150px" }}
              placeholder={"Select Police Station"}
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
        </Space>
      </Row>
    </div>
  );
}
