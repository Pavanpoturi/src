import { useState, useEffect } from "react";
import { textFieldRules } from "@components/Common/formOptions";
import { config } from "@config/site.config";
import { Row, Card, Col, Form, Input, notification } from "antd";
import { renderFieldsWithDropDown } from "@containers/FirDetails/fir-util";
import { useDispatch, useSelector } from "react-redux";
import advisoryActions from "@redux/advisoryMemo/actions";
import { loadState } from "@lib/helpers/localStorage";
import ContentHeader from "../../ContentHeader";
import { ModuleWrapper } from "@containers/FirDetails/Investigation/CommonDetails/styles";
import { advisoryForm, instructionsTo } from "./const";

const { TextArea } = Input;

export default function AdvisoryMemo({ setSelectedSiderMenu }) {
  const [form] = Form.useForm();
  const crimeId = loadState("selectedFirId");
  const dispatch = useDispatch();
  const [formValid, setFormValid] = useState(false);
  const [serchText, setSerchText] = useState("");

  const handleSearch = (text) => {
    setSerchText(text);
  };

  const { actionType, errorMessage, successMessage } = useSelector(
    (state) => state.AdvisoryMemo
  );

  const isSuccess = actionType === "CREATE_ADVISORY_MEMO_SUCCESS";
  const isError = actionType === "CREATE_ADVISORY_MEMO_ERROR";

  const { createAdvisoryMemo, resetComplianceUpdate } = advisoryActions;

  const openNotificationWithIcon = (type, message) => {
    return notification[type]({
      message: message,
    });
  };

  useEffect(() => {
    if (isSuccess || isError) {
      if (successMessage !== "") {
        openNotificationWithIcon("success", successMessage);
        form.resetFields();
        setSelectedSiderMenu("investigation");
        dispatch(resetComplianceUpdate());
      } else if (errorMessage) {
        openNotificationWithIcon("error", errorMessage);
        dispatch(resetComplianceUpdate());
      }
    }
  }, [actionType]);

  useEffect(() => {
    form.setFieldsValue({
      fromName: "Name: VASALA SATHISH, Rank: DSP (Civil), Role: SDPO/ACP",
    });
  }, []);

  const checkFields = async () => {
    const values = await form.validateFields();
    setFormValid(!Object.values(values).every((v) => v == null || v === ""));
  };

  const displayFields = (name) => {
    switch (name) {
      case "remarks":
        return (
          <TextArea
            style={{ width: 500, height: 200, resize: "none" }}
            rows={100}
            columns={10}
          />
        );
      case "instructionTo":
        return renderFieldsWithDropDown(
          instructionsTo,
          null,
          handleSearch,
          serchText,
          250,
          false
        );
      default:
        return (
          <Input
            onChange={checkFields}
            style={{ width: name === "fromName" ? 400 : 250 }}
            maxLength={textFieldRules.maxLength}
            disabled={name === "fromName" ? true : false}
          />
        );
    }
  };

  const displayState = (data, actionName) => {
    return (
      <Row className="custody-reasons-row">
        {data.map((s, i) => {
          return (
            <Col span={12} key={i} style={{ marginBottom: 20 }}>
              <Form.Item name={s.name} label={s.label}>
                {actionName(s.name)}
              </Form.Item>
            </Col>
          );
        })}
      </Row>
    );
  };

  const submit = async () => {
    const value = await form.validateFields();
    const payLoad = {
      crimeId: crimeId,
      from: "2587494",
      fromName: "VASALA SATHISH",
      fromRank: "DSP (Civil)",
      fromRole: "SDPO/ACP",
      remarks: value?.remarks,
      complyWithin: value?.complyWithin,
      instructionTo: value?.instructionTo,
      status: "Open",
    };
    dispatch(createAdvisoryMemo(config.upsertCrimeAdvisory, payLoad));
  };

  return (
    <ModuleWrapper>
      <ContentHeader
        headerTitle="Advisory Memo"
        addAnother
        addAnotherText="Add Another"
        onSubmitClick={submit}
        isInvestigation={true}
        onCancel={() => setSelectedSiderMenu("investigation")}
        disableButton={false}
      />
      <Row>
        <Card
          style={{ width: "100%", height: 500, minHeight: 500 }}
          className="cardLeftStyle"
        >
          <Form form={form} layout="vertical">
            <Col>{displayState(advisoryForm, displayFields)}</Col>
          </Form>
        </Card>
      </Row>
    </ModuleWrapper>
  );
}
