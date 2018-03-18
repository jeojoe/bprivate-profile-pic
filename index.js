const { buffer } = require('micro');
const cors = require('micro-cors')();
const sharp = require('sharp');
const gm = require('gm');
const gmImage = require('gm').subClass({ imageMagick: true });

const config = require('./config');

const handler = async (req) => {
  const picBuffer = await buffer(req);

  const [grayBuffer, blueBuffer] = await mask(picBuffer);

  // await sharp(grayBuffer).toFile('gray.png');
  // await sharp(blueBuffer).toFile('blue.png');

  sharp(grayBuffer)
    .overlayWith(blueBuffer)
    .toFile('bprivate.png', (err, info) => {
      if (err) {
        console.log(err);
      } else {
        console.log(info);
      }
    });

  return 'success';
};

function mask(picBuffer) {
  const grayPm = new Promise((resolve, reject) => {
    gm(picBuffer)
      .resize(config.PIC_SIZE, config.PIC_SIZE)
      .colorspace('GRAY')
      .contrast('+')
      .toBuffer('PNG', (err, grayBuffer) => {
        if (!err) {
          resolve(grayBuffer);
          return;
        }
        reject(err);
      });
  });

  const bluePm = new Promise((resolve, reject) => {
    gmImage(picBuffer)
      .resize(config.PIC_SIZE, config.PIC_SIZE)
      .colorspace('GRAY')
      .colorize(19, 36, 114)
      .toBuffer('PNG', (err, onlyBlueBuffer) => {
        if (!err) {
          gm(onlyBlueBuffer)
            .matte()
            .operator('Opacity', 'Negate', 0)
            .operator('Opacity', 'Multiply', 0.5)
            .operator('Opacity', 'Negate', 0)
            .toBuffer('PNG', (err2, blueAndTransBuffer) => {
              if (!err2) {
                resolve(blueAndTransBuffer);
                return;
              }
              reject(err2);
            });
          return;
        }
        reject(err);
      });
  });

  return Promise.all([grayPm, bluePm]);
  // gm()
  //   .command('composite')
  //   .compose('Minus')
  //   .in(img, m)
  //   .write(img, (err) => {
  //     if (err) {
  //       console.log(err);
  //     } else {
  //       console.log("Success! Image " + img + " was masked with mask " + m);
  //     }
  //   });
}

module.exports = cors(handler);
