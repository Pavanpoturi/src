import { useDispatch, useSelector } from "react-redux";
import { Layout } from "antd";
import {
  IS_SHO,
  IS_CI,
  IS_DSP,
  IS_IO,
  IS_SP,
  IS_DGP,
  IS_INVESTIGATION_OFFICER
} from "@containers/FirDetails/fir-util";
import Scrollbars from "@components/utility/customScrollBar";
import Menu from "@components/uielements/menu";
import { loadState } from "@lib/helpers/localStorage";
import appActions from "@redux/app/actions";
import Logo from "@components/utility/logo";
import options from "./options";
import SidebarWrapper from "./Sidebar.styles";
import SidebarMenu from "./SidebarMenu";
import { isUndefined } from "lodash";

const { Sider } = Layout;

const { changeOpenKeys, changeCurrent, toggleCollapsed } = appActions;

export default function Sidebar() {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.Auth);
  const storedUser = loadState("currentUser");
  const activeUser = currentUser.employee_name ? currentUser : storedUser;
  const IS_SHO_USER = activeUser.emp_role_name === IS_SHO;
  const IS_IO_USER = activeUser.emp_role_name === IS_IO;
  const IS_ROLE_MULTIPLE =
    !isUndefined(activeUser?.emp_role_name_multiple) &&
    activeUser?.emp_role_name_multiple?.includes("INVESTIGATION OFFICER");
  const userRole = [IS_SHO, IS_IO, IS_INVESTIGATION_OFFICER];
  const IS_HIGHER_SHO_USER = !userRole?.includes(currentUser?.ecopsv2_role)
  const { view, openKeys, collapsed, openDrawer, current, height } =
    useSelector((state) => state.App);
  const customizedTheme = useSelector(
    (state) => state.ThemeSwitcher.sidebarTheme
  );

  const handleClick = (e) => {
    dispatch(changeCurrent([e.key]));
    if (view === "MobileView") {
      setTimeout(() => {
        dispatch(toggleCollapsed());
      }, 100);
    }
  };

  const onOpenChange = (newOpenKeys) => {
    const latestOpenKey = newOpenKeys.find(
      (key) => !(openKeys.indexOf(key) > -1)
    );
    const latestCloseKey = openKeys.find(
      (key) => !(newOpenKeys.indexOf(key) > -1)
    );
    let nextOpenKeys = [];
    if (latestOpenKey) {
      nextOpenKeys = getAncestorKeys(latestOpenKey).concat(latestOpenKey);
    }
    if (latestCloseKey) {
      nextOpenKeys = getAncestorKeys(latestCloseKey);
    }
    dispatch(changeOpenKeys(nextOpenKeys));
  };

  const getAncestorKeys = (key) => {
    const map = {
      sub3: ["sub2"],
    };
    return map[key] || [];
  };

  const isCollapsed = collapsed && !openDrawer;
  const mode = isCollapsed === true ? "vertical" : "inline";
  const styling = {
    backgroundColor: customizedTheme.backgroundColor,
  };

  return (
    <SidebarWrapper>
      <Sider
        trigger={null}
        collapsible={true}
        collapsed={isCollapsed}
        width={300}
        className="sidebar"
        style={styling}
      >
        <Logo collapsed={isCollapsed} />
        <Scrollbars style={{ height: height - 70 }}>
          <Menu
            onClick={handleClick}
            theme="dark"
            className="dashboardMenu"
            mode={mode}
            openKeys={isCollapsed ? [] : openKeys}
            selectedKeys={current}
            onOpenChange={onOpenChange}
          >
            {options.map((singleOption) => {
              if (
                (singleOption?.key === "reports" &&
                  !IS_SHO_USER &&
                  !IS_HIGHER_SHO_USER) ||
                (singleOption?.key === "case-transfer" &&
                  !IS_SHO_USER &&
                  !IS_IO_USER &&
                  !IS_ROLE_MULTIPLE)
              ) {
                return false;
              }
              return (
                <SidebarMenu
                  key={singleOption.key}
                  singleOption={singleOption}
                />
              );
            })}
          </Menu>
        </Scrollbars>
      </Sider>
    </SidebarWrapper>
  );
}
