import Axios from "axios";

const instance = Axios.create({
  baseURL: "/api",
  timeout: 10000
});

export { instance };
