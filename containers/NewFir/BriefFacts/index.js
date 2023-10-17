import { Row, Col, Form, DatePicker, Input, Radio, Button } from "antd";
import { useState, useEffect, useRef } from "react";
import { textFieldRules } from "@components/Common/formOptions";
import { config } from "@config/site.config";
import { SaveOutlined } from "@ant-design/icons";
import { isNull, isEmpty, isUndefined, first, isArray } from "lodash";
import {
  DATE_TIME_FORMAT,
  DATE_FORMAT_MM,
  renderFieldsWithDropDown,
} from "@containers/FirDetails/fir-util";
import masterDataActions from "@redux/masterData/actions";
import createFIRActions from "@redux/createFir/actions";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { loadState } from "@lib/helpers/localStorage";
import { briefFactPayloadData } from "../createFIRPayload";
import { BriefFactstForm, actionTaken, BriefFactstFormOne } from "./const";
import { FirDetailsModuleWrapper } from "../styles";

const { TextArea } = Input;

export default function BriefFacts({
  briefFactsForm,
  disable,
  firType,
  isConsumed,
}) {
  const currentUser = loadState("currentUser");
  const formRef = useRef(null);
  const dispatch = useDispatch();
  const [serchText, setSerchText] = useState("");
  const [actionTakenText, setActionTakenText] = useState("");
  const [courtsFromPSListState, setcourtsFromPSListState] = useState([]);
  const [formValid, setFormValid] = useState(false);
  const { addBriefFacts } = createFIRActions;
  const { savedFir } = useSelector((state) => state.createFIR);
  const { getStaffList, getCourtsBasedonPsCode } = masterDataActions;
  const { staffList, courtsFromPSList } = useSelector(
    (state) => state.MasterData
  );

  const getSupportingStaff = () => {
    dispatch(
      getStaffList(
        `${config.getSupportStaffFromHrms}?policestationcode=${currentUser?.cctns_unit_id}`
      )
    );
  };
  useEffect(() => {
    getSupportingStaff();
    dispatch(
      getCourtsBasedonPsCode(
        `${config.masterData}/getCourtsBasedonPsCode?psCode=${currentUser?.cctns_unit_id}`
      )
    );
  }, []);

  useEffect(() => {
    let n1 = [];
    courtsFromPSList &&
      isArray(courtsFromPSList) &&
      courtsFromPSList.forEach((ele) => {
        if (ele.court) {
          n1.push(ele);
        }
      });
    if (n1.length > 0) {
      setcourtsFromPSListState(n1);
    }
  }, [courtsFromPSList]);

  const staffListData = staffList.map((item) => {
    const container = {
      label: item?.employeeName,
      name: item?.paoCode,
      ioAssigned: item?.paoCode,
      ioAssignedName: item?.employeeName,
      ioAssignedRank: item?.rankName,
      ioAssignedMobile: item?.mobileNo,
    };
    return container;
  });

  const handleSearch = (text) => {
    setSerchText(text);
  };

  useEffect(() => {
    if (!isEmpty(savedFir) && !isUndefined(savedFir)) {
      const firDetail = savedFir?.firDetail;
      const briefFacts =
        !isUndefined(firDetail?.briefFacts) && firDetail?.briefFacts;
      setActionTakenText(briefFacts?.actionTaken);
      briefFactsForm.setFieldsValue({
        factsOfComplainant: briefFacts?.factsOfComplainant,
        Action_Taken: briefFacts?.actionTaken,
        reason: briefFacts?.refusedReason,
        Investigation_Assigned_to: briefFacts?.ioAssignedName,
        isSecret: briefFacts?.isSecret,
        Court_Name: briefFacts?.courtName,
        Date_of_dispatch_to_court:
          !isEmpty(briefFacts?.dateOfCourtDispatch) &&
          moment(briefFacts?.dateOfCourtDispatch).isValid()
            ? moment(briefFacts?.dateOfCourtDispatch)
            : "",
        FIR_issued_by: briefFacts?.firIssuedBy,
        FIR_entered_by: briefFacts?.firEnteredBy,
      });
    } else {
      briefFactsForm.resetFields();
    }
  }, [savedFir]);

  const checkFields = async () => {
    const values = await briefFactsForm.validateFields();
    setFormValid(!Object.values(values).every((v) => v == null || v === ""));
  };

  const displayBriefFactsFields = (name) => {
    switch (name) {
      case "Date_of_dispatch_to_court":
        return (
          <DatePicker
            showTime
            format={DATE_TIME_FORMAT}
            placeholder="Select Date"
            onChange={checkFields}
            style={{ width: 250 }}
            disabled={disable}
          />
        );
      case "Court_Name":
        return renderFieldsWithDropDown(
          courtsFromPSListState.map(({ court }) => ({ label: court })),
          null,
          handleSearch,
          serchText,
          250,
          disable
        );
      case "FIR_issued_by":
        return renderFieldsWithDropDown(
          staffListData,
          null,
          handleSearch,
          serchText,
          250,
          disable
        );
      case "FIR_entered_by":
        return renderFieldsWithDropDown(
          staffListData,
          null,
          handleSearch,
          serchText,
          250,
          disable
        );
      default:
        return (
          <Input
            onChange={checkFields}
            style={{ width: 250 }}
            maxLength={textFieldRules.maxLength}
            disabled={disable}
          />
        );
    }
  };

  const displayBriefFactsState = (data, actionName, spanIndex, width) => {
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
                    required:
                      s.name !== "Date_of_dispatch_to_court" ? true : false,
                    message: `Please Enter ${s.label}!`,
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

  const onSelectActionTaken = (value) => {
    setActionTakenText(value);
    if (value === "Self Investigation") {
      briefFactsForm.setFieldsValue({
        Investigation_Assigned_to: currentUser.employee_name,
      });
    }
  };

  const submitBriefFacts = async () => {
    const values = await briefFactsForm.validateFields();
    const briefFactsData = briefFactPayloadData(values);
    const ioDetails =
      !isEmpty(invetigateAssigned) &&
      first(
        invetigateAssigned.filter(
          (s) => s.ioAssignedName === briefFactsData?.ioAssigned
        )
      );
    const brifFactsPayload = {
      factsOfComplainant: briefFactsData?.factsOfComplainant,
      actionTaken: briefFactsData?.actionTaken,
      refusedReason: briefFactsData?.refusedReason,
      ioAssigned: ioDetails?.ioAssigned,
      ioAssignedName: ioDetails?.ioAssignedName,
      ioAssignedRank: ioDetails?.ioAssignedRank,
      ioAssignedMobile: ioDetails?.ioAssignedMobile,
      isSecret: briefFactsData?.isSecret,
      courtName: briefFactsData?.courtName,
      dateOfCourtDispatch: briefFactsData?.dateOfCourtDispatch,
      firIssuedBy: briefFactsData?.firIssuedBy,
      firEnteredBy: briefFactsData?.firEnteredBy,
    };
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
        crimeType: firDetail?.crimeType,
        crimeSubType: firDetail?.crimeSubType,
        petitionNo: firDetail?.petitionNo,
        gravity: firDetail?.gravity,
        actsAndSections: firDetail?.actsAndSections,
        majorMinorClassification: firDetail?.majorMinorClassification,
        occurenceOfOffence: firDetail?.occurenceOfOffence,
        placeOfOccurence: firDetail?.placeOfOccurence,
        briefFacts: brifFactsPayload,
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
    dispatch(addBriefFacts(config.updateFIR, payload));
  };

  const selfAssignedIO = [
    {
      label: currentUser?.employee_name,
      name: currentUser?.pao_code,
      ioAssigned: currentUser?.pao_code,
      ioAssignedName: currentUser?.employee_name,
      ioAssignedRank: currentUser?.rank_name,
      ioAssignedMobile: currentUser?.mobileNo,
    },
  ];
  const invetigateAssigned =
    actionTakenText === "Self Investigation" ? selfAssignedIO : staffListData;
  const disableAssignedTo =
    actionTakenText === "" || actionTakenText === "Self Investigation";

  return (
    <FirDetailsModuleWrapper>
      <Form form={briefFactsForm} ref={formRef} layout="vertical">
        <Row>
          <Col span={4}></Col>
          <Col span={18}>
            <Form.Item
              name="factsOfComplainant"
              label="Brief Facts of Complaint"
              rules={[
                {
                  required: true,
                  message: "Please Enter Brief Facts of Complaint!",
                },
              ]}
            >
              <TextArea rows={10} disabled={disable} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24} style={{ marginTop: 20 }}>
          <Col span={4} />
          <Col span={6}>
            <Form.Item
              name="Action_Taken"
              label="Action Taken"
              rules={[
                {
                  required: true,
                  message: "Please Enter Action Taken!",
                },
              ]}
            >
              {renderFieldsWithDropDown(
                actionTaken,
                onSelectActionTaken,
                handleSearch,
                serchText,
                250,
                disable
              )}
            </Form.Item>
          </Col>
          <Col span={6}>
            {actionTakenText === "Refused" ? (
              <Form.Item name="reason" label="Reason">
                <Input
                  placeholder="Reason"
                  style={{ width: 300 }}
                  disabled={disable}
                />
              </Form.Item>
            ) : null}
            {actionTakenText !== "Refused" ? (
              <Form.Item
                name="Investigation_Assigned_to"
                label="Investigation Assigned To"
                rules={[
                  {
                    required: true,
                    message: "Please Enter Investigation Assigned To!",
                  },
                ]}
              >
                {renderFieldsWithDropDown(
                  invetigateAssigned,
                  null,
                  handleSearch,
                  serchText,
                  250,
                  disableAssignedTo || disable
                )}
              </Form.Item>
            ) : null}
          </Col>
        </Row>
        <Row gutter={24} style={{ marginTop: 20 }}>
          <Col span={4} />
          <Col span={6}>
            <div style={{ fontSize: 16 }}>
              Do you want to keep the FIR Secret/Invisible?
            </div>
            <Form.Item name="isSecret">
              <Radio.Group disabled={disable}>
                <Radio value={true}>Yes</Radio>
                <Radio value={false}>No</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          {displayBriefFactsState(
            BriefFactstFormOne,
            displayBriefFactsFields,
            6,
            250
          )}
        </Row>
        <Row gutter={24} style={{ marginTop: 10 }}>
          <Col span={4} />
          {displayBriefFactsState(
            BriefFactstForm,
            displayBriefFactsFields,
            6,
            250
          )}
        </Row>
        {!disable ? (
          <Button
            disabled={disable}
            className="saveButton"
            icon={<SaveOutlined className="saveButtonIcon" />}
            style={{ marginTop: 28, marginLeft: 20 }}
            onClick={submitBriefFacts}
          >
            Save
          </Button>
        ) : null}
      </Form>
    </FirDetailsModuleWrapper>
  );
}
