import { arrrestPersonQuestions } from "@components/Common/formOptions";
import { useEffect } from "react";
import { Row, Col, Form, Radio, Card, Input } from "antd";

export default function ArrestPersonQuestions(props) {
  const {
    disabled,
    checkFields,
    questionDetails,
    setQuestionDetails,
    questionsBoolen,
    setQuestionsBoolen,
    selectedRecord,
  } = props;

  useEffect(() => {
    let test = [false, false, false, false, false, false, false, false, false];
    const policeRecords = selectedRecord?.arrestByPolice?.policeRecords;
    if (policeRecords?.isDangerous) {
      const questionsBoolenData = [...questionsBoolen];
      test[0] = true;
    }
    if (policeRecords?.previouslyJumpedAnyBail) {
      const questionsBoolenData = [...questionsBoolen];
      test[1] = true;
    }
    if (policeRecords?.isGenerallyArmed) {
      const questionsBoolenData = [...questionsBoolen];
      test[2] = true;
    }
    if (policeRecords?.operatesWithAccomplices) {
      const questionsBoolenData = [...questionsBoolen];
      test[3] = true;
    }
    if (policeRecords?.isKnownCriminal) {
      const questionsBoolenData = [...questionsBoolen];
      test[4] = true;
    }
    if (policeRecords?.isRecidivist) {
      const questionsBoolenData = [...questionsBoolen];
      test[5] = true;
    }
    if (policeRecords?.isLikelyToJumpBail) {
      const questionsBoolenData = [...questionsBoolen];
      test[6] = true;
    }
    if (policeRecords?.likelyToCommitCrime) {
      const questionsBoolenData = [...questionsBoolen];
      test[7] = true;
    }
    if (policeRecords?.isWantedInOtherCase) {
      const questionsBoolenData = [...questionsBoolen];
      test[8] = true;
    }
    setQuestionsBoolen(test);
  }, [selectedRecord]);

  const handleChecked = async (e, i) => {
    console.log(questionsBoolen);
    const questionsBoolenData = [...questionsBoolen];
    questionsBoolenData[i] = e.target.value;
    await setQuestionsBoolen(questionsBoolenData);
    checkFields();
  };

  const handleDetails = (value, i) => {
    const questionDetailsData = [...questionDetails];
    questionDetailsData[i] = value;
    setQuestionDetails(questionDetailsData);
  };

  return (
    <Card style={{ marginTop: 20 }}>
      <h3>
        <b>
          Whether the arrested person, as per observation and known police
          records
        </b>
      </h3>
      <br />
      {arrrestPersonQuestions.map((s, i) => {
        return (
          <Row gutter={24} key={i} style={{ marginBottom: "4px" }}>
            <Col span={5}>
              <Form.Item name={s.name}>
                <Radio.Group
                  buttonStyle="solid"
                  value={questionsBoolen[i]}
                  disabled={disabled}
                  onChange={(e) => handleChecked(e, i)}
                >
                  <Radio value={true}>Yes</Radio>
                  <Radio value={false}>No</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={10} style={{ marginTop: 3 }}>
              <span>{s.label}</span>
            </Col>
            {!!questionsBoolen[i] ? (
              <Col span={6}>
                <Form.Item name={s.name + "Details"}>
                  <Input
                    onChange={(value) => {
                      handleDetails(value, i);
                    }}
                    value={questionDetails[i]}
                    disabled={disabled}
                    style={{ width: 250 }}
                    placeholder="Provide Details"
                  />
                </Form.Item>
              </Col>
            ) : null}
          </Row>
        );
      })}
    </Card>
  );
}
