import { config } from "@config/site.config";
import { isEmpty, isUndefined, first } from "lodash";
import axios from "axios";
import {
  folderName,
  getMediaUploadError,
  getMediaPayload,
  getPersonDetails,
  getSavedDataResult,
} from "../fir-util";

export const submitRoughSketchUpload = (
  roughSketchFiles,
  crimeId,
  selectedCategory,
  dispatch,
  updateRoughSketch,
  openNotificationWithIcon,
  crimeSceneDate,
  setRoughSketchFiles
) => {
  const formData = new FormData();
  roughSketchFiles.forEach((file) => {
    formData.append("file", file.originFileObj);
  });
  formData.append("prefixFolder", crimeId);
  formData.append("folderPath", `${folderName}/Category/${selectedCategory}`);
  if (!isEmpty(roughSketchFiles)) {
    axios
      .post(`${config.fileUpload}/upload`, formData)
      .then((res) => {
        if (res.status === 200) {
          const { data } = res.data;
          const roughSketches = [];
          !isEmpty(data) &&
            data.forEach((element) => {
              roughSketches.push({
                category: selectedCategory,
                mimeType: element.mimeType,
                name: element.name,
                url: element.url,
                fileId: element?.id,
                userDate: crimeSceneDate,
              });
            });
          const addRoughSketchPayload = {
            crimeId: crimeId,
            roughSketch: roughSketches,
          };
          dispatch(
            updateRoughSketch(config.roughSketch, addRoughSketchPayload)
          );
          setRoughSketchFiles([]);
        }
      })
      .catch((err) => {
        getMediaUploadError(err, openNotificationWithIcon);
      });
  }
};

export const handleSubmitRequest = (
  crimeId,
  values,
  crimeSceneDate,
  editSceneofOffenseObj,
  dispatch,
  updateCrimeLocation,
  createCrimeLocation,
  getSelectedCrimeLocation,
  setNewSceneOfOffence
) => {
  const addSceneofOffensePayload = {
    crimeId: crimeId,
    userDate: crimeSceneDate,
    crimeLocation: {
      address1: values.address1,
      address2: values.address2,
      city: values.city,
      state: values.state,
      district: values.district,
      pincode: values.pincode,
      landmark: values.landmark,
      description: values.description,
      latitude: values.latitude,
      longitude: values.longitude,
      dateCreated: crimeSceneDate,
    },
  };

  const updateSceneofOffensePayload = {
    crimeId: crimeId,
    crimeLocation: {
      userDate: crimeSceneDate,
      _id: editSceneofOffenseObj?.address?._id,
      address1: values.address1,
      address2: values.address2,
      city: values.city,
      state: values.state,
      district: values.district,
      pincode: values.pincode,
      landmark: values.landmark,
      description: values.description,
      latitude: values.latitude,
      longitude: values.longitude,
      dateCreated: crimeSceneDate,
    },
  };
  if (editSceneofOffenseObj?.address?._id) {
    dispatch(
      updateCrimeLocation(
        config.updateCrimeLocation,
        updateSceneofOffensePayload
      )
    );
  } else {
    dispatch(
      createCrimeLocation(config.crimeLocation, addSceneofOffensePayload)
    );
  }
  getSelectedCrimeLocation();
  setNewSceneOfOffence(false);
};

export const panchWitnessSubmit = (
  values,
  crimeId,
  punchwitnessinputList,
  crimeSceneDate,
  editPanchWitnessObj,
  dispatch,
  editPunchWitness,
  updatePunchWitness
) => {
  const addPanchWitnessPayload = {
    crimeId: crimeId,
    witnessDetail: {
      lastupdateddatetime: Date.now(),
      witnessType: "PANCHWITNESS",
      person: getPersonDetails(
        {
          ...values,
          createdFrom: "Crime Scene",
          createdFor: "Panch Witness",
        },
        punchwitnessinputList
      ),
      userDate: crimeSceneDate,
    },
  };

  const updatePanchWitnessPayload = {
    crimeId: crimeId,
    panchWitnessId: editPanchWitnessObj?.person?._id,
    witnessDetail: {
      witnessType: "PANCHWITNESS",
      person: getPersonDetails(values, punchwitnessinputList),
      date_created: editPanchWitnessObj?.person.dateCreated,
    },
  };

  if (editPanchWitnessObj?._id) {
    dispatch(
      editPunchWitness(config.updatePanchWitness, updatePanchWitnessPayload)
    );
  } else {
    dispatch(
      updatePunchWitness(config.addPanchWitness, addPanchWitnessPayload)
    );
  }
};

