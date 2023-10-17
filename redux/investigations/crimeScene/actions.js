const actions = {
  FETCH_CDF_REQUEST: "FETCH_CDF_REQUEST",
  FETCH_CDF_SUCCESS: "FETCH_CDF_SUCCESS",
  FETCH_CDF_ERROR: "FETCH_CDF_ERROR",

  UPLOAD_CDF_REQUEST: "UPLOAD_CDF_REQUEST",
  UPLOAD_CDF_SUCCESS: "UPLOAD_CDF_SUCCESS",
  UPLOAD_CDF_ERROR: "UPLOAD_CDF_ERROR",

  FETCH_VEHICLE_REQUEST: "FETCH_VEHICLE_REQUEST",
  FETCH_VEHICLE_SUCCESS: "FETCH_VEHICLE_SUCCESS",
  FETCH_VEHICLE_ERROR: "FETCH_VEHICLE_ERROR",

  RESET_VEHICLE: "RESET_VEHICLE",

  uploadCDFSheet: (url, body) => ({
    type: actions.UPLOAD_CDF_REQUEST,
    payload: { url, body },
  }),

  getVehicleData: (url) => ({
    type: actions.FETCH_VEHICLE_REQUEST,
    payload: { url },
  }),

  resetVehicleData: () => ({
    type: actions.RESET_VEHICLE,
  })

};
export default actions;
