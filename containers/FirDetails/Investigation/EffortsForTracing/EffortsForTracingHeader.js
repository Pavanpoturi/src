import { Button } from "antd";
import { useHistory } from "react-router-dom";

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

export default function EffortsForTracingHeader({
  headerTitle,
  onSubmitClick,
  onCancel,
  isInvestigation = false,
}) {
  const history = useHistory();

  return (
    <div className="contentHeaderContainer">
      <div style={styles.widgetPageStyle}>
        <h2 className="pageTitle">{headerTitle}</h2>
      </div>
      <div>
        <Button
          className="stepsButtonInActive"
          onClick={() =>
            isInvestigation ? onCancel() : history.push("/dashboard")
          }
        >
          Cancel
        </Button>
        <Button
          type="primary"
          className="stepsButtonActive"
          onClick={onSubmitClick}
        >
          DONE
        </Button>
      </div>
    </div>
  );
}
