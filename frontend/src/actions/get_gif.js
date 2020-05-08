const GIPHY_KEY = process.env.REACT_APP_GIPHY_API_KEY;
const GIPHY_URL = process.env.REACT_APP_GIPHY_URL;

export const getGif = (searchTerm, setterCallback) => {
  fetch(`${GIPHY_URL}?q=${searchTerm.replace(/\s/g, '+')}&api_key=${GIPHY_KEY}`)
    .then(res => res.json())
    .then(result => {
      const gifs = result.data.map(gif => gif.images.downsized.url);
      setterCallback(gifs);
    })
}
