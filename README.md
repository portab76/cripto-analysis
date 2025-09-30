#cripto-analysis

Aplicación Spring Boot para monitoreo de precios de criptomonedas usando la API de Binance, con funcionalidad para descargar cierres históricos en formato CSV.

La aplicación está desplegada en:
https://elper.es/cripto/coin

##Descripción general

Esta aplicación permite:

Consultar en tiempo real el precio de criptomonedas (o pares de criptomonedas) vía la API pública de Binance.

Almacenar o procesar los datos de cierre (candlestick / klines) para análisis posterior.

Descargar los datos de cierre históricos en formato CSV desde la interfaz web o mediante endpoints REST.

Monitoreo periódico (scheduler) para ir obteniendo datos automáticamente.

Es ideal para proyectos de análisis de datos de criptomonedas, backtesting, dashboards o visualización de evoluciones de precios.

##Tecnologías usadas

Java + Spring Boot

API Binance para obtener datos de mercado

JSON / HTTP REST

Módulo para exportar CSV

Posible scheduler / tareas programadas

(Dependencias del proyecto definidas en pom.xml)


##Uso / Endpoints principales

A continuación, algunos endpoints típicos (basados en lo que se esperaría en esta app). Ajusta las rutas si en tu código son distintas:
```
Endpoint	                          Método	Parámetros / Consulta	Descripción
/api/price?symbol=BTCUSDT      	                      GET	symbol (por ejemplo BTCUSDT)	                                    Devuelve el precio actual del par especificado
/api/klines?symbol=BTCUSDT&interval=1h&limit=100	  GET	symbol, interval (ej. 1m, 5m, 1h, 1d), limit (número de cierres)	Devuelve datos de vela (opens, highs, lows, closes, volúmenes)
/api/klines/csv?symbol=BTCUSDT&interval=1h&limit=100  GET	mismos parámetros                                                   Devuelve un archivo CSV con los datos de cierre solicitados
/api/download/csv/{symbol}/{interval}	              GET	ruta con símbolos                                                   Permite descarga directa de CSV para ese par / intervalo predefinido
```
La interfaz web en https://elper.es/cripto/coin puede ofrecer formularios o controles visuales para:

- Seleccionar el par (por ejemplo BTC/USDT, ETH/USDT, etc.)
- Elegir el intervalo (minuto, hora, día)
- Ver la curva de precios
- Pulsar un botón para “Descargar CSV” con los datos de cierre histórico

##Formato del CSV generado

El archivo CSV típicamente tiene columnas como:
```
timestamp, open, high, low, close, volume
2025-09-01T00:00:00Z, 50000.00, 50500.00, 49800.00, 50200.00, 123.45
2025-09-01T01:00:00Z, 50200.00, 50300.00, 50050.00, 50100.00, 67.89
…  
```

timestamp: fecha / hora del cierre de la vela

open, high, low, close: precios

volume: volumen transaccionado

El separador puede ser coma (,) o punto y coma (;), dependiendo de la configuración regional.

##Casos de uso

1. Visualización de precios históricos
Navega en la interfaz web, selecciona par e intervalo, y gráfica la evolución.

2. Descarga para análisis externo
Usando el botón “Descargar CSV” o mediante endpoint REST, te bajas los datos para analizarlos offline con Python, R, Excel, etc.

3. Automatización / monitoreo
Si tienes un scheduler configurado, puedes que la aplicación periódicamente obtenga datos y los almacene o procese alertas.

4. Integración con otras herramientas
Puedes consumir sus endpoints desde dashboards (Grafana, Dash, frontends JS) para integrar datos en tiempo real.
