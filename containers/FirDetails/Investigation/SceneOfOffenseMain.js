import { Form, Col, Card, notification } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import firActions from "@redux/fir/actions";
import { config } from "@config/site.config";
import { loadState } from "@lib/helpers/localStorage";
import ContentHeader from "../ContentHeader";
import Loader from "@components/utility/loader";
import CrimeLocation from "../CommonSections/SceneofOffense";
import SceneofOffenseList from "../CommonSections/SceneofOffense/SceneofOffenseList";

export default function SceneOfOffenseMain({ setSelectedSiderMenu }) {
  const dispatch = useDispatch();
  const { updateCrimeLocation, fetchCrimeLocation, createCrimeLocation } =
    firActions;
  const {
    actionType,
    successMessage,
    errorMessage,
    crimeLocation,
    isFetching,
  } = useSelector((state) => state.FIR);
  const crimeId = loadState("selectedFirId");
  const [form] = Form.useForm();
  const [viewSceneofOffense, setViewSceneofOffense] = useState(false);
  const [editSceneofOffenseObj, setEditSceneofOffenseObj] = useState(null);
  const [formValid, SetFormValid] = useState(false);

  const handleEditSceneofOffense = (value) => {
    setEditSceneofOffenseObj(value);
  };

  const isSuccess =
    actionType === "CRIMELOCATION_UPDATE_SUCCESS" ||
    actionType === "CRIMELOCATION_CREATE_SUCCESS";
  const isError =
    actionType === "CRIMELOCATION_UPDATE_ERROR" ||
    actionType === "CRIMELOCATION_CREATE_ERROR";

  const openNotificationWithIcon = (type, message) => {
    return notification[type]({
      message: message,
    });
  };

  useEffect(() => {
    dispatch(
      fetchCrimeLocation(
        `${config.getPostCrimeSceneDetails}/CRIMELOCATION/?crimeId=${crimeId}`
      )
    );
  }, [actionType]);

  useEffect(() => {
    var currentData =
      crimeLocation && crimeLocation.length > 0
        ? crimeLocation?.filter((x) => !x.sceneRecreated)
        : [];
    if (currentData?.length > 0) {
      setEditSceneofOffenseObj(currentData[0]);
    }
  }, [crimeLocation]);

  useEffect(() => {
    if (isSuccess || isError) {
      if (
        successMessage === "Scene Of Offence Created Successfully." ||
        successMessage === "successfully updated"
      ) {
        openNotificationWithIcon("success", successMessage);
        form.resetFields();

        if (
          actionType === "CRIMELOCATION_UPDATE_SUCCESS" ||
          actionType === "CRIMELOCATION_CREATE_SUCCESS"
        ) {
          dispatch(
            fetchCrimeLocation(
              `${config.getPostCrimeSceneDetails}/CRIMELOCATION/?crimeId=${crimeId}`
            )
          );
        }
        setSelectedSiderMenu("investigation");
      } else if (errorMessage) {
        openNotificationWithIcon("error", errorMessage);
      }
    }
  }, [actionType]);

  const handleCrimeLocationSubmit = async () => {
    const values = await form.validateFields();
    const addSceneofOffensePayload = {
      crimeId: crimeId,
      userDate: values.userDate,
      crimeLocation: {
        address1: values.address1,
        address2: values.address2,
        city: values.city,
        state: values.state,
        district: values.district,
        pincode: values.pincode,
        landmark: values.landmark,
        description: values.description,
        latitude: values.latitude,
        longitude: values.longitude,
        dateCreated: values.userDate,
      },
    };

    const updateSceneofOffensePayload = {
      crimeId: crimeId,
      crimeLocation: {
        userDate: values.userDate,
        _id: editSceneofOffenseObj?.address?._id,
        address1: values.address1,
        state: values.state,
        address2: values.address2,
        city: values.city,
        district: values.district,
        pincode: values.pincode,
        landmark: values.landmark,
        description: values.description,
        latitude: values.latitude,
        longitude: values.longitude,
        dateCreated: values.userDate,
      },
    };

    if (editSceneofOffenseObj?.address?._id) {
      dispatch(
        updateCrimeLocation(
          config.updateCrimeLocation,
          updateSceneofOffensePayload
        )
      );
    } else {
      dispatch(
        createCrimeLocation(config.crimeLocation, addSceneofOffensePayload)
      );
    }
  };

  return (
    <>
      <ContentHeader
        headerTitle="Scene of Offence"
        addAnother={false}
        addAnotherText="Add Another"
        onSubmitClick={handleCrimeLocationSubmit}
        disableButton={!formValid}
        isInvestigation={true}
        onCancel={() => setSelectedSiderMenu("investigation")}
      />
      {isFetching ? (
        <Loader />
      ) : (
        <Form form={form} layout="vertical">
          <Card style={{ minHeight: "4vh" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-start",
                overflow: "hidden",
                marginBottom: 10,
              }}
            >
              <Col span={18}>
                <CrimeLocation
                  currentData={editSceneofOffenseObj}
                  handleSubmit={handleCrimeLocationSubmit}
                  resetEdit={() => setEditSceneofOffenseObj(null)}
                  viewSceneofOffense={viewSceneofOffense}
                  setViewSceneofOffense={setViewSceneofOffense}
                  sceneofoffenseForm={form}
                  showButton={false}
                  setformValidFlag={SetFormValid}
                  isInvestigation={editSceneofOffenseObj ? false : true}
                />
              </Col>
              <Col span={6}>
                <SceneofOffenseList
                  moduleTitle="Scene of Offence"
                  isDisplayed={false}
                  minHeight={500}
                  showRecords={true}
                  records={crimeLocation}
                  editSceneofOffense={handleEditSceneofOffense}
                  selectedRecord={editSceneofOffenseObj}
                  setViewSceneofOffense={setViewSceneofOffense}
                />
              </Col>
            </div>
          </Card>
        </Form>
      )}
    </>
  );
}
