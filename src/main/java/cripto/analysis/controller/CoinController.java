package cripto.analysis.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/coin")
public class CoinController {

    @GetMapping
    public String showCoin(Model model) {
        // Aquí se agregarán datos iniciales para el dashboard
        return "coin";
    }

}
