import { useState, useEffect } from "react";
import {
  Form,
  Input,
  Row,
  Col,
  Select,
  DatePicker,
  Upload,
  Button,
  Modal,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { isArray, isEmpty, isUndefined } from "lodash";
import masterDataActions from "@redux/masterData/actions";
import { CaretDownOutlined, CameraOutlined } from "@ant-design/icons";
import { config } from "@config/site.config";
import { materialObjectForm, textFieldRules } from "./formOptions";
import { setRules, disableFutureDates } from "./helperMethods";
import { textAreaRules } from "@components/Common/formOptions";
import {
  dummyRequest,
  onFileChange,
  renderFieldsWithDropDown,
  renderFieldsWithMultipleDropDownPanchWitness,
  masterDataType,
  DATE_TIME_FORMAT,
} from "@containers/FirDetails/fir-util";
import { getFileById } from "@containers/media-util";
import StandardSceneOfOffenceForm from "./standardSceneOfOffenceForm";
import { seizedFromList } from "../../containers/const";
import { getEvidenceListData } from "../../containers/FirDetails/Investigation/CollectionOfEvidence/const";

const { TextArea } = Input;
const Option = Select.Option;

const styles = {
  widgetPageStyle: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    overflow: "hidden",
    height: 40,
  },
};

const {
  getMaterialTypeList,
  getMaterialSubTypeList,
  getStaffList,
  getEvidenceCollectionList,
} = masterDataActions;

const optionType = {
  MATERIAL_OBJECT_TYPE: "MATERIAL_OBJECT_TYPE",
  MATERIAL_OBJECT_SUBTYPE: "MATERIAL_OBJECT_SUBTYPE",
  STAFF: "STAFF",
};

export default function StandardMaterialObjectForm({
  changeValue,
  disabled = false,
  addAddress,
  setSelectedSiderMenu,
  address,
  fileList = [],
  actionName,
  disableUpload = false,
  staffListData,
  validationFields,
}) {
  const [addressform] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showModify, setshowModify] = useState(false);
  const [showAdd, setshowAdd] = useState(true);
  const [pwList, setPwList] = useState([]);
  const [crimeLocationList, setCrimeLocationList] = useState([]);
  const [pos, setPos] = useState("");
  const [selectedMaterialObjectType, setSelectedMaterialObjectType] =
    useState("");

  const dispatch = useDispatch();
  const { materialTypeList, materialSubTypeList, evidenceCollectionList } =
    useSelector((state) => state.MasterData);
  const { panchWitnessList, crimeLocation, selectedCrimeSceneDate } =
    useSelector((state) => state.FIR);
  const filteredMaterialSubType =
    selectedMaterialObjectType &&
    !isEmpty(materialSubTypeList) &&
    materialSubTypeList.filter((s) => s.type === selectedMaterialObjectType);

  useEffect(() => {
    getMasterDataList();
  }, []);

  const showModal = () => {
    if (pos) {
      handlePlaceofSeizure(pos);
    }
    setIsModalVisible(true);
  };

  const onMaterialObjectTypeChange = (val) => {
    setSelectedMaterialObjectType(val);
    changeValue();
  };

  const AddAddress = () => {
    addressform.resetFields();
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    const values = await addressform.validateFields();
    if (!address?._id) {
      let crimeLocationList = [];
      crimeLocation &&
        crimeLocation.length &&
        crimeLocation.forEach((cl) => {
          crimeLocationList.push({
            _id: cl.address?._id,
            label: cl.address?.address1 + "," + cl.address?.address2,
          });
        });
      crimeLocationList.push({
        _id: "",
        label: values?.address1 + "," + values.address2,
      });
      setCrimeLocationList(crimeLocationList);
      setshowAdd(false);
    } else {
      values._id = address?._id;
      setshowAdd(true);
    }
    addAddress(values);
    setshowModify(true);
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSearch = (text) => {
    setSearchText(text);
  };

  useEffect(() => {
    let panchList = [];
    panchWitnessList &&
      panchWitnessList.length &&
      panchWitnessList.forEach((pw) => {
        const { personalDetails } = !isUndefined(pw.person) && pw.person;
        const label = `${personalDetails?.name} ${
          personalDetails?.surname || ""
        }`;
        const createdFrom = personalDetails?.createdFrom
          ? `(${personalDetails?.createdFrom})`
          : "";
        panchList.push({
          _id: pw.person?._id,
          label: label + createdFrom,
        });
      });
    setPwList(panchList);
  }, [panchWitnessList]);

  const getMasterDataList = () => {
    dispatch(
      getEvidenceCollectionList(
        `${config.getMasterData}/${masterDataType.EVIDENCE_COLLECTION}`
      )
    );
  };

  const getDropdownValues = (entity) => {
    return (
      !isEmpty(evidenceCollectionList) &&
      evidenceCollectionList.filter((s) => s.entity === entity)
    );
  };

  const strengthOfEvidence = getEvidenceListData(
    getDropdownValues("strengthOfEvidence")
  );

  useEffect(() => {
    let crimeLocationList = [];
    crimeLocation &&
      crimeLocation.length &&
      crimeLocation.forEach((cl) => {
        crimeLocationList.push({
          _id: cl.address?._id,
          label: cl.address?.address1 + "," + cl.address?.address2,
          userDate: cl.userDate,
        });
      });
    if (
      !isUndefined(selectedCrimeSceneDate) &&
      !isEmpty(selectedCrimeSceneDate)
    ) {
      let list =
        crimeLocationList &&
        crimeLocationList?.filter((x) => x.userDate === selectedCrimeSceneDate);
      setCrimeLocationList(list);
    } else {
      setCrimeLocationList(crimeLocationList);
    }
  }, [crimeLocation, selectedCrimeSceneDate]);

  useEffect(() => {
    dispatch(
      getMaterialTypeList(
        `${config.getMasterData}/${optionType.MATERIAL_OBJECT_TYPE}`
      )
    );
    dispatch(
      getMaterialSubTypeList(
        `${config.getMasterData}/${optionType.MATERIAL_OBJECT_SUBTYPE}`
      )
    );
    dispatch(getStaffList(`${config.getMasterData}/${optionType.STAFF}`));
  }, [dispatch]);

  const handlePlaceofSeizure = (val) => {
    setPos(val);
    crimeLocationList.forEach((item) => {
      if (item.label === val) {
        if (
          crimeLocation?.filter((x) => x.address._id === item._id).length > 0
        ) {
          addAddress(
            crimeLocation?.filter((x) => x.address._id === item._id)[0].address
          );
          if (
            crimeLocation?.filter((x) => x.address._id === item._id)[0]
              .sceneRecreated
          ) {
            setshowModify(true);
            addressform.setFieldsValue({
              address1: crimeLocation?.filter(
                (x) => x.address._id === item._id
              )[0].address?.address1,
              address2: crimeLocation?.filter(
                (x) => x.address._id === item._id
              )[0].address?.address2,
              city: crimeLocation?.filter((x) => x.address._id === item._id)[0]
                .address?.city,
              landmark: crimeLocation?.filter(
                (x) => x.address._id === item._id
              )[0].address?.landmark,
              district: crimeLocation?.filter(
                (x) => x.address._id === item._id
              )[0].address?.district,
              pincode: crimeLocation?.filter(
                (x) => x.address._id === item._id
              )[0].address?.pincode,
              description: crimeLocation?.filter(
                (x) => x.address._id === item._id
              )[0].address?.description,
              _id: crimeLocation?.filter((x) => x.address._id === item._id)[0]
                .address?._id,
            });
          } else {
            setshowModify(false);
          }
        } else {
          setAddressData();
          setshowModify(true);
        }
      }
    });
    changeValue();
  };

  const setAddressData = async () => {
    const values = await addressform.validateFields();
    addAddress(values);
  };

  const renderCustomFieldsWithDropDown = (menuOptions, showarrow = true) => {
    return (
      <Select
        suffixIcon={<CaretDownOutlined className="dropDownIcon" />}
        showSearch
        onSearch={handleSearch}
        filterOption={(input, option) =>
          searchText &&
          option.props.label
            .toString()
            .toLowerCase()
            .indexOf(input.toString().toLowerCase()) >= 0
        }
        onSelect={changeValue}
        style={{ width: 200 }}
        showArrow={showarrow}
        disabled={disabled}
      >
        {isArray(menuOptions) &&
          menuOptions &&
          menuOptions.length &&
          menuOptions.map((item, index) => (
            <Option key={index} value={item.label} label={item.label}>
              {item.label}
            </Option>
          ))}
      </Select>
    );
  };

  const renderPlaceOfSeizureDropDown = (menuOptions, showarrow = true) => {
    return (
      <Select
        suffixIcon={<CaretDownOutlined className="dropDownIcon" />}
        showSearch
        onSearch={handleSearch}
        filterOption={(input, option) =>
          searchText &&
          option.props.label
            .toString()
            .toLowerCase()
            .indexOf(input.toString().toLowerCase()) >= 0
        }
        onSelect={(val) => handlePlaceofSeizure(val)}
        style={{ width: 200 }}
        showArrow={showarrow}
        disabled={disabled}
      >
        {isArray(menuOptions) &&
          menuOptions &&
          menuOptions.length &&
          menuOptions.map((item, index) => (
            <Option key={index} value={item.label} label={item.label}>
              {item.label}
            </Option>
          ))}
      </Select>
    );
  };

  const renderSeizedFieldsWithDropDown = (menuOptions, showarrow = true) => {
    return (
      <Select
        suffixIcon={<CaretDownOutlined className="dropDownIcon" />}
        showSearch
        onSearch={handleSearch}
        filterOption={(input, option) =>
          searchText &&
          option.props.label
            .toString()
            .toLowerCase()
            .indexOf(input.toString().toLowerCase()) >= 0
        }
        onSelect={changeValue}
        style={{ width: 200 }}
        showArrow={showarrow}
        disabled={disabled}
      >
        {isArray(menuOptions) &&
          menuOptions &&
          menuOptions.length &&
          menuOptions.map((item, index) => (
            <Option key={index} value={item.name} label={item.label}>
              {item.label}
            </Option>
          ))}
      </Select>
    );
  };

  const displayFormItems = (name) => {
    switch (name) {
      case "seizedFrom":
        return renderCustomFieldsWithDropDown(seizedFromList);
      case "strengthOfEvidence":
        return renderFieldsWithDropDown(
          strengthOfEvidence,
          null,
          handleSearch,
          searchText,
          200,
          disabled,
          ""
        );
      case "seizedDate":
        return (
          <DatePicker
            style={{ width: 200 }}
            showTime
            onSelect={changeValue}
            format={DATE_TIME_FORMAT}
            disabled={disabled}
            disabledDate={disableFutureDates}
            placeholder={"Select Date and Time"}
          />
        );
      case "type":
        return renderFieldsWithDropDown(
          materialTypeList,
          onMaterialObjectTypeChange,
          handleSearch,
          searchText,
          200,
          disabled,
          ""
        );
      case "subType":
        return renderFieldsWithDropDown(
          filteredMaterialSubType,
          null,
          handleSearch,
          searchText,
          200,
          disabled,
          ""
        );
      case "seizedBy":
        return renderFieldsWithDropDown(
          staffListData,
          null,
          handleSearch,
          searchText,
          200,
          disabled,
          ""
        );
      case "placeofseizure":
        return renderPlaceOfSeizureDropDown(
          crimeLocationList,
          true,
          "placeofseizure"
        );
      case "panchWitness":
        return renderFieldsWithMultipleDropDownPanchWitness(
          pwList,
          null,
          handleSearch,
          searchText,
          200,
          disabled
        );
      case "description":
        return (
          <TextArea
            rows={4}
            columns={3}
            onChange={changeValue}
            maxLength={textAreaRules.maxLength}
            style={{ width: 750 }}
            disabled={disabled}
          />
        );
      default:
        return (
          <Input
            style={{ width: 200 }}
            onChange={changeValue}
            maxLength={textFieldRules.maxLength}
            disabled={disabled}
          />
        );
    }
  };

  const handleDownload = (file) => {
    getFileById(file?.fileId, file?.name, file?.url);
  };

  return (
    <Row gutter={24} style={{ height: 440 }}>
      {materialObjectForm.map((s, i) => {
        const isLabel =
          isArray(validationFields) && validationFields.indexOf(s.label) >= 0
            ? true
            : false;
        return (
          <Col key={i}>
            <Form.Item
              name={s.name}
              label={s.label}
              rules={[...setRules(s.type), { required: isLabel }]}
            >
              {displayFormItems(s.name)}
            </Form.Item>
            {s.label === "Material Object Sub-Type" && !disabled && (
              <span className="popupLink resetLink">
                Enter MO Detail Description
              </span>
            )}
            {s.label === "Select Panch Witness" && !disabled && (
              <span
                className="popupLink resetLink"
                onClick={() => setSelectedSiderMenu("panchWitness")}
              >
                Panch Witness
              </span>
            )}
            {s.label === "Place of Seizure" && !disabled && (
              <div style={styles.widgetPageStyle}>
                {showAdd && (
                  <div>
                    <span className="popupLink resetLink" onClick={AddAddress}>
                      Add Address
                    </span>
                  </div>
                )}
                {showModify && (
                  <div>
                    <span className="popupLink resetLink" onClick={showModal}>
                      Modify Address
                    </span>
                  </div>
                )}
              </div>
            )}
          </Col>
        );
      })}
      {/* <Col>
        <Form.Item name="seizureReport">
          <Upload
            fileList={fileList}
            customRequest={dummyRequest}
            onChange={(info) => onFileChange(info, actionName)}
            onPreview={handleDownload}
            multiple={false}
          >
            <Button
              className="saveButton"
              style={{ marginTop: 20, width: 220 }}
              icon={<CameraOutlined className="saveButtonIcon" />}
              disabled={disableUpload || disabled}
            >
              Upload Seizure Report
            </Button>
          </Upload>
        </Form.Item>
      </Col> */}
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
              <StandardSceneOfOffenceForm
                colWidth={24}
                changeValue={changeValue}
              />
              <Form.Item
                name="description"
                label="Brief Description of Place of Seizure"
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
    </Row>
  );
}
