/* eslint-disable array-callback-return */
import {
  Row,
  Card,
  Col,
  Form,
  Select,
  Button,
  notification,
  Input,
  Checkbox,
  DatePicker,
  Modal,
} from "antd";
import { CaretDownOutlined, SaveOutlined } from "@ant-design/icons";
import { config } from "@config/site.config";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import Loader from "@components/utility/loader";
import { loadState } from "@lib/helpers/localStorage";
import moment from "moment";
import masterDataActions from "@redux/masterData/actions";
import { isArray, isEmpty, first, isUndefined, isNull } from "lodash";
import { gravityList } from "@containers/const";
import { actDatalocal } from "@containers/FirDetails/fir-util";
import {
  DATE_FORMAT,
  renderFieldsWithMultipleDropDown,
} from "@containers/FirDetails/fir-util";
import { disableFutureDates } from "@components/Common/helperMethods";
import alterationMemoActions from "@redux/investigations/alterationMemo/actions";
import DisplayReportGenerations from "@containers/FirDetails/CommonSections/DisplayReportGenerations";
import { getAuditHistoryPayload } from "@containers/const";
import auditHistoryActions from "@redux/auditHistory/actions";
import TableWrapper from "@containers/Tables/AntTables/AntTables.styles";
import createFIRActions from "@redux/createFir/actions";
import SavedRecords from "./SavedRecords";
import ContentHeader from "../../ContentHeader";
import { ModuleWrapper } from "../CommonDetails/styles";
import {
  addAlterationMemoPayload,
  updateAlterationMemoPayload,
  confirmAlterationMemoPayload,
} from "./alterationMemoPayloads";
import {
  alterationMemoTemplates,
  alterationReasons,
  getDataForDocument,
  getHTMLFromTemplate,
  ActsAndSection,
  majorMinor,
} from "./const";
import TemplatesModal from "../CommonForms/TemplatesModal";

const optionType = {
  ACT: "ACT",
  SECTION: "SECTION",
  MAJOR_HEAD: "MAJOR_HEAD",
  MINOR_HEAD: "MINOR_HEAD",
};

const Option = Select.Option;

