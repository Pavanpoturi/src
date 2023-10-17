import { isEmpty, isNull, isUndefined, first } from "lodash";
import moment from "moment";
import { DATE_TIME_FORMAT } from "@containers/FirDetails/fir-util";
import { getDateOfOccurence, getActsAndSectionsDetails } from "../const";

export const firTableConfig = [
  {
    type: "new",
    typeName: "New",
    data: [
      "Cr.No.",
      "sectionOfLaw",
      "dateOfOccurence",
      "dateOfReport",
      "unitName",
      "placeOfOccurence",
      "nameOfcomplainant",
      "victimDetails",
      "nameOfAccused",
      "viewAction",
    ],
  },
  {
    type: "uiCases",
    typeName: "UI Cases",
    data: [
      "Cr.No.",
      "sectionOfLaw",
      "firDate",
      "lastUpdated",
      "targetDaysLeft",
      "unitName",
      "stageOfCase",
      "IOName",
      "caseProgressSheet",
      "planOfAction",
      "viewAction",
    ],
  },
  {
    type: "Disposal",
    typeName: "Disposal",
    data: [
      "Cr.No.",
      "crimeClassification",
      "finalReportType",
      "psName",
      "IOName",
      "disposalAction",
      "stageOfDisposedCase",
    ],
    data1: [
      "Cr.No.",
      "CC NO / SC NO",
      "Disposal Type",
      "Court Name",
      "Nature of Disposal",
    ],
  },
  {
    type: "draft-cases",
    typeName: "Draft Cases",
    data: [
      "Cr.No.",
      "firDate",
      "sectionOfLaw",
      "complainant",
      "status",
      "draftActions",
    ],
  },
  {
    type: "ptCases",
    typeName: "PT Cases",
    data: [
      "Cr.No.",
      "sectionOfLaw",
      "crSCNum",
      "courtName",
      "psName",
      "IOName",
    ],
  },
  {
    type: "CC Nos Awaited",
    typeName: "CC Nos Awaited",
    data: [
      "Cr.No.",
      "sectionOfLaw",
      "dateOfCharge",
      "courtName",
      "IOName",
      "psName",
      "ccActions",
    ],
  },
  {
    type: "Total Cases",
    typeName: "Total Cases",
    data: [
      "Cr.No.",
      "sectionOfLaw",
      "dateOfOccurence",
      "dateOfReport",
      "placeOfOccurence",
      "nameOfcomplainant",
      "victimDetails",
      "nameOfAccused",
      "viewAction",
    ],
  },
  {
    type: "zeroCases",
    typeName: "Zero FIRs",
    data: [
      "Cr.No.",
      "sectionOfLaw",
      "dateOfOccurence",
      "dateOfReport",
      "placeOfOccurence",
      "nameOfcomplainant",
      "nameOfAccused",
      "gravity",
      "registeredAction",
      "receivedAction",
    ],
  },
];

