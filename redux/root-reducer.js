import { combineReducers } from "redux";
import App from "@redux/app/reducer";
import Auth from "@redux/auth/reducer";
import Dashboard from "@redux/dashboard/reducer";
import FIR from "@redux/fir/reducer";
import ReGeneratedFIR from "@redux/reGeneratedFir/reducer";
import Reports from "@redux/reports/reducer";
import SuspectAccused from "@redux/investigations/suspectAccused/reducer";
import PoliceCustody from "@redux/investigations/policeCustody/reducer";
import PTWarrant from "@redux/investigations/ptWarrant/reducer";
import tipAccused from "@redux/investigations/tipAccused/reducer";
import casePropertyManagement from "@redux/investigations/casePropertyManagement/reducer";
import tipArticles from "@redux/investigations/tipArticles/reducer";
import stolenProperty from "@redux/investigations/stolenProperty/reducer";
import CRPCNotice41A from "@redux/investigations/crpcNotice41A/reducer";
import ConfessionalStatements from "@redux/investigations/confessionalStatements/reducer";
import RemandExtension from "@redux/investigations/remandExtension/reducer";
import JuvenileApprehension from "@redux/investigations/juvenileApprehension/reducer";
import RemandReport from "@redux/investigations/remandReport/reducer";
import ApprehensionReport from "@redux/investigations/apprehensionReport/reducer";
import BailOppositions from "@redux/investigations/bailOppositions/reducer";
import CRPCNotice160 from "@redux/investigations/crpcNotice160/reducer";
import Inquest from "@redux/investigations/inquest/reducer";
import TransferOfCaseFile from "@redux/investigations/transferOfCaseFile/reducer";
import ProsecutionPermission from "@redux/investigations/prosecutionPermission/reducer";
import Exhumation from "@redux/investigations/exhumation/reducer";
import PostmortemExamination from "@redux/investigations/postmortemExamination/reducer";
import CommonRequest from "@redux/investigations/commonRequest/reducer";
import AdditionalMemo from "@redux/investigations/additionalMemo/reducer";
import MediaManager from "@redux/fir/mediaManager/reducer";
import ThemeSwitcher from "@redux/themeSwitcher/reducer";
import LanguageSwitcher from "@redux/languageSwitcher/reducer";
import drawer from "@redux/drawer/reducer";
import modal from "@redux/modal/reducer";
import MasterData from "@redux/masterData/reducer";
import CRPCSec164Statement from "@redux/investigations/crpcSec164Statement/reducer";
import ReassignmentOfCase from "@redux/investigations/reassignmentOfCase/reducer";
import GenerateRequisitions from "@redux/generateRequisitions/reducer";
import ReopeningOfCase from "@redux/investigations/reopeningOfCase/reducer";
import InterrogationReport from "@redux/investigations/interrogationReport/reducer";
import Chargesheet from "@redux/investigations/chargesheet/reducer";
import CrimeScene from "@redux/investigations/crimeScene/reducer";
import FinalReport from "@redux/investigations/finalReport/reducer";
import PPOpinion from "@redux/investigations/ppopinion/reducer";
import NoticeToComplainant from "@redux/investigations/noticeToComplainant/reducer";
import EffortsForTracing from "@redux/investigations/effortsForTracing/reducer";
import ComplainantDetails from "@redux/investigations/complainantDetails/reducer";
import ScientificEvidence from "@redux/investigations/collectionOfEvidence/scientificEvidence/reducer";
import DocumentryEvidence from "@redux/investigations/collectionOfEvidence/documentryEvidence/reducer";
import AudioVideoClipping from "@redux/investigations/collectionOfEvidence/digitalEvidence/audioVideoClipping/reducer";
import CCTVFootage from "@redux/investigations/collectionOfEvidence/digitalEvidence/cctvFootage/reducer";
import CDREvidence from "@redux/investigations/collectionOfEvidence/digitalEvidence/cdrEvidence/reducer";
import createFIR from "@redux/createFir/reducer";
import LookoutNotice from "@redux/investigations/lookoutNotice/reducer";
import AlterationMemo from "@redux/investigations/alterationMemo/reducer";
import AuditHistory from "@redux/auditHistory/reducer";
import CaseDiary from "@redux/investigations/caseDiary/reducer";
import UpdateChargeSheetStatus from "@redux/investigations/updateChargeSheetStatus/reducer";
import Form54 from "@redux/investigations/form54/reducer";
import AdvisoryMemo from "@redux/advisoryMemo/reducer";
import CourtCommittal from "@redux/CourtAndProsecution/CourtCommittal/reducer";
import IssueOfSummons from "@redux/CourtAndProsecution/IssueOfSummons/reducer";
import IssueOfWarrants from "@redux/CourtAndProsecution/IssueOfWarrants/reducer";
import ExecutingOfWarrants from "@redux/CourtAndProsecution/ExecutingOfWarrants/reducer";
import NoticeToSurety from "@redux/CourtAndProsecution/NoticeToSurety/reducer";
import ProclamationAndPropertyAttachments from "@redux/CourtAndProsecution/ProclamationAndPropertyAttachments/reducer";
import AccusedDisposalForm from "@redux/CourtAndProsecution/AccusedDisposalForm/reducer";
import CourtDisposalForm from "@redux/CourtAndProsecution/CourtDisposalForm/reducer";
import AppealOnJudgement from "@redux/CourtAndProsecution/AppealOnJudgement/reducer";
import DeathOfAccused from "@redux/CourtAndProsecution/DeathOfAccused/reducer";
import CourtTransfer from "@redux/CourtAndProsecution/CourtTransfer/reducer";
import LokAdalatDisposal from "@redux/LokAdalatDisposal/reducer";
import ServingOfSummons from "@redux/CourtAndProsecution/ServingOfSummons/reducer";
import CourtCaseDiary from "@redux/CourtAndProsecution/CourtCaseDiary/reducer";
import ChargeSheetData from "@redux/CourtAndProsecution/ChargeSheetData/reducer";
import IcjsReports from "@redux/IcjsRepots/reducer";

export default combineReducers({
  Auth,
  App,
  MasterData,
  Dashboard,
  FIR,
  SuspectAccused,
  PoliceCustody,
  PTWarrant,
  tipAccused,
  casePropertyManagement,
  tipArticles,
  stolenProperty,
  CRPCNotice41A,
  ConfessionalStatements,
  RemandExtension,
  JuvenileApprehension,
  RemandReport,
  ApprehensionReport,
  BailOppositions,
  CRPCNotice160,
  Inquest,
  TransferOfCaseFile,
  ProsecutionPermission,
  Exhumation,
  PostmortemExamination,
  AdditionalMemo,
  CommonRequest,
  MediaManager,
  ThemeSwitcher,
  LanguageSwitcher,
  modal,
  drawer,
  CRPCSec164Statement,
  ReassignmentOfCase,
  ReopeningOfCase,
  GenerateRequisitions,
  InterrogationReport,
  Chargesheet,
  CrimeScene,
  FinalReport,
  PPOpinion,
  NoticeToComplainant,
  EffortsForTracing,
  ComplainantDetails,
  ScientificEvidence,
  DocumentryEvidence,
  AudioVideoClipping,
  CCTVFootage,
  CDREvidence,
  createFIR,
  LookoutNotice,
  AlterationMemo,
  AuditHistory,
  CaseDiary,
  UpdateChargeSheetStatus,
  Reports,
  Form54,
  AdvisoryMemo,
  ReGeneratedFIR,
  CourtCommittal,
  IssueOfSummons,
  IssueOfWarrants,
  ExecutingOfWarrants,
  NoticeToSurety,
  ProclamationAndPropertyAttachments,
  AccusedDisposalForm,
  CourtDisposalForm,
  AppealOnJudgement,
  DeathOfAccused,
  CourtTransfer,
  LokAdalatDisposal,
  ServingOfSummons,
  CourtCaseDiary,
  ChargeSheetData,
  IcjsReports,
});
