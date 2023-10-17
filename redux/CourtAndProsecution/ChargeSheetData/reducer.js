import actions from "./actions";
import Immutable from "seamless-immutable";
import { loadState } from "@lib/helpers/localStorage";

const initialState = Immutable({
  chargeSheetData: {},
  actionType: "",
});

export default function Reducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_CHARGESHEET_DATA:
      const oldData = loadState("selectedCourtAndProsecution");
      const newData = {
        ...oldData,
        courtName: action.payload?.courtName,
        courtCaseNo: action.payload?.courtCaseNo,
        caseType: !!action.payload?.caseType
          ? action.payload?.caseType
          : oldData?.caseType,
      };
      localStorage.setItem(
        "selectedCourtAndProsecution",
        JSON.stringify(newData)
      );
      return Immutable.merge(state, {
        chargeSheetData: {
          courtName: action.payload?.courtName,
          courtCaseNo: action.payload?.courtCaseNo,
          caseType: action.payload?.caseType,
        },
        actionType: actions.SET_CHARGESHEET_DATA,
      });
    case actions.RESET_CHARGESHEET_DATA:
      return Immutable.merge(state, {
        chargeSheetData: {},
        actionType: actions.RESET_CHARGESHEET_DATA,
      });
    default:
      return state;
  }
}
