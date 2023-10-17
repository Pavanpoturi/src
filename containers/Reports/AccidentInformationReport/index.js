import { useState, useEffect } from "react";
import Loader from "@components/utility/loader";
import { Form, Row, Table, Drawer } from "antd";
import { isEmpty, isUndefined } from "lodash";
import { reportTableConfig } from "../DSRReports/tableConfig";
import { useSelector, useDispatch } from "react-redux";
import { config } from "@config/site.config";
import moment from "moment";
import { DATE_YY_MM_DD, DATE_FORMAT } from "@containers/FirDetails/fir-util";
import { loadState } from "@lib/helpers/localStorage";
import masterDataActions from "@redux/masterData/actions";
import form54Action from "@redux/investigations/form54/actions";
import Form54 from "./Form54";
import ContentHeader from "./ContentHeader";
import { getActsAndSectionsDetails } from "../../const";
import { AIReportsContainer } from "./Styles";
import createFIRActions from "@redux/createFir/actions";

export default function MissingCases() {
  const [form] = Form.useForm();
  const [form54Form] = Form.useForm();
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const [selectedFir, setSelectedFir] = useState(null);
  const [selectedGenerationDate, setSelectedGenerationDate] = useState("");
  const [selectedTribunalDate, setSelectedTribunalDate] = useState("");
  const [selectedFromDate, setSelectedFromDate] = useState("");
  const [selectedToDate, setSelectedToDate] = useState("");
  const [selectedForm54, setSelectedForm54] = useState("");
  const { accidentInformationReport, isLoading } = useSelector(
    (state) => state.Form54
  );
  const { getAccidentInformationReport, getform54List } = form54Action;
  const { actList } = useSelector((state) => state.MasterData);
  const { getActList } = masterDataActions;
  const currentUser = loadState("currentUser");
  const disableButton =
    selectedFromDate === "" || selectedToDate === "" || selectedForm54 === "";
  const fromDateChange = (date, _dateString) => {
    setSelectedFromDate(moment(date).format(DATE_YY_MM_DD));
  };

  const toDateChange = (date, _dateString) => {
    setSelectedToDate(moment(date).format(DATE_YY_MM_DD));
  };

  const displayDrawer = (item) => {
    setVisible(true);
    dispatch(
      createFIRActions.getFIRData(`${config.getFIR}?crimeId=${item?._id}`)
    );
    form54Form.setFieldsValue({
      firNum: item?.firNum,
      firDate: item?.firDate ? moment(item?.firDate).format(DATE_FORMAT) : "",
      referenceNumber: "",
      generationDate: "",
      dateSentToTribunal: "",
    });
  };

  const fetchForm54List = (crimeId) => {
    dispatch(getform54List(`${config.form54}?crimeId=${crimeId}`));
  };

  const submitReport = () => {
    let isForm54Submitted = "";
    if (selectedForm54 === "Created") {
      isForm54Submitted = true;
    } else if (selectedForm54 === "Not Created") {
      isForm54Submitted = false;
    } else if (selectedForm54 === "All") {
      isForm54Submitted = "All";
    }
    dispatch(
      getAccidentInformationReport(
        `${config.accidentInformationReport}?psCode=${currentUser?.cctns_unit_id}&fromDate=${selectedFromDate}&toDate=${selectedToDate}&form54Submitted=${isForm54Submitted}`
      )
    );
  };

  const onClose = () => {
    setVisible(false);
    setSelectedFir(null);
    form54Form.resetFields();
    setSelectedGenerationDate("");
    setSelectedTribunalDate("");
    submitReport();
  };

  useEffect(() => {
    dispatch(getActList(`${config.getMasterData}/ACT`));
  }, []);

  const tableConfig = reportTableConfig.find(
    (c) => c.typeName === "Accident Information Report"
  )?.data;

  let uniqueId = 0;
  const columns = [];

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
        case "FIR No":
          columns.push({
            title: "FIR No",
            dataIndex: "FIR No",
            rowKey: "FIR No",
            render: (_i, item) => (
              <span className="tableRowText">{item?.firNum}</span>
            ),
          });
          break;
        case "FIR Date":
          columns.push({
            title: "FIR Date",
            dataIndex: "FIR Date",
            rowKey: "FIR Date",
            render: (_i, item) => (
              <span className="tableRowText">
                {item?.firDate ? moment(item?.firDate).format(DATE_FORMAT) : ""}
              </span>
            ),
          });
          break;
        case "Acts and Sections":
          columns.push({
            title: "Acts and Sections",
            dataIndex: "Acts and Sections",
            rowKey: "Acts and Sections",
            render: (_i, item) => {
              const actsAndSections = item?.actsAndSections;
              return getActsAndSectionsDetails(actsAndSections, actList);
            },
          });
          break;
        case "Reference No":
          columns.push({
            title: "Reference No",
            dataIndex: "Reference No",
            rowKey: "Reference No",
            render: (_i, item) => {
              return (
                !isUndefined(item?.form54Details) &&
                !isEmpty(item?.form54Details) &&
                item?.form54Details.map((data, index) => {
                  return (
                    <div
                      className="tableRowText"
                      key={index}
                      style={{
                        borderBottom:
                          item?.form54Details.length - 2 === index
                            ? "1px solid rgba(0, 0, 0, 0.06)"
                            : "unset",
                      }}
                    >
                      {item?.form54Details.length > 1 && (
                        <span>{index + 1}-</span>
                      )}
                      <span style={{ marginLeft: 5 }}>
                        {data?.referenceNumber}
                      </span>
                    </div>
                  );
                })
              );
            },
          });
          break;
        case "Generated Date":
          columns.push({
            title: "Generated Date",
            dataIndex: "Generated Date",
            rowKey: "Generated Date",
            render: (_i, item) => {
              return (
                !isUndefined(item?.form54Details) &&
                !isEmpty(item?.form54Details) &&
                item?.form54Details.map((data, index) => {
                  return (
                    <div
                      className="tableRowText"
                      key={index}
                      style={{
                        borderBottom:
                          item?.form54Details.length - 2 === index
                            ? "1px solid rgba(0, 0, 0, 0.06)"
                            : "unset",
                      }}
                    >
                      <span style={{ marginLeft: 5 }}>
                        {data?.generationDate
                          ? moment(data?.generationDate).format(DATE_FORMAT)
                          : ""}
                      </span>
                    </div>
                  );
                })
              );
            },
          });
          break;
        case "Tribunal Date":
          columns.push({
            title: "Tribunal Date",
            dataIndex: "Tribunal Date",
            rowKey: "Tribunal Date",
            render: (_i, item) => {
              return (
                !isUndefined(item?.form54Details) &&
                !isEmpty(item?.form54Details) &&
                item?.form54Details.map((data, index) => {
                  return (
                    <div
                      className="tableRowText"
                      key={index}
                      style={{
                        borderBottom:
                          item?.form54Details.length - 2 === index
                            ? "1px solid rgba(0, 0, 0, 0.06)"
                            : "unset",
                      }}
                    >
                      <span style={{ marginLeft: 5 }}>
                        {data?.dateSentToTribunal
                          ? moment(data?.dateSentToTribunal).format(DATE_FORMAT)
                          : ""}
                      </span>
                    </div>
                  );
                })
              );
            },
          });
          break;
        case "Actions":
          columns.push({
            title: "Actions",
            dataIndex: "Actions",
            rowKey: "Actions",
            render: (_i, item) => {
              return (
                <span
                  className="tableRowTextUl"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    displayDrawer(item);
                    setSelectedFir(item);
                    fetchForm54List(item?._id);
                  }}
                >
                  {!!item?.isForm54 ? (
                    <>
                      {isUndefined(item?.form54Details) ||
                      isEmpty(item?.form54Details)
                        ? "Create Form-54"
                        : "View / Update Form-54"}
                    </>
                  ) : null}
                </span>
              );
            },
          });
          break;
        default:
          break;
      }
    });

  return (
    <AIReportsContainer>
      <ContentHeader
        headerTitle="Accident Information Report"
        submitReport={submitReport}
        disabled={disableButton}
        form={form}
        setSelectedForm54={setSelectedForm54}
        fromDateChange={fromDateChange}
        toDateChange={toDateChange}
        selectedFromDate={selectedFromDate}
      />
      {isLoading ? (
        <Loader />
      ) : (
        !isEmpty(accidentInformationReport) && (
          <Row gutter={24} style={{ paddingLeft: 10 }}>
            <Table
              dataSource={accidentInformationReport}
              columns={columns}
              rowKey={(record) => {
                if (!record.__uniqueId) record.__uniqueId = ++uniqueId;
                return record.__uniqueId;
              }}
              style={{ bordeRadius: 5, width: "99%" }}
              showSorterTooltip={false}
              pagination={false}
            />
          </Row>
        )
      )}
      <Drawer
        placement="right"
        size="large"
        onClose={onClose}
        visible={visible}
        width="60%"
      >
        <Form54
          selectedFir={selectedFir}
          form54Form={form54Form}
          selectedGenerationDate={selectedGenerationDate}
          setSelectedGenerationDate={setSelectedGenerationDate}
          selectedTribunalDate={selectedTribunalDate}
          setSelectedTribunalDate={setSelectedTribunalDate}
        />
      </Drawer>
    </AIReportsContainer>
  );
}