export default function AlterationMemo({ setSelectedSiderMenu }) {
  const [form] = Form.useForm();
  const [graveForm] = Form.useForm();
  const [actsAndArtsForm] = Form.useForm();
  const [majorMinorForm] = Form.useForm();
  const dispatch = useDispatch();
  const [formValid, setFormValid] = useState(false);
  const [serchText, setSerchText] = useState("");
  const crimeId = loadState("selectedFirId");
  const selectedFir = loadState("selectedFir");
  const currentUser = loadState("currentUser");
  const [selectedAct, setSelectedAct] = useState("");
  const [viewAlterationMemoDetails, setViewAlterationMemoDetails] =
    useState(false);
  const [editAlterationMemoObj, setEditAlterationMemoObj] = useState(null);
  const [selectedAlterationMemoObj, setSelectedAlterationMemoObj] =
    useState(null);
  const [actsAndSections, setActsAndSections] = useState([]);
  const [selectedTemplateName, setSelectedTemplateName] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [acts, setActs] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedMajorHead, setSelectedMajorHead] = useState("");
  const [selectedCrimeType, setSelectedCrimeType] = useState("");
  const [majorAndMinor, setMajorAndMinor] = useState([]);
  const [recordsIsModalVisible, setrecordsIsModalVisible] = useState(false);
  const [showHideMajorMinor, setShowHideMajorMinor] = useState(false);
  const [grave, setGrave] = useState("");
  const [showSectionDescription, setShowSectionDescription] = useState(false);
  const [selectedSectionListWithDes, setSelectedSectionListWithDes] = useState(
    []
  );

  const onChangeGrave = (val) => {
    setGrave(val);
  };
  const { savedFir, filteredMajorHeadList } = useSelector(
    (state) => state.createFIR
  );
  const disableForm =
    savedFir?.caseStatus === "Disposal" ||
    savedFir?.isTransferOfCaseFile === true ||
    savedFir?.isChargeSheetTakenOrFiled === true;

  const { getDefaultMajorHead } = createFIRActions;

  const {
    getActList,
    getSectionList,
    getMajorHeadList,
    getMinorHeadList,
    getCourtsBasedonPsCode,
  } = masterDataActions;
  const {
    actList,
    sectionList,
    majorHeadList,
    minorHeadList,
    courtsFromPSList,
  } = useSelector((state) => state.MasterData);
  const {
    addAlterationMemoDetails,
    updateAlterationMemoDetails,
    getAlterationMemoList,
    resetActionType,
  } = alterationMemoActions;
  const { createAuditHistory } = auditHistoryActions;
  const {
    actionType,
    errorMessage,
    isFetching,
    alterationMemoList,
    successMessage,
  } = useSelector((state) => state.AlterationMemo);

  const isSuccess =
    actionType === "ADD_ALTERATION_MEMO_SUCCESS" ||
    "UPDATE_ALTERATION_MEMO_SUCCESS";
  const isError =
    actionType === "ADD_ALTERATION_MEMO_ERROR" ||
    "UPDATE_ALTERATION_MEMO_ERROR";

  useEffect(() => {
    const url = config.getMasterData;
    dispatch(
      getCourtsBasedonPsCode(
        `${config.masterData}/getCourtsBasedonPsCode?psCode=${currentUser?.cctns_unit_id}`
      )
    );
    dispatch(getActList(`${url}/${optionType.ACT}`));
    dispatch(getSectionList(`${url}/${optionType.SECTION}`));
    dispatch(
      getAlterationMemoList(`${config.getAlterationMemo}?crimeId=${crimeId}`)
    );
    dispatch(getMajorHeadList(`${url}/${optionType.MAJOR_HEAD}`));
    dispatch(getMinorHeadList(`${url}/${optionType.MINOR_HEAD}`));
  }, []);

  useEffect(() => {
    const firDetail = savedFir?.firDetail;
    setSelectedCrimeType(firDetail?.crimeType);
    if (selectedAct !== "") {
      var mergedSections = [].concat.apply([], sections);
      const payload = {
        acts: acts,
        sections: mergedSections,
        crimeClassificationCode: selectedCrimeType,
      };
      dispatch(getDefaultMajorHead(config.getDefaultMajorHead, payload));
    }
  }, [acts]);

  useEffect(() => {
    if (filteredMajorHeadList?.status === true) {
      const major =
        !isEmpty(majorHeadList) &&
        first(
          majorHeadList.filter((s) => s.code === filteredMajorHeadList?.data)
        ).label;
      majorMinorForm.setFieldsValue({
        Major: major,
      });
      setSelectedMajorHead(major);
    }
  }, [
    actsAndSections,
    filteredMajorHeadList?.data,
    filteredMajorHeadList?.status,
    majorHeadList,
    majorMinorForm,
  ]);

  const auditHistoryEntry = () => {
    const auditType =
      actionType === "ADD_ALTERATION_MEMO_SUCCESS"
        ? "Alteration Memo Created"
        : "Alteration Memo Updated";
    dispatch(
      createAuditHistory(
        config.createAudits,
        getAuditHistoryPayload(
          crimeId,
          "investigation/alterationMemo",
          auditType
        )
      )
    );
  };

  const openNotificationWithIcon = (type, message) => {
    return notification[type]({
      message: message,
    });
  };

  useEffect(() => {
    if (isSuccess || isError) {
      if (
        successMessage === "Alteration Memo Successfully Added" ||
        successMessage === "Alteration Memo Successfully Updated"
      ) {
        openNotificationWithIcon("success", successMessage);
        auditHistoryEntry();
        setSelectedSiderMenu("investigation");
        dispatch(resetActionType());
      } else if (errorMessage) {
        openNotificationWithIcon("error", errorMessage);
        dispatch(resetActionType());
      }
    }
  }, [actionType]);

  const isMajorAdded =
    !isEmpty(actsAndSections) &&
    actsAndSections.filter((s) => s.majorHead !== "");

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
    if (isEmpty(newArr)) {
      setShowHideMajorMinor(false);
    }
  };

  const checkFields = async () => {
    const values = await form.validateFields();
    setFormValid(!Object.values(values).every((v) => v == null || v === ""));
  };

  const handleSearch = (text) => {
    setSerchText(text);
  };

  const renderFieldsWithDropDown = (
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
        onSearch={handleSearch}
        style={{ width: 220 }}
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

  var jss = Object.assign(actsAndSections);
  const submitActs = async (values) => {
    await actsAndArtsForm.validateFields();
    if (values.Section || values.Act || values.RWrequired) {
      onSectionChange(values);
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
            console.log(actsAndSections);
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
    const resultTemp = jss.reduce(
      (acc, { actDescription, section, rwRequired }) => {
        var sectiondata = section.toString();
        var splitdata = sectiondata.split(",");
        for (var i = 0; i < splitdata.length; i++) {
          let array = [];
          if (splitdata[i].indexOf("r/w ") === -1) {
            let desc = actDescription + splitdata[i] + "false";
            acc[desc] = {
              actDescription: actDescription,
              rwRequired: false,
              section:
                typeof acc[desc] !== "undefined"
                  ? acc[desc].section.concat(section)
                  : section,
            };
            acc[desc].section = acc[desc].section.filter(
              (item, index) => acc[desc].section.indexOf(item) === index
            );
            var sectionData = acc[desc].section.toString();
            var splitData = sectionData.split(",");
            array.push(splitData[i].replace("r/w ", ""));
            acc[desc].section = array;
          } else {
            let desc = actDescription + splitdata[i] + "true";
            acc[desc] = {
              actDescription: actDescription,
              rwRequired: true,
              section:
                typeof acc[desc] !== "undefined"
                  ? acc[desc].section.concat(section)
                  : section,
            };
            acc[desc].section = acc[desc].section.filter(
              (item, index) => acc[desc].section.indexOf(item) === index
            );
            var sectiondataList = acc[desc].section.toString();
            var splitdataList = sectiondataList.split(",");
            array.push(splitdataList[i].replace("r/w ", ""));
            acc[desc].section = array;
          }
        }
        return acc;
      },
      {}
    );
    let resp = Object.values(resultTemp);
    const values = await form.validateFields();
    const addPayload = addAlterationMemoPayload(
      values,
      crimeId,
      resp,
      majorAndMinor,
      grave
    );

    const updatePayload = updateAlterationMemoPayload(
      values,
      crimeId,
      editAlterationMemoObj?._id,
      resp,
      majorAndMinor,
      grave
    );
    if (editAlterationMemoObj?._id) {
      dispatch(
        updateAlterationMemoDetails(config.updateAlterationMemo, updatePayload)
      );
    } else {
      if (!isEmpty(actsAndSections)) {
        dispatch(
          addAlterationMemoDetails(config.addAlterationMemo, addPayload)
        );
      }
    }
  };

  const showModal = (templateName, fileName, templateAvailable = false) => {
    if (templateAvailable) {
      setIsModalVisible(true);
      setSelectedTemplateName(`${templateName} - Preview`);
      setSelectedFileName(fileName);
    } else {
      setIsModalVisible(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const reportData = getDataForDocument(
    editAlterationMemoObj,
    selectedFileName,
    selectedFir,
    currentUser,
    savedFir
  );

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

  const majorHeadCode =
    !isEmpty(majorHeadList) &&
    first(majorHeadList.filter((s) => s.label === selectedMajorHead))?.code;

  const filteredMinorHeadList =
    majorHeadCode &&
    !isEmpty(minorHeadList) &&
    minorHeadList.filter((s) => s.code === majorHeadCode);

  const onMajorHeadChange = (val) => {
    setSelectedMajorHead(val);
    majorMinorForm.setFieldsValue({
      Minor: "",
    });
    checkFields();
  };

  const selectedActDetails =
    !isEmpty(actListData) &&
    first(actListData.filter((s) => s.label === selectedAct));

  const onSectionChange = (values) => {
    let sectionArr = [];
    !isEmpty(values?.Section) &&
      values?.Section.map((section) => {
        const selectedSection =
          !isEmpty(filteredSectionList) &&
          first(filteredSectionList.filter((s) => s.name === section));
        sectionArr.push(parseInt(selectedSection?.sectionCode));
      });
    setSections((sections) => [...sections, ...sectionArr]);
    setActs((acts) => [...acts, parseInt(selectedActDetails?.name)]);

    majorMinorForm.setFieldsValue({
      Minor: "",
      Major: "",
    });
  };

  const removeMajor = (item) => {
    const newArr = majorAndMinor.filter((x) => x !== item);
    setMajorAndMinor(newArr);
  };

  const submitMajor = async (values) => {
    await majorMinorForm.validateFields();
    if (values.Major || values.Minor) {
      const majorAndMinorData = {
        majorHead: values?.Major,
        minorHead: values?.Minor,
        primaryMajor: values?.primaryMajor,
      };

      setMajorAndMinor((majorAndMinor) => [
        ...majorAndMinor,
        majorAndMinorData,
      ]);
    }
    majorMinorForm.resetFields();
  };

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

  const renderFieldsWithDropDownMajorMinor = (
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

  const displayActsAndSectionFields = (name) => {
    switch (name) {
      case "Act":
        return renderActsFieldsWithDropDown(
          actListData,
          onActChange,
          handleSearch,
          serchText,
          222,
          viewAlterationMemoDetails || disableForm
        );
      case "Section":
        return renderFieldsWithMultipleDropDown(
          filteredSectionList,
          onSectionSelect,
          handleSearch,
          serchText,
          222,
          viewAlterationMemoDetails || disableForm
        );
      case "Major":
        return renderFieldsWithDropDownMajorMinor(
          majorHeadList,
          onMajorHeadChange,
          handleSearch,
          serchText,
          222,
          viewAlterationMemoDetails || disableForm
        );
      case "Minor":
        return renderFieldsWithDropDownMajorMinor(
          // As of now adding from frontend need to change this from api
          isArray(filteredMinorHeadList) &&
            !filteredMinorHeadList.some((item) => {
              return item.label === "Others";
            })
            ? [...filteredMinorHeadList, { label: "Others" }]
            : filteredMinorHeadList,
          null,
          handleSearch,
          serchText,
          222,
          viewAlterationMemoDetails || disableForm
        );
      default:
        return (
          <Input
            onChange={checkFields}
            style={{ width: 222 }}
            disabled={viewAlterationMemoDetails || disableForm}
          />
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
          disabled={viewAlterationMemoDetails}
          className="stepsButtonInActive"
          onClick={() => removeActs(item)}
        >
          Delete
        </Button>
      ),
    },
  ];

  const majorMinorColumn = [
    {
      title: "S. NO",
      dataIndex: "index",
      key: "index",
      render: (_value, _item, index) => (
        <span className="tableRowText wordWrap">{++index}</span>
      ),
    },
    {
      title: "Primary Major",
      dataIndex: "primaryMajor",
      key: "primaryMajor",
      render: (_value, item, _index) => {
        let val = "";
        if (!isEmpty(isMajorAdded) && item?.primaryMajor === true) {
          val = "Y";
        } else if (
          isUndefined(item?.primaryMajor) &&
          isUndefined(item?.majorHead)
        ) {
          val = "";
        } else if (!isEmpty(isMajorAdded) && !isUndefined(item?.primaryMajor)) {
          val = "N";
        }
        return <span className="tableRowText wordWrap">{val}</span>;
      },
    },
    {
      title: "Major Head",
      dataIndex: "majorHead",
      key: "majorHead",
    },
    {
      title: "Minor Head",
      dataIndex: "minorHead",
      key: "minorHead",
    },
    {
      title: "Actions",
      dataIndex: "action",
      key: "action",
      render: (_value, item, _index) => (
        <Button
          disabled={viewAlterationMemoDetails}
          className="stepsButtonInActive"
          onClick={() => removeMajor(item)}
        >
          Delete
        </Button>
      ),
    },
  ];
  const handleEditAlterationMemoDetails = (value) => {
    const reloadvalues = value?.actsAndSections;
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
    if (!isEmpty(value)) {
      setSelectedAlterationMemoObj(value);
      setEditAlterationMemoObj(value);
      setMajorAndMinor(value?.majorMinorClassification);
      setActsAndSections(reloadsections);
      setGrave(value?.gravity);
      graveForm.setFieldsValue({
        gravity: value?.gravity,
      });
      form.setFieldsValue({
        reasonForSectionAlteration:
          value?.alterationReason?.reasonForSectionAlteration,
        alterationDate: moment(
          new Date(value?.alterationReason?.alterationDate)
        ),
        courtName: value?.alterationReason?.courtName,
        intimationToSuperior: value?.alterationReason?.intimationToSuperior,
        dateOfRequest: moment(new Date(value?.dispatchToCourt?.dateOfRequest)),
        fromCourtName: value?.dispatchToCourt?.fromCourtName,
        transferredCourtName: value?.dispatchToCourt?.transferredCourtName,
        dateOfTransfer: moment(
          new Date(value?.dispatchToCourt?.dateOfTransfer)
        ),
      });
    }
  };

  const confirmAlterationSubmit = (values) => {
    if (!isEmpty(values)) {
      const confirmPayload = confirmAlterationMemoPayload(
        values,
        crimeId,
        values._id,
        values?.gravity
      );
      const firData = JSON.parse(localStorage.getItem("selectedFir"));
      Object.assign(firData, {
        majorMinorClassification:
          confirmPayload?.alteration?.majorMinorClassification?.length !== 0
            ? confirmPayload?.alteration?.majorMinorClassification
            : firData?.majorMinorClassification,
        actsAndSections: confirmPayload?.alteration?.actsAndSections,
      });
      localStorage.removeItem("selectedActDetails");
      localStorage.removeItem("selectedFir");
      localStorage.setItem(
        "selectedActDetails",
        JSON.stringify(actDatalocal(firData, actList))
      );
      localStorage.setItem("selectedFir", JSON.stringify(firData));
      if (values._id) {
        dispatch(
          updateAlterationMemoDetails(
            config.updateAlterationMemo,
            confirmPayload
          )
        );
      }
    }
  };

  const getSavedData = () => {
    let savedData = [];
    !isEmpty(alterationMemoList) &&
      alterationMemoList.alteration.map((data) => {
        const result = {
          selectedRecord: data,
          actListData: actListData,
          gravity: data?.gravity,
          confirmAlteration: data?.alterationReason?.confirmAlteration,
          prevActs:
            !isEmpty(savedFir?.firDetail) &&
            !isUndefined(savedFir?.firDetail) &&
            savedFir?.initialActsAndSections,
          alteredActsAndSections: data?.actsAndSections || "",
          alterationDate: data?.alterationReason?.alterationDate || "",
          actions: "",
        };
        savedData.push(result);
      });
    return savedData;
  };

  const courtNames =
    courtsFromPSList &&
    isArray(courtsFromPSList) &&
    !isEmpty(courtsFromPSList) &&
    courtsFromPSList.map(({ court }) => ({ label: court }));

  const selectedRecord = !isNull(selectedAlterationMemoObj) && {
    crimeId: crimeId,
    ...selectedAlterationMemoObj,
  };

  return (
    <ModuleWrapper>
      <ContentHeader
        headerTitle="Alteration Memo"
        addAnother={false}
        onSubmitClick={submit}
        disableButton={viewAlterationMemoDetails || disableForm}
        isInvestigation={true}
        onCancel={() => setSelectedSiderMenu("investigation")}
      />
      {isFetching ? (
        <Loader />
      ) : (
        <Row>
          <Card
            style={{ width: "70%", minHeight: 500 }}
            className="cardLeftStyle"
          >
            <Form form={graveForm}>
              <Row>
                <Col>
                  <Form.Item name="gravity" label="Gravity">
                    {renderFieldsWithDropDown(
                      gravityList,
                      onChangeGrave,
                      handleSearch,
                      serchText,
                      222,
                      viewAlterationMemoDetails || disableForm
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Form>
            <Card className="card-style">
              <Form
                form={actsAndArtsForm}
                id={actsAndArtsForm}
                layout="vertical"
                onFinish={submitActs}
              >
                <Row gutter={24}>
                  <Col span={12} style={{ fontSize: 16, fontWeight: "bold" }}>
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
                        disabled={viewAlterationMemoDetails || disableForm}
                        icon={<SaveOutlined className="saveButtonIcon" />}
                        onClick={() => {
                          if (
                            !isEmpty(actsAndArtsForm.getFieldValue("Section"))
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
                      <Checkbox
                        disabled={viewAlterationMemoDetails || disableForm}
                      >
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
            <Card className="card-style">
              <Form
                form={majorMinorForm}
                layout="vertical"
                onFinish={submitMajor}
              >
                {showHideMajorMinor === true || !isEmpty(majorAndMinor) ? (
                  <>
                    <Row gutter={24}>
                      <Col
                        span={12}
                        style={{ fontSize: 16, fontWeight: "bold" }}
                      >
                        Major and Minor Classifications
                      </Col>
                    </Row>
                    <Row gutter={24}>
                      {displayActsSectionState(
                        majorMinor,
                        displayActsAndSectionFields,
                        8,
                        250
                      )}
                      <Col>
                        <Form.Item>
                          <Button
                            type="primary"
                            className="saveButton"
                            style={{ marginTop: 25 }}
                            disabled={!isEmpty(majorAndMinor) || disableForm}
                            icon={<SaveOutlined className="saveButtonIcon" />}
                            htmlType="submit"
                          >
                            Save
                          </Button>
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={24}>
                      <Col span={24}>
                        <Col span={8}>
                          <Form.Item
                            name="primaryMajor"
                            valuePropName="checked"
                          >
                            <Checkbox
                              disabled={!isEmpty(majorAndMinor) || disableForm}
                            >
                              Primary Major
                            </Checkbox>
                          </Form.Item>
                        </Col>
                        {!isEmpty(majorAndMinor) ? (
                          <div className="widgetContainer">
                            <TableWrapper
                              dataSource={majorAndMinor}
                              columns={majorMinorColumn}
                              pagination={false}
                              rowKey={(_obj, index) => `${index}_key`}
                              size="small"
                            />
                          </div>
                        ) : null}
                      </Col>
                    </Row>
                  </>
                ) : (
                  <Row>
                    <Col span={4}></Col>
                    <Col span={4}>
                      <Form.Item>
                        <Button
                          type="primary"
                          className="saveButton"
                          style={{ marginTop: 10, width: 350, marginLeft: 100 }}
                          onClick={() => setShowHideMajorMinor(true)}
                          disabled={isEmpty(actsAndSections) || disableForm}
                        >
                          Click to Enter Major and Minor Classifications
                        </Button>
                      </Form.Item>
                    </Col>
                  </Row>
                )}
              </Form>
            </Card>
            <Form form={form} layout="vertical">
              <Card className="card-style">
                <Row gutter={24}>
                  <Col span={8}>
                    <Form.Item
                      name="reasonForSectionAlteration"
                      label="Reason For Section Alteration"
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      {renderFieldsWithDropDown(
                        alterationReasons,
                        null,
                        handleSearch,
                        serchText,
                        222,
                        viewAlterationMemoDetails || disableForm
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      name="alterationDate"
                      label="Alteration Memo Date"
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <DatePicker
                        format={DATE_FORMAT}
                        placeholder="Select Date"
                        onChange={checkFields}
                        style={{ width: 222 }}
                        disabledDate={disableFutureDates}
                        disabled={viewAlterationMemoDetails || disableForm}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      name="courtName"
                      label="Court Name"
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      {renderFieldsWithDropDown(
                        courtNames,
                        null,
                        handleSearch,
                        serchText,
                        222,
                        viewAlterationMemoDetails || disableForm
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={24}>
                    <Form.Item
                      name="intimationToSuperior"
                      valuePropName="checked"
                    >
                      <Checkbox
                        disabled={viewAlterationMemoDetails || disableForm}
                      >
                        Intimation To Superior Officer
                      </Checkbox>
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
              <Card className="card-style">
                <Row gutter={24}>
                  <Col span={12} style={{ fontSize: 16, fontWeight: "bold" }}>
                    Dispatch to Court
                  </Col>
                </Row>
                <Row gutter={24} style={{ marginTop: 10 }}>
                  <Col span={8}>
                    <Form.Item
                      name="dateOfRequest"
                      label="Date of Request to Court for Transfer of Original Record"
                    >
                      <DatePicker
                        format={DATE_FORMAT}
                        placeholder="Select Date"
                        onChange={checkFields}
                        style={{ width: 222 }}
                        disabled={viewAlterationMemoDetails || disableForm}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8} style={{ marginTop: 25 }}>
                    <Form.Item name="fromCourtName" label="From Court Name">
                      {renderFieldsWithDropDown(
                        courtNames,
                        null,
                        handleSearch,
                        serchText,
                        222,
                        viewAlterationMemoDetails || disableForm
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={8} style={{ marginTop: 25 }}>
                    <Form.Item
                      name="transferredCourtName"
                      label="Transferred to Court Name"
                    >
                      {renderFieldsWithDropDown(
                        courtNames,
                        null,
                        handleSearch,
                        serchText,
                        222,
                        viewAlterationMemoDetails || disableForm
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={8} style={{ marginTop: 25 }}>
                    <Form.Item name="dateOfTransfer" label="Date of Transfer">
                      <DatePicker
                        format={DATE_FORMAT}
                        placeholder="Select Date"
                        onChange={checkFields}
                        style={{ width: 222 }}
                        disabled={viewAlterationMemoDetails || disableForm}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </Form>
          </Card>
          <Card
            style={{ width: "30%" }}
            className="right-section cardRightStyle"
          >
            <DisplayReportGenerations
              templateLists={alterationMemoTemplates}
              showModal={showModal}
              disabled={
                !editAlterationMemoObj?._id ||
                viewAlterationMemoDetails ||
                disableForm
              }
              selectedRecord={selectedRecord}
              selectedModule="AlterationMemo"
              accusedId={editAlterationMemoObj?._id}
            />
            {!isEmpty(alterationMemoList?.alteration) ? (
              <Button
                style={{ marginTop: "40px", width: "90%" }}
                onClick={() => setrecordsIsModalVisible(true)}
              >
                {alterationMemoList?.alteration &&
                alterationMemoList.alteration.length > 0
                  ? alterationMemoList.alteration.length
                  : 0}{" "}
                Alteration Memo Records
              </Button>
            ) : null}
            <Modal
              title="Alteration Memo Records"
              visible={recordsIsModalVisible}
              onOk={() => setrecordsIsModalVisible(false)}
              onCancel={() => setrecordsIsModalVisible(false)}
              style={{ minWidth: "95vw" }}
              footer={null}
            >
              <div style={{ maxHeight: 650, overflowY: "auto" }}>
                <SavedRecords
                  dataSource={getSavedData()}
                  editDetails={handleEditAlterationMemoDetails}
                  setViewDetails={setViewAlterationMemoDetails}
                  selectedRecord={editAlterationMemoObj}
                  recordVisible={setrecordsIsModalVisible}
                  confirmDetails={confirmAlterationSubmit}
                />
              </div>
            </Modal>
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
        </Row>
      )}
      {isModalVisible && (
        <TemplatesModal
          reportData={reportData}
          selectedTemplateName={selectedTemplateName}
          selectedFileName={selectedFileName}
          getHTMLFromTemplate={getHTMLFromTemplate}
          handleCancel={handleCancel}
          isModalVisible={isModalVisible}
        />
      )}
    </ModuleWrapper>
  );
}
