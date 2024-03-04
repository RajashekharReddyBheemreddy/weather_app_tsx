import { MainWrapper } from "./styles.module";
import { AiOutlineSearch } from "react-icons/ai";
import { WiHumidity } from "react-icons/wi";
import { SiWindicss } from "react-icons/si";
import {
  BsFillSunFill,
  BsCloudyFill,
  BsFillCloudRainFill,
  BsCloudFog2Fill,
} from "react-icons/bs";
import { RiLoaderFill } from "react-icons/ri";
import { TiWeatherPartlySunny } from "react-icons/ti";
import axios from "axios";
import { useEffect, useState } from "react";
import { WeatherDataProps } from "./hookProps";
import { api_Endpoint, api_key } from "./ApiData";
export const DisplayWeather = () => {
  const [weatherData, setWeatherData] = useState<WeatherDataProps | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchCity, setsearchCity] = useState("");

  const fetchCurrentWeather = async (lat: number, lon: number) => {
    const url = `${api_Endpoint}weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`;
    const response = await axios.get(url);
    return response.data;
  };

  const iconChanger = (weather: string) => {
    let iconElement: React.ReactNode;
    let iconColor: string;

    switch (weather) {
      case "Rain":
        iconElement = <BsFillCloudRainFill />;
        iconColor = "#272829";
        break;

      case "Clear":
        iconElement = <BsFillSunFill />;
        iconColor = "#FFC436";
        break;
      case "Clouds":
        iconElement = <BsCloudyFill />;
        iconColor = "#102C57";
        break;

      case "Mist":
        iconElement = <BsCloudFog2Fill />;
        iconColor = "#279EFF";
        break;
      default:
        iconElement = <TiWeatherPartlySunny />;
        iconColor = "#7B2869";
    }

    return (
      <span className="icon" style={{ color: iconColor }}>
        {iconElement}
      </span>
    );
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      const [currentWeather] = await Promise.all([
        fetchCurrentWeather(latitude, longitude),
      ]);
      setIsLoading(true);
      setWeatherData(currentWeather);
    });
  }, []);

  const fetchWeatherData = async (city: string) => {
    try {
      const url = `${api_Endpoint}weather?q=${city}&appid=${api_key}&units=metric`;
      const searchResp = await axios.get(url);
      const currentSearch: WeatherDataProps = searchResp.data;
      return { currentSearch };
    } catch (error) {
      throw error;
    }
  };
  const handleSearch = async () => {
    if (searchCity.trim() === "") return;
    try {
      const { currentSearch } = await fetchWeatherData(searchCity);
      setWeatherData(currentSearch);
    } catch (error) {
      console.error("No Results found");
    }
  };
  return (
    <MainWrapper>
      <div className="container">
        <div className="searchArea">
          <input
            type="text"
            placeholder="Enter a city"
            value={searchCity}
            onChange={(e) => setsearchCity(e.target.value)}
          />
          <div className="searchCircle">
            <AiOutlineSearch className="searchIcon" onClick={handleSearch} />
          </div>
        </div>
        {weatherData && isLoading ? (
          <>
            <div className="weatherArea">
              <h2>{weatherData.name}</h2>
              <span>{weatherData.sys.country}</span>
              <div className="icon">
                {iconChanger(weatherData.weather[0].main)}
              </div>
              <h2>{weatherData.main.temp}</h2>
              <h3>{weatherData.weather[0].main}</h3>
            </div>
            <div className="bottomInfoArea">
              <div className="humidityLevel">
                <WiHumidity className="windIcon" />
                <div className="humidInfo">
                  <h2>{weatherData.main.humidity}%</h2>
                  <p>Humidity</p>
                </div>
              </div>
              <div className="wind">
                <SiWindicss className="windIcon" />
                <div className="humidInfo">
                  <h2>{weatherData.wind.speed} km/h</h2>
                  <p>wind speed</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="loading">
            <RiLoaderFill className="LoadingIcon" />
            <p>Loading</p>
          </div>
        )}
      </div>
    </MainWrapper>
  );
};