export const witnessDetailsSubmit = (
  values,
  crimeId,
  inputFileList,
  editWitnessDetailsObj,
  selectedCategory,
  witnessDetailsInputList,
  crimeSceneDate,
  dispatch,
  editWitnessStatement,
  updateWitnessStatement,
  openNotificationWithIcon
) => {
  const mediaFormData = new FormData();
  inputFileList.forEach((file) => {
    mediaFormData.append("file", file.originFileObj);
  });
  mediaFormData.append("prefixFolder", crimeId);
  mediaFormData.append(
    "folderPath",
    `${crimeId}/${folderName.WITNESS_DETAILS}/media`
  );
  if (!isEmpty(inputFileList)) {
    axios
      .post(`${config.fileUpload}/upload`, mediaFormData)
      .then((res) => {
        if (res.status === 200) {
          const { data } = res.data;
          const mediaDetails = editWitnessDetailsObj?.person?.media;
          const mediaResult = isUndefined(mediaDetails)
            ? getMediaPayload(data, selectedCategory)
            : [...mediaDetails, ...getMediaPayload(data, selectedCategory)];
          const updateMediaResult = isEmpty(mediaDetails)
            ? getMediaPayload(data, selectedCategory)
            : mediaResult;
          const addWitnessDetailsPayload = {
            crimeId: crimeId,
            witnessDetail: {
              lastupdateddatetime: Date.now(),
              person: getPersonDetails(
                {
                  ...values,
                  createdFrom: "Crime Scene",
                  createdFor: "Witness Details",
                },
                witnessDetailsInputList,
                getMediaPayload(data, selectedCategory)
              ),
              userDate: crimeSceneDate,
            },
          };
          const updateWitnessDetailPayload = {
            crimeId: crimeId,
            isChargeSheet: editWitnessDetailsObj?.isChargeSheet,
            isExamined: editWitnessDetailsObj?.isExamined,
            witnessId: editWitnessDetailsObj?.person?._id,
            witnessDetail: getPersonDetails(
              values,
              witnessDetailsInputList,
              updateMediaResult
            ),
          };
          if (
            !isUndefined(editWitnessDetailsObj?.person) &&
            editWitnessDetailsObj?.person?._id
          ) {
            dispatch(
              editWitnessStatement(
                config.updateWitnessDetail,
                updateWitnessDetailPayload
              )
            );
          } else {
            dispatch(
              updateWitnessStatement(
                config.addWitnessDetails,
                addWitnessDetailsPayload
              )
            );
          }
        }
      })
      .catch((err) => {
        getMediaUploadError(err, openNotificationWithIcon);
      });
  } else if (isEmpty(inputFileList)) {
    const mediaDetails = editWitnessDetailsObj?.person?.media;
    const updateMediaResult = isEmpty(mediaDetails) ? [] : mediaDetails;
    const addWitnessDetailsPayload = {
      crimeId: crimeId,
      witnessDetail: {
        lastupdateddatetime: Date.now(),
        person: getPersonDetails(
          {
            ...values,
            createdFrom: "Crime Scene",
            createdFor: "Witness Details",
          },
          witnessDetailsInputList,
          []
        ),
        userDate: crimeSceneDate,
      },
    };
    const updateWitnessDetailPayload = {
      crimeId: crimeId,
      isChargeSheet: editWitnessDetailsObj?.isChargeSheet,
      isExamined: editWitnessDetailsObj?.isExamined,
      witnessId: editWitnessDetailsObj?.person?._id,
      witnessDetail: getPersonDetails(
        values,
        witnessDetailsInputList,
        updateMediaResult
      ),
    };
    if (
      !isUndefined(editWitnessDetailsObj?.person) &&
      editWitnessDetailsObj?.person?._id
    ) {
      dispatch(
        editWitnessStatement(
          config.updateWitnessDetail,
          updateWitnessDetailPayload
        )
      );
    } else {
      dispatch(
        updateWitnessStatement(
          config.addWitnessDetails,
          addWitnessDetailsPayload
        )
      );
    }
  }
};

