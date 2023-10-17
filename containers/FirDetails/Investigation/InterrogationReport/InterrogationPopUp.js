import * as React from "react";
import { useCallback, useRef, useState, useEffect } from "react";
import { Modal, Card, Row, Col, Button, Space } from "antd";
import { isArray, isEmpty, isUndefined, first, isString } from "lodash";
import ReactToPrint from "react-to-print";
import { DATE_FORMAT, DATE_TIME_FORMAT } from "@containers/FirDetails/fir-util";
import moment from "moment";
import { getFileById } from "@containers/media-util";
import { physicalFeaturesForm, socioEconomicForm } from "./const";
import TableRecords from "./TableRecords";
import { getAccuseds } from "@containers/FirDetails/fir-util";
import Loader from "@components/utility/loader";
import NoImage from "@assets/images/noImage.jpg";
import { config } from "@config/site.config";
import { submodulesPreviewMap } from "./SubModules/const";

class ComponentToPrint extends React.PureComponent {
  render() {
    const selectedRecord = this.props.selectedRecord;
    const selectedAccusedValue = this.props.selectedAccusedValue;
    const suspectAccusedList = this.props.suspectAccusedList;
    const individualParticulars = selectedRecord?.individualParticulars;
    const filteredSortedImages =
      isArray(individualParticulars) && !isEmpty(individualParticulars)
        ? individualParticulars
            .filter((item) => item.category === "Full image")
            .sort((x, y) => moment(y.dateUploaded).diff(moment(x.dateUploaded)))
        : [];

    const latestFullImage =
      isArray(filteredSortedImages) && !isEmpty(filteredSortedImages)
        ? first(filteredSortedImages)?.fileId !== ""
          ? `${config?.downloadFile}?fileId=${
              first(filteredSortedImages)?.fileId
            }`
          : NoImage
        : NoImage;

    const accusedDetails = first(
      getAccuseds(suspectAccusedList).filter(
        (s) => s._id === selectedAccusedValue
      )
    );

    console.log("accusedDetails", accusedDetails);

    const personalDetails = accusedDetails?.personalDetails;

    const associateDetails = selectedRecord?.associateDetails;
    const casesConfessed = selectedRecord?.casesConfessed;
    const convictionAcquittal = selectedRecord?.convictionAcquittal;
    const defenceCounsel = selectedRecord?.defenceCounsel;
    const executionNBW = selectedRecord?.executionNBW;
    const familyHistory = selectedRecord?.familyHistory;
    const localContacts = selectedRecord?.localContacts;
    const gangFormation = selectedRecord?.gangFormation;
    const jailStay = selectedRecord?.jailStay;
    const modusOperandiList = selectedRecord?.modusOperandiList;
    const pendingNBW = selectedRecord?.pendingNBW;
    const photographs = selectedRecord?.photographs;
    const propertyDisposal = selectedRecord?.propertyDisposal;
    const ptWarrantRegularization = selectedRecord?.ptWarrantRegularization;
    const sureties = selectedRecord?.shelter;
    const shelter = selectedRecord?.sureties;
    const physicalFeatures = selectedRecord?.physicalFeatures;
    const socioEconomic = selectedRecord?.socioEconomic;
    const periodOfOffence = selectedRecord?.periodOfOffence?.offenceTime;
    const regularHabits = selectedRecord?.regularHabits;
    const regularHabitsOthers = selectedRecord?.regularHabitsOthers;
    const indulganceBeforeOffence = selectedRecord?.indulganceBeforeOffence;
    const shareOfAmount = selectedRecord?.shareOfAmount;
    const presentWhereAbouts = selectedRecord?.presentWhereAbouts;

    const columnsfamily = [
      {
        title: "Relation Type",
        dataIndex: "relation",
        rowKey: "relation",
        render: (relation) => (
          <span className="tableRowText wordWrap">{relation}</span>
        ),
      },
      {
        title: "Name",
        dataIndex: "name",
        rowKey: "name",
        render: (_value, item) => {
          const personalDetails = item?.person?.personalDetails;
          const personName = personalDetails?.name
            ? personalDetails?.name
            : " " + personalDetails?.surname
            ? personalDetails?.surname
            : "";
          return <span className="tableRowText wordWrap">{personName}</span>;
        },
      },
      {
        title: "Criminal Background",
        dataIndex: "criminalBackground",
        rowKey: "criminalBackground",
        render: (criminalBackground) => (
          <span className="tableRowText wordWrap">
            {criminalBackground ? "Yes" : "No"}
          </span>
        ),
      },
      {
        title: "Is Alive",
        dataIndex: "isAlive",
        rowKey: "isAlive",
        render: (isAlive) => (
          <span className="tableRowText wordWrap">
            {isAlive ? "Alive" : "Dead"}
          </span>
        ),
      },
      {
        title: "Family Stay Together",
        dataIndex: "familyStayTogether",
        rowKey: "familyStayTogether",
        render: (familyStayTogether) => (
          <span className="tableRowText wordWrap">
            {familyStayTogether ? "Yes" : "No"}
          </span>
        ),
      },
      {
        title: "Family Member Peculiarity",
        dataIndex: "familyMemberPeculiarity",
        rowKey: "familyMemberPeculiarity",
        render: (familyMemberPeculiarity) => (
          <span className="tableRowText wordWrap">
            {familyMemberPeculiarity}
          </span>
        ),
      },
    ];

    const columnContact = [
      {
        title: "Town / City / Village",
        dataIndex: "town",
        rowKey: "town",
        render: (town) => <span className="tableRowText wordWrap">{town}</span>,
      },
      {
        title: "In which PS Jurisdiction",
        dataIndex: "psLimits",
        rowKey: "psLimits",
        render: (psLimits) => (
          <span className="tableRowText wordWrap">{psLimits}</span>
        ),
      },
      {
        title: "Name",
        dataIndex: "person",
        rowKey: "person",
        render: (_value, item) => {
          const personalDetails = item?.person?.personalDetails;
          const personName = personalDetails?.name
            ? personalDetails?.name
            : " " + personalDetails?.surname
            ? personalDetails?.surname
            : "";
          return <span className="tableRowText wordWrap">{personName}</span>;
        },
      },
      {
        title: "Address",
        dataIndex: "address",
        rowKey: "address",
        render: (address) => (
          <span className="tableRowText wordWrap">{address}</span>
        ),
      },
    ];

    const columnsConviction = [
      {
        title: "Dist / Unit",
        dataIndex: "distUnit",
        rowKey: "distUnit",
        render: (distUnit) => (
          <span className="tableRowText wordWrap">{distUnit}</span>
        ),
      },
      {
        title: "Division",
        dataIndex: "division",
        rowKey: "division",
        render: (division) => (
          <span className="tableRowText wordWrap">{division}</span>
        ),
      },
      {
        title: "PS",
        dataIndex: "psCode",
        rowKey: "psCode",
        render: (psCode) => (
          <span className="tableRowText wordWrap">{psCode}</span>
        ),
      },
      {
        title: "Cr.No.",
        dataIndex: "crimeNum",
        rowKey: "crimeNum",
        render: (crimeNum) => (
          <span className="tableRowText wordWrap">{crimeNum}</span>
        ),
      },
      {
        title: "Section Of law",
        dataIndex: "lawSection",
        rowKey: "lawSection",
        render: (lawSection) => (
          <span className="tableRowText wordWrap">{lawSection}</span>
        ),
      },
      {
        title: "SC / CC No",
        dataIndex: "scCCNum",
        rowKey: "scCCNum",
        render: (scCCNum) => (
          <span className="tableRowText wordWrap">{scCCNum}</span>
        ),
      },
      {
        title: "Date of Judgment",
        dataIndex: "judgementDate",
        rowKey: "judgementDate",
        render: (judgementDate) => (
          <span className="tableRowText wordWrap">
            {judgementDate ? moment(judgementDate).format(DATE_FORMAT) : ""}
          </span>
        ),
      },
      {
        title: "Details of conviction / acquittal",
        dataIndex: "detailsConvictionAcquittal",
        rowKey: "detailsConvictionAcquittal",
        render: (detailsConvictionAcquittal) => (
          <span className="tableRowText wordWrap">
            {detailsConvictionAcquittal}
          </span>
        ),
      },
      {
        title: "Reasons for Acquittal, if any",
        dataIndex: "reason",
        rowKey: "reason",
        render: (reason) => (
          <span className="tableRowText wordWrap">{reason}</span>
        ),
      },
    ];

    const nbwColumns = [
      {
        title: "Request to Court to issue NBW",
        dataIndex: "equestForNBW",
        rowKey: "equestForNBW",
        render: (equestForNBW) => (
          <span className="tableRowText wordWrap">
            {equestForNBW ? "Yes" : "No"}
          </span>
        ),
      },
      {
        title: "NBW Request Date",
        dataIndex: "requestedOn",
        rowKey: "requestedOn",
        render: (requestedOn) => (
          <span className="tableRowText wordWrap">
            {requestedOn ? moment(requestedOn).format(DATE_FORMAT) : ""}
          </span>
        ),
      },
      {
        title: "NBW Request Status",
        dataIndex: "nbwStatus",
        rowKey: "nbwStatus",
        render: (nbwStatus) => (
          <span className="tableRowText wordWrap">{nbwStatus || ""}</span>
        ),
      },
      {
        title: "Request For Circular",
        dataIndex: "requestForCircular",
        rowKey: "requestForCircular",
        render: (requestForCircular) => {
          return (
            <span className="tableRowText wordWrap">
              {requestForCircular ? "Yes" : "No"}
            </span>
          );
        },
      },
      {
        title: "Circular Request Date",
        dataIndex: "requestedOnCircular",
        rowKey: "requestedOnCircular",
        render: (requestedOnCircular) => (
          <span className="tableRowText wordWrap">
            {requestedOnCircular
              ? moment(requestedOnCircular).format(DATE_FORMAT)
              : ""}
          </span>
        ),
      },
      {
        title: "Circular Status",
        dataIndex: "circularStatus",
        rowKey: "circularStatus",
        render: (circularStatus) => (
          <span className="tableRowText wordWrap">{circularStatus || ""}</span>
        ),
      },
    ];

    const nbwPendingColumns = [
      {
        title: "Dist / Division",
        dataIndex: "distDivision",
        rowKey: "distDivision",
        render: (distDivision) => (
          <span className="tableRowText wordWrap">{distDivision}</span>
        ),
      },
      {
        title: "P.S.",
        dataIndex: "psCode",
        rowKey: "psCode",
        render: (psCode) => (
          <span className="tableRowText wordWrap">{psCode}</span>
        ),
      },
      {
        title: "Cr.No.",
        dataIndex: "crimeNum",
        rowKey: "crimeNum",
        render: (crimeNum) => (
          <span className="tableRowText wordWrap">{crimeNum}</span>
        ),
      },
      {
        title: "Section Of Law",
        dataIndex: "lawSection",
        rowKey: "lawSection",
        render: (lawSection) => (
          <span className="tableRowText wordWrap">{lawSection}</span>
        ),
      },
      {
        title: "SC / CC No",
        dataIndex: "scCCNum",
        rowKey: "scCCNum",
        render: (scCCNum) => (
          <span className="tableRowText wordWrap">{scCCNum}</span>
        ),
      },
      {
        title: "Court Name",
        dataIndex: "court",
        rowKey: "court",
        render: (court) => (
          <span className="tableRowText wordWrap">{court}</span>
        ),
      },
      {
        title: "Pending Since",
        dataIndex: "pendingSince",
        rowKey: "pendingSince",
        render: (pendingSince) => (
          <span className="tableRowText wordWrap">
            {pendingSince ? moment(pendingSince).format(DATE_FORMAT) : ""}
          </span>
        ),
      },
      {
        title: "Sureties",
        dataIndex: "sureties",
        rowKey: "sureties",
        render: (sureties) => (
          <span className="tableRowText wordWrap">{sureties}</span>
        ),
      },
    ];

    const columnModus = [
      {
        title: "Crime Head",
        dataIndex: "crimeHead",
        rowKey: "crimeHead",
        render: (crimeHead) => (
          <span className="tableRowText wordWrap">{crimeHead}</span>
        ),
      },
      {
        title: "Crime Sub-Head",
        dataIndex: "crimeSubHead",
        rowKey: "crimeSubHead",
        render: (crimeSubHead) => (
          <span className="tableRowText wordWrap">{crimeSubHead}</span>
        ),
      },
      {
        title: "MO",
        dataIndex: "modusOperandi",
        rowKey: "modusOperandi",
        render: (modusOperandi) => (
          <span className="tableRowText wordWrap">{modusOperandi}</span>
        ),
      },
    ];

    const columnsGangFormation = [
      {
        title: "Addition / Split",
        dataIndex: "isAddOrSplit",
        rowKey: "isAddOrSplit",
        render: (isAddOrSplit) => (
          <span className="tableRowText wordWrap">
            {isAddOrSplit ? "Yes" : "No"}
          </span>
        ),
      },
      {
        title: "Name",
        dataIndex: "name",
        rowKey: "name",
        render: (name) => <span className="tableRowText wordWrap">{name}</span>,
      },
      {
        title: "Address",
        dataIndex: "address",
        rowKey: "address",
        render: (address) => (
          <span className="tableRowText wordWrap">{address}</span>
        ),
      },
      {
        title: "Previous PS History",
        dataIndex: "historyPS",
        rowKey: "historyPS",
        render: (historyPS) => (
          <span className="tableRowText wordWrap">{historyPS}</span>
        ),
      },
      {
        title: "Previous Unit History",
        dataIndex: "historyUnit",
        rowKey: "historyUnit",
        render: (historyUnit) => (
          <span className="tableRowText wordWrap">{historyUnit}</span>
        ),
      },
      {
        title: "Previous State History",
        dataIndex: "historyState",
        rowKey: "historyState",
        render: (historyState) => (
          <span className="tableRowText wordWrap">{historyState}</span>
        ),
      },
      {
        title: "Jail where lodged",
        dataIndex: "lodgedJails",
        rowKey: "lodgedJails",
        render: (lodgedJails) => (
          <span className="tableRowText wordWrap">{lodgedJails}</span>
        ),
      },
    ];

    const columnsAssociate = [
      {
        title: "Gang",
        dataIndex: "gang",
        rowKey: "gang",
        render: (gang) => <span className="tableRowText wordWrap">{gang}</span>,
      },
      {
        title: "Member Name",
        dataIndex: "person",
        rowKey: "person",
        render: (_value, item) => {
          const personalDetails = item?.person?.personalDetails;
          const personName = personalDetails?.name
            ? personalDetails?.name
            : " " + personalDetails?.surname
            ? personalDetails?.surname
            : "";
          return <span className="tableRowText wordWrap">{personName}</span>;
        },
      },
      {
        title: "Relation",
        dataIndex: "relation",
        rowKey: "relation",
        render: (relation) => (
          <span className="tableRowText wordWrap">{relation}</span>
        ),
      },
    ];

    const columnsSureties = [
      {
        title: "Dist / Division",
        dataIndex: "distDivision",
        rowKey: "distDivision",
        render: (distDivision) => (
          <span className="tableRowText wordWrap">{distDivision}</span>
        ),
      },
      {
        title: "P.S.",
        dataIndex: "psCode",
        rowKey: "psCode",
        render: (psCode) => (
          <span className="tableRowText wordWrap">{psCode}</span>
        ),
      },
      {
        title: "Cr.No.",
        dataIndex: "crimeNum",
        rowKey: "crimeNum",
        render: (crimeNum) => (
          <span className="tableRowText wordWrap">{crimeNum}</span>
        ),
      },
      {
        title: "Section Of Law",
        dataIndex: "lawSection",
        rowKey: "lawSection",
        render: (lawSection) => (
          <span className="tableRowText wordWrap">{lawSection}</span>
        ),
      },
      {
        title: "SC / CC No",
        dataIndex: "scCCNum",
        rowKey: "scCCNum",
        render: (scCCNum) => (
          <span className="tableRowText wordWrap">{scCCNum}</span>
        ),
      },
      {
        title: "Surety Name",
        dataIndex: "suretyPerson",
        rowKey: "suretyPerson",
        render: (_value, item) => {
          const personalDetails = item?.suretyPerson?.personalDetails;
          const personName = personalDetails?.name
            ? personalDetails?.name
            : " " + personalDetails?.surname
            ? personalDetails?.surname
            : "";
          return <span className="tableRowText wordWrap">{personName}</span>;
        },
      },
      {
        title: "Surety Address",
        dataIndex: "suretyAddress",
        rowKey: "suretyAddress",
        render: (suretyAddress) => (
          <span className="tableRowText wordWrap">{suretyAddress}</span>
        ),
      },
      {
        title: "Residency Type",
        dataIndex: "residencyType",
        rowKey: "residencyType",
        render: (residencyType) => (
          <span className="tableRowText wordWrap">{residencyType}</span>
        ),
      },
      {
        title: "Nature of Surety",
        dataIndex: "suretyNature",
        rowKey: "suretyNature",
        render: (suretyNature) => (
          <span className="tableRowText wordWrap">{suretyNature}</span>
        ),
      },
    ];

    const columnSureties = [
      {
        title: "Regular Residence",
        dataIndex: "address",
        rowKey: "address",
        render: (address) => (
          <span className="tableRowText wordWrap">{address}</span>
        ),
      },
      {
        title: "Preparation of Offence",
        dataIndex: "prepOffence",
        rowKey: "prepOffence",
        render: (prepOffence) => (
          <span className="tableRowText wordWrap">{prepOffence}</span>
        ),
      },
      {
        title: "After Offence",
        dataIndex: "afterOffence",
        rowKey: "afterOffence",
        render: (afterOffence) => (
          <span className="tableRowText wordWrap">{afterOffence}</span>
        ),
      },
      {
        title: "Remarks",
        dataIndex: "remarks",
        rowKey: "remarks",
        render: (remarks) => (
          <span className="tableRowText wordWrap">{remarks}</span>
        ),
      },
    ];

    const columnsJailSentence = [
      {
        title: "Jail Stay Period",
        dataIndex: "jailStayPeriod",
        rowKey: "jailStayPeriod",
        render: (jailStayPeriod) => {
          return (
            <>
              <span className="tableRowText wordWrap">
                {jailStayPeriod.length > 0
                  ? moment(jailStayPeriod[0]).format(DATE_FORMAT)
                  : ""}
              </span>
              <span className="tableRowText wordWrap">
                {jailStayPeriod.length > 0
                  ? moment(jailStayPeriod[1]).format(DATE_FORMAT)
                  : ""}
              </span>
            </>
          );
        },
      },
      {
        title: "Jail Name",
        dataIndex: "name",
        rowKey: "name",
        render: (name) => <span className="tableRowText wordWrap">{name}</span>,
      },
      {
        title: "Acquaintance Name",
        dataIndex: "acquaintanceName",
        rowKey: "acquaintanceName",
        render: (_value, item) => {
          const personalDetails = item?.acquaintanceName?.personalDetails;
          const personName = personalDetails?.name
            ? personalDetails?.name
            : " " + personalDetails?.surname
            ? personalDetails?.surname
            : "";
          return <span className="tableRowText wordWrap">{personName}</span>;
        },
      },
      {
        title: "Acquaintance Address",
        dataIndex: "acquaintanceAddress",
        rowKey: "acquaintanceAddress",
        render: (acquaintanceAddress) => (
          <span className="tableRowText wordWrap">{acquaintanceAddress}</span>
        ),
      },
      {
        title: "Nature of crime involved",
        dataIndex: "crimeNature",
        rowKey: "crimeNature",
        render: (crimeNature) => (
          <span className="tableRowText wordWrap">{crimeNature}</span>
        ),
      },
      {
        title: "Remanded from which PS",
        dataIndex: "remandedPSCode",
        rowKey: "remandedPSCode",
        render: (remandedPSCode) => (
          <span className="tableRowText wordWrap">{remandedPSCode}</span>
        ),
      },
      {
        title: "Remarks (related to MO)",
        dataIndex: "remarks",
        rowKey: "remarks",
        render: (remarks) => (
          <span className="tableRowText wordWrap">{remarks}</span>
        ),
      },
    ];

    const columnsDisposal = [
      {
        title: "Disposed Type",
        dataIndex: "disposedType",
        rowKey: "disposedType",
        render: (disposedType) => (
          <span className="tableRowText wordWrap">{disposedType}</span>
        ),
      },
      {
        title: "Disposed Person",
        dataIndex: "disposedPerson",
        rowKey: "disposedPerson",
        render: (disposedPerson) => (
          <span className="tableRowText wordWrap">{disposedPerson}</span>
        ),
      },
      {
        title: "How Disposed",
        dataIndex: "disposedBy",
        rowKey: "disposedBy",
        render: (disposedBy) => (
          <span className="tableRowText wordWrap">{disposedBy}</span>
        ),
      },
      {
        title: "Receiver Name",
        dataIndex: "receiver",
        rowKey: "receiver",
        render: (_value, item) => {
          const personalDetails = item?.receiver?.personalDetails;
          const personName = personalDetails?.name
            ? personalDetails?.name
            : " " + personalDetails?.surname
            ? personalDetails?.surname
            : "";
          return <span className="tableRowText wordWrap">{personName}</span>;
        },
      },
      {
        title: "Address",
        dataIndex: "address",
        rowKey: "address",
        render: (address) => (
          <span className="tableRowText wordWrap">{address}</span>
        ),
      },
      {
        title: "Family members / others",
        dataIndex: "other",
        rowKey: "other",
        render: (other) => (
          <span className="tableRowText wordWrap">{other}</span>
        ),
      },
    ];

    const columnsConfessed = [
      {
        title: "District/Division",
        dataIndex: "distUnitDivision",
        rowKey: "distUnitDivision",
        render: (distUnitDivision) => (
          <span className="tableRowText wordWrap">{distUnitDivision}</span>
        ),
      },
      {
        title: "In which PS Jurisdiction",
        dataIndex: "psCode",
        rowKey: "psCode",
        render: (psCode) => (
          <span className="tableRowText wordWrap">{psCode}</span>
        ),
      },
      {
        title: "Cr.No.",
        dataIndex: "crimeNum",
        rowKey: "crimeNum",
        render: (crimeNum) => (
          <span className="tableRowText wordWrap">{crimeNum}</span>
        ),
      },
      {
        title: "Section Of Law",
        dataIndex: "lawSection",
        rowKey: "lawSection",
        render: (lawSection) => (
          <span className="tableRowText wordWrap">{lawSection}</span>
        ),
      },
      {
        title: "Gang Members",
        dataIndex: "gangMember",
        rowKey: "gangMember",
        render: (gangMember) => (
          <span className="tableRowText wordWrap">{gangMember}</span>
        ),
      },
      {
        title: "Property Stolen",
        dataIndex: "propertyStolen",
        rowKey: "propertyStolen",
        render: (propertyStolen) => (
          <span className="tableRowText wordWrap">{propertyStolen}</span>
        ),
      },
      {
        title: "Property Recovered",
        dataIndex: "propertyRecovered",
        rowKey: "propertyRecovered",
        render: (propertyRecovered) => (
          <span className="tableRowText wordWrap">{propertyRecovered}</span>
        ),
      },
      {
        title: "Remarks",
        dataIndex: "remarks",
        rowKey: "remarks",
        render: (remarks) => (
          <span className="tableRowText wordWrap">{remarks}</span>
        ),
      },
      {
        title: "Date of Arrest",
        dataIndex: "arrestDate",
        rowKey: "arrestDate",
        render: (arrestDate) => (
          <span className="tableRowText wordWrap">
            {arrestDate ? moment(arrestDate).format(DATE_FORMAT) : ""}
          </span>
        ),
      },
      {
        title: "Place of Arrest",
        dataIndex: "arrestPlace",
        rowKey: "arrestPlace",
        render: (arrestPlace) => (
          <span className="tableRowText wordWrap">{arrestPlace}</span>
        ),
      },
      {
        title: "Arrested By",
        dataIndex: "arrestedBy",
        rowKey: "arrestedBy",
        render: (arrestedBy) => (
          <span className="tableRowText wordWrap">{arrestedBy}</span>
        ),
      },
      {
        title: "Interrogated By",
        dataIndex: "interrogatedBy",
        rowKey: "interrogatedBy",
        render: (interrogatedBy) => (
          <span className="tableRowText wordWrap">{interrogatedBy}</span>
        ),
      },
      {
        title: "Others who can identify",
        dataIndex: "othersIdentify",
        rowKey: "othersIdentify",
        render: (othersIdentify) => (
          <span className="tableRowText wordWrap">{othersIdentify}</span>
        ),
      },
    ];

    const ptColumns = [
      {
        title: "District",
        dataIndex: "district",
        rowKey: "district",
        render: (district) => (
          <span className="tableRowText wordWrap">{district}</span>
        ),
      },
      {
        title: "Court Name",
        dataIndex: "courtName",
        rowKey: "courtName",
        render: (courtName) => (
          <span className="tableRowText wordWrap">{courtName}</span>
        ),
      },
      {
        title: "Arrested On",
        dataIndex: "dateTimeOfArrest",
        rowKey: "dateTimeOfArrest",
        render: (dateTimeOfArrest) => (
          <span className="tableRowText wordWrap">
            {dateTimeOfArrest
              ? moment(dateTimeOfArrest).format(DATE_TIME_FORMAT)
              : ""}
          </span>
        ),
      },
      {
        title: "Date Of PTWarrant Requistion",
        dataIndex: "dateOfPTWarrantRequistion",
        rowKey: "dateOfPTWarrantRequistion",
        render: (dateOfPTWarrantRequistion) => (
          <span className="tableRowText wordWrap">
            {dateOfPTWarrantRequistion
              ? moment(dateOfPTWarrantRequistion).format(DATE_FORMAT)
              : ""}
          </span>
        ),
      },
      {
        title: "Grant Type",
        dataIndex: "grantType",
        rowKey: "grantType",
        render: (_value, item) => {
          return (
            <span className="tableRowText wordWrap">
              {item?.courtOrders?.grantType || ""}
            </span>
          );
        },
      },
    ];

    const columnsInterrogationTransit = [
      {
        title: "Dist / Division",
        dataIndex: "distDivision",
        rowKey: "distDivision",
        render: (distDivision) => (
          <span className="tableRowText wordWrap">{distDivision}</span>
        ),
      },
      {
        title: "P.S.",
        dataIndex: "psCode",
        rowKey: "psCode",
        render: (psCode) => (
          <span className="tableRowText wordWrap">{psCode}</span>
        ),
      },
      {
        title: "Cr.No.",
        dataIndex: "crimeNum",
        rowKey: "crimeNum",
        render: (crimeNum) => (
          <span className="tableRowText wordWrap">{crimeNum}</span>
        ),
      },
      {
        title: "Section Of Law",
        dataIndex: "lawSection",
        rowKey: "lawSection",
        render: (lawSection) => (
          <span className="tableRowText wordWrap">{lawSection}</span>
        ),
      },
      {
        title: "SC / CC No",
        dataIndex: "scCCNum",
        rowKey: "scCCNum",
        render: (scCCNum) => (
          <span className="tableRowText wordWrap">{scCCNum}</span>
        ),
      },
      {
        title: "Court Name",
        dataIndex: "court",
        rowKey: "court",
        render: (court) => (
          <span className="tableRowText wordWrap">{court}</span>
        ),
      },
      {
        title: "Date of regularization of Transit Warrant",
        dataIndex: "regularizationDate",
        rowKey: "regularizationDate",
        render: (regularizationDate) => (
          <span className="tableRowText wordWrap">
            {regularizationDate
              ? moment(regularizationDate).format(DATE_FORMAT)
              : ""}
          </span>
        ),
      },
      {
        title: "Remarks",
        dataIndex: "remarks",
        rowKey: "remarks",
        render: (remarks) => (
          <span className="tableRowText wordWrap">{remarks}</span>
        ),
      },
    ];

    const columnsNbw = [
      {
        title: "Request to Court to issue NBW",
        dataIndex: "equestForNBW",
        rowKey: "equestForNBW",
        render: (equestForNBW) => (
          <span className="tableRowText wordWrap">
            {equestForNBW ? "Yes" : "No"}
          </span>
        ),
      },
      {
        title: "NBW Request Date",
        dataIndex: "requestedOn",
        rowKey: "requestedOn",
        render: (requestedOn) => (
          <span className="tableRowText wordWrap">
            {requestedOn ? moment(requestedOn).format(DATE_FORMAT) : ""}
          </span>
        ),
      },
      {
        title: "NBW Request Status",
        dataIndex: "nbwStatus",
        rowKey: "nbwStatus",
        render: (nbwStatus) => (
          <span className="tableRowText wordWrap">{nbwStatus || ""}</span>
        ),
      },
      {
        title: "Request For Circular",
        dataIndex: "requestForCircular",
        rowKey: "requestForCircular",
        render: (requestForCircular) => {
          return (
            <span className="tableRowText wordWrap">
              {requestForCircular ? "Yes" : "No"}
            </span>
          );
        },
      },
      {
        title: "Circular Request Date",
        dataIndex: "requestedOnCircular",
        rowKey: "requestedOnCircular",
        render: (requestedOnCircular) => (
          <span className="tableRowText wordWrap">
            {requestedOnCircular
              ? moment(requestedOnCircular).format(DATE_FORMAT)
              : ""}
          </span>
        ),
      },
      {
        title: "Circular Status",
        dataIndex: "circularStatus",
        rowKey: "circularStatus",
        render: (circularStatus) => (
          <span className="tableRowText wordWrap">{circularStatus || ""}</span>
        ),
      },
    ];

    const columnsExecutionNBW = [
      {
        title: "Dist / Division",
        dataIndex: "distDivision",
        rowKey: "distDivision",
        render: (distDivision) => (
          <span className="tableRowText wordWrap">{distDivision}</span>
        ),
      },
      {
        title: "P.S.",
        dataIndex: "psCode",
        rowKey: "psCode",
        render: (psCode) => (
          <span className="tableRowText wordWrap">{psCode}</span>
        ),
      },
      {
        title: "Cr.No.",
        dataIndex: "crimeNum",
        rowKey: "crimeNum",
        render: (crimeNum) => (
          <span className="tableRowText wordWrap">{crimeNum}</span>
        ),
      },
      {
        title: "Section Of Law",
        dataIndex: "lawSection",
        rowKey: "lawSection",
        render: (lawSection) => (
          <span className="tableRowText wordWrap">{lawSection}</span>
        ),
      },
      {
        title: "SC / CC No",
        dataIndex: "scCCNum",
        rowKey: "scCCNum",
        render: (scCCNum) => (
          <span className="tableRowText wordWrap">{scCCNum}</span>
        ),
      },
      {
        title: "Court Name",
        dataIndex: "court",
        rowKey: "court",
        render: (court) => (
          <span className="tableRowText wordWrap">{court}</span>
        ),
      },
      {
        title: "Date of execution",
        dataIndex: "executionDate",
        rowKey: "executionDate",
        render: (executionDate) => (
          <span className="tableRowText wordWrap">
            {executionDate ? moment(executionDate).format(DATE_FORMAT) : ""}
          </span>
        ),
      },
      {
        title: "Remarks",
        dataIndex: "remarks",
        rowKey: "remarks",
        render: (remarks) => (
          <span className="tableRowText wordWrap">{remarks}</span>
        ),
      },
    ];

    const columnsDefenceCounsel = [
      {
        title: "Dist / Division",
        dataIndex: "distDivision",
        rowKey: "distDivision",
        render: (distDivision) => (
          <span className="tableRowText wordWrap">{distDivision}</span>
        ),
      },
      {
        title: "P.S.",
        dataIndex: "psCode",
        rowKey: "psCode",
        render: (psCode) => (
          <span className="tableRowText wordWrap">{psCode}</span>
        ),
      },
      {
        title: "Cr.No.",
        dataIndex: "crimeNum",
        rowKey: "crimeNum",
        render: (crimeNum) => (
          <span className="tableRowText wordWrap">{crimeNum}</span>
        ),
      },
      {
        title: "Section Of Law",
        dataIndex: "lawSection",
        rowKey: "lawSection",
        render: (lawSection) => (
          <span className="tableRowText wordWrap">{lawSection}</span>
        ),
      },
      {
        title: "SC / CC No",
        dataIndex: "scCCNum",
        rowKey: "scCCNum",
        render: (scCCNum) => (
          <span className="tableRowText wordWrap">{scCCNum}</span>
        ),
      },
      {
        title: "Defence Counsel Name",
        dataIndex: "defenceCounselPerson",
        rowKey: "defenceCounselPerson",
        render: (_value, item) => {
          const personalDetails = item?.defenceCounselPerson?.personalDetails;
          const personName = personalDetails?.name
            ? personalDetails?.name
            : " " + personalDetails?.surname
            ? personalDetails?.surname
            : "";
          return <span className="tableRowText wordWrap">{personName}</span>;
        },
      },
      {
        title: "Defence Counsel Address",
        dataIndex: "defenceCounselAddress",
        rowKey: "defenceCounselAddress",
        render: (defenceCounselAddress) => (
          <span className="tableRowText wordWrap">{defenceCounselAddress}</span>
        ),
      },
      {
        title: "Defence Counsel Phone No",
        dataIndex: "defenceCounselPhone",
        rowKey: "defenceCounselPhone",
        render: (defenceCounselPhone) => (
          <span className="tableRowText wordWrap">{defenceCounselPhone}</span>
        ),
      },
      {
        title: "Assistance Bail / Trial",
        dataIndex: "assistance",
        rowKey: "assistance",
        render: (assistance) => (
          <span className="tableRowText wordWrap">{assistance}</span>
        ),
      },
    ];

    const columnsUploadReport = [
      {
        title: "Document Name",
        dataIndex: "name",
        rowKey: "name",
        render: (i, item) => (
          <div
            key={i}
            style={{ cursor: "pointer", color: "#02599C" }}
            onClick={() => getFileById(item?.fileId, item?.name, item?.url)}
          >
            {item.name}
          </div>
        ),
      },
    ];

    return (
      <div
        style={{
          margin: 15,
          marginBottom: 30,
          fontFamily: "Arial,Helvetica Neue,Helvetica,sans-serif",
          fontSize: 23,
          color: "black",
          display: "contents",
        }}
      >
        <Row gutter={24}>
          {!isUndefined(personalDetails) && !isEmpty(personalDetails) && (
            <Card
              style={{ width: "100%", marginTop: "5px" }}
              title="Individual Particulars"
            >
              <Row justify="space-evenly" align="middle">
                <Col span={12}>
                  <Row justify="space-evenly">
                    {personalDetails?.name && (
                      <>
                        <Col span={8} style={{ fontWeight: "bold" }}>
                          Name{" "}
                        </Col>{" "}
                        :
                        <Col
                          span={12}
                          style={{ color: "#A8A8A8", fontWeight: "normal" }}
                        >
                          {personalDetails?.name && personalDetails?.surname
                            ? personalDetails?.name +
                              " " +
                              personalDetails?.surname
                            : personalDetails?.name}
                        </Col>{" "}
                      </>
                    )}
                    {personalDetails?.alias && (
                      <>
                        <Col span={8} style={{ fontWeight: "bold" }}>
                          Alias Name{" "}
                        </Col>{" "}
                        :
                        <Col
                          span={12}
                          style={{ color: "#A8A8A8", fontWeight: "normal" }}
                        >
                          {personalDetails?.alias}
                        </Col>{" "}
                      </>
                    )}
                    {personalDetails?.gender && (
                      <>
                        <Col span={8} style={{ fontWeight: "bold" }}>
                          Gender{" "}
                        </Col>{" "}
                        :
                        <Col
                          span={12}
                          style={{ color: "#A8A8A8", fontWeight: "normal" }}
                        >
                          {personalDetails?.gender}
                        </Col>{" "}
                      </>
                    )}
                    {personalDetails?.dateOfBirth && (
                      <>
                        <Col span={8} style={{ fontWeight: "bold" }}>
                          Date Of Birth{" "}
                        </Col>{" "}
                        :
                        <Col
                          span={12}
                          style={{ color: "#A8A8A8", fontWeight: "normal" }}
                        >
                          {moment(personalDetails?.dateOfBirth).format(
                            "DD-MM-YYYY"
                          )}
                        </Col>{" "}
                      </>
                    )}
                    {personalDetails?.age && (
                      <>
                        <Col span={8} style={{ fontWeight: "bold" }}>
                          Age{" "}
                        </Col>{" "}
                        :
                        <Col
                          span={12}
                          style={{ color: "#A8A8A8", fontWeight: "normal" }}
                        >
                          {personalDetails?.age}
                        </Col>{" "}
                      </>
                    )}
                    {personalDetails?.nationality && (
                      <>
                        <Col span={8} style={{ fontWeight: "bold" }}>
                          Nationality{" "}
                        </Col>{" "}
                        :
                        <Col
                          span={12}
                          style={{ color: "#A8A8A8", fontWeight: "normal" }}
                        >
                          {personalDetails?.nationality}
                        </Col>{" "}
                      </>
                    )}
                    {personalDetails?.caste && (
                      <>
                        <Col span={8} style={{ fontWeight: "bold" }}>
                          Caste{" "}
                        </Col>{" "}
                        :
                        <Col
                          span={12}
                          style={{ color: "#A8A8A8", fontWeight: "normal" }}
                        >
                          {personalDetails?.caste}
                        </Col>{" "}
                      </>
                    )}
                    {personalDetails?.occupation && (
                      <>
                        <Col span={8} style={{ fontWeight: "bold" }}>
                          Occupation{" "}
                        </Col>{" "}
                        :
                        <Col
                          span={12}
                          style={{ color: "#A8A8A8", fontWeight: "normal" }}
                        >
                          {personalDetails?.occupation}
                        </Col>{" "}
                      </>
                    )}
                    {accusedDetails?.permanentAddress?.houseNo && (
                      <>
                        <Col span={8} style={{ fontWeight: "bold" }}>
                          House No.{" "}
                        </Col>{" "}
                        :
                        <Col
                          span={12}
                          style={{ color: "#A8A8A8", fontWeight: "normal" }}
                        >
                          {accusedDetails?.permanentAddress?.houseNo}
                        </Col>{" "}
                      </>
                    )}
                    {accusedDetails?.permanentAddress?.areaMandal && (
                      <>
                        <Col span={8} style={{ fontWeight: "bold" }}>
                          Area/Mandal{" "}
                        </Col>{" "}
                        :
                        <Col
                          span={12}
                          style={{ color: "#A8A8A8", fontWeight: "normal" }}
                        >
                          {accusedDetails?.permanentAddress?.areaMandal}
                        </Col>{" "}
                      </>
                    )}
                    {accusedDetails?.permanentAddress?.district && (
                      <>
                        <Col span={8} style={{ fontWeight: "bold" }}>
                          District{" "}
                        </Col>{" "}
                        :
                        <Col
                          span={12}
                          style={{ color: "#A8A8A8", fontWeight: "normal" }}
                        >
                          {accusedDetails?.permanentAddress?.district}
                        </Col>{" "}
                      </>
                    )}
                    {accusedDetails?.permanentAddress?.stateUt && (
                      <>
                        <Col span={8} style={{ fontWeight: "bold" }}>
                          State{" "}
                        </Col>{" "}
                        :
                        <Col
                          span={12}
                          style={{ color: "#A8A8A8", fontWeight: "normal" }}
                        >
                          {accusedDetails?.permanentAddress?.stateUt}
                        </Col>{" "}
                      </>
                    )}
                    {accusedDetails?.permanentAddress?.pinCode && (
                      <>
                        <Col span={8} style={{ fontWeight: "bold" }}>
                          Pincode{" "}
                        </Col>{" "}
                        :
                        <Col
                          span={12}
                          style={{ color: "#A8A8A8", fontWeight: "normal" }}
                        >
                          {accusedDetails?.permanentAddress?.pinCode}
                        </Col>{" "}
                      </>
                    )}
                  </Row>
                </Col>
                {!isUndefined(individualParticulars) &&
                  isArray(individualParticulars) &&
                  !isEmpty(individualParticulars) && (
                    <Col span={12}>
                      {!isEmpty(latestFullImage) && (
                        <div
                          style={{
                            width: "90%",
                            height: "100%",
                            display: "flex",
                            alignItem: "center",
                            justifyContent: "center",
                          }}
                        >
                          <img
                            src={latestFullImage}
                            style={{
                              border: "1px solid #ddd",
                              borderRadius: "4px",
                              padding: "5px",
                              maxHeight: "250px",
                              maxWidth: "3000px",
                            }}
                          />
                        </div>
                      )}
                    </Col>
                  )}
              </Row>
            </Card>
          )}
          {!isEmpty(physicalFeatures) &&
            !isUndefined(physicalFeatures["build"]) && (
              <Card
                style={{ width: "100%", marginTop: "5px" }}
                title="Physical Features"
              >
                <Row gutter={24}>
                  {physicalFeaturesForm.map((item, _i) => {
                    return (
                      <>
                        <Col span={12} style={{ fontWeight: "bold" }}>
                          {item.label}
                        </Col>
                        <Col span={12} style={{ color: "#A8A8A8" }}>
                          {physicalFeatures[item?.name]}
                        </Col>
                      </>
                    );
                  })}
                </Row>
              </Card>
            )}
          {!isEmpty(socioEconomic) && (
            <Card
              style={{ width: "100%", marginTop: "5px" }}
              title="Socio / Economic Profile"
            >
              <Row gutter={24}>
                {socioEconomicForm.map((item, i) => {
                  return (
                    <>
                      <Col span={12} style={{ fontWeight: "bold" }}>
                        {item.label}
                      </Col>
                      <Col span={12} style={{ color: "#A8A8A8" }}>
                        {socioEconomic[item?.name]}
                      </Col>
                    </>
                  );
                })}
              </Row>
            </Card>
          )}

          {!isEmpty(periodOfOffence) && (
            <Card
              style={{ width: "100%", marginTop: "5px" }}
              title="Commission Of Offence"
            >
              <Row gutter={24}>
                <>
                  <Col span={12} style={{ fontWeight: "bold" }}>
                    {"Commission Of Offence"}
                  </Col>
                  <Col span={12} style={{ color: "#A8A8A8" }}>
                    {periodOfOffence}
                    <br />
                  </Col>
                </>
              </Row>
            </Card>
          )}

          {!isEmpty(regularHabits) && (
            <Card
              style={{ width: "100%", marginTop: "5px" }}
              title="Regular Habits"
            >
              <Row gutter={24}>
                <>
                  <Col span={12} style={{ fontWeight: "bold" }}>
                    {"Regular Habits"}
                    <br />
                    {"Others"}
                  </Col>
                  <Col span={12} style={{ color: "#A8A8A8" }}>
                    {regularHabits ? regularHabits.join(",") : "-"}
                    <br />
                    {regularHabitsOthers}
                  </Col>
                </>
              </Row>
            </Card>
          )}

          {!isEmpty(indulganceBeforeOffence) && (
            <Card
              style={{ width: "100%", marginTop: "5px" }}
              title="Indulgence Before Offence"
            >
              <Row gutter={24}>
                <>
                  <Col span={12} style={{ fontWeight: "bold" }}>
                    {"Indulgence Before Offence"}
                    <br />
                    {"Other"}
                  </Col>
                  <Col span={12} style={{ color: "#A8A8A8" }}>
                    {indulganceBeforeOffence?.indulganceType}
                    <br />
                    {indulganceBeforeOffence?.otherIndulganceType}
                  </Col>
                </>
              </Row>
            </Card>
          )}

          {!isEmpty(shareOfAmount) && (
            <Card
              style={{ width: "100%", marginTop: "5px" }}
              title="How his Share Of Amount Spent"
            >
              <Row gutter={24}>
                <Col span={12} style={{ fontWeight: "bold" }}>
                  {"Share Of Amount Spent "}
                  <br />
                  {"Remarks "}
                </Col>
                <Col span={12} style={{ color: "#A8A8A8" }}>
                  {shareOfAmount?.shareOfAmountSpent}
                  <br />
                  {shareOfAmount?.remarks}
                </Col>
              </Row>
            </Card>
          )}

          {!isEmpty(presentWhereAbouts) && (
            <Card
              style={{ width: "100%", marginTop: "5px" }}
              title="Present Whereabouts"
            >
              <Row gutter={24} style={{ marginBottom: "10px" }}>
                <Col span={6} style={{ fontWeight: "bold" }}>
                  {"In Jail"}
                </Col>
                <Col span={4} style={{ color: "#A8A8A8" }}>
                  {"In Jail"}
                  <br />
                  {presentWhereAbouts?.inJail?.isInJail ? "Yes" : "No"}
                </Col>
                <Col span={6} style={{ color: "#A8A8A8" }}>
                  {"Sent From"}
                  <br />
                  {presentWhereAbouts?.inJail?.distUnit}
                </Col>
                <Col span={4} style={{ color: "#A8A8A8" }}>
                  {"Crime No"}
                  <br />
                  {presentWhereAbouts?.inJail?.crimeNum}
                </Col>
                <Col span={4} style={{ color: "#A8A8A8" }}>
                  {"UT No"}
                  <br />
                  {presentWhereAbouts?.inJail?.fromWhereSentInJail}
                </Col>
              </Row>
              <Row gutter={24} style={{ marginBottom: "10px" }}>
                <Col span={6} style={{ fontWeight: "bold" }}>
                  {"In Bail"}
                </Col>
                <Col span={4} style={{ color: "#A8A8A8" }}>
                  {"In Bail"}
                  <br />
                  {presentWhereAbouts?.onBail?.isOnBail ? "Yes" : "No"}
                </Col>
                <Col span={6} style={{ color: "#A8A8A8" }}>
                  {"Sent From"}
                  <br />
                  {presentWhereAbouts?.onBail?.fromWhereSentOnBail}
                </Col>
                <Col span={4} style={{ color: "#A8A8A8" }}>
                  {"Crime No"}
                  <br />
                  {presentWhereAbouts?.onBail?.crimeNum}
                </Col>
                <Col span={4} style={{ color: "#A8A8A8" }}>
                  {"Bail Date"}
                  <br />
                  {presentWhereAbouts?.onBail?.dateOfBail
                    ? moment(presentWhereAbouts?.onBail?.dateOfBail).format(
                        DATE_FORMAT
                      )
                    : ""}
                </Col>
              </Row>
              <Row gutter={24} style={{ marginBottom: "10px" }}>
                <Col span={6} style={{ fontWeight: "bold" }}>
                  {"Absconding"}
                </Col>
                <Col span={4} style={{ color: "#A8A8A8" }}>
                  {"Absconding"}
                  <br />
                  {presentWhereAbouts?.absconding?.isAbsconding ? "Yes" : "No"}
                </Col>
                <Col span={6} style={{ color: "#A8A8A8" }}>
                  {"Wanted in Police stations"}
                  <br />
                  {presentWhereAbouts?.absconding?.wantedInPoliceStation}
                </Col>
                <Col span={4} style={{ color: "#A8A8A8" }}>
                  {"Crime No"}
                  <br />
                  {presentWhereAbouts?.absconding?.crimeNum}
                </Col>
              </Row>
              <Row gutter={24} style={{ marginBottom: "10px" }}>
                <Col span={6} style={{ fontWeight: "bold" }}>
                  {"Normal Life"}
                </Col>
                <Col span={4} style={{ color: "#A8A8A8" }}>
                  {"Normal Life"}
                  <br />
                  {presentWhereAbouts?.normalLife?.isNormalLife ? "Yes" : "No"}
                </Col>
                <Col span={7} style={{ color: "#A8A8A8" }}>
                  {"Eking livelihood by doing labor work"}
                  <br />
                  {presentWhereAbouts?.normalLife?.ekingLivelihoodByLaborWork}
                </Col>
              </Row>
              <Row gutter={24} style={{ marginBottom: "10px" }}>
                <Col span={6} style={{ fontWeight: "bold" }}>
                  {"Facing Trial"}
                </Col>
                <Col span={4} style={{ color: "#A8A8A8" }}>
                  {"Facing Trial"}
                  <br />
                  {presentWhereAbouts?.facingTrial?.isFacingTrial
                    ? "Yes"
                    : "No"}
                </Col>
                <Col span={6} style={{ color: "#A8A8A8" }}>
                  {"Police Station"}
                  <br />
                  {presentWhereAbouts?.facingTrial?.wantedInPoliceStation}
                </Col>
                <Col span={4} style={{ color: "#A8A8A8" }}>
                  {"Crime No"}
                  <br />
                  {presentWhereAbouts?.facingTrial?.psName}
                </Col>
              </Row>
              <Row gutter={24} style={{ marginBottom: "10px" }}>
                <Col span={6} style={{ fontWeight: "bold" }}>
                  {"Rehabilitated"}
                </Col>
                <Col span={4} style={{ color: "#A8A8A8" }}>
                  {"Rehabilitated"}
                  <br />
                  {presentWhereAbouts?.rehabilitated?.isRehabilitated
                    ? "Yes"
                    : "No"}
                </Col>
                <Col span={6} style={{ color: "#A8A8A8" }}>
                  {"Rehabilitation Details"}
                  <br />
                  {presentWhereAbouts?.rehabilitated?.rehabilitationDetails}
                </Col>
              </Row>
            </Card>
          )}

          {!isEmpty(familyHistory) && (
            <Card
              style={{ width: "100%", marginTop: "5px" }}
              title="Family History"
            >
              <div style={{ padding: 10 }}>
                <TableRecords
                  title="Family History"
                  dataSource={familyHistory}
                  columns={columnsfamily}
                />
              </div>
            </Card>
          )}

          {!isEmpty(associateDetails) && (
            <Card
              style={{ width: "100%", marginTop: "5px" }}
              title="Relationship With Other Associates / Gang Members And Friends"
            >
              <div style={{ padding: 10 }}>
                <TableRecords
                  dataSource={associateDetails}
                  columns={columnsAssociate}
                />
              </div>
            </Card>
          )}

          {!isEmpty(localContacts) && (
            <Card
              style={{ width: "100%", marginTop: "5px" }}
              title="Local Contacts / Facilitators"
            >
              <div style={{ padding: 10 }}>
                <TableRecords
                  dataSource={localContacts}
                  columns={columnContact}
                />
              </div>
            </Card>
          )}

          {!isEmpty(modusOperandiList) && (
            <Card
              style={{ width: "100%", marginTop: "5px" }}
              title="Modus Operandi"
            >
              <div style={{ padding: 10 }}>
                <TableRecords
                  dataSource={modusOperandiList}
                  columns={columnModus}
                />
              </div>
            </Card>
          )}

          {!isEmpty(shelter) && (
            <Card style={{ width: "100%", marginTop: "5px" }} title="Shelter">
              <div style={{ padding: 10 }}>
                <TableRecords dataSource={shelter} columns={columnsSureties} />
              </div>
            </Card>
          )}

          {!isEmpty(propertyDisposal) && (
            <Card
              style={{ width: "100%", marginTop: "5px" }}
              title="Disposal Of Property"
            >
              <div style={{ padding: 10 }}>
                <TableRecords
                  dataSource={propertyDisposal}
                  columns={columnsDisposal}
                />
              </div>
            </Card>
          )}

          {!isEmpty(casesConfessed) && (
            <Card
              style={{ width: "100%", marginTop: "5px" }}
              title="Previous Offences Confessed"
            >
              <div style={{ padding: 10 }}>
                <TableRecords
                  dataSource={casesConfessed}
                  columns={columnsConfessed}
                />
              </div>
            </Card>
          )}

          {!isEmpty(ptWarrantRegularization) && (
            <Card
              style={{ width: "100%", marginTop: "5px" }}
              title="Regularization of Transit Warrant"
            >
              <div style={{ padding: 10 }}>
                <TableRecords
                  dataSource={ptWarrantRegularization}
                  columns={ptColumns}
                />
              </div>
              <div style={{ padding: 10 }}>
                <TableRecords
                  dataSource={ptWarrantRegularization}
                  columns={columnsInterrogationTransit}
                />
              </div>
            </Card>
          )}

          {!isEmpty(executionNBW) && (
            <Card
              style={{ width: "100%", marginTop: "5px" }}
              title="Execution of NBW"
            >
              <div style={{ padding: 10 }}>
                <TableRecords dataSource={executionNBW} columns={columnsNbw} />
              </div>
              <div style={{ padding: 10 }}>
                <TableRecords
                  dataSource={executionNBW}
                  columns={columnsExecutionNBW}
                />
              </div>
            </Card>
          )}

          {!isEmpty(pendingNBW) && (
            <Card
              style={{ width: "100%", marginTop: "5px" }}
              title="Pending NBW"
            >
              <div style={{ padding: 10 }}>
                <TableRecords dataSource={pendingNBW} columns={nbwColumns} />
              </div>
              <div style={{ padding: 10 }}>
                <TableRecords
                  dataSource={pendingNBW}
                  columns={nbwPendingColumns}
                />
              </div>
            </Card>
          )}

          {!isEmpty(sureties) && (
            <Card style={{ width: "100%", marginTop: "5px" }} title="Sureties">
              <div style={{ padding: 10 }}>
                <TableRecords dataSource={sureties} columns={columnSureties} />
              </div>
            </Card>
          )}

          {!isEmpty(defenceCounsel) && (
            <Card
              style={{ width: "100%", marginTop: "5px" }}
              title="Defence Counsel"
            >
              <div style={{ padding: 10 }}>
                <TableRecords
                  dataSource={defenceCounsel}
                  columns={columnsDefenceCounsel}
                />
              </div>
            </Card>
          )}

          {!isEmpty(jailStay) && (
            <Card
              style={{ width: "100%", marginTop: "5px" }}
              title="Jail Sentence & Acquaintances"
            >
              <div style={{ padding: 10 }}>
                <TableRecords
                  dataSource={jailStay}
                  columns={columnsJailSentence}
                />
              </div>
            </Card>
          )}

          {!isEmpty(gangFormation) && (
            <Card
              style={{ width: "100%", marginTop: "5px" }}
              title="New Gang Formation"
            >
              <div style={{ padding: 10 }}>
                <TableRecords
                  dataSource={gangFormation}
                  columns={columnsGangFormation}
                />
              </div>
            </Card>
          )}

          {!isEmpty(convictionAcquittal) && (
            <Card
              style={{ width: "100%", marginTop: "5px" }}
              title="Conviction/ Acquittal"
            >
              <div style={{ padding: 10 }}>
                <TableRecords
                  dataSource={convictionAcquittal}
                  columns={columnsConviction}
                />
              </div>
            </Card>
          )}

          {!isEmpty(photographs) && (
            <Card
              style={{ width: "100%", marginTop: "5px" }}
              title="Upload Interrogation Report"
            >
              <div style={{ padding: 10 }}>
                <TableRecords
                  dataSource={photographs}
                  columns={columnsUploadReport}
                />
              </div>
            </Card>
          )}
          <Space style={{ width: "100%" }} direction="vertical">
            {submodulesPreviewMap.map((module) => {
              const { key, title, columns } = module;
              const dataSource = selectedRecord?.[key];
              if (isEmpty(dataSource) || !isArray(dataSource)) return null;
              return (
                <Card style={{ width: "100%" }} title={title}>
                  <TableRecords dataSource={dataSource} columns={columns} />
                </Card>
              );
            })}

            {!isEmpty(selectedRecord?.timeSince?.notes) &&
              isString(selectedRecord?.timeSince?.notes) && (
                <Card
                  style={{ width: "100%" }}
                  title="Time Since The Accused Is Running Drug Peddling And His/Her Modus Operandi (Mo)"
                >
                  <p>{selectedRecord?.timeSince?.notes}</p>
                </Card>
              )}
          </Space>
        </Row>
      </div>
    );
  }
}

