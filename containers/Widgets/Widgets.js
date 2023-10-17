import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TEMPLATE_LOGO_PNG_ID } from "@lib/helpers/utility";
import LayoutWrapper from "@components/utility/layoutWrapper";
import basicStyle from "@assets/styles/constants";
import { config } from "@config/site.config";
import firActions from "@redux/fir/actions";
import { isUndefined } from "lodash";
import dashboardActions from "@redux/dashboard/actions";
import { loadState, loadStringState } from "@lib/helpers/localStorage";
import Loader from "@components/utility/loader";
import DefaultDashboard from "./DefaultDashboard";
import Firs from "../Firs";
import {
  IS_IO,
  IS_SHO,
  IS_CI,
  IS_DSP,
  IS_SP,
  IS_DGP,
  IS_INVESTIGATION_OFFICER,
} from "../FirDetails/fir-util";
import masterDataActions from "@redux/masterData/actions";

const { fetchRecentEditList } = dashboardActions;
const { updateDashboardData } = firActions;
const { getActList } = masterDataActions;

const styles = {
  wisgetPageStyle: {
    display: "flex",
    flexFlow: "row wrap",
    alignItems: "flex-start",
    overflow: "hidden",
    width: "100%",
  },
};

export default function Widgets() {
  const dispatch = useDispatch();
  const { isFetching } = useSelector((state) => state.Dashboard);
  const { selectedWidgetStatus, dropDownData, updatedPsCode } = useSelector(
    (state) => state.FIR
  );
  const { currentUser } = useSelector((state) => state.Auth);
  const storedUser = loadState("currentUser");
  const activeUser = currentUser.employee_name ? currentUser : storedUser;
  const IS_SHO_USER = activeUser.emp_role_name === IS_SHO;
  const ECOPSV2ROLE = [IS_SHO, IS_IO, IS_INVESTIGATION_OFFICER];
  const IS_HIGHER_SHO_USER = ECOPSV2ROLE.includes(activeUser?.ecopsv2_role)
    ? false
    : true;
  const { containerStyle } = basicStyle;
  const fileId =
    isUndefined(config.reportLogoFileId) ||
      config.reportLogoFileId === "undefined"
      ? TEMPLATE_LOGO_PNG_ID
      : config.reportLogoFileId;
  const getpsCode = dropDownData.map((data) => data?.ps_code).join(",");
  const fetchRecentEditedDetails = () => {
    if (IS_SHO_USER) {
      dispatch(
        fetchRecentEditList(
          `${config.getRecentEditList}/?psCode=${activeUser?.cctns_unit_id}`
        )
      );
    } else if (IS_HIGHER_SHO_USER && !!storedUser?.isIo === false) {
      dispatch(
        fetchRecentEditList(`${config.getRecentEditList}/?psCode=${getpsCode}`)
      );
    } else {
      dispatch(
        fetchRecentEditList(
          `${config.getRecentEditList}/?psCode=${activeUser?.cctns_unit_id}&userName=${activeUser?.pao_code}`
        )
      );
    }
  };

  useEffect(() => {
    fetchRecentEditedDetails();
  }, [getpsCode]);
  useEffect(() => {
    localStorage.removeItem("complainantList");
    dispatch(getActList(`${config.getMasterData}/ACT`));
    dispatch(updateDashboardData(true));
    fetch(`${config.downloadFile}?fileId=${fileId}`, {
      method: "GET",
    })
      .then((response) => response.blob())
      .then((blob) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          const base64data = reader.result;
          localStorage.setItem("templatesLogo", JSON.stringify(base64data));
        };
      });
  }, []);

  return (
    <LayoutWrapper>
      <div style={styles.wisgetPageStyle}>
        <div
          style={{
            ...containerStyle,
            paddingTop: selectedWidgetStatus !== "" ? 0 : 20,
            paddingLeft: 40,
            paddingRight: 25,
          }}
          gutter={0}
          justify="start"
        >
          {isFetching ? (
            <Loader />
          ) : selectedWidgetStatus !== "" ? (
            <Firs />
          ) : (
            <DefaultDashboard />
          )}
        </div>
      </div>
    </LayoutWrapper>
  );
}
