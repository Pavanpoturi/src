import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, Col, Form, notification, Button, Modal } from "antd";
import Loader from "@components/utility/loader";
import UploadForm from "@components/Common/uploadForm";
import axios from "axios";
import { isEmpty, first, isUndefined, isArray } from "lodash";
import ContentHeader from "../ContentHeader";
import SavedRecords from "../CommonSections/MaterialObjects/SavedRecords";
import MaterialObjects from "../CommonSections/MaterialObjects";
import { loadState } from "../../../lib/helpers/localStorage";
import firActions from "@redux/fir/actions";
import { config } from "@config/site.config";
import {
  folderName,
  getMediaPayload,
  getMediaUploadError,
} from "@containers/FirDetails/fir-util";
import {
  getAuditHistoryPayload,
  getDataForDocument,
  getHTMLFromTemplate,
  SeizureReportTemplates,
} from "@containers/const";
import auditHistoryActions from "@redux/auditHistory/actions";
import TemplatesModal from "./CommonForms/TemplatesModal";
import DisplayReportGenerations from "@containers/FirDetails/CommonSections/DisplayReportGenerations";


export default function MaterialObjectsMain({ setSelectedSiderMenu }) {
  const crimeId = loadState("selectedFirId");
  const selectedFir = loadState("selectedFir");
  const currentUser = loadState("currentUser");
  const [formValid, setFormValid] = useState(false);
  const dispatch = useDispatch();
  const { savedFir } = useSelector((state) => state.createFIR);
  const [viewMaterialObjectDetails, setViewMaterialObjectDetails] =
    useState(false);
  const [editMaterialObjectObj, setEditMaterialObjectObj] = useState(null);
  const [form] = Form.useForm();
  const [addAnother, setAddAnother] = useState(false);
  const [inputFileList, setInputFileList] = useState([]);
  const [seizureReport, setSeizureReport] = useState([]);
  const [selectedSeizureReport, setSelectedSeizureReport] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("materialObjects");
  const [isRecordsModalVisible, setIsRecordsModalVisible] = useState(false);
  const [addAddress, setAddAddress] = useState(null);
  const { createAuditHistory } = auditHistoryActions;
  const [selectedTemplateName, setSelectedTemplateName] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");
  const [isTemplateModalVisible, setTemplateIsModalVisible] = useState(false);
  const {
    createMaterialObject,
    fetchMaterialObjectList,
    editMaterialObject,
    fetchCrimeLocation,
    fetchPanchWitnessList,
    updateSelectedCrimeSceneDate,
  } = firActions;
  const {
    actionType,
    successMessage,
    errorMessage,
    materialObjectList,
    isFetching,
  } = useSelector((state) => state.FIR);

  const disableForm =
    savedFir?.caseStatus === "Disposal" ||
    savedFir?.isTransferOfCaseFile === true ||
    savedFir?.isChargeSheetTakenOrFiled === true;

  const isSuccess =
    actionType === "MATERIALOBJECT_UPDATE_SUCCESS" ||
    actionType === "MATERIALOBJECT_EDIT_SUCCESS";

  const isError =
    actionType === "MATERIALOBJECT_UPDATE_ERROR" ||
    actionType === "MATERIALOBJECT_EDIT_ERROR";

  const auditHistoryEntry = () => {
    const auditType =
      actionType === "MATERIALOBJECT_UPDATE_SUCCESS"
        ? "MO Seizures Created"
        : "MO Seizures Updated";
    dispatch(
      createAuditHistory(
        config.createAudits,
        getAuditHistoryPayload(crimeId, "investigation/MOSeizures", auditType)
      )
    );
  };

  const openNotificationWithIcon = (type, message) => {
    return notification[type]({
      message: message,
    });
  };

  const getMaterialObjects = () => {
    dispatch(
      fetchMaterialObjectList(
        `${config.getPostCrimeSceneDetails}/MATERIALOBJECTS/?crimeId=${crimeId}`
      )
    );
  };

  const getCrimeLocation = () => {
    dispatch(
      fetchCrimeLocation(
        `${config.getPostCrimeSceneDetails}/CRIMELOCATION/?crimeId=${crimeId}`
      )
    );
  };

  useEffect(() => {
    if (isSuccess || isError) {
      if (
        successMessage === "successfully updated" ||
        successMessage === "successfully created" ||
        successMessage === "successfully added" ||
        successMessage === "successfully added/updated"
      ) {
        openNotificationWithIcon("success", successMessage);
        auditHistoryEntry();
        form.resetFields();
        if (!addAnother) {
          setSelectedSiderMenu("investigation");
        } else {
          getMaterialObjects();
          getCrimeLocation();
        }
      } else if (errorMessage) {
        openNotificationWithIcon("error", errorMessage);
      }
    }
  }, [actionType]);

  useEffect(() => {
    getMaterialObjects();
    getCrimeLocation();
    dispatch(updateSelectedCrimeSceneDate());
    dispatch(
      fetchPanchWitnessList(
        `${config.getPostCrimeSceneDetails}/PUNCHWITNESS/?crimeId=${crimeId}`
      )
    );
  }, []);

  const getCommonPayload = (values, materialObjectMedia, seizureReport) => {
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
      userDate: values.userDate,
    };
    return result;
  };

  const savedSeizureReportURL = editMaterialObjectObj?.seizureReport?.url
    ? editMaterialObjectObj?.seizureReport.name
    : "";

  const handleMaterialObjectSubmit = async () => {
    const values = await form.validateFields();
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
                !isUndefined(materialObjectMedia) &&
                isEmpty(materialObjectMedia)
                  ? getMediaPayload(mediaFormDataResult, selectedCategory)
                  : mediaResult;
              const addMaterialObjectPayload = getCommonPayload(
                values,
                getMediaPayload(mediaFormDataResult, selectedCategory),
                seizureReportDataResult
              );
              const updateMaterialObjectPayload = {
                _id: editMaterialObjectObj?._id,
                ...getCommonPayload(
                  values,
                  updateMediaResult,
                  seizureReportDataResult
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
            const addMaterialObjectPayload = getCommonPayload(
              values,
              [],
              payloadData
            );
            const updateMaterialObjectPayload = {
              _id: editMaterialObjectObj?._id,
              ...getCommonPayload(values, updateMediaResult, payloadData),
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
            const mediaResult = [
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
            const addMaterialObjectPayload = getCommonPayload(
              values,
              getMediaPayload(data, selectedCategory),
              {}
            );
            const updateMaterialObjectPayload = {
              _id: editMaterialObjectObj?._id,
              ...getCommonPayload(
                values,
                updateMediaResult,
                existingSeizureReport
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
      const existingSeizureReport = !isUndefined(
        editMaterialObjectObj?.seizureReport
      )
        ? editMaterialObjectObj?.seizureReport
        : {};
      const addMaterialObjectPayload = getCommonPayload(values, [], {});
      const updateMaterialObjectPayload = {
        _id: editMaterialObjectObj?._id,
        ...getCommonPayload(values, updateMediaResult, existingSeizureReport),
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
    }
  };

  const handleEditMaterialObject = (value) => {
    setEditMaterialObjectObj(value);
    if (
      !isUndefined(value.seizureReport?.url) &&
      value.seizureReport.url !== ""
    ) {
      setSelectedSeizureReport([
        {
          url: value?.seizureReport?.url,
          name: value?.seizureReport?.name,
          fileId: value?.seizureReport?.fileId,
        },
      ]);
    } else {
      setSelectedSeizureReport([]);
    }
  };

  const getSavedData = () => {
    let savedData = [];
    isArray(materialObjectList) &&
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

  const reportData = getDataForDocument(
    editMaterialObjectObj,
    selectedFileName,
    selectedFir,
    currentUser,
    savedFir,
    selectedSeizureReport,
  );

  const handleTemplateCancel = () => {
    setTemplateIsModalVisible(false);
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

  return (
    <>
      <ContentHeader
        headerTitle="Material Objects"
        addAnother
        addAnotherText="Add Another"
        onSubmitClick={handleMaterialObjectSubmit}
        disableButton={disableForm || viewMaterialObjectDetails}
        setAddAnother={setAddAnother}
        isInvestigation={true}
        onCancel={() => setSelectedSiderMenu("investigation")}
      />
      {isFetching ? (
        <Loader />
      ) : (
        <Form form={form} layout="vertical">
          <Card style={{ minHeight: "45vh" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-start",
                overflow: "hidden",
                marginBottom: 10,
              }}
            >
              <MaterialObjects
                currentData={editMaterialObjectObj}
                resetEdit={() => setEditMaterialObjectObj(null)}
                viewMaterialObjectDetails={
                  viewMaterialObjectDetails || disableForm
                }
                setViewMaterialObjectDetails={setViewMaterialObjectDetails}
                showButton={false}
                MaterialObjectsForm={form}
                setformValidFlag={setFormValid}
                addAddress={setAddAddress}
                address={addAddress}
                isInvestigation={true}
                setSelectedSiderMenu={(value) => setSelectedSiderMenu(value)}
                fileList={
                  editMaterialObjectObj?._id && savedSeizureReportURL !== ""
                    ? selectedSeizureReport
                    : seizureReport
                }
                actionName={setSeizureReport}
                disableUpload={
                  viewMaterialObjectDetails ||
                  !isEmpty(seizureReport) ||
                  disableForm
                }
              />
              <Col span={8}>
                <div style={{ marginLeft: 10 }}>
                <DisplayReportGenerations
                  templateLists={SeizureReportTemplates}
                  showModal={showModal}
                  selectedRecord={{ crimeId: crimeId }}
                  selectedModule="materialObjects"
                />
                  <UploadForm
                    colWidth={22}
                    enableMediaManager={true}
                    setInputFileList={setInputFileList}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    disabled={viewMaterialObjectDetails || disableForm}
                  />
                </div>
                {!isUndefined(materialObjectList) &&
                !isEmpty(materialObjectList) ? (
                  <>
                    <Button
                      style={{ marginTop: "40px", width: "100%" }}
                      onClick={() => setIsRecordsModalVisible(true)}
                    >
                      {materialObjectList && materialObjectList.length > 0
                        ? materialObjectList.length
                        : 0}{" "}
                      Material Objects Records
                    </Button>
                    <Modal
                      title="Material Objects Records"
                      visible={isRecordsModalVisible}
                      onOk={() => setIsRecordsModalVisible(false)}
                      onCancel={() => setIsRecordsModalVisible(false)}
                      style={{ minWidth: "95vw" }}
                      footer={null}
                    >
                      <div style={{ maxHeight: 650, overflowY: "auto" }}>
                        <SavedRecords
                          dataSource={getSavedData()}
                          editDetails={handleEditMaterialObject}
                          setViewDetails={setViewMaterialObjectDetails}
                          selectedRecord={editMaterialObjectObj}
                          visibleRecords={setIsRecordsModalVisible}
                        />
                      </div>
                    </Modal>
                  </>
                ) : null}
              </Col>
            </div>
          </Card>
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
        </Form>
      )}
    </>
  );
}
