import { useCallback, useRef, useState, useEffect } from "react";
import { Modal, Button } from "antd";
import ReactToPrint from "react-to-print";
import Loader from "@components/utility/loader";
import { config } from "@config/site.config";
import masterDataActions from "@redux/masterData/actions";
import { useDispatch, useSelector } from "react-redux";
import { isEmpty } from "lodash";
import { ComponentToPrint } from "./ComponentToPrint";

export default function PrintCCDModal({
  title,
  isModalVisible,
  handleCancel,
  selectedCourtAndProsecution,
  caseDiaryData,
}) {
  const componentRef = useRef(null);
  const { savedFir } = useSelector((state) => state.createFIR);
  const onBeforeGetContentResolve = useRef(null);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("simple text");
  const dispatch = useDispatch();
  const { getActList } = masterDataActions;
  const { staffList } = useSelector((state) => state.MasterData);

  useEffect(() => {
    if (!isEmpty(staffList)) {
      const url = config.getMasterData;
      dispatch(getActList(`${url}/ACT`));
    }
  }, [staffList]);

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
        style={{ position: "absolute", bottom: 20, right: 50, width: 140 }}
      >
        Generate CCD
      </Button>
    );
  }, []);

  const pageStyle = `
  @page {
    margin: 20mm 17mm 25mm 23mm;
  }`;

  const firNum = savedFir?.firDetail?.firNum;
  const documentTitle = `${firNum.replace("/", "-")} - Court Case Diary`;

  return (
    <Modal
      title={title}
      visible={isModalVisible}
      onCancel={handleCancel}
      width={900}
      footer={null}
    >
      <div style={{ marginBottom: "50px" }}>
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
          savedFir={savedFir}
          selectedCourtAndProsecution={selectedCourtAndProsecution}
          caseDiaryData={caseDiaryData}
        />
      </div>
    </Modal>
  );
}
