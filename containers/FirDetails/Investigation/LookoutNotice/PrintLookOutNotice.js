import { useCallback, useRef, useState, useEffect } from "react";
import { Modal, Button } from "antd";
import ReactToPrint from "react-to-print";
import Loader from "@components/utility/loader";
import { ComponentToPrint } from "./ComponentToPrint";
import { loadState } from "@lib/helpers/localStorage";

export default function PrintLookOutNotice({
  title,
  isModalVisible,
  handleCancel,
  isDisable,
  accusedPersonalDetails,
  physicalFeatures,
  clickedMedia,
  selectedNoticeFor,
  crimeclassificationState,
  selectedAccusedPerson,
}) {
  const componentRef = useRef(null);
  const onBeforeGetContentResolve = useRef(null);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("old boring text");
  const crimeId = loadState("selectedFir");

  const handleAfterPrint = useCallback(() => {
    console.log("`onAfterPrint` called");
  }, []);

  const handleBeforePrint = useCallback(() => {
    console.log("`onBeforePrint` called");
  }, []);

  const handleOnBeforeGetContent = useCallback(() => {
    console.log("`onBeforeGetContent` called");
    setLoading(true);
    setText("Loading new text...");

    return new Promise((resolve) => {
      onBeforeGetContentResolve.current = resolve;

      setTimeout(() => {
        setLoading(false);
        setText("New, Updated Text!");
        resolve();
      }, 2000);
    });
  }, [setLoading, setText]);

  useEffect(() => {
    if (
      text === "New, Updated Text!" &&
      typeof onBeforeGetContentResolve.current === "function"
    ) {
      onBeforeGetContentResolve.current();
    }
  }, [onBeforeGetContentResolve.current, text]);

  const reactToPrintContent = useCallback(() => {
    return componentRef.current;
  }, [componentRef.current]);

  const reactToPrintTrigger = useCallback(() => {
    return (
      <Button
        type="primary"
        className="submitButton"
        style={{ position: "absolute", bottom: 12, right: 23, width: 100 }}
      >
        Print
      </Button>
    );
  }, []);

  const firNum = crimeId?.firNum;
  const documentTitle = `${firNum.replace("/", "-")} - LookOut Notice`;

  return (
    <Modal
      title={title}
      visible={isModalVisible}
      onCancel={handleCancel}
      width={1000}
      footer={null}
    >
      <ReactToPrint
        content={reactToPrintContent}
        documentTitle={documentTitle}
        onAfterPrint={handleAfterPrint}
        onBeforeGetContent={handleOnBeforeGetContent}
        onBeforePrint={handleBeforePrint}
        removeAfterPrint
        trigger={reactToPrintTrigger}
      />
      {loading && <Loader />}
      <ComponentToPrint
        ref={componentRef}
        text={text}
        isDisable={isDisable}
        accusedPersonalDetails={accusedPersonalDetails}
        physicalFeatures={physicalFeatures}
        clickedMedia={clickedMedia}
        selectedNoticeFor={selectedNoticeFor}
        crimeclassificationState={crimeclassificationState}
        selectedAccusedPerson={selectedAccusedPerson}
      />
    </Modal>
  );
}
