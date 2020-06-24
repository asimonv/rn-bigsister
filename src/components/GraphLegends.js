import React from "react";
import styled from "styled-components";

const ViewWrapper = styled.ScrollView`
  display: flex;
  flex-direction: row;
  flex: 1;
  margin: 20px;
`;

const StatDetail = styled.View`
  flex-direction: row;
  align-items: center;
  margin-horizontal: 10px;
`;

const StatView = styled.View`
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: ${({ backgroundColor }) => backgroundColor || "white"};
`;

const StatTitle = styled.Text`
  margin-left: 5px;
`;

const GraphLegends = ({ data }) => {
  return (
    <ViewWrapper horizontal showsHorizontalScrollIndicator={false}>
      {data.map(x => (
        <StatDetail>
          <StatView backgroundColor={x.color} />
          <StatTitle>{x.title}</StatTitle>
        </StatDetail>
      ))}
    </ViewWrapper>
  );
};

export default GraphLegends;
