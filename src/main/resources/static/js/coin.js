let timeframe = document.getElementById('primaryTimeframe').value;
let priceChart = null;
let autoRefreshInterval = null;
let previousPrice = null;

let firstPrice = null;
let firstTime = null;
let lastPrice = null;
let lastTime = null;

let dataTable = null;
let selectedRows = [];
let candlesData = [];
let candlesData2 = [];
let candlesData3 = [];
let candlesData4 = [];
let candlesData5 = [];
let candlesData6 = [];
let candlesData7 = [];
let candlesData8 = [];
let candlesData9 = [];

const ctx = document.getElementById('priceChart').getContext('2d');

function getSymbolName(symbol) { 
	const symbolNames = {
			'BTCEUR' : 'BTC/EUR',
			'BTCUSDT': 'BTC/USD',
			'ETHUSDT': 'ETH/USD', 
			'SOLUSDT': 'SOL/USD',
			'ADAUSDT': 'Cardano',
			'DOTUSDT': 'Polkadot'
		};
	return symbolNames[symbol] || symbol;
}

const timeframeConfig = {
 '1s': {
     refreshRate: 5000,     // cada 1 segundo
     limit: 1000,           // 17 minutos
     timeConfig: { 
         unit: 'second', 
         displayFormats: { second: 'HH:mm:ss' } 
     },
     label: 'Últimos 17 minutos'
 },
 '1m': {
     refreshRate: 60000,    // cada 30 segundos
     limit: 1440,           // 1 día
     timeConfig: { 
         unit: 'minute', 
         displayFormats: { minute: 'HH:mm' } 
     },
     label: 'Últimas 24 horas'
 },
 '3m': {
     refreshRate: 60000,    // cada 1 minuto
     limit: 480,            // 1 día
     timeConfig: { 
         unit: 'minute', 
         displayFormats: { minute: 'HH:mm' } 
     },
     label: 'Últimas 24 horas'
 },
 '5m': {
     refreshRate: 180000,   // cada 1.5 minutos
     limit: 288,            // 1 día
     timeConfig: { 
         unit: 'minute', 
         displayFormats: { minute: 'HH:mm' } 
     },
     label: 'Últimas 24 horas'
 },
 '15m': {
     refreshRate: 180000,   // cada 3 minutos
     limit: 96,             // 1 día
     timeConfig: { 
         unit: 'hour', 
         displayFormats: { hour: 'HH:mm' } 
     },
     label: 'Últimas 24 horas'
 },
 '30m': {
     refreshRate: 600000,   // cada 5 minutos
     limit: 48,             // 1 día
     timeConfig: { 
         unit: 'hour', 
         displayFormats: { hour: 'HH:mm' } 
     },
     label: 'Últimas 24 horas'
 },
 '1h': {
     refreshRate: 600000,   // cada 10 minutos
     limit: 168,            // 1 semana
     timeConfig: { 
         unit: 'hour', 
         displayFormats: { hour: 'HH:mm' } 
     },
     label: 'Última semana'
 },
 '2h': {
     refreshRate: 1200000,  // cada 20 minutos
     limit: 84,             // 1 semana
     timeConfig: { 
         unit: 'hour', 
         displayFormats: { hour: 'HH:mm' } 
     },
     label: 'Última semana'
 },
 '4h': {
     refreshRate: 1800000,  // cada 30 minutos
     limit: 180,            // 30 días
     timeConfig: { 
         unit: 'day', 
         displayFormats: { day: 'MMM dd' } 
     },
     label: 'Últimos 30 días'
 },
 '6h': {
     refreshRate: 3600000,  // cada 1 hora
     limit: 120,            // 30 días
     timeConfig: { 
         unit: 'day', 
         displayFormats: { day: 'MMM dd' } 
     },
     label: 'Últimos 30 días'
 },
 '8h': {
     refreshRate: 3600000,  // cada 1 hora
     limit: 90,             // 30 días
     timeConfig: { 
         unit: 'day', 
         displayFormats: { day: 'MMM dd' } 
     },
     label: 'Últimos 30 días'
 },
 '12h': {
     refreshRate: 7200000,  // cada 2 horas
     limit: 60,             // 30 días
     timeConfig: { 
         unit: 'day', 
         displayFormats: { day: 'MMM dd' } 
     },
     label: 'Últimos 30 días'
 },
 '1d': {
     refreshRate: 21600000, // cada 6 horas
     limit: 90,             // 3 meses
     timeConfig: { 
         unit: 'day', 
         displayFormats: { day: 'MMM dd' } 
     },
     label: 'Últimos 3 meses'
 },
 '3d': {
     refreshRate: 43200000, // cada 12 horas
     limit: 60,             // 6 meses
     timeConfig: { 
         unit: 'day', 
         displayFormats: { day: 'MMM dd' } 
     },
     label: 'Últimos 6 meses'
 },
 '1w': {
     refreshRate: 86400000, // cada 24 horas
     limit: 52,             // 1 año
     timeConfig: { 
         unit: 'week', 
         displayFormats: { week: 'MMM yy' } 
     },
     label: 'Último año'
 },
 '1M': {
     refreshRate: 604800000, // cada 7 días
     limit: 24,              // 2 años
     timeConfig: { 
         unit: 'month', 
         displayFormats: { month: 'MMM yyyy' } 
     },
     label: 'Últimos 2 años'
 }
};

