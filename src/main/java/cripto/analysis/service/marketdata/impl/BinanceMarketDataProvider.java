package cripto.analysis.service.marketdata.impl;

import cripto.analysis.model.dto.CandleStick;
import cripto.analysis.service.marketdata.MarketDataProvider;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;

/**
 * Implementación concreta para la API de Binance
 */

public class BinanceMarketDataProvider implements MarketDataProvider {

    private static final String BINANCE_API_BASE_URL = "https://api.binance.com/api/v3";
    private static final String KLINES_ENDPOINT = "/klines";
    private static final String TICKER_PRICE_ENDPOINT = "/ticker/price";
    private static final String TICKER_24H_ENDPOINT = "/ticker/24hr";
    
    private final ObjectMapper objectMapper;
    
    public BinanceMarketDataProvider() {
        this.objectMapper = new ObjectMapper();
        this.objectMapper.findAndRegisterModules(); // Para soporte de Java Time
    }

    @Override
    public CandleStick[] getCandlesticks(String symbol, String interval, int limit) {
        HttpURLConnection connection = null;
        try {
            String urlString = String.format("%s%s?symbol=%s&interval=%s&limit=%d",
                    BINANCE_API_BASE_URL, KLINES_ENDPOINT, symbol.toUpperCase(), interval, limit);
            
            URL url = new URL(urlString);
            connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");
            connection.setRequestProperty("Accept", "application/json");
            
            int responseCode = connection.getResponseCode();
            
            if (responseCode == 200) {
                String responseBody = readResponse(connection);
                return parseKlinesResponse(responseBody);
            } else {
                throw new RuntimeException("Error fetching data from Binance: " + responseCode);
            }
            
        } catch (IOException e) {
            throw new RuntimeException("Failed to connect to Binance API", e);
        } finally {
            if (connection != null) {
                connection.disconnect();
            }
        }
    }

    @Override
    public double getVolume(String symbol) {
        HttpURLConnection connection = null;
        try {
            String urlString = String.format("%s%s?symbol=%s",
                    BINANCE_API_BASE_URL, TICKER_24H_ENDPOINT, symbol.toUpperCase());
            
            URL url = new URL(urlString);
            connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");
            connection.setRequestProperty("Accept", "application/json");
            
            int responseCode = connection.getResponseCode();
            
            if (responseCode == 200) {
                String responseBody = readResponse(connection);
                JsonNode jsonNode = objectMapper.readTree(responseBody);
                return jsonNode.get("volume").asDouble();
            } else {
                throw new RuntimeException("Error fetching volume from Binance: " + responseCode);
            }
            
        } catch (IOException e) {
            throw new RuntimeException("Failed to connect to Binance API", e);
        } finally {
            if (connection != null) {
                connection.disconnect();
            }
        }
    }

    @Override
    public double getGlobalLiquidity() {
        // Binance no proporciona liquidez global directamente
        // Podemos aproximarla con el volumen total de los principales pares
        try {
            // Obtener volumen de los principales pares
            double btcVolume = getVolume("BTCUSDT");
            double ethVolume = getVolume("ETHUSDT");
            double bnbVolume = getVolume("BNBUSDT");
            
            // Suma ponderada como aproximación de liquidez
            return btcVolume * 0.5 + ethVolume * 0.3 + bnbVolume * 0.2;
            
        } catch (Exception e) {
            throw new RuntimeException("Failed to calculate global liquidity", e);
        }
    }

    @Override
    public double getCurrentPrice(String symbol) {
        HttpURLConnection connection = null;
        try {
            String urlString = String.format("%s%s?symbol=%s",
                    BINANCE_API_BASE_URL, TICKER_PRICE_ENDPOINT, symbol.toUpperCase());
            
            URL url = new URL(urlString);
            connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");
            connection.setRequestProperty("Accept", "application/json");
            
            int responseCode = connection.getResponseCode();
            
            if (responseCode == 200) {
                String responseBody = readResponse(connection);
                JsonNode jsonNode = objectMapper.readTree(responseBody);
                return jsonNode.get("price").asDouble();
            } else {
                throw new RuntimeException("Error fetching price from Binance: " + responseCode);
            }
            
        } catch (IOException e) {
            throw new RuntimeException("Failed to connect to Binance API", e);
        } finally {
            if (connection != null) {
                connection.disconnect();
            }
        }
    }

