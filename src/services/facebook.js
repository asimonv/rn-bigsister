import FBSDK from 'react-native-fbsdk';

const { AccessToken, GraphRequest, GraphRequestManager, LoginManager } = FBSDK;

export const isUserLoggedIn = async () => {
  try {
    const token = await AccessToken.getCurrentAccessToken();
    return token;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const logoutUser = async () => {
  LoginManager.logOut();
};

export const handleFacebookLogin = async () => {
  try {
    const result = await LoginManager.logInWithPermissions([
      'public_profile',
      'user_likes',
      'user_posts',
    ]);
    if (result.isCancelled) {
      console.log('Login cancelled');
      throw result;
    }
    console.log(`Login success with permissions: ${result.grantedPermissions.toString()}`);
    return await AccessToken.getCurrentAccessToken();
  } catch (e) {
    throw e;
  }
};

export const fetchLikes = async () => {
  return new Promise((resolve, reject) => {
    const request = new GraphRequest('/me/feed', { summary: true }, (error, result) => {
      if (result) {
        const likes = result;
        resolve(likes);
      } else {
        reject(error);
      }
    });

    new GraphRequestManager().addRequest(request).start();
  });
};
