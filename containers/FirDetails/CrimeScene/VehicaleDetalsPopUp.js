import { useCallback, useRef, useState } from "react";
import ReactToPrint from "react-to-print";
import { Modal, Button } from "antd";
import { ComponentToPrintVehicleDetails } from "./ComponentToPrintVehicleDetails";

const VehicaleDetalsPopUp = ({
  setShowVehicleDetails,
  showVehicleDetails,
  vehiclesDetails,
  setVehiclePopupDetails,
  setVehiclesDetails,
  handleVehicleDetailsAdd,
}) => {
  const [text, setText] = useState("simple text");
  const [loading, setLoading] = useState(false);
  const [deleteList, setDeleteList ] = useState([]);
  const componentRef = useRef(null);
  const onBeforeGetContentResolve = useRef(null);

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

  const reactToPrintContent = useCallback(() => {
    return componentRef.current;
  }, [componentRef.current]);

  const handleAfterPrint = useCallback(() => {
    console.log("`onAfterPrint` called");
  }, []);

  const handleBeforePrint = useCallback(() => {
    console.log("`onBeforePrint` called");
  }, []);

  const reactToPrintTrigger = useCallback(() => {
    return (
      <Button
        type="primary"
        className="submitButton"
        style={{ position: "absolute", bottom: 10, right: 180, width: 120 }}
      >
        Print
      </Button>
    );
  }, []);

  const handleDelete = (ind) => {
    const filteredList = vehiclesDetails.filter((item, i) => !ind.includes(i)) 
    setVehiclePopupDetails(filteredList);
    setVehiclesDetails(filteredList);
    setDeleteList([]);
  }

  return (
    <Modal
      title="Vehicle Details Report Preview"
      visible={showVehicleDetails === "view" || showVehicleDetails === "fetch"}
      width="40%"
      onCancel={() => {
        setShowVehicleDetails(false);
      }}
      cancelText="Close"
      okButtonProps={{
        style: {
          display: "none",
        },
      }}
      footer={[
        <Button 
        type="primary" 
        className="submitButton"
        style={{display: `${showVehicleDetails === "fetch" ? "inline-block" : "none" }`}}
        onClick={handleVehicleDetailsAdd}
        >
          Add
        </Button>,
        <Button 
        type="primary" 
        className="submitButton"
        style={{display: `${showVehicleDetails === "view" ? "inline-block" : "none" }`}}
        disabled={deleteList.length === 0}
        onClick={() => {handleDelete(deleteList)}}
        >
          Remove
        </Button>,
        <Button 
        className="submitButton"
        onClick={() => {
          setShowVehicleDetails(false);
        }}>
          Close
        </Button>
      ]}
    >
      <div>
        <ReactToPrint
          documentTitle="Vehicle Details"
          content={reactToPrintContent}
          onAfterPrint={handleAfterPrint}
          onBeforeGetContent={handleOnBeforeGetContent}
          onBeforePrint={handleBeforePrint}
          removeAfterPrint
          trigger={reactToPrintTrigger}
        />
        <ComponentToPrintVehicleDetails
          ref={componentRef}
          text={text}
          vehiclesDetails={vehiclesDetails}
          setDeleteList={setDeleteList}
          deleteList={deleteList}
          showVehicleDetails={showVehicleDetails}
        />
      </div>
    </Modal>
  );
};

export default VehicaleDetalsPopUp;
