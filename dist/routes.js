"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _twitterClient = _interopRequireDefault(require("./twitterClient"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const NUM_PER_PAGE = 15;

const router = _express.default.Router();

router.get('/search', async (req, res) => {
  if (!req.query.q) {
    res.status(400).end();
    return;
  }

  const query = req.query.q;
  const start = req.query.start ? parseInt(req.query.start) : 0; // get min(1000, total available) results

  try {
    const searchResults = await _twitterClient.default.search(query);
    searchResults.sort((a, b) => b.rtNum + b.likeNum - (a.rtNum + a.likeNum));
    res.set('Access-Control-Allow-Origin', '*');
    res.json({
      results: searchResults.slice(start, start + NUM_PER_PAGE),
      count: searchResults.length
    });
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
});
var _default = router;
exports.default = _default;