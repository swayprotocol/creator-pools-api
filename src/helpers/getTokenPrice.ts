import axios from "axios";

export const getTokenPrice = async (coingecko_coin_ticker: string) => {
  const response = await axios.get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&a=5&ids=${coingecko_coin_ticker}`)
  return response.data[0].current_price
}

export const getTokenData = async (coingecko_coin_ticker: string) => {
  const response = await axios.get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&a=5&ids=${coingecko_coin_ticker}`)
  return response.data[0]

}
