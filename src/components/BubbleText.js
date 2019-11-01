import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';

const BubbleTextContainer = styled.Text`
  font-size: 20px;
  font-weight: 600;
  margin-vertical: 20px;
`;

const BubbleText = ({ title, style }) => {
  return <BubbleTextContainer style={[style]}>{title}</BubbleTextContainer>;
};

BubbleText.propTypes = {
  title: PropTypes.string.isRequired,
};

export default BubbleText;
