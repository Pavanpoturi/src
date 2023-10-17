import { createGlobalStyle } from "styled-components";
import { palette, font } from "styled-theme";
import { variables } from "@assets/styles/variables";

const GlobalStyles = createGlobalStyle`
  .ant-btn{
    border-radius: 4px;
    font-size: 15px !important;
  }

  .accusedPersonListModal .ant-modal-body{
    height : 600px;
    overflow-y: auto
  }

  .chargeContainer {
    position: relative;
  }

  .chargeModal {
    display: block;
    width: 100%;
    height: auto;
  }

  .ant-upload-list-item-name {
    color: #1890ff;
    text-decoration: none;
    background-color: transparent;
    outline: none;
    cursor: pointer;
    transition: color 0.3s;
  }

  .customPageLoader .contentLoader {
    position: absolute !important;
    top: 300px !important;
  }
  
  .overlay {
    position: absolute; 
    bottom: 0; 
    background: rgb(0, 0, 0);
    background: rgba(0,0,0,0.6); /* Black see-through */
    color: #f1f1f1; 
    width: 100%;
    transition: .5s ease;
    opacity:0;
    color: white;
    font-size: 20px;
    padding: 20px;
    text-align: center;
  }

  .chargeContainer .overlay {
    opacity: 1;
    height:calc(100% - 60px);
  }

  .innerText{
    display: flex;
    height:calc(100% - 60px);
    align-items: center;
    padding : 0 20%;
  }
  

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .logo {
    font-size: 32px;
    font-weight: 700;
    color: ${variables.WHITE_COLOR};
  }

  .ant-table-thead > tr.ant-table-row-hover:not(.ant-table-expanded-row) > td, .ant-table-tbody > tr.ant-table-row-hover:not(.ant-table-expanded-row) > td, .ant-table-thead > tr:hover:not(.ant-table-expanded-row) > td, .ant-table-tbody > tr:hover:not(.ant-table-expanded-row) > td {
    background: #f8f8f8 !important;
  }

  .ant-form-item-label > label {
    font-size: 16px !important;
  }

  .ant-row.ant-form-item {
    margin-bottom: 5px;
  }

  .ant-modal-confirm-btns button:first-child {
    // display: none !Important;
  }

font-family: ${font("primary", 0)};

h1,
h2,
h3,
h4,
h5,
h6,
a,
p,
li,
input,
textarea,
span,
div,
img,
svg {
  &::selection {
    background: ${palette("primary", 0)};
    color: ${variables.WHITE_COLOR};
  }
}

.ant-row:not(.ant-form-item) {
  ${
    "" /* margin-left: -8px;
  margin-right: -8px; */
  };
  &:before,
  &:after {
    display: none;
  }
}

.ant-row > div {
  padding: 0;
}

.leftRightComponent {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.linkStyle {
  cursor: pointer;
  color: blue;
  text-decoration: underline;
  margin: 5px;
  font-size: 16px;
}

.popupLink{
  cursor: pointer;
  color: #007bff;
  text-decoration: underline;
  margin: 5px;
}

.ant-modal-footer > .ant-btn-primary,
.ant-modal-footer > .ant-btn-primary:hover {
  background: #02599c;
  border-color: #02599c;
  border-radius: 5px !important;
}

.ant-tag-checkable-checked {
  background: #02599c !important;
  border-color: #02599c !important;
  border-radius: 5px !important;
}

.ant-checkbox-checked .ant-checkbox-inner {
  background: #02599c !important;
  border-color: #02599c !important;
}

.textRed {
  color: red !important;
}

.requestItemIcon {
  color: red !important;
  font-size: 18px;
}

.checkboxGroup .ant-checkbox-wrapper {
  width: 100% !important;
  margin-bottom: 15px !important;
  font-size: 16px;
}

.container { position: relative; width: 100px; height: 100px; float: left; margin-left: 10px; }
.checkbox { position: absolute; bottom: 0px; right: 0px; }
.withBorder
  { 
    border: 1px solid #1067ef ;
    padding:5px  ;
  }

  .noBorder { padding:5px }

  .ant-upload-list-picture-card-container {
    display: inline-block!important;
    width: 300px !important;
    height: 500px !important;
    margin: 0 8px 8px 0!important;
    vertical-align: top!important;
    border: 2px solid black ;
    margin-top: 65px !important;
}

.uploadButton {
  background-color: ${variables.LIGHT_BLUE} !important;
  border-color: ${variables.LIGHT_BLUE} !important;
  color: ${variables.WHITE_COLOR} !important;
  border-radius: 5px !important;
  width: 115px !important;
  height: 35px !important;
  font-size: 12px !important;

  &:hover,
  &:active,
  &:focus {
    background-color: ${variables.LIGHT_BLUE} !important;
    border-color: ${variables.LIGHT_BLUE} !important;
    color: ${variables.WHITE_COLOR} !important;
  }
  
  .uploadButtonIcon {
    top: 8px !important;
    position: absolute !important;
    left: 20px !important;
    font-size: 18px !important;
    color: ${variables.WHITE_COLOR} !important;
  }

  span:nth-child(2) {
    left: 40px !important;
  }
}

span.ant-radio + * {
  font-size: 16px;
}

.uploadDOBButton {
  background-color: ${variables.LIGHT_BLUE} !important;
  border-color: ${variables.LIGHT_BLUE} !important;
  color: ${variables.WHITE_COLOR} !important;
  border-radius: 5px !important;
  width: 250px !important;
  height: 35px !important;
  font-size: 12px !important;

  &:hover,
  &:active,
  &:focus {
    background-color: ${variables.LIGHT_BLUE} !important;
    border-color: ${variables.LIGHT_BLUE} !important;
    color: ${variables.WHITE_COLOR} !important;
  }
  
  .uploadButtonIcon {
    top: 8px !important;
    position: absolute !important;
    left: 20px !important;
    font-size: 18px !important;
    color: ${variables.WHITE_COLOR} !important;
  }

  span:nth-child(2) {
    left: 40px !important;
  }
}

.ant-btn {
  border-radius: 5px !important;
}

.editMode {
  background-color:${variables.LIGHT_GRAY_COLOR} !important ;
}

.iconStyle {
   font-size: 20px; 
   color: ${variables.PRIMARY_BLUE} !important;
}

.ant-collapse .headerTextContainer {
  font-size: 16px !important;
}

.ant-card {
  font-size: 16px !important;
}

.small,
.ant-tabs-tab {
  font-size: 16px !important;
}

.ant-form label {
  font-size: 16px !important;
}

.markSelectedButton {
  background-color: ${variables.LIGHT_BLUE} !important;
  border-color: ${variables.LIGHT_BLUE} !important;
  color: ${variables.WHITE_COLOR} !important;
  border-radius: 5px !important;
  width: 165px !important;
  height: 35px !important;

  &:hover,
  &:active,
  &:focus {
    background-color: ${variables.LIGHT_BLUE} !important;
    border-color: ${variables.LIGHT_BLUE} !important;
    color: ${variables.WHITE_COLOR} !important;
  }

  .markSelectedButtonIcon {
    top: 8px !important;
    position: absolute !important;
    left: 20px !important;
    font-size: 18px !important;
    color: ${variables.WHITE_COLOR} !important;
  }

  span:nth-child(2) {
    left: 40px !important;
  }
}

.centerComponent {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}
/********** Add Your Global CSS Here **********/

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

export default GlobalStyles;
