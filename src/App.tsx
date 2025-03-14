import Navigation from './components/Navigation';
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import { useEffect, useState } from 'react';
import { UserLocation, WeatherData } from './types';
import weatherService from './services/weather';
import ipdataService from './services/ipdata';
import BackgroundVideo from './components/BackgroundVideo';

const App = () => {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);

  const getUserLocationByIp = async () => {
    try {
      const { latitude, longitude } = await ipdataService.getIpdata();
      setUserLocation({ latitude, longitude });
    } catch (error) {
      console.error('Failed to fetch user location by IP: ', error);
    }
  };

  useEffect(() => {
    const fetchWeather = async () => {
      if (!weather) {
        if (!userLocation) {
          await getUserLocationByIp();
        } else {
          const location = `${userLocation.latitude.toString()},${userLocation.longitude.toString()}`;
          try {
            const weather = await weatherService.getCurrentWeather(location);
            setWeather(weather);
          } catch (error) {
            console.error('Failed to fetch weather data: ', error);
          }
        }
      }
    };
    void fetchWeather();
  }, [userLocation, weather]);

  useEffect(() => {
    const onLocationGiven = async () => {
      if (selectedLocation) {
        try {
          const weather = await weatherService.getCurrentWeather(
            selectedLocation
          );
          setWeather(weather);
        } catch (error) {
          console.error('Failed to fetch weather data: ', error);
        }
      }
    };

    void onLocationGiven();
  }, [selectedLocation]);

  return (
    <>
      <BackgroundVideo weather={weather?.current}>
        <Navigation setSelectedLocation={setSelectedLocation} />
        <Routes>
          <Route path="/" element={<HomePage weather={weather} />} />
        </Routes>
      </BackgroundVideo>
    </>
  );
};

export default App;
