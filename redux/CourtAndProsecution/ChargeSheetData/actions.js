const actions = {
  SET_CHARGESHEET_DATA: "SET_CHARGESHEET_DATA",
  RESET_CHARGESHEET_DATA: "RESET_CHARGESHEET_DATA",

  setChargeSheetData: (data) => ({
    type: actions.SET_CHARGESHEET_DATA,
    payload: data,
  }),

  resetChargeSheetData: () => ({
    type: actions.RESET_CHARGESHEET_DATA,
  }),
};
export default actions;
