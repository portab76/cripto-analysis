package cripto.analysis.service.analysis;

import cripto.analysis.model.dto.CandleStick;
import cripto.analysis.service.marketdata.MarketDataProvider;

import org.springframework.stereotype.Service;

import java.util.Arrays;

@Service
public class TechnicalIndicatorServiceImpl implements MarketDataProvider {

    @Override
    public double calculateEMA(double[] prices, int period) {
        if (prices == null || prices.length == 0) {
            throw new IllegalArgumentException("Prices array cannot be null or empty");
        }
        
        if (period <= 0 || period > prices.length) {
            throw new IllegalArgumentException("Invalid period: " + period);
        }
        
        // Para los primeros valores, usar SMA (Simple Moving Average)
        if (prices.length <= period) {
            return Arrays.stream(prices).average().orElse(0.0);
        }
        
        // Calcular el multiplicador de suavizado
        double multiplier = 2.0 / (period + 1);
        
        // Iniciar con SMA para el primer punto de EMA
        double ema = Arrays.stream(prices, 0, period)
                          .average()
                          .orElse(0.0);
        
        // Calcular EMA para los precios restantes
        for (int i = period; i < prices.length; i++) {
            ema = (prices[i] - ema) * multiplier + ema;
        }
        
        return ema;
    }

    @Override
    public double calculateRSI(double[] prices, int period) {
        if (prices == null || prices.length < period + 1) {
            throw new IllegalArgumentException("Not enough data for RSI calculation");
        }
        
        double[] gains = new double[prices.length - 1];
        double[] losses = new double[prices.length - 1];
        
        // Calcular ganancias y pérdidas
        for (int i = 1; i < prices.length; i++) {
            double change = prices[i] - prices[i - 1];
            gains[i - 1] = Math.max(change, 0);
            losses[i - 1] = Math.max(-change, 0);
        }
        
        // Calcular promedio de ganancias y pérdidas
        double avgGain = Arrays.stream(gains, 0, period).average().orElse(0.0);
        double avgLoss = Arrays.stream(losses, 0, period).average().orElse(0.0);
        
        // Calcular RS y RSI
        for (int i = period; i < gains.length; i++) {
            avgGain = ((avgGain * (period - 1)) + gains[i]) / period;
            avgLoss = ((avgLoss * (period - 1)) + losses[i]) / period;
        }
        
        if (avgLoss == 0) return 100.0;
        
        double rs = avgGain / avgLoss;
        return 100.0 - (100.0 / (1.0 + rs));
    }

    @Override
    public double calculateOBV(double[] prices, double[] volumes) {
        if (prices == null || volumes == null || prices.length != volumes.length) {
            throw new IllegalArgumentException("Prices and volumes arrays must have same length");
        }
        
        if (prices.length == 0) return 0.0;
        
        double obv = 0.0;
        
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
    
    // Método específico para calcular todas las EMAs para un array de velas
    public CandleStick[] calculateAllEMAs(CandleStick[] candles) {
        if (candles == null || candles.length == 0) {
            return candles;
        }
        
        // Calcular EMAs para cada período
        calculateEMAForPeriod(candles, 10);
        calculateEMAForPeriod(candles, 25);
        calculateEMAForPeriod(candles, 50);
        calculateEMAForPeriod(candles, 100);
        calculateEMAForPeriod(candles, 200);
        
        return candles;
    }
    
    private void calculateEMAForPeriod(CandleStick[] candles, int period) {
        if (candles.length < period) {
            // No hay suficientes datos para calcular esta EMA
            return;
        }
        
        double[] closes = Arrays.stream(candles)
                               .mapToDouble(CandleStick::getClose)
                               .toArray();
        
        // Calcular EMA progresivamente para cada punto
        for (int i = period - 1; i < candles.length; i++) {
            double[] subArray = Arrays.copyOfRange(closes, 0, i + 1);
            double emaValue = calculateEMA(subArray, period);
            
            
            
            // Asignar el valor de EMA a la vela correspondiente
            switch (period) {
                case 10:
                    candles[i].setEma10(emaValue);
                    break;
                case 25:
                    candles[i].setEma25(emaValue);
                    break;
                case 50:
                    candles[i].setEma50(emaValue);
                    break;
                case 100:
                    candles[i].setEma100(emaValue);
                    break;
                case 200:
                    candles[i].setEma200(emaValue);
                    break;
            }
        }
    }
    
    // Método para obtener el último valor de una EMA específica
    public Double getLastEMA(CandleStick[] candles, int period) {
        if (candles == null || candles.length == 0) {
            return null;
        }
        
        CandleStick lastCandle = candles[candles.length - 1];
        
        switch (period) {
            case 10: return lastCandle.getEma10();
            case 25: return lastCandle.getEma25();
            case 50: return lastCandle.getEma50();
            case 100: return lastCandle.getEma100();
            case 200: return lastCandle.getEma200();
            default: throw new IllegalArgumentException("Unsupported EMA period: " + period);
        }
    }

	@Override
	public cripto.analysis.model.dto.CandleStick[] getCandlesticks(String symbol, String interval, int limit) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public double getVolume(String symbol) {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public double getGlobalLiquidity() {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public double getCurrentPrice(String symbol) {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public boolean isConnected() {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public String getProviderName() {
		// TODO Auto-generated method stub
		return null;
	}
}