import { Row, Col, Divider, Empty } from "antd";
import { CaseCountWrapper } from "./caseCountStyle";
import { useSelector } from "react-redux";
import { isArray, isEmpty, isUndefined } from "lodash";
import { loadState } from "@lib/helpers/localStorage";
import {
  IS_INVESTIGATION_OFFICER,
  IS_SHO,
  IS_IO,
} from "@containers/FirDetails/fir-util";
import config from "../../config/site.config";
import { useDispatch } from "react-redux";
import firActions from "@redux/fir/actions";

const { fetchFIRList } = firActions;

export default function DisposalCaseCount({
  Police_disposal,
  court_disposal,
  setDisposalFlag,
  nature_disposal,
  setDisposalType,
  setDisposalTittle,
  ISHIGHERSHOUSER,
}) {
  const dispatch = useDispatch();
  const { higherfirList, selectedWidgetStatus, dropDownData, updatedPsCode } =
    useSelector((state) => state.FIR);
  const getpsCode = dropDownData.map((data) => data?.ps_code).join(",");
  const psData =
    isEmpty(updatedPsCode) || isUndefined(updatedPsCode)
      ? getpsCode
      : updatedPsCode;
  const { currentUser } = useSelector((state) => state.Auth);
  const storedUser = loadState("currentUser");
  const activeUser = currentUser.employee_name ? currentUser : storedUser;
  const userRole = [IS_SHO, IS_IO, IS_INVESTIGATION_OFFICER];
  const IS_HIGHER_SHO_USER = !userRole?.includes(currentUser?.ecopsv2_role);

  const isDisposal = selectedWidgetStatus === "Disposal";
  const getDisposalCount = () => {
    let setData = higherfirList?.data;
    let disposalType = {};
    if (isArray(setData)) {
      setData?.map((s) => {
        if (s["caseStatus"] === "Disposal True Count") {
          disposalType.courtDisposal = s["caseCount"];
        }
        if (s["caseStatus"] === "Disposal False Count") {
          disposalType.policeDisposal = s["caseCount"];
        }
      });
    }
    return disposalType;
  };
  const handleClick = (data) => {
    if (
      IS_HIGHER_SHO_USER &&
      isDisposal === true &&
      storedUser?.isPersnolized === false &&
      storedUser?.isIo === false
    ) {
      dispatch(
        fetchFIRList(
          `${
            config.getRecentFirList
          }/?psCode=${psData}&caseStatus=${selectedWidgetStatus}&firType=${"Regular"}&caseType=${data}&page=1&limit=50&isDraft=${false}&higherOfficer=true`
        )
      );
      setDisposalFlag(data);
    } else {
      setDisposalFlag(data);
    }
  };
  return (
    <>
      <CaseCountWrapper
        style={{ boxShadow: "rgba(255, 0, 0, 0.4) 0px 27px 19px -28px" }}
      >
        <Row>
          <Col span={12}>Disposal Type</Col>
          <Col span={12}>No. of Cases</Col>
        </Row>
        <Divider />
        <Row>
          <Col span={12}>Court Disposal</Col>
          <Col span={12}>
            <a
              className="tableRowTextUl"
              style={{
                fontSize: 16,
                cursor: "pointer",
              }}
              onClick={() => {
                handleClick("court_disposal");
                localStorage.setItem("disposalType", "court_disposal");
                setDisposalType(true);
                setDisposalTittle({
                  tittle: "COURT DISPOSAL",
                  count:
                    ISHIGHERSHOUSER && storedUser?.isPersnolized === false
                      ? getDisposalCount().courtDisposal
                      : court_disposal,
                });
              }}
            >
              {ISHIGHERSHOUSER && storedUser?.isPersnolized === false
                ? getDisposalCount().courtDisposal
                : court_disposal}
            </a>
          </Col>
        </Row>
        <Divider />
        <Row>
          <Col span={12}>Police Disposal</Col>
          <Col span={12}>
            <a
              className="tableRowTextUl"
              style={{
                fontSize: 16,
                cursor: "pointer",
              }}
              onClick={() => {
                handleClick("police_disposal");
                localStorage.removeItem("disposalType");
                setDisposalType(true);
                setDisposalTittle({
                  tittle: "POLICE DISPOSAL",
                  count:
                    ISHIGHERSHOUSER && storedUser?.isPersnolized === false
                      ? getDisposalCount().policeDisposal
                      : Police_disposal,
                });
              }}
            >
              {ISHIGHERSHOUSER && storedUser?.isPersnolized === false
                ? getDisposalCount().policeDisposal
                : Police_disposal}
            </a>
          </Col>
        </Row>
      </CaseCountWrapper>
      <CaseCountWrapper
        style={{
          boxShadow: "rgba(255, 0, 0, 0.4) 0px 27px 19px -28px",
          marginTop: 15,
        }}
      >
        <Row>
          <Col span={12}>Nature of Disposal</Col>
          <Col span={12}>No. of Cases</Col>
        </Row>
        <Divider />
        {Object.keys(nature_disposal).length !== 0 ? (
          <>
            {Object.keys(nature_disposal)?.map((item) => {
              return (
                <>
                  <Row>
                    <Col span={12}>{item}</Col>
                    <Col span={12}>
                      <a
                        className="tableRowTextUl"
                        style={{
                          fontSize: 16,
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          setDisposalType(true);
                          setDisposalFlag(item);
                          setDisposalTittle({
                            tittle: item.toUpperCase(),
                            count: nature_disposal[item],
                          });
                        }}
                      >
                        {nature_disposal[item]}
                      </a>
                    </Col>
                  </Row>
                  <Divider />
                </>
              );
            })}
          </>
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </CaseCountWrapper>
    </>
  );
}
