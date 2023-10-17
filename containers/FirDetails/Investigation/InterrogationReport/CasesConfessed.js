/* eslint-disable array-callback-return */
import { Row, Card, Col, Form, Divider, Button, Input, DatePicker } from "antd";
import moment from "moment";
import { useState, useEffect } from "react";
import { config } from "@config/site.config";
import { useDispatch } from "react-redux";
import { textFieldRules } from "@components/Common/formOptions";
import { SaveOutlined } from "@ant-design/icons";
import { DATE_FORMAT } from "@containers/FirDetails/fir-util";
import { disableFutureDates } from "@components/Common/helperMethods";
import { caseConfessedForm } from "./const";
import TableRecords from "./TableRecords";
import { isEmpty } from "lodash";
import { loadState } from "@lib/helpers/localStorage";
import AddUpdateButton from "./AddUpdateButton";

export default function CasesConfessed({
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
  const [caseConfessForm] = Form.useForm();
  const [formValid, setFormValid] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState("");

  const checkFields = async () => {
    const values = await caseConfessForm.validateFields();
    setFormValid(!Object.values(values).every((v) => v == null || v === ""));
  };

  const addMoreDetails = async () => {
    const values = await caseConfessForm.validateFields();
    setDataSource([...dataSource, values]);
    caseConfessForm.resetFields();
    checkFields();
  };

  const editRecords = (index) => {
    const values = dataSource[index];
    if (values) {
      caseConfessForm.setFieldsValue({
        distUnitDivision: values.distUnitDivision,
        psCode: values.psCode,
        crimeNum: values.crimeNum,
        lawSection: values.lawSection,
        gangMember: values.gangMember,
        propertyStolen: values.propertyStolen,
        propertyRecovered: values.propertyRecovered,
        remarks: values.remarks,
        arrestDate: moment(new Date(values.arrestDate)).isValid()
          ? moment(new Date(values.arrestDate))
          : "",
        arrestPlace: values.arrestPlace,
        arrestedBy: values.arrestedBy,
        interrogatedBy: values.interrogatedBy,
        othersIdentify: values.othersIdentify,
      });
    }
  };

  const updateRecord = async () => {
    const values = await caseConfessForm.validateFields();
    const updatedRecord = {
      distUnitDivision: values.distUnitDivision,
      psCode: values.psCode,
      crimeNum: values.crimeNum,
      lawSection: values.lawSection,
      gangMember: values.gangMember,
      propertyStolen: values.propertyStolen,
      propertyRecovered: values.propertyRecovered,
      remarks: values.remarks,
      arrestDate: values.arrestDate,
      arrestPlace: values.arrestPlace,
      arrestedBy: values.arrestedBy,
      interrogatedBy: values.interrogatedBy,
      othersIdentify: values.othersIdentify,
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
    caseConfessForm.resetFields();
    setIsEdit(false);
    setSelectedIndex("");
    checkFields();
  };

  const columns = [
    {
      title: "District/Division",
      dataIndex: "distUnitDivision",
      rowKey: "distUnitDivision",
      render: (distUnitDivision) => (
        <span className="tableRowText wordWrap">{distUnitDivision}</span>
      ),
    },
    {
      title: "In which PS Jurisdiction",
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
      title: "Section Of Law",
      dataIndex: "lawSection",
      rowKey: "lawSection",
      render: (lawSection) => (
        <span className="tableRowText wordWrap">{lawSection}</span>
      ),
    },
    {
      title: "Gang Members",
      dataIndex: "gangMember",
      rowKey: "gangMember",
      render: (gangMember) => (
        <span className="tableRowText wordWrap">{gangMember}</span>
      ),
    },
    {
      title: "Property Stolen",
      dataIndex: "propertyStolen",
      rowKey: "propertyStolen",
      render: (propertyStolen) => (
        <span className="tableRowText wordWrap">{propertyStolen}</span>
      ),
    },
    {
      title: "Property Recovered",
      dataIndex: "propertyRecovered",
      rowKey: "propertyRecovered",
      render: (propertyRecovered) => (
        <span className="tableRowText wordWrap">{propertyRecovered}</span>
      ),
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      rowKey: "remarks",
      render: (remarks) => (
        <span className="tableRowText wordWrap">{remarks}</span>
      ),
    },
    {
      title: "Date of Arrest",
      dataIndex: "arrestDate",
      rowKey: "arrestDate",
      render: (arrestDate) => (
        <span className="tableRowText wordWrap">
          {arrestDate ? moment(new Date(arrestDate)).format(DATE_FORMAT) : ""}
        </span>
      ),
    },
    {
      title: "Place of Arrest",
      dataIndex: "arrestPlace",
      rowKey: "arrestPlace",
      render: (arrestPlace) => (
        <span className="tableRowText wordWrap">{arrestPlace}</span>
      ),
    },
    {
      title: "Arrested By",
      dataIndex: "arrestedBy",
      rowKey: "arrestedBy",
      render: (arrestedBy) => (
        <span className="tableRowText wordWrap">{arrestedBy}</span>
      ),
    },
    {
      title: "Interrogated By",
      dataIndex: "interrogatedBy",
      rowKey: "interrogatedBy",
      render: (interrogatedBy) => (
        <span className="tableRowText wordWrap">{interrogatedBy}</span>
      ),
    },
    {
      title: "Others who can identify",
      dataIndex: "othersIdentify",
      rowKey: "othersIdentify",
      render: (othersIdentify) => (
        <span className="tableRowText wordWrap">{othersIdentify}</span>
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
      case "arrestDate":
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
      casesConfessed: dataSource,
    };

    const updatePayload = {
      crimeId: crimeId,
      _id: selectedObjId,
      person: selectedAccused,
      casesConfessed: dataSource,
    };

    if (selectedObjId) {
      dispatch(updateDetails(config.interrogation, updatePayload));
    } else {
      dispatch(addDetails(config.interrogation, addPayload));
    }
  };

  return (
    <Card style={{ width: "100%" }} className="cardLeftStyle">
      <Form form={caseConfessForm} layout="vertical">
        <Row gutter={24}>
          {displayState(caseConfessedForm, displayFields)}
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
