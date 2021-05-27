const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

app.get('/ok', (req, res) => {
  res.send('ok');
});
app.use('/esm', express.static(path.join(__dirname, '../esm')));
app.use('/', express.static(__dirname));

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
