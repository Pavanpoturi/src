import React from 'react';
import BoxTitleWrapper from './boxTitle';
import { BoxWrapper } from './box.style';

// eslint-disable-next-line import/no-anonymous-default-export
export default props => (
  <BoxWrapper
    className={`${props.className ? props.className : ''} boxWrapper`}
    style={props.style}
  >
    <BoxTitleWrapper title={props.title} subtitle={props.subtitle} />
    {props.children}
  </BoxWrapper>
);
