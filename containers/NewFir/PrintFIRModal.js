import { useCallback, useRef, useState, useEffect } from "react";
import { Modal, Button } from "antd";
import ReactToPrint from "react-to-print";
import Loader from "@components/utility/loader";
import { config } from "@config/site.config";
import masterDataActions from "@redux/masterData/actions";
import { useDispatch, useSelector } from "react-redux";
import { loadState } from "@lib/helpers/localStorage";
import { isEmpty } from "lodash";
import { displayFileBasedOnFileId } from "@containers/media-util";
import { ComponentToPrint } from "./ComponentToPrint";

export default function PrintFIRModal({
  title,
  isModalVisible,
  handleCancel,
  isFirGenerated,
}) {
  const componentRef = useRef(null);
  const { savedFir } = useSelector((state) => state.createFIR);
  const currentUser = loadState("currentUser");
  const onBeforeGetContentResolve = useRef(null);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("old boring text");
  const [petitionDataUrls, setPetitionDataUrls] = useState([]);
  const dispatch = useDispatch();
  const { getActList, getStaffList } = masterDataActions;
  const { staffList, actList } = useSelector((state) => state.MasterData);

  const getSupportingStaff = () => {
    dispatch(
      getStaffList(
        `${config.getSupportStaffFromHrms}?policestationcode=${currentUser?.cctns_unit_id}`
      )
    );
  };

  useEffect(() => {
    getSupportingStaff();
    displayFileBasedOnFileId(
      savedFir?.firDetail?.uploadDocuments,
      setPetitionDataUrls
    );
  }, []);

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
        style={{
          position: "absolute",
          bottom: 12,
          right: 23,
          width: 100,
          zIndex: 1,
        }}
      >
        Print FIR
      </Button>
    );
  }, []);

  const pageStyle = `
  @page {
    margin: 20mm 17mm 25mm 23mm;
  }`;

  const firNum = savedFir?.firDetail?.firNum;
  const documentTitle = `${firNum.replace(
    "/",
    "-"
  )} - FIRST INFORMATION REPORT`;

  return (
    <Modal
      title={title}
      visible={isModalVisible}
      onCancel={handleCancel}
      width={1100}
      footer={null}
    >
      <div>
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
          isFirGenerated={isFirGenerated}
          savedFir={savedFir}
          staffListData={staffList}
          actList={actList}
          petitionDataUrls={petitionDataUrls}
        />
      </div>
    </Modal>
  );
}
