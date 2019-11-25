import jsonRequest from "./jsonRequest";

const ROOT_URL = `https://little-sister.herokuapp.com/options`;

const textCategories = async language => {
  return jsonRequest(`${ROOT_URL}/text_categories?language=${language}`);
};

export default textCategories;