export const firTableConfigHigherOfficer = [
  {
    type: "new",
    typeName: "New",
    data: [
      "Cr.No.",
      "sectionOfLaw",
      "dateOfOccurence",
      "dateOfReport",
      "placeOfOccurence",
      "nameOfcomplainant",
      "victimDetails",
      "nameOfAccused",
      "unitName",
    ],
  },
  {
    type: "uiCases",
    typeName: "UI Cases",
    data: [
      "Cr.No.",
      "sectionOfLaw",
      "dateOfOccurence",
      "dateOfReport",
      "placeOfOccurence",
      "nameAndRankOfIO",
      "unitName",
    ],
  },
  {
    type: "Disposal",
    typeName: "Disposal",
    data: [
      "Cr.No.",
      "crimeClassification",
      "finalReportType",
      "unitName",
      "IOName",
      "disposalAction",
      "stageOfDisposedCase",
    ],
    data1: [
      "Cr.No.",
      "CC NO / SC NO",
      "Disposal Type",
      "Court Name",
      "Nature of Disposal",
      "unitName",
    ],
  },
  {
    type: "draft-cases",
    typeName: "Draft Cases",
    data: [
      "Cr.No.",
      "firDate",
      "sectionOfLaw",
      "complainant",
      "status",
      "unitName",
    ],
  },
  {
    type: "ptCases",
    typeName: "PT Cases",
    data: [
      "Cr.No.",
      "sectionOfLaw",
      "crSCNum",
      "courtName",
      "unitName",
      "IOName",
    ],
  },
  {
    type: "CC Nos Awaited",
    typeName: "CC Nos Awaited",
    data: [
      "Cr.No.",
      "sectionOfLaw",
      "dateOfCharge",
      "courtName",
      "IOName",
      "unitName",
    ],
  },
  {
    type: "Total Cases",
    typeName: "Total Cases",
    data: [
      "Cr.No.",
      "sectionOfLaw",
      "dateOfOccurence",
      "dateOfReport",
      "placeOfOccurence",
      "nameOfcomplainant",
      "victimDetails",
      "nameOfAccused",
      "unitName",
    ],
  },
  {
    type: "zeroCases",
    typeName: "Zero FIRs",
    data: [
      "Cr.No.",
      "sectionOfLaw",
      "dateOfOccurence",
      "dateOfReport",
      "placeOfOccurence",
      "nameOfcomplainant",
      "nameOfAccused",
      "gravity",
      "registeredAction",
      "unitName",
    ],
  },
  {
    type: "Grave",
    typeName: "Grave",
    data: [
      "Cr.No.",
      "sectionOfLaw",
      "dateOfOccurence",
      "dateOfReport",
      "placeOfOccurence",
      "nameOfcomplainant",
      "nameOfAccused",
      "gravity",
      "registeredAction",
      "receivedAction",
      "unitName",
    ],
  },
  {
    type: "Bodily Grave",
    typeName: "Bodily_Grave",
    data: [
      "Cr.No.",
      "sectionOfLaw",
      "dateOfOccurence",
      "dateOfReport",
      "placeOfOccurence",
      "nameOfcomplainant",
      "nameOfAccused",
      "gravity",
      "registeredAction",
      "receivedAction",
      "unitName",
    ],
  },
  {
    type: "Property Grave",
    typeName: "Property_Grave",
    data: [
      "Cr.No.",
      "sectionOfLaw",
      "dateOfOccurence",
      "dateOfReport",
      "placeOfOccurence",
      "nameOfcomplainant",
      "nameOfAccused",
      "gravity",
      "registeredAction",
      "receivedAction",
      "unitName",
    ],
  },
  {
    type: "Cyber Crime",
    typeName: "Cyber_Crime",
    data: [
      "Cr.No.",
      "sectionOfLaw",
      "dateOfOccurence",
      "dateOfReport",
      "placeOfOccurence",
      "nameOfcomplainant",
      "nameOfAccused",
      "gravity",
      "registeredAction",
      "receivedAction",
      "unitName",
    ],
  },
  {
    type: "Pocso",
    typeName: "Pocso",
    data: [
      "Cr.No.",
      "sectionOfLaw",
      "dateOfOccurence",
      "dateOfReport",
      "placeOfOccurence",
      "nameOfcomplainant",
      "nameOfAccused",
      "gravity",
      "unitName",
    ],
  },
  {
    type: "Ndps",
    typeName: "Ndps",
    data: [
      "Cr.No.",
      "sectionOfLaw",
      "dateOfOccurence",
      "dateOfReport",
      "placeOfOccurence",
      "nameOfcomplainant",
      "nameOfAccused",
      "gravity",
      "unitName",
    ],
  },
  {
    type: "Crime Against SC/ST",
    typeName: "Crime Against SC/ST",
    data: [
      "Cr.No.",
      "sectionOfLaw",
      "dateOfOccurence",
      "dateOfReport",
      "placeOfOccurence",
      "nameOfcomplainant",
      "nameOfAccused",
      "gravity",
      "unitName",
    ],
  },
  {
    type: "Crime Against Women",
    typeName: "Crime Against Women",
    data: [
      "Cr.No.",
      "sectionOfLaw",
      "dateOfOccurence",
      "dateOfReport",
      "placeOfOccurence",
      "nameOfcomplainant",
      "nameOfAccused",
      "gravity",
      "unitName",
    ],
  },
];

export const adviosoryAckTable = [
  {
    type: "advisoryAck",
    typeName: "advisory-and-ack",
    data: [
      "Sl.No",
      "Cr.No.",
      "sectionOfLaw",
      "dateOfInitiation",
      "natureOfAck",
      "dateOfAck",
      "requestFromPS",
      "status",
    ],
  },
];

