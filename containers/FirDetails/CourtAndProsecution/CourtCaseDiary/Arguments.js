/* eslint-disable array-callback-return */
import { useState, useEffect } from "react";
import { Space, Button, Divider, Input, Form, Row, Col, Radio } from "antd";
import {
  renderFieldsWithDropDown,
  getAccuseds,
} from "@containers/FirDetails/fir-util";
import { isEmpty, first, isArray } from "lodash";
import { useSelector, useDispatch } from "react-redux";
import { config } from "@config/site.config";
import DeathOfAccusedActions from "@redux/CourtAndProsecution/DeathOfAccused/actions.js";
import { loadState } from "@lib/helpers/localStorage";
import StandardCourtCaseDiaryForm from "@components/Common/standardCourtCaseDiaryForm";
import {
  courtCaseDiaryForm,
  displayCourtCaseActions,
  displayFormFields,
  displayDiedAccusedDisposalFrom,
  displayTextAreaForCourtCaseDiary,
  displayDateOfTrial,
  displayIsCasePostedForNextStage,
  displayNextHearingDate,
  filterAccusedForCCD,
  getStatus,
} from "./const";
import { CourtAndProsecutionWrapper } from "../styles";
import {
  presentOrNotList,
  confirmationList,
  judgementList,
  argumentTypeList,
} from "../const";
import TableRecords from "./TableRecords";
import firActions from "@redux/fir/actions";
import juvenileApprehensionActions from "@redux/investigations/juvenileApprehension/actions";

export default function Arguments({
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
  tableData,
  setIODetails,
  setPostedFor,
  caseDiaryData,
  setDrawerFormItem,
  checkFields,
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
  handelIssueOfSummons,
}) {
  const dispatch = useDispatch();
  const crimeId = loadState("selectedFirId");
  const { getDeathOfAccusedList } = DeathOfAccusedActions;
  const { fetchArrest } = firActions;
  const { getJuvenileApprehensionList } = juvenileApprehensionActions;
  const [tableform] = Form.useForm();
  const { deathOfAccusedList } = useSelector((state) => state.DeathOfAccused);
  const { arrestList } = useSelector((state) => state.FIR);
  const { juvenileApprehensionList } = useSelector(
    (state) => state.JuvenileApprehension
  );
  const [isAccusedDied, setIsAccusedDied] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [isCasePostedForNext, setIsCasePostedForNext] = useState("");
  const [accusedPresence, setaccusedPresence] = useState("");
  const [accused, setAccused] = useState("");
  const [pendingFor, setPendingFor] = useState("");

  const [isCaseDisposed, setIsCaseDisposed] = useState("");
  const selectedCourtAndProsecution = loadState("selectedCourtAndProsecution");
  const { suspectAccusedList } = useSelector((state) => state.SuspectAccused);
  const [judgementGivenOnSameDay, setJudgementGivenOnSameDay] = useState("");

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
      var accusedDetails = [];
      setIsCasePostedForNext(caseDiaryData?.isCasePostedForNextHearing);
      setIsCaseDisposed(caseDiaryData?.isCaseDisposed);
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
          accusedName: item.person?.personalDetails?.name,
          accusedPresence: item?.presence,
          petitionFiledByDefenseCouncil: item?.isDefenseCounselPetitionFiled,
          accusedPleadedGuilty: item?.isPleadingGuilty,
          furnishedToTheAccused: item?.isCaseDocumentsFurnished,
        };
        form.setFieldsValue({
          [`judgement_${result?.person}`]: item?.judgement,
        });
        accusedDetails.push(result);
      });
      setDataSource(accusedDetails);
      tableData(accusedDetails);
      form.setFieldsValue({
        accused: "",
        accusedPresence: "",
        guilty: "",
        documentsfurnished: "",
        petition: "",
      });
    }
  }, [caseDiaryData, deathOfAccusedList]);

  const addMoreDetails = async () => {
    const values = await tableform.validateFields();
    const selectedAccused =
      !isEmpty(accusedLists) &&
      first(accusedLists.filter((s) => s.label === values.accused));

    const filterSuspectAccusedList = [];
    for (let i = 0; i < suspectAccusedList?.length; i++) {
      const suspectAccusedResult = suspectAccusedList[i];
      if (
        suspectAccusedResult?.person?._id === selectedAccused?._id &&
        !filterSuspectAccusedList?.some(
          (data) => data?.person === selectedAccused?._id
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
      petitionFiledByDefenseCouncil: values?.petition,
      accusedPleadedGuilty: values?.guilty,
      furnishedToTheAccused: values?.documentsfurnished,
      examinationStatus: values?.examinationStatus,
    };
    setDataSource([...dataSource, result]);
    tableData([...dataSource, result]);
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

  const removeDetails = (item) => {
    const newArr = dataSource.filter((x) => x !== item);
    setDataSource(newArr);
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
        case "Petition filed by Defense Council":
          columns.push({
            title: "Petition filed by Defense Council",
            dataIndex: "petitionFiledByDefenseCouncil",
            rowKey: "PpetitionFiledByDefenseCouncil",
          });
          break;
        case "Judgement":
          columns.push({
            title: "Judgement",
            dataIndex: "judgement",
            rowKey: "judgement",
            render: (_value, _item, index) => {
              return (
                <Form.Item name={`judgement_${_item?.person}`} label="">
                  {renderFieldsWithDropDown(
                    judgementList,
                    null,
                    handleSearch,
                    serchText,
                    190,
                    disableForm || judgementGivenOnSameDay === "No",
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

  const getConfirmationList = () =>
    renderFieldsWithDropDown(
      confirmationList,
      null,
      handleSearch,
      serchText,
      170,
      disableForm || isEmpty(accused),
      "",
      "Yes/No"
    );

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
            170,
            disableForm || isEmpty(accused),
            "",
            "Present/Not Present"
          )
        );
      case "petition":
        return !isAccusedDied && getConfirmationList();
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
  const handelJudgement = (e, title) => {
    if (title === "Judgement given on the same day?") {
      setJudgementGivenOnSameDay(e.target.value);
      if (e.target.value === "No" && isArray(dataSource)) {
        let temp = {};
        dataSource.forEach((item, index) => {
          temp[`judgement_${item?.person}`] = "";
        });
        form.setFieldsValue(temp);
      }
    }
  };
  const displayArgumentsDecisions = (title, fieldName, dataList) => {
    return (
      <Row gutter={24}>
        <Col span={4}>
          <p style={{ fontSize: 16 }}>{title}</p>
        </Col>
        <Col span={4}>
          <Form.Item name={fieldName}>
            <Radio.Group
              buttonStyle="solid"
              disabled={disableForm}
              onChange={(e) => handelJudgement(e, title)}
            >
              {isArray(dataList) &&
                dataList?.map((item, i) => {
                  return (
                    <Radio value={item?.label} key={i}>
                      {item?.label}
                    </Radio>
                  );
                })}
            </Radio.Group>
          </Form.Item>
        </Col>
      </Row>
    );
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
      {displayArgumentsDecisions(
        "Arguments Done?",
        "argumentsDone",
        confirmationList
      )}
      {displayArgumentsDecisions(
        "Arguments Type?",
        "argumentsType",
        argumentTypeList
      )}
      {displayArgumentsDecisions(
        "Judgement given on the same day?",
        "judgementGivenOnSameDay",
        confirmationList
      )}
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
    </CourtAndProsecutionWrapper>
  );
}
