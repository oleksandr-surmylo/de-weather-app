import { WeatherIcon } from "./WeatherIcon.tsx";
import { formatTemperature } from "../utils/formatTemp.ts";
import type { SearchResult, WeatherData } from "../types/types.ts";

interface ForecastListProps {
    city: SearchResult;
    weatherData: WeatherData;
    setSelectedDay: ( selectedDay: number ) => void;
    selectedDay: number;
}


const ForecastList = ( { city, weatherData, setSelectedDay, selectedDay }: ForecastListProps ) => {
    return (
        <div className="flex flex-col bg-white/20 backdrop-blur-md rounded-3xl p-6 border border-white/30 mx-auto overflow-x-auto">
            <h3 className="uppercase tracking-wider text-white text-lg font-semibold mb-4">
                { city.name }
            </h3>
            <div className="flex space-x-4 pb-2 overflow-x-scroll md:overflow-x-visible">
                { weatherData?.daily.time.map ( ( time, index ) => {
                    const isToday = new Date ().toLocaleDateString () === new Date ( time ).toLocaleDateString ();
                    return (
                        <div
                            onClick={ () => setSelectedDay ( index ) }
                            key={ index }
                            className={ `flex flex-col cursor-pointer shrink-0 ${ selectedDay === index ? "bg-white/30" : "bg-white/10" } rounded-xl p-4 min-w-[80px] items-center
                            transition-transform duration-300 ease-in-out transform hover:scale-101 hover:shadow-xl hover:-translate-y-1` }
                        >
                            <div
                                className={ `${ isToday ? "text-blue-100 font-bold" : "text-blue-200" } text-sm mb-2 ` }>
                                { !isToday ? time.toLocaleDateString ( "de-DE", {
                                    day: "numeric",
                                    weekday: "short",
                                } ) : 'Heute' }
                            </div>
                            <WeatherIcon
                                type={ weatherData.daily.weather_code?.[ index ] || 0 }
                                size={ 32 }
                            />
                            <div>
                                <span className="text-white font-semibold mr-1">
                                    { formatTemperature ( weatherData.daily.temperature_2m_max?.[ index ] ) }°
                                </span>
                                <span className="text-gray-500 font-semibold mt-2">
                                    { formatTemperature ( weatherData.daily.temperature_2m_min?.[ index ] ) }°
                                </span>
                            </div>
                        </div>
                    )
                } ) }
            </div>
        </div>
    );
};

export default ForecastList;