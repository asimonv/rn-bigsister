import React, { Component } from "react";
import { StyleSheet, Text, TextInput, View, Keyboard } from "react-native";
import { withTranslation } from "react-i18next";
import Swiper from "react-native-deck-swiper";
import _ from "lodash";

import shuffle from "../utils/array";
import Button from "./Button";
import ButtonText from "./ButtonText";
import MessageBubble from "./MessageBubble";

const MIN_WORDS = 100;

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
      const np = await import("../data/texts/np-es");
      const vgh = await import("../data/texts/vgh");
      sources.push(pinera18, pinera19, gm, np, vgh);
    } else if (language === "en") {
      const gm = await import("../data/texts/gm-en");
      const jebb = await import("../data/texts/je-bb");
      const np = await import("../data/texts/np-en");
      const queens = await import("../data/texts/queens");
      const sherlock = await import("../data/texts/sherlock");
      sources.push(gm, jebb, np, queens, sherlock);
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

        const wordsSize = 170;
        const randWords = Math.floor(
          Math.random() * (maxIndexWords - wordsSize)
        );

        let phraseText = words
          .slice(randWords, randWords + wordsSize)
          .join(" ");
        phraseText = phraseText.replace(/\r?\n|\r/g, " ");

        const phrase = { source, phraseText, author };
        if ((phraseText.match(/\s/g) || []).length >= MIN_WORDS) {
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
        {selectedSourceType === 2 && !finished && (
          <MessageBubble style={{ marginBottom: 10 }}>
            <Text>{t("swipe-text-info")}</Text>
          </MessageBubble>
        )}
        {!finished && (
          <>
            <View
              style={[
                styles.textInputWrapper,
                selectedSourceType === 2
                  ? { flex: 1, flexDirection: "row" }
                  : {},
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
                  multiline
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
    justifyContent: "space-between",
  },
  text: {
    fontStyle: "italic",
    padding: 10,
    textAlign: "center",
    fontSize: 10,
    backgroundColor: "transparent",
    maxHeight: 280,
  },
  textInputWrapper: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: "white",
    alignSelf: "stretch",
  },
  textInput: {
    backgroundColor: "white",
    fontSize: 17,
    maxHeight: 150,
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
