import { Button } from "antd";

export default function RoughSketch(props) {
  return (
    <div className="contentHeaderContainer">
      <h2 className="pageTitle">Rough Sketch</h2>
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
