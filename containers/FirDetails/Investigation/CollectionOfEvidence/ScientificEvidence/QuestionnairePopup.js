import { useState, useEffect, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Modal, Checkbox, Input } from "antd";
import { isString, isArray, first } from "lodash";
import { config } from "@config/site.config";
import masterDataActions from "@redux/masterData/actions";

export default function QuestionnairePopup({
  isQuestionnaireOpen = false,
  onQuestionnaireOk,
  onQuestionnaireCancel,
  selectedType,
  defaultValue = {},
  isDisabled = false,
}) {
  const [isOtherQuestion, setIsOtherQuestion] = useState(false);
  const { FSLQuestionnairie } = useSelector((state) => state.MasterData);
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(masterDataActions.getFSLQuestionnairie(config.getQuestionnairie));
  }, []);

  useEffect(() => {
    if (isQuestionnaireOpen) {
      const { selectedQuestions = [], otherQuestions = [] } = defaultValue;

      const values = {};
      if (isArray(otherQuestions) && isString(first(otherQuestions))) {
        values.otherQuestion = first(otherQuestions);
        setIsOtherQuestion(true);
      } else setIsOtherQuestion(false);
      if (isArray(selectedQuestions)) values.questionsArray = selectedQuestions;

      form.setFieldsValue(values);
    }
  }, [isQuestionnaireOpen]);

  const filterdQuestionnairie = useMemo(() => {
    if (isArray(FSLQuestionnairie)) {
      const filteredList = FSLQuestionnairie.filter((question) =>
        compareStringArray(question?.type, selectedType)
      );
      return filteredList.map((ele) => ({
        label: ele?.question,
        value: ele?._id, // TODO: need to check
      }));
    }
    return [];
  }, [FSLQuestionnairie, selectedType]);

  const onOk = useCallback(() => {
    const formValues = form.getFieldsValue(true);
    const payload = {
      selectedQuestions: formValues?.questionsArray,
      isOtherQuestion: isOtherQuestion,
      otherQuestion: isOtherQuestion ? formValues?.otherQuestion || "" : "",
    };
    onQuestionnaireOk(payload);
    form.resetFields();
  }, [onQuestionnaireOk, isOtherQuestion]);

  return (
    <Modal
      title="FSL Questionnairie"
      visible={isQuestionnaireOpen}
      onOk={onOk}
      onCancel={onQuestionnaireCancel}
    >
      <Form form={form}>
        <Form.Item name="questionsArray">
          <Checkbox.Group
            options={filterdQuestionnairie}
            disabled={isDisabled}
          />
        </Form.Item>
        <Form.Item name="isOtherQuestion">
          <Checkbox
            onChange={(e) => setIsOtherQuestion(e?.target?.checked)}
            checked={isOtherQuestion}
            disabled={isDisabled}
          >
            Other
          </Checkbox>
        </Form.Item>
        <Form.Item name="otherQuestion" hidden={!isOtherQuestion}>
          <Input placeholder="Other Question" disabled={isDisabled} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

const compareStringArray = (strArr1, strArr2) => {
  if (isString(strArr1)) {
    if (isString(strArr2))
      return strArr1.toLowerCase() === strArr2.toLowerCase();
    else if (isArray(strArr2))
      return strArr2.some((s2) => s2.toLowerCase() === strArr1.toLowerCase());
  } else if (isArray(strArr1)) {
    if (isString(strArr2))
      return strArr1.some((s1) => s1.toLowerCase() === strArr2.toLowerCase());
    else if (isArray(strArr2))
      return strArr1.some((s1) =>
        strArr2.some((s2) => s1.toLowerCase() === s2.toLowerCase())
      );
  }
  return false;
};
