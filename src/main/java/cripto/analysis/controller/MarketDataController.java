package cripto.analysis.controller;

import cripto.analysis.model.dto.CandleStick;
import cripto.analysis.service.analysis.TechnicalIndicatorServiceImpl;
import cripto.analysis.service.marketdata.MarketDataProvider;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/market-data")
public class MarketDataController {

    private final MarketDataProvider marketDataProvider;
    private final TechnicalIndicatorServiceImpl technicalIndicatorService;
    
    public MarketDataController(MarketDataProvider marketDataProvider, TechnicalIndicatorServiceImpl technicalIndicatorService) {
        this.marketDataProvider = marketDataProvider;
        this.technicalIndicatorService = technicalIndicatorService;
    }
    
 
    @GetMapping("/candles")
    public CandleStick[] getCandles(@RequestParam String symbol, 
                                    @RequestParam(defaultValue = "1h") String interval,
                                    @RequestParam(defaultValue = "100") int limit) {
        
    	
    			CandleStick[] mdp = marketDataProvider.getCandlesticks(symbol, interval, limit);
    			
    			// Calcular EMAs antes de devolver los datos
    			CandleStick[] mdpEmas = technicalIndicatorService.calculateAllEMAs(mdp);
    			
    			//System.out.println(mdpEmas[0]);
    			return mdp ;
    } 
    
    
    @GetMapping("/price")
    public double getPrice(@RequestParam String symbol) {
        return marketDataProvider.getCurrentPrice(symbol);
    }
    
    @GetMapping("/volume")
    public double getVolume(@RequestParam String symbol) {
        return marketDataProvider.getVolume(symbol);
    }
    
    @GetMapping("/status")
    public String getStatus() {
        return marketDataProvider.isConnected() ? 
               "Connected to " + marketDataProvider.getProviderName() : 
               "Disconnected from " + marketDataProvider.getProviderName();
    }
    
    @GetMapping("/provider")
    public String getProviderName() {
        return marketDataProvider.getProviderName();
    }
}