import { useCallback, useState } from "react";
import { DatePicker, Typography } from "antd";
import moment from "moment";
import { isArray, isNull } from "lodash";
import { loadState } from "@lib/helpers/localStorage";
import { textFieldRules, textAreaRules } from "@components/Common/formOptions";
import { DATE_FORMAT } from "@containers/FirDetails/fir-util";

const { RangePicker } = DatePicker;
const { Text } = Typography;

export const disableFuturePastFIRDates = (current) => {
  const selectedFir = loadState("selectedFir");
  return (
    current.isBefore(selectedFir?.occurenceOfOffence?.firDate, "day") ||
    current.isAfter(moment(), "day")
  );
};

export const setRules = (type) => {
  switch (type) {
    case "textarea":
      return [textAreaRules.textAreaMaxLength];
    case "text":
      return [textFieldRules.textFieldMaxLength];
    case "number":
      return [textFieldRules.textFieldMaxLength];
    case "number-short":
      return [{ max: 3, message: "Max limit is 3 characters" }];
    default:
      return [];
  }
};

export const disableFutureDates = (current) => {
  return current && current.valueOf() > Date.now();
};

export const disablePastDates = (current) => {
  return current && current.valueOf() < Date.now();
};

export const disableFuturePastDates = (current) => {
  return (
    current &&
    (current.valueOf() < moment().subtract(1, "day") ||
      current.valueOf() > Date.now())
  );
};

const range = (start, end) => {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
};

export const disableFutureTime = (date) => {
  const d = new Date();
  return {
    disabledHours: () =>
      date && date.date() === d.getDate() ? range(d.getHours() + 1, 24) : [],

    disabledMinutes: () =>
      date && date.date() === d.getDate() && date.hours() === d.getHours()
        ? range(d.getMinutes() + 1, 60)
        : [],

    disabledSeconds: () =>
      date &&
      date.date() === d.getDate() &&
      date.hours() === d.getHours() &&
      date.minute() === d.getMinutes()
        ? range(d.getSeconds() + 1, 60)
        : [],
  };
};

export const disablePastDatesFrom = (current, date) => {
  if (date?.valueOf()) {
    return current && current.valueOf() < date.valueOf();
  }
  return false;
};

export const RangePickerWithXDaysLimit = ({
  Xdays = 10,
  onChange: parentOnChange = null,
  defaultValue = [null, null],
  showTime = false,
  format = DATE_FORMAT,
  allowFutureDates = false,
  ...restProps
}) => {
  const [range, setRange] = useState(defaultValue);
  const [tempRange, setTempRange] = useState([null, null]);
  const [isOpened, setIsOpened] = useState(false);

  const disabledDateCore = useCallback(
    (currentDate) => {
      const [from = null, to = null] = tempRange;
      if (!isNull(from)) {
        // From date is selected
        const to_ = moment(from).startOf("date").add(Xdays, "day");
        return currentDate.isAfter(to_);
      }
      if (!isNull(to)) {
        //To date is selected
        const from_ = moment(to).startOf("date").subtract(Xdays, "day");
        return currentDate.isBefore(from_);
      }
      // Nothing is selected
      return false;
    },
    [Xdays, tempRange]
  );

  const disabledDate = useCallback(
    (currentDate) => {
      if (allowFutureDates) return disabledDateCore(currentDate);
      if (currentDate.isBefore(moment().endOf("date")))
        return disabledDateCore(currentDate);
      return true;
    },
    [allowFutureDates, disabledDateCore]
  );

  const onChange = useCallback(async (range, rangeStrings) => {
    range = isArray(range) ? range : [null, null];
    setRange(range);
    if (parentOnChange) {
      parentOnChange(range, rangeStrings);
    }
  }, []);

  const onCalendarChange = useCallback((range) => {
    setTempRange(isArray(range) ? range : [null, null]);
  }, []);

  const onOpenChange = useCallback((isOpened) => {
    setTempRange([null, null]);
    setIsOpened(isOpened);
  }, []);

  const footer = useCallback(
    () => (
      <center>
        <Text type="warning">Maximum Range Of {Xdays} Days Is Allowed</Text>
      </center>
    ),
    [Xdays]
  );

  return (
    <RangePicker
      showTime={showTime}
      disabledDate={disabledDate}
      format={format}
      value={isOpened ? tempRange : range}
      renderExtraFooter={footer}
      onCalendarChange={onCalendarChange}
      onChange={onChange}
      onOpenChange={onOpenChange}
      {...restProps}
    />
  );
};