function getTimeframeValue(timeframe, property) {
	 if (!timeframeConfig[timeframe]) {
	     console.warn(`Timeframe '${timeframe}' no encontrado`);
	     return null;
	 }
	 
	 if (!timeframeConfig[timeframe][property]) {
	     console.warn(`Propiedad '${property}' no encontrada para timeframe '${timeframe}'`);
	     return null;
	 }
	 
	 return timeframeConfig[timeframe][property];
}

function getRefreshRate(timeframe) {
 return getTimeframeValue(timeframe, 'refreshRate');
}

function getLimit(timeframe) {
 return getTimeframeValue(timeframe, 'limit');
}

function getTimeConfig(timeframe) {
 return getTimeframeValue(timeframe, 'timeConfig');
}

function getLabel(timeframe) {
 return getTimeframeValue(timeframe, 'label');
}

function getTimeframeConfig(timeframe) {
 return timeframeConfig[timeframe] || null;
}

function isValidTimeframe(timeframe) {
 return timeframeConfig.hasOwnProperty(timeframe);
}

function getAvailableTimeframes() {
 return Object.keys(timeframeConfig);
}

function isMobileDevice() {
    return window.innerWidth <= 768; // Umbral comn para mviles
}

function updatePriceDisplay(currentPrice) {
	

	priceElement = document.getElementById('current-price');
	const changeElement = document.getElementById('price-change');
	const symbol = document.getElementById('cryptoSelect').value;
	
	const formattedPrice = currentPrice.toLocaleString('en-US', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	});
	
	priceElement.textContent = getSymbolName(symbol) +` ${formattedPrice}`;
	
	// Actualizar título de la página
	const symbolName = getSymbolName(symbol);
	document.title = `${formattedPrice} - ${symbolName}`;		    
	
	// Calcular cambio porcentual si hay precio anterior
	if (previousPrice && previousPrice > 0) {
		const change = ((currentPrice - previousPrice) / previousPrice) * 100;
		const changeFormatted = Math.abs(change).toFixed(2);
		
		if (change > 0) {
			priceElement.className = 'price-display price-positive';
			changeElement.textContent = `+${changeFormatted}%`;
			changeElement.className = 'text-success';
		} else if (change < 0) {
			priceElement.className = 'price-display price-negative';
			changeElement.textContent = `-${changeFormatted}%`;
			changeElement.className = 'text-danger';
		} else {
			priceElement.className = 'price-display';
			changeElement.textContent = `0.00%`;
			changeElement.className = 'text-muted';
		}
	}
	
	previousPrice = currentPrice;
		
}

function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

function getCandlesData(timeframe) {
	  const map = {
	    "1s": candlesData2,
	    "1m": candlesData3,
	    "1h": candlesData4,
	    "4h": candlesData5,
	    "1d": candlesData6,
	    "3d": candlesData7,
	    "1w": candlesData8,
	    "1M": candlesData9
	  };

	  return map[timeframe] || null; // Devuelve null si el timeframe no existe
	}

// FUNCIONES PAR OBTENER COTIZACIONES

async function loadInitialData() {
	await updateChartData();
}
//
//
//
//Control de último refresco por timeframe
const lastUpdate = {};

// Actualiza un timeframe concreto
async function updateTimeframe(symbol, timeframe) {
  const config = timeframeConfig[timeframe];
  if (!config) return;

  const now = Date.now();
  const last = lastUpdate[timeframe] || 0;

  // Si no ha pasado el refreshRate, no actualizamos
  if (now - last < config.refreshRate) return;

  try {
    lastUpdate[timeframe] = now;
    updateConnectionStatus('warning', `Actualizando ${timeframe}...`);

    const data = await fetchRawCandleData(symbol, timeframe, config.limit);

    // Guardamos en la variable correspondiente (candlesData2, candlesData3, etc.)
    assignCandlesData(timeframe, data);

    // Actualizamos label en la interfaz
    const labelId = getLabelId(timeframe);
    if (labelId) {
      document.getElementById(labelId).innerHTML = getLabel(timeframe) + ":";
    }
  } catch (err) {
    console.error(`Error al actualizar ${timeframe}:`, err);
  }
}

// Mapea timeframe → variable global (puedes mejorarlo con un objeto)
function assignCandlesData(timeframe, data) {
  switch (timeframe) {
    case "1s": candlesData2 = data; break;
    case "1m": candlesData3 = data; break;
    case "1h": candlesData4 = data; break;
    case "4h": candlesData5 = data; break;
    case "1d": candlesData6 = data; break;
    case "3d": candlesData7 = data; break;
    case "1w": candlesData8 = data; break;
    case "1M": candlesData9 = data; break;
  }
}

// Mapea timeframe → id del label en HTML
function getLabelId(timeframe) {
  switch (timeframe) {
    case "1s": return "time-change-2";
    case "1m": return "time-change-3";
    case "1h": return "time-change-4";
    case "4h": return "time-change-5";
    case "1d": return "time-change-6";
    case "3d": return "time-change-7";
    case "1w": return "time-change-8";
    case "1M": return "time-change-9";
    default: return null;
  }
}



