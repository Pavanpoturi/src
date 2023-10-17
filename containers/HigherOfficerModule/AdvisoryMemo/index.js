/* eslint-disable array-callback-return */
import { useState, useEffect } from "react";
import {
  Modal,
  Row,
  Card,
  Col,
  Form,
  Input,
  Upload,
  Button,
  notification,
  Collapse,
  Select,
} from "antd";
import TableWrapper from "@containers/Tables/AntTables/AntTables.styles";
import { CameraOutlined, DoubleRightOutlined } from "@ant-design/icons";
import {
  onFileChange,
  renderFieldsWithDropDown,
  getMediaUploadError,
  dummyRequest,
} from "@containers/FirDetails/fir-util";
import config from "../../../config/site.config";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { DATE_TIME_FORMAT } from "@containers/FirDetails/fir-util";
import { isEmpty, first } from "lodash";
import ContentHeader from "@containers/FirDetails/ContentHeader";
import advisoryActions from "@redux/advisoryMemo/actions";
import { ModuleWrapper } from "../../FirDetails/Investigation/CommonDetails/styles";
import { FirContantWrapper } from "./styles";
import { getFileById } from "@containers/media-util";
import { loadState } from "@lib/helpers/localStorage";
import Loader from "@components/utility/loader";
import moment from "moment";
import createFIRActions from "@redux/createFir/actions";
import { AdvisoryMemodropdownOptins } from "../const";

const { TextArea } = Input;
const { getNotificationTo, getCrimeAdvisory } = advisoryActions;
const { getFIRData } = createFIRActions;

