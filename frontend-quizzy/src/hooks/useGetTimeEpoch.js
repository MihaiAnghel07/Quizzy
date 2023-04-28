
export const useGetTimeEpoch = () => {

    const getTimeEpoch = () => {
        return new Date().getTime().toString();                             
    }

    return { getTimeEpoch }
}