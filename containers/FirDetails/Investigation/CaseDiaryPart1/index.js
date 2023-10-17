import { useState, useEffect } from "react";
import { config } from "@config/site.config";
import RichTextEditorWithTable from "@components/Common/RichTextEditorWithTable";
import { useDispatch, useSelector } from "react-redux";
import Loader from "@components/utility/loader";
import { first, isEmpty } from "lodash";
import moment from "moment";
import { Form, Col, Row, Button, Card, DatePicker, notification } from "antd";
import {
  renderFieldsWithDropDown,
  // DATE_TIME_FORMAT,
  DATE_FORMAT,
  DATE_YY_MM_DD,
} from "@containers/FirDetails/fir-util";
import { loadState } from "@lib/helpers/localStorage";
import caseDiaryActions from "@redux/investigations/caseDiary/actions";
import { getAuditHistoryPayload } from "@containers/const";
import auditHistoryActions from "@redux/auditHistory/actions";
import { disableFutureDates } from "@components/Common/helperMethods";
import SavedRecords from "./SavedRecords";
import PrintCaseDiary from "./PrintCaseDiary";
import { reasonsForUI } from "../../../const";
import { ModuleWrapper } from "../CommonDetails/styles";

export default function CaseDiaryPart1({ setSelectedSiderMenu }) {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const crimeId = loadState("selectedFirId");
  const { savedFir } = useSelector((state) => state.createFIR);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [serchText, setSerchText] = useState("");
  const [selectedReason, setSelectedReason] = useState("");
  const [richTextContent, setRichTextContent] = useState("");
  const [editCaseDiaryObj, setEditCaseDiaryObj] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [viewCaseDiary, setViewCaseDiary] = useState(null);

  const [formValid, setFormValid] = useState(false);
  const [selectedlastCdDate, setSelectedlastCdDate] = useState("");
  const [selectedcdPartOneDate, setSelectedcdPartOneDate] = useState("");
  const [selectedDateError, setSelectedDateError] = useState("");

  const {
    createCaseDiary,
    updateCaseDiary,
    getCaseDiary,
    generateCaseDiary,
    resetActionType,
  } = caseDiaryActions;
  const { createAuditHistory } = auditHistoryActions;

  const {
    actionType,
    errorMessage,
    isFetching,
    caseDiaryList,
    successMessage,
  } = useSelector((state) => state.CaseDiary);
  const selectedSubReason = first(
    reasonsForUI.filter((s) => s.label === selectedReason)
  )?.subReason;

  const lastCDdate = savedFir?.firDetail?.occurenceOfOffence?.firDate;

  const isSuccess =
    actionType === "ADD_CASE_DIARY_SUCCESS" ||
    actionType === "UPDATE_CASE_DIARY_SUCCESS" ||
    actionType === "GENERATE_CASE_DIARY_SUCCESS" ||
    actionType === "UPLOAD_CASE_DIARY_SUCCESS" ||
    actionType === "DELETE_CASE_DIARY_SUCCESS";
  const isError =
    actionType === "ADD_CASE_DIARY_ERROR" ||
    actionType === "UPDATE_CASE_DIARY_ERROR" ||
    actionType === "GENERATE_CASE_DIARY_ERROR" ||
    actionType === "UPLOAD_CASE_DIARY_ERROR" ||
    actionType === "DELETE_CASE_DIARY_ERROR";

  const openNotificationWithIcon = (type, message) => {
    return notification[type]({
      message: message,
    });
  };

  const onReasonChange = (val) => {
    setSelectedReason(val);
    form.setFieldsValue({
      subReason: "",
    });
  };

  const getCaseDiaryList = () => {
    dispatch(getCaseDiary(`${config.getCaseDiary}?crimeId=${crimeId}`));
  };

  const auditHistoryEntry = () => {
    const auditType =
      actionType === "ADD_CASE_DIARY_SUCCESS"
        ? "PART-1 CD Created"
        : "PART-1 CD Updated";
    dispatch(
      createAuditHistory(
        config.createAudits,
        getAuditHistoryPayload(crimeId, "investigation/caseDiary", auditType)
      )
    );
  };

  useEffect(() => {
    getCaseDiaryList();
  }, []);

  useEffect(() => {
    if (caseDiaryList.length === 0) {
      const tempDate = moment(new Date(lastCDdate)).isValid()
        ? moment(new Date(lastCDdate))
        : "";
      setSelectedlastCdDate(tempDate);
      form.setFieldsValue({
        cdDate: tempDate,
      });
    } else {
      const data = caseDiaryList[caseDiaryList.length - 1];
      const tempDate = moment(new Date(data?.cdPartOneDate)).isValid()
        ? moment(new Date(data?.cdPartOneDate))
        : "";
      setSelectedlastCdDate(tempDate);
      form.setFieldsValue({
        cdDate: tempDate,
      });
    }
  }, [caseDiaryList]);

  useEffect(() => {
    if (isSuccess || isError) {
      if (successMessage !== "") {
        openNotificationWithIcon("success", successMessage);
        auditHistoryEntry();
        getCaseDiaryList();
        dispatch(resetActionType());
        setRichTextContent("");
        setSelectedReason("");
        setEditCaseDiaryObj(null);
        form.resetFields();
      } else if (errorMessage) {
        openNotificationWithIcon("error", errorMessage);
        dispatch(resetActionType());
      }
    }
  }, [actionType]);

  const handleSearch = (text) => {
    setSerchText(text);
  };

  const handleEditCaseDiary = (value) => {
    if (value) {
      setEditCaseDiaryObj(value);
      setSelectedReason(value.reasonUI);
      setRichTextContent(value.gistInvestigation);
      form.setFieldsValue({
        cdDate: moment(new Date(value?.cdDate)).isValid()
          ? moment(new Date(value?.cdDate))
          : "",
        cdPartOneDate: moment(new Date(value?.cdPartOneDate)).isValid()
          ? moment(new Date(value?.cdPartOneDate))
          : "",
        reasonUI: value.reasonUI,
        subReason: value.subReason,
      });
    }
  };

  const submit = async () => {
    if (selectedDateError === true) {
      openNotificationWithIcon(
        "error",
        "CD Part 1 Date should be greater than or equal to the Last CD  Date"
      );
    } else {
      if (
        richTextContent === "" ||
        richTextContent.length === 0 ||
        richTextContent === "<p><br></p>"
      ) {
        openNotificationWithIcon(
          "error",
          "Required to fill Gist of Investigating"
        );
      } else {
        const values = await form.validateFields();
        const payload = {
          crimeId: crimeId,
          caseDiary: {
            cdDate: values.cdDate,
            cdPartOneDate: values.cdPartOneDate,
            reasonUI: values.reasonUI,
            subReason: values.subReason,
            gistInvestigation: richTextContent,
          },
        };
        if (editCaseDiaryObj?._id) {
          const updatedPayload = {
            caseDiaryId: editCaseDiaryObj?._id,
            ...payload,
          };
          dispatch(updateCaseDiary(config.updateCaseDiary, updatedPayload));
        } else {
          dispatch(createCaseDiary(config.createCaseDiary, payload));
        }
      }
    }
  };

  const generateCaseDiaryDetails = (value) => {
    setSelectedRecord(value);
    const payload = {
      crimeId: crimeId,
      caseDiaryId: value?._id,
      caseDiary: {
        state: "generated",
        cdDate: value.cdDate,
        cdPartOneDate: value.cdPartOneDate,
        reasonUI: value.reasonUI,
        subReason: value.subReason,
        gistInvestigation: richTextContent
          ? richTextContent
          : value?.gistInvestigation,
      },
    };
    dispatch(generateCaseDiary(config.updateCaseDiary, payload));
  };

  const printCaseDiary = (value) => {
    setIsModalVisible(true);
    setSelectedRecord(value);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const reset = () => {
    form.resetFields();
    setRichTextContent("");
    setViewCaseDiary(false);
  };

  const checkFields = async () => {
    const values = await form.validateFields();
    setFormValid(!Object.values(values).every((v) => v == null || v === ""));
  };

  const lastCdDateChange = (date, _dateString) => {
    setSelectedlastCdDate(moment(date).format(DATE_YY_MM_DD));
    checkFields();
  };

  const cdPartOneDateChangee = (date, _dateString) => {
    let date1 = new Date(selectedlastCdDate);
    date1.setHours(0, 0, 0, 0);
    let date2 = new Date(date);
    date2.setHours(0, 0, 0, 0);
    if (new Date(date1) > new Date(date2)) {
      setSelectedDateError(true);
    } else {
      setSelectedDateError(false);
    }
    setSelectedcdPartOneDate(moment(date).format(DATE_YY_MM_DD));
    checkFields();
  };

  return (
    <ModuleWrapper>
      <div className="contentHeaderContainer">
        <div>
          <h2 className="pageTitle">PART-1 CD</h2>
        </div>
        <div>
          <Button
            type="link"
            onClick={() => setSelectedSiderMenu("investigation")}
          >
            Cancel
          </Button>
          <Button type="link" onClick={reset}>
            Reset
          </Button>
          <Button
            type="primary"
            className="saveButton"
            style={{ width: 140, marginRight: 10 }}
            onClick={submit}
            disabled={viewCaseDiary}
          >
            Submit
          </Button>
        </div>
      </div>
      {isFetching ? (
        <Loader />
      ) : (
        <Row>
          <Card style={{ width: "62%" }} className="cardLeftStyle">
            <Form form={form} layout="vertical">
              <Row gutter={24}>
                <Col span={8}>
                  <Form.Item name="cdDate" label="Last CD Date">
                    <DatePicker
                      format={DATE_FORMAT}
                      onChange={lastCdDateChange}
                      placeholder="Select Date"
                      style={{ width: 220 }}
                      disabled={viewCaseDiary}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="cdPartOneDate"
                    label="CD Part 1 Date"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <DatePicker
                      format={DATE_FORMAT}
                      onChange={cdPartOneDateChangee}
                      placeholder="Select Date and Time"
                      style={{ width: 220 }}
                      disabledDate={disableFutureDates}
                      disabled={viewCaseDiary}
                    />
                  </Form.Item>
                </Col>
                <Col span={8} style={{ width: "222px" }}>
                  <Form.Item
                    name="reasonUI"
                    label="Reason for UI"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    {renderFieldsWithDropDown(
                      reasonsForUI,
                      onReasonChange,
                      handleSearch,
                      serchText,
                      220,
                      viewCaseDiary
                    )}
                  </Form.Item>
                </Col>
                {selectedReason === "Digital Evidence" ||
                selectedReason === "For Collection of Experts Reports" ? (
                  <Col span={8}>
                    <Form.Item name="subReason" label="Select Sub Reason">
                      {renderFieldsWithDropDown(
                        selectedSubReason,
                        null,
                        handleSearch,
                        serchText,
                        220,
                        viewCaseDiary
                      )}
                    </Form.Item>
                  </Col>
                ) : null}
              </Row>
              <Row style={{ marginTop: 20, marginBottom: 10 }}>
                <Col span={24} style={{ marginBottom: 10 }}>
                  <h3>
                    <span style={{ color: "red" }}> * </span>Gist of
                    Investigating
                  </h3>
                </Col>
                <Col span={24} style={{ minHeight: "48vh" }}>
                  <RichTextEditorWithTable
                    onChange={setRichTextContent}
                    readOnly={viewCaseDiary}
                    value={richTextContent || ""}
                    height="40vh"
                  />
                </Col>
              </Row>
            </Form>
          </Card>
          <Card
            style={{ width: "38%" }}
            className="right-section cardRightStyle"
          >
            {!isEmpty(caseDiaryList) && (
              <SavedRecords
                dataSource={caseDiaryList}
                editDetails={handleEditCaseDiary}
                setViewDetails={setViewCaseDiary}
                selectedRecord={editCaseDiaryObj}
                generateCaseDiary={generateCaseDiaryDetails}
                openNotificationWithIcon={openNotificationWithIcon}
                printCaseDiary={printCaseDiary}
              />
            )}
          </Card>
          {isModalVisible ? (
            <PrintCaseDiary
              title="PART-1 CD"
              isModalVisible={isModalVisible}
              handleCancel={handleCancel}
              savedFir={savedFir}
              selectedRecord={selectedRecord}
              caseDiaryList={caseDiaryList}
            />
          ) : null}
        </Row>
      )}
    </ModuleWrapper>
  );
}
