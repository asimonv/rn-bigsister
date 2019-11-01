import React from 'react';
import { ViewPropTypes, StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';

const NavBar = ({ children, style }) => {
  return <View style={[styles.container, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
});

NavBar.defaultProps = {
  style: undefined,
};

NavBar.propTypes = {
  children: PropTypes.node.isRequired,
  style: ViewPropTypes.style,
};

export default NavBar;
