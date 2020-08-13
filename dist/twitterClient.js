"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _qs = _interopRequireDefault(require("qs"));

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

var _moment = _interopRequireDefault(require("moment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const endpoint = 'https://api.twitter.com/1.1/search/tweets.json';
const LIMIT = 1000;
const params = {
  result_type: 'recent',
  count: 100
};

async function search(query) {
  const results = [];
  let count = 0;
  let queryString = `?${_qs.default.stringify({
    q: query,
    ...params
  })}`;

  while (count < LIMIT) {
    const url = `${endpoint}${queryString}`;
    const response = await (0, _nodeFetch.default)(url, {
      headers: {
        'Authorization': `Bearer ${process.env.KEYHOLE_TWITTER_TOKEN}`
      }
    });
    const resultPage = await response.json();
    if (resultPage.search_metadata.count === 0) break;
    count += resultPage.search_metadata.count;
    const tweets = resultPage.statuses.map(({
      user: {
        profile_image_url_https,
        name,
        screen_name
      },
      text,
      id_str,
      retweet_count,
      favorite_count,
      created_at,
      retweeted_status
    }) => {
      const tweetLink = retweeted_status ? `https://twitter.com/${retweeted_status.user.screen_name}/status/${retweeted_status.id_str}` : `https://twitter.com/${screen_name}/status/${id_str}`;
      const likeNum = retweeted_status ? retweeted_status.favorite_count : favorite_count;
      return {
        id: id_str,
        imgUrl: profile_image_url_https,
        displayName: name,
        username: screen_name,
        text: text,
        tweetLink,
        profileLink: `https://twitter.com/${screen_name}`,
        rtNum: retweet_count,
        likeNum,
        time: (0, _moment.default)(created_at, 'ddd MMM DD HH:mm:ss ZZ YYYY').format('YYYY/MM/DD h:mm a')
      };
    });
    results.push(...tweets);
    queryString = resultPage.search_metadata.next_results;
  }

  ;
  return results.slice(0, LIMIT);
}

;
var _default = {
  search
};
exports.default = _default;