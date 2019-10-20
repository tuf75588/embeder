const cheerio = require('cheerio');
const axios = require('axios');
const url = require('url');

function getContent($, selector) {
  return (
    $(
      `meta[property="og:${selector}"], meta[property="twitter:${selector}"]`
    ).attr('content') || ''
  );
}

async function scraper(pageURL) {
  const { data } = await axios.get(pageURL);

  /*
  <meta property="og:title" content="National Aeronautics and Space Administration" />
 */

  /*
<meta name="keywords" content="Indiana, General, Assembly, IGA, Bill, Legislation, House, Senate" />

*/

  const $ = cheerio.load(data);
  let title = getContent($, 'title');
  let description = $(
    'meta[property="og:description"], meta[name="description"]'
  ).attr('content');
  const keywords = $('meta[name="keywords"]').attr('content') || '';

  // type
  const type = getContent($, 'type');
  // site image
  let image = getContent($, 'image');

  // if no meta og:title, grab the title element.
  const jsonSchema =
    JSON.parse($('script[type="application/ld+json"]').html()) || null;
  /*
  if no image, we can use the favicon
  */
  if (!image) {
    image = $('link[rel="shortcut icon"]').attr('href');
    if (image && !image.startsWith('http')) {
      const { protocol, hostname, path } = url.parse(pageUrl);
      // TODO: handle encoded images
      if (image.startsWith('/')) {
        image = `${protocol}//${hostname}${image}`;
      } else {
        image = `${protocol}//${hostname}${path}${image}`;
      }
    }
  }
  if (!title) {
    title = $('title').text() || '';
  }

  //same with description, grab the first hundred characters of the body for preview..
  if (!description) {
    description =
      $('body')
        .text()
        .trim()
        .substr(0, 100) + '...';
  }
  return {
    title,
    description,
    keywords,
    type,
    url: pageURL,
    image,
    ld_json: jsonSchema
  };
}

module.exports = scraper;
