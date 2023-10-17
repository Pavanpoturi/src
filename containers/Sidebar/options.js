const options = [
  {
    key: "notifications-from-superior-officers",
    label: "common.notificationsFromSuperiorOfficers",
    leftIcon: "ion-calendar",
  },
  {
    key: "case-transfer",
    label: "common.caseTransFer",
    leftIcon: "ion-calendar",
  },
  {
    key: "reports",
    label: "common.reports",
    leftIcon: "ion-calendar",
    children: [
      {
        key: "accident-information-report",
        label: "common.accidentInformationReport",
      },
      {
        key: "dsr-reports",
        label: "common.dailySituationReport",
      },
      {
        key: "fsl-status-report",
        label: "common.FSLStatusReport",
      },
    ],
  },
];

export default options;
