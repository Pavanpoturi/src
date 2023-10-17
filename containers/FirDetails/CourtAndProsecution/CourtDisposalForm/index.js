/* eslint-disable array-callback-return */
import { useState, useEffect } from "react";
import {
  Row,
  Card,
  Col,
  Form,
  DatePicker,
  Radio,
  Space,
  Input,
  notification,
} from "antd";
import {
  IS_SHO,
  IS_IO,
  DATE_FORMAT,
  renderFieldsWithDropDown,
  getPersonDetails,
  IS_INVESTIGATION_OFFICER,
} from "@containers/FirDetails/fir-util";
import { first, isEmpty, isUndefined } from "lodash";
import moment from "moment";
import Loader from "@components/utility/loader";
import AddPerson from "@containers/FirDetails/Investigation/CommonForms/AddPerson";
import ContentHeader from "@containers/FirDetails/ContentHeader";
import { useDispatch, useSelector } from "react-redux";
import suspectAccusedAction from "@redux/investigations/suspectAccused/actions";
import createFIRActions from "@redux/createFir/actions";
import { config } from "@config/site.config";
import { loadState } from "@lib/helpers/localStorage";
import masterDataActions from "@redux/masterData/actions";
import CourtDisposalFormAction from "@redux/CourtAndProsecution/CourtDisposalForm/actions.js";
import AccusedDisposalFormAction from "@redux/CourtAndProsecution/AccusedDisposalForm/actions.js";
import TableRecords from "./TableRecords";
import { disposalList, appealPreferredList } from "../const";
import { addCourtDisposalPayload, updateCourtDisposalPayload } from "./payload";
import { CourtAndProsecutionWrapper } from "../styles";

