import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Card, Col, Form, notification, Button, Modal } from "antd";
import { loadState } from "@lib/helpers/localStorage";
import Loader from "@components/utility/loader";
import ContentHeader from "../ContentHeader";
import UploadForm from "@components/Common/uploadForm";
import axios from "axios";
import { isEmpty, isUndefined, isArray, isNull } from "lodash";
import SavedRecords from "../CommonSections/WitnessDetails/SavedRecords";
import WitnessDetails from "../CommonSections/WitnessDetails";
import { config } from "@config/site.config";
import firActions from "@redux/fir/actions";
import {
  getPersonDetails,
  folderName,
  getMediaPayload,
  getMediaUploadError,
  getSavedDataResult,
} from "../fir-util";
import { getAuditHistoryPayload } from "@containers/const";
import auditHistoryActions from "@redux/auditHistory/actions";

export default function WitnessDetailsMain({ setSelectedSiderMenu }) {
  const dispatch = useDispatch();
  const [formValid, setFormValid] = useState(false);
  const [form] = Form.useForm();
  const [isFormUploading, setIsFormUploading] = useState(false);
  const [editWitnessDetailsObj, setEditWitnessDetailsObj] = useState(null);
  const [viewWitnessDetails, setViewWitnessDetails] = useState(false);
  const crimeId = loadState("selectedFirId");
  const [witnessDetailsInputList, setWitnessDetailsInputList] = useState([]);
  const [inputFileList, setInputFileList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("witnessDetails");
  const [recordsIsModalVisible, setrecordsIsModalVisible] = useState(false);
  const { savedFir } = useSelector((state) => state.createFIR);
  const disableForm =
    savedFir?.caseStatus === "Disposal" ||
    savedFir?.isTransferOfCaseFile === true ||
    savedFir?.isChargeSheetTakenOrFiled === true;
  const { createAuditHistory } = auditHistoryActions;
  const {
    actionType,
    successMessage,
    errorMessage,
    witnessStatementList,
    isFetching,
  } = useSelector((state) => state.FIR);
  const {
    updateWitnessStatement,
    fetchWitnessDetailsList,
    editWitnessStatement,
    resetActionType,
  } = firActions;

  const [addAnother, setAddAnother] = useState(false);

  const isSuccess =
    actionType === "WITNESS_UPDATE_SUCCESS" ||
    actionType === "WITNESS_EDIT_SUCCESS";
  const isError =
    actionType === "WITNESS_UPDATE_ERROR" ||
    actionType === "WITNESS_EDIT_ERROR";

  const openNotificationWithIcon = (type, message) => {
    return notification[type]({
      message: message,
    });
  };

  const auditHistoryEntry = () => {
    const auditType =
      actionType === "WITNESS_UPDATE_SUCCESS"
        ? "Witness Details Created"
        : "Witness Details Updated";
    dispatch(
      createAuditHistory(
        config.createAudits,
        getAuditHistoryPayload(
          crimeId,
          "investigation/witnessDetails",
          auditType
        )
      )
    );
  };

  const getWitnessDetails = () => {
    dispatch(
      fetchWitnessDetailsList(
        `${config.getPostCrimeSceneDetails}/WITNESSDETAILS/?crimeId=${crimeId}`
      )
    );
  };

  useEffect(() => {
    getWitnessDetails();
  }, []);

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
        setInputFileList([]);
        setEditWitnessDetailsObj(null);
        getWitnessDetails();
        dispatch(resetActionType());
        if (!addAnother) {
          setSelectedSiderMenu("investigation");
        }
      } else if (errorMessage) {
        openNotificationWithIcon("error", errorMessage);
        dispatch(resetActionType());
      }
    }
  }, [actionType]);

  const handleEditWitnessDetails = (value) => {
    setEditWitnessDetailsObj(value);
  };

  const handleWitnessSubmit = async () => {
    const values = await form.validateFields();
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
      setIsFormUploading(true);
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
                    createdFrom: "Main",
                    createdFor: "Witness Details",
                  },
                  witnessDetailsInputList,
                  getMediaPayload(data, selectedCategory)
                ),
                userDate: values.userDate,
              },
            };
            const updateWitnessDetailPayload = {
              crimeId: crimeId,
              isChargeSheet: editWitnessDetailsObj?.isChargeSheet,
              isExamined: editWitnessDetailsObj?.isExamined,
              witnessId: editWitnessDetailsObj?.person?._id,
              witnessDetail: getPersonDetails(
                {
                  ...values,
                  createdFrom: "Main",
                  createdFor: "Witness Details",
                },
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
          setIsFormUploading(false);
        })
        .catch((err) => {
          getMediaUploadError(err, openNotificationWithIcon);
        });
    } else if (isEmpty(inputFileList)) {
      setIsFormUploading(false);
      const mediaDetails = editWitnessDetailsObj?.person?.media;
      const updateMediaResult = isEmpty(mediaDetails) ? [] : mediaDetails;
      const addWitnessDetailsPayload = {
        crimeId: crimeId,
        witnessDetail: {
          lastupdateddatetime: Date.now(),
          person: getPersonDetails(
            { ...values, createdFrom: "Main", createdFor: "Witness Details" },
            witnessDetailsInputList,
            []
          ),
          userDate: values.userDate,
        },
      };
      const updateWitnessDetailPayload = {
        crimeId: crimeId,
        isChargeSheet: editWitnessDetailsObj?.isChargeSheet,
        isExamined: editWitnessDetailsObj?.isExamined,
        witnessId: editWitnessDetailsObj?.person?._id,
        witnessDetail: getPersonDetails(
          { ...values, createdFrom: "Main", createdFor: "Witness Details" },
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

  const getSavedData = () => {
    let savedData = [];
    isArray(witnessStatementList) &&
      !isEmpty(witnessStatementList) &&
      witnessStatementList.map((data) => {
        const personalDetails =
          !isNull(data?.person) &&
          !isUndefined(data?.person) &&
          !isUndefined(data?.person?.personalDetails) &&
          data?.person?.personalDetails;
        const presentAddress =
          !isNull(data?.person) &&
          !isUndefined(data?.person) &&
          !isUndefined(data?.person?.presentAddress) &&
          data?.person?.presentAddress;
        const media =
          !isNull(data?.person) &&
          !isUndefined(data?.person) &&
          !isUndefined(data?.person?.media) &&
          data?.person?.media;
        const m_witness_stmt =
          !isNull(data?.person) &&
          !isUndefined(data?.person) &&
          !isNull(data?.person?.m_witness_stmt) &&
          !isUndefined(data?.person?.m_witness_stmt) &&
          data?.person?.m_witness_stmt;
        const mediaDetails = media ? media : [];
        const mobileWitnessStmt = m_witness_stmt ? m_witness_stmt : [];
        const n1 = [...mediaDetails, ...mobileWitnessStmt];
        savedData.push(
          getSavedDataResult(data, personalDetails, presentAddress, n1)
        );
      });
    return savedData;
  };

  return (
    <>
      <ContentHeader
        headerTitle="Witness Details"
        addAnother
        addAnotherText="Add Another"
        onSubmitClick={handleWitnessSubmit}
        disableButton={disableForm || viewWitnessDetails}
        setAddAnother={setAddAnother}
        isInvestigation={true}
        onCancel={() => setSelectedSiderMenu("investigation")}
      />
      {isFetching ? (
        <Loader />
      ) : (
        <Form form={form} layout="vertical">
          <Card style={{ minHeight: "45vh" }}>
            {isFormUploading && (
              <div className="customPageLoader">
                <Loader />
              </div>
            )}
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
              <Col span={18} style={{ padding: 10 }}>
                <WitnessDetails
                  handleSubmit={handleWitnessSubmit}
                  setInputList={setWitnessDetailsInputList}
                  currentData={editWitnessDetailsObj}
                  resetEdit={() => setEditWitnessDetailsObj(null)}
                  viewWitnessDetails={viewWitnessDetails}
                  setViewWitnessDetails={setViewWitnessDetails}
                  showButton={false}
                  WitnessDetailsForm={form}
                  setformValidFlag={setFormValid}
                  isInvestigation={true}
                />
              </Col>
              <Col span={6}>
                <div style={{ marginLeft: 10, marginBottom: 20 }}>
                  <UploadForm
                    colWidth={22}
                    enableMediaManager={true}
                    setInputFileList={setInputFileList}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    disabled={viewWitnessDetails || disableForm}
                  />
                </div>
                {!isEmpty(witnessStatementList) ? (
                  <>
                    <Button
                      style={{ marginTop: "40px", width: "100%" }}
                      onClick={() => setrecordsIsModalVisible(true)}
                    >
                      {witnessStatementList && witnessStatementList.length > 0
                        ? witnessStatementList.length
                        : 0}{" "}
                      Witness Details Records
                    </Button>
                    <Modal
                      title="Witness Details Records"
                      visible={recordsIsModalVisible}
                      onOk={() => setrecordsIsModalVisible(false)}
                      onCancel={() => setrecordsIsModalVisible(false)}
                      width={1700}
                      footer={null}
                    >
                      <div style={{ maxHeight: 650, overflowY: "auto" }}>
                        <SavedRecords
                          dataSource={getSavedData()}
                          editDetails={handleEditWitnessDetails}
                          setViewDetails={setViewWitnessDetails}
                          selectedRecord={editWitnessDetailsObj}
                          isMedia={false}
                          recordVisible={setrecordsIsModalVisible}
                          disableForm={disableForm}
                          setSelectedSiderMenu={setSelectedSiderMenu}
                        />
                      </div>
                    </Modal>
                  </>
                ) : null}
              </Col>
            </div>
          </Card>
        </Form>
      )}
    </>
  );
}
