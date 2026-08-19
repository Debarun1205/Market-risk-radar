export type Sector =
  | "Tech"
  | "Financials"
  | "Auto"
  | "Energy"
  | "Healthcare"
  | "Consumer"
  | "Industrials"
  | "Telecom"
  | "Retail"
  | "Materials";

export type Region = "NA" | "LatAm" | "Europe" | "Asia" | "MiddleEast" | "Africa" | "Oceania";

export interface Company {
  t: string; // ticker (real where a common one exists, illustrative code otherwise)
  name: string;
  country: string;
  sector: Sector;
  lat: number;
  lon: number;
  cap: number; // market cap, $B — approximate, for pin sizing only
}

export const companies: Company[] = [
  // ---- USA ----
  { t: "AAPL", name: "Apple", country: "USA", sector: "Tech", lat: 37.323, lon: -122.032, cap: 3200 },
  { t: "MSFT", name: "Microsoft", country: "USA", sector: "Tech", lat: 47.674, lon: -122.121, cap: 3100 },
  { t: "NVDA", name: "Nvidia", country: "USA", sector: "Tech", lat: 37.387, lon: -121.965, cap: 2900 },
  { t: "GOOGL", name: "Alphabet", country: "USA", sector: "Tech", lat: 37.386, lon: -122.084, cap: 2100 },
  { t: "AMZN", name: "Amazon", country: "USA", sector: "Retail", lat: 47.606, lon: -122.332, cap: 1900 },
  { t: "META", name: "Meta Platforms", country: "USA", sector: "Tech", lat: 37.453, lon: -122.181, cap: 1300 },
  { t: "TSLA", name: "Tesla", country: "USA", sector: "Auto", lat: 30.267, lon: -97.743, cap: 780 },
  { t: "ADBE", name: "Adobe", country: "USA", sector: "Tech", lat: 37.329, lon: -121.894, cap: 240 },
  { t: "CRM", name: "Salesforce", country: "USA", sector: "Tech", lat: 37.79, lon: -122.397, cap: 300 },
  { t: "PYPL", name: "PayPal", country: "USA", sector: "Financials", lat: 37.332, lon: -121.888, cap: 75 },
  { t: "CSCO", name: "Cisco", country: "USA", sector: "Tech", lat: 37.409, lon: -121.969, cap: 200 },
  { t: "ORCL", name: "Oracle", country: "USA", sector: "Tech", lat: 30.401, lon: -97.72, cap: 450 },
  { t: "IBM", name: "IBM", country: "USA", sector: "Tech", lat: 41.125, lon: -73.714, cap: 200 },
  { t: "INTC", name: "Intel", country: "USA", sector: "Tech", lat: 37.387, lon: -121.964, cap: 100 },
  { t: "AMD", name: "AMD", country: "USA", sector: "Tech", lat: 37.393, lon: -121.958, cap: 220 },
  { t: "QCOM", name: "Qualcomm", country: "USA", sector: "Tech", lat: 32.715, lon: -117.161, cap: 180 },
  { t: "TXN", name: "Texas Instruments", country: "USA", sector: "Tech", lat: 32.777, lon: -96.797, cap: 170 },
  { t: "NFLX", name: "Netflix", country: "USA", sector: "Tech", lat: 37.236, lon: -121.975, cap: 320 },
  { t: "JPM", name: "JPMorgan Chase", country: "USA", sector: "Financials", lat: 40.712, lon: -74.006, cap: 620 },
  { t: "BAC", name: "Bank of America", country: "USA", sector: "Financials", lat: 35.227, lon: -80.843, cap: 300 },
  { t: "WFC", name: "Wells Fargo", country: "USA", sector: "Financials", lat: 37.789, lon: -122.4, cap: 210 },
  { t: "GS", name: "Goldman Sachs", country: "USA", sector: "Financials", lat: 40.706, lon: -74.011, cap: 160 },
  { t: "MS", name: "Morgan Stanley", country: "USA", sector: "Financials", lat: 40.756, lon: -73.986, cap: 180 },
  { t: "V", name: "Visa", country: "USA", sector: "Financials", lat: 37.789, lon: -122.396, cap: 560 },
  { t: "MA", name: "Mastercard", country: "USA", sector: "Financials", lat: 41.038, lon: -73.702, cap: 430 },
  { t: "UNH", name: "UnitedHealth", country: "USA", sector: "Healthcare", lat: 44.912, lon: -93.47, cap: 460 },
  { t: "JNJ", name: "Johnson & Johnson", country: "USA", sector: "Healthcare", lat: 40.486, lon: -74.452, cap: 380 },
  { t: "PFE", name: "Pfizer", country: "USA", sector: "Healthcare", lat: 40.755, lon: -73.978, cap: 150 },
  { t: "MRK", name: "Merck & Co.", country: "USA", sector: "Healthcare", lat: 40.608, lon: -74.277, cap: 260 },
  { t: "ABBV", name: "AbbVie", country: "USA", sector: "Healthcare", lat: 42.317, lon: -87.845, cap: 320 },
  { t: "LLY", name: "Eli Lilly", country: "USA", sector: "Healthcare", lat: 39.768, lon: -86.158, cap: 750 },
  { t: "ABT", name: "Abbott Laboratories", country: "USA", sector: "Healthcare", lat: 42.152, lon: -87.844, cap: 190 },
  { t: "TMO", name: "Thermo Fisher Scientific", country: "USA", sector: "Healthcare", lat: 42.376, lon: -71.236, cap: 200 },
  { t: "CVS", name: "CVS Health", country: "USA", sector: "Healthcare", lat: 41.994, lon: -71.524, cap: 80 },
  { t: "XOM", name: "ExxonMobil", country: "USA", sector: "Energy", lat: 30.079, lon: -95.417, cap: 480 },
  { t: "CVX", name: "Chevron", country: "USA", sector: "Energy", lat: 37.78, lon: -121.978, cap: 290 },
  { t: "COP", name: "ConocoPhillips", country: "USA", sector: "Energy", lat: 29.76, lon: -95.37, cap: 130 },
  { t: "PG", name: "Procter & Gamble", country: "USA", sector: "Consumer", lat: 39.103, lon: -84.512, cap: 380 },
  { t: "KO", name: "Coca-Cola", country: "USA", sector: "Consumer", lat: 33.769, lon: -84.39, cap: 270 },
  { t: "PEP", name: "PepsiCo", country: "USA", sector: "Consumer", lat: 41.038, lon: -73.703, cap: 230 },
  { t: "SBUX", name: "Starbucks", country: "USA", sector: "Consumer", lat: 47.581, lon: -122.336, cap: 100 },
  { t: "MCD", name: "McDonald's", country: "USA", sector: "Consumer", lat: 41.878, lon: -87.63, cap: 210 },
  { t: "NKE", name: "Nike", country: "USA", sector: "Consumer", lat: 45.487, lon: -122.804, cap: 110 },
  { t: "DIS", name: "Disney", country: "USA", sector: "Consumer", lat: 34.181, lon: -118.327, cap: 190 },
  { t: "WMT", name: "Walmart", country: "USA", sector: "Retail", lat: 36.373, lon: -94.208, cap: 500 },
  { t: "HD", name: "Home Depot", country: "USA", sector: "Retail", lat: 33.796, lon: -84.469, cap: 350 },
  { t: "COST", name: "Costco", country: "USA", sector: "Retail", lat: 47.53, lon: -122.032, cap: 380 },
  { t: "LOW", name: "Lowe's", country: "USA", sector: "Retail", lat: 35.582, lon: -80.882, cap: 130 },
  { t: "TGT", name: "Target", country: "USA", sector: "Retail", lat: 44.974, lon: -93.276, cap: 60 },
  { t: "BA", name: "Boeing", country: "USA", sector: "Industrials", lat: 38.88, lon: -77.107, cap: 120 },
  { t: "CAT", name: "Caterpillar", country: "USA", sector: "Industrials", lat: 32.814, lon: -96.949, cap: 160 },
  { t: "GE", name: "GE Aerospace", country: "USA", sector: "Industrials", lat: 42.361, lon: -71.057, cap: 190 },
  { t: "HON", name: "Honeywell", country: "USA", sector: "Industrials", lat: 35.227, lon: -80.843, cap: 130 },
  { t: "RTX", name: "RTX Corporation", country: "USA", sector: "Industrials", lat: 38.88, lon: -77.107, cap: 150 },
  { t: "DE", name: "Deere & Company", country: "USA", sector: "Industrials", lat: 41.506, lon: -90.515, cap: 120 },
  { t: "UNP", name: "Union Pacific", country: "USA", sector: "Industrials", lat: 41.257, lon: -95.995, cap: 140 },
  { t: "UPS", name: "UPS", country: "USA", sector: "Industrials", lat: 33.757, lon: -84.396, cap: 110 },
  { t: "FDX", name: "FedEx", country: "USA", sector: "Industrials", lat: 35.149, lon: -90.049, cap: 60 },
  { t: "F", name: "Ford", country: "USA", sector: "Auto", lat: 42.322, lon: -83.176, cap: 45 },
  { t: "GM", name: "General Motors", country: "USA", sector: "Auto", lat: 42.331, lon: -83.046, cap: 55 },
  { t: "T", name: "AT&T", country: "USA", sector: "Telecom", lat: 32.777, lon: -96.797, cap: 140 },
  { t: "VZ", name: "Verizon", country: "USA", sector: "Telecom", lat: 40.751, lon: -73.977, cap: 170 },
  { t: "TMUS", name: "T-Mobile US", country: "USA", sector: "Telecom", lat: 47.61, lon: -122.201, cap: 220 },
  { t: "CMCSA", name: "Comcast", country: "USA", sector: "Telecom", lat: 39.953, lon: -75.166, cap: 150 },
  { t: "CHTR", name: "Charter Communications", country: "USA", sector: "Telecom", lat: 41.053, lon: -73.538, cap: 45 },
  { t: "ACN", name: "Accenture", country: "Ireland", sector: "Tech", lat: 53.349, lon: -6.26, cap: 190 },
  { t: "MDT", name: "Medtronic", country: "Ireland", sector: "Healthcare", lat: 53.349, lon: -6.26, cap: 110 },

  // ---- Canada ----
  { t: "RY", name: "Royal Bank of Canada", country: "Canada", sector: "Financials", lat: 43.651, lon: -79.347, cap: 180 },
  { t: "TD", name: "Toronto-Dominion Bank", country: "Canada", sector: "Financials", lat: 43.649, lon: -79.381, cap: 130 },
  { t: "SHOP", name: "Shopify", country: "Canada", sector: "Tech", lat: 45.421, lon: -75.697, cap: 100 },
  { t: "ENB", name: "Enbridge", country: "Canada", sector: "Energy", lat: 51.045, lon: -114.057, cap: 90 },
  { t: "CNQ", name: "Canadian Natural Resources", country: "Canada", sector: "Energy", lat: 51.045, lon: -114.057, cap: 70 },
  { t: "BN", name: "Brookfield", country: "Canada", sector: "Financials", lat: 43.648, lon: -79.38, cap: 90 },

  // ---- Latin America ----
  { t: "AMX", name: "América Móvil", country: "Mexico", sector: "Telecom", lat: 19.433, lon: -99.133, cap: 45 },
  { t: "WALMEX", name: "Walmart de México", country: "Mexico", sector: "Retail", lat: 19.433, lon: -99.133, cap: 50 },
  { t: "FEMSA", name: "FEMSA", country: "Mexico", sector: "Consumer", lat: 25.686, lon: -100.316, cap: 35 },
  { t: "VALE", name: "Vale S.A.", country: "Brazil", sector: "Materials", lat: -22.906, lon: -43.172, cap: 60 },
  { t: "PBR", name: "Petrobras", country: "Brazil", sector: "Energy", lat: -22.906, lon: -43.172, cap: 90 },
  { t: "ITUB", name: "Itaú Unibanco", country: "Brazil", sector: "Financials", lat: -23.55, lon: -46.633, cap: 60 },
  { t: "BBD", name: "Banco Bradesco", country: "Brazil", sector: "Financials", lat: -23.532, lon: -46.792, cap: 30 },
  { t: "ABEV", name: "Ambev", country: "Brazil", sector: "Consumer", lat: -23.55, lon: -46.633, cap: 40 },
  { t: "MELI", name: "MercadoLibre", country: "Argentina", sector: "Retail", lat: -34.604, lon: -58.382, cap: 90 },
  { t: "EC", name: "Ecopetrol", country: "Colombia", sector: "Energy", lat: 4.711, lon: -74.072, cap: 25 },
  { t: "SQM", name: "SQM", country: "Chile", sector: "Materials", lat: -33.449, lon: -70.669, cap: 15 },

  // ---- UK ----
  { t: "HSBC", name: "HSBC", country: "UK", sector: "Financials", lat: 51.507, lon: -0.128, cap: 170 },
  { t: "SHEL", name: "Shell", country: "UK", sector: "Energy", lat: 51.507, lon: -0.09, cap: 210 },
  { t: "BP", name: "BP", country: "UK", sector: "Energy", lat: 51.507, lon: -0.108, cap: 90 },
  { t: "AZN", name: "AstraZeneca", country: "UK", sector: "Healthcare", lat: 52.205, lon: 0.121, cap: 220 },
  { t: "GSK", name: "GSK", country: "UK", sector: "Healthcare", lat: 51.494, lon: -0.169, cap: 80 },
  { t: "ULVR", name: "Unilever", country: "UK", sector: "Consumer", lat: 51.507, lon: -0.128, cap: 140 },
  { t: "DGE", name: "Diageo", country: "UK", sector: "Consumer", lat: 51.507, lon: -0.13, cap: 65 },
  { t: "BATS", name: "British American Tobacco", country: "UK", sector: "Consumer", lat: 51.507, lon: -0.128, cap: 75 },
  { t: "RIO", name: "Rio Tinto", country: "UK", sector: "Materials", lat: 51.507, lon: -0.11, cap: 100 },
  { t: "BARC", name: "Barclays", country: "UK", sector: "Financials", lat: 51.516, lon: -0.088, cap: 45 },
  { t: "LLOY", name: "Lloyds Banking Group", country: "UK", sector: "Financials", lat: 51.511, lon: -0.087, cap: 45 },
  { t: "VOD", name: "Vodafone", country: "UK", sector: "Telecom", lat: 51.454, lon: -1.032, cap: 25 },
  { t: "BAES", name: "BAE Systems", country: "UK", sector: "Industrials", lat: 51.507, lon: -0.128, cap: 50 },

  // ---- Germany ----
  { t: "SAP", name: "SAP", country: "Germany", sector: "Tech", lat: 49.293, lon: 8.642, cap: 260 },
  { t: "SIE", name: "Siemens", country: "Germany", sector: "Industrials", lat: 48.135, lon: 11.582, cap: 140 },
  { t: "VOW3", name: "Volkswagen", country: "Germany", sector: "Auto", lat: 52.423, lon: 10.787, cap: 60 },
  { t: "MBG", name: "Mercedes-Benz Group", country: "Germany", sector: "Auto", lat: 48.783, lon: 9.182, cap: 65 },
  { t: "BMW", name: "BMW", country: "Germany", sector: "Auto", lat: 48.135, lon: 11.582, cap: 55 },
  { t: "ALV", name: "Allianz", country: "Germany", sector: "Financials", lat: 48.135, lon: 11.582, cap: 130 },
  { t: "DTE", name: "Deutsche Telekom", country: "Germany", sector: "Telecom", lat: 50.735, lon: 7.1, cap: 130 },
  { t: "BAS", name: "BASF", country: "Germany", sector: "Materials", lat: 49.481, lon: 8.446, cap: 45 },
  { t: "DBK", name: "Deutsche Bank", country: "Germany", sector: "Financials", lat: 50.11, lon: 8.682, cap: 35 },
  { t: "ADS", name: "Adidas", country: "Germany", sector: "Consumer", lat: 49.568, lon: 10.888, cap: 40 },
  { t: "MRCG", name: "Merck KGaA", country: "Germany", sector: "Healthcare", lat: 49.873, lon: 8.651, cap: 70 },

  // ---- France ----
  { t: "MC", name: "LVMH", country: "France", sector: "Consumer", lat: 48.857, lon: 2.352, cap: 340 },
  { t: "OR", name: "L'Oréal", country: "France", sector: "Consumer", lat: 48.904, lon: 2.306, cap: 200 },
  { t: "TTE", name: "TotalEnergies", country: "France", sector: "Energy", lat: 48.897, lon: 2.253, cap: 150 },
  { t: "SNY", name: "Sanofi", country: "France", sector: "Healthcare", lat: 48.857, lon: 2.352, cap: 130 },
  { t: "AIR", name: "Airbus", country: "France", sector: "Industrials", lat: 43.605, lon: 1.444, cap: 140 },
  { t: "BNP", name: "BNP Paribas", country: "France", sector: "Financials", lat: 48.857, lon: 2.352, cap: 80 },
  { t: "AXAHY", name: "AXA", country: "France", sector: "Financials", lat: 48.857, lon: 2.352, cap: 75 },
  { t: "RMS", name: "Hermès", country: "France", sector: "Consumer", lat: 48.857, lon: 2.352, cap: 220 },
  { t: "SU", name: "Schneider Electric", country: "France", sector: "Industrials", lat: 48.878, lon: 2.181, cap: 110 },
  { t: "VCISY", name: "Vinci", country: "France", sector: "Industrials", lat: 48.878, lon: 2.181, cap: 65 },

  // ---- Netherlands ----
  { t: "ASML", name: "ASML", country: "Netherlands", sector: "Tech", lat: 51.418, lon: 5.401, cap: 380 },
  { t: "INGA", name: "ING Group", country: "Netherlands", sector: "Financials", lat: 52.37, lon: 4.895, cap: 55 },
  { t: "AD", name: "Ahold Delhaize", country: "Netherlands", sector: "Retail", lat: 52.435, lon: 4.823, cap: 30 },
  { t: "PHIA", name: "Philips", country: "Netherlands", sector: "Healthcare", lat: 52.37, lon: 4.895, cap: 25 },
  { t: "HEIA", name: "Heineken", country: "Netherlands", sector: "Consumer", lat: 52.37, lon: 4.895, cap: 55 },

  // ---- Switzerland ----
  { t: "NESN", name: "Nestle", country: "Switzerland", sector: "Consumer", lat: 46.462, lon: 6.842, cap: 280 },
  { t: "ROG", name: "Roche", country: "Switzerland", sector: "Healthcare", lat: 47.559, lon: 7.588, cap: 220 },
  { t: "NOVN", name: "Novartis", country: "Switzerland", sector: "Healthcare", lat: 47.559, lon: 7.588, cap: 220 },
  { t: "UBS", name: "UBS", country: "Switzerland", sector: "Financials", lat: 47.377, lon: 8.542, cap: 100 },
  { t: "CFR", name: "Richemont", country: "Switzerland", sector: "Consumer", lat: 46.204, lon: 6.143, cap: 90 },
  { t: "ZURN", name: "Zurich Insurance", country: "Switzerland", sector: "Financials", lat: 47.377, lon: 8.542, cap: 90 },

  // ---- Spain ----
  { t: "ITX", name: "Inditex", country: "Spain", sector: "Retail", lat: 43.305, lon: -8.406, cap: 150 },
  { t: "SANES", name: "Banco Santander", country: "Spain", sector: "Financials", lat: 40.417, lon: -3.703, cap: 90 },
  { t: "IBE", name: "Iberdrola", country: "Spain", sector: "Energy", lat: 43.263, lon: -2.935, cap: 100 },
  { t: "TEF", name: "Telefónica", country: "Spain", sector: "Telecom", lat: 40.417, lon: -3.703, cap: 25 },

  // ---- Italy ----
  { t: "ENI", name: "Eni", country: "Italy", sector: "Energy", lat: 41.903, lon: 12.496, cap: 55 },
  { t: "ISP", name: "Intesa Sanpaolo", country: "Italy", sector: "Financials", lat: 45.464, lon: 9.19, cap: 75 },
  { t: "G", name: "Assicurazioni Generali", country: "Italy", sector: "Financials", lat: 45.649, lon: 13.777, cap: 40 },
  { t: "RACE", name: "Ferrari", country: "Italy", sector: "Auto", lat: 44.531, lon: 10.865, cap: 90 },

  // ---- Nordics ----
  { t: "NVO", name: "Novo Nordisk", country: "Denmark", sector: "Healthcare", lat: 55.731, lon: 12.451, cap: 350 },
  { t: "AMKBY", name: "A.P. Moller-Maersk", country: "Denmark", sector: "Industrials", lat: 55.676, lon: 12.568, cap: 35 },
  { t: "NOK", name: "Nokia", country: "Finland", sector: "Tech", lat: 60.206, lon: 24.656, cap: 25 },
  { t: "ERIC", name: "Ericsson", country: "Sweden", sector: "Tech", lat: 59.329, lon: 18.069, cap: 25 },
  { t: "VLVLY", name: "Volvo Group", country: "Sweden", sector: "Auto", lat: 57.709, lon: 11.974, cap: 45 },
  { t: "EQNR", name: "Equinor", country: "Norway", sector: "Energy", lat: 58.97, lon: 5.733, cap: 75 },

  // ---- Poland / Austria / Portugal / Belgium ----
  { t: "PKO", name: "PKO Bank Polski", country: "Poland", sector: "Financials", lat: 52.23, lon: 21.012, cap: 20 },
  { t: "OMV", name: "OMV", country: "Austria", sector: "Energy", lat: 48.208, lon: 16.373, cap: 15 },
  { t: "EDP", name: "EDP", country: "Portugal", sector: "Energy", lat: 38.722, lon: -9.139, cap: 15 },
  { t: "BUD", name: "AB InBev", country: "Belgium", sector: "Consumer", lat: 50.879, lon: 4.7, cap: 110 },

  // ---- Middle East ----
  { t: "ARAMCO", name: "Saudi Aramco", country: "Saudi Arabia", sector: "Energy", lat: 26.288, lon: 50.152, cap: 1800 },
  { t: "EMAAR", name: "Emaar Properties", country: "UAE", sector: "Industrials", lat: 25.205, lon: 55.271, cap: 20 },
  { t: "QNBK", name: "Qatar National Bank", country: "Qatar", sector: "Financials", lat: 25.286, lon: 51.531, cap: 45 },
  { t: "TEVA", name: "Teva Pharmaceutical", country: "Israel", sector: "Healthcare", lat: 32.085, lon: 34.782, cap: 20 },
  { t: "CHKP", name: "Check Point Software", country: "Israel", sector: "Tech", lat: 32.085, lon: 34.782, cap: 18 },
  { t: "THYAO", name: "Turkish Airlines", country: "Turkey", sector: "Industrials", lat: 41.008, lon: 28.978, cap: 15 },
  { t: "COMI", name: "Commercial International Bank", country: "Egypt", sector: "Financials", lat: 30.044, lon: 31.236, cap: 8 },

  // ---- Africa ----
  { t: "NPN", name: "Naspers", country: "South Africa", sector: "Tech", lat: -33.925, lon: 18.424, cap: 40 },
  { t: "FSR", name: "FirstRand", country: "South Africa", sector: "Financials", lat: -26.204, lon: 28.047, cap: 25 },
  { t: "DANGCEM", name: "Dangote Cement", country: "Nigeria", sector: "Materials", lat: 6.524, lon: 3.379, cap: 15 },
  { t: "SCOM", name: "Safaricom", country: "Kenya", sector: "Telecom", lat: -1.286, lon: 36.817, cap: 8 },

  // ---- Japan ----
  { t: "TM", name: "Toyota", country: "Japan", sector: "Auto", lat: 35.082, lon: 137.156, cap: 260 },
  { t: "SONY", name: "Sony", country: "Japan", sector: "Tech", lat: 35.676, lon: 139.65, cap: 130 },
  { t: "HMC", name: "Honda", country: "Japan", sector: "Auto", lat: 35.676, lon: 139.65, cap: 55 },
  { t: "NTDOY", name: "Nintendo", country: "Japan", sector: "Tech", lat: 35.011, lon: 135.768, cap: 75 },
  { t: "MUFG", name: "Mitsubishi UFJ Financial", country: "Japan", sector: "Financials", lat: 35.676, lon: 139.65, cap: 130 },
  { t: "SFTBY", name: "SoftBank Group", country: "Japan", sector: "Tech", lat: 35.676, lon: 139.65, cap: 90 },
  { t: "KYCCF", name: "Keyence", country: "Japan", sector: "Industrials", lat: 34.694, lon: 135.502, cap: 130 },
  { t: "NTTYY", name: "NTT", country: "Japan", sector: "Telecom", lat: 35.676, lon: 139.65, cap: 90 },

  // ---- China ----
  { t: "BABA", name: "Alibaba", country: "China", sector: "Tech", lat: 30.274, lon: 120.155, cap: 210 },
  { t: "TCEHY", name: "Tencent", country: "China", sector: "Tech", lat: 22.543, lon: 114.058, cap: 400 },
  { t: "IDCBY", name: "ICBC", country: "China", sector: "Financials", lat: 39.904, lon: 116.407, cap: 220 },
  { t: "PDD", name: "PDD Holdings", country: "China", sector: "Retail", lat: 31.23, lon: 121.474, cap: 180 },
  { t: "BIDU", name: "Baidu", country: "China", sector: "Tech", lat: 39.904, lon: 116.407, cap: 35 },
  { t: "600519", name: "Kweichow Moutai", country: "China", sector: "Consumer", lat: 26.598, lon: 106.708, cap: 260 },
  { t: "BYDDY", name: "BYD", country: "China", sector: "Auto", lat: 22.543, lon: 114.058, cap: 110 },
  { t: "CEOHF", name: "CNOOC", country: "China", sector: "Energy", lat: 39.904, lon: 116.407, cap: 90 },
  { t: "PNGAY", name: "Ping An Insurance", country: "China", sector: "Financials", lat: 22.543, lon: 114.058, cap: 130 },

  // ---- South Korea ----
  { t: "SSNLF", name: "Samsung Electronics", country: "South Korea", sector: "Tech", lat: 37.263, lon: 127.028, cap: 400 },
  { t: "HXSCF", name: "SK Hynix", country: "South Korea", sector: "Tech", lat: 37.272, lon: 127.44, cap: 90 },
  { t: "HYMTF", name: "Hyundai Motor", country: "South Korea", sector: "Auto", lat: 37.566, lon: 126.978, cap: 45 },
  { t: "LGEIY", name: "LG Electronics", country: "South Korea", sector: "Tech", lat: 37.566, lon: 126.978, cap: 15 },

  // ---- Taiwan ----
  { t: "TSM", name: "TSMC", country: "Taiwan", sector: "Tech", lat: 24.807, lon: 120.968, cap: 900 },
  { t: "HNHPF", name: "Foxconn (Hon Hai)", country: "Taiwan", sector: "Tech", lat: 25.012, lon: 121.465, cap: 90 },

  // ---- India ----
  { t: "RELIANCE", name: "Reliance Industries", country: "India", sector: "Energy", lat: 19.076, lon: 72.878, cap: 210 },
  { t: "TCS", name: "Tata Consultancy Services", country: "India", sector: "Tech", lat: 19.076, lon: 72.878, cap: 170 },
  { t: "HDB", name: "HDFC Bank", country: "India", sector: "Financials", lat: 19.076, lon: 72.878, cap: 150 },
  { t: "INFY", name: "Infosys", country: "India", sector: "Tech", lat: 12.972, lon: 77.594, cap: 80 },
  { t: "IBN", name: "ICICI Bank", country: "India", sector: "Financials", lat: 19.076, lon: 72.878, cap: 100 },
  { t: "ITC", name: "ITC Limited", country: "India", sector: "Consumer", lat: 22.573, lon: 88.364, cap: 55 },
  { t: "LT", name: "Larsen & Toubro", country: "India", sector: "Industrials", lat: 19.076, lon: 72.878, cap: 55 },

  // ---- Southeast Asia ----
  { t: "DBS", name: "DBS Group", country: "Singapore", sector: "Financials", lat: 1.352, lon: 103.82, cap: 90 },
  { t: "SE", name: "Sea Limited", country: "Singapore", sector: "Tech", lat: 1.352, lon: 103.82, cap: 45 },
  { t: "TLK", name: "Telkom Indonesia", country: "Indonesia", sector: "Telecom", lat: -6.208, lon: 106.846, cap: 20 },
  { t: "BBCA", name: "Bank Central Asia", country: "Indonesia", sector: "Financials", lat: -6.208, lon: 106.846, cap: 90 },
  { t: "SM", name: "SM Investments", country: "Philippines", sector: "Retail", lat: 14.599, lon: 120.984, cap: 18 },
  { t: "PTT", name: "PTT Public Company", country: "Thailand", sector: "Energy", lat: 13.756, lon: 100.502, cap: 25 },
  { t: "VIC", name: "Vingroup", country: "Vietnam", sector: "Industrials", lat: 21.028, lon: 105.804, cap: 15 },

  // ---- Australia / New Zealand ----
  { t: "BHP", name: "BHP Group", country: "Australia", sector: "Materials", lat: -37.814, lon: 144.963, cap: 150 },
  { t: "CBA", name: "Commonwealth Bank of Australia", country: "Australia", sector: "Financials", lat: -33.869, lon: 151.209, cap: 150 },
  { t: "CSL", name: "CSL Limited", country: "Australia", sector: "Healthcare", lat: -37.814, lon: 144.963, cap: 100 },
  { t: "WES", name: "Wesfarmers", country: "Australia", sector: "Retail", lat: -31.953, lon: 115.857, cap: 55 },
  { t: "FPH", name: "Fisher & Paykel Healthcare", country: "New Zealand", sector: "Healthcare", lat: -36.849, lon: 174.763, cap: 12 },
];

