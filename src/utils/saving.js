import AsyncStorage from "@react-native-community/async-storage";

const saveTest = async (test, source, language) => {
  const history =
    JSON.parse(await AsyncStorage.getItem("@LittleStore:history")) || [];
  const newHistory = [
    ...history,
    { ...test, date: new Date(), source, language },
  ];
  await AsyncStorage.setItem(
    "@LittleStore:history",
    JSON.stringify(newHistory)
  );
};

export default saveTest;
