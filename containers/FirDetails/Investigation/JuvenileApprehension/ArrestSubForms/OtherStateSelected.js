import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Col, Input, Form, Card, Row, DatePicker } from "antd";
import { isUndefined, isEmpty, isArray } from "lodash";
import moment from "moment";
import { textFieldRules } from "@components/Common/formOptions";
import { setRules, disableFutureDates } from "@components/Common/helperMethods";
import {
  DATE_FORMAT,
  getStaffsDetails,
  getStateNames,
} from "@containers/FirDetails/fir-util";
import { arrestForms } from "../const";

export default function OtherStateSelected(props) {
  const {
    renderFieldsWithDropDown,
    disabled,
    checkFields,
    setOtherStateSelected,
    otherStateSelected,
    selectedRecord,
  } = props;

  const [staffMembers, setStaffMembers] = useState([]);

  useEffect(() => {
    if (selectedRecord) {
      const { arrestByOtherPolice } =
        !isUndefined(selectedRecord) && selectedRecord;
      setOtherStateSelected(arrestByOtherPolice?.otherStateSelect);
    }
  }, [selectedRecord]);

  const { staffList, statesNameList } = useSelector(
    (state) => state.MasterData
  );

  useEffect(() => {
    // To resolve staffList getting called twice in same screen
    // sets staffMembers useState only once
    if (isArray(staffList) && !isEmpty(staffList))
      if (isEmpty(staffMembers)) setStaffMembers(getStaffsDetails(staffList));
  }, [staffList]);

  const nonStateList =
    !isUndefined(statesNameList) &&
    !isEmpty(statesNameList) &&
    statesNameList.filter((s) => s.STATE !== "Telangana");

  const displayFormItemsByName = (name, width) => {
    switch (name) {
      case "otherStateSelect":
        return renderFieldsWithDropDown(
          getStateNames(nonStateList),
          setOtherStateSelected,
          width,
          false,
          disabled
        );
      case "requestedOn":
        return (
          <span style={{ fontWeight: 500 }}>
            {moment().format(DATE_FORMAT)}
          </span>
        );
      case "requestedStatus":
        return <span style={{ fontWeight: 500 }}></span>;
      case "recievedOn":
        return <span style={{ fontWeight: 500 }}></span>;
      case "selectTeamToGoOutOfState":
        return renderFieldsWithDropDown(
          staffMembers,
          null,
          width,
          false,
          disabled,
          "multiple"
        );
      case "dateOfTravelToOtherState":
        return (
          <DatePicker
            format={DATE_FORMAT}
            onChange={checkFields}
            style={{ width: width }}
            disabled={true}
            disabledDate={disableFutureDates}
          />
        );
      default:
        return (
          <Input
            onChange={checkFields}
            style={{ width: width }}
            maxLength={textFieldRules.maxLength}
            disabled={disabled}
          />
        );
    }
  };

  return (
    <Card className="widgetPageStyle" style={{ marginTop: 20 }}>
      <Row glutter={24}>
        <Col span={6} style={{ marginBottom: 10, maxWidth: "100% " }}>
          <Form.Item
            name="otherStateSelect"
            label="If Other State, Select State"
            rules={setRules("dropdown")}
            style={{ paddingRight: 10 }}
          >
            {displayFormItemsByName("otherStateSelect", 200)}
          </Form.Item>
        </Col>
      </Row>
      <Row glutter={24} style={{ width: 1200 }}>
        {otherStateSelected && (
          <Col span={6} style={{ marginBottom: 10 }}>
            <Form.Item
              name="selectTeamToGoOutOfState"
              label="Select Team to go out of State"
              rules={setRules("selectTeamToGoOutOfState")}
              style={{ paddingRight: 10 }}
            >
              {displayFormItemsByName("selectTeamToGoOutOfState", 200)}
            </Form.Item>
          </Col>
        )}
        {otherStateSelected && selectedRecord && (
          <Col span={6} style={{ marginBottom: 10 }}>
            <div>
              <label style={{ paddingRight: 10, color: "green", width: 150 }}>
                Requested On{" "}
              </label>
              <span style={{ fontWeight: 500 }}>
                {moment().format(DATE_FORMAT)}
              </span>
            </div>
            <div>
              <label style={{ paddingRight: 10, color: "green", width: 150 }}>
                Requested Status{" "}
              </label>
              <span style={{ fontWeight: 500 }}></span>
            </div>
            <div>
              <label style={{ paddingRight: 10, color: "green", width: 150 }}>
                Recieved On{" "}
              </label>
              <span style={{ fontWeight: 500 }}></span>
            </div>
          </Col>
        )}

        {otherStateSelected &&
          selectedRecord &&
          arrestForms.otherStateSelected.map((s, i) => {
            return s.type === "label" ? (
              <Col span={6} key={i} style={{ marginBottom: 10 }}>
                <Form.Item
                  name={s.name}
                  label={s.label}
                  rules={setRules(s.type)}
                  style={{ paddingRight: 10 }}
                >
                  {displayFormItemsByName(s.name, 200)}
                </Form.Item>
              </Col>
            ) : (
              s.type !== "label" && (
                <Col span={6} key={i} style={{ marginBottom: 10 }}>
                  <Form.Item
                    name={s.name}
                    label={s.label}
                    rules={setRules(s.type)}
                    style={{ paddingRight: 10 }}
                  >
                    {displayFormItemsByName(s.name, 200)}
                  </Form.Item>
                </Col>
              )
            );
          })}
      </Row>
    </Card>
  );
}
