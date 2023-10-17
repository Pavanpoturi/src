import actions from "./actions";
import Immutable from "seamless-immutable";

const initialState = Immutable({
  failure: false,
  isFetching: false,
  isLoading: false,
  errorMessage: "",
  successMessage: "",
  cdfsheetList: [],
  actionType: "",
  vehicleDetails: [],
});

export default function crimeSceneReducer(state = initialState, action) {
  switch (action.type) {
    case actions.FETCH_VEHICLE_REQUEST:
      return { ...state, isFetching: true, isLoading: true };
    case actions.FETCH_VEHICLE_SUCCESS:
      return {
        ...state,
        failure: false,
        isFetching: false,
        isLoading: false,
        errorMessage: "",
        vehicleDetails: action.vehicleDetails,
        actionType: actions.FETCH_VEHICLE_SUCCESS,
      };
    case actions.FETCH_VEHICLE_ERROR:
      return {
        ...state,
        failure: true,
        isFetching: false,
        isLoading: false,
        vehicleDetails: "",
        errorMessage: action.errorMessage,
        actionType: actions.FETCH_VEHICLE_ERROR,
      };
      case actions.RESET_VEHICLE:
        return {
          ...state,
          failure: false,
          isFetching: false,
          isLoading: false,
          errorMessage: "",
          vehicleDetails: "",
          actionType: actions.RESET_VEHICLE,
        };
    case actions.UPLOAD_CDF_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.UPLOAD_CDF_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage: "CDF uploaded successfully",
        actionType: actions.UPLOAD_CDF_SUCCESS,
      });
    case actions.UPLOAD_CDF_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.UPLOAD_CDF_ERROR,
      });
    default:
      return state;
  }
}
