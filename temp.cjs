const axios = require('axios');

let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: 'http://localhost:3100/?shop_id=8',
  headers: { }
};

const fetch = async () => {
  await axios.request(config)
    .then((response) => {
    })
    .catch((error) => {
      console.log("ERR")
    });
}

setInterval(() => {
  fetch()
}, 50)

