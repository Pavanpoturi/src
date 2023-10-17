import { useState, useEffect } from "react";
import {
  Row,
  Col,
  Select,
  Upload,
  Button,
  Spin,
  notification,
  Form,
} from "antd";
import { isArray, isEmpty, isUndefined } from "lodash";
import { FileAddFilled, CaretDownOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import MediaManager from "./mediaManager";
import { categoryList, dummyRequest } from "@containers/FirDetails/fir-util";
import axios from "axios";
import { config } from "@config/site.config";
import { loadState } from "@lib/helpers/localStorage";
import {
  folderName,
  getMediaUploadError,
} from "@containers/FirDetails/fir-util";
const Option = Select.Option;

export default function ArrestUploadForm({
  colWidth,
  enableMediaManager,
  setInputFileList,
  selectedCategory,
  setSelectedCategory,
  disabled = false,
  inputFileList,
  categoryListData,
  categoryListDisplay,
  setarrestpoliceMedia,
  editJuvenileObj,
  validationField = false,
}) {
  const [fileList, setFileList] = useState([]);
  const [serchText, setSerchText] = useState("");
  const [visible, setVisible] = useState(false);
  const [arrestMediaData, setArrestMediaData] = useState([]);
  const [categoryLists, setCategoryLists] = useState([]);
  const { isUploading } = useSelector((state) => state.MediaManager);
  const crimeId = loadState("selectedFirId");

  const openNotificationWithIcon = (type, message) => {
    return notification[type]({
      message: message,
    });
  };
  const handleSearch = (text) => {
    setSerchText(text);
  };

  const onFileChange = (info) => {
    let fileList = [...info.fileList];
    let fileData = [];
    fileList.forEach((file) => {
      if (!!file?.category === false) {
        fileData.push({
          ...file,
          ["category"]: !!selectedCategory === true ? selectedCategory : "",
        });
      } else {
        fileData.push(file);
      }
    });

    fileList = fileData.map((file) => {
      if (file.response) {
        file.url = file.response.url;
      }
      return file;
    });
    var filterData = [];
    var dataMedia = [];
    for (let i = 0; i < fileData?.length; i++) {
      if (
        !!fileList[i]?.uid === true &&
        !filterData?.some((item) => item?.uid === fileList[i]?.uid) &&
        !inputFileList?.some((item) => item?.uid === fileList[i]?.uid)
      ) {
        filterData.push(fileList[i]);
      } else if (!!fileList[i]?.uid === true) {
        const idx = inputFileList.findIndex(
          (item) => item?.uid === fileList[i]?.uid
        );
        inputFileList.splice(idx, 1, fileList[i]);
      }
    }
    dataMedia = [...inputFileList, ...filterData];
    console.log("dataMedia", dataMedia);
    var fileMediaData = [];
    const uploadMedicalCertificateData = new FormData();
    dataMedia.forEach((file) => {
      if (
        !file._id === true &&
        !file.id === true &&
        !arrestMediaData?.some((item) => item?.uid === file?.uid)
      ) {
        uploadMedicalCertificateData.append("file", file.originFileObj);
        setArrestMediaData([...arrestMediaData, file]);
      } else {
        fileMediaData.push(file);
      }
    });
    uploadMedicalCertificateData.append("prefixFolder", crimeId);
    uploadMedicalCertificateData.append(
      "folderPath",
      `${crimeId}/${folderName.ARREST_BY_POLICE}/file`
    );
    axios
      .post(`${config.fileUpload}/upload`, uploadMedicalCertificateData)
      .then((res) => {
        const { data } = res.data;
        const payloadData = [...fileMediaData, ...data];
        const payloadDataList = [];
        for (let i = 0; i < payloadData?.length; i++) {
          for (let j = 0; j < dataMedia?.length; j++) {
            if (payloadData[i]?.name === dataMedia[j]?.name) {
              payloadDataList.push({
                ...payloadData[i],
                category: dataMedia[j]?.category,
              });
            }
          }
        }
        setInputFileList([]);
        setInputFileList(payloadDataList);
        setFileList([]);
        setFileList(payloadDataList);

        if (!!setarrestpoliceMedia === true) {
          setarrestpoliceMedia([]);
          setarrestpoliceMedia(payloadDataList);
        }
        setArrestMediaData([]);
        console.log("payloadData1", payloadDataList);
      })
      .catch((err) => {
        getMediaUploadError(err, openNotificationWithIcon);
      });
  };

  useEffect(() => {
    if (Array.isArray(inputFileList) && !!inputFileList) {
      const fileData = [];
      if (!!selectedCategory === true) {
        inputFileList.forEach((file) => {
          if (file?.category === selectedCategory) {
            fileData.push(file);
          }
        });
        setFileList([]);
        setFileList(fileData);
      } else {
        setFileList([]);
        setFileList(inputFileList);
      }
    } else {
      setFileList([]);
    }
    if (Array.isArray(categoryListData) && !!categoryListData === true) {
      setCategoryLists(categoryListData);
    } else {
      setCategoryLists(categoryList);
    }
  }, [inputFileList, categoryListData, categoryList]);

  const handleRemove = (fileData) => {
    if (
      (isArray(inputFileList) && isEmpty(editJuvenileObj?._id)) ||
      (isArray(inputFileList) && isUndefined(editJuvenileObj?._id))
    ) {
      setarrestpoliceMedia(
        inputFileList.filter((file) => file.id !== fileData.id)
      );
    }
  };

  const renderFieldsWithDropDown = (menuOptions) => {
    return (
      <Select
        suffixIcon={<CaretDownOutlined className="dropDownIcon" />}
        showSearch
        onSearch={handleSearch}
        disabled={disabled}
        filterOption={(input, option) =>
          serchText &&
          option.props.label
            .toString()
            .toLowerCase()
            .indexOf(input.toString().toLowerCase()) >= 0
        }
        style={{ width: "100%" }}
        onSelect={(item) => {
          setSelectedCategory(item);
        }}
        value={selectedCategory}
      >
        {menuOptions.map((item, index) => (
          <Option key={index} value={item.label} label={item.label}>
            {item.label}
          </Option>
        ))}
      </Select>
    );
  };

  return (
    <>
      <Row gutter={24}>
        <Col span={colWidth} style={{ marginBottom: 10 }}>
          <div
            className="heading"
            style={{ marginBottom: 10, fontSize: 16 }}
          ></div>
          <Form.Item
            label="Select Category"
            name="selectCategory"
            rules={[{ required: true }]}
          >
            {renderFieldsWithDropDown(categoryLists)}
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col className="gutter-row" span={10}>
          {validationField ? <span style={{ color: "red" }}>* </span> : ""}
          <label>Select File</label>
          <Upload
            fileList={fileList}
            customRequest={dummyRequest}
            onChange={onFileChange}
            // multiple={true}
            onRemove={handleRemove}
          >
            <Button
              type="primary"
              className="selectFile"
              style={{ backgroundColor: "#02599C", borderColor: "#02599C" }}
              disabled={!selectedCategory || isUploading || disabled}
              icon={<FileAddFilled className="selectFileButtonIcon" />}
            >
              Upload
            </Button>
          </Upload>
        </Col>
      </Row>
      <MediaManager colWidth={20} visible={visible} setVisible={setVisible} />
      {isUploading ? (
        <Row style={{ justifyContent: "center", marginTop: 15 }}>
          <Col>
            <Spin tip="Uploading..." />
          </Col>
        </Row>
      ) : null}
    </>
  );
}
