/* eslint-disable array-callback-return */
import { useState, useEffect } from "react";
import {
  Card,
  Form,
  DatePicker,
  Button,
  Table,
  Input,
  Upload,
  notification,
  Select,
} from "antd";
import { CaretDownOutlined } from "@ant-design/icons";
import {
  IS_SHO,
  IS_IO,
  DATE_FORMAT,
  renderFieldsWithDropDown,
  getAccuseds,
  dummyRequest,
  getMediaPayloadWithoutCategory,
  onFileChange,
  getMediaUploadError,
  IS_INVESTIGATION_OFFICER,
  getPersonDetails,
} from "@containers/FirDetails/fir-util";
import Loader from "@components/utility/loader";
import ContentHeader from "@containers/FirDetails/ContentHeader";
import suspectAccusedAction from "@redux/investigations/suspectAccused/actions";
import NoticeToSuretyAction from "@redux/CourtAndProsecution/NoticeToSurety/actions";
import { config } from "@config/site.config";
import { loadState } from "@lib/helpers/localStorage";
import { useDispatch, useSelector } from "react-redux";
import FormItem from "antd/lib/form/FormItem";
import axios from "axios";
import moment from "moment";
import { getFileById } from "@containers/media-util";
import { typeOfProperty } from "../const";
import { CourtAndProsecutionWrapper } from "../styles";
import { isEmpty, first, isUndefined } from "lodash";
import AddSuretyDetails from "../../Investigation/CommonForms/AddSuretyDetails";
import masterDataActions from "@redux/masterData/actions";
const Option = Select.Option;

