import jsonRequest from './jsonRequest';

const ROOT_URL = 'https://little-sister.herokuapp.com';

const fetchTweets = async userId => {
  return jsonRequest(`${ROOT_URL}/tweets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  });
};
export default fetchTweets;
