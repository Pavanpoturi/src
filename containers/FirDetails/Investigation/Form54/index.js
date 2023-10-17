import { useState, useEffect } from "react";
import {
  Card,
  Form,
  notification,
  Button,
  Modal,
  Row,
  Col,
  Input,
  DatePicker,
} from "antd";
import { useSelector, useDispatch } from "react-redux";
import form54Action from "@redux/investigations/form54/actions";
import { loadState } from "@lib/helpers/localStorage";
import moment from "moment";
import { isEmpty, isUndefined, isNull, isBoolean, first } from "lodash";
import { config } from "@config/site.config";
import Loader from "@components/utility/loader";
import {
  DATE_FORMAT,
  DATE_YY_MM_DD,
  getSectionsData,
} from "@containers/FirDetails/fir-util";
import { getAuditHistoryPayload } from "@containers/const";
import auditHistoryActions from "@redux/auditHistory/actions";
import SavedRecords from "./SavedRecords";
import ContentHeader from "../../ContentHeader";
import { Form54Wrapper } from "./styles";
import {
  form54Templates,
  getDataForDocument,
  getHTMLFromTemplate,
} from "./const";
import TemplatesModal from "../CommonForms/TemplatesModal";
import UploadLetters from "./uploadLetters";

export default function Form54({ setSelectedSiderMenu }) {
  const { savedFir } = useSelector((state) => state.createFIR);
  const [form54Form] = Form.useForm();
  const crimeId = loadState("selectedFirId");
  const selectedFir = loadState("selectedFir");
  const currentUser = loadState("currentUser");
  const selectedActsData = loadState("selectedActDetails");
  const dispatch = useDispatch();
  const [addAnother, setAddAnother] = useState(false);
  const [isFormUpload, setIsFormUpload] = useState(false);
  const [editForm54Obj, setEditForm54] = useState(null);
  const [viewForm54, setViewForm54] = useState(false);
  const [isRecordsModalVisible, setIsRecordsModalVisible] = useState(false);
  const [selectedGenerationDate, setSelectedGenerationDate] = useState("");
  const [selectedTribunalDate, setSelectedTribunalDate] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTemplateName, setSelectedTemplateName] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");
  const [firDetails, setFirDetails] = useState("");
  const [isform1Uploaded, setIsform1Uploaded] = useState([]);
  const [isform2Uploaded, setIsform2Uploaded] = useState([]);
  const [isformReportUploaded, setIsformReportUploaded] = useState([]);

  const { actionType, successMessage, errorMessage, isFetching, form54List } =
    useSelector((state) => state.Form54);

  const {
    addform54Details,
    updateform54Details,
    getform54List,
    resetActionType,
  } = form54Action;
  const { createAuditHistory } = auditHistoryActions;
  const isDisabled = viewForm54 || isFormUpload;

  const isSuccess =
    actionType === "ADD_FORM54_SUCCESS" ||
    actionType === "UPDATE_FORM54_SUCCESS";

  const isError =
    actionType === "ADD_FORM54_ERROR" || actionType === "UPDATE_FORM54_ERROR";

  const openNotificationWithIcon = (type, message) => {
    return notification[type]({
      message: message,
    });
  };

  const fetchForm54List = () => {
    dispatch(getform54List(`${config.form54}?crimeId=${crimeId}`));
  };

  const auditHistoryEntry = () => {
    const auditType =
      actionType === "ADD_FORM54_SUCCESS"
        ? "Form 54 Created"
        : "Form 54 Updated";
    dispatch(
      createAuditHistory(
        config.createAudits,
        getAuditHistoryPayload(crimeId, "investigation/form54", auditType)
      )
    );
  };

  useEffect(() => {
    if (isSuccess || isError) {
      if (successMessage !== "") {
        openNotificationWithIcon("success", successMessage);
        auditHistoryEntry();
        form54Form.setFieldsValue({
          firNum: selectedFir?.firNum,
          firDate:
            !isEmpty(selectedFir?.occurenceOfOffence?.firDate) &&
            moment(selectedFir?.occurenceOfOffence?.firDate).isValid()
              ? moment(selectedFir?.occurenceOfOffence?.firDate).format(
                  DATE_FORMAT
                )
              : "",
          referenceNumber: "",
          generationDate: "",
          dateSentToTribunal: "",
        });
        setEditForm54(null);
        setIsform1Uploaded([]);
        setIsform2Uploaded([]);
        setIsformReportUploaded([]);
        fetchForm54List();
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

  const displayHeaderContent = () => {
    const headerData = !isEmpty(selectedFir?.actsAndSections)
      ? getSectionsData(selectedActsData?.uniqActs)
      : selectedFir?.section;
    return headerData;
  };

  useEffect(() => {
    fetchForm54List();
    form54Form.setFieldsValue({
      firNum: selectedFir?.firNum,
      firDate:
        !isEmpty(selectedFir?.occurenceOfOffence?.firDate) &&
        moment(selectedFir?.occurenceOfOffence?.firDate).isValid()
          ? moment(selectedFir?.occurenceOfOffence?.firDate).format(DATE_FORMAT)
          : "",
    });
  }, []);

  const handleEditForm54 = (value) => {
    if (value) {
      setEditForm54(value);
      setFirDetails(value);
      const acknowledgementLetter = value?.acknowledgementLetter;
      const formOneLetter = value?.formOneLetter;
      const formTwoLetter = value?.formTwoLetter;
      if (acknowledgementLetter && !isUndefined(acknowledgementLetter?.name)) {
        setIsformReportUploaded([acknowledgementLetter]);
      } else {
        setIsformReportUploaded([]);
      }
      if (formOneLetter && !isUndefined(formOneLetter?.name)) {
        setIsform1Uploaded([formOneLetter]);
      } else {
        setIsform1Uploaded([]);
      }
      if (formTwoLetter && !isUndefined(formTwoLetter?.name)) {
        setIsform2Uploaded([formTwoLetter]);
      } else {
        setIsform2Uploaded([]);
      }
      const generationDate =
        !isNull(value?.generationDate) && value?.generationDate;
      const dateSentToTribunal =
        value?.dateSentToTribunal &&
        !isNull(value?.dateSentToTribunal) &&
        value?.dateSentToTribunal;
      setSelectedGenerationDate(moment(generationDate).format(DATE_YY_MM_DD));
      !isNull(dateSentToTribunal)
        ? setSelectedTribunalDate(
            moment(dateSentToTribunal).format(DATE_YY_MM_DD)
          )
        : setSelectedTribunalDate("");
      form54Form.setFieldsValue({
        firNum: selectedFir?.firNum,
        firDate:
          !isEmpty(selectedFir?.occurenceOfOffence?.firDate) &&
          moment(selectedFir?.occurenceOfOffence?.firDate).isValid()
            ? moment(selectedFir?.occurenceOfOffence?.firDate).format(
                DATE_FORMAT
              )
            : "",
        referenceNumber: value?.referenceNumber,
        generationDate:
          !isNull(value?.generationDate) &&
          moment(new Date(value?.generationDate)).isValid()
            ? moment(new Date(value?.generationDate))
            : "",
        dateSentToTribunal:
          !isNull(value?.dateSentToTribunal) &&
          moment(new Date(value?.dateSentToTribunal)).isValid()
            ? moment(new Date(value?.dateSentToTribunal))
            : "",
      });
    }
  };

  const getForm54Details = (values, form54Media) => {
    const ackLetter =
      !isEmpty(isformReportUploaded) && first(isformReportUploaded);
    const formOneLetter = !isEmpty(isform1Uploaded) && first(isform1Uploaded);
    const formTwoLetter = !isEmpty(isform2Uploaded) && first(isform2Uploaded);
    const form54Details = {
      crimeId: crimeId,
      form54Detail: {
        referenceNumber: values?.referenceNumber,
        generationDate: values?.generationDate,
        dateSentToTribunal: values?.dateSentToTribunal,
        isForm54Submitted: true,
        form54Media: form54Media,
        acknowledgementLetter: {
          mimeType: ackLetter ? ackLetter?.mimeType : "",
          name: ackLetter ? ackLetter?.name : "",
          url: ackLetter ? ackLetter?.url : "",
          fileId:
            ackLetter && isUndefined(ackLetter?.fileId)
              ? ackLetter?.id
              : ackLetter?.fileId,
        },
        formOneLetter: {
          mimeType: formOneLetter ? formOneLetter?.mimeType : "",
          name: formOneLetter ? formOneLetter?.name : "",
          url: formOneLetter ? formOneLetter?.url : "",
          fileId:
            formOneLetter && isUndefined(formOneLetter?.fileId)
              ? formOneLetter?.id
              : formOneLetter?.fileId,
        },
        formTwoLetter: {
          mimeType: formTwoLetter ? formTwoLetter?.mimeType : "",
          name: formTwoLetter ? formTwoLetter?.name : "",
          url: formTwoLetter ? formTwoLetter?.url : "",
          fileId:
            formTwoLetter && isUndefined(formTwoLetter?.fileId)
              ? formTwoLetter?.id
              : formTwoLetter?.fileId,
        },
      },
    };
    return form54Details;
  };

  const dispatchForm54Details = (form54Id, payload) => {
    if (form54Id) {
      dispatch(
        updateform54Details(config.form54, payload, selectedFir?.firNum)
      );
    } else {
      dispatch(addform54Details(config.form54, payload, selectedFir?.firNum));
    }
  };

  const existingMedia =
    !isUndefined(editForm54Obj?.form54Media) &&
    !isEmpty(editForm54Obj?.form54Media)
      ? editForm54Obj?.form54Media
      : [];

  const submit = async () => {
    const values = await form54Form.validateFields();
    const form54DetailId = editForm54Obj?._id;
    if (
      isform1Uploaded.length === 0 ||
      isform2Uploaded.length === 0 ||
      isformReportUploaded.length === 0
    ) {
      openNotificationWithIcon("error", "Please Upload Mandatory Forms");
    } else {
      setIsFormUpload(false);
      const addForm54DetailsPayload = getForm54Details(values, existingMedia);
      const updateForm54DetailsPayload = {
        crimeId: crimeId,
        form54DetailId: form54DetailId,
        ...getForm54Details(values, existingMedia),
      };
      const payloadData = form54DetailId
        ? updateForm54DetailsPayload
        : addForm54DetailsPayload;
      dispatchForm54Details(form54DetailId, payloadData);
    }
  };

  const onGeberationDateChange = (date, _dateString) => {
    setSelectedGenerationDate(moment(date).format(DATE_YY_MM_DD));
  };

  const onTribunalDateChange = (date, _dateString) => {
    setSelectedTribunalDate(moment(date).format(DATE_YY_MM_DD));
  };

  const isValidTribunalDate =
    selectedGenerationDate &&
    selectedTribunalDate &&
    moment(selectedTribunalDate).isSameOrAfter(selectedGenerationDate);

  const showModal = (templateName, fileName, templateAvailable = false) => {
    if (templateAvailable) {
      setIsModalVisible(true);
      setSelectedTemplateName(`${templateName} - Preview`);
      setSelectedFileName(fileName);
    } else {
      setIsModalVisible(false);
    }
  };

  const reportData = getDataForDocument(
    editForm54Obj,
    selectedFileName,
    selectedFir,
    currentUser,
    firDetails,
    savedFir
  );

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <Form54Wrapper>
      <ContentHeader
        headerTitle="Form 54"
        addAnother
        addAnotherText="Add Another"
        onSubmitClick={submit}
        setAddAnother={setAddAnother}
        disableButton={
          viewForm54 ||
          (isBoolean(isValidTribunalDate) && !isValidTribunalDate) ||
          isFormUpload
        }
        isInvestigation={true}
        onCancel={() => setSelectedSiderMenu("investigation")}
      />
      {isFetching ? (
        <Loader />
      ) : (
        <div className="widgetPageStyle">
          <Card className="cardLeftStyle">
            {isFormUpload && <Loader />}
            <Form form={form54Form} layout="vertical">
              <Row gutter={24}>
                <Col span={7}>
                  <Form.Item name="firNum" label="FIR No">
                    <Input style={{ width: 220 }} disabled={true} />
                  </Form.Item>
                </Col>
                <Col span={7}>
                  <Form.Item name="firDate" label="FIR Date">
                    <Input style={{ width: 220 }} disabled={true} />
                  </Form.Item>
                </Col>
                <Col span={7}>
                  <Form.Item name="actsAndSections" label="Acts & Sections">
                    <div
                      className="headerContent ant-input ant-input-disabled"
                      style={{ width: 300, height: 75, overflowY: "auto" }}
                    >
                      {displayHeaderContent()}
                    </div>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={7}>
                  <Form.Item
                    name="referenceNumber"
                    label="Reference Number (File No)"
                    rules={[
                      {
                        required: true,
                        message: "Reference Number is required!",
                      },
                    ]}
                  >
                    <Input style={{ width: 220 }} disabled={isDisabled} />
                  </Form.Item>
                </Col>
                <Col span={7}>
                  <Form.Item
                    name="generationDate"
                    label="Generation Date"
                    rules={[
                      {
                        required: true,
                        message: "Generation Date is required!",
                      },
                    ]}
                  >
                    <DatePicker
                      format={DATE_FORMAT}
                      onChange={onGeberationDateChange}
                      disabledDate={(current) => {
                        let customDate = moment(
                          selectedFir?.dateOfReport
                        ).format(DATE_YY_MM_DD);
                        return (
                          current && current < moment(customDate, DATE_YY_MM_DD)
                        );
                      }}
                      disabled={isDisabled}
                      placeholder="Select Date"
                      style={{ width: 220 }}
                    />
                  </Form.Item>
                </Col>
                <Col span={7}>
                  <Form.Item
                    name="dateSentToTribunal"
                    label="Date Sent to Tribunal"
                  >
                    <DatePicker
                      format={DATE_FORMAT}
                      onChange={onTribunalDateChange}
                      disabledDate={(current) => {
                        let customDate = moment(
                          selectedFir?.dateOfReport
                        ).format(DATE_YY_MM_DD);
                        return (
                          current && current < moment(customDate, DATE_YY_MM_DD)
                        );
                      }}
                      disabled={isDisabled}
                      placeholder="Select Date"
                      style={{ width: 220 }}
                    />
                  </Form.Item>
                </Col>
                {isBoolean(isValidTribunalDate) && !isValidTribunalDate ? (
                  <div
                    className="ant-form-item-explain-error"
                    style={{ marginTop: 5, marginLeft: 15 }}
                  >
                    Tribunal Date should be greater than or equal to Generation
                    Date
                  </div>
                ) : null}
              </Row>
            </Form>
          </Card>
          <Card className="right-section cardRightStyle">
            <UploadLetters
              templateLists={form54Templates}
              showModal={showModal}
              disabled={isDisabled || viewForm54}
              selectedRecord={{ ...editForm54Obj, crimeId: crimeId }}
              selectedModule="form54"
              accusedId={editForm54Obj?._id}
              setIsform1Uploaded={setIsform1Uploaded}
              setIsform2Uploaded={setIsform2Uploaded}
              setIsformReportUploaded={setIsformReportUploaded}
              isform1Uploaded={isform1Uploaded}
              isform2Uploaded={isform2Uploaded}
              isformReportUploaded={isformReportUploaded}
              setIsFormUpload={setIsFormUpload}
            />
            {!isEmpty(form54List) ? (
              <Button
                style={{ width: "100%", marginTop: 15 }}
                onClick={() => setIsRecordsModalVisible(true)}
              >
                Form-54 Records (
                {form54List && form54List.length > 0 ? form54List.length : 0})
              </Button>
            ) : null}
          </Card>
          <Modal
            title="Form 54 Records"
            visible={isRecordsModalVisible}
            onOk={() => setIsRecordsModalVisible(false)}
            onCancel={() => setIsRecordsModalVisible(false)}
            width={1500}
            footer={null}
          >
            <div style={{ maxHeight: 650, overflowY: "auto" }}>
              <SavedRecords
                dataSource={form54List}
                editForm54Details={handleEditForm54}
                viewForm54Details={setViewForm54}
                selectedRecord={editForm54Obj}
                recordVisible={setIsRecordsModalVisible}
                disableForm={false}
              />
            </div>
          </Modal>
        </div>
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
    </Form54Wrapper>
  );
}