export const expertTeamSubmit = (
  values,
  crimeId,
  inputFileList,
  crimeSceneDate,
  selectedCategory,
  editExpertTeamObj,
  dispatch,
  updateExpertTeam,
  addExpertTeam,
  openNotificationWithIcon
) => {
  const mediaFormData = new FormData();
  inputFileList.forEach((file) => {
    mediaFormData.append("file", file.originFileObj);
  });
  mediaFormData.append("prefixFolder", crimeId);
  mediaFormData.append(
    "folderPath",
    `${crimeId}/${folderName.EXPERT_TEAM_DETAILS}/media`
  );

  if (!isEmpty(inputFileList)) {
    axios
      .post(`${config.fileUpload}/upload`, mediaFormData)
      .then((res) => {
        if (res.status === 200) {
          const { data } = res.data;
          let request = {
            crimeId: crimeId,
            userDate: crimeSceneDate,
            name: values.name,
            role: values.role,
            observation: values.initialObservation,
            expertTeamMedia: getMediaPayload(data, selectedCategory),
          };
          if (editExpertTeamObj?._id) {
            const updatedRequest = {
              _id: editExpertTeamObj?._id,
              ...request,
            };
            dispatch(
              updateExpertTeam(config.updateExpertTeamDetails, updatedRequest)
            );
          } else {
            dispatch(addExpertTeam(config.addExpertTeamDetails, request));
          }
        }
      })
      .catch((err) => {
        getMediaUploadError(err, openNotificationWithIcon);
      });
  } else if (isEmpty(inputFileList)) {
    let request = {
      crimeId: crimeId,
      userDate: crimeSceneDate,
      name: values.name,
      role: values.role,
      observation: values.initialObservation,
      expertTeamMedia:
        editExpertTeamObj?.mediaDetails &&
        !isEmpty(editExpertTeamObj?.mediaDetails)
          ? editExpertTeamObj?.mediaDetails
          : [],
    };
    if (editExpertTeamObj?._id) {
      const updatedRequest = {
        _id: editExpertTeamObj?._id,
        ...request,
      };
      dispatch(
        updateExpertTeam(config.updateExpertTeamDetails, updatedRequest)
      );
    } else {
      dispatch(addExpertTeam(config.addExpertTeamDetails, request));
    }
  }
};

const getCommonMaterialObjectPayload = (
  values,
  materialObjectMedia,
  seizureReport,
  crimeId,
  addAddress,
  crimeSceneDate
) => {
  const result = {
    crimeId: crimeId,
    type: values.type,
    subType: values.subType,
    panchWitness: values.panchWitness,
    description: values.description,
    seizedFrom: values.seizedFrom,
    seizedDate: values.seizedDate,
    seizedBy: values.seizedBy,
    strengthOfEvidence: values.strengthOfEvidence,
    placeofSeizure: {
      address1: addAddress?.address1 ? addAddress.address1 : "",
      address2: addAddress?.address2 ? addAddress.address2 : "",
      city: addAddress?.city ? addAddress.city : "",
      district: addAddress?.district ? addAddress.district : "",
      pincode: addAddress?.pincode ? addAddress.pincode : "",
      landmark: addAddress?.landmark ? addAddress.landmark : "",
      description: addAddress?.description ? addAddress.description : "",
      latitude: addAddress?.latitude ? addAddress.latitude : "",
      longitude: addAddress?.longitude ? addAddress.longitude : "",
      _id: addAddress?._id ? addAddress?._id : null,
    },
    materialObjectMedia: materialObjectMedia,
    seizureReport: {
      url: seizureReport?.url,
      name: seizureReport?.name,
      type: seizureReport?.mimeType,
      fileId: seizureReport?.id,
    },
    userDate: crimeSceneDate,
  };
  return result;
};

