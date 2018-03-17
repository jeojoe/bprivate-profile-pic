const { buffer } = require('micro');
const cors = require('micro-cors')();
const fs = require('fs');
const sharp = require('sharp');

const handler = async (req) => {
  const picBuffer = await buffer(req);
  sharp(picBuffer)
    .resize(1000, 1000)
    .background({
      r: 19, g: 36, b: 114, alpha: 1,
    })
    .negate()
    .normalize()
    .flatten()
    .toFile('bprivate.png', (err, info) => {
      console.log(err, info);
    });


  return 'success';
};

module.exports = cors(handler);
