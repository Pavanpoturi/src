import moment from "moment";
import { datesDropdownOptions } from "./const";

export const getDatesDropdownOptions = (formatString) => {
  const options = [];
  const now = moment();
  for (let option of datesDropdownOptions) {
    let from, to;
    switch (option?.value) {
      case "today":
        from = now.clone().startOf("day"); // today
        to = now.clone(); // now
        break;
      case "yesterday":
        from = now.clone().subtract(1, "days").startOf("day"); // yesterday
        to = now.clone().subtract(1, "days").endOf("day"); // today
        break;
      case "currentWeek":
        from = now.clone().startOf("week"); // first of this week
        to = now.clone(); // now
        break;
      case "lastWeek":
        from = now.clone().subtract(1, "weeks").startOf("week"); // first of last week
        to = now.clone().subtract(1, "weeks").endOf("week"); // last of last week
        break;
      case "currentMonth":
        from = now.clone().startOf("month"); // first of this month
        to = now.clone(); // now
        break;

      case "previousMonth":
        from = now.clone().subtract(1, "months").startOf("month"); // first of last month
        to = now.clone().subtract(1, "months").endOf("month"); // last of last month
        break;
      case "currentYear":
        from = now.clone().startOf("year"); // first of this year
        to = now.clone(); // now
        break;
      case "tillDate":
        from = moment("01-01-2001", "DD-MM-YYYY");
        to = now.clone(); // now
        break;
      case "datedBetween":
        from = null;
        to = null;
        break;

      default:
        from = now.clone();
        to = now.clone();
        break;
    }
    const date = {
      from: from ? from.format(formatString) : null,
      to: to ? to.format(formatString) : null,
    };
    options.push({ ...option, date });
  }
  return options;
};
