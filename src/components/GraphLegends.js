import React from "react";
import styled from "styled-components";

const ViewWrapper = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: center;
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
    <ViewWrapper>
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
