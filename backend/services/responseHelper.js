exports.response = (code, body) => {
  return {
    statusCode: code,
    body,
  };
};
