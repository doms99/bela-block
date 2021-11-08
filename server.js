const express = require('express');
const app = express();

const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

const port = process.env.PORT || 4080;


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
});

app.listen(port, function () {
  console.log(`Server running`);
});