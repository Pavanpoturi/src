/* eslint-disable array-callback-return */
import { Row, Card, Col, Form, Divider, Button, Input, DatePicker } from "antd";
import moment from "moment";
import { useState, useEffect } from "react";
import { config } from "@config/site.config";
import { useDispatch, useSelector } from "react-redux";
import { textFieldRules } from "@components/Common/formOptions";
import { SaveOutlined } from "@ant-design/icons";
import { disableFutureDates } from "@components/Common/helperMethods";
import {
  DATE_FORMAT,
  renderFieldsWithDropDown,
} from "@containers/FirDetails/fir-util";
import { loadState } from "@lib/helpers/localStorage";
import { isEmpty, first, isArray } from "lodash";
import AddUpdateButton from "./AddUpdateButton";
import { executionNBWForm } from "./const";
import TableRecords from "./TableRecords";

export default function ExecutionOfNBW({
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
  const [executionOfNBWForm] = Form.useForm();
  const [serchText, setSerchText] = useState("");
  const [formValid, setFormValid] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState("");
  const { courtsNameList } = useSelector((state) => state.MasterData);
  const { arrestList } = useSelector((state) => state.FIR);

  const handleSearch = (text) => {
    setSerchText(text);
  };

  const checkFields = async () => {
    const values = await executionOfNBWForm.validateFields();
    setFormValid(!Object.values(values).every((v) => v == null || v === ""));
  };

  const addMoreDetails = async () => {
    const values = await executionOfNBWForm.validateFields();
    setDataSource([...dataSource, values]);
    executionOfNBWForm.resetFields();
    checkFields();
  };

  const accusedOutOfCountryList =
    !isEmpty(arrestList) &&
    arrestList.filter((s) => s.action === "Accused Out of Country");
  const existingNBW =
    !isEmpty(accusedOutOfCountryList) &&
    first(
      accusedOutOfCountryList.filter(
        (s) => s.accusedId?._id === selectedAccused
      )
    )?.accusedOutOfCountry;

  const updateRecord = async () => {
    const values = await executionOfNBWForm.validateFields();
    const updatedRecord = {
      distDivision: values.distDivision,
      psCode: values.psCode,
      crimeNum: values.crimeNum,
      lawSection: values.lawSection,
      scCCNum: values.scCCNum,
      court: values.court,
      executionDate: values.executionDate,
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
    executionOfNBWForm.resetFields();
    setIsEdit(false);
    setSelectedIndex("");
    checkFields();
  };

  const existingNBWDataSource = () => {
    let arr = [];
    const requestCourtNBW = existingNBW?.requestCourtNBW;
    const requestToCircular = existingNBW?.requestToCircular;
    const result = {
      equestForNBW: requestCourtNBW?.requestForNBW,
      requestedOn: requestCourtNBW?.requestedOn,
      nbwStatus: requestCourtNBW?.nbwStatus,
      requestForCircular: requestToCircular?.requestForCircular,
      requestedOnCircular: requestToCircular?.requestedOn,
      circularStatus: requestToCircular?.circularStatus,
    };
    arr.push(result);
    return arr;
  };

  const editRecords = (index) => {
    const values = dataSource[index];
    if (values) {
      executionOfNBWForm.setFieldsValue({
        distDivision: values.distDivision,
        psCode: values.psCode,
        crimeNum: values.crimeNum,
        lawSection: values.lawSection,
        scCCNum: values.scCCNum,
        court: values.court,
        executionDate:
          values.executionDate &&
          moment(new Date(values.executionDate)).isValid()
            ? moment(new Date(values.executionDate))
            : "",
        remarks: values.remarks,
      });
    }
  };

  const nbwColumns = [
    {
      title: "Request to Court to issue NBW",
      dataIndex: "equestForNBW",
      rowKey: "equestForNBW",
      render: (equestForNBW) => (
        <span className="tableRowText wordWrap">
          {equestForNBW ? "Yes" : "No"}
        </span>
      ),
    },
    {
      title: "NBW Request Date",
      dataIndex: "requestedOn",
      rowKey: "requestedOn",
      render: (requestedOn) => (
        <span className="tableRowText wordWrap">
          {requestedOn ? moment(requestedOn).format(DATE_FORMAT) : ""}
        </span>
      ),
    },
    {
      title: "NBW Request Status",
      dataIndex: "nbwStatus",
      rowKey: "nbwStatus",
      render: (nbwStatus) => (
        <span className="tableRowText wordWrap">{nbwStatus || ""}</span>
      ),
    },
    {
      title: "Request For Circular",
      dataIndex: "requestForCircular",
      rowKey: "requestForCircular",
      render: (requestForCircular) => {
        return (
          <span className="tableRowText wordWrap">
            {requestForCircular ? "Yes" : "No"}
          </span>
        );
      },
    },
    {
      title: "Circular Request Date",
      dataIndex: "requestedOnCircular",
      rowKey: "requestedOnCircular",
      render: (requestedOnCircular) => (
        <span className="tableRowText wordWrap">
          {requestedOnCircular
            ? moment(requestedOnCircular).format(DATE_FORMAT)
            : ""}
        </span>
      ),
    },
    {
      title: "Circular Status",
      dataIndex: "circularStatus",
      rowKey: "circularStatus",
      render: (circularStatus) => (
        <span className="tableRowText wordWrap">{circularStatus || ""}</span>
      ),
    },
  ];

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
      title: "Date of execution",
      dataIndex: "executionDate",
      rowKey: "executionDate",
      render: (executionDate) => (
        <span className="tableRowText wordWrap">
          {executionDate ? moment(executionDate).format(DATE_FORMAT) : ""}
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
      case "executionDate":
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
    }
  }, [selectedObjId, selectedRecord]);

  const submit = () => {
    const addPayload = {
      crimeId: crimeId,
      person: selectedAccused,
      executionNBW: dataSource,
    };

    const updatePayload = {
      crimeId: crimeId,
      _id: selectedObjId,
      person: selectedAccused,
      executionNBW: dataSource,
    };

    if (selectedObjId) {
      dispatch(updateDetails(config.interrogation, updatePayload));
    } else {
      dispatch(addDetails(config.interrogation, addPayload));
    }
  };

  return (
    <Card style={{ width: "100%" }} className="cardLeftStyle">
      <Form form={executionOfNBWForm} layout="vertical">
        <Row gutter={24}>
          {displayState(executionNBWForm, displayFields)}
          <Col style={{ marginBottom: 20, padding: 0 }}>
            <AddUpdateButton
              isEdit={isEdit}
              updateRecord={updateRecord}
              addMoreDetails={addMoreDetails}
              disabled={!formValid || disableForm}
            />
          </Col>
        </Row>
        {!isEmpty(existingNBWDataSource()) && selectedObjId && (
          <div style={{ padding: 10 }}>
            <TableRecords
              dataSource={existingNBWDataSource()}
              columns={nbwColumns}
              selectedIndex={selectedIndex}
              tableTitle="NBW Details"
            />
          </div>
        )}
        {!isEmpty(dataSource) && (
          <div style={{ padding: 10 }}>
            <TableRecords
              dataSource={dataSource}
              columns={columns}
              selectedIndex={selectedIndex}
              tableTitle="Interrogation Execution NBW Details"
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
