import { useState, useEffect } from "react";
import { Checkbox, Switch, Collapse, notification } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { DoubleRightOutlined } from "@ant-design/icons";
import { cloneDeep } from "lodash";
import ContentHeader from "../ContentHeader";
import { config } from "@config/site.config";
import firActions from "@redux/fir/actions";
import { loadState } from "@lib/helpers/localStorage";
import SupportingStaff from "./SupportingStaff";
import ExpertTeam from "./ExpertTeam";
import InformSeniorOfficer from "./InformSeniorOfficer";
import CrimeSceneShown from "./CrimeSceneShown";
import masterDataActions from "@redux/masterData/actions";
import Loader from "@components/utility/loader";
import moment from "moment";
import { getAuditHistoryPayload } from "@containers/const";
import auditHistoryActions from "@redux/auditHistory/actions";

const { Panel } = Collapse;

export default function PreCrime(props) {
  const dispatch = useDispatch();
  const selectedFirId = loadState("selectedFirId");
  const selectedFir = loadState("selectedFir");
  const storedUser = loadState("currentUser");
  const { savedFir } = useSelector((state) => state.createFIR);
  const [personDetails, setpersonDetails] = useState([]);
  const [copyGetPrecrime, setcopyGetPrecrime] = useState([]);
  const [supportingStaff, setSupportingStaff] = useState([]);
  const [expertTeam, setExpertTeam] = useState([]);
  const { createAuditHistory } = auditHistoryActions;
  const {
    updatePrecrimeCase,
    resetActionType,
    fetchPreCrimeCase,
    fetchPreCrimeHistory,
    fetchHistoryOptions,
  } = firActions;
  const { getExpertList, getStaffList, getExpertRoleList } = masterDataActions;
  const {
    successMessage,
    errorMessage,
    actionType,
    precrimescene,
    isFetching,
    historyOptions,
  } = useSelector((state) => state.FIR);

  const { expertList, staffList, expertRoleList } = useSelector(
    (state) => state.MasterData
  );
  const isSuccess = actionType === "PRECRIMECASE_UPDATE_SUCCESS";
  const isError = actionType === "PRECRIMECASE_UPDATE_ERROR";
  const disableEdit = false;

  const auditHistoryEntry = () => {
    dispatch(
      createAuditHistory(
        config.createAudits,
        getAuditHistoryPayload(
          selectedFirId,
          "firDetails/PreCrime",
          "Pre Crime Scene Updated"
        )
      )
    );
  };

  const openNotificationWithIcon = (type, message) => {
    return notification[type]({
      message: message,
    });
  };

  useEffect(() => {
    if (!disableEdit) {
      dispatch(getExpertRoleList(`${config.getMasterData}/NAME_OF_THE_EXPERT`));
      dispatch(
        getExpertList(
          `${config.getExpertTeamFromHrms}?policestationcode=${selectedFir?.psCode}&roleId=2`
        )
      );
      dispatch(
        getStaffList(
          `${config.getSupportStaffFromHrms}?policestationcode=${selectedFir?.psCode}&loginPsCode=${storedUser?.cctns_unit_id}&loginEmpRole=${storedUser?.emp_role_name}`
        )
      );
    }
  }, []);

  useEffect(() => {
    dispatch(
      fetchHistoryOptions(`${config.historyOptions}/preCrime/${selectedFirId}`)
    );
  }, []);

  const [requestBody, setRequestBody] = useState({
    crimeId: selectedFirId,
    previousDate: "",
    patrolCarsBlueColts: null,
    toolkit: null,
    deleted: false,
    supportStaff: [],
    expertTeam: [],
    officer: [],
    crimeShown: [],
    multiplePatrolCarsBlueColts: [],
    multipleToolkit: [],
  });

  const [seniorOfficer, setSeniorOfficer] = useState([
    {
      checked: false,
      userDate: "07-23-2021",
      ioMobileNumber: 7901114154,
      policeStationStaffCd: "205000218045",
      assignedIoCd: "205000218045",
      ioName: "BALRAJ P",
      personCode: "205000218045",
      employeeName: "BALRAJ P",
      empRoleName: "SHO",
    },
    {
      checked: false,
      userDate: "07-23-2021",
      ioMobileNumber: 79000054,
      policeStationStaffCd: "205000218045",
      assignedIoCd: "205000218055",
      ioName: "RAJKUMAR P",
      personCode: "205000218055",
      employeeName: "RAJKUMAR K V",
      empRoleName: "CI/ACP",
    },
  ]);

  useEffect(() => {
    let crimeShownData = [];
    precrimescene?.crimeShown?.map((person) => {
      crimeShownData.push({ ...person, checked: true });
    });
    setpersonDetails(crimeShownData);
  }, [precrimescene]);

  useEffect(() => {
    var supportStaffarray = [];
    var expertTeamarray = [];
    if (staffList && staffList.length > 0) {
      supportStaffarray = staffList.map((item) => ({
        ...item,
        dateOfBirth: moment(item.dateOfBirth),
        dateOfJoinInService: moment(item.dateOfJoinInService),
        dateOfRetirement: moment(item.dateOfRetirement),
        checked: false,
        internalFlag: true,
      }));
      setSupportingStaff(supportStaffarray);
    }

    if (expertRoleList && expertRoleList.length > 0) {
      expertTeamarray = expertRoleList;
      expertTeamarray.forEach((item) => {
        item.label = item.label;
        item.checked = false;
        item.internalFlag = true;
      });
      setExpertTeam(expertTeamarray);
    }
    if (precrimescene) {
      let currentvalue = { ...requestBody };
      currentvalue.patrolCarsBlueColts = precrimescene.patrolCarsBlueColts;
      currentvalue.toolkit = precrimescene.toolkit;

      if (supportStaffarray.length > 0) {
        var staffdata = [];
        supportStaffarray.forEach((element) => {
          precrimescene?.supportStaff?.forEach((item) => {
            if (
              item.paoCode === element.paoCode &&
              !staffdata?.some((item) => item?.paoCode === element.paoCode)
            ) {
              staffdata.push(element);
              element.checked = true;
            }
          });
        });
        if (
          precrimescene.supportStaff?.filter((x) => !x.internalFlag).length > 0
        ) {
          precrimescene.supportStaff
            ?.filter((x) => !x.internalFlag)
            .forEach((element) => {
              if (
                !staffdata?.some((item) => item?.paoCode === element.paoCode)
              ) {
                staffdata.push(element);
              }
            });
        }
        currentvalue.supportStaff = !!staffdata ? staffdata : [];
      }
      if (expertTeamarray.length > 0) {
        var expertTeamdata = [];
        expertTeamarray.forEach((element) => {
          precrimescene?.expertTeam?.forEach((item) => {
            if (item.label === element.label) {
              expertTeamdata.push(element);
              element.checked = true;
            }
          });
        });
        if (
          precrimescene.expertTeam?.filter((x) => !x.internalFlag).length > 0
        ) {
          precrimescene.expertTeam
            ?.filter((x) => !x.internalFlag)
            .forEach((element) => {
              expertTeamdata.push(element);
            });
        }
        currentvalue.expertTeam = !!expertTeamdata ? expertTeamdata : [];
      }

      var officerdata = [];
      if (precrimescene.officer?.length > 0) {
        seniorOfficer.forEach((element) => {
          precrimescene.officer?.forEach((item) => {
            if (item.assignedIoCd === element.assignedIoCd) {
              officerdata.push(element);
              element.checked = true;
              element.internalFlag = true;
            }
          });
          currentvalue.officer = officerdata;
        });
      }
      var personDetailsdata = [];
      if (precrimescene.crimeShown?.length > 0) {
        precrimescene.crimeShown?.forEach((element) => {
          personDetailsdata.push(element);
        });
      }

      currentvalue.crimeShown = personDetailsdata;
      currentvalue["multiplePatrolCarsBlueColts"] =
        !!precrimescene?.multiplePatrolCarsBlueColts
          ? precrimescene?.multiplePatrolCarsBlueColts
          : [];
      currentvalue["multipleToolkit"] = !!precrimescene?.multipleToolkit
        ? precrimescene?.multipleToolkit
        : [];
      setRequestBody(currentvalue);
      setcopyGetPrecrime(currentvalue);
    }
  }, [expertList, staffList, precrimescene]);

  useEffect(() => {
    if (isSuccess || isError) {
      if (successMessage === "successfully updated") {
        openNotificationWithIcon("success", successMessage);
        auditHistoryEntry();
        props.setSelectedSiderMenu("investigation");
      } else if (errorMessage) {
        openNotificationWithIcon("error", errorMessage);
      }
      dispatch(resetActionType());
    }
  }, [actionType]);

  function getHistory(value) {
    dispatch(
      getExpertList(
        `${config.getExpertTeamFromHrms}?policestationcode=${selectedFir?.psCode}&roleId=2`
      )
    );
    dispatch(
      getStaffList(
        `${config.getSupportStaffFromHrms}?policestationcode=${selectedFir?.psCode}&loginPsCode=${storedUser?.cctns_unit_id}&loginEmpRole=${storedUser?.emp_role_name}`
      )
    );
    dispatch(getExpertRoleList(`${config.getMasterData}/NAME_OF_THE_EXPERT`));
    if (value !== "Now") {
      dispatch(
        fetchPreCrimeHistory(
          `${config.getPreCrimeData}?crimeId=${selectedFirId}&date=${value}`
        )
      );
      setRequestBody({ ...requestBody, previousDate: value });
    } else {
      dispatch(
        fetchPreCrimeCase(
          `${config.getPreCrimeData}?crimeId=${selectedFirId}&&date=${moment(
            new Date()
          ).format("MM-DD-YYYY")}`
        )
      );
      setRequestBody({ ...requestBody, previousDate: "" });
    }
  }

  const handle_patrolCarsBlueColts = (value) => {
    let currentvalue = { ...requestBody };
    currentvalue.patrolCarsBlueColts = value;
    setRequestBody({
      ...currentvalue,
      multiplePatrolCarsBlueColts: [
        {
          patrolCarsBlueColts: value,
        },
      ],
    });
  };

  const addPersonDetails = (personDetails) => {
    let currentvalue = { ...requestBody };
    currentvalue.crimeShown.push(personDetails);
    setRequestBody(currentvalue);
  };

  const removePersonDetails = (index) => {
    let currentvalue = { ...requestBody };
    const list = [...currentvalue.crimeShown];
    list.splice(index, 1);
    currentvalue.crimeShown = list;
    setRequestBody(currentvalue);
  };

  const handle_toolkit = (value) => {
    let currentvalue = { ...requestBody };
    currentvalue.toolkit = value;

    setRequestBody({
      ...currentvalue,
      multipleToolkit: [
        {
          toolkit: value,
        },
      ],
    });
  };

  const handleSubmit = (values, name, personType) => {
    let currentvalue = cloneDeep(requestBody);
    switch (name) {
      case "staff":
        if (values.internalFlag === true) {
          values.dateOfBirth = moment(values.dateOfBirth);
          values.dateOfJoinInService = moment(values.dateOfJoinInService);

          values.dateOfRetirement = moment(values.dateOfRetirement);
        }
        values.paoCode = values.paoCode ? values.paoCode : "";
        currentvalue.supportStaff.push(values);
        setRequestBody(currentvalue);
        break;
      case "expert":
        if (values.internalFlag === true) {
          values.label = values.label;
        } else {
          values.label = values?.firstname + " " + values?.surname;
        }
        currentvalue.expertTeam.push(values);

        setRequestBody(currentvalue);
        break;
      case "officer":
        currentvalue.officer.push(values);
        setRequestBody(currentvalue);
        break;
      case "crimeShown":
        const payload = {
          selectedPersonType: personType,
          person: values,
        };
        currentvalue.crimeShown.length = 0;
        currentvalue.crimeShown.push.apply(currentvalue.crimeShown, [payload]);
        setRequestBody(currentvalue);
        break;
      default:
        break;
    }
  };

  const handleRemove = (values, name) => {
    let currentvalue = { ...requestBody };
    switch (name) {
      case "staff":
        if (values.firstname || values.surname) {
          currentvalue.supportStaff.splice(
            currentvalue.supportStaff.findIndex(
              (x) =>
                x.firstname === values.firstname && x.surname === values.surname
            ),
            1
          );
        } else {
          currentvalue.supportStaff.splice(
            currentvalue.supportStaff.findIndex(
              (x) => x.paoCode === values.paoCode
            ),
            1
          );
        }
        setRequestBody(currentvalue);
        break;
      case "expert":
        currentvalue.expertTeam.splice(
          currentvalue.expertTeam.indexOf(values),
          1
        );
        setRequestBody(currentvalue);
        break;
      case "officer":
        currentvalue.officer.splice(currentvalue.officer.indexOf(values), 1);
        setRequestBody(currentvalue);
        break;
      case "crimeShown":
        currentvalue.crimeShown.splice(
          currentvalue.crimeShown.indexOf(values),
          1
        );
        setRequestBody(currentvalue);
        break;
      default:
        break;
    }
  };

  const handlePreCrimeSubmit = () => {
    if (
      requestBody.patrolCarsBlueColts ||
      requestBody.toolkit ||
      requestBody.supportStaff.length > 0 ||
      requestBody.expertTeam.length > 0 ||
      requestBody.officer.length > 0 ||
      requestBody.crimeShown > 0
    ) {
      dispatch(updatePrecrimeCase(config.updatePreCrimeCase, requestBody));
      setRequestBody({
        crimeId: selectedFirId,
        previousDate: "",
        patrolCarsBlueColts: null,
        toolkit: null,
        deleted: false,
        supportStaff: [],
        expertTeam: [],
        officer: [],
        crimeShown: [],
        multiplePatrolCarsBlueColts: [],
        multipleToolkit: [],
      });
    } else {
      openNotificationWithIcon("error", "Please enter data to submit");
      setRequestBody({
        crimeId: selectedFirId,
        previousDate: "",
        patrolCarsBlueColts: null,
        toolkit: null,
        deleted: false,
        supportStaff: [],
        expertTeam: [],
        officer: [],
        crimeShown: [],
        multiplePatrolCarsBlueColts: [],
        multipleToolkit: [],
      });
    }
  };

  const disableSubmit = !(
    (requestBody.patrolCarsBlueColts ||
      requestBody.toolkit ||
      requestBody.supportStaff.length > 0 ||
      requestBody.expertTeam.length > 0 ||
      requestBody.officer.length > 0 ||
      requestBody.crimeShown > 0) &&
    requestBody !== copyGetPrecrime
  );

  const renderFormItems = (label, formItem) => {
    return (
      <div className="formItem">
        <div className="ant-col ant-form-item-label">
          <label
            className="ant-form-item-no-colon ant-form-item-label"
            style={{ fontSize: 16 }}
          >
            {label}{" "}
            {formItem === "toolkit" ? (
              <Switch
                onClick={handle_toolkit}
                style={{ marginLeft: 185 }}
                checked={!!requestBody.multipleToolkit[0]?.toolkit}
                disabled={disableEdit}
              />
            ) : (
              <Checkbox
                onClick={(e) => handle_patrolCarsBlueColts(e.target.checked)}
                checked={
                  !!requestBody.multiplePatrolCarsBlueColts[0]
                    ?.patrolCarsBlueColts
                }
                disabled={disableEdit}
              />
            )}
          </label>
        </div>
      </div>
    );
  };

  const totalSupportingStaff = requestBody.supportStaff.length;
  const totalExpertTeam = requestBody.expertTeam.length;
  const totalseniorOfficier = requestBody.officer.length;
  const totalCrimeSceneShownBy =
    requestBody.crimeShown.length || personDetails.length;

  return (
    <>
      <ContentHeader
        savedFir={savedFir}
        headerTitle="Proceeding to Crime Scene?"
        onSubmitClick={handlePreCrimeSubmit}
        disableButton={disableSubmit || disableEdit || isFetching}
        historyDropdown={true}
        getHistory={getHistory}
        historyOptions={historyOptions}
      />
      {isFetching ? (
        <Loader />
      ) : (
        <>
          <div className="formDetails preCrimeForm">
            {renderFormItems(
              "Instruct Patrol Car / Blue Colts team to secure the crime scene wherever necessary",
              ""
            )}
            {renderFormItems("Secure Investigation Toolkit", "toolkit")}
          </div>
          <div className="formDetails preCrimeForm">
            <Collapse
              accordion
              defaultActiveKey={["1"]}
              expandIconPosition={"right"}
              expandIcon={({ isActive }) => (
                <DoubleRightOutlined rotate={isActive ? 90 : 0} />
              )}
            >
              <Panel
                className="panelHeader"
                header={
                  <div className="headerTextContainer">
                    {" "}
                    <div className="panelTitle">Supporting Staff </div>{" "}
                    <div className="recordSelectedCount">
                      {totalSupportingStaff > 1
                        ? `${totalSupportingStaff} Record(s) Selected`
                        : `${totalSupportingStaff} record selected`}
                    </div>
                  </div>
                }
                key="1"
              >
                <SupportingStaff
                  handleSubmit={handleSubmit}
                  handleRemove={handleRemove}
                  noninternalSupportStaffData={
                    precrimescene.supportStaff
                      ? precrimescene.supportStaff.filter(
                          (s) => !s.internalFlag
                        )
                      : []
                  }
                  supportingStaff={supportingStaff}
                  setSupportingStaff={setSupportingStaff}
                  disableEdit={disableEdit}
                />
              </Panel>

              <Panel
                className="panelHeader"
                header={
                  <div className="headerTextContainer">
                    <div className="panelTitle">
                      Request for the Expert Team{" "}
                    </div>{" "}
                    <div className="recordSelectedCount">
                      {totalExpertTeam > 1
                        ? `${totalExpertTeam} Record(s) Selected`
                        : `${totalExpertTeam} record selected`}
                    </div>
                  </div>
                }
                key="2"
              >
                <ExpertTeam
                  handleSubmit={handleSubmit}
                  handleRemove={handleRemove}
                  noninternalExpertTeamData={
                    precrimescene.expertTeam
                      ? precrimescene.expertTeam.filter((x) => !x.internalFlag)
                      : []
                  }
                  expertTeam={expertTeam}
                  setExpertTeam={setExpertTeam}
                  disableEdit={disableEdit}
                />
              </Panel>

              <Panel
                className="panelHeader"
                header={
                  <div className="headerTextContainer">
                    <div className="panelTitle">Inform Senior Officer</div>{" "}
                    <div className="recordSelectedCount">
                      {totalseniorOfficier > 1
                        ? `${totalseniorOfficier} Record(s) Selected`
                        : `${totalseniorOfficier} record selected`}
                    </div>
                  </div>
                }
                key="3"
              >
                <InformSeniorOfficer
                  handleSubmit={handleSubmit}
                  handleRemove={handleRemove}
                  seniorOfficer={seniorOfficer}
                  setSeniorOfficer={setSeniorOfficer}
                  disableEdit={disableEdit}
                />
              </Panel>

              <Panel
                className="panelHeader"
                header={
                  <div className="headerTextContainer">
                    <div className="panelTitle">Crime Scene Being Shown By</div>{" "}
                    <div className="recordSelectedCount">
                      {totalCrimeSceneShownBy > 1
                        ? `${totalCrimeSceneShownBy} Record(s) Selected`
                        : `${totalCrimeSceneShownBy} record selected`}
                    </div>
                  </div>
                }
                key="4"
              >
                <CrimeSceneShown
                  addPersonDetails={addPersonDetails}
                  removePersonDetails={removePersonDetails}
                  handleSubmit={handleSubmit}
                  handleRemove={handleRemove}
                  personDetails={personDetails}
                  setpersonDetails={setpersonDetails}
                  noninternalPersonDetailsData={precrimescene.crimeShown}
                  disableEdit={disableEdit}
                />
              </Panel>
            </Collapse>
          </div>
        </>
      )}
    </>
  );
}
