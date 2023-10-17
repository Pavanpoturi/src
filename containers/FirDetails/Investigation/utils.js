import { Select } from "antd";
import { CaretDownOutlined } from "@ant-design/icons";
import { isArray } from "lodash";

const Option = Select.Option;

export const renderDecesedDropDown = (
  menuOptions,
  selectAction,
  width,
  id,
  disabled = false,
  multiple = null,
  handleSearch,
  serchText
) => {
  return (
    <Select
      suffixIcon={<CaretDownOutlined className="dropDownIcon" />}
      showSearch
      onSearch={handleSearch}
      mode={multiple}
      filterOption={(input, option) =>
        serchText &&
        option.props.label
          .toString()
          .toLowerCase()
          .indexOf(input.toString().toLowerCase()) >= 0
      }
      style={{ width: width || 250 }}
      onSelect={(item, option) => {
        selectAction && selectAction(item);
      }}
      disabled={disabled}
    >
      {isArray(menuOptions) &&
        menuOptions.map((item, index) => (
          <Option
            key={index}
            value={id ? item._id : item.label}
            label={item.label}
            arrestprocess={item.arrestProcess}
          >
            {item.label}
          </Option>
        ))}
    </Select>
  );
};
