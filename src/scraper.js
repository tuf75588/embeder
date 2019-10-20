const cheerio = require('cheerio');
const axios = require('axios');

function getContent($, selector) {
  return (
    $(`meta[property="og:${selector}"], meta[property="twitter:image"]`).attr(
      'content'
    ) || ''
  );
}

async function scraper(url) {
  const { data } = await axios.get(url);

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
  // may as well grab the url too
  const ogURL = getContent($, 'url');
  // if no meta og:title, grab the title element.
  const jsonSchema = $('script[type="application/ld+json"]').html() || null;
  /*
  if no image, we can use the favicon
  */
  if (!image) {
    // <link rel="shortcut" href="#"/>
    image = `${url}${$('link[rel="shortcut icon"]').attr('href')}`;
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
    url: ogURL || url,
    image,
    ld_json: jsonSchema
  };
}

module.exports = scraper;