export default function InterrogationPopUp({
  interrogationPopUp,
  SetInterrogationPopUp,
  selectedRecord,
  selectedAccusedValue,
  suspectAccusedList,
}) {
  const componentRef = useRef(null);
  const onBeforeGetContentResolve = useRef(null);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("old boring text");

  const handleAfterPrint = useCallback(() => {
    console.log("`onAfterPrint` called");
  }, []);

  const handleBeforePrint = useCallback(() => {
    console.log("`onBeforePrint` called");
  }, []);

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

  useEffect(() => {
    if (
      text === "New, Updated Text!" &&
      typeof onBeforeGetContentResolve.current === "function"
    ) {
      onBeforeGetContentResolve.current();
    }
  }, [onBeforeGetContentResolve.current, text]);

  const reactToPrintContent = useCallback(() => {
    return componentRef.current;
  }, [componentRef.current]);

  const pageStyle = `
@page {
  margin: 20mm 17mm 25mm 23mm;
  size: portrait;
}`;

  const reactToPrintTrigger = useCallback(() => {
    return (
      <Button
        type="primary"
        className="submitButton"
        style={{
          position: "absolute",
          bottom: "9px",
          right: "130px",
          width: 100,
        }}
      >
        Print
      </Button>
    );
  }, []);

  return (
    <Modal
      title="Interrogation Report Preview"
      visible={interrogationPopUp}
      width="60%"
      onCancel={() => {
        SetInterrogationPopUp(false);
      }}
      okButtonProps={{
        style: {
          display: "none",
        },
      }}
    >
      <ReactToPrint
        pageStyle={pageStyle}
        content={reactToPrintContent}
        documentTitle="Interrogation Report Preview"
        onAfterPrint={handleAfterPrint}
        onBeforeGetContent={handleOnBeforeGetContent}
        onBeforePrint={handleBeforePrint}
        removeAfterPrint
        trigger={reactToPrintTrigger}
      />
      {loading && <Loader />}
      <ComponentToPrint
        ref={componentRef}
        text={text}
        interrogationPopUp={interrogationPopUp}
        SetInterrogationPopUp={SetInterrogationPopUp}
        selectedRecord={selectedRecord}
        selectedAccusedValue={selectedAccusedValue}
        suspectAccusedList={suspectAccusedList}
      />
    </Modal>
  );
}
