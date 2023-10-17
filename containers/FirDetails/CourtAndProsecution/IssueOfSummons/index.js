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
import { CaretDownOutlined } from "@ant-design/icons";
import {
  IS_SHO,
  IS_IO,
  DATE_FORMAT,
  renderFieldsWithDropDown,
  getAbscondingAccuseds,
  getStaffsDetails,
  IS_INVESTIGATION_OFFICER,
} from "@containers/FirDetails/fir-util";
import ContentHeader from "@containers/FirDetails/ContentHeader";
import { isEmpty, isNull, isArray } from "lodash";
import { useSelector, useDispatch } from "react-redux";
import { config } from "@config/site.config";
import Loader from "@components/utility/loader";
import moment from "moment";
import firActions from "@redux/fir/actions";
import { loadState } from "@lib/helpers/localStorage";
import suspectAccusedAction from "@redux/investigations/suspectAccused/actions";
import masterDataActions from "@redux/masterData/actions";
import issueOfSummons from "@redux/CourtAndProsecution/IssueOfSummons/actions";
import {
  addIssueOfSummonsPayload,
  updateIssueOfSummonsPayload,
} from "./payload";
import { ModuleWrapper } from "../../Investigation/CommonDetails/styles";
import SavedRecords from "./savedRecord";
import { summonToList } from "../const";
import { CourtAndProsecutionWrapper } from "../styles";

const Option = Select.Option;

