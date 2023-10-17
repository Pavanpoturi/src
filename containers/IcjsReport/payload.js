import { loadState } from "@lib/helpers/localStorage";
import moment from "moment";
import { DATE_FORMAT } from "@containers/FirDetails/fir-util";
export const addPayload = (fromdate, todate, pscodes, search, type) => {
  const currentUser = loadState("currentUser");
  const result = {
    fromdate: !!fromdate ? moment(new Date(fromdate)).format(DATE_FORMAT) : "",
    todate: !!todate ? moment(new Date(todate)).format(DATE_FORMAT) : "",
    pscodes: !!pscodes ? pscodes : "",
    search: !!search ? search : "",
  };
  if (!!type) {
    Object.assign(result, { type: type });
  }
  if (pscodes === "All") {
    Object.assign(result, {
      ecopsv2_hierarchy_key: currentUser.ecopsv2_hierarchy_key,
      ecopsv2_unit_id: currentUser.ecopsv2_unit_id,
    });
  }
  return result;
};
