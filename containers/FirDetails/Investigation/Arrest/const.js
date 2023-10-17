export const arrestForms = {
  actionOptions: [
    { label: "Arrest", arrestProcess: [] },
    {
      label: "Surrender in Court",
      arrestProcess: [
        {
          name: "Bail cancellation requisition",
          label: "Generate Bail cancellation requisition",
          fileName: "Bail_cancellation_requisition",
          templateAvailable: true,
        },
      ],
    },
    {
      label: "High Court Directions",
      arrestProcess: [
        {
          name: "Bail cancellation requisition",
          label: "Generate Bail cancellation requisition",
          fileName: "Bail_cancellation_requisition",
          templateAvailable: true,
        },
      ],
    },
    {
      label: "Accused Out of Country",
      arrestProcess: [
        {
          name: "Request for NBW",
          label: "Generate Request for NBW",
          fileName: "Request_for_NBW",
          templateAvailable: true,
        },
        {
          name: "LOC form",
          label: "Generate LOC to SP",
          fileName: "LOC_form",
          templateAvailable: true,
        },
        {
          name: "Red corner notice",
          label: "Generate Red corner notice",
          fileName: "Red_corner_notice",
          templateAvailable: false,
        },
        {
          name: "Blue corner notice",
          label: "Generate Blue corner notice",
          fileName: "Blue_corner_notice",
          templateAvailable: false,
        },
      ],
    },
    {
      label: "Surrender on Anticipatory Bail in Court",
      arrestProcess: [
        {
          name: "Bail cancellation petition",
          label: "Generate Bail cancellation petition",
          fileName: "Bail_cancellation_petition",
          templateAvailable: true,
        },
      ],
    },
  ],
  arrestOptions: [
    {
      label: "Arrest By Police",
      arrestProcess: [
        {
          name: "50 crpc notice",
          label: "Generate 50 Cr.P.C Notice",
          fileName: "50_Cr_P.C_Notice",
          templateAvailable: true,
        },
        {
          name: "50A crpc notice",
          label: "Generate 50A Cr.P.C Notice",
          fileName: "50A_Cr_P.C_Notice",
          templateAvailable: true,
        },
        {
          name: "54 crpc notice",
          label: "Generate 54 Cr.P.C Notice",
          fileName: "54_Cr_P.C_Notice",
          templateAvailable: true,
        },
        {
          name: "Potency test requisition",
          label: "Generate Potency Test Requisition",
          fileName: "Potency_Test_Requisition",
          templateAvailable: true,
        },
        {
          name: "Arrest memo",
          label: "Generate Arrest memo",
          fileName: "Arrest_memo",
          templateAvailable: true,
        },
        {
          name: "Arrest of Accused INTIMATION to local police officer",
          label:
            "Generate Arrest Of Accused Intimation To Local Police Officer",
          fileName: "Arrest_Of_Accused_Intimation_To_Local_Police_Officer",
          templateAvailable: true,
        },
      ],
    },
    {
      label: "Arrest by other Police",
      arrestProcess: [
        {
          name: "Request for PT warrant",
          label: "Generate Request for PT Warrant",
          fileName: "Request_for_PT_Warrant",
          templateAvailable: true,
        },
        {
          name: "Request to unit officer to go out of state",
          label: "Generate Request to unit officer to go out of state",
          fileName: "Request_to_unit_officer_to_go_out_of_state",
          templateAvailable: true,
        },
        {
          name: "Transit warrant regularization",
          label: "Generate PT Warrant Regularization",
          fileName: "PT_Warrant_regularization",
          templateAvailable: true,
        },
        {
          name: "Potency test requisition",
          label: "Generate Potency test requisition",
          fileName: "Potency_Test_Requisitions",
          templateAvailable: true,
        },
      ],
    },
    {
      label: "Arrest on Anticipatory Bail",
      arrestProcess: [
        {
          name: "Potency test requisition",
          label: "Generate Potency test requisition",
          fileName: "Potency_Test_Requisition_On_Anticipatory_Bail",
          templateAvailable: true,
        },
        {
          name: "Bail cancellation petition",
          label: "Generate Bail cancellation petition",
          fileName: "Bail_cancellation_petition",
          templateAvailable: true,
        },
      ],
    },
    {
      label: "Arrest on Surrender in Police Station",
    },
  ],
  arrestByPolice: [
    {
      name: "placeOfTakenIntoCustody",
      label: "Place of Taken into Custody",
      type: "text",
    },
    {
      name: "dateTimeOfCustody",
      label: "Taken into Custody On",
      type: "date",
    },
    {
      name: "apprehendedBy",
      label: "Apprehended By",
      type: "dropdown",
    },
    {
      name: "iOAssistedBy",
      label: "IO assisted by",
      type: "dropdown",
    },
    { name: "accusedCode", label: "Accused Code", type: "text" },
    { name: "placeOfArrest", label: "Place of Arrest", type: "text" },
    { name: "courtName", label: "Court Name", type: "dropdown" },
    {
      name: "dateAndTimeOfArrest",
      label: "Arrested On",
      type: "date",
    },
  ],
  arrestByOtherPolice: [
    { name: "accusedCode", label: "Accused Code", type: "text" },
    {
      name: "dateTimeOfArrestByOtherPolice",
      label: "Arrested By other Police On",
      type: "date",
    },
    {
      name: "durationOfJudicialCustody",
      label: "Duration of Judicial Custody in Other Police Station",
      type: "text",
    },
  ],
  arrestOnBail: [
    { name: "accusedCode", label: "Accused Code", type: "text" },
    {
      name: "dateAndTimeOfSurrender",
      label: "Date & Time of Surrender before Police",
      type: "date",
    },
  ],
  intimationOfArrest: [
    {
      name: "relationToAccused",
      label: "Relation to Accused",
      type: "dropdown",
    },
    {
      name: "selectPerson",
      label: "Select Person",
      type: "dropdown",
      actionLink: "addPerson",
      actionName: "Add New Person",
    },
    {
      name: "modeOfIntimation",
      label: "Mode of Intimation",
      type: "dropdown",
    },
    { name: "intimatedDate", label: "Date Of Intimation", type: "date" },
  ],
  intimationReceived: [
    {
      name: "psCrimeConfessed",
      label: "This PS Crime Confessed",
      type: "dropdown",
    },
    {
      name: "otherPsCrimeNumber",
      label: "Other PS Crime Number",
      type: "text",
    },
    {
      name: "intimationReceivedDate",
      label: "Intimation Received on Date",
      type: "date",
    },
    { name: "courtName", label: "Court Name", type: "dropdown" },
    { name: "sectionOfLaw", label: "Section of Law", type: "label" },
    { name: "jailName", label: "Jail Name", type: "dropdown" },
    { name: "underTrialNo", label: "Under Trial No.", type: "text" },
    {
      name: "dateOfPTWarrantRequisition",
      label: "Date of PT Warrant Requisition",
      type: "date",
    },
    { name: "unitOrDistrict", label: "Unit/District", type: "dropdown" },
    { name: "otherPsName", label: "Other PS Name", type: "text" },
    {
      name: "arrestedByOtherPsIoName",
      label: "Name of the IO of other PS who Arrested",
      type: "text",
    },
  ],
  otherStateSelected: [
    {
      name: "dateOfTravelToOtherState",
      label: "Date of Travel to Other State",
      type: "date",
    },
  ],
  addLocation: [
    {
      name: "name",
      label: "Name",
      type: "text",
    },
    {
      name: "surname",
      label: "Surname",
      type: "text",
    },
    { name: "occupation", label: "Occupation", type: "dropdown" },
    {
      name: "educationQualification",
      label: "Educational Qualification",
      type: "dropdown",
    },
  ],
};
