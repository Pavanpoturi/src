import { useCallback, useMemo, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Form, Row, Card, Divider, Col, Input } from "antd";
import { isEmpty, isPlainObject } from "lodash";
import { config } from "@config/site.config";
import interrogationReportActions from "@redux/investigations/interrogationReport/actions";
import { loadState } from "@lib/helpers/localStorage";
import { SaveButton } from "./SharedComponents";
import { mandatoryCheck } from "./util";

export default function TimeSinceAndModusOperandi({
  isViewOnlyMode = true,
  selectedAccused = "",
  selectedInterrogation = {},
}) {
  const [form] = Form.useForm();

  const dispatch = useDispatch();

  const crimeId = useMemo(() => loadState("selectedFirId"), []);

  useEffect(() => {
    if (!isEmpty(selectedInterrogation)) {
      const { timeSince = {} } = selectedInterrogation;
      if (isPlainObject(timeSince) && !isEmpty(timeSince)) {
        form.setFieldsValue(timeSince);
      } else form.resetFields();
    }
  }, [selectedInterrogation]);

  const onSave = useCallback(async () => {
    const isMandatoryFilled = await mandatoryCheck(form);

    if (isMandatoryFilled) {
      const formData = await form.getFieldsValue();

      const payload = {
        crimeId: crimeId,
        person: selectedAccused,
        timeSince: formData,
      };

      if (selectedInterrogation?._id) {
        payload._id = selectedInterrogation?._id;
        dispatch(
          interrogationReportActions.updateInterrogationReportDetails(
            config.interrogation,
            payload
          )
        );
      } else {
        dispatch(
          interrogationReportActions.addInterrogationReportDetails(
            config.interrogation,
            payload
          )
        );
      }
    }
  }, [selectedAccused, selectedInterrogation]);

  return (
    <Card style={{ width: "100%" }}>
      <Form form={form} layout="vertical">
        <Row gutter={[24, 12]} align="top">
          <Col span={24}>
            <Form.Item name="notes" label="Notes" rules={[{ required: true }]}>
              <Input.TextArea rows={6} disabled={isViewOnlyMode} />
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <Divider />

      <SaveButton isDisabled={isViewOnlyMode} onClick={onSave} />
    </Card>
  );
}
