import { Col, Divider, Form, Button, DatePicker } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import moment from "moment";
import { config } from "@config/site.config";
import { isEmpty, first } from "lodash";
import masterDataActions from "@redux/masterData/actions";
import StandardMaterialObjectForm from "@components/Common/standardMaterialObjectForm";
import { disableFuturePastDates } from "@components/Common/helperMethods";
import { loadState } from "@lib/helpers/localStorage";
import { useSelector, useDispatch } from "react-redux";
import {
  masterDataType,
  DATE_TIME_FORMAT,
} from "@containers/FirDetails/fir-util";

export default function MaterialObjects({
  crimeSceneDate,
  handleSubmit,
  currentData,
  resetEdit,
  viewMaterialObjectDetails,
  setViewMaterialObjectDetails,
  MaterialObjectsForm,
  showButton,
  setformValidFlag,
  addAddress,
  address,
  isInvestigation,
  setSelectedSiderMenu,
  fileList,
  actionName,
  disableUpload = false,
}) {
  const [formValid, SetFormValid] = useState(false);
  const dispatch = useDispatch();
  const currentUser = loadState("currentUser");
  const { getStaffList } = masterDataActions;
  const { staffList } = useSelector((state) => state.MasterData);

  const reset = () => {
    MaterialObjectsForm.resetFields();
    resetEdit();
    setViewMaterialObjectDetails(false);
  };

  useEffect(() => {
    dispatch(getStaffList(`${config.getMasterData}/${masterDataType.STAFF}`));
  }, [dispatch]);

  const staffListData =
    !isEmpty(staffList) &&
    staffList.map((item) => {
      const container = {
        label: item.employeeName,
        name: item.paoCode,
      };
      return container;
    });

  function omitKeys(obj, keys) {
    var target = {};
    for (var i in obj) {
      if (keys.indexOf(i) >= 0) continue;
      if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;

      target[i] = obj[i];
    }
    return target;
  }

  const checkFields = async () => {
    const values = await MaterialObjectsForm.validateFields();
    if (isInvestigation && values && !values.userDate) {
      SetFormValid(false);
      setformValidFlag(false);
    } else {
      SetFormValid(
        !Object.values(values).every(
          (v) => v == null || (typeof v === "string" && v.trim() === "")
        )
      );
      if (setformValidFlag) {
        var objExcludeUserDate = omitKeys(values, ["userDate"]);
        setformValidFlag(
          !Object.values(objExcludeUserDate).every(
            (v) => v == null || (typeof v === "string" && v.trim() === "")
          )
        );
      }
    }
  };

  const submit = async () => {
    const values = await MaterialObjectsForm.validateFields();
    handleSubmit(values);
    SetFormValid(false);
    MaterialObjectsForm.resetFields();
    setViewMaterialObjectDetails(false);
    resetEdit();
  };

  const handleAddAddress = (values) => {
    MaterialObjectsForm.setFieldsValue({
      placeofseizure: values?.address1 + "," + values.address2,
    });
    addAddress(values);
  };

  const selectedIOName =
    !isEmpty(staffListData) &&
    first(staffListData.filter((s) => s.label === currentUser.employee_name))
      ?.label;

  useEffect(() => {
    MaterialObjectsForm.setFieldsValue({
      seizedBy: selectedIOName,
    });
  }, []);

  useEffect(() => {
    if (currentData) {
      MaterialObjectsForm.setFieldsValue({
        userDate: moment(new Date(currentData?.userDate)).isValid()
          ? moment(new Date(currentData?.userDate))
          : "",
        strengthOfEvidence: currentData?.strengthOfEvidence,
        seizedBy: currentData?.seizedBy,
        seizedDate: moment(new Date(currentData?.seizedDate)).isValid()
          ? moment(new Date(currentData?.seizedDate))
          : "",
        type: currentData?.type,
        subType: currentData?.subType,
        panchWitness: currentData?.panchWitness,
        description: currentData?.description,
        seizedFrom: currentData?.seizedFrom,
        placeofseizure: currentData?.placeOfSeizure
          ? currentData?.placeOfSeizure?.address1 +
            "," +
            currentData?.placeOfSeizure?.address2
          : "",
      });
      addAddress(currentData?.placeOfSeizure);
    }
  }, [currentData]);

  return (
    <>
      <div className="widgetPageStyle">
        <Col span={24}>
          <StandardMaterialObjectForm
            changeValue={checkFields}
            disabled={viewMaterialObjectDetails}
            addAddress={handleAddAddress}
            setSelectedSiderMenu={setSelectedSiderMenu}
            address={address}
            fileList={fileList}
            actionName={actionName}
            disableUpload={disableUpload}
            staffListData={staffListData}
            validationFields={[
              "Material Object Type",
              "Material Object Sub-Type",
              "Description of Material Objects",
              "Date & Time Of Seizure",
            ]}
          />
          {isInvestigation && (
            <Form.Item
              style={{ paddingTop: 20 }}
              name="userDate"
              label="Date & Time of Visit"
              rules={[
                {
                  required: true,
                  message: "Please enter Date & Time of Visit!",
                },
              ]}
            >
              <DatePicker
                showTime
                format={DATE_TIME_FORMAT}
                placeholder="Select Date & Time"
                disabled={viewMaterialObjectDetails || currentData}
                disabledDate={disableFuturePastDates}
                onChange={checkFields}
              />
            </Form.Item>
          )}
        </Col>
      </div>
      {showButton && (
        <>
          <Divider />
          <Form.Item>
            <Button
              type="primary"
              className="saveButton"
              size="large"
              icon={<SaveOutlined className="saveButtonIcon" />}
              disabled={!crimeSceneDate || viewMaterialObjectDetails}
              onClick={submit}
            >
              SAVE
            </Button>
            <span className="linkStyle resetLink" onClick={reset}>
              Reset
            </span>
          </Form.Item>
        </>
      )}
    </>
  );
}
