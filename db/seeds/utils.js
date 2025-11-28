function createLookupObject(data, key, value) {
  const obj = {};
  data.forEach((pair) => {
    obj[key] = pair[value];
  });
  return obj;
}

module.exports = createLookupObject;
