import React from "react";
import "./Main.less";
import WeatherCard from "../WeatherCard/WeatherCard";
import SearchHistory from "../SearchHistory/SearchHistory";
import sun from "../../shared/images/sun.png";
import cloud from "../../shared/images/cloud.png";

function Main(props) {
  const handleSearchHistoryClick = (item) => {
    // Call the onSearch function from props with the city name to search again
    props.onSearchHistroyAgain(item);
  };

  return (
    <>
      <div  className={`main ${props.theme}`}>
        <div className="weather-image">
          {props.searchResult && props.searchResult.main ? (
            <img
              src={props.searchResult.clouds <= 30 ? sun : cloud}
              alt="weather"
            />
          ) : null}
        </div>
        <div>
          <WeatherCard
            searchResult={props.searchResult}
            theme={props.theme}
            toggleTheme={props.toggleTheme}
          />
        </div>
        <div className="search-history">
          <div className="history-title">Search History</div>
          <SearchHistory
            onSearchHistoryClick={handleSearchHistoryClick}
            theme={props.theme}
            toggleTheme={props.toggleTheme}
          />
        </div>
      </div>
    </>
  );
}

export default Main;
