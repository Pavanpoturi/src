import { useState, useEffect } from "react";
import { Form, Upload, Button, Modal } from "antd";
import { isEmpty } from "lodash";
import { SaveOutlined } from "@ant-design/icons";
import { dummyRequest } from "@containers/FirDetails/fir-util";
import { displayFileBasedOnFileId } from "@containers/media-util";
import AllPagesPDFViewer from "@components/Common/AllPagesPDFViewer";

export default function RoughSketch({
  crimeSceneDate,
  handleSubmit,
  displayPhotos,
  setDisplayPhotos,
  roughSketchFiles,
  disabled,
}) {
  const [form] = Form.useForm();
  const [uploadedFiles, setUploadedFiles] = useState([]);

  useEffect(() => {
    displayFileBasedOnFileId(displayPhotos?.fileList, setUploadedFiles);
  }, []);

  const handleCancel = () => {
    setDisplayPhotos({ ...displayPhotos, previewVisible: false });
  };

  const handlePreview = async (file, isImage) => {
    setDisplayPhotos({
      ...displayPhotos,
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name,
      isImage: isImage,
    });
  };

  const pdfUploadedList =
    uploadedFiles &&
    !isEmpty(uploadedFiles) &&
    uploadedFiles.filter((file) => file.mimeType === "application/pdf");
  const imagesUploadedList =
    uploadedFiles &&
    !isEmpty(uploadedFiles) &&
    uploadedFiles.filter((file) => file.mimeType !== "application/pdf");

  return (
    <Form form={form} layout="vertical">
      {imagesUploadedList && (
        <Upload
          listType="picture-card"
          customRequest={dummyRequest}
          fileList={imagesUploadedList}
          disabled={disabled}
          onPreview={(file) => handlePreview(file, true)}
          showUploadList={{ showRemoveIcon: false, showPreviewIcon: true }}
        >
          {displayPhotos.length - 1 <= displayPhotos.length ? null : null}
        </Upload>
      )}
      {pdfUploadedList && !isEmpty(pdfUploadedList) ? (
        <div className="ant-upload-picture-card-wrapper">
          <div className="ant-upload-list ant-upload-list-picture-card">
            {pdfUploadedList.map((item) => {
              return (
                <div
                  style={{ cursor: "pointer" }}
                  className="ant-upload-list-picture-card-container"
                  onClick={() => handlePreview(item, false)}
                >
                  <div className="ant-upload-list-item ant-upload-list-item ant-upload-list-item-list-type-picture-card">
                    <div className="ant-upload-list-item-info">
                      <span className="ant-upload-span">
                        <AllPagesPDFViewer pdf={item?.imgUrl} />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
      <Modal
        visible={displayPhotos.previewVisible}
        title={displayPhotos.previewTitle}
        footer={null}
        onCancel={() => handleCancel()}
        width={800}
      >
        {displayPhotos.isImage ? (
          <img
            alt="roughSketch"
            style={{ width: "100%" }}
            src={displayPhotos.previewImage}
          />
        ) : (
          <AllPagesPDFViewer pdf={displayPhotos?.previewImage} />
        )}
      </Modal>
      <Button
        type="primary"
        className="saveButton"
        style={{ marginTop: isEmpty(displayPhotos.fileList) ? 100 : 80 }}
        size="large"
        icon={<SaveOutlined className="saveButtonIcon" />}
        disabled={!crimeSceneDate || roughSketchFiles.length === 0 || disabled}
        onClick={handleSubmit}
      >
        SAVE
      </Button>
    </Form>
  );
}
