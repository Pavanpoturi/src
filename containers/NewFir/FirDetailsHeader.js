import { Button } from "antd";
import { useHistory } from "react-router-dom";
import firActions from "@redux/fir/actions";
import { useDispatch } from "react-redux";

const styles = {
  widgetPageStyle: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    overflow: "hidden",
  },
  widgetColumnStyle: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    overflow: "hidden",
    marginLeft: 20,
  },
};

export default function FirDetailsHeader({ headerTitle, onSubmitClick }) {
  const history = useHistory();
  const { updateDashboardData } = firActions;
  const dispatch = useDispatch();

  return (
    <div className="contentHeaderContainer">
      <div style={styles.widgetPageStyle}>
        <h2 className="pageTitle">{headerTitle}</h2>
      </div>
      <div>
        <Button
          className="stepsButtonInActive"
          onClick={() => {
            dispatch(updateDashboardData(true));
            history.push("/dashboard");
          }}
        >
          Cancel
        </Button>
        <Button type="primary" className="submitButton" onClick={onSubmitClick}>
          SAVE DRAFT
        </Button>
        <Button
          type="primary"
          className="stepsButtonActive"
          style={{ marginLeft: 20, width: 150 }}
          onClick={onSubmitClick}
        >
          GENERATE FIR
        </Button>
      </div>
    </div>
  );
}
