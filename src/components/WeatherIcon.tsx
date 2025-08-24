import type { JSX } from "react";
import { Cloud, CloudLightning, CloudRain, CloudRainWind, CloudSnow, CloudSun, Cloudy, Sun } from "lucide-react";

export const WeatherIcon = ( { type, size }: { type: number; size: number } ) => {
    const iconMap: Record<number, JSX.Element> = {
        0: <Sun size={ size } className="text-yellow-500"/>,
        1: <CloudSun size={ size } className="text-yellow-500"/>,
        2: <Cloud size={ size } className="text-gray-500"/>,
        3: <Cloudy size={ size } className="text-gray-600"/>,
        61: <CloudRain size={ size } className="text-blue-300"/>,
        63: <CloudRain size={ size } className="text-blue-600"/>,
        65: <CloudRain size={ size } className="text-blue-700"/>,
        71: <CloudSnow size={ size } className="text-blue-300"/>,
        73: <CloudSnow size={ size } className="text-blue-400"/>,
        75: <CloudSnow size={ size } className="text-blue-500"/>,
        80: <CloudRainWind size={ size } className="text-blue-300"/>,
        81: <CloudRainWind size={ size } className="text-blue-400"/>,
        82: <CloudRainWind size={ size } className="text-blue-500"/>,
        95: <CloudLightning size={ size } className="text-yellow-600"/>,
    };

    return iconMap[ type ] || <Cloud size={ size } className="text-gray-500"/>;
};