import { Checkbox, Button, Select } from "antd";
import { useHistory } from "react-router-dom";
import moment from "moment";
import { DoubleRightOutlined, CaretDownOutlined } from "@ant-design/icons";
import { isArray } from "lodash";
import { DATE_FORMAT } from "@containers/FirDetails/fir-util";
import { useDispatch } from "react-redux";
import firActions from "@redux/fir/actions";

const Option = Select.Option;

const styles = {
  widgetPageStyle: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    overflow: "hidden",
  },
  widgetColumnStyle: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    overflow: "hidden",
    marginLeft: 20,
  },
};
export default function ContentHeader({
  savedFir,
  headerTitle,
  onSubmitClick,
  addAnother = false,
  addAnotherText,
  disableButton,
  historyDropdown,
  historyOptions,
  getHistory,
  setAddAnother,
  onCancel,
  isInvestigation = false,
}) {
  const history = useHistory();
  const dispatch = useDispatch();
  const { updateDashboardData, updateSelectedWidget, updateDashboardTopBar } =
    firActions;
  const disableForm =
    savedFir?.caseStatus === "Disposal" ||
    savedFir?.isTransferOfCaseFile === true ||
    savedFir?.isChargeSheetTakenOrFiled === true;
  const renderFieldsWithDropDown = (menuOptions) => {
    return (
      <Select
        suffixIcon={<CaretDownOutlined className="dropDownIcon" />}
        showSearch
        onSelect={(value) => getHistory(value)}
        style={{ width: 180 }}
      >
        {isArray(menuOptions) &&
          menuOptions.map((item, index) => (
            <Option key={index} value={item} label={item}>
              <span>
                {item && moment(item).isValid() ? (
                  <>{moment(item).format(DATE_FORMAT)}</>
                ) : (
                  "Now"
                )}
              </span>
            </Option>
          ))}
      </Select>
    );
  };

  return (
    <div
      className="contentHeaderContainer"
      style={{
        padding: 10,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <div style={styles.widgetPageStyle}>
        <h2 className="pageTitle" style={{ color: "#454647" }}>
          {headerTitle}
        </h2>
        {historyDropdown && (
          <div style={{ marginLeft: 40, marginTop: 5, fontSize: 16 }}>
            <label style={{ paddingRight: 10 }}>Past Records : </label>{" "}
            {renderFieldsWithDropDown(historyOptions)}
          </div>
        )}
      </div>
      <div>
        {addAnother && (
          <Checkbox
            onChange={(e) => setAddAnother(e.target.checked)}
            disabled={disableButton}
          >
            {addAnotherText}
          </Checkbox>
        )}
        <Button
          className="stepsButtonInActive"
          style={{
            background: "transparent",
            color: "#02599C",
            border: "none",
            boxShadow: "none",
          }}
          onClick={() => {
            if (isInvestigation) {
              onCancel();
            } else {
              dispatch(updateDashboardTopBar(false));
              dispatch(updateDashboardData(true));
              dispatch(updateSelectedWidget(""));
              localStorage.removeItem("selectedFir");
              localStorage.removeItem("selectedActDetails");
              localStorage.removeItem("selectedCaseStatus");
              localStorage.removeItem("selectedFirId");
              localStorage.removeItem("selectedDraftedFirId");
              history.push("/dashboard");
            }
          }}
        >
          Cancel
        </Button>
        <Button
          type="primary"
          className="stepsButtonActive"
          style={{ backgroundColor: "#258C0B", borderColor: "#258C0B" }}
          onClick={onSubmitClick}
          disabled={disableButton || disableForm}
        >
          Submit
          <DoubleRightOutlined />
        </Button>
      </div>
    </div>
  );
}