export default function NoticeToSurety({
  setSelectedSiderMenu,
  isCourtCaseDiary = false,
  formDisable,
  onCancel,
  formData,
}) {
  const [form] = Form.useForm();
  const [suretyDetailsForm] = Form.useForm();
  const dispatch = useDispatch();
  const [isSuretyDetailsModalVisible, setIsSuretyDetailsModalVisible] =
    useState(false);
  const [selectedSuretyDetails, setSelectedSuretyDetails] = useState([]);
  const [selectedSuretyDetailsObj, setSelectedSuretyDetailsObj] = useState({});
  const [selectedSuretyDetailsId, setSelectedSuretyDetailsId] = useState("");
  const [isAddAnotherSuretyDetails, setIsAddAnotherSuretyDetails] =
    useState(false);
  const [viewEditObj, setviewEditObj] = useState("");
  const [viewEditObjIndex, setviewEditObjIndex] = useState(""); //for sureity details
  const [viewSuretyClicked, setviewSuretyClicked] = useState(false);
  const [editSuretyClicked, seteditSuretyClicked] = useState(false);
  const [age, setAge] = useState("");
  const [inputList, setInputList] = useState([]);
  const crimeId = loadState("selectedFirId");
  const selectedCourtAndProsecution = loadState("selectedCourtAndProsecution");
  const { savedFir } = useSelector((state) => state.createFIR);
  const [serchText, setSerchText] = useState("");
  const [suretyDisplay, setSuretyDisplay] = useState({});
  const currentUser = loadState("currentUser");
  const userRole = [IS_SHO, IS_IO, IS_INVESTIGATION_OFFICER];
  const IS_HIGHER_SHO_USER = !userRole?.includes(currentUser?.ecopsv2_role);

  const disableForm =
    (IS_HIGHER_SHO_USER &&
      currentUser?.isPersnolized === false &&
      currentUser?.isIo === false) ||
    savedFir?.caseStatus === "Disposal" ||
    formDisable ||
    selectedCourtAndProsecution.isCourtDisposal;
  const [formValid, setFormValid] = useState(false);
  const [propertyType, setPropertyType] = useState({});
  const [uploadProof, setUploadProof] = useState({});
  const { getNoticetosuretyList } = masterDataActions;
  const { getAccusedList } = suspectAccusedAction;
  const { updateNoticeToSurety, getNoticeToSuretyList, resetActionType } =
    NoticeToSuretyAction;
  const {
    noticeToSuretyList,
    isFetching,
    successMessage,
    errorMessage,
    actionType,
  } = useSelector((state) => state?.NoticeToSurety);
  const { suspectAccusedList } = useSelector((state) => state.SuspectAccused);
  const { noticetoSuretyList } = useSelector((state) => state.MasterData);
  const filterAccusedList = suspectAccusedList?.filter(
    (item) =>
      !item?.isDied && !item?.isArrestByPolice && item?.isIssueOfWarrants
  );
  const filterChargeSheetAccusedData = [];
  filterAccusedList.forEach((item) => {
    if (
      selectedCourtAndProsecution?.data?.accusedParticulars.some(
        (data) =>
          data?.accusedPersonId?._id === item?.person?._id &&
          data?.chargeStatus === "Charged"
      ) === true
    ) {
      filterChargeSheetAccusedData.push(item);
    }
  });

  const openNotificationWithIcon = (type, message) => {
    return notification[type]({
      message: message,
    });
  };

  const isSuccess =
    actionType === "ADD_NOTICE_TO_SURETY_SUCCESS" ||
    actionType === "UPDATE_NOTICE_TO_SURETY_SUCCESS";

  const isError =
    actionType === "ADD_NOTICE_TO_SURETY_ERROR" ||
    actionType === "UPDATE_NOTICE_TO_SURETY_ERROR";

  const fetchAccusedList = () => {
    dispatch(
      getAccusedList(
        `${config.getPostCrimeSceneDetails}/ACCUSED/?crimeId=${crimeId}`
      )
    );
    dispatch(
      getNoticeToSuretyList(
        `${config.NoticetoSurity}/getNoticeToSurety?crimeId=${crimeId}&chargesheetId=${selectedCourtAndProsecution?._id}&updateChargesheetId=${selectedCourtAndProsecution?.updateChargesheetId}`
      )
    );
    dispatch(
      getNoticetosuretyList(`${config.noticetosurety}?crimeId=${crimeId}`)
    );
  };

  useEffect(() => {
    fetchAccusedList();
  }, []);
  useEffect(() => {
    if (viewEditObj) {
      const {
        personalDetails,
        presentAddress,
        permanentAddress,
        dateCreated,
        _id,
        contactDetails,
        sameAsPresent,
      } = viewEditObj.person;
      const {
        name,
        surname,
        alias,
        gender,
        dateOfBirth,
        age,
        occupation,
        educationQualification,
        caste,
        subCaste,
        religion,
        nationality,
        fatherHusbandGuardianName,
        createdFrom,
        createdFor,
        relationType,
      } = !isUndefined(personalDetails) && personalDetails;
      const {
        houseNo,
        streetRoadNo,
        wardColony,
        landmarkMilestone,
        localityVillage,
        areaMandal,
        district,
        stateUt,
        residencyType,
        pinCode,
      } = !isUndefined(presentAddress) && presentAddress;
      suretyDetailsForm.setFieldsValue({
        lastupdateddatetime: moment(new Date(dateCreated)).isValid()
          ? moment(new Date(dateCreated))
          : "",
        id: _id,
        name: name,
        surname: surname,
        aliasName: alias,
        relationType: relationType,
        fatherHusbandGuardianName: fatherHusbandGuardianName,
        createdFrom: createdFrom,
        createdFor: createdFor,
        gender: gender,
        dateOfBirth: moment(new Date(dateOfBirth)).isValid()
          ? moment(new Date(dateOfBirth))
          : "",
        age: age,
        occupation: occupation,
        educationQualification: educationQualification,
        caste: caste,
        subCaste: subCaste,
        religion: religion,
        nationality: nationality,
        houseNo: houseNo,
        streetRoadNo: streetRoadNo,
        wardColony: wardColony,
        landmarkMilestone: landmarkMilestone,
        localityVillage: localityVillage,
        areaMandal: areaMandal,
        district: district,
        stateUt: stateUt,
        residencyType: residencyType,
        pinCode: pinCode,
        sameAsPresent: sameAsPresent,
        p_houseNo: permanentAddress?.houseNo,
        p_streetRoadNo: permanentAddress?.streetRoadNo,
        p_wardColony: permanentAddress?.wardColony,
        p_landmarkMilestone: permanentAddress?.landmarkMilestone,
        p_localityVillage: permanentAddress?.localityVillage,
        p_areaMandal: permanentAddress?.areaMandal,
        p_district: permanentAddress?.district,
        p_stateUt: permanentAddress?.stateUt,
        p_residencyType: permanentAddress?.residencyType,
        p_pinCode: permanentAddress?.pinCode,
        phoneNumber: contactDetails?.[0]?.phoneNumber,
        emailId: contactDetails?.[0]?.emailId,
        userDate: moment(new Date(viewEditObj.userDate)).isValid()
          ? moment(new Date(viewEditObj.userDate))
          : "",
      });
    }
  }, [viewEditObj]);

  const getAccusedDropdownData = () =>
    getAccuseds(filterChargeSheetAccusedData);
  const accusedLists = getAccusedDropdownData();
  const getSelectedRecord = (sureity) => {
    const selectedRecord = [];
    accusedLists.forEach((item) => {
      const SurityData = noticetoSuretyList.map((u) => {
        if (item?._id === u?.accusedId) {
          return u?.person?.personalDetails?.name;
        } else {
          return null;
        }
      });
      const suretyList = !!sureity[item?._id] ? sureity[item?._id] : [];
      if (!!formData === true && Object.keys(formData)?.length !== 0) {
        if (formData?.person === item?._id) {
          const filterSurityData = SurityData?.filter(
            (item) => !!item === true
          ).map((val) => {
            return {
              label: val,
              value: val,
              disabled: suretyList.some((value) => value === val),
            };
          });
          if (filterSurityData?.length !== 0) {
            var suretyId = filterSurityData;
          } else {
            suretyId = [];
          }
          if (suretyId?.length === 1) {
            form.setFieldsValue({ [`surety_${item?._id}`]: [suretyId[0].value] });
          }
          selectedRecord.push({
            person: { label: item?.label, _id: item?._id },
            surityData: suretyId,
          });
        }
      } else {
        const filterSurityData = SurityData?.filter(
          (item) => !!item === true
        ).map((val) => {
          return {
            label: val,
            value: val,
            disabled: suretyList.some((value) => value === val),
          };
        });
        if (filterSurityData?.length !== 0) {
          var suretyId = filterSurityData;
        } else {
          suretyId = [];
        }
        if (suretyId?.length === 1) {
          form.setFieldsValue({ [`surety_${item?._id}`]: [suretyId[0].value] });
        }
        selectedRecord.push({
          person: { label: item?.label, _id: item?._id },
          surityData: suretyId,
        });
      }
    });
    return selectedRecord;
  };

  useEffect(() => {
    if (isSuccess || isError) {
      if (!!successMessage) {
        if (!isSuretyDetailsModalVisible) {
          openNotificationWithIcon("success", successMessage);
          setSelectedSuretyDetailsObj({});
          setSelectedSuretyDetails({});
          setSelectedSuretyDetailsId("");
          setviewEditObjIndex("");
          setviewSuretyClicked(false);
          setviewEditObjIndex("");
          setviewEditObj({});
          setSuretyDisplay({});
          setIsAddAnotherSuretyDetails(false);
          setAge("");
          setInputList([]);
          fetchAccusedList();
          form.resetFields();
          isCourtCaseDiary
            ? onCancel()
            : setSelectedSiderMenu("courtandprosecution");
          dispatch(
            getAccusedList(
              `${config.getPostCrimeSceneDetails}/ACCUSED/?crimeId=${crimeId}`
            )
          );
          dispatch(resetActionType());
        } else if (!isAddAnotherSuretyDetails) {
          setIsSuretyDetailsModalVisible(false);
          dispatch(resetActionType());
          fetchAccusedList();
        } else if (isAddAnotherSuretyDetails && isSuretyDetailsModalVisible) {
          dispatch(resetActionType());
          setSuretyDisplay({});
          fetchAccusedList();
        }
      } else if (!!errorMessage) {
        openNotificationWithIcon("error", errorMessage);
        dispatch(resetActionType());
      }
    }
  }, [actionType]);

  useEffect(() => {
    let uplodProofAll = {};
    let propertyTypeAll = {};
    let surityData = {};
    const surityList = {};
    for (let i = 0; i < noticeToSuretyList?.length; i++) {
      const accusedId = noticeToSuretyList[i]?.accusedId;
      Object.assign(surityList, {
        [accusedId?._id]: !!noticeToSuretyList[i]?.surety
          ? noticeToSuretyList[i]?.surety
          : [],
      });
      form.setFieldsValue({
        [`serviceDate_${accusedId?._id}`]: !!noticeToSuretyList[i]
          ?.dateOfNoticeToSuretiesIssuedByCourt
          ? moment(
              new Date(
                noticeToSuretyList[i]?.dateOfNoticeToSuretiesIssuedByCourt
              )
            )
          : "",
        [`suretiesDate_${accusedId?._id}`]: !!noticeToSuretyList[i]
          ?.dateOfServiceOfSuretiesIssuedByCourt
          ? moment(
              new Date(
                noticeToSuretyList[i]?.dateOfServiceOfSuretiesIssuedByCourt
              )
            )
          : "",
        [`bondDate_${accusedId?._id}`]: !!noticeToSuretyList[i]?.dateOfBond
          ? moment(new Date(noticeToSuretyList[i]?.dateOfBond))
          : "",
        [`propertyType_${accusedId?._id}`]: noticeToSuretyList[i]?.propertyType,
        [`typeOfProperty_${noticeToSuretyList[i]?.accusedId?._id}`]:
          noticeToSuretyList[i]?.typeOfProperty,
        [`forfeitAmount_${accusedId?._id}`]:
          noticeToSuretyList[i]?.forfeitAmount,
        [`upload_${accusedId?._id}`]: noticeToSuretyList[i]?.suretyProof,
        [`surety_${accusedId?._id}`]: noticeToSuretyList[i]?.surety,
      });
      Object.assign(uplodProofAll, {
        [`upload_${noticeToSuretyList[i]?.accusedId?._id}`]:
          noticeToSuretyList[i]?.suretyProof,
      });
      if (noticeToSuretyList[i]?.propertyType) {
        Object.assign(propertyTypeAll, {
          [accusedId?._id]: noticeToSuretyList[i]?.propertyType,
        });
      }
      Object.assign(surityData, {
        [`suretyDetails_${accusedId?._id}`]:
          noticeToSuretyList[i]?.suretyDetails,
      });
    }
    setSelectedSuretyDetailsObj({ ...surityData });
    setPropertyType({ ...propertyTypeAll });
    setUploadProof({ ...uplodProofAll });
    setSuretyDisplay({ ...surityList });
  }, [noticeToSuretyList]);

  const handleSearch = (text) => {
    setSerchText(text);
  };

  const handleDownload = (file) => {
    getFileById(file?.fileId, file?.name, file?.url);
  };

  const checkFields = async () => {
    const values = await form.validateFields();
    setFormValid(!Object.values(values).every((v) => v == null || v === ""));
  };

  const uploadFunction = async (values, key, objKey) => {
    let payLoad = [];
    getSelectedRecord(suretyDisplay).forEach((item) => {
      payLoad.push({
        crimeId: crimeId,
        chargesheetId: selectedCourtAndProsecution?._id,
        updateChargesheetId: selectedCourtAndProsecution?.updateChargesheetId,
        accusedId: item?.person?._id,
        surety: !!values[`surety_${item?.person?._id}`]
          ? values[`surety_${item?.person?._id}`]
          : [],
        dateOfNoticeToSuretiesIssuedByCourt:
          values[`serviceDate_${item?.person?._id}`],
        dateOfServiceOfSuretiesIssuedByCourt:
          values[`suretiesDate_${item?.person?._id}`],
        dateOfBond: values[`bondDate_${item?.person?._id}`],
        propertyType: values[`propertyType_${item?.person?._id}`],
        typeOfProperty: values[`typeOfProperty_${item?.person?._id}`],
        forfeitAmount: values[`forfeitAmount_${item?.person?._id}`],
        suretyProof: !!values[`upload_${item?.person?._id}`]
          ? values[`upload_${item?.person?._id}`]
          : null,
        suretyDetails: !!values[`suretyDetails_${item?.person?._id}`]
          ? values[`suretyDetails_${item?.person?._id}`]
          : [],
      });
    });

    dispatch(
      updateNoticeToSurety(
        `${config.NoticetoSurity}/createUpdateNoticeToSurety?crimeId=${crimeId}`,
        payLoad
      )
    );
  };

  const submit = async (updatedResult) => {
    const values = await form.validateFields();
    let upload = {};
    Object.assign(
      values,
      !isUndefined(updatedResult)
        ? { ...updatedResult }
        : { ...selectedSuretyDetailsObj }
    );
    let uploadObj = Object.entries(values);
    for (let i = 0; i < uploadObj?.length; i++) {
      if (
        uploadObj[i][0].split("_").includes("upload") &&
        !!uploadObj[i][1] &&
        !!uploadObj[i][1]?.fileList &&
        uploadObj[i][1]?.fileList?.length !== 0
      ) {
        upload[uploadObj[i][0]] = uploadObj[i][1]?.fileList;
      }
    }
    if (Object.keys(upload)?.length === 0) {
      uploadFunction(values);
    } else {
      Object.keys(upload)?.forEach((item) => {
        const uploadCourtOrder = new FormData();
        upload[item]?.forEach((file) => {
          uploadCourtOrder.append("file", file.originFileObj);
        });
        uploadCourtOrder.append("prefixFolder", crimeId);
        uploadCourtOrder.append(
          "folderPath",
          `${crimeId}/${"courtCommittal"}/file`
        );
        axios
          .post(`${config.fileUpload}/upload`, uploadCourtOrder)
          .then((res) => {
            if (res.status === 200) {
              const { data } = res.data;
              Object.assign(values, {
                [item]: getMediaPayloadWithoutCategory(data),
              });
              Object.assign(upload, {
                [item]: getMediaPayloadWithoutCategory(data),
              });
              if (
                Object.values(upload).every(
                  (value) => !!value[0]?.fileId === true
                )
              ) {
                uploadFunction(values);
              }
            } else {
              getMediaUploadError(res?.message, openNotificationWithIcon);
            }
          })
          .catch((err) => {
            getMediaUploadError(err, openNotificationWithIcon);
          });
      });
    }
  };

  const handleAddedSuretyDetails = (item) => {
    setIsSuretyDetailsModalVisible(true);
    setSelectedSuretyDetailsId(item?.person?._id);
    const suretyDetails = Object.entries(selectedSuretyDetailsObj).find(
      (val) => val[0] === `suretyDetails_${item?.person?._id}`
    );
    setSelectedSuretyDetails(
      !isEmpty(suretyDetails[1]) && !isUndefined(suretyDetails[1])
        ? suretyDetails[1]
        : []
    );
  };

  const handleOkSurety = async () => {
    const values = await suretyDetailsForm.validateFields();
    if (values?.name || values?.surname) {
      const payload = [
        {
          person: getPersonDetails(values, inputList, []),
          suretyDocURL: {
            url: "",
            category: "",
            team: "",
            mimeType: "",
            fileId: "",
          },
        },
      ];
      let updatedResult = [];
      if (viewEditObjIndex) {
        let n1 = [...selectedSuretyDetails];
        let n2 = [...selectedSuretyDetails];
        const payloadData = first(payload);
        n2[viewEditObjIndex - 1] = payloadData;
        updatedResult = [...n2];
      } else {
        updatedResult = [...selectedSuretyDetails, ...payload];
      }
      if (isAddAnotherSuretyDetails) {
        suretyDetailsForm.resetFields();
        setSelectedSuretyDetails(updatedResult);
        setSelectedSuretyDetailsObj({
          ...selectedSuretyDetailsObj,
          [`suretyDetails_${selectedSuretyDetailsId}`]: updatedResult,
        });
        submit({
          ...selectedSuretyDetailsObj,
          [`suretyDetails_${selectedSuretyDetailsId}`]: updatedResult,
        });
      } else {
        if (isEmpty(selectedSuretyDetails)) {
          setSelectedSuretyDetails(payload);
          setSelectedSuretyDetailsObj({
            ...selectedSuretyDetailsObj,
            [`suretyDetails_${selectedSuretyDetailsId}`]: updatedResult,
          });
          submit({
            ...selectedSuretyDetailsObj,
            [`suretyDetails_${selectedSuretyDetailsId}`]: updatedResult,
          });
        } else {
          setSelectedSuretyDetails(updatedResult);
          setSelectedSuretyDetailsObj({
            ...selectedSuretyDetailsObj,
            [`suretyDetails_${selectedSuretyDetailsId}`]: updatedResult,
          });
          submit({
            ...selectedSuretyDetailsObj,
            [`suretyDetails_${selectedSuretyDetailsId}`]: updatedResult,
          });
        }
        setviewEditObj("");
        setviewEditObjIndex("");
        setSelectedSuretyDetailsId("");
      }
    }
    suretyDetailsForm.resetFields();
  };
  const handleCancelSurety = () => {
    setIsSuretyDetailsModalVisible(false);
    setIsAddAnotherSuretyDetails(false);
    setSelectedSuretyDetailsId("");
    setSelectedSuretyDetails([]);
    setviewEditObj("");
    setviewEditObjIndex("");
    suretyDetailsForm.resetFields();
  };

  const handleUpload = (data, i, _item) => {
    setUploadProof((prev) => ({
      ...prev,
      [`upload_${_item?.person?._id}`]: data,
    }));
  };

  const columns = [
    {
      title: "Accused Name",
      dataIndex: "accusedName",
      key: "accusedName",
      render: (_i, item) => {
        return item?.person?.label;
      },
    },
    {
      title: "Surety Name",
      dataIndex: "suretyName",
      key: "suretyName",
      render: (_i, item) => {
        return (
          <FormItem name={`surety_${item?.person?._id}`}>
            <Select
              suffixIcon={<CaretDownOutlined className="dropDownIcon" />}
              showSearch
              onSearch={handleSearch}
              mode="multiple"
              filterOption={(input, option) =>
                serchText &&
                option.props.label.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
              }
              disabled={
                disableForm ||
                item?.surityData?.length === 0 ||
                item?.surityData?.length === 1
                // ||
                // suretyDisplay[`surety_${item?.person?._id}`]
              }
              style={{ width: 150 }}
              placeholder="Select Surety"
              options={item?.surityData}
            />
          </FormItem>
        );
      },
    },
    {
      title: "Date of Notice to Sureties issued by Court ",
      dataIndex: "suretiesDate",
      key: "suretiesDate",
      render: (_, item, _i) => {
        return (
          <FormItem name={`suretiesDate_${item?.person?._id}`}>
            <DatePicker
              format={DATE_FORMAT}
              placeholder="Date"
              onChange={checkFields}
              style={{ width: 120 }}
              disabled={disableForm}
            />
          </FormItem>
        );
      },
    },
    {
      title: "Date of Service of Sureties",
      dataIndex: "serviceDate",
      key: "serviceDate",
      render: (_, item, _i) => {
        return (
          <FormItem name={`serviceDate_${item?.person?._id}`}>
            <DatePicker
              format={DATE_FORMAT}
              placeholder="Date"
              onChange={checkFields}
              style={{ width: 120 }}
              disabled={disableForm}
            />
          </FormItem>
        );
      },
    },
    {
      title: "Date of Bond",
      dataIndex: "bondDate",
      key: "bondDate",
      render: (_, item, _i) => {
        return (
          <FormItem name={`bondDate_${item?.person?._id}`}>
            <DatePicker
              format={DATE_FORMAT}
              placeholder="Date"
              onChange={checkFields}
              style={{ width: 120 }}
              disabled={disableForm}
            />
          </FormItem>
        );
      },
    },
    {
      title: "Property Type ",
      dataIndex: "propertyType ",
      key: "propertyType",
      render: (_, item, _i) => {
        return (
          <FormItem name={`propertyType_${item?.person?._id}`}>
            {renderFieldsWithDropDown(
              typeOfProperty,
              (value) => {
                setPropertyType({
                  ...propertyType,
                  [item?.person?._id]: value,
                });
              },
              handleSearch,
              serchText,
              120,
              disableForm,
              "",
              "Property Type"
            )}
          </FormItem>
        );
      },
    },
    {
      title: "Forfeit Amount / Type Of Property",
      dataIndex: "forfeitAmount",
      key: "forfeitAmount",
      render: (_, item, _i) => {
        if (propertyType[item?.person?._id] === "Property") {
          return (
            <FormItem name={`typeOfProperty_${item?.person?._id}`}>
              {renderFieldsWithDropDown(
                [
                  { label: "Immovable" },
                  { label: "Livestock(perishable)" },
                  { label: "Movable" },
                ],
                null,
                handleSearch,
                serchText,
                120,
                disableForm,
                "",
                "Type Of Property"
              )}
            </FormItem>
          );
        } else {
          return (
            <FormItem name={`forfeitAmount_${item?.person?._id}`}>
              <Input
                onChange={checkFields}
                disabled={disableForm}
                style={{ width: 120 }}
                placeholder="Forfeit Amount"
              />
            </FormItem>
          );
        }
      },
    },
    {
      title: "Surety Proof",
      dataIndex: "upload",
      key: "upload",
      render: (i, item) => {
        return (
          <>
            <Form.Item name={`upload_${item?.person?._id}`} label="">
              <Upload
                fileList={uploadProof[`upload_${item?.person?._id}`]}
                customRequest={dummyRequest}
                multiple={false}
                onChange={(info) =>
                  onFileChange(info, (data) => handleUpload(data, i, item))
                }
                onPreview={handleDownload}
              >
                <Button
                  className="saveButton"
                  style={{ width: 80, marginLeft: 10 }}
                  disabled={disableForm}
                >
                  Upload
                </Button>
              </Upload>
            </Form.Item>
          </>
        );
      },
    },
    {
      title: "Add Sureties",
      render: (_, item, _i) => {
        console.log("selectedSuretyDetailsObj1", selectedSuretyDetailsObj);
        return !isEmpty(
          selectedSuretyDetailsObj[`suretyDetails_${item?.person?._id}`]
        ) ? (
          <div
            className="popupLink"
            onClick={() => handleAddedSuretyDetails(item)}
          >
            {`${
              selectedSuretyDetailsObj[`suretyDetails_${item?.person?._id}`]
                .length
            } Suretie(s) Added`}
          </div>
        ) : (
          <div
            className="popupLink"
            onClick={() => handleAddedSuretyDetails(item)}
          >
            Add Sureties Details
          </div>
        );
      },
    },
  ];
  return (
    <CourtAndProsecutionWrapper>
      <ContentHeader
        headerTitle="Notice To Surety"
        onSubmitClick={() => submit()}
        isInvestigation={true}
        onCancel={() =>
          isCourtCaseDiary
            ? onCancel()
            : setSelectedSiderMenu("courtandprosecution")
        }
        disableButton={disableForm}
      />
      {isFetching ? (
        <Loader />
      ) : (
        <div className="noticeToSuerty">
          <Card>
            <Form form={form} colon={false} layout="vertical">
              <Table
                columns={columns}
                dataSource={getSelectedRecord(suretyDisplay)}
                scroll={
                  !isEmpty(formData)
                    ? {
                        x: 1300,
                      }
                    : null
                }
              ></Table>
            </Form>
          </Card>
        </div>
      )}

      {isSuretyDetailsModalVisible ? (
        <AddSuretyDetails
          title="Surety Details"
          isModalVisible={isSuretyDetailsModalVisible}
          handleOk={handleOkSurety}
          handleCancel={handleCancelSurety}
          formName={suretyDetailsForm}
          checkFields={checkFields}
          disabled={viewSuretyClicked}
          setInputList={setInputList}
          suretyList={selectedSuretyDetails}
          viewSuretyClicked={viewSuretyClicked}
          editSuretyClicked={editSuretyClicked}
          setviewEditObj={setviewEditObj}
          setviewEditObjIndex={setviewEditObjIndex}
          setviewSuretyClicked={setviewSuretyClicked}
          seteditSuretyClicked={seteditSuretyClicked}
          editObj={null}
          age={age}
          setAge={setAge}
          setIsAddAnotherSuretyDetails={setIsAddAnotherSuretyDetails}
        />
      ) : null}
    </CourtAndProsecutionWrapper>
  );
}
