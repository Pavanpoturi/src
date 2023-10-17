/* eslint-disable array-callback-return */
import { useState, useEffect } from "react";
import { isEmpty } from "lodash";
import moment from "moment";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  Row,
  Card,
  Col,
  Form,
  DatePicker,
  Select,
  Button,
  Upload,
  notification,
  Modal,
} from "antd";
import { ModuleWrapper } from "@containers/FirDetails/Investigation/CommonDetails/styles";
import {
  IS_SHO,
  IS_IO,
  DATE_FORMAT,
  getAccuseds,
  dummyRequest,
  onFileChange,
  getMediaPayloadWithoutCategory,
  getMediaUploadError,
  IS_INVESTIGATION_OFFICER
} from "@containers/FirDetails/fir-util";
import { CaretDownOutlined, CameraFilled } from "@ant-design/icons";
import ContentHeader from "@containers/FirDetails/ContentHeader";
import suspectAccusedAction from "@redux/investigations/suspectAccused/actions";
import { config } from "@config/site.config";
import Loader from "@components/utility/loader";
import { loadState } from "@lib/helpers/localStorage";
import DeathOfAccusedActions from "@redux/CourtAndProsecution/DeathOfAccused/actions.js";
import { getFileById } from "@containers/media-util";
import {
  addDeathOfAccusedPayload,
  updateDeathOfAccusedPayload,
} from "./payload";
import SavedRecords from "./SavedRecords";
import { CourtAndProsecutionWrapper } from "../styles";

const Option = Select.Option;

