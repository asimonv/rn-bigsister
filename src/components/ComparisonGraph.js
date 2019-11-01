import React from 'react';
import { StyleSheet, View } from 'react-native';
import GraphBar from './GraphBar';

const ComparisonGraph = ({ data }) => {
  return (
    <View style={styles.container}>
      {data.map(x => (
        <GraphBar key={x.title} pointsData={x.points} {...x} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
  },
});

export default ComparisonGraph;
