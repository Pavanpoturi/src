import { useCallback, useState } from "react";
import { Col, Button, Form, Input, Space, Typography, Modal } from "antd";
import {
  SaveOutlined,
  PlusOutlined,
  EyeFilled,
  EditFilled,
  DeleteFilled,
} from "@ant-design/icons";
import { isNull, isArray } from "lodash";
import StandardSceneOfOffenseForm from "@components/Common/standardSceneOfOffenceForm";
import AddPerson from "@containers/FirDetails/Investigation/CommonForms/AddPerson";
import { actionMap, typeMap } from "./const";
import { separateFields } from "./util";

export function AddUpdateButton({
  isEdit = false,
  onClick = () => {},
  isDisabled = false,
  span = 4,
  offset = 2,
}) {
  return (
    <Col span={span} offset={offset}>
      <Form.Item name="addUpdateButton" label="    ">
        <Button type="primary" onClick={onClick} disabled={isDisabled}>
          <Space align="baseline">
            {isEdit ? (
              <SaveOutlined className="saveButtonIcon" />
            ) : (
              <PlusOutlined className="saveButtonIcon" />
            )}
            <span>{isEdit ? "Update Record" : "Add More"}</span>
          </Space>
        </Button>
      </Form.Item>
    </Col>
  );
}

export function SaveButton({ onClick, isDisabled = false }) {
  return (
    <Button type="primary" disabled={isDisabled} onClick={onClick}>
      <Space align="baseline">
        <SaveOutlined className="saveButtonIcon" />
        <span>Save</span>
      </Space>
    </Button>
  );
}

function DisplayFieldsCore({ field, onActionClick, isDisabled, ...restProps }) {
  const { type } = field;
  switch (type) {
    case typeMap.input:
      return <Input {...restProps} disabled={isDisabled} />;
    case typeMap.inputWithAction:
      return (
        <Space direction="vertical">
          <Input {...restProps} disabled={true} />
          <Typography.Link onClick={() => onActionClick(field)}>
            {field.actionLabel}
          </Typography.Link>
        </Space>
      );

    default:
      return <Input />;
  }
}

export function DisplayFields({
  fields = [],
  onActionClick,
  isDisabled = false,
}) {
  return (
    <>
      {fields.map((field) => {
        let { rules = null, isRequired = false, ...restField } = field;
        if (!isArray(rules)) {
          if (isRequired) rules = [{ required: true }];
          else rules = [];
        }
        return (
          <Col key={field?.name} span={field?.span || 4}>
            <Form.Item name={field?.name} label={field?.label} rules={rules}>
              <DisplayFieldsCore
                field={restField}
                onActionClick={onActionClick}
                isDisabled={isDisabled}
              />
            </Form.Item>
          </Col>
        );
      })}
    </>
  );
}

export function ActionLinkPopup({
  field,
  handleOk,
  handleCancel,
  isModalOpen,
  currentData = {},
  isDisabled = false,
  formName,
}) {
  const [age, setAge] = useState("");
  const [inputList, setInputList] = useState([]);
  const checkFields = () => {};

  const { action } = field;

  switch (action) {
    case actionMap.addAddress:
      return (
        <AddAddressPopup
          title="Add Address"
          isModalVisible={isModalOpen}
          handleOk={handleOk}
          handleCancel={handleCancel}
          formName={formName}
          disabled={isDisabled}
          currentData={currentData}
        />
      );

    case actionMap.addPerson:
      return (
        <AddPerson
          title="Add Person Details"
          isModalVisible={isModalOpen}
          handleOk={handleOk}
          handleCancel={handleCancel}
          formName={formName}
          checkFields={checkFields}
          disabled={isDisabled}
          setInputList={setInputList}
          editObj={currentData}
          age={age}
          setAge={setAge}
        />
      );

    default:
      return (
        <Modal
          title="Basic Modal"
          visible={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Modal>
      );
  }
}

const AddAddressPopup = ({
  title,
  isModalVisible,
  handleOk,
  handleCancel,
  formName,
  disabled,
  currentData,
}) => {
  return (
    <Modal
      title={title}
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      width={1000}
      okText="Add"
    >
      <Form form={formName} layout="vertical">
        <StandardSceneOfOffenseForm
          changeValue={() => {}}
          disabled={disabled}
          validationFields={["Address Line 1", "Address Line 2"]}
          // currentData={currentData}
          currentData={null}
          sceneofoffenseForm={formName}
        />
      </Form>
    </Modal>
  );
};

export function TableActions({
  isViewOnlyMode,
  form,
  index,
  row,
  setActionFieldsData,
  setSelectedRecordIndex,
  setIsFormDisabled,
  setRecords,
}) {
  const onClickCore = (isEdit) => {
    const [normalFieldValues, actionFieldValues] = separateFields(row);
    form.setFieldsValue(normalFieldValues);
    setActionFieldsData(actionFieldValues);
    setSelectedRecordIndex(index);
    setIsFormDisabled(isEdit);
  };
  const onView = () => onClickCore(true);
  const onEdit = () => onClickCore(false);
  const onDelete = () => {
    setSelectedRecordIndex((prvIndex) => {
      if (!isNull(prvIndex)) {
        if (prvIndex < index) return prvIndex;
        else if (prvIndex === index) return null;
        else if (prvIndex > index) return prvIndex - 1;
      } else return null;
    });
    setRecords((prv) => prv.filter((_e, i) => i !== index));
  };

  return (
    <Space size="large">
      <Space className="link" onClick={onView}>
        <EyeFilled />
        <span>View</span>
      </Space>
      {!isViewOnlyMode ? (
        <>
          <Space className="link" onClick={onEdit}>
            <EditFilled />
            <span>Edit</span>
          </Space>
          <Space className="link" onClick={onDelete}>
            <DeleteFilled />
            <span>Delete</span>
          </Space>
        </>
      ) : null}
    </Space>
  );
}
