import qs from 'qs';
import fetch from 'node-fetch';
import moment from 'moment';

const endpoint = 'https://api.twitter.com/1.1/search/tweets.json';

const LIMIT = 1000;

const params = {
  result_type: 'recent',
  count: 100,
}

async function search(query) {
  const results = [];
  let count = 0;
  let queryString = `?${qs.stringify({ q: query, ...params })}`;

  while (count < LIMIT) {
    const url = `${endpoint}${queryString}`;
    const response = await fetch(url, {
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
      retweeted_status,
    }) => {
      const tweetLink = retweeted_status
        ? `https://twitter.com/${retweeted_status.user.screen_name}/status/${retweeted_status.id_str}`
        : `https://twitter.com/${screen_name}/status/${id_str}`;
      const likeNum = retweeted_status
        ? retweeted_status.favorite_count
        : favorite_count;
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
        time: moment(created_at, 'ddd MMM DD HH:mm:ss ZZ YYYY').format('YYYY/MM/DD h:mm a'),
      }
    });

    results.push(...tweets);

    queryString = resultPage.search_metadata.next_results;
  };

  return results.slice(0, LIMIT);
};

export default {
  search
};