export default function DeathOfAccused({ setSelectedSiderMenu }) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const crimeId = loadState("selectedFirId");
  const selectedCourtAndProsecution = loadState("selectedCourtAndProsecution");
  const [uploadCourtOrder, setUploadCourtOrder] = useState([]);
  const [uploadDeathCertificate, setUploadDeathCertificate] = useState([]);
  const { savedFir } = useSelector((state) => state.createFIR);
  const [serchText, setSerchText] = useState("");
  const currentUser = loadState("currentUser");
  const userRole = [IS_SHO, IS_IO, IS_INVESTIGATION_OFFICER];
  const IS_HIGHER_SHO_USER = !userRole?.includes(currentUser?.ecopsv2_role)

  const disableForm =
    (IS_HIGHER_SHO_USER &&
      currentUser?.isPersnolized === false &&
      currentUser?.isIo === false) ||
    savedFir?.caseStatus === "Disposal" || selectedCourtAndProsecution.isCourtDisposal;
  const [formValid, setFormValid] = useState(false);
  const { getAccusedList } = suspectAccusedAction;
  const { suspectAccusedList } = useSelector((state) => state.SuspectAccused);
  const [editDeathOfAccused, setEditDeathOfAccused] = useState(null);
  const [viewClicked, setViewClicked] = useState(false);
  const [isRecordsModalVisible, setIsRecordModalVisible] = useState(false);
  const {
    addDeathOfAccused,
    updateDeathOfAccused,
    getDeathOfAccusedList,
    resetActionType,
  } = DeathOfAccusedActions;

  const {
    actionType,
    errorMessage,
    successMessage,
    deathOfAccusedList,
    isFetching,
  } = useSelector((state) => state.DeathOfAccused);

  const filterAccusedList = suspectAccusedList?.filter(
    (item) =>
      !item?.isDied &&
      // !item?.isArrestByPolice &&
      !deathOfAccusedList?.some(
        (value) => value?.accusedId === item?.person?._id
      )
  );

  const filterChargeSheetAccusedData = [];
  filterAccusedList.forEach((item) => {
    if (
      selectedCourtAndProsecution?.data?.accusedParticulars.some(
        (data) =>
          data?.accusedPersonId?._id === item?.person?._id &&
          data?.chargeStatus === "Charged"
      ) === true
    ) {
      filterChargeSheetAccusedData.push(item);
    }
  });

  const getAccusedDropdownData = () =>
    getAccuseds(filterChargeSheetAccusedData);

  const isSuccess =
    actionType === "ADD_DEATH_OF_ACCUSED_SUCCESS" ||
    actionType === "UPDATE_DEATH_OF_ACCUSED_SUCCESS";

  const isError =
    actionType === "ADD_DEATH_OF_ACCUSED_ERROR" ||
    actionType === "UPDATE_DEATH_OF_ACCUSED_ERROR";

  const openNotificationWithIcon = (type, message) => {
    return notification[type]({
      message: message,
    });
  };

  useEffect(() => {
    if (isSuccess || isError) {
      if (successMessage) {
        openNotificationWithIcon("success", successMessage);
        form.resetFields();
        setSelectedSiderMenu("courtandprosecution");
        dispatch(resetActionType());
      } else if (errorMessage) {
        openNotificationWithIcon("error", errorMessage);
        dispatch(resetActionType());
      }
    }
  }, [actionType]);

  useEffect(() => {
    dispatch(
      getDeathOfAccusedList(
        `${config.getDeathOfAccused}?crimeId=${crimeId}&updateChargesheetId=${selectedCourtAndProsecution?.updateChargesheetId}`
      )
    );
    dispatch(
      getAccusedList(
        `${config.getPostCrimeSceneDetails}/ACCUSED/?crimeId=${crimeId}`
      )
    );
  }, []);

  const handleSearch = (text) => {
    setSerchText(text);
  };

  const checkFields = async () => {
    const values = await form.validateFields();
    setFormValid(!Object.values(values).every((v) => v == null || v === ""));
  };

  const submit = async () => {
    const values = await form.validateFields();
    let data1 = uploadDeathCertificate || [];
    let data2 = uploadCourtOrder || [];

    Object.assign(values);
    if (!!editDeathOfAccused?._id === true) {
      values["deathOfAccusedId"] = editDeathOfAccused?._id;
    }
    if (
      !!values?.deathCertificate?.fileList &&
      values?.deathCertificate?.fileList?.length !== 0
    ) {
      const uploadDeathCertificate = new FormData();
      values?.deathCertificate?.fileList.forEach((file) => {
        uploadDeathCertificate.append("file", file.originFileObj);
      });
      uploadDeathCertificate.append("prefixFolder", crimeId);
      uploadDeathCertificate.append(
        "folderPath",
        `${crimeId}/${"courtCommittal"}/file`
      );
      await axios
        .post(`${config.fileUpload}/upload`, uploadDeathCertificate)
        .then((res) => {
          if (res.status === 200) {
            const { data } = res.data;
            data1 = getMediaPayloadWithoutCategory(data);
          }
        })
        .catch((err) => getMediaUploadError(err, openNotificationWithIcon));
    }

    if (
      !!values?.ordersOfCourt?.fileList &&
      values?.ordersOfCourt?.fileList?.length !== 0
    ) {
      const uploadOrdersOfCourt = new FormData();
      values?.ordersOfCourt?.fileList.forEach((file) => {
        uploadOrdersOfCourt.append("file", file.originFileObj);
      });
      uploadOrdersOfCourt.append("prefixFolder", crimeId);
      uploadOrdersOfCourt.append(
        "folderPath",
        `${crimeId}/${"courtCommittal"}/file`
      );
      await axios
        .post(`${config.fileUpload}/upload`, uploadOrdersOfCourt)
        .then((res) => {
          if (res.status === 200) {
            const { data } = res.data;
            data2 = getMediaPayloadWithoutCategory(data);
          }
        })
        .catch((err) => getMediaUploadError(err, openNotificationWithIcon));
    }

    const addPayload = addDeathOfAccusedPayload(
      values,
      crimeId,
      data1,
      data2,
      selectedCourtAndProsecution?.updateChargesheetId,
      selectedCourtAndProsecution?._id
    );
    const updatePayload = updateDeathOfAccusedPayload(
      values,
      crimeId,
      data1,
      data2,
      editDeathOfAccused?._id,
      selectedCourtAndProsecution?.updateChargesheetId,
      selectedCourtAndProsecution?._id
    );
    if (!!editDeathOfAccused?._id === true) {
      dispatch(
        updateDeathOfAccused(
          `${config.updateDeathOfAccused}?crimeId=${crimeId}`,
          updatePayload
        )
      );
    } else {
      dispatch(
        addDeathOfAccused(
          `${config.createDeathOfAccused}?crimeId=${crimeId}`,
          addPayload
        )
      );
    }
  };

  const handleDownload = (file) => {
    getFileById(file?.fileId, file?.name, file?.url);
  };

  const displayUploadForm = (formName, fileList, actionName, title) => {
    return (
      <Form.Item name={formName}>
        <Upload
          fileList={fileList}
          customRequest={dummyRequest}
          onChange={(info) => onFileChange(info, actionName)}
          multiple={false}
          onPreview={handleDownload}
        >
          <Button
            className="saveButton"
            style={{ width: 240 }}
            icon={<CameraFilled style={{ float: "left" }} />}
            disabled={disableForm || viewClicked}
          >
            {title}
          </Button>
        </Upload>
      </Form.Item>
    );
  };

  const getAccusedName = (DeathOfaccusedId) => {
    const accusedName = suspectAccusedList.find(
      (accused) =>
        accused?.person?._id?.toString() === DeathOfaccusedId?.toString()
    );
    return accusedName ? accusedName?.person?.personalDetails?.name : "";
  };

  const setSelectedData = (values) => {
    if (values?.deathCertificate.length !== 0 && !!values?.deathCertificate) {
      setUploadDeathCertificate(values?.deathCertificate);
    } else {
      setUploadDeathCertificate([]);
    }
    if (values?.ordersOfCourt.length !== 0 && !!values?.ordersOfCourt) {
      setUploadCourtOrder(values?.ordersOfCourt);
    } else {
      setUploadCourtOrder([]);
    }
    setEditDeathOfAccused(values);
    form.setFieldsValue({
      accusedId: getAccusedName(values?.accusedId),
      dateOfTrial: moment(new Date(values?.dateOfTrial)).isValid()
        ? moment(new Date(values?.dateOfTrial))
        : "",
      dateOfDeath: moment(new Date(values?.dateOfDeath)).isValid()
        ? moment(new Date(values?.dateOfDeath))
        : "",
      dateOfFilingReportWithCopyOfDeathCertificate: moment(
        new Date(values?.dateOfFilingReportWithCopyOfDeathCertificate)
      ).isValid()
        ? moment(new Date(values?.dateOfFilingReportWithCopyOfDeathCertificate))
        : "",
    });
  };

  return (
    <ModuleWrapper>
      <CourtAndProsecutionWrapper>
        <ContentHeader
          headerTitle="Death Of Accused"
          onSubmitClick={submit}
          isInvestigation={true}
          onCancel={() => setSelectedSiderMenu("courtandprosecution")}
          disableButton={disableForm}
        />
        {isFetching ? (
          <Loader />
        ) : (
          <Row>
            <Card
              style={{
                width: "75%",
                paddingLeft: 10,
                height: 400,
                minHeight: 400,
              }}
              className="cardLeftStyle"
            >
              <Form form={form} colon={false} layout="vertical">
                <Row gutter={24}>
                  <Col span={10} style={{ marginTop: 15 }}>
                    <Form.Item name="dateOfTrial" label="Date of Trial">
                      <DatePicker
                        format={DATE_FORMAT}
                        disabled={disableForm || viewClicked}
                        placeholder="Date"
                        style={{ width: 250 }}
                        onChange={checkFields}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={10} style={{ marginTop: 15 }}>
                    <Form.Item
                      name="dateOfDeath"
                      label="Date of Death"
                      rules={[
                        {
                          required: true,
                          message: "Date of Death is required!",
                        },
                      ]}
                    >
                      <DatePicker
                        format={DATE_FORMAT}
                        disabled={disableForm || viewClicked}
                        placeholder="Date"
                        style={{ width: 250 }}
                        onChange={checkFields}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={10} style={{ marginTop: 15 }}>
                    <Form.Item
                      name="accusedId"
                      label="No. of accused Cited"
                      rules={[
                        {
                          required: true,
                          message: "No. of accused Cited is required!",
                        },
                      ]}
                    >
                      <Select
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
                        disabled={disableForm || viewClicked}
                        style={{ width: 250 }}
                      >
                        {!isEmpty(getAccusedDropdownData()) &&
                          getAccusedDropdownData().map((item, index) => (
                            <Option
                              key={index}
                              value={item._id}
                              label={item.label}
                            >
                              {item?.personalDetails?.name}
                            </Option>
                          ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12} style={{ marginTop: 15 }}>
                    <Form.Item
                      name="dateOfFilingReportWithCopyOfDeathCertificate"
                      label="Date of filing Report with Copy of death certificate"
                    >
                      <DatePicker
                        format={DATE_FORMAT}
                        disabled={disableForm || viewClicked}
                        placeholder="Date"
                        style={{ width: 250 }}
                        onChange={checkFields}
                      />
                    </Form.Item>
                  </Col>
                  <Col
                    span={10}
                    style={{ padding: 0, marginTop: 20, marginLeft: 12 }}
                  >
                    {displayUploadForm(
                      "deathCertificate",
                      uploadDeathCertificate,
                      setUploadDeathCertificate,
                      "Upload Death Certificate"
                    )}
                  </Col>
                  <Col span={10} style={{ padding: 0, marginTop: 20 }}>
                    {displayUploadForm(
                      "ordersOfCourt",
                      uploadCourtOrder,
                      setUploadCourtOrder,
                      "Upload Order of court"
                    )}
                  </Col>
                </Row>
              </Form>
            </Card>
            <Card
              style={{ width: "25%", height: 400, minHeight: 400 }}
              className="right-section cardRightStyle"
            >
              {deathOfAccusedList?.length > 0 ? (
                <Button
                  style={{ marginTop: 40, width: "100%" }}
                  onClick={() => setIsRecordModalVisible(true)}
                >
                  {`${deathOfAccusedList?.length} Death Of Accused Records`}
                </Button>
              ) : null}
              <Modal
                title="Death Of Accused Records"
                visible={isRecordsModalVisible}
                onOk={() => setIsRecordModalVisible(false)}
                onCancel={() => setIsRecordModalVisible(false)}
                style={{ minWidth: "95vw" }}
                footer={null}
              >
                <div style={{ maxHeight: 650, overflowY: "auto" }}>
                  <SavedRecords
                    dataSource={deathOfAccusedList}
                    suspectAccusedList={suspectAccusedList}
                    setSelectedData={setSelectedData}
                    setViewClicked={setViewClicked}
                    setFormValid={setFormValid}
                    setIsRecordModalVisible={setIsRecordModalVisible}
                  />
                </div>
              </Modal>
            </Card>
          </Row>
        )}
      </CourtAndProsecutionWrapper>
    </ModuleWrapper>
  );
}