export const materialObjectSubmit = (
  values,
  crimeId,
  crimeSceneDate,
  inputFileList,
  seizureReport,
  editMaterialObjectObj,
  selectedCategory,
  addAddress,
  dispatch,
  editMaterialObject,
  createMaterialObject,
  setSeizureReport,
  openNotificationWithIcon
) => {
  const mediaFormData = new FormData();
  inputFileList.forEach((file) => {
    mediaFormData.append("file", file.originFileObj);
  });
  mediaFormData.append("prefixFolder", crimeId);
  mediaFormData.append(
    "folderPath",
    `${crimeId}/${folderName.MATERIAL_OBJECTS}/media`
  );

  const seizureReportData = new FormData();
  seizureReport.forEach((file) => {
    seizureReportData.append("file", file.originFileObj);
  });
  seizureReportData.append("prefixFolder", crimeId);
  seizureReportData.append(
    "folderPath",
    `${crimeId}/${folderName.MATERIAL_OBJECTS}/file`
  );

  if (!isEmpty(inputFileList) && !isEmpty(seizureReport)) {
    axios
      .all([
        axios.post(`${config.fileUpload}/upload`, mediaFormData),
        axios.post(`${config.fileUpload}/upload`, seizureReportData),
      ])
      .then(
        axios.spread((data1, data2) => {
          if (data1.status === 200 && data2.status === 200) {
            const mediaFormDataResult = data1.data?.data;
            const seizureReportDataResult = first(data2.data?.data);
            const materialObjectMedia =
              editMaterialObjectObj?.materialObjectMedia;
            const mediaResult = isUndefined(materialObjectMedia)
              ? getMediaPayload(mediaFormDataResult, selectedCategory)
              : [
                  ...materialObjectMedia,
                  ...getMediaPayload(materialObjectMedia, selectedCategory),
                ];
            const updateMediaResult =
              !isUndefined(materialObjectMedia) && isEmpty(materialObjectMedia)
                ? getMediaPayload(mediaFormDataResult, selectedCategory)
                : mediaResult;
            const addMaterialObjectPayload = getCommonMaterialObjectPayload(
              values,
              getMediaPayload(mediaFormDataResult, selectedCategory),
              seizureReportDataResult,
              crimeId,
              addAddress,
              crimeSceneDate
            );
            const updateMaterialObjectPayload = {
              _id: editMaterialObjectObj?._id,
              ...getCommonMaterialObjectPayload(
                values,
                updateMediaResult,
                seizureReportDataResult,
                crimeId,
                addAddress,
                crimeSceneDate
              ),
            };
            if (editMaterialObjectObj?._id) {
              dispatch(
                editMaterialObject(
                  config.updateMaterialObject,
                  updateMaterialObjectPayload
                )
              );
            } else {
              dispatch(
                createMaterialObject(
                  config.addMaterialObject,
                  addMaterialObjectPayload
                )
              );
            }
            setSeizureReport([]);
          }
        })
      )
      .catch((err) => {
        getMediaUploadError(err, openNotificationWithIcon);
      });
  } else if (isEmpty(inputFileList) && !isEmpty(seizureReport)) {
    axios
      .post(`${config.fileUpload}/upload`, seizureReportData)
      .then((res) => {
        if (res.status === 200) {
          const updateMediaResult = isEmpty(
            editMaterialObjectObj?.materialObjectMedia
          )
            ? []
            : editMaterialObjectObj?.materialObjectMedia;
          const { data } = res.data;
          const payloadData = first(data);
          const addMaterialObjectPayload = getCommonMaterialObjectPayload(
            values,
            [],
            payloadData,
            crimeId,
            addAddress,
            crimeSceneDate
          );
          const updateMaterialObjectPayload = {
            _id: editMaterialObjectObj?._id,
            ...getCommonMaterialObjectPayload(
              values,
              updateMediaResult,
              payloadData,
              crimeId,
              addAddress
            ),
          };
          if (editMaterialObjectObj?._id) {
            dispatch(
              editMaterialObject(
                config.updateMaterialObject,
                updateMaterialObjectPayload
              )
            );
          } else {
            dispatch(
              createMaterialObject(
                config.addMaterialObject,
                addMaterialObjectPayload
              )
            );
          }
          setSeizureReport([]);
        }
      })
      .catch((err) => {
        getMediaUploadError(err, openNotificationWithIcon);
      });
  } else if (isEmpty(seizureReport) && !isEmpty(inputFileList)) {
    axios
      .post(`${config.fileUpload}/upload`, mediaFormData)
      .then((res) => {
        if (res.status === 200) {
          const { data } = res.data;
          const mediaResult = editMaterialObjectObj?.materialObjectMedia && [
            ...editMaterialObjectObj?.materialObjectMedia,
            ...getMediaPayload(data, selectedCategory),
          ];
          const updateMediaResult = isEmpty(
            editMaterialObjectObj?.materialObjectMedia
          )
            ? getMediaPayload(data, selectedCategory)
            : mediaResult;
          const existingSeizureReport = !isUndefined(
            editMaterialObjectObj?.seizureReport
          )
            ? editMaterialObjectObj?.seizureReport
            : {};
          const addMaterialObjectPayload = getCommonMaterialObjectPayload(
            values,
            getMediaPayload(data, selectedCategory),
            {},
            crimeId,
            addAddress,
            crimeSceneDate
          );
          const updateMaterialObjectPayload = {
            _id: editMaterialObjectObj?._id,
            ...getCommonMaterialObjectPayload(
              values,
              updateMediaResult,
              existingSeizureReport,
              crimeId,
              addAddress,
              crimeSceneDate
            ),
          };
          if (editMaterialObjectObj?._id) {
            dispatch(
              editMaterialObject(
                config.updateMaterialObject,
                updateMaterialObjectPayload
              )
            );
          } else {
            dispatch(
              createMaterialObject(
                config.addMaterialObject,
                addMaterialObjectPayload
              )
            );
          }
          setSeizureReport([]);
        }
      })
      .catch((err) => {
        getMediaUploadError(err, openNotificationWithIcon);
      });
  } else if (isEmpty(seizureReport) && isEmpty(inputFileList)) {
    const updateMediaResult = isEmpty(
      editMaterialObjectObj?.materialObjectMedia
    )
      ? []
      : editMaterialObjectObj?.materialObjectMedia;
    const addMaterialObjectPayload = getCommonMaterialObjectPayload(
      values,
      [],
      {},
      crimeId,
      addAddress,
      crimeSceneDate
    );
    const existingSeizureReport = !isUndefined(
      editMaterialObjectObj?.seizureReport
    )
      ? editMaterialObjectObj?.seizureReport
      : {};

    const updateMaterialObjectPayload = {
      _id: editMaterialObjectObj?._id,
      ...getCommonMaterialObjectPayload(
        values,
        updateMediaResult,
        existingSeizureReport,
        crimeId,
        addAddress,
        crimeSceneDate
      ),
    };
    if (editMaterialObjectObj?._id) {
      dispatch(
        editMaterialObject(
          config.updateMaterialObject,
          updateMaterialObjectPayload
        )
      );
    } else {
      dispatch(
        createMaterialObject(config.addMaterialObject, addMaterialObjectPayload)
      );
    }
    setSeizureReport([]);
  }
};

