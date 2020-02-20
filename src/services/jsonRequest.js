async function jsonRequest(path, options = {}) {
  const result = await fetch(path, {
    ...options,
    headers: { ...options.headers, Accept: "application/json" }
  });
  const json = await result.json();
  if (result.status !== 200) {
    throw Object.assign({}, json);
  }

  return json;
}

export default jsonRequest;