export const historyTableConfig = [
  {
    type: "transferredZeroFirHistory",
    typeName: "Transfered Zero FIRs",
    data: [
      "crimeNumber",
      "sectionOfLaw",
      "dateOfOccurence",
      "dateOfReport",
      "placeOfOccurence",
      "nameOfcomplainant",
      "nameOfAccused",
      "transferredDate",
      "transferredToPS",
      "re-RegisteredWithCR.No.",
    ],
  },
  {
    type: "receivedZeroFirHistory",
    typeName: "Received Zero FIRs",
    data: [
      "crimeNumber",
      "sectionOfLaw",
      "dateOfOccurence",
      "dateOfReport",
      "placeOfOccurence",
      "nameOfcomplainant",
      "nameOfAccused",
      "receivedDate",
      "receivedFromPS",
      "re-RegisteredWithFIRNo.",
    ],
  },
];

const getCrimeDetails = (dataItem) => {
  return <span className="tableRowText">{dataItem?.firDetail?.firNum}</span>;
};

const getSectionOfLaw = (dataItem, actList) => {
  const actsAndSections = dataItem?.firDetail?.actsAndSections;
  return getActsAndSectionsDetails(actsAndSections, actList);
};

const getDateOfOccurenceDetails = (dataItem) => {
  return getDateOfOccurence(dataItem?.firDetail);
};

const getDateOfReport = (dataItem) => {
  const dateOfReport =
    !isUndefined(dataItem?.firDetail?.dateOfReport) &&
    !isNull(dataItem?.firDetail?.dateOfReport) &&
    dataItem?.firDetail?.dateOfReport;
  return (
    <span className="tableRowText">
      {moment(dateOfReport).format(DATE_TIME_FORMAT) || ""}
    </span>
  );
};

const getPlaceOfOccurence = (dataItem) => {
  const wardColony = dataItem?.firDetail?.placeOfOccurence?.wardColony;
  return <span className="tableRowText">{wardColony ? wardColony : ""}</span>;
};

const getNameOfcomplainant = (dataItem) => {
  return (
    <span className="tableRowText">{dataItem?.firDetail?.crimeShownBy}</span>
  );
};

const getGeneratedFIRNumber = (dataItem) => {
  return (
    <span className="tableRowText">{dataItem?.firDetail?.consumedFirNum}</span>
  );
};

const getNameOfAccused = (accusedList) => {
  return (
    <div
      style={{
        maxHeight: 145,
        overflowY: "auto",
        minWidth: 150,
      }}
    >
      {accusedList &&
        accusedList.map((name, i) => {
          if (name === "undefined undefined") {
            return <span className="tableRowText" />;
          } else {
            return (
              <div
                className="tableRowText"
                style={{
                  borderBottom:
                    accusedList.length - 2 === i
                      ? "1px solid rgba(0, 0, 0, 0.06)"
                      : "unset",
                }}
                key={i}
              >
                {accusedList.length > 1 && <span>{i + 1}-</span>}
                <span style={{ marginLeft: 5 }}>
                  {name.replace(" undefined", "")}
                </span>
              </div>
            );
          }
        })}
    </div>
  );
};

const getPSName = (dataItem, unitList) => {
  const selectedUnit =
    !isEmpty(unitList) &&
    first(unitList.filter((unit) => unit.ps_cd === dataItem?.transferTo));
  return <span className="tableRowText">{selectedUnit?.ps_name || ""}</span>;
};

