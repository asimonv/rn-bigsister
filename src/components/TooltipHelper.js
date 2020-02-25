import React from "react";
import { Dimensions, Text, View } from "react-native";
import Tooltip from "react-native-walkthrough-tooltip";
import PropTypes from "prop-types";
import styled from "styled-components";

const NextButton = styled.TouchableOpacity`
  margin-top: 10px;
`;

const TooltipHelper = ({
  children,
  isVisible,
  index,
  setVisible,
  text,
  contentStyle
}) => {
  return (
    <Tooltip
      isVisible={isVisible}
      allowChildInteraction={false}
      contentStyle={{
        ...contentStyle,
        maxWidth: Dimensions.get("window").width - 48
      }}
      content={
        <View>
          <Text style={{ fontSize: 15 }}>{text}</Text>
          <NextButton onPress={() => setVisible(index)}>
            <Text>Next</Text>
          </NextButton>
        </View>
      }
      placement="bottom"
      onClose={() => setVisible([false, true])}
    >
      {children}
    </Tooltip>
  );
};

TooltipHelper.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
  setVisible: PropTypes.func.isRequired,
  children: PropTypes.elementType.isRequired,
  text: PropTypes.string.isRequired
};

export default TooltipHelper;
