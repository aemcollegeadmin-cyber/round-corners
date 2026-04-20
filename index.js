const express = require('express');
const sharp = require('sharp');
const app = express();

app.use(express.raw({ type: '*/*', limit: '20mb' }));

app.post('/', async (req, res) => {
  try {
    const radius = parseInt(req.headers['x-radius'] || '80');
    const image = sharp(req.body);
    const { width, height } = await image.metadata();

    const svg = `<svg><rect x="0" y="0" width="${width}" height="${height}" rx="${radius}" ry="${radius}"/></svg>`;

    const result = await image
      .png()
      .composite([{ input: Buffer.from(svg), blend: 'dest-in' }])
      .toBuffer();

    res.set('Content-Type', 'image/png');
    res.send(result);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.listen(process.env.PORT || 3000, () => console.log('Ready'));
