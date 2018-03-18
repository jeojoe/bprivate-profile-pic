const { buffer, send } = require('micro');
const cors = require('micro-cors')();
const sharp = require('sharp');
const gm = require('gm');
const gmImage = require('gm').subClass({ imageMagick: true });
const aws = require('aws-sdk');
const cuid = require('cuid');

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

const spaceEndPoint = new aws.Endpoint('sgp1.digitaloceanspaces.com');
const s3 = new aws.S3({
  endpoint: spaceEndPoint,
});

// Http handler
const handler = async (req, res) => {
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
        .toBuffer('PNG', (err, resultBuffer) => {
          if (err) {
            send(res, 500, 'Error code 2: Something went wrong!');
            return;
          }
          s3.upload({
            ACL: 'public-read',
            Bucket: 'jeojoe',
            ContentType: 'image/png',
            Key: `bprivate-profile-pic/${cuid()}.png`,
            Body: resultBuffer,
          }, (err2, data) => {
            if (err2) {
              send(res, 500, 'Error code 3: Something went wrong!');
            }

            // Success
            send(res, 200, data.Location);
          });
        });
    });
};

module.exports = cors(handler);