const { Panel } = Collapse;
export default function AdvisoryMemos({ setSelectedSiderMenu }) {
  const { savedFir } = useSelector((state) => state.createFIR);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [dataSource, setDataSource] = useState({});
  const options = { month: "short", day: "numeric", year: "numeric" };
  const { createAdvisoryMemo } = advisoryActions;
  const [serchText, setSerchText] = useState("");
  const [arrOfObjects, setArrOfObjects] = useState();
  const [isFormUploading, setIsFormUploading] = useState(false);
  const [uploadAdvisoryMemo, setUploadAdvisoryMemo] = useState([]);
  const { currentUser } = useSelector((state) => state.Auth);
  const storedUser = loadState("currentUser");
  const activeUser = currentUser.employee_name ? currentUser : storedUser;
  const crimeId = loadState("selectedFirId");
  const [storedCode, setStoredCode] = useState("");
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const {
    actionType,
    successMessage,
    errorMessage,
    getAdvisoryNotificationTo,
  } = useSelector((state) => state.AdvisoryMemo);
  const { updatedPsCode } = useSelector((state) => state.FIR);
  const isSuccess = actionType === "CREATE_ADVISORY_MEMO_SUCCESS";
  const isError = actionType === "CREATE_ADVISORY_MEMO_ERROR";

  useEffect(() => {
    setStoredCode(updatedPsCode);
  }, [updatedPsCode, savedFir]);

  useEffect(() => {
    if (isSuccess || isError) {
      if (isSuccess) {
        openNotificationWithIcon("success", successMessage);
        form.resetFields();
      } else {
        openNotificationWithIcon("error", errorMessage);
      }
    }
  }, [actionType]);

  useEffect(() => {
    if (storedCode) {
      dispatch(
        getNotificationTo(
          `${config.getNotificationTo}?ps_code=${storedCode}&emp_role_name=${storedUser?.emp_role_name}`
        )
      );
    }
  }, []);

  useEffect(() => {
    var getData = [];
    const data = getAdvisoryNotificationTo.map((str) => {
      getData.push({ key: str, label: str });
    });
    setArrOfObjects(getData);
  }, [getAdvisoryNotificationTo]);
  const handleSearch = (text) => {
    setSerchText(text);
  };
  const openNotificationWithIcon = (type, message) => {
    return notification[type]({
      message: message,
    });
  };
  const onAdvisorySubmit = async () => {
    const values = await form.validateFields();
    const advisoryMemoFormData = new FormData();
    uploadAdvisoryMemo.forEach((file) => {
      advisoryMemoFormData.append("file", file.originFileObj);
    });
    advisoryMemoFormData.append("prefixFolder", crimeId);
    advisoryMemoFormData.append("folderPath", `${crimeId}/advisoryMemo/media`);
    if (!isEmpty(uploadAdvisoryMemo)) {
      setIsFormUploading(true);
      axios
        .post(`${config.fileUpload}/upload`, advisoryMemoFormData)
        .then((res) => {
          if (res.status === 200) {
            const { data } = res.data;
            const uploadResult = !isEmpty(data) && first(data);
            const payload = {
              crimeId: crimeId,
              status: "Open",
              from: activeUser?.pao_code,
              fromName: activeUser?.employee_name,
              fromRank: activeUser?.rank_name,
              fromRole: activeUser?.emp_role_name,
              closingRemarks: "closed advisory",
              complianceReport: {
                mimeType: uploadResult?.mimeType,
                name: uploadResult?.name,
                fileId: uploadResult?.id,
              },
              memo: {
                mimeType: uploadResult?.mimeType,
                name: uploadResult?.name,
                fileId: uploadResult?.id,
              },
              complianceTo: "IO",
              compliedBy: activeUser?.pao_code,
              compliedName: activeUser?.employee_name,
              compliedRank: activeUser?.rank_name,
              compliedRole: activeUser?.ecopsv2_role,
              remarks: values?.remarks,
              complyWithin: values?.complianceDays,
              instructionTo: values?.instructions,
              advisoryMemoText: values?.advisoryMemoText,
            };
            onSubmit(payload);
            setIsFormUploading(false);
          }
        })
        .catch((err) => {
          getMediaUploadError(err, openNotificationWithIcon);
          setIsFormUploading(false);
        });
    } else {
      const payload = {
        crimeId: crimeId,
        status: "Open",
        from: activeUser?.pao_code,
        fromName: activeUser?.employee_name,
        fromRank: activeUser?.rank_name,
        fromRole: activeUser?.emp_role_name,
        closingRemarks: "closed advisory",
        complianceReport: {},
        complianceTo: "12347",
        compliedBy: activeUser?.pao_code,
        compliedName: activeUser?.employee_name,
        compliedRank: activeUser?.rank_name,
        compliedRole: activeUser?.ecopsv2_role,
        remarks: values?.remarks,
        complyWithin: values?.complianceDays,
        instructionTo: values?.instructions,
        advisoryMemoText: values?.advisoryMemoText,
      };
      onSubmit(payload);
    }
  };
  const submitComplyingRequest = () => {
    if (isEmpty(uploadAdvisoryMemo)) {
      openNotificationWithIcon(
        "error",
        "Please Provide Advisory Remarks or Upload Advisory Memo"
      );
    } else {
      onAdvisorySubmit();
    }
  };

  const handleDownload = (file) => {
    getFileById(file?.fileId, file?.name, file?.url);
  };

  const onSubmit = (payload) => {
    dispatch(createAdvisoryMemo(config.upsertCrimeAdvisory, payload));
    dispatch(getCrimeAdvisory(`${config.getCrimeAdvisory}?crimeId=${crimeId}`));
    dispatch(getFIRData(`${config.getFIR}?crimeId=${crimeId}`));
  };
  const advisoryHistoryTableConfig = [
    "remarkDate",
    "remarkFrom",
    "remarkTo",
    "status",
    "Remark",
    "uploadedDocs",
  ];
  const historyColumns = [];
  advisoryHistoryTableConfig &&
    advisoryHistoryTableConfig.map((headTitle, _index) => {
      switch (headTitle) {
        case "remarkDate":
          historyColumns.push({
            title: "Remark Date",
            dataIndex: "remarkDate",
            rowKey: "remarkDate",
            render: (i, item) => {
              return (
                <span key={i} className="tableRowText">
                  {item?.advisedOn
                    ? moment(item?.advisedOn).format(DATE_TIME_FORMAT)
                    : ""}
                </span>
              );
            },
          });
          break;
        case "remarkFrom":
          historyColumns.push({
            title: "Remark From",
            dataIndex: "remarkFrom",
            rowKey: "remarkFrom",
            render: (i, item) => {
              return (
                <span key={i} className="tableRowText">
                  {item?.fromRole || ""}
                </span>
              );
            },
          });
          break;
        case "remarkTo":
          historyColumns.push({
            title: "Remark To",
            dataIndex: "remarkTo",
            rowKey: "remarkTo",
            render: (i, item) => {
              return (
                <span key={i} className="tableRowText">
                  {item?.instructionTo || ""}
                </span>
              );
            },
          });
          break;
        case "status":
          historyColumns.push({
            title: "Status",
            dataIndex: "status",
            rowKey: "status",
            render: (i, item) => {
              return (
                <span key={i} className="tableRowText">
                  {item?.status || "-"}
                </span>
              );
            },
          });
          break;
        case "Remark":
          historyColumns.push({
            title: "Remark",
            dataIndex: "Remark",
            rowKey: "Remark",
            render: (i, item) => {
              return (
                <span key={i} className="tableRowText">
                  {item?.remarks || ""}
                </span>
              );
            },
          });
          break;
        // case "MemoText":
        //   historyColumns.push({
        //     title: "Memo Text",
        //     dataIndex: "memoText",
        //     rowKey: "memoText",
        //     render: (i, item) => {
        //       return (
        //         <span key={i} className="tableRowText">
        //           {item?.advisoryMemoText || ""}
        //         </span>
        //       );
        //     },
        //   });
        //   break;
        case "uploadedDocs":
          historyColumns.push({
            title: "Uploaded Documents",
            dataIndex: "uploadedDocs",
            rowKey: "uploadedDocs",
            render: (i, item) => {
              const mediaResult = item?.memo;
              return (
                <span
                  key={i}
                  style={{ cursor: "pointer", color: "#02599C" }}
                  onClick={() =>
                    getFileById(
                      mediaResult?.fileId,
                      mediaResult?.name,
                      mediaResult?.url
                    )
                  }
                >
                  {mediaResult?.name}
                </span>
              );
            },
          });
          break;
        default:
          break;
      }
    });

  const handelClick = (date) => {
    setIsModalVisible(true);
    const filtredRecord = savedFir?.advisory?.filter((data) => {
      return data?._id === date;
    });
    console.log(filtredRecord, "filtredRecord");
    setDataSource(filtredRecord);
  };
  return (
    <ModuleWrapper>
      <FirContantWrapper>
        <ContentHeader
          headerTitle="Advisory Memo"
          onSubmitClick={submitComplyingRequest}
          isInvestigation={true}
          onCancel={() => setSelectedSiderMenu("miniInvestigatinReport")}
          disableButton={isFormUploading}
        />
        <Row>
          <Card
            style={{
              width: `${"70%"}`,
              padding: 10,
              height: 400,
              minHeight: 400,
            }}
            className="cardLeftStyle"
          >
            <Form form={form} colon={false} layout="vertical">
              <Row span={24}>
                <Col span={15}>
                  <Form.Item name="remarks" label="Remarks/Advisory Memo">
                    {/* <Select>
                      {AdvisoryMemodropdownOptins.map((data) => (
                        <Select.Option key={data.value} value={data?.value}>
                          {data?.item}
                        </Select.Option>
                      ))}
                    </Select> */}
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  {/* <Row span={15}>
                    <Form.Item name={"advisoryMemoText"}>
                      <TextArea
                        placeholder="Enter advisory memo"
                        rows={4}
                        style={{ width: 700 }}
                      />
                    </Form.Item>
                  </Row> */}
                  <Row span={9}>
                    <Form.Item name="uploadAdvisoryMemo">
                      <Upload
                        // fileList={fileList}
                        customRequest={dummyRequest}
                        onChange={(info) =>
                          onFileChange(info, setUploadAdvisoryMemo)
                        }
                        onPreview={handleDownload}
                        multiple={false}
                      >
                        <Button
                          className="saveButton"
                          size="large"
                          style={{
                            width: 250,
                            marginTop: 25,
                            marginLeft: 10,
                          }}
                          icon={<CameraOutlined className="saveButtonIcon" />}
                        // disabled={disableUpload || disabled}
                        >
                          Upload Advisory Memo
                        </Button>
                      </Upload>
                    </Form.Item>
                  </Row>
                </Col>
                {isFormUploading ? <Loader /> : null}
                <Col span={24}>
                  <Form.Item name="complianceDays" label="Compliance Days">
                    <Row>
                      {" "}
                      <Input style={{ width: 100 }} /> &nbsp; in Days
                    </Row>
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Row>
                    <Col>
                      <Form.Item name="instructions" label="Instructions To">
                        {renderFieldsWithDropDown(
                          arrOfObjects,
                          null,
                          handleSearch,
                          serchText,
                          250,
                          false,
                          "",
                          "Instructions"
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Form>
          </Card>
          <Card
            style={{ width: "30%", height: 400, minHeight: 400 }}
            className="cardRightStyle"
          >
            {
              <Col>
                <div>
                  <Collapse
                    accordion
                    style={{ marginTop: 20 }}
                    defaultActiveKey={["1"]}
                    expandIconPosition={"right"}
                    expandIcon={({ isActive }) => (
                      <DoubleRightOutlined rotate={isActive ? 270 : 360} />
                    )}
                  >
                    <Panel
                      className="panelHeader"
                      header={
                        <div className="headerTextContainer">
                          {" "}
                          <div className="panelTitle">Past Memos </div>{" "}
                        </div>
                      }
                    >
                      <div className="popupLink">
                        {savedFir?.advisory?.map((data) => {
                          const advisedOnDate = new Date(data?.advisedOn);
                          return (
                            <Row
                              key={data?.advisedOn}
                              onClick={(e) => handelClick(data?._id)}
                            >
                              data Memo{" "}
                              {advisedOnDate instanceof Date
                                ? advisedOnDate.toLocaleDateString(
                                  "en-US",
                                  options
                                )
                                : ""}
                            </Row>
                          );
                        })}
                      </div>
                    </Panel>
                  </Collapse>
                  {isModalVisible ? (
                    <Modal
                      title="Advisory Memo List"
                      visible={isModalVisible}
                      onOk={() => {
                        setIsModalVisible(false);
                      }}
                      onCancel={() => {
                        setIsModalVisible(false);
                      }}
                      style={{ minWidth: "95vw" }}
                      footer={null}
                    >
                      <div style={{ maxHeight: 650, overflowY: "auto" }}>
                        {
                          <TableWrapper
                            dataSource={dataSource}
                            columns={historyColumns}
                            style={{ bordeRadius: 5, width: "99%" }}
                            showSorterTooltip={false}
                            pagination={true}
                          />
                        }
                      </div>
                    </Modal>
                  ) : null}
                </div>
              </Col>
            }
          </Card>
        </Row>
      </FirContantWrapper>
    </ModuleWrapper>
  );
}
