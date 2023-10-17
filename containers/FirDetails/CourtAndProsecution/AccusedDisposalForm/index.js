/* eslint-disable array-callback-return */
import { useState, useEffect } from "react";
import {
  Row,
  Card,
  Col,
  Form,
  DatePicker,
  Input,
  Button,
  notification,
  Radio,
  Modal,
  Space,
  Checkbox,
  Select,
} from "antd";
import {
  IS_SHO,
  IS_IO,
  DATE_FORMAT,
  renderFieldsWithDropDown,
  getAccuseds,
  renderFieldsWithMultipleDropDown,
  IS_INVESTIGATION_OFFICER
} from "@containers/FirDetails/fir-util";
import { first, isArray, isEmpty, isUndefined } from "lodash";
import ContentHeader from "@containers/FirDetails/ContentHeader";
import { ModuleWrapper } from "@containers/FirDetails/Investigation/CommonDetails/styles";
import suspectAccusedAction from "@redux/investigations/suspectAccused/actions";
import Loader from "@components/utility/loader";
import { config } from "@config/site.config";
import { loadState } from "@lib/helpers/localStorage";
import { useDispatch, useSelector } from "react-redux";
import { textAreaRules } from "@components/Common/formOptions";
import { CaretDownOutlined, SaveOutlined } from "@ant-design/icons";
import TextArea from "antd/lib/input/TextArea";
import TableWrapper from "@containers/Tables/AntTables/AntTables.styles";
import moment from "moment";
import AccusedDisposalFormAction from "@redux/CourtAndProsecution/AccusedDisposalForm/actions.js";
import masterDataActions from "@redux/masterData/actions";
import {
  addAccusedDisposalPayload,
  updateAccusedDisposalPayload,
} from "./AccusedDisposalPayloads";
import SavedRecords from "./SavedRecords";
import { disposalList, punishmentTypeList, ActsAndSection } from "./const";
import { CourtAndProsecutionWrapper } from "../styles";

const optionType = {
  ACT: "ACT",
  SECTION: "SECTION",
};

const Option = Select.Option;

