import { useState, useEffect } from "react";
import { Select, List, Button, Row, Col, Divider } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { isUndefined, isEmpty } from "lodash";
import { config } from "@config/site.config";
import { CaretDownOutlined } from "@ant-design/icons";
import { loadState } from "@lib/helpers/localStorage";
import createFIRActions from "@redux/createFir/actions";
import { IS_IO, IS_SHO } from "../fir-util";
import {
  investigationFormOptions,
  investigationFormOptions1,
  investigationFormOptions2,
  investigationFormOptions3,
  investigationFormOptions4,
  courtAndProsecutionMenu,
  courtAndProsecutionLeftMenu,
  courtAndProsecutionRightMenu,
} from "../Constants";

const Option = Select.Option;

export default function Investigation({
  setSelectedSiderMenu,
  setSelectedInvestigationFormObj,
}) {
  const [serchText, setSerchText] = useState("");
  const [showAll, setShowAll] = useState(false);
  const dispatch = useDispatch();
  const currentUser = loadState("currentUser");

  const crimeId = loadState("selectedFirId");
  const { savedFir } = useSelector((state) => state.createFIR);
  const { getFIRData } = createFIRActions;

  const handleSearch = (text) => {
    setSerchText(text);
  };

  useEffect(() => {
    dispatch(getFIRData(`${config.getFIR}?crimeId=${crimeId}`));
  }, []);

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

  const investigationLists = investigationFormOptions;
  const investigationFormSet2 = investigationFormOptions2;
  const isSuperiorOfficersCreated = savedFir?.isSuperiorOfficersCreated;

  const changeColor = (item, enableOtherLinks, enableTransferOfCase) => {
    const checkFir = savedFir?.getCrimeDetails;
    if (checkFir?.[item.value]) {
      return "green";
    } else if (enableOtherLinks || enableTransferOfCase) {
      return "#02599c";
    } else {
      return "#A8A8A8";
    }
  };

  const displayInvistigationForms = (items) => (
    <List
      className="displayInvistigationForms"
      dataSource={items}
      renderItem={(item) => {
        const enableTransferOfCase =
          item.enabled &&
          item.value === "transferOfCaseFile" &&
          isSuperiorOfficersCreated;
        const enableOtherLinks = item.enabled;
        return (
          <div
            className="listItems"
            onClick={() => {
              if (enableOtherLinks || enableTransferOfCase) {
                setSelectedSiderMenu(item.value);
                setSelectedInvestigationFormObj(item);
              }
            }}
            style={{
              color: changeColor(item, enableOtherLinks, enableTransferOfCase),
              cursor:
                enableOtherLinks || enableTransferOfCase
                  ? "pointer"
                  : "not-allowed",
            }}
          >
            {item.label}
            {item.isDivider && <Divider />}
          </div>
        );
      }}
    />
  );

  const menuOptions = investigationLists.filter((s) => s.enabled);
  const nonSHO = ["transferOfCaseFile", "reassignmentOfCase"];
  const nonSHOList = menuOptions.filter(
    (item) => !nonSHO?.includes(item.value)
  );

  const finalList =
    currentUser.emp_role_name === IS_SHO ||
    currentUser.emp_role_name === IS_IO ||
    currentUser.ecopsv2_role === "INVESTIGATION OFFICER" ||
    (!isUndefined(currentUser.emp_role_name_multiple) &&
      currentUser.emp_role_name_multiple.includes("INVESTIGATION OFFICER"))
      ? menuOptions
      : nonSHOList;

  return (
    <>
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
              placeholder={`${
                showAll ? "Select" : "Search"
              } the form you wish to work on`}
              filterOption={(input, option) =>
                serchText &&
                option.props.label
                  .toString()
                  .toLowerCase()
                  .indexOf(input.toString().toLowerCase()) >= 0
              }
              onSelect={(value, event) => {
                setSelectedSiderMenu(value);
                setSelectedInvestigationFormObj(event.selectedrecord);
              }}
            >
              {finalList.map((item) => (
                <Option
                  key={item.value}
                  value={item.value}
                  label={item.label}
                  selectedrecord={item}
                  // disabled={isSuperiorOfficersCreated ? true : false}
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
      {showAll ? (
        <Row className="invContentList">
          <Col span={6}>
            {displayInvistigationForms(investigationFormOptions1)}
          </Col>
          <Col span={6}>{displayInvistigationForms(investigationFormSet2)}</Col>
          <Col span={6}>
            {displayInvistigationForms(investigationFormOptions3)}
          </Col>
          <Col span={6}>
            {currentUser.emp_role_name === IS_SHO ||
            currentUser.emp_role_name === IS_IO ||
            currentUser.ecopsv2_role === "INVESTIGATION OFFICER" ||
            (!isUndefined(currentUser.emp_role_name_multiple) &&
              currentUser.emp_role_name_multiple.includes(
                "INVESTIGATION OFFICER"
              ))
              ? displayInvistigationForms(investigationFormOptions4)
              : displayInvistigationForms(
                  investigationFormOptions4.filter(
                    (item) => !nonSHO?.includes(item.value)
                  )
                )}
          </Col>
        </Row>
      ) : null}
    </>
  );
}

export function CourtAndProsecution({
  setSelectedSiderMenu,
  setSelectedInvestigationFormObj,
}) {
  const [serchText, setSerchText] = useState("");
  const [showAll, setShowAll] = useState(false);
  const renderCourtAndProsecutionLabel = (item) => {
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

  const handleSearch = (text) => {
    setSerchText(text);
  };

  const displayCourtAndProsecutionForms = (items) => (
    <List
      className="displayInvistigationForms courtAndProsecution"
      dataSource={items}
      disabled={true}
      renderItem={(item) => {
        return (
          <div
            className="listItems"
            onClick={() => {
              setSelectedSiderMenu(item.value);
              setSelectedInvestigationFormObj(item);
            }}
          >
            {item.label}
          </div>
        );
      }}
    />
  );

  return (
    <>
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
              placeholder={`${"Search"} the form you wish to work on`}
              filterOption={(input, option) =>
                serchText &&
                option.props.label
                  .toString()
                  .toLowerCase()
                  .indexOf(input.toString().toLowerCase()) >= 0
              }
              onSelect={(value, event) => {
                setSelectedSiderMenu(value);
                setSelectedInvestigationFormObj(event.selectedrecord);
              }}
            >
              {courtAndProsecutionMenu.map((item) => (
                <Option
                  key={item.value}
                  value={item.value}
                  label={item.label}
                  selectedrecord={item}
                >
                  {renderCourtAndProsecutionLabel(item)}
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
      <Row className="invContentList" style={{ marginLeft: 230 }}>
        <Col span={6}>
          {showAll
            ? displayCourtAndProsecutionForms(courtAndProsecutionLeftMenu)
            : null}
        </Col>
        <Col span={10}>
          {showAll
            ? displayCourtAndProsecutionForms(courtAndProsecutionRightMenu)
            : null}
        </Col>
      </Row>
    </>
  );
}
