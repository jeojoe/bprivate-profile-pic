const { json, send } = require('micro');
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
    gm(picBuffer)
      .negative()
      .toBuffer('PNG', (err, lolBuffer) => {
        if (!err) {
          gmImage(lolBuffer)
            .colorspace('GRAY')
            .colorize(...config.COLOR)
            .toBuffer('PNG', (err2, blueInvertBuffer) => {
              if (!err2) {
                gm(blueInvertBuffer)
                  .matte()
                  .operator('Opacity', 'Negate', 0)
                  .operator('Opacity', 'Multiply', 0.5)
                  .operator('Opacity', 'Negate', 0)
                  .toBuffer('PNG', (err3, blueInvertAndTransBuffer) => {
                    if (!err3) {
                      resolve(blueInvertAndTransBuffer);
                      return;
                    }
                    reject(err2);
                  });
                return;
              }
              reject(err);
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
  console.time('main');
  const regex = RegExp('data:image/png;base64,');
  const body = await json(req, { limit: '5mb' });
  const picBuffer = Buffer.from(body.base64.replace(regex, ''), 'base64');

  const btcpLogoBuffer = await sharp('btcp-logo.png')
    .resize(config.PIC_SIZE, config.PIC_SIZE)
    .toBuffer();
  const picBufferResized = await sharp(picBuffer)
    .resize(config.PIC_SIZE, config.PIC_SIZE)
    .toBuffer();

  const [
    grayBuffer,
    blueBuffer,
    grayInvertBuffer,
    blueInvertBuffer,
  ] = await mask(picBufferResized);

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
      if (err) {
        send(res, 500, 'Error code 1');
        return;
      }

      gm(data)
        .modulate(95, 155)
        .contrast('+')
        .toBuffer('PNG', (err2, resultBuffer) => {
          if (err2) {
            send(res, 500, 'Error code 2: Something went wrong!');
            return;
          }
          s3.upload({
            ACL: 'public-read',
            Bucket: 'jeojoe',
            ContentType: 'image/png',
            Key: `bprivate-profile-pic/${cuid()}.png`,
            Body: resultBuffer,
          }, (err3, dataS3) => {
            if (err3) {
              send(res, 500, 'Error code 3: Something went wrong!');
            }

            // Success
            console.log('===== Success ! =====');
            console.timeEnd('main');
            console.log('done', dataS3.Location);
            send(res, 200, dataS3.Location);
          });
        });
    });
};

module.exports = cors(handler);
