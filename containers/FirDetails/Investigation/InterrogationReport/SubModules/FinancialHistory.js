import { useCallback, useMemo, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Form, Row, Card, Divider } from "antd";
import { isEmpty, isNull, isArray, cloneDeep } from "lodash";
import { config } from "@config/site.config";
import interrogationReportActions from "@redux/investigations/interrogationReport/actions";
import { loadState } from "@lib/helpers/localStorage";
import TableRecords from "../TableRecords";
import {
  AddUpdateButton,
  SaveButton,
  DisplayFields,
  ActionLinkPopup,
  TableActions,
} from "./SharedComponents";
import { financialHistoryFields, financialHistoryColumns } from "./const";
import {
  getActionFieldValue,
  mandatoryCheck,
  getRecordsPayload,
  getRecordsValue,
} from "./util";

export default function FinancialHistory({
  isViewOnlyMode = true,
  selectedAccused = "",
  selectedInterrogation = {},
}) {
  const [records, setRecords] = useState([]);
  const [isFormDisabled, setIsFormDisabled] = useState(false);
  const [currentActionField, setCurrentActionField] = useState({}); // holds all current popup filed data, emptied when popup closes
  const [isActionPopupOpen, setIsActionPopupOpen] = useState(false);
  const [actionFieldsData, setActionFieldsData] = useState({}); // holds all popup data, emptied when record is added
  const [selectedRecordIndex, setSelectedRecordIndex] = useState(null);

  const [form] = Form.useForm();
  const [popupForm] = Form.useForm();

  const dispatch = useDispatch();

  const crimeId = useMemo(() => loadState("selectedFirId"), []);

  useEffect(() => {
    if (!isEmpty(selectedInterrogation)) {
      const {
        financialHistoryAndBankAccountTransactions: financialHistory = [],
      } = selectedInterrogation;
      if (isArray(financialHistory) && !isEmpty(financialHistory)) {
        const oldRecords = getRecordsValue(financialHistory);
        setRecords(oldRecords);
      } else setRecords([]);
    }
  }, [selectedInterrogation]);

  useEffect(() => {
    setIsFormDisabled(isViewOnlyMode);
  }, [isViewOnlyMode]);

  const onRecordAdd = useCallback(async () => {
    const isMandatoryFilled = await mandatoryCheck(form);

    if (isMandatoryFilled) {
      const normalFieldValues = await form.getFieldsValue();
      const newRecord = { ...normalFieldValues, ...actionFieldsData };
      if (isNull(selectedRecordIndex)) setRecords((prv) => [...prv, newRecord]);
      else {
        setRecords((prv) =>
          prv.map((e, i) => (i === selectedRecordIndex ? newRecord : e))
        );
      }
      setActionFieldsData({});
      setSelectedRecordIndex(null);
      form.resetFields();
    }
  }, [actionFieldsData, selectedRecordIndex]);

  const onActionClick = useCallback(
    (fieldData) => {
      setCurrentActionField(fieldData);
      const { name } = fieldData;
      if (!isEmpty(actionFieldsData?.[name]))
        popupForm.setFieldsValue(actionFieldsData?.[name]);
      setIsActionPopupOpen(true);
    },
    [actionFieldsData]
  );

  const handleActionPopupOk = useCallback(async () => {
    const isMandatoryFilled = await mandatoryCheck(popupForm);

    if (isMandatoryFilled) {
      const { name, action } = currentActionField;
      const popupFormData = await popupForm.getFieldsValue();
      setActionFieldsData((prv) => ({
        ...prv,
        [name]: { ...popupFormData, action },
      }));
      setIsActionPopupOpen(false);
      form.setFieldsValue({
        [name]: getActionFieldValue(popupFormData, action),
      });
      setCurrentActionField({});
      popupForm.resetFields();
    }
  }, [currentActionField]);

  const handleActionPopupCancel = useCallback(() => {
    setIsActionPopupOpen(false);
    setCurrentActionField({});
    popupForm.resetFields();
  }, []);

  const columns = useMemo(() => {
    const actions = {
      title: "Actions",
      rowKey: "actions",
      render: (_col, row, index) => (
        <TableActions
          isViewOnlyMode={isViewOnlyMode}
          form={form}
          index={index}
          row={row}
          setActionFieldsData={setActionFieldsData}
          setSelectedRecordIndex={setSelectedRecordIndex}
          setIsFormDisabled={setIsFormDisabled}
          setRecords={setRecords}
        />
      ),
    };
    return [...financialHistoryColumns, actions];
  }, [isViewOnlyMode, financialHistoryColumns]);

  const onSave = useCallback(() => {
    const payload = {
      crimeId: crimeId,
      person: selectedAccused,
      financialHistoryAndBankAccountTransactions: getRecordsPayload(records),
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
  }, [records, selectedAccused, selectedInterrogation]);

  return (
    <Card style={{ width: "100%" }}>
      <Form form={form} layout="vertical">
        <Row gutter={[24, 12]} align="top">
          <DisplayFields
            fields={financialHistoryFields}
            onActionClick={onActionClick}
            isDisabled={isFormDisabled}
          />
          <AddUpdateButton
            onClick={onRecordAdd}
            isEdit={!isNull(selectedRecordIndex)}
            isDisabled={isFormDisabled || isViewOnlyMode}
            offset={0}
          />
        </Row>
      </Form>
      {!isEmpty(records) && (
        <>
          <Divider />
          <TableRecords
            dataSource={records}
            columns={columns}
            selectedIndex={selectedRecordIndex}
          />
        </>
      )}
      {!isEmpty(records) && (
        <>
          <Divider />
          <SaveButton isDisabled={isViewOnlyMode} onClick={onSave} />
        </>
      )}

      <ActionLinkPopup
        field={currentActionField}
        handleOk={handleActionPopupOk}
        handleCancel={handleActionPopupCancel}
        isModalOpen={isActionPopupOpen}
        formName={popupForm}
        isDisabled={isFormDisabled}
      />
    </Card>
  );
}
