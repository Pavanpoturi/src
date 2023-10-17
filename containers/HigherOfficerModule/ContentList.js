import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Select, List, Button, Row, Col } from "antd";
import { CaretDownOutlined } from "@ant-design/icons";
import { formOptions1, formOptions2 } from "./const";
import { useSelector, useDispatch } from "react-redux";
import { loadState } from "@lib/helpers/localStorage";
import { config } from "@config/site.config";
import reportsActions from "@redux/reports/actions";

const Option = Select.Option;

export default function ContentList() {
  const [serchText, setSerchText] = useState("");
  const [showAll, setShowAll] = useState(false);
  const location = useLocation();
  const isDashboardPath = location.pathname === "/dashboard/crime-core-dashboard";
  const formOptions = formOptions1.concat(formOptions2);
  const storedUser = loadState("currentUser");
  const { selectedDashboard } = useSelector((state) => state.Dashboard);
  const { fetchTableauReports } = reportsActions;
  const { TABLEAUReport } = useSelector((state) => state.Reports);

  const dispatch = useDispatch();
  const handleSearch = (text) => {
    setSerchText(text);
  };
  console.log("isDashboardPath", isDashboardPath)

  useEffect(() => {
    if (isDashboardPath) {
      setShowAll(true)
    }
    getToken();
  }, []);

  const getToken = () => {
    let payload = {
      code: storedUser?.ecopsv2_unit_id.toString(),
      role: storedUser?.ecopsv2_hierarchy_role,
    };
    dispatch(fetchTableauReports(config?.tableauReportData, payload));
  };

  const renderLabel = (item) => {
    let label = item.label;
    let searchString = serchText;

    if (searchString) {
      let index = label.toLowerCase().indexOf(searchString.toLowerCase());

      if (index !== -1) {
        let length = searchString.length;
        let prefix = label.substring(0, index);
        let suffix = label.substring(index + length);
        let match = label.substring(index, index + length);

        return (
          <span>
            {prefix}
            <span style={{ backgroundColor: "yellow", fontWeight: "bold" }}>
              {match}
            </span>
            {suffix}
          </span>
        );
      }
    }
    return <span>{label}</span>;
  };
  const handleClick = (item) => {
    getToken();
    var url = "";
    var topBar = "&:toolbar=top"
    url = `${config?.tableauReportUrl}/${TABLEAUReport?.message}/${item?.url}${TABLEAUReport?.encoded_url + topBar}`;
    let alink = document.createElement("a");
    alink.href = url;
    alink.target = "_blank";
    alink.click();
  };

  const displayInvistigationForms = (items) => (
    <List
      className="displayInvistigationForms"
      dataSource={items}
      renderItem={(item) => {
        return (
          <div
            className="listItems"
            style={{
              color: "#02599C",
              cursor: "pointer",
            }}
            onClick={() => handleClick(item)}
          >
            {item.label}
          </div>
        );
      }}
    />
  );

  return (
    <>
      {selectedDashboard === "crime-core-dashboard" && (
        <div className="investigationPage">
          <Row>
            <Col flex="1 1 200px">
              <Select
                suffixIcon={
                  <CaretDownOutlined
                    style={{ fontSize: 35 }}
                    onClick={() => setShowAll(!showAll)}
                  />
                }
                showSearch
                onSearch={handleSearch}
                placeholder={`${showAll ? "Select" : "Search"
                  } the form you wish to work on`}
                filterOption={(input, option) =>
                  serchText &&
                  option.props.label
                    .toString()
                    .toLowerCase()
                    .indexOf(input.toString().toLowerCase()) >= 0
                }
                onSelect={(value, event) => {
                  handleClick(event?.selectedrecord);
                }}
              >
                {formOptions.map((item) => (
                  <Option
                    key={item.value}
                    value={item.value}
                    label={item.label}
                    selectedrecord={item}
                  >
                    {renderLabel(item)}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col flex="0 1 100px">
              <Button
                type="link"
                onClick={() => setShowAll(!showAll)}
                className="invShowHideMenu"
              >
                {showAll ? "Hide Menu" : "Show Menu"}
              </Button>
            </Col>
          </Row>
        </div>
      )}
      {showAll ? (
        <Row className="invContentList">
          <Col span={4} />
          <Col span={6} style={{ marginLeft: 55 }}>
            {displayInvistigationForms(formOptions1)}
          </Col>
          <Col span={6} style={{ marginLeft: 55 }}>
            {displayInvistigationForms(formOptions2)}
          </Col>
        </Row>
      ) : null}
    </>
  );
}
