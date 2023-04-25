import React, { useState, useEffect } from "react";
import "./WeatherCard.less";
import countries from "i18n-iso-countries";

countries.registerLocale(require("i18n-iso-countries/langs/en.json"));

function WeatherCard(props) {
  //Get searchResult from localstorage if props don't have, else set searchResult as null
  const storedSearchResult = localStorage.getItem("searchResult");
  const { searchResult } = props || {
    searchResult: storedSearchResult ? JSON.parse(storedSearchResult) : null,
  };

  //Store the state as default, not-found or loaded to display the appropriate messages and display respectively
  const [weatherState, setWeatherState] = useState("default");

  const kelvinToDegree = (k) => {
    return (k - 273.15).toFixed(1);
  };

  let dateTime = "";
  if (searchResult && searchResult.dt) {
    const date = new Date();
    //use zh-Hans-CN to get the date in YYYY-MM-DD format, then replace / with -
    const formattedDate = date
      .toLocaleDateString("zh-Hans-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      .replace(/\//g, "-");

    //convert time to X.XX AM format
    const time = new Date(searchResult.dt * 1000).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
    dateTime = `${formattedDate} ${time}`;
  }

  useEffect(() => {
    if (searchResult && searchResult.main) {
      setWeatherState("loaded");
    } else if (searchResult && searchResult.error) {
      setWeatherState("not-found");
    } else if (searchResult === null) {
      setWeatherState("not-found");
    } else {
      setWeatherState("default");
    }
  }, [searchResult]);

  return (
    <>
      {weatherState === "default" && (
        <div className="default-view">
          <div>Welcome, Enter a city or country name to get started.</div>
        </div>
      )}

      {weatherState === "not-found" && (
        <div className="not-found">City/ Country not found</div>
      )}

      {weatherState === "loaded" && (
        <div className={`weather-card ${props.theme}`}>
          {searchResult && searchResult.main ? (
            <>
              <div className="weather-left">
                <h1>Today's Weather</h1>
                <p className="country grey-text">
                  {searchResult.name}, {searchResult.sys.country}
                </p>
                <p className="big-purple-text">
                  {searchResult.weather[0].main}
                </p>
                <p className="grey-text">
                  {kelvinToDegree(searchResult.main.temp_min)}&deg; ~{" "}
                  {kelvinToDegree(searchResult.main.temp_max)}&deg;
                </p>
                <p className="description grey-text">
                  {searchResult.sys.description}
                </p>
              </div>

              <div className="weather-right">
                <p className="description grey-text">
                  {searchResult.weather[0].description.charAt(0).toUpperCase() +
                    searchResult.weather[0].description.slice(1)}
                </p>
                <p className="humidity grey-text">
                  Humidity: {searchResult.main.humidity}%
                </p>
                <p className="date-time grey-text">{dateTime}</p>
              </div>
            </>
          ) : (
            <div className="not-found">City/ Country not found</div>
          )}
        </div>
      )}
    </>
  );
}

export default WeatherCard;
