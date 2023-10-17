import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { config } from "@config/site.config";
import { loadState } from "@lib/helpers/localStorage";
import suspectAccusedAction from "@redux/investigations/suspectAccused/actions";
import {
  getAccuseds,
  getSavedDataResult,
} from "@containers/FirDetails/fir-util";
import {
  Row,
  Card,
  Col,
  Form,
  Select,
  Button,
  Upload,
  notification,
  Tooltip,
} from "antd";
import {
  CaretDownOutlined,
  CameraFilled,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import firActions from "@redux/fir/actions";
import DisplayReportGenerations from "./DisplayReports";
import createFIRActions from "@redux/createFir/actions";
import { isUndefined, isArray, isNull } from "lodash";
import masterDataActions from "@redux/masterData/actions";
import generateRequisitionsAction from "@redux/generateRequisitions/actions";
import { LookoutNoticeTemplates1, LookoutNoticeTemplates2 } from "./const";
import { ModuleWrapper } from "../CommonDetails/styles";
import PrintLookOutNotice from "./PrintLookOutNotice";
import AccusedDetailsCard from "./AccusedDetailsCard";
import AccusedCard from "../CommonForms/AccusedCard";
import { getFileById } from "@containers/media-util";
import axios from "axios";
import Loader from "@components/utility/loader";

const Option = Select.Option;

const styles = {
  widgetPageStyle: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    overflow: "hidden",
  },
};