export default function IssueOfSummons({
  setSelectedSiderMenu,
  isCourtCaseDiary = false,
  onCancel,
  formDisable,
  formData,
}) {
  const [form] = Form.useForm();
  const { savedFir } = useSelector((state) => state.createFIR);
  const crimeId = loadState("selectedFirId");
  const selectedCourtAndProsecution = loadState("selectedCourtAndProsecution");
  const dispatch = useDispatch();
  const [serchText, setSerchText] = useState("");
  const currentUser = loadState("currentUser");
  const userRole = [IS_SHO, IS_IO, IS_INVESTIGATION_OFFICER];
  const IS_HIGHER_SHO_USER = !userRole?.includes(currentUser?.ecopsv2_role);
  const disableForm =
    (IS_HIGHER_SHO_USER &&
      currentUser?.isPersnolized === false &&
      currentUser?.isIo === false) ||
    savedFir?.caseStatus === "Disposal" ||
    !!formDisable ||
    selectedCourtAndProsecution.isCourtDisposal;
  const [summonsTo, setSummonsTo] = useState("");
  const { issueOfSummonsList } = useSelector((state) => state?.IssueOfSummons);
  const [formValid, setFormValid] = useState(false);
  const [editIssueOfSummons, setEditIssueOfSummons] = useState(null);
  const [isRecordsModalVisible, setIsRecordModalVisible] = useState(false);
  const {
    addIssueOfSummons,
    updateIssueOfSummons,
    getIssueOfSummonsList,
    resetActionType,
  } = issueOfSummons;
  const [selectedAccusedValue, setSelectedAccusedValue] = useState([]);
  const { getAccusedList } = suspectAccusedAction;
  const { suspectAccusedList } = useSelector((state) => state.SuspectAccused);
  const briefFacts = savedFir?.firDetail?.briefFacts;

  const filterChargeSheetAccusedData = suspectAccusedList?.filter(
    (accused) =>
      !accused?.isDied &&
      !accused?.isCourtSummonsIssued &&
      selectedCourtAndProsecution?.data?.accusedParticulars.some(
        (data) =>
          data?.accusedPersonId?._id === accused?.person?._id &&
          (data?.chargeStatus === "Charged" ||
            data?.chargeStatus === "Absconding")
      )
  );

  const getAccusedDropdownData = () =>
    getAccuseds(
      !!editIssueOfSummons?._id
        ? suspectAccusedList
        : filterChargeSheetAccusedData
    );

  const { actionType, errorMessage, successMessage, isFetching } = useSelector(
    (state) => state.IssueOfSummons
  );
  const { fetchWitnessDetailsList, fetchWitnessStatementsList } = firActions;
  const { witnessStatementListNew } = useSelector((state) => state.FIR);
  const [viewClicked, setViewClicked] = useState(false);
  const { staffList } = useSelector((state) => state.MasterData);
  const selectedFir = loadState("selectedFir");
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
    dispatch(
      getStaffList(
        `${config.getSupportStaffFromHrms}?policestationcode=${selectedFir?.psCode}`
      )
    );
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
      getIssueOfSummonsList(
        `${config.courtSummons}?crimeId=${crimeId}&updateChargesheetId=${selectedCourtAndProsecution?.updateChargesheetId}`
      )
    );
  }, [dispatch]);

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

  const isSuccess =
    actionType === "ADD_ISSUE_OF_SUMMONS_SUCCESS" ||
    actionType === "UPDATE_ISSUE_OF_SUMMONS_SUCCESS";

  const isError =
    actionType === "ADD_ISSUE_OF_SUMMONS_ERROR" ||
    actionType === "UPDATE_ISSUE_OF_SUMMONS_ERROR";

  const openNotificationWithIcon = (type, message) => {
    return notification[type]({
      message: message,
    });
  };

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
            )
          ) {
            witnessDataListData?.push(element);
          }
        });
        return !!editIssueOfSummons?._id
          ? witnessDataList
          : witnessDataListData;
      case "IO":
        const IODataListData = [];
        staffMembersList.forEach((element) => {
          if (
            !issueOfSummonsList?.some(
              (item) => item?.other?.paoCode === element?.paoCode
            )
          ) {
            IODataListData.push(element);
          }
        });
        return !!editIssueOfSummons?._id ? staffMembersList : IODataListData;
      case "SHO":
        const SHODataListData = [];
        SHOList.forEach((element) => {
          if (
            !issueOfSummonsList?.some(
              (item) => item?.other?.paoCode === element?.paoCode
            )
          ) {
            SHODataListData.push(element);
          }
        });
        return !!editIssueOfSummons?._id ? SHOList : SHODataListData;
      default:
        return [];
    }
  };

  useEffect(() => {
    if (
      !!formData === true &&
      Object.keys(!!formData ? formData : {})?.length !== 0
    ) {
      const values = issueOfSummonsList?.find((item) =>
        !!item?.person?._id
          ? item?.person?._id === formData?.witnessId
          : item?.other?.paoCode === formData?.ioCode
      );
      if (!!values) {
        setEditIssueOfSummons(values);
        form.setFieldsValue({
          summonsTo: values.summonsTo,
          issuedOn: !!values.issuedOn
            ? moment(new Date(values.issuedOn))
            : null,
          dateOfTrial: !!values.dateOfTrial
            ? moment(new Date(values.dateOfTrial))
            : null,
          datePSReceived: !!values.datePSReceived
            ? moment(new Date(values.datePSReceived))
            : null,
          person: !!values?.person?._id
            ? [values?.person?._id]
            : !!values?.other?.paoCode
            ? [values?.other?.paoCode]
            : [],
        });
        getDropdownData(values.summonsTo);
        setSummonsTo("");
        setSummonsTo(values.summonsTo);
        setSelectedAccusedValue(
          !!values?.person?._id
            ? [values?.person?._id]
            : !!values?.other?.paoCode
            ? [values?.other?.paoCode]
            : []
        );
      } else {
        form.setFieldsValue({
          summonsTo: !!formData?.witnessId ? "Witness" : "IO",
          person: !!formData?.witnessId
            ? [formData?.witnessId]
            : !!formData?.ioCode
            ? [formData?.ioCode]
            : [],
        });
        getDropdownData(!!formData?.witnessId ? "Witness" : "IO");
        setSummonsTo("");
        setSummonsTo(!!formData?.witnessId ? "Witness" : "IO");
        setSelectedAccusedValue(
          !!formData?.witnessId
            ? [formData?.witnessId]
            : !!formData?.ioCode
            ? [formData?.ioCode]
            : []
        );
      }
    } else {
      setEditIssueOfSummons(null);
      form.resetFields();
      setSummonsTo("");
      setSelectedAccusedValue([]);
    }
  }, [formData, issueOfSummonsList]);

  const fetchAccusedList = () => {
    dispatch(
      getAccusedList(
        `${config.getPostCrimeSceneDetails}/ACCUSED/?crimeId=${crimeId}`
      )
    );
  };

  useEffect(() => {
    fetchAccusedList();
  }, []);

  const handleSearch = (text) => {
    setSerchText(text);
  };

  const checkFields = async () => {
    const values = await form.validateFields();
    setFormValid(!Object.values(values).every((v) => v == null || v === ""));
    if (!!values?.summonsTo === false) {
      setFormValid(false);
    }
    if (values?.person.length === 0 || !!values?.person === false) {
      setFormValid(false);
    }
  };

  const submit = async () => {
    const values = await form.validateFields();
    if (editIssueOfSummons?._id) {
      values["courtSummonsId"] = editIssueOfSummons?._id;
    }
    let otherData = [];
    if (values.summonsTo === "SHO" || values.summonsTo === "IO") {
      if (values.summonsTo === "SHO") {
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

    const addPayload = addIssueOfSummonsPayload(
      values,
      crimeId,
      otherData,
      selectedAccusedValue,
      selectedCourtAndProsecution
    );

    const updatePayload = updateIssueOfSummonsPayload(
      values,
      crimeId,
      editIssueOfSummons?._id,
      otherData,
      selectedAccusedValue,
      selectedCourtAndProsecution
    );

    if (editIssueOfSummons?._id) {
      dispatch(
        updateIssueOfSummons(
          `${config.IssueOfSummons}?crimeId=${crimeId}`,
          updatePayload
        )
      );
    } else {
      dispatch(
        addIssueOfSummons(
          `${config.IssueOfSummons}?crimeId=${crimeId}`,
          addPayload
        )
      );
    }
  };

  const handleSummons = (values) => {
    setSummonsTo(values);
    setSelectedAccusedValue([]);
    form.setFieldsValue({ person: [] });
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
    setEditIssueOfSummons(values);
    form.setFieldsValue({
      summonsTo: values.summonsTo,
      issuedOn: !!values.issuedOn ? moment(new Date(values.issuedOn)) : null,
      dateOfTrial: !!values.dateOfTrial
        ? moment(new Date(values.dateOfTrial))
        : null,
      datePSReceived: !!values.datePSReceived
        ? moment(new Date(values.datePSReceived))
        : null,
      person: !!values?.person?._id
        ? [values?.person?._id]
        : !!values?.other?.paoCode
        ? [values?.other?.paoCode]
        : [],
    });
    getDropdownData(values.summonsTo);
    setSummonsTo("");
    setSummonsTo(values.summonsTo);
    setSelectedAccusedValue([values?.person?._id]);
  };
  return (
    <ModuleWrapper>
      <CourtAndProsecutionWrapper>
        <ContentHeader
          headerTitle="Issue Of Summons"
          onSubmitClick={submit}
          isInvestigation={true}
          onCancel={() =>
            isCourtCaseDiary
              ? onCancel()
              : setSelectedSiderMenu("courtandprosecution")
          }
          disableButton={disableForm}
        />
        <Row>
          {isFetching ? (
            <Loader />
          ) : (
            <>
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
                <Form form={form} colon={false} layout="vertical">
                  <Row gutter={24}>
                    <Col span={12}>
                      <Form.Item
                        name="summonsTo"
                        label="Summons to"
                        rules={[
                          {
                            required: true,
                            message: "Summons to is required!",
                          },
                        ]}
                      >
                        {renderFieldsWithDropDown(
                          summonToList,
                          handleSummons,
                          handleSearch,
                          serchText,
                          250,
                          disableForm ||
                            editIssueOfSummons?._id ||
                            Object.keys(!!formData ? formData : {}).length !==
                              0,
                          "",
                          "Accused"
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="issuedOn" label="Summons Issued on">
                        <DatePicker
                          format={DATE_FORMAT}
                          disabled={disableForm || viewClicked}
                          placeholder="Select Date"
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
                            message: `Select ${
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
                            editIssueOfSummons?._id ||
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
                      <Form.Item name="dateOfTrial" label="Date of Trial">
                        <DatePicker
                          format={DATE_FORMAT}
                          disabled={disableForm || viewClicked}
                          placeholder="Select Date"
                          style={{ width: 250 }}
                          onChange={checkFields}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={24} style={{ marginTop: 10 }}>
                    <Col span={12}>
                      <Form.Item name="datePSReceived" label="PS received Date">
                        <DatePicker
                          format={DATE_FORMAT}
                          disabled={disableForm || viewClicked}
                          placeholder="Select Date"
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
                  {issueOfSummonsList?.length > 0 ? (
                    <Button
                      style={{ marginTop: 40, width: "100%" }}
                      onClick={() => setIsRecordModalVisible(true)}
                    >
                      {`${issueOfSummonsList?.length} Issue Of Summons Record(s)`}
                    </Button>
                  ) : null}
                  <Modal
                    title=" Issue Of Summons Record(s)"
                    visible={isRecordsModalVisible}
                    onOk={() => setIsRecordModalVisible(false)}
                    onCancel={() => setIsRecordModalVisible(false)}
                    style={{ minWidth: "95vw" }}
                    footer={null}
                  >
                    <div style={{ maxHeight: 650, overflowY: "auto" }}>
                      <SavedRecords
                        dataSource={issueOfSummonsList}
                        setSelectedData={setSelectedData}
                        setViewClicked={setViewClicked}
                        setFormValid={setFormValid}
                        setIsRecordModalVisible={setIsRecordModalVisible}
                      />
                    </div>
                  </Modal>
                </Card>
              ) : null}
            </>
          )}
        </Row>
      </CourtAndProsecutionWrapper>
    </ModuleWrapper>
  );
}
