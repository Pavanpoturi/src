/* eslint-disable array-callback-return */
import { useEffect, useState } from "react";
import {
  Space,
  Button,
  Divider,
  Input,
  Form,
  Row,
  Col,
  Upload,
  Modal,
} from "antd";
import {
  renderFieldsWithDropDown,
  getAccuseds,
  dummyRequest,
  onFileChange,
} from "@containers/FirDetails/fir-util";
import { textAreaRules } from "@components/Common/formOptions";
import StandardSceneOfOffenceForm from "@components/Common/standardSceneOfOffenceForm";
import { isEmpty, first, isUndefined, isArray } from "lodash";
import { useSelector, useDispatch } from "react-redux";
import { CameraFilled } from "@ant-design/icons";
import StandardCourtCaseDiaryForm from "@components/Common/standardCourtCaseDiaryForm";
import TableRecords from "./TableRecords";
import { config } from "@config/site.config";
import DeathOfAccusedActions from "@redux/CourtAndProsecution/DeathOfAccused/actions.js";
import {
  courtCaseDiaryForm,
  displayCourtCaseActions,
  displayDiedAccusedDisposalFrom,
  displayFormFields,
  displayTextAreaForCourtCaseDiary,
  displayDateOfTrial,
  displayIsCasePostedForNextStage,
  displayNextHearingDate,
  filterAccusedForCCD,
  getStatus,
} from "./const";
import { CourtAndProsecutionWrapper } from "../styles";
import { loadState } from "@lib/helpers/localStorage";
import {
  presentOrNotList,
  confirmationList,
  judgementList,
  occupationList,
  genderList,
  examinationStatusList,
} from "../const";
import firActions from "@redux/fir/actions";
import juvenileApprehensionActions from "@redux/investigations/juvenileApprehension/actions";

import { getFileById } from "@containers/media-util";

const { TextArea } = Input;

