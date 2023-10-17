import { useState, useEffect } from "react";
import EffortsForTracingHeader from "./EffortsForTracingHeader";
import { config } from "@config/site.config";
import { Row, Card, Col, Form, notification, Collapse } from "antd";
import { masterDataType } from "@containers/FirDetails/fir-util";
import { DoubleRightOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { EffortForTracingModuleWrapper } from "./styles";
import masterDataActions from "@redux/masterData/actions";
import effortsForTracingActions from "@redux/investigations/effortsForTracing/actions";
import { loadState } from "@lib/helpers/localStorage";
import Loader from "@components/utility/loader";
import LookoutNotice from "./LookoutNotice";
import PrintAndElectronicMedia from "./PrintAndElectronicMedia";
import FacialRecognition from "./FacialRecognition";
import PassportDetails from "./PassportDetails";
import OutOfCountryTravel from "./OutOfCountryTravel";
import FriendsAndRelatives from "./FriendsAndRelatives";
import MOCriminalConvictChecking from "./MOCriminalConvictChecking";
import TeamSentOutOfStation from "./TeamSentOutOfStation";
import VerificationOfHotspots from "./VerificationOfHotspots";
import RewardsDeclared from "./RewardsDeclared";
import { getAuditHistoryPayload } from "@containers/const";
import auditHistoryActions from "@redux/auditHistory/actions";

const { Panel } = Collapse;

export default function ReassignmentOfCase({ setSelectedSiderMenu }) {
  const [form] = Form.useForm();
  const crimeId = loadState("selectedFirId");
  const currentUser = loadState("currentUser");
  const [selectedIndex, setSelectedIndex] = useState("");
  const { createAuditHistory } = auditHistoryActions;
  const { getCourtsBasedonPsCode, getEffortForTracingList, getUnitsList } =
    masterDataActions;
  const dispatch = useDispatch();

  const { getEffortsForTracingList, resetActionType } =
    effortsForTracingActions;

  const [serchText, setSerchText] = useState("");
  const handleSearch = (text) => {
    setSerchText(text);
  };

  const submit = async () => {
    form.resetFields();
    setSelectedSiderMenu("investigation");
  };

  const { isFetching } = useSelector((state) => state.EffortsForTracing);

  const openNotificationWithIcon = (type, message) => {
    return notification[type]({
      message: message,
    });
  };

  const fetchEffortsForTracingList = () => {
    dispatch(
      getEffortsForTracingList(
        `${config.getPostCrimeSceneDetails}/EFFORTS_TRACING/?crimeId=${crimeId}`
      )
    );
  };

  useEffect(() => {
    const url = config.getMasterData;
    dispatch(
      getCourtsBasedonPsCode(
        `${config.masterData}/getCourtsBasedonPsCode?psCode=${currentUser?.cctns_unit_id}`
      )
    );
    dispatch(
      getEffortForTracingList(`${url}/${masterDataType.EFFORTS_TRACING}`)
    );
    dispatch(getUnitsList(`${url}/${masterDataType.UNITS}`));
    fetchEffortsForTracingList();
  }, []);

  const { actionType, errorMessage, successMessage, effortsForTracingList } =
    useSelector((state) => state.EffortsForTracing);

  const isSuccess = actionType === "ADD_EFFORTS_FOR_TRACING_SUCCESS";
  const isError = actionType === "ADD_EFFORTS_FOR_TRACING_ERROR";

  const auditHistoryEntry = () => {
    const auditType =
      actionType === "ADD_EFFORTS_FOR_TRACING_SUCCESS"
        ? "Efforts For Tracing Created"
        : "Efforts For Tracing Updated";
    dispatch(
      createAuditHistory(
        config.createAudits,
        getAuditHistoryPayload(
          crimeId,
          "investigation/effortsForTracing",
          auditType
        )
      )
    );
  };

  useEffect(() => {
    if (isSuccess || isError) {
      if (
        successMessage === "Efforts of tracing updated successfully" ||
        successMessage === "Efforts of tracing added successfully"
      ) {
        openNotificationWithIcon("success", successMessage);
        auditHistoryEntry();
        dispatch(resetActionType());
        fetchEffortsForTracingList();
        setSelectedIndex("");
      } else if (errorMessage) {
        openNotificationWithIcon("error", errorMessage);
        dispatch(resetActionType());
        setSelectedIndex("");
      }
    }
  }, [actionType]);

  return (
    <EffortForTracingModuleWrapper>
      <EffortsForTracingHeader
        headerTitle="Efforts for Tracing"
        onSubmitClick={submit}
        isInvestigation={true}
        onCancel={() => setSelectedSiderMenu("investigation")}
      />
      {isFetching ? (
        <Loader />
      ) : (
        <Collapse
          accordion
          defaultActiveKey={["1"]}
          expandIconPosition={"right"}
          expandIcon={({ isActive }) => (
            <DoubleRightOutlined rotate={isActive ? 90 : 0} />
          )}
        >
          <Panel
            className="panelHeader"
            header={
              <div className="headerTextContainer">
                <div className="panelTitle">
                  Look Out Notices/Poster Sticked On
                </div>{" "}
              </div>
            }
            key="1"
          >
            <LookoutNotice
              handleSearch={handleSearch}
              serchText={serchText}
              openNotificationWithIcon={openNotificationWithIcon}
              savedRecords={effortsForTracingList?.lookoutNotices}
              selectedIndex={selectedIndex}
              setSelectedIndex={setSelectedIndex}
            />
          </Panel>

          <Panel
            style={{ padding: "3" }}
            className="panelHeader"
            header={
              <div className="headerTextContainer">
                {" "}
                <div className="panelTitle">Print and Electronic Media</div>
              </div>
            }
            key="2"
          >
            <PrintAndElectronicMedia
              handleSearch={handleSearch}
              serchText={serchText}
              openNotificationWithIcon={openNotificationWithIcon}
              savedRecords={effortsForTracingList?.printAndElectronicMedia}
              selectedIndex={selectedIndex}
              setSelectedIndex={setSelectedIndex}
            />
            <Row style={{ minHeight: "150px", marginTop: 20 }}>
              <Card style={{ width: "75%" }} className="cardLeftStyle">
                <Row style={{ marginBottom: 10, marginTop: 20 }}>
                  <Col span={6}>Fingerprints/Footprints</Col>
                  <Col
                    span={4}
                    className="link"
                    onClick={() => setSelectedSiderMenu("collectionOfEvidence")}
                  >
                    Scientific Evidence
                  </Col>
                </Row>
                <Row style={{ marginBottom: 10 }}>
                  <Col span={6}>CCTV Footage</Col>
                  <Col
                    span={4}
                    className="link"
                    onClick={() => setSelectedSiderMenu("collectionOfEvidence")}
                  >
                    Digital Evidence
                  </Col>
                </Row>
                <Row style={{ marginBottom: 10 }}>
                  <Col span={6}>CDRs/CDFs</Col>
                  <Col
                    span={4}
                    className="link"
                    onClick={() => setSelectedSiderMenu("collectionOfEvidence")}
                  >
                    Digital Evidence
                  </Col>
                </Row>
              </Card>
              <Card
                style={{ width: "25%" }}
                className="right-section cardRightStyle"
              ></Card>
            </Row>
          </Panel>

          <Panel
            style={{ padding: "3" }}
            className="panelHeader"
            header={
              <div className="headerTextContainer">
                {" "}
                <div className="panelTitle">Facial Recognition</div>
              </div>
            }
            key="3"
          >
            <FacialRecognition
              handleSearch={handleSearch}
              serchText={serchText}
              savedRecords={effortsForTracingList?.facialRecognition}
              selectedIndex={selectedIndex}
              setSelectedIndex={setSelectedIndex}
            />
          </Panel>

          <Panel
            style={{ padding: "2" }}
            className="panelHeader"
            header={
              <div className="headerTextContainer">
                {" "}
                <div className="panelTitle">Passport Details</div>
              </div>
            }
            key="4"
          >
            <PassportDetails
              savedRecords={effortsForTracingList?.passportDetails}
              selectedIndex={selectedIndex}
              setSelectedIndex={setSelectedIndex}
            />
          </Panel>

          <Panel
            style={{ padding: "3" }}
            className="panelHeader"
            header={
              <div className="headerTextContainer">
                {" "}
                <div className="panelTitle">Out Of Country Travel Details</div>
              </div>
            }
            key="5"
          >
            <OutOfCountryTravel
              handleSearch={handleSearch}
              serchText={serchText}
              savedRecords={effortsForTracingList?.outOfCountryTravel}
              selectedIndex={selectedIndex}
              setSelectedIndex={setSelectedIndex}
            />
          </Panel>

          <Panel
            style={{ padding: "3" }}
            className="panelHeader"
            header={
              <div className="headerTextContainer">
                {" "}
                <div className="panelTitle">
                  Classmates/Kin and Kith verification
                </div>
              </div>
            }
            key="6"
          >
            <FriendsAndRelatives
              handleSearch={handleSearch}
              serchText={serchText}
              openNotificationWithIcon={openNotificationWithIcon}
              savedRecords={effortsForTracingList?.friendsAndRelatives}
              selectedIndex={selectedIndex}
              setSelectedIndex={setSelectedIndex}
            />
          </Panel>

          <Panel
            style={{ padding: "3" }}
            className="panelHeader"
            header={
              <div className="headerTextContainer">
                {" "}
                <div className="panelTitle">
                  Checking Of MO Criminal and Ex-Convict
                </div>
              </div>
            }
            key="7"
          >
            <MOCriminalConvictChecking
              handleSearch={handleSearch}
              serchText={serchText}
              openNotificationWithIcon={openNotificationWithIcon}
              savedRecords={effortsForTracingList?.moCriminalConvictChecking}
              selectedIndex={selectedIndex}
              setSelectedIndex={setSelectedIndex}
            />
          </Panel>

          <Panel
            style={{ padding: "3" }}
            className="panelHeader"
            header={
              <div className="headerTextContainer">
                {" "}
                <div className="panelTitle">Teams Sent Out Of Station</div>
              </div>
            }
            key="8"
          >
            <TeamSentOutOfStation
              handleSearch={handleSearch}
              serchText={serchText}
              openNotificationWithIcon={openNotificationWithIcon}
              savedRecords={effortsForTracingList?.teamSentOutOfStation}
              selectedIndex={selectedIndex}
              setSelectedIndex={setSelectedIndex}
            />
          </Panel>

          <Panel
            style={{ padding: "3" }}
            className="panelHeader"
            header={
              <div className="headerTextContainer">
                {" "}
                <div className="panelTitle">
                  Hot Spots Verification by the Personnel
                </div>
              </div>
            }
            key="9"
          >
            <VerificationOfHotspots
              handleSearch={handleSearch}
              serchText={serchText}
              openNotificationWithIcon={openNotificationWithIcon}
              savedRecords={effortsForTracingList?.verificationOfHotspots}
              selectedIndex={selectedIndex}
              setSelectedIndex={setSelectedIndex}
            />
          </Panel>

          <Panel
            style={{ padding: "3" }}
            className="panelHeader"
            header={
              <div className="headerTextContainer">
                {" "}
                <div className="panelTitle">Declaration Of Rewards</div>
              </div>
            }
            key="10"
          >
            <RewardsDeclared
              handleSearch={handleSearch}
              serchText={serchText}
              openNotificationWithIcon={openNotificationWithIcon}
              savedRecords={effortsForTracingList?.rewardsDeclared}
              selectedIndex={selectedIndex}
              setSelectedIndex={setSelectedIndex}
            />
          </Panel>
        </Collapse>
      )}
    </EffortForTracingModuleWrapper>
  );
}