//Función principal: solo actualiza lo que toque según refreshRate
async function updateChartData() {
  const formData = new FormData(document.getElementById('analysisForm'));
  const symbol = formData.get('symbol') || 'BTCUSDT';

  const timeframes = ["1s", "1m", "1h", "4h", "1d", "3d", "1w", "1M"];

  for (const tf of timeframes) {
    await updateTimeframe(symbol, tf);
  }

    try {
 		
	
		candlesData = getCandlesData(timeframe);
		//console.log(candlesData);

        const chartDataClose = toChartDataClose(candlesData);		
		const chartDataEma10 = toChartDataEma10(candlesData);
		const chartDataEma25 = toChartDataEma25(candlesData);
		const chartDataEma50 = toChartDataEma50(candlesData);
		const chartDataEma100 = toChartDataEma100(candlesData);
		const chartDataEma200 = toChartDataEma200(candlesData);		
        const currentPrice = await fetchCurrentPrice(symbol);
		const timeConfig = getTimeframeConfig(timeframe);    
		priceChart.data.datasets[0].data = chartDataClose;
		priceChart.data.datasets[1].data = chartDataEma10;
		priceChart.data.datasets[2].data = chartDataEma25;
		priceChart.data.datasets[3].data = chartDataEma50;
		priceChart.data.datasets[4].data = chartDataEma100;
		priceChart.data.datasets[5].data = chartDataEma200;
		if(!isMobileDevice()){
			priceChart.options.scales.x.time = timeConfig;
		}		
		// Se actualiza la tabla
		priceChart.update('none');	
        updateDataTable(candlesData);  
        updatePriceDisplay(currentPrice);        
        updateConnectionStatus('success', 'Conectado');
        const now = new Date();
        document.getElementById('timestamp').textContent = now.toLocaleTimeString();
		
        priceChart.options.scales.x.display = true; //!isMobileDevice(); // si es movil oculta leyenda eje tiempo grafica
		priceChart.options.scales.x.title.text = getLabel(timeframe);
		priceChart.options.scales.x.title.display = true;
		
		
					
		// muestra la diferencia entre el primer y ultimo dato de la coleccion
		document.getElementById('time-change-2').innerHTML = getLabel('1s') +":";
		var lastIndex = candlesData2.length - 1;
		var firstPrice = candlesData2[0].close;
		var firstTime = candlesData2[0].closeTime;
		var lastPrice = candlesData2[lastIndex].close;
		var lastTime = candlesData2[lastIndex].closeTime;
		var priceElement = document.getElementById('current-price-2');
		const changeElement2 = document.getElementById('price-change-2');
		const change2 = ( ((firstPrice - lastPrice) / lastPrice) * 100 ) * -1;
		const changeFormatted2 = Math.abs(change2).toFixed(2);
		var diff = (firstPrice - lastPrice)*-1;
		var diffForm = Math.abs(diff).toFixed(2);
		var FForm = Math.abs(firstPrice).toFixed(2);
		var LForm = Math.abs(lastPrice).toFixed(2);
		document.getElementById('time-change-2a').textContent = formatDateTime(firstTime) + '  ' + FForm;
		document.getElementById('time-change-2b').textContent = formatDateTime(lastTime)  + '  ' + LForm;	
		priceElement.textContent = diffForm;
		if (change2 > 0) {
			priceElement.className = 'price-positive';
			changeElement2.textContent = `+${changeFormatted2}%`;
			changeElement2.className = 'text-success';
		} else if (change2 < 0) {
			priceElement.className = 'price-negative';
			changeElement2.textContent = `-${changeFormatted2}%`;
			changeElement2.className = 'text-danger';
		} else {
			priceElement.className = '';
			changeElement2.textContent = `0.00%`;
			changeElement2.className = 'text-muted';
		}

		// muestra la diferencia entre el primer y ultimo dato de la coleccion
		document.getElementById('time-change-3').innerHTML = getLabel('1m') +":";
		lastIndex = candlesData3.length - 1;
		firstPrice = candlesData3[0].close;
		firstTime = candlesData3[0].closeTime;
		lastPrice = candlesData3[lastIndex].close;
		lastTime = candlesData3[lastIndex].closeTime;
		priceElement = document.getElementById('current-price-3');
		const changeElement3 = document.getElementById('price-change-3');
		const change3 = ( ((firstPrice - lastPrice) / lastPrice) * 100 ) * -1;
		const changeFormatted3 = Math.abs(change3).toFixed(2);
		var diff = (firstPrice - lastPrice)*-1;
		diffForm = Math.abs(diff).toFixed(2);
		FForm = Math.abs(firstPrice).toFixed(2);
		LForm = Math.abs(lastPrice).toFixed(2);
		document.getElementById('time-change-3a').textContent = formatDateTime(firstTime) + '  ' + FForm;
		document.getElementById('time-change-3b').textContent = formatDateTime(lastTime)  + '  ' + LForm;	
		priceElement.textContent = diffForm;
		if (change3 > 0) {
			priceElement.className = 'price-positive';
			changeElement3.textContent = `+${changeFormatted3}%`;
			changeElement3.className = 'text-success';
		} else if (change3 < 0) {
			priceElement.className = 'price-negative';
			changeElement3.textContent = `-${changeFormatted3}%`;
			changeElement3.className = 'text-danger';
		} else {
			priceElement.className = '';
			changeElement3.textContent = `0.00%`;
			changeElement3.className = 'text-muted';
		}
		
		// muestra la diferencia entre el primer y ultimo dato de la coleccion
		lastIndex = candlesData4.length - 1;
		firstPrice = candlesData4[0].close;
		firstTime = candlesData4[0].closeTime;
		lastPrice = candlesData4[lastIndex].close;
		lastTime = candlesData4[lastIndex].closeTime;
		priceElement = document.getElementById('current-price-4');
		const changeElement4 = document.getElementById('price-change-4');
		const change4 = ( ((firstPrice - lastPrice) / lastPrice) * 100 ) * -1;
		const changeFormatted4 = Math.abs(change4).toFixed(2);
		var diff = (firstPrice - lastPrice)*-1;
		diffForm = Math.abs(diff).toFixed(2);
		FForm = Math.abs(firstPrice).toFixed(2);
		LForm = Math.abs(lastPrice).toFixed(2);
		document.getElementById('time-change-4a').textContent = formatDateTime(firstTime) + '  ' + FForm;
		document.getElementById('time-change-4b').textContent = formatDateTime(lastTime)  + '  ' + LForm;	
		priceElement.textContent = diffForm;
		if (change4 > 0) {
			priceElement.className = 'price-positive';
			changeElement4.textContent = `+${changeFormatted4}%`;
			changeElement4.className = 'text-success';
		} else if (change4 < 0) {
			priceElement.className = 'price-negative';
			changeElement4.textContent = `-${changeFormatted4}%`;
			changeElement4.className = 'text-danger';
		} else {
			priceElement.className = '';
			changeElement4.textContent = `0.00%`;
			changeElement4.className = 'text-muted';
		}

		// muestra la diferencia entre el primer y ultimo dato de la coleccion
		lastIndex5 = candlesData5.length - 1;
		firstPrice = candlesData5[0].close;
		firstTime = candlesData5[0].closeTime;
		lastPrice = candlesData5[lastIndex].close;
		lastTime = candlesData5[lastIndex].closeTime;
		priceElement = document.getElementById('current-price-5');
		const changeElement5 = document.getElementById('price-change-5');
		const change5 = ( ((firstPrice - lastPrice) / lastPrice) * 100 ) * -1;
		const changeFormatted5 = Math.abs(change5).toFixed(2);
		var diff = (firstPrice - lastPrice)*-1;
		diffForm = Math.abs(diff).toFixed(2);
		FForm = Math.abs(firstPrice).toFixed(2);
		LForm = Math.abs(lastPrice).toFixed(2);
		document.getElementById('time-change-5a').textContent = formatDateTime(firstTime) + '  ' + FForm;
		document.getElementById('time-change-5b').textContent = formatDateTime(lastTime)  + '  ' + LForm;	
		priceElement.textContent = diffForm;
		if (change5 > 0) {
			priceElement.className = 'price-positive';
			changeElement5.textContent = `+${changeFormatted5}%`;
			changeElement5.className = 'text-success';
		} else if (change5 < 0) {
			priceElement.className = 'price-negative';
			changeElement5.textContent = `-${changeFormatted5}%`;
			changeElement5.className = 'text-danger';
		} else {
			priceElement.className = '';
			changeElement5.textContent = `0.00%`;
			changeElement5.className = 'text-muted';
		}

		// muestra la diferencia entre el primer y ultimo dato de la coleccion
		lastIndex = candlesData6.length - 1;
		firstPrice = candlesData6[0].close;
		firstTime = candlesData6[0].closeTime;
		lastPrice = candlesData6[lastIndex].close;
		lastTime = candlesData6[lastIndex].closeTime;
		priceElement = document.getElementById('current-price-6');
		const changeElement6 = document.getElementById('price-change-6');
		const change6 = ( ((firstPrice - lastPrice) / lastPrice) * 100 ) * -1;
		const changeFormatted6 = Math.abs(change6).toFixed(2);
		var diff = (firstPrice - lastPrice)*-1;
		diffForm = Math.abs(diff).toFixed(2);
		FForm = Math.abs(firstPrice).toFixed(2);
		LForm = Math.abs(lastPrice).toFixed(2);
		document.getElementById('time-change-6a').textContent = formatDateTime(firstTime) + '  ' + FForm;
		document.getElementById('time-change-6b').textContent = formatDateTime(lastTime)  + '  ' + LForm;	
		priceElement.textContent = diffForm;
		if (change6 > 0) {
			priceElement.className = 'price-positive';
			changeElement6.textContent = `+${changeFormatted6}%`;
			changeElement6.className = 'text-success';
		} else if (change6 < 0) {
			priceElement.className = 'price-negative';
			changeElement6.textContent = `-${changeFormatted6}%`;
			changeElement6.className = 'text-danger';
		} else {
			priceElement.className = '';
			changeElement6.textContent = `0.00%`;
			changeElement6.className = 'text-muted';
		}		

		// muestra la diferencia entre el primer y ultimo dato de la coleccion
		lastIndex = candlesData7.length - 1;
		firstPrice = candlesData7[0].close;
		firstTime = candlesData7[0].closeTime;
		lastPrice = candlesData7[lastIndex].close;
		lastTime = candlesData7[lastIndex].closeTime;
		priceElement = document.getElementById('current-price-7');
		const changeElement7 = document.getElementById('price-change-7');
		const change7 = ( ((firstPrice - lastPrice) / lastPrice) * 100 ) * -1;
		const changeFormatted7 = Math.abs(change7).toFixed(2);
		var diff = (firstPrice - lastPrice)*-1;
		diffForm = Math.abs(diff).toFixed(2);
		FForm = Math.abs(firstPrice).toFixed(2);
		LForm = Math.abs(lastPrice).toFixed(2);
		document.getElementById('time-change-7a').textContent = formatDateTime(firstTime) + '  ' + FForm;
		document.getElementById('time-change-7b').textContent = formatDateTime(lastTime)  + '  ' + LForm;	
		priceElement.textContent = diffForm;
		if (change7 > 0) {
			priceElement.className = 'price-positive';
			changeElement7.textContent = `+${changeFormatted7}%`;
			changeElement7.className = 'text-success';
		} else if (change7 < 0) {
			priceElement.className = 'price-negative';
			changeElement7.textContent = `-${changeFormatted7}%`;
			changeElement7.className = 'text-danger';
		} else {
			priceElement.className = '';
			changeElement7.textContent = `0.00%`;
			changeElement7.className = 'text-muted';
		}	
		
		// muestra la diferencia entre el primer y ultimo dato de la coleccion
		lastIndex = candlesData8.length - 1;
		firstPrice = candlesData8[0].close;
		firstTime = candlesData8[0].closeTime;
		lastPrice = candlesData8[lastIndex].close;
		lastTime = candlesData8[lastIndex].closeTime;
		priceElement = document.getElementById('current-price-8');
		const changeElement8 = document.getElementById('price-change-8');
		const change8 = ( ((firstPrice - lastPrice) / lastPrice) * 100 ) * -1;
		const changeFormatted8 = Math.abs(change8).toFixed(2);
		var diff = (firstPrice - lastPrice)*-1;
		diffForm = Math.abs(diff).toFixed(2);
		FForm = Math.abs(firstPrice).toFixed(2);
		LForm = Math.abs(lastPrice).toFixed(2);
		document.getElementById('time-change-8a').textContent = formatDateTime(firstTime) + '  ' + FForm;
		document.getElementById('time-change-8b').textContent = formatDateTime(lastTime)  + '  ' + LForm;	
		priceElement.textContent = diffForm;
		if (change8 > 0) {
			priceElement.className = 'price-positive';
			changeElement8.textContent = `+${changeFormatted8}%`;
			changeElement8.className = 'text-success';
		} else if (change8 < 0) {
			priceElement.className = 'price-negative';
			changeElement8.textContent = `-${changeFormatted8}%`;
			changeElement8.className = 'text-danger';
		} else {
			priceElement.className = '';
			changeElement8.textContent = `0.00%`;
			changeElement8.className = 'text-muted';
		}
		
		// muestra la diferencia entre el primer y ultimo dato de la coleccion
		lastIndex = candlesData9.length - 1;
		firstPrice = candlesData9[0].close;
		firstTime = candlesData9[0].closeTime;
		lastPrice = candlesData9[lastIndex].close;
		lastTime = candlesData9[lastIndex].closeTime;
		priceElement = document.getElementById('current-price-9');
		const changeElement9 = document.getElementById('price-change-9');
		const change9 = ( ((firstPrice - lastPrice) / lastPrice) * 100 ) * -1;
		const changeFormatted9 = Math.abs(change9).toFixed(2);
		var diff = (firstPrice - lastPrice)*-1;
		diffForm = Math.abs(diff).toFixed(2);
		FForm = Math.abs(firstPrice).toFixed(2);
		LForm = Math.abs(lastPrice).toFixed(2);
		document.getElementById('time-change-9a').textContent = formatDateTime(firstTime) + '  ' + FForm;
		document.getElementById('time-change-9b').textContent = formatDateTime(lastTime)  + '  ' + LForm;	
		priceElement.textContent = diffForm;
		if (change9 > 0) {
			priceElement.className = 'price-positive';
			changeElement9.textContent = `+${changeFormatted9}%`;
			changeElement9.className = 'text-success';
		} else if (change9 < 0) {
			priceElement.className = 'price-negative';
			changeElement9.textContent = `-${changeFormatted9}%`;
			changeElement9.className = 'text-danger';
		} else {
			priceElement.className = '';
			changeElement9.textContent = `0.00%`;
			changeElement9.className = 'text-muted';
		}	

    } catch (error) {
        console.error('Error actualizando datos:', error);
        updateConnectionStatus('danger', 'Error');
        updateLastUpdate();
    }
}

