import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Row, Col, notification, Select, DatePicker } from "antd";
import {
  isEmpty,
  isString,
  isFunction,
  isPlainObject,
  isUndefined,
} from "lodash";
import moment from "moment";
import { config } from "@config/site.config";
import { loadStringState, loadState } from "@lib/helpers/localStorage";
import { RangePickerWithXDaysLimit } from "@components/Common/helperMethods";
import firActions from "@redux/fir/actions";
import { DATE_YY_MM_DD } from "@containers/FirDetails/fir-util";
import { downloadXlButtons } from "../../Reports/DSRReports/ContentHeader";
import reportsActions from "@redux/reports/actions";
import { getDatesDropdownOptions } from "./util";

export default function SimpleFilter({
  onFilterChange = null,
  urlBuilder = null, // use if default format doesn't meet your requirement
  baseUrl = null,
  dateFormat = DATE_YY_MM_DD,
}) {
  const [isRangePickerDisabled, setIsRangePickerDisabled] = useState(true);
  const dispatch = useDispatch();
  const { downloadReports } = reportsActions;
  const { selectedDashboard } = useSelector((state) => state.Dashboard);
  const { currentUser } = useSelector((state) => state.Auth);
  const { betweenDates, updatedPsCode, dropDownData, selectedWidgetStatus } =
    useSelector((state) => state.FIR);
  const selectedCaseStatus = loadStringState("selectedCaseStatus");
  const disposal_Type = loadStringState("disposalType");
  const storedUser = loadState("currentUser");
  const getpsCode = dropDownData.map((data) => data?.ps_code).join(",");
  const activeUser = currentUser.employee_name ? currentUser : storedUser;
  const psData =
    isEmpty(updatedPsCode) || isUndefined(updatedPsCode)
      ? getpsCode
      : updatedPsCode;

  useEffect(() => {
    dispatch(firActions.getbetweenDates({}));
  }, []);

  const openNotificationWithIcon = (type, message) => {
    return notification[type]({
      message: message,
    });
  };

  const downloadAsXls = async () => {
    const firType = selectedCaseStatus === "Zero FIRs" ? "Zero" : "Regular";
    const fromDate = !isEmpty(betweenDates?.fromDate)
      ? betweenDates?.fromDate
      : "";
    const toDate = !isEmpty(betweenDates?.toDate) ? betweenDates?.toDate : "";
    if (
      !isEmpty(selectedDashboard) &&
      selectedDashboard === "myPersonalInvestigation"
    ) {
      let url = `${
        config.RecentFirListDownloadToExcel
      }?isDraft=${false}&firType=${firType}&psCode=${
        activeUser?.cctns_working_unit_id
      }&caseStatus=${selectedCaseStatus}&fromDate=${fromDate}&toDate=${toDate}&userName=${
        activeUser?.pao_code
      }&caseType=${"police_disposal"}`;

      if (
        selectedCaseStatus === "Disposal" &&
        disposal_Type === "court_disposal"
      ) {
        url = `${
          config.RecentFirListDownloadToExcel
        }?isDraft=${false}&firType=${firType}&psCode=${
          activeUser?.cctns_working_unit_id
        }&caseStatus=${selectedCaseStatus}&fromDate=${fromDate}&toDate=${toDate}&userName=${
          activeUser?.pao_code
        }&caseType=${disposal_Type}`;
      }
      dispatch(downloadReports(url, "My_Personal_Investigation"));
    } else if (
      !isEmpty(selectedDashboard) &&
      selectedDashboard === "advisory-and-ack"
    ) {
      const pao_code = activeUser?.pao_code;
      const ecopsv2_role = activeUser?.ecopsv2_role;
      const ecopsv2_hierarchy_key = activeUser?.ecopsv2_hierarchy_key;
      const ecopsv2_unit_id = activeUser?.ecopsv2_unit_id;
      const ecopsv2_hierarchy_role = activeUser?.ecopsv2_hierarchy_role;
      const emp_role_name = activeUser?.emp_role_name;

      const url = `${config.DownloadToExcelAdvisoryAndTransferOfCase}?pao_code=${pao_code}&ecopsv2_role=${ecopsv2_role}&ecopsv2_hierarchy_key=${ecopsv2_hierarchy_key}&ecopsv2_unit_id=${ecopsv2_unit_id}&ecopsv2_hierarchy_role=${ecopsv2_hierarchy_role}&fromDate=${fromDate}&toDate=${toDate}&psCode=${ecopsv2_unit_id}&emp_role_name=${emp_role_name}&userName=${pao_code}&rank=${ecopsv2_hierarchy_role}&higherOfficer=true`;
      dispatch(downloadReports(url, "Advisory_Acknowledgement_Cases"));
    }
  };

  useEffect(() => {
    if (isFunction(onFilterChange)) {
      const paramsObj = { ...betweenDates };
      if (isPlainObject(baseUrl)) Object.assign(paramsObj, baseUrl);

      let url;
      if (isFunction(urlBuilder)) url = urlBuilder(paramsObj);
      else url = new URLSearchParams(paramsObj).toString();

      if (!isEmpty(baseUrl) && isString(baseUrl)) url = baseUrl + url;

      onFilterChange(url);
    }
  }, [betweenDates]);

  const onRangeChange = useCallback(
    (dates = []) => {
      const [from = null, to = null] = dates;
      const fromDate = !isEmpty(from) ? from.format(dateFormat) : "";
      const toDate = !isEmpty(to)
        ? to.format(dateFormat)
        : moment().format(dateFormat);
      dispatch(firActions.getbetweenDates({ fromDate, toDate }));
    },
    [dateFormat]
  );

  const datesDropdownOptions = useMemo(
    () => getDatesDropdownOptions(dateFormat),
    []
  );

  const onDatesDropdownChange = useCallback((_value, option) => {
    const { from = null, to = null } = option?.date;
    if (isEmpty(from) && isEmpty(to)) setIsRangePickerDisabled(false);
    else {
      dispatch(firActions.getbetweenDates({ fromDate: from, toDate: to }));
      setIsRangePickerDisabled(true);
    }
  }, []);

  const rangePickerValue = useMemo(
    () => [
      betweenDates?.fromDate ? moment(betweenDates?.fromDate) : null,
      betweenDates?.toDate ? moment(betweenDates?.toDate) : null,
    ],
    [betweenDates]
  );

  return (
    <Row gutter={24} justify="center" align="middle">
      <Col span={4}>
        <Select
          onChange={onDatesDropdownChange}
          options={datesDropdownOptions}
          placeholder={"Between Dates"}
          style={{ width: "100%" }}
        />
      </Col>
      <Col span={6}>
        <DatePicker.RangePicker
          onChange={onRangeChange}
          placeholder={["From", "To"]}
          disabled={isRangePickerDisabled}
          value={rangePickerValue}
        />
      </Col>
      <Col span={4} offset={4}>
        {downloadXlButtons(false, downloadAsXls)}
      </Col>
    </Row>
  );
}
