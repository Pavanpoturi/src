import React, { useState, useEffect } from "react";
import { Form, Col, Divider, Card, Button, List } from "antd";
import { DeleteOutlined, SaveOutlined } from "@ant-design/icons";
import { isEmpty, isNull, isUndefined } from "lodash";
import StandardPersonalForm from "@components/Common/standardPersonalForm";
import StandardContactForm from "@components/Common/standardContactForm";
import CrimeSceneShownByCard from "./CrimeSceneFormCard/CrimeSceneShownByCard";
import { FormWidgetWrapper } from "./FormWidgetWrapper.styles";
import { useSelector } from "react-redux";
import { getSavedDataResult } from "../fir-util";
import SavedRecords from "./SavedRecords";

export default function CrimeSceneShown({
  removePersonDetails,
  addPersonDetails,
  handleSubmit,
  handleRemove,
  personDetails,
  setpersonDetails,
  noninternalPersonDetailsData,
  disableEdit,
}) {
  const formRef = React.createRef();
  const [form] = Form.useForm();
  const [age, setAge] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [personTypeId, setPersonTypeId] = useState(null);
  const [crimeShownByList, setCrimeShownByList] = useState([]);
  const [personType, setPersonType] = useState("Complainant");
  const [items, setItems] = useState(
    noninternalPersonDetailsData ? noninternalPersonDetailsData : []
  );
  const [formValid, SetFormValid] = useState(false);
  const { savedFir } = useSelector((state) => state.createFIR);
  const [showRadioOnchange, setShowRadioOnchange] = useState(false);
  const personDetailsSelected = (value, checked, personType) => {
    let crimeShownData = [];
    !isEmpty(personDetails) &&
      personDetails.map((person) => {
        crimeShownData.push({ ...person, checked: true });
      });
    setpersonDetails(crimeShownData);
    checked
      ? handleSubmit(value, "crimeShown", personType)
      : handleRemove(value, "crimeShown", personType);
  };

  const cancelForm = () => {
    setShowForm(false);
    SetFormValid(false);
    setPersonType("");
    form.resetFields();
    setAge("");
  };

  const onFinish = (values) => {
    var personObj = {
      person: {
        internalFlag: true,
        personalDetails: values,
        contactDetails:
          values.phoneNumber || values.emailId
            ? [
                {
                  phoneNumber: values.phoneNumber,
                  emailId: values.emailId,
                },
              ]
            : [],
      },
      selectedPersonType: personType,
      personType: [personTypeId],
    };
    setItems((prevItems) => [...prevItems, personObj]);
    addPersonDetails(personObj);
    form.resetFields();
    setAge("");
    SetFormValid(false);
  };

  const removePerson = (index) => {
    const list = [...items];
    list.splice(index, 1);
    setItems(list);
    removePersonDetails(index);
  };

  const checkFields = async () => {
    const values = await form.validateFields();
    SetFormValid(
      (typeof values.name === "string" &&
        values.name.trim() !== "" &&
        typeof values.surname === "string" &&
        values.surname.trim() !== "") ??
        !Object.values(values).every(
          (v) => v == null || (typeof v === "string" && v.trim() === "")
        )
    );
  };

  useEffect(() => {
    if (!isEmpty(noninternalPersonDetailsData)) {
      setCrimeShownByList(noninternalPersonDetailsData);
    }
  }, [noninternalPersonDetailsData]);

  const formDisplay = (val, label) => {
    setPersonType(label);
    switch (label) {
      case "Complainant":
        setCrimeShownByList(savedFir?.complainantDetails);
        break;
      case "Accused":
        const filterAccusedDetails =
          !isEmpty(savedFir?.accusedDetails) &&
          savedFir?.accusedDetails.filter(
            (s) =>
              s.isSuspectOrAccused !== "No Accused" &&
              s.isSuspectOrAccused !== "Unknown"
          );
        setCrimeShownByList(filterAccusedDetails);
        break;
      case "Victim":
        const filterVictimDetails =
          !isEmpty(savedFir?.victimDetails) &&
          savedFir?.victimDetails.filter((s) => s.victimType === "Victim");
        setCrimeShownByList(filterVictimDetails);
        break;
      case "Others":
        const result =
          !isEmpty(noninternalPersonDetailsData) &&
          noninternalPersonDetailsData.filter(
            (s) => s.person.internalFlag === true
          );
        setCrimeShownByList(result);
        break;
      default:
        setCrimeShownByList(noninternalPersonDetailsData);
    }
    setPersonTypeId(val);
    setShowForm(false);
  };

  const getSavedDetailsData = () => {
    let savedData = [];
    !isEmpty(crimeShownByList) &&
      crimeShownByList.map((data) => {
        const { personalDetails, presentAddress, media } =
          !isNull(data?.person) && !isUndefined(data?.person) && data?.person;
        savedData.push(
          getSavedDataResult(data, personalDetails, presentAddress, media)
        );
      });
    return savedData;
  };

  return (
    <div className="widgetPageStyle">
      <Col span={personType === "" ? 24 : 12}>
        <CrimeSceneShownByCard
          checkBoxData={personDetails}
          checkBoxSelected={personDetailsSelected}
          minHeight={410}
          hideButton={true}
          setPersonType={(val, label) => formDisplay(val, label)}
          personType={personType}
          disableEdit={disableEdit}
          isSearchRequired={true}
          setShowRadioOnchange={setShowRadioOnchange}
        />
      </Col>
      {personType !== "" && personType !== "Others" ? (
        <Col span={12}>
          <Card className="crimeShownByContainer">
            <div style={{ margin: 10 }}>
              <SavedRecords
                dataSource={getSavedDetailsData()}
                addPersonDetails={addPersonDetails}
                personDetailsSelected={personDetailsSelected}
                personType={personType}
                showRadioOnchange={showRadioOnchange}
              />
            </div>
          </Card>
        </Col>
      ) : null}
      {showForm ? (
        <Card className="crimeShownByContainer">
          {personType !== "" && personType === "Others" && !isEmpty(items) && (
            <div style={{ marginBottom: 10 }}>
              <List
                header={<div>Person Details</div>}
                className="demo-loadmore-list"
                itemLayout="horizontal"
                dataSource={items}
                renderItem={(item, index) => (
                  <List.Item
                    actions={[
                      !disableEdit && (
                        <DeleteOutlined
                          onClick={() => removePerson(index)}
                          style={{ color: "red" }}
                        />
                      ),
                    ]}
                    className="wordBreak"
                  >
                    <Col span={8}>{item.person?.personalDetails?.name}</Col>
                    <Col span={8}>{item.person?.personalDetails?.surname}</Col>
                  </List.Item>
                )}
              />
              <Divider />
            </div>
          )}
          {personType === "Others" && !disableEdit && (
            <Form
              form={form}
              ref={formRef}
              name="control-ref"
              layout="vertical"
              onFinish={onFinish}
            >
              <div className="heading">Add Person Details</div>
              <StandardPersonalForm
                showMoreOption={true}
                colWidth={12}
                changeValue={checkFields}
                age={age}
                setAge={setAge}
                formName={form}
              />
              <StandardContactForm colWidth={12} changeValue={checkFields} />
              <Divider />
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="saveButton"
                  icon={<SaveOutlined className="saveButtonIcon" />}
                  disabled={!formValid}
                >
                  Submit
                </Button>
                <span className="linkStyle resetLink" onClick={cancelForm}>
                  Cancel
                </span>
              </Form.Item>
            </Form>
          )}
        </Card>
      ) : (
        personType === "Others" &&
        !disableEdit && (
          <FormWidgetWrapper>
            <Col span={24}>
              <Button
                type="link"
                style={{ padding: "25%" }}
                onClick={() => setShowForm(true)}
                className="addExternalLink"
              >
                <div className="addExternalLinkText">
                  Click to Add Crime Scene shown
                </div>
              </Button>
            </Col>
          </FormWidgetWrapper>
        )
      )}
    </div>
  );
}