export const crimeClassificationSubmit = (
  values,
  classificationType,
  photographsTaken,
  selectedPerson,
  crimeId,
  dispatch,
  addUpdateCrimeClassification,
  selectedAddressID
) => {
  let bodilyRequest = {
    crimeId: crimeId,
    crimeClassification: {
      address: selectedAddressID,
      classification: values.classification,
      majorHead: values.majorHead,
      minorHead: values.minorHead,
      deadBody: {
        state: values.state,
        height: values.height,
        complexion: values.complexion,
        eyeColor: values.eyeColor,
        hairColor: values.hairColor,
        teeth: values.teeth,
        beard: values.beard,
        bodyBuiltType: values.bodyBuiltType,
        moles: values.moles,
        mustache: values.mustache,
        wallet: values.walletOrIdFoundText,
        walletFound: values.walletOrIdFound,
        photographsTaken: values.whetherPhotographsTaken,
        fingerPrintTaken: values.whetherFingerPrintsTaken,
        photographs: {
          name: photographsTaken.name ? photographsTaken.name : "",
          url: photographsTaken.url ? photographsTaken.url : "",
          mimeType: photographsTaken.mimeType ? photographsTaken.mimeType : "",
        },
        approxAge: values.approxAge,
        gender: values.gender,
        deformitiesType: values.deformitiesType,
        deformities: values.deformities,
        tattoo: values.tattooMarks,
        valuables: values.valuables,
        tailorMarksDetails: values.tailorMarksDetails,
        visibleInjuries: values.visibleInjuries,
        killSpotBrought: values.killSpotBrought,
      },
      bodyAt: values.bodyAt,
      pmeConducted: values.pmeConducted,
    },
  };

  let roadAccidentRequest = {
    crimeId: crimeId,
    crimeClassification: {
      address: selectedAddressID,
      classification: values.classification,
      majorHead: values.majorHead,
      minorHead: values.minorHead,
      roadAccident: {
        roadDetails: {
          roadType: values.roadType,
          roadSurface: values.roadSurface,
          surfaceCondition: values.surfaceCondition,
          surfaceNature: values.surfaceNature,
          surfaceHorizontalFeatures: values.surfaceHorizontalFeatures,
          surfaceVerticalFeatures: values.surfaceVerticalFeatures,
          surfaceCarriageWayWidth: values.surfaceCarriageWayWidth,
          junctionType: values.junctionType,
          trafficControlType: values.trafficControlType,
        },
        accidentType: values.accidentType,
        accidentClassification: values.accidentClassification,
        accidentLocation: values.accidentLocation,
        severity: values.severity,
        maneuver: values.maneuver,
        victimManeuver: values.victimManeuver,
        areaType: values.areaType,
        weatherCondition: values.weatherCondition,
        causeOfAccident: values.causeOfAccident,
        faultOfDriver: values.faultOfDriver,
        nature: values.nature,
        victimNature: values.victimNature,
        vehicleDetails: values.vehicleDetails,
        vehicleDetailsNew: values.vehicleDetailsNew,
        driverDetails: {
          known: values.known,
          personDetails: selectedPerson,
          licenseType: values.licenseType,
          personDrivingVehicle: values.personDrivingVehicle,
          isDriverLeftHanded: values.isDriverLeftHanded,
          licenseCancelledOrSuspended: values.licenseCancelledOrSuspended,
          hasAnyDeformities: values.hasAnyDeformities,
          otherInformation: {
            mviInspection: values.mviInspection,
            noMviReason: values.noMviReason,
            tripSheetsIfAny: values.tripSheetsIfAny,
            documentsIfAny: values.documentsIfAny,
          },
        },
      },
    },
  };

  let otherRequest = {
    crimeId: crimeId,
    crimeClassification: {
      address: selectedAddressID,
      classification: values.classification,
      majorHead: values.majorHead,
      minorHead: values.minorHead,
      other: {
        languagesSpeak: values.languagesSpeak,
        languagesWrite: values.languagesWrite,
        complexion: values.complexion,
        height: values.height,
        bodyBuiltType: values.bodyBuiltType,
        eyeColor: values.eyeColor,
        gender: values.gender,
        beard: values.beard,
        teeth: values.teeth,
        approximateAge: values.approximateAge,
        clothsWorn: values.clothsWorn,
        visibleInjuries: values.visibleInjuries,
        anyValuables: values.anyValuables,
        walletOrIdFoundText: values.walletOrIdFoundText,
        walletOrIdFound: values.walletOrIdFound,
        hairColor: values.hairColor,
        whether: values.whether,
        moles: values.moles,
        deformitiesType: values.deformitiesType,
        deformities: values.deformities,
        tattooMarks: values.tattooMarks,
        tattooPicture: values.tattooPicture,
        tattooDetails: values.tattooDetails,
      },
    },
  };

  let request = {
    crimeId: crimeId,
    crimeClassification: {
      address: selectedAddressID,
      classification: values.classification,
      majorHead: values.majorHead,
      minorHead: values.minorHead,
    },
  };

  if (classificationType === "Bodily Offence") {
    request = bodilyRequest;
  } else if (classificationType === "Road Accidents") {
    request = roadAccidentRequest;
  } else if (classificationType === "Other") {
    request = otherRequest;
  }
  dispatch(
    addUpdateCrimeClassification(config.addUpdateCrimeClassification, request)
  );
};

