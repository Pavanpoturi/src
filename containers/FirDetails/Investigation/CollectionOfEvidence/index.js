/* eslint-disable default-case */
import { useState, useEffect } from "react";
import { Row, Card, Col, Form, Radio } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { loadState } from "@lib/helpers/localStorage";
import { config } from "@config/site.config";
import { isNull } from "lodash";
import firActions from "@redux/fir/actions";
import { masterDataType } from "@containers/FirDetails/fir-util";
import suspectAccusedAction from "@redux/investigations/suspectAccused/actions";
import masterDataActions from "@redux/masterData/actions";
import { ModuleWrapper } from "../CommonDetails/styles";
import CollectionOfEvidenceHeader from "./CollectionOfEvidenceHeader";
import DigitalEvidence from "./DigitalEvidence";
import ScientificEvidence from "./ScientificEvidence";
import DocumentryEvidence from "./DocumentryEvidence";
import DisplayReportGenerations from "@containers/FirDetails/CommonSections/DisplayReportGenerations";
import {
  digitalEvidenceCCTVTemplates,
  digitalEvidenceAudioTemplates,
  digitalEvidenceCDRTemplates,
  documentryEvidenceTemplates,
  scientificEvidenceMainPageTemplates,
  scientificEvidenceThroughCourtsTemplates,
  scientificEvidenceThroughACPTemplates,
  getDataForDocument,
  getHTMLFromTemplate,
} from "./const";
import TemplatesModal from "@containers/FirDetails/Investigation/CommonForms/TemplatesModal";

