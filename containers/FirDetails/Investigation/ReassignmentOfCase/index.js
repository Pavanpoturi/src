import { useState, useEffect, useMemo } from "react";
import { disableFutureDates } from "@components/Common/helperMethods";
import { textFieldRules } from "@components/Common/formOptions";
import { config } from "@config/site.config";
import {
  Row,
  Card,
  Col,
  Form,
  DatePicker,
  Upload,
  Button,
  Input,
  notification,
  Modal,
} from "antd";
import axios from "axios";
import { isEmpty, first, uniqBy, isArray, isNumber } from "lodash";
import {
  dummyRequest,
  DATE_FORMAT,
  renderFieldsWithDropDown,
  folderName,
  onFileChange,
  getMediaUploadError,
  getMediaPayload,
  getIONameAndRank,
} from "@containers/FirDetails/fir-util";
import masterDataActions from "@redux/masterData/actions";
import { CameraFilled } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import reassignmentOfCaseActions from "@redux/investigations/reassignmentOfCase/actions";
import { loadState } from "@lib/helpers/localStorage";
import DisplayReportGenerations from "@containers/FirDetails/CommonSections/DisplayReportGenerations";
import moment from "moment";
import Loader from "@components/utility/loader";
import SavedRecords from "./SavedRecords";
import ContentHeader from "../../ContentHeader";
import TemplatesModal from "../CommonForms/TemplatesModal";
import { ModuleWrapper } from "../CommonDetails/styles";
import {
  reassignmentOfCaseTemplates,
  reassignmentOfCaseForm,
  getDataForDocument,
  getHTMLFromTemplate,
  reasonForReAssigningList,
} from "./const";

