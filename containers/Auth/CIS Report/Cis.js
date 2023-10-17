import { useState, useEffect } from "react";
import {
  DatePicker,
  Space,
  Select,
  Button,
  Form,
  Table,
  Row,
  Card,
  Col,
} from "antd";
import { HomeOutlined } from "@ant-design/icons";
import moment from "moment";
import { config } from "@config/site.config";
import reportsActions from "@redux/reports/actions";
import { useDispatch, useSelector } from "react-redux";
import { isUndefined, isNull, isEmpty } from "lodash";
import Loader from "@components/utility/loader";
import { DATE_FORMAT } from "@containers/FirDetails/fir-util";
import masterDataActions from "@redux/masterData/actions";
import NoImage from "@assets/images/noImage.jpg";
import { CISReportContainer } from "./style";
import PrintLookOutNotice from "./PrintLookOutNotice";
import { saveAsExcel } from "@containers/media-util";

const CIS = () => {
  const reportsData = useSelector((state) => state.Reports);
  const cisData = useSelector((state) => state.Reports.CisDetails.data);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { fetchPsDetails, fetchCisDetails } = reportsActions;
  const dispatch = useDispatch();
  const [tableData_, setTableData_] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [tablePrintData, setTablePrintData] = useState([]);
  const [tablePrint, setTablePrint] = useState(false);
  const [tableDispaly, setTableDispaly] = useState(false);
  const [reportType, setReportType] = useState("");
  const [districtDetails, setDistrictDetails] = useState([]);
  const [psDisable, setPsDisable] = useState(false);
  const [psDetails, setPsDetails] = useState([]);
  const [data, setData] = useState({});
  const [disableData, setDisableData] = useState(false);
  const [disablePsData, setDisablePsData] = useState(false);
  const [disableDownLoadButton, setDisableDownLoadButton] = useState(false);
  const [form] = Form.useForm();
  const { getCisActList } = masterDataActions;

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const victim = tableData[0]?.victim?.victimType;
  const isUnknownDeadBody = victim === "Unknown Dead Body";

  const columns = [
    {
      title: "Sl.No",
      dataIndex: "slno",
      key: "slno",
    },
    {
      title: "Image",
      render: (_text, data, _i) => (
        <img
          src={
            !!data?.person?.media[0]?.fileId === true
              ? `${config?.downloadFile}?fileId=${data?.person?.media[0]?.fileId}`
              : NoImage
          }
          onError={({ currentTarget }) => {
            currentTarget.onerror = null; // prevents looping
            currentTarget.src = NoImage;
          }}
          width="70"
          height="70"
        />
      ),
    },
    {
      title: "Name",
      render: (_text, data) => <p>{data?.person?.personalDetails?.name}</p>,
    },
    {
      title: "Age",
      render: (_text, data) => (
        <p>
          {!!data?.person?.personalDetails?.age
            ? data?.person?.personalDetails?.age
            : ""}
        </p>
      ),
    },
    {
      title: "Gender",
      render: (_text, data) => (
        <p>
          {!!data?.person?.personalDetails?.gender
            ? data?.person?.personalDetails?.gender
            : ""}
        </p>
      ),
    },
    {
      title: "Father Name",
      render: (_text, data) => (
        <p>{data?.person?.personalDetails?.fatherHusbandGuardianName}</p>
      ),
    },
    {
      title: "Missing Date",
      dataIndex: "occurrenceOfOffenceDay",
      key: "occurrenceOfOffenceDay",
    },
    {
      title: "District/Unit",
      dataIndex: "psDistrict",
      key: " psDistrict",
    },
    {
      title: "Police Station",
      render: (_text, data) => (
        <p>{!!data?.psName ? data?.psName?.split(" PS(")[0] : ""}</p>
      ),
    },
    {
      title: "Actions",
      key: "action",
      render: (_, record) => (
        <a
          onClick={() => {
            setTableData_([record]);
            setIsModalVisible(true);
          }}
        >
          <u>
            <strong>Download Report</strong>
          </u>
        </a>
      ),
    },
  ];

  const columns_ = [
    {
      title: "Sl.No",
      dataIndex: "slno",
      key: "slno",
    },
    {
      title: "Image",
      render: (_text, data, _i) => (
        <img
          src={
            !!data?.person?.media[0]?.fileId === true
              ? `${config?.downloadFile}?fileId=${data?.person?.media[0]?.fileId}`
              : NoImage
          }
          onError={({ currentTarget }) => {
            currentTarget.onerror = null; // prevents looping
            currentTarget.src = NoImage;
          }}
          width="70"
          height="70"
        />
      ),
    },
    {
      title: " Approx. Age",
      render: (_text, tableData) => (
        <p>
          {tableData?.crimeClassification?.other?.approximateAge
            ? tableData?.crimeClassification?.other?.approximateAge
            : ""}
        </p>
      ),
    },
    {
      title: " Gender",
      render: (_text, tableData) => (
        <p>
          {tableData?.crimeClassification?.other?.gender
            ? tableData?.crimeClassification?.other?.gender
            : ""}
        </p>
      ),
    },
    {
      title: "Found Date",
      dataIndex: "occurrenceOfOffenceDay",
      key: "occurrenceOfOffenceDay",
    },
    {
      title: "District/Unit",
      dataIndex: "psDistrict",
      key: " psDistrict",
    },
    {
      title: "Police Station",
      render: (_text, data) => (
        <p>{!!data?.psName ? data?.psName?.split(" PS(")[0] : ""}</p>
      ),
    },
    {
      title: "Actions",
      key: "action",
      render: (_, record) => (
        <a
          onClick={() => {
            setTableData_([record]);
            setIsModalVisible(true);
          }}
        >
          <u>
            <strong>Download Report</strong>
          </u>
        </a>
      ),
    },
  ];

  useEffect(() => {
    dispatch(getCisActList(config?.cisActsAndSection));
  }, [dispatch]);

  useEffect(() => {
    let res = reportsData?.psDetails;
    var district = [];
    var ps = [];

    for (let i = 0; i < res?.length; i++) {
      if (
        !district.some((data) => data?.value === res[i]?.dist_code) &&
        !!res[i]?.district_commissionerate === true
      ) {
        district.push({
          value: res[i]?.dist_code,
          label: res[i]?.district_commissionerate,
          disabled: disableData ? true : false,
        });
      }
      if (
        !ps.some((data) => data?.value === res[i]?.ps_code) &&
        !!res[i]?.ps_name === true
      ) {
        ps.push({
          value: res[i]?.ps_code,
          label: res[i]?.ps_name,
          disabled: disableData || disablePsData ? true : false,
        });
      }
    }

    const sortedNames = ps.sort(function (a, b) {
      if (a.label < b.label) {
        return -1;
      }
      if (a.label > b.label) {
        return 1;
      }
      return 0;
    });

    const sortedDistrictNames = district.sort(function (a, b) {
      if (a.label < b.label) {
        return -1;
      }
      if (a.label > b.label) {
        return 1;
      }
      return 0;
    });

    sortedDistrictNames.unshift({
      value: "select_all",
      label: "Select All",
    });

    sortedNames?.unshift({ value: "select_all", label: "Select All" });
    setDistrictDetails(sortedDistrictNames);
    setPsDetails(sortedNames);
    setTableData([]);
    if (tableDispaly === true) {
      let occurrenceOfOffenceDay = "";

      for (let i = 0; i < reportsData?.CisDetails?.data?.length; i++) {
        const occurenceOfOffence =
          reportsData?.CisDetails?.data[i]?.occurenceOfOffence;
        if (occurenceOfOffence?.fromDate && occurenceOfOffence?.toDate) {
          occurrenceOfOffenceDay = moment(occurenceOfOffence?.toDate).format(
            DATE_FORMAT
          );
        } else if (
          !occurenceOfOffence?.toDate &&
          occurenceOfOffence?.fromDate
        ) {
          occurrenceOfOffenceDay = moment(occurenceOfOffence?.fromDate).format(
            DATE_FORMAT
          );
        } else if (
          occurenceOfOffence?.toDate &&
          !occurenceOfOffence?.fromDate
        ) {
          occurrenceOfOffenceDay = moment(occurenceOfOffence?.toDate).format(
            DATE_FORMAT
          );
        } else if (
          !isUndefined(occurenceOfOffence?.priorToDate) &&
          !isNull(occurenceOfOffence?.priorToDate)
        ) {
          occurrenceOfOffenceDay = moment(
            occurenceOfOffence?.priorToDate
          ).format(DATE_FORMAT);
        } else {
          occurrenceOfOffenceDay = "";
        }
        Object.assign(reportsData?.CisDetails?.data[i], {
          occurrenceOfOffenceDay: occurrenceOfOffenceDay,
          slno: i + 1,
        });
      }
      const printDataTable = !!reportsData?.CisDetails?.status
        ? reportsData?.CisDetails?.data
        : [];
      setTableData(printDataTable);
      if (tablePrint === false) {
        const items = printDataTable.slice(0, 100);
        setTablePrintData(items);
      }
      setDisableDownLoadButton(
        !!reportsData?.CisDetails?.data &&
          reportsData?.CisDetails?.data.length !== 0
          ? false
          : true
      );
    }
  }, [reportsData]);

  useEffect(() => {
    dispatch(fetchPsDetails(`${config.getTsHierarchyList}`));
  }, [dispatch]);

  useEffect(() => {
    window.history.pushState(null, null, window.location.href);
    window.onpopstate = function () {
      window.history.go(1);
    };
  }, []);

  const onChange = (date, _dateString, name) => {
    const confirmDate = moment(date).format("MM-DD-YYYY");
    console.log(name, confirmDate);
    setTableDispaly(false);
    setData({ ...data, [name]: confirmDate });
  };

  const handleChange = async (value) => {
    form.setFieldsValue({ psCode: [] });
    const isSelectAll = value[0] === "select_all";
    setTableDispaly(false);
    if (isSelectAll) {
      setDisableData(true);
    } else {
      setDisableData(false);
    }
    let res = reportsData?.psDetails;
    var ps = [];
    var district = [];
    for (let i = 0; i < res?.length; i++) {
      if (
        !district.some((data) => data?.value === res[i]?.dist_code) &&
        !!res[i]?.district_commissionerate === true
      ) {
        district.push({
          value: res[i]?.dist_code,
          label: res[i]?.district_commissionerate,
          disabled: isSelectAll && value?.length !== 0 ? true : false,
        });
      }
      if (value?.length !== 0 && value[0] !== "select_all") {
        for (let j = 0; j < value?.length; j++) {
          if (res[i]?.dist_code === value[j]) {
            if (
              !ps.some((data) => data?.value === res[i]?.ps_code) &&
              !!res[i]?.ps_name === true
            ) {
              ps.push({
                value: res[i]?.ps_code,
                label: res[i]?.ps_name,
                disabled: isSelectAll && value?.length !== 0 ? true : false,
              });
            }
          }
        }
        setPsDisable(false);
      } else {
        if (
          !ps.some((data) => data?.value === res[i]?.ps_code) &&
          !!res[i]?.ps_name === true &&
          value[0] !== "select_all"
        ) {
          ps.push({
            value: res[i]?.ps_code,
            label: res[i]?.ps_name,
            disabled: isSelectAll && value?.length !== 0 ? true : false,
          });
          setPsDisable(false);
        }
        if (isSelectAll) {
          setPsDisable(true);
        }
      }
    }

    const sortedDistrictNames = district.sort(function (a, b) {
      if (a.label < b.label) {
        return -1;
      }
      if (a.label > b.label) {
        return 1;
      }
      return 0;
    });

    const sortedNames = ps.sort(function (a, b) {
      if (a.label < b.label) {
        return -1;
      }
      if (a.label > b.label) {
        return 1;
      }
      return 0;
    });

    sortedNames?.unshift({
      value: "select_all",
      label: "Select All",
      disabled: isSelectAll && value?.length !== 0 ? true : false,
    });

    sortedDistrictNames.unshift({
      value: "select_all",
      label: "Select All",
      disabled: value[0] !== "select_all" && value?.length !== 0 ? true : false,
    });
    setPsDetails(sortedNames);
    setDistrictDetails(sortedDistrictNames);
  };

  const onFinish = async (values) => {
    const obj = {
      psCodes: !!values?.psCode ? values?.psCode : [],
      fromDate: data?.fromDate,
      toDate: data.toDate,
      lookOutType: values?.report,
      districtCodes: !!values?.district_code ? values?.district_code : [],
    };
    setTableDispaly(true);
    dispatch(fetchCisDetails(`${config.getUnknownMissingPDFs}`, obj));
  };

  const missingDate = (occurenceOfOffence) => {
    if (occurenceOfOffence?.fromDate && occurenceOfOffence?.toDate) {
      return moment(occurenceOfOffence?.toDate).format(DATE_FORMAT);
    } else if (!occurenceOfOffence?.toDate && occurenceOfOffence?.fromDate) {
      return moment(occurenceOfOffence?.fromDate).format(DATE_FORMAT);
    } else if (occurenceOfOffence?.toDate && !occurenceOfOffence?.fromDate) {
      return moment(occurenceOfOffence?.toDate).format(DATE_FORMAT);
    } else if (
      !isUndefined(occurenceOfOffence?.priorToDate) &&
      !isNull(occurenceOfOffence?.priorToDate)
    ) {
      return moment(occurenceOfOffence?.priorToDate).format(DATE_FORMAT);
    }
    return "";
  };

  const handleDownloadExcel = () => {
    let data = [];
    let fileName = "Deadbody_wise_report";
    if (isUnknownDeadBody) {
      data = cisData
        ? cisData.map((item, ind) => {
            return {
              "S.No": ind + 1,
              Name: "",
              Age: item?.crimeClassification?.other?.approximateAge || "",
              Gender: item?.crimeClassification?.other?.gender || "",
              "Father Name": "",
              "Found Date": item?.occurenceOfOffence
                ? missingDate(item?.occurenceOfOffence)
                : "",
              District: item?.psDistrict || "",
              "Police Station": item?.psName
                ? item?.psName?.split(" PS(")[0]
                : "",
              Status: item?.isTraced ? "Traced" : "Untraced",
            };
          })
        : [];
    } else {
      data = cisData
        ? cisData.map((item, ind) => {
            const personalDetails = item?.person?.personalDetails;
            return {
              "S.No": ind + 1,
              Name: `${personalDetails?.name || ""} ${
                personalDetails?.surname || ""
              }`,
              Age: personalDetails?.age || "",
              Gender: personalDetails?.gender || "",
              "Father Name": personalDetails?.fatherHusbandGuardianName || "",
              "Missing Date": item?.occurenceOfOffence
                ? missingDate(item?.occurenceOfOffence)
                : "",
              District: item?.psDistrict || "",
              "Police Station": item?.psName
                ? item?.psName?.split(" PS(")[0]
                : "",
              Status: item?.isTraced ? "Traced" : "Untraced",
            };
          })
        : [];
      fileName = "Missing_Person_wise_report";
    }
    saveAsExcel(data, fileName);
  };

  const handlePsChange = (value) => {
    const isSelectAll = value[0] === "select_all";
    if (isSelectAll) {
      setDisablePsData(true);
    } else {
      setDisablePsData(false);
    }
    const psList = [...psDetails];
    for (let i = 0; i < psList.length; i++) {
      if (i !== 0) {
        Object.assign(psList[i], {
          disabled: isSelectAll && value?.length !== 0 ? true : false,
        });
      }
      if (value[0] !== "select_all" && value?.length !== 0) {
        Object.assign(psList[i], {
          disabled: i === 0 ? true : false,
        });
      }
      if (value?.length === 0) {
        Object.assign(psList[i], {
          disabled: false,
        });
      }
    }
    setPsDetails([]);
    setPsDetails(psList);
  };

  const onTabChange = (page, pageSize) => {
    let res = !!reportsData?.CisDetails?.status
      ? reportsData?.CisDetails?.data
      : [];
    if (res?.length !== 0) {
      const it = (page - 1) * pageSize;
      const items = res.slice(it, it + pageSize);
      console.log("items", items);
      setTablePrint(true);
      setTablePrintData(items);
    }
  };

  return (
    <div>
      <Row
        style={{ backgroundColor: "#023F6E", minHeight: 50, marginBottom: 10 }}
      >
        <Space>
          <HomeOutlined
            onClick={() => (document.location.href = "/")}
            style={{ fontSize: 20, marginLeft: 10, color: "white" }}
          />
          <h2 style={{ color: "white" }}>CIS REPORT</h2>
        </Space>
      </Row>
      <Form
        name="control-hooks"
        form={form}
        onFinish={onFinish}
        style={{ padding: 5 }}
      >
        <Card>
          <Space
            style={{
              padding: "5px",
              width: "100%",
              justifyContent: "space-around",
              display: "flex",
            }}
            size={12}
          >
            <Form.Item
              name="fromDate"
              label="Start Date"
              rules={[{ required: true }]}
            >
              <DatePicker
                onChange={(date, dateString) =>
                  onChange(date, dateString, "fromDate")
                }
                format="DD-MM-YYYY"
              />
            </Form.Item>
            <Form.Item
              name="toDate"
              label="End Date"
              rules={[{ required: true }]}
            >
              <DatePicker
                onChange={(date, dateString) =>
                  onChange(date, dateString, "toDate")
                }
                format="DD-MM-YYYY"
              />
            </Form.Item>
            <Form.Item
              name="report"
              label="Report Type"
              rules={[{ required: true }]}
            >
              <Select
                style={{ width: 150 }}
                placeholder="Select"
                onChange={setReportType}
                options={[
                  {
                    value: "Missing",
                    label: "Missing Person",
                  },
                  {
                    value: "Unknown Dead Body",
                    label: "Unknown Dead Body",
                  },
                ]}
              />
            </Form.Item>
            <Form.Item name="district_code" label="District">
              <Select
                style={{ width: 150 }}
                onChange={handleChange}
                options={districtDetails}
                showSearch
                mode="multiple"
                placeholder="Select"
                filterOption={(input, option) =>
                  (option?.label.toLowerCase() ?? "").includes(
                    input.toLowerCase()
                  )
                }
              />
            </Form.Item>
            <Form.Item
              name="psCode"
              label="Police Station"
              rules={[{ required: !psDisable }]}
            >
              <Select
                style={{ width: 150 }}
                options={psDetails}
                onChange={handlePsChange}
                mode="multiple"
                showSearch
                disabled={psDisable}
                placeholder="Select"
                filterOption={(input, option) =>
                  (option?.label.toLowerCase() ?? "").includes(
                    input.toLowerCase()
                  )
                }
              />
            </Form.Item>
            <Button
              style={{
                background: "#02599C",
                color: "white",
              }}
              htmlType="submit"
            >
              Go
            </Button>
          </Space>
        </Card>
      </Form>

      {tableDispaly ? (
        <>
          {tableData && !isEmpty(tableData) && !reportsData?.isFetching ? (
            <Row gutter={24} justify="end" style={{ marginTop: 20 }}>
              <Col span={4}>
                <Button
                  style={{
                    background: "#02599C",
                    color: "white",
                  }}
                  disabled={disableDownLoadButton}
                  onClick={() => {
                    handleDownloadExcel();
                  }}
                >
                  Download Full Report ( Excel )
                </Button>
              </Col>
              <Col span={4}>
                <Button
                  style={{
                    background: "#02599C",
                    color: "white",
                  }}
                  disabled={disableDownLoadButton}
                  onClick={() => {
                    setTableData_(tablePrintData);
                    setIsModalVisible(true);
                  }}
                >
                  Download Full Report
                </Button>
              </Col>
            </Row>
          ) : null}
          <CISReportContainer>
            {reportsData?.isFetching ? (
              <Loader />
            ) : (
              <Card>
                {!isEmpty(tableData) ? (
                  <Table
                    dataSource={tableData}
                    columns={isUnknownDeadBody ? columns_ : columns}
                    showSorterTooltip={false}
                    pagination={{
                      defaultPageSize: 100,
                      showSizeChanger: true,
                      pageSizeOptions: ["100", "200", "300", "400", "500"],
                      onChange: (page, pageSize) => onTabChange(page, pageSize),
                    }}
                  />
                ) : (
                  <h4
                    style={{
                      color: "red",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: 20,
                    }}
                  >
                    No Records are available for the selected criteria
                  </h4>
                )}
              </Card>
            )}
          </CISReportContainer>
        </>
      ) : null}
      {isModalVisible && (
        <PrintLookOutNotice
          reportType={reportType}
          tableData={tableData_}
          isModalVisible={isModalVisible}
          handleCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default CIS;
