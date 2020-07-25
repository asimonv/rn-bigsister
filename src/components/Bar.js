import React from "react";
import { ViewPropTypes } from "react-native";
import PropTypes from "prop-types";
import styled from "styled-components";

const BarContainer = styled.TouchableOpacity`
  border-radius: 5px;
  overflow: hidden;
  padding: 0px;
  margin: 10px 0px;
  border: 1px solid ${props => props.backgroundColor};
`;

const InnerBar = styled.View`
  align-self: flex-start;
  min-width: 15%;
  width: ${props =>
    props.percentage ? `${parseInt(props.percentage * 100, 10)}%` : "100%"};
  background-color: ${props => props.backgroundColor};
`;

const Bar = props => {
  const { style, children, ...noStyle } = props;
  const { backgroundColor } = style;
  return (
    <BarContainer {...noStyle} backgroundColor={backgroundColor}>
      <InnerBar {...noStyle} backgroundColor={backgroundColor}>
        {children}
      </InnerBar>
    </BarContainer>
  );
};

Bar.defaultProps = {
  title: undefined,
  style: undefined,
};

Bar.propTypes = {
  title: PropTypes.string,
  style: ViewPropTypes.style,
};

export default Bar;
