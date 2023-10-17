/* eslint-disable array-callback-return */
import { Row, Card, Col, Form, Divider, Button, Input, DatePicker } from "antd";
import { useState, useEffect } from "react";
import { config } from "@config/site.config";
import { useDispatch } from "react-redux";
import moment from "moment";
import { textFieldRules } from "@components/Common/formOptions";
import { SaveOutlined } from "@ant-design/icons";
import { disableFutureDates } from "@components/Common/helperMethods";
import { DATE_FORMAT } from "@containers/FirDetails/fir-util";
import { isEmpty } from "lodash";
import { loadState } from "@lib/helpers/localStorage";
import AddUpdateButton from "./AddUpdateButton";
import TableRecords from "./TableRecords";
import { convictionAcquittalForm } from "./const";

export default function ConvictionAcquittal({
  disabled,
  selectedAccused,
  selectedObjId,
  selectedRecord,
  disableForm,
  addDetails,
  updateDetails,
}) {
  const dispatch = useDispatch();
  const crimeId = loadState("selectedFirId");
  const [convictionForm] = Form.useForm();
  const [formValid, setFormValid] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState("");

  const checkFields = async () => {
    const values = await convictionForm.validateFields();
    setFormValid(!Object.values(values).every((v) => v == null || v === ""));
  };

  const addMoreDetails = async () => {
    const values = await convictionForm.validateFields();
    setDataSource([...dataSource, values]);
    convictionForm.resetFields();
    checkFields();
  };

  const editRecords = (index) => {
    const values = dataSource[index];
    if (values) {
      convictionForm.setFieldsValue({
        distUnit: values.distUnit,
        division: values.division,
        psCode: values.psCode,
        crimeNum: values.crimeNum,
        lawSection: values.lawSection,
        scCCNum: values.scCCNum,
        judgementDate:
          values.judgementDate &&
          moment(new Date(values.judgementDate)).isValid()
            ? moment(new Date(values.judgementDate))
            : "",
        detailsConvictionAcquittal: values.detailsConvictionAcquittal,
        reason: values.reason,
      });
    }
  };

  const updateRecord = async () => {
    const values = await convictionForm.validateFields();
    const updatedRecord = {
      distUnit: values.distUnit,
      division: values.division,
      psCode: values.psCode,
      crimeNum: values.crimeNum,
      lawSection: values.lawSection,
      scCCNum: values.scCCNum,
      judgementDate: values.judgementDate,
      detailsConvictionAcquittal: values.detailsConvictionAcquittal,
      reason: values.reason,
    };

    const updatedObj = {
      ...dataSource[selectedIndex],
      ...updatedRecord,
    };
    const updatedRecords = [
      ...dataSource.slice(0, selectedIndex),
      updatedObj,
      ...dataSource.slice(selectedIndex + 1),
    ];

    setDataSource(updatedRecords);
    convictionForm.resetFields();
    setIsEdit(false);
    setSelectedIndex("");
    checkFields();
  };

  const columns = [
    {
      title: "Dist / Unit",
      dataIndex: "distUnit",
      rowKey: "distUnit",
      render: (distUnit) => (
        <span className="tableRowText wordWrap">{distUnit}</span>
      ),
    },
    {
      title: "Division",
      dataIndex: "division",
      rowKey: "division",
      render: (division) => (
        <span className="tableRowText wordWrap">{division}</span>
      ),
    },
    {
      title: "PS",
      dataIndex: "psCode",
      rowKey: "psCode",
      render: (psCode) => (
        <span className="tableRowText wordWrap">{psCode}</span>
      ),
    },
    {
      title: "Cr.No.",
      dataIndex: "crimeNum",
      rowKey: "crimeNum",
      render: (crimeNum) => (
        <span className="tableRowText wordWrap">{crimeNum}</span>
      ),
    },
    {
      title: "Section Of law",
      dataIndex: "lawSection",
      rowKey: "lawSection",
      render: (lawSection) => (
        <span className="tableRowText wordWrap">{lawSection}</span>
      ),
    },
    {
      title: "SC / CC No",
      dataIndex: "scCCNum",
      rowKey: "scCCNum",
      render: (scCCNum) => (
        <span className="tableRowText wordWrap">{scCCNum}</span>
      ),
    },
    {
      title: "Date of Judgment",
      dataIndex: "judgementDate",
      rowKey: "judgementDate",
      render: (judgementDate) => (
        <span className="tableRowText wordWrap">
          {judgementDate ? moment(judgementDate).format(DATE_FORMAT) : ""}
        </span>
      ),
    },
    {
      title: "Details of conviction / acquittal",
      dataIndex: "detailsConvictionAcquittal",
      rowKey: "detailsConvictionAcquittal",
      render: (detailsConvictionAcquittal) => (
        <span className="tableRowText wordWrap">
          {detailsConvictionAcquittal}
        </span>
      ),
    },
    {
      title: "Reasons for Acquittal, if any",
      dataIndex: "reason",
      rowKey: "reason",
      render: (reason) => (
        <span className="tableRowText wordWrap">{reason}</span>
      ),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      rowKey: "actions",
      render: (_value, _item, index) => {
        return (
          <div
            key={index}
            className="updateRecord"
            onClick={() => {
              editRecords(index);
              setIsEdit(true);
              setSelectedIndex(index);
            }}
          >
            Update
          </div>
        );
      },
    },
  ];

  const displayState = (data, actionName) => {
    return data.map((s, i) => {
      return (
        <Col span={8} key={i} style={{ marginBottom: 10 }}>
          <Form.Item name={s.name} label={s.label}>
            {actionName(s.name)}
          </Form.Item>
        </Col>
      );
    });
  };

  const displayFields = (name) => {
    switch (name) {
      case "judgementDate":
        return (
          <DatePicker
            disabledDate={disableFutureDates}
            format={DATE_FORMAT}
            style={{ width: 250 }}
            onChange={checkFields}
            disabled={disableForm}
          />
        );
      default:
        return (
          <Input
            onChange={checkFields}
            style={{ width: 250 }}
            maxLength={textFieldRules.maxLength}
            disabled={disableForm}
          />
        );
    }
  };

  useEffect(() => {
    if (selectedObjId) {
      setDataSource(selectedRecord);
    }
  }, [selectedObjId, selectedRecord]);

  const submit = () => {
    const addPayload = {
      crimeId: crimeId,
      person: selectedAccused,
      convictionAcquittal: dataSource,
    };

    const updatePayload = {
      crimeId: crimeId,
      _id: selectedObjId,
      person: selectedAccused,
      convictionAcquittal: dataSource,
    };

    if (selectedObjId) {
      dispatch(updateDetails(config.interrogation, updatePayload));
    } else {
      dispatch(addDetails(config.interrogation, addPayload));
    }
  };

  return (
    <Card style={{ width: "100%" }} className="cardLeftStyle">
      <Form form={convictionForm} layout="vertical">
        <Row gutter={24}>
          {displayState(convictionAcquittalForm, displayFields)}
          <Col style={{ marginBottom: 20, padding: 0 }}>
            <AddUpdateButton
              isEdit={isEdit}
              updateRecord={updateRecord}
              addMoreDetails={addMoreDetails}
              disabled={!formValid || disableForm}
            />
          </Col>
        </Row>
        {!isEmpty(dataSource) && (
          <div style={{ padding: 10 }}>
            <TableRecords
              dataSource={dataSource}
              columns={columns}
              selectedIndex={selectedIndex}
            />
          </div>
        )}
        <Divider />
        <Form.Item>
          <Button
            type="primary"
            className="saveButton"
            size="large"
            icon={<SaveOutlined className="saveButtonIcon" />}
            onClick={submit}
            disabled={disabled || isEmpty(dataSource) || disableForm}
          >
            SAVE
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
