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
import { DATE_TIME_FORMAT } from "@containers/FirDetails/fir-util";
import { useDispatch, useSelector } from "react-redux";
import { isEmpty, isArray, isUndefined } from "lodash";
import { loadState } from "@lib/helpers/localStorage";
import masterDataActions from "@redux/masterData/actions";
import stolenPropertyActions from "@redux/investigations/stolenProperty/actions";
import tipArticlesActions from "@redux/investigations/tipArticles/actions";
import DisplayReportGenerations from "@containers/FirDetails/CommonSections/DisplayReportGenerations";
import firActions from "@redux/fir/actions";
import { getAuditHistoryPayload } from "@containers/const";
import auditHistoryActions from "@redux/auditHistory/actions";
import { getFileById } from "@containers/media-util";
import SavedRecords from "./SavedRecords";
import ContentHeader from "../../ContentHeader";
import { ModuleWrapper } from "../CommonDetails/styles";
import {
  TIPAccusedTemplates,
  getDataForDocument,
  getHTMLFromTemplate,
} from "./const";
import TemplatesModal from "../CommonForms/TemplatesModal";

export default function TIPArticles({ setSelectedSiderMenu }) {
  const [form] = Form.useForm();
  const [formValid, setFormValid] = useState(true);
  const dispatch = useDispatch();
  const crimeId = loadState("selectedFirId");
  const selectedFir = loadState("selectedFir");
  const currentUser = loadState("currentUser");
  const [serchText, setSerchText] = useState("");
  const [selectedTemplateName, setSelectedTemplateName] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");
  const [addAnother, setAddAnother] = useState(false);
  const [tipArticlesFileList, setTipArticlesFileList] = useState([]);
  const [uploadedTipArticlesFileList, setUploadedtipArticlesFileList] =
    useState([]);
  const [isTemplateModalVisible, setTemplateIsModalVisible] = useState(false);
  const [vieiwClicked, setvieiwClicked] = useState(false);
  const [editClicked, seteditClicked] = useState(false);
  const [clickedDetails, setclickedDetails] = useState({});
  const [selectedIdentifiedList, setSelectedIdentifiedList] = useState([]);
  const { fetchWitnessDetailsList, fetchMaterialObjectList } = firActions;
  const [materilaObjectApi, setMaterilaObjectApi] = useState([]);
  const [stolenPropertyApiList, setStolenPropertyApiList] = useState([]);
  const [recordsIsModalVisible, setrecordsIsModalVisible] = useState(false);
  const [selectedUploadTipReport, setSelectedUploadTipReport] = useState([]);

  const { createAuditHistory } = auditHistoryActions;
  const { getCourtsBasedonPsCode } = masterDataActions;
  const { courtsFromPSList } = useSelector((state) => state.MasterData);
  const {
    actionType,
    errorMessage,
    isFetching,
    TIPAccusedList,
    successMessage,
  } = useSelector((state) => state.tipArticles);
  const {
    addTIPArticlesDetails,
    updateTIPArticlesDetails,
    getTIPArticlesList,
    resetActionType,
  } = tipArticlesActions;

  const { savedFir } = useSelector((state) => state.createFIR);
  const disableForm =
    savedFir?.caseStatus === "Disposal" ||
    savedFir?.isTransferOfCaseFile === true ||
    savedFir?.isChargeSheetTakenOrFiled === true;

  const { witnessStatementList, materialObjectList } = useSelector(
    (state) => state.FIR
  );
  const { stolenPropertyList } = useSelector((state) => state.stolenProperty);

  const { getStolenPropertyList } = stolenPropertyActions;

  const reportData = getDataForDocument(
    clickedDetails,
    selectedFileName,
    selectedFir,
    currentUser
  );

  useEffect(() => {
    dispatch(
      getCourtsBasedonPsCode(
        `${config.masterData}/getCourtsBasedonPsCode?psCode=${currentUser?.cctns_unit_id}`
      )
    );
    dispatch(
      getStolenPropertyList(`${config.stolenProperty}/?crimeId=${crimeId}`)
    );
    dispatch(
      fetchWitnessDetailsList(
        `${config.getPostCrimeSceneDetails}/WITNESSDETAILS/?crimeId=${crimeId}`
      )
    );
    dispatch(
      fetchMaterialObjectList(
        `${config.getPostCrimeSceneDetails}/MATERIALOBJECTS/?crimeId=${crimeId}`
      )
    );
    getTIPArticlesListFunc();
  }, []);

  useEffect(() => {
    let savedData = [];
    materialObjectList &&
      !isEmpty(materialObjectList) &&
      materialObjectList.map((element) => {
        const result = {
          itemId: element._id,
          name: element.name,
          type: element.type,
          subType: element.subType,
          moId: element.moId ? element.moId : "MO",
          url: element.materialObjectMedia[0]
            ? element.materialObjectMedia[0].url
            : "",
          panchWitness: element.panchWitness ? element.panchWitness : "",
        };
        savedData.push(result);
      });
    setMaterilaObjectApi(savedData);
  }, [materialObjectList]);

  useEffect(() => {
    let savedData = [];
    stolenPropertyList &&
      !isEmpty(stolenPropertyList) &&
      stolenPropertyList.map((element) => {
        const result = {
          itemId: element._id,
          name: element.propertytStatus,
          type: element.propertytCategoryName
            ? element.propertytCategoryName
            : element.propertytCategory,
          subType: "Stolen Property",
          moId: element.spId ? element.spId : "SP",
          panchWitness: element.panchWitnessName
            ? element.panchWitnessName
            : "",
        };
        if (element.propertyStatus === "Recovered") {
          savedData.push(result);
        }
      });
    setStolenPropertyApiList(savedData);
  }, [stolenPropertyList]);

  useEffect(() => {
    setSelectedIdentifiedList(clickedDetails?.identifiedList);
    function getID(params) {
      let n1 = [];
      params.forEach((ele) => {
        n1.push(ele._id);
      });
      return n1;
    }
    function getID2(params) {
      let n1 = [];
      params.forEach((ele) => {
        n1.push(ele.itemId);
      });
      return n1;
    }
    const tipReportMedia = clickedDetails?.tipReportMedia;
    if (tipReportMedia && tipReportMedia?.name !== "") {
      setSelectedUploadTipReport([tipReportMedia]);
    } else {
      setSelectedUploadTipReport([]);
    }
    setUploadedtipArticlesFileList(tipReportMedia);
    form.setFieldsValue({
      witnessIdentifying: getID(
        clickedDetails.witnessList ? clickedDetails.witnessList : []
      ),
      natureOFItem: getID2(
        clickedDetails.natureOfItems ? clickedDetails.natureOfItems : []
      ),
      requisitionFiled: moment(
        new Date(clickedDetails.requisitionDate)
      ).isValid()
        ? moment(new Date(clickedDetails.requisitionDate))
        : "",
      tipOrderNo: clickedDetails.tipOrderNumber
        ? clickedDetails.tipOrderNumber
        : "",
      tipOrderDate: moment(new Date(clickedDetails.tipOrderDate)).isValid()
        ? moment(new Date(clickedDetails.tipOrderDate))
        : "",
      tipConductedDate: moment(
        new Date(clickedDetails.tipConductedDate)
      ).isValid()
        ? moment(new Date(clickedDetails.tipConductedDate))
        : "",
      courtName: clickedDetails.courtName ? clickedDetails.courtName : "",
    });
  }, [clickedDetails]);

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

  const getTIPArticlesListFunc = () => {
    dispatch(getTIPArticlesList(`${config.tipArticles}/?crimeId=${crimeId}`));
  };

  const isSuccess =
    actionType === "ADD_TIPARTICLES_SUCCESS" ||
    actionType === "UPDATE_TIPARTICLES_SUCCESS";

  const isError =
    actionType === "ADD_TIPARTICLES_ERROR" ||
    actionType === "UPDATE_TIPARTICLES_ERROR";

  const handleTemplateCancel = () => {
    setTemplateIsModalVisible(false);
  };

  const auditHistoryEntry = () => {
    const auditType =
      actionType === "ADD_TIPARTICLES_SUCCESS"
        ? "Test Identification Of Articles Created"
        : "Test Identification Of Articles Updated";
    dispatch(
      createAuditHistory(
        config.createAudits,
        getAuditHistoryPayload(
          crimeId,
          "investigation/testIdentificationOfArticles",
          auditType
        )
      )
    );
  };

  const submit = async () => {
    const values = await form.validateFields();
    createTipArticlesPayload(values);
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

  const openNotificationWithIcon = (type, message) => {
    return notification[type]({
      message: message,
    });
  };

  const defaultSelctedfuc = (wit, acc) => {
    let final = false;

    if (vieiwClicked && selectedIdentifiedList) {
      selectedIdentifiedList.forEach((ele) => {
        if (ele.witnessId === wit && ele.itemId === acc) {
          final = true;
        }
      });
    }
    return final;
  };

  useEffect(() => {
    if (isSuccess || isError) {
      if (
        successMessage === "TIP Articles Successfully Added" ||
        successMessage === "TIP Articles Successfully Updated"
      ) {
        openNotificationWithIcon("success", successMessage);
        auditHistoryEntry();
        form.resetFields();
        getTIPArticlesListFunc();
        dispatch(resetActionType());
        seteditClicked(false);
      } else if (errorMessage) {
        openNotificationWithIcon("error", errorMessage);
        dispatch(resetActionType());
      }
    }
  }, [actionType]);

  const handleUpload = (options) => {
    if (tipArticlesFileList.length > 0) {
      const mediaFormData = new FormData();
      tipArticlesFileList.forEach((file) => {
        mediaFormData.append("file", file.originFileObj);
      });
      mediaFormData.append("prefixFolder", crimeId);
      mediaFormData.append("folderPath", `${crimeId}/TipArticles/media`);

      axios
        .post(`${config.fileUpload}/upload`, mediaFormData)
        .then((response) => {
          if (response.data.success) {
            setUploadedtipArticlesFileList(response.data.data[0]);
            openNotificationWithIcon(
              "success",
              `Uploaded ${response.data.data[0].name}`
            );
            options.onSuccess("ok");
          }
        })
        .catch((err) => {
          setTipArticlesFileList([]);
          openNotificationWithIcon("error", "Uploaing Went Wrong");
          options.onError("ok");
        });
    }
  };

  const createTipArticlesPayload = async (values) => {
    let n1 = [];
    materilaObjectApi.concat(stolenPropertyApiList).forEach((ele) => {
      values.natureOFItem.forEach((ele2) => {
        if (ele.itemId === ele2) {
          n1.push(ele);
        }
      });
    });

    let tipCodes = {};
    values.witnessIdentifying.forEach((ele) => {
      getSavedData().forEach((s1) => {
        if (ele === s1.person._id) {
          tipCodes[`${s1.person._id}`] = s1.witnessCode ? s1.witnessCode : "";
        }
      });
    });

    const addPayload = {
      crimeId: crimeId,
      witnessList: values.witnessIdentifying,
      natureOfItems: n1,
      requisitionDate: values.requisitionFiled,
      tipOrderNumber: values.tipOrderNo,
      tipOrderDate: values.tipOrderDate,
      tipConductedDate: values.tipConductedDate,
      courtName: values.courtName,
      tipReportMedia: {
        mimeType: uploadedTipArticlesFileList
          ? uploadedTipArticlesFileList?.mimeType
          : "",
        name: uploadedTipArticlesFileList
          ? uploadedTipArticlesFileList?.name
          : "",
        url: uploadedTipArticlesFileList
          ? uploadedTipArticlesFileList?.url
          : "",
        fileId: uploadedTipArticlesFileList
          ? uploadedTipArticlesFileList?.id
          : "",
      },
    };
    if (!editClicked) {
      dispatch(
        addTIPArticlesDetails(config.tipArticles, {
          ...addPayload,
          tipCodes: tipCodes,
        })
      );
    } else {
      addPayload._id = clickedDetails._id;
      addPayload.identifiedList = selectedIdentifiedList;
      dispatch(updateTIPArticlesDetails(config.tipArticles, addPayload));
    }
  };

  const handleDownload = (file) => {
    getFileById(file?.fileId, file?.name, file?.url);
  };

  return (
    <ModuleWrapper>
      <ContentHeader
        headerTitle="Test Identification Of Articles"
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
                      label="Person Identifying the Articles"
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
                      name="natureOFItem"
                      label="Nature of Item"
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
                        filterOption={(input, option) =>
                          serchText &&
                          option.props.label
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                        disabled={vieiwClicked || disableForm}
                      >
                        {materilaObjectApi
                          .concat(stolenPropertyApiList)
                          .map((item, index) => (
                            <Select.Option
                              key={index}
                              value={item.itemId}
                              label={item.type}
                            >
                              <p>{item.type}</p>
                            </Select.Option>
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
                        style={{ width: 222 }}
                        disabledDate={disableFutureDates}
                        disabled={vieiwClicked || disableForm}
                      />
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
                          />
                        </Form.Item>
                      </Col>
                      <Col span={8} style={{ padding: "12px" }}>
                        <Form.Item name="tipOrderDate" label="TIP Order Date">
                          <DatePicker
                            showTime
                            format={DATE_TIME_FORMAT}
                            placeholder="Select Date & Time"
                            style={{ width: 222 }}
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
                            style={{ width: 222 }}
                            disabledDate={disableFutureDates}
                            disabled={vieiwClicked || disableForm}
                          />
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
                        className="file-upload"
                        span={8}
                        style={{ margin: 0 }}
                      >
                        <Form.Item>
                          <Upload
                            fileList={
                              clickedDetails?._id &&
                              !isUndefined(clickedDetails?.tipReportMedia) &&
                              clickedDetails?.tipReportMedia?.name !== ""
                                ? selectedUploadTipReport
                                : tipArticlesFileList
                            }
                            onChange={async (info) => {
                              await setTipArticlesFileList(info.fileList);
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
                      <Col span={24} style={{ marginTop: "48px" }}>
                        <h6>Articles identified</h6>
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
                                    ? `(${clickedDetails.tipCodes[wit._id]})`
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
                                let filterdList = [];

                                if (selectedIdentifiedList) {
                                  selectedIdentifiedList.filter(function (el) {
                                    return el.witnessId !== wit._id;
                                  });
                                }

                                let finalArray = [];
                                e.forEach((ele) => {
                                  let n1 = {
                                    witnessId: wit._id,
                                    itemId: ele,
                                  };
                                  finalArray.push(n1);
                                });
                                await setSelectedIdentifiedList([
                                  ...filterdList,
                                  ...finalArray,
                                ]);
                              }}
                            >
                              <Row>
                                {clickedDetails.natureOfItems.map((acc) => {
                                  return (
                                    <Col
                                      span={24}
                                      style={{
                                        border: "1px solid  #d9dcde",
                                        padding: "12px",
                                      }}
                                    >
                                      <Checkbox
                                        key={acc.itemId}
                                        value={acc.itemId}
                                        defaultChecked={defaultSelctedfuc(
                                          wit._id,
                                          acc.itemId
                                        )}
                                        icon={<UserOutlined />}
                                      >
                                        {defaultSelctedfuc(
                                          wit._id,
                                          acc.itemId
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
                                        <span>{acc.name}</span>
                                        <br></br>
                                        <small>{acc.type}</small>
                                        <br></br>
                                        <small>{acc.subType}</small>
                                        <br></br>
                                        <small>{acc.moId}</small>
                                      </Checkbox>
                                    </Col>
                                  );
                                })}
                              </Row>
                            </Checkbox.Group>
                          </Col>
                        );
                      })}
                    </Row>
                  </Card>
                ) : null}
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
              selectedModule="tipArticles"
            />
            {!isEmpty(TIPAccusedList) ? (
              <Button
                style={{ marginTop: "40px", width: "100%" }}
                onClick={() => setrecordsIsModalVisible(true)}
              >
                {TIPAccusedList && TIPAccusedList.length > 0
                  ? TIPAccusedList.length
                  : 0}{" "}
                TIP Articles Records
              </Button>
            ) : null}
            <Modal
              title="Test Identification Of Articles"
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
                  visibleModal={setrecordsIsModalVisible}
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
