package cripto.analysis.service.marketdata;

import cripto.analysis.model.dto.CandleStick;

/**
 * Interfaz para abstraer la obtención de datos de mercado de diferentes proveedores
 * Permite cambiar entre APIs (Binance, CoinAPI, CoinGecko, etc.) con mínimos cambios
 */
public interface MarketDataProvider {
    
    /**
     * Obtiene velas (candlesticks) para un símbolo y intervalo específicos
     * @param symbol Par de trading (ej: "BTCUSDT", "ETHUSDT")
     * @param interval Intervalo de tiempo (ej: "1h", "4h", "1d")
     * @param limit Límite de velas a retornar
     * @return Array de vela
     */
    CandleStick[] getCandlesticks(String symbol, String interval, int limit);
    
    /**
     * Obtiene el volumen de trading para un símbolo específico
     * @param symbol Par de trading
     * @return Volumen de trading
     */
    double getVolume(String symbol);
    
    /**
     * Obtiene datos de liquidez global del mercado
     * @return Liquidez global
     */
    double getGlobalLiquidity();
    
    /**
     * Obtiene el precio actual de un símbolo
     * @param symbol Par de trading
     * @return Precio actual
     */
    double getCurrentPrice(String symbol);
    
    /**
     * Verifica si el proveedor está disponible y conectado
     * @return true si está conectado
     */
    boolean isConnected();
    
    /**
     * Obtiene el nombre del proveedor
     * @return Nombre del proveedor
     */
    String getProviderName();

	double calculateEMA(double[] prices, int period);

	double calculateRSI(double[] prices, int period);

	double calculateOBV(double[] prices, double[] volumes);
}