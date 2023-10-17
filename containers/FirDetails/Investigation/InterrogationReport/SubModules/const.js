import { Space, Typography } from "antd";
import { isEmpty, isString } from "lodash";
import { joinStrings, getAddressString, getPersonString } from "./util";
import TypeOfDrugs from "./TypeOfDrugs";
import ConsumerDetails from "./ConsumerDetails";
import FinancialHistory from "./FinancialHistory";
import SIMDetails from "./SIMDetails";
import TimeSinceAndModusOperandi from "./TimeSinceAndModusOperandi";
import DOPAMS from "./DOPAMS";

export const typeMap = {
  input: "INPUT",
  inputWithAction: "INPUT_WITH_ACTION",
};

export const actionMap = {
  addAddress: "ADD_ADDRESS",
  addPerson: "ADD_PERSON",
};

export const numberOnlyRegExp = new RegExp(/^\d+$/);
export const phoneNumberRegExp = new RegExp(/^\+?[1-9][0-9]{7,14}$/);
export const aadhaarNumberRegExp = new RegExp(/^[2-9]{1}[0-9]{11}$/);
export const panNumberRegExp = new RegExp(/^[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}$/);

export const typeOfDrugsFields = [
  {
    name: "typeOfDrug",
    label: "Type Of Drug",
    isRequired: true,
    type: typeMap.input,
  },
  { name: "quantity", label: "Quantity", type: typeMap.input },
  {
    name: "purchaseAmounInINR",
    label: "Purchase Amount In INR",
    type: typeMap.input,
    rules: [
      {
        message: "Amount is not valid",
        pattern: numberOnlyRegExp,
      },
    ],
  },
  { name: "modeOfPayment", label: "Mode Of Payment", type: typeMap.input },
  {
    name: "supplierDetails",
    label: "Supplier Details",
    type: typeMap.inputWithAction,
    actionLabel: "Add Person",
    action: actionMap.addPerson,
  },
  {
    name: "receiversDetails",
    label: "Receivers Details",
    type: typeMap.inputWithAction,
    actionLabel: "Add Person",
    action: actionMap.addPerson,
  },
  { name: "modeOfTransport", label: "Mode Of Transport", type: typeMap.input },
];

export const consumerDetailsFields = [
  {
    name: "consumerName",
    label: "Consumer Name",
    isRequired: true,
    type: typeMap.inputWithAction,
    actionLabel: "Add Person",
    action: actionMap.addPerson,
  },
  {
    name: "placeOfConsumption",
    label: "Place Of Consumption",
    type: typeMap.input,
  },
  {
    name: "adharcardNumber",
    label: "Aadhaar Card Number",
    type: typeMap.input,
    rules: [
      {
        message: "Adhar Number is not valid",
        pattern: aadhaarNumberRegExp,
      },
    ],
  },
  {
    name: "otherSources",
    label: "Other Sources and Phone No",
    span: 6,
    type: typeMap.input,
  },
];

export const financialHistoryFields = [
  {
    name: "accountHolderName",
    label: "Account Holder Name",
    isRequired: true,
    type: typeMap.inputWithAction,
    actionLabel: "Add Person",
    action: actionMap.addPerson,
  },
  {
    name: "PANNo",
    label: "Account Holder PAN Number",
    type: typeMap.input,
    rules: [
      {
        message: "PAN Number is not valid",
        pattern: panNumberRegExp,
      },
    ],
    span: 6,
  },
  {
    name: "nameOfBank",
    label: "Name Of The Bank",
    type: typeMap.input,
  },
  {
    name: "accountNumber",
    label: "Bank Account Number",
    type: typeMap.input,
  },
  {
    name: "branchName",
    label: "Branch Name",
    type: typeMap.input,
  },
  {
    name: "IFSCCode",
    label: "IFSC Code",
    type: typeMap.input,
  },
  {
    name: "immovablePropertyacquired",
    label: "Immovable Property Acquired With Proceeds Of Crime",
    span: 8,
    type: typeMap.input,
  },
  {
    name: "UPIID",
    label: "UPI IDs",
    type: typeMap.input,
  },
  {
    name: "movablePropertyacquired",
    label: "Movable Property Acquired With Proceeds Of Crime",
    span: 8,
    type: typeMap.input,
  },
];

export const SIMDetailsFields = [
  {
    name: "phoneNumber",
    label: "Phone Number",
    type: typeMap.input,
    rules: [
      {
        message: "Phone Number is not valid",
        required: true,
        pattern: phoneNumberRegExp,
      },
    ],
  },
  {
    name: "SDR",
    label: "SDR",
    type: typeMap.input,
  },
  {
    name: "IMEI",
    label: "IMEI",
    type: typeMap.input,
    rules: [
      {
        message: "IMEI Number is not valid",
        pattern: numberOnlyRegExp,
      },
    ],
  },
  {
    name: "accusedDetails",
    label: "Accused Details",
    type: typeMap.inputWithAction,
    actionLabel: "Add Person",
    action: actionMap.addPerson,
  },
  {
    name: "truecallerName",
    label: "True Caller Name",
    type: typeMap.input,
  },
];

const slNoColumn = {
  title: "Sl No.",
  rowKey: "slNo",
  render: (_col, _row, index) => index + 1,
};

