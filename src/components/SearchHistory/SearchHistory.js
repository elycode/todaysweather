import React from "react";
import "./SearchHistory.less";

//for time display for bigger screen
function formatTimestamp(timestamp) {
  const date = new Date(timestamp * 1000); // Convert UNIX timestamp to milliseconds
  const options = {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  };
  return date.toLocaleString("en-US", options);
}

//for time display for smaller screen
function formatDateTimestamp(timestamp) {
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
  const time = new Date(timestamp * 1000).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  const dateTime = `${formattedDate} ${time}`;
  return dateTime;
}

function SearchHistory(props) {
  const searchHistory = JSON.parse(
    localStorage.getItem("searchHistory") || "[]"
  );

  const handleDelete = (index) => {
    // Remove the item at the specified index from searchHistory array
    searchHistory.splice(index, 1);

    // Update the local storage with the updated searchHistory array
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));

    // Force re-render the component by calling window.location.reload()
    window.location.reload();
  };

  const handleSearchHistoryClick = async (event) => {
    // Call the onSearchHistoryClick function to props
    props.onSearchHistoryClick(event);
  };

  return (
    <>
      <div>
        {searchHistory.length === 0 ? (
          <div className="no-record">
            <div>No record</div>
          </div>
        ) : (
          <div className={`history-list ${props.theme}`}>
            {searchHistory.map((result, index) => (
              <div key={index} className="history-item">
                <div className="country-name-and-time">
                  <div className="country-name-and-index">
                    <div className="index-number">{index + 1}.</div>
                    <div>
                      {result.weatherResponse.name},{" "}
                      {result.weatherResponse.sys.country}
                    </div>
                  </div>
                  <div className="time">
                    {formatTimestamp(result.weatherResponse.dt)}
                  </div>
                  <div className="time-mobile">
                    {formatDateTimestamp(result.weatherResponse.dt)}
                  </div>
                </div>
                <div className="buttons">
                  <button
                    type="submit"
                    className="search-country"
                    onClick={() => handleSearchHistoryClick(result.result)}
                  ></button>
                  <button
                    type="button"
                    className="delete"
                    onClickCapture={() => handleDelete(index)}
                  ></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default SearchHistory;
