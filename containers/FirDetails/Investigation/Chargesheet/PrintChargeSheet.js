import { useCallback, useRef, useState, useEffect } from "react";
import { Modal, Button } from "antd";
import ReactToPrint from "react-to-print";
import Loader from "@components/utility/loader";
import { ComponentToPrint } from "./ComponentToPrint";
import { loadState } from "@lib/helpers/localStorage";

export default function PrintChargeSheet({
  title,
  isModalVisible,
  handleCancel,
  isChargeSheetGenerated,
  chargesheetList,
  chargedAccusedList,
  notChargedAccusedList,
  witnessStatementList,
  actListData,
  isCCLToPrint,
  arrestList,
  juvenileApprehensionList,
  filteredIODetails,
  reassignmentOfCaseList,
  initialBriefFacts,
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

  const pageStyle = `
  @page {
    margin: 20mm 17mm 25mm 24mm;
  }
`;

  const firNum = crimeId?.firNum;
  const documentTitle = `${firNum.replace("/", "-")} - Charge Sheet`;

  return (
    <Modal
      title={title}
      visible={isModalVisible}
      onCancel={handleCancel}
      width={1000}
      footer={null}
    >
      <ReactToPrint
        pageStyle={pageStyle}
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
        isChargeSheetGenerated={isChargeSheetGenerated}
        chargesheetList={chargesheetList}
        chargedAccusedList={chargedAccusedList}
        notChargedAccusedList={notChargedAccusedList}
        witnessStatementList={witnessStatementList}
        actListData={actListData}
        isCCLToPrint={isCCLToPrint}
        arrestList={arrestList}
        juvenileApprehensionList={juvenileApprehensionList}
        filteredIODetails={filteredIODetails}
        reassignmentOfCaseList={reassignmentOfCaseList}
        initialBriefFacts={initialBriefFacts}
      />
    </Modal>
  );
}
