import jsonRequest from './jsonRequest';

const ROOT_URL = `https://little-sister.herokuapp.com/options`;

const textCategories = async () => {
  return jsonRequest(`${ROOT_URL}/text_categories`);
};

export default textCategories;
