import React from "react";
import { WidgetColumn } from "./style";

// eslint-disable-next-line import/no-anonymous-default-export
export default function ({ children, ...props }) {
  return (
    <WidgetColumn className="widgetsColumn" {...props}>
      {children}
    </WidgetColumn>
  );
}
