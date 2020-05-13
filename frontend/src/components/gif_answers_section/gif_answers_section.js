import React, { useState } from "react";
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

  const next = () => {
    setImageIndex(prevState => (prevState + 1 === giphyURLs.length) ? 0 : prevState + 1);
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
        <div className="controls">
          <button label="shuffle" onClick={next}>Shuffle</button>
          <button label="submit" onClick={handleFinalSubmission}>Submit</button>
        </div>
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