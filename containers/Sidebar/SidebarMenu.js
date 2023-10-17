import React, { useCallback } from "react";
import { Link, useRouteMatch } from "react-router-dom";
import { useDispatch } from "react-redux";
import Menu from "@components/uielements/menu";
import appActions from "@redux/app/actions";
import IntlMessages from "@components/utility/intlMessages";

const SubMenu = Menu.SubMenu;

const stripTrailingSlash = (str) => {
  if (str.substr(-1) === "/") {
    return str.substr(0, str.length - 1);
  }
  return str;
};

const { toggleCollapsed } = appActions;

export default React.memo(function SidebarMenu({
  singleOption,
  submenuStyle,
  submenuColor,
  ...rest
}) {
  let match = useRouteMatch();
  const dispatch = useDispatch();
  const handleToggle = useCallback(
    () => dispatch(toggleCollapsed()),
    [dispatch]
  );

  const { key, label, leftIcon, children } = singleOption;
  const url = stripTrailingSlash(match.url);

  if (children) {
    return (
      <SubMenu
        key={key}
        title={
          <span className="menuHolder" style={submenuColor}>
            <i className={leftIcon} />
            <span className="nav-text">
              <IntlMessages id={label} />
            </span>
          </span>
        }
        {...rest}
      >
        {children.map((child) => {
          const linkTo = child.withoutDashboard
            ? `/${child.key}`
            : `${url}/${child.key}`;
          return (
            <Menu.Item style={submenuStyle} key={child.key}>
              <Link style={submenuColor} to={linkTo} onClick={handleToggle}>
                <IntlMessages id={child.label} />
              </Link>
            </Menu.Item>
          );
        })}
      </SubMenu>
    );
  }

  return (
    <Menu.Item key={key} {...rest}>
      <Link to={`${url}/${key}`} onClick={handleToggle}>
        <span className="menuHolder" style={submenuColor}>
          <i className={leftIcon} />
          <span className="nav-text">
            <IntlMessages id={label} />
          </span>
        </span>
      </Link>
    </Menu.Item>
  );
});
