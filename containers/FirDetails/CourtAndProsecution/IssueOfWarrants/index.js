/* eslint-disable array-callback-return */
import { useState, useEffect } from "react";
import {
  Row,
  Card,
  Col,
  Form,
  DatePicker,
  Select,
  notification,
  Modal,
  Button,
} from "antd";
import {
  IS_SHO,
  IS_IO,
  DATE_FORMAT,
  renderFieldsWithDropDown,
  getAccuseds,
  masterDataType,
  getStaffsDetails,
  IS_INVESTIGATION_OFFICER,
} from "@containers/FirDetails/fir-util";
import Loader from "@components/utility/loader";
import { ModuleWrapper } from "@containers/FirDetails/Investigation/CommonDetails/styles";
import { useSelector, useDispatch } from "react-redux";
import { isEmpty, isNull, isArray } from "lodash";
import { CaretDownOutlined } from "@ant-design/icons";
import ContentHeader from "@containers/FirDetails/ContentHeader";
import suspectAccusedAction from "@redux/investigations/suspectAccused/actions";
import { config } from "@config/site.config";
import { loadState } from "@lib/helpers/localStorage";
import issueOfWarrant from "@redux/CourtAndProsecution/IssueOfWarrants/actions";
import masterDataActions from "@redux/masterData/actions";
import firActions from "@redux/fir/actions";
import moment from "moment";

import {
  addIssueOfWarrantPayload,
  updateIssueOfWarrantPayload,
} from "./payload";
import SavedRecords from "./savedRecord";
import { summonToList, listOfWarrantType } from "../const";
import DeathOfAccusedActions from "@redux/CourtAndProsecution/DeathOfAccused/actions.js";
import { CourtAndProsecutionWrapper } from "../styles";

const Option = Select.Option;

