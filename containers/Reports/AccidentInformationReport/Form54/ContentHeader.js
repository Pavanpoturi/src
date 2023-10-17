import { Button } from "antd";
import { DoubleRightOutlined } from "@ant-design/icons";

const styles = {
  widgetPageStyle: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    overflow: "hidden",
  },
};

export default function ContentHeader({
  headerTitle,
  onSubmitClick,
  disableButton,
  reset,
}) {
  return (
    <div
      className="contentHeaderContainer"
      style={{
        padding: 10,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <div style={styles.widgetPageStyle}>
        <h2 className="pageTitle" style={{ color: "#454647" }}>
          {headerTitle}
        </h2>
      </div>
      <div>
        <span
          className="linkStyle resetLink"
          onClick={reset}
          style={{ color: "#02599C", marginRight: 10 }}
        >
          Reset
        </span>
        <Button
          type="primary"
          className="stepsButtonActive"
          style={{ backgroundColor: "#258C0B", borderColor: "#258C0B" }}
          onClick={onSubmitClick}
          disabled={disableButton}
        >
          Submit
          <DoubleRightOutlined />
        </Button>
      </div>
    </div>
  );
}
