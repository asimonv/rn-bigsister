import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import PropTypes from "prop-types";
import styled from "styled-components";
import Colors from "../constants/Colors";

const GraphLine = styled.View`
  height: 1px;
  background-color: gray;
  width: 100%;
  z-index: 999;
`;

const GraphContainer = styled.View`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  padding: 5px 0px;
  margin: 5px 0px;
`;

const GraphText = styled.Text`
  text-align: ${props => (props.leftAligned ? "left" : "right")}
  color: black;
  width: 100px;
  font-weight: 600;
`;

const GraphPoint = styled.View`
  background-color: ${props => {
    const {
      data: { source }
    } = props;

    if (source === "fb") {
      return Colors.facebook;
    }
    if (source === "tw") {
      return Colors.twitter;
    }
    return Colors.text;
  }};
  width: 10px;
  height: 10px;
  border-radius: 5px;
  position: ${props => (props.data.percentile ? "absolute" : "relative")};
  left: ${props => (props.data.percentile ? props.data.percentile * 100 : 0)}%;
  z-index: 1000;
`;

const PointsContainer = styled.View`
  flex: 1;
  justify-content: center;
  margin-top: 20px;
`;

const TextContainer = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const GraphDetailContainer = styled.View`
  display: flex;
  flex-direction: column;
`;

const GraphDetailRow = styled.View`
  flex-direction: row;
  margin: 15px 0;
  align-items: center;
`;

const GraphDetailText = styled.Text`
  margin-left: 5px;
`;

const GraphDetail = ({ data }) => {
  return (
    <GraphDetailContainer>
      {data.map(x => (
        <GraphDetailRow>
          <GraphPoint data={{ ...x, percentile: null }} />
          <GraphDetailText>{x.detailText}</GraphDetailText>
        </GraphDetailRow>
      ))}
    </GraphDetailContainer>
  );
};

const GraphBar = ({ title, leftText, rightText, pointsData }) => {
  const [active, setActive] = useState(false);
  const _onPress = () => {
    setActive(!active);
  };

  return (
    <TouchableOpacity
      style={{
        flexDirection: "column",
        marginVertical: 5,
        display: "flex",
        flex: 1
      }}
      onPress={_onPress}
    >
      <Text style={{ textAlign: "center", fontWeight: "bold" }}>{title}</Text>
      <GraphContainer>
        <TextContainer>
          <GraphText leftAligned>{leftText}</GraphText>
          <GraphText>{rightText}</GraphText>
        </TextContainer>
        <PointsContainer>
          {pointsData.map(point => (
            <GraphPoint data={point} />
          ))}
          <GraphLine />
        </PointsContainer>
        {active && (
          <View style={{ marginTop: 20 }}>
            <GraphDetail data={pointsData} />
          </View>
        )}
      </GraphContainer>
    </TouchableOpacity>
  );
};

GraphBar.propTypes = {
  leftText: PropTypes.string.isRequired,
  rightText: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  pointsData: PropTypes.arrayOf(
    PropTypes.shape({
      source: PropTypes.string.isRequired,
      percentile: PropTypes.number.isRequired
    })
  ).isRequired
};

export default GraphBar;
