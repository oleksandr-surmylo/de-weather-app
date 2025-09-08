import { formatTemperature } from "../utils/formatTemp.ts";

interface WeatherStatProps {
    label: string;
    value?: number;
    unit: string;
}

const WeatherStat = ( { label, value, unit }: WeatherStatProps ) => (
    <div className="bg-white/10 rounded-xl p-4">
        <div
            className="flex flex-col text-blue-200 text-xs uppercase tracking-wide"
        >
            <span title={ label }
                  className={ `${ label === "Windgeschwindigkeit" ? "truncate" : "" }` }>{ label }</span>
        </div>
        <div className="text-white font-semibold mt-1">
            { formatTemperature ( value ) } { unit }
        </div>
    </div>
);

export default WeatherStat;
