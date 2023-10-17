import * as React from "react";
import AccusedDetailsCard from "./AccusedDetailsCard";
import { isArray } from "lodash";
import { DATE_FORMAT } from "@containers/FirDetails/fir-util";
import moment from "moment";

const { Component } = React;

class WaterMark extends Component {
  constructor(props) {
    super(props);
    this.imgUrl = this.getImgUrl();
    this.id = "watermark";
  }

  componentDidMount = () => {
    this.parent = this.watermark.parentNode;
    this.initAttribute(this.watermark);
    this.parentObserver = this.observeParent();
    this.selfObserver = this.observeSelf(this.watermark);
  };

  componentWillUnmount = () => {
    this.parentObserver.disconnect();
    this.selfObserver.disconnect();
  };

  getImgUrl = () => {
    const content = "LookOut Notice";
    const WIDTH = 900;
    const HEIGHT = 700;
    const RATIO = 0.7;

    var canvas = document.createElement("canvas");
    canvas.setAttribute("width", WIDTH);
    canvas.setAttribute("height", HEIGHT);

    var ctx = canvas.getContext("2d");
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "80px monospace";
    ctx.fillStyle = "rgba(120, 120, 120, 0.4)";
    ctx.strokeStyle = "rgba(120, 120, 120, 0.4)";
    ctx.lineWidth = 5;

    // rotate
    ctx.translate(WIDTH / 2, HEIGHT / 2);
    ctx.rotate(-(Math.PI / 180) * 30);
    ctx.translate(-WIDTH / 2, -HEIGHT / 2);

    // * Stamp
    ctx.beginPath();
    ctx.moveTo((WIDTH * (1 - RATIO)) / 2, HEIGHT / 2);
    ctx.stroke();
    ctx.fillText(content, WIDTH / 2, (HEIGHT * 2) / 3);
    return canvas.toDataURL();
  };

  observeParent = () => {
    const options = {
      childList: true,
    };
    const callback = (mutationsList) => {
      for (var mutation of mutationsList) {
        let removed = mutation.removedNodes[0];
        if (removed && removed.dataset.watermarkid === this.id) {
          this.selfObserver.disconnect();
          let target = mutation.target;
          this.insertClone(target);
        }
      }
    };

    const observer = new MutationObserver(callback);
    observer.observe(this.parent, options);

    return observer;
  };

  observeSelf = (node) => {
    const options = {
      attributes: true,
      attributeOldValue: true,
    };
    const callback = (mutationsList, observer) => {
      for (var mutation of mutationsList) {
        observer.disconnect();
        this.initAttribute(mutation.target);
        observer.observe(node, options);
      }
    };
    const observer = new MutationObserver(callback);
    observer.observe(node, options);

    return observer;
  };

  initAttribute = (target) => {
    target.dataset.watermarkid = this.id;
    target.setAttribute(
      "style",
      `position: absolute!important;
      top: 0!important;
      bottom: 0!important;
      left: 0!important;
      right: 0!important;
      margin: 0!important;
      padding: 0!important;
      transform: none!important;
      width: auto!important;
      height: auto!important;
      scale: 1!important;
      display: block!important;
      visibility: visible!important;
      opacity: 1!important;
      z-index: 99999999999999!important;
      pointer-events: none;
      background-repeat: repeat!important;
      background-image: url(${this.imgUrl})!important;
      background-size: auto!important;`
    );
  };

  insertClone = (target) => {
    let clonedWaterMark = this.watermark.cloneNode(true);
    this.selfObserver = this.observeSelf(clonedWaterMark);
    target.appendChild(clonedWaterMark);
  };

  render() {
    return (
      <div
        id={this.id}
        data-watermarkid={this.id}
        ref={(element) => (this.watermark = element)}
      />
    );
  }
}

export class ComponentToPrint extends React.PureComponent {
  render() {
    const tableData = this.props.tableData;
    const reportType = this.props.reportType;
    return (
      <div
        style={{
          margin: 15,
          marginBottom: 30,
          fontFamily: "Arial,Helvetica Neue,Helvetica,sans-serif",
          fontSize: 23,
          color: "black",
          display: "contents",
        }}
      >
        <style type="text/css" media="print">
          {"\
   @page { size: portrait; }\
"}
        </style>
        {this.props.isDisable === false ? <WaterMark /> : null}
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            marginTop: "5px",
          }}
        >
          <span
            style={{
              fontSize: 16,
              fontFamily: "Arial",
              fontWeight: "600",
            }}
          >
            {reportType === "Missing" ? reportType + " Person" : reportType}
          </span>
          <span
            style={{
              fontSize: 16,
              fontFamily: "Arial",
              fontWeight: "600",
            }}
          >
            &nbsp;- Period Wise Report (CIS)
          </span>
        </div>
        <div
          style={{
            paddingLeft: 15,
            paddingRight: 15,
            paddingBottom: 25,
            justifyContent: "center",
          }}
        >
          {isArray(tableData)
            ? tableData.map((item, i) => (
                <>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginLeft: "15px",
                      padding: "5px",
                      fontSize: 13,
                      fontFamily: "Arial",
                      fontWeight: "600",
                      marginTop: "5px",
                    }}
                  >
                    <div>{moment().format(DATE_FORMAT)}</div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "right",
                        marginRight: "15px",
                      }}
                    >
                      page {i + 1} of {tableData.length}
                    </div>
                  </div>
                  <AccusedDetailsCard
                    key={i}
                    tableData={item}
                    reportType={reportType}
                  />
                  <div style={{ pageBreakAfter: "always" }}></div>
                </>
              ))
            : ""}
        </div>
      </div>
    );
  }
}

export const FunctionalComponentToPrint = React.forwardRef((props, ref) => {
  return (
    <ComponentToPrint ref={ref} text={props.text} isDisable={props.isDisable} />
  );
});
