const https = require('https');
const url = require('url');

const urls = [
  'https://res.cloudinary.com/dxeuvtxys/image/upload/q_auto/f_auto/v1779201944/Jet_team_cprlcf.jpg',
  'https://res.cloudinary.com/dom6wa8ih/image/upload/v1782561968/jet_gallery/sok6zgpetvozpbid13pt.jpg',
  'https://res.cloudinary.com/dvkt0lsqb/image/upload/v1775352177/20260405_0422_Image_Generation_remix_01kndkp2b7fgbaajgj3zrwx5ng_rizvpg.png'
];

function testUrl(u) {
  const parsedUrl = url.parse(u);
  const options = {
    hostname: parsedUrl.hostname,
    path: parsedUrl.path,
    headers: {
      'User-Agent': 'Mozilla/5.0'
    }
  };
  https.get(options, (res) => {
    console.log(`${u} -> Status: ${res.statusCode}`);
  }).on('error', (e) => {
    console.error(`${u} -> Error: ${e.message}`);
  });
}

urls.forEach(testUrl);
