import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Row, Col, Select, Upload, Button, Spin, notification } from "antd";
import { FileAddFilled, CaretDownOutlined } from "@ant-design/icons";
import { isArray, isEmpty, isUndefined } from "lodash";
import MediaManager from "./mediaManager";
import { dummyRequest } from "@containers/FirDetails/fir-util";

const Option = Select.Option;

export default function UploadForm({
  colWidth,
  enableMediaManager,
  setInputFileList,
  selectedCategory,
  setSelectedCategory,
  disabled = false,
  inputFileList,
  isRequired,
}) {
  const [fileList, setFileList] = useState([]);
  const [serchText, setSerchText] = useState("");
  const [visible, setVisible] = useState(false);
  const [categoryLists, setCategoryLists] = useState([]);
  const { isUploading } = useSelector((state) => state.MediaManager);

  const handleSearch = (text) => {
    setSerchText(text);
  };

  const onFileChange = (info) => {
    let fileList = [...info.fileList];

    fileList = fileList.map((file) => {
      if (file.response) {
        file.url = file.response.url;
      }
      return file;
    });
    setFileList(fileList);
    setInputFileList(fileList);
  };

  useEffect(() => {
    if (Array.isArray(inputFileList) && !!inputFileList) {
      setFileList(inputFileList);
    } else {
      setFileList([]);
    }
  }, [inputFileList]);

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
          <div className="heading" style={{ marginBottom: 10, fontSize: 16 }}>
            Select Category
          </div>
          {renderFieldsWithDropDown(categoryLists)}
        </Col>
      </Row>
      <Row gutter={24}>
        <Col className="gutter-row" span={10}>
          {isRequired ? <span style={{ color: "red" }}>* </span> : ""}
          <label>Select File</label>
          <Upload
            fileList={fileList}
            customRequest={dummyRequest}
            onChange={onFileChange}
            multiple={true}
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
        {/* {enableMediaManager && (
          <Col className="gutter-row" span={10}>
            <Button
              type="secondary"
              className="mediaButton"
              icon={<FolderOutlined className="mediaButtonIcon" />}
              onClick={() => setVisible(true)}
              disabled={true}
            >
              Media Manager
            </Button>
          </Col>
        )} */}
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

export function UploadFormWithCategory({
  colWidth,
  setInputFileList,
  categoryLists = [],
  selectedCategory,
  setSelectedCategory,
  disabled = false,
  inputFileList,
  isRequired,
}) {
  const [fileList, setFileList] = useState([]);
  const [serchText, setSerchText] = useState("");
  const [visible, setVisible] = useState(false);
  const { isUploading } = useSelector((state) => state.MediaManager);

  const handleSearch = (text) => {
    setSerchText(text);
  };

  const onFileChange = (info) => {
    let fileList = [...info.fileList];

    fileList = fileList.map((file) => {
      if (file.response) {
        file.url = file.response.url;
      }
      return file;
    });
    setFileList(fileList);
    setInputFileList(fileList);
  };

  useEffect(() => {
    if (Array.isArray(inputFileList) && !!inputFileList) {
      setFileList(inputFileList);
    } else {
      setFileList([]);
    }
  }, [inputFileList]);

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
          <div className="heading" style={{ marginBottom: 10, fontSize: 16 }}>
            Select Category
          </div>
          {renderFieldsWithDropDown(categoryLists)}
        </Col>
      </Row>
      <Row gutter={24}>
        <Col className="gutter-row" span={10}>
          {isRequired ? <span style={{ color: "red" }}>* </span> : ""}
          <label>Select File</label>
          <Upload
            fileList={fileList}
            customRequest={dummyRequest}
            onChange={onFileChange}
            multiple={true}
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

const openNotificationWithIcon = (type, message) => {
  return notification[type]({
    message: message,
  });
};

export function UploadFormWithRestriction({
  colWidth,
  setInputFileList,
  selectedCategory,
  setSelectedCategory,
  disabled = false,
  inputFileList,
  isRequired = false,
  isRestricted = false,
}) {
  const [fileList, setFileList] = useState([]);
  const [serchText, setSerchText] = useState("");
  const [categoryLists, setCategoryLists] = useState([]);
  const { isUploading } = useSelector((state) => state.MediaManager);

  useEffect(() => {
    setFileList(inputFileList);
  }, [inputFileList]);

  //If victim is changed then reverifing restriction
  //NOTE: files that are already uploaded cant be restricted
  useEffect(() => {
    if (isRestricted && isArray(inputFileList) && !isEmpty(inputFileList)) {
      const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png"];
      const filteredFiles = inputFileList.filter(
        (file) =>
          //Files that are not uploaded
          (allowedFileTypes.includes(file.type) &&
            file.size / 1024 / 1024 <= 1) ||
          //Files that are already uploaded
          !isUndefined(file?._id)
      );
      setFileList(filteredFiles);
      setInputFileList(filteredFiles);
    }
  }, [isRestricted]);

  const handleSearch = (text) => {
    setSerchText(text);
  };

  const onFileChange = (info) => {
    const filteredFiles = info.fileList.filter(
      (file) =>
        file.status === "uploading" ||
        (!isUndefined(file.response) && file.response === "Ok") ||
        //Files that are already uploaded
        !isUndefined(file?._id)
    );
    setFileList(filteredFiles);
    setInputFileList(filteredFiles);
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
      >
        {menuOptions.map((item, index) => (
          <Option key={index} value={item.label} label={item.label}>
            {item.label}
          </Option>
        ))}
      </Select>
    );
  };

  const accept = isRestricted ? ".png,.jpeg,.jpg" : "";

  const customRequest = ({ file, onSuccess, onError }) => {
    const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (isRestricted) {
      if (!allowedFileTypes.includes(file.type)) {
        openNotificationWithIcon(
          "error",
          "Please upload the JPEG or PNG file with the file size less than 1MB"
        );
        setTimeout(() => onError("File type is not accepted", "Not Ok"), 0);
      } else if (file.size / 1024 / 1024 > 1) {
        openNotificationWithIcon(
          "error",
          "Please upload the JPEG or PNG file with the file size less than 1MB"
        );
        setTimeout(() => onError("File size is big", "Not Ok"), 0);
      } else {
        setTimeout(() => onSuccess("Ok"), 0);
      }
    } else {
      setTimeout(() => onSuccess("Ok"), 0);
    }
  };

  return (
    <>
      <Row gutter={24}>
        <Col span={colWidth} style={{ marginBottom: 10 }}>
          <div className="heading" style={{ marginBottom: 10, fontSize: 16 }}>
            Select Category
          </div>
          {renderFieldsWithDropDown(categoryLists)}
        </Col>
      </Row>
      <Row gutter={24}>
        <Col className="gutter-row" span={10}>
          {isRequired ? <span style={{ color: "red" }}>* </span> : ""}
          <label>Select File</label>
          <Upload
            accept={accept}
            fileList={fileList}
            customRequest={customRequest}
            onChange={onFileChange}
            multiple={true}
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