export default function ReassignmentOfCase({ setSelectedSiderMenu }) {
  const [form] = Form.useForm();
  const crimeId = loadState("selectedFirId");
  const currentUser = loadState("currentUser");
  const selectedFir = loadState("selectedFir");
  const dispatch = useDispatch();
  const [uploadOpinion, setUploadOpinion] = useState([]);
  const [selectedUploadOrder, setSelectedUploadOrder] = useState([]);
  const [selectedTemplateName, setSelectedTemplateName] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [recordsIsModalVisible, setIsRecordsIsModalVisible] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [viewReassignmentOfCaseDetails, setViewReassignmentOfCaseDetails] =
    useState(false);
  const [editReassignmentOfCaseObj, setEditReassignmentOfCaseObj] =
    useState(null);
  const [serchText, setSerchText] = useState("");
  const [clickedIoDetails, setclickedIoDetails] = useState("");
  const [filtertotalStaffList, setfiltertotalStaffList] = useState([]);
  const [selectedRank, setselectedRank] = useState("");
  const [loading, setLoading] = useState(true);
  const { savedFir } = useSelector((state) => state.createFIR);
  const disableForm =
    savedFir?.caseStatus === "Disposal" ||
    savedFir?.isTransferOfCaseFile === true ||
    savedFir?.isChargeSheetTakenOrFiled === true;
  const briefFacts = savedFir?.firDetail?.briefFacts;
  const currentIoDetails = getIONameAndRank(briefFacts);

  const handleSearch = (text) => {
    setSerchText(text);
  };

  const {
    actionType,
    errorMessage,
    isFetching,
    reassignmentOfCaseList,
    successMessage,
  } = useSelector((state) => state.ReassignmentOfCase);

  const isSuccess =
    actionType === "ADD_REASSIGNMENT_OF_CASE_SUCCESS" ||
    "UPDATE_REASSIGNMENT_OF_CASE_SUCCESS";
  const isError =
    actionType === "ADD_REASSIGNMENT_OF_CASE_ERROR" ||
    "UPDATE_REASSIGNMENT_OF_CASE_ERROR";

  const {
    addReassignmentOfCaseDetails,
    updateReassignmentOfCaseDetails,
    getReassignmentOfCaseList,
    resetActionType,
  } = reassignmentOfCaseActions;

  const { getAllStaffList, getTsHierarchy } = masterDataActions;
  const {
    tsHierarchyList,
    allStaffList = [],
    isLoading,
  } = useSelector((state) => state.MasterData);

  const handleClickedIoDetails = (value) => {
    const selectedIO = allStaffList.find((item) => {
      let label = `${item.employeeName} ${
        item?.rankName ? `(${item.rankName})` : ""
      }`;
      return value === label;
    });
    if (
      !isEmpty(selectedIO?.cctns_unit_id) ||
      isNumber(selectedIO?.cctns_unit_id)
    ) {
      setclickedIoDetails(selectedIO);
    } else {
      openNotificationWithIcon("error", "CCTNS Unit Id Is Not Valid!");
    }
  };
  useEffect(() => {
    dispatch(
      getAllStaffList(
        `${config.getAllSupportStaffFromHrms}?policestationcode=${currentUser.cctns_unit_id}`
      )
    );
    setLoading(true);
  }, []);

  useEffect(() => {
    let loginPsDetails = tsHierarchyList.find(
      (ele) => ele?.ps_code.toString() === currentUser?.cctns_unit_id.toString()
    );
    //getting total district level ps
    let totalDistrictLevelPS = tsHierarchyList.filter(
      (ele) =>
        ele?.dist_code?.toString() === loginPsDetails?.dist_code?.toString()
    );

    let result = [];
    //combining all ps,circles etc.. for that loginps at district level
    totalDistrictLevelPS.forEach((ele) => {
      result.push(
        ele?.ps_code,
        ele?.circle_code,
        ele?.adg_code,
        ele?.range_code,
        ele?.sdpo_code,
        ele?.zone_code,
        ele?.sub_zone_code,
        ele?.dist_sp_cp_code
      );
    });
    //taking uniq codes
  }, [tsHierarchyList]);

  useEffect(() => {
    dispatch(getTsHierarchy(`${config.getReassignmentHierarchy}`));
  }, []);

  useEffect(() => {
    setfiltertotalStaffList([]);
    form.setFieldsValue({
      newIONameAndRank: "",
    });
    let n1 = [];
    let uniqData = uniqBy(allStaffList, "paoCode");
    if (selectedRank && allStaffList.length > 0) {
      uniqData.forEach((item) => {
        if (
          item?.rankName === selectedRank &&
          !currentIoDetails.includes(item.employeeName)
        ) {
          const container = {
            label: `${item.employeeName} ${
              item?.rankName ? `(${item.rankName})` : ""
            }`,
            name: item.paoCode,
          };
          n1.push(container);
        }
      });
    }
    setfiltertotalStaffList(n1);
  }, [selectedRank]);
  const rankListData = useMemo(() => {
    if (isArray(allStaffList)) {
      const map = {};
      allStaffList.forEach((staff) => {
        const rank = staff?.rankName;
        if (!isEmpty(rank) && isEmpty(map[rank]) && rank !== "HG") {
          map[rank] = {
            label: rank,
            name: staff?.paoCode,
          };
        }
      });
      setLoading(false);
      return Object.values(map);
    } else {
      return [];
    }
  }, [allStaffList]);

  const openNotificationWithIcon = (type, message) => {
    return notification[type]({
      message: message,
    });
  };

  useEffect(() => {
    if (isSuccess || isError) {
      if (
        successMessage === "Re-Assignment Of Case Successfully Added" ||
        successMessage === "Re-Assignment Of Case Successfully Updated"
      ) {
        openNotificationWithIcon("success", successMessage);
        form.resetFields();
        setSelectedSiderMenu("investigation");
        dispatch(resetActionType());
      } else if (errorMessage) {
        openNotificationWithIcon("error", errorMessage);
        dispatch(resetActionType());
      }
    }
  }, [actionType]);

  useEffect(() => {
    dispatch(
      getReassignmentOfCaseList(
        `${config.getReAssigningOfCase}?crimeId=${crimeId}`
      )
    );
    form.setFieldsValue({
      presentIONameAndRank: currentIoDetails,
    });
  }, []);

  const handleEditReassignment = (value) => {
    if (value) {
      let totalName = `${value?.newIOName} ${
        value?.newIORank ? `(${value.newIORank})` : ""
      }`;
      let clickedIoDetailsObject = {
        paoCode: value?.newIO,
        employeeName: value?.newIOName,
        rankName: value?.newIORank,
        mobileNo: value?.newIOContact,
        unitName: value?.newCctnsUnitName,
        cctns_unit_id: value?.newCctnsUnitId,
      };
      setclickedIoDetails(clickedIoDetailsObject);
      setEditReassignmentOfCaseObj(value);
      if (value?.courtOrderMedia && value?.courtOrderMedia?.url !== "") {
        setSelectedUploadOrder([
          {
            url: value?.courtOrderMedia?.url,
            name: value?.courtOrderMedia?.name,
          },
        ]);
      } else {
        setSelectedUploadOrder([]);
      }
      form.setFieldsValue({
        presentIONameAndRank: value?.presentIONameAndRank,
        dateOfReAssignment: moment(
          new Date(value?.dateOfReAssignment)
        ).isValid()
          ? moment(new Date(value?.dateOfReAssignment))
          : "",
        newIONameAndRank: totalName,
        newIORank: value?.newIORank,
        reasonForReAssigning: value?.reasonForReAssigning,
        orderNo: value?.orderNo,
        courtOrderDate: moment(new Date(value?.courtOrderDate)).isValid()
          ? moment(new Date(value?.courtOrderDate))
          : "",
      });
    }
  };

  const checkFields = async () => {
    const values = await form.validateFields();
    // setFormValid(!Object.values(values).every((v) => v == null || v === ""));
  };

  const displayFields = (name) => {
    switch (name) {
      case "dateOfReAssignment":
        return (
          <DatePicker
            format={DATE_FORMAT}
            placeholder="Select Date"
            onChange={checkFields}
            style={{ width: 250 }}
            disabledDate={disableFutureDates}
            disabled={viewReassignmentOfCaseDetails || disableForm}
          />
        );
      case "newIONameAndRank":
        return renderFieldsWithDropDown(
          filtertotalStaffList,
          handleClickedIoDetails,
          handleSearch,
          serchText,
          250,
          viewReassignmentOfCaseDetails || disableForm
        );
      case "newIORank":
        return renderFieldsWithDropDown(
          rankListData,
          setselectedRank,
          handleSearch,
          serchText,
          250,
          viewReassignmentOfCaseDetails || disableForm
        );
      case "reasonForReAssigning":
        return renderFieldsWithDropDown(
          reasonForReAssigningList,
          null,
          handleSearch,
          serchText,
          250,
          viewReassignmentOfCaseDetails || disableForm
        );
      case "courtOrderDate":
        return (
          <DatePicker
            format={DATE_FORMAT}
            placeholder="Select Date"
            onChange={checkFields}
            style={{ width: 250 }}
            disabledDate={disableFutureDates}
            disabled={viewReassignmentOfCaseDetails || disableForm}
          />
        );
      case "presentIONameAndRank":
        return (
          <Input
            onChange={checkFields}
            style={{ width: 250 }}
            maxLength={textFieldRules.maxLength}
            disabled={true}
            defaultValue={currentIoDetails}
          />
        );
      default:
        return (
          <Input
            onChange={checkFields}
            style={{ width: 250 }}
            maxLength={textFieldRules.maxLength}
            disabled={
              viewReassignmentOfCaseDetails ||
              name === "presentIONameAndRank" ||
              disableForm
            }
          />
        );
    }
  };

  const displayState = (data, actionName) => {
    return (
      <Row className="custody-reasons-row">
        {data.map((s, i) => {
          const isRequired = ["newIORank", "newIONameAndRank"].includes(s.name);
          return (
            <Col span={10} key={i} style={{ marginBottom: 20 }}>
              <Form.Item
                name={s.name}
                label={s.label}
                rules={[
                  {
                    required: isRequired,
                    message: `${s.label} field is required`,
                  },
                ]}
              >
                {actionName(s.name)}
              </Form.Item>
            </Col>
          );
        })}
      </Row>
    );
  };

  const savedUploadDocURL = editReassignmentOfCaseObj?.courtOrderMedia?.url
    ? editReassignmentOfCaseObj?.courtOrderMedia?.url
    : "";

  const displayUploadReports = (name, title) => {
    return (
      <Col className="file-upload" style={{ marginLeft: 0 }}>
        <Form.Item name={name}>
          <Upload
            fileList={
              editReassignmentOfCaseObj?._id && savedUploadDocURL !== ""
                ? selectedUploadOrder
                : uploadOpinion
            }
            customRequest={dummyRequest}
            onChange={(info) => onFileChange(info, setUploadOpinion)}
            multiple={false}
          >
            <Button
              className="saveButton"
              style={{ width: 215, marginTop: 10 }}
              icon={<CameraFilled style={{ marginRight: 230 }} />}
              disabled={
                viewReassignmentOfCaseDetails ||
                !isEmpty(uploadOpinion) ||
                disableForm
              }
            >
              {title}
            </Button>
          </Upload>
        </Form.Item>
      </Col>
    );
  };

  const showModal = (templateName, fileName, templateAvailable = false) => {
    if (templateAvailable) {
      setIsModalVisible(true);
      setSelectedTemplateName(`${templateName} - Preview`);
      setSelectedFileName(fileName);
    } else {
      setIsModalVisible(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const reportData = getDataForDocument(
    editReassignmentOfCaseObj,
    selectedFileName,
    selectedFir,
    currentUser,
    savedFir
  );
  const getPayload = (value, courtOrder) => {
    const payload = {
      crimeId: crimeId,
      presentIONameAndRank: currentIoDetails,
      dateOfReAssignment: value?.dateOfReAssignment,
      newIO: clickedIoDetails?.paoCode,
      newIOName: clickedIoDetails?.employeeName,
      newIORank: clickedIoDetails?.rankName,
      newIOContact: clickedIoDetails?.mobileNo,
      newCctnsUnitId: clickedIoDetails?.cctns_unit_id,
      newCctnsUnitName: clickedIoDetails?.unitName,
      oldIO: currentUser?.pao_code,
      oldIOName: currentUser?.employee_name,
      oldIORank: currentUser?.rank_name,
      oldIOContact: currentUser?.mobile_no,
      oldCctnsUnitId: currentUser?.cctns_unit_id,
      oldCctnsUnitName: clickedIoDetails?.unit_name,
      reasonForReAssigning: value?.reasonForReAssigning,
      orderNo: value?.orderNo,
      courtOrderDate: value?.courtOrderDate,
      courtOrderMedia: courtOrder,
    };
    return payload;
  };

  const submit = async () => {
    const value = await form.validateFields();
    const uploadOpinionData = new FormData();
    uploadOpinion.forEach((file) => {
      uploadOpinionData.append("file", file.originFileObj);
    });
    uploadOpinionData.append("prefixFolder", crimeId);
    uploadOpinionData.append(
      "folderPath",
      `${crimeId}/${folderName.REOPENING_OF_CASE}/file`
    );

    if (!isEmpty(uploadOpinion)) {
      axios
        .post(`${config.fileUpload}/upload`, uploadOpinionData)
        .then((res) => {
          if (res.status === 200) {
            const { data } = res.data;
            const payload = getPayload(
              value,
              first(getMediaPayload(data, folderName.REOPENING_OF_CASE))
            );
            if (editReassignmentOfCaseObj?._id) {
              const updatePayload = {
                _id: editReassignmentOfCaseObj?._id,
                ...payload,
              };
              dispatch(
                updateReassignmentOfCaseDetails(
                  config.updateReAssigningOfCase,
                  updatePayload
                )
              );
            } else {
              dispatch(
                addReassignmentOfCaseDetails(
                  config.createReAssigningOfCase,
                  payload
                )
              );
            }
          }
        })
        .catch((err) => {
          getMediaUploadError(err, openNotificationWithIcon);
        });
    } else if (isEmpty(uploadOpinion)) {
      const existingCourtOrder = editReassignmentOfCaseObj?.courtOrderMedia?.url
        ? editReassignmentOfCaseObj?.courtOrderMedia
        : {};
      const payload = getPayload(value, existingCourtOrder);
      if (editReassignmentOfCaseObj?._id) {
        const updatePayload = {
          _id: editReassignmentOfCaseObj?._id,
          ...payload,
        };
        dispatch(
          updateReassignmentOfCaseDetails(
            config.updateReAssigningOfCase,
            updatePayload
          )
        );
      } else {
        dispatch(
          addReassignmentOfCaseDetails(config.createReAssigningOfCase, payload)
        );
      }
    }
  };
  return (
    <ModuleWrapper>
      <ContentHeader
        headerTitle="Re-Assigning Of Case"
        addAnother
        addAnotherText="Add Another"
        onSubmitClick={submit}
        isInvestigation={true}
        onCancel={() => setSelectedSiderMenu("investigation")}
        disableButton={disableForm}
      />
      {isFetching || isLoading || loading ? (
        <Loader />
      ) : (
        <Row>
          <Card
            style={{ width: "70%", height: 500, minHeight: 500 }}
            className="cardLeftStyle"
          >
            <Form form={form} layout="vertical">
              <Col>
                {displayState(reassignmentOfCaseForm, displayFields)}
                {displayUploadReports("upload_order", "Upload Order")}
              </Col>
            </Form>
          </Card>
          <Card
            style={{ width: "30%", height: 500, minHeight: 500 }}
            className="right-section cardRightStyle"
          >
            <DisplayReportGenerations
              templateLists={reassignmentOfCaseTemplates}
              showModal={showModal}
              disabled={!editReassignmentOfCaseObj?._id || disableForm}
              selectedRecord={editReassignmentOfCaseObj}
              selectedModule="reassignmentOfCase"
              accusedId={editReassignmentOfCaseObj?._id}
            />
            {!isEmpty(reassignmentOfCaseList) ? (
              <Button
                style={{ marginTop: "40px", width: "100%" }}
                onClick={() => setIsRecordsIsModalVisible(true)}
              >
                {reassignmentOfCaseList && reassignmentOfCaseList.length > 0
                  ? reassignmentOfCaseList.length
                  : 0}{" "}
                Re-Assignment Of Case Records
              </Button>
            ) : null}
            <Modal
              title="Re-Assignment Of Case Records"
              visible={recordsIsModalVisible}
              onOk={() => setIsRecordsIsModalVisible(false)}
              onCancel={() => setIsRecordsIsModalVisible(false)}
              style={{ minWidth: "95vw" }}
              footer={null}
            >
              <div style={{ maxHeight: 400, overflowY: "auto" }}>
                <SavedRecords
                  dataSource={reassignmentOfCaseList}
                  editDetails={handleEditReassignment}
                  setViewDetails={setViewReassignmentOfCaseDetails}
                  selectedRecord={editReassignmentOfCaseObj}
                  recordVisible={setIsRecordsIsModalVisible}
                />
              </div>
            </Modal>
          </Card>
        </Row>
      )}
      {isModalVisible && (
        <TemplatesModal
          reportData={reportData}
          selectedTemplateName={selectedTemplateName}
          selectedFileName={selectedFileName}
          getHTMLFromTemplate={getHTMLFromTemplate}
          handleCancel={handleCancel}
          isModalVisible={isModalVisible}
        />
      )}
    </ModuleWrapper>
  );
}