    @Override
    public boolean isConnected() {
        try {
            // Intentar obtener el precio de BTC como prueba de conexión
            getCurrentPrice("BTCUSDT");
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public String getProviderName() {
        return "Binance";
    }

    /**
     * Parsea la respuesta de la API de Binance klines a objetos CandleStick
     */
    private CandleStick[] parseKlinesResponse(String responseBody) throws IOException {
        JsonNode rootNode = objectMapper.readTree(responseBody);
        List<CandleStick> candleSticks = new ArrayList<>();
        
        for (JsonNode kline : rootNode) {
            CandleStick candle = new CandleStick();
            
            // Parsear los datos de la vela (formato de Binance)
            candle.setOpenTime(LocalDateTime.ofEpochSecond(kline.get(0).asLong() / 1000, 0, ZoneOffset.UTC));
            candle.setOpen(kline.get(1).asDouble());
            candle.setHigh(kline.get(2).asDouble());
            candle.setLow(kline.get(3).asDouble());
            candle.setClose(kline.get(4).asDouble());
            candle.setVolume(kline.get(5).asDouble());
            candle.setCloseTime(LocalDateTime.ofEpochSecond(kline.get(6).asLong() / 1000, 0, ZoneOffset.UTC));
            candle.setNumberOfTrades(kline.get(8).asInt());
            candleSticks.add(candle);
        }
        
        return candleSticks.toArray(new CandleStick[0]);
    }

    /**
     * Lee la respuesta de HttpURLConnection
     */
    private String readResponse(HttpURLConnection connection) throws IOException {
        StringBuilder response = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(connection.getInputStream()))) {
            String line;
            while ((line = reader.readLine()) != null) {
                response.append(line);
            }
        }
        return response.toString();
    }

    @Override
    public double calculateEMA(double[] prices, int period) {
        // TODO: Implementar cálculo de EMA
        if (prices == null || prices.length < period) {
            return 0.0;
        }
        
        double multiplier = 2.0 / (period + 1);
        double ema = prices[0];
        
        for (int i = 1; i < prices.length; i++) {
            ema = (prices[i] * multiplier) + (ema * (1 - multiplier));
        }
        
        return ema;
    }

    @Override
    public double calculateRSI(double[] prices, int period) {
        // TODO: Implementar cálculo de RSI
        if (prices == null || prices.length <= period) {
            return 50.0; // Valor neutral por defecto
        }
        
        double[] gains = new double[prices.length - 1];
        double[] losses = new double[prices.length - 1];
        
        for (int i = 1; i < prices.length; i++) {
            double change = prices[i] - prices[i - 1];
            gains[i - 1] = Math.max(change, 0);
            losses[i - 1] = Math.max(-change, 0);
        }
        
        double avgGain = calculateAverage(gains, period);
        double avgLoss = calculateAverage(losses, period);
        
        if (avgLoss == 0) {
            return 100.0;
        }
        
        double rs = avgGain / avgLoss;
        return 100 - (100 / (1 + rs));
    }

    @Override
    public double calculateOBV(double[] prices, double[] volumes) {
        // TODO: Implementar cálculo de OBV
        if (prices == null || volumes == null || prices.length != volumes.length || prices.length == 0) {
            return 0.0;
        }
        
        double obv = 0;
        
        for (int i = 1; i < prices.length; i++) {
            if (prices[i] > prices[i - 1]) {
                obv += volumes[i];
            } else if (prices[i] < prices[i - 1]) {
                obv -= volumes[i];
            }
            // Si el precio es igual, el OBV no cambia
        }
        
        return obv;
    }

    /**
     * Calcula el promedio de un array para un período dado
     */
    private double calculateAverage(double[] values, int period) {
        double sum = 0;
        int count = Math.min(period, values.length);
        
        for (int i = 0; i < count; i++) {
            sum += values[i];
        }
        
        return sum / count;
    }
}