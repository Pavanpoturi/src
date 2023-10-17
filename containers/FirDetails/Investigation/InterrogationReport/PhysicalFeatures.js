/* eslint-disable array-callback-return */
import { useState, useEffect } from "react";
import { Row, Card, Col, Form, Input, Divider, Button } from "antd";
import {
  renderFieldsWithDropDown,
  renderFieldsWithMultipleDropDown,
  tattosMarkList,
} from "@containers/FirDetails/fir-util";
import { textFieldRules } from "@components/Common/formOptions";
import { SaveOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { config } from "@config/site.config";
import { loadState } from "@lib/helpers/localStorage";
import masterDataActions from "@redux/masterData/actions";
import { isUndefined, isEmpty } from "lodash";
import {
  physicalFeaturesForm,
  genderList,
  heightNameList,
  faceNameList,
  noseNameList,
  burnMarksList,
  earsList,
} from "./const";

export default function PhysicalFeatures({
  disabled,
  selectedAccused,
  selectedObjId,
  selectedRecord,
  disableForm,
  addDetails,
  updateDetails,
  getDeformitiesTypeList,
}) {
  const dispatch = useDispatch();
  const crimeId = loadState("selectedFirId");
  const [physicalFeatureForm] = Form.useForm();
  const [formValid, setFormValid] = useState(false);
  const [deformitiesType, setDeformitiesType] = useState("");
  const [serchText, setSerchText] = useState("");
  const {
    getMolesList,
    getLanguagesList,
    getComplexionList,
    getEyeColorList,
    getHairColorList,
    getBodyTypeList,
    getTeethList,
    getMustachesList,
    getDeformitiesList,
    getBeardList,
  } = masterDataActions;
  const {
    bodyTypeList,
    hairColorList,
    eyeColorList,
    molesList,
    languagesList,
    complexionList,
    teethList,
    mustachesList,
    beardList,
    deformitiesList,
  } = useSelector((state) => state.MasterData);

  const optionType = {
    CRIME_CLASSIFICATION: "CRIME_CLASSIFICATION",
    MAJOR_HEAD: "MAJOR_HEAD",
    MINOR_HEAD: "MINOR_HEAD",
    ROAD_ACCIDENT: "ROAD_ACCIDENT",
    BODY_TYPE: "BODY_TYPE",
    BEARD: "BEARD",
    HAIR_COLOR: "HAIR_COLOR",
    EYE_COLOR: "EYE_COLOR",
    COMPLEXION: "COMPLEXION",
    DEFORMITIES: "DEFORMITIES",
    MOLES: "MOLES",
    MUSTACHES: "MUSTACHES",
    TEETH: "TEETH",
    GENDER: "GENDER",
    OCCUPATION: "OCCUPATION",
    LANGUAGE: "LANGUAGE",
  };

  useEffect(() => {
    const url = config.getMasterData;
    dispatch(getMolesList(`${url}/${optionType.MOLES}`));
    dispatch(getLanguagesList(`${url}/${optionType.LANGUAGE}`));
    dispatch(getComplexionList(`${url}/${optionType.COMPLEXION}`));
    dispatch(getEyeColorList(`${url}/${optionType.EYE_COLOR}`));
    dispatch(getHairColorList(`${url}/${optionType.HAIR_COLOR}`));
    dispatch(getBodyTypeList(`${url}/${optionType.BODY_TYPE}`));
    dispatch(getTeethList(`${url}/${optionType.TEETH}`));
    dispatch(getBeardList(`${url}/${optionType.BEARD}`));
    dispatch(getMustachesList(`${url}/${optionType.MUSTACHES}`));
    dispatch(getDeformitiesList(`${url}/${optionType.DEFORMITIES}`));
  }, []);

  const handleSearch = (text) => {
    setSerchText(text);
  };

  const checkFields = async () => {
    const values = await physicalFeatureForm.validateFields();
    setFormValid(!Object.values(values).every((v) => v == null || v === ""));
  };

  const displayState = (data, actionName) => {
    return (
      <Row gutter={24}>
        {data.map((s, i) => {
          return (
            <Col span={8} key={i} style={{ marginBottom: 20 }}>
              <Form.Item
                name={s.name}
                label={s.label}
                rules={[{ required: true }]}
              >
                {actionName(s.name)}
              </Form.Item>
            </Col>
          );
        })}
      </Row>
    );
  };

  const onDeformitiesTypeChange = (val) => {
    setDeformitiesType(val);
    checkFields();
  };

  const getDeformitiesDropdownList = () => {
    let arr = [];
    const list =
      !isEmpty(deformitiesList) &&
      deformitiesList.filter((s) => s.type === deformitiesType);
    list &&
      list.map((item) => {
        const result = {
          label: item?.sub_type,
          _id: item?._id,
          type: item?.type,
        };
        arr.push(result);
      });
    return arr;
  };

  const displayFields = (name) => {
    switch (name) {
      case "gender":
        return renderFieldsWithDropDown(
          genderList,
          null,
          handleSearch,
          serchText,
          300,
          disableForm
        );
      case "build":
        return renderFieldsWithDropDown(
          bodyTypeList,
          null,
          handleSearch,
          serchText,
          300,
          disableForm
        );
      case "burnMarks":
        return renderFieldsWithDropDown(
          burnMarksList,
          null,
          handleSearch,
          serchText,
          300,
          disableForm
        );
      case "scar":
        return renderFieldsWithDropDown(
          burnMarksList,
          null,
          handleSearch,
          serchText,
          300,
          disableForm
        );
      case "ear":
        return renderFieldsWithDropDown(
          earsList,
          null,
          handleSearch,
          serchText,
          300,
          disableForm
        );
      case "height":
        return renderFieldsWithDropDown(
          heightNameList,
          null,
          handleSearch,
          serchText,
          300,
          disableForm
        );
      case "eyes":
        return renderFieldsWithDropDown(
          eyeColorList,
          null,
          handleSearch,
          serchText,
          300,
          disableForm
        );
      case "hair":
        return renderFieldsWithDropDown(
          hairColorList,
          null,
          handleSearch,
          serchText,
          300,
          disableForm
        );
      case "face":
        return renderFieldsWithDropDown(
          faceNameList,
          null,
          handleSearch,
          serchText,
          300,
          disableForm
        );
      case "color":
        return renderFieldsWithDropDown(
          complexionList,
          null,
          handleSearch,
          serchText,
          300,
          disableForm
        );
      case "teeth":
        return renderFieldsWithDropDown(
          teethList,
          null,
          handleSearch,
          serchText,
          300,
          disableForm
        );
      case "nose":
        return renderFieldsWithDropDown(
          noseNameList,
          null,
          handleSearch,
          serchText,
          300,
          disableForm
        );
      case "beard":
        return renderFieldsWithDropDown(
          beardList,
          null,
          handleSearch,
          serchText,
          300,
          disableForm
        );
      case "mustache":
        return renderFieldsWithDropDown(
          mustachesList,
          null,
          handleSearch,
          serchText,
          300,
          disableForm
        );
      case "mole":
        return renderFieldsWithDropDown(
          molesList,
          null,
          handleSearch,
          serchText,
          300,
          disableForm
        );
      case "tattoo":
        return renderFieldsWithDropDown(
          tattosMarkList,
          null,
          handleSearch,
          serchText,
          300,
          disableForm
        );
      case "deformitiesOrPeculiarities":
        return renderFieldsWithDropDown(
          getDeformitiesTypeList(),
          onDeformitiesTypeChange,
          handleSearch,
          serchText,
          300,
          disableForm
        );
      case "deformities":
        return renderFieldsWithDropDown(
          getDeformitiesDropdownList(),
          null,
          handleSearch,
          serchText,
          300,
          isUndefined(deformitiesType) || disableForm
        );
      case "languageOrDialect":
        return renderFieldsWithMultipleDropDown(
          languagesList,
          null,
          handleSearch,
          serchText,
          300,
          disableForm
        );
      default:
        return (
          <Input
            onChange={checkFields}
            style={{ width: 300 }}
            maxLength={textFieldRules.maxLength}
            disabled={disableForm}
          />
        );
    }
  };

  const getFormFields = (values) => {
    const result = {
      gender: values?.gender,
      build: values?.build,
      height: values?.height,
      eyes: values?.eyes,
      hair: values?.hair,
      face: values?.face,
      color: values?.color,
      teeth: values?.teeth,
      nose: values?.nose,
      beard: values?.beard,
      mustache: values?.mustache,
      ear: values?.ear,
      identificationMarks: values?.identificationMarks,
      deformitiesOrPeculiarities: values?.deformitiesOrPeculiarities,
      deformities: values?.deformities,
      languageOrDialect: values?.languageOrDialect,
      burnMarks: values?.burnMarks,
      leucodema: values?.leucodema,
      mole: values?.mole,
      scar: values?.scar,
      tattoo: values?.tattoo,
      otherBodyFeatures: values?.otherBodyFeatures,
    };
    return result;
  };

  useEffect(() => {
    if (selectedObjId) {
      physicalFeatureForm.setFieldsValue({ ...getFormFields(selectedRecord) });
    } else {
      physicalFeatureForm.resetFields();
    }
  }, [selectedObjId, selectedRecord]);

  const submit = async () => {
    const values = await physicalFeatureForm.validateFields();
    const addPayload = {
      crimeId: crimeId,
      person: selectedAccused,
      physicalFeatures: getFormFields(values),
    };

    const updatePayload = {
      _id: selectedObjId,
      crimeId: crimeId,
      person: selectedAccused,
      physicalFeatures: getFormFields(values),
    };

    if (selectedObjId) {
      dispatch(updateDetails(config.interrogation, updatePayload));
    } else {
      dispatch(addDetails(config.interrogation, addPayload));
    }
  };

  return (
    <Card style={{ width: "100%" }} className="cardLeftStyle">
      <Form form={physicalFeatureForm} layout="vertical">
        {displayState(physicalFeaturesForm, displayFields)}
        {deformitiesType !== "None" ? (
          <Form.Item name="deformities" label="Deformities">
            {displayFields("deformities")}
          </Form.Item>
        ) : null}
        <Divider />
        <Form.Item>
          <Button
            type="primary"
            className="saveButton"
            size="large"
            icon={<SaveOutlined className="saveButtonIcon" />}
            onClick={submit}
            disabled={disabled || disableForm}
          >
            SAVE
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
