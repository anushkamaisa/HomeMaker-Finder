const API =
  window.location.protocol === "https:"
    ? "http://homemaker-backend-env.eba-kymmejmz.ap-south-1.elasticbeanstalk.com"
    : process.env.REACT_APP_API_URL;

export default API;