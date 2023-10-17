/* eslint-disable array-callback-return */
import { useState, useEffect } from "react";
import {
  Row,
  Card,
  Col,
  Form,
  Select,
  Button,
  Divider,
  notification,
} from "antd";
import { CaretDownOutlined, SaveOutlined } from "@ant-design/icons";
import {
  getAccuseds,
  getSavedDataResult,
  getMediaPayload,
  getMediaUploadError,
} from "@containers/FirDetails/fir-util";
import { isEmpty, first, isUndefined, isArray, isNull } from "lodash";
import Loader from "@components/utility/loader";
import { UploadFormWithCategory } from "@components/Common/uploadForm";
import { loadState } from "@lib/helpers/localStorage";
import { config } from "@config/site.config";
import axios from "axios";
import { useDispatch } from "react-redux";
import AccusedCard from "../CommonForms/AccusedCard";
import SavedInterrogationRecords from "./SavedInterrogationRecords";
import { categoryListData } from "./const";

const Option = Select.Option;

export default function IndividualParticulars({
  selectedAccusedValue,
  setSelectedAccusedValue,
  editDetails,
  setViewDetails,
  selectedRecord,
  suspectAccusedList,
  viewInterrogationDetails,
  interrogationReportList,
  addPersonAction,
  setEditInterrogationObj,
  disabled,
  disableForm,
  addDetails,
  updateDetails,
  selectedObjId,
  setIs41ACRPC,
  setIsArrestRelated,
}) {
  const crimeId = loadState("selectedFirId");
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [isUploading, setIsUploading] = useState(false);
  const [serchText, setSerchText] = useState("");
  const [inputFileList, setInputFileList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleSearch = (text) => {
    setSerchText(text);
  };
  const getAccusedDropdownData = () => getAccuseds(suspectAccusedList);
  const accusedPersonalDetails = first(
    getAccusedDropdownData().filter((s) => s._id === selectedAccusedValue)
  );
  console.log(getAccusedDropdownData(), "getAccusedDropdownData()");
  useEffect(() => {
    if (selectedRecord?._id) {
      form.setFieldsValue({ accusedId: selectedRecord?.person });
    }
  }, [selectedRecord]);

  const getSavedData = () => {
    let savedData = [];
    isArray(interrogationReportList) &&
      !isEmpty(interrogationReportList) &&
      // eslint-disable-next-line array-callback-return
      interrogationReportList.map((data) => {
        const accusedDetails = first(
          getAccusedDropdownData().filter((s) => s._id === data.person)
        );
        const { personalDetails, presentAddress, mediaDetails } =
          !isUndefined(accusedDetails) &&
          !isNull(accusedDetails) &&
          accusedDetails;
        savedData.push(
          getSavedDataResult(
            data,
            personalDetails,
            presentAddress,
            mediaDetails
          )
        );
      });
    return savedData;
  };

  const openNotificationWithIcon = (type, message) => {
    return notification[type]({
      message: message,
    });
  };

  const submitPersonMedia = async () => {
    const mediaFormData = new FormData();
    inputFileList.forEach((file) => {
      mediaFormData.append("file", file.originFileObj);
    });
    mediaFormData.append("prefixFolder", crimeId);
    mediaFormData.append("folderPath", `${crimeId}/InterrogationReport/file`);
    const existingMedia = selectedRecord?.individualParticulars;
    if (!isEmpty(inputFileList)) {
      setIsUploading(true);
      await axios
        .post(`${config.fileUpload}/upload`, mediaFormData)
        .then(async (res) => {
          if (res.status === 200) {
            const { data } = res.data;
            const mediaPayload = getMediaPayload(data, selectedCategory);
            const mediaResult =
              !isUndefined(existingMedia) && !isEmpty(existingMedia)
                ? [...existingMedia, ...mediaPayload]
                : mediaPayload;
            const addPayload = {
              crimeId: crimeId,
              person: selectedAccusedValue,
              individualParticulars: mediaResult,
            };
            const updatePayload = {
              crimeId: crimeId,
              _id: selectedObjId,
              person: selectedAccusedValue,
              individualParticulars: mediaResult,
            };
            if (selectedObjId) {
              dispatch(
                updateDetails(`${config.interrogation}/update`, updatePayload)
              );
            } else {
              dispatch(addDetails(config.interrogation, addPayload));
            }
            setIsUploading(false);
          }
        })
        .catch((err) => {
          getMediaUploadError(err, openNotificationWithIcon);
          setIsUploading(false);
        });
    }
  };

  const isFullImageUploaded =
    selectedCategory === "Full image" ||
    (!isUndefined(selectedRecord?.individualParticulars) &&
      selectedRecord?.individualParticulars.some(
        (item) => item?.category === "Full image"
      ));
  const handleEdit = (value) => {
    editDetails(value);
    const AccusedObj = getAccusedDropdownData().find(
      (val) => val?._id === value.person
    );
    setIs41ACRPC(!AccusedObj?.is41ACRPC);
    setIsArrestRelated(!!AccusedObj?.isArrestRelated);
    setSelectedAccusedValue(value.person);
  };
  return (
    <Row>
      <Card
        style={{ width: isEmpty(interrogationReportList) ? "100%" : "50%" }}
        className="cardLeftStyle"
      >
        <Form form={form} layout="vertical">
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item
                name="accusedId"
                label="Select Accused"
                rules={[{ required: true, message: "Please Select Accused!" }]}
              >
                <Select
                  suffixIcon={<CaretDownOutlined className="dropDownIcon" />}
                  showSearch
                  onSearch={handleSearch}
                  filterOption={(input, option) =>
                    serchText &&
                    option.props.label
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  onSelect={(item) => {
                    const AccusedObj = getAccusedDropdownData().find(
                      (val) => val?._id === item
                    );
                    setIs41ACRPC(!AccusedObj?.is41ACRPC);
                    setIsArrestRelated(!!AccusedObj?.isArrestRelated);
                    setSelectedAccusedValue(item);
                    setViewDetails(false);
                    setEditInterrogationObj(null);
                  }}
                  disabled={viewInterrogationDetails || editDetails?._id}
                >
                  {!isEmpty(getAccusedDropdownData()) &&
                    getAccusedDropdownData().map((item, index) => (
                      <Option key={index} value={item._id} label={item.label}>
                        {item.label}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
              {selectedAccusedValue !== "" && (
                <AccusedCard
                  accusedPersonalDetails={accusedPersonalDetails}
                  title="Accused Details"
                />
              )}
            </Col>
            <Col span={6}>
              <div
                className="link"
                style={{ marginTop: 25, marginLeft: 10, cursor: "pointer" }}
                onClick={addPersonAction}
              >
                Add Person
              </div>
            </Col>
            <Col span={10}>
              <div style={{ marginLeft: 10, marginBottom: 20 }}>
                <UploadFormWithCategory
                  colWidth={22}
                  setInputFileList={setInputFileList}
                  categoryLists={categoryListData}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  disabled={selectedAccusedValue === "" || disableForm}
                />
              </div>
            </Col>
          </Row>
          {isUploading && <Loader />}
          <Divider style={{ marginTop: "75px" }} />
          <Form.Item>
            <Button
              type="primary"
              className="saveButton"
              size="large"
              icon={<SaveOutlined className="saveButtonIcon" />}
              onClick={() => {
                if (isUndefined(isFullImageUploaded) || !isFullImageUploaded) {
                  openNotificationWithIcon("error", "Please Upload Full Image");
                } else {
                  submitPersonMedia();
                }
              }}
              disabled={isEmpty(inputFileList) || disabled || disableForm}
            >
              SAVE
            </Button>
          </Form.Item>
        </Form>
      </Card>
      {!isEmpty(interrogationReportList) ? (
        <Card style={{ width: "50%" }} className="right-section cardRightStyle">
          <SavedInterrogationRecords
            dataSource={getSavedData()}
            editDetails={handleEdit}
            setViewDetails={setViewDetails}
            selectedRecord={selectedRecord}
          />
        </Card>
      ) : null}
    </Row>
  );
}
