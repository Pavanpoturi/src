import { Button } from "antd";

export default function CrimeClassification(props) {
  return (
    <div className="contentHeaderContainer">
      <h2 className="pageTitle">Crime Classification</h2>
      <div>
        <Button
          type="primary"
          className="stepsButtonActive"
          onClick={() => props.setSelectedSiderMenu("investigation")}
        >
          DONE
        </Button>
      </div>
    </div>
  );
}
