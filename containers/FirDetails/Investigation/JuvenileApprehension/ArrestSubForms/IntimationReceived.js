import { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Col, Input, Form, Card, Row, DatePicker } from "antd";
import { isEmpty, isArray, isUndefined } from "lodash";
import { loadState } from "@lib/helpers/localStorage";
import { textFieldRules } from "@components/Common/formOptions";
import { setRules } from "@components/Common/helperMethods";
import { DATE_FORMAT } from "@containers/FirDetails/fir-util";
import masterDataActions from "@redux/masterData/actions";
import reportsActions from "@redux/reports/actions";
import Loader from "@components/utility/loader";
import { config } from "@config/site.config";
import { arrestForms } from "../const";

export default function IntimationReceived(props) {
  const { renderFieldsWithDropDown, disabled, checkFields, form } = props;

  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedPS, setSelectedPS] = useState("");

  const selectedFir = loadState("selectedFir");
  const { courtsFromPSList, jailsNameList, staffList, isFetching } =
    useSelector((state) => state.MasterData);

  const { psDetails } = useSelector((state) => state.Reports);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(reportsActions.fetchPsDetails(`${config.getTsHierarchyList}`));
  }, []);

  useEffect(() => {
    if (!isEmpty(selectedPS)) {
      const { _id: psCode } = psList.find((ps) => ps?.label === selectedPS);
      if (!isUndefined(psCode)) {
        dispatch(
          masterDataActions.getStaffList(
            `${config.getSupportStaffFromHrms}?policestationcode=${psCode}`
          )
        );
      }
    }
  }, [selectedPS]);

  useEffect(() => {
    // Fix: In view mode showing PS code instead of name of PS
    const selectedDistrict_ = form.getFieldValue("unitOrDistrict");
    const district_ = districtList.find(
      (district) => district?._id === selectedDistrict_
    );
    if (!isUndefined(district_?.label)) {
      setSelectedDistrict(district_?.label);
    }
  }, [form.getFieldValue("unitOrDistrict")]);

  const [districtList, psMap] = useMemo(() => {
    if (isArray(psDetails) && !isEmpty(psDetails)) {
      // Categorizing ps based on district/commissionerate
      const districtListMap = { other: { label: "Other", _id: "123" } },
        psMap = {};
      psDetails.forEach((ps) => {
        const { district_commissionerate, dist_code, ps_code, ps_name } = ps;

        const uniqKey = district_commissionerate; // uniqKey is used to Categorize

        if (isUndefined(districtListMap[uniqKey])) {
          //found new uniq key
          districtListMap[uniqKey] = {
            label: district_commissionerate,
            _id: dist_code,
          };
          psMap[uniqKey] = [{ label: ps_name, _id: ps_code }];
        } else {
          psMap[uniqKey].push({ label: ps_name, _id: ps_code });
        }
      });
      return [Object.values(districtListMap), psMap];
    }
    return [[], {}];
  }, [psDetails]);

  const psList = useMemo(() => {
    if (!isUndefined(psMap[selectedDistrict])) {
      return psMap[selectedDistrict];
    }
    return [];
  }, [selectedDistrict, psMap]);

  const ioList = useMemo(() => {
    if (isArray(staffList) && !isEmpty(staffList)) {
      return staffList.map((staff) => ({ label: staff?.employeeName }));
    }
    return [];
  }, [staffList]);

  const courtNames =
    courtsFromPSList &&
    isArray(courtsFromPSList) &&
    !isEmpty(courtsFromPSList) &&
    courtsFromPSList.map(({ court }) => ({ label: court }));

  const onDistrictChange = useCallback((district) => {
    setSelectedDistrict(district);
    form.setFieldsValue({
      otherPsName: "",
      arrestedByOtherPsIoName: "",
    });
  }, []);

  const onPSChange = useCallback((ps) => {
    setSelectedPS(ps);
    form.setFieldsValue({ arrestedByOtherPsIoName: "" });
  }, []);

  const displayFormItemsByName = (name, width) => {
    switch (name) {
      case "psCrimeConfessed":
        return renderFieldsWithDropDown([], null, width, false, disabled);
      case "intimationReceivedDate":
        return (
          <DatePicker
            format={DATE_FORMAT}
            onChange={checkFields}
            style={{ width: width }}
            disabledDate={disabled}
            disabled={disabled}
          />
        );
      case "dateOfPTWarrantRequisition":
        return (
          <DatePicker
            format={DATE_FORMAT}
            onChange={checkFields}
            style={{ width: width }}
            disabledDate={disabled}
            disabled={disabled}
          />
        );
      case "courtName":
        return renderFieldsWithDropDown(
          courtNames,
          null,
          width,
          false,
          disabled
        );
      case "jailName":
        return renderFieldsWithDropDown(
          jailsNameList,
          null,
          width,
          false,
          disabled
        );
      case "sectionOfLaw":
        return (
          <span style={{ fontWeight: 500 }}>{selectedFir?.section || ""}</span>
        );
      case "unitOrDistrict":
        return renderFieldsWithDropDown(
          districtList,
          onDistrictChange,
          width,
          true,
          disabled
        );
      case "otherPsName":
        if (selectedDistrict === "Other")
          return (
            <Input
              onChange={checkFields}
              style={{ width: width }}
              maxLength={textFieldRules.maxLength}
              disabled={disabled}
            />
          );
        return renderFieldsWithDropDown(
          psList,
          onPSChange,
          width,
          true,
          disabled
        );
      case "arrestedByOtherPsIoName":
        if (selectedDistrict === "Other")
          return (
            <Input
              onChange={checkFields}
              style={{ width: width }}
              maxLength={textFieldRules.maxLength}
              disabled={disabled}
            />
          );
        return renderFieldsWithDropDown(ioList, null, width, false, disabled);
      default:
        return (
          <Input
            onChange={checkFields}
            style={{ width: width }}
            maxLength={textFieldRules.maxLength}
            disabled={disabled}
          />
        );
    }
  };

  return (
    <Card className="widgetPageStyle" style={{ marginTop: 20 }}>
      {isFetching && <Loader />}
      <Row glutter={24}>
        {arrestForms.intimationReceived.map((s, i) => {
          const isLabel = [
            "Other PS Name",
            "Date of PT Warrant Requisition",
            "Unit/District",
          ].includes(s.label);

          return (
            <Col span={8} key={i} style={{ marginBottom: 10 }}>
              <Form.Item
                name={s.name}
                label={s.label}
                rules={(setRules(s.type), [{ required: isLabel }])}
                style={{ paddingRight: 10 }}
              >
                {displayFormItemsByName(s.name, 230)}
              </Form.Item>
            </Col>
          );
        })}
      </Row>
    </Card>
  );
}
