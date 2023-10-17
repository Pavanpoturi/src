/* eslint-disable array-callback-return */
import { Row, Card, Col, Form, Divider, Button, Input, DatePicker } from "antd";
import moment from "moment";
import { useState, useEffect } from "react";
import { config } from "@config/site.config";
import { useDispatch, useSelector } from "react-redux";
import { textFieldRules } from "@components/Common/formOptions";
import { SaveOutlined } from "@ant-design/icons";
import { isEmpty, first, isUndefined, isArray } from "lodash";
import { loadState } from "@lib/helpers/localStorage";
import { disableFutureDates } from "@components/Common/helperMethods";
import {
  DATE_FORMAT,
  renderFieldsWithDropDown,
} from "@containers/FirDetails/fir-util";
import { DATE_TIME_FORMAT } from "@containers/FirDetails/fir-util";
import TableRecords from "./TableRecords";
import AddUpdateButton from "./AddUpdateButton";
import { ptWarrantRegularizationForm } from "./const";

export default function PtWarrantRegularization({
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
  const [ptRegularizationForm] = Form.useForm();
  const [serchText, setSerchText] = useState("");
  const [formValid, setFormValid] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState("");
  const { courtsNameList } = useSelector((state) => state.MasterData);
  const { ptWarrantList } = useSelector((state) => state.PTWarrant);
  const existingPtWarrant =
    !isEmpty(ptWarrantList) &&
    first(ptWarrantList.filter((s) => s.accusedId?._id === selectedAccused))
      ?.ptWarrant;

  const handleSearch = (text) => {
    setSerchText(text);
  };

  const checkFields = async () => {
    const values = await ptRegularizationForm.validateFields();
    setFormValid(!Object.values(values).every((v) => v == null || v === ""));
  };

  const addMoreDetails = async () => {
    const values = await ptRegularizationForm.validateFields();
    const result = {
      distDivision: values.distDivision,
      psCode: values.psCode,
      crimeNum: values.crimeNum,
      lawSection: values.lawSection,
      scCCNum: values.scCCNum,
      court: values.court,
      regularizationDate: values.regularizationDate,
      remarks: values.remarks,
      isExisting: false,
    };
    setDataSource([...dataSource, result]);
    ptRegularizationForm.resetFields();
    checkFields();
  };

  const updateRecord = async () => {
    const values = await ptRegularizationForm.validateFields();
    const updatedRecord = {
      distDivision: values.distDivision,
      psCode: values.psCode,
      crimeNum: values.crimeNum,
      lawSection: values.lawSection,
      scCCNum: values.scCCNum,
      court: values.court,
      regularizationDate: values.regularizationDate,
      remarks: values.remarks,
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
    ptRegularizationForm.resetFields();
    setIsEdit(false);
    setSelectedIndex("");
    checkFields();
  };

  const ptColumns = [
    {
      title: "District",
      dataIndex: "district",
      rowKey: "district",
      render: (district) => (
        <span className="tableRowText wordWrap">{district}</span>
      ),
    },
    {
      title: "Court Name",
      dataIndex: "courtName",
      rowKey: "courtName",
      render: (courtName) => (
        <span className="tableRowText wordWrap">{courtName}</span>
      ),
    },
    {
      title: "Arrested On",
      dataIndex: "dateTimeOfArrest",
      rowKey: "dateTimeOfArrest",
      render: (dateTimeOfArrest) => (
        <span className="tableRowText wordWrap">
          {dateTimeOfArrest
            ? moment(dateTimeOfArrest).format(DATE_TIME_FORMAT)
            : ""}
        </span>
      ),
    },
    {
      title: "Date Of PTWarrant Requistion",
      dataIndex: "dateOfPTWarrantRequistion",
      rowKey: "dateOfPTWarrantRequistion",
      render: (dateOfPTWarrantRequistion) => (
        <span className="tableRowText wordWrap">
          {dateOfPTWarrantRequistion
            ? moment(dateOfPTWarrantRequistion).format(DATE_FORMAT)
            : ""}
        </span>
      ),
    },
    {
      title: "Grant Type",
      dataIndex: "grantType",
      rowKey: "grantType",
      render: (_value, item) => {
        return (
          <span className="tableRowText wordWrap">
            {item?.courtOrders?.grantType || ""}
          </span>
        );
      },
    },
  ];

  const editRecords = (index) => {
    const values = dataSource[index];
    if (values) {
      ptRegularizationForm.setFieldsValue({
        distDivision: values.distDivision,
        psCode: values.psCode,
        crimeNum: values.crimeNum,
        lawSection: values.lawSection,
        scCCNum: values.scCCNum,
        court: values.court,
        regularizationDate:
          values.regularizationDate &&
          moment(new Date(values.regularizationDate)).isValid()
            ? moment(new Date(values.regularizationDate))
            : "",
        remarks: values.remarks,
      });
    }
  };

  const columns = [
    {
      title: "Dist / Division",
      dataIndex: "distDivision",
      rowKey: "distDivision",
      render: (distDivision) => (
        <span className="tableRowText wordWrap">{distDivision}</span>
      ),
    },
    {
      title: "P.S.",
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
      title: "SC / CC No",
      dataIndex: "scCCNum",
      rowKey: "scCCNum",
      render: (scCCNum) => (
        <span className="tableRowText wordWrap">{scCCNum}</span>
      ),
    },
    {
      title: "Court Name",
      dataIndex: "court",
      rowKey: "court",
      render: (court) => <span className="tableRowText wordWrap">{court}</span>,
    },
    {
      title: "Date of regularization of Transit Warrant",
      dataIndex: "regularizationDate",
      rowKey: "regularizationDate",
      render: (regularizationDate) => (
        <span className="tableRowText wordWrap">
          {regularizationDate
            ? moment(regularizationDate).format(DATE_FORMAT)
            : ""}
        </span>
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
      case "regularizationDate":
        return (
          <DatePicker
            disabledDate={disableFutureDates}
            format={DATE_FORMAT}
            style={{ width: 250 }}
            onChange={checkFields}
            disabled={disableForm}
          />
        );
      case "court":
        return renderFieldsWithDropDown(
          courtsNameList,
          null,
          handleSearch,
          serchText,
          250,
          disableForm
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
    } else {
      ptRegularizationForm.resetFields();
    }
  }, [selectedObjId, selectedRecord]);

  const submit = () => {
    const addPayload = {
      crimeId: crimeId,
      person: selectedAccused,
      ptWarrantRegularization: dataSource,
    };

    const updatePayload = {
      crimeId: crimeId,
      _id: selectedObjId,
      person: selectedAccused,
      ptWarrantRegularization: dataSource,
    };

    if (selectedObjId) {
      dispatch(updateDetails(config.interrogation, updatePayload));
    } else {
      dispatch(addDetails(config.interrogation, addPayload));
    }
  };

  return (
    <Card style={{ width: "100%" }} className="cardLeftStyle">
      <Form form={ptRegularizationForm} layout="vertical">
        <Row gutter={24}>
          {displayState(ptWarrantRegularizationForm, displayFields)}
          <Col style={{ marginBottom: 20, padding: 0 }}>
            <AddUpdateButton
              isEdit={isEdit}
              updateRecord={updateRecord}
              addMoreDetails={addMoreDetails}
              disabled={!formValid || disableForm}
            />
          </Col>
        </Row>
        {!isUndefined(existingPtWarrant) && selectedObjId && (
          <div style={{ padding: 10 }}>
            <TableRecords
              dataSource={[existingPtWarrant]}
              columns={ptColumns}
              selectedIndex={selectedIndex}
              tableTitle="Transit Warrant Details"
            />
          </div>
        )}
        {!isEmpty(dataSource) && (
          <div style={{ padding: 10 }}>
            <TableRecords
              dataSource={dataSource}
              columns={columns}
              selectedIndex={selectedIndex}
              tableTitle="Interrogation Transit Warrant Details"
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
