/* eslint-disable array-callback-return */
import { useState, useEffect } from "react";
import ContentHeader from "@containers/FirDetails/ContentHeader";
import { Row, Card, Col, Form, DatePicker, Input, notification } from "antd";
import {
  IS_SHO,
  IS_IO,
  DATE_FORMAT,
  renderFieldsWithDropDown,
  IS_INVESTIGATION_OFFICER
} from "@containers/FirDetails/fir-util";
import TextArea from "antd/lib/input/TextArea";
import { isEmpty, isArray } from "lodash";
import moment from "moment";
import { ModuleWrapper } from "@containers/FirDetails/Investigation/CommonDetails/styles";
import { useDispatch, useSelector } from "react-redux";
import { config } from "@config/site.config";
import Loader from "@components/utility/loader";
import { loadState } from "@lib/helpers/localStorage";
import masterDataActions from "@redux/masterData/actions";
import CourtTransferAction from "@redux/CourtAndProsecution/CourtTransfer/actions.js";
import ChargeSheetDataActions from "@redux/CourtAndProsecution/ChargeSheetData/actions";
import { textAreaRules } from "@components/Common/formOptions";
import { reasonForTransferList } from "../const";
import { addCourtTransferPayload, updateCourtTransferPayload } from "./payload";
import { CourtAndProsecutionWrapper } from "../styles";

