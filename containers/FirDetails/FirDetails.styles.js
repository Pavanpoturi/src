import styled from "styled-components";
import { variables } from "@assets/styles/variables";

export const FirDetailsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: auto;

  .content {
    padding-top: 150px;
  }

  .removeButton {
    border-radius: 5px;
    .removeButtonIcon {
      position: absolute;
      top: 6px;
      left: 8px;
    }
  }

  .centerAlignBtn {
    display: table;
    margin: 16px auto;
  }

  .mediaButton {
    background-color: ${variables.LIGHT_BLUE};
    border-color: ${variables.LIGHT_BLUE};
    color: ${variables.WHITE_COLOR};
    border-radius: 5px;
    width: 165px;
    height: 35px;
    font-size: 12px;

    &:hover,
    &:active,
    &:focus {
      background-color: ${variables.LIGHT_BLUE};
      border-color: ${variables.LIGHT_BLUE};
      color: ${variables.WHITE_COLOR};
    }

    .mediaButtonIcon {
      top: 8px;
      position: absolute;
      left: 20px;
      font-size: 18px;
      color: ${variables.WHITE_COLOR};
    }

    span:nth-child(2) {
      left: 40px !important;
    }
  }

  .saveButton {
    background-color: ${variables.LIGHT_BLUE};
    border-color: ${variables.LIGHT_BLUE};
    color: ${variables.WHITE_COLOR};
    border-radius: 5px;
    width: 130px;
    height: 35px;
    font-size: 16px;

    &:hover,
    &:active,
    &:focus {
      background-color: ${variables.LIGHT_BLUE};
      border-color: ${variables.LIGHT_BLUE};
      color: ${variables.WHITE_COLOR};
    }

    .saveButtonIcon {
      top: 8px;
      position: absolute;
      left: 20px;
      font-size: 18px;
      color: ${variables.WHITE_COLOR};
    }

    span:nth-child(2) {
      left: 40px !important;
    }
  }

  .uploadButtonBig {
    background-color: ${variables.LIGHT_BLUE};
    border-color: ${variables.LIGHT_BLUE};
    color: ${variables.WHITE_COLOR};
    border-radius: 5px;
    width: 185px;
    height: 35px;
    font-size: 12px;

    &:hover,
    &:active,
    &:focus {
      background-color: ${variables.LIGHT_BLUE};
      border-color: ${variables.LIGHT_BLUE};
      color: ${variables.WHITE_COLOR};
    }

    .saveButtonIcon {
      top: 8px;
      position: absolute;
      left: 20px;
      font-size: 18px;
      color: ${variables.WHITE_COLOR};
    }

    span:nth-child(2) {
      left: 40px !important;
    }
  }

  .ant-divider {
    border-top: 2px solid rgba(0, 0, 0, 0.06);
  }

  .leftRightPad {
    padding-left: 10px;
    padding-right: 10px;
  }

  .dropDownIcon {
    font-size: 14px;
    color: "#8D8D8D";
  }

  .widgetPageStyle {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    overflow: hidden;

    .crimeShownByContainer {
      min-height: 410px;
      max-height: 410px;
      overflow-y: auto;
      border: 1px solid rgb(235, 235, 235) !important;
      border-top-left-radius: 0 !important;
      border-bottom-left-radius: 0 !important;

      .ant-card-body {
        padding: 15px !important;
      }
    }
  }

  .heading {
    color: #949494;
    margin-bottom: 10px;
    font-size: 16px;
  }

  .witnessButtonActive {
    background-color: ${variables.LIGHT_BLUE};
    color: ${variables.WHITE_COLOR};
    width: 220px;
    height: 40px;
    &:hover,
    &:active,
    &:focus {
      background-color: ${variables.LIGHT_BLUE};
      color: ${variables.WHITE_COLOR};
    }
  }

  .witnessButtonInActive {
    background-color: ${variables.WHITE_COLOR};
    border-color: ${variables.DARK_GRAY};
    width: 220px;
    height: 40px;
    &:hover,
    &:active,
    &:focus {
      background-color: ${variables.PRIMARY_BLUE};
      background-color: ${variables.WHITE_COLOR};
      border-color: ${variables.DARK_GRAY};
      color: #000;
    }
  }

  .siderItemDisabled {
    text-align: left;
    height: 40px;
    background: ${variables.SIDER_GRAY};
    color: ${variables.WHITE_COLOR};
    border-radius: 5px;
    padding: 9px 12px;
  }

  .siderContainer {
    height: 100%;
    background-color: ${variables.LIGHT_GRAY};
    padding: 11px;
    font-size: 16px;
  }

  .siderItems {
    text-align: left;
    height: 40px;
    background: ${variables.LIGHT_BLUE};
    color: ${variables.WHITE_COLOR};
    border-radius: 5px;
    padding: 9px 12px;
  }

  .pageTitle {
    color: ${variables.DARK_GRAY};
  }

  .stepsButtonActive {
    background-color: ${variables.DARK_GREEN};
    border-color: ${variables.DARK_GREEN};
    border-radius: 5px;
    width: 110px;
    height: 35px;

    &:hover,
    &:active,
    &:focus {
      background-color: ${variables.DARK_GREEN};
      border-color: ${variables.DARK_GREEN};
    }
  }

  .ant-table-thead > tr > th {
    background-color: ${variables.LIGHT_BLUE} !important;
    color: ${variables.WHITE_COLOR} !important;
    font-weight: 300;
    font-size: 16px;
  }

  .stepsButtonInActive {
    margin: 0px 8px;
    background: transparent;
    color: ${variables.LIGHT_BLUE};
    border: none;
    box-shadow: none;
    font-size: 18px;

    &:hover,
    &:active,
    &:focus {
      background: transparent;
    }
  }

  .contentContainer {
    min-height: 70vh;
    background: ${variables.BG_LAYOUT_COLOR};
    padding: 10px;
  }

  .contentHeaderContainer {
    padding: 10px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    .ant-checkbox {
      top: 0.5em;
    }
  }

  .formDetails {
    padding: 10px;

    .formItem {
      background-color: ${variables.LIGHT_GRAY};
      border-radius: 5px;
      flex-direction: unset !important;

      .ant-form-item-label > label {
        height: 35px;
        margin: 5px 15px;
        min-width: 430px;
      }

      .ant-form-item-control-input {
        min-height: 45px;
      }

      .ant-switch-checked {
        background-color: ${variables.PRIMARY_BLUE};
      }
    }

    .formItem:first-child {
      margin-bottom: 20px;
    }

    .cardFormLabel {
      background-color: ${variables.LIGHT_GRAY};
      width: 100%;
      height: 40px;
      padding: 10px 15px;
      border-radius: 5px;
      margin-bottom: 0;
    }

    .ant-collapse {
      border: none;

      .panelHeader {
        background-color: ${variables.LIGHT_GRAY};
        border-radius: 5px;
        margin-bottom: 20px;
      }

      .headerTextContainer {
        display: flex;
        flex-direction: row;
      }

      .recordSelectedCount {
        padding-left: 125px;
      }

      .panelTitle {
        min-width: 200px;
      }
    }
  }

  .ant-checkbox-checked .ant-checkbox-inner {
    background-color: ${variables.LIGHT_BLUE};
    border-color: ${variables.LIGHT_BLUE};
  }

  .ant-checkbox-inner {
    width: 22px;
    height: 22px;
    border-radius: 5px;

    &:hover,
    &:focus,
    &:active {
      width: 22px;
      height: 22px;
      border: 2px solid ${variables.LIGHT_BLUE};
      border-radius: 5px;
    }
  }

  .ant-checkbox-wrapper:hover .ant-checkbox-inner,
  .ant-checkbox:hover .ant-checkbox-inner,
  .ant-checkbox-input:focus + .ant-checkbox-inner {
    border-color: ${variables.LIGHT_BLUE};
    border-radius: 5px;
  }

  .ant-checkbox-checked::after {
    /* top: 3px; */
    border: 2px solid ${variables.LIGHT_BLUE};
    border-radius: 5px;
  }

  .ant-btn > .anticon + span,
  .ant-btn > span + .anticon {
    position: absolute;
    top: 5px;
    left: 75px;
  }

  .ant-picker {
    border-radius: 5px;
  }

  .ant-picker:hover,
  .ant-picker-focused {
    border-color: ${variables.LIGHT_BLUE};
  }

  .labelGrey {
    color: ${variables.DARK_GRAY};
    padding-right: 10px;
  }

  .planOfActionsContainer {
    margin-left: 35px;

    .planOfActionsTitle {
      font-size: 16px;
      font-weight: 500;
      margin-bottom: 25px;
    }

    .planOfActionDownArrow {
      color: ${variables.LIGHT_BLUE};
      font-size: 20px;
      position: absolute;
      left: 30px;
    }

    .prefix {
      margin-right: 10px;
    }

    .contentCheckboxContainer {
      margin-bottom: 20px;
      margin-top: 10px;
    }
  }

  .generateRequestContainer {
    padding: 20px;

    .requestItemIcon {
      color: red;
      font-size: 18px;
    }

    .ant-list-split .ant-list-item {
      padding: 8px 0;
      border-bottom: none;
    }

    .uploadButton {
      background-color: ${variables.LIGHT_BLUE};
      border-color: ${variables.LIGHT_BLUE};
      border-radius: 5px;
      width: 115px;
      height: 35px;
      margin-left: 35;
      font-size: 12px;

      &:hover,
      &:active,
      &:focus {
        background-color: ${variables.LIGHT_BLUE};
        border-color: ${variables.LIGHT_BLUE};
      }

      .uploadIcon {
        top: 3px;
        position: absolute;
        left: 15px;
        font-size: 18px;
      }
    }

    .ant-btn > .anticon + span {
      position: unset;
    }

    .requestItem {
      font-size: 13px;
      color: ${variables.LIGHT_BLUE};
      text-decoration: underline;
      margin-top: 3px;
      cursor: pointer;
    }

    .requestItemArrest {
      font-size: 13px;
      color: ${variables.LIGHT_BLUE};
      text-decoration: underline;
      margin-top: 3px;
      cursor: pointer;
      width: 170px;
      float: left;
    }
  }

  .investigationPage {
    padding: 50px 0 15px 0;
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

  .courtAndProsecution .ant-card-bordered {
    border: 1px solid #91caff !important;
  }

  .courtAndProsecution .ant-card-body {
    padding-top: 10px;
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

  .ant-form-item-label {
    padding: 0px !important;
  }

  .ant-input,
  .ant-select-selector,
  .ant-picker {
    border-radius: 5px !important;
  }

  .showLess {
    height: 130px;
    max-height: 130px;
    overflow: hidden;
  }

  .textCenter {
    padding: 25%;
    width: 100%;
    height: auto;
  }

  .resetLink {
    margin-left: 3%;
    position: absolute;
    font-size: 16px;
  }

  .wordBreak {
    word-wrap: break-word;
  }

  .preCrimeForm {
    .ant-checkbox-disabled.ant-checkbox-checked .ant-checkbox-inner::after {
      border-color: #f5f5f5;
    }
  }

  .selectFile {
    background-color: ${variables.LIGHT_BLUE};
    border-color: ${variables.LIGHT_BLUE};
    color: ${variables.WHITE_COLOR};
    border-radius: 5px;
    width: 145px;
    height: 35px;
    font-size: 16px;

    &:hover,
    &:active,
    &:focus {
      background-color: ${variables.LIGHT_BLUE};
      border-color: ${variables.LIGHT_BLUE};
      color: ${variables.WHITE_COLOR};
    }

    .selectFileButtonIcon {
      top: 8px;
      position: absolute;
      left: 20px;
      font-size: 18px;
      color: ${variables.WHITE_COLOR};
    }

    span:nth-child(2) {
      left: 40px;
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

  .ant-radio-button-wrapper,
  .ant-radio-button-wrapper:hover {
    border-radius: 20px !important;
    height: 40px !important;
    text-align: center !important;
    color: unset !important;
    line-height: 40px !important;
  }

  .ant-radio-button-wrapper-checked,
  .ant-radio-button-wrapper-checked:active,
  .ant-radio-button-wrapper-checked:focus,
  .ant-radio-button-wrapper-checked:hover {
    background-color: ${variables.LIGHT_BLUE} !important;
    border-color: ${variables.LIGHT_BLUE} !important;
    color: ${variables.WHITE_COLOR} !important;
  }
  .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled)::before,
  .ant-radio-button-wrapper:not(.ant-radio-button-wrapper-disabled)::before {
    background-color: transparent !important;
  }
`;
