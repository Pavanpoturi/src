import { Document, Page, pdfjs } from "react-pdf";
import React, { Component } from "react";
import { throttle } from "lodash";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

class AllPages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      PDFWidth: null,
      pageNumber: null,
    };
    this.myInput = React.createRef();
  }

  setPDFWidth = () => {
    const width = this.myInput.current.offsetWidth;
    this.setState({ PDFWidth: width });
  };

  componentDidMount() {
    // setting width at initial
    this.setPDFWidth();

    // event listener when window is resized
    window.addEventListener("resize", throttle(this.setPDFWidth, 500));
  }

  componentWillUnmount() {
    window.removeEventListener("resize", throttle(this.setPDFWidth, 500));
  }

  render() {
    const { PDFWidth } = this.state;
    return (
      <div ref={this.myInput}>
        <Document
          file={this.props.pdf}
          onLoadSuccess={({ numPages }) =>
            this.setState({ pageNumber: numPages })
          }
          options={{ workerSrc: "/pdf.worker.js" }}
        >
          {Array.apply(null, Array(this.state.pageNumber))
            .map((x, i) => i + 1)
            .map((page) => (
              <Page pageNumber={page} width={PDFWidth} key={page} />
            ))}
        </Document>
      </div>
    );
  }
}

export default AllPages;
