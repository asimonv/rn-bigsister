/* eslint-disable react/prop-types */
import React from "react";
import { StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";

import GraphBar from "./GraphBar";

const ComparisonGraph = ({ data }) => {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      {data.map(x => (
        <GraphBar
          key={x.title}
          pointsData={x.points}
          {...x}
          title={t(x.title).title}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1
  }
});

export default ComparisonGraph;
