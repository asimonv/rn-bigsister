import React, { Component } from "react";
import { StyleSheet, Text, TextInput, View, Keyboard } from "react-native";
import { withTranslation } from "react-i18next";
import Swiper from "react-native-deck-swiper";
import _ from "lodash";

import shuffle from "../utils/array";
import Button from "./Button";
import ButtonText from "./ButtonText";
import MessageBubble from "./MessageBubble";

class TextComposer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      phrases: undefined,
    };
    this._onPressSend = this._onPressSend.bind(this);
    this._onChangeText = this._onChangeText.bind(this);
  }

  async componentDidMount() {
    const phrases = [];
    const sources = [];
    const {
      i18n: { language },
    } = this.props;

    if (language === "es") {
      const gm = await import("../data/texts/gm");
      const pinera18 = await import("../data/texts/pinera");
      const pinera19 = await import("../data/texts/pinera-19");
      sources.push(pinera18, pinera19, gm);
    } else if (language === "en") {
      const gm = await import("../data/texts/gm-en");
      const jebb = await import("../data/texts/je-bb");
      sources.push(gm, jebb);
    }

    for (let j = 0; j < sources.length; j += 1) {
      for (let index = 0; index < 10; index += 1) {
        const {
          default: { text, source, author },
        } = sources[j];
        const maxLength = text.length;
        const inputSize = 1000;
        const rand = Math.floor(Math.random() * (maxLength - inputSize));
        const element = text.substring(rand, inputSize);
        const words = element.split(" ").filter(x => x !== "");

        const maxIndexWords = words.length;

        const wordsSize = 300;
        const randWords = Math.floor(
          Math.random() * (maxIndexWords - wordsSize)
        );

        const phraseText = words
          .slice(randWords, randWords + wordsSize)
          .join(" ");

        const phrase = { source, phraseText, author };
        if (phraseText.length >= wordsSize) {
          phrases.push(phrase);
        }
      }
    }

    this.setState({ phrases: shuffle(phrases) });
  }

  _onPressSend() {
    const { onPressSend } = this.props;
    const { text } = this.state;
    if (onPressSend) {
      onPressSend(text);
    }
  }

  _onChangeText(text) {
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
      placeholder,
      selectedSourceType,
      onSelectedText,
    } = this.props;

    const { phrases } = this.state;
    return (
      <View
        style={[
          { ...styles.container },
          { ...style },
          finished ? { padding: 0, backgroundColor: "transparent" } : {},
          selectedSourceType === 2 ? { flex: 1 } : {},
        ]}
      >
        {!finished && (
          <>
            <View
              style={[
                styles.textInputWrapper,
                selectedSourceType === 2 ? { flex: 1 } : {},
              ]}
            >
              {selectedSourceType < 2 && (
                <TextInput
                  returnKeyLabel="Done"
                  returnKeyType="done"
                  onSubmitEditing={Keyboard.dismiss}
                  style={styles.textInput}
                  onChangeText={this._onChangeText}
                  placeholder={placeholder}
                />
              )}
              {phrases && selectedSourceType === 2 && (
                <Swiper
                  cards={phrases}
                  renderCard={({ source, phraseText, author }) => {
                    return (
                      <View style={styles.card}>
                        <Text
                          style={styles.text}
                        >{`"...${phraseText}..."`}</Text>
                        <Text
                          style={{
                            fontSize: 15,
                            padding: 10,
                            fontWeight: "bold",
                            textAlign: "right",
                          }}
                        >
                          {`${source} — ${author}`}
                        </Text>
                      </View>
                    );
                  }}
                  onSwipedRight={cardIndex => {
                    onSelectedText(phrases[cardIndex]);
                  }}
                  onSwipedAll={() => {
                    console.log("onSwipedAll");
                  }}
                  cardIndex={0}
                  backgroundColor="yellow"
                  stackSize={3}
                  cardStyle={styles.innerCard}
                />
              )}
            </View>
            <View
              style={{ display: "flex", flexDirection: "row", marginTop: 10 }}
            >
              <Button
                style={{ flex: 1, marginRight: 5 }}
                onPress={onPressCancel}
              >
                <ButtonText>{t("cancel")}</ButtonText>
              </Button>
              <Button style={{ flex: 1 }} onPress={this._onPressSend}>
                <ButtonText>{t("send")}</ButtonText>
              </Button>
            </View>
          </>
        )}
        {finished && (
          <MessageBubble>
            <Text style={styles.greetingsText}>{t("greetings-text")}</Text>
          </MessageBubble>
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
  },
  innerCard: {
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: "auto",
    height: "auto",
  },
  card: {
    flex: 1,
    padding: 10,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "black",
    backgroundColor: "white",
    display: "flex",
    justifyContent: "space-evenly",
  },
  text: {
    fontStyle: "italic",
    padding: 10,
    textAlign: "center",
    fontSize: 8,
    backgroundColor: "transparent",
  },
  textInputWrapper: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: "white",
    alignSelf: "stretch",
  },
  textInput: {
    backgroundColor: "white",
    textAlign: "center",
    fontSize: 17,
  },
  greetingsText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#c0392b",
    textAlign: "center",
    padding: 5,
  },
});

export default withTranslation()(TextComposer);
