import React from 'react';
import { WidgetWrapper } from './Widgets.styles';

// eslint-disable-next-line import/no-anonymous-default-export
export default function({ children, ...props }) {
  return (
    <WidgetWrapper className="widgetsWrapper" {...props}>
      {children}
    </WidgetWrapper>
  );
}
