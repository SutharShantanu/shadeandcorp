const cache = {};

const getLocationFromIP = async (ip) => {
  if (cache[ip]) {
    return cache[ip];
  }

  try {
    const apiKey = process.env.IP_STACK_API_KEY;
    const res = await fetch(
      `http://api.ipstack.com/${ip}?access_key=${apiKey}`
    );
    const data = await res.json();

    if (data && data.city && data.country_name && data.zip) {
      const location = `${data.city}, ${data.region_name}, ${data.country_name} - ${data.zip}`;
      cache[ip] = location;
      return location;
    } else {
      return "Location Not Found";
    }
  } catch (error) {
    console.error("IP Location Fetch Error:", error);
    return "Error Fetching Location";
  }
};

export default getLocationFromIP;
