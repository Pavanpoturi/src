import config from "../../config/site.config";

export const formOptions1 = [
  {
    value: "reportedCases",
    label: "Reported Cases",
    url: config?.reportedCasesUrl,
    enabled: true,
    isDivider: false,
  },
  {
    value: "activityWiseReport",
    label: "Activity Wise Report",
    url: config.activityWiseReportUrl,
    enabled: true,
    isDivider: false,
  },
  {
    value: "onlineCrimeReview",
    label: "Online Crime Review - Type 1(IPC-21 Major Head)",
    url: config.onlineCrimeReviewTypeUrl,
    enabled: false,
    isDivider: false,
  },
  {
    value: "accidentInformationReport",
    label: "Accident Information Report",
    url: config.accidentInformationReportUrl,
    enabled: true,
    isDivider: false,
  },
  {
    value: "actsAndSections",
    label: "Acts & Sections",
    url: config.actsAndSectionsUrl,
    enabled: true,
    isDivider: false,
  },
  {
    value: "cdfReport",
    label: "CDF Report",
    url: config.cdfReportUrl,
    enabled: true,
    isDivider: false,
  },
  {
    value: "itssoReport",
    label: "ITSSO Report",
    url: config.itssoReportUrl,
    enabled: true,
    isDivider: false,
  },
  {
    value: "accusedArrestReport",
    label: "Accused Arrest Report",
    url: config.accusedArrestReportURL,
    enabled: true,
    isDivider: false,
  },
  {
    value: "accusedsearchbasedonNameorBrieffacts",
    label: "Accused search based on Name or Brief facts",
    url: config.AccusedsearchbasedonNameorBrieffactsUrl,
    enabled: true,
    isDivider: false,
  },
  {
    value: "applicationUsageStatisticsCCTNS",
    label: "Application Usage Statistics – CCTNS",
    url: config.ApplicationUsageStatisticsUrl,
    enabled: true,
    isDivider: false,
  },
  {
    value: "dailyStatusReport",
    label: "Daily Status Report",
    url: config.DailyStatusReportUrl,
    enabled: true,
    isDivider: false,
  },
  {
    value: "courtDisposals",
    label: "Court Disposals",
    url: config.CourtDisposals,
    enabled: true,
    isDivider: false,
  },
];

export const formOptions2 = [
  {
    value: "zeroFirDashboard",
    label: "Zero FIR Dashboard",
    url: config.zeroFirDashboard,
    enabled: true,
    isDivider: false,
  },
  {
    value: "crpcMajorHead",
    label: "Online crime review type-2(Crpc)",
    url: config.crpcMajorHeadUrl,
    enabled: true,
    isDivider: false,
  },
  {
    value: "sllMajorHead",
    label: "Online crime review type-2(SLL)",
    url: config.sllMajorHeadUrl,
    enabled: true,
    isDivider: false,
  },
  {
    value: "crimeAgainstWomen",
    label: "Crime Against Women",
    url: config.crimesAgainestWomanUrl,
    enabled: true,
    isDivider: false,
  },
  {
    value: "crimeAgainstChildern",
    label: "Crime Against Children",
    url: config.crimesAgainestChildrenUrl,
    enabled: true,
    isDivider: false,
  },
  {
    value: "crimeAgainstScSt",
    label: "Crime Against SC/ST",
    url: config.crimesAgainestSCSTUrl,
    enabled: true,
    isDivider: false,
  },
  {
    value: "dashboardVisualisationReportedCases",
    label: "Dashboard Visualisation - Reported Cases",
    url: config.DasboardVisualisationUrl,
    enabled: true,
    isDivider: false,
  },
  {
    value: "missingPersonsReport",
    label: "Missing Persons Report",
    url: config.MissingPersonsReportUrl,
    enabled: true,
    isDivider: false,
  },
  {
    value: "CrimeReviewYearWise",
    label: "Crime Review: Year Wise",
    url: config.CrimeReview,
    enabled: true,
    isDivider: false,
  },
  {
    value: "AnnexureVPTCasesStatus",
    label: "Annexure V - PT Cases Status",
    url: config.AnnexureVPTCasesStatus,
    enabled: true,
    isDivider: false,
  },
  {
    value: "AnnexureIUICasesStatus",
    label: "Annexure I - UI Cases Status",
    url: config.AnnexureIUICasesStatus,
    enabled: true,
    isDivider: false,
  },
  {
    value: "courtSummons",
    label: "Court Summons",
    url: config.CourtSummons,
    enabled: true,
    isDivider: false,
  },
  {
    value: "crimeWarrants",
    label: "Crime Warrants",
    url: config.CrimeWarrants,
    enabled: true,
    isDivider: false,
  },
  {
    value: "onlineCrimeReviewType1ALL",
    label: "Online Crime Review Type 1: ALL",
    url: config.OnlineCrimeReviewType1ALL,
    enabled: true,
    isDivider: false,
  },
];

