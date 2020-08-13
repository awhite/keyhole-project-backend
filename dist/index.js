"use strict";

var _express = _interopRequireDefault(require("express"));

var _routes = _interopRequireDefault(require("./routes"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const PORT = 8001;
const app = (0, _express.default)();
app.use('/', _routes.default);
const server = app.listen(PORT, process.env.IP, () => {
  console.log(`Listening on port ${PORT}`);
});