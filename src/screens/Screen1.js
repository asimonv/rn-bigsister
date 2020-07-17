import React from "react";
import {
  Alert,
  FlatList,
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Transition } from "react-navigation-fluid-transitions";
import { useTranslation } from "react-i18next";
import { createPlaylist, addTracksToPlaylist } from "../services/spotify";
import NavBar from "../components/NavBar";
import NavButton from "../components/NavButton";
import ListItem from "../components/ListItem";
import ListSeparator from "../components/ListSeparator";

const handleRecommendationOnPress = item => {
  const { uri } = item;
  const splittedURI = uri.split(":");
  const correctedURI = `https://open.spotify.com/${splittedURI[1]}/${
    splittedURI[2]
  }`;
  console.log(correctedURI);
  Linking.canOpenURL(correctedURI)
    .then(supported => {
      if (!supported) {
        Alert.alert(
          "Oops",
          `Can't handle url: ${correctedURI}. Please install Spotify.`
        );
      } else {
        return Linking.openURL(correctedURI);
      }
    })
    .catch(err => console.error("An error occurred", err));
};

const renderItem = item => (
  <ListItem onPress={handleRecommendationOnPress} item={item} />
);

const Screen1 = props => {
  const { navigation } = props;
  const { t } = useTranslation();
  const filters = navigation.getParam("filters");
  const title = navigation.getParam("title");
  const subtitle = navigation.getParam("subtitle");
  const data = navigation.getParam("recommendations");
  const recommendations = data.tracks.map(recommendation => ({
    key: recommendation.id,
    title: recommendation.name,
    subtitle: `${recommendation.artists[0].name} · ${recommendation.album.name}`,
    artworkUrl:
      recommendation.album.images[recommendation.album.images.length - 1].url,
    uri: recommendation.uri,
  }));

  const _handleCreatePlaylist = async () => {
    const params = {
      name: `🧝‍🤖 - ${subtitle}: ${title}`,
      description: `This playlist was created with the LittleSister app based on ${filters.seed_genres.join()}`,
    };
    try {
      const res = await createPlaylist(params);
      const uris = data.tracks.map(recommendation => recommendation.uri);
      await addTracksToPlaylist({ playlistId: res.id, uris, params });
      Alert.alert(t("spotify.playlist_created"));
    } catch (e) {
      Alert.alert(e);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 0, backgroundColor: "#1db954" }} />
      <SafeAreaView style={styles.container}>
        <ScrollView
          bounces={false}
          style={{ flex: 1, backgroundColor: "#1db954" }}
          contentContainerStyle={{ flex: 1 }}
        >
          <View style={styles.headerWrapper}>
            <NavBar style={{ marginVertical: 10, marginHorizontal: 20 }}>
              <NavButton
                style={{ color: "#1db954" }}
                name="arrow-round-back"
                onPress={() => navigation.goBack()}
              />
              {/* <NavButton
                style={{ color: "#1db954" }}
                name="add-circle-outline"
                onPress={() => _handleCreatePlaylist()}
              /> */}
              <Text style={styles.title}>{t("spotify.recommendations")}</Text>
            </NavBar>
          </View>
          <View style={{ flex: 1 }}>
            <Transition appear="bottom" disappear="bottom">
              <FlatList
                style={styles.list}
                data={recommendations}
                ItemSeparatorComponent={ListSeparator}
                renderItem={({ item }) => renderItem(item)}
              />
            </Transition>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    backgroundColor: "white",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    overflow: "hidden",
    flex: 1,
    paddingTop: 10,
    shadowOpacity: 0.55,
    shadowRadius: 5,
    shadowColor: "#2e3131",
    shadowOffset: { height: 0, width: 0 },
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
  },
  headerWrapper: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    position: "absolute",
    textAlign: "center",
    color: "white",
    left: 0,
    right: 0,
    zIndex: -1,
  },
  container: {
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: "white",
  },
});

export default Screen1;