async function fetchRawCandleData(symbol, timeframe, limit) {
    try {
        const params = new URLSearchParams({
            symbol: symbol,
            interval: timeframe,
            limit: limit
        });
        //console.log('[fetchRawCandleData] :', `/../cripto/api/market-data/candles?${params}`);  
        const response = await fetch(`/../cripto/api/market-data/candles?${params}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }       
        const text = await response.text();       
        if (!text) {
            throw new Error('Empty response from server');
        }        
        const candles = JSON.parse(text);
        if (!Array.isArray(candles)) {
            throw new Error('Invalid response format: expected array');
        }
        window.lastSuccessUpdate = new Date();
        return candles; // Devolver los datos originales
    } catch (error) {
        console.error('Error in fetchRawCandleData:', error);
        throw error;
    }
}

async function fetchCurrentPrice(symbol) {	
	//console.log('[fetchCurrentPrice] :', `/../cripto/api/market-data/price?symbol=${symbol}`);	
	const response = await fetch(`/../cripto/api/market-data/price?symbol=${symbol}`);	
	if (!response.ok) {
		throw new Error('Error fetching current price');
	}
	return await response.json();
}

// DOMContentLoaded EVENTS

document.addEventListener('DOMContentLoaded', function() {
	
	initializeChart();
	initializeDataTable();
	setupEventListeners();
	loadInitialData();
	priceChart.options.scales.x.title.text = getLabel(timeframe);
	
	
	const timeframeButtons = document.querySelectorAll('.btn-timeframe');
    const hiddenInput = document.getElementById('primaryTimeframe');
    
    timeframeButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remover clase active de todos los botones
            timeframeButtons.forEach(btn => btn.classList.remove('active'));
            
            // Agregar clase active al botón clickeado
            this.classList.add('active');
            
            // Actualizar el valor del campo oculto
            const selectedValue = this.getAttribute('data-value');
            hiddenInput.value = selectedValue;
            // Disparar evento personalizado para que otros componentes reaccionen
            const event = new CustomEvent('timeframeChanged', {
                detail: { timeframe: selectedValue }
            });
            document.dispatchEvent(event);
            
            console.log('Timeframe seleccionado:', selectedValue);
            
            
        	timeframe = selectedValue;
        	
        	document.getElementById('primaryTimeframe').value = timeframe;
        	
        	priceChart.options.scales.x.title.text = getLabel(selectedValue);
        	priceChart.update(); 
        	updateChartData();    
        	const autoRefreshCheckbox = document.getElementById('autoRefresh');
        	if (autoRefreshCheckbox.checked) {
        		stopAutoRefresh();
        		startAutoRefresh();
        	}
        });
    });
    
    // Opcional: Simular click en el botón correspondiente al cargar la página
    const initialValue = hiddenInput.value;
    const initialButton = document.querySelector(`.btn-timeframe[data-value="${initialValue}"]`);
    if (initialButton) {
        initialButton.classList.add('active');
    }
	
	
	
	
});


//Actualizar el gráfico cuando cambie el tamaño de la ventana
window.addEventListener('resize', function() {
  if (priceChart) {
      priceChart.options.scales.y.ticks.display = !isMobileDevice();
      priceChart.update();
  }
});

//Inicializar la gráfica cuando se carga la página
window.addEventListener('load', function() {

	  // Configurar botones de control
	  document.getElementById('resetZoom').addEventListener('click', function() {
	      priceChart.resetZoom();
	  });
	  
	  document.getElementById('zoomIn').addEventListener('click', function() {
	      priceChart.zoom(1.1);
	  });
	  
	  document.getElementById('zoomOut').addEventListener('click', function() {
	      priceChart.zoom(0.9);
	  });
	  
});	   

// Manejar cierre de página
window.addEventListener('beforeunload', function() {
	stopAutoRefresh();
});

document.getElementById('cryptoSelect').addEventListener('change', () => {
	//priceChart.options.scales.y.title.text = getCointText();        	
	updateChartData();   
});

// Registrar el plugin de zoom de Chart.js
if (window.ChartZoom) {
    Chart.register(window.ChartZoom);
}

function initializeChart() {  
	const select = document.getElementById("cryptoSelect");
	const selectedOption = select.options[select.selectedIndex];
	priceChart = new Chart(ctx, {
		type: 'line',
		data: {
	       datasets: [{
	           display: false,
	           label: 'USTD',
	       data: [],
	       borderColor: '#007bff',
	       backgroundColor: 'rgba(0, 123, 255, 0.1)',
	       tension: 0.1,
	       fill: true,
	       pointRadius: 0,
	       pointBackgroundColor: '#007bff',
	       pointHoverRadius: 6,
	       pointHoverBackgroundColor: '#007bff'
	    },{
	       display: false,
	       label: 'EMA10',
	       data: [],
	       borderColor: 'red',
	       borderWidth: 1,
	       backgroundColor: 'rgba(255, 0, 0, 0.1)',
	       tension: 0.1,
	       fill: false,
	       pointRadius: 0,
	       pointBackgroundColor: 'red',
	       pointHoverRadius: 6,
	       pointHoverBackgroundColor: 'red'
	   },{
	       display: false,
	       label: 'EMA25',
	       data: [],
	       borderColor: 'orange',
	       borderWidth: 1,
	       backgroundColor: 'rgba(255, 165, 0, 0.1)',
	       tension: 0.1,
	       fill: false,
	       pointRadius: 0,
	       pointBackgroundColor: 'orange',
	       pointHoverRadius: 6,
	       pointHoverBackgroundColor: 'orange'
	   },{
	       display: false,
	       label: 'EMA50',
	       data: [],
	       borderColor: 'yellow',
	       borderWidth: 1,
	       backgroundColor: 'rgba(255, 255, 0, 0.1)',
	       tension: 0.1,
	       fill: false,
	       pointRadius: 0,
	       pointBackgroundColor: 'yellow',
	       pointHoverRadius: 6,
	       pointHoverBackgroundColor: 'yellow'
	   },{
	       display: false,
	       label: 'EMA100',
	       data: [],
	       borderColor: 'green',
	       borderWidth: 1,
	       backgroundColor: 'rgba(0, 128, 0, 0.1)',
	       tension: 0.1,
	       fill: false,
	       pointRadius: 0,
	       pointBackgroundColor: 'green',
	       pointHoverRadius: 6,
	       pointHoverBackgroundColor: 'green'
	   },{
	       display: false,
	       label: 'EMA200',
	       data: [],
	       borderColor: 'blue',
	       borderWidth: 1,
	       backgroundColor: 'rgba(0, 0, 255, 0.1)',
	       tension: 0.1,
	       fill: false,
	       pointRadius: 0,
	       pointBackgroundColor: 'blue',
	       pointHoverRadius: 6,
	       pointHoverBackgroundColor: 'blue'
	       }]
	   },
	   options: {
	       responsive: true,
	       maintainAspectRatio: false,
	       interaction: {
	           mode: 'index',
	       intersect: false
	   },
	   scales: {
	       x: {
	           type: 'time',
	           title: {
	               display: !isMobileDevice(),
	               text: selectedOption.text,
	               font: {
	                   weight: 'bold',
	                   size: 14
	               }
	           },
	           time: {
	               unit: 'hour',
	               displayFormats: {
	                   hour: 'MMM dd HH:mm'
	               }
	           },
	           title: {
	               display: true,
	               text: 'Tiempo',
	               font: {
	                   weight: 'bold',
	                   size: 14
	               }
	           }
	       },
	       y: {
	           title: {
	               display: !isMobileDevice(),
	               text: selectedOption.text,
	               font: {
	                   weight: 'bold',
	                   size: 14
	               }
	           },
	           ticks: {
	        	   display:  !isMobileDevice(),
	               callback: function(value) {
	                   return value.toLocaleString();
	               }
	           }
	       }
	   },
	   plugins: {
	       zoom: {
	           pan: {
	               enabled: true,
	               mode: 'x',
	               modifierKey: 'ctrl',
	           },
	           zoom: {
	               wheel: {
	                   enabled: true,
	                   speed: 0.1,
	                   modifierKey: 'ctrl'
	               },
	               pinch: {
	                   enabled: true
	               },
	               drag: {
	                   enabled: true,
	                   backgroundColor: 'rgba(225,225,225,0.3)',
	                   borderColor: 'rgba(225,225,225,0.6)',
	                   borderWidth: 1,
	                   threshold: 2
	               },
	               mode: 'x',
	           },
	           limits: {
	               x: { min: 'original', max: 'original' },
	               y: { min: 'original', max: 'original' }
	           }
	       },
	       tooltip: {
	           callbacks: {
	               label: function(context) {
	                   return `${context.dataset.label}: ${context.parsed.y.toLocaleString()}`;
	               }
	           }
	       },
	       legend: {
	           display: true,
	           position: 'top',
	           labels: {
	               usePointStyle: true,
	               pointStyle: 'line'
	           }
	       }
	   },
	   onClick: function(event, elements) {
	       if (elements.length > 0) {
	           const element = elements[0];
	           const datasetIndex = element.datasetIndex;
	           const index = element.index;
	           
	           // Obtener todos los valores en ese punto específico
	           const xValue = priceChart.data.labels ? priceChart.data.labels[index] : null;
	           const datasets = priceChart.data.datasets;
	           
	           console.log('=== DATOS DEL PUNTO SELECCIONADO ===');
	           
	           // Mostrar fecha/hora (valor X)
	           if (xValue) {
	               console.log('Fecha/Hora:', new Date(xValue).toLocaleString());
	           } else {
	               // Si no hay labels, intentar obtener del primer
					// dataset
	               const firstDataset = datasets[0];
	               if (firstDataset && firstDataset.data[index]) {
	                   const point = firstDataset.data[index];
	                   if (point && point.x) {
	                       console.log('Fecha/Hora:', new Date(point.x).toLocaleString());
	                   }
	               }
	           }
	           
	           console.log('--- Valores de las líneas ---');
	           
	           // Recorrer todos los datasets para obtener sus
	           // valores en este índice
	           datasets.forEach((dataset, i) => {
	               const dataPoint = dataset.data[index];
	               if (dataPoint) {
	                   let value;
	                   
	                   // Manejar diferentes formatos de datos en
						// Chart.js
	                   if (typeof dataPoint === 'object' && dataPoint !== null) {
	                       value = dataPoint.y !== undefined ? dataPoint.y : dataPoint;
	                   } else {
	                       value = dataPoint;
	                   }
	                   
	                   if (value !== undefined && value !== null) {
	                       const formattedValue = typeof value === 'number' ? 
	                           value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 }) : 
	                           value;
	                       
	                       console.log(`${dataset.label}: ${formattedValue}`);
	                   }
	               }
	           });
	           
	           console.log('Índice del dataset clickeado:', datasetIndex);
	           console.log('Índice del punto:', index);
	           console.log('================================');
	           
	       } else {
	           console.log('Click fuera de los puntos de datos');
	               }
	           }
	       }
	   });    
}
	 
function initializeDataTable() {
    dataTable = $('#dataTable').DataTable({
        pageLength: 10,
        lengthMenu: [5, 10, 25, 50, 100],
        order: [[1, 'desc']], // Ordenar por fecha de cierre descendente por defecto
        dom: '<"top"Blf>rt<"bottom"ip><"clear">', // B = Buttons, l = length, f = filter, etc.
        buttons: [
            {
                extend: 'csvHtml5',
                text: '<i class="fas fa-file-export"></i> Exportar CSV',
                className: 'btn btn-zoom'
            }
        ],
		columnDefs: [
			{ 
				targets: [0, 1], 
				render: function(data, type, row) {
					if (type === 'display' || type === 'filter') {
						return new Date(data).toLocaleString();
					}
					return data;
				}
			},
			{ 
				targets: [2, 3, 4, 5], 
				render: function(data, type, row) {
					if (type === 'display' || type === 'filter') {
						return parseFloat(data).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
					}
					return data;
				}
			},
			{ 
				targets: 6, 
				render: function(data, type, row) {
					if (type === 'display' || type === 'filter') {
						return parseFloat(data).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
					}
					return data;
				}
			}
		],
		language: {
			url: '/../cripto/js/es-ES.json'
		}
	});
    dataTable.buttons().container().appendTo('#tableButtons');
    /*$('#dataTable tbody').on('click', 'tr', function() {        
		handleRowClick(this);
	});*/
}

function setupEventListeners() {
	document.getElementById('autoRefresh').addEventListener('change', function(e) {
		if (e.target.checked) {
			startAutoRefresh();
		} else {
			stopAutoRefresh();
		}
	});
}

function toChartDataClose(candles) {
    return candles.map(candle => ({
        x: new Date(candle.openTime),
        y: candle.close
    }));
}

function toChartDataEma10(candles) {
    return candles.map(candle => ({
        x: new Date(candle.openTime),
        y: candle.ema10
    }));
}

function toChartDataEma25(candles) {
    return candles.map(candle => ({
        x: new Date(candle.openTime),
        y: candle.ema25
    }));
}

function toChartDataEma50(candles) {
    return candles.map(candle => ({
        x: new Date(candle.openTime),
        y: candle.ema50
    }));
}

function toChartDataEma100(candles) {
    return candles.map(candle => ({
        x: new Date(candle.openTime),
        y: candle.ema100
    }));
}

function toChartDataEma200(candles) {
    return candles.map(candle => ({
        x: new Date(candle.openTime),
        y: candle.ema200
    }));
}

function updateDataTable(candles) {   
	//console.log('[updateDataTable] Actualizando tabla con:', candles.length, 'registros');   
    dataTable.clear();    
    candles.forEach(candle => {
        dataTable.row.add([
            candle.openTime,
            candle.closeTime,
            candle.open,
            candle.high,
            candle.low,
            candle.close,
            candle.volume,
			formatDifference(candle.ema10),
			formatDifference(candle.ema25),
			formatDifference(candle.ema50),
			formatDifference(candle.ema100),
			formatDifference(candle.ema200)
        ]);
    });
    dataTable.draw();   
}

function updateConnectionStatus(status, message) {
	const statusElement = document.getElementById('connection-status');
	const icon = status === 'success' ? 'fa-circle' : 
				status === 'warning' ? 'fa-sync-alt refresh-indicator' : 'fa-exclamation-circle';
	
	statusElement.className = `badge bg-${status}`;
	statusElement.innerHTML = `<i class="fas ${icon} me-1"></i>${message}`;
}

function updateLastUpdate() {
	const now = new Date();
	const timestampElement = document.getElementById('last-update');
	 
	// Verificar si han pasado más de 10 segundos desde la última actualización exitosa
	const lastSuccessUpdate = window.lastSuccessUpdate || 0;
	const sinceSuccess = (now - lastSuccessUpdate);		    
	const interval = getRefreshRate(timeframe) || 10000;
	
	if (sinceSuccess > interval) {
		timestampElement.className = 'badge bg-danger ms-2';
	} else {
		timestampElement.className = 'badge bg-info ms-2';
	}
}

function startAutoRefresh() {
	stopAutoRefresh();
	const interval = getRefreshRate(timeframe) || 5000;
	autoRefreshInterval = setInterval(updateChartData, interval);
}        

function stopAutoRefresh() {
	if (autoRefreshInterval) {
		clearInterval(autoRefreshInterval);
		autoRefreshInterval = null;
	}
}

function formatDifference(value, isCurrency = true) {
	if (value === 'N/A') return 'N/A';
	const absValue = Math.abs(value);
	const sign = value >= 0 ? '' : ''; // + : -
	if (isCurrency) {
		return `${sign}${absValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
	} else {
		return `${sign}${absValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
	}
}


setInterval(updateLastUpdate, 1000);
startAutoRefresh();

