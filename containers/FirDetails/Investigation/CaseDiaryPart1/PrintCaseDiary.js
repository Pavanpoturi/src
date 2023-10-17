import { useCallback, useRef, useState, useEffect } from "react";
import { Modal, Button } from "antd";
import ReactToPrint from "react-to-print";
import Loader from "@components/utility/loader";
import { ComponentToPrint } from "./ComponentToPrint";
import { useDispatch, useSelector } from "react-redux";
import { config } from "@config/site.config";
import { loadState } from "@lib/helpers/localStorage";
import suspectAccusedAction from "@redux/investigations/suspectAccused/actions";
import firActions from "@redux/fir/actions";
import stolenPropertyActions from "@redux/investigations/stolenProperty/actions";
import { isEmpty } from "lodash";
import commonActions from "@redux/investigations/commonRequest/actions";
export default function PrintCaseDiary({
  title,
  isModalVisible,
  handleCancel,
  savedFir,
  selectedRecord,
  caseDiaryList,
}) {
  const componentRef = useRef(null);
  const dispatch = useDispatch();
  const crimeId = loadState("selectedFirId");
  const onBeforeGetContentResolve = useRef(null);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("old boring text");
  const { getDeceasedList } = commonActions;
  const { stolenPropertyList } = useSelector((state) => state.stolenProperty);
  const { getStolenPropertyList } = stolenPropertyActions;
  const { getAccusedList } = suspectAccusedAction;
  const { fetchWitnessStatementsList } = firActions;
  const { suspectAccusedList } = useSelector((state) => state.SuspectAccused);
  const { witnessStatementListNew } = useSelector((state) => state.FIR);
  const { deceasedList } = useSelector((state) => state.CommonRequest);
  const deceasedVictimList =
    !isEmpty(savedFir.victimDetails) && savedFir && savedFir?.victimDetails;
  const deceasedVictimDetails =
    !isEmpty(deceasedVictimList) &&
    deceasedVictimList.filter((s) => s.victimType === "Deceased");

  const getDeceasedVictimList = () => {
    if (!isEmpty(deceasedList) && !isEmpty(deceasedVictimDetails)) {
      return [].concat.apply(deceasedVictimDetails, deceasedList);
    } else if (isEmpty(deceasedList) && !isEmpty(deceasedVictimDetails)) {
      return deceasedVictimDetails;
    } else if (!isEmpty(deceasedList) && isEmpty(deceasedVictimDetails)) {
      return deceasedList;
    } else {
      return [];
    }
  };

  useEffect(() => {
    dispatch(
      getAccusedList(
        `${config.getPostCrimeSceneDetails}/ACCUSED/?crimeId=${crimeId}`
      )
    );
    dispatch(
      getDeceasedList(
        `${config.getPostCrimeSceneDetails}/DECEASED/?crimeId=${crimeId}`
      )
    );
    dispatch(
      fetchWitnessStatementsList(
        `${config.getWitnessStatements}/?crimeId=${crimeId}`
      )
    );
    dispatch(
      getStolenPropertyList(`${config.stolenProperty}/?crimeId=${crimeId}`)
    );
  }, []);

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
    margin: 20mm 17mm 25mm 23mm;
  }
`;

  const firNum = savedFir?.firDetail?.firNum;
  const documentTitle = `${firNum.replace("/", "-")} - PART-1 CD`;

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
        savedFir={savedFir}
        selectedRecord={selectedRecord}
        suspectAccusedList={suspectAccusedList}
        witnessStatementListNew={witnessStatementListNew}
        deceasedListDetails={getDeceasedVictimList()}
        stolenPropertyList={stolenPropertyList}
        caseDiaryList={caseDiaryList}
      />
    </Modal>
  );
}
