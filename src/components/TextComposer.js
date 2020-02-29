import React, { Component } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { withTranslation } from "react-i18next";

import Button from "./Button";
import ButtonText from "./ButtonText";
import MessageBubble from "./MessageBubble";

class TextComposer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: ""
    };
    this._onPressSend = this._onPressSend.bind(this);
    this._onChangeText = this._onChangeText.bind(this);
  }

  _onPressSend() {
    const { onPressSend } = this.props;
    const { text } = this.state;
    if (onPressSend) {
      onPressSend(text);
    }
  }

  _onChangeText(text) {
    console.log(text);
    const { onChangeText } = this.props;
    this.setState({ text });
    if (onChangeText) {
      onChangeText(text);
    }
  }

  render() {
    const {
      onPressCancel,
      finished,
      style,
      randomCategory,
      t,
      placeholder
    } = this.props;
    return (
      <View
        style={[
          { ...styles.container },
          { ...style },
          finished ? { padding: 0, backgroundColor: "transparent" } : {}
        ]}
      >
        {!finished && randomCategory ? (
          <>
            <View style={styles.textInputWrapper}>
              <TextInput
                style={styles.textInput}
                onChangeText={this._onChangeText}
                placeholder={placeholder}
                multiline
              />
            </View>
            <View
              style={{ display: "flex", flexDirection: "row", marginTop: 10 }}
            >
              <Button
                style={{ flex: 1, marginRight: 5 }}
                onPress={onPressCancel}
              >
                <ButtonText>Cancel</ButtonText>
              </Button>
              <Button style={{ flex: 1 }} onPress={this._onPressSend}>
                <ButtonText>Send</ButtonText>
              </Button>
            </View>
          </>
        ) : (
          <>
            <MessageBubble>
              <Text style={styles.greetingsText}>{t("greetings-text")}</Text>
            </MessageBubble>
          </>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "yellow",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "stretch"
  },
  textInputWrapper: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: "white",
    alignSelf: "stretch"
  },
  textInput: {
    backgroundColor: "white",
    textAlign: "center",
    fontSize: 17,
    maxHeight: 350
  },
  greetingsText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#c0392b",
    textAlign: "center",
    padding: 5
  }
});

export default withTranslation()(TextComposer);
