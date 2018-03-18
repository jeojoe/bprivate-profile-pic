const { buffer } = require('micro');
const cors = require('micro-cors')();
const sharp = require('sharp');
const gm = require('gm');
const gmImage = require('gm').subClass({ imageMagick: true });

const config = require('./config');

// Helpers
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
      .colorize(...config.COLOR)
      .toBuffer('PNG', (err, blueBuffer) => {
        if (!err) {
          gm(blueBuffer)
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

  const grayInvertPm = new Promise((resolve, reject) => {
    gm(picBuffer)
      .resize(config.PIC_SIZE, config.PIC_SIZE)
      .colorspace('GRAY')
      .contrast('+')
      .negative()
      .toBuffer('PNG', (err, grayInvertBuffer) => {
        if (!err) {
          resolve(grayInvertBuffer);
          return;
        }
        reject(err);
      });
  });

  const blueInvertPm = new Promise((resolve, reject) => {
    gmImage(picBuffer)
      .resize(config.PIC_SIZE, config.PIC_SIZE)
      .colorspace('GRAY')
      .negative()
      .colorize(...config.COLOR)
      .toBuffer('PNG', (err, blueInvertBuffer) => {
        if (!err) {
          gm(blueInvertBuffer)
            .matte()
            .operator('Opacity', 'Negate', 0)
            .operator('Opacity', 'Multiply', 0.5)
            .operator('Opacity', 'Negate', 0)
            .toBuffer('PNG', (err2, blueInvertAndTransBuffer) => {
              if (!err2) {
                resolve(blueInvertAndTransBuffer);
                return;
              }
              reject(err2);
            });
          return;
        }
        reject(err);
      });
  });

  return Promise.all([
    grayPm,
    bluePm,
    grayInvertPm,
    blueInvertPm,
  ]);
}

// Http handler
const handler = async (req) => {
  const picBuffer = await buffer(req);
  const btcpLogoBuffer = await sharp('btcp-logo.png')
    .resize(config.PIC_SIZE, config.PIC_SIZE)
    .toBuffer();

  const [
    grayBuffer,
    blueBuffer,
    grayInvertBuffer,
    blueInvertBuffer,
  ] = await mask(picBuffer);

  // 2 base blue images (normal + invert)
  const mergedBlueBuffer = await sharp(grayBuffer)
    .overlayWith(blueBuffer)
    .toBuffer();
  const mergedBlueInvertBuffer = await sharp(grayInvertBuffer)
    .overlayWith(blueInvertBuffer)
    .toBuffer();

  // Do the logo cut
  const logoCutBuffer = await sharp(mergedBlueInvertBuffer)
    .overlayWith(btcpLogoBuffer, {
      cutout: true,
    })
    .toBuffer();

  sharp(mergedBlueBuffer)
    .overlayWith(logoCutBuffer)
    .toBuffer((err, data) => {
      gm(data)
        .modulate(95, 155)
        .contrast('+')
        .write('result.png', err2 => console.log(err2));
    });

  return 'success';
};

module.exports = cors(handler);
