import React, { useEffect, useState } from "react";
import { getGif } from "../../actions/get_gif.js"

const GifAnswersSection = ({onSelect}) => {

  const [searchTerm, setSearchTerm] = useState("");
  const [giphyURLs, setGiphyURLs] = useState([]);
  const [imageIndex, setImageIndex] = useState(0);

  const handleSubmit = (event) => {
    event.preventDefault();
    setImageIndex(0);
    getGif(searchTerm, setGiphyURLs);
  }

  const handleChange = (event) => {
    const text = event.target.value;
    setSearchTerm(text);
  }

  const handleFinalSubmission = () => {
    onSelect('gif', giphyURLs[imageIndex])
  }

  const shuffle = () => {
    setImageIndex(prevState => (prevState + 2 === giphyURLs.length) ? 0 : prevState + 1);
  }

  const renderTextInput = () => {
    return (
      <form onSubmit={handleSubmit}>
        <label>Search for a gif</label>
        <br/>
        <input
          name="searchTerm"
          type="text"
          onChange={handleChange}
          value={searchTerm}
        />
      </form>
    )
  }

  const renderImageSection = () => {
    if (giphyURLs.length === 0) { return null }
    return (
      <div className="imageSection" >
        <img src={giphyURLs[imageIndex]} alt="answer" />
        <button label="shuffle" onClick={shuffle}/>
        <button label="submit" onClick={handleFinalSubmission}/>
      </div>
    )
  }

  return (
    <div className="gifAnswersSection" >
      {renderTextInput()}
      {renderImageSection()}
    </div>
  )
}

export default GifAnswersSection