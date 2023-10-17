/* eslint-disable array-callback-return */
import { useState, useEffect } from "react";
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
import {
  renderFieldsWithDropDown,
  getAccuseds,
  dummyRequest,
  onFileChange,
} from "@containers/FirDetails/fir-util";
import { isEmpty, first, isUndefined } from "lodash";
import { isArray } from "lodash";
import { useSelector, useDispatch } from "react-redux";
import { CameraFilled, CaretDownOutlined } from "@ant-design/icons";
import StandardCourtCaseDiaryForm from "@components/Common/standardCourtCaseDiaryForm";
import TableRecords from "./TableRecords";
import { config } from "@config/site.config";
import DeathOfAccusedActions from "@redux/CourtAndProsecution/DeathOfAccused/actions.js";
import { loadState } from "@lib/helpers/localStorage";
import { getFileById } from "@containers/media-util";
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
import firActions from "@redux/fir/actions";
import juvenileApprehensionActions from "@redux/investigations/juvenileApprehension/actions";

import {
  presentOrNotList,
  confirmationList,
  examinationStatusList,
} from "../const";

const Option = Select.Option;

export default function IOExamination({
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
  staffListData,
  ioExaminationIoData,
  setIoExaminationIoData,
  ioExaminationAccusedData,
  setIoExaminationAccusedData,
  selectedPerson,
  caseDiaryData,
  checkFields,
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
  const [isAccusedDied, setIsAccusedDied] = useState(false);
  const [IOStatementUrl, setIOStatementUrl] = useState([]);
  const [isCasePostedForNext, setIsCasePostedForNext] = useState("");
  const [accusedPresence, setaccusedPresence] = useState("");
  const [accused, setAccused] = useState("");
  const [tableform] = Form.useForm();
  const [ioPresence, setIoPresence] = useState("");
  const [selectedIo, setSelectedIo] = useState("");
  const { suspectAccusedList } = useSelector((state) => state.SuspectAccused);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalData, setIsModalData] = useState([]);
  const [pendingFor, setPendingFor] = useState("");
  const selectedCourtAndProsecution = loadState("selectedCourtAndProsecution");

  const filterChargeSheetAccusedData = filterAccusedForCCD(
    suspectAccusedList,
    selectedCourtAndProsecution?.data?.accusedParticulars,
    ioExaminationAccusedData
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
      const accusedDetails = [];
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
          isDefenseCounselPetitionFiled: item?.isDefenseCounselPetitionFiled,
          accusedPleadedGuilty: item?.guilty,
        };
        accusedDetails.push(result);
      });
      setIoExaminationAccusedData(accusedDetails);
      setIsCasePostedForNext(caseDiaryData?.isCasePostedForNextHearing);
      const ioExaminationData = [];
      caseDiaryData?.ioDetails?.forEach((values) => {
        const staffObj = staffListData?.find(
          (item) => item?.ioCode === values?.ioCode
        );
        const result1 = {
          ...staffObj,
          ioPresence: values?.presence,
          ioExaminationStatus: values?.statusExamination,
          ioCrossExaminationStatus: values?.statusCrossExamination,
          statement: values?.statement,
        };
        ioExaminationData.push(result1);
        form.setFieldsValue({
          ioName: "",
          ioPresence: "",
          ioExaminationStatus: "",
          ioCrossExaminationStatus: "",
          uploadWitnessStatement: "",
        });
        setIOStatementUrl([]);
      });
      setIoExaminationIoData(ioExaminationData);
      form.setFieldsValue({
        accused: "",
        accusedPresence: "",
        guilty: "",
        documentsfurnished: "",
        petition: "",
      });
    }
  }, [caseDiaryData, deathOfAccusedList]);
  const filterIoData = isArray(staffListData)
    ? staffListData?.filter(
        (item) =>
          !ioExaminationIoData?.some((value) => value?.ioCode === item?.ioCode)
      )
    : [];

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
      accusedPleadedGuilty: values?.guilty,
      accusedPresence: values?.accusedPresence,
      isDefenseCounselPetitionFiled: values?.petition,
    };
    setIoExaminationAccusedData([...ioExaminationAccusedData, result]);
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

  const addIOWitnessDetails = async () => {
    const values = await tableform.validateFields();
    const staffObj = staffListData?.find(
      (item) => item?.ioCode === values?.ioName
    );
    const result = {
      ...staffObj,
      ioPresence: values?.ioPresence,
      ioExaminationStatus: values?.ioExaminationStatus,
      ioCrossExaminationStatus: values?.ioCrossExaminationStatus,
      statement: values?.uploadWitnessStatement,
    };
    setIoExaminationIoData([...ioExaminationIoData, result]);
    tableform.setFieldsValue({
      ioName: "",
      ioPresence: "",
      ioExaminationStatus: "",
      ioCrossExaminationStatus: "",
      uploadWitnessStatement: "",
    });
    setIOStatementUrl([]);
    setSelectedIo("");
    setIoPresence("");
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const removeDetails = (item) => {
    const newArr = ioExaminationAccusedData.filter((x) => x !== item);
    setIoExaminationAccusedData(newArr);
  };

  const removeWitnessDetails = (item) => {
    const newArr = ioExaminationIoData.filter((x) => x !== item);
    setIoExaminationIoData(newArr);
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
          });
          break;
        case "Accused Presence":
          columns.push({
            title: "Accused Presence",
            dataIndex: "accusedPresence",
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

  const IOColumn = [];

  tableConfigData &&
    tableConfigData.map((headTitle) => {
      switch (headTitle) {
        case "IO Name":
          IOColumn.push({
            title: "IO Name",
            dataIndex: "ioName",
            rowKey: "ioName",
          });
          break;
        case "IO Rank":
          IOColumn.push({
            title: "IO Rank",
            dataIndex: "ioRank",
            rowKey: "ioRank",
          });
          break;
        case "IO Presence":
          IOColumn.push({
            title: "IO Presence",
            dataIndex: "ioPresence",
            rowKey: "ioPresence",
          });
          break;
        case "Examination Status":
          IOColumn.push({
            title: "Examination Status",
            dataIndex: "ioExaminationStatus",
            rowKey: "ioExaminationStatus",
          });
          break;
        case "Cross Examination Status":
          IOColumn.push({
            title: "Cross Examination Status",
            dataIndex: "ioCrossExaminationStatus",
            rowKey: "ioCrossExaminationStatus",
          });
          break;
        case "Actions":
          IOColumn.push({
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
                        isArray(item?.statement)
                          ? item?.statement
                          : isArray(item?.statement?.fileList)
                          ? item?.statement?.fileList
                          : !!item?.statement
                          ? [item?.statement]
                          : []
                      );
                    }}
                  >
                    IO Statement
                  </div>
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

  const getPresentOrNotList = () =>
    renderFieldsWithDropDown(
      presentOrNotList,
      setIoPresence,
      handleSearch,
      serchText,
      170,
      disableForm || isEmpty(selectedIo),
      "",
      "Present/Not Present"
    );

  const displayCourtFields = (name) => {
    switch (name) {
      case "ioName":
        return (
          <Select
            suffixIcon={<CaretDownOutlined className="dropDownIcon" />}
            showSearch
            allowClear
            showArrow
            onSearch={handleSearch}
            style={{ width: 170 }}
            disabled={disableForm}
            placeholder={"Select"}
            onSelect={setSelectedIo}
          >
            {(isArray(filterIoData) && filterIoData).map((item, index) => (
              <Option key={index} value={item.ioCode} label={item.ioName}>
                {item.ioName}
              </Option>
            ))}
          </Select>
        );
      case "ioPresence":
        return getPresentOrNotList();
      case "ioExaminationStatus":
        return renderFieldsWithDropDown(
          examinationStatusList,
          null,
          handleSearch,
          serchText,
          150,
          disableForm || isEmpty(selectedIo),
          "",
          "Select"
        );
      case "ioCrossExaminationStatus":
        return renderFieldsWithDropDown(
          examinationStatusList,
          null,
          handleSearch,
          serchText,
          150,
          disableForm || isEmpty(selectedIo),
          "",
          "Select"
        );
      default:
        return (
          <Input
            onChange={checkFields}
            style={{ width: 150 }}
            disabled={disableForm || isEmpty(selectedIo)}
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
        selectedPerson={selectedPerson}
        handleSearch={handleSearch}
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
            <Col span={5} style={{ padding: 0, marginTop: 20, marginLeft: 12 }}>
              <Form.Item name="uploadWitnessStatement">
                <Upload
                  fileList={IOStatementUrl}
                  customRequest={dummyRequest}
                  onChange={(info) => onFileChange(info, setIOStatementUrl)}
                  multiple={false}
                >
                  <Button
                    className="saveButton"
                    style={{ width: 240 }}
                    icon={<CameraFilled style={{ float: "left" }} />}
                    disabled={disableForm || isEmpty(selectedIo)}
                  >
                    Upload IO Statement
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
                  bottom: isEmpty(IOStatementUrl) ? 5 : 35,
                }}
                disabled={
                  disableForm || isEmpty(selectedIo) || isEmpty(ioPresence)
                }
                onClick={addIOWitnessDetails}
              >
                Add
              </Button>
            </Col>
          </Row>
        </Form>
        {!isEmpty(ioExaminationIoData) && (
          <TableRecords dataSource={ioExaminationIoData} columns={IOColumn} />
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
        {!isEmpty(ioExaminationAccusedData) && (
          <TableRecords
            dataSource={ioExaminationAccusedData}
            columns={columns}
          />
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
        // &&
        // !!isModalData[0]?.originFileObj?.name === false
        <Modal
          title="IO Statement"
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
