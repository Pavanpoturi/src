import { all, takeEvery, put, fork, call } from "redux-saga/effects";
import { isUndefined, isNull } from "lodash";
import { clearToken } from "@lib/helpers/utility";
import actions from "./actions";
import ApiSauce from "@services/apiSauce";

const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

const authSession = (payload) => {
  const { url, body } = payload;
  return ApiSauce.post(url, body, headers);
};

export function* loginRequest() {
  yield takeEvery("LOGIN_REQUEST", function* ({ payload }) {
    try {
      const md5password = window.hex_md5(payload.body.password);
      payload.body.password = md5password;
      payload.body.saltPassword = window.password_hashing(md5password);
      const res = yield call(authSession, payload);
      // Use this mock response if login fails
      // const res = {
      //   rank_name: "PC",
      //   status_name: "WORKING",
      //   date_of_birth: "08/02/1993",
      //   hrms_unit_id: 1472,
      //   mobile_no: "9701010408",
      //   employee_name: "NAINAVATH  SARITHA",
      //   general_no: "7829",
      //   date_of_retirement: "28/02/2054",
      //   unit_name: "Balanagar PS(Cyberabad)",
      //   emp_role_name: "RECEPTION",
      //   date_of_join_in_service: "01/02/2018",
      //   cctns_unit_id: 2022004,
      //   rank: 9,
      //   emp_role_id: 8,
      //   pao_code: "2301319",
      //   statusCode: 200,
      //   success: true,
      // };
      // const SHOResponse = {
      //   rank_name: "ASI",
      //   status_name: "WORKING",
      //   date_of_birth: "05/06/1965",
      //   hrms_unit_id: 1675,
      //   mobile_no: "9999999999",
      //   working_head_unit_name: "Siddipet",
      //   employee_name: "VARIKOTI NAVEEN KUMAR",
      //   general_no: "801",
      //   date_of_retirement: "30/06/2026",
      //   cctns_working_unit_id: 2036009,
      //   unit_name: "CHERIAL PS(Siddipet)",
      //   posting_head_unit_name: "Siddipet",
      //   approvingOfficer: false,
      //   emp_role_name: "STATION HOUSE OFFICER (SHO)",
      //   forwardOfficer: false,
      //   date_of_join_in_service: "31/08/1990",
      //   hrms_working_unit_id: 1675,
      //   cctns_unit_id: 2036009,
      //   emp_role_ids: "2,78,7",
      //   rank: 4,
      //   working_unit: "CHERIAL PS(Siddipet)",
      //   unit_id: 1675,
      //   pao_code: "2104875",
      //   nonEmpRole: "",
      //   emp_role_name_multiple: "STATION HOUSE OFFICER (SHO),INVESTIGATION OFFICER,SECTION INCHARGE",
      //   ecopsv2_role: "STATION HOUSE OFFICER (SHO)",
      //   ecopsv2_hierarchy_key: "ps_code"
      // };
      // const CIResponse = {
      //   rank_name: "Inspector",
      //   status_name: "WORKING",
      //   date_of_birth: "17/03/1981",
      //   hrms_unit_id: 1258,
      //   approvingOfficerUnits: [
      //     {
      //       "unit_name": "CHERIYAL CIRCLE",
      //       "unit_id": 1258,
      //       "user_name": "CI_CRL_SDPT"
      //     }
      //   ],
      //   mobile_no: "9999999999",
      //   working_head_unit_name: "Siddipet",
      //   employee_name: "MANCHINEELLA SRINIVAS",
      //   general_no: "--",
      //   date_of_retirement: "31/03/2042",
      //   cctns_working_unit_id: 2036200,
      //   unit_name: "CHERIYAL CIRCLE(Siddipet)",
      //   posting_head_unit_name: "Siddipet",
      //   approvingOfficer: true,
      //   emp_role_name: "CIRCLE INSPECTOR",
      //   forwardOfficer: false,
      //   date_of_join_in_service: "24/12/2010",
      //   hrms_working_unit_id: 1258,
      //   cctns_unit_id: 2036200,
      //   emp_role_ids: "79",
      //   rank: 1,
      //   working_unit: "CHERIYAL CIRCLE(Siddipet)",
      //   unit_id: 1258,
      //   pao_code: "2151808",
      //   nonEmpRole: "CI_CRL_SDPT",
      //   ecopsv2_role: "CIRCLE INSPECTOR",
      //   ecopsv2_hierarchy_key: "circle_code"
      // };
      // const acpResponse = {
      //   rank_name: "DSP (Civil)",
      //   status_name: "WORKING",
      //   date_of_birth: "27/09/1968",
      //   hrms_unit_id: 1118,
      //   approvingOfficerUnits: [
      //     {
      //       unit_name: "Husnabad Division",
      //       unit_id: 1118,
      //       user_name: "ACP_HSBD_SDPT",
      //     },
      //   ],
      //   mobile_no: "9999999999",
      //   working_head_unit_name: "Siddipet",
      //   employee_name: "VASALA SATHISH",
      //   general_no: "--",
      //   date_of_retirement: "30/09/2029",
      //   cctns_working_unit_id: 2069400,
      //   unit_name: "Husnabad Division(Siddipet)",
      //   posting_head_unit_name: "Siddipet",
      //   approvingOfficer: true,
      //   emp_role_name: "SDPO/ACP",
      //   forwardOfficer: false,
      //   date_of_join_in_service: "16/08/1995",
      //   hrms_working_unit_id: 1118,
      //   cctns_unit_id: 2069400,
      //   emp_role_ids: "80",
      //   rank: 56,
      //   working_unit: "Husnabad Division(Siddipet)",
      //   unit_id: 1118,
      //   pao_code: "2587494",
      //   nonEmpRole: "ACP_HSBD_SDPT",
      //   ecopsv2_role: "SDPO/ACP",
      //   ecopsv2_hierarchy_key: "sdpo_code",
      //   statusCode: 200,
      //   success: true,
      // };

      if (res.statusCode === 200) {
        if (res.success) {
          const currentUser = JSON.parse(res.data);

          //user might register to one ps and working undere another ps
          // we need to use working ps details
          console.log(currentUser, "getUserData");
          if (
            currentUser?.working_unit &&
            currentUser?.hrms_working_unit_id &&
            currentUser?.cctns_working_unit_id
          ) {
            currentUser.unit_name = currentUser.working_unit;
            currentUser.hrms_unit_id = currentUser.hrms_working_unit_id;
            currentUser.unit_id = currentUser.hrms_working_unit_id;
            currentUser.cctns_unit_id = currentUser.ecopsv2_unit_id;
          }
          const ecopsv2HierarchyRole =
            isNull(currentUser?.ecopsv2_hierarchy_role) ||
              isUndefined(currentUser?.ecopsv2_hierarchy_role) ||
              currentUser?.ecopsv2_hierarchy_role === "--"
              ? false
              : true;
          const ecopsv2_role =
            isNull(currentUser?.ecopsv2_role) ||
              isUndefined(currentUser?.ecopsv2_role) ||
              currentUser?.ecopsv2_role === "--"
              ? false
              : true;
          const emp_role_name =
            isNull(currentUser?.emp_role_name) ||
              isUndefined(currentUser?.emp_role_name) ||
              currentUser?.emp_role_name === "--"
              ? false
              : true;
          const cctnsUnitId =
            isUndefined(currentUser?.cctns_unit_id) ||
              isNull(currentUser?.cctns_unit_id) ||
              currentUser?.cctns_unit_id === "--"
              ? false
              : true;
          const ecopsv2_hierarchy_key =
            isUndefined(currentUser?.ecopsv2_hierarchy_key) ||
              isNull(currentUser?.ecopsv2_hierarchy_key) ||
              currentUser?.ecopsv2_hierarchy_key === "--"
              ? false
              : true;
          let multiple_roles = currentUser?.emp_role_name.split(",");
          if (multiple_roles.length > 1) {
            if (multiple_roles.indexOf("SDPO/ACP") > -1) {
              currentUser.emp_role_name_multiple = currentUser.emp_role_name; //For not loosing original api response in local storage
              currentUser.emp_role_name = "SDPO/ACP";
            } else if (multiple_roles.indexOf("CIRCLE INSPECTOR") > -1) {
              currentUser.emp_role_name_multiple = currentUser.emp_role_name; //For not loosing original api response in local storage
              currentUser.emp_role_name = "CIRCLE INSPECTOR";
            } else if (
              multiple_roles.indexOf("STATION HOUSE OFFICER (SHO)") > -1
            ) {
              currentUser.emp_role_name_multiple = currentUser.emp_role_name; //For not loosing original api response in local storage
              currentUser.emp_role_name = "STATION HOUSE OFFICER (SHO)";
            } else {
              currentUser.emp_role_name_multiple = currentUser?.emp_role_name; //For not loosing original api response in local storage
              currentUser.emp_role_name = currentUser.emp_role_name;
            }
          }
          sessionStorage.setItem("token", res.jwtToken);
          if (!ecopsv2HierarchyRole) {
            yield put({
              type: actions.LOGIN_ERROR,
              errorMessage: "ecopsv2 Hierarchy Role is missing",
            });
          }
          if (!ecopsv2_role) {
            yield put({
              type: actions.LOGIN_ERROR,
              errorMessage: "ecopsv2 Role is missing",
            });
          }
          if (!emp_role_name) {
            yield put({
              type: actions.LOGIN_ERROR,
              errorMessage: "Employee role name  is missing",
            });
          }
          if (!cctnsUnitId) {
            yield put({
              type: actions.LOGIN_ERROR,
              errorMessage: "CCTSN Unit Id is missing",
            });
          }
          if (!ecopsv2_hierarchy_key) {
            yield put({
              type: actions.LOGIN_ERROR,
              errorMessage: "ecopsv2 hierarchy key is missing",
            });
          }
          if (
            ecopsv2HierarchyRole &&
            ecopsv2_role &&
            emp_role_name &&
            cctnsUnitId &&
            ecopsv2_hierarchy_key
          ) {
            yield put({
              type: actions.LOGIN_SUCCESS,
              currentUser: currentUser,
            });
          } else {
            yield put({
              type: actions.LOGIN_ERROR,
              errorMessage: "Something went wrong. Please try after some time.",
            });
          }
        } else {
          yield put({
            type: actions.LOGIN_ERROR,
            errorMessage: res.data,
          });
        }
      } else {
        yield put({
          type: actions.LOGIN_ERROR,
          errorMessage: "Something went wrong. Please try after some time.",
        });
      }
    } catch (error) {
      yield put({
        type: actions.LOGIN_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* loginSuccess() {
  yield takeEvery(actions.LOGIN_SUCCESS, function* (payload) {
    //user might register to one ps and working undere another ps
    // we need to use working ps details
    let { currentUser } = payload;
    Object.assign(currentUser, {
      isIo: false,
      refresh: false,
      isPersnolized: false,
    });
    if (
      currentUser?.working_unit &&
      currentUser?.hrms_working_unit_id &&
      currentUser?.cctns_working_unit_id
    ) {
      currentUser.unit_name = currentUser.working_unit;
      currentUser.hrms_unit_id = currentUser.hrms_working_unit_id;
      currentUser.unit_id = currentUser.hrms_working_unit_id;
      currentUser.cctns_unit_id = currentUser.cctns_working_unit_id;
    }

    yield localStorage.setItem(
      "currentUser",
      JSON.stringify(payload.currentUser)
    );
  });
}

export function* loginError() {
  yield takeEvery(actions.LOGIN_ERROR, function* () { });
}

export function* logout() {
  yield takeEvery(actions.LOGOUT, function* ({ payload }) {
    const message = "You have successfully logout";
    sessionStorage.clear();
    if (message) {
      yield clearToken();
      payload.history.push("/login");
    }
  });
}

export default function* rootSaga() {
  yield all([
    fork(loginRequest),
    fork(loginSuccess),
    fork(loginError),
    fork(logout),
  ]);
}
