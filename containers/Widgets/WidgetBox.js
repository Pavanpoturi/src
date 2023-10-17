import React from "react";
import { WidgetBox } from "./Widgets.styles";

// eslint-disable-next-line import/no-anonymous-default-export
export default function ({ children, style, height, padding }) {
  return (
    <WidgetBox
      className="widgetBox"
      height={height}
      padding={padding}
      style={style}
    >
      {children}
    </WidgetBox>
  );
}
