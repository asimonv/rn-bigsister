import jsonRequest from "./jsonRequest";

const AUTH_PATH = "https://little-sister.herokuapp.com/p_insights";

const pInsights = async (content, signal = undefined) => {
  return jsonRequest(AUTH_PATH, {
    signal,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content })
  });
};

export default pInsights;
