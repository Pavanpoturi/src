import {
  Form,
  Row,
  Col,
  DatePicker,
  Input,
  Radio,
  Space,
  notification,
} from "antd";
import { TemplateConfessionReport } from "@containers/GenerateTemplates";
import {
  showPSName,
  getIONameAndRank,
  renderFieldsWithDropDown,
  DATE_FORMAT,
  getMediaUploadError,
  getAccusedStatus,
  displayStatusDetailsAccused,
  getCCLStatus,
} from "@containers/FirDetails/fir-util";
import TextArea from "antd/lib/input/TextArea";
import { textAreaRules } from "@components/Common/formOptions";
import { isEmpty, first, isUndefined, isNull } from "lodash";
import { confirmationList } from "../const";
import AccusedDisposalForm from "../AccusedDisposalForm";
import IssueOfWarrants from "../IssueOfWarrants";
import IssueOfSummons from "../IssueOfSummons";
import Proclamation from "../ProclamationAttachments";
import NoticeToSurety from "../NoticeToSurety";
import { config } from "@config/site.config";
import axios from "axios";
import { disablePastDatesFrom } from "@components/Common/helperMethods.js";

export const courtCaseDiaryForm = [
  {
    label: "Appearance of Accused",
    data: [
      { name: "accused", label: "Select Accused", type: "dropdown" },
      { name: "accusedPresence", label: "Accused Presence", type: "dropdown" },
      {
        name: "petition",
        label: "Petition filed by Defense Council",
        type: "dropdown",
      },
      {
        name: "guilty",
        label: "Accused Pleaded Guilty?",
        type: "dropdown",
      },
      {
        name: "documentsfurnished",
        label: "Whether case documents furnished to the accused?",
        type: "dropdown",
      },
    ],
    tableData: [
      "SNo",
      "Accused Code",
      "Accused Name",
      "Accused Status",
      "Accused Presence",
      "Petition filed by Defense Council",
      "Accused Pleaded Guilty?",
      "Whether case documents furnished to the accused?",
      "Actions",
    ],
  },
  {
    label: "Framing of Charges",
    data: [
      { name: "accused", label: "Select Accused", type: "dropdown" },
      { name: "accusedPresence", label: "Accused Presence", type: "dropdown" },
      {
        name: "petition",
        label: "Petition filed by Defense Council",
        type: "dropdown",
      },
      {
        name: "examinationStatus",
        label: "Examination Status",
        type: "dropdown",
      },
      {
        name: "guilty",
        label: "Pleaded Guilty",
        type: "dropdown",
      },
    ],
    tableData: [
      "SNo",
      "Accused Code",
      "Accused Name",
      "Accused Status",
      "Accused Presence",
      "Petition filed by Defense Council",
      "Examination Status",
      "Pleaded Guilty",
      "Actions",
    ],
  },
  {
    label: "Witness Examination",
    data: [
      { name: "accused", label: "Select Accused", type: "dropdown" },
      { name: "accusedPresence", label: "Accused Presence", type: "dropdown" },
      {
        name: "petition",
        label: "Petition filed by Defense Council",
        type: "dropdown",
      },
      {
        name: "accusedExaminationStatus",
        label: "Examination Status",
        type: "dropdown",
      },
      {
        name: "guilty",
        label: "Pleaded Guilty",
        type: "dropdown",
      },
    ],
    tableData: [
      "Accused Code",
      "Accused Name",
      "Accused Status",
      "Accused Presence",
      "Accused Pleaded Guilty?",
      "Petition filed by Defence Council",
      "Actions",
    ],
    data1: [
      { name: "witnessName", label: "Select Witness", type: "dropdown" },
      { name: "witnessPresence", label: "Witness Presence", type: "dropdown" },
      {
        name: "witnessExaminationStatus",
        label: "Examination Status",
        type: "dropdown",
      },
      {
        name: "crossExaminationStatus",
        label: "Cross Examination Status",
        type: "dropdown",
      },
      {
        name: "supportedTheProsecuction",
        label: "Supported the Prosecuction",
        type: "dropdown",
      },
    ],
    tableData1: [
      "Witness Code",
      "Witness Name",
      "Witness Type",
      "Witness Presence",
      "Examination Status",
      "Cross Examination Status",
      "Supported the Prosecution",
      "Upload Witness Statement",
      "Actions",
    ],
  },
  {
    label: "IO Examination",
    data: [
      { name: "accused", label: "Select Accused", type: "dropdown" },
      { name: "accusedPresence", label: "Accused Presence", type: "dropdown" },
      {
        name: "petition",
        label: "Petition filed by Defense Council",
        type: "dropdown",
      },
    ],
    tableData: [
      "Accused Code",
      "Accused Name",
      "Accused Status",
      "Accused Presence",
      "Petition filed by Defense Council",
      "Actions",
    ],
    data1: [
      { name: "ioName", label: "Select IO", type: "dropdown" },
      { name: "ioPresence", label: "IO Presence", type: "dropdown" },
      {
        name: "ioExaminationStatus",
        label: "Examination Status",
        type: "dropdown",
      },
      {
        name: "ioCrossExaminationStatus",
        label: "Cross Examination Status",
        type: "dropdown",
      },
    ],
    tableData1: [
      "IO Name",
      "IO Rank",
      "IO Presence",
      "Examination Status",
      "Cross Examination Status",
      "Actions",
    ],
  },
  {
    label: "313 Cr.P.C Examination of Accused",
    data: [
      { name: "accused", label: "Select Accused", type: "dropdown" },
      { name: "accusedPresence", label: "Accused Presence", type: "dropdown" },
      {
        name: "petition",
        label: "Petition filed by Defense Council",
        type: "dropdown",
      },
      {
        name: "examinationStatus",
        label: "Examination Status",
        type: "dropdown",
      },
      {
        name: "guilty",
        label: "Pleaded Guilty",
        type: "dropdown",
      },
    ],
    tableData: [
      "SNo",
      "Accused Code",
      "Accused Name",
      "Accused Status",
      "Accused Presence",
      "Petition filed by Defense Council",
      "Examination Status",
      "Pleaded Guilty",
      "Actions",
    ],
  },
  {
    label: "Defense Witness Examination",
    data: [
      { name: "accused", label: "Select Accused", type: "dropdown" },
      { name: "accusedPresence", label: "Accused Presence", type: "dropdown" },
      {
        name: "petition",
        label: "Petition filed by Defense Council",
        type: "dropdown",
      },
    ],
    tableData: [
      "SNo",
      "Accused Code",
      "Accused Name",
      "Accused Status",
      "Accused Presence",
      "Petition filed by Defense Council",
      "Actions",
    ],
    data1: [
      { name: "witnessName", label: "Defence Witness Name", type: "text" },
      { name: "fatherName", label: "Father Name", type: "text" },
      {
        name: "gender",
        label: "Gender",
        type: "dropdown",
      },
      {
        name: "age",
        label: "Age",
        type: "text",
      },
      {
        name: "occupation",
        label: "Occupation",
        type: "dropdown",
      },
      {
        name: "address",
        label: "Address",
        type: "text",
      },
      {
        name: "examinationStatus",
        label: "PP Examination Status",
        type: "dropdown",
      },
      {
        name: "councilExaminationStatus",
        label: "Defense Council Examination Status",
        type: "dropdown",
      },
    ],
    tableData1: [
      "Witness Name",
      "Father Name",
      "Gender",
      "Age",
      "Occupation",
      "Address",
      "PP Examination Status",
      "Defense Council Examination Status",
      "Upload Witness Statement",
      "Actions",
    ],
  },
  {
    label: "Arguments",
    data: [
      { name: "accused", label: "Select Accused", type: "dropdown" },
      { name: "accusedPresence", label: "Accused Presence", type: "dropdown" },
      {
        name: "petition",
        label: "Petition filed by Defense Council",
        type: "dropdown",
      },
    ],
    tableData: [
      "SNo",
      "Accused Code",
      "Accused Name",
      "Accused Status",
      "Accused Presence",
      "Petition filed by Defense Council",
      "Judgement",
      "Actions",
    ],
  },
  {
    label: "Judgement",
    data: [
      { name: "accused", label: "Select Accused", type: "dropdown" },
      { name: "accusedPresence", label: "Accused Presence", type: "dropdown" },
      {
        name: "petition",
        label: "Petition filed by Defense Council",
        type: "dropdown",
      },
    ],
    tableData: [
      "SNo",
      "Accused Code",
      "Accused Name",
      "Accused Status",
      "Accused Presence",
      "Petition filed by Defense Council",
      "Judgement",
      "Actions",
    ],
  },
];