export default function CollectionOfEvidence({ setSelectedSiderMenu }) {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const crimeId = loadState("selectedFirId");
  const [formValid, setFormValid] = useState(false);
  const [selectedTab, setSelectedTab] = useState("1");
  const [selectedEvidenceType, setSelectedEvidenceType] = useState("");
  const { getAccusedList } = suspectAccusedAction;
  const { fetchWitnessDetailsList } = firActions;
  const { getEvidenceCollectionList, getCourtsBasedonPsCode } =
    masterDataActions;
  const [viewCollectionOfEvidenceDetails, setViewCollectionOfEvidenceDetails] =
    useState(false);
  const [editCollectionOfEvidenceObj, setEditCollectionOfEvidenceObj] =
    useState(null);
  const [isTemplateModalVisible, setTemplateIsModalVisible] = useState(false);
  const [selectedTemplateName, setSelectedTemplateName] = useState("");
  const [selectedRequisitionForward, setSelectedRequisitionForward] =
    useState("");
  const [selectedFileName, setSelectedFileName] = useState("");

  const selectedFir = loadState("selectedFir");
  const currentUser = loadState("currentUser");
  const { savedFir } = useSelector((state) => state.createFIR);
  const disableForm =
    savedFir?.caseStatus === "Disposal" ||
    savedFir?.isTransferOfCaseFile === true ||
    savedFir?.isChargeSheetTakenOrFiled === true;

  const getTemplatesList = () => {
    let templateList = [];
    switch (selectedEvidenceType) {
      case "ScientificEvidence":
        let scientificListResult = [];
        if (selectedRequisitionForward === "Through Court") {
          scientificListResult = [
            ...scientificEvidenceMainPageTemplates,
            ...scientificEvidenceThroughCourtsTemplates,
          ];
        } else if (selectedRequisitionForward === "ACP") {
          scientificListResult = [
            ...scientificEvidenceMainPageTemplates,
            ...scientificEvidenceThroughACPTemplates,
          ];
        } else {
          scientificListResult = scientificEvidenceMainPageTemplates;
        }
        templateList = scientificListResult;
        break;
      case "DigitalEvidence":
        let digitalListResult = [];
        if (selectedTab === "1") {
          digitalListResult = digitalEvidenceCCTVTemplates;
        } else if (selectedTab === "2") {
          digitalListResult = digitalEvidenceAudioTemplates;
        } else if (selectedTab === "3") {
          digitalListResult = digitalEvidenceCDRTemplates;
        } else {
          digitalListResult = [];
        }
        templateList = digitalListResult;
        break;
      case "DocumentryEvidence":
        templateList = documentryEvidenceTemplates;
    }
    return templateList;
  };

  const fetchAccusedWitnessList = () => {
    dispatch(
      getAccusedList(
        `${config.getPostCrimeSceneDetails}/ACCUSED/?crimeId=${crimeId}`
      )
    );
    dispatch(
      fetchWitnessDetailsList(
        `${config.getPostCrimeSceneDetails}/WITNESSDETAILS/?crimeId=${crimeId}`
      )
    );
  };

  const getMasterDataList = () => {
    dispatch(
      getEvidenceCollectionList(
        `${config.getMasterData}/${masterDataType.EVIDENCE_COLLECTION}`
      )
    );
    dispatch(
      getCourtsBasedonPsCode(
        `${config.masterData}/getCourtsBasedonPsCode?psCode=${currentUser?.cctns_unit_id}`
      )
    );
  };

  useEffect(() => {
    fetchAccusedWitnessList();
    getMasterDataList();
  }, []);

  const checkFields = async () => {
    const values = await form.validateFields();
    setFormValid(!Object.values(values).every((v) => v == null || v === ""));
  };

  const checkSelectedEvidenceTypeValue = (e) => {
    setSelectedEvidenceType(e.target.value);
    setViewCollectionOfEvidenceDetails(false);
    setEditCollectionOfEvidenceObj(null);
    setSelectedRequisitionForward("");
    checkFields();
  };

  const displayEvidenceForms = () => {
    // eslint-disable-next-line default-case
    switch (selectedEvidenceType) {
      case "ScientificEvidence":
        return (
          <ScientificEvidence
            editScientificObj={editCollectionOfEvidenceObj}
            setEditScientificObj={setEditCollectionOfEvidenceObj}
            viewScientificDetails={viewCollectionOfEvidenceDetails}
            setViewScientificDetails={setViewCollectionOfEvidenceDetails}
            selectedRequisitionForward={selectedRequisitionForward}
            setSelectedRequisitionForward={setSelectedRequisitionForward}
          />
        );
      case "DigitalEvidence":
        return (
          <DigitalEvidence
            editObj={editCollectionOfEvidenceObj}
            setEditObj={setEditCollectionOfEvidenceObj}
            viewDetails={viewCollectionOfEvidenceDetails}
            setViewDetails={setViewCollectionOfEvidenceDetails}
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
          />
        );
      case "DocumentryEvidence":
        return (
          <DocumentryEvidence
            editDocumentryObj={editCollectionOfEvidenceObj}
            setEditDocumentryObj={setEditCollectionOfEvidenceObj}
            viewDocumentryDetails={viewCollectionOfEvidenceDetails}
            setViewDocumentryDetails={setViewCollectionOfEvidenceDetails}
          />
        );
    }
  };

  const showModal = (templateName, fileName, templateAvailable = false) => {
    if (templateAvailable) {
      setTemplateIsModalVisible(true);
      setSelectedTemplateName(`${templateName} - Preview`);
      setSelectedFileName(fileName);
    } else {
      setTemplateIsModalVisible(false);
    }
  };

  const handleTemplateCancel = () => {
    setTemplateIsModalVisible(false);
  };

  const reportData = getDataForDocument(
    editCollectionOfEvidenceObj,
    selectedFileName,
    selectedFir,
    currentUser,
    savedFir
  );

  const selectedRecord = !isNull(editCollectionOfEvidenceObj) && {
    crimeId: crimeId,
    ...editCollectionOfEvidenceObj,
  };

  return (
    <ModuleWrapper>
      <CollectionOfEvidenceHeader
        headerTitle="Collection Of Evidence"
        onSubmitClick={() => setSelectedSiderMenu("investigation")}
        isInvestigation={true}
        onCancel={() => setSelectedSiderMenu("investigation")}
      />
      <Row>
        <Card style={{ width: "70%" }} className="cardLeftStyle">
          <Form form={form} layout="vertical">
            <Col className="custody-col">
              <Form.Item name="evidenceType">
                <Radio.Group
                  name="radiogroup"
                  onChange={checkSelectedEvidenceTypeValue}
                  defaultValue={selectedEvidenceType}
                  disabled={false}
                >
                  <Radio value="ScientificEvidence">Scientific Evidence</Radio>
                  <Radio value="DigitalEvidence">Digital Evidence</Radio>
                  <Radio value="DocumentryEvidence">Documentary Evidence</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Form>
          <div style={{ marginTop: 20 }}>{displayEvidenceForms()}</div>
        </Card>
        <Card style={{ width: "30%" }} className="right-section cardRightStyle">
          <DisplayReportGenerations
            templateLists={getTemplatesList()}
            showModal={showModal}
            disabled={
              viewCollectionOfEvidenceDetails ||
              !editCollectionOfEvidenceObj?._id ||
              disableForm
            }
            selectedRecord={selectedRecord}
            selectedModule={selectedEvidenceType}
            accusedId={editCollectionOfEvidenceObj?.victimId?._id}
          />
        </Card>
      </Row>
      {isTemplateModalVisible && (
        <TemplatesModal
          reportData={reportData}
          selectedTemplateName={selectedTemplateName}
          selectedFileName={selectedFileName}
          getHTMLFromTemplate={getHTMLFromTemplate}
          handleCancel={handleTemplateCancel}
          isModalVisible={isTemplateModalVisible}
        />
      )}
    </ModuleWrapper>
  );
}
