import { create } from "apisauce";
import { API_KEY } from "../config/site.config";

const api = create({
  headers: {
    apikey: API_KEY,
  },
});

class ApiSauce {
  async post(url, payload, headers) {
    api.setHeaders({
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    });
    const response = await api.post(url, payload, headers);
    return new Promise((resolve, reject) => {
      this.handlePromise(resolve, reject, response);
    });
  }

  async put(url, payload) {
    api.setHeaders({
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    });
    const response = await api.put(url, payload);
    return new Promise((resolve, reject) => {
      this.handlePromise(resolve, reject, response);
    });
  }

  async patch(url, payload) {
    api.setHeaders({
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    });
    const response = await api.patch(url, payload);
    return new Promise((resolve, reject) => {
      this.handlePromise(resolve, reject, response);
    });
  }

  async get(url) {
    api.setHeaders({
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    });

    const response = await api.get(url);

    return new Promise((resolve, reject) => {
      this.handlePromise(resolve, reject, response);
    });
  }

  async getResponseAsArrayBuffer(url) {
    api.setHeaders({
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    });
     
    const response = await api.get(url, {},{ responseType: "arraybuffer" });
    return new Promise((resolve, reject) => {
      this.handlePromise(resolve, reject, response);
    });
  }

  async getWithToken(url, token) {
    const Header = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    };

    const response = await api.get(url, {}, Header);

    return new Promise((resolve, reject) => {
      this.handlePromise(resolve, reject, response);
    });
  }

  handlePromise = (resolve, reject, response) => {
    if (response.ok && response.data && response.originalError === null) {
      resolve(response.data);
    } else if (response.data && !response.ok) {
      if (response.status === 401) {
        window.location.href =
          window.location.protocol + "//" + window.location.host + "/#/login";
        window.location.reload();
      }
      resolve({ data: response.data, status: response.status });
    } else {
      if (
        response.status === 404 &&
        !response.ok &&
        response.originalError !== null
      ) {
        reject(response.problem);
      }
    }
  };
}

export default new ApiSauce();