export const AppearanceOfAccusedList = [
  { label: "Appearance of Accused" },
  { label: "Framing of Charges" },
  { label: "Witness Examination" },
  { label: "IO Examination" },
  { label: "313 Cr.P.C Examination of Accused" },
  { label: "Defense Witness Examination" },
  { label: "Arguments" },
  { label: "Judgement" },
];

export const framingChargesList = [
  { label: "Witness Examination" },
  { label: "IO Examination" },
  { label: "313 Cr.P.C Examination of Accused" },
  { label: "Defense Witness Examination" },
  { label: "Arguments" },
  { label: "Judgement" },
];

export const reasonsPendingList = [
  { label: "Accused not present " },
  { label: "Defense advocate requested for adjournment " },
  { label: "Due to court stay orders" },
  { label: "For arguments" },
  { label: "For examination of accused  under section 239 cr.p.c" },
  { label: "For examination of accused under section 313 cr.p.c" },
  { label: "For further trial" },
  { label: "For issue of notice to surety" },
  { label: "For judgement" },
  { label: "For proceedings under section 82,83 cr.p.c" },
  { label: "For supply of chargesheet copies" },
  { label: "For want of accused" },
  { label: "Magistrate on other duty" },
  { label: "Non attendance of IO" },
  { label: "Non attendance of witness" },
  { label: "PPO/APPO is on leave/ other duty" },
  { label: "Summons not served/to issue fresh summons to accused" },
  { label: "Warrant not executed" },
  { label: "Any other reason" },
];
export const getHTMLFromTemplate = (filename, data) => {
  switch (filename) {
    case "Confession_report":
      return <TemplateConfessionReport fileName={filename} data={data} />;
    default:
      return "";
  }
};