export default function IssueOfWarrants({
  setSelectedSiderMenu,
  isCourtCaseDiary = false,
  onCancel,
  formData,
  formDisable,
}) {
  const [form] = Form.useForm();
  const crimeId = loadState("selectedFirId");
  const { getDeathOfAccusedList } = DeathOfAccusedActions;
  const selectedCourtAndProsecution = loadState("selectedCourtAndProsecution");
  const dispatch = useDispatch();
  const { savedFir } = useSelector((state) => state.createFIR);
  const [serchText, setSerchText] = useState("");
  const { deathOfAccusedList } = useSelector((state) => state.DeathOfAccused);
  const currentUser = loadState("currentUser");
  const userRole = [IS_SHO, IS_IO, IS_INVESTIGATION_OFFICER];
  const IS_HIGHER_SHO_USER = !userRole?.includes(currentUser?.ecopsv2_role);

  const disableForm =
    (IS_HIGHER_SHO_USER &&
      currentUser?.isPersnolized === false &&
      currentUser?.isIo === false) ||
    savedFir?.caseStatus === "Disposal" ||
    formDisable ||
    selectedCourtAndProsecution.isCourtDisposal;
  const [summonsTo, setSummonsTo] = useState("");
  const [formValid, setFormValid] = useState(false);
  const [selectedAccusedValue, setSelectedAccusedValue] = useState("");
  const [editIssueOfWarrants, setEditIssueOfWarrants] = useState(null);
  const [isRecordsModalVisible, setIsRecordModalVisible] = useState(false);
  const [viewClicked, setViewClicked] = useState(false);
  const { issueOfWarrantsList } = useSelector(
    (state) => state?.IssueOfWarrants
  );
  const { getAccusedList } = suspectAccusedAction;
  const [editIssueOfWarrant, seteditIssueOfWarrant] = useState(null);
  const { suspectAccusedList } = useSelector((state) => state.SuspectAccused);
  const filterAccusedList = suspectAccusedList?.filter((item) => !item?.isDied);
  const filterChargeSheetAccusedData = [];
  const {
    addIssueOfWarrants,
    updateIssueOfWarrants,
    getIssueOfWarrantsList,
    resetActionType,
  } = issueOfWarrant;

  const { actionType, errorMessage, successMessage, isFetching } = useSelector(
    (state) => state.IssueOfWarrants
  );

  const isSuccess =
    actionType === "ADD_ISSUE_OF_WARRANTS_SUCCESS" ||
    actionType === "UPDATE_ISSUE_OF_WARRANTS_SUCCESS";

  const isError =
    actionType === "ADD_ISSUE_OF_WARRANTS_ERROR" ||
    actionType === "UPDATE_ISSUE_OF_WARRANTS_ERROR";

  const openNotificationWithIcon = (type, message) => {
    return notification[type]({
      message: message,
    });
  };

  filterAccusedList.forEach((item) => {
    if (
      selectedCourtAndProsecution?.data?.accusedParticulars.some(
        (data) =>
          data?.accusedPersonId?._id === item?.person?._id &&
          (data?.chargeStatus === "Charged" ||
            data?.chargeStatus === "Absconding")
      ) === true
    ) {
      filterChargeSheetAccusedData.push(item);
    }
  });

  const filterNonDeathOfAccused = [];

  filterChargeSheetAccusedData.forEach((accused) => {
    if (
      deathOfAccusedList.some(
        (deathAcc) => deathAcc?.accusedId !== accused?.person?._id
      )
    ) {
      filterNonDeathOfAccused.push(accused);
    }
  });

  const getAccusedDropdownData = () =>
    getAccuseds(
      !isEmpty(deathOfAccusedList)
        ? filterNonDeathOfAccused
        : filterChargeSheetAccusedData
    );

  const { fetchWitnessDetailsList, fetchWitnessStatementsList } = firActions;
  const { witnessStatementListNew } = useSelector((state) => state.FIR);
  const briefFacts = savedFir?.firDetail?.briefFacts;
  const { staffList } = useSelector((state) => state.MasterData);
  const { getStaffList } = masterDataActions;
  const staffMembers = staffList && getStaffsDetails(staffList);
  const staffMembersList = staffMembers?.filter(
    (item) => item?.paoCode === briefFacts?.ioAssigned
  );
  let evidanceResult = !isEmpty(witnessStatementListNew)
    ? witnessStatementListNew.map((witnessList, i) => ({
        isChargeSheet: witnessList?.isChargeSheet,
        statementId: witnessList?._id,
        witnessCode: witnessList?.statementDetails?.witnessCode,
        person: witnessList?.witnessId,
        witnessStatements: witnessList,
      }))
    : [];

  useEffect(() => {
    dispatch(getStaffList(`${config.getMasterData}/${masterDataType.STAFF}`));
    dispatch(
      getAccusedList(
        `${config.getPostCrimeSceneDetails}/ACCUSED/?crimeId=${crimeId}`
      )
    );
    dispatch(
      fetchWitnessDetailsList(
        `${config.getPostCrimeSceneDetails}/WITNESSDETAILS/?crimeId=${crimeId}`
      )
    );
    dispatch(
      fetchWitnessStatementsList(
        `${config.getWitnessStatements}/?crimeId=${crimeId}`
      )
    );
    dispatch(
      getIssueOfWarrantsList(
        `${config.IssueOfWarrants}?crimeId=${crimeId}&updateChargesheetId=${selectedCourtAndProsecution?.updateChargesheetId}`
      )
    );
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      getDeathOfAccusedList(
        `${config.getDeathOfAccused}?crimeId=${crimeId}&updateChargesheetId=${selectedCourtAndProsecution?.updateChargesheetId}`
      )
    );
  }, []);

  const SHOList =
    staffList &&
    getStaffsDetails(
      staffList.filter(
        (item) =>
          item?.empRoleName.includes("SHO") &&
          item?.paoCode === briefFacts?.ioAssigned
      )
    );

  const witnessDataList = isArray(evidanceResult)
    ? evidanceResult.map((data) => {
        const personalData = data?.person?.personalDetails;
        const WitnessName = `${personalData?.name || ""} ${
          personalData?.surname || ""
        }`;
        const { presentAddress } = !isNull(data?.person) && data?.person;
        return {
          label: WitnessName,
          _id: data?.person?._id,
          WitnessName,
          presentAddress,
        };
      })
    : [];

  useEffect(() => {
    if (isSuccess || isError) {
      if (successMessage) {
        openNotificationWithIcon("success", successMessage);
        form.resetFields();
        isCourtCaseDiary
          ? onCancel()
          : setSelectedSiderMenu("courtandprosecution");
        dispatch(
          getAccusedList(
            `${config.getPostCrimeSceneDetails}/ACCUSED/?crimeId=${crimeId}`
          )
        );
        dispatch(resetActionType());
      } else if (errorMessage) {
        openNotificationWithIcon("error", errorMessage);
        dispatch(resetActionType());
      }
    }
  }, [actionType]);

  const getDropdownData = (summonsTo) => {
    switch (summonsTo) {
      case "Accused":
        return getAccusedDropdownData();
      case "Witness":
        const witnessDataListData = [];
        witnessDataList.forEach((element) => {
          if (
            selectedCourtAndProsecution?.data?.memoOfEvidences?.some(
              (item) => item?.witnessId?._id === element?._id
            ) &&
            !issueOfWarrantsList?.some(
              (item) => item?.person?._id === element?._id
            )
          ) {
            witnessDataListData?.push(element);
          }
        });
        return !!editIssueOfWarrant?._id
          ? witnessDataList
          : witnessDataListData;
      case "IO":
        const IODataListData = [];
        staffMembersList.forEach((element) => {
          if (
            !issueOfWarrantsList?.some(
              (item) => item?.other?.paoCode === element?.paoCode
            )
          ) {
            IODataListData.push(element);
          }
        });
        return !!editIssueOfWarrant?._id ? staffMembersList : IODataListData;
      case "SHO":
        const SHODataListData = [];
        SHOList.forEach((element) => {
          if (
            !issueOfWarrantsList?.some(
              (item) => item?.other?.paoCode === element?.paoCode
            )
          ) {
            SHODataListData.push(element);
          }
        });
        return !!editIssueOfWarrant?._id ? SHOList : SHODataListData;
      default:
        return [];
    }
  };

  const handleSearch = (text) => {
    setSerchText(text);
  };

  useEffect(() => {
    if (!!formData === true && Object.keys(formData)?.length !== 0) {
      const values = issueOfWarrantsList?.find(
        (item) => item?.person?._id === formData?.person
      );
      if (!!values) {
        setEditIssueOfWarrants(values);
        form.setFieldsValue({
          warrantsTo: values.warrantsTo,
          warrantType: values.warrantType,
          dateOfTrial: !!values.dateOfTrial
            ? moment(new Date(values.dateOfTrial))
            : null,
          warrantIssuedDate: !!values.warrantIssuedDate
            ? moment(new Date(values.warrantIssuedDate))
            : null,
          psReceivedDate: !!values.psReceivedDate
            ? moment(new Date(values.psReceivedDate))
            : null,
          person: !!values?.person?._id
            ? [values?.person?._id]
            : !!values?.other?.paoCode
            ? [values?.other?.paoCode]
            : [],
        });
        getDropdownData(values.warrantsTo);
        setSummonsTo("");
        setSummonsTo(values.warrantsTo);
        setSelectedAccusedValue([values?.person?._id]);
      } else {
        form.setFieldsValue({
          warrantsTo: "Accused",
          person: [formData?.person],
        });
        getDropdownData("Accused");
        setSummonsTo("Accused");
        setSelectedAccusedValue([formData?.person]);
      }
    }
  }, [formData, issueOfWarrantsList]);

  const checkFields = async () => {
    const values = await form.validateFields();
    setFormValid(!Object.values(values).every((v) => v == null || v === ""));
  };

  const submit = async () => {
    const values = await form.validateFields();
    if (editIssueOfWarrants?._id) {
      values["issueOfWarrantId"] = editIssueOfWarrants?._id;
    }
    let otherData = [];
    if (values.warrantsTo === "SHO" || values.warrantsTo === "IO") {
      if (values.warrantsTo === "SHO") {
        for (let i = 0; i < SHOList?.length; i++) {
          for (let j = 0; j < selectedAccusedValue?.length; j++) {
            if (
              SHOList[i]?.paoCode === selectedAccusedValue[j] &&
              !otherData?.some(
                (item) => item?.paoCode === selectedAccusedValue[j]
              )
            ) {
              Object.assign(SHOList[i], { name: SHOList[i]?.label });
              otherData.push(SHOList[i]);
            }
          }
        }
      } else {
        for (let i = 0; i < staffMembersList?.length; i++) {
          for (let j = 0; j < selectedAccusedValue?.length; j++) {
            if (
              staffMembersList[i]?.paoCode === selectedAccusedValue[j] &&
              !otherData?.some(
                (item) => item?.paoCode === selectedAccusedValue[j]
              )
            ) {
              Object.assign(staffMembersList[i], {
                name: staffMembersList[i]?.label,
              });
              otherData.push(staffMembersList[i]);
            }
          }
        }
      }
    }

    const addPayload = addIssueOfWarrantPayload(
      values,
      crimeId,
      otherData,
      selectedAccusedValue,
      selectedCourtAndProsecution
    );

    const updatePayload = updateIssueOfWarrantPayload(
      values,
      crimeId,
      otherData,
      selectedAccusedValue,
      selectedCourtAndProsecution
    );

    if (editIssueOfWarrants?._id) {
      dispatch(
        updateIssueOfWarrants(
          `${config.IssueOfWarrants}?crimeId=${crimeId}`,
          updatePayload
        )
      );
    } else {
      dispatch(
        addIssueOfWarrants(
          `${config.IssueOfWarrants}?crimeId=${crimeId}`,
          addPayload
        )
      );
    }
  };

  const handleSelect = (values) => {
    if (values.includes("all")) {
      if (values.length === getDropdownData(summonsTo).length + 1) {
        setSelectedAccusedValue([]);
        form.setFieldsValue({ person: [] });
      } else {
        let accusedValue = [];
        getDropdownData(summonsTo).map((item) => {
          return accusedValue?.push(!!item._id ? item._id : item?.paoCode);
        });
        setSelectedAccusedValue(accusedValue);
        form.setFieldsValue({ person: accusedValue });
      }
    } else {
      setSelectedAccusedValue(values);
      form.setFieldsValue({ person: values });
    }
    checkFields();
  };

  const setSelectedData = (values) => {
    setEditIssueOfWarrants(values);
    getDropdownData(values.warrantsTo);
    form.setFieldsValue({
      warrantsTo: values.warrantsTo,
      warrantType: values.warrantType,
      dateOfTrial: !!values.dateOfTrial
        ? moment(new Date(values.dateOfTrial))
        : null,
      warrantIssuedDate: !!values.warrantIssuedDate
        ? moment(new Date(values.warrantIssuedDate))
        : null,
      psReceivedDate: !!values.psReceivedDate
        ? moment(new Date(values.psReceivedDate))
        : null,

      person: values?.person?._id
        ? [values?.person?.personalDetails?.name]
        : values?.other?.paoCode
        ? [values?.other?.name]
        : [],
    });
    setSummonsTo("");
    setSummonsTo(values.warrantsTo);
    setSelectedAccusedValue([values?.other?.paoCode]);
  };

  return (
    <ModuleWrapper>
      <CourtAndProsecutionWrapper>
        <ContentHeader
          headerTitle="Issue Of Warrants"
          onSubmitClick={submit}
          isInvestigation={true}
          onCancel={() =>
            isCourtCaseDiary
              ? onCancel()
              : setSelectedSiderMenu("courtandprosecution")
          }
          disableButton={disableForm}
        />
        {isFetching ? (
          <Loader />
        ) : (
          <Row>
            <Card
              style={{
                width: `${
                  !!formData === false &&
                  Object.keys(!!formData ? formData : {})?.length === 0
                    ? "70%"
                    : "100%"
                }`,
                padding: 10,
                height: 400,
                minHeight: 400,
              }}
              className="cardLeftStyle"
            >
              <Form form={form} layout="vertical">
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item
                      name="warrantsTo"
                      label="Warrants to"
                      rules={[
                        {
                          required: true,
                          message: "Warrants to is required!",
                        },
                      ]}
                    >
                      {renderFieldsWithDropDown(
                        summonToList,
                        setSummonsTo,
                        handleSearch,
                        serchText,
                        250,
                        disableForm ||
                          viewClicked ||
                          editIssueOfWarrants?._id ||
                          Object.keys(!!formData ? formData : {}).length !== 0,
                        "",
                        "Accused"
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="dateOfTrial" label="Date of Trial">
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
                <Row gutter={24} style={{ marginTop: 10 }}>
                  <Col span={12}>
                    <Form.Item
                      name="person"
                      label={`Select ${
                        !isEmpty(summonsTo) ? summonsTo : "Accused"
                      }`}
                      rules={[
                        {
                          required: true,
                          message: `${
                            !isEmpty(summonsTo) ? summonsTo : "Accused"
                          } is required!`,
                        },
                      ]}
                    >
                      <Select
                        suffixIcon={
                          <CaretDownOutlined className="dropDownIcon" />
                        }
                        showSearch
                        onSearch={handleSearch}
                        filterOption={(input, option) =>
                          serchText &&
                          option.props.label
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                        onChange={handleSelect}
                        disabled={
                          disableForm ||
                          editIssueOfWarrants?._id ||
                          Object.keys(!!formData ? formData : {}).length !== 0
                        }
                        style={{ width: 250 }}
                        mode="multiple"
                      >
                        {getDropdownData(summonsTo)?.length > 1 ? (
                          <Option key="all" value="all" label="Select All">
                            Select All
                          </Option>
                        ) : null}
                        {getDropdownData(summonsTo).map((item, index) => (
                          <Option
                            key={index}
                            value={!!item._id ? item._id : item?.paoCode}
                            label={item.label}
                          >
                            {item.label}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="warrantType" label="Warrant type">
                      {renderFieldsWithDropDown(
                        listOfWarrantType,
                        null,
                        handleSearch,
                        serchText,
                        250,
                        disableForm || viewClicked,
                        "",
                        "Warrant type"
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24} style={{ marginTop: 10 }}>
                  <Col span={12}>
                    <Form.Item
                      name="warrantIssuedDate"
                      label="Warrant Issue date"
                    >
                      <DatePicker
                        format={DATE_FORMAT}
                        disabled={disableForm || viewClicked}
                        placeholder="Date"
                        style={{ width: 250 }}
                        onChange={checkFields}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="psReceivedDate" label="PS Received Date">
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
              </Form>
            </Card>
            {!!formData === false &&
            Object.keys(!!formData ? formData : {})?.length === 0 ? (
              <Card
                style={{ width: "30%", height: 400, minHeight: 400 }}
                className="cardRightStyle"
              >
                {issueOfWarrantsList?.length > 0 ? (
                  <Button
                    style={{ marginTop: 40, width: "100%" }}
                    onClick={() => setIsRecordModalVisible(true)}
                  >
                    {`${issueOfWarrantsList?.length} Issue Of Warrant Records`}
                  </Button>
                ) : null}
                <Modal
                  title="Issue Of Warrant Records"
                  visible={isRecordsModalVisible}
                  onOk={() => setIsRecordModalVisible(false)}
                  onCancel={() => setIsRecordModalVisible(false)}
                  style={{ minWidth: "95vw" }}
                  footer={null}
                >
                  <div style={{ maxHeight: 650, overflowY: "auto" }}>
                    <SavedRecords
                      dataSource={issueOfWarrantsList}
                      setSelectedData={setSelectedData}
                      setViewClicked={setViewClicked}
                      setFormValid={setFormValid}
                      setIsRecordModalVisible={setIsRecordModalVisible}
                      disabled={disableForm || viewClicked}
                    />
                  </div>
                </Modal>
              </Card>
            ) : null}
          </Row>
        )}
      </CourtAndProsecutionWrapper>
    </ModuleWrapper>
  );
}