export const isSuccess = (actionType) => {
  const isSuccess =
    actionType === "CRIMELOCATION_UPDATE_SUCCESS" ||
    actionType === "CRIMELOCATION_CREATE_SUCCESS" ||
    actionType === "PANCHWITNESS_UPDATE_SUCCESS" ||
    actionType === "PANCHWITNESS_EDIT_SUCCESS" ||
    actionType === "WITNESS_UPDATE_SUCCESS" ||
    actionType === "WITNESS_EDIT_SUCCESS" ||
    actionType === "MATERIALOBJECT_UPDATE_SUCCESS" ||
    actionType === "MATERIALOBJECT_EDIT_SUCCESS" ||
    actionType === "EXPERTTEAM_ADD_SUCCESS" ||
    actionType === "EXPERTTEAM_UPDATE_SUCCESS" ||
    actionType === "CRIMECLASSIFICATION_UPDATE_SUCCESS" ||
    actionType === "ROUGHSKETCH_UPDATE_SUCCESS" ||
    actionType === "UPDATE_CRIME_SCENE_PHOTOGRAPHS_SUCCESS";
  return isSuccess;
};

export const isError = (actionType) => {
  const isError =
    actionType === "CRIMELOCATION_UPDATE_ERROR" ||
    actionType === "CRIMELOCATION_CREATE_ERROR" ||
    actionType === "PANCHWITNESS_UPDATE_ERROR" ||
    actionType === "PANCHWITNESS_EDIT_ERROR" ||
    actionType === "WITNESS_UPDATE_ERROR" ||
    actionType === "WITNESS_EDIT_ERROR" ||
    actionType === "MATERIALOBJECT_UPDATE_ERROR" ||
    actionType === "MATERIALOBJECT_EDIT_ERROR" ||
    actionType === "EXPERTTEAM_UPDATE_ERROR" ||
    actionType === "CRIMECLASSIFICATION_UPDATE_ERROR" ||
    actionType === "ROUGHSKETCH_UPDATE_ERROR" ||
    actionType === "UPDATE_CRIME_SCENE_PHOTOGRAPHS_ERROR";
  return isError;
};