export const getDataForDocument = (
  formData,
  fileName,
  selectedFir,
  currentUser
) => {
  const { firNum, section, district, psName, briefFacts } = selectedFir;
  const commonReportData = {
    policeStation: showPSName(psName),
    district: district,
    firNumber: firNum,
    sectionOfLaw: section,
    IOName: getIONameAndRank(briefFacts),
  };
  let reportData = {};
  switch (fileName) {
    case "Confession_report":
      reportData = { ...commonReportData };
      break;
    default:
  }
  return reportData;
};

export const displayDiedAccusedDisposalFrom = (
  item,
  index,
  setOpenDrawer,
  setDrawerFormName,
  setDrawerFormItem,
  setdisble,
  caseDiaryData,
  disableForm,
  removeDetails
) => {
  return (
    <Space key={index}>
      <span
        // style={{ marginLeft: "20px" }}
        key={index}
        className="updateRecord"
        onClick={() => {
          setOpenDrawer(true);
          setDrawerFormName("accusedDisposalForm");
          setDrawerFormItem({});
          setDrawerFormItem(item);
          setdisble(false || caseDiaryData);
        }}
      >
        Accused Disposal Form
      </span>
      {!disableForm && (
        <span
          className="updateRecord"
          style={{ marginLeft: 10 }}
          onClick={() => {
            removeDetails(item);
          }}
        >
          Remove
        </span>
      )}
    </Space>
  );
};

