// JSON 파일로 저장한 장소 데이터를 JavaScript 모듈 형태로 변환

const fs = require('fs');
const data = require('./results_googlemaps.json');

const converted = data.map((item, index) => ({
  id: (index + 1).toString(),
  name: item.name,
  address: item.address,
  image: item.image,
}));

fs.writeFileSync(
  './data/restaurants.js',
  'export default ' + JSON.stringify(converted, null, 2) + ';',
  'utf8'
);

console.log('restaurants.js 변환 완료!');
