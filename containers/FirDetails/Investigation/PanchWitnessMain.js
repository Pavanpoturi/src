import { Button, Form, Col, Card, notification } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import firActions from "@redux/fir/actions";
import { config } from "@config/site.config";
import { loadState } from "@lib/helpers/localStorage";
import ContentHeader from "../ContentHeader";
import PanchWitnessList from "../CommonSections/PanchWitness/PanchWitnessList";
import Loader from "@components/utility/loader";
import PanchWitness from "../CommonSections/PanchWitness";
import { getPersonDetails } from "../fir-util";
import { getAuditHistoryPayload } from "@containers/const";
import auditHistoryActions from "@redux/auditHistory/actions";

export default function PanchWitnessMain({ setSelectedSiderMenu }) {
  const dispatch = useDispatch();
  const { updatePunchWitness, fetchPanchWitnessList, editPunchWitness } =
    firActions;
  const {
    actionType,
    successMessage,
    errorMessage,
    panchWitnessList,
    isFetching,
  } = useSelector((state) => state.FIR);
  const [selectedWitnessButton, setSelectedWitnessButton] =
    useState("Panch Witness");
  const [punchwitnessinputList, setPunchwitnessInputList] = useState([]);
  const [editPanchWitnessObj, seteditPanchWitnessObj] = useState(null);
  const [viewPanchWitness, setViewPanchWitness] = useState(false);
  const [panchWitnessFileList, setPanchWitnessFileList] = useState([]);
  const crimeId = loadState("selectedFirId");
  const [form] = Form.useForm();
  const [formValid, SetFormValid] = useState(false);
  const [addAnother, setAddAnother] = useState(false);
  const { createAuditHistory } = auditHistoryActions;

  const { savedFir } = useSelector((state) => state.createFIR);
  const disableForm =
    savedFir?.caseStatus === "Disposal" ||
    savedFir?.isTransferOfCaseFile === true ||
    savedFir?.isChargeSheetTakenOrFiled === true;

  const isSuccess =
    actionType === "PANCHWITNESS_UPDATE_SUCCESS" ||
    actionType === "PANCHWITNESS_EDIT_SUCCESS";

  const isError =
    actionType === "PANCHWITNESS_UPDATE_ERROR" ||
    actionType === "PANCHWITNESS_EDIT_ERROR";

  const openNotificationWithIcon = (type, message) => {
    return notification[type]({
      message: message,
    });
  };

  const auditHistoryEntry = () => {
    const auditType =
      actionType === "PANCHWITNESS_UPDATE_SUCCESS"
        ? "Panch Witness Created"
        : "Panch Witness Updated";
    dispatch(
      createAuditHistory(
        config.createAudits,
        getAuditHistoryPayload(crimeId, "investigation/panchWitness", auditType)
      )
    );
  };

  useEffect(() => {
    dispatch(
      fetchPanchWitnessList(
        `${config.getPostCrimeSceneDetails}/PUNCHWITNESS/?crimeId=${crimeId}`
      )
    );
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
        if (!addAnother) {
          setSelectedSiderMenu("investigation");
        } else {
          dispatch(
            fetchPanchWitnessList(
              `${config.getPostCrimeSceneDetails}/PUNCHWITNESS/?crimeId=${crimeId}`
            )
          );
        }
      } else if (errorMessage) {
        openNotificationWithIcon("error", errorMessage);
      }
    }
  }, [actionType]);

  const handlePanchWitnessSubmit = async () => {
    const values = await form.validateFields();
    const addPanchWitnessPayload = {
      crimeId: crimeId,
      witnessDetail: {
        lastupdateddatetime: Date.now(),
        witnessType: "PANCHWITNESS",
        person: getPersonDetails(
          { ...values, createdFrom: "Main", createdFor: "Panch Witness" },
          punchwitnessinputList
        ),
        userDate: values.userDate,
      },
    };

    const updatePanchWitnessPayload = {
      crimeId: crimeId,
      panchWitnessId: editPanchWitnessObj?.person?._id,
      witnessDetail: {
        witnessType: "PANCHWITNESS",
        person: getPersonDetails(
          { ...values, createdFrom: "Main", createdFor: "Panch Witness" },
          punchwitnessinputList
        ),
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

  const editPanchWitness = (value) => {
    seteditPanchWitnessObj(value);
  };

  const handlePanchWitnessUpload = (info) => {
    let fileList = [...info.fileList];
    fileList = fileList.map((file) => {
      if (file.response) {
        file.url = file.response.url;
      }
      return file;
    });
    setPanchWitnessFileList(fileList);
  };

  return (
    <>
      <ContentHeader
        headerTitle="Panch Witnesses"
        addAnother
        addAnotherText="Add Another"
        onSubmitClick={handlePanchWitnessSubmit}
        disableButton={disableForm}
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
              <Col span={18}>
                <Button
                  className={
                    selectedWitnessButton === "Panch Witness"
                      ? "witnessButtonActive"
                      : "witnessButtonInActive"
                  }
                  shape="round"
                  style={{ marginBottom: 10 }}
                  onClick={() => setSelectedWitnessButton("Panch Witness")}
                >
                  Panch Witness
                </Button>
                <span className="leftRightPad">OR</span>
                <Button
                  className={
                    selectedWitnessButton === "Police Proceedings"
                      ? "witnessButtonActive"
                      : "witnessButtonInActive"
                  }
                  shape="round"
                  onClick={() => setSelectedWitnessButton("Police Proceedings")}
                  disabled
                >
                  Police Proceedings
                </Button>
                <PanchWitness
                  handleSubmit={handlePanchWitnessSubmit}
                  setInputList={setPunchwitnessInputList}
                  currentData={editPanchWitnessObj}
                  resetEdit={() => seteditPanchWitnessObj(null)}
                  viewPanchWitness={viewPanchWitness}
                  setViewPanchWitness={setViewPanchWitness}
                  showButton={false}
                  PanchWitnessForm={form}
                  setformValidFlag={SetFormValid}
                  isInvestigation={true}
                />
              </Col>
              <Col span={6}>
                <PanchWitnessList
                  isDisplayed={false}
                  inputFileList={panchWitnessFileList}
                  handleFileChange={handlePanchWitnessUpload}
                  minHeight={750}
                  showRecords={true}
                  records={panchWitnessList}
                  editPanchWitness={editPanchWitness}
                  selectedRecord={editPanchWitnessObj}
                  setViewPanchWitness={setViewPanchWitness}
                />
              </Col>
            </div>
          </Card>
        </Form>
      )}
    </>
  );
}
