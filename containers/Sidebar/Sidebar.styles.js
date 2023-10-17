import styled from "styled-components";
import { palette } from "styled-theme";
import { transition, borderRadius } from "@lib/helpers/style_utils";
import { variables } from "@assets/styles/variables";
import WithDirection from "@lib/helpers/rtl";

const SidebarWrapper = styled.div`
  .sidebar {
    z-index: 1000;
    background: ${variables.PRIMARY_BLUE};
    width: 280px;
    flex: 0 0 280px;

    .scrollarea {
      height: calc(100vh - 70px);
    }

    &.ant-layout-sider-collapsed {
      width: 0;
      min-width: 0 !important;
      max-width: 0 !important;
      flex: 0 0 0 !important;
    }

    .logoWrapper {
      height: 70px;
      background: ${variables.PRIMARY_BLUE};
      margin: 0;
      padding: 0 10px;
      text-align: center;
      overflow: hidden;
      ${borderRadius()};
    }

    &.ant-layout-sider-collapsed {
      .logoWrapper {
        padding: 0;
      }
    }

    .dashboardMenu {
      background: transparent;

      a {
        text-decoration: none;
        font-weight: 400;
      }

      .ant-menu-item {
        width: 100%;
        display: -ms-flexbox;
        display: flex;
        -ms-flex-align: center;
        align-items: center;
        margin: 0;
      }

      .menuHolder {
        display: flex;
        align-items: center;

        i {
          font-size: 19px;
          color: inherit;
          margin: ${(props) =>
            props["data-rtl"] === "rtl" ? "0 0 0 30px" : "0 15px 0 0"};
          width: 18px;
          ${transition()};
        }
      }

      .anticon {
        font-size: 18px;
        margin-right: 30px;
        color: inherit;
        ${transition()};
      }

      .nav-text {
        font-size: 14px;
        color: inherit;
        font-weight: 400;
        ${transition()};
      }

      .ant-menu-item-selected {
        background-color: rgba(0, 0, 0, 0.4) !important;
        .anticon {
          color: ${variables.WHITE_COLOR};
        }

        i {
          color: ${variables.WHITE_COLOR};
        }

        .nav-text {
          color: ${variables.WHITE_COLOR};
        }
      }

      > li {
        &:hover {
          i,
          .nav-text {
            color: #ffffff;
          }
        }
      }
    }
    .ant-menu-dark .ant-menu-inline.ant-menu-sub {
      background: ${palette("secondary", 5)};
    }
    }
  }
`;

export default WithDirection(SidebarWrapper);