export default function LookoutNotice({ setSelectedSiderMenu }) {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { getRequisitionsList } = generateRequisitionsAction;
  const [formValid, setFormValid] = useState(false);
  const [selectedAccusedPerson, setSelectedAccusedPerson] = useState("");
  const [selectedAccusedValue, setSelectedAccusedValue] = useState("");
  const [selectedAccusedtotalItem, setSelectedAccusedTotalItem] = useState("");
  const [selectedNoticeFor, setSelectedNoticeFor] = useState("");
  const [selectedVictimType, setSelectedVictimType] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const crimeId = loadState("selectedFirId");
  const [serchText, setSerchText] = useState("");
  const { getAccusedList } = suspectAccusedAction;
  const [firAccusedList, setFirAccusedList] = useState([]);
  const [clickedPhysicalFeatures, setClickedPhysicalFeatures] = useState({});
  const [clickedMedia, setClickedMedia] = useState([]);
  const [isTemplateUploaded, setisTemplateUploaded] = useState(false);
  const [fakeLoading, setfakeLoading] = useState(false);
  const [accusedSelected, setAccusedSelected] = useState(false);
  const [upload_ExtraMedia, setupload_ExtraMedia] = useState([]);
  const [uploadedExtraMedia, setUploadedExtraMedia] = useState([]);
  const [personTemplates, setPersonTemplates] = useState([]);
  const [crimeClassificationState, setCrimeClassificationState] = useState("");
  const { savedFir } = useSelector((state) => state.createFIR);
  const { getFIRData } = createFIRActions;
  const { getActList } = masterDataActions;
  const { fetchCrimeClassification, updatePersonMediaDetails } = firActions;
  const { crimeclassification } = useSelector((state) => state.FIR);
  const { requisitionsList } = useSelector(
    (state) => state.GenerateRequisitions
  );

  const getInitialDiaptch = () => {
    fetchAccusedList();
    dispatch(getFIRData(`${config.getFIR}?crimeId=${crimeId}`));
    dispatch(
      fetchCrimeClassification(
        `${config.getPostCrimeSceneDetails}/CLASSIFICATION?crimeId=${crimeId}`
      )
    );
    dispatch(
      getRequisitionsList(
        `${config.templatesUpload}?crimeId=${crimeId}&action=lookoutNotice`
      )
    );
    dispatch(getActList(`${config.getMasterData}/ACT`));
  };

  useEffect(() => {
    getInitialDiaptch();
  }, []);

  useEffect(() => {
    setCrimeClassificationState(crimeclassification);
  }, [crimeclassification]);

  useEffect(() => {
    if (requisitionsList && selectedAccusedValue) {
      let f1 = requisitionsList.filter(
        (ele) => ele?.accusedId.toString() === selectedAccusedValue?.person?._id
      );
      setPersonTemplates(f1);
    }
  }, [requisitionsList, selectedAccusedValue]);

  useEffect(() => {
    form.setFieldsValue({ accusedId: "" });
    setAccusedSelected(false);
    setisTemplateUploaded(false);
    setSelectedAccusedValue("");
    setPersonTemplates([]);
    setSelectedAccusedTotalItem("");
    setSelectedAccusedPerson("");
    let missingData = [];
    let unknownData = [];
    let otherData = [];
    const filterData = (prop1, element) => {
      const { personalDetails, presentAddress, media } =
        !isNull(element?.person) && element?.person;
      let n1 = getSavedDataResult(
        element,
        personalDetails,
        presentAddress,
        media
      );
      if (element?.physicalFeatures) {
        n1["physicalFeatures"] = element?.physicalFeatures;
      }
      if (media && isArray(media)) {
        n1["media"] = media;
      }
      prop1.push(n1);
    };
    savedFir?.victimDetails.forEach((ele) => {
      if (ele?.victimType === "Missing") {
        filterData(missingData, ele);
      } else if (ele?.victimType === "Unknown Dead Body") {
        filterData(unknownData, ele);
      } else {
        filterData(otherData, ele);
      }
    });
    if (selectedNoticeFor === "Missing Person") {
      setFirAccusedList(missingData);
    } else if (selectedNoticeFor === "Unknown Deadbody") {
      setFirAccusedList(unknownData);
    } else {
      setFirAccusedList(otherData);
    }
  }, [selectedNoticeFor]);

  const fetchAccusedList = () => {
    dispatch(
      getAccusedList(
        `${config.getPostCrimeSceneDetails}/ACCUSED/?crimeId=${crimeId}`
      )
    );
  };

  const handleSearch = (text) => {
    setSerchText(text);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const checkFields = async () => {
    const values = await form.validateFields();
    setFormValid(!Object.values(values).every((v) => v == null || v === ""));
  };

  const openNotificationWithIcon = (type, message) => {
    return notification[type]({
      message: message,
    });
  };

  const handleUpload = (options, params1, params2, params3) => {
    if (params1.length > 0) {
      const mediaFormData = new FormData();
      params1.forEach((file) => {
        mediaFormData.append("file", file.originFileObj);
      });
      mediaFormData.append("prefixFolder", crimeId);
      mediaFormData.append("folderPath", `${crimeId}/LookOutNotice/media`);
      axios
        .post(`${config.fileUpload}/upload`, mediaFormData)
        .then(async (response) => {
          params2([]);
          if (response.data.success) {
            let n1 = {
              name: response.data.data[0]?.name,
              fileId: response.data.data[0]?.id,
              mimeType: response.data.data[0]?.mimeType,
              url: response.data.data[0]?.url,
            };
            let totalMedia = [n1, ...clickedMedia];
            setClickedMedia(totalMedia);
            await dispatch(
              updatePersonMediaDetails(`${config.updatePersonMediaDetails}`, {
                _id: selectedAccusedValue?.person?._id,
                media: totalMedia,
              })
            );
            getInitialDiaptch();
            params3(response.data.data[0]);
            openNotificationWithIcon(
              "success",
              `Uploaded ${response.data.data[0].name}`
            );
            options.onSuccess("ok");
          }
        })
        .catch((err) => {
          params2([]);
          openNotificationWithIcon("error", "Uploaing Went Wrong");
          options.onError("ok");
        });
    }
  };

  const handleDownload = (file) => {
    getFileById(file?.fileId, file?.name, file?.url);
  };

  const getTemplatesList = (selectedNoticeFor) => {
    if (selectedNoticeFor === "Missing Person") {
      return LookoutNoticeTemplates1;
    } else if (selectedNoticeFor === "Unknown Deadbody") {
      return LookoutNoticeTemplates2;
    } else {
      return [];
    }
  };

  const handleSubmit = () => {
    //fake submit, as per client request
    setfakeLoading(true);
    setTimeout(() => {
      setfakeLoading(false);
      openNotificationWithIcon(
        "success",
        `Lookout Notice Submitted succesfully`
      );
    }, 1000);
  };

  return (
    <ModuleWrapper>
      <div className="contentHeaderContainer">
        <div style={styles.widgetPageStyle}>
          <h2 className="pageTitle">Lookout Notice </h2>
        </div>
        <div>
          <Button
            className="stepsButtonInActive"
            onClick={() => setSelectedSiderMenu("investigation")}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            className="saveButton"
            style={{ width: 120, marginTop: 10, marginRight: 10 }}
            disabled={personTemplates.length === 0 ? true : false}
            onClick={handleSubmit}
          >
            Submit
          </Button>
          {personTemplates.length === 0 ? (
            <Tooltip
              placement="topRight"
              title="Upload Lookout Notice For Enabling the Submit Option"
            >
              <ExclamationCircleOutlined
                style={{ color: "red", fontSize: 25 }}
              />
            </Tooltip>
          ) : null}
        </div>
      </div>
      {fakeLoading ? (
        <Loader />
      ) : (
        <>
          <Row>
            <Card
              style={{ width: "70%", minHeight: 400 }}
              className="cardLeftStyle"
            >
              <Form form={form} layout="vertical">
                <Row gutter={24}>
                  <Col span={8}>
                    <Form.Item
                      name="lookOutNoticeFor"
                      label="Look Out Notice For"
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
                        onSelect={async (item) => {
                          await setSelectedNoticeFor(item);
                          checkFields();
                        }}
                      >
                        {["Missing Person", "Unknown Deadbody", "Others"].map(
                          (item, index) => (
                            <Option key={index} value={item} label={item}>
                              {item}
                            </Option>
                          )
                        )}
                      </Select>
                    </Form.Item>
                  </Col>
                  {selectedNoticeFor ? (
                    <Col span={8}>
                      <Form.Item
                        name="accusedId"
                        label={`Select ${selectedNoticeFor}`}
                        rules={[
                          {
                            required: true,
                            message: `Please Select ${selectedNoticeFor}!`,
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
                          onSelect={(item, value) => {
                            if (value?.totalitem?.media) {
                              setClickedMedia(value?.totalitem?.media);
                            } else {
                              setClickedMedia([]);
                            }
                            if (value?.totalitem?.physicalFeatures) {
                              setClickedPhysicalFeatures(
                                value?.totalitem?.physicalFeatures
                              );
                            } else {
                              setClickedPhysicalFeatures({});
                            }
                            setAccusedSelected(true);
                            setSelectedAccusedPerson(
                              value?.totalitem?.selectedRecord
                            );
                            setSelectedAccusedValue(
                              value?.totalitem?.selectedRecord
                            );
                            setSelectedVictimType(
                              value?.totalitem?.selectedRecord?.victimType
                            );
                            setSelectedAccusedTotalItem(
                              getAccuseds([value?.totalitem?.selectedRecord])[0]
                            );
                            checkFields();
                          }}
                        >
                          {firAccusedList.map((item, index) => {
                            const person =
                              !isUndefined(item?.selectedRecord?.person) &&
                              item?.selectedRecord?.person;
                            const personalDetails =
                              !isUndefined(person?.personalDetails) &&
                              person?.personalDetails;
                            let label;
                            if (selectedNoticeFor === "Unknown Deadbody") {
                              label = `Unkown Deadbody ${index + 1}`;
                            } else {
                              label = `${personalDetails?.name || ""} ${
                                personalDetails?.surname || ""
                              }`;
                            }
                            return (
                              <Option
                                key={index}
                                value={person?._id}
                                label={label}
                                totalitem={item}
                              >
                                {label}
                              </Option>
                            );
                          })}
                        </Select>
                      </Form.Item>
                      {selectedAccusedValue !== "" &&
                        selectedAccusedValue?.victimType !==
                          "Unknown Dead Body" && (
                          <AccusedCard
                            accusedPersonalDetails={
                              selectedAccusedValue?.person
                            }
                            title="LookOut Details"
                          />
                        )}
                    </Col>
                  ) : null}
                  {selectedAccusedValue !== "" && (
                    <Col span={8} style={{ padding: "12px" }}>
                      <Form.Item>
                        <Upload
                          fileList={
                            clickedMedia && clickedMedia?.name !== ""
                              ? clickedMedia
                              : []
                          }
                          onPreview={handleDownload}
                          onChange={async (info) => {
                            await setupload_ExtraMedia(info.fileList);
                          }}
                          customRequest={(options) =>
                            handleUpload(
                              options,
                              upload_ExtraMedia,
                              setupload_ExtraMedia,
                              setUploadedExtraMedia
                            )
                          }
                          multiple={false}
                        >
                          <Button
                            className="saveButton"
                            style={{ width: 180, marginTop: 12 }}
                          >
                            <div style={{ display: "flex" }}>
                              <div>
                                <CameraFilled />
                              </div>
                              <div style={{ marginLeft: 12 }}>
                                Upload Photos
                              </div>
                            </div>
                          </Button>
                        </Upload>
                      </Form.Item>
                    </Col>
                  )}
                </Row>
                {selectedAccusedValue !== "" && (
                  <Row style={{ marginTop: 20 }}>
                    <Card style={{ padding: "40px" }}>
                      <AccusedDetailsCard
                        physicalFeatures={clickedPhysicalFeatures}
                        clickedMedia={clickedMedia}
                        selectedNoticeFor={selectedNoticeFor}
                        selectedAccusedPerson={selectedAccusedPerson}
                      />
                    </Card>
                  </Row>
                )}
              </Form>
            </Card>
            <Card
              style={{ width: "30%", minHeight: 400 }}
              className="right-section cardRightStyle"
            >
              <DisplayReportGenerations
                templateLists={getTemplatesList(selectedNoticeFor)}
                showModal={null}
                disabled={selectedAccusedValue === ""}
                selectedRecord={null}
                selectedModule="lookoutNotice"
                accusedId={selectedAccusedValue}
                setIsModalVisible={setIsModalVisible}
                selectedAccusedValue={selectedAccusedValue}
                crimeId={crimeId}
                setisTemplateUploaded={setisTemplateUploaded}
                personTemplates={personTemplates}
                handleDownload={handleDownload}
                getInitialDiaptch={getInitialDiaptch}
              />
            </Card>
          </Row>
          <PrintLookOutNotice
            title={
              selectedNoticeFor === "Missing Person"
                ? "LOOK OUT NOTICES FOR MISSING PERSON"
                : selectedNoticeFor === "Unknown Deadbody"
                ? "LOOK OUT NOTICES FOR UNKNOWN DEAD BODIES"
                : "LOOK OUT NOTICES FOR OTHERS"
            }
            isModalVisible={isModalVisible}
            handleCancel={handleCancel}
            isDisable={accusedSelected}
            accusedPersonalDetails={selectedAccusedtotalItem}
            physicalFeatures={clickedPhysicalFeatures}
            clickedMedia={clickedMedia}
            selectedNoticeFor={selectedNoticeFor}
            crimeClassificationState={crimeClassificationState}
            selectedAccusedPerson={selectedAccusedPerson}
          />
        </>
      )}
    </ModuleWrapper>
  );
}
