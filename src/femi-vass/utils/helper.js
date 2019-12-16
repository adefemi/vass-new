import Axios from "axios";
import { USERTOKEN } from "./data";

export const axiosFunc = (
  method,
  url,
  data,
  headers,
  callback,
  type = null
) => {
  let header = headers;
  if (headers === "yes") {
    header = { Authorization: `Bearer ${localStorage.getItem(USERTOKEN)}` };
  }
  Axios({
    method,
    url,
    data,
    headers: header
  }).then(
    res => {
      callback(true, res, type);
    },
    err => {
      callback(false, err, type);
    }
  );
};

export const axiosMed = (method, url, data, headers) => {
  let header = headers;
  if (headers === "yes") {
    header = { Authorization: `Bearer ${localStorage.getItem(USERTOKEN)}` };
  }

  return Axios({
    method,
    url,
    data,
    headers: header
  });
};

export const formatCurrency = data => {
  if (data) {
    return data.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
  }
};
