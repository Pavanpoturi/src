/* eslint-disable array-callback-return */
import { useState, useEffect } from "react";
import { isUndefined } from "lodash";
import moment from "moment";
import {
  Row,
  Col,
  Form,
  DatePicker,
  Button,
  Input,
  Radio,
  Upload,
  Select,
} from "antd";
import {
  DATE_FORMAT,
  renderFieldsWithDropDown,
  dummyRequest,
  onFileChange,
} from "@containers/FirDetails/fir-util";
import AddPerson from "@containers/FirDetails/Investigation/CommonForms/AddPerson";
import { CameraFilled, CaretDownOutlined } from "@ant-design/icons";
import { ModuleWrapper } from "@containers/FirDetails/Investigation/CommonDetails/styles";
import { useSelector, useDispatch } from "react-redux";
import { config } from "@config/site.config";
import { loadState } from "@lib/helpers/localStorage";
import firActions from "@redux/fir/actions";
import { getFileById } from "@containers/media-util";
import { typeOfProperty } from "../const";

const Option = Select.Option;

export default function PropertyAttachments({
  form,
  viewClicked,
  editProclamationAttachments,
  setSelectedPerson,
  age,
  setAge,
  setInputList,
}) {
  const crimeId = loadState("selectedFirId");
  const dispatch = useDispatch();
  const { savedFir } = useSelector((state) => state.createFIR);
  const [serchText, setSerchText] = useState("");
  const [personForm] = Form.useForm();
  const selectedCourtAndProsecution = loadState("selectedCourtAndProsecution");
  const [reportOfAttachement, setReportOfAttachement] = useState([]);
  const [formValid, setFormValid] = useState(false);
  const [CaseSplit, setCaseSplit] = useState(false);
  const { panchWitnessList } = useSelector((state) => state.FIR);
  const [pwList, setPwList] = useState([]);
  const { fetchPanchWitnessList } = firActions;
  const disableForm = savedFir?.caseStatus === "Disposal" || selectedCourtAndProsecution.isCourtDisposal;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectPanchWitness, setSelectPanchWitness] = useState([]);

  useEffect(() => {
    dispatch(
      fetchPanchWitnessList(
        `${config.getPostCrimeSceneDetails}/PUNCHWITNESS/?crimeId=${crimeId}`
      )
    );
  }, [dispatch]);

  useEffect(() => {
    let panchList = [];
    panchWitnessList &&
      panchWitnessList.length &&
      panchWitnessList.forEach((pw) => {
        const { personalDetails } = !isUndefined(pw.person) && pw.person;
        const label = `${personalDetails?.name} ${personalDetails?.surname || ""
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

  const handleSearch = (text) => {
    setSerchText(text);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const checkFields = async () => {
    const values = await form.validateFields();
    setFormValid(!Object.values(values).every((v) => v == null || v === ""));
  };

  const handleDownload = (file) => {
    getFileById(file?.fileId, file?.name, file?.url);
  };

  useEffect(() => {
    const values = editProclamationAttachments?.propertyAttachment;
    if (!!values && Object.keys(!!values ? values : {})?.length !== 0) {
      if (values?.mediaReport?.length !== 0) {
        setReportOfAttachement(values?.mediaReport);
      } else {
        setReportOfAttachement([]);
      }
      const panchWitnessLabelList = [];
      if (pwList) {
        pwList?.forEach((s) => {
          values?.panchWitness?.forEach((pw) => {
            if (s._id === pw?._id) {
              panchWitnessLabelList?.push(pw?._id);
            }
          });
        });
      }
      setCaseSplit(values?.whetherTheCaseIsSplitUp);
      form.setFieldsValue({
        panchWitnessId: values?.panchWitnessId?._id
          ? values?.panchWitnessId?._id
          : "",
        propertyAttachmentsIssuedDate: !!values?.propertyAttachmentsIssuedDate
          ? moment(new Date(values?.propertyAttachmentsIssuedDate))
          : "",
        typeOfPropertyAttachments: values.typeOfPropertyToAttached
          ? values.typeOfPropertyToAttached
          : "",
        valueofmoneybeingForfeited: values.valueofmoneybeingForfeited
          ? values.valueofmoneybeingForfeited
          : "",
        whetherTheCaseReferredToLPC: values.whetherTheCaseReferredToLPC
          ? values.whetherTheCaseReferredToLPC
          : "",
        whetherTheCaseIsSplitUp: values.whetherTheCaseIsSplitUp
          ? values.whetherTheCaseIsSplitUp
          : "",
        splitUp: values?.splitUp ? values?.splitUp : "",
        mediaReport: values?.mediaReport ? values?.mediaReport : "",
      });
    }
  }, [editProclamationAttachments]);

  const handleOk = async () => {
    const values = await personForm.validateFields();
    setSelectedPerson(values);
    setIsModalVisible(false);
    form.setFieldsValue({
      panchWitnessId:
        (values?.name ? values?.name : "") +
        " " +
        (values?.surname ? values?.surname : ""),
    });
  };

  const handleSelectPanchWitness = (data) => {
    setSelectPanchWitness(!!data ? data : "");
  };

  return (
    <ModuleWrapper>
      <Row gutter={24} style={{ marginTop: 10 }}>
        <Col span={8} style={{ marginBottom: 10 }}>
          <Form.Item
            name="propertyAttachmentsIssuedDate"
            label="Property Attachment Issued Date"
            rules={[
              {
                required: true,
                message: "Property Attachment Issued Date is required!",
              },
            ]}
          >
            <DatePicker
              format={DATE_FORMAT}
              disabled={disableForm || viewClicked}
              placeholder="Date"
              style={{ width: 250 }}
              onChange={checkFields}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="typeOfPropertyAttachments"
            label="Type of Property to attached"
          >
            {renderFieldsWithDropDown(
              typeOfProperty,
              null,
              handleSearch,
              serchText,
              250,
              disableForm || viewClicked,
              "",
              "Money/Property"
            )}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="valueofmoneybeingForfeited"
            label="Value of money being Forfeited"
          >
            <Input
              onChange={checkFields}
              style={{ width: 250 }}
              disabled={disableForm || viewClicked}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="panchWitnessId" label="Panch Witness">
            <Select
              suffixIcon={<CaretDownOutlined className="dropDownIcon" />}
              showSearch
              onSearch={handleSearch}
              filterOption={(input, option) =>
                serchText &&
                option.props.label.toLowerCase().indexOf(input.toLowerCase()) >=
                0
              }
              onChange={handleSelectPanchWitness}
              disabled={disableForm || viewClicked}
              style={{ width: 250 }}
              placeholder="Select Panch Witness"
            >
              {pwList.map((item, index) => (
                <Option key={index} value={item._id} label={item.label}>
                  {item.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          {!disableForm && !viewClicked ? (
            <div class="linkStyle"
              onClick={() => {
                if (selectPanchWitness.length === 0) {
                  setIsModalVisible(true);
                }
              }}
              style={{
                color: "#02599C",
                cursor: "pointer",
                fontSize: 16,
                marginTop: 3,
              }}
            >
              Add Person
            </div>
          ) : null}
        </Col>
        <Col span={8}>
          <Form.Item name="reportOfAttachement" label="">
            <Upload
              fileList={reportOfAttachement}
              customRequest={dummyRequest}
              onChange={(info) => onFileChange(info, setReportOfAttachement)}
              multiple={false}
              onPreview={handleDownload}
            >
              <Button
                className="saveButton"
                style={{ width: 255, marginTop: 20 }}
                icon={<CameraFilled style={{ float: "left" }} />}
                disabled={disableForm || viewClicked}
              >
                Report of Attachment to court
              </Button>
            </Upload>
          </Form.Item>
        </Col>
        <Col span={8} style={{ marginTop: 10 }}>
          <Form.Item
            name="whetherTheCaseReferredToLPC"
            label="Whether the case referred to LPC?"
          >
            <Radio.Group
              buttonStyle="solid"
              disabled={disableForm || viewClicked}
            >
              <Radio value="Yes">Yes</Radio>
              <Radio value="No">No</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
        <Col span={8} style={{ marginTop: 10 }}>
          <Form.Item
            name="whetherTheCaseIsSplitUp"
            label="Whether case is split up"
          >
            <Radio.Group
              buttonStyle="solid"
              disabled={disableForm || viewClicked}
              onChange={(e) => setCaseSplit(e.target.value)}
            >
              <Radio value="Yes">Yes</Radio>
              <Radio value="No">No</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
        {CaseSplit === "Yes" ? (
          <Col span={8} style={{ marginTop: 15 }}>
            <Form.Item name="splitUp" label="">
              <Input
                onChange={checkFields}
                style={{ width: 250 }}
                disabled={disableForm || viewClicked}
                placeholder="Split Up SC/CC No"
              />
            </Form.Item>
          </Col>
        ) : null}
      </Row>
      {isModalVisible ? (
        <AddPerson
          title="Add Person Details"
          isModalVisible={isModalVisible}
          handleOk={handleOk}
          handleCancel={handleCancel}
          formName={personForm}
          checkFields={checkFields}
          disabled={false}
          setInputList={setInputList}
          editObj={null}
          age={age}
          setAge={setAge}
        />
      ) : null}
    </ModuleWrapper>
  );
}
