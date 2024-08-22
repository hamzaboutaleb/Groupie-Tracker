const API_URL = "http://localhost:8080/";
let id = document.querySelector(".team-content").dataset.id;

async function getCoordinates(city, country) {
  const url = `https://nominatim.openstreetmap.org/search.php?q=${city},${country}&format=jsonv2`;
  console.log(encodeURI(url));
  const response = await fetch(encodeURI(url));
  const data = await response.json();
  if (data.length > 0) {
    let first = data[0];
    return {
      lat: first.lat,
      lon: first.lon,
    };
    // for (let node of data) {
    //   if (
    //     node.addresstype == "suburb" ||
    //     node.addresstype == "city" ||
    //     node.type == "administrative"
    //   ) {
    //     return { lat: node.lat, lon: node.lon };
    //   }
    // }
  } else {
    throw new Error("Location not found");
  }
}

async function getLocalizationByID(id) {
  try {
    const res = [];
    const url = `${API_URL}locations/${id}`;
    console.log(url);
    const response = await fetch(url, {
      mode: "cors",
    });
    if (!response.ok) {
      throw new Error("Locations not found");
    }
    const jsonData = await response.json();
    for (let location of jsonData.locations) {
      let [city, country] = location.split("-");
      city = city.replaceAll("_", " ");
      let coordinate = await getCoordinates(city, country);
      res.push({ ...coordinate, city, country });
    }
    return res;
  } catch (error) {
    console.log(error);
  }
}

async function SetLocationOnMap() {
  let coordinates = await getLocalizationByID(id);
  console.log(coordinates);
  for (let coordinate of coordinates) {
    let { lat, lon, city, country } = coordinate;
    console.log(city, lat, lon);
    L.marker([lat, lon])
      .addTo(map)
      .bindPopup(`<b>${city}</b><br>${country}`)
      .openPopup();
  }
}

//console.log(getLocalizationByID(1));

var map = L.map("map").setView([51.505, -0.09], 13);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

SetLocationOnMap();
