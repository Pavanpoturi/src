import moment from "moment";
import { DATE_FORMAT_MM } from "@containers/FirDetails/fir-util";
import { isEmpty, first } from "lodash";

export const getCommonPayload = (savedFir, firType, isDraft) => {
  const firDetail = savedFir?.firDetail;
  const payload = {
    crimeId: savedFir?._id,
    preCrimeId: savedFir?.preCrime?._id,
    crimeSceneId: savedFir?.crimeScene,
    planOfActionId: savedFir?.planOfAction,
    crimeLocationId: savedFir?.crimeLocationId,
    firType: firType,
    isDraft: isDraft,
    firDetail: {
      crimeType: firDetail?.crimeType,
      crimeSubType: firDetail?.crimeSubType,
      petitionNo: firDetail?.petitionNo,
      gravity: firDetail?.gravity,
      actsAndSections: firDetail?.actsAndSections,
      majorMinorClassification: firDetail?.majorMinorClassification,
      occurenceOfOffence: firDetail?.occurenceOfOffence,
      placeOfOccurence: firDetail?.placeOfOccurence,
      briefFacts: firDetail?.briefFacts,
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
  return payload;
};

export const occurenceDataPayload = (values, placeOfOffence, gdValues) => {
  const payload = {
    occurenceOfOffence: {
      fromDate: values.From_date ? values.From_date : "",
      toDate: values.End_date ? values.End_date : "",
      timePeriod: values?.Time_period,
      priorToDate: values.Prior_to ? values.Prior_to : "",
      firDate: values.FIR_date_time ? values.FIR_date_time : "",
      informationReceivedAtPS: values.Information_received_at_PS
        ? values.Information_received_at_PS
        : "",
      informationType: values.Information_type,
      gdNumber: gdValues.GD_entry_number ? gdValues.GD_entry_number : "",
      gdDate: gdValues.GD_entry_date ? gdValues.GD_entry_date : "",
      entryOfficerName: gdValues.entryOfficerName
        ? gdValues.entryOfficerName
        : "",
      typeOfGdntry: gdValues.typeOfGDEntry ? gdValues.typeOfGDEntry : "",
      gdEntryDetails: gdValues.GDBriefDetails ? gdValues.GDBriefDetails : "",
      reasonForDelay: values.reasonForDelay,
    },
    placeOfOccurance: {
      psLimits: placeOfOffence,
      state: values.state,
      cityDistrict: values.City,
      pinCode: values.pinCode,
      ps: values.PS,
      directions: values.Directions_from_ps_text,
      directionsFromPS: values.Directions_from_ps,
      distanceFromPS: values.distanceFromPS,
      longitude: values.longitude,
      latitude: values.latitude,
      beatNo: values.Beat_no,
      houseNo: values.Pleace_house_no,
      streetRoadNo: values.Street_road_no,
      landmarkMilestone: values.Landmark_milestone,
      areaMandal: values.Jurisdiction_mandal,
      wardColony: values.Ward_Colony_Village,
    },
  };
  return payload;
};

export const briefFactPayloadData = (values) => {
  const payload = {
    factsOfComplainant: values.factsOfComplainant,
    actionTaken: values.Action_Taken,
    refusedReason: values.reason,
    ioAssigned: values.Investigation_Assigned_to,
    isSecret: values.isSecret,
    courtName: values.Court_Name,
    dateOfCourtDispatch: values.Date_of_dispatch_to_court,
    firIssuedBy: values.FIR_issued_by,
    firEnteredBy: values.FIR_entered_by,
  };
  return payload;
};
