import Config from 'react-native-config';
import jsonRequest from './jsonRequest';

const AUTH_PATH = 'https://api.applymagicsauce.com/auth';

const auth = async () => {
  try {
    // this parse may fail
    const body = {
      customer_id: parseInt(Config.CAMBRIDGE_CUSTOMER_ID, 10),
      api_key: Config.CAMBRIDGE_API_KEY,
    };

    console.log(body);

    const data = jsonRequest(AUTH_PATH, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    console.log(data);
  } catch (err) {
    console.log(err);
  }
};

export default auth;
