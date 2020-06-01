const HOST = 'http://localhost:4000';
const isDEV = process.env.NODE_ENV !== 'production';

const getRuntimeObject = () => {
  return axios
    .get(`${HOST}/api/routes/load`, {
      responseType: 'json',
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    })
    .then((res = res.json()));
};
