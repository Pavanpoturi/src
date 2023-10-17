/* eslint-disable array-callback-return */
import { useEffect, useState } from "react";
import {
  Row,
  Col,
  Form,
  DatePicker,
  Radio,
  Space,
  Button,
  Divider,
  Input,
} from "antd";
import {
  DATE_FORMAT,
  renderFieldsWithDropDown,
  getAccuseds,
} from "@containers/FirDetails/fir-util";
import { isEmpty, first } from "lodash";
import { useSelector, useDispatch } from "react-redux";
import { config } from "@config/site.config";
import DeathOfAccusedActions from "@redux/CourtAndProsecution/DeathOfAccused/actions.js";
import StandardCourtCaseDiaryForm from "@components/Common/standardCourtCaseDiaryForm";
import { disablePastDatesFrom } from "@components/Common/helperMethods.js";
import { loadState } from "@lib/helpers/localStorage";
import TableRecords from "./TableRecords";
import {
  courtCaseDiaryForm,
  AppearanceOfAccusedList,
  displayCourtCaseActions,
  displayDiedAccusedDisposalFrom,
  displayFormFields,
  displayTextAreaForCourtCaseDiary,
  displayDateOfTrial,
  filterAccusedForCCD,
  getStatus,
} from "./const";
import firActions from "@redux/fir/actions";
import juvenileApprehensionActions from "@redux/investigations/juvenileApprehension/actions";
import { presentOrNotList, confirmationList } from "../const";

