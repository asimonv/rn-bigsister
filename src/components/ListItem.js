import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import NavButton from "./NavButton";
import Colors from "../constants/Colors";

const ListItem = ({
  selected,
  editing = false,
  item,
  onPress,
  onPressDelete
}) => (
  <TouchableOpacity onPress={() => onPress(item)}>
    <View style={styles.itemWrapper}>
      {editing && (
        <NavButton
          backgroundColor={!selected ? "red" : Colors.green}
          wrapperStyle={{ marginRight: 10 }}
          style={{
            color: "white"
          }}
          name={!selected ? "remove" : "add"}
          onPress={() => onPressDelete(item.id)}
        />
      )}
      {item.artworkUrl && (
        <View style={styles.artworkWrapper}>
          <Image style={{ flex: 1 }} source={{ uri: item.artworkUrl }} />
        </View>
      )}
      <View style={styles.rightInfoWrapper}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  artworkWrapper: {
    width: 50,
    height: 50,
    backgroundColor: "lightgray",
    borderRadius: 5,
    overflow: "hidden",
    marginRight: 15,
    borderWidth: 2,
    borderColor: "black"
  },
  rightInfoWrapper: {
    flex: 1,
    display: "flex",
    flexDirection: "column"
  },
  itemWrapper: {
    display: "flex",
    flexDirection: "row",
    marginHorizontal: 10,
    padding: 10,
    alignItems: "center"
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2e3131",
    marginBottom: 3
  },
  itemSubtitle: {
    color: "#6c7a89",
    fontSize: 15
  }
});

export default ListItem;
