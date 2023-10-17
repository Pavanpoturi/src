import { useSelector } from "react-redux";
import Loader from "@components/utility/loader";
import Firs from "../../Firs";
import { loadState } from "@lib/helpers/localStorage";
import {
  IS_CI,
  IS_DSP,
  IS_SP,
  IS_DGP,
  IS_IO,
  IS_SHO,
  IS_INVESTIGATION_OFFICER,
} from "../../FirDetails/fir-util";
import { isArray } from "lodash";

export default function JudrisditionDashboardIndex() {
  const { currentUser } = useSelector((state) => state.Auth);
  const storedUser = loadState("currentUser");
  const activeUser = currentUser.employee_name ? currentUser : storedUser;
  const { firList, isFetching } = useSelector((state) => state.FIR);
  const userRole = [IS_SHO, IS_IO, IS_INVESTIGATION_OFFICER];
  const IS_HIGHER_SHO_USER = !userRole?.includes(activeUser?.ecopsv2_role);
  const { data } = firList;

  return !isArray(data) ? (
    <Loader />
  ) : (
    <div style={{ height: "100%", margin: 20 }}>
      <Firs ISHIGHERSHOUSER={true} />
    </div>
  );
}
