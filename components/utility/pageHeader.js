import React from 'react';
import { ComponentTitleWrapper } from './pageHeader.style';

// eslint-disable-next-line import/no-anonymous-default-export
export default props => (
  <ComponentTitleWrapper className="componentTitle">
    {props.children}
  </ComponentTitleWrapper>
);
