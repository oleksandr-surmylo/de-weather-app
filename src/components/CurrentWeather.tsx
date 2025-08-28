import { WeatherIcon } from "./WeatherIcon.tsx";
import { formatTemperature } from "../utils/formatTemp.ts";
import type { SearchResult, WeatherData } from "../types/types.ts";

interface CurrentWeatherProps {
    city: SearchResult;
    weatherData: WeatherData;
    selectedDay: number;
    isCurrentDay: boolean;
}

const CurrentWeather = ( { selectedDay, isCurrentDay, weatherData, city }: CurrentWeatherProps ) => {

        function getDaySlice ( selectedDay: number ) {
            const start = selectedDay * 24;
            const end = start + 24;
            return {
                time: weatherData.hourly.time.slice ( start, end ),
                temperature: weatherData.hourly.temperature_2m?.slice ( start, end ),
                code: weatherData.hourly.weather_code?.slice ( start, end ),
            };
        }

        const today = getDaySlice ( selectedDay );

        return (
            <div
                className="relative flex flex-col bg-white/20 backdrop-blur-md rounded-3xl p-6 border border-white/30 max-w-lg min-h-80 mt-3">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="uppercase tracking-wider text-white text-2xl font-semibold">
                        { city.name }
                    </h3>
                    <span className="text-blue-100 text-sm font-bold uppercase"></span>
                </div>
                <div className="flex items-center gap-6">
                    <div className="shrink-0 bg-white/10 rounded-2xl p-4">
                        <WeatherIcon
                            size={ 64 }
                            type={ weatherData.daily.weather_code?.[ selectedDay ] || 0 }
                        />
                    </div>
                    <div className="flex items-end gap-4">
                        <div className="leading-none">
                            { !isCurrentDay &&
                                <span>{ weatherData.daily.time[ selectedDay ].toLocaleDateString ("de-DE", {
                                    weekday: "long",
                                } ) }</span>
                            }
                            <span
                                className="flex items-center justify-between uppercase text-sm font-semibold text-blue-200 tracking-wide mt-1">
                                { isCurrentDay && (
                                    <div className="right-3 w-3 h-3 rounded-full bg-yellow-400 animate-pulse"></div>
                                ) }
                                { isCurrentDay ? 'Jetzt' : null }
                            </span>
                            <div className="text-white text-5xl font-semibold tracking-tight">
                                { isCurrentDay
                                    ? <span
                                        className="mr-2">{ formatTemperature ( weatherData.current.temperature_2m ) }°
                                      </span>
                                    : <>
                                        <span
                                            className="mr-2">{ formatTemperature ( weatherData.daily.temperature_2m_max?.[ selectedDay ] ) }°
                                        </span>
                                        <span
                                            className="text-gray-500">{ formatTemperature ( weatherData.daily.temperature_2m_min?.[ selectedDay ] ) }°
                                        </span>
                                    </>
                                }
                            </div>
                        </div>
                        <div className="ml-6 pl-6 border-l border-white/20"></div>
                    </div>
                </div>
                <div className="flex space-x-4 pb-2 overflow-x-auto my-5">
                    { today.time.map ( ( time, index ) => {
                        const timeFormated = ( time )
                        return (
                            <div
                                key={ index }
                                className="flex flex-col shrink-0 bg-white/10 rounded-xl p-4 min-w-[80px] items-center"
                            >
                                <div
                                    className="text-blue-200 text-sm mb-2">
                                    { timeFormated.toLocaleTimeString ( "de-DE", {
                                        timeZone: "UTC",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    } ) }
                                </div>
                                <WeatherIcon
                                    type={ today.code?.[ index ] || 0 }
                                    size={ 32 }
                                />
                                <div>
                                <span className="text-white font-semibold">
                                    { formatTemperature ( today.temperature?.[ index ] ) }°
                                </span>
                                </div>
                            </div>
                        )
                    } ) }
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-5 sm:mt-auto">
                    {/* Wind Speed */ }
                    <div className="bg-white/10 rounded-xl p-4">
                        <div className="flex flex-col text-blue-200 text-xs uppercase tracking-wide truncate">
                            <span title="Windgeschwindigkeit">Windgeschwindigkeit</span>
                        </div>
                        <div className="text-white font-semibold mt-1">
                            { formatTemperature ( isCurrentDay
                                ? weatherData.current.wind_speed_10m
                                : weatherData.daily.wind_speed_10m_max?.[ selectedDay ] ) } m/s
                        </div>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4">
                        <div className="flex flex-col text-blue-200 text-xs uppercase tracking-wide">
                            <span title="Windgeschwindigkeit">Windböen</span>
                        </div>
                        <div className="text-white font-semibold mt-1">
                            { formatTemperature ( isCurrentDay
                                ? weatherData.current.wind_gusts_10m
                                : weatherData.daily.wind_gusts_10m_max?.[ selectedDay ] ) } m/s
                        </div>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4">
                        <div className="flex flex-col text-blue-200 text-xs uppercase tracking-wide">
                            <span title="Windgeschwindigkeit">Windrichtung</span>
                        </div>
                        <div className="text-white font-semibold mt-1">
                            { formatTemperature ( isCurrentDay
                                ? weatherData.current.wind_direction_10m
                                : weatherData.daily.wind_direction_10m_dominant?.[ selectedDay ] ) }°
                        </div>
                    </div>
                </div>
            </div>
        )
            ;
    }
;

export default CurrentWeather;