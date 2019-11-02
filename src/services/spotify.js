import { Linking } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { encode as btoa } from 'base-64';
import SpotifyWebAPI from 'spotify-web-api-js';
import jsonRequest from './jsonRequest';

const ROOT_URL = 'https://little-sister.herokuapp.com';

const getValidSPObj = async () => {
  const tokenExpirationTime = await AsyncStorage.getItem(
    '@LittleStore:expirationTime',
  );
  if (!tokenExpirationTime || new Date().getTime() > tokenExpirationTime) {
    console.log(
      'access token has expired, so we need to use the refresh token',
    );
    await getAuthorizationCode();
    await refreshTokens();
  }
  const accessToken = await AsyncStorage.getItem('@LittleStore:accessToken');
  const sp = new SpotifyWebAPI();
  await sp.setAccessToken(accessToken);
  return sp;
};

export const getUserRecommendations = async data => {
  const sp = await getValidSPObj();
  const res = await sp.getRecommendations(data);
  return res;
};

export const createPlaylist = async data => {
  const sp = await getValidSPObj();
  const { id: userId } = await sp.getMe();
  const res = await sp.createPlaylist(userId, data);
  return res;
};

export const addTracksToPlaylist = async data => {
  const { playlistId, uris, params } = data;
  const sp = await getValidSPObj();
  const res = await sp.addTracksToPlaylist(playlistId, uris, params);
  return res;
};

const getSpotifyCredentials = async () => {
  return jsonRequest(`${ROOT_URL}/spotify/credentials`, {
    headers: { 'Content-Type': 'application/json' },
  });
};

const scopesArr = [
  'user-modify-playback-state',
  'user-read-currently-playing',
  'user-read-playback-state',
  'user-library-modify',
  'user-library-read',
  'playlist-read-private',
  'playlist-read-collaborative',
  'playlist-modify-public',
  'playlist-modify-private',
  'user-read-recently-played',
  'user-top-read',
];
const scopes = scopesArr.join(' ');

export const getAuthorizationCode = async () => {
  try {
    const credentials = await getSpotifyCredentials(); //we wrote this function above
    Linking.openURL(
      'https://accounts.spotify.com/authorize' +
        '?response_type=code' +
        '&client_id=' +
        credentials.clientId +
        (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
        '&redirect_uri=' +
        encodeURIComponent(credentials.redirectURI),
    );
  } catch (err) {
    console.error(err);
  }
};

const getTokens = async () => {
  try {
    const authorizationCode = await AsyncStorage.getItem(
      '@LittleStore:spotify_auth_code',
    );
    const credentials = await getSpotifyCredentials();
    const credsB64 = btoa(
      `${credentials.clientId}:${credentials.clientSecret}`,
    );
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credsB64}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grant_type=authorization_code&code=${authorizationCode}&redirect_uri=${credentials.redirectURI}`,
    });
    const responseJson = await response.json();
    // destructure the response and rename the properties to be in camelCase to satisfy my linter ;)
    const {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: expiresIn,
    } = responseJson;

    console.log(accessToken);

    const expirationTime = new Date().getTime() + expiresIn * 1000;
    await AsyncStorage.setItem('@LittleStore:accessToken', accessToken);
    await AsyncStorage.setItem('@LittleStore:freshToken', refreshToken);
    await AsyncStorage.setItem(
      '@LittleStore:expirationTime',
      expirationTime.toString(),
    );
  } catch (err) {
    console.error(err);
  }
};

export const refreshTokens = async () => {
  try {
    const credentials = await getSpotifyCredentials(); //we wrote this function above
    const credsB64 = btoa(
      `${credentials.clientId}:${credentials.clientSecret}`,
    );
    const refreshToken = await AsyncStorage.getItem(
      '@LittleStore:refreshToken',
    );
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credsB64}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grant_type=refresh_token&refresh_token=${refreshToken}`,
    });
    const responseJson = await response.json();
    if (responseJson.error) {
      await getTokens();
    } else {
      const {
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
        expires_in: expiresIn,
      } = responseJson;

      const expirationTime = new Date().getTime() + expiresIn * 1000;
      await AsyncStorage.setItem('@LittleStore:accessToken', newAccessToken);
      if (newRefreshToken) {
        await AsyncStorage.setItem(
          '@LittleStore:refreshToken',
          newRefreshToken,
        );
      }
      await AsyncStorage.setItem('@LittleStore:expirationTime', expirationTime);
    }
  } catch (err) {
    console.error(err);
  }
};