export const displayCourtCaseActions = (
  item,
  index,
  disabled,
  removeDetails,
  setOpenDrawer,
  setDrawerFormName,
  setDrawerFormItem,
  setdisble,
  caseDiaryData,
  suspectAccusedList
) => {
  if (item?.accusedPresence === "Present" || item?.accusedStatus === "Died") {
    return (
      <Space key={index}>
        <span
          key={index}
          className="updateRecord"
          onClick={() => {
            setOpenDrawer(true);
            setDrawerFormName("accusedDisposalForm");
            setDrawerFormItem({});
            setDrawerFormItem(item);
            setdisble(false || caseDiaryData);
          }}
        >
          Accused Disposal Form
        </span>
        {!disabled && (
          <span
            className="updateRecord"
            style={{ marginLeft: 10 }}
            onClick={() => {
              removeDetails(item);
            }}
          >
            Remove
          </span>
        )}
      </Space>
    );
  } else if (
    (item?.isDefenseCounselPetitionFiled === "No" ||
      item?.petitionFiledByDefenceCouncil === "No" ||
      item?.petitionFiledByDefenseCouncil === "No") &&
    !item?.isArrestByPolice
  ) {
    return (
      <Space>
        <span
          key={index}
          className="updateRecord"
          onClick={() => {
            setOpenDrawer(true);
            setDrawerFormName("Issue of Warrants");
            setDrawerFormItem({});
            setDrawerFormItem(item);
            setdisble(false || caseDiaryData);
          }}
        >
          Issue Of Warrants
        </span>
        {(item?.isNoticeToSurety && !item?.isArrestByPolice) ||
        (!caseDiaryData && item?.isIssueOfWarrants) ? (
          <span
            key={index}
            className="updateRecord"
            onClick={() => {
              setOpenDrawer(true);
              setDrawerFormName("Notice to Surety");
              setDrawerFormItem({});
              setDrawerFormItem(item);
              setdisble(false || caseDiaryData);
            }}
          >
            Notice To Surety
          </span>
        ) : null}
        {(item?.isProclamation && !item?.isArrestByPolice) ||
        (!caseDiaryData && item?.isNoticeToSurety) ? (
          <span
            key={index}
            className="updateRecord"
            onClick={() => {
              setOpenDrawer(true);
              setDrawerFormName("Proclamation");
              setDrawerFormItem({});
              setDrawerFormItem(item);
              setdisble(false || caseDiaryData);
            }}
          >
            Proclamation
          </span>
        ) : null}
        {!disabled && (
          <span
            className="updateRecord"
            style={{ marginLeft: 10 }}
            onClick={() => {
              removeDetails(item);
            }}
          >
            Remove
          </span>
        )}
      </Space>
    );
  }
  return (
    <Space key={index}>
      {!disabled && (
        <span
          className="updateRecord"
          style={{ marginLeft: 10 }}
          onClick={() => {
            removeDetails(item);
          }}
        >
          Remove
        </span>
      )}
    </Space>
  );
};

export const displayFormFields = (
  data,
  actionName,
  trialFor,
  accusedPresence,
  isAccusedDied
) => {
  const filterData = data.find((item) => item?.label === trialFor);
  return (
    !isUndefined(filterData) &&
    filterData.data?.map((s, _i) => {
      if (s.name !== "accused" && isAccusedDied) {
        return null;
      }
      return s.name !== "petition" ? (
        <Form.Item name={s.name} label={s.label}>
          {actionName(s.name)}
        </Form.Item>
      ) : accusedPresence === "Not Present" ? (
        <Form.Item name={s.name} label={s.label}>
          {actionName(s.name)}
        </Form.Item>
      ) : null;
    })
  );
};

export const displayFormsInDrawer = (
  drawerFormName,
  setOpenDrawer,
  formDisable,
  data,
  getAccusedDetails
) => {
  // eslint-disable-next-line default-case
  switch (drawerFormName) {
    case "issuedOfSummons":
      return (
        <IssueOfSummons
          onCancel={() => setOpenDrawer(false)}
          isCourtCaseDiary={true}
          formDisable={formDisable}
          formData={Object.keys(!!data ? data : {}).length !== 0 ? data : ""}
          // setSelectedSiderMenu={setSelectedSiderMenu}
        />
      );
    case "Issue of Warrants":
      return (
        <IssueOfWarrants
          onCancel={() => setOpenDrawer(false)}
          isCourtCaseDiary={true}
          formDisable={formDisable}
          formData={data}
          // setSelectedSiderMenu={setSelectedSiderMenu}
        />
      );
    case "Proclamation":
      return (
        <Proclamation
          onCancel={() => setOpenDrawer(false)}
          isCourtCaseDiary={true}
          formDisable={formDisable}
          formData={data}
          // setSelectedSiderMenu={setSelectedSiderMenu}
        />
      );
    case "Notice to Surety":
      return (
        <NoticeToSurety
          onCancel={() => setOpenDrawer(false)}
          isCourtCaseDiary={true}
          formDisable={formDisable}
          formData={data}
          // setSelectedSiderMenu={setSelectedSiderMenu}
        />
      );
    case "accusedDisposalForm":
      return (
        <AccusedDisposalForm
          onCancel={() => setOpenDrawer(false)}
          isCourtCaseDiary={true}
          formDisable={formDisable}
          formData={data}
          getAccusedDetails={getAccusedDetails}
          // setSelectedSiderMenu={setSelectedSiderMenu}
        />
      );
  }
};

