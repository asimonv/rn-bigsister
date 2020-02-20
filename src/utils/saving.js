import AsyncStorage from "@react-native-community/async-storage";

const saveTest = async (test, source) => {
  const history =
    JSON.parse(await AsyncStorage.getItem("@LittleStore:history")) || [];
  const newHistory = [...history, { ...test, date: new Date(), source }];
  await AsyncStorage.setItem(
    "@LittleStore:history",
    JSON.stringify(newHistory)
  );
};

export default saveTest;