export const widgetData = [
  {
    title: "2",
    value: "Crime Core",
    bgColor: "white",
    fontColor: ["gray"],
    isGraveCrime: true,
  },
  {
    title: "2",
    value: "POCSO CRIMES",
    bgColor: "white",
    fontColor: ["gray"],
    isGraveCrime: true,
  },
  {
    title: "2",
    value: "NDPS CRIMES",
    bgColor: "white",
    fontColor: ["gray"],
    isGraveCrime: true,
  },
  {
    title: "1",
    value: "Crime Against SC/ST",
    bgColor: "white",
    fontColor: ["gray"],
    isGraveCrime: true,
  },
  {
    title: "0",
    value: "Crime Against Women",
    bgColor: "white",
    fontColor: ["gray"],
    isGraveCrime: true,
  },
];

export const dashboardDetails = [
  {
    caseCount: 8,
    caseStatus: "New",
    mobileType: "New FIR Assigned ",
    statusType: "new",
  },
  {
    caseCount: 0,
    caseStatus: "Zero FIRs",
    mobileType: "Zero FIRs",
    statusType: "zeroCases",
  },
  {
    caseCount: 9,
    caseStatus: "UI Cases",
    mobileType: "UI Cases",
    statusType: "uiCases",
  },
  {
    caseCount: 0,
    caseStatus: "CC Nos Awaited",
    mobileType: "CC Nos Awaited",
    statusType: "ccAwaited",
  },
  {
    caseCount: 4,
    caseStatus: "Disposal",
    mobileType: "Disposal",
    statusType: "disposal",
  },
  {
    caseCount: 0,
    caseStatus: "PT Cases",
    mobileType: "PT Cases",
    statusType: "ptCases",
  },
  {
    caseCount: 0,
    caseStatus: "Trial of Cases for the day",
    mobileType: "Trial of Cases for the day",
    statusType: "trialCases",
  },
  {
    caseCount: 21,
    caseStatus: "Total Cases",
    mobileType: "Total Cases",
    statusType: "totalCases",
  },
];

export const dropdownMap = [
  { type: "selectPoliceStation", value: "Select Police Station" },
  { type: "district", value: "District" },
  { type: "zones", value: "Zones" },
  { type: "division", value: "Division" },
  { type: "circle", value: "Circle" },
];

export const tableConfig = [
  "Cr.No.",
  "sectionOfLaw",
  "dateOfOccurence",
  "dateOfReport",
  "placeOfOccurence",
  "nameAndRankOfIO",
  "unitName",
  "actions",
];

export const dropdownOptins = [
  { item: "Today", value: "today" },
  { item: "Yesterday", value: "yesterday" },
  { item: "Last week", value: "lastWeek" },
  { item: "Current Month", value: "currentMonth" },
  { item: "Previous Month", value: "previousMonth" },
  { item: "Dated Between", value: "datedBetween" },
];

export const getMiniInvestigationData = [
  {
    title: "Place of Occurence",
    data: "",
  },
  {
    title: "Name of the Complainant",
    data: "",
  },
  {
    title: "Victim Details",
    data: "",
  },
  {
    title: "Accused Details",
    data: "",
  },
  {
    title: "Witness Details",
    data: "",
  },
];

export const AdvisoryMemodropdownOptins = [
  { item: "Select Template 1", value: "selectTemplate" },
  { item: "Select Template 2", value: "selectTemplate" },
  { item: "Select Template 3", value: "selectTemplate" },
  { item: "Select Template 4", value: "selectTemplate" },
];
