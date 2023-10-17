import moment from "moment";
import { Link, useRouteMatch } from "react-router-dom";
import TableWrapper from "@containers/Tables/AntTables/AntTables.styles";
import { useDispatch, useSelector } from "react-redux";
import appActions from "@redux/app/actions";
import form54Action from "@redux/investigations/form54/actions";
import { actDatalocal, DATE_FORMAT } from "@containers/FirDetails/fir-util";
import { getActsAndSectionsDetails } from "../../const";
import { TableWidgetWrapper } from "./TableWidget.styles";
import chargesheetActions from "@redux/investigations/chargesheet/actions";
import { useState } from "react";
import { isEmpty, isNull, isUndefined } from "lodash";
import { Modal, Button, Select, Space } from "antd";
import { config } from "@config/site.config";
export default function TableWidget({
  dataSource,
  label,
  shadowColor,
  actList,
  ISHIGHERSHOUSER,
}) {
  const { hideSideMenu } = appActions;
  const { resetAccidentInformationReport } = form54Action;
  const dispatch = useDispatch();
  const [firData, setFirData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { getChargesheetList } = chargesheetActions;
  const match = useRouteMatch();
  const [chargeSheetDate, setChargeSheetDate] = useState(null);
  const Chargesheet = useSelector((state) => state.Chargesheet);
  const getChargesheetListData = () => {
    let list = [];
    !isEmpty(Chargesheet?.chargesheetList) &&
      Chargesheet?.chargesheetList.map((item) => {
        const courtAndProsecution = item?.courtAndProsecution;
        if (
          !isUndefined(courtAndProsecution) &&
          courtAndProsecution?.updateChargesheetId !== ""
        ) {
          const result = {
            _id: item?._id,
            value: courtAndProsecution?.updateChargesheetId,
            label: courtAndProsecution?.chargesheetNo,
            chargesheetNo: courtAndProsecution?.chargesheetNo,
            caseType: courtAndProsecution?.caseType,
            chargesheetDate: courtAndProsecution?.chargesheetDate,
            courtCaseNo: courtAndProsecution?.courtCaseNo,
            courtName: courtAndProsecution?.courtName,
            updateChargesheetId: courtAndProsecution?.updateChargesheetId,
          };
          list.push(result);
        }
      });
    return list;
  };
  const columns = [
    {
      title: "FIR",
      dataIndex: "Fir",
      rowKey: "Fir",
      render: (_i, item) =>
        item?.caseStatus !== "PT Cases" ? (
          <Link
            to={{
              pathname:
                ISHIGHERSHOUSER === true
                  ? `./dashboard/Fir/${item._id}`
                  : `${match.path}fir/${item._id}`,
            }}
            onClick={() => {
              localStorage.setItem(
                "selectedActDetails",
                JSON.stringify(actDatalocal(item.firDetail, actList))
              );
              localStorage.setItem(
                "selectedFir",
                JSON.stringify(item.firDetail)
              );
              localStorage.setItem("selectedCaseStatus", item.caseStatus);
              localStorage.setItem("selectedFirId", JSON.stringify(item._id));
              dispatch(hideSideMenu());
              dispatch(resetAccidentInformationReport());
            }}
          >
            <span className="tableRowTextFir">{item.firDetail.firNum}</span>
          </Link>
        ) : (
          <Link
            onClick={() => {
              dispatch(
                getChargesheetList(
                  `${config.getChargeSheet}?crimeId=${item._id}`
                )
              );
              setFirData(item);
              setIsModalOpen(true);
            }}
          >
            <span className="tableRowTextFir">{item.firDetail.firNum}</span>
          </Link>
        ),
    },
    {
      title: "LAST UPDATED",
      dataIndex: "updated",
      rowKey: "updated",
      render: (last_update_date) => (
        <span className="tableRowText">
          {moment(last_update_date).format(DATE_FORMAT)}
        </span>
      ),
    },
    {
      title: "SECTION OF LAW",
      dataIndex: "sectionOfLaw",
      rowKey: "sectionOfLaw",
      render: (_i, item) => {
        const actsAndSections = item?.firDetail?.actsAndSections;
        return getActsAndSectionsDetails(actsAndSections, actList);
      },
    },
  ];
  if (ISHIGHERSHOUSER) {
    columns.push({
      title: "District Name",
      dataIndex: "districtName",
      rowKey: "districtName",
      render: (_i, item) => (
        <span className="tableRowText">
          {item?.firDetail?.district}
        </span>
      ),
    },
      {
        title: "PS Name",
        dataIndex: "psName",
        rowKey: "psName",
        render: (_i, item) => (
          <span className="tableRowText">
            {item?.firDetail?.psName?.split(" PS(")[0]}
          </span>
        ),
      })
  }
  return (
    <TableWidgetWrapper
      style={{ boxShadow: `0px 27px 19px -28px ${shadowColor}` }}
    >
      <Modal
        title="Select Charge Sheet Number"
        visible={isModalOpen}
        onOk={() => {
          setIsModalOpen(false);
          setChargeSheetDate(null);
        }}
        onCancel={() => {
          setIsModalOpen(false);
          setChargeSheetDate(null);
        }}
        footer={[
          <Space>
            <Button
              onClick={() => {
                setIsModalOpen(false);
                setChargeSheetDate(null);
              }}
            >
              Close
            </Button>
            <Link
              to={{ pathname: `${match.path}fir/${firData._id}` }}
              onClick={() => {
                const obj =
                  !isEmpty(getChargesheetListData()) &&
                  getChargesheetListData().find(
                    (data) => data?.updateChargesheetId === chargeSheetDate
                  );
                localStorage.setItem(
                  "selectedCourtAndProsecution",
                  !!chargeSheetDate === true
                    ? JSON.stringify(obj)
                    : JSON.stringify({})
                );
                localStorage.setItem(
                  "selectedActDetails",
                  JSON.stringify(actDatalocal(firData.firDetail, actList))
                );
                localStorage.setItem(
                  "selectedFir",
                  JSON.stringify(firData.firDetail)
                );
                localStorage.setItem("selectedCaseStatus", firData.caseStatus);
                localStorage.setItem(
                  "selectedFirId",
                  JSON.stringify(firData._id)
                );
                dispatch(hideSideMenu());
                dispatch(resetAccidentInformationReport());
                setIsModalOpen(false);
                setChargeSheetDate(null);
              }}
            >
              <Button
                disabled={isNull(chargeSheetDate)}
                style={{
                  backgroundColor: isNull(chargeSheetDate)
                    ? "rgba(0,0,0,.04)"
                    : "#02599C",
                  borderColor: isNull(chargeSheetDate) ? "#d9d9d9" : "#02599C",
                  color: isNull(chargeSheetDate) ? "rgba(0,0,0,.25)" : "#fff",
                }}
              >
                Continue
              </Button>
            </Link>
          </Space>,
        ]}
      >
        <Select
          showSearch
          placeholder="Select a ChargeSheet Number"
          style={{ width: 180 }}
          onSelect={(data) => setChargeSheetDate(data)}
          options={
            !isEmpty(getChargesheetListData()) && getChargesheetListData()
          }
        />
      </Modal>
      <h3 className="widgetLabel">{label}</h3>
      <div className="widgetContainer">
        <TableWrapper
          dataSource={dataSource}
          columns={columns}
          pagination={true}
          rowKey={(obj) => obj._id}
          style={{ bordeRadius: 5 }}
          scroll={{ y: 315 }}
          size="small"
        />
      </div>
    </TableWidgetWrapper>
  );
}
