import { Modal } from "antd";
import { exportGeneratedReportToDoc } from "@containers/FirDetails/fir-util";
import { Button } from "antd";

export default function TemplatesModal({
  reportData,
  selectedTemplateName,
  selectedFileName,
  getHTMLFromTemplate,
  handleCancel,
  isModalVisible,
}) {
  return (
    <Modal
      visible={isModalVisible}
      title={selectedTemplateName}
      onOk={handleCancel}
      onCancel={handleCancel}
      width={800}
      footer={[
        <Button key="back" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={() => {
            exportGeneratedReportToDoc(selectedFileName);
          }}
        >
          Download
        </Button>,
      ]}
    >
      {getHTMLFromTemplate(selectedFileName, reportData)}
    </Modal>
  );
}
