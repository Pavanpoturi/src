import { useState, useEffect } from "react";
import Loader from "@components/utility/loader";
import { isUndefined, isEmpty } from "lodash";
import { Row, Col } from "antd";
import { reportTableConfig } from "../tableConfig";
import { useSelector, useDispatch } from "react-redux";
import reportsActions from "@redux/reports/actions";
import TableWrapper from "@containers/Tables/AntTables/AntTables.styles";
import { DATE_YY_MM_DD } from "@containers/FirDetails/fir-util";
import { config } from "@config/site.config";
import {
  getPersonPersonalAddress,
  DATE_FORMAT,
} from "@containers/FirDetails/fir-util";
import moment from "moment";
import { loadState } from "@lib/helpers/localStorage";
import ContentHeader from "../ContentHeader";
import { getReportDate } from "../const";
import {
  IS_IO,
  IS_SHO,
  IS_INVESTIGATION_OFFICER,
} from "@containers/FirDetails/fir-util";

export default function WantedPersons() {
  const dispatch = useDispatch();
  const [selectedDate, setSelectedDate] = useState("");
  const [SelectedDefaultDate, setSelectedDefaultDate] = useState(new Date());
  const { fetchArrestCases, downloadReports } = reportsActions;
  const { updatedPsCode, dropDownData } = useSelector((state) => state.FIR);
  const { arrests, isFetching } = useSelector((state) => state.Reports);
  const currentUser = loadState("currentUser");
  const getpsCode = dropDownData.map((data) => data?.ps_code).join(",");
  const psCode = !isEmpty(updatedPsCode) ? updatedPsCode : getpsCode;
  const { data } = arrests;
  const userRole = [IS_SHO, IS_IO, IS_INVESTIGATION_OFFICER];
  const IS_HIGHER_SHO_USER = !userRole?.includes(currentUser?.ecopsv2_role)

  useEffect(() => {
    if (selectedDate !== "") {
      console.log(selectedDate, "selectedDate");
      getArrestedCases(selectedDate);
    }
  }, [psCode]);
  const getArrestedCases = (date) => {
    if (IS_HIGHER_SHO_USER && !!currentUser?.isIo === false) {
      dispatch(
        fetchArrestCases(
          `${config.getArrestedCases}?psCode=${psCode}&date=${date}&higherOfficer=true`
        )
      );
    } else {
      dispatch(
        fetchArrestCases(
          `${config.getArrestedCases}?psCode=${currentUser?.cctns_unit_id}&date=${date}`
        )
      );
    }
  };

  const downloadAsXls = () => {
    if (IS_HIGHER_SHO_USER && !!currentUser?.isIo === false) {
      dispatch(
        downloadReports(
          `${config.downloadArrestedCases}?psCode=${psCode}&date=${selectedDate}&higherOfficer=true`,
          "DSR_Arrest_Report"
        )
      );
    } else {
      dispatch(
        downloadReports(
          `${config.downloadArrestedCases}?psCode=${currentUser?.cctns_unit_id}&date=${selectedDate}`,
          "DSR_Arrest_Report"
        )
      );
    }
  };

  useEffect(() => {
    const date = new Date()
    const dateFormat = moment(date).format(DATE_YY_MM_DD);
    onChange(date, dateFormat)
  }, []);
  const onChange = (date, dateString) => {
    if (dateString !== "") {
      setSelectedDefaultDate(date)
      const dateFormat = moment(date).format(DATE_YY_MM_DD);
      setSelectedDate(dateFormat);
      getArrestedCases(dateFormat);
    }
  };

  const tableCrime = reportTableConfig.find(
    (c) => c.typeName === "Crime Classification"
  )?.data;

  let uniqueId = 0;
  const crimeColumns = [];

  tableCrime &&
    tableCrime.map((headTitle, _index) => {
      switch (headTitle) {
        case "S.No":
          crimeColumns.push({
            title: "S.No",
            dataIndex: "S.NO",
            rowKey: "S.NO",
            render: (_i, item) => {
              return <span className="tableRowText">{item.__uniqueId}</span>;
            },
          });
          break;
        case "Prop.Offn":
          crimeColumns.push({
            title: "Prop.Offn",
            dataIndex: "Prop.Offn",
            rowKey: "Prop.Offn",
            render: (_i, item) => (
              <span className="tableRowText">{item?.prop}</span>
            ),
          });
          break;
        case "Bodily Offn":
          crimeColumns.push({
            title: "Bodily Offn",
            dataIndex: "Bodily Offn",
            rowKey: "Bodily Offn",
            render: (_i, item) => (
              <span className="tableRowText">{item?.bodilyOffence}</span>
            ),
          });
          break;
        case "White Collar Offn":
          crimeColumns.push({
            title: "White Collar Offn",
            dataIndex: "White Collar Offn",
            rowKey: "White Collar Offn",
            render: (_i, item) => (
              <span className="tableRowText">{item?.whiteCollar}</span>
            ),
          });
          break;
        case "Crm.Against Women":
          crimeColumns.push({
            title: "Crm.Against Women",
            dataIndex: "Crm.Against Women",
            rowKey: "Crm.Against Women",
            render: (_i, item) => (
              <span className="tableRowText">{item?.againstWomen}</span>
            ),
          });
          break;
        case "SC/ST POA":
          crimeColumns.push({
            title: "SC/ST POA",
            dataIndex: "SC/ST POA",
            rowKey: "SC/ST POA",
            render: (_i, item) => (
              <span className="tableRowText">{item?.scST}</span>
            ),
          });
          break;
        case "Oth.IPC":
          crimeColumns.push({
            title: "Oth.IPC",
            dataIndex: "Oth.IPC",
            rowKey: "Oth.IPC",
            render: (_i, item) => (
              <span className="tableRowText">{item?.other}</span>
            ),
          });
          break;
        case "Total":
          crimeColumns.push({
            title: "Total",
            dataIndex: "Total",
            rowKey: "Total",
            render: (_i, item) => (
              <span className="tableRowText">{item?.total}</span>
            ),
          });
          break;
        default:
          break;
      }
    });

  const columns = [];
  let s_no = 0;

  const tableConfig = reportTableConfig.find(
    (c) => c.typeName === "Arrested Wanted Persons"
  )?.data;

  tableConfig &&
    tableConfig.map((headTitle, _index) => {
      switch (headTitle) {
        case "S.No":
          columns.push({
            title: "S.No",
            dataIndex: "S.NO",
            rowKey: "S.NO",
            render: (_i, item) => (
              <span className="tableRowText">{item.__uniqueId}</span>
            ),
          });
          break;
        case "Crime Number":
          columns.push({
            title: "Crime No.",
            dataIndex: "Crime Number",
            rowKey: "Crime Number",
            render: (_i, item) => {
              return <span className="tableRowText">{item?.firNum}</span>;
            },
          });
          break;
        case "Name and Address of the Persons Arrested":
          columns.push({
            title: (
              <div>
                {" "}
                Name & Address Of the Person Arrested/ 41A CrPC Notice Issued
              </div>
            ),
            dataIndex: "Name and Address of the Persons Arrested",
            rowKey: "Name and Address of the Persons Arrested",
            render: (_i, item) => {
              const accusedAddress =
                !isUndefined(item?.accusedAddress) &&
                !isEmpty(item?.accusedAddress) &&
                getPersonPersonalAddress(item?.accusedAddress);
              return (
                <span className="tableRowText">
                  {`${item?.accusedName}${accusedAddress ? "," : ""} ${accusedAddress ? accusedAddress : ""
                    }`}
                </span>
              );
            },
          });
          break;
        case "Type":
          columns.push({
            title: "Type",
            dataIndex: "Type",
            rowKey: "Type",
            render: (_i, item) => (
              <span className="tableRowText">{item?.arrestType}</span>
            ),
          });
          break;
        case "Date of Arrest":
          columns.push({
            title: "Date Of Arrest/ 41A CrPC Notice Issued",
            dataIndex: "Date of Arrest",
            rowKey: "Date of Arrest",
            render: (_i, item) => (
              <span className="tableRowText">
                {item?.dateOfArrest
                  ? moment(item?.dateOfArrest).format(DATE_FORMAT)
                  : ""}
              </span>
            ),
          });
          break;
        case "District":
          IS_HIGHER_SHO_USER &&
            columns.push({
              title: "District Name",
              dataIndex: "District Name",
              rowKey: "DistrictName",
              render: (_i, item) => {
                return (
                  <div className="tableRowText" style={{ textAlign: "center" }}>
                    {item?.district}
                  </div>)
              },
            });
          break;
        case "PS Name":
          IS_HIGHER_SHO_USER &&
            columns.push({
              title: "PS Name",
              dataIndex: "PS Name",
              rowKey: "PSName",
              render: (_i, item) => {
                return (
                  <div className="tableRowText" style={{ textAlign: "center" }}>
                    {item?.psName?.split(" PS(")[0]}
                  </div>)
              },
            });
          break;
        default:
          break;
      }
    });

  return (
    <>
      <ContentHeader
        headerTitle="Arrest/Wanted Persons"
        onChange={onChange}
        downloadAsXls={downloadAsXls}
        disabled={selectedDate === ""}
        defaultDate={SelectedDefaultDate}
      />
      {isFetching ? (
        <Loader />
      ) : (
        selectedDate !== "" &&
        selectedDate !== "Invalid date" && (
          <>
            {getReportDate("Known Accused Arrest Particulars:", selectedDate)}
            <Row gutter={24} style={{ paddingLeft: 10 }}>
              <TableWrapper
                dataSource={data?.arrests}
                columns={columns}
                pagination={false}
                rowKey={(record) => {
                  if (!record.__uniqueId) record.__uniqueId = ++uniqueId;
                  return record.__uniqueId;
                }}
                style={{ bordeRadius: 5, width: "98%" }}
                showSorterTooltip={false}
                size="small"
              />
            </Row>
            <Row gutter={24} style={{ marginTop: 15 }}>
              <Col span={24} style={{ marginBottom: 10 }}>
                <h3 className="pageTitle" style={{ color: "#454647" }}>
                  Known Accused Yet to be Arrested
                </h3>
              </Col>
              <Col span={24}>
                <TableWrapper
                  dataSource={data?.yetToArrested}
                  columns={crimeColumns}
                  pagination={false}
                  rowKey={(record) => {
                    if (!record.__uniqueId) record.__uniqueId = ++s_no;
                    return record.__uniqueId;
                  }}
                  style={{ bordeRadius: 5, width: "98%" }}
                  showSorterTooltip={false}
                  size="small"
                />
              </Col>
            </Row>
          </>
        )
      )}
    </>
  );
}