export default function CourtTransfer({ setSelectedSiderMenu }) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { savedFir } = useSelector((state) => state.createFIR);
  const currentUser = loadState("currentUser");
  const [serchText, setSerchText] = useState("");
  const crimeId = loadState("selectedFirId");
  const selectedCourtAndProsecution = loadState("selectedCourtAndProsecution");
  const [editCourtTransferForm, setEditCourtTransferForm] = useState(null);
  const [reasonForTransfer, setReasonForTransfer] = useState("");
  const userRole = [IS_SHO, IS_IO, IS_INVESTIGATION_OFFICER];
  const IS_HIGHER_SHO_USER = !userRole?.includes(currentUser?.ecopsv2_role)

  const disableForm =
    (IS_HIGHER_SHO_USER &&
      currentUser?.isPersnolized === false &&
      currentUser?.isIo === false) ||
    savedFir?.caseStatus === "Disposal" || selectedCourtAndProsecution.isCourtDisposal;
  const [formValid, setFormValid] = useState(false);
  const { courtsFromPSList } = useSelector((state) => state.MasterData);
  const { getCourtsBasedonPsCode } = masterDataActions;
  const { setChargeSheetData } = ChargeSheetDataActions;

  const {
    actionType,
    errorMessage,
    successMessage,
    courtTransferList,
    isFetching,
  } = useSelector((state) => state.CourtTransfer);

  const {
    addCourtTransfer,
    updateCourtTransfer,
    getCourtTransferList,
    resetActionType,
  } = CourtTransferAction;

  const isSuccess =
    actionType === "ADD_COURT_TRANSFER_SUCCESS" ||
    actionType === "UPDATE_COURT_TRANSFER_SUCCESS";

  const isError =
    actionType === "ADD_COURT_TRANSFER_ERROR" ||
    actionType === "UPDATE_COURT_TRANSFER_ERROR";

  const courtNames =
    courtsFromPSList &&
    isArray(courtsFromPSList) &&
    !isEmpty(courtsFromPSList) &&
    courtsFromPSList.map(({ court }) => ({ label: court }));

  const getCourtTransferApi = () => {
    dispatch(
      getCourtTransferList(
        `${config.courtTransfer}?crimeId=${crimeId}&updateChargesheetId=${selectedCourtAndProsecution?.updateChargesheetId}`
      )
    );
  };

  useEffect(() => {
    getCourtTransferApi();
    form.setFieldsValue({
      transferredFrom: selectedCourtAndProsecution?.courtName,
    });
  }, []);

  useEffect(() => {
    const courtTransferDoc = courtTransferList?.[0];
    setEditCourtTransferForm(courtTransferDoc);
    if (courtTransferDoc) {
      form.setFieldsValue({
        transferredFrom: courtTransferDoc?.transferredFrom,
        transferredTo: courtTransferDoc?.transferredTo,
        dateOfTransfer: moment(
          new Date(courtTransferDoc?.dateOfTransfer)
        ).isValid()
          ? moment(new Date(courtTransferDoc?.dateOfTransfer))
          : "",
        courtCaseNo: courtTransferDoc?.courtCaseNo,
        reasonforTransfer: courtTransferDoc?.reasonForTransfer,
        otherReason: courtTransferDoc?.otherReasonForTransfer,
        remark: courtTransferDoc?.remarks,
      });
      setReasonForTransfer(courtTransferDoc?.reasonForTransfer);
      dispatch(
        setChargeSheetData({
          courtName: courtTransferDoc?.transferredTo,
          courtCaseNo: courtTransferDoc?.courtCaseNo,
        })
      );
    }
  }, [courtTransferList]);

  useEffect(() => {
    dispatch(
      getCourtsBasedonPsCode(
        `${config.masterData}/getCourtsBasedonPsCode?psCode=${currentUser?.cctns_unit_id}`
      )
    );
  }, [dispatch]);

  useEffect(() => {
    if (isSuccess || isError) {
      if (successMessage) {
        getCourtTransferApi();
        openNotificationWithIcon("success", successMessage);
        form.resetFields();
        dispatch(resetActionType());
      } else if (errorMessage) {
        openNotificationWithIcon("error", errorMessage);
        dispatch(resetActionType());
      }
    }
  }, [actionType]);

  const handleSearch = (text) => {
    setSerchText(text);
  };

  const checkFields = async () => {
    const values = await form.validateFields();
    setFormValid(!Object.values(values).every((v) => v == null || v === ""));
  };

  const submit = async () => {
    const values = await form.validateFields();
    const addPayloadData = addCourtTransferPayload(
      values,
      crimeId,
      selectedCourtAndProsecution?.updateChargesheetId,
      selectedCourtAndProsecution?._id
    );
    const updatePayloadData = updateCourtTransferPayload(
      values,
      crimeId,
      selectedCourtAndProsecution?.updateChargesheetId,
      selectedCourtAndProsecution?._id,
      editCourtTransferForm?._id
    );

    if (editCourtTransferForm?._id) {
      dispatch(
        updateCourtTransfer(
          `${config.courtTransfer}?crimeId=${crimeId}`,
          updatePayloadData
        )
      );
    } else {
      dispatch(
        addCourtTransfer(
          `${config.courtTransfer}?crimeId=${crimeId}`,
          addPayloadData
        )
      );
    }
  };

  const openNotificationWithIcon = (type, message) => {
    return notification[type]({
      message: message,
    });
  };

  return (
    <ModuleWrapper>
      <CourtAndProsecutionWrapper>
        <ContentHeader
          headerTitle="Court Transfer"
          onSubmitClick={submit}
          isInvestigation={true}
          onCancel={() => setSelectedSiderMenu("courtandprosecution")}
          disableButton={disableForm}
        />
        {isFetching ? (
          <Loader />
        ) : (
          <Card
            style={{
              width: "100%",
              padding: 10,
              height: 400,
              minHeight: 400,
            }}
          >
            <Form form={form} colon={false} layout="vertical">
              <Row gutter={24} style={{ marginBottom: 15 }}>
                <Col span={6}>
                  <Form.Item name="transferredFrom" label="Transferred From">
                    {renderFieldsWithDropDown(
                      courtNames,
                      null,
                      handleSearch,
                      serchText,
                      200,
                      true,
                      "",
                      "Select Court Name"
                    )}
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    name="transferredTo"
                    label="Transferred To"
                    rules={[
                      {
                        required: true,
                        message: "Transferred To is required!",
                      },
                    ]}
                  >
                    {renderFieldsWithDropDown(
                      courtNames,
                      null,
                      handleSearch,
                      serchText,
                      200,
                      disableForm,
                      "",
                      "Select Court Name"
                    )}
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    name="dateOfTransfer"
                    label="Date Of Transfer"
                    rules={[
                      {
                        required: true,
                        message: "Date Of Transfer is required!",
                      },
                    ]}
                  >
                    <DatePicker
                      format={DATE_FORMAT}
                      disabled={disableForm}
                      placeholder="Date"
                      style={{ width: 200 }}
                      onChange={checkFields}
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item name="courtCaseNo" label="Court Case No">
                    <Input
                      onChange={checkFields}
                      disabled={disableForm}
                      style={{ width: 200 }}
                      placeholder="Given By Received Court"
                    />
                  </Form.Item>
                </Col>
                <Col span={6} style={{ marginTop: 15 }}>
                  <Form.Item
                    name="reasonforTransfer"
                    label="Reason for Transfer"
                  >
                    {renderFieldsWithDropDown(
                      reasonForTransferList,
                      setReasonForTransfer,
                      handleSearch,
                      serchText,
                      200,
                      disableForm,
                      "",
                      "Select"
                    )}
                  </Form.Item>
                </Col>
                {reasonForTransfer === "Others" ? (
                  <Col span={6} style={{ marginTop: 15 }}>
                    <Form.Item name="otherReason" label="Other Reason">
                      <Input
                        onChange={checkFields}
                        disabled={disableForm}
                        style={{ width: 200 }}
                        placeholder="Other Reason"
                      />
                    </Form.Item>
                  </Col>
                ) : null}
              </Row>
              <Row gutter={24} style={{ marginTop: 15 }}>
                <Col span={24}>
                  <Form.Item
                    name="remark"
                    label="Remark"
                    rules={[textAreaRules.textAreaMaxLength]}
                  >
                    <TextArea
                      style={{ height: 100 }}
                      maxLength={textAreaRules.maxLength}
                      disabled={disableForm}
                      onChange={checkFields}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
        )}
      </CourtAndProsecutionWrapper>
    </ModuleWrapper>
  );
}
