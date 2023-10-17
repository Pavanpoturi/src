/* eslint-disable array-callback-return */
import { useState, useEffect } from "react";
import moment from "moment";
import { disableFutureDates } from "@components/Common/helperMethods";
import Loader from "@components/utility/loader";
import { config } from "@config/site.config";
import axios from "axios";
import {
  Row,
  Card,
  Col,
  Form,
  Input,
  Select,
  DatePicker,
  Radio,
  Upload,
  Button,
  Checkbox,
  notification,
  Avatar,
  Modal,
} from "antd";
import {
  CaretDownOutlined,
  CameraFilled,
  UserOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import { getAccuseds, DATE_TIME_FORMAT } from "@containers/FirDetails/fir-util";
import suspectAccusedAction from "@redux/investigations/suspectAccused/actions";
import firActions from "@redux/fir/actions";
import { useDispatch, useSelector } from "react-redux";
import { isEmpty, isArray, isUndefined } from "lodash";
import { loadState } from "@lib/helpers/localStorage";
import masterDataActions from "@redux/masterData/actions";
import tipAccusedActions from "@redux/investigations/tipAccused/actions";
import DisplayReportGenerations from "@containers/FirDetails/CommonSections/DisplayReportGenerations";
import { getAuditHistoryPayload } from "@containers/const";
import auditHistoryActions from "@redux/auditHistory/actions";
import { getFileById } from "@containers/media-util";
import TemplatesModal from "../CommonForms/TemplatesModal";
import {
  TIPAccusedTemplates,
  getDataForDocument,
  getHTMLFromTemplate,
} from "./const";
import ContentHeader from "../../ContentHeader";
import { ModuleWrapper } from "../CommonDetails/styles";
import SavedRecords from "./SavedRecords";

const Option = Select.Option;

export default function TIPAccused({ setSelectedSiderMenu }) {
  const [form] = Form.useForm();
  const crimeId = loadState("selectedFirId");
  const selectedFir = loadState("selectedFir");
  const currentUser = loadState("currentUser");
  const [formValid, setFormValid] = useState(true);
  const { suspectAccusedList } = useSelector((state) => state.SuspectAccused);
  const [serchText, setSerchText] = useState("");
  const [selectedTemplateName, setSelectedTemplateName] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");
  const dispatch = useDispatch();
  const { getAccusedList } = suspectAccusedAction;
  const { fetchWitnessDetailsList } = firActions;
  const [addAnother, setAddAnother] = useState(false);
  const [tipAccusedFileList, setTipAccusedFileList] = useState([]);
  const [uploadedTipAccusedFileList, setUploadedTipAccusedFileList] = useState(
    []
  );
  const [selectedUploadTipReport, setSelectedUploadTipReport] = useState([]);
  const [recordsIsModalVisible, setrecordsIsModalVisible] = useState(false);
  const [isTemplateModalVisible, setTemplateIsModalVisible] = useState(false);
  const [vieiwClicked, setvieiwClicked] = useState(false);
  const [editClicked, seteditClicked] = useState(false);
  const [clickedDetails, setclickedDetails] = useState({});
  const [selectedIdentifiedList, setSelectedIdentifiedList] = useState([]);
  const [whetherIdentifiedState, setWhetherIdentifiedState] = useState(false);
  const { getCourtsBasedonPsCode } = masterDataActions;
  const { courtsFromPSList } = useSelector((state) => state.MasterData);
  const {
    actionType,
    errorMessage,
    isFetching,
    TIPAccusedList,
    successMessage,
  } = useSelector((state) => state.tipAccused);
  const { createAuditHistory } = auditHistoryActions;
  const { witnessStatementList } = useSelector((state) => state.FIR);
  const {
    addTIPAccusedDetails,
    updateTIPAccusedDetails,
    getTIPAccusedList,
    resetActionType,
  } = tipAccusedActions;

  const reportData = getDataForDocument(
    clickedDetails,
    selectedFileName,
    selectedFir,
    currentUser
  );

  const { savedFir } = useSelector((state) => state.createFIR);
  const disableForm =
    savedFir?.caseStatus === "Disposal" ||
    savedFir?.isTransferOfCaseFile === true ||
    savedFir?.isChargeSheetTakenOrFiled === true;

  useEffect(() => {
    dispatch(
      getCourtsBasedonPsCode(
        `${config.masterData}/getCourtsBasedonPsCode?psCode=${currentUser?.cctns_unit_id}`
      )
    );
    dispatch(
      fetchWitnessDetailsList(
        `${config.getPostCrimeSceneDetails}/WITNESSDETAILS/?crimeId=${crimeId}`
      )
    );
    fetchAccusedList();
    getTIPAccusedListFunc();
  }, []);

  const getSavedData = () => {
    let savedData = [];
    isArray(witnessStatementList) &&
      !isEmpty(witnessStatementList) &&
      // eslint-disable-next-line array-callback-return
      witnessStatementList.map((data) => {
        savedData.push(data);
      });
    return savedData;
  };

  const fetchAccusedList = () => {
    dispatch(
      getAccusedList(
        `${config.getPostCrimeSceneDetails}/ACCUSED/?crimeId=${crimeId}`
      )
    );
  };

  const getTIPAccusedListFunc = () => {
    dispatch(getTIPAccusedList(`${config.tipAccused}/?crimeId=${crimeId}`));
  };

  const isSuccess =
    actionType === "ADD_TIPACCUSED_SUCCESS" ||
    actionType === "UPDATE_TIPACCUSED_SUCCESS";

  const isError =
    actionType === "ADD_TIPACCUSED_ERROR" ||
    actionType === "UPDATE_TIPACCUSED_ERROR";

  const handleTemplateCancel = () => {
    setTemplateIsModalVisible(false);
  };

  const submit = async () => {
    const values = await form.validateFields();
    createTipAccusedPayload(values);
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

  const handleSearch = (text) => {
    setSerchText(text);
  };

  const getAccusedDropdownData = () => getAccuseds(suspectAccusedList);

  const openNotificationWithIcon = (type, message) => {
    return notification[type]({
      message: message,
    });
  };

  const auditHistoryEntry = () => {
    const auditType =
      actionType === "ADD_TIPACCUSED_SUCCESS"
        ? "Test Identification Of Accused Created"
        : "Test Identification Of Accused Updated";
    dispatch(
      createAuditHistory(
        config.createAudits,
        getAuditHistoryPayload(
          crimeId,
          "investigation/testIdentificationOfAccused",
          auditType
        )
      )
    );
  };

  useEffect(() => {
    if (isSuccess || isError) {
      if (
        successMessage === "TIP Accused Successfully Added" ||
        successMessage === "TIP Accused Successfully Updated"
      ) {
        openNotificationWithIcon("success", successMessage);
        auditHistoryEntry();
        form.resetFields();
        getTIPAccusedListFunc();
        dispatch(resetActionType());
        seteditClicked(false);
      } else if (errorMessage) {
        openNotificationWithIcon("error", errorMessage);
        dispatch(resetActionType());
      }
    }
  }, [actionType]);

  const defaultSelctedfuc = (wit, acc) => {
    let final = false;
    if (vieiwClicked && selectedIdentifiedList) {
      selectedIdentifiedList.forEach((ele) => {
        if (ele.witnessId === wit && ele.accusedId === acc) {
          final = true;
        }
      });
    }
    return final;
  };

  useEffect(() => {
    setSelectedIdentifiedList(clickedDetails?.identifiedList);
    function getID(params) {
      let n1 = [];
      params.forEach((ele) => {
        n1.push(ele._id);
      });
      return n1;
    }
    const identifiedOrNot = clickedDetails?.identifiedOrNot;
    setWhetherIdentifiedState(identifiedOrNot ? identifiedOrNot : false);
    const tipAccusedMedia = clickedDetails?.tipAccusedMedia;
    if (tipAccusedMedia && tipAccusedMedia?.name !== "") {
      setSelectedUploadTipReport([tipAccusedMedia]);
    } else {
      setSelectedUploadTipReport([]);
    }
    setUploadedTipAccusedFileList(tipAccusedMedia);
    form.setFieldsValue({
      witnessIdentifying: getID(
        clickedDetails?.witnessList ? clickedDetails?.witnessList : []
      ),
      accused: getID(
        clickedDetails?.accusedList ? clickedDetails?.accusedList : []
      ),
      requisitionFiled: moment(
        new Date(clickedDetails?.requisitionDate)
      ).isValid()
        ? moment(new Date(clickedDetails?.requisitionDate))
        : "",
      tipOrderNo: clickedDetails?.tipOrderNumber
        ? clickedDetails?.tipOrderNumber
        : "",
      tipOrderDate: moment(new Date(clickedDetails?.tipOrderDate)).isValid()
        ? moment(new Date(clickedDetails?.tipOrderDate))
        : "",
      tipConductedDate: moment(
        new Date(clickedDetails?.tipConductedDate)
      ).isValid()
        ? moment(new Date(clickedDetails?.tipConductedDate))
        : "",
      wheaterIdentified: clickedDetails.identifiedOrNot
        ? clickedDetails?.identifiedOrNot
        : false,
      courtName: clickedDetails?.courtName ? clickedDetails?.courtName : "",
      noticeServed: clickedDetails?.noticeServedOnAccused
        ? clickedDetails?.noticeServedOnAccused
        : false,
    });
  }, [clickedDetails]);

  const handleUpload = (options) => {
    if (tipAccusedFileList.length > 0) {
      const mediaFormData = new FormData();
      tipAccusedFileList.forEach((file) => {
        mediaFormData.append("file", file.originFileObj);
      });
      mediaFormData.append("prefixFolder", crimeId);
      mediaFormData.append("folderPath", `${crimeId}/TipAccused/media`);

      axios
        .post(`${config.fileUpload}/upload`, mediaFormData)
        .then((response) => {
          if (response.data.success) {
            setUploadedTipAccusedFileList(response?.data?.data[0]);
            openNotificationWithIcon(
              "success",
              `Uploaded ${response.data.data[0].name}`
            );
            options.onSuccess("ok");
          }
        })
        .catch((err) => {
          console.log(err);
          setTipAccusedFileList([]);
          openNotificationWithIcon("error", "Uploaing Went Wrong");
          options.onError("ok");
        });
    }
  };

  const createTipAccusedPayload = async (values) => {
    let tipCodes = {};
    values.witnessIdentifying.forEach((ele) => {
      getSavedData().forEach((s1) => {
        if (ele === s1.person._id) {
          tipCodes[`${s1.person._id}`] = s1.witnessCode ? s1.witnessCode : "";
        }
      });
    });

    values.accused.forEach((ele) => {
      getAccusedDropdownData().forEach((s1) => {
        if (ele === s1._id) {
          tipCodes[`${s1._id}`] = s1.accusedCode ? s1.accusedCode : "";
        }
      });
    });

    const addPayload = {
      crimeId: crimeId,
      witnessList: values.witnessIdentifying,
      accusedList: values.accused,
      requisitionDate: values.requisitionFiled,
      tipOrderNumber: values.tipOrderNo,
      tipOrderDate: values.tipOrderDate,
      tipConductedDate: values.tipConductedDate,
      identifiedOrNot: values.wheaterIdentified,
      courtName: values.courtName,
      tipAccusedMedia: {
        mimeType: uploadedTipAccusedFileList
          ? uploadedTipAccusedFileList.mimeType
          : "",
        name: uploadedTipAccusedFileList ? uploadedTipAccusedFileList.name : "",
        url: uploadedTipAccusedFileList ? uploadedTipAccusedFileList.url : "",
        fileId: uploadedTipAccusedFileList ? uploadedTipAccusedFileList.id : "",
      },
      noticeServedOnAccused: values.noticeServed,
    };

    if (!editClicked) {
      dispatch(
        addTIPAccusedDetails(config.tipAccused, {
          ...addPayload,
          tipCodes: tipCodes,
        })
      );
    } else {
      addPayload._id = clickedDetails._id;
      addPayload.identifiedList = selectedIdentifiedList;
      dispatch(updateTIPAccusedDetails(config.tipAccused, addPayload));
    }
  };

  const handleDownload = (file) => {
    getFileById(file?.fileId, file?.name, file?.url);
  };

  return (
    <ModuleWrapper>
      <ContentHeader
        headerTitle="Test Identification Of Accused"
        addAnother
        addAnotherText="Add Another"
        onSubmitClick={submit}
        isInvestigation={true}
        setAddAnother={setAddAnother}
        onCancel={() => setSelectedSiderMenu("investigation")}
        disableButton={!formValid || disableForm}
      />
      {isFetching ? (
        <Loader />
      ) : (
        <Row>
          <Card style={{ width: "70%" }} className="cardLeftStyle">
            <Form form={form} layout="vertical" disabled={true}>
              <Col>
                <Row>
                  <Col span={8} style={{ padding: "12px" }}>
                    <Form.Item
                      name="witnessIdentifying"
                      label="Witness Identifying the Accused"
                      rules={[{ required: true }]}
                    >
                      <Select
                        allowClear
                        mode="multiple"
                        suffixIcon={
                          <CaretDownOutlined className="dropDownIcon" />
                        }
                        showSearch
                        onSearch={handleSearch}
                        style={{ width: 200 }}
                        filterOption={(input, option) =>
                          serchText &&
                          option.props.label
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                        disabled={vieiwClicked || disableForm}
                      >
                        {getSavedData().map((item, index) => (
                          <Select.Option
                            key={index}
                            value={item?.person?._id}
                            label={
                              item?.person
                                ? item?.person?.personalDetails
                                  ? item?.person?.personalDetails?.name
                                  : ""
                                : ""
                            }
                          >
                            {item?.person
                              ? item?.person?.personalDetails
                                ? item?.person?.personalDetails?.name
                                : ""
                              : ""}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={8} style={{ padding: "12px" }}>
                    <Form.Item
                      name="accused"
                      label="Accused"
                      rules={[{ required: true }]}
                    >
                      <Select
                        allowClear
                        mode="multiple"
                        suffixIcon={
                          <CaretDownOutlined className="dropDownIcon" />
                        }
                        showSearch
                        onSearch={handleSearch}
                        style={{ width: 200 }}
                        filterOption={(input, option) =>
                          serchText &&
                          option.props.label
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                        disabled={vieiwClicked || disableForm}
                      >
                        {!isEmpty(getAccusedDropdownData()) &&
                          getAccusedDropdownData().map((item, index) => (
                            <Option
                              key={index}
                              value={item._id}
                              label={item.label}
                            >
                              {item.label}
                            </Option>
                          ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={8} style={{ padding: "12px" }}>
                    <Form.Item
                      name="requisitionFiled"
                      label="Requisition Filed Date & Time"
                    >
                      <DatePicker
                        showTime
                        format={DATE_TIME_FORMAT}
                        placeholder="Select Date & Time"
                        style={{ width: 200 }}
                        disabledDate={disableFutureDates}
                        disabled={vieiwClicked || disableForm}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8} style={{ padding: "12px" }}>
                    <Form.Item
                      name="noticeServed"
                      label="Notice Served On Accused?"
                    >
                      <Radio.Group
                        disabled={vieiwClicked || disableForm}
                        defaultValue={false}
                      >
                        <Radio value={true}>Yes</Radio>
                        <Radio value={false}>No</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                </Row>

                {vieiwClicked || editClicked ? (
                  <Card className="card-style">
                    <Row gutter={24}>
                      <Col span={8} style={{ padding: "12px" }}>
                        <Form.Item name="tipOrderNo" label="TIP Order Number">
                          <Input
                            placeholder="Enter here"
                            disabled={vieiwClicked || disableForm}
                            style={{ width: 200 }}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={8} style={{ padding: "12px" }}>
                        <Form.Item name="tipOrderDate" label="TIP Order Date">
                          <DatePicker
                            showTime
                            format={DATE_TIME_FORMAT}
                            placeholder="Select Date & Time"
                            style={{ width: 200 }}
                            disabledDate={disableFutureDates}
                            disabled={vieiwClicked || disableForm}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={8} style={{ padding: "12px" }}>
                        <Form.Item
                          name="tipConductedDate"
                          label="TIP Conducted on Date"
                        >
                          <DatePicker
                            showTime
                            format={DATE_TIME_FORMAT}
                            placeholder="Select Date & Time"
                            style={{ width: 200 }}
                            disabledDate={disableFutureDates}
                            disabled={vieiwClicked || disableForm}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={8} style={{ padding: "12px" }}>
                        <Form.Item
                          name="wheaterIdentified"
                          label="Wheather Identified or Not?"
                          onChange={(e) => {
                            if (e.target.value === "true") {
                              setWhetherIdentifiedState(true);
                            } else if (e.target.value === "false") {
                              setWhetherIdentifiedState(false);
                            }
                          }}
                        >
                          <Radio.Group
                            disabled={vieiwClicked || disableForm}
                            defaultValue={false}
                          >
                            <Radio value={true}>Yes</Radio>
                            <Radio value={false}>No</Radio>
                          </Radio.Group>
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item name="courtName" label="Court Name">
                          <Select
                            allowClear
                            suffixIcon={
                              <CaretDownOutlined className="dropDownIcon" />
                            }
                            showSearch
                            onSearch={handleSearch}
                            style={{ width: 200 }}
                            filterOption={(input, option) =>
                              serchText &&
                              option.props.label
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            }
                            disabled={vieiwClicked || disableForm}
                          >
                            {courtsFromPSList &&
                              isArray(courtsFromPSList) &&
                              !isEmpty(courtsFromPSList) &&
                              courtsFromPSList
                                .map(({ court }) => ({ label: court }))
                                .map((item, index) => (
                                  <Select.Option
                                    key={index}
                                    value={item.label}
                                    label={item.label}
                                  >
                                    {item.label}
                                  </Select.Option>
                                ))}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col
                        span={8}
                        className="file-upload"
                        style={{ padding: 0, margin: 0 }}
                      >
                        <Form.Item>
                          <Upload
                            fileList={
                              clickedDetails?._id &&
                              !isUndefined(clickedDetails?.tipAccusedMedia) &&
                              clickedDetails?.tipAccusedMedia?.name !== ""
                                ? selectedUploadTipReport
                                : tipAccusedFileList
                            }
                            onChange={async (info) => {
                              await setTipAccusedFileList(info.fileList);
                            }}
                            onPreview={handleDownload}
                            customRequest={(options) => handleUpload(options)}
                            multiple={false}
                            maxCount={1}
                          >
                            <Button
                              className="saveButton"
                              icon={<CameraFilled />}
                              disabled={vieiwClicked || disableForm}
                            >
                              Upload TIP Report
                            </Button>
                          </Upload>
                        </Form.Item>
                      </Col>
                      {whetherIdentifiedState ? (
                        <>
                          <Col span={24} style={{ marginTop: "48px" }}>
                            <h6>Accused identified</h6>
                          </Col>
                          {clickedDetails.witnessList.map((wit) => {
                            return (
                              <Col
                                span={6}
                                style={{ marginTop: "20px", padding: "12px" }}
                              >
                                <div style={{ display: "flex" }}>
                                  <Avatar
                                    shape="square"
                                    size="large"
                                    icon={<UserOutlined />}
                                  />
                                  <div style={{ paddingLeft: "8px" }}>
                                    <p>
                                      {wit.personalDetails.name
                                        ? wit.personalDetails.name
                                        : ""}
                                      {clickedDetails.tipCodes &&
                                      clickedDetails.tipCodes[wit._id]
                                        ? `(${
                                            clickedDetails.tipCodes[wit._id]
                                          })`
                                        : ""}
                                    </p>
                                    <p>
                                      {wit.personalDetails.gender
                                        ? wit.personalDetails.gender
                                        : ""}
                                    </p>

                                    <p>
                                      {wit.personalDetails.dateOfBirth
                                        ? `${moment().diff(
                                            wit.personalDetails.dateOfBirth,
                                            "years"
                                          )} Years`
                                        : ""}
                                    </p>
                                    <p>
                                      {wit.contactDetails[0] &&
                                      wit.contactDetails[0].phoneNumber
                                        ? wit.contactDetails[0].phoneNumber
                                        : ""}
                                    </p>
                                  </div>
                                </div>
                                <Checkbox.Group
                                  style={{ width: "100%" }}
                                  disabled={!editClicked || disableForm}
                                  onChange={async (e) => {
                                    let filterdList =
                                      selectedIdentifiedList.filter(function (
                                        el
                                      ) {
                                        return el.witnessId !== wit._id;
                                      });

                                    let finalArray = [];
                                    e.forEach((ele) => {
                                      let n1 = {
                                        witnessId: wit._id,
                                        accusedId: ele,
                                      };
                                      finalArray.push(n1);
                                    });
                                    console.log([
                                      ...filterdList,
                                      ...finalArray,
                                    ]);
                                    await setSelectedIdentifiedList([
                                      ...filterdList,
                                      ...finalArray,
                                    ]);
                                  }}
                                >
                                  <Row>
                                    {clickedDetails.accusedList.map((acc) => {
                                      return (
                                        <Col
                                          span={24}
                                          style={{
                                            border: "1px solid  #d9dcde",
                                            padding: "12px",
                                          }}
                                        >
                                          <Checkbox
                                            key={acc._id}
                                            value={acc._id}
                                            defaultChecked={defaultSelctedfuc(
                                              wit._id,
                                              acc._id
                                            )}
                                            icon={<UserOutlined />}
                                          >
                                            {defaultSelctedfuc(
                                              wit._id,
                                              acc._id
                                            ) ? (
                                              <CheckOutlined
                                                style={{ color: "blue" }}
                                              />
                                            ) : (
                                              ""
                                            )}
                                            <Avatar
                                              shape="square"
                                              size="medium"
                                              icon={<UserOutlined />}
                                            />{" "}
                                            <p>
                                              {acc.personalDetails.name
                                                ? acc.personalDetails.name
                                                : ""}
                                            </p>
                                            <small>
                                              {clickedDetails.tipCodes &&
                                              clickedDetails.tipCodes[acc._id]
                                                ? `(${
                                                    clickedDetails.tipCodes[
                                                      acc._id
                                                    ]
                                                  })`
                                                : ""}
                                            </small>
                                          </Checkbox>
                                        </Col>
                                      );
                                    })}
                                  </Row>
                                </Checkbox.Group>
                              </Col>
                            );
                          })}
                        </>
                      ) : null}
                    </Row>
                  </Card>
                ) : (
                  ""
                )}
              </Col>
            </Form>
          </Card>
          <Card
            style={{ width: "30%" }}
            className="right-section cardRightStyle"
          >
            <DisplayReportGenerations
              templateLists={TIPAccusedTemplates}
              showModal={showModal}
              disabled={!editClicked || disableForm}
              selectedRecord={clickedDetails}
              selectedModule="tipAccused"
              accusedId={clickedDetails ? clickedDetails._id : ""}
            />
            {!isEmpty(TIPAccusedList) ? (
              <Button
                style={{ marginTop: "40px", width: "100%" }}
                onClick={() => setrecordsIsModalVisible(true)}
              >
                {TIPAccusedList && TIPAccusedList.length > 0
                  ? TIPAccusedList.length
                  : 0}{" "}
                TIP Accused Records
              </Button>
            ) : null}
            <Modal
              title="Test Identification Of Accused Records"
              visible={recordsIsModalVisible}
              onOk={() => setrecordsIsModalVisible(false)}
              onCancel={() => setrecordsIsModalVisible(false)}
              style={{ minWidth: "95vw" }}
              footer={null}
            >
              <div style={{ maxHeight: 650, overflowY: "auto" }}>
                <SavedRecords
                  TIPAccusedList={TIPAccusedList}
                  setclickedDetails={setclickedDetails}
                  setvieiwClicked={setvieiwClicked}
                  seteditClicked={seteditClicked}
                  setFormValid={setFormValid}
                  clickedDetails={clickedDetails}
                  isMedia={false}
                  recordVisible={setrecordsIsModalVisible}
                />
              </div>
            </Modal>
          </Card>
        </Row>
      )}
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
    </ModuleWrapper>
  );
}
