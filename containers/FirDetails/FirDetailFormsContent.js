import PreCrimeScene from "./PreCrime";
import CrimeScene from "./CrimeScene";
import PlanOfAction from "./PlanOfAction";
import GenerateRequisitions from "./GenerateRequisitions";
import Investigation from "./Investigation";
import { CourtAndProsecution } from "./Investigation";
import Arrest from "./Investigation/Arrest";
import BailOppositions from "./Investigation/BailOppositions";
import CaseDiaryPart1 from "./Investigation/CaseDiaryPart1";
import CasePropertyManagement from "./Investigation/CasePropertyManagement";
import ConfessionalStatements from "./Investigation/ConfessionalStatements";
import CourtPSSurrender from "./Investigation/CourtPSSurrender";
import InterrogationReport from "./Investigation/InterrogationReport";
import MaterialObjectsMain from "./Investigation/MaterialObjectsMain";
import PanchWitnessMain from "./Investigation/PanchWitnessMain";
import WitnessStatement from "./Investigation/WitnessStatement";
import WitnessDetailsMain from "./Investigation/WitnessDetailsMain";
import SceneOfOffenseMain from "./Investigation/SceneOfOffenseMain";
import RoughSketch from "./Investigation/RoughSketch";
import CrimeClassification from "./Investigation/CrimeClassification";
import PoliceCustody from "./Investigation/PoliceCustody";
import RemandExtension from "./Investigation/RemandExtension";
import RemandReport from "./Investigation/RemandReport";
import SuspectAccused from "./Investigation/SuspectAccused";
import TransitWarrent from "./Investigation/TransitWarrent";
import PTWarrant from "./Investigation/PTWarrant";
import TransferOfCaseFile from "./Investigation/TransferOfCaseFile";
import ProsecutionPermission from "./Investigation/ProsecutionPermission";
import CRPCNotice41A from "./Investigation/CRPCNotice41A";
import CRPCNotice160 from "./Investigation/CRPCNotice160";
import JuvenileApprehension from "./Investigation/JuvenileApprehension";
import ApprehensionReport from "./Investigation/ApprehensionReport";
import Inquest from "./Investigation/Inquest";
import Exhumation from "./Investigation/Exhumation";
import PostmortemExamination from "./Investigation/PostmortemExamination";
import AdditionalMemo from "./Investigation/AdditionalMemo";
import CRPCSec164Statement from "./Investigation/CRPCSec164Statement";
import ReassignmentOfCase from "./Investigation/ReassignmentOfCase";
import TIPAccused from "./Investigation/TIPAccused";
import TIPArticles from "./Investigation/TIPArticles";
import Chargesheet from "./Investigation/Chargesheet";
import UpdateChargeSheetStatus from "./Investigation/UpdateChargeSheetStatus";
import FinalReport from "./Investigation/FinalReport";
import EffortsForTracing from "./Investigation/EffortsForTracing";
import PPOpinion from "./Investigation/PPOpinion";
import NoticeToComplainant from "./Investigation/NoticeToComplainant";
import StolenProperty from "./Investigation/StolenProperty";
import CollectionOfEvidence from "./Investigation/CollectionOfEvidence";
import LookoutNotice from "./Investigation/LookoutNotice";
import AlterationMemo from "./Investigation/AlterationMemo";
import Form54 from "./Investigation/Form54";
import AdvisoryMemo from "./Investigation/AdvisoryMemo";
import CourtCommittal from "./CourtAndProsecution/CourtCommittal";
import CourtCaseDiary from "./CourtAndProsecution/CourtCaseDiary";
import IssueOfSummons from "./CourtAndProsecution/IssueOfSummons";
import IssueOfWarrants from "./CourtAndProsecution/IssueOfWarrants";
import AccusedDisposalForm from "./CourtAndProsecution/AccusedDisposalForm";
import AppealOnJudgement from "./CourtAndProsecution/AppealOnJudgement";
import ProclamationAttachments from "./CourtAndProsecution/ProclamationAttachments";
import DeathOfAccused from "./CourtAndProsecution/DeathOfAccused";
import ServingOfSummons from "./CourtAndProsecution/ServingOfSummons";
import ExecutingOfWarrants from "./CourtAndProsecution/ExecutingOfWarrants";
import NoticeToSurety from "./CourtAndProsecution/NoticeToSurety";
import CourtDisposalForm from "./CourtAndProsecution/CourtDisposalForm";
import CourtTransfer from "./CourtAndProsecution/CourtTransfer";
import PublishingProclamation from "./CourtAndProsecution/PublishingProclamation";
import PropertyAttachments from "./CourtAndProsecution/PropertyAttachments";
import LokAdalat from "./LokAdalat";
import MiniInvestgation from "../HigherOfficerModule/MiniInvestigation";
import AdvisoryMemos from "../HigherOfficerModule/AdvisoryMemo";
import PrintFIRModal from "../NewFir/PrintFIRModal";

export default function FirDetailFormsContent({
  selectedSiderMenu,
  setSelectedSiderMenu,
  selectedInvestigationFormObj,
  setSelectedInvestigationFormObj,
  isModalVisible,
  setIsModalVisible,
}) {
  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedSiderMenu("miniInvestigatinReport");
  };

  const displayContent = () => {
    // eslint-disable-next-line default-case
    switch (selectedSiderMenu) {
      case "miniInvestigatinReport":
        return <MiniInvestgation setSelectedSiderMenu={setSelectedSiderMenu} />;
      case "advisoryMemo":
        return <AdvisoryMemos setSelectedSiderMenu={setSelectedSiderMenu} />;
      case "viewFir":
        return (
          <PrintFIRModal
            isModalVisible={isModalVisible}
            handleCancel={handleCancel}
          />
        );
      case "preCrimeScene":
        return <PreCrimeScene setSelectedSiderMenu={setSelectedSiderMenu} />;
      case "crimeScene":
        return <CrimeScene setSelectedSiderMenu={setSelectedSiderMenu} />;
      case "planOfAction":
        return <PlanOfAction setSelectedSiderMenu={setSelectedSiderMenu} />;
      case "generateRequisitions":
        return (
          <GenerateRequisitions setSelectedSiderMenu={setSelectedSiderMenu} />
        );
      case "investigation":
        return (
          <Investigation
            setSelectedSiderMenu={setSelectedSiderMenu}
            setSelectedInvestigationFormObj={setSelectedInvestigationFormObj}
          />
        );
      case "courtandprosecution":
        return (
          <CourtAndProsecution
            setSelectedSiderMenu={setSelectedSiderMenu}
            setSelectedInvestigationFormObj={setSelectedInvestigationFormObj}
          />
        );
      case "courtCommittal":
        return (
          <CourtCommittal
            setSelectedSiderMenu={setSelectedSiderMenu}
            setSelectedInvestigationFormObj={setSelectedInvestigationFormObj}
          />
        );
      case "issueOfSummons":
        return (
          <IssueOfSummons
            setSelectedSiderMenu={setSelectedSiderMenu}
            setSelectedInvestigationFormObj={setSelectedInvestigationFormObj}
          />
        );
      case "courtCaseDiary":
        return (
          <CourtCaseDiary
            setSelectedSiderMenu={setSelectedSiderMenu}
            setSelectedInvestigationFormObj={setSelectedInvestigationFormObj}
          />
        );
      case "issueOfWarrants":
        return (
          <IssueOfWarrants
            setSelectedSiderMenu={setSelectedSiderMenu}
            setSelectedInvestigationFormObj={setSelectedInvestigationFormObj}
          />
        );
      case "accusedDisposalForm":
        return (
          <AccusedDisposalForm
            setSelectedSiderMenu={setSelectedSiderMenu}
            setSelectedInvestigationFormObj={setSelectedInvestigationFormObj}
          />
        );
      case "appealOnJudgement":
        return (
          <AppealOnJudgement
            setSelectedSiderMenu={setSelectedSiderMenu}
            setSelectedInvestigationFormObj={setSelectedInvestigationFormObj}
          />
        );
      case "proclamationAttachments":
        return (
          <ProclamationAttachments
            setSelectedSiderMenu={setSelectedSiderMenu}
            setSelectedInvestigationFormObj={setSelectedInvestigationFormObj}
          />
        );
      case "publishingProclamation":
        return (
          <PublishingProclamation
            setSelectedSiderMenu={setSelectedSiderMenu}
            setSelectedInvestigationFormObj={setSelectedInvestigationFormObj}
          />
        );
      case "propertyAttachments":
        return (
          <PropertyAttachments
            setSelectedSiderMenu={setSelectedSiderMenu}
            setSelectedInvestigationFormObj={setSelectedInvestigationFormObj}
          />
        );
      case "deathOfAccused":
        return (
          <DeathOfAccused
            setSelectedSiderMenu={setSelectedSiderMenu}
            setSelectedInvestigationFormObj={setSelectedInvestigationFormObj}
          />
        );
      case "servingOfSummons":
        return (
          <ServingOfSummons
            setSelectedSiderMenu={setSelectedSiderMenu}
            setSelectedInvestigationFormObj={setSelectedInvestigationFormObj}
          />
        );
      case "executingOfWarrants":
        return (
          <ExecutingOfWarrants
            setSelectedSiderMenu={setSelectedSiderMenu}
            setSelectedInvestigationFormObj={setSelectedInvestigationFormObj}
          />
        );
      case "noticeToSurety":
        return (
          <NoticeToSurety
            setSelectedSiderMenu={setSelectedSiderMenu}
            setSelectedInvestigationFormObj={setSelectedInvestigationFormObj}
          />
        );
      case "courtDisposalForm":
        return (
          <CourtDisposalForm
            setSelectedSiderMenu={setSelectedSiderMenu}
            setSelectedInvestigationFormObj={setSelectedInvestigationFormObj}
          />
        );
      case "courtTransfer":
        return (
          <CourtTransfer
            setSelectedSiderMenu={setSelectedSiderMenu}
            setSelectedInvestigationFormObj={setSelectedInvestigationFormObj}
          />
        );
      case "lokAdalatDisposal":
        return <LokAdalat setSelectedSiderMenu={setSelectedSiderMenu} />;
      case "MOSeizures":
        return (
          <MaterialObjectsMain setSelectedSiderMenu={setSelectedSiderMenu} />
        );
      case "casePropertyManagement":
        return (
          <CasePropertyManagement setSelectedSiderMenu={setSelectedSiderMenu} />
        );
      case "caseDiaryPart1":
        return <CaseDiaryPart1 setSelectedSiderMenu={setSelectedSiderMenu} />;
      case "suspectAccused":
        return <SuspectAccused setSelectedSiderMenu={setSelectedSiderMenu} />;
      case "arrest":
        return (
          <Arrest
            setSelectedSiderMenu={setSelectedSiderMenu}
            selectedInvestigationFormObj={selectedInvestigationFormObj}
            isArrestRelated={true}
          />
        );
      case "arrestByPolice":
        return (
          <Arrest
            setSelectedSiderMenu={setSelectedSiderMenu}
            selectedInvestigationFormObj={selectedInvestigationFormObj}
            isArrestRelated={false}
            setSelectedInvestigationFormObj={setSelectedInvestigationFormObj}
          />
        );
      case "arrestByOtherPolice":
        return (
          <Arrest
            setSelectedSiderMenu={setSelectedSiderMenu}
            selectedInvestigationFormObj={selectedInvestigationFormObj}
            isArrestRelated={false}
            setSelectedInvestigationFormObj={setSelectedInvestigationFormObj}

          />
        );
      case "arrestOnAnticipatoryBail":
        return (
          <Arrest
            setSelectedSiderMenu={setSelectedSiderMenu}
            selectedInvestigationFormObj={selectedInvestigationFormObj}
            isArrestRelated={false}
            setSelectedInvestigationFormObj={setSelectedInvestigationFormObj}

          />
        );
      case "arrestOnSurrenderInPoliceStation":
        return (
          <Arrest
            setSelectedSiderMenu={setSelectedSiderMenu}
            selectedInvestigationFormObj={selectedInvestigationFormObj}
            isArrestRelated={false}
            setSelectedInvestigationFormObj={setSelectedInvestigationFormObj}

          />
        );
      case "surrenderInCourt":
        return (
          <Arrest
            setSelectedSiderMenu={setSelectedSiderMenu}
            selectedInvestigationFormObj={selectedInvestigationFormObj}
            isArrestRelated={false}
            setSelectedInvestigationFormObj={setSelectedInvestigationFormObj}

          />
        );
      case "highCourtDirections":
        return (
          <Arrest
            setSelectedSiderMenu={setSelectedSiderMenu}
            selectedInvestigationFormObj={selectedInvestigationFormObj}
            isArrestRelated={false}
            setSelectedInvestigationFormObj={setSelectedInvestigationFormObj}

          />
        );
      case "surrenderBeforeCourt":
        return (
          <Arrest
            setSelectedSiderMenu={setSelectedSiderMenu}
            selectedInvestigationFormObj={selectedInvestigationFormObj}
            isArrestRelated={false}
            setSelectedInvestigationFormObj={setSelectedInvestigationFormObj}

          />
        );
      case "accusedOutOfCountry":
        return (
          <Arrest
            setSelectedSiderMenu={setSelectedSiderMenu}
            selectedInvestigationFormObj={selectedInvestigationFormObj}
            isArrestRelated={false}
            setSelectedInvestigationFormObj={setSelectedInvestigationFormObj}

          />
        );
      case "courtPSSurrender":
        return <CourtPSSurrender setSelectedSiderMenu={setSelectedSiderMenu} />;
      case "interrogationReport":
        return (
          <InterrogationReport setSelectedSiderMenu={setSelectedSiderMenu} />
        );

      case "remandReport":
        return <RemandReport setSelectedSiderMenu={setSelectedSiderMenu} />;
      case "remandExtension":
        return <RemandExtension setSelectedSiderMenu={setSelectedSiderMenu} />;
      case "stolenProperty":
        return <StolenProperty setSelectedSiderMenu={setSelectedSiderMenu} />;
      case "transitWarrent":
        return <TransitWarrent setSelectedSiderMenu={setSelectedSiderMenu} />;
      case "policeCustody":
        return <PoliceCustody setSelectedSiderMenu={setSelectedSiderMenu} />;
      case "bailOppositions":
        return <BailOppositions setSelectedSiderMenu={setSelectedSiderMenu} />;
      case "confessionalStatements":
        return (
          <ConfessionalStatements setSelectedSiderMenu={setSelectedSiderMenu} />
        );
      case "panchWitness":
        return <PanchWitnessMain setSelectedSiderMenu={setSelectedSiderMenu} />;
      case "witnessStatement":
        return <WitnessStatement setSelectedSiderMenu={setSelectedSiderMenu} />;
      case "witnessDetails":
        return (
          <WitnessDetailsMain setSelectedSiderMenu={setSelectedSiderMenu} />
        );
      case "sceneOfOffense":
        return (
          <SceneOfOffenseMain setSelectedSiderMenu={setSelectedSiderMenu} />
        );
      case "roughSketch":
        return <RoughSketch setSelectedSiderMenu={setSelectedSiderMenu} />;
      case "crimeClassification":
        return (
          <CrimeClassification setSelectedSiderMenu={setSelectedSiderMenu} />
        );
      case "PTWarrant":
        return <PTWarrant setSelectedSiderMenu={setSelectedSiderMenu} />;
      case "transferOfCaseFile":
        return (
          <TransferOfCaseFile setSelectedSiderMenu={setSelectedSiderMenu} />
        );
      case "prosecutionPermission":
        return (
          <ProsecutionPermission setSelectedSiderMenu={setSelectedSiderMenu} />
        );
      case "crPcNotice41A":
        return <CRPCNotice41A setSelectedSiderMenu={setSelectedSiderMenu} />;
      case "juvenileApprehension":
        return (
          <JuvenileApprehension
            setSelectedSiderMenu={setSelectedSiderMenu}
            selectedInvestigationFormObj={selectedInvestigationFormObj}
            isArrestRelated={true}
            setSelectedInvestigationFormObj={setSelectedInvestigationFormObj}

          />
        );
      case "apprehensionByPolice":
        return (
          <JuvenileApprehension
            setSelectedSiderMenu={setSelectedSiderMenu}
            selectedInvestigationFormObj={selectedInvestigationFormObj}
            isArrestRelated={false}
            setSelectedInvestigationFormObj={setSelectedInvestigationFormObj}

          />
        );
      case "apprehensionByOtherPolice":
        return (
          <JuvenileApprehension
            setSelectedSiderMenu={setSelectedSiderMenu}
            selectedInvestigationFormObj={selectedInvestigationFormObj}
            isArrestRelated={false}
            setSelectedInvestigationFormObj={setSelectedInvestigationFormObj}

          />
        );
      case "apprehensionOnAnticipatoryBail":
        return (
          <JuvenileApprehension
            setSelectedSiderMenu={setSelectedSiderMenu}
            selectedInvestigationFormObj={selectedInvestigationFormObj}
            isArrestRelated={false}
            setSelectedInvestigationFormObj={setSelectedInvestigationFormObj}

          />
        );
      case "apprehensionOnSurrenderInPoliceStation":
        return (
          <JuvenileApprehension
            setSelectedSiderMenu={setSelectedSiderMenu}
            selectedInvestigationFormObj={selectedInvestigationFormObj}
            isArrestRelated={false}
            setSelectedInvestigationFormObj={setSelectedInvestigationFormObj}

          />
        );
      case "apprehensionsurrenderInCourt":
        return (
          <JuvenileApprehension
            setSelectedSiderMenu={setSelectedSiderMenu}
            selectedInvestigationFormObj={selectedInvestigationFormObj}
            isArrestRelated={false}
          />
        );
      case "apprehensionhighCourtDirections":
        return (
          <JuvenileApprehension
            setSelectedSiderMenu={setSelectedSiderMenu}
            selectedInvestigationFormObj={selectedInvestigationFormObj}
            isArrestRelated={false}
          />
        );
      case "apprehensionsurrenderBeforeCourt":
        return (
          <JuvenileApprehension
            setSelectedSiderMenu={setSelectedSiderMenu}
            selectedInvestigationFormObj={selectedInvestigationFormObj}
            isArrestRelated={false}
          />
        );
      case "apprehensionaccusedOutOfCountry":
        return (
          <JuvenileApprehension
            setSelectedSiderMenu={setSelectedSiderMenu}
            selectedInvestigationFormObj={selectedInvestigationFormObj}
            isArrestRelated={false}
          />
        );
      case "apprehensionReport":
        return (
          <ApprehensionReport setSelectedSiderMenu={setSelectedSiderMenu} />
        );
      case "crPcNotice160":
        return <CRPCNotice160 setSelectedSiderMenu={setSelectedSiderMenu} />;
      case "inquest":
        return <Inquest setSelectedSiderMenu={setSelectedSiderMenu} />;
      case "exhumation":
        return <Exhumation setSelectedSiderMenu={setSelectedSiderMenu} />;
      case "CRPCSec164StatementAccused":
        return (
          <CRPCSec164Statement
            setSelectedSiderMenu={setSelectedSiderMenu}
            selectedInvestigationFormObj={selectedInvestigationFormObj}
          />
        );
      case "CRPCSec164StatementWitness":
        return (
          <CRPCSec164Statement
            setSelectedSiderMenu={setSelectedSiderMenu}
            selectedInvestigationFormObj={selectedInvestigationFormObj}
          />
        );
      case "reassignmentOfCase":
        return (
          <ReassignmentOfCase setSelectedSiderMenu={setSelectedSiderMenu} />
        );
      case "testIdentificationAccused":
        return <TIPAccused setSelectedSiderMenu={setSelectedSiderMenu} />;
      case "testIdentificationArticles":
        return <TIPArticles setSelectedSiderMenu={setSelectedSiderMenu} />;
      case "chargesheet":
        return <Chargesheet setSelectedSiderMenu={setSelectedSiderMenu} />;
      case "UpdateChargeSheetStatus":
        return (
          <UpdateChargeSheetStatus
            setSelectedSiderMenu={setSelectedSiderMenu}
            isDashboard={false}
          />
        );
      case "finalReport":
        return <FinalReport setSelectedSiderMenu={setSelectedSiderMenu} />;
      case "postmortemExamination":
        return (
          <PostmortemExamination setSelectedSiderMenu={setSelectedSiderMenu} />
        );
      case "PPOpinion":
        return <PPOpinion setSelectedSiderMenu={setSelectedSiderMenu} />;
      case "EffortsForTracing":
        return (
          <EffortsForTracing setSelectedSiderMenu={setSelectedSiderMenu} />
        );
      case "NoticeToComplainant":
        return (
          <NoticeToComplainant setSelectedSiderMenu={setSelectedSiderMenu} />
        );
      case "additionalMemo":
        return <AdditionalMemo setSelectedSiderMenu={setSelectedSiderMenu} />;
      case "collectionOfEvidence":
        return (
          <CollectionOfEvidence setSelectedSiderMenu={setSelectedSiderMenu} />
        );
      case "LookoutNotice":
        return <LookoutNotice setSelectedSiderMenu={setSelectedSiderMenu} />;
      case "alterationMemo":
        return <AlterationMemo setSelectedSiderMenu={setSelectedSiderMenu} />;
      case "form54":
        return <Form54 setSelectedSiderMenu={setSelectedSiderMenu} />;
      case "advisoryMemo":
        return <AdvisoryMemo setSelectedSiderMenu={setSelectedSiderMenu} />;
    }
  };
  return displayContent();
}
