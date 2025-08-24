
export const formatTemperature = ( temp: number | undefined | null ): string => {
    if ( temp === undefined || temp === null ) return "--";
    return `${ Math.round ( temp ) }`;
};