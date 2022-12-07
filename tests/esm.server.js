const express = require('express');
const path = require('path');

const app = express();
const port = 3000;
const staticOptions = {
  setHeaders: function (res) {
    res.set('Cache-Control', 'no-store');
  },
};

app.get('/ok', (req, res) => {
  res.send('ok');
});
app.use('/esm', express.static(path.join(__dirname, '../esm'), staticOptions));
app.use('/umd', express.static(path.join(__dirname, '../umd'), staticOptions));
app.use('/', express.static(__dirname, staticOptions));

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
