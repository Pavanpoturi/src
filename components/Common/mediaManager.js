import { useState } from "react";
import {
  Form,
  Image,
  Row,
  Col,
  Select,
  Upload,
  Button,
  Modal,
  Card,
  Menu,
  Divider,
} from "antd";
import { Link } from "react-router-dom";
import { isArray } from "lodash";
import {
  CaretDownOutlined,
  AudioFilled,
  VideoCameraFilled,
  PictureFilled,
  FileTextFilled,
  FolderFilled,
  SaveFilled,
} from "@ant-design/icons";
import UploadForm from "./uploadForm";
import Checkbox from "antd/lib/checkbox/Checkbox";
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

export default function MediaManager({ colWidth, visible, setVisible }) {
  const [inputList, setInputList] = useState([]);
  const [serchText, setSerchText] = useState("");
  const [currentSection, SetCurrentSection] = useState("Photos");
  const handleSearch = (text) => {
    setSerchText(text);
  };

  const renderFieldsWithDropDown = (menuOptions) => {
    return (
      <Select
        suffixIcon={<CaretDownOutlined className="dropDownIcon" />}
        showSearch
        onSearch={handleSearch}
        filterOption={(input, option) =>
          serchText &&
          option.props.label
            .toString()
            .toLowerCase()
            .indexOf(input.toString().toLowerCase()) >= 0
        }
        style={{ width: 150 }}
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

  const [ImageObject] = useState({
    previewVisible: false,
    previewImage: "",
    previewTitle: "",
    fileList: [
      {
        uid: "1",
        name: "image.png",
        status: "done",
        url: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
        selected: false,
      },
      {
        uid: "2",
        name: "image.png",
        status: "done",
        url: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
        selected: false,
      },
      {
        uid: "3",
        name: "image.png",
        status: "done",
        url: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
        selected: false,
      },
      {
        uid: "4",
        name: "image.png",
        status: "done",
        url: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
        selected: false,
      },
    ],
  });

  const [ImageSectionObject] = useState({
    previewVisible: false,
    previewImage: "",
    previewTitle: "",
    fileList: [
      {
        uid: "5",
        name: "image.png",
        status: "done",
        url: "https://images.unsplash.com/photo-1593642634367-d91a135587b5?ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
        selected: false,
      },
      {
        uid: "6",
        name: "image.png",
        status: "done",
        url: "https://images.unsplash.com/photo-1593642634367-d91a135587b5?ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
        selected: false,
      },
      {
        uid: "7",
        name: "image.png",
        status: "done",
        url: "https://images.unsplash.com/photo-1593642634367-d91a135587b5?ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
        selected: false,
      },
      {
        uid: "8",
        name: "image.png",
        status: "done",
        url: "https://images.unsplash.com/photo-1593642634367-d91a135587b5?ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
        selected: false,
      },
    ],
  });

  const [DocumentObject] = useState({
    previewVisible: false,
    previewImage: null,
    previewTitle: "",
    fileList: [
      {
        uid: "9",
        name: "sample.pdf",
        status: "done",
        url: "http://www.africau.edu/images/default/sample.pdf",
        selected: false,
      },
    ],
  });

  const [DocumentSectionObject] = useState({
    previewVisible: false,
    previewImage: null,
    previewTitle: "",
    fileList: [
      {
        uid: "10",
        name: "sample.pdf",
        status: "done",
        url: "http://www.africau.edu/images/default/sample.pdf",
        selected: false,
      },
    ],
  });

  const [AudioSection1Object] = useState({
    previewVisible: false,
    previewImage: null,
    previewTitle: "",
    fileList: [
      {
        uid: "11",
        name: "MP3_700KB.mp3",
        status: "done",
        url: "https://file-examples-com.github.io/uploads/2017/11/file_example_MP3_700KB.mp3",
        selected: false,
      },
    ],
  });

  const [AudioSection2Object] = useState({
    previewVisible: false,
    previewImage: null,
    previewTitle: "",
    fileList: [
      {
        uid: "12",
        name: "MP3_700KB.mp3",
        status: "done",
        url: "https://file-examples-com.github.io/uploads/2017/11/file_example_MP3_700KB.mp3",
        selected: false,
      },
    ],
  });

  const [VideoSection1Object] = useState({
    previewVisible: false,
    previewImage: null,
    previewTitle: "",
    fileList: [
      {
        uid: "13",
        name: "AVI_480_750kB.avi",
        status: "done",
        url: "https://file-examples-com.github.io/uploads/2018/04/file_example_AVI_480_750kB.avi",
        selected: false,
      },
    ],
  });

  const [VideoSection2Object] = useState({
    previewVisible: false,
    previewImage: null,
    previewTitle: "",
    fileList: [
      {
        uid: "14",
        name: "AVI_480_750kB.avi",
        status: "done",
        url: "https://file-examples-com.github.io/uploads/2018/04/file_example_AVI_480_750kB.avi",
        selected: false,
      },
    ],
  });

  const [OthersSection1Object] = useState({
    previewVisible: false,
    previewImage: null,
    previewTitle: "",
    fileList: [],
  });

  const [OthersSection2Object] = useState({
    previewVisible: false,
    previewImage: null,
    previewTitle: "",
    fileList: [],
  });

  const [PhotosList, setPhotosList] = useState({
    section1Images: {
      previewVisible: false,
      previewImage: "",
      previewTitle: "",
      fileList: [
        {
          uid: "121",
          name: "image.png",
          status: "done",
          url: "https://images.unsplash.com/photo-1593642634367-d91a135587b5?ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
          selected: false,
        },
        {
          uid: "122",
          name: "image.png",
          status: "done",
          url: "https://images.unsplash.com/photo-1593642634367-d91a135587b5?ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
          selected: false,
        },
        {
          uid: "123",
          name: "image.png",
          status: "done",
          url: "https://images.unsplash.com/photo-1593642634367-d91a135587b5?ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
          selected: false,
        },
        {
          uid: "124",
          name: "image.png",
          status: "done",
          url: "https://images.unsplash.com/photo-1593642634367-d91a135587b5?ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
          selected: false,
        },
      ],
    },
    section2Images: {
      previewVisible: false,
      previewImage: "",
      previewTitle: "",
      fileList: [
        {
          uid: "125",
          name: "image.png",
          status: "done",
          url: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
          selected: false,
        },
        {
          uid: "126",
          name: "image.png",
          status: "done",
          url: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
          selected: false,
        },
        {
          uid: "127",
          name: "image.png",
          status: "done",
          url: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
          selected: false,
        },
        {
          uid: "128",
          name: "image.png",
          status: "done",
          url: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
          selected: false,
        },
      ],
    },
  });
  const [ArchievedList, SetArchievedList] = useState({
    section1Images: {
      previewVisible: false,
      previewImage: "",
      previewTitle: "",
      fileList: [],
    },
    section2Images: {
      previewVisible: false,
      previewImage: "",
      previewTitle: "",
      fileList: [],
    },
  });
  const [SelectedList, SetSelectedList] = useState({
    section1Images: {
      previewVisible: false,
      previewImage: "",
      previewTitle: "",
      fileList: [],
    },
    section2Images: {
      previewVisible: false,
      previewImage: "",
      previewTitle: "",
      fileList: [],
    },
  });

  const [DisplayPhotos, setDisplayPhotos] = useState(PhotosList);

  const [Section1filesView, SetSection1FilesView] = useState(ImageObject);
  const [Section2filesView, SetSection2FilesView] =
    useState(ImageSectionObject);

  const showImages = (section) => {
    switch (section) {
      case "Photos":
        setDisplayPhotos(PhotosList);
        break;
      case "Archived":
        setDisplayPhotos(ArchievedList);
        break;
      case "Selected":
        setDisplayPhotos(SelectedList);
        break;
      default:
        break;
    }
  };

  const getFiles = (section) => {
    switch (section) {
      case "Photos":
        SetSection1FilesView(ImageObject);
        SetSection2FilesView(ImageSectionObject);
        SetCurrentSection("Photos");
        break;
      case "Documents":
        SetSection1FilesView(DocumentObject);
        SetSection2FilesView(DocumentSectionObject);
        SetCurrentSection("Documents");
        break;
      case "Videos":
        SetSection1FilesView(VideoSection1Object);
        SetSection2FilesView(VideoSection2Object);
        SetCurrentSection("Videos");
        break;
      case "Audio":
        SetSection1FilesView(AudioSection1Object);
        SetSection2FilesView(AudioSection2Object);
        SetCurrentSection("Audio");
        break;
      case "Others":
        SetSection1FilesView(OthersSection1Object);
        SetSection2FilesView(OthersSection2Object);
        SetCurrentSection("Others");
        break;
      default:
        break;
    }
  };

  function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  const handleCancel = (name) => {
    switch (name) {
      case "Section1":
        SetSection1FilesView({ ...Section1filesView, previewVisible: false });
        break;
      case "Section2":
        SetSection2FilesView({ ...Section2filesView, previewVisible: false });
        break;
      default:
        break;
    }
  };

  const handlePreview = async (file, name) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    switch (name) {
      case "Section1":
        SetSection1FilesView({
          ...Section1filesView,
          previewImage: file.url || file.preview,
          previewVisible: true,
          previewTitle:
            file.name || file.url.substring(file.url.lastIndexOf("/") + 1),
        });
        break;
      case "Section2":
        SetSection2FilesView({
          ...Section2filesView,
          previewImage: file.url || file.preview,
          previewVisible: true,
          previewTitle:
            file.name || file.url.substring(file.url.lastIndexOf("/") + 1),
        });
        break;
      default:
        break;
    }
  };

  const handleChange = ({ fileList }, name) => {
    switch (name) {
      case "Section1":
        SetSection1FilesView({ ...Section1filesView, fileList });
        break;
      case "Section2":
        SetSection2FilesView({ ...Section2filesView, fileList });
        break;
      default:
        break;
    }
  };

  const handleUpload = (info) => {
    let fileList = [...info.fileList];

    fileList = fileList.map((file) => {
      if (file.response) {
        file.url = file.response.url;
      }
      return file;
    });

    setInputList(fileList);
  };
  const handleMarkSelected = () => {
    let archieved1 = [];
    let selected1 = [];
    let archieved2 = [];
    let selected2 = [];
    let photos = { ...DisplayPhotos };
    photos.section1Images.fileList.forEach((element) => {
      if (element.selected) {
        selected1.push(element);
      } else {
        archieved1.push(element);
      }
    });

    photos.section2Images.fileList.forEach((element) => {
      if (element.selected) {
        selected2.push(element);
      } else {
        archieved2.push(element);
      }
    });

    SetArchievedList({
      section1Images: {
        previewVisible: false,
        previewImage: "",
        previewTitle: "",
        fileList: archieved1,
      },
      section2Images: {
        previewVisible: false,
        previewImage: "",
        previewTitle: "",
        fileList: archieved2,
      },
    });
    SetSelectedList({
      section1Images: {
        previewVisible: false,
        previewImage: "",
        previewTitle: "",
        fileList: selected1,
      },
      section2Images: {
        previewVisible: false,
        previewImage: "",
        previewTitle: "",
        fileList: selected2,
      },
    });
  };

  const selectImage = (image, section) => {
    switch (section) {
      case "Section1":
        let section1Obj = { ...PhotosList };
        if (
          section1Obj.section1Images.fileList.filter((x) => x.uid === image.uid)
            .length > 0
        ) {
          section1Obj.section1Images.fileList.filter(
            (x) => x.uid === image.uid
          )[0].selected = !section1Obj.section1Images.fileList.filter(
            (x) => x.uid === image.uid
          )[0].selected;
        }
        setPhotosList(section1Obj);
        break;
      case "Section2":
        let section2Obj = { ...PhotosList };
        if (
          section2Obj.section2Images.fileList.filter((x) => x.uid === image.uid)
            .length > 0
        ) {
          section2Obj.section2Images.fileList.filter(
            (x) => x.uid === image.uid
          )[0].selected = !section2Obj.section2Images.fileList.filter(
            (x) => x.uid === image.uid
          )[0].selected;
        }
        setPhotosList(section2Obj);
        break;
      default:
        break;
    }
  };

  return (
    <>
      <Modal
        title="Media Manager"
        centered
        visible={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        width={1000}
      >
        <div style={{ paddingLeft: 250 }}>
          <Menu mode="horizontal" defaultSelectedKeys={["Photos"]}>
            <Menu.Item onClick={() => getFiles("Photos")} key="Photos">
              <div>Photos</div>
              <div>
                <PictureFilled style={{ fontSize: 30, color: "#D3D3D3" }} />
              </div>
            </Menu.Item>
            <Menu.Item onClick={() => getFiles("Videos")} key="Videos">
              <div>Videos</div>
              <div>
                <VideoCameraFilled style={{ fontSize: 30, color: "#D3D3D3" }} />
              </div>
            </Menu.Item>
            <Menu.Item onClick={() => getFiles("Audio")} key="Audio">
              <div>Audio</div>
              <div>
                <AudioFilled style={{ fontSize: 30, color: "#D3D3D3" }} />
              </div>
            </Menu.Item>
            <Menu.Item onClick={() => getFiles("Documents")} key="Documents">
              <div>Documents</div>
              <div>
                <FileTextFilled style={{ fontSize: 30, color: "#D3D3D3" }} />
              </div>
            </Menu.Item>
            <Menu.Item onClick={() => getFiles("Others")} key="Others">
              <div>Others</div>
              <div>
                <FolderFilled style={{ fontSize: 30, color: "#D3D3D3" }} />
              </div>
            </Menu.Item>
          </Menu>
        </div>
        <Divider />
        <div style={styles.widgetPageStyle}>
          <Card>
            {/* <Row gutter={24} >
              <Col span={colWidth} style={{ marginBottom: 10 }}> */}
            <div style={styles.widgetPageStyle}>
              <div style={{ padding: 10 }}>
                <Form.Item name="UploadType" label="Witness Related Documents">
                  {renderFieldsWithDropDown([])}
                </Form.Item>
                {currentSection !== "Photos" && (
                  <>
                    <Upload
                      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                      listType="picture-card"
                      customRequest={dummyRequest}
                      fileList={Section1filesView.fileList}
                      onPreview={(file) => handlePreview(file, "Section1")}
                      onChange={({ fileList }) =>
                        handleChange({ fileList }, "Section1")
                      }
                      showUploadList={{
                        showRemoveIcon: false,
                        showPreviewIcon: false,
                      }}
                      onClick={() => console.log("true")}
                    >
                      {Section1filesView.fileList.length - 1 <=
                      Section1filesView.fileList.length
                        ? null
                        : null}
                    </Upload>
                    <Modal
                      visible={Section1filesView.previewVisible}
                      title={Section1filesView.previewTitle}
                      footer={null}
                      onCancel={() => handleCancel("Section1")}
                    >
                      <img
                        alt="example"
                        style={{ width: "100%" }}
                        src={Section1filesView.previewImage}
                      />
                    </Modal>
                  </>
                )}
                {currentSection === "Photos" &&
                  DisplayPhotos.section1Images.fileList.map((item, index) => (
                    <div key={item.uid} className="container">
                      <Checkbox
                        className="checkbox"
                        checked={item.selected}
                        onClick={() => selectImage(item, "Section1")}
                      />
                      <Image width={75} src={item.url} preview={true} />
                    </div>
                  ))}
              </div>

              <div style={{ padding: 10 }}>
                <Form.Item name="UploadType" label="Witness Related Documents">
                  {renderFieldsWithDropDown([])}
                </Form.Item>
                {currentSection !== "Photos" && (
                  <>
                    <Upload
                      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                      listType="picture-card"
                      customRequest={dummyRequest}
                      fileList={Section2filesView.fileList}
                      onPreview={(file) => handlePreview(file, "Section2")}
                      onChange={({ fileList }) =>
                        handleChange({ fileList }, "Section2")
                      }
                      showUploadList={{
                        showRemoveIcon: false,
                        showPreviewIcon: false,
                      }}
                    >
                      {Section2filesView.fileList.length - 1 <=
                      Section2filesView.fileList.length
                        ? null
                        : null}
                    </Upload>
                    <Modal
                      visible={Section2filesView.previewVisible}
                      title={Section2filesView.previewTitle}
                      footer={null}
                      onCancel={() => handleCancel("Section2")}
                    >
                      <img
                        alt="example"
                        style={{ width: "100%" }}
                        src={Section2filesView.previewImage}
                      />
                    </Modal>
                  </>
                )}
                {currentSection === "Photos" &&
                  DisplayPhotos.section2Images.fileList.map((item, index) => (
                    <div key={item.uid} className="container">
                      <Checkbox
                        className="checkbox"
                        checked={item.selected}
                        onClick={() => selectImage(item, "Section2")}
                      />
                      <Image width={75} src={item.url} preview={true} />
                    </div>
                  ))}
              </div>
            </div>
          </Card>

          <Card style={{ width: "50%" }}>
            <Row gutter={24}>
              <Col span={colWidth} style={{ marginBottom: 10 }}>
                <div>
                  <Link
                    className="linkStyle"
                    onClick={() => showImages("Selected")}
                    to=" "
                  >
                    Selected{" "}
                    {SelectedList.section1Images.fileList.length +
                      SelectedList.section2Images.fileList.length}
                  </Link>
                </div>
                <div>
                  <Link
                    className="linkStyle"
                    onClick={() => showImages("Archived")}
                    to=" "
                  >
                    Archived{" "}
                    {ArchievedList.section1Images.fileList.length +
                      ArchievedList.section2Images.fileList.length}
                  </Link>
                </div>
                <div>
                  <Link
                    className="linkStyle"
                    onClick={() => showImages("Photos")}
                    to=" "
                  >
                    All Photos{" "}
                    {PhotosList.section1Images.fileList.length +
                      PhotosList.section2Images.fileList.length}
                  </Link>
                </div>

                <Divider />
                <UploadForm
                  colWidth={22}
                  enableMediaManager={false}
                  inputFileList={inputList}
                  handleFileChange={handleUpload}
                />
                <Divider />
                <div>
                  <Button
                    className="markSelectedButton"
                    size="large"
                    icon={<SaveFilled className="markSelectedButtonIcon" />}
                    onClick={handleMarkSelected}
                  >
                    Mark Selected
                  </Button>
                </div>
              </Col>
            </Row>
          </Card>
        </div>
      </Modal>
    </>
  );
}
