import styled from "styled-components";
import { palette } from "styled-theme";
import { variables } from "@assets/styles/variables";

const WidgetWrapper = styled.div`
  margin: 0 6px;
  width: ${(props) => props.width}px;
  margin-top: ${(props) => props.gutterTop}px;
  margin-right: ${(props) => props.gutterRight}px;
  margin-bottom: ${(props) => props.gutterBottom}px;
  margin-left: ${(props) => props.gutterLeft}px;
  padding: ${(props) => props.padding};
  background-color: ${(props) => props.bgColor}px;
  box-shadow: 0px 15px 10px -15px #111;
  @media only screen and (max-width: 767) {
    margin-right: 0 !important;
  }

  .widgetTitle {
    font-ize: 14px;
    font-weight: 700;
    line-eight: 1.2;
    text-transform: uppercase;
    color: #ab3b61;
    margin: 0 12px 20px;
  }

  .widgetLayer1 {
    background-color: ${variables.WHITE_COLOR};
    border-radius: 5px;
    width: 84%;
    padding: 0px;
    height: 30px;
    opacity: 0.2;
    position: absolute;
    margin: -18px 0px 0px 12px;
    z-index: 1;
}
  }

  .widgetLayer2 {
    background-color: ${variables.WHITE_COLOR};
    border-radius: 5px;
    width: 85%;
    padding: 0px;
    height: 30px;
    opacity: 0.5;
    position: absolute;
    margin: -10px 0px 0px 6px;
    z-index: 2;
}
  }
`;

const WidgetBox = styled.div`
  width: 100%;
  height: ${(props) => (props.height ? `${props.height}px` : "100%")};
  padding: ${(props) => (props.padding ? props.padding : "30px")};
  background-color: ${variables.WHITE_COLOR};
  border: 1px solid ${palette("border", 2)};

  canvas {
    width: 100% !important;
    height: 100% !important;
  }
`;
const getAlignContent = (align = "flex-start") => {
  if (align === "start") return "flex-start";
  if (align === "end") return "flex-end";
  return align;
};
const WidgetColumn = styled.div`
  align-content: ${(props) => getAlignContent(props.align)};
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  margin-top: ${(props) => props.gutterTop}px;
  margin-right: ${(props) => props.gutterRight}px;
  margin-bottom: ${(props) => props.gutterBottom}px;
  margin-left: ${(props) => props.gutterLeft}px;
  padding: ${(props) => props.padding}px;
  width: ${(props) => props.width}px;
`;

export { WidgetWrapper, WidgetBox, WidgetColumn };