export const getSavedMaterialObjectData = (materialObjectList) => {
  let savedData = [];
  materialObjectList &&
    !isEmpty(materialObjectList) &&
    // eslint-disable-next-line array-callback-return
    materialObjectList.map((data) => {
      const result = {
        selectedRecord: data,
        materialObjectsType: data.type || "",
        materialObjectsSubType: data.subType || "",
        mediaDetails: data.materialObjectMedia || [],
        actions: "",
      };
      savedData.push(result);
    });
  return savedData;
};

export const getSavedWitnessDetailsData = (witnessStatementList) => {
  let savedData = [];
  witnessStatementList &&
    !isEmpty(witnessStatementList) &&
    // eslint-disable-next-line array-callback-return
    witnessStatementList.map((data) => {
      const personalDetails =
        !isUndefined(data?.person) &&
        !isUndefined(data?.person?.personalDetails) &&
        data?.person?.personalDetails;
      const presentAddress =
        !isUndefined(data?.person) &&
        !isUndefined(data?.person?.presentAddress) &&
        data?.person?.presentAddress;
      const media =
        !isUndefined(data?.person) &&
        !isUndefined(data?.person?.media) &&
        data?.person?.media;
      savedData.push(
        getSavedDataResult(data, personalDetails, presentAddress, media)
      );
    });
  return savedData;
};

export const getSavedExpertTeamData = (expertTeamList) => {
  let savedData = [];
  expertTeamList &&
    !isEmpty(expertTeamList) &&
    // eslint-disable-next-line array-callback-return
    expertTeamList.map((data) => {
      const result = {
        _id: data?._id,
        name: data?.name,
        role: data?.role,
        date: data?.userDate,
        observation: data?.observation,
        mediaDetails: data?.expertTeamMedia ? data?.expertTeamMedia : [],
      };
      savedData.push(result);
    });
  return savedData;
};

export const getPanelTitle = (title) => {
  return (
    <div className="headerTextContainer">
      <div className="panelTitle">{title}</div>
    </div>
  );
};
