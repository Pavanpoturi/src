export const arrestForms = {
  actionOptions: [
    { label: "Apprehension", arrestProcess: [] },
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
      label: "CCL Out of Country",
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
      label: "Apprehension By Police",
      arrestProcess: [
        {
          name: "Apprehension Memo",
          label: "Apprehension Memo",
          fileName: "Apprehension_Memo",
          templateAvailable: true,
        },
        {
          name: "Generate XV Juvenile Justice Act 2000 Notice",
          label: "Generate XV Juvenile Justice Act 2000 Notice",
          fileName: "XV_Juvenile_Justice_Act_2000_Notice",
          templateAvailable: true,
        },
        {
          name: "Generate Potency Test Requisition",
          label: "Generate Potency Test Requisition",
          fileName: "Potency_Test_Requisition",
          templateAvailable: true,
        },
        {
          name: "Generate Age Determination Requisition",
          label: "Generate Age Determination Requisition",
          fileName: "Age_Determination_Requisition",
          templateAvailable: true,
        },
        {
          name: "Night Custody Requisition to Observation Home",
          label: "Night Custody Requisition to Observation Home",
          fileName: "Night_Custody_Requisition_to_Observation_Home",
          templateAvailable: true,
        },
      ],
    },
    {
      label: "Apprehension by other Police",
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
      label: "Apprehension on Anticipatory Bail",
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
      label: "Apprehension on Surrender in Police Station",
    },
  ],
  arrestByPolice: [
    {
      name: "placeOfTakenIntoCustody",
      label: "Place of Apprehension",
      type: "text",
    },
    {
      name: "dateTimeOfCustody",
      label: "Date & Time of Bringing to PS",
      type: "date",
    },
    { name: "accusedCode", label: "CCL Code", type: "text" },
    {
      name: "dateAndTimeOfArrest",
      label: "Date & Time of Apprehensions",
      type: "date",
    },
  ],
  arrestByOtherPolice: [
    { name: "accusedCode", label: "CCL Code", type: "text" },
    {
      name: "dateTimeOfArrestByOtherPolice",
      label: "Apprehensioned By other Police On",
      type: "date",
    },
    {
      name: "durationOfJudicialCustody",
      label: "Duration of Judicial Custody in Other Police Station",
      type: "text",
    },
  ],
  arrestOnBail: [
    { name: "accusedCode", label: "CCL Code", type: "text" },
    {
      name: "dateAndTimeOfSurrender",
      label: "Date & Time of Surrender before Police",
      type: "date",
    },
  ],
  intimationOfArrest: [
    {
      name: "selectPerson",
      label: "Parent/Guardian",
      type: "text",
      actionLink: "addPerson",
      actionName: "Enter Person Details",
    },
    {
      name: "relationToAccused",
      label: "Relation to CCL",
      type: "dropdown",
    },

    { name: "intimatedDate", label: "Date Of Intimation", type: "date" },
    // {
    //   // name: "selectPerson",
    //   // label: "Select Person",
    //   // type: "dropdown",
    //
    // },
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
    { name: "unitOrDistrict", label: "Unit/District", type: "text" },
    { name: "otherPsName", label: "Other PS Name", type: "text" },
    {
      name: "arrestedByOtherPsIoName",
      label: "Name of the IO of other PS who Apprehensioned",
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
