import { useState, useEffect } from "react";
import {
  Form,
  Col,
  Row,
  Button,
  Card,
  DatePicker,
  Input,
  Checkbox,
  notification,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import Loader from "@components/utility/loader";
import { config } from "@config/site.config";
import { isEmpty, isUndefined, isNull } from "lodash";
import createFIRActions from "@redux/createFir/actions";
import { loadState } from "@lib/helpers/localStorage";
import chargesheetActions from "@redux/investigations/chargesheet/actions";
import updateChargesheetActions from "@redux/investigations/updateChargeSheetStatus/actions";
import {
  renderFieldsWithDropDown,
  DATE_FORMAT,
  DATE_TIME_FORMAT,
} from "@containers/FirDetails/fir-util";
import { disableFutureDates } from "@components/Common/helperMethods";
import { getAuditHistoryPayload } from "@containers/const";
import auditHistoryActions from "@redux/auditHistory/actions";
import {
  ChargeSheetStatus,
  CaseTypeValue,
  reasonsForObjectionList,
} from "./const";

const { TextArea } = Input;
const CheckboxGroup = Checkbox.Group;

export default function UpdateChargeSheetStatus({
  setSelectedSiderMenu,
  isDashboard = false,
  onCancel,
  loadData,
  setIsFormSubmitted,
}) {
  const [form] = Form.useForm();
  const [serchText, setSerchText] = useState("");
  const dispatch = useDispatch();
  const crimeId = loadState("selectedFirId");
  const [checkedList, setCheckedList] = useState([]);
  const { createAuditHistory } = auditHistoryActions;
  const { getFIRData } = createFIRActions;
  const [selectedChargeSheetStatus, setSelectedChargeSheetStatus] =
    useState("");
  const [disableUpdateCSStatus, setDisableUpdateCSStatus] = useState(false);
  const { getChargesheetList } = chargesheetActions;
  const {
    addUpdateChargeSheetStatusDetails,
    getUpdateChargeSheetStatusList,
    resetActionType,
  } = updateChargesheetActions;
  const { savedFir } = useSelector((state) => state.createFIR);
  const disableForm = savedFir?.isFinalReportCreated;
  const isFiledCheckAndPutUp =
    selectedChargeSheetStatus === "Filed/Check And Put Up";
  const {
    actionType,
    errorMessage,
    isFetching,
    successMessage,
    chargesheetStatus,
  } = useSelector((state) => state.UpdateChargeSheetStatus);
  const { chargesheetList } = useSelector((state) => state.Chargesheet);
  const [updatedChargeSheet, setUpdatedChargeSheet] = useState(null);
  const [chargeSheetNumber, setChargeSheetNumber] = useState("");
  const isSuccess = actionType === "ADD_CHARGE_SHEET_STATUS_SUCCESS";
  const isError = actionType === "ADD_CHARGE_SHEET_STATUS_ERROR";
  const chargeSheetNumberList = chargesheetList
    .filter((item) => !item?.isDraft)
    .map((item) => {
      const container = {
        _id: item._id,
        label: item.chargeSheet.chargeSheetNo,
      };
      return container;
    });

  const handleDataUpdation = (chargesheetStatus) => {
    if (
      chargesheetStatus &&
      !isEmpty(chargesheetStatus) &&
      !isEmpty(chargesheetList)
    ) {
      setSelectedChargeSheetStatus(chargesheetStatus?.chargeSheetStatus);
      const isReInvestigation =
        chargesheetStatus?.chargeSheetStatus === "Re-Investigation";
      const DDRInwardNo = isReInvestigation
        ? chargesheetStatus?.reInvestigation?.DDRInwardNo
        : chargesheetStatus?.filedCheckAndPutUp?.DDRInwardNo;
      let remark = "";
      if (isReInvestigation) {
        remark = chargesheetStatus?.reInvestigation?.remarks;
      } else if (chargesheetStatus?.chargeSheetStatus === "Taken on File") {
        remark = chargesheetStatus?.takenOnFile?.remarks;
        setDisableUpdateCSStatus(true);
      } else if (
        chargesheetStatus?.chargeSheetStatus === "Filed/Check And Put Up"
      ) {
        remark = chargesheetStatus?.filedCheckAndPutUp?.remarks;
        setDisableUpdateCSStatus(false);
      }
      setCheckedList(
        chargesheetStatus?.returnWithObjection?.reasonsForObjection
      );
      const chargeSheetResult = chargesheetList.find((obj) => {
        return (
          obj.chargeSheet.chargeSheetNo === chargesheetStatus?.chargeSheetNo
        );
      });

      if (chargeSheetResult && !isUndefined(chargeSheetResult)) {
        const chargeSheet = chargeSheetResult?.chargeSheet;
        const data = {
          chargeSheetNo: chargeSheet?.chargeSheetNo,
          chargeSheetDate: chargeSheet?.chargeSheetDate,
          chargeSheetType: chargeSheet?.chargeSheetType,
          uploadChargeSheet: chargeSheetResult?.uploadChargeSheet,
          _id: chargeSheetResult?._id,
        };
        setUpdatedChargeSheet(data);
      } else {
        setUpdatedChargeSheet(null);
      }
      const returnWithObjection = chargesheetStatus?.returnWithObjection;
      const takenOnFile = chargesheetStatus?.takenOnFile;
      const reInvestigation = chargesheetStatus?.reInvestigation;
      const filedCheckAndPutUp = chargesheetStatus?.filedCheckAndPutUp;
      form.setFieldsValue({
        chargeSheetNumber: chargesheetStatus?.chargeSheetNo,
        chargeSheetStatus: chargesheetStatus?.chargeSheetStatus,
        dateOfReinvestigation:
          !isNull(reInvestigation?.dateOfReinvestigation) &&
          moment(new Date(reInvestigation?.dateOfReinvestigation)).isValid()
            ? moment(new Date(reInvestigation?.dateOfReinvestigation))
            : "",
        DDRInwardNo: DDRInwardNo,
        dateOfTakenOnFile:
          !isNull(takenOnFile?.dateOfTakenOnFile) &&
          moment(new Date(takenOnFile?.dateOfTakenOnFile)).isValid()
            ? moment(new Date(takenOnFile?.dateOfTakenOnFile))
            : "",
        caseType: takenOnFile?.caseType,
        courtCaseNo: takenOnFile?.courtCaseNo,
        dateOfObjection:
          !isNull(returnWithObjection?.dateOfObjection) &&
          moment(new Date(returnWithObjection?.dateOfObjection)).isValid()
            ? moment(new Date(returnWithObjection?.dateOfObjection))
            : "",
        reasonsForObjection: returnWithObjection?.reasonsForObjection,
        remarks: remark,
        dateOfFilingChargeSheet:
          !isNull(filedCheckAndPutUp?.dateOfFilingChargeSheet) &&
          moment(
            new Date(filedCheckAndPutUp?.dateOfFilingChargeSheet)
          ).isValid()
            ? moment(new Date(filedCheckAndPutUp?.dateOfFilingChargeSheet))
            : "",
      });
    } else {
      setUpdatedChargeSheet(null);
      setSelectedChargeSheetStatus("");
    }
  };

  const onChangeChargeSheetNumber = (val) => {
    setChargeSheetNumber(val);
    var result = chargesheetList.find((obj) => {
      return obj.chargeSheet.chargeSheetNo === val;
    });
    const data = {
      chargeSheetNo: result?.chargeSheet?.chargeSheetNo,
      chargeSheetDate: result?.chargeSheet?.chargeSheetDate,
      chargeSheetType: result?.chargeSheet?.chargeSheetType,
      uploadChargeSheet: result?.uploadChargeSheet,
      _id: result?._id,
    };
    if (
      chargesheetStatus?.some(
        (item) => item?.chargeSheetNo === result?.chargeSheet?.chargeSheetNo
      )
    ) {
      const obj = chargesheetStatus?.find(
        (item) => item?.chargeSheetNo === result?.chargeSheet?.chargeSheetNo
      );
      console.log("obj12", obj);
      handleDataUpdation(obj);
      setUpdatedChargeSheet(data);
    } else {
      setUpdatedChargeSheet(data);
      setDisableUpdateCSStatus(false);
      setSelectedChargeSheetStatus("");
      form.setFieldsValue({
        chargeSheetStatus: "",
        dateOfReinvestigation: "",
        DDRInwardNo: "",
        dateOfTakenOnFile: "",
        caseType: "",
        courtCaseNo: "",
        dateOfObjection: "",
        reasonsForObjection: "",
        remarks: "",
        dateOfFilingChargeSheet: "",
      });
    }
  };

  useEffect(() => {
    if (!isDashboard) {
      dispatch(
        getChargesheetList(`${config.getChargeSheet}?crimeId=${crimeId}`)
      );
      dispatch(
        getUpdateChargeSheetStatusList(
          `${config.getUpdateChargeSheetStatusv2}?crimeId=${crimeId}`
        )
      );
    }
  }, [isDashboard]);

  useEffect(() => {
    if (loadData) {
      dispatch(
        getChargesheetList(`${config.getChargeSheet}?crimeId=${crimeId}`)
      );
      dispatch(
        getUpdateChargeSheetStatusList(
          `${config.getUpdateChargeSheetStatusv2}?crimeId=${crimeId}`
        )
      );
    }
  }, [loadData]);

  const openNotificationWithIcon = (type, message) => {
    return notification[type]({
      message: message,
    });
  };

  const auditHistoryEntry = () => {
    dispatch(
      createAuditHistory(
        config.createAudits,
        getAuditHistoryPayload(
          crimeId,
          "investigation/updateChargesheet",
          "Chargesheet Updated"
        )
      )
    );
  };

  useEffect(() => {
    if (isSuccess || isError) {
      if (successMessage !== "") {
        openNotificationWithIcon("success", successMessage);
        auditHistoryEntry();
        dispatch(getFIRData(`${config.getFIR}?crimeId=${crimeId}`));
        if (!isDashboard) {
          setSelectedSiderMenu("investigation");
        } else {
          setIsFormSubmitted(true);
        }
        dispatch(resetActionType());
      } else if (errorMessage) {
        openNotificationWithIcon("error", errorMessage);
        dispatch(resetActionType());
      }
    }
  }, [actionType]);

  const handleSearch = (text) => {
    setSerchText(text);
  };

  const onChargeSheetStatusChange = (val) => {
    setSelectedChargeSheetStatus(val);
  };

  useEffect(() => {
    handleDataUpdation();
  }, [chargesheetStatus, chargesheetList]);

  const submitUpdateChargesheet = () => {
    if (
      isFiledCheckAndPutUp &&
      updatedChargeSheet &&
      updatedChargeSheet?.uploadChargeSheet?.name === ""
    ) {
      openNotificationWithIcon(
        "warning",
        "Please upload the Charge sheet copy in charge sheet page"
      );
    } else {
      submit();
    }
  };

  const submit = async () => {
    const values = await form.validateFields();
    let fllteredPayload = {};
    // eslint-disable-next-line default-case
    if (selectedChargeSheetStatus === "Re-Investigation") {
      fllteredPayload = {
        reInvestigation: {
          dateOfReinvestigation: values?.dateOfReinvestigation,
          DDRInwardNo: values?.DDRInwardNo,
          remarks: values?.remarks,
        },
      };
    } else if (selectedChargeSheetStatus === "Taken on File") {
      fllteredPayload = {
        takenOnFile: {
          dateOfTakenOnFile: values?.dateOfTakenOnFile,
          caseType: values?.caseType,
          courtCaseNo: values?.courtCaseNo,
          remarks: values?.remarks,
        },
      };
    } else if (selectedChargeSheetStatus === "Returned with Objection") {
      fllteredPayload = {
        returnWithObjection: {
          dateOfObjection: values?.dateOfObjection,
          reasonsForObjection: values?.reasonsForObjection,
        },
      };
    } else if (isFiledCheckAndPutUp) {
      fllteredPayload = {
        filedCheckAndPutUp: {
          DDRInwardNo: values?.DDRInwardNo,
          remarks: values?.remarks,
          dateOfFilingChargeSheet: values?.dateOfFilingChargeSheet,
        },
      };
    }
    const payload = {
      crimeId: crimeId,
      chargeSheetNo: updatedChargeSheet?.chargeSheetNo,
      chargeSheetDate: updatedChargeSheet?.chargeSheetDate,
      chargeSheetStatus: values?.chargeSheetStatus,
      chargeSheetId: updatedChargeSheet?._id,
      ...fllteredPayload,
    };
    dispatch(
      addUpdateChargeSheetStatusDetails(
        config.addUpdateChangeChargeSheetStatusv2,
        payload
      )
    );
  };

  const onChangeCheckbox = (list) => {
    setCheckedList(list);
  };

  return (
    <>
      <div
        className="contentHeaderContainer"
        style={{
          padding: 10,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h2 className="pageTitle">Update Charge Sheet Status</h2>
        </div>
        <div>
          <Button
            className="stepsButtonInActive"
            style={{
              background: "transparent",
              color: "#02599C",
              border: "none",
              boxShadow: "none",
            }}
            onClick={() =>
              isDashboard ? onCancel() : setSelectedSiderMenu("investigation")
            }
          >
            Cancel
          </Button>
          <Button
            type="primary"
            className="saveButton"
            style={{
              backgroundColor:
                isEmpty(chargesheetList) || !chargeSheetNumber
                  ? "#f5f5f5"
                  : "#258C0B",
              borderColor:
                isEmpty(chargesheetList) || !chargeSheetNumber
                  ? "#d9d9d9"
                  : "#258C0B",
              width: 140,
              color:
                isEmpty(chargesheetList) || !chargeSheetNumber
                  ? "rgba(0, 0, 0, 0.25)"
                  : "#fff",
              marginRight: 10,
            }}
            disabled={
              isEmpty(chargesheetList) || disableForm || !chargeSheetNumber
            }
            onClick={submitUpdateChargesheet}
          >
            Submit
          </Button>
        </div>
      </div>
      {isFetching ? (
        <Loader />
      ) : (
        <Form form={form} layout="vertical">
          <Card style={{ minHeight: "20vh" }}>
            <Row gutter={24}>
              <Col span={8}>
                <Form.Item
                  name="chargeSheetNumber"
                  label="Charge Sheet Number"
                  rules={[
                    {
                      required: true,
                      message: "Please Select Charge Sheet Number!",
                    },
                  ]}
                >
                  {renderFieldsWithDropDown(
                    chargeSheetNumberList,
                    (data) => onChangeChargeSheetNumber(data),
                    handleSearch,
                    serchText,
                    222,
                    false,
                    null,
                    null,
                    () => setChargeSheetNumber("")
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="chargeSheetDate" label="Charge Sheet Date">
                  {!isNull(updatedChargeSheet) &&
                  updatedChargeSheet?.chargeSheetDate
                    ? moment(updatedChargeSheet?.chargeSheetDate).format(
                        DATE_FORMAT
                      )
                    : ""}
                </Form.Item>
              </Col>
              <Col span={8} style={{ width: "222px" }}>
                <Form.Item
                  name="chargeSheetStatus"
                  label="Select Charge Sheet Status"
                  style={{ width: "250px" }}
                  rules={[
                    {
                      required: true,
                      message: "Please Select Charge Sheet Status!",
                    },
                  ]}
                >
                  {renderFieldsWithDropDown(
                    ChargeSheetStatus,
                    onChargeSheetStatusChange,
                    handleSearch,
                    serchText,
                    250,
                    disableForm || disableUpdateCSStatus || !chargeSheetNumber
                  )}
                </Form.Item>
              </Col>
              {selectedChargeSheetStatus === "Re-Investigation" ? (
                <>
                  <Col span={8}>
                    <Form.Item
                      name="dateOfReinvestigation"
                      label="Date of Re-Investigation"
                    >
                      <DatePicker
                        showTime
                        format={DATE_TIME_FORMAT}
                        placeholder="Select Date"
                        style={{ width: 250 }}
                        disabled={disableForm}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item name="DDRInwardNo" label="DDR/Inward/SR No.">
                      <Input style={{ width: 250 }} disabled={disableForm} />
                    </Form.Item>
                  </Col>
                  <Col span={21}>
                    <Form.Item name="remarks" label="Remarks">
                      <TextArea rows={4} columns={3} disabled={disableForm} />
                    </Form.Item>
                  </Col>
                </>
              ) : null}
              {selectedChargeSheetStatus === "Taken on File" ? (
                <Col span={20} style={{ padding: 10 }}>
                  <Row gutter={24}>
                    <Col span={8}>
                      <Form.Item
                        name="dateOfTakenOnFile"
                        label="Date of Taken on File of Charge Sheet"
                        rules={[
                          {
                            required: true,
                            message:
                              "Date of Taken on File of Charge Sheet is required!",
                          },
                        ]}
                      >
                        <DatePicker
                          showTime
                          format={DATE_TIME_FORMAT}
                          placeholder="Select Date"
                          style={{ width: 250 }}
                          disabled={disableForm || disableUpdateCSStatus}
                          disabledDate={disableFutureDates}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={8} style={{ width: "222px" }}>
                      <Form.Item
                        name="caseType"
                        label="Case Type"
                        style={{ width: "250px" }}
                        rules={[{ required: true }]}
                      >
                        {renderFieldsWithDropDown(
                          CaseTypeValue,
                          null,
                          handleSearch,
                          serchText,
                          250,
                          disableForm || disableUpdateCSStatus
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        name="courtCaseNo"
                        label="CC No."
                        rules={[{ required: true }]}
                      >
                        <Input
                          style={{ width: 250 }}
                          disabled={disableForm || disableUpdateCSStatus}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <div style={{ margin: "24px 0" }} />
                  <Form.Item name="remarks" label="Remarks">
                    <TextArea
                      rows={4}
                      columns={3}
                      disabled={disableForm || disableUpdateCSStatus}
                    />
                  </Form.Item>
                </Col>
              ) : null}
              {selectedChargeSheetStatus === "Returned with Objection" ? (
                <Col span={20} style={{ padding: 10 }}>
                  <Row gutter={24}>
                    <Col span={8}>
                      <Form.Item
                        name="dateOfObjection"
                        label="Date of Objection"
                      >
                        <DatePicker
                          showTime
                          format={DATE_TIME_FORMAT}
                          placeholder="Select Date"
                          style={{ width: 250 }}
                          disabled={disableForm}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={24} style={{ marginTop: 10 }}>
                    <Col span={8}>
                      <Form.Item
                        name="reasonsForObjection"
                        label="Reason For Objection"
                        valuePropName="checked"
                        style={{ minWidth: 200 }}
                      >
                        <CheckboxGroup
                          options={reasonsForObjectionList}
                          value={checkedList}
                          onChange={onChangeCheckbox}
                          disabled={disableForm}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
              ) : null}
              {isFiledCheckAndPutUp ? (
                <Col span={20} style={{ padding: 10 }}>
                  <Row gutter={24}>
                    <Col span={8}>
                      <Form.Item name="DDRInwardNo" label="DDR/Inward/SR No.">
                        <Input style={{ width: 250 }} disabled={disableForm} />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        name="dateOfFilingChargeSheet"
                        label="Date of Filing Charge sheet in Court"
                      >
                        <DatePicker
                          showTime
                          format={DATE_TIME_FORMAT}
                          placeholder="Select Date"
                          style={{ width: 250 }}
                          disabled={disableForm}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <div style={{ margin: "24px 0" }} />
                  <Form.Item name="remarks" label="Remarks">
                    <TextArea rows={4} columns={3} disabled={disableForm} />
                  </Form.Item>
                </Col>
              ) : null}
            </Row>
          </Card>
        </Form>
      )}
    </>
  );
}
