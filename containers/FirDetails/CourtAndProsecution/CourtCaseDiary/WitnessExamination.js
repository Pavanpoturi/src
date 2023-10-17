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
  Select,
  Modal,
} from "antd";
import { CaretDownOutlined } from "@ant-design/icons";
import {
  renderFieldsWithDropDown,
  getAccuseds,
  dummyRequest,
  onFileChange,
  getWitness,
} from "@containers/FirDetails/fir-util";
import { isEmpty, first, isUndefined, isArray } from "lodash";
import { useSelector, useDispatch } from "react-redux";
import { CameraFilled } from "@ant-design/icons";
import { config } from "@config/site.config";
import { loadState } from "@lib/helpers/localStorage";
import StandardCourtCaseDiaryForm from "@components/Common/standardCourtCaseDiaryForm";
import { getFileById } from "@containers/media-util";
import DeathOfAccusedActions from "@redux/CourtAndProsecution/DeathOfAccused/actions.js";
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
  examinationStatusList,
} from "../const";
import TableRecords from "./TableRecords";
import firActions from "@redux/fir/actions";
import juvenileApprehensionActions from "@redux/investigations/juvenileApprehension/actions";

export default function WitnessExamination({
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
  dataSource,
  setDataSource,
  witnessDataSource,
  setWitnessDataSource,
  caseDiaryData,
  setIODetails,
  setDrawerFormItem,
  evidanceResult,
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
  const [isAccusedDied, setIsAccusedDied] = useState(false);
  const [witnessStatementUrl, setWitnessStatementUrl] = useState([]);
  const [isCasePostedForNext, setIsCasePostedForNext] = useState("");
  const [accusedPresence, setaccusedPresence] = useState("Present");
  const [accused, setAccused] = useState("");
  const [tableform] = Form.useForm();
  const [witnessPresence, setWitnessPresence] = useState("");
  const [witness, setWitness] = useState("");
  const [formValid, setFormValid] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalData, setIsModalData] = useState([]);
  const [pendingFor, setPendingFor] = useState("");
  const selectedCourtAndProsecution = loadState("selectedCourtAndProsecution");
  const { suspectAccusedList } = useSelector((state) => state.SuspectAccused);

  const filterChargeSheetAccusedData = filterAccusedForCCD(
    suspectAccusedList,
    selectedCourtAndProsecution?.data?.accusedParticulars,
    dataSource
  );

  const getAccusedDropdownData = () =>
    getAccuseds(filterChargeSheetAccusedData);
  const accusedLists = getAccusedDropdownData();

  const { data } = loadState("selectedCourtAndProsecution");
  const filterWitnessData = isArray(data?.memoOfEvidences)
    ? data?.memoOfEvidences?.filter(
        (item) =>
          !witnessDataSource?.some(
            (value) => value?.witnessId === item?.witnessId?._id
          )
      )
    : [];
  const witnessList = isArray(filterWitnessData)
    ? getWitness(filterWitnessData)
    : [];
  const tableConfig = courtCaseDiaryForm.find(
    (c) => c.label === trialFor
  )?.tableData;

  const tableConfigData = courtCaseDiaryForm.find(
    (c) => c.label === trialFor
  )?.tableData1;

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
    if (!isUndefined(caseDiaryData) && !isEmpty(caseDiaryData)) {
      const witnessDetails = isArray(caseDiaryData?.witnessDetails)
        ? caseDiaryData?.witnessDetails
        : [];
      let tableData = [];
      for (let i = 0; i < witnessDetails.length; i++) {
        const witnessCodeObj = evidanceResult.find(
          (item) => item?.person === witnessDetails[i]?.person?._id
        );
        let label = "";
        if (witnessCodeObj?.typeOfwitness === "Official witnesses / Experts") {
          label = witnessCodeObj?.subTypeOfWitness;
        } else if (witnessCodeObj?.typeOfwitness === "Panch witness") {
          label = `${witnessCodeObj?.typeOfwitness} ${witnessCodeObj?.subTypeOfWitness}`;
        } else if (witnessCodeObj?.typeOfwitness) {
          label = witnessCodeObj?.typeOfwitness;
        } else {
          label = "";
        }
        const selectedWitness = isArray(witnessList)
          ? witnessList.find(
              (witness) => witness?._id === witnessDetails[i]?.person?._id
            )
          : {};
        tableData.push({
          witnessCode: witnessCodeObj?.witnessCode,
          witnessId: selectedWitness?._id,
          witnessName: `${selectedWitness?.personalDetails?.name || ""} ${
            selectedWitness?.personalDetails?.surname || ""
          }`,

          witnessType: label,
          crossExaminationStatus: witnessDetails[i]?.statusCrossExamination,
          witnessExaminationStatus: witnessDetails[i]?.statusExamination,
          supportedTheProsecuction: witnessDetails[i]?.hasSupportedProsecution,
          witnessPresence: witnessDetails[i]?.presence,
          witnessStatementMedia: first(witnessDetails[i]?.statement),
        });
      }
      setWitnessDataSource(tableData);
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
          accusedPleadedGuilty: item?.isPleadingGuilty,
          accusedExaminationStatus: item?.statusExamination,
        };
        accusedDetails?.push(result);
      });
      setDataSource(accusedDetails);
    }
  }, [caseDiaryData, deathOfAccusedList]);
  const checkFields = async () => {
    const values = await form.validateFields();
    setFormValid(!Object.values(values).every((v) => v == null || v === ""));
  };

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
      accusedExaminationStatus: values?.accusedExaminationStatus,
    };
    setDataSource([...dataSource, result]);
    tableform.setFieldsValue({
      accused: "",
      accusedPresence: "",
      guilty: "",
      petition: "",
      accusedExaminationStatus: "",
    });
    setAccused("");
    setaccusedPresence("");
  };

  const addMoreWitnessDetails = async () => {
    const values = await tableform.validateFields();
    const selectedWitness = isArray(witnessList)
      ? witnessList.find((witness) => witness?._id === values?.witnessName)
      : {};

    const witnessCodeObj = evidanceResult.find(
      (item) => item?.person === selectedWitness?._id
    );

    let label = "";
    if (witnessCodeObj?.typeOfwitness === "Official witnesses / Experts") {
      label = witnessCodeObj?.subTypeOfWitness;
    } else if (witnessCodeObj?.typeOfwitness === "Panch witness") {
      label = `${witnessCodeObj?.typeOfwitness} ${witnessCodeObj?.subTypeOfWitness}`;
    } else if (witnessCodeObj?.typeOfwitness) {
      label = witnessCodeObj?.typeOfwitness;
    } else {
      label = "";
    }
    const result = {
      witnessCode: witnessCodeObj?.witnessCode,
      witnessId: selectedWitness?._id,
      witnessName: `${selectedWitness?.personalDetails?.name || ""} ${
        selectedWitness?.personalDetails?.surname || ""
      }`,
      witnessType: label,
      crossExaminationStatus: values?.crossExaminationStatus,
      witnessExaminationStatus: values?.witnessExaminationStatus,
      supportedTheProsecuction: values?.supportedTheProsecuction,
      witnessPresence: values?.witnessPresence,
      witnessStatementMedia: witnessStatementUrl,
    };
    setWitnessDataSource([...witnessDataSource, result]);
    setWitnessStatementUrl([]);
    tableform.setFieldsValue({
      witnessName: "",
      crossExaminationStatus: "",
      witnessExaminationStatus: "",
      supportedTheProsecuction: "",
      witnessPresence: "",
    });
    setWitness("");
    setWitnessPresence("");
  };

  const removeDetails = (item) => {
    const newArr = dataSource.filter((x) => x !== item);
    setDataSource(newArr);
  };

  const removeWitnessDetails = (item) => {
    const newArr = witnessDataSource.filter((x) => x !== item);
    setWitnessDataSource(newArr);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
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
          });
          break;
        case "Accused Name":
          columns.push({
            title: "Accused Name",
            dataIndex: "accusedName",
          });
          break;
        case "Accused Status":
          columns.push({
            title: "Accused Status",
            dataIndex: "accusedStatus",
          });
          break;
        case "Accused Presence":
          columns.push({
            title: "Accused Presence",
            dataIndex: "accusedPresence",
          });
          break;
        case "Accused Pleaded Guilty?":
          columns.push({
            title: "Is Guilty",
            dataIndex: "accusedPleadedGuilty",
            rowKey: "accusedPleadedGuilty",
          });
          break;
        case "Petition filed by Defence Council":
          columns.push({
            title: "Petition filed by Defence Council",
            dataIndex: "petitionFiledByDefenceCouncil",
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
        case "Witness Code":
          witnessColumn.push({
            title: "Witness Code",
            dataIndex: "witnessCode",
          });
          break;
        case "Witness Name":
          witnessColumn.push({
            title: "Witness Name",
            dataIndex: "witnessName",
          });
          break;
        case "Witness Type":
          witnessColumn.push({
            title: "Witness Type",
            dataIndex: "witnessType",
          });
          break;
        case "Witness Presence":
          witnessColumn.push({
            title: "Witness Presence",
            dataIndex: "witnessPresence",
          });
          break;
        case "Examination Status":
          witnessColumn.push({
            title: "Examination Status",
            dataIndex: "witnessExaminationStatus",
          });
          break;
        case "Cross Examination Status":
          witnessColumn.push({
            title: "Cross Examination Status",
            dataIndex: "crossExaminationStatus",
          });
          break;
        case "Supported the Prosecution":
          witnessColumn.push({
            title: "Supported the Prosecution",
            dataIndex: "supportedTheProsecuction",
          });
          break;
        case "Actions":
          witnessColumn.push({
            title: "Actions",
            dataIndex: "actions",
            rowKey: "actions",
            render: (_value, item, index) => {
              return (
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                  key={index}
                >
                  <div
                    className="updateRecord"
                    onClick={() => {
                      setIsModalOpen(true);
                      setIsModalData(
                        isArray(item?.witnessStatementMedia)
                          ? item?.witnessStatementMedia
                          : !!item?.witnessStatementMedia
                          ? [item?.witnessStatementMedia]
                          : []
                      );
                    }}
                  >
                    Witness Statement
                  </div>
                  {item?.witnessPresence !== "Present" && (
                    <div
                      className="updateRecord"
                      onClick={() => {
                        setOpenDrawer(true);
                        setDrawerFormName("issuedOfSummons");
                        setDrawerFormItem({});
                        setDrawerFormItem(item);
                        setdisble(
                          false ||
                            (Object.keys(!!caseDiaryData ? caseDiaryData : {})
                              ?.length === 0
                              ? false
                              : true)
                        );
                      }}
                    >
                      Issue of Summons
                    </div>
                  )}
                  {!disableForm && (
                    <div
                      className="updateRecord"
                      onClick={() => {
                        removeWitnessDetails(item);
                      }}
                    >
                      Remove
                    </div>
                  )}
                </div>
              );
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
          <Col span={5}>
            <Form.Item name={s.name} label={s.label}>
              {actionName(s.name)}
            </Form.Item>
          </Col>
        );
      })
    );
  };

  const getConfirmationList = (forAccusedTable = false) => {
    const disabled = forAccusedTable
      ? disableForm || isEmpty(accused)
      : disableForm || isEmpty(witness);
    return renderFieldsWithDropDown(
      confirmationList,
      null,
      handleSearch,
      serchText,
      170,
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
            170,
            disableForm || isEmpty(accused),
            "",
            "Present/Not Present"
          )
        );
      case "accusedExaminationStatus":
        return (
          !isAccusedDied &&
          renderFieldsWithDropDown(
            examinationStatusList,
            null,
            handleSearch,
            serchText,
            170,
            disableForm || isEmpty(accused),
            "",
            "Select"
          )
        );
      case "guilty":
        return !isAccusedDied && getConfirmationList(true);
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
      presentOrNotList,
      setWitnessPresence,
      handleSearch,
      serchText,
      170,
      disableForm || isEmpty(witness),
      "",
      "Present/Not Present"
    );

  const newRenderFieldsWithDropDown = (
    menuOptions,
    selectAction,
    handleSearch,
    serchText,
    width = "",
    disabled = false,
    name,
    placeholder = "",
    onClear
  ) => {
    return (
      <Select
        suffixIcon={<CaretDownOutlined className="dropDownIcon" />}
        showSearch
        allowClear
        onSearch={handleSearch}
        filterOption={(input, option) =>
          serchText &&
          option.props.label
            .toString()
            .toLowerCase()
            .indexOf(input.toString().toLowerCase()) >= 0
        }
        style={{ width: width || 150 }}
        onSelect={(item) => {
          selectAction && selectAction(item);
        }}
        disabled={disabled}
        placeholder={placeholder}
        onClear={(item) => onClear && onClear(item)}
      >
        {isArray(menuOptions) &&
          menuOptions.map((item, index) => (
            <Select.Option key={index} value={item?._id} label={item.label}>
              {item.label}
            </Select.Option>
          ))}
      </Select>
    );
  };

  const displayCourtFields = (name) => {
    switch (name) {
      case "witnessName":
        return newRenderFieldsWithDropDown(
          witnessList,
          setWitness,
          handleSearch,
          serchText,
          170,
          disableForm,
          "",
          "Select"
        );
      case "witnessPresence":
        return getPresentOrNotList();
      case "witnessExaminationStatus":
        return renderFieldsWithDropDown(
          examinationStatusList,
          null,
          handleSearch,
          serchText,
          150,
          disableForm || isEmpty(witness),
          "",
          "Select"
        );
      case "crossExaminationStatus":
        return renderFieldsWithDropDown(
          examinationStatusList,
          null,
          handleSearch,
          serchText,
          150,
          disableForm || isEmpty(witness),
          "",
          "Select"
        );
      case "supportedTheProsecuction":
        return getConfirmationList();
      default:
        return (
          <Input
            onChange={checkFields}
            style={{ width: 150 }}
            disabled={disableForm || isEmpty(witness)}
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
        caseDiaryData={caseDiaryData}
        setIODetails={setIODetails}
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
            <Col span={5} style={{ padding: 0, marginTop: 20, marginLeft: 12 }}>
              <Form.Item name="uploadWitnessStatement">
                <Upload
                  fileList={witnessStatementUrl}
                  customRequest={dummyRequest}
                  onChange={(info) =>
                    onFileChange(info, setWitnessStatementUrl)
                  }
                  multiple={false}
                >
                  <Button
                    className="saveButton"
                    style={{ width: 240 }}
                    icon={<CameraFilled style={{ float: "left" }} />}
                    disabled={disableForm}
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
                disabled={
                  disableForm || isEmpty(witness) || isEmpty(witnessPresence)
                }
                onClick={addMoreWitnessDetails}
              >
                Add
              </Button>
            </Col>
          </Row>
        </Form>
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
        trialDate
      )}
      {displayTextAreaForCourtCaseDiary(
        "Court Proceedings",
        "courtProceedings",
        disableForm,
        checkFields
      )}
      {isModalData?.length !== 0 ? (
        // &&
        // !!isModalData[0]?.originFileObj?.name === false
        <Modal
          title="Witness Statement"
          visible={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
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