export const typeOfDrugsColumns = [
  slNoColumn,
  { title: "Type Of Drug", dataIndex: "typeOfDrug" },
  { title: "Quantity", dataIndex: "quantity" },
  { title: "Purchase Amount In INR", dataIndex: "purchaseAmounInINR" },
  { title: "Mode Of Payment", dataIndex: "modeOfPayment" },
  {
    title: "Supplier Details",
    dataIndex: "supplierDetails",
    render: (supplierDetails) => getPersonString(supplierDetails),
  },
  {
    title: "Receivers Details",
    dataIndex: "receiversDetails",
    render: (receiversDetails) => getPersonString(receiversDetails),
  },
  { title: "Mode Of Transport", dataIndex: "modeOfTransport" },
];

export const consumerDetailsColumns = [
  slNoColumn,
  {
    title: "Consumer Name",
    dataIndex: "consumerName",
    render: (consumerName) => getPersonString(consumerName),
  },
  { title: "Place Of Consumption", dataIndex: "placeOfConsumption" },
  { title: "Adharcard Number", dataIndex: "adharcardNumber" },
  { title: "Other Sources and Phone No", dataIndex: "otherSources" },
];

export const financialHistoryColumns = [
  slNoColumn,
  {
    title: "Account Holder Name",
    dataIndex: "accountHolderName",
    render: (accountHolderName) => getPersonString(accountHolderName),
  },
  {
    title: "Bank Account Details",
    rowKey: "bankAccountDetails",
    render: (_col, row) =>
      joinStrings([row?.accountNumber, row?.nameOfBank, row?.branchName]),
  },
  {
    title: "Immovable Property Acquired With Proceeds Of Crime",
    dataIndex: "immovablePropertyacquired",
  },
  {
    title: "UPI IDs",
    dataIndex: "UPIID",
  },
  {
    title: "Movable Property Acquired With Proceeds Of Crime",
    dataIndex: "movablePropertyacquired",
  },
];

export const SIMDetailsColumns = [
  slNoColumn,
  { title: "Phone Number", dataIndex: "phoneNumber" },
  { title: "SDR", dataIndex: "SDR" },
  { title: "IMEI", dataIndex: "IMEI" },
  {
    title: "Accused Details",
    dataIndex: "accusedDetails",
    render: (accusedDetails) => getPersonString(accusedDetails),
  },
  { title: "True Caller Name", dataIndex: "truecallerName" },
];

export const DOPAMSLinksColumns = [
  slNoColumn,
  {
    title: "Phone Number Of Accused",
    dataIndex: "phoneNumberOfAccused",
  },
  {
    title: "Uploads",
    dataIndex: "uploadDOPAMSData",
    render: (files) => (
      <Space direction="vertical">
        {files.map((file) => {
          if (isString(file?.url) && !isEmpty(file?.url)) {
            return (
              <Typography.Link href={file?.url} target="_blank">
                {file?.name}
              </Typography.Link>
            );
          } else {
            return <Typography.Text>{file?.name}</Typography.Text>;
          }
        })}
      </Space>
    ),
  },
];

export const subModules = [
  {
    Component: TypeOfDrugs,
    key: "typeOfDrugs",
    title: "Type Of Drugs",
    isRequired: true,
    dataKey: "typesOfDrugs",
  },
  {
    Component: ConsumerDetails,
    key: "consumerDetails",
    title: "Consumer Details",
    isRequired: true,
    dataKey: "consumerDetails",
  },
  {
    Component: TimeSinceAndModusOperandi,
    key: "timeSinceAndModusOperandi",
    title:
      "Time Since The Accused Is Running Drug Peddling And His/Her Modus Operandi (Mo)",
    isRequired: true,
    dataKey: "timeSince",
  },
  {
    Component: FinancialHistory,
    key: "financialHistory",
    title:
      "Financial History And Bank Account Transactions(including UPI ID's)",
    isRequired: true,
    dataKey: "financialHistoryAndBankAccountTransactions",
  },
  {
    Component: SIMDetails,
    key: "SIMDetails",
    title: "SIM Details",
    isRequired: true,
    dataKey: "SIMDetails",
  },
  {
    Component: DOPAMS,
    key: "DOPAMS",
    title:
      "DOPAMS Links Of The Accused Arrested/Apprehended Under The NDPS Act, 1985",
    isRequired: true,
    dataKey: "DOPAMSLinks",
  },
];

export const submodulesPreviewMap = [
  {
    title: "Type Of Drugs",
    columns: typeOfDrugsColumns,
    key: "typesOfDrugs",
  },
  {
    title: "Consumer Details",
    columns: consumerDetailsColumns,
    key: "consumerDetails",
  },
  {
    title:
      "Financial History And Bank Account Transactions(including UPI ID's)",
    columns: financialHistoryColumns,
    key: "financialHistoryAndBankAccountTransactions",
  },
  {
    title: "SIM Details",
    columns: SIMDetailsColumns,
    key: "SIMDetails",
  },
  {
    title:
      "DOPAMS Links Of The Accused Arrested/Apprehended Under The NDPS Act, 1985",
    columns: DOPAMSLinksColumns,
    key: "DOPAMSLinks",
  },
];
