import { useState, useEffect } from "react";
import { Form, Input, Row, Col } from "antd";
import { crimeClassificationForm, textFieldRules } from "./formOptions";
import { renderFieldsWithDropDown } from "@containers/FirDetails/fir-util";
import { setRules } from "@components/Common/helperMethods";
import masterDataActions from "@redux/masterData/actions";
import { useDispatch, useSelector } from "react-redux";
import { config } from "@config/site.config";

const optionType = {
  GENDER: "GENDER",
};

export default function StandardCrimeClassificationForm({
  colWidth,
  changeValue,
  disabled,
  deformitiesList,
  complexionList,
  eyeColorList,
  hairColorList,
  bodyTypeList,
  beardList,
  teethList,
  mustachesList,
  molesList,
  tattosMarkList,
  whetherDeadBodyList,
  getDeformitiesTypeList,
  onDeformitiesTypeChange,
}) {
  const [serchText, setSerchText] = useState("");
  const dispatch = useDispatch();
  const { getGendersList } = masterDataActions;
  const { gendersList } = useSelector((state) => state.MasterData);

  const handleSearch = (text) => {
    setSerchText(text);
  };

  useEffect(() => {
    dispatch(getGendersList(`${config.getMasterData}/${optionType.GENDER}`));
  }, [dispatch]);

  const displayFormItems = (name) => {
    switch (name) {
      case "complexion":
        return renderFieldsWithDropDown(
          complexionList,
          null,
          handleSearch,
          serchText,
          300,
          disabled
        );
      case "eyeColor":
        return renderFieldsWithDropDown(
          eyeColorList,
          null,
          handleSearch,
          serchText,
          300,
          disabled
        );
      case "hairColor":
        return renderFieldsWithDropDown(
          hairColorList,
          null,
          handleSearch,
          serchText,
          300,
          disabled
        );
      case "bodyBuiltType":
        return renderFieldsWithDropDown(
          bodyTypeList,
          null,
          handleSearch,
          serchText,
          300,
          disabled
        );
      case "tattooMarks":
        return renderFieldsWithDropDown(
          tattosMarkList,
          null,
          handleSearch,
          serchText,
          300,
          disabled
        );
      case "teeth":
        return renderFieldsWithDropDown(
          teethList,
          null,
          handleSearch,
          serchText,
          300,
          disabled
        );
      case "beard":
        return renderFieldsWithDropDown(
          beardList,
          null,
          handleSearch,
          serchText,
          300,
          disabled
        );
      case "mustache":
        return renderFieldsWithDropDown(
          mustachesList,
          null,
          handleSearch,
          serchText,
          300,
          disabled
        );
      case "moles":
        return renderFieldsWithDropDown(
          molesList,
          null,
          handleSearch,
          serchText,
          300,
          disabled
        );
      case "killSpotBrought":
        return renderFieldsWithDropDown(
          whetherDeadBodyList,
          null,
          handleSearch,
          serchText,
          300,
          disabled
        );

      case "deformitiesType":
        return renderFieldsWithDropDown(
          getDeformitiesTypeList,
          onDeformitiesTypeChange,
          handleSearch,
          serchText,
          300,
          disabled
        );
      case "deformities":
        return renderFieldsWithDropDown(
          deformitiesList,
          null,
          handleSearch,
          serchText,
          300,
          disabled
        );
      case "gender":
        return renderFieldsWithDropDown(
          gendersList,
          null,
          handleSearch,
          serchText,
          300,
          disabled
        );
      case "height":
        return (
          <Input
            onChange={changeValue}
            type="number"
            disabled={disabled}
            style={{ width: 300 }}
          />
        );
      case "approxAge":
        return (
          <Input
            onChange={changeValue}
            type="number"
            disabled={disabled}
            style={{ width: 300 }}
          />
        );
      default:
        return (
          <Input
            onChange={changeValue}
            maxLength={textFieldRules.maxLength}
            disabled={disabled}
            style={{ width: 300 }}
          />
        );
    }
  };

  return (
    <div>
      <Row gutter={24}>
        {crimeClassificationForm.map((s, i) => {
          return (
            <Col span={colWidth} key={i} style={{ marginBottom: 10 }}>
              <Form.Item name={s.name} label={s.label} rules={setRules(s.type)}>
                {displayFormItems(s.name)}
              </Form.Item>
            </Col>
          );
        })}
      </Row>
    </div>
  );
}