export const displayTextAreaForCourtCaseDiary = (
  title,
  formName,
  disabled,
  checkFields
) => {
  return (
    <Row gutter={24} style={{ marginTop: 15 }}>
      <Col span={4}>
        <p style={{ fontSize: 16 }}>{title}</p>
      </Col>
      <Col span={20}>
        <Form.Item name={formName} rules={[textAreaRules.textAreaMaxLength]}>
          <TextArea
            style={{ height: 100 }}
            maxLength={textAreaRules.maxLength}
            disabled={disabled}
            onChange={checkFields}
          />
        </Form.Item>
      </Col>
    </Row>
  );
};

export const displayDateOfTrial = (
  formName,
  title,
  disabled,
  width,
  checkFields,
  setTrialDate = null
) => {
  const onChange = (value) => {
    checkFields();
    if (!isNull(setTrialDate)) {
      setTrialDate(value);
    }
  };
  return (
    <Row gutter={24}>
      <Col>
        <Form.Item
          name={formName}
          label={title}
          rules={[
            {
              required: true,
              message: "Please Select Date of Trial",
            },
          ]}
        >
          <DatePicker
            format={DATE_FORMAT}
            disabled={disabled}
            style={{ width: width }}
            onChange={onChange}
          />
        </Form.Item>
      </Col>
    </Row>
  );
};

export const displayIsCasePostedForNextStage = (
  title,
  disabled,
  onChange,
  isCasePostedForNext,
  handleSearch,
  serchText,
  checkFields,
  pendingFor,
  setPendingFor,
  postedFor,
  setPostedFor,
  handelIssueOfSummons,
  trialFor
) => {
  const caseIsNotBlank = isCasePostedForNext !== "";
  const caseIsPosted = isCasePostedForNext === "Yes";
  const caseIsNotPosted = isCasePostedForNext === "No";
  const message =
    trialFor === "Judgement"
      ? "Please select if this Last CCD!!"
      : "Please Select Case Posted For Next Stage";
  return (
    <Row gutter={24} style={{ marginTop: 15 }}>
      <Col span={4} className="requiredField">
        <p style={{ fontSize: 16 }}>{title}</p>
      </Col>
      <Col span={4}>
        <Form.Item
          name="isCasePostedForNext"
          rules={[
            {
              required: true,
              message: message,
            },
          ]}
        >
          <Radio.Group
            buttonStyle="solid"
            disabled={disabled}
            onChange={(e) => onChange(e.target.value)}
          >
            {confirmationList &&
              confirmationList.map((item, i) => {
                return (
                  <Radio value={item?.label} key={i}>
                    {item?.label}
                  </Radio>
                );
              })}
          </Radio.Group>
        </Form.Item>
      </Col>
      {caseIsNotBlank && caseIsPosted && !!trialFor === false ? (
        <Col span={4}>
          <Form.Item
            name="postedFor"
            rules={[{ required: true, message: "Please Enter Posted For" }]}
          >
            {renderFieldsWithDropDown(
              AppearanceOfAccusedList,
              setPostedFor,
              handleSearch,
              serchText,
              250,
              disabled,
              "",
              "Posted For"
            )}
          </Form.Item>
          {["Witness Examination", "IO Examination"].includes(postedFor) && (
            <span className="popupLink" onClick={handelIssueOfSummons}>
              Issued of Summons
            </span>
          )}
        </Col>
      ) : null}
      {caseIsNotBlank && caseIsNotPosted ? (
        <Col span={4}>
          <Form.Item name="reasonForPending">
            {renderFieldsWithDropDown(
              reasonsPendingList,
              setPendingFor,
              handleSearch,
              serchText,
              250,
              disabled,
              "",
              "Reasons for Pending"
            )}
          </Form.Item>
        </Col>
      ) : null}
      {pendingFor === "Any other reason" ? (
        <Col span={4}>
          <Form.Item name="reasonForOther">
            <Input
              onChange={checkFields}
              style={{ width: 220, marginLeft: 65 }}
              disabled={disabled}
              placeholder="Reasons for Other"
            />
          </Form.Item>
        </Col>
      ) : null}
    </Row>
  );
};

export const displayNextHearingDate = (
  title,
  disabled,
  checkFields,
  date,
  isCasePostedForNext
) => {
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Row gutter={24} style={{ marginTop: 30 }}>
        <Col span={4}>
          <p style={{ fontSize: 16 }}>
            {title}
            {isCasePostedForNext === "Yes" ? (
              <span style={{ color: "red" }}>*</span>
            ) : null}
          </p>
        </Col>
        <Col span={5}>
          <Form.Item
            name="nextHearingDate"
            rules={[
              {
                required: isCasePostedForNext === "Yes" ? true : false,
              },
            ]}
          >
            <DatePicker
              format={DATE_FORMAT}
              disabled={disabled}
              style={{ width: 200 }}
              onChange={checkFields}
              disabledDate={(current) => disablePastDatesFrom(current, date)}
            />
          </Form.Item>
        </Col>
      </Row>
    </Space>
  );
};

