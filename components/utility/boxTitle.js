import React from 'react';
import { BoxTitle, BoxSubTitle } from './boxTitle.style';

// eslint-disable-next-line import/no-anonymous-default-export
export default props => {
  return (
    <div>
      {props.title ? (
        <BoxTitle className="boxTitle"> {props.title} </BoxTitle>
      ) : (
        ''
      )}
      {props.subtitle ? (
        <BoxSubTitle className="boxSubTitle"> {props.subtitle} </BoxSubTitle>
      ) : (
        ''
      )}
    </div>
  );
};
