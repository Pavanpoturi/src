import { useCallback, useRef, useState, useEffect } from "react";
import { Modal, Button } from "antd";
import ReactToPrint from "react-to-print";
import Loader from "@components/utility/loader";
import { ComponentToPrint } from "./ComponentToPrint";
import { loadState } from "@lib/helpers/localStorage";
import alterationMemoActions from "@redux/investigations/alterationMemo/actions";
import { useDispatch, useSelector } from "react-redux";
import { config } from "@config/site.config";

export default function PrintFinalReport({
  title,
  isModalVisible,
  handleCancel,
  isFinalReportGenerated,
  finalReportList,
  witnessStatementList,
  filteredIODetails,
}) {
  const componentRef = useRef(null);
  const onBeforeGetContentResolve = useRef(null);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("old boring text");
  const crimeId = loadState("selectedFir");
  const crimeNumber = loadState("selectedFirId");
  const dispatch = useDispatch();
  const { getAlterationMemoList } = alterationMemoActions;
  const { alterationMemoList = [] } = useSelector(
    (state) => state.AlterationMemo
  );
  const { alteration = [] } = alterationMemoList;
  const alterationMemoData = alteration.filter(
    (item) => item.alterationReason.confirmAlteration === true
  );
  const handleAfterPrint = useCallback(() => {
    console.log("`onAfterPrint` called");
  }, []);

  const handleBeforePrint = useCallback(() => {
    console.log("`onBeforePrint` called");
  }, []);

  const handleOnBeforeGetContent = useCallback(() => {
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
    dispatch(
      getAlterationMemoList(
        `${config.getAlterationMemo}?crimeId=${crimeNumber}`
      )
    );
  }, []);
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
  const documentTitle = `${firNum.replace("/", "-")} - Final Report`;
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
        isFinalReportGenerated={isFinalReportGenerated}
        finalReportList={finalReportList}
        witnessStatementList={witnessStatementList}
        filteredIODetails={filteredIODetails}
        alterationMemoList={alterationMemoData}
      />
    </Modal>
  );
}
