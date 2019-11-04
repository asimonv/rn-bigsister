import { Alert } from "react-native";

const AsyncAlert = async (onPress, { title, description }) =>
  new Promise(resolve => {
    Alert.alert(
      title,
      description,
      [
        {
          text: "OK",
          onPress: async () => {
            await onPress();
            resolve("YES");
          }
        }
      ],
      { cancelable: false }
    );
  });

export default AsyncAlert;