export default function AppearanceOfAccused({
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
  postedFor,
  setPostedFor,
  caseDiaryData,
  setDrawerFormItem,
  checkFields,
  trialDate,
  setTrialDate,
  ioPresent,
  setIOPresent,
  ppPresent,
  setPPPresent,
  defenseCounsel,
  setDefenseCounsel,
  rank,
  setRank,
  setdisble,
}) {
  const dispatch = useDispatch();
  const crimeId = loadState("selectedFirId");
  const { getDeathOfAccusedList } = DeathOfAccusedActions;
  const [tableform] = Form.useForm();
  const { fetchArrest } = firActions;
  const { getJuvenileApprehensionList } = juvenileApprehensionActions;
  const { deathOfAccusedList } = useSelector((state) => state.DeathOfAccused);
  const [isAccusedDied, setIsAccusedDied] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [summonsIssued, setSummonsIssued] = useState(true);
  const [accusedPresence, setaccusedPresence] = useState("");
  const [accused, setAccused] = useState("");
  const selectedCourtAndProsecution = loadState("selectedCourtAndProsecution");
  const { suspectAccusedList } = useSelector((state) => state.SuspectAccused);
  const { arrestList } = useSelector((state) => state.FIR);
  const { juvenileApprehensionList } = useSelector(
    (state) => state.JuvenileApprehension
  );
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
      console.log(caseDiaryData);
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
        accusedDetails.push(result);
      });
      setDataSource(accusedDetails);
      setSummonsIssued(caseDiaryData?.isAccusedSummonsIssued);
      tableData(accusedDetails);
      form.setFieldsValue({
        accused: "",
        accusedPresence: "",
        guilty: "",
        documentsfurnished: "",
        petition: "",
      });
      setAccused("");
      setaccusedPresence("");
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
      petitionFiledByDefenseCouncil: values?.petition,
      accusedPleadedGuilty: values?.guilty,
      furnishedToTheAccused: values?.documentsfurnished,
    };
    setDataSource([...dataSource, result]);
    tableData([...dataSource, result]);
    tableform.setFieldsValue({
      accused: "",
      accusedPresence: "",
      guilty: "",
      documentsfurnished: "",
      petition: "",
    });
    setAccused("");
    setaccusedPresence("");
  };

  const removeDetails = (item) => {
    const newArr = dataSource.filter((x) => x !== item);
    setDataSource(newArr);
    tableData(newArr);
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
            rowKey: "petitionFiledByDefenseCouncil",
          });
          break;
        case "Accused Pleaded Guilty?":
          columns.push({
            title: "Is Guilty",
            dataIndex: "accusedPleadedGuilty",
            rowKey: "accusedPleadedGuilty",
          });
          break;
        case "Whether case documents furnished to the accused?":
          columns.push({
            title: "Whether case documents furnished to the Accused?",
            dataIndex: "furnishedToTheAccused",
            rowKey: "furnishedToTheAccused",
          });
          break;
        case "Actions":
          columns.push({
            title: <div style={{ width: 250 }}>Actions</div>,
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

  const getPresentOrNotList = () =>
    renderFieldsWithDropDown(
      presentOrNotList,
      setaccusedPresence,
      handleSearch,
      serchText,
      170,
      disableForm || isEmpty(accused),
      "",
      "Present/Not Present"
    );

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
          170,
          disableForm,
          "",
          "Select"
        );
      case "accusedPresence":
        return !isAccusedDied && getPresentOrNotList();
      case "petition":
        return !isAccusedDied && getConfirmationList();
      case "guilty":
        return !isAccusedDied && getConfirmationList();
      case "documentsfurnished":
        return !isAccusedDied && getConfirmationList();
      case "examinationStatus":
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

  return (
    <>
      <Space direction="vertical" style={{ width: "100%" }}>
        <Row gutter={24}>
          <Col span={7}>
            <p style={{ fontSize: 16 }}>Are the Summons Issued to accused?</p>
          </Col>
          <Col span={4}>
            <Form.Item name="summonsIssuedAccused">
              <Radio.Group
                buttonStyle="solid"
                disabled={disableForm}
                onChange={(e) => setSummonsIssued(e.target.value)}
              >
                <Radio value={"Yes"}>Yes</Radio>
                <Radio value={"No"}>No</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          {summonsIssued === "No" && (
            <Col span={6}>
              <span
                className="popupLink resetLink"
                onClick={() => {
                  setOpenDrawer(true);
                  setDrawerFormName("issuedOfSummons");
                  setDrawerFormItem({});
                  setdisble(
                    Object.keys(!!caseDiaryData ? caseDiaryData : {})
                      ?.length === 0
                      ? false
                      : true
                  );
                }}
              >
                Issue of Summons
              </span>
            </Col>
          )}
        </Row>
      </Space>
      <Divider className="dividerStyle" />
      {displayDateOfTrial(
        "ccdDate",
        "CCD Date (Date of Trial)",
        disableForm,
        200,
        checkFields,
        setTrialDate
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
              <>
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
              </>
            ) : null}
          </Space>
        </Form>

        {!isEmpty(dataSource) && (
          <TableRecords dataSource={dataSource} columns={columns} />
        )}
      </Space>
      <Divider className="dividerStyle" />
      <Space direction="vertical" style={{ width: "100%" }}>
        <Row gutter={24} style={{ marginTop: 20 }}>
          <Col span={4} className="requiredField">
            <p style={{ fontSize: 16 }}>Next Date of hearing</p>
          </Col>
          <Col span={6}>
            <Form.Item
              name="nextHearingDate"
              rules={[
                {
                  required: true,
                  message: "Please Select Next Hearing Date",
                },
              ]}
            >
              <DatePicker
                format={DATE_FORMAT}
                disabled={disableForm}
                style={{ width: 250 }}
                onChange={checkFields}
                disabledDate={(current) =>
                  disablePastDatesFrom(current, trialDate)
                }
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24} style={{ marginTop: 20 }}>
          <Col span={4} className="requiredField">
            <p style={{ fontSize: 16 }}>Posted for</p>
          </Col>
          <Col span={4}>
            <Form.Item
              name="postedFor"
              rules={[{ required: true, message: "Please Select Posted For" }]}
            >
              {renderFieldsWithDropDown(
                AppearanceOfAccusedList,
                setPostedFor,
                handleSearch,
                serchText,
                250,
                disableForm,
                "",
                "Posted For"
              )}
            </Form.Item>
            {["Witness Examination", "IO Examination"].includes(postedFor) && (
              <span
                className="popupLink"
                onClick={() => {
                  setOpenDrawer(true);
                  setDrawerFormName("issuedOfSummons");
                  setDrawerFormItem({});
                  setdisble(!isEmpty(caseDiaryData));
                }}
              >
                Issue of Summons
              </span>
            )}
          </Col>
        </Row>
      </Space>
      {displayTextAreaForCourtCaseDiary(
        "Court Proceedings",
        "courtProceedings",
        disableForm,
        checkFields
      )}
    </>
  );
}