export const displayIsCaseDisposed = (
  title,
  disabled,
  onChange,
  isCaseDisposed,
  checkFields
) => {
  return (
    <Row gutter={24} style={{ marginTop: 20 }}>
      <Col span={4}>
        <p style={{ fontSize: 16 }}>{title}</p>
      </Col>
      <Col span={4}>
        <Form.Item name="isCaseDisposed">
          <Radio.Group
            buttonStyle="solid"
            disabled={disabled}
            onChange={(e) => onChange(e.target.value)}
          >
            {confirmationList &&
              confirmationList.map((item, i) => {
                return (
                  <Radio value={item?.label} key={i}>
                    {item?.label}
                  </Radio>
                );
              })}
          </Radio.Group>
        </Form.Item>
      </Col>
    </Row>
  );
};

export const getIODetails = (code, ioList) => {
  const iODetatils = ioList?.find((io) => io?.paoCode === code);
  const details = {
    ioCode: iODetatils?.paoCode,
    ioName: iODetatils?.employeeName,
    ioRank: iODetatils?.rankName,
    ioRole: iODetatils?.empRoleName,
    ioUnitId: iODetatils?.cctns_unit_id,
    ioMobileNo: iODetatils?.mobileNo,
    ioEmail: "",
  };
  return details;
};

export const uploadFiles = async (
  files,
  prefixFolder,
  folderPath,
  setError
) => {
  const uploadedFiles = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const mediaFormData = new FormData();
    mediaFormData.append("file", file?.originFileObj);
    mediaFormData.append("prefixFolder", prefixFolder);
    mediaFormData.append("folderPath", folderPath);
    await axios
      .post(`${config.fileUpload}/upload`, mediaFormData)
      .then((response) => {
        if (response.data.success) {
          const { data } = response?.data;
          const payloadData = first(data);
          const payload = {
            mimeType: payloadData.mimeType,
            name: payloadData.name,
            url: payloadData.url,
            fileId: payloadData.id,
          };
          uploadedFiles.push(payload);
        }
      })
      .catch((err) => {
        getMediaUploadError(err, (type, message) => {
          notification[type]({
            message: message,
          });
        });
        setError(true);
      });
  }
  return uploadedFiles;
};

export const getStatus = (item, arrestList, juvenileApprehensionList) => {
  let accId = "";
  if (!isUndefined(item?.person) && item?.person?._id) {
    accId = item?.person?._id;
  } else {
    accId = item?._id;
  }
  // const accId = item?._id;
  const accusedCode = !isUndefined(item?.accusedCode) && item?.accusedCode;
  const filteredArrestList =
    !isEmpty(arrestList) &&
    first(arrestList.filter((s) => s?.accusedId?._id === accId));

  const result = !filteredArrestList ? item : filteredArrestList;
  const filteredjuvenileApprehensionList =
    !isEmpty(juvenileApprehensionList) &&
    first(juvenileApprehensionList.filter((s) => s?.accusedId?._id === accId));
  const result1 = !filteredjuvenileApprehensionList
    ? item
    : filteredjuvenileApprehensionList;

  const dispayStatus =
    item?.isSuspectOrAccused === "CCL"
      ? getCCLStatus(result1)
      : getAccusedStatus(result);

  return displayStatusDetailsAccused(
    dispayStatus,
    !isUndefined(item?.personalDetails?.isDied)
      ? item?.personalDetails?.isDied
      : item?.person?.personalDetails?.isDied,
    accusedCode
  );
};

export const filterAccusedForCCD = (
  suspectAccusedList = [],
  accusedParticulars = [],
  previousRecords = []
) => {
  return suspectAccusedList?.filter(
    (accused) =>
      !accused?.isDied &&
      // !accused?.isArrestByPolice &&
      !previousRecords?.some((data) => data?.person === accused?.person?._id) &&
      accusedParticulars.some(
        (data) =>
          data?.accusedPersonId?._id === accused?.person?._id &&
          data?.chargeStatus === "Charged"
      )
  );
};
