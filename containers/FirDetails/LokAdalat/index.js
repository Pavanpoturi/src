/* eslint-disable array-callback-return */
import { useState, useEffect } from "react";
import {
  Row,
  Card,
  Col,
  Form,
  DatePicker,
  Input,
  notification,
  InputNumber,
} from "antd";
import {
  DATE_FORMAT,
  renderFieldsWithDropDown,
} from "@containers/FirDetails/fir-util";
import { useDispatch, useSelector } from "react-redux";
import { config } from "@config/site.config";
import moment from "moment";
import { isEmpty, isArray, last, isUndefined } from "lodash";
import { loadState } from "@lib/helpers/localStorage";
import masterDataActions from "@redux/masterData/actions";
import createFIRActions from "@redux/createFir/actions";
import Loader from "@components/utility/loader";
import lokAdalatDisposalAction from "@redux/LokAdalatDisposal/actions";
import ContentHeader from "@containers/FirDetails/ContentHeader";
import { disposalList } from "./const";
import { LokAdalatWrapper } from "./styles";

export default function LokAdalat({ setSelectedSiderMenu }) {
  const [form] = Form.useForm();
  const crimeId = loadState("selectedFirId");
  const dispatch = useDispatch();
  const { savedFir } = useSelector((state) => state.createFIR);
  const currentUser = loadState("currentUser");
  const [editLokAdalatObj, setEditLokAdalatObj] = useState(null);
  const { courtsFromPSList } = useSelector((state) => state.MasterData);
  const [serchText, setSerchText] = useState("");
  const disableForm = savedFir?.caseStatus === "Disposal";
  const [formValid, setFormValid] = useState(false);
  const [disposalData, setDisposalData] = useState("");
  const { getFIRData } = createFIRActions;
  const {
    actionType,
    errorMessage,
    isFetching,
    lokAdalatDisposalList,
    successMessage,
  } = useSelector((state) => state.LokAdalatDisposal);

  const {
    addLokAdalatDisposal,
    updateLokAdalatDisposal,
    getLokAdalatDisposalList,
    resetActionType,
  } = lokAdalatDisposalAction;

  const { getCourtsBasedonPsCode } = masterDataActions;

  const isSuccess =
    actionType === "ADD_LOK_ADALAT_DISPOSAL_SUCCESS" ||
    "UPDATE_LOK_ADALAT_DISPOSAL_SUCCESS";
  const isError =
    actionType === "ADD_LOK_ADALAT_DISPOSAL_ERROR" ||
    "UPDATE_LOK_ADALAT_DISPOSAL_ERROR";

  const openNotificationWithIcon = (type, message) => {
    return notification[type]({
      message: message,
    });
  };

  const getLokAdalatData = () => {
    dispatch(
      getLokAdalatDisposalList(`${config.lokAdalatDisposal}?crimeId=${crimeId}`)
    );
  };

  useEffect(() => {
    dispatch(
      getCourtsBasedonPsCode(
        `${config.masterData}/getCourtsBasedonPsCode?psCode=${currentUser?.cctns_unit_id}`
      )
    );
    getLokAdalatData();
  }, []);

  const courtNames =
    courtsFromPSList &&
    isArray(courtsFromPSList) &&
    !isEmpty(courtsFromPSList) &&
    courtsFromPSList.map(({ court }) => ({ label: court }));

  useEffect(() => {
    if (isSuccess || isError) {
      if (successMessage !== "") {
        openNotificationWithIcon("success", successMessage);
        form.resetFields();
        getLokAdalatData();
        setEditLokAdalatObj(null);
        dispatch(resetActionType());
        dispatch(getFIRData(`${config.getFIR}?crimeId=${crimeId}`));
      } else if (errorMessage) {
        openNotificationWithIcon("error", errorMessage);
        dispatch(resetActionType());
      }
    }
  }, [actionType]);

  useEffect(() => {
    if (
      !isUndefined(lokAdalatDisposalList) &&
      !isEmpty(lokAdalatDisposalList) &&
      isArray(lokAdalatDisposalList)
    ) {
      const values = last(lokAdalatDisposalList);
      setEditLokAdalatObj(values);
      setDisposalData(values?.disposalIn);
      form.setFieldsValue({
        regularCourtName: values?.courtName,
        disposalType: values?.disposalType,
        lokAdalatDate: moment(new Date(values?.lokAdalatDate)).isValid()
          ? moment(new Date(values?.lokAdalatDate))
          : "",
        lokAdalatNo: values?.lokAdalatNo,
        fineAmount: values?.FineAmount,
        disposalIn: values?.disposalIn,
        lokAdalatCourtName: values?.lokAdalatCourtName,
      });
    } else if (isEmpty(lokAdalatDisposalList)) {
      setEditLokAdalatObj(null);
      setDisposalData("");
      form.resetFields();
      form.setFieldsValue({
        regularCourtName: savedFir?.firDetail?.briefFacts?.courtName,
        disposalType: last(disposalList)?.label,
      });
    }
  }, [lokAdalatDisposalList]);

  const handleSearch = (text) => {
    setSerchText(text);
  };

  const checkFields = async () => {
    const values = await form.validateFields();
    setFormValid(!Object.values(values).every((v) => v == null || v === ""));
  };

  const submit = async () => {
    const values = await form.validateFields();
    const addPayload = {
      crimeId: crimeId,
      disposalType: values?.disposalType,
      lokAdalatDate: values?.lokAdalatDate,
      lokAdalatNo: values?.lokAdalatNo,
      FineAmount: values?.fineAmount,
      disposalIn: values?.disposalIn,
      courtName: values?.regularCourtName,
      lokAdalatCourtName: values?.lokAdalatCourtName,
    };

    const updatePayload = {
      crimeId: crimeId,
      LokAdalatDisposalId: editLokAdalatObj?._id,
      disposalType: values?.disposalType,
      lokAdalatDate: values?.lokAdalatDate,
      lokAdalatNo: values?.lokAdalatNo,
      FineAmount: values?.fineAmount,
      disposalIn: values?.disposalIn,
      courtName: values?.regularCourtName,
      lokAdalatCourtName: values?.lokAdalatCourtName,
    };

    if (editLokAdalatObj?._id) {
      dispatch(
        updateLokAdalatDisposal(config.lokAdalatDisposal, updatePayload)
      );
    } else {
      dispatch(addLokAdalatDisposal(config.lokAdalatDisposal, addPayload));
    }
  };

  return (
    <LokAdalatWrapper>
      <ContentHeader
        headerTitle="Lok Adalat Disposal"
        onSubmitClick={submit}
        isInvestigation={true}
        onCancel={() => setSelectedSiderMenu("courtandprosecution")}
        disableButton={disableForm}
      />
      {isFetching ? (
        <Loader />
      ) : (
        <Card style={{ width: "100%", height: 400 }}>
          <Form form={form} colon={false} layout="vertical">
            <Row gutter={24} style={{ marginBottom: 20 }}>
              <Col span={6}>
                <Form.Item
                  name="disposalType"
                  label="Disposal type"
                  rules={[
                    {
                      required: true,
                      message: "Disposal type is required!",
                    },
                  ]}
                >
                  {renderFieldsWithDropDown(
                    disposalList,
                    null,
                    handleSearch,
                    serchText,
                    250,
                    disableForm,
                    "",
                    ""
                  )}
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name="lokAdalatDate"
                  label="Lok Adalat Date"
                  rules={[
                    {
                      required: true,
                      message: "Lok Adalat Date is required!",
                    },
                  ]}
                >
                  <DatePicker
                    format={DATE_FORMAT}
                    disabled={disableForm}
                    placeholder="Date"
                    style={{ width: 250 }}
                    onChange={checkFields}
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="lokAdalatNo" label="Lok Adalat No.">
                  <Input
                    onChange={checkFields}
                    disabled={disableForm}
                    style={{ width: 250 }}
                    placeholder=""
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={6}>
                <Form.Item name="fineAmount" label="Fine Amount">
                  <InputNumber
                    onChange={checkFields}
                    disabled={disableForm}
                    style={{ width: 250 }}
                    placeholder="Amount"
                    min={1}
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name="disposalIn"
                  label="Disposal in"
                  rules={[
                    {
                      required: true,
                      message: "Disposal in is required!",
                    },
                  ]}
                >
                  {renderFieldsWithDropDown(
                    [{ label: "Regular Court" }, { label: "Lok Adalat Court" }],
                    setDisposalData,
                    handleSearch,
                    serchText,
                    250,
                    disableForm,
                    "",
                    "Regular Court/Lok Adalat Court"
                  )}
                </Form.Item>
              </Col>
              {disposalData !== "" && disposalData === "Regular Court" && (
                <Col span={6}>
                  <Form.Item name="regularCourtName" label="Court Name">
                    {renderFieldsWithDropDown(
                      [],
                      null,
                      handleSearch,
                      serchText,
                      250,
                      true,
                      "",
                      "Court Name"
                    )}
                  </Form.Item>
                </Col>
              )}
              {disposalData !== "" && disposalData === "Lok Adalat Court" && (
                <Col span={6}>
                  <Form.Item
                    name="lokAdalatCourtName"
                    label="Lok Adalat Court Name"
                    rules={[
                      {
                        required:
                          disposalData === "Lok Adalat Court" ? true : false,
                        message:
                          disposalData === "Lok Adalat Court"
                            ? "Lok Adalat Court Name!"
                            : "",
                      },
                    ]}
                  >
                    {renderFieldsWithDropDown(
                      courtNames,
                      null,
                      handleSearch,
                      serchText,
                      250,
                      disableForm,
                      "",
                      "Lok Adalat Court Name"
                    )}
                  </Form.Item>
                </Col>
              )}
            </Row>
          </Form>
        </Card>
      )}
    </LokAdalatWrapper>
  );
}
