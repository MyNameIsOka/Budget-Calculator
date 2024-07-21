// app/utils/exchangeRate.ts

const API_URL = "https://api.frankfurter.app/latest?from=JPY";
const CACHE_KEY = "exchangeRateCache";
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

type ExchangeRateCache = {
	timestamp: number;
	rates: {
		USD: number;
		EUR: number;
	};
};

export async function getExchangeRates(): Promise<ExchangeRateCache["rates"]> {
	const cachedData = localStorage.getItem(CACHE_KEY);

	if (cachedData) {
		const parsedData: ExchangeRateCache = JSON.parse(cachedData);
		if (Date.now() - parsedData.timestamp < CACHE_DURATION) {
			return parsedData.rates;
		}
	}

	try {
		const response = await fetch(API_URL);
		const data = await response.json();

		const rates = {
			USD: 1 / data.rates.USD,
			EUR: 1 / data.rates.EUR,
		};

		const cacheData: ExchangeRateCache = {
			timestamp: Date.now(),
			rates,
		};

		localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
		return rates;
	} catch (error) {
		console.error("Failed to fetch exchange rates:", error);
		throw error;
	}
}
