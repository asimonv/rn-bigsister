/* eslint-disable no-await-in-loop */
import AsyncStorage from "@react-native-community/async-storage";

export const saveTest = async (test, source, language) => {
  const currIndex =
    parseInt(
      (await AsyncStorage.getItem("@LittleStore:historyIndex")) || 0,
      10
    ) + 1;

  const newHistory = { ...test, date: new Date(), source, language };

  await AsyncStorage.setItem(
    `@LittleStore:history/${currIndex - 1}`,
    JSON.stringify(newHistory)
  );

  await AsyncStorage.setItem("@LittleStore:historyIndex", currIndex.toString());
};

export const getTests = async () => {
  const tests = [];
  const historyIndex = JSON.parse(
    await AsyncStorage.getItem("@LittleStore:historyIndex")
  );
  const currIndex = parseInt(historyIndex, 10);
  for (let index = 0; index < currIndex; index += 1) {
    const element = JSON.parse(
      await AsyncStorage.getItem(`@LittleStore:history/${index}`)
    );
    tests.push(element);
  }

  return tests.reverse();
};

export const clearTests = async () => {
  const historyIndex = JSON.parse(
    await AsyncStorage.getItem("@LittleStore:historyIndex")
  );
  const currIndex = parseInt(historyIndex, 10);

  for (let index = 0; index < currIndex; index += 1) {
    await AsyncStorage.removeItem(`@LittleStore:history/${index}`);
  }

  await AsyncStorage.setItem("@LittleStore:historyIndex", "0");
};
