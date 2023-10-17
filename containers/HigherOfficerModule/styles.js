import styled, { createGlobalStyle } from "styled-components";
import { variables } from "@assets/styles/variables";
import { palette } from "styled-theme";

export const DashboardGlobalStyles = createGlobalStyle`
body {
  -webkit-overflow-scrolling: touch;
}

html h1,
html h2,
html h3,
html h4,
html h5,
html h6,
html a,
html p,
html li,
input,
textarea,
span,
div,
html,
body,
html a {
  margin-bottom: 0;
  font-family: 'Roboto', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.004);
}

html ul {
  -webkit-padding-start: 0px;
  list-style: none;
  margin-bottom: 0;
}

.scrollbar-track-y,
.scrollbar-thumb-y {
  width: 5px !important;
}

.scrollbar-track-x,
.scrollbar-thumb-x {
  height: 5px !important;
}

.scrollbar-thumb {
  border-radius: 0 !important;
}

.scrollbar-track {
  background: rgba(222, 222, 222, 0.15) !important;
}

.scrollbar-thumb {
  border-radius: 0 !important;
  background: rgba(0, 0, 0, 0.5) !important;
}

.ant-popover-placement-bottom > .ant-popover-content > .ant-popover-arrow:after,
.ant-popover-placement-bottomLeft
  > .ant-popover-content
  > .ant-popover-arrow:after,
.ant-popover-placement-bottomRight
  > .ant-popover-content
  > .ant-popover-arrow:after,
.ant-popover-placement-top > .ant-popover-content > .ant-popover-arrow:after,
.ant-popover-placement-topLeft
  > .ant-popover-content
  > .ant-popover-arrow:after,
.ant-popover-placement-topRight
  > .ant-popover-content
  > .ant-popover-arrow:after {
  left: 0;
  margin-left: -4px;
}

.ant-popover-buttons .ant-btn-primary {
  background: #02406F !Important;
  border-color: #02406F;
  border-radius: 5px;

  &:hover {
    background: #02406F;
    border-color: #02406F;
    color: ${variables.WHITE_COLOR};
  }
}

.ant-modal-body {
  .ant-btn-primary {
    background: #02406F;
    border-color: #02406F;
    border-radius: 5px;

    &:hover {
      background: #02406F;
      border-color: #02406F;
      color: ${variables.WHITE_COLOR};
    }
  }

  .ant-btn {
    border-radius: 5px;

    &:hover {
      border-color: #02406F;
    }
  }
}

.ant-card-bordered {
  border: 1px solid #c8c8c8 !important;
  border-radius: 7px !important;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.15);
}

/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}

/********** Add Your Global RTL CSS Here **********/

/* Popover */

html[dir='rtl'] .ant-popover {
  text-align: right;
}

/* Modal */

html[dir='rtl'] .has-success.has-feedback:after,
html[dir='rtl'] .has-warning.has-feedback:after,
html[dir='rtl'] .has-error.has-feedback:after,
html[dir='rtl'] .is-validating.has-feedback:after {
  left: 0;
  right: auto;
}

html[dir='rtl'] .ant-modal-close {
  right: inherit;
  left: 0;
}

html[dir='rtl'] .ant-modal-footer {
  text-align: left;
}

html[dir='rtl'] .ant-modal-footer button + button {
  margin-left: 0;
  margin-right: 8px;
}

html[dir='rtl'] .ant-confirm-body .ant-confirm-content {
  margin-right: 42px;
}

html[dir='rtl'] .ant-btn > .anticon + span,
html[dir='rtl'] .ant-btn > span + .anticon {
  margin-right: 0.5em;
}

html[dir='rtl'] .ant-btn-loading span {
  margin-left: 0;
  margin-right: 0.5em;
}

html[dir='rtl']
  .ant-btn.ant-btn-loading:not(.ant-btn-circle):not(.ant-btn-circle-outline) {
  padding-left: 25px;
  padding-right: 29px;
}

html[dir='rtl']
  .ant-btn.ant-btn-loading:not(.ant-btn-circle):not(.ant-btn-circle-outline)
  .anticon {
  margin-right: -14px;
  margin-left: 0;
}

/* Confirm */

html[dir='rtl'] .ant-modal.ant-confirm .ant-confirm-body > .anticon {
  margin-left: 16px;
  margin-right: 0;
  float: right;
}

html[dir='rtl'] .ant-modal.ant-confirm .ant-confirm-btns {
  float: left;
}

html[dir='rtl'] .ant-modal.ant-confirm .ant-confirm-btns button + button {
  margin-right: 10px;
  margin-left: 0;
}

/* Message */

html[dir='rtl'] .ant-message .anticon {
  margin-left: 8px;
  margin-right: 0;
}

/* Pop Confirm */

html[dir='rtl'] .ant-popover-message-title {
  padding-right: 20px;
  padding-left: 0;
}

html[dir='rtl'] .ant-popover-buttons {
  text-align: left;
}

/* Notification */

html[dir='rtl']
  .ant-notification-notice-closable
  .ant-notification-notice-message {
  padding-left: 24px;
  padding-right: 0;
}

html[dir='rtl']
  .ant-notification-notice-with-icon
  .ant-notification-notice-message,
html[dir='rtl']
  .ant-notification-notice-with-icon
  .ant-notification-notice-description {
  margin-right: 48px;
}

html[dir='rtl'] .ant-notification-notice-close {
  right: auto;
  left: 16px;
}

html[dir='rtl'] .ant-notification-notice-with-icon {
  left: 0;
}

`;
export const DashboardContainer = styled.div`
  -webkit-overflow-scrolling: touch;
  .trigger {
    font-size: 18px;
    line-height: 64px;
    padding: 0 16px;
    cursor: pointer;
    transition: color 0.3s;
  }

  .investigationPage {
    padding: 50px 0 15px 20px;
    width: 60%;
    margin: 0 auto;

    .ant-select {
      width: 100%;
    }

    .ant-select-selector {
      height: 70px !important;
      border-radius: 8px !important;
    }

    .ant-select-selection-search-input {
      height: 65px !important;
    }

    .ant-select-single.ant-select-show-arrow .ant-select-selection-item,
    .ant-select-single.ant-select-show-arrow .ant-select-selection-placeholder {
      padding-top: 20px;
      font-size: 22px;
      font-weight: 300;
    }

    .ant-select-arrow {
      right: 38px;
      top: 50%;
    }

    .ant-select:not(.ant-select-disabled):hover .ant-select-selector {
      border-color: ${variables.LIGHT_BLUE};
    }
  }

  .displayInvistigationForms {
    padding: 10px;

    .listItems {
      font-size: 19px;
      margin-bottom: 10px;
      font-weight: 400;
      cursor: pointer;
      color: #02599c;
      text-decoration: underline;
    }
  }

  .invShowHideMenu,
  .invShowHideMenu:focus,
  .invShowHideMenu:active,
  .invShowHideMenu:hover {
    margin-top: 18px;
    font-size: 20px;
    color: #5d5d5d;

    span {
      font-size: 20px;
    }
  }

  .invContentList {
    width: 98%;
    margin: 0 auto;
  }

  .trigger:hover {
    color: ${palette("primary", 0)};
  }

  .ant-layout-sider-collapsed .anticon {
    font-size: 16px;
  }

  .ant-layout-sider-collapsed .nav-text {
    display: none;
  }

  .ant-layout {
    background: ${palette("secondary", 1)};

    &.contentMainLayout {
      overflow: auto;
      overflow-x: hidden;
      @media only screen and (min-width: 768px) and (max-width: 1220px) {
        width: calc(100% - 80px);
        flex-shrink: 0;
      }

      @media only screen and (max-width: 767px) {
        width: 100%;
        flex-shrink: 0;
      }
    }
  }

  .layoutContent {
    width: 100%;
    padding: 35px;
    background-color: #ffffff;
    border: 1px solid ${palette("border", 0)};
    height: 100%;
  }

  .ant-layout-footer {
    font-size: 13px;
    @media (max-width: 767px) {
      padding: 10px 20px;
    }
  }

  .dashboardontent {
    .ant-table-thead th.ant-table-column-has-sorters:hover {
      background: #02599c;
    }

    .ant-pagination-item-active {
      background-color: #02599c;
      border-color: #02599c;
    }
  }
`;