export default function AccusedDisposalForm({
  setSelectedSiderMenu,
  isCourtCaseDiary = false,
  onCancel,
  formData,
  formDisable,
  getAccusedDetails,
}) {
  const [form] = Form.useForm();
  const [actsAndArtsForm] = Form.useForm();
  const dispatch = useDispatch();
  const selectedCourtAndProsecution = loadState("selectedCourtAndProsecution");
  const { savedFir } = useSelector((state) => state.createFIR);
  const crimeId = loadState("selectedFirId");
  const currentUser = loadState("currentUser");
  const [serchText, setSerchText] = useState("");
  const userRole = [IS_SHO, IS_IO, IS_INVESTIGATION_OFFICER];
  const IS_HIGHER_SHO_USER = !userRole?.includes(currentUser?.ecopsv2_role)
  const disableForm =
    (IS_HIGHER_SHO_USER &&
      currentUser?.isPersnolized === false &&
      currentUser?.isIo === false) ||
    savedFir?.caseStatus === "Disposal" || formDisable || selectedCourtAndProsecution.isCourtDisposal;
  const [formValid, setFormValid] = useState(false);
  const { getAccusedList } = suspectAccusedAction;
  const { suspectAccusedList } = useSelector((state) => state.SuspectAccused);
  const filterAccusedList = suspectAccusedList?.filter((item) => !item?.isDied);
  const filterChargeSheetAccusedData = [];
  filterAccusedList.forEach((item) => {
    if (
      selectedCourtAndProsecution?.data?.accusedParticulars.some(
        (data) =>
          data?.accusedPersonId?._id === item?.person?._id &&
          data?.chargeStatus === "Charged"
      ) === true
    ) {
      filterChargeSheetAccusedData.push(item);
    }
  });
  const getAccusedDropdownData = () =>
    getAccuseds(filterChargeSheetAccusedData);
  const accusedLists = getAccusedDropdownData();
  const [viewClicked, setViewClicked] = useState(false);
  const [isRecordsModalVisible, setIsRecordModalVisible] = useState(false);
  const [editAccusedDisposalForm, setEditAccusedDisposalForm] = useState(null);
  const [disposalTypeList, setDisposalTypeList] = useState("");
  const [actsAndSections, setActsAndSections] = useState([]);
  const [selectedAct, setSelectedAct] = useState("");
  const [showSectionDescription, setShowSectionDescription] = useState(false);
  const [selectedSectionListWithDes, setSelectedSectionListWithDes] = useState(
    []
  );

  const {
    actionType,
    errorMessage,
    successMessage,
    accusedDisposalFormList,
    isFetching,
  } = useSelector((state) => state.AccusedDisposalForm);

  const {
    addAccusedDisposalForm,
    updateAccusedDisposalForm,
    getAccusedDisposalFormList,
    resetActionType,
  } = AccusedDisposalFormAction;

  const { actList, sectionList } = useSelector((state) => state.MasterData);
  const { getActList, getSectionList, getCourtsBasedonPsCode } =
    masterDataActions;

  const isSuccess =
    actionType === "ADD_ACCUSED_DISPOSAL_FORM_SUCCESS" ||
    actionType === "UPDATE_ACCUSED_DISPOSAL_FORM_SUCCESS";

  const isError =
    actionType === "ADD_ACCUSED_DISPOSAL_FORM_ERROR" ||
    actionType === "UPDATE_ACCUSED_DISPOSAL_FORM_ERROR";

  const handleSearch = (text) => {
    setSerchText(text);
  };

  const checkFields = async () => {
    const values = await form.validateFields();
    setFormValid(!Object.values(values).every((v) => v == null || v === ""));
  };

  const filteredAccusedList = accusedLists.filter(
    (accused) =>
      !accusedDisposalFormList.some(
        (disAcc) => disAcc?.accusedId?._id === accused?._id
      )
  );

  useEffect(() => {
    dispatch(
      getAccusedList(
        `${config.getPostCrimeSceneDetails}/ACCUSED/?crimeId=${crimeId}`
      )
    );
    dispatch(
      getAccusedDisposalFormList(
        `${config.accusedDisposal}?crimeId=${crimeId}&updateChargesheetId=${selectedCourtAndProsecution?.updateChargesheetId}`
      )
    );
  }, []);

  useEffect(() => {
    const url = config.getMasterData;
    dispatch(
      getCourtsBasedonPsCode(
        `${config.masterData}/getCourtsBasedonPsCode?psCode=${currentUser?.cctns_unit_id}`
      )
    );
    dispatch(getActList(`${url}/${optionType.ACT}`));
    dispatch(getSectionList(`${url}/${optionType.SECTION}`));
  }, []);

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
        if (isCourtCaseDiary) {
          getAccusedDetails();
          onCancel();
        } else {
          setSelectedSiderMenu("courtandprosecution");
        }
        dispatch(resetActionType());
      } else if (errorMessage) {
        openNotificationWithIcon("error", errorMessage);
        dispatch(resetActionType());
      }
    }
  }, [actionType]);

  const getAccusedId = (accusedName, accusedList) => {
    const requiredAccused = first(
      accusedList.filter((accused) => accused.label === accusedName)
    );
    return requiredAccused?._id;
  };

  useEffect(() => {
    if (!!formData === true && Object.keys(formData)?.length !== 0) {
      const values = accusedDisposalFormList?.find(
        (item) => item?.accusedId?._id === formData?.person
      );
      if (!!values) {
        setEditAccusedDisposalForm(values);
        const reloadvalues = values?.actsAndSections;
        let RWRequired = "";
        const reloadactsandsections = reloadvalues.reduce(
          (acc, { actDescription, section, rwRequired, accShortName }) => {
            if (rwRequired) {
              RWRequired = "r/w ";
            } else {
              RWRequired = "";
            }
            const namesWithGreeting = (arr) => {
              return arr.map((name) => RWRequired + name);
            };
            const actShortName = (arr) => {
              return arr.filter(
                (item, _index) => item.ACT_LONG === actDescription
              );
            };
            accShortName = actShortName(actListData);
            section = namesWithGreeting(section);
            acc[actDescription] = {
              actDescription: actDescription,
              accShortName: accShortName?.[0]?.["ACT_SHORT"],
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
        let reloadsections = Object.values(reloadactsandsections);
        if (!isEmpty(values)) {
          setEditAccusedDisposalForm(values);
          setActsAndSections(reloadsections);
        }
        form.setFieldsValue({
          accusedId: values?.accusedId?.personalDetails?.name,
          updateChargesheetId: values?.updateChargesheetId,
          dateOfJudgement: moment(new Date(values?.dateOfJudgement)).isValid()
            ? moment(new Date(values?.dateOfJudgement))
            : "",
          fingerPrintsTaken: values?.fingerPrintsTaken,
          disposalType: values?.disposalType,
          typeOfPunishment: values?.typeOfPunishment,
          accusedPunishmentPeriod: values.accusedPunishmentPeriod,
          fineAmount: values?.fineAmount,
          accusedBondPeriod: values?.accusedBondPeriod,
          actsAndSections: values?.actsAndSections,
          remarks: values?.remarks,
        });
        setDisposalTypeList(values?.disposalType);
      } else {
        const personObj = filteredAccusedList?.find(
          (value) => value?._id === formData?.person
        );
        form.setFieldsValue({
          accusedId: personObj?.label,
        });
      }
    }
  }, [formData, accusedDisposalFormList]);

  const renderActsFieldsWithDropDown = (
    menuOptions,
    selectAction,
    handleSearch,
    serchText,
    width = "",
    disabled = false
  ) => {
    return (
      <Select
        suffixIcon={<CaretDownOutlined className="dropDownIcon" />}
        showSearch
        allowClear
        onSearch={handleSearch}
        style={{ width: width || 150 }}
        onSelect={(item) => {
          selectAction && selectAction(item);
        }}
        disabled={disabled}
      >
        {isArray(menuOptions) &&
          menuOptions.map((item, index) => (
            <Option key={index} value={item.label} label={item.label}>
              {item.label}
            </Option>
          ))}
      </Select>
    );
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

  const sectionListData = sectionList.map((item) => {
    const container = {
      name: item.SECTION,
      label: item.SECTION,
      ACT_SEC_CD: item.ACT_SEC_CD,
      sectionDescription: item.SHORT_DESC,
      sectionCode: item.SECTION_CD,
    };
    return container;
  });

  const actName =
    !isEmpty(actListData) &&
    first(actListData.filter((s) => s.label === selectedAct))?.name;

  const filteredSectionList =
    actName &&
    !isEmpty(sectionListData) &&
    sectionListData.filter((s) => s.ACT_SEC_CD === actName);

  const onActChange = (val) => {
    setSelectedAct(val);
    checkFields();
    actsAndArtsForm.setFieldsValue({
      Section: [],
    });
  };

  const onSectionSelect = (val) => {
    const tempArr = filteredSectionList.filter(
      (section) => val.indexOf(section.label) >= 0
    );
    setSelectedSectionListWithDes(tempArr);
  };

  const removeActs = (item) => {
    const newArr = actsAndSections.filter((x) => x !== item);
    setActsAndSections(newArr);
  };

  const displayActsSectionState = (data, actionName, spanIndex, width) => {
    return (
      <>
        {data.map((s, i) => {
          return (
            <Col span={spanIndex} key={i} style={{ marginBottom: 20 }}>
              <Form.Item name={s.name} label={s.label} style={{ width: width }}>
                {actionName(s.name)}
              </Form.Item>
            </Col>
          );
        })}
      </>
    );
  };

  const displayActsAndSectionFields = (name) => {
    switch (name) {
      case "Act":
        return renderActsFieldsWithDropDown(
          actListData,
          onActChange,
          handleSearch,
          serchText,
          222,
          viewClicked || disableForm
        );
      case "Section":
        return renderFieldsWithMultipleDropDown(
          filteredSectionList,
          onSectionSelect,
          handleSearch,
          serchText,
          222,
          viewClicked || disableForm
        );
    }
  };

  const actSectionColumn = [
    {
      title: "S. NO",
      dataIndex: "index",
      key: "index",
      render: (_value, _item, index) => (
        <span className="tableRowText wordWrap">{++index}</span>
      ),
    },
    {
      title: "R/W Required",
      dataIndex: "rwRequired",
      key: "rwRequired",
      render: (rwRequired) => (
        <span className="tableRowText wordWrap">
          {rwRequired === true ? "Y" : "N"}
        </span>
      ),
    },
    {
      title: "Act Description",
      dataIndex: "actDescription",
      key: "actDescription",
    },
    {
      title: "Section",
      dataIndex: "section",
      key: "section",
      render: (_value, item, _index) => {
        const actName =
          !isEmpty(actListData) &&
          first(actListData.filter((s) => s.label === item?.actDescription));
        return (
          <>
            {!isUndefined(item.section) &&
              isArray(item.section) &&
              item.section.map((section, i) => {
                return (
                  <span className="tableRowText wordWrap" key={i}>
                    {`${section}${i !== item?.section.length - 1 ? ", " : " "}`}
                  </span>
                );
              })}
            <span>{actName?.ACT_SHORT !== "" ? actName?.ACT_SHORT : ""}</span>
          </>
        );
      },
    },
    {
      title: "Actions",
      dataIndex: "action",
      key: "action",
      render: (_value, item, _index) => (
        <Button
          disabled={viewClicked}
          className="stepsButtonInActive"
          onClick={() => removeActs(item)}
        >
          Delete
        </Button>
      ),
    },
  ];

  var jss = Object.assign(actsAndSections);
  const submitActs = async (values) => {
    await actsAndArtsForm.validateFields();
    if (values.Section || values.Act || values.RWrequired) {
      const actsAndSectionsData1 = {
        actDescription: values?.Act,
        section: values?.Section,
        sectionDescription:
          !isEmpty(filteredSectionList) &&
          first(filteredSectionList.filter((s) => s.label === values?.Section))
            ?.sectionDescription,
        rwRequired: values?.RWrequired,
      };
      jss = { ...jss, actsAndSectionsData1 };
      var sectiondata = values.Section.toString();
      var splitdata = sectiondata.split(",");
      let array = [];
      for (var i = 0; i < splitdata.length; i++) {
        if (values.RWrequired === true) {
          array.push("r/w " + splitdata[i]);
        } else {
          array.push(splitdata[i]);
        }
      }
      var formsection = array.toString();
      const actsAndSectionsData = {
        actDescription: values?.Act,
        section: [formsection],
        sectionDescription:
          !isEmpty(filteredSectionList) &&
          first(filteredSectionList.filter((s) => s.label === values?.Section))
            ?.sectionDescription,
        rwRequired: values?.RWrequired,
      };
      jss = { ...jss, actsAndSectionsData1 };
      var sectiondata = values.Section.toString();
      var splitdata = sectiondata.split(",");

      for (var i = 0; i < splitdata.length; i++) {
        if (values.RWrequired === true) {
          array.push("r/w " + splitdata[i]);
        } else {
          array.push(splitdata[i]);
        }
      }
      var formsection = array.toString();

      setActsAndSections((actsAndSections) => [
        ...actsAndSections,
        actsAndSectionsData,
      ]);

      actsAndArtsForm.resetFields();
      for (let i = 0; i <= actsAndSections.length; i++) {
        if (values.Act === actsAndSections[i].actDescription) {
          var add = (actsAndSections, key, val) => {
            actsAndSections[i].section = [
              ...new Set(actsAndSections[i].section.concat(val)),
            ];
            setActsAndSections(actsAndSections);
            actsAndArtsForm.resetFields();
          };
          actsAndArtsForm.resetFields();
          add(actsAndSections, values.Act, actsAndSectionsData.section);
        }
        actsAndArtsForm.resetFields();
      }
    }
  };

  const submit = async () => {
    const values = await form.validateFields();
    const addPayload = addAccusedDisposalPayload(
      values,
      crimeId,
      getAccusedId(values?.accusedId, accusedLists),
      selectedCourtAndProsecution?.updateChargesheetId,
      selectedCourtAndProsecution?._id,
      actsAndSections
    );

    const updatePayload = updateAccusedDisposalPayload(
      values,
      crimeId,
      getAccusedId(values?.accusedId, accusedLists),
      selectedCourtAndProsecution?.updateChargesheetId,
      selectedCourtAndProsecution?._id,
      editAccusedDisposalForm?._id,
      actsAndSections
    );
    if (editAccusedDisposalForm?._id) {
      dispatch(
        updateAccusedDisposalForm(
          `${config.accusedDisposalForm}?crimeId=${crimeId}`,
          updatePayload
        )
      );
    } else {
      dispatch(
        addAccusedDisposalForm(
          `${config.accusedDisposalForm}?crimeId=${crimeId}`,
          addPayload
        )
      );
    }
  };

  const setSelectedData = (values) => {
    setEditAccusedDisposalForm(values);
    const reloadvalues = values?.actsAndSections;
    let RWRequired = "";
    const reloadactsandsections = reloadvalues.reduce(
      (acc, { actDescription, section, rwRequired, accShortName }) => {
        if (rwRequired) {
          RWRequired = "r/w ";
        } else {
          RWRequired = "";
        }
        const namesWithGreeting = (arr) => {
          return arr.map((name) => RWRequired + name);
        };
        const actShortName = (arr) => {
          return arr.filter((item, _index) => item.ACT_LONG === actDescription);
        };
        accShortName = actShortName(actListData);
        section = namesWithGreeting(section);
        acc[actDescription] = {
          actDescription: actDescription,
          accShortName: accShortName?.[0]?.["ACT_SHORT"],
          section:
            typeof acc[actDescription] !== "undefined"
              ? acc[actDescription].section.concat(section)
              : section,
        };
        acc[actDescription].section = acc[actDescription].section.filter(
          (item, index) => acc[actDescription].section.indexOf(item) === index
        );
        return acc;
      },
      {}
    );
    let reloadsections = Object.values(reloadactsandsections);
    if (!isEmpty(values)) {
      setEditAccusedDisposalForm(values);
      setActsAndSections(reloadsections);
    }

    form.setFieldsValue({
      accusedId: values?.accusedId?.personalDetails?.name,
      updateChargesheetId: values?.updateChargesheetId,
      dateOfJudgement: moment(new Date(values?.dateOfJudgement)).isValid()
        ? moment(new Date(values?.dateOfJudgement))
        : "",
      fingerPrintsTaken: values?.fingerPrintsTaken,
      disposalType: values?.disposalType,
      typeOfPunishment: values?.typeOfPunishment,
      accusedPunishmentPeriod: values.accusedPunishmentPeriod,
      fineAmount: values?.fineAmount,
      accusedBondPeriod: values?.accusedBondPeriod,
      actsAndSections: values?.actsAndSections,
      remarks: values?.remarks,
    });
    setDisposalTypeList(values?.disposalType);
  };

  return (
    <ModuleWrapper>
      <CourtAndProsecutionWrapper>
        <ContentHeader
          headerTitle="Accused Disposal Form"
          onSubmitClick={submit}
          isInvestigation={true}
          onCancel={() =>
            isCourtCaseDiary
              ? onCancel()
              : setSelectedSiderMenu("courtandprosecution")
          }
          disableButton={disableForm || viewClicked}
        />
        {isFetching ? (
          <Loader />
        ) : (
          <Row>
            <Card
              style={{
                minHeight: 400,
                width: `${!!formData === false &&
                  Object.keys(!!formData ? formData : {})?.length === 0
                  ? "75%"
                  : "100%"
                  }`,
                padding: 10,
              }}
              className="cardLeftStyle"
            >
              <Form form={form} layout="vertical">
                <Row gutter={24}>
                  <Col span={6}>
                    <Form.Item
                      name="accusedId"
                      label="Accused Name"
                      rules={[
                        {
                          required: true,
                          message: "Accused Name is required!",
                        },
                      ]}
                    >
                      {renderFieldsWithDropDown(
                        filteredAccusedList,
                        null,
                        handleSearch,
                        serchText,
                        180,
                        editAccusedDisposalForm?._id ||
                        Object.keys(!!formData ? formData : {}).length !==
                        0 ||
                        disableForm ||
                        viewClicked,
                        "",
                        "Select"
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
                        disabled={disableForm || viewClicked}
                        placeholder="Date"
                        style={{ width: 180 }}
                        onChange={checkFields}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={5} style={{ marginTop: 28, paddingRight: 0 }}>
                    <p style={{ fontSize: 16 }}>Finger Prints taken</p>
                  </Col>
                  <Col span={7} style={{ marginTop: 25 }}>
                    <Form.Item name="fingerPrintsTaken">
                      <Radio.Group
                        buttonStyle="solid"
                        disabled={disableForm || viewClicked}
                      >
                        <Radio value={"Yes"}>Yes</Radio>
                        <Radio value={"No"}>No</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                </Row>
                <Space size={[35, 16]} wrap style={{ marginTop: "15px" }}>
                  <Form.Item name="disposalType" label="Disposal type">
                    {renderFieldsWithDropDown(
                      disposalList,
                      setDisposalTypeList,
                      handleSearch,
                      serchText,
                      200,
                      disableForm || viewClicked,
                      "",
                      "Disposal type"
                    )}
                  </Form.Item>
                  {disposalTypeList === "Convicted" && (
                    <>
                      <Form.Item
                        name="typeOfPunishment"
                        label="Type Of Punishment"
                      >
                        {renderFieldsWithDropDown(
                          punishmentTypeList,
                          null,
                          handleSearch,
                          serchText,
                          150,
                          disableForm || viewClicked,
                          "",
                          "Punishment Type"
                        )}
                      </Form.Item>
                      <Form.Item
                        name="accusedPunishmentPeriod"
                        label="Accused Punishment period "
                      >
                        <Input
                          onChange={checkFields}
                          disabled={disableForm || viewClicked}
                          style={{ width: 150 }}
                        />
                      </Form.Item>
                      <Form.Item name="fineAmount" label="Fine Amount">
                        <Input
                          onChange={checkFields}
                          disabled={disableForm || viewClicked}
                          style={{ width: 150 }}
                        />
                      </Form.Item>
                      <Form.Item
                        name="accusedBondPeriod"
                        label="Bond period of the Accused"
                      >
                        <Input
                          onChange={checkFields}
                          disabled={disableForm || viewClicked}
                          style={{ width: 150 }}
                        />
                      </Form.Item>
                    </>
                  )}
                </Space>
                {disposalTypeList === "Convicted" && (
                  <Card className="card-style" style={{ margin: "20px 2px" }}>
                    <Form
                      form={actsAndArtsForm}
                      id={actsAndArtsForm}
                      layout="vertical"
                      onFinish={submitActs}
                    >
                      <Row gutter={24}>
                        <Col
                          span={12}
                          style={{ fontSize: 16, fontWeight: "bold" }}
                        >
                          Acts & Sections
                        </Col>
                      </Row>
                      <Row gutter={24} style={{ marginTop: 10 }}>
                        {displayActsSectionState(
                          ActsAndSection,
                          displayActsAndSectionFields,
                          7,
                          250
                        )}
                        <Col>
                          <Form.Item>
                            <Button
                              type="primary"
                              className="saveButton"
                              style={{ marginTop: 25 }}
                              disabled={viewClicked || disableForm}
                              icon={<SaveOutlined className="saveButtonIcon" />}
                              onClick={() => {
                                if (
                                  !isEmpty(
                                    actsAndArtsForm.getFieldValue("Section")
                                  )
                                ) {
                                  setShowSectionDescription(true);
                                }
                              }}
                            >
                              Save
                            </Button>
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={24} style={{ marginBottom: 10 }}>
                        <Col span={24}>
                          <Form.Item name="RWrequired" valuePropName="checked">
                            <Checkbox disabled={viewClicked || disableForm}>
                              R/W required
                            </Checkbox>
                          </Form.Item>
                          {!isEmpty(actsAndSections) ? (
                            <div className="widgetContainer">
                              <TableWrapper
                                dataSource={actsAndSections}
                                columns={actSectionColumn}
                                pagination={false}
                                rowKey={(_obj, index) => `${index}_key`}
                                size="small"
                              />
                            </div>
                          ) : null}
                        </Col>
                      </Row>
                    </Form>
                  </Card>
                )}
                {disposalTypeList !== "Convicted" ? (
                  <Row gutter={24} style={{ marginTop: 15 }}>
                    <Col span={24}>
                      <Form.Item
                        name="remarks"
                        label="Remarks"
                        rules={[textAreaRules.textAreaMaxLength]}
                      >
                        <TextArea
                          style={{ height: "100px" }}
                          maxLength={textAreaRules.maxLength}
                          disabled={disableForm || viewClicked}
                          onChange={checkFields}
                          placeholder="Enter Remarks"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                ) : null}
              </Form>
              <Modal
                title="Do you want to add Section ?"
                visible={showSectionDescription}
                okButtonProps={{ form: actsAndArtsForm, htmlType: "submit" }}
                onOk={() => {
                  setShowSectionDescription(false);
                }}
                onCancel={() => {
                  setShowSectionDescription(false);
                }}
                okText="Yes"
                cancelText="No"
              >
                {selectedSectionListWithDes.map((section) => {
                  const knownErrors = [
                    "na",
                    "NA",
                    "Na",
                    "N/A",
                    "NO SECTION",
                    "--Nill--",
                    "undefined",
                  ];
                  const result =
                    isUndefined(section.sectionDescription) ||
                      knownErrors.indexOf(section.sectionDescription) != -1
                      ? `Section ${section?.label}`
                      : `Section ${section?.label} : ${section?.sectionDescription}`;
                  return <p>{result}</p>;
                })}
              </Modal>
            </Card>
            {!!formData === false &&
              Object.keys(!!formData ? formData : {})?.length === 0 ? (
              <Card
                style={{ width: "25%", minHeight: 400 }}
                className="right-section cardRightStyle"
              >
                {accusedDisposalFormList?.length > 0 ? (
                  <Button
                    style={{ marginTop: 40, width: "100%" }}
                    onClick={() => setIsRecordModalVisible(true)}
                  >
                    {`${accusedDisposalFormList?.length} Accused Disposal Form Records`}
                  </Button>
                ) : null}
                <Modal
                  title="Accused Disposal Form Records"
                  visible={isRecordsModalVisible}
                  onOk={() => setIsRecordModalVisible(false)}
                  onCancel={() => setIsRecordModalVisible(false)}
                  style={{ minWidth: "95vw" }}
                  footer={null}
                >
                  <div style={{ maxHeight: 650, overflowY: "auto" }}>
                    <SavedRecords
                      dataSource={accusedDisposalFormList}
                      setSelectedData={setSelectedData}
                      setViewClicked={setViewClicked}
                      setFormValid={setFormValid}
                      setIsRecordModalVisible={setIsRecordModalVisible}
                      disableForm={disableForm}
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
