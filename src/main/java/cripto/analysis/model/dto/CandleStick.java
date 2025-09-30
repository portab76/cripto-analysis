package cripto.analysis.model.dto;

import java.time.LocalDateTime;

/**
 * DTO que representa una vela (candlestick) de trading
 */
public class CandleStick {
    private LocalDateTime openTime;
    private double open;
    private double high;
    private double low;
    private double close;
    private double volume;
    private LocalDateTime closeTime;
    private int numberOfTrades;
    
    // Nuevos campos para EMAs
    private Double ema10;
    private Double ema25;
    private Double ema50;
    private Double ema100;
    private Double ema200;
    
    // Constructores
    public CandleStick() {}
    
    public CandleStick(LocalDateTime openTime, double open, double high, double low, 
                      double close, double volume, LocalDateTime closeTime, int numberOfTrades) {
        this.openTime = openTime;
        this.open = open;
        this.high = high;
        this.low = low;
        this.close = close;
        this.volume = volume;
        this.closeTime = closeTime;
        this.numberOfTrades = numberOfTrades;
    }
    
    // Getters y Setters
    public LocalDateTime getOpenTime() { return openTime; }
    public void setOpenTime(LocalDateTime openTime) { this.openTime = openTime; }
    
    public double getOpen() { return open; }
    public void setOpen(double open) { this.open = open; }
    
    public double getHigh() { return high; }
    public void setHigh(double high) { this.high = high; }
    
    public double getLow() { return low; }
    public void setLow(double low) { this.low = low; }
    
    public double getClose() { return close; }
    public void setClose(double close) { this.close = close; }
    
    public double getVolume() { return volume; }
    public void setVolume(double volume) { this.volume = volume; }
    
    public LocalDateTime getCloseTime() { return closeTime; }
    public void setCloseTime(LocalDateTime closeTime) { this.closeTime = closeTime; }
    
    public int getNumberOfTrades() { return numberOfTrades; }
    public void setNumberOfTrades(int numberOfTrades) { this.numberOfTrades = numberOfTrades; }
    
    // Getters y Setters para EMAs
    public Double getEma10() { return ema10; }
    public void setEma10(Double ema10) { this.ema10 = ema10; }
    
    public Double getEma25() { return ema25; }
    public void setEma25(Double ema25) { this.ema25 = ema25; }
    
    public Double getEma50() { return ema50; }
    public void setEma50(Double ema50) { this.ema50 = ema50; }
    
    public Double getEma100() { return ema100; }
    public void setEma100(Double ema100) { this.ema100 = ema100; }
    
    public Double getEma200() { return ema200; }
    public void setEma200(Double ema200) { this.ema200 = ema200; }

	@Override
	public String toString() {
		return "CandleStick [openTime=" + openTime + ", open=" + open + ", high=" + high + ", low=" + low + ", close="
				+ close + ", volume=" + volume + ", closeTime=" + closeTime + ", numberOfTrades=" + numberOfTrades
				+ ", ema10=" + ema10 + ", ema25=" + ema25 + ", ema50=" + ema50 + ", ema100=" + ema100 + ", ema200="
				+ ema200 + "]";
	}
    

}