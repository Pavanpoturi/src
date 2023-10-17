import { all } from "redux-saga/effects";
import authSagas from "@redux/auth/saga";
import dashboardSagas from "@redux/dashboard/saga";
import firSagas from "@redux/fir/saga";
import reportSagas from "@redux/reports/saga";
import suspectAccusedSagas from "@redux/investigations/suspectAccused/saga";
import policeCustodySagas from "@redux/investigations/policeCustody/saga";
import ptWarrantSagas from "@redux/investigations/ptWarrant/saga";
import tipAccusedSagas from "@redux/investigations/tipAccused/saga";
import casePropertyManagementSagas from "@redux/investigations/casePropertyManagement/saga";
import tipArticlesSagas from "@redux/investigations/tipArticles/saga";
import crpcNotice41A from "@redux/investigations/crpcNotice41A/saga";
import confessionalStatements from "@redux/investigations/confessionalStatements/saga";
import juvenileApprehension from "@redux/investigations/juvenileApprehension/saga";
import remandReport from "@redux/investigations/remandReport/saga";
import apprehensionReport from "@redux/investigations/apprehensionReport/saga";
import remandExtension from "@redux/investigations/remandExtension/saga";
import bailOppositions from "@redux/investigations/bailOppositions/saga";
import crpcNotice160 from "@redux/investigations/crpcNotice160/saga";
import inquest from "@redux/investigations/inquest/saga";
import transferOfCaseFile from "@redux/investigations/transferOfCaseFile/saga";
import prosecutionPermission from "@redux/investigations/prosecutionPermission/saga";
import exhumation from "@redux/investigations/exhumation/saga";
import postmortemExamination from "@redux/investigations/postmortemExamination/saga";
import additionalMemo from "@redux/investigations/additionalMemo/saga";
import commonRequest from "@redux/investigations/commonRequest/saga";
import mediaManager from "@redux/fir/mediaManager/saga";
import masterDataSagas from "@redux/masterData/saga";
import ReGeneratedFIRSaga from "@redux/reGeneratedFir/saga";
import crpcSec164Sagas from "@redux/investigations/crpcSec164Statement/saga";
import reassignmentOfCase from "@redux/investigations/reassignmentOfCase/saga";
import reopeningOfCase from "@redux/investigations/reopeningOfCase/saga";
import stolenProperty from "@redux/investigations/stolenProperty/saga";
import generateRequisitions from "@redux/generateRequisitions/saga";
import interrogationReport from "@redux/investigations/interrogationReport/saga";
import chargesheet from "@redux/investigations/chargesheet/saga";
import finalReport from "@redux/investigations/finalReport/saga";
import ppopinion from "@redux/investigations/ppopinion/saga";
import noticeToComplainant from "@redux/investigations/noticeToComplainant/saga";
import effortsForTracing from "@redux/investigations/effortsForTracing/saga";
import complainantDetails from "@redux/investigations/complainantDetails/saga";
import scientificEvidence from "@redux/investigations/collectionOfEvidence/scientificEvidence/saga";
import documentryEvidence from "@redux/investigations/collectionOfEvidence/documentryEvidence/saga";
import audioVideoClipping from "@redux/investigations/collectionOfEvidence/digitalEvidence/audioVideoClipping/saga";
import cCTVFootage from "@redux/investigations/collectionOfEvidence/digitalEvidence/cctvFootage/saga";
import cDREvidence from "@redux/investigations/collectionOfEvidence/digitalEvidence/cdrEvidence/saga";
import createFIR from "@redux/createFir/saga";
import lookoutNotice from "@redux/investigations/lookoutNotice/saga";
import alterationMemo from "@redux/investigations/alterationMemo/saga";
import auditHistory from "@redux/auditHistory/saga";
import caseDiary from "@redux/investigations/caseDiary/saga";
import updateChargeSheetStatus from "@redux/investigations/updateChargeSheetStatus/saga";
import crimeScene from "@redux/investigations/crimeScene/saga";
import form54 from "@redux/investigations/form54/saga";
import advisoryMemos from "@redux/advisoryMemo/saga";
import courtCommittal from "@redux/CourtAndProsecution/CourtCommittal/saga";
import issueOfSummons from "@redux/CourtAndProsecution/IssueOfSummons/saga";
import IssueOfWarrants from "@redux/CourtAndProsecution/IssueOfWarrants/saga";
import executingOfWarrants from "@redux/CourtAndProsecution/ExecutingOfWarrants/saga";
import noticeToSurety from "@redux/CourtAndProsecution/NoticeToSurety/saga";
import proclamationAndPropertyAttachments from "@redux/CourtAndProsecution/ProclamationAndPropertyAttachments/saga";
import accusedDisposalForm from "@redux/CourtAndProsecution/AccusedDisposalForm/saga";
import courtDisposalForm from "@redux/CourtAndProsecution/CourtDisposalForm/saga";
import appealOnJudgement from "@redux/CourtAndProsecution/AppealOnJudgement/saga";
import deathOfAccused from "@redux/CourtAndProsecution/DeathOfAccused/saga";
import courtTransfer from "@redux/CourtAndProsecution/CourtTransfer/saga";
import lokAdalatDisposal from "@redux/LokAdalatDisposal/saga";
import ServingOfSummons from "@redux/CourtAndProsecution/ServingOfSummons/saga";
import courtCaseDiary from "@redux/CourtAndProsecution/CourtCaseDiary/saga";
import IcjsReports from "@redux/IcjsRepots/saga";
export default function* rootSaga() {
  yield all([
    authSagas(),
    dashboardSagas(),
    firSagas(),
    masterDataSagas(),
    suspectAccusedSagas(),
    policeCustodySagas(),
    ptWarrantSagas(),
    tipAccusedSagas(),
    casePropertyManagementSagas(),
    tipArticlesSagas(),
    crpcNotice41A(),
    stolenProperty(),
    confessionalStatements(),
    remandExtension(),
    juvenileApprehension(),
    remandReport(),
    apprehensionReport(),
    bailOppositions(),
    crpcNotice160(),
    inquest(),
    transferOfCaseFile(),
    prosecutionPermission(),
    exhumation(),
    postmortemExamination(),
    additionalMemo(),
    commonRequest(),
    crpcSec164Sagas(),
    mediaManager(),
    reassignmentOfCase(),
    reopeningOfCase(),
    generateRequisitions(),
    interrogationReport(),
    chargesheet(),
    crimeScene(),
    finalReport(),
    ppopinion(),
    noticeToComplainant(),
    effortsForTracing(),
    complainantDetails(),
    scientificEvidence(),
    documentryEvidence(),
    audioVideoClipping(),
    cCTVFootage(),
    cDREvidence(),
    createFIR(),
    lookoutNotice(),
    alterationMemo(),
    auditHistory(),
    caseDiary(),
    updateChargeSheetStatus(),
    reportSagas(),
    form54(),
    advisoryMemos(),
    ReGeneratedFIRSaga(),
    courtCommittal(),
    ServingOfSummons(),
    issueOfSummons(),
    IssueOfWarrants(),
    executingOfWarrants(),
    noticeToSurety(),
    proclamationAndPropertyAttachments(),
    accusedDisposalForm(),
    courtDisposalForm(),
    appealOnJudgement(),
    deathOfAccused(),
    courtTransfer(),
    lokAdalatDisposal(),
    courtCaseDiary(),
    IcjsReports(),
  ]);
}
