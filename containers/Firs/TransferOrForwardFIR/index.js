/* eslint-disable array-callback-return */
import { useState, useEffect } from "react";
import { disableFutureDates } from "@components/Common/helperMethods";
import { textFieldRules } from "@components/Common/formOptions";
import Loader from "@components/utility/loader";
import { config } from "@config/site.config";
import {
  Row,
  Col,
  Form,
  Select,
  Input,
  DatePicker,
  notification,
  Button,
  Modal,
  Upload,
} from "antd";
import { isEmpty, isArray, first, isNull, isUndefined } from "lodash";
import {
  CaretDownOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import {
  renderFieldsWithDropDown,
  DATE_FORMAT,
  masterDataType,
  getStateNames,
  getDistrictsWithStatesNames,
} from "@containers/FirDetails/fir-util";
import masterDataActions from "@redux/masterData/actions";
import { useDispatch, useSelector } from "react-redux";
import { loadState } from "@lib/helpers/localStorage";
import transferOfCaseFileActions from "@redux/investigations/transferOfCaseFile/actions";
import { transferFIRForm, forwardFIRForm } from "./const";
import { ModuleWrapper } from "@containers/FirDetails/Investigation/CommonDetails/styles";
import { folderName } from "@containers/FirDetails/fir-util";
import axios from "axios";
import mediaManagerActions from "@redux/fir/mediaManager/actions";
import createFIRActions from "@redux/createFir/actions";
import reportsActions from "@redux/reports/actions";
const { TextArea } = Input;
const Option = Select.Option;

const { uploadFIR, resetUpdateFir } = createFIRActions;
const { uploadTemplates } = mediaManagerActions;

export default function TransferOrForwardFIR({
  setIsFormSubmitted,
  isTransfered,
  setVisible,
  getZeroFirList,
}) {
  const [form] = Form.useForm();
  const crimeId = loadState("selectedFirId");
  const selectedFir = loadState("selectedFir");
  const dispatch = useDispatch();
  const [selectedState, setSelectedState] = useState("");
  const [unitsFromDistrictState, setUnitsFromDistrictState] = useState([]);
  const {
    getUnitsList,
    getStatesName,
    getStateDistrictList,
    getUnitsFromDistrict,
  } = masterDataActions;
  const { stateDistrictList, statesNameList, unitsFromDistrict } = useSelector(
    (state) => state.MasterData
  );
  const {
    updateActionType,
    updateSuccessMessage,
    updateErrorMessage,
    savedFir,
  } = useSelector((state) => state.createFIR);
  const isTelangana = selectedState !== "" && selectedState === "TELANGANA";

  const { transferFIR, forwardFIR, resetActionType } =
    transferOfCaseFileActions;

  const { actionType, errorMessage, isFetching, successMessage } = useSelector(
    (state) => state.TransferOfCaseFile
  );
  const [serchText, setSerchText] = useState("");
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [firUploadFileListState, setFIRUploadFileListState] = useState([]);
  const [selectedPSState, setselectedPSState] = useState("");

  const selectedFirData = JSON.parse(localStorage.getItem("selectedFir"));

  const isSuccess =
    actionType === "TRANSFER_FIR_SUCCESS" ||
    actionType === "FORWARD_FIR_SUCCESS";
  const isError =
    actionType === "TRANSFER_FIR_ERROR" || actionType === "FORWARD_FIR_ERROR";
  const { fetchPsDetails } = reportsActions;
  const isUpdateSuccess =
    updateActionType === "UPDATE_FIR_SUCCESS" ||
    updateActionType === "UPLOAD_DOCUMENTS_SUCCESS" ||
    updateActionType === "DELETE_DOCUMENTS_SUCCESS";

  const isUpdateError =
    updateActionType === "UPDATE_FIR_ERROR" ||
    updateActionType === "UPLOAD_DOCUMENTS_ERROR" ||
    updateActionType === "DELETE_DOCUMENTS_ERROR";
  const { psDetails } = useSelector((state) => state.Reports);
  useEffect(() => {
    dispatch(getStatesName(`${config.getMasterData}/${masterDataType.STATES}`));
    dispatch(
      getStateDistrictList(
        `${config.getMasterData}/${masterDataType.DISTRICTS}`
      )
    );
  }, []);

  useEffect(() => {
    dispatch(fetchPsDetails(`${config.getTsHierarchyList}`));
  }, [dispatch]);

  const handleDistrictCityChange = (district) => {
    const data = district.label;
    const filterPsData =
      isArray(psDetails) &&
      psDetails.reduce((acc, res) => {
        if (
          !acc.some(
            (data) => data.value.toString() === res?.ps_code.toString()
          ) &&
          !!res?.ps_name === true &&
          data.toString() === res.dist_code &&
          res?.ps_code !== selectedFirData?.psCode
        ) {
          acc.push({
            value: res?.ps_code,
            label: res?.ps_name,
          });
        }
        return acc;
      }, []);
    setUnitsFromDistrictState(filterPsData);
  };

  useEffect(() => {
    let n1 = [];
    isArray(unitsFromDistrict) &&
      unitsFromDistrict.forEach((item) => {
        const container = {
          label: item.UNIT_NAME,
          name: item.UNIT_NAME,
          psCode: item.UNIT_CD,
        };
        if (item.UNIT_CD !== selectedFirData?.psCode) {
          n1.push(container);
        }
      });
    setUnitsFromDistrictState(n1);
  }, [unitsFromDistrict]);

  const stateNames = () => getStateNames(statesNameList);

  const districtList =
    isArray(psDetails) &&
    psDetails.reduce((acc, res) => {
      if (
        !acc.some((data) => data?.value === res?.dist_code) &&
        !!res?.district_commissionerate === true
      ) {
        acc.push({
          value: res?.dist_code,
          label: res?.district_commissionerate,
        });
      }
      return acc;
    }, []);

  const onStateChange = (state) => {
    setSelectedState && setSelectedState(state);
  };

  const fileData =
    !isNull(selectedFir) &&
    !isUndefined(selectedFir?.uploadFirReport) &&
    selectedFir?.uploadFirReport.url !== ""
      ? [selectedFir?.uploadFirReport]
      : undefined;

  const openNotificationWithIcon = (type, message) => {
    return notification[type]({
      message: message,
    });
  };

  useEffect(() => {
    dispatch(getUnitsList(`${config.getMasterData}/UNITS`));
  }, []);

  useEffect(() => {
    if (isSuccess || isError) {
      if (successMessage !== "") {
        openNotificationWithIcon("success", successMessage);
        dispatch(resetActionType());
        setIsFormSubmitted(true);
      } else if (errorMessage) {
        openNotificationWithIcon("error", errorMessage);
        dispatch(resetActionType());
      }
    }
  }, [actionType]);

  useEffect(() => {
    if (isUpdateSuccess || isUpdateError) {
      if (updateSuccessMessage !== "") {
        dispatch(resetActionType());
        dispatch(resetUpdateFir());
        openNotificationWithIcon("success", updateSuccessMessage);
      } else if (updateErrorMessage) {
        dispatch(resetActionType());
        dispatch(resetUpdateFir());
        openNotificationWithIcon("error", updateErrorMessage);
      }
    }
  }, [updateActionType, savedFir, crimeId]);

  const showConfirm = () => {
    setConfirmModalVisible(true);
  };

  const hideModal = () => {
    setConfirmModalVisible(false);
  };

  const handleUpload = (options) => {
    if (firUploadFileListState.length > 0) {
      const mediaFormData = new FormData();
      firUploadFileListState.forEach((file) => {
        mediaFormData.append("file", file.originFileObj);
      });
      const crimeID = crimeId;
      mediaFormData.append("prefixFolder", crimeID);
      mediaFormData.append("folderPath", `${crimeID}/${folderName.FIR}/file`);
      axios
        .post(`${config.fileUpload}/upload`, mediaFormData)
        .then(async (response) => {
          setFIRUploadFileListState([]);
          if (response.data.success) {
            hideModal();
            setVisible(false);
            openNotificationWithIcon("success", "Successfully Uploaded");
            const { data } = response?.data;
            const payloadData = first(data);
            const tpayload = {
              crimeId: crimeID,
              action: folderName.FIR,
              actionSubType: folderName.FIR,
              templates: [
                {
                  category: "printFIR",
                  mimeType: payloadData.mimeType,
                  name: payloadData.name,
                  url: payloadData.url,
                  templateCode: payloadData.name,
                  templateName: payloadData.name,
                  fileId: payloadData?.id,
                },
              ],
            };
            dispatch(uploadTemplates(config.templatesUpload, tpayload));
            if (!isEmpty(selectedFir) && !selectedFir?.isDraft) {
              const payload = {
                crimeId: crimeID,
                firReport: {
                  category: "printFIR",
                  mimeType: payloadData.mimeType,
                  name: payloadData.name,
                  url: payloadData.url,
                  fileId: payloadData?.id,
                },
              };
              await dispatch(uploadFIR(config.uploadFirReport, payload));
              getZeroFirList();
            }
            options.onSuccess("ok");
          }
        })
        .catch((err) => {
          console.log(err);
          setFIRUploadFileListState([]);
          openNotificationWithIcon("error", "Uploaing Went Wrong");
          options.onError("ok");
        });
    }
  };

  const transferZeroFir = async () => {
    const values = await form.validateFields();
    const payload = {
      crimeId: crimeId,
      dateOfTransfer: values?.dateOfTransfer,
      transferDistrict: values?.transferDistrict,
      transferState: values?.transferState,
      transferTo: values?.transferTo,
      transferToName: selectedPSState?.label,
      transferDistrictCode: values?.transferDistrictCode,
    };
    dispatch(transferFIR(config.transferOfCaseFile, payload));
  };

  const forwardZeroFir = async () => {
    const values = await form.validateFields();
    const payload = {
      crimeId: crimeId,
      reasonForForwarding: values?.reasonForForwarding,
      dateOfForwarding: values?.dateOfForwarding,
      transferDistrict: values?.transferDistrict,
      transferState: values?.transferState,
      transferTo: values?.transferTo,
      transferToName: selectedPSState?.label,
      transferDistrictCode: values?.transferDistrictCode,
    };
    dispatch(forwardFIR(config.transferOfCaseFile, payload));
  };

  const handleSearch = (text) => {
    setSerchText(text);
  };

  const displayFields = (name) => {
    switch (name) {
      case "dateOfTransfer":
        return (
          <DatePicker
            format={DATE_FORMAT}
            placeholder="Select Date"
            style={{ width: 250 }}
            disabledDate={disableFutureDates}
            disabled={false}
          />
        );
      case "transferState":
        return renderFieldsWithDropDown(
          stateNames(),
          onStateChange,
          handleSearch,
          serchText,
          250,
          false
        );
      case "transferDistrict":
        if (isTelangana) {
          return (
            <Select
              suffixIcon={<CaretDownOutlined className="dropDownIcon" />}
              showSearch
              allowClear
              showArrow
              onSearch={handleSearch}
              filterOption={(input, option) =>
                serchText &&
                option.props.value
                  .toString()
                  .toLowerCase()
                  .indexOf(input.toString().toLowerCase()) >= 0
              }
              style={{ width: 250 }}
              onSelect={(_item, district) => {
                handleDistrictCityChange(district);
              }}
            >
              {isArray(districtList) &&
                !isEmpty(districtList) &&
                districtList.map((item, index) => (
                  <Option key={index} value={item.label} label={item.value}>
                    {item.label}
                  </Option>
                ))}
            </Select>
          );
        } else {
          return (
            <Input
              style={{ width: 250 }}
              maxLength={textFieldRules.maxLength}
            />
          );
        }
      case "transferTo":
        if (isTelangana) {
          return (
            <Select
              suffixIcon={<CaretDownOutlined className="dropDownIcon" />}
              showSearch
              allowClear
              showArrow
              onSearch={handleSearch}
              filterOption={(input, option) =>
                serchText &&
                option.props.label
                  .toString()
                  .toLowerCase()
                  .indexOf(input.toString().toLowerCase()) >= 0
              }
              style={{ width: 250 }}
              onSelect={(_item, unit) => {
                setselectedPSState(unit);
              }}
            >
              {isArray(unitsFromDistrictState) &&
                !isEmpty(unitsFromDistrictState) &&
                unitsFromDistrictState.map((item, index) => (
                  <Option key={index} value={item.value} label={item.label}>
                    {item.label}
                  </Option>
                ))}
            </Select>
          );
        } else {
          return (
            <Input
              style={{ width: 250 }}
              maxLength={textFieldRules.maxLength}
            />
          );
        }
      case "reasonForForwarding":
        return <TextArea rows={4} columns={3} />;
      case "dateOfForwarding":
        return (
          <DatePicker
            format={DATE_FORMAT}
            placeholder="Select Date"
            style={{ width: 250 }}
            disabledDate={disableFutureDates}
          />
        );
      default:
        return (
          <Input style={{ width: 250 }} maxLength={textFieldRules.maxLength} />
        );
    }
  };

  const displayState = (data, actionName) => {
    return (
      <Row className="custody-reasons-row">
        {data.map((s, i) => {
          return (
            <Col
              span={s.name === "reasonForForwarding" ? 22 : 8}
              key={i}
              style={{ marginBottom: 20 }}
            >
              <Form.Item
                name={s.name}
                label={s.label}
                rules={[
                  { required: true, message: `Please enter ${s.label}!` },
                ]}
              >
                {actionName(s.name)}
              </Form.Item>
            </Col>
          );
        })}
      </Row>
    );
  };

  return (
    <ModuleWrapper>
      {isFetching ? (
        <Loader />
      ) : (
        <>
          <div
            style={{
              fontSize: 18,
              fontWeight: "bold",
              marginBottom: 20,
              marginTop: 50,
            }}
          >
            {isTransfered ? "Transfer FIR" : "Forward FIR"}
          </div>
          <Form form={form} layout="vertical">
            {isTransfered ? (
              <Row glutter={24} style={{ width: "100%", marginTop: 10 }}>
                {selectedFir?.uploadFirReport?.url ? (
                  <Col>{displayState(transferFIRForm, displayFields)}</Col>
                ) : (
                  <>
                    <Button
                      type="primary"
                      className="saveButton"
                      style={{ width: 180, marginRight: 5 }}
                      onClick={showConfirm}
                    >
                      Upload FIR
                    </Button>
                  </>
                )}
              </Row>
            ) : (
              <Row glutter={24} style={{ width: "100%", marginTop: 10 }}>
                <Col>{displayState(forwardFIRForm, displayFields)}</Col>
              </Row>
            )}
          </Form>
          <Row>
            <Col span={6}>
              {isTransfered ? (
                <>
                  {selectedFir?.uploadFirReport?.url ? (
                    <Button
                      type="primary"
                      style={{
                        backgroundColor: "#02599C",
                        borderColor: "#02599C",
                        color: "#FFF",
                      }}
                      onClick={isTransfered ? transferZeroFir : forwardZeroFir}
                    >
                      Transfer Zero FIR
                    </Button>
                  ) : (
                    ""
                  )}
                </>
              ) : (
                <Button
                  type="primary"
                  style={{
                    backgroundColor: "#02599C",
                    borderColor: "#02599C",
                    color: "#FFF",
                  }}
                  onClick={isTransfered ? transferZeroFir : forwardZeroFir}
                >
                  Forward Zero FIR
                </Button>
              )}
            </Col>
          </Row>
          <Modal
            header={null}
            visible={confirmModalVisible}
            onOk={hideModal}
            onCancel={hideModal}
            footer={[
              <span
                type="primary"
                onClick={hideModal}
                style={{ marginRight: 10 }}
                className="popupLink"
              >
                Cancel
              </span>,
              <Upload
                fileList={fileData}
                accept="application/msword, application/pdf, image/*"
                onChange={async (info) => {
                  await setFIRUploadFileListState(info.fileList);
                }}
                customRequest={(options) => handleUpload(options)}
                multiple={false}
                maxCount={1}
              >
                <Button
                  type="primary"
                  className="saveButton"
                  style={{ width: 180, marginRight: 5 }}
                >
                  Select File
                </Button>
              </Upload>,
            ]}
          >
            <Row gutter={24}>
              <Col span={2} style={{ fontSize: 25 }}>
                <ExclamationCircleOutlined style={{ color: "#FAB428" }} />
              </Col>
              <Col span={20} style={{ fontSize: 16 }}>
                Are you sure you want to upload FIR Report? This process can not
                be reverted.
              </Col>
            </Row>
          </Modal>
        </>
      )}
    </ModuleWrapper>
  );
}
