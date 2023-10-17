import { useCallback, useMemo, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Form, Row, Card, Divider, Col, Input, Button, Upload } from "antd";
import { isEmpty, isArray, isNull } from "lodash";
import { config } from "@config/site.config";
import interrogationReportActions from "@redux/investigations/interrogationReport/actions";
import { loadState } from "@lib/helpers/localStorage";
import TableRecords from "../TableRecords";
import { SaveButton, TableActions, AddUpdateButton } from "./SharedComponents";
import { mandatoryCheck, uploadFiles, openNotification } from "./util";
import { DOPAMSLinksColumns, phoneNumberRegExp } from "./const";

const MULTIPLE = true;

export default function DOPAMS({
  isViewOnlyMode = true,
  selectedAccused = "",
  selectedInterrogation = {},
}) {
  const [files, setFiles] = useState([]);
  const [records, setRecords] = useState([]);
  const [isFormDisabled, setIsFormDisabled] = useState(false);
  const [selectedRecordIndex, setSelectedRecordIndex] = useState(null);

  const [form] = Form.useForm();

  const dispatch = useDispatch();

  const crimeId = useMemo(() => loadState("selectedFirId"), []);

  useEffect(() => {
    if (!isEmpty(selectedInterrogation)) {
      const { DOPAMSLinks = [] } = selectedInterrogation;
      if (isArray(DOPAMSLinks) && !isEmpty(DOPAMSLinks))
        setRecords(DOPAMSLinks);
      else setRecords([]);
    }
  }, [selectedInterrogation]);

  const onRecordAdd = useCallback(async () => {
    const isMandatoryFilled = await mandatoryCheck(form);

    if (isMandatoryFilled) {
      const normalFieldValues = await form.getFieldsValue();
      const newRecord = { ...normalFieldValues, uploadDOPAMSData: files }; // TODO: need some refactoring
      if (isNull(selectedRecordIndex)) setRecords((prv) => [...prv, newRecord]);
      else {
        setRecords((prv) =>
          prv.map((r, i) => (i === selectedRecordIndex ? newRecord : r))
        );
      }
      setFiles([]);
      setSelectedRecordIndex(null);
      form.resetFields();
    }
  }, [files, selectedRecordIndex]);

  const onSave = useCallback(async () => {
    const recordsPayload = [];
    for (const record of records) {
      const recordPayload = { ...record };
      recordPayload.uploadDOPAMSData = await uploadFiles(
        record?.uploadDOPAMSData,
        crimeId,
        `${crimeId}/interrogationReport/DOPAMSLinks`
      );
      recordsPayload.push(recordPayload);
    }
    const payload = {
      crimeId: crimeId,
      person: selectedAccused,
      DOPAMSLinks: recordsPayload,
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
  }, [records, selectedAccused, selectedInterrogation, crimeId]);

  const onRemove = (removedFile) => {
    if (!isFormDisabled) {
      const oldFiles = isArray(files) ? files : [];
      const newFiles = oldFiles.filter(
        (file) => file?.name !== removedFile?.name
      );
      setFiles(newFiles);
    }
  };

  const setActionFieldsData = useCallback(({ uploadDOPAMSData }) => {
    setFiles(uploadDOPAMSData);
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
    return [...DOPAMSLinksColumns, actions];
  }, [isViewOnlyMode, DOPAMSLinksColumns]);

  const handelUpload = ({ file, onSuccess, onError }) => {
    if (MULTIPLE) {
      const oldFiles = isArray(files) ? files : [];
      if (!oldFiles.some((oldFile) => oldFile?.name === file?.name)) {
        const newFiles = [
          ...oldFiles,
          { originFileObj: file, name: file?.name },
        ];
        setFiles(newFiles);
        setTimeout(() => onSuccess("Ok"), 0);
      } else {
        openNotification("error", "Please Select Another File");
        setTimeout(() => onError("Not Ok", "Please Select Another File"), 0);
      }
    } else {
      const newFile = [{ originFileObj: file, name: file?.name }];
      setFiles(newFile);
      setTimeout(() => onSuccess("Ok"), 0);
    }
  };

  return (
    <Card style={{ width: "100%" }}>
      <Form form={form} layout="vertical">
        <Row gutter={[24, 12]} align="top">
          <Col span={6}>
            <Form.Item
              name="phoneNumberOfAccused"
              label="Phone Number Of Accused"
              rules={[
                {
                  message: "Phone Number is not valid",
                  required: true,
                  pattern: phoneNumberRegExp,
                },
              ]}
            >
              <Input disabled={isFormDisabled} />
            </Form.Item>
          </Col>

          <Col span={4}>
            <Form.Item name="uploadDOPAMSData" label="    ">
              <Upload
                customRequest={handelUpload}
                fileList={files}
                onRemove={onRemove}
                multiple={MULTIPLE}
              >
                <Button
                  type="primary"
                  className="submitButton"
                  disabled={isFormDisabled}
                >
                  Upload DOPAMS Data
                </Button>
              </Upload>
            </Form.Item>
          </Col>
          <AddUpdateButton
            onClick={onRecordAdd}
            isEdit={!isNull(selectedRecordIndex)}
            isDisabled={isFormDisabled || isViewOnlyMode}
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

      <Divider />

      <SaveButton isDisabled={isViewOnlyMode} onClick={onSave} />
    </Card>
  );
}
