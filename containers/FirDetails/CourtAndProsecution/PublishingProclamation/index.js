/* eslint-disable array-callback-return */
import { useState, useEffect } from "react";
import { Row, Col, Form, DatePicker, Input } from "antd";
import { DATE_FORMAT } from "@containers/FirDetails/fir-util";
import { ModuleWrapper } from "@containers/FirDetails/Investigation/CommonDetails/styles";
import { useSelector } from "react-redux";
import { CheckboxGroup } from "@components/uielements/checkbox";
import { isEmpty, isUndefined } from "lodash";
import moment from "moment";
import { proclamationData } from "../const";
import { loadState } from "@lib/helpers/localStorage";

export default function PublishingProclamation({
  form,
  checkedList,
  setCheckedList,
  editProclamationAttachments,
  viewClicked,
}) {
  const { savedFir } = useSelector((state) => state.createFIR);
  const selectedCourtAndProsecution = loadState("selectedCourtAndProsecution");
  const disableForm = savedFir?.caseStatus === "Disposal" || selectedCourtAndProsecution.isCourtDisposal;
  const [formValid, setFormValid] = useState(false);

  const checkFields = async () => {
    const values = await form.validateFields();
    setFormValid(!Object.values(values).every((v) => v == null || v === ""));
  };

  const handleChecked = (list) => {
    setCheckedList(list);
  };

  useEffect(() => {
    const proclamationAndPropertyAttachmentsList =
      editProclamationAttachments?.publishing;
    if (
      !isUndefined(proclamationAndPropertyAttachmentsList) ||
      !isEmpty(proclamationAndPropertyAttachmentsList)
    ) {
      const values = proclamationAndPropertyAttachmentsList;
      setCheckedList(values?.publishingProclamation);
      form.setFieldsValue({
        publishingProclamation: values?.publishingProclamation,
        publishedDate: !!values?.publishedDate
          ? moment(new Date(values?.publishedDate))
          : "",
        others: values?.others,
      });
    }
  }, [editProclamationAttachments]);

  return (
    <ModuleWrapper>
      <Row gutter={24} style={{ marginTop: 5 }}>
        <Col span={8}>
          <Form.Item name="publishedDate" label="Published Date">
            <DatePicker
              format={DATE_FORMAT}
              disabled={disableForm || viewClicked}
              placeholder="Date"
              style={{ width: 250 }}
              onChange={checkFields}
            />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item style={{ marginTop: 15 }}>
        <CheckboxGroup
          disabled={disableForm || viewClicked}
          options={proclamationData}
          onChange={handleChecked}
          value={checkedList}
        />
      </Form.Item>
      {checkedList?.includes("Others") ? (
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item name="others">
              <Input
                onChange={checkFields}
                style={{ width: 250, marginLeft: 15 }}
                disabled={disableForm || viewClicked}
                placeholder={"if others enter details"}
              />
            </Form.Item>
          </Col>
        </Row>
      ) : null}
    </ModuleWrapper>
  );
}
