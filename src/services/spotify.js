import { Linking } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { encode as btoa } from "base-64";
import SpotifyWebAPI from "spotify-web-api-js";
import AsyncAlert from "../components/AsyncAlert";
import jsonRequest from "./jsonRequest";

const ROOT_URL = "https://little-sister.herokuapp.com";

export const isSpotifyTokenExpired = async () => {
  const tokenExpirationTime = await AsyncStorage.getItem(
    "@LittleStore:expirationTime"
  );
  return !tokenExpirationTime || new Date().getTime() > tokenExpirationTime;
};

export const hasAuthToken = async () => {
  const token = await AsyncStorage.getItem("@LittleStore:spotify_auth_code");
  return token;
};

export const clearSpotifyToken = async () => {
  await AsyncStorage.removeItem("@LittleStore:expirationTime");
  await AsyncStorage.removeItem("@LittleStore:accessToken");
  await AsyncStorage.removeItem("@LittleStore:freshToken");
  await AsyncStorage.removeItem("@LittleStore:spotify_auth_code");
};

const getValidSPObj = async () => {
  if (!(await hasAuthToken())) {
    console.log("no auth token");
    await AsyncAlert(
      async () => {
        await getAuthorizationCode();
      },
      {
        title: "No Spotify Auth Token",
        description:
          "A new window will be open to authenticate you to Spotify. Come back again to this screen after you get authenticated."
      }
    );
    return null;
  }
  if (await isSpotifyTokenExpired()) {
    console.log(
      "access token has expired, so we need to use the refresh token"
    );
    await AsyncAlert(
      async () => {
        await refreshTokens();
      },
      {
        title: "Spotify Token Expired",
        description: "Big Sister will refresh your spotify access token."
      }
    );
  }

  const accessToken = await AsyncStorage.getItem("@LittleStore:accessToken");
  const sp = new SpotifyWebAPI();
  await sp.setAccessToken(accessToken);
  return sp;
};

export const getUserRecommendations = async data => {
  const sp = await getValidSPObj();
  if (sp) {
    const res = await sp.getRecommendations(data);
    return res;
  }
  return null;
};

export const createPlaylist = async data => {
  const sp = await getValidSPObj();
  if (sp) {
    const { id: userId } = await sp.getMe();
    const res = await sp.createPlaylist(userId, data);
    return res;
  }

  return null;
};

export const addTracksToPlaylist = async data => {
  const { playlistId, uris, params } = data;
  const sp = await getValidSPObj();
  if (sp) {
    const res = await sp.addTracksToPlaylist(playlistId, uris, params);
    return res;
  }
  return null;
};

const getSpotifyCredentials = async () => {
  return jsonRequest(`${ROOT_URL}/spotify/credentials`, {
    headers: { "Content-Type": "application/json" }
  });
};

const scopesArr = [
  "user-modify-playback-state",
  "user-read-currently-playing",
  "user-read-playback-state",
  "user-library-modify",
  "user-library-read",
  "playlist-read-private",
  "playlist-read-collaborative",
  "playlist-modify-public",
  "playlist-modify-private",
  "user-read-recently-played",
  "user-top-read"
];
const scopes = scopesArr.join(" ");

export const getAuthorizationCode = async () => {
  try {
    const credentials = await getSpotifyCredentials();
    const { clientId, redirectURI } = credentials;
    Linking.openURL(
      `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}${
        scopes ? `&scope=${encodeURIComponent(scopes)}` : ""
      }&redirect_uri=${encodeURIComponent(redirectURI)}`
    );
  } catch (err) {
    console.error(err);
  }
};

const getTokens = async () => {
  try {
    // TODO: problem is that spotify_auth_code hasnt arrived yet when Linking
    const authorizationCode = await AsyncStorage.getItem(
      "@LittleStore:spotify_auth_code"
    );
    if (authorizationCode) {
      console.log(`auth code ${authorizationCode}`);
      const credentials = await getSpotifyCredentials();
      const credsB64 = btoa(
        `${credentials.clientId}:${credentials.clientSecret}`
      );
      const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          Authorization: `Basic ${credsB64}`,
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `grant_type=authorization_code&code=${authorizationCode}&redirect_uri=${credentials.redirectURI}`
      });
      const responseJson = await response.json();
      const {
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_in: expiresIn
      } = responseJson;

      console.log(accessToken);

      const expirationTime = new Date().getTime() + expiresIn * 1000;
      await AsyncStorage.setItem("@LittleStore:accessToken", accessToken);
      await AsyncStorage.setItem("@LittleStore:freshToken", refreshToken);
      await AsyncStorage.setItem(
        "@LittleStore:expirationTime",
        expirationTime.toString()
      );
    }
  } catch (err) {
    console.error(err);
  }
};

export const refreshTokens = async () => {
  try {
    const credentials = await getSpotifyCredentials();
    const credsB64 = btoa(
      `${credentials.clientId}:${credentials.clientSecret}`
    );
    const refreshToken = await AsyncStorage.getItem(
      "@LittleStore:refreshToken"
    );
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${credsB64}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: `grant_type=refresh_token&refresh_token=${refreshToken}`
    });
    const responseJson = await response.json();
    if (responseJson.error) {
      await getTokens();
    } else {
      const {
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
        expires_in: expiresIn
      } = responseJson;

      const expirationTime = new Date().getTime() + expiresIn * 1000;
      await AsyncStorage.setItem("@LittleStore:accessToken", newAccessToken);
      if (newRefreshToken) {
        await AsyncStorage.setItem(
          "@LittleStore:refreshToken",
          newRefreshToken
        );
      }
      await AsyncStorage.setItem("@LittleStore:expirationTime", expirationTime);
    }
  } catch (err) {
    console.error(err);
  }
};
