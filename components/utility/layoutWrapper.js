import React from 'react';
import { LayoutContentWrapper } from './layoutWrapper.style';

// eslint-disable-next-line import/no-anonymous-default-export
export default props => (
  <LayoutContentWrapper
    className={
      props.className != null
        ? `${props.className} layoutContentWrapper`
        : 'layoutContentWrapper'
    }
    {...props}
  >
    {props.children}
  </LayoutContentWrapper>
);
