import { type FormEvent, useEffect, useState } from "react";
import { fetchWeatherApi } from "openmeteo";
import type { SearchResult, WeatherData } from "./types/types.ts";
import ForecastList from "./components/ForecastList.tsx";
import CurrentWeather from "./components/CurrentWeather.tsx";


const WeatherApp = () => {
    const [ searchTerm, setSearchTerm ] = useState ( "" );
    const [ searchResult, setSearchResult ] = useState<SearchResult[]> ( [] )
    const [ weatherData, setWeatherData ] = useState<WeatherData | null> ( null );
    const [ selectedDay, setSelectedDay ] = useState<number> ( 0 );
    const [ city, setCity ] = useState<SearchResult> ( {
        id: 1,
        name: "Chemnitz",
        country: "Deutschland",
        latitude: 50.8357,
        longitude: 12.92922,
    } );
    const [ error, setError ] = useState<string | null> ( null );
    const [ loading, setLoading ] = useState ( false );

    useEffect ( () => {
        if ( !searchTerm.trim () ) {
            setSearchResult ( [] )
            return
        }
        const inputTimeOut = setTimeout ( () => {
            const fetchCity = async () => {
                const cityUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${ searchTerm }&count=5&language=de&format=json`
                try {
                    setLoading ( true );
                    const res = await fetch ( cityUrl )
                    if ( !res.ok ) {
                        throw new Error ( `Response status: ${ res.status }` );
                    }
                    const data = await res.json ();

                    if ( !data.results || !Array.isArray ( data.results ) ) {
                        setSearchResult ( [] );
                        return;
                    }

                    const filteredCity: SearchResult[] = data.results.map ( ( item: SearchResult ) => ( {
                        id: item.id,
                        name: item.name,
                        country: item.country,
                        latitude: item.latitude,
                        longitude: item.longitude,
                    } ) )
                    setSearchResult ( filteredCity );
                } catch ( err ) {
                    if ( err instanceof Error ) {
                        setError ( err.message );
                    } else {
                        setError ( "Unbekannter Fehler" );
                    }
                } finally {
                    setLoading ( false );
                }
            }

            fetchCity ()
        }, 500 )

        return () => clearTimeout ( inputTimeOut );

    }, [ searchTerm ] )


    const handleSearch = ( e: FormEvent ) => {
        e.preventDefault ();
        if ( !searchTerm.trim () ) return;
        if ( searchResult.length > 0 ) {
            setCity ( searchResult[ 0 ] );
        }
        setSearchResult ( [] )
        setSearchTerm ( "" )
    };


    useEffect ( () => {
        const fetchData = async () => {
            const params = {
                latitude: city.latitude,
                longitude: city.longitude,
                daily: [ "weather_code", "temperature_2m_max", "temperature_2m_min", "wind_speed_10m_max", "wind_gusts_10m_max", "wind_direction_10m_dominant" ],
                hourly: [ "temperature_2m", "weather_code" ],
                models: "icon_seamless",
                current: [ "temperature_2m", "weather_code", "wind_speed_10m", "wind_direction_10m", "wind_gusts_10m" ],
                wind_speed_unit: "ms",
            };

            const url = "https://api.open-meteo.com/v1/forecast";
            const responses = await fetchWeatherApi ( url, params );

            const response = responses[ 0 ];

            const utcOffsetSeconds = response.utcOffsetSeconds ();

            const current = response.current ()!;
            const hourly = response.hourly ()!;
            const daily = response.daily ()!;


            setWeatherData ( {
                    current: {
                        time: new Date ( ( Number ( current.time () ) + utcOffsetSeconds ) * 1000 ),
                        temperature_2m: current.variables ( 0 )!.value (),
                        weather_code: current.variables ( 1 )!.value (),
                        wind_speed_10m: current.variables ( 2 )!.value (),
                        wind_direction_10m: current.variables ( 3 )!.value (),
                        wind_gusts_10m: current.variables ( 4 )!.value (),
                    },
                    hourly: {
                        time: [ ...Array ( ( Number ( hourly.timeEnd () ) - Number ( hourly.time () ) ) / hourly.interval () ) ].map (
                            ( _, i ) => new Date ( ( Number ( hourly.time () ) + i * hourly.interval () + utcOffsetSeconds ) * 1000 )
                        ),
                        temperature_2m: hourly.variables ( 0 )!.valuesArray (),
                        weather_code: hourly.variables ( 1 )!.valuesArray (),
                    },
                    daily: {
                        time: [ ...Array ( ( Number ( daily.timeEnd () ) - Number ( daily.time () ) ) / daily.interval () ) ].map (
                            ( _, i ) => new Date ( ( Number ( daily.time () ) + i * daily.interval () + utcOffsetSeconds ) * 1000 )
                        ),
                        weather_code: daily.variables ( 0 )!.valuesArray (),
                        temperature_2m_max: daily.variables ( 1 )!.valuesArray (),
                        temperature_2m_min: daily.variables ( 2 )!.valuesArray (),
                        wind_speed_10m_max: daily.variables ( 3 )!.valuesArray (),
                        wind_gusts_10m_max: daily.variables ( 4 )!.valuesArray (),
                        wind_direction_10m_dominant: daily.variables ( 5 )!.valuesArray (),
                    },
                }
            );
        };

        fetchData ();
    }, [ city ] );

    const selectCity = ( cityData: SearchResult ) => {
        setCity ( cityData );
        setSelectedDay ( 0 )
        setSearchTerm ( "" );
        setSearchResult ( [] );
        setError ( "" )
    }

    const isCurrentDay = weatherData?.daily.time[ selectedDay ].toLocaleDateString () === weatherData?.current.time.toLocaleDateString ()

    if ( !weatherData ) return <div className="text-white">Loading...</div>;

    return (
        <div className="min-h-screen  bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 p-6">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-white mb-2">SurferWeather</h1>
                <p className="text-blue-100">Wetter für Wassersport in Deutschland</p>
            </div>
            { error && (
                <div className="bg-[#ff6347] text-white p-2 rounded mb-2">
                    { error }
                </div>
            ) }
            <form onSubmit={ handleSearch } className="relative max-w-md mx-auto mb-8">
                <input
                    type="text"
                    value={ searchTerm }
                    onChange={ ( e ) => setSearchTerm ( e.target.value ) }
                    onBlur={ ( e ) => setSearchTerm ( e.target.value.trim () ) }
                    placeholder="Stadt in Deutschland eingeben..."
                    className="w-full pl-10 pr-4 py-3 rounded-full bg-white/20 backdrop-blur-md text-white placeholder-blue-100
                    border border-white/30 focus:outline-none focus:border-white/50 focus:bg-white/30"
                />
                { searchResult.length > 0 && ( <ul className="absolute text-left left-0 right-0 top-full mt-2 z-10
               rounded-3xl overflow-hidden shadow-lg
               bg-white/20 backdrop-blur-md border border-white/30">
                    { searchResult.map ( ( city: SearchResult ) => (
                        <li
                            onClick={ () => selectCity ( city ) }
                            key={ city.id }
                            className="pl-10 py-2 text-white cursor-pointer hover:bg-white/30
                 transition-colors duration-200"
                        >
                            { city.name }, { city.country }
                        </li>
                    ) ) }
                </ul> ) }
            </form>
            { loading ? (
                <div className="text-white text-center">Loading...</div>
            ) : (
                <>
                    <ForecastList
                        city={ city }
                        weatherData={ weatherData }
                        setSelectedDay={ setSelectedDay }
                        selectedDay={ selectedDay }
                    />
                    <CurrentWeather
                        isCurrentDay={ isCurrentDay }
                        city={ city }
                        weatherData={ weatherData }
                        selectedDay={ selectedDay }
                    />
                </>
            ) }
        </div>
    );
};

export default WeatherApp;
