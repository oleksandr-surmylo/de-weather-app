import { WeatherIcon } from "./WeatherIcon.tsx";
import { formatTemperature } from "../utils/formatTemp.ts";
import type { SearchResult, WeatherData } from "../types/types.ts";
import WeatherStat from "./WeatherStat.tsx";

interface CurrentWeatherProps {
    city: SearchResult;
    weatherData: WeatherData;
    selectedDay: number;
    isCurrentDay: boolean;
}

const CurrentWeather = ( { selectedDay, isCurrentDay, weatherData, city }: CurrentWeatherProps ) => {

        const timeNow = new Date ().getHours ();

        function getDaySlice ( selectedDay: number ) {
            const start = selectedDay * 24;
            const end = start + 24;
            const effectiveStart = isCurrentDay ? timeNow : start;
            return {
                time: weatherData.hourly.time.slice ( effectiveStart, end ),
                temperature: weatherData.hourly.temperature_2m?.slice ( effectiveStart, end ),
                code: weatherData.hourly.weather_code?.slice ( effectiveStart, end ),
            };
        }

        const today = getDaySlice (selectedDay);

        return (
            <div
                className="flex flex-col relative self-start bg-white/20 backdrop-blur-md rounded-3xl p-6 border border-white/30 max-w-lg min-h-80 mt-3">
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
                            type={
                                isCurrentDay
                                    ? today.code?.[ 0 ] ?? 0
                                    : weatherData.daily.weather_code?.[ selectedDay ] ?? 0
                            }
                        />
                    </div>
                    <div className="flex items-end gap-4">
                        <div className="leading-none">
                            { !isCurrentDay &&
                                <span>{ weatherData.daily.time[ selectedDay ].toLocaleDateString ( "de-DE", {
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
                        return (
                            <div
                                key={ index }
                                className="flex flex-col shrink-0 bg-white/10 rounded-xl p-4 min-w-[80px] items-center"
                            >
                                <div
                                    className="text-blue-200 text-sm mb-2">
                                    { time.toLocaleTimeString ( "de-DE", {
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
                    <WeatherStat
                        label="Windgeschwindigkeit"
                        value={ isCurrentDay ?
                            weatherData.current.wind_speed_10m ?? 0
                            : weatherData.daily.wind_speed_10m_max?.[ selectedDay ] ?? 0
                        }
                        unit="m/s"
                    />
                    <WeatherStat
                        label="Windböen"
                        value={ isCurrentDay
                            ? weatherData.current.wind_gusts_10m ?? 0
                            : weatherData.daily.wind_gusts_10m_max?.[ selectedDay ] ?? 0
                        }
                        unit="m/s"
                    />
                    <WeatherStat
                        label="Windrichtung"
                        value={ isCurrentDay
                            ? weatherData.current.wind_direction_10m ?? 0
                            : weatherData.daily.wind_direction_10m_dominant?.[ selectedDay ] ?? 0
                        }
                        unit="°"
                    />

                </div>
            </div>
        )
            ;
    }
;

export default CurrentWeather;