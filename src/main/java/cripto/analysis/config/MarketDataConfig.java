package cripto.analysis.config;

import cripto.analysis.service.marketdata.MarketDataProvider;
import cripto.analysis.service.marketdata.impl.BinanceMarketDataProvider;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

@Configuration
public class MarketDataConfig {

    @Bean
    @Primary
    public MarketDataProvider binanceMarketDataProvider() {
        return new BinanceMarketDataProvider();
    }

}