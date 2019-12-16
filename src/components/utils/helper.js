export const errorHandler = err => {
  if (!err.response) {
    return err.message;
  }

  if (err.code === "ECONNABORTED") {
    return "Connection timeout...";
  }

  let errorData = err.response.data;
  let stringData = "";

  for (let key in errorData) {
    if (errorData.hasOwnProperty(key)) {
      stringData += `${errorData[key]} \n`;
    }
  }

  return stringData;
};

export const randomIDGenerator = length => {
  let text = "";
  let possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
};

export const getActivePosition = callback => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        let lat = position.coords.latitude;
        let lng = position.coords.longitude;

        callback({ lat, lng }, true);
      },
      error => {
        callback(error, false);
      }
    );
  }
};

const addressFormatType = Object.freeze({ full: "full", single: "single" });

const formatAddress = data => {
  let addressComp = data[0].address_components;
  let addresSetup = {};
  for (let i in addressComp) {
    if (addressComp[parseInt(i, 10)].types.includes("route")) {
      addresSetup.street = addressComp[parseInt(i, 10)].long_name;
    } else if (
      addressComp[parseInt(i, 10)].types.includes("neighborhood") ||
      addressComp[parseInt(i, 10)].types.includes("administrative_area_level_2")
    ) {
      addresSetup.city = addressComp[parseInt(i, 10)].long_name;
    } else if (
      addressComp[parseInt(i, 10)].types.includes("administrative_area_level_1")
    ) {
      addresSetup.state = addressComp[parseInt(i, 10)].long_name;
    } else if (addressComp[parseInt(i, 10)].types.includes("country")) {
      addresSetup.country = addressComp[parseInt(i, 10)].long_name;
    }
  }

  return addresSetup;
};

export const getActiveAddress = (
  lat,
  lng,
  callback,
  format = addressFormatType.full
) => {
  let latlng = new window.google.maps.LatLng(lat, lng);
  let geocoder = new window.google.maps.Geocoder();

  geocoder.geocode({ latLng: latlng }, function(results, status) {
    if (status === window.google.maps.GeocoderStatus.OK) {
      if (format === addressFormatType.full) {
        callback(results[0]["formatted_address"], status);
      } else {
        callback(formatAddress(results), status);
      }
    }
  });
};

export function numberWithCommas(n, separator = ",") {
  let num = n + "";

  // Test for and get any decimals (the later operations won't support them)
  let decimals = "";
  if (/\./.test(num)) {
    // This regex grabs the decimal point as well as the decimal numbers
    decimals = num.replace(/^.*(\..*)$/, "$1");
  }

  // Remove decimals from the number string
  num = num
    .replace(decimals, "")
    // Reverse the number string through Array functions
    .split("")
    .reverse()
    .join("")
    // Split into groups of 1-3 characters (with optional supported character "-" for negative numbers)
    .match(/[0-9]{1,3}-?/g)
    // Add in the mille separator character and reverse back
    .join(separator)
    .split("")
    .reverse()
    .join("");

  // Put the decimals back and output the formatted number
  return `${num}${decimals}`;
}

export function isDescendant(parent, child) {
  let node = child.parentNode;
  while (node != null) {
    if (node === parent) {
      return true;
    }
    node = node.parentNode;
  }
  return false;
}

export function hasSomeParentTheClass(element, className) {
  do {
    if (element.classList && element.classList.contains(className)) {
      return true;
    }
    element = element.parentNode;
  } while (element);
  return false;
}

export function validateFileInput(file, exts) {
  if (file.length < 1) {
    return false;
  }
  let fileName = file[0].name;
  return new RegExp("(" + exts.join("|").replace(/\./g, "\\.") + ")$").test(
    fileName
  );
}
