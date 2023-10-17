import { Link } from "react-router-dom";
import { Layout } from "antd";
import { useDispatch } from "react-redux";
import firActions from "@redux/fir/actions";
import EscopLogo from "@assets/images/ecopLogo.png";
import CustomTopBarTopbarWrapper from "./styles";
import { useEffect } from "react";
import config from "../../config/site.config";
import masterDataActions from "@redux/masterData/actions";

const { Header } = Layout;
const { updateDashboardTopBar, updateDashboardData, updateSelectedWidget } =
  firActions;

export default function CustomTopBar({ headerData }) {
  const dispatch = useDispatch();
  const styling = {
    position: "fixed",
    width: "100%",
    height: 180,
    top: 0,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  };
  const { getActList } = masterDataActions;

  const optionType = {
    MAJOR_HEAD: "MAJOR_HEAD",
    MINOR_HEAD: "MINOR_HEAD",
    ACT: "ACT",
    SECTION: "SECTION",
    FIR: "FIR",
  };

  useEffect(() => {
    const url = config.getMasterData;
    dispatch(getActList(`${url}/${optionType.ACT}`));
  }, []);

  const displayHeaderContent = (minIndex, maxIndex) => {
    return headerData.map((s, i) => {
      return (
        i >= minIndex &&
        i < maxIndex && (
          <div key={i} className="headerContainer">
            <div className="headerTitle">{s.title}</div>
            <div className="headerValue">{s.value}</div>
          </div>
        )
      );
    });
  };

  return (
    <CustomTopBarTopbarWrapper>
      <Header style={styling} className="topbar">
        <div className="left">
          <Link
            className="topbarLogo "
            to="/dashboard"
            onClick={() => {
              dispatch(updateDashboardTopBar(false));
              dispatch(updateDashboardData(true));
              dispatch(updateSelectedWidget(""));
              localStorage.removeItem("isCourt");
              localStorage.removeItem("selectedFir");
              localStorage.removeItem("selectedActDetails");
              localStorage.removeItem("selectedCaseStatus");
              localStorage.removeItem("selectedFirId");
              localStorage.removeItem("selectedDraftedFirId");
              localStorage.removeItem("selectedDate");
              localStorage.removeItem("draftCount");
              localStorage.removeItem("iscourtAndProsecutionVisible");
              localStorage.removeItem("selectedCourtAndProsecution");
            }}
          >
            <img src={EscopLogo} className="escopLogo" alt="escopLogo" />
          </Link>
        </div>
        <div style={{ width: "100%" }}>
          <div className="headerContent">{displayHeaderContent(0, 5)}</div>
          <div className="headerContent">{displayHeaderContent(5, 10)}</div>
        </div>
      </Header>
    </CustomTopBarTopbarWrapper>
  );
}
