import { useState, useEffect } from "react";
import { isArray, isEmpty } from "lodash";
import axios from "axios";
import moment from "moment";
import {
  Form,
  Image,
  Select,
  Card,
  Col,
  Row,
  Button,
  Divider,
  Upload,
  notification,
} from "antd";
import {
  CaretDownOutlined,
  SaveFilled,
  UploadOutlined,
} from "@ant-design/icons";
import Checkbox from "antd/lib/checkbox/Checkbox";
import { config } from "@config/site.config";
import { loadState } from "@lib/helpers/localStorage";
import { dummyRequest } from "@containers/FirDetails/fir-util";

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

const onBehalfList = [
  { label: "IO", name: "IO" },
  { label: "Clues Team", name: "CluesTeam" },
  { label: "Expert", name: "Expert" },
];

const categoryList = [{ label: "CrimeScene Photographs" }];

export default function StandardCrimeScenePhotographs({
  crimeSceneDate,
  photosList,
  handleSubmit,
  disable,
}) {
  const [form] = Form.useForm();
  const [uploadForm] = Form.useForm();
  const crimeId = loadState("selectedFirId");
  const [photographsUpload, setUploadPhotographs] = useState([]);
  const [selectedPhotos, setSelectedPhotos] = useState();
  const [data, setData] = useState([]);
  const [displaySection, setDisplaySection] = useState("Photos");
  const [archivedData, setArchievedData] = useState([]);
  const [allPhotos, setAllPhotos] = useState([]);
  const [allCount, setAllCount] = useState();
  const [archivedCount, setArchivedCount] = useState();
  const [selectedCount, setSelectedCount] = useState();
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const displayFileBasedOnFileId = (data, action) => {
    !isEmpty(data) &&
      data.map((s) => {
        let fileId = "";
        if (!s.fileId && typeof s.url === "string" && s.url.trim() !== "") {
          const fileURL = s.url;
          fileId = fileURL
            .substring(
              fileURL.lastIndexOf("nodes/") + 1,
              fileURL.lastIndexOf("/content")
            )
            .replace("odes/", "");
        } else {
          fileId = s.fileId;
        }
        if (fileId) {
          fetch(`${config.downloadFile}?fileId=${fileId}`, {
            method: "GET",
          })
            .then((response) => response.blob())
            .then((blob) => {
              const reader = new FileReader();
              reader.readAsDataURL(blob);
              reader.onloadend = () => {
                const base64data = reader.result;
                const result = {
                  category: s.category,
                  fileId: fileId,
                  isArchived: s.isArchived,
                  isSelected: s.isSelected,
                  mimeType: s.mimeType,
                  imgUrl: base64data,
                  name: s.name,
                  team: s.team,
                  userDate: s.userDate,
                  url: s.url,
                  _id: s._id,
                };
                action && action((dataUrl) => [...dataUrl, result]);
              };
            });
        }
      });
  };

  useEffect(() => {
    displayFileBasedOnFileId(photosList, setUploadedFiles);
  }, []);

  const openNotificationWithIcon = (type, message) => {
    return notification[type]({
      message: message,
    });
  };

  useEffect(() => {
    if (uploadedFiles && !isEmpty(uploadedFiles)) {
      setData(uploadedFiles);
      var photosCount = uploadedFiles?.filter((item) => {
        return item.isArchived === true;
      });
      var selectedPhotosCount = uploadedFiles?.filter((item) => {
        return item.isSelected === true;
      });
      setAllPhotos(uploadedFiles);
      setAllCount(uploadedFiles.length);
      setArchivedCount(photosCount.length);
      setSelectedCount(selectedPhotosCount.length);
    }
  }, [uploadedFiles]);

  const renderFieldsWithDropDown = (
    menuOptions,
    selectAction,
    handleSearch
  ) => {
    return (
      <Select
        suffixIcon={<CaretDownOutlined className="dropDownIcon" />}
        showSearch
        onSearch={handleSearch}
        style={{ width: 230 }}
        onSelect={(item) => {
          selectAction && selectAction(item);
        }}
        disabled={disable}
      >
        {isArray(menuOptions) &&
          menuOptions.map((item, index) => (
            <Option key={index} value={item.label} label={item.label}>
              {item.label}
            </Option>
          ))}
      </Select>
    );
  };

  const selectImage = (image, index, obj, setAction) => {
    const addSelectedPayload = {
      url: image.url,
      category: image.category,
      team: image.team,
      isSelected: !image.isSelected,
      isArchived: image.isSelected,
    };
    if (index !== "") {
      const updatedObj = !isEmpty(obj) && {
        ...obj[index],
        ...addSelectedPayload,
      };
      const updatedRecords = !isEmpty(obj) && [
        ...obj.slice(0, index),
        updatedObj,
        ...obj.slice(index + 1),
      ];
      const updatedRecordsWithArchive = updatedRecords.map((item) =>
        item.isSelected === true
          ? { ...item, isArchived: false }
          : { ...item, isArchived: true }
      );
      setAction(updatedRecordsWithArchive);

      const updatedObjMain = !isEmpty(data) && {
        ...data[index],
        ...addSelectedPayload,
      };
      const updatedRecordsMain = !isEmpty(data) && [
        ...data.slice(0, index),
        updatedObjMain,
        ...data.slice(index + 1),
      ];
      const updatedRecordsMainWithArchive = updatedRecordsMain.map((r) =>
        r.isSelected === true
          ? { ...r, isArchived: false }
          : { ...r, isArchived: true }
      );
      setData(updatedRecordsMainWithArchive);
    }
  };

  const onTakenChange = (val) => {
    var filterPhotosData = data?.filter((item) => {
      return item.team === val;
    });
    var photosCount = filterPhotosData?.filter((item) => {
      return item.isArchived === true;
    });
    var selectedPhotosCount = filterPhotosData?.filter((item) => {
      return item.isSelected === true;
    });
    setAllPhotos(filterPhotosData);
    setAllCount(filterPhotosData.length);
    setArchivedCount(photosCount.length);
    setSelectedCount(selectedPhotosCount.length);
  };

  const showAllPhotos = () => {
    setDisplaySection("Photos");
    var photosCount = data?.filter((val) => {
      return val.isArchived === true;
    });
    var selectedPhotosCount = data?.filter((val) => {
      return val.isSelected === true;
    });
    setAllPhotos(data);
    setAllCount(data.length);
    setArchivedCount(photosCount.length);
    setSelectedCount(selectedPhotosCount.length);
  };

  const showAllSelected = () => {
    setDisplaySection("Selected");
    var selectedCount = data?.filter((val) => {
      return val.isSelected === true;
    });
    setSelectedPhotos(selectedCount);
    setAllCount(data.length);
    setSelectedCount(selectedCount.length);
    setArchivedCount(data.length - selectedCount.length);
  };

  const showAllArchived = () => {
    setDisplaySection("Archived");
    var selCount = data?.filter((val) => {
      return val.isSelected === true;
    });
    var archivedData = data?.filter((val) => {
      return val.isArchived === true;
    });
    setArchievedData(archivedData);
    setAllCount(data.length);
    setSelectedCount(selCount.length);
    setArchivedCount(archivedData.length);
  };

  const showImages = (section) => {
    form.setFieldsValue({
      takenBy: "",
      UploadType: "",
    });
    switch (section) {
      case "Photos":
        showAllPhotos();
        break;
      case "Archived":
        showAllArchived();
        break;
      case "Selected":
        showAllSelected();
        break;
      default:
        break;
    }
  };

  const submitMark = () => {
    const addPayload = {
      crimeId: crimeId,
      photographs: data,
    };
    if (!isEmpty(data)) {
      handleSubmit(addPayload);
    }
  };

  const submitUpload = async () => {
    const values = await uploadForm.validateFields();
    if (!isEmpty(values.upload?.fileList)) {
      let team = values.team;
      const uploadFormData = new FormData();
      values.upload.fileList.forEach((fileList) => {
        uploadFormData.append("file", fileList.originFileObj);
      });
      uploadFormData.append("prefixFolder", crimeId);
      uploadFormData.append(
        "folderPath",
        `${crimeId}/${
          moment(crimeSceneDate).format("X") +
          "_" +
          team +
          "_CRIMESCENEPHOTOGRAPHS"
        }/file`
      );
      axios
        .post(`${config.fileUpload}/upload`, uploadFormData)
        .then((res) => {
          if (res.status === 200) {
            const { data } = res.data;
            const newArr = data.map((v) => ({
              ...v,
              isSelected: false,
              isArchived: false,
              fileId: v?.id,
              team: values.team,
              category: "crimeScenePhotographs",
              userDate: crimeSceneDate,
            }));
            const payload = {
              crimeId: crimeId,
              photographs: newArr,
            };
            handleSubmit(payload);
          }
        })
        .catch((err) => {
          if (err && err?.response?.status === 400) {
            const errorDetails = JSON.parse(
              err.response?.data?.error.description
            );
            const errorKey = errorDetails?.error?.errorKey;
            openNotificationWithIcon("error", errorKey);
            setTimeout(() => {}, 0);
          }
        });
    }
    uploadForm.resetFields();
  };

  const allowedFormat = ["image/png", "image/jpeg", "image/gif"];

  const onFileChange = (info) => {
    if (allowedFormat.includes(info?.file?.type)) {
      let fileList = [...info.fileList];
      fileList = fileList.map((file) => {
        if (file.response) {
          file.url = file.response.url;
        }
        return file;
      });
      setUploadPhotographs(fileList);
    } else {
      openNotificationWithIcon(
        "error",
        "Supported File Format is PNG/JPEG/JPG/GIF"
      );
    }
  };

  const displayImagesCard = (dataItems, actionName) => {
    return (
      <div className="ant-upload-picture-card-wrapper">
        <div className="ant-upload-list ant-upload-list-picture-card">
          {dataItems.map((item, index) => {
            return (
              <div
                style={{ cursor: "pointer" }}
                className="ant-upload-list-picture-card-container"
                key={index}
              >
                <div className="ant-upload-list-item ant-upload-list-item ant-upload-list-item-list-type-picture-card">
                  <span className="ant-upload-span">
                    <Checkbox
                      className="checkbox"
                      style={{ margin: 5 }}
                      checked={item.isSelected}
                      onClick={() =>
                        selectImage(item, index, dataItems, actionName)
                      }
                    />
                    <Image
                      src={item.imgUrl}
                      preview={true}
                      height={150}
                      width="100%"
                    />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div style={styles.widgetPageStyle}>
      <Card style={{ minHeight: 600, width: "75%" }}>
        <Form form={form} layout="vertical">
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item
                style={{ paddingBottom: 20 }}
                name="takenBy"
                label="Photos taken By"
              >
                {renderFieldsWithDropDown(onBehalfList, onTakenChange)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                style={{ paddingBottom: 20 }}
                name="UploadType"
                label="Category"
              >
                {renderFieldsWithDropDown(categoryList, null)}
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Row>
          {displaySection === "Photos"
            ? !isEmpty(allPhotos) && displayImagesCard(allPhotos, setAllPhotos)
            : null}
          {displaySection === "Selected"
            ? !isEmpty(selectedPhotos) &&
              displayImagesCard(selectedPhotos, setAllPhotos)
            : null}
          {displaySection === "Archived"
            ? !isEmpty(archivedData) &&
              displayImagesCard(archivedData, setAllPhotos)
            : null}
        </Row>
      </Card>
      <Card style={{ minHeight: 600, width: "25%" }}>
        <Row gutter={24}>
          <Col span={24} style={{ marginBottom: 10 }}>
            <div className="linkStyle" onClick={() => showImages("Selected")}>
              Selected {selectedCount && selectedCount}
            </div>
            <div className="linkStyle" onClick={() => showImages("Archived")}>
              Archived {selectedCount && allCount && allCount - selectedCount}
            </div>
            <div className="linkStyle" onClick={() => showImages("Photos")}>
              All Photos {!isEmpty(data) && data?.length}
            </div>
            <Divider />
            <div>
              <Button
                className="markSelectedButton"
                size="large"
                icon={<SaveFilled className="markSelectedButtonIcon" />}
                onClick={submitMark}
                disabled={disable}
              >
                Mark Selected
              </Button>
            </div>
            <Divider />
            <Form form={uploadForm} onFinish={submitUpload} layout="vertical">
              <Form.Item
                style={{ paddingBottom: 20 }}
                name="team"
                label="Uploaded on behalf of"
              >
                {renderFieldsWithDropDown(onBehalfList, null)}
              </Form.Item>
              <Form.Item
                style={{ paddingBottom: 20 }}
                name="category"
                label="Witness Related Documents"
              >
                {renderFieldsWithDropDown(categoryList, null)}
              </Form.Item>
              <Form.Item name="upload" style={{ width: "100%" }}>
                <Upload
                  accept="image/*"
                  fileList={photographsUpload.fileList}
                  customRequest={dummyRequest}
                  onChange={(info) => onFileChange(info)}
                  multiple={true}
                >
                  <Button
                    type="primary"
                    className="markSelectedButton"
                    style={{ width: 100 }}
                    disabled={disable}
                    icon={<UploadOutlined style={{ float: "left" }} />}
                  >
                    Browse
                  </Button>
                </Upload>
              </Form.Item>
              <div style={{ marginTop: 22 }}>
                <Button
                  className="markSelectedButton"
                  size="large"
                  icon={<SaveFilled className="markSelectedButtonIcon" />}
                  htmlType="submit"
                  disabled={disable}
                >
                  Upload
                </Button>
              </div>
            </Form>
          </Col>
        </Row>
      </Card>
    </div>
  );
}
