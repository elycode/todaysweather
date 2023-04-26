import React, { useState } from "react";
import "./SharedLayout.less";
import searchButton from "../../shared/images/Search.svg";
import clearButton from "../../shared/images/Delete.svg";
import Main from "../Main/Main";
import axios from "axios";

function SharedLayout() {
  const API_KEY = process.env.REACT_APP_API_KEY;
  const [theme, setTheme] = useState("light");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");

  //Track state of the weather api's response
  const [searchResult, setSearchResult] = useState([]);

  function toggleTheme() {
    setTheme(theme === "light" ? "dark" : "light");
  }

  const handleCityChange = (event) => {
    setCity(event.target.value);
  };

  const handleCountryChange = (event) => {
    setCountry(event.target.value);
  };

  const handleClear = (event) => {
    setCity("");
    setCountry("");
  };

  function saveToLocalStorage(searchHistory) {
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
  }

  //handle submit button in sharedLayout component
  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = { city, country };

    const searchResult = await doSearch(result.city, result.country);

    setSearchResult(searchResult);
  };

  //handle search queries from searchHistory component
  const handleSubmitAgain = async (event) => {
    const result = { city: event.city, country: event.country };

    const searchResult = await doSearch(result.city, result.country);

    setSearchResult(searchResult);
  };

  const doSearch = async (city, country) => {
    //query the api for country only if city was left empty by user
    const query = city ? `${city},${country}` : country;
    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit&appid=${API_KEY}`;

    try {
      const geoResponse = await axios.get(geoUrl);
      // Check if the response from the geo API is empty
      if (geoResponse.data.length === 0) {
        console.log("Location not found");
        return null;
      }

      // Extract latitude and longitude from the geo API response
      const { lat, lon } = geoResponse.data[0];

      // Make a request to the weather API with the latitude and longitude coordinates
      const weatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`
      );

      const saveHistoryData = {
        result: { city, country },
        weatherResponse: weatherResponse.data,
      };

      //Save the search to local storage
      const searchHistory = JSON.parse(
        localStorage.getItem("searchHistory") || "[]"
      );
      searchHistory.unshift(saveHistoryData);
      saveToLocalStorage(searchHistory);

      return weatherResponse.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  return (
    <>
      <div className={`shared-layout ${theme}`}>
        <div className="search-bar">
          <form onSubmit={handleSubmit}>
            <div className="input-box">
              <label htmlFor="city">City</label>
              <input
                type="text"
                id="city"
                value={city}
                onChange={handleCityChange}
              ></input>
            </div>
            <div className="input-box">
              <label htmlFor="country">Country</label>
              <input
                type="text"
                id="country"
                value={country}
                onChange={handleCountryChange}
              ></input>
            </div>
            <div className={`buttons ${theme}`}>
              <button
                type="submit"
                className="search-button"
                onClick={handleSubmit}
              >
                <img src={searchButton} alt="search-button" />
              </button>
              <button type="button" className="clear" onClick={handleClear}>
                <img src={clearButton} alt="clear-button" />
              </button>
            </div>
          </form>
        </div>
        <button onClick={toggleTheme} className="toggle-button">Toggle Theme</button>
        <Main
          searchResult={searchResult}
          onSearchHistroyAgain={handleSubmitAgain}
          theme={theme}
          toggleTheme={toggleTheme}
        />
      </div>
    </>
  );
}

export default SharedLayout;
