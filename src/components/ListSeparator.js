import React from 'react';
import styled from 'styled-components/native';

const ListSeparatorContainer = styled.View`
  height: 1px;
  background-color: #ecf0f1;
`;

const ListSeparator = props => {
  return <ListSeparatorContainer />;
};

export default ListSeparator;