export const historyTableColumsConfig = (
  historyTableColumnConfig,
  actList,
  unitList
) => {
  const historyColumns = [];
  historyTableColumnConfig &&
    historyTableColumnConfig.map((headTitle) => {
      switch (headTitle) {
        case "crimeNumber":
          historyColumns.push({
            title: <div style={{ minWidth: 80 }}>Cr.No.</div>,
            dataIndex: "Cr.No.",
            rowKey: "Cr.No.",
            showSorterTooltip: false,
            render: (_i, item) => {
              return getCrimeDetails(item);
            },
          });
          break;
        case "sectionOfLaw":
          historyColumns.push({
            title: "Sec. of Law",
            dataIndex: "transferredSectionOfLaw",
            rowKey: "transferredSectionOfLaw",
            render: (_i, item) => {
              return getSectionOfLaw(item, actList);
            },
          });
          break;
        case "dateOfOccurence":
          historyColumns.push({
            title: "Date of Occurrence",
            dataIndex: "transferredDateOfOccurence",
            rowKey: "transferredDateOfOccurence",
            render: (_i, item) => {
              return getDateOfOccurenceDetails(item);
            },
          });
          break;
        case "dateOfReport":
          historyColumns.push({
            title: "Date of Report",
            dataIndex: "transferredDateOfReport",
            rowKey: "transferredDateOfReport",
            render: (_i, item) => {
              return getDateOfReport(item);
            },
          });
          break;
        case "placeOfOccurence":
          historyColumns.push({
            title: "Place of Occurrence",
            dataIndex: "transferredPlaceOfOccurence",
            rowKey: "transferredPlaceOfOccurence",
            render: (_i, item) => {
              return getPlaceOfOccurence(item);
            },
          });
          break;
        case "nameOfcomplainant":
          historyColumns.push({
            title: "Name of Complainant",
            dataIndex: "transferredNameOfcomplainant",
            rowKey: "transferredNameOfcomplainant",
            render: (_i, item) => {
              return getNameOfcomplainant(item);
            },
          });
          break;
        case "nameOfAccused":
          historyColumns.push({
            title: "Name of Accused",
            dataIndex: "transferredNameOfAccused",
            rowKey: "transferredNameOfAccused",
            render: (_i, item) => {
              const firDetail = item?.firDetail;
              const accusedList =
                firDetail &&
                !isUndefined(firDetail?.accusedList) &&
                !isEmpty(firDetail?.accusedList) &&
                firDetail?.accusedList;
              return getNameOfAccused(accusedList);
            },
          });
          break;
        case "transferredDate":
          historyColumns.push({
            title: "Transferred Date",
            dataIndex: "transferredDate",
            rowKey: "transferredDate",
            render: (i, item) => {
              return (
                <span className="tableRowText" key={i}>
                  {item?.dateOfTransfer
                    ? moment(item?.dateOfTransfer).format(DATE_TIME_FORMAT)
                    : ""}
                </span>
              );
            },
          });
          break;
        case "transferredToPS":
          historyColumns.push({
            title: "Transferred To PS",
            dataIndex: "transferredToPS",
            rowKey: "transferredToPS",
            render: (_i, item) => {
              return getPSName(item, unitList);
            },
          });
          break;

        case "re-RegisteredWithCR.No.":
          historyColumns.push({
            title: "Re-Registered With CR.No.",
            dataIndex: "re-RegisteredWithCR.No.",
            rowKey: "re-RegisteredWithCR.No.",
            render: (_i, item) => {
              return getGeneratedFIRNumber(item);
            },
          });
          break;

        case "receivedDate":
          historyColumns.push({
            title: "Received Date",
            dataIndex: "receivedDate",
            rowKey: "receivedDate",
            render: (i, item) => {
              return (
                <span className="tableRowText" key={i}>
                  {item?.dateOfForwarding
                    ? moment(item?.dateOfForwarding).format(DATE_TIME_FORMAT)
                    : ""}
                </span>
              );
            },
          });
          break;
        case "receivedFromPS":
          historyColumns.push({
            title: "Received From PS",
            dataIndex: "receivedFromPS",
            rowKey: "receivedFromPS",
            render: (i, item) => {
              const selectedUnit =
                !isEmpty(unitList) &&
                first(
                  unitList.filter(
                    (unit) => unit.ps_cd === item?.firDetail?.psCode
                  )
                );
              return (
                <span className="tableRowText" key={i}>
                  {selectedUnit?.ps_name || ""}
                </span>
              );
            },
          });
          break;
        case "re-RegisteredWithFIRNo.":
          historyColumns.push({
            title: "Re-Registered With FIR No.",
            dataIndex: "re-RegisteredWithFIRNo.",
            rowKey: "re-RegisteredWithFIRNo.",
            render: (_i, item) => {
              return getGeneratedFIRNumber(item);
            },
          });
          break;

        default:
          break;
      }
    });
  return historyColumns;
};