export default function CourtDisposalForm({
  setSelectedSiderMenu,
  isCourtCaseDiary = false,
  onCancel,
}) {
  const [form] = Form.useForm();
  const [personForm] = Form.useForm();
  const dispatch = useDispatch();
  const { savedFir } = useSelector((state) => state.createFIR);
  const selectedCourtAndProsecution = loadState("selectedCourtAndProsecution");
  const currentUser = loadState("currentUser");
  const crimeId = loadState("selectedFirId");
  const [serchText, setSerchText] = useState("");
  const [age, setAge] = useState("");
  const [inputList, setInputList] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const userRole = [IS_SHO, IS_IO, IS_INVESTIGATION_OFFICER];
  const IS_HIGHER_SHO_USER = !userRole?.includes(currentUser?.ecopsv2_role);

  const disableForm =
    (IS_HIGHER_SHO_USER &&
      currentUser?.isPersnolized === false &&
      currentUser?.isIo === false) ||
    savedFir?.caseStatus === "Disposal" ||
    selectedCourtAndProsecution.isCourtDisposal;
  const [formValid, setFormValid] = useState(false);
  const [summonsIssued, setSummonsIssued] = useState(false);
  const { getActList } = masterDataActions;
  const { getAccusedList } = suspectAccusedAction;
  const { getCourtsBasedonPsCode } = masterDataActions;
  const [editCourtDisposal, setEditCourtDisposal] = useState("");
  const { getFIRData } = createFIRActions;
  const { accusedDisposalFormList } = useSelector(
    (state) => state.AccusedDisposalForm
  );
  const { getAccusedDisposalFormList } = AccusedDisposalFormAction;
  const { actList } = useSelector((state) => state.MasterData);
  const { suspectAccusedList } = useSelector((state) => state.SuspectAccused);
  const {
    actionType,
    errorMessage,
    successMessage,
    isFetching,
    courtDisposalFormList,
  } = useSelector((state) => state.CourtDisposalForm);

  const {
    addCourtDisposalForm,
    updateCourtDisposalForm,
    getCourtDisposalFormList,
    resetActionType,
    resetCourtDisposalFormList,
  } = CourtDisposalFormAction;

  const isSuccess =
    actionType === "ADD_COURT_DISPOSAL_FORM_SUCCESS" ||
    actionType === "UPDATE_COURT_DISPOSAL_FORM_SUCCESS";

  const isError =
    actionType === "ADD_COURT_DISPOSAL_FORM_ERROR" ||
    actionType === "UPDATE_COURT_DISPOSAL_FORM_ERROR";

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
        const filterData = Object.assign(selectedCourtAndProsecution, {
          isCourtDisposal: true,
        });
        localStorage.removeItem("selectedCourtAndProsecution");
        localStorage.setItem(
          "selectedCourtAndProsecution",
          JSON.stringify(filterData)
        );
        dispatch(resetActionType());
        dispatch(getFIRData(`${config.getFIR}?crimeId=${crimeId}`));
      } else if (errorMessage) {
        openNotificationWithIcon("error", errorMessage);
        dispatch(resetActionType());
      }
    }
  }, [actionType]);

  useEffect(() => {
    dispatch(resetCourtDisposalFormList());
    form.resetFields();
    dispatch(
      getAccusedList(
        `${config.getPostCrimeSceneDetails}/ACCUSED/?crimeId=${crimeId}`
      )
    );
    dispatch(
      getCourtsBasedonPsCode(
        `${config.masterData}/getCourtsBasedonPsCode?psCode=${currentUser?.cctns_unit_id}`
      )
    );
    dispatch(
      getCourtDisposalFormList(
        `${config.CourtDisposal}?crimeId=${crimeId}&updateChargesheetId=${selectedCourtAndProsecution?.updateChargesheetId}`
      )
    );
    dispatch(getActList(`${config.getMasterData}/ACT`));
    dispatch(
      getAccusedDisposalFormList(
        `${config.accusedDisposal}?crimeId=${crimeId}&updateChargesheetId=${selectedCourtAndProsecution?.updateChargesheetId}`
      )
    );
  }, []);

  useEffect(() => {
    form.setFieldsValue({
      disposalType: courtDisposalFormList[0]?.disposalType,
      dateOfJudgement: courtDisposalFormList[0]?.dateOfJudgement
        ? moment(new Date(courtDisposalFormList[0]?.dateOfJudgement))
        : "",
      judgeName: !!courtDisposalFormList[0]?.personalDetails?.surname
        ? courtDisposalFormList[0]?.personalDetails?.surname +
          " " +
          courtDisposalFormList[0]?.personalDetails?.name
        : courtDisposalFormList[0]?.personalDetails?.name,
      nameOfPPOrAPP: courtDisposalFormList[0]?.nameOfPPOrAPP,
      appealPreferred: courtDisposalFormList[0]?.appealPreferred,
      appealPreferredOthers: courtDisposalFormList[0]?.appealPreferred,
    });
    setSummonsIssued(courtDisposalFormList[0]?.appealPreferred);
    setEditCourtDisposal(courtDisposalFormList[0]);
    if (
      !!courtDisposalFormList[0]?.personDefenseCounsel?.personalDetails?.name
    ) {
      const {
        personalDetails,
        presentAddress,
        dateCreated,
        _id,
        contactDetails,
        sameAsPresent,
        permanentAddress,
      } = courtDisposalFormList[0]?.personDefenseCounsel;
      const {
        name,
        surname,
        alias,
        gender,
        dateOfBirth,
        age,
        occupation,
        educationQualification,
        caste,
        subCaste,
        religion,
        nationality,
        relationType,
        fatherHusbandGuardianName,
      } = !isUndefined(personalDetails) && personalDetails;
      const {
        houseNo,
        streetRoadNo,
        wardColony,
        landmarkMilestone,
        localityVillage,
        areaMandal,
        district,
        stateUt,
        residencyType,
        pinCode,
      } = !isUndefined(presentAddress) && presentAddress;

      const personObj = {
        lastupdateddatetime: moment(new Date(dateCreated)).isValid()
          ? moment(new Date(dateCreated))
          : "",
        id: _id,
        name: name,
        surname: surname,
        aliasName: alias,
        relationType: relationType,
        fatherHusbandGuardianName: fatherHusbandGuardianName,
        gender: gender,
        dateOfBirth: moment(new Date(dateOfBirth)).isValid()
          ? moment(new Date(dateOfBirth))
          : "",
        occupation: occupation,
        age: age,
        educationQualification: educationQualification,
        caste: caste,
        subCaste: subCaste,
        religion: religion,
        nationality: nationality,
        houseNo: houseNo,
        streetRoadNo: streetRoadNo,
        wardColony: wardColony,
        landmarkMilestone: landmarkMilestone,
        localityVillage: localityVillage,
        areaMandal: areaMandal,
        district: district,
        stateUt: stateUt,
        residencyType: residencyType,
        pinCode: pinCode,
        sameAsPresent: sameAsPresent,
        p_houseNo: permanentAddress?.houseNo,
        p_streetRoadNo: permanentAddress?.streetRoadNo,
        p_wardColony: permanentAddress?.wardColony,
        p_landmarkMilestone: permanentAddress?.landmarkMilestone,
        p_localityVillage: permanentAddress?.localityVillage,
        p_areaMandal: permanentAddress?.areaMandal,
        p_district: permanentAddress?.district,
        p_stateUt: permanentAddress?.stateUt,
        p_residencyType: permanentAddress?.residencyType,
        p_pinCode: permanentAddress?.pinCode,
        phoneNumber: contactDetails[0]?.phoneNumber,
        emailId: contactDetails[0]?.emailId,
      };
      form.setFieldsValue({
        judgeName:
          (personObj?.name ? personObj?.name : "") +
          " " +
          (personObj?.surname ? personObj?.surname : ""),
      });
      personForm.setFieldsValue(personObj);
      setSelectedPerson(personObj);
    } else {
      personForm.resetFields();
      setSelectedPerson({});
    }
  }, [courtDisposalFormList]);

  const handleSearch = (text) => {
    setSerchText(text);
  };
  const actListData = actList.map((item) => {
    const container = {
      label: item.ACT_LONG,
      ACT_LONG: item.ACT_LONG,
      ACT_SHORT: item.ACT_SHORT,
      name: item.ACT_CD,
    };
    return container;
  });

  const checkFields = async () => {
    const values = await form.validateFields();
    setFormValid(!Object.values(values).every((v) => v == null || v === ""));
  };

  const getDataSource = () => {
    const dataObj = [];
    for (let i = 0; i < accusedDisposalFormList?.length; i++) {
      for (let j = 0; j < suspectAccusedList?.length; j++) {
        if (
          suspectAccusedList[j]?.person?._id ===
          accusedDisposalFormList[i]?.accusedId?._id
        ) {
          Object.assign(accusedDisposalFormList[i], {
            actListData: actListData,
            accusedCode: suspectAccusedList[j]?.accusedCode,
          });
          dataObj?.push(accusedDisposalFormList[i]);
        }
      }
    }
    return dataObj;
  };

  const submit = async () => {
    const values = await form.validateFields();
    const addPayload = addCourtDisposalPayload(
      values,
      crimeId,
      Object.keys(selectedPerson)?.length !== 0
        ? getPersonDetails(selectedPerson, inputList)
        : {},
      selectedCourtAndProsecution?.updateChargesheetId,
      selectedCourtAndProsecution?._id
    );

    const updatePayload = updateCourtDisposalPayload(
      values,
      crimeId,
      Object.keys(selectedPerson)?.length !== 0
        ? getPersonDetails(selectedPerson, inputList)
        : {},
      selectedCourtAndProsecution?.updateChargesheetId,
      selectedCourtAndProsecution?._id,
      editCourtDisposal?._id
    );
    if (editCourtDisposal?._id) {
      dispatch(
        updateCourtDisposalForm(
          `${config.CourtDisposal}?crimeId=${crimeId}`,
          updatePayload
        )
      );
    } else {
      dispatch(
        addCourtDisposalForm(
          `${config.CourtDisposal}?crimeId=${crimeId}`,
          addPayload
        )
      );
    }
  };

  const validationFields = {
    personalValidationFields: ["Name", "Gender", "Nationality"],
    addressValidationFields: [""],
    permanentValidationFields: [""],
  };

  const columns = [
    {
      title: "S.No.",
      dataIndex: "",
      rowKey: "",
      render: (_, _item, i) => (
        <span className="tableRowText wordWrap">{i + 1}</span>
      ),
    },
    {
      title: "Accused Code",
      dataIndex: "accusedCode",
      rowKey: "accusedCode",
      render: (accusedCode) => (
        <span className="tableRowText wordWrap">{accusedCode}</span>
      ),
    },
    {
      title: "Accused Name",
      dataIndex: "accusedName",
      rowKey: "accusedName",
      render: (_, item, i) => {
        return (
          <span className="tableRowText wordWrap">
            {item?.accusedId?.personalDetails?.name}
          </span>
        );
      },
    },
    {
      title: "Type of Disposal",
      dataIndex: "disposalType",
      rowKey: "disposalType",
      render: (disposalType) => (
        <span className="tableRowText wordWrap">
          {!!disposalType ? disposalType : "-"}
        </span>
      ),
    },
    {
      title: (
        <div style={{ width: 200 }}>Acts & Sections under which convicted</div>
      ),
      dataIndex: "actsSectionsConvicted ",
      rowKey: "actsSectionsConvicted",
      render: (_value, item, _index) => {
        const actListData = item.actListData;
        const actsSection = item.actsAndSections;
        let RWRequired = "";
        const result = actsSection.reduce(
          (acc, { actDescription, section, rwRequired, accShortName }) => {
            if (rwRequired) {
              RWRequired = "r/w ";
            } else {
              RWRequired = "";
            }
            const namesWithGreeting = (arr) => {
              return arr.map((name) => RWRequired + name);
            };
            const getActName = (actDescription) =>
              !isEmpty(actListData) &&
              first(actListData.filter((s) => s.ACT_LONG === actDescription))
                ?.ACT_SHORT;
            section = namesWithGreeting(section);
            acc[actDescription] = {
              actDescription: actDescription,
              accShortName: getActName(actDescription),
              section:
                typeof acc[actDescription] !== "undefined"
                  ? acc[actDescription].section.concat(section)
                  : section,
            };
            acc[actDescription].section = acc[actDescription].section.filter(
              (item, index) =>
                acc[actDescription].section.indexOf(item) === index
            );
            return acc;
          },
          {}
        );
        let resp = Object.values(result);
        return (
          <>
            {resp?.length !== 0 ? (
              <>
                {resp.map((t, index) => (
                  <span key={index}>
                    {t?.accShortName ? t?.section.toString() + " " : ","}
                  </span>
                ))}
              </>
            ) : (
              "-"
            )}
          </>
        );
      },
    },
    {
      title: "Type of Punishment ",
      dataIndex: "typeOfPunishment ",
      rowKey: "typeOfPunishment",
      render: (_, item) => (
        <span className="tableRowText wordWrap">
          {!!item?.typeOfPunishment ? item?.typeOfPunishment : "-"}
        </span>
      ),
    },
    {
      title: "Period of Punishment ",
      dataIndex: "accusedPunishmentPeriod",
      rowKey: "accusedPunishmentPeriod",
      render: (accusedPunishmentPeriod) => (
        <span className="tableRowText wordWrap">
          {!!accusedPunishmentPeriod ? accusedPunishmentPeriod : "-"}
        </span>
      ),
    },
    {
      title: "Amount of Fine",
      dataIndex: "fineAmount  ",
      rowKey: "fineAmount",
      render: (_, item) => (
        <span className="tableRowText wordWrap">
          {!!item?.fineAmount ? item?.fineAmount : "-"}
        </span>
      ),
    },
    {
      title: "Period of Bond ",
      dataIndex: "accusedBondPeriod",
      rowKey: "accusedBondPeriod",
      render: (accusedBondPeriod) => (
        <span className="tableRowText wordWrap">
          {!!accusedBondPeriod ? accusedBondPeriod : "-"}
        </span>
      ),
    },
    {
      title: "Finger Prints Taken ",
      dataIndex: "fingerPrintsTaken",
      rowKey: "fingerPrintsTaken",
      render: (fingerPrintsTaken) => (
        <span className="tableRowText wordWrap">
          {fingerPrintsTaken}
        </span>
      ),
    },
  ];

  const handleOk = async () => {
    const values = await personForm.validateFields();
    setSelectedPerson(values);
    form.setFieldsValue({
      judgeName:
        (values?.name ? values?.name : "") +
        " " +
        (values?.surname ? values?.surname : ""),
    });
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <CourtAndProsecutionWrapper>
      <ContentHeader
        headerTitle="Court Disposal Form"
        onSubmitClick={submit}
        isInvestigation={true}
        onCancel={() => setSelectedSiderMenu("courtandprosecution")}
        disableButton={disableForm}
      />
      {isFetching ? (
        <Loader />
      ) : (
        <>
          <Card
            style={{ width: "100%", height: 480, minHeight: 480 }}
            className="cardLeftStyle"
          >
            <Form form={form} colon={false} layout="vertical">
              <Row gutter={24} style={{ marginBottom: 30 }}>
                <Col span={6}>
                  <Form.Item
                    name="disposalType"
                    label="Disposal Type"
                    rules={[
                      {
                        required: true,
                        message: "Disposal Type is required!",
                      },
                    ]}
                  >
                    {renderFieldsWithDropDown(
                      disposalList,
                      null,
                      handleSearch,
                      serchText,
                      250,
                      disableForm,
                      "",
                      "Select Disposal Type"
                    )}
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    name="dateOfJudgement"
                    label="Date of Judgement"
                    rules={[
                      {
                        required: true,
                        message: "Date of Judgement is required!",
                      },
                    ]}
                  >
                    <DatePicker
                      format={DATE_FORMAT}
                      disabled={disableForm}
                      placeholder="Date"
                      style={{ width: 250 }}
                      onChange={checkFields}
                    />
                  </Form.Item>
                </Col>
                <Col span={6} style={{ marginBottom: 15 }}>
                  <Form.Item name="judgeName" label="Judge Name">
                    <Input
                      onChange={checkFields}
                      disabled={true}
                      style={{ width: 250 }}
                    />
                  </Form.Item>
                  {!disableForm && (
                    <span
                      class="linkStyle"
                      className="popupLink resetLink"
                      onClick={() => setIsModalVisible(true)}
                    >
                      Add Person
                    </span>
                  )}
                </Col>
                <Col span={4}>
                  <Form.Item name="nameOfPPOrAPP" label="Name of PP/APP">
                    <Input
                      onChange={checkFields}
                      disabled={disableForm}
                      style={{ width: 200 }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <TableRecords dataSource={getDataSource()} columns={columns} />
              <Space
                direction="vertical"
                style={{ width: "100%", marginTop: 30 }}
              >
                <Row gutter={24}>
                  <Col span={4}>
                    <p style={{ fontSize: 16 }}>Appeal Preferred?</p>
                  </Col>
                  <Col span={4}>
                    <Form.Item name="appealPreferred">
                      <Radio.Group
                        buttonStyle="solid"
                        disabled={disableForm}
                        onChange={(e) => {
                          setSummonsIssued(e.target.value);
                          form.setFieldsValue({ appealPreferredOthers: "" });
                        }}
                      >
                        <Radio value={"Yes"}>Yes</Radio>
                        <Radio value={"No"}>No</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                  {summonsIssued === "Yes" ? (
                    <Col span={4}>
                      <Form.Item name="appealPreferredOthers">
                        {renderFieldsWithDropDown(
                          appealPreferredList,
                          null,
                          handleSearch,
                          serchText,
                          220,
                          disableForm,
                          "",
                          "Accused/Complainant/State"
                        )}
                      </Form.Item>
                    </Col>
                  ) : null}
                </Row>
              </Space>
            </Form>
          </Card>
          {isModalVisible ? (
            <AddPerson
              title="Add Person Details"
              isModalVisible={isModalVisible}
              handleOk={handleOk}
              handleCancel={handleCancel}
              formName={personForm}
              checkFields={checkFields}
              disabled={disableForm}
              setInputList={setInputList}
              editObj={selectedPerson}
              age={age}
              setAge={setAge}
              validationFields={validationFields}
            />
          ) : null}
        </>
      )}
    </CourtAndProsecutionWrapper>
  );
}
