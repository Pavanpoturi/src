import { useCallback, useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactToPrint from "react-to-print";
import {
  Row,
  Col,
  Form,
  Input,
  Card,
  Button,
  Divider,
  Modal,
  notification,
} from "antd";
import { isEmpty, isUndefined } from "lodash";
import { ComponentToPrintVehicleDetails } from "./ComponentToPrintVehicleDetails";
import { config } from "@config/site.config";
import crimeSceneActions from "@redux/investigations/crimeScene/actions";

export default function VehicleDetailsCard({
  disable,
  viewClicked,
  vehicleInfo,
  setVehicleInfo,
}) {
  const [showVehicleDetails, setShowVehicleDetails] = useState(false);
  const { getVehicleData } = crimeSceneActions;
  const dispatch = useDispatch();
  const [text, setText] = useState("simple text");
  const [loading, setLoading] = useState(false);
  const [vehicleDetailsPopUp, setVehicleDetailsPopUp] = useState({});
  const componentRef = useRef(null);
  const onBeforeGetContentResolve = useRef(null);
  const { vehicleDetails, isFetching, actionType, errorMessage } = useSelector(
    (state) => state.CrimeScene
  );

  const openNotificationWithIcon = (type, message) => {
    return notification[type]({
      message: message,
    });
  };

  useEffect(() => {
    if (!isFetching) {
      if (actionType === "FETCH_VEHICLE_SUCCESS") {
        openNotificationWithIcon("success", "Successfully Fetched Details");
      } else if (actionType === "FETCH_VEHICLE_ERROR") {
        openNotificationWithIcon("error", errorMessage);
        setShowVehicleDetails(false);
      }
    }
  }, [actionType, isFetching]);

  useEffect(() => {
    if (!isUndefined(vehicleDetails) && !isEmpty(vehicleDetails)) {
      if (showVehicleDetails === "fetch") {
        setVehicleDetailsPopUp(vehicleDetails);
      }
    }
  }, [vehicleDetails]);

  const vehicleDetailsLabels = [
    {
      name: "tr",
      label: "TRNO",
      type: "text",
    },
    {
      name: "registration",
      label: "Registration No",
      type: "text",
    },
    {
      name: "chassis",
      label: "Chaisis No",
      type: "text",
    },
    {
      name: "engine",
      label: "Engine No",
      type: "text",
    },
  ];

  const handleFetch = (values) => {
    let payload = {};
    if (!isUndefined(values?.tr) && values?.tr !== "") {
      payload = {
        type: "tr",
        value: values.tr,
      };
    } else if (
      !isUndefined(values?.registration) &&
      values?.registration !== ""
    ) {
      payload = {
        type: "registration",
        value: values.registration,
      };
    } else if (!isUndefined(values?.chassis) && values?.chassis !== "") {
      payload = {
        type: "chassis",
        value: values.chassis,
      };
    } else if (!isUndefined(values?.engine) && values?.engine !== "") {
      payload = {
        type: "engine",
        value: values.engine,
      };
    }
    if (!isEmpty(payload)) {
      setShowVehicleDetails("fetch");
      dispatch(
        getVehicleData(
          `${config.getVehicleInfo}?type=${payload?.type}&value=${payload?.value}`
        )
      );
    } else {
      openNotificationWithIcon(
        "warning",
        "Please Enter Anyone Of The Parameters"
      );
    }
  };

  const handleVehicleDetailsAdd = () => {
    if (!isEmpty(vehicleDetailsPopUp)) {
      setVehicleInfo(vehicleDetailsPopUp);
    }
    setShowVehicleDetails(false);
  };

  const handleDelete = () => {
    setVehicleInfo({});
    setShowVehicleDetails(false);
  };

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

  return (
    <Card style={{ width: "100%", marginTop: "10px" }}>
      <Form name="vehicleDetailsForm" onFinish={handleFetch} layout="vertical">
        <Divider>
          <span style={{ fontWeight: "bold" }}>Vehicle Details</span>
        </Divider>
        <center>
          <p style={{ marginBottom: "10px", fontWeight: "bold" }}>
            (Search using one or multiple parameters)
          </p>
        </center>
        <Row gutter={24}>
          {vehicleDetailsLabels.map((item, ind) => {
            return (
              <Col span={6} key={ind}>
                <Form.Item name={item.name} label={item.label}>
                  <Input
                    placeholder={`Enter ${item.label}`}
                    disabled={viewClicked || disable}
                    style={{ width: 180 }}
                  />
                </Form.Item>
              </Col>
            );
          })}
        </Row>
        <Row gutter={24} justify="end" style={{ marginTop: 15 }}>
          <Col>
            <Form.Item>
              <Button
                htmlType="submit"
                type="primary"
                className="saveButton"
                size="large"
                disabled={viewClicked || disable || isFetching}
                style={{
                  width: "160px",
                }}
              >
                Fetch Details
              </Button>
            </Form.Item>
          </Col>
          {!isEmpty(vehicleInfo) && (
            <Col>
              <Button
                type="primary"
                className="stepsButtonActive"
                size="large"
                onClick={() => {
                  setShowVehicleDetails("view");
                  setVehicleDetailsPopUp(vehicleInfo);
                }}
                style={{
                  backgroundColor: "#258C0B",
                  borderColor: "#258C0B",
                  width: "160px",
                }}
              >
                View Details
              </Button>
            </Col>
          )}
        </Row>
      </Form>
      <Modal
        title="Vehicle Details Report Preview"
        visible={
          showVehicleDetails === "view" || showVehicleDetails === "fetch"
        }
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
            style={{
              display: `${
                showVehicleDetails === "fetch" ? "inline-block" : "none"
              }`,
            }}
            onClick={handleVehicleDetailsAdd}
            disabled={viewClicked || disable || isFetching}
          >
            Add
          </Button>,
          <Button
            type="primary"
            className="submitButton"
            style={{
              display: `${
                showVehicleDetails === "view" ? "inline-block" : "none"
              }`,
            }}
            onClick={handleDelete}
            disabled={viewClicked || disable || isFetching}
          >
            Remove
          </Button>,
          <Button
            className="submitButton"
            onClick={() => {
              setShowVehicleDetails(false);
            }}
          >
            Close
          </Button>,
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
            vehicleDetails={vehicleDetailsPopUp}
            isFetching={isFetching}
          />
        </div>
      </Modal>
    </Card>
  );
}