export const byTicker: Record<string, Company> = Object.fromEntries(
  companies.map((c) => [c.t, c])
);

export const sectorColor: Record<Sector, string> = {
  Tech: "#E8A33D",
  Financials: "#4FD1C5",
  Auto: "#5B8DEF",
  Energy: "#E0665A",
  Healthcare: "#9B8FE0",
  Consumer: "#59C97A",
  Industrials: "#94A3B8",
  Telecom: "#D66FA0",
  Retail: "#A3C940",
  Materials: "#B08463",
};

const REGION_BY_COUNTRY: Record<string, Region> = {
  USA: "NA",
  Canada: "NA",
  Mexico: "LatAm",
  Brazil: "LatAm",
  Argentina: "LatAm",
  Colombia: "LatAm",
  Chile: "LatAm",
  UK: "Europe",
  Germany: "Europe",
  France: "Europe",
  Netherlands: "Europe",
  Switzerland: "Europe",
  Spain: "Europe",
  Italy: "Europe",
  Denmark: "Europe",
  Finland: "Europe",
  Sweden: "Europe",
  Norway: "Europe",
  Poland: "Europe",
  Ireland: "Europe",
  Belgium: "Europe",
  Austria: "Europe",
  Portugal: "Europe",
  Japan: "Asia",
  China: "Asia",
  "South Korea": "Asia",
  Taiwan: "Asia",
  India: "Asia",
  Singapore: "Asia",
  Indonesia: "Asia",
  Philippines: "Asia",
  Thailand: "Asia",
  Vietnam: "Asia",
  "Saudi Arabia": "MiddleEast",
  UAE: "MiddleEast",
  Qatar: "MiddleEast",
  Israel: "MiddleEast",
  Turkey: "MiddleEast",
  Egypt: "MiddleEast",
  "South Africa": "Africa",
  Nigeria: "Africa",
  Kenya: "Africa",
  Australia: "Oceania",
  "New Zealand": "Oceania",
};

export function regionOf(country: string): Region {
  return REGION_BY_COUNTRY[country] ?? "Europe";
}

// Colors assigned by selection order (not sector), so companies picked for
// comparison stay visually distinct from each other even when several
// share the same sector.
export const COMPARE_COLORS = [
  "#E8A33D", // amber
  "#4FD1C5", // cyan
  "#E0665A", // rose
  "#9B8FE0", // violet
  "#59C97A", // green
  "#5B8DEF", // blue
];

export const DEFAULT_SELECTION = ["AAPL", "JPM", "TSLA", "NVO"];
export const MAX_SELECTION = 6;