export default function DefenceWitnessExamination({
  trialFor,
  form,
  disableForm,
  setSelectedPerson,
  age,
  setAge,
  setInputList,
  serchText,
  handleSearch,
  setDrawerFormName,
  setOpenDrawer,
  setIODetails,
  selectedPerson,
  witnessDataSource,
  setWitnessDataSource,
  dataSource,
  setDataSource,
  setAddAddressDetails,
  caseDiaryData,
  setDrawerFormItem,
  trialDate,
  ioPresent,
  setIOPresent,
  ppPresent,
  setPPPresent,
  defenseCounsel,
  setDefenseCounsel,
  rank,
  setRank,
  setdisble,
  postedFor,
  setPostedFor,
  handelIssueOfSummons,
}) {
  const dispatch = useDispatch();
  const crimeId = loadState("selectedFirId");
  const { getDeathOfAccusedList } = DeathOfAccusedActions;
  const { fetchArrest } = firActions;
  const { getJuvenileApprehensionList } = juvenileApprehensionActions;
  const { deathOfAccusedList } = useSelector((state) => state.DeathOfAccused);
  const { arrestList } = useSelector((state) => state.FIR);
  const { juvenileApprehensionList } = useSelector(
    (state) => state.JuvenileApprehension
  );
  const [witnessStatementUrl, setWitnessStatementUrl] = useState([]);
  const [addressform] = Form.useForm();
  const [tableform] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAccusedDied, setIsAccusedDied] = useState(false);
  const [isCasePostedForNext, setIsCasePostedForNext] = useState("");
  const [accusedPresence, setaccusedPresence] = useState("");
  const [accused, setAccused] = useState("");
  const [formValid, setFormValid] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalData, setIsModalData] = useState([]);
  const selectedCourtAndProsecution = loadState("selectedCourtAndProsecution");
  const { suspectAccusedList } = useSelector((state) => state.SuspectAccused);
  const [pendingFor, setPendingFor] = useState("");
  const filterChargeSheetAccusedData = filterAccusedForCCD(
    suspectAccusedList,
    selectedCourtAndProsecution?.data?.accusedParticulars,
    dataSource
  );

  const getAccusedDropdownData = () =>
    getAccuseds(filterChargeSheetAccusedData);
  const accusedLists = getAccusedDropdownData();

  const tableConfig = courtCaseDiaryForm.find(
    (c) => c.label === trialFor
  )?.tableData;

  const tableConfigData = courtCaseDiaryForm.find(
    (c) => c.label === trialFor
  )?.tableData1;

  const checkFields = async () => {
    const values = await form.validateFields();
    setFormValid(!Object.values(values).every((v) => v == null || v === ""));
  };

  useEffect(() => {
    dispatch(
      getDeathOfAccusedList(
        `${config.getDeathOfAccused}?crimeId=${crimeId}&updateChargesheetId=${selectedCourtAndProsecution?.updateChargesheetId}`
      )
    );
  }, []);

  useEffect(() => {
    dispatch(fetchArrest(`${config.arrest}?crimeId=${crimeId}`));
  }, []);

  useEffect(() => {
    dispatch(
      getJuvenileApprehensionList(
        `${config.cclApprehension}?crimeId=${crimeId}`
      )
    );
  }, [dispatch]);

  useEffect(() => {
    if (!!caseDiaryData ? Object.keys(caseDiaryData)?.length !== 0 : false) {
      const witnessTableData =
        !isEmpty(caseDiaryData?.defenseWitness) &&
        !isUndefined(caseDiaryData?.defenseWitness) &&
        caseDiaryData?.defenseWitness?.map((item) => {
          return {
            witnessName: item?.name,
            fatherName: item?.fatherName,
            gender: item?.gender,
            age: item?.age,
            occupation: item?.occupation,
            address:
              !isUndefined(item?.address) &&
              Object.keys(item?.address)?.length !== 0
                ? item?.address?.address1 + "," + item?.address?.address2
                : item?.address,
            councilExaminationStatus: item?.statusDefenseCouncilExamination,
            examinationStatus:
              item?.ppExaminationStatus === "Yes" ? "Present" : "Not Present",
            uploadWitnessStatement: item?.statement,
          };
        });
      setWitnessDataSource(!!witnessTableData ? witnessTableData : []);
      setIsCasePostedForNext(caseDiaryData?.isCasePostedForNextHearing);
      var accusedDetails = [];
      caseDiaryData?.accusedDetails?.forEach((item) => {
        const selectedAccused =
          !isEmpty(suspectAccusedList) &&
          first(
            suspectAccusedList.filter(
              (s) => s?.person?._id === item?.person?._id
            )
          );
        const isDied = deathOfAccusedList.some(
          (accId) => accId?.accusedId === suspectAccusedList?.person?._id
        );
        const result = {
          _id: selectedAccused?._id,
          isIssueOfWarrants: item?.isIssueOfWarrants,
          isNoticeToSurety: item?.isNoticeToSurety,
          isProclamation: item?.isProclamation,
          isArrestByPolice: selectedAccused?.isArrestByPolice,
          person: selectedAccused?.person?._id,
          accusedCode: selectedAccused?.accusedCode,
          accusedStatus: !isDied
            ? getStatus(selectedAccused, arrestList, juvenileApprehensionList)
            : "Died",
          accusedName: item?.person?.personalDetails?.name,
          accusedPresence: item?.presence,
          petitionFiledByDefenceCouncil: item?.isDefenseCounselPetitionFiled,
        };
        accusedDetails.push(result);
      });
      setDataSource(accusedDetails);
    }
  }, [caseDiaryData, deathOfAccusedList]);

  const addMoreDetails = async () => {
    const values = await tableform.validateFields();
    const selectedAccused =
      !isEmpty(accusedLists) &&
      first(accusedLists.filter((s) => s.label === values.accused));

    const filterSuspectAccusedList = [];
    for (let i = 0; i < suspectAccusedList?.length; i++) {
      for (let j = 0; j < [selectedAccused]?.length; j++) {
        const suspectAccusedResult = suspectAccusedList[i];
        if (
          suspectAccusedResult?.person?._id === [selectedAccused][j]?._id &&
          !filterSuspectAccusedList?.some(
            (data) => data?.person === [selectedAccused][j]?._id
          )
        ) {
          filterSuspectAccusedList.push({
            _id: suspectAccusedResult?._id,
            isIssueOfWarrants: suspectAccusedResult?.isIssueOfWarrants,
            isNoticeToSurety: suspectAccusedResult?.isNoticeToSurety,
            isProclamation: suspectAccusedResult?.isProclamation,
            isArrestByPolice: suspectAccusedResult?.isArrestByPolice,
            person: suspectAccusedResult?.person?._id,
          });
        }
      }
    }
    const filteredList = first(filterSuspectAccusedList);
    const result = {
      _id: filteredList?._id,
      isIssueOfWarrants: filteredList?.isIssueOfWarrants,
      isNoticeToSurety: filteredList?.isNoticeToSurety,
      isProclamation: filteredList?.isProclamation,
      isArrestByPolice: filteredList?.isArrestByPolice,
      person: selectedAccused?._id,
      accusedCode: selectedAccused?.accusedCode,
      accusedName: values?.accused,
      accusedStatus: !isAccusedDied
        ? getStatus(selectedAccused, arrestList, juvenileApprehensionList)
        : "Died",
      accusedPresence: values?.accusedPresence,
      petitionFiledByDefenceCouncil: values?.petition,
      accusedPleadedGuilty: values?.guilty,
      furnishedToTheAccused: values?.documentsfurnished,
      examinationStatus: values?.examinationStatus,
    };
    setDataSource([...dataSource, result]);
    tableform.setFieldsValue({
      accused: "",
      accusedPresence: "",
      guilty: "",
      documentsfurnished: "",
      petition: "",
      examinationStatus: "",
    });
    setAccused("");
    setaccusedPresence("");
  };

  const addMoreWitnessDetails = async () => {
    const values = await tableform.validateFields();
    const result = {
      witnessName: values?.witnessName,
      fatherName: values?.fatherName,
      gender: values?.gender,
      age: values?.age,
      occupation: values?.occupation,
      address: values?.address,
      councilExaminationStatus: values?.councilExaminationStatus,
      examinationStatus: values?.examinationStatus,
      uploadWitnessStatement: witnessStatementUrl,
    };
    setWitnessDataSource([...witnessDataSource, result]);
    tableform.setFieldsValue({
      witnessName: "",
      fatherName: "",
      gender: "",
      age: "",
      occupation: "",
      address: "",
      councilExaminationStatus: "",
      examinationStatus: "",
      uploadWitnessStatement: [],
    });
    setWitnessStatementUrl([]);
  };

  const removeDetails = (item) => {
    const newArr = dataSource.filter((x) => x !== item);
    setDataSource(newArr);
  };

  const removeWitnessDetails = (item) => {
    const newArr = witnessDataSource.filter((x) => x !== item);
    setWitnessDataSource(newArr);
  };

  const addAddress = () => {
    addressform.resetFields();
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleOk = async () => {
    const values = await addressform.validateFields();
    tableform.setFieldsValue({
      address:
        (values?.address1 ? values?.address1 : "") +
        "," +
        (values?.address2 ? values?.address2 : ""),
    });
    setAddAddressDetails(values);
    setIsModalVisible(false);
  };

  const handleModalOk = () => {
    setIsModalOpen(false);
  };
  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  const columns = [];

  tableConfig &&
    tableConfig.map((headTitle) => {
      switch (headTitle) {
        case "SNo":
          columns.push({
            title: "S.No.",
            dataIndex: "",
            rowKey: "",
            render: (_propertyStatus, _item, i) => (
              <span className="tableRowText">{i + 1}</span>
            ),
          });
          break;
        case "Accused Code":
          columns.push({
            title: "Accused Code",
            dataIndex: "accusedCode",
            rowKey: "accusedCode",
          });
          break;
        case "Accused Name":
          columns.push({
            title: "Accused Name",
            dataIndex: "accusedName",
            rowKey: "accusedName",
          });
          break;
        case "Accused Status":
          columns.push({
            title: "Accused Status",
            dataIndex: "accusedStatus",
            rowKey: "accusedStatus",
          });
          break;
        case "Accused Presence":
          columns.push({
            title: "Accused Presence",
            dataIndex: "accusedPresence",
            rowKey: "accusedPresence",
          });
          break;
        case "Petition filed by Defence Council":
          columns.push({
            title: "Petition filed by Defence Council",
            dataIndex: "petitionFiledByDefenceCouncil",
            rowKey: "PpetitionFiledByDefenceCouncil",
          });
          break;
        case "Judgement":
          columns.push({
            title: "Judgement",
            dataIndex: "judgement",
            rowKey: "judgement",
            render: (_value, _item, index) => {
              return (
                <Form.Item name={`judgement_${index}`} label="">
                  {renderFieldsWithDropDown(
                    judgementList,
                    null,
                    handleSearch,
                    serchText,
                    190,
                    disableForm,
                    "",
                    "Select Judgement Type"
                  )}
                </Form.Item>
              );
            },
          });
          break;
        case "Actions":
          columns.push({
            title: "Actions",
            dataIndex: "actions",
            rowKey: "actions",
            render: (_value, item, index) => {
              return !!isAccusedDied
                ? displayDiedAccusedDisposalFrom(
                    item,
                    index,
                    setOpenDrawer,
                    setDrawerFormName,
                    setDrawerFormItem,
                    setdisble,
                    Object.keys(!!caseDiaryData ? caseDiaryData : {})
                      ?.length === 0
                      ? false
                      : true,
                    disableForm,
                    removeDetails
                  )
                : displayCourtCaseActions(
                    item,
                    index,
                    disableForm,
                    removeDetails,
                    setOpenDrawer,
                    setDrawerFormName,
                    setDrawerFormItem,
                    setdisble,
                    Object.keys(!!caseDiaryData ? caseDiaryData : {})
                      ?.length === 0
                      ? false
                      : true,
                    suspectAccusedList
                  );
            },
          });
          break;
      }
    });
  const witnessColumn = [];

  tableConfigData &&
    tableConfigData.map((headTitle) => {
      switch (headTitle) {
        case "Witness Name":
          witnessColumn.push({
            title: "Witness Name",
            dataIndex: "witnessName",
            rowKey: "witnessName",
          });
          break;
        case "Father Name":
          witnessColumn.push({
            title: "Father Name",
            dataIndex: "fatherName",
            rowKey: "fatherName",
          });
          break;
        case "Gender":
          witnessColumn.push({
            title: "Gender",
            dataIndex: "gender",
            rowKey: "gender",
          });
          break;
        case "Age":
          witnessColumn.push({
            title: "Age",
            dataIndex: "age",
            rowKey: "age",
          });
          break;
        case "Occupation":
          witnessColumn.push({
            title: "Occupation",
            dataIndex: "occupation",
            rowKey: "occupation",
          });
          break;
        case "Address":
          witnessColumn.push({
            title: "Address",
            dataIndex: "address",
            rowKey: "address",
          });
          break;
        case "PP Examination Status":
          witnessColumn.push({
            title: "PP Examination Status",
            dataIndex: "examinationStatus",
            rowKey: "examinationStatus",
          });
          break;
        case "Defense Council Examination Status":
          witnessColumn.push({
            title: "Defense Council Examination Status",
            dataIndex: "councilExaminationStatus",
            rowKey: "councilExaminationStatus",
          });
          break;
        case "Upload Witness Statement":
          witnessColumn.push({
            title: "",
            dataIndex: "uploadWitnessStatement",
            rowKey: "uploadWitnessStatement",
            render: (_value, item, index) => {
              return (
                <div key={index} className="updateRecord">
                  <span
                    onClick={() => {
                      setIsModalOpen(true);
                      setIsModalData(
                        isArray(item?.uploadWitnessStatement)
                          ? item?.uploadWitnessStatement
                          : !!item?.uploadWitnessStatement
                          ? [item?.uploadWitnessStatement]
                          : []
                      );
                    }}
                  >
                    Witness Statement
                  </span>
                </div>
              );
            },
          });
          break;
        case "Actions":
          witnessColumn.push({
            title: "Actions",
            dataIndex: "actions",
            rowKey: "actions",
            render: (_value, item, index) => {
              return !disableForm ? (
                <div
                  key={index}
                  className="updateRecord"
                  onClick={() => {
                    removeWitnessDetails(item);
                  }}
                >
                  Remove
                </div>
              ) : null;
            },
          });
          break;
      }
    });

  const displayCourtFormFields = (data, actionName) => {
    const filterData = data.find((item) => item?.label === trialFor)?.data1;
    return (
      !isUndefined(filterData) &&
      filterData.map((s, _i) => {
        return (
          <Col
            span={6}
            style={{
              paddingLeft: s.name === "councilExaminationStatus" ? 0 : 12,
            }}
          >
            <Form.Item name={s.name} label={s.label}>
              {actionName(s.name)}
            </Form.Item>
            {s.name === "address" ? (
              <Col>
                <span
                  onClick={addAddress}
                  className="link"
                  style={{
                    cursor: "pointer",
                  }}
                >
                  Add Address
                </span>
              </Col>
            ) : null}
          </Col>
        );
      })
    );
  };

  const handleRemove = () => {
    setWitnessStatementUrl([]);
  };

  const getConfirmationList = (forAccusedTable = false) => {
    const disabled = forAccusedTable
      ? disableForm || isEmpty(accused)
      : disableForm;
    return renderFieldsWithDropDown(
      confirmationList,
      null,
      handleSearch,
      serchText,
      200,
      disabled,
      "",
      "Yes/No"
    );
  };

  const onChangeAccused = (value) => {
    const accusedId = accusedLists.find(
      (accused) => accused.label === value
    )?._id;
    const isDied = deathOfAccusedList.some(
      (accId) => accId?.accusedId === accusedId
    );
    setIsAccusedDied(isDied);
    setAccused(accusedId);
  };

  const displayFieldsItem = (name) => {
    switch (name) {
      case "accused":
        return renderFieldsWithDropDown(
          accusedLists,
          onChangeAccused,
          handleSearch,
          serchText,
          200,
          disableForm,
          "",
          "Select"
        );
      case "accusedPresence":
        return (
          !isAccusedDied &&
          renderFieldsWithDropDown(
            presentOrNotList,
            setaccusedPresence,
            handleSearch,
            serchText,
            200,
            disableForm || isEmpty(accused),
            "",
            "Present/Not Present"
          )
        );
      case "petition":
        return !isAccusedDied && getConfirmationList(true);
      default:
        return (
          !isAccusedDied && (
            <Input
              onChange={checkFields}
              style={{ width: 200 }}
              disabled={disableForm || isEmpty(accused)}
            />
          )
        );
    }
  };

  const getPresentOrNotList = () =>
    renderFieldsWithDropDown(
      examinationStatusList,
      null,
      handleSearch,
      serchText,
      200,
      disableForm,
      "",
      ""
    );

  const displayCourtFields = (name) => {
    switch (name) {
      // case "witnessName":
      //   return renderFieldsWithDropDown(
      //     accusedLists,
      //     null,
      //     handleSearch,
      //     serchText,
      //     200,
      //     disableForm,
      //     "",
      //     "Select"
      //   );
      case "witnessPresence":
        return getPresentOrNotList();
      case "examinationStatus":
        return getPresentOrNotList();
      case "councilExaminationStatus":
        return getPresentOrNotList();
      case "supportedtheProsecuction":
        return getConfirmationList();
      case "io":
        return renderFieldsWithDropDown(
          accusedLists,
          null,
          handleSearch,
          serchText,
          200,
          disableForm,
          "",
          "Select"
        );
      case "iOPresence":
        return getPresentOrNotList();
      case "gender":
        return renderFieldsWithDropDown(
          genderList,
          null,
          handleSearch,
          serchText,
          200,
          disableForm,
          "",
          "Gender"
        );
      case "occupation":
        return renderFieldsWithDropDown(
          occupationList,
          null,
          handleSearch,
          serchText,
          200,
          disableForm,
          "",
          "Occupation"
        );
      default:
        return (
          <Input
            onChange={checkFields}
            style={{ width: 200 }}
            disabled={disableForm}
          />
        );
    }
  };

  return (
    <CourtAndProsecutionWrapper>
      <Divider className="dividerStyle" />
      {displayDateOfTrial(
        "ccdDate",
        "CCD Date (Date of Trial)",
        true,
        200,
        checkFields
      )}
      <StandardCourtCaseDiaryForm
        showMoreOption={true}
        changeValue={checkFields}
        disabled={disableForm}
        trialFor={trialFor}
        form={form}
        disableForm={disableForm}
        setSelectedPerson={setSelectedPerson}
        age={age}
        setAge={setAge}
        setInputList={setInputList}
        serchText={serchText}
        handleSearch={handleSearch}
        setIODetails={setIODetails}
        selectedPerson={selectedPerson}
        caseDiaryData={caseDiaryData}
        ioPresent={ioPresent}
        setIOPresent={setIOPresent}
        ppPresent={ppPresent}
        setPPPresent={setPPPresent}
        defenseCounsel={defenseCounsel}
        setDefenseCounsel={setDefenseCounsel}
        rank={rank}
        setRank={setRank}
      />
      <Divider className="dividerStyle" />
      <Space
        direction="vertical"
        style={{ width: "100%" }}
        size="large"
        className="accusedGrid"
      >
        <Form form={tableform}>
          <Row gutter={24} align="bottom">
            {displayCourtFormFields(courtCaseDiaryForm, displayCourtFields)}
            <Col
              span={5}
              style={{
                padding: 0,
                marginTop: 30,
                marginLeft: 12,
                marginRight: 10,
              }}
            >
              <Form.Item name="uploadWitnessStatement">
                <Upload
                  fileList={witnessStatementUrl}
                  customRequest={dummyRequest}
                  onChange={(info) => {
                    onFileChange(info, setWitnessStatementUrl);
                  }}
                  multiple={false}
                  onRemove={handleRemove}
                >
                  <Button
                    className="saveButton"
                    style={{ width: 240 }}
                    icon={<CameraFilled style={{ float: "left" }} />}
                    disabled={disableForm || witnessStatementUrl.length > 0}
                  >
                    Upload Witness Statement
                  </Button>
                </Upload>
              </Form.Item>
            </Col>

            <Col span={2}>
              <Button
                className="saveButton"
                size="small"
                style={{
                  width: 70,
                  position: "absolute",
                  bottom: isEmpty(witnessStatementUrl) ? 5 : 35,
                }}
                disabled={disableForm}
                onClick={addMoreWitnessDetails}
              >
                Add
              </Button>
            </Col>
          </Row>
        </Form>
        <Modal
          title="Add Address"
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          width={1000}
          okText="Add"
        >
          <Form form={addressform} layout="vertical">
            <div>
              <Col span={24}>
                <StandardSceneOfOffenceForm colWidth={24} />
                <Form.Item
                  name="description"
                  label="Brief Description of Place"
                  rules={[textAreaRules.textAreaMaxLength]}
                >
                  <TextArea
                    rows={4}
                    columns={3}
                    maxLength={textAreaRules.maxLength}
                  />
                </Form.Item>
              </Col>
            </div>
          </Form>
        </Modal>
        {!isEmpty(witnessDataSource) && (
          <TableRecords
            dataSource={witnessDataSource}
            columns={witnessColumn}
          />
        )}
        <Divider className="dividerStyle" />
        <Form form={tableform}>
          <Space style={{ width: "100%" }}>
            {displayFormFields(
              courtCaseDiaryForm,
              displayFieldsItem,
              trialFor,
              accusedPresence,
              isAccusedDied
            )}
            {!isAccusedDied ? (
              <Button
                className="saveButton"
                size="small"
                style={{ marginTop: 18, width: 70 }}
                disabled={
                  disableForm || isEmpty(accused) || isEmpty(accusedPresence)
                }
                onClick={addMoreDetails}
              >
                Add
              </Button>
            ) : null}
            {isAccusedDied ? (
              <Button
                className="saveButton"
                size="small"
                style={{ marginTop: 18, width: 70 }}
                // disabled={
                //   disableForm || isEmpty(accused) || isEmpty(accusedPresence)
                // }
                onClick={addMoreDetails}
              >
                Add
              </Button>
            ) : null}
          </Space>
        </Form>
        {!isEmpty(dataSource) && (
          <TableRecords dataSource={dataSource} columns={columns} />
        )}
      </Space>
      <Divider className="dividerStyle" />
      {displayIsCasePostedForNextStage(
        "Is the Case posted for next stage?",
        disableForm,
        setIsCasePostedForNext,
        isCasePostedForNext,
        handleSearch,
        serchText,
        checkFields,
        pendingFor,
        setPendingFor,
        postedFor,
        setPostedFor,
        handelIssueOfSummons
      )}
      {displayNextHearingDate(
        "Next Date of hearing",
        disableForm,
        checkFields,
        trialDate,
        isCasePostedForNext
      )}
      {displayTextAreaForCourtCaseDiary(
        "Court Proceedings",
        "courtProceedings",
        disableForm,
        checkFields
      )}
      {isModalData?.length !== 0 ? (
        <Modal
          title="Witness Statement"
          visible={isModalOpen}
          onOk={handleModalOk}
          onCancel={handleModalCancel}
        >
          <div>
            {isModalData?.map((item) => (
              <a
                style={{ cursor: "pointer", color: "#02599C" }}
                onClick={() =>
                  !!item?.originFileObj?.name === false
                    ? getFileById(item?.fileId, item?.name, item?.url)
                    : null
                }
              >
                {!!item?.originFileObj?.name
                  ? item?.originFileObj?.name
                  : item?.name}
              </a>
            ))}
          </div>
        </Modal>
      ) : null}
    </CourtAndProsecutionWrapper>
  );
}
