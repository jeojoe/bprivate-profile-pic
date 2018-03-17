const { buffer } = require('micro');
const cors = require('micro-cors')();
const sharp = require('sharp');
const gm = require('gm');

const config = require('./config');

const handler = async (req) => {
  const picBuffer = await buffer(req);

  // sharp(picBuffer)
  //   .resize(1000, 1000)
  //   .background({
  //     r: 19, g: 36, b: 114, alpha: 1,
  //   })
  //   .negate()
  //   .normalize()
  //   .flatten()
  //   .toFile('bprivate.png', (err, info) => {
  //     console.log(err, info);
  //   });
  // mask('bprivate.png', 'btcp-logo.png');
  const [grayBuffer, blueBuffer] = await mask(picBuffer);

  await sharp(grayBuffer).toFile('gray.png');
  await sharp(blueBuffer).toFile('blue.png');

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
    gm(picBuffer)
      .resize(config.PIC_SIZE, config.PIC_SIZE)
      .colorize(19, 36, 144)
      .operator('Opacity', 'Negate', 0)
      .operator('Opacity', 'Multiply', 0.5)
      .operator('Opacity', 'Negate', 0)
      .toBuffer('PNG', (err, blueBuffer) => {
        if (!err) {
          resolve(blueBuffer);
          return;
        }
        reject(err);
      });
  });

  return Promise.all([grayPm, bluePm]);
  // return new Promise((resolve, reject) => {
  //   gm(img)
  //     .colorspace('GRAY')
  //     .contrast('+')
  //     .write('bprivate-grey.png', (err) => {
  //       if (!err) {
  //         gm('bprivate.png')
  //           .write('bprivate-color.png', (err2) => {
  //             if (!err2) {
  //               gm()
  //                 .command('composite')
  //                 .compose('CopyBlack')
  //                 .in('bprivate.png', 'bprivate-color.png')
  //                 .write('lol.png', (err) => {
  //                   console.log(err);
  //                 });
  //             }
  //           })
  //       }
  //     });
  // })
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
