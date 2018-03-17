const { buffer } = require('micro');
const cors = require('micro-cors')();

const handler = async (req) => {
  const data = await buffer(req);
  console.log(data);
  return 'success!!';
};

module.exports = cors(handler);
