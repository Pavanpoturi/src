import { Row, Col, Form, Button, Input, Modal, Radio, Divider } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import { first, isEmpty, isUndefined, isNull } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import createFIRActions from "@redux/createFir/actions";
import { DATE_FORMAT_MM } from "@containers/FirDetails/fir-util";
import { config } from "@config/site.config";
import moment from "moment";
import { FirDetailsModuleWrapper } from "../styles";
import { useState, useEffect } from "react";
import StolenModal from "./StolenModal";
import crimeSceneActions from "@redux/investigations/crimeScene/actions";

export default function PropertyDetails({
  crimeId,
  propertyForm,
  disable,
  firType,
  isConsumed,
}) {
  const dispatch = useDispatch();
  const [show, setShow] = useState("");
  const [showLiecenseVisible, setShowLiecenseVisible] = useState(false);
  const [LiecenseText, setLiecenseText] = useState("");
  const [isStolenVisible, setIsStolenVisible] = useState(false);
  const [payloadList, setPayloadList] = useState([]);
  const { savedFir } = useSelector((state) => state.createFIR);
  const { addPropertyDetails } = createFIRActions;
  const [particularOfPropertyState, setparticularOfPropertyState] =
    useState("");
  const [totalEstimatedValueRsState, settotalEstimatedValueRsState] =
    useState("");
  useEffect(() => {
    if (!isEmpty(savedFir) && !isUndefined(savedFir)) {
      const firDetail = savedFir?.firDetail;
      setShowLiecenseVisible(firDetail?.isRelatedToLicense);
      setShow(firDetail?.isPropertyStolen);
      if (!isNull(savedFir?.stolenProperties)) {
        setPayloadList(savedFir?.stolenProperties);
        setparticularOfPropertyState(
          savedFir?.stolenProperties[0]
            ? savedFir?.stolenProperties[0]?.particularOfProperty
            : ""
        );
      } else {
        setPayloadList([]);
      }
      setLiecenseText(firDetail?.licenseNo);
      propertyForm.setFieldsValue({
        isRelatedToLicense: firDetail?.isRelatedToLicense,
        licenseNo: firDetail?.licenseNo,
        isPropertyStolen: firDetail?.isPropertyStolen,
      });
    } else {
      propertyForm.resetFields();
    }
  }, [savedFir]);

  const getCommonPayload = (propertyPayload) => {
    const firDetail = savedFir?.firDetail;
    setLiecenseText(propertyPayload?.licenseNo);
    const payload = {
      crimeId: savedFir?._id,
      preCrimeId: savedFir?.preCrime?._id,
      crimeSceneId: savedFir?.crimeScene,
      planOfActionId: savedFir?.planOfAction,
      crimeLocationId: savedFir?.crimeLocationId,
      firType: firType,
      isDraft: !isUndefined(isConsumed) ? true : savedFir?.isDraft,
      firDetail: {
        crimeType: firDetail?.crimeType,
        crimeSubType: firDetail?.crimeSubType,
        petitionNo: firDetail?.petitionNo,
        gravity: firDetail?.gravity,
        actsAndSections: firDetail?.actsAndSections,
        majorMinorClassification: firDetail?.majorMinorClassification,
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
        isRelatedToLicense: propertyPayload?.isRelatedToLicense,
        licenseNo: propertyPayload?.licenseNo,
        isPropertyStolen: propertyPayload?.isPropertyStolen,
      },
      preCrime: {
        patrolCarsBlueColts: false,
        toolkit: false,
      },
      accusedDetails: savedFir?.accusedDetails,
      victimDetails: savedFir?.victimDetails,
      complainantDetails: savedFir?.complainantDetails,
      stolenProperties: propertyPayload?.stolenProperties,
    };
    return payload;
  };

  const onFinish = (values) => {
    //setting same particularOfProperty value for all stolen records to show in print fir
    if (payloadList && payloadList.length > 0) {
      payloadList.forEach((ele) => {
        ele.particularOfProperty = particularOfPropertyState;
        ele.totalEstimatedValue = parseFloat(totalEstimatedValueRsState);
      });
    }
    const propertyPayload = {
      isRelatedToLicense: values.isRelatedToLicense,
      licenseNo: values.licenseNo,
      isPropertyStolen: values.isPropertyStolen,
      stolenProperties: payloadList,
    };
    const payload = getCommonPayload(propertyPayload);
    dispatch(addPropertyDetails(config.updateFIR, payload));
  };

  const showPropertyLink = (e) => {
    const value = e.target.value;
    setShow(value);
  };

  const showLiecense = (e) => {
    const value = e.target.value;
    setShowLiecenseVisible(value);
  };

  const openStolenModal = () => {
    setIsStolenVisible(true);
  };

  const stolenHandleOk = () => {
    setIsStolenVisible(false);
  };

  const stolenHandleCancel = () => {
    setIsStolenVisible(false);
    dispatch(crimeSceneActions.resetVehicleData());
  };

  const stolenModal = () => {
    return (
      <Modal
        title="Stolen Property"
        visible={isStolenVisible}
        onOk={stolenHandleOk}
        onCancel={stolenHandleCancel}
        width={1300}
        footer={null}
      >
        <StolenModal
          crimeId={crimeId}
          isStolenVisible={isStolenVisible}
          setIsStolenVisible={setIsStolenVisible}
          stolenHandleCancel={stolenHandleCancel}
          disable={disable}
          payloadList={payloadList}
          setPayloadList={setPayloadList}
          particularOfPropertyState={particularOfPropertyState}
          setparticularOfPropertyState={setparticularOfPropertyState}
          settotalEstimatedValueRsState={settotalEstimatedValueRsState}
        />
      </Modal>
    );
  };

  return (
    <FirDetailsModuleWrapper>
      <Form form={propertyForm} onFinish={onFinish}>
        <Row>
          <Col span={6}>
            <span style={{ fontSize: 16 }}>
              Is Case related to any License Number?
            </span>
          </Col>
          <Col span={6}>
            <Form.Item name="isRelatedToLicense">
              <Radio.Group onChange={(e) => showLiecense(e)} disabled={disable}>
                {" "}
                <Radio value={true}>Yes</Radio>
                <Radio value={false}>No</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          {showLiecenseVisible ? (
            <Col span={6}>
              <Form.Item
                name="licenseNo"
                onChange={(e) => setLiecenseText(e.target.value)}
              >
                <Input placeholder="Enter Licence No" disabled={disable} />
              </Form.Item>
            </Col>
          ) : null}
        </Row>
        <Row>
          <Col span={6}>
            <span style={{ fontSize: 16 }}>Is Property Stolen/Involved?</span>
          </Col>
          <Col span={5}>
            <Form.Item name="isPropertyStolen">
              <Radio.Group
                onChange={(e) => showPropertyLink(e)}
                disabled={disable}
              >
                {" "}
                <Radio value="Yes">Yes</Radio>
                <Radio value="No">No</Radio>
                <Radio value="Not Known">Not Known</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={4}>
            {show === "Yes" ? (
              <span
                type="primary"
                className="popupLink resetLink"
                onClick={openStolenModal}
              >
                Stolen Property
              </span>
            ) : null}
            {stolenModal()}
          </Col>
        </Row>
        <Divider />
        {!disable ? (
          <Form.Item>
            <Button
              type="primary"
              className="submitButton"
              icon={<SaveOutlined className="saveButtonIcon" />}
              htmlType="submit"
              disabled={disable}
            >
              Save
            </Button>
          </Form.Item>
        ) : null}
      </Form>
    </FirDetailsModuleWrapper>
  );
}
