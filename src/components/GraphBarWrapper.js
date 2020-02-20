/* eslint-disable react/prop-types */
import React from "react";
import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import personalityInfo from "../data/personality";
import AditionalInfoText from "./AditionalInfoText";
import Bar from "./Bar";

const GraphBarWrapper = ({ data, status }) => {
  const { t } = useTranslation();
  return (
    <View style={{ flex: 1, marginVertical: 15 }}>
      <Text
        style={{
          textAlign: "center",
          marginBottom: 15,
          fontWeight: "bold"
        }}
      >{`${personalityInfo(t)[data.trait_id].title}`}</Text>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between"
        }}
      >
        <Text style={{ maxWidth: "30%" }}>
          {personalityInfo(t)[data.trait_id].leftIntervalText}
        </Text>
        <Text style={{ maxWidth: "30%" }}>
          {personalityInfo(t)[data.trait_id].rightIntervalText}
        </Text>
      </View>
      <Bar
        style={{
          marginVertical: 10,
          backgroundColor: personalityInfo(t)[data.trait_id].color
        }}
        key={data.name}
        title={data.name}
        percentage={data.percentile}
      >
        <Text style={{ padding: 5, color: "white" }}>
          {`${parseInt(data.percentile * 100, 10)}%`}
        </Text>
      </Bar>
      {status && (
        <AditionalInfoText key={personalityInfo(t)[data.trait_id].description}>
          {personalityInfo(t)[data.trait_id].description}
        </AditionalInfoText>
      )}
    </View>
  );
};

export default GraphBarWrapper;
