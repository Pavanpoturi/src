import { Document, Page, pdfjs } from "react-pdf";
import React, { Component } from "react";
import { throttle } from "lodash";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

class AllPages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      PDFWidth: null,
    };
    this.myInput = React.createRef();
  }

  componentDidMount() {
    // setting width at initial
    this.setPDFWidth();

    // event listener when window is resized
    window.addEventListener("resize", throttle(this.setPDFWidth, 100));
  }

  componentWillUnmount() {
    window.removeEventListener("resize", throttle(this.setPDFWidth, 100));
  }

  setPDFWidth = () => {
    const width = this.myInput.current.offsetWidth;
    this.setState({ PDFWidth: width });
  };

  render() {
    const { PDFWidth } = this.state;
    return (
      <div ref={this.myInput}>
        <Document
          file={this.props.pdf}
          options={{ workerSrc: "/pdf.worker.js" }}
        >
          <Page pageNumber={1} width={PDFWidth} />
        </Document>
      </div>
    );
  }
}

export default AllPages;
