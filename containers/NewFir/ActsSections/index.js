import {
  Row,
  Card,
  Col,
  Form,
  Button,
  Input,
  Checkbox,
  Select,
  Divider,
  message,
  Modal,
} from "antd";
import { FirDetailsModuleWrapper } from "../styles";
import { useState, useEffect } from "react";
import { actsInitialForm, ActsAndSection, majorMinor } from "./const";
import { gravityList } from "@containers/const";
import createFIRActions from "@redux/createFir/actions";
import { isArray, isEmpty, first, isUndefined } from "lodash";
import TableWrapper from "@containers/Tables/AntTables/AntTables.styles";
import {
  CaretDownOutlined,
  PlusOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { config } from "@config/site.config";
import {
  DATE_FORMAT_MM,
  renderFieldsWithDropDown,
  renderFieldsWithMultipleDropDown,
} from "@containers/FirDetails/fir-util";

const Option = Select.Option;

export default function ActsSections({
  actsForm,
  actsAndArtsForm,
  majorMinorForm,
  firType,
  currentUser,
  actsAndSections,
  setActsAndSections,
  actsAndSectionsPayload,
  majorAndMinor,
  setMajorAndMinor,
  disable,
  isConsumed,
}) {
  const dispatch = useDispatch();
  const { savedFir, filteredMajorHeadList } = useSelector(
    (state) => state.createFIR
  );
  const [serchText, setSerchText] = useState("");
  const [formValid, setFormValid] = useState(false);
  const [selectedCrimeType, setSelectedCrimeType] = useState("");
  const [selectedMajorHead, setSelectedMajorHead] = useState("");
  const [selectedAct, setSelectedAct] = useState("");
  const [showHideMajorMinor, setShowHideMajorMinor] = useState(false);
  const [isError, setIsError] = useState(false);
  const { createFIR, getDefaultMajorHead, addActsSections } = createFIRActions;
  const [acts, setActs] = useState([]);
  const [sections, setSections] = useState([]);
  const [showSectionDescription, setShowSectionDescription] = useState(false);
  const [selectedSectionListWithDes, setSelectedSectionListWithDes] = useState([]);

  const isMajorAdded =
    !isEmpty(actsAndSections) &&
    actsAndSections.filter((s) => s.majorHead !== "");

  const { majorHeadList, minorHeadList, actList, sectionList, FIRMasterData } =
    useSelector((state) => state.MasterData);

  const handleSearch = (text) => {
    setSerchText(text);
  };

  const checkFields = async () => {
    const values = await actsForm.validateFields();
    setFormValid(!Object.values(values).every((v) => v == null || v === ""));
  };

  const filterDropdownValues = (entity) =>
    !isEmpty(FIRMasterData) && FIRMasterData.filter((s) => s.entity === entity);

  const getDropdownList = (data) => {
    let arr = [];
    !isEmpty(data) &&
      data.map((item) => {
        const result = {
          label: item?.entity_value,
          name: item?.entity,
        };
        arr.push(result);
      });
    return arr;
  };

  const displayColumn = (name) => {
    switch (name) {
      case "Crime_type":
        return renderFieldsWithDropDown(
          getDropdownList(filterDropdownValues("crimeType")),
          setSelectedCrimeType,
          handleSearch,
          serchText,
          222,
          disable
        );
      case "Crime_sub_type":
        return renderFieldsWithDropDown(
          getDropdownList(filterDropdownValues("crimeSubType")),
          null,
          handleSearch,
          serchText,
          222,
          disable
        );
      case "Gravity":
        return renderFieldsWithDropDown(
          gravityList,
          null,
          handleSearch,
          serchText,
          222,
          disable
        );
      default:
        return (
          <Input
            onChange={checkFields}
            style={{ width: 222 }}
            disabled={disable}
          />
        );
    }
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

  const selectedActDetails =
    !isEmpty(actListData) &&
    first(actListData.filter((s) => s.label === selectedAct));

  const filteredSectionList =
    selectedActDetails &&
    !isEmpty(sectionListData) &&
    sectionListData.filter((s) => s.ACT_SEC_CD === selectedActDetails?.name);

  const onActChange = (val) => {
    setSelectedAct(val);
    checkFields();
    actsAndArtsForm.setFieldsValue({
      Section: []
    });
  };
  const onSectionSelect = (val) => {
    const tempArr = filteredSectionList.filter(section => val.indexOf(section.label) >=0);
    setSelectedSectionListWithDes(tempArr);
  }

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

  useEffect(() => {
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

  const displayActsAndSectionFields = (name) => {
    switch (name) {
      case "Act":
        return renderActsFieldsWithDropDown(
          actListData,
          onActChange,
          handleSearch,
          serchText,
          200,
          disable
        );
      case "Section":
        return renderFieldsWithMultipleDropDown(
          filteredSectionList,
          onSectionSelect,
          handleSearch,
          serchText,
          200,
          disable
        );
      case "Major":
        return renderFieldsWithDropDownMajorMinor(
          majorHeadList,
          onMajorHeadChange,
          handleSearch,
          serchText,
          200,
          disable
        );
      case "Minor":
        return renderFieldsWithDropDownMajorMinor(
          // As of now adding from frontend need to change this from api 
          isArray(filteredMinorHeadList) && !filteredMinorHeadList.some((item) => { return item.label === "Others" })
            ? [...filteredMinorHeadList, { "label": "Others" }]
            : filteredMinorHeadList,
          null,
          handleSearch,
          serchText,
          200,
          disable
        );
      default:
        return (
          <Input
            onChange={checkFields}
            style={{ width: 200 }}
            disabled={disable}
          />
        );
    }
  };

  const displayActsSectionState = (data, actionName, spanIndex, width) => {
    return (
      <>
        {data.map((s, i) => {
          return (
            <Col span={spanIndex} key={i} style={{ marginBottom: 20 }}>
              <Form.Item
                name={s.name}
                label={s.label}
                style={{ width: width }}
                rules={[
                  {
                    required: true,
                    message: `${s.label} is required.`,
                  },
                ]}
              >
                {actionName(s.name)}
              </Form.Item>
            </Col>
          );
        })}
      </>
    );
  };

  const displayActsSectionInitialState = (
    data,
    actionName,
    spanIndex,
    width
  ) => {
    return (
      <>
        {data.map((s, i) => {
          return (
            <Col span={spanIndex} key={i} style={{ marginBottom: 20 }}>
              <Form.Item
                name={s.name}
                label={s.label}
                style={{ width: width }}
                rules={[
                  {
                    required: s.name !== "Petition_number" ? true : false,
                    message: `${s.label} is required.`,
                  },
                ]}
              >
                {actionName(s.name)}
              </Form.Item>
            </Col>
          );
        })}
      </>
    );
  };

  const removeActs = (item) => {
    const newArr = actsAndSections.filter((x) => x !== item);
    setActsAndSections(newArr);
    if (isEmpty(newArr)) {
      setShowHideMajorMinor(false);
    }
  };

  const removeMajor = (item) => {
    const newArr = majorAndMinor.filter((x) => x !== item);
    setMajorAndMinor(newArr);
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
          disabled={disable}
          className="stepsButtonInActive"
          onClick={() => !disable && removeActs(item)}
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
        } else if (!isEmpty(isMajorAdded) && isUndefined(item?.primaryMajor)) {
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
          disabled={disable}
          className="stepsButtonInActive"
          onClick={() => !disable && removeMajor(item)}
        >
          Delete
        </Button>
      ),
    },
  ];

  useEffect(() => {
    if (isEmpty(actsAndSections)) {
      setShowHideMajorMinor(false);
    }
    if (!isEmpty(majorAndMinor)) {
      setShowHideMajorMinor(true);
    }
    if (!isEmpty(savedFir) && !isUndefined(savedFir)) {
      const firDetail = savedFir?.firDetail;
      let RWRequired = "";
      const resultTemp = firDetail?.actsAndSections.reduce(
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
            (item, index) => acc[actDescription].section.indexOf(item) === index
          );
          return acc;
        },
        {}
      );
      let resp = Object.values(resultTemp);
      setActsAndSections(resp);
      setSelectedCrimeType(firDetail?.crimeType);
      setMajorAndMinor(firDetail?.majorMinorClassification);
      actsForm.setFieldsValue({
        Crime_type: firDetail?.crimeType,
        Crime_sub_type: firDetail?.crimeSubType,
        Petition_number: firDetail?.petitionNo,
        Gravity: firDetail?.gravity,
      });
    } else {
      setActsAndSections([]);
      setMajorAndMinor([]);
      actsForm.resetFields();
    }
  }, [savedFir]);

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

  const addedSections = (i) =>
    !isEmpty(actsAndSections) && actsAndSections[i]?.section;

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
          first(filteredSectionList.filter((s) => s.label === values.Section))
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
      const actsAndSectionsData = {
        actDescription: values?.Act,
        section: array,
        sectionDescription:
          !isEmpty(filteredSectionList) &&
          first(filteredSectionList.filter((s) => s.label === values.Section))
            ?.sectionDescription,
        rwRequired: values?.RWrequired,
      };
      setActsAndSections((actsAndSections) => [
        ...actsAndSections,
        actsAndSectionsData,
      ]);
      actsAndArtsForm.resetFields();

      for (let i = 0; i <= actsAndSections.length; i++) {
        if (values.Act === actsAndSections[i]?.actDescription) {
          var add = (actsAndSections, key, val) => {
            const isSectionsExists = addedSections(i).some(
              (r) => array.indexOf(r) >= 0
            );
            actsAndSections[i].section = [
              ...new Set(actsAndSections[i].section.concat(val)),
            ];
            setActsAndSections(actsAndSections);
            if (isSectionsExists) {
              message.warning("These Acts & Section has already been Added");
            }
            actsAndArtsForm.resetFields();
          };
          actsAndArtsForm.resetFields();
          add(actsAndSections, values.Act, actsAndSectionsData.section);
        }
        actsAndArtsForm.resetFields();
      }
    }
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
      setIsError(false);
    }
    majorMinorForm.resetFields();
  };

  //new fir submit
  const saveActsAndSection = async () => {
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
    if (isEmpty(majorAndMinor)) {
      setIsError(true);
    } else {
      setIsError(false);
      const values = await actsForm.validateFields();
      const payload = {
        firType: firType,
        isDraft: true,
        firDetail: {
          crimeType: values.Crime_type,
          crimeSubType: values.Crime_sub_type,
          petitionNo: values.Petition_number,
          gravity: values.Gravity,
          actsAndSections: resp,
          majorMinorClassification: majorAndMinor,
          district: currentUser?.working_head_unit_name
            ? currentUser?.working_head_unit_name
            : currentUser?.posting_head_unit_name
              ? currentUser?.posting_head_unit_name
              : "",
          districtCode: "",
          firStatus: "New",
          psCode: currentUser?.cctns_unit_id,
          psName: currentUser?.unit_name,
          dateOfReport: moment().format(DATE_FORMAT_MM),
        },
        preCrime: {
          patrolCarsBlueColts: false,
          toolkit: false,
        },
        accusedDetails: [],
        victimDetails: [],
        complainantDetails: [],
      };
      dispatch(createFIR(config.generateNewFIR, payload));
    }
  };

  //draft submit
  const submitActsSections = async () => {
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
    checkFields();
    if (isEmpty(actsAndSections)) {
      await actsAndArtsForm.validateFields();
    }
    if (isEmpty(majorAndMinor)) {
      setIsError(true);
    } else {
      setIsError(false);
      const values = await actsForm.validateFields();
      const firDetail = savedFir?.firDetail;
      const payload = {
        crimeId: savedFir?._id,
        preCrimeId: savedFir?.preCrime?._id,
        crimeSceneId: savedFir?.crimeScene,
        planOfActionId: savedFir?.planOfAction,
        crimeLocationId: savedFir?.crimeLocationId,
        firType: firType,
        isDraft: !isUndefined(isConsumed) ? true : savedFir?.isDraft,
        firDetail: {
          crimeType: values.Crime_type,
          crimeSubType: values.Crime_sub_type,
          petitionNo: values.Petition_number,
          gravity: values.Gravity,
          actsAndSections: resp,
          majorMinorClassification: majorAndMinor,
          occurenceOfOffence: firDetail?.occurenceOfOffence,
          placeOfOccurence: firDetail?.placeOfOccurence,
          briefFacts: firDetail?.briefFacts,
          uploadDocuments: firDetail?.uploadDocuments,
          crimeShownBy: !isEmpty(savedFir?.complainantDetails)
            ? first(savedFir?.complainantDetails).person?.personalDetails?.name
            : "",
          firNum: firDetail?.firNum,
          district: firDetail?.district,
          districtCode: firDetail?.districtCode,
          firStatus: firDetail?.firStatus,
          psCode: firDetail?.psCode,
          psName: firDetail?.psName,
          dateOfReport: firDetail?.dateOfReport,
          firRegnum: firDetail?.firRegnum,
          lastmodifieddate: moment().format(DATE_FORMAT_MM),
          isRelatedToLicense: firDetail?.isRelatedToLicense,
          isSentToCourt: firDetail?.isSentToCourt,
          sentToCourtAt: firDetail?.sentToCourtAt,
          licenseNo: firDetail?.licenseNo,
          isPropertyStolen: firDetail?.isPropertyStolen,
        },
        preCrime: {
          patrolCarsBlueColts: false,
          toolkit: false,
        },
        accusedDetails: savedFir?.accusedDetails,
        victimDetails: savedFir?.victimDetails,
        complainantDetails: savedFir?.complainantDetails,
        stolenProperties: savedFir?.stolenProperties,
      };
      dispatch(addActsSections(config.updateFIR, payload));
    }
  };

  const displayMajorMinorError = () => (
    <div
      style={{ marginTop: 10, marginLeft: 5, color: "#FF4D4F", fontSize: 14 }}
    >
      Please Enter Major and Minor Classifications
    </div>
  );

  return (
    <FirDetailsModuleWrapper>
      <Modal
        title="Do you want to add Section ?"
        visible={showSectionDescription}
        okButtonProps={{ form: actsAndArtsForm, htmlType: 'submit' }}
        onOk={() => { setShowSectionDescription(false) }}
        onCancel={() => { setShowSectionDescription(false) }}
        okText="Yes"
        cancelText="No"
      >
        {selectedSectionListWithDes.map((section) => {
          const knownErrors = ["na", "NA", "Na", "N/A", "NO SECTION", "--Nill--", "undefined"];
          const result =
            isUndefined(section.sectionDescription) || knownErrors.indexOf(section.sectionDescription) != -1
              ? `Section ${section?.label}`
              : `Section ${section?.label} : ${section?.sectionDescription}`;
          return <p>{result}</p>;
        })}
      </Modal>

      <Form form={actsForm} layout="vertical">
        <Row gutter={24}>
          {displayActsSectionInitialState(actsInitialForm, displayColumn, 6)}
        </Row>
      </Form>
      <Card className="card-style">
        <Row gutter={24}>
          <Col span={12}>
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
              <Row gutter={24}>
                {displayActsSectionState(
                  ActsAndSection,
                  displayActsAndSectionFields,
                  8,
                  200
                )}
                <Col>
                  <Form.Item>
                    <Button
                      type="primary"
                      className="submitButton"
                      style={{ marginTop: 35 }}
                      disabled={disable}
                      icon={<PlusOutlined className="saveButtonIcon" />}
                      onClick={() => {
                        if (!isEmpty(actsAndArtsForm.getFieldValue("Section"))) {
                          setShowSectionDescription(true)
                        }
                      }}
                    >
                      Add
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24} style={{ marginBottom: 10 }}>
                <Col span={24}>
                  <Form.Item name="RWrequired" valuePropName="checked">
                    <Checkbox disabled={disable}>R/W required</Checkbox>
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
          </Col>
          <Col span={12}>
            <Form
              form={majorMinorForm}
              layout="vertical"
              onFinish={submitMajor}
            >
              {showHideMajorMinor === true || !isEmpty(majorAndMinor) ? (
                <>
                  <Row gutter={24}>
                    <Col span={12} style={{ fontSize: 16, fontWeight: "bold" }}>
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
                          className="submitButton"
                          style={{ marginTop: 35 }}
                          disabled={!isEmpty(majorAndMinor)}
                          icon={<PlusOutlined className="saveButtonIcon" />}
                          htmlType="submit"
                        >
                          Add
                        </Button>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col span={24}>
                      <Col span={10}>
                        <Form.Item name="primaryMajor" valuePropName="checked">
                          <Checkbox
                            disabled={!isEmpty(majorAndMinor) || disable}
                          >
                            Primary Major
                          </Checkbox>
                        </Form.Item>
                        {isError && displayMajorMinorError()}
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
                <Form.Item>
                  <Button
                    type="primary"
                    className="submitButton"
                    style={{ marginTop: 60 }}
                    onClick={() => setShowHideMajorMinor(true)}
                    disabled={isEmpty(actsAndSections) || disable}
                  >
                    Click to Enter Major and Minor Classifications
                  </Button>
                  {isError && displayMajorMinorError()}
                </Form.Item>
              )}
            </Form>
          </Col>
        </Row>
        {!disable && !isEmpty(savedFir) ? (
          <Button
            disabled={disable}
            className="saveButton"
            style={{ marginTop: 5 }}
            icon={<SaveOutlined className="saveButtonIcon" />}
            onClick={submitActsSections}
          >
            Save
          </Button>
        ) : null}
      </Card>
      {isEmpty(savedFir) ? (
        <>
          <Divider />
          <Row gutter={24}>
            <Col span={24}>
              <Button
                type="primary"
                className="submitButton"
                style={{ float: "right" }}
                onClick={saveActsAndSection}
                disabled={disable || isEmpty(actsAndSections)}
              >
                Click to Proceed
              </Button>
            </Col>
          </Row>
        </>
      ) : null}
    </FirDetailsModuleWrapper>
  );
}
