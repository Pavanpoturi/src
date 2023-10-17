import { Button, Select } from "antd";
import { useHistory } from "react-router-dom";
import { CaretDownOutlined } from "@ant-design/icons";
import { isArray, isEmpty } from "lodash";

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

export default function InterrogationContentHeader({
  headerTitle,
  onSubmitClick,
  onCancel,
  isInvestigation = false,
  handleMenuChange,
  menuList,
  onSearch,
  SetInterrogationPopUp,
  selectedAccusedValue,
  isInterrogationInitiated,
}) {
  const history = useHistory();

  const renderFieldsWithDropDown = (menuOptions) => {
    return (
      <Select
        suffixIcon={<CaretDownOutlined className="dropDownIcon" />}
        showSearch
        onSearch={onSearch}
        onChange={handleMenuChange}
        style={{ width: 250 }}
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {isArray(menuOptions) &&
          menuOptions.map((item, index) => (
            <Option key={index} value={item.key} label={item}>
              {item.label}
            </Option>
          ))}
      </Select>
    );
  };

  return (
    <div className="contentHeaderContainer">
      <div style={styles.widgetPageStyle}>
        <h2 className="pageTitle">{headerTitle}</h2>
        <div style={{ marginLeft: 40, marginTop: 5, fontSize: 16 }}>
          <label style={{ paddingRight: 10 }}>Select Modules</label>{" "}
          {renderFieldsWithDropDown(menuList)}
        </div>
      </div>
      <div>
        {isInterrogationInitiated && !isEmpty(selectedAccusedValue) && (
          <Button
            className="popupLink"
            onClick={() => SetInterrogationPopUp(true)}
            style={{ backgroundColor: "rgb(2, 89, 156)", color: "#FFF" }}
          >
            Preview
          </Button>
        )}
        <Button
          className="stepsButtonInActive"
          onClick={() =>
            isInvestigation ? onCancel() : history.push("/dashboard")
          }
        >
          Cancel
        </Button>

        <Button
          type="primary"
          className="stepsButtonActive"
          onClick={onSubmitClick}
          style={{ backgroundColor: "green" }}
        >
          DONE
        </Button>
      </div>
    </div>
  );
}
