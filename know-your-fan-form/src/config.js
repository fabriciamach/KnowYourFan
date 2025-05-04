const ENV = process.env.NODE_ENV || 'development';

const CONFIG = {
  development: {
    API_BASE: "http://localhost:8000"
  },
  production: {
    API_BASE: "https://api.suaapp.com"
  }
};

export default CONFIG[ENV];