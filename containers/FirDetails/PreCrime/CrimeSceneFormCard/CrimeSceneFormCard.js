import { useState } from "react";
import { isEmpty } from "lodash";
import { Input, Checkbox } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { CrimeSceneFormCardWrapper } from "./CrimeSceneFormCard.styles";
import { textFieldRules } from "@components/Common/formOptions";

export default function CrimeSceneFormCard(props) {
  const { isSearchRequired, checkBoxData, minHeight } = props;
  const [searchText, setSearchText] = useState("");
  const onChange = (e) => setSearchText(e.target.value);
  const searchResult =
    isSearchRequired &&
    ((isEmpty(searchText) &&
      checkBoxData.filter((x) => x.checked).length > 0) ||
    props.title !== "ExpertTeam"
      ? !isEmpty(searchText) &&
        checkBoxData.filter((data) => {
          return data.employeeName
            .replace(/\s+/g, " ")
            .toLowerCase()
            .includes(searchText.toLowerCase());
        })
      : !isEmpty(searchText) &&
        checkBoxData.filter((data) => {
          return data.label
            .replace(/\s+/g, " ")
            .toLowerCase()
            .includes(searchText.toLowerCase());
        }));

  const displaySearchResult = (dataItem) => {
    return (
      !isEmpty(dataItem) &&
      dataItem.map((data, index) => (
        <div key={index}>
          <Checkbox
            style={{ padding: 5 }}
            onClick={(e) => props.checkBoxSelected(data, e.target.checked)}
            checked={data.checked}
            disabled={data.disabled || props.disableEdit}
          />{" "}
          {props.title === "SeniorOfficer"
            ? data.empRoleName
            : props.title === "ExpertTeam"
            ? data.label
            : data.employeeName}
        </div>
      ))
    );
  };

  return (
    <CrimeSceneFormCardWrapper
      className="followUpWidget"
      style={{ width: "100%", minHeight: minHeight }}
    >
      <div style={{ padding: 30 }}>
        {isSearchRequired && (
          <Input
            maxLength={textFieldRules.maxLength}
            placeholder="Search"
            onChange={onChange}
            disabled={props.disableEdit}
            style={{ width: 250, marginBottom: 15 }}
            suffix={
              <SearchOutlined
                className="site-form-item-icon"
                disabled={props.disableEdit}
              />
            }
          />
        )}
        <div
          style={{
            minHeight: minHeight - 200,
            maxHeight: 300,
            overflowY: "auto",
          }}
        >
          {checkBoxData?.filter((x) => x.checked).length > 0 &&
          isEmpty(searchText) &&
          isSearchRequired
            ? displaySearchResult(checkBoxData?.filter((x) => x.checked))
            : isSearchRequired || searchResult
            ? displaySearchResult(searchResult)
            : displaySearchResult(checkBoxData)}
        </div>
      </div>
    </CrimeSceneFormCardWrapper>
  );
}
