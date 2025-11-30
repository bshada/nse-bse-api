/**
 * Collection of constants grouped into classes. Use it to pass arguments.
 */

export class CATEGORY {
  /** Corp Announcements category names */
  static readonly AGM = 'AGM/EGM';
  static readonly BOARD_MEETING = 'Board Meeting';
  static readonly UPDATE = 'Company Update';
  static readonly ACTION = 'Corp. Action';
  static readonly INSIDER = 'Insider Trading / SAST';
  static readonly NEW_LISTING = 'New Listing';
  static readonly RESULT = 'Result';
  static readonly OTHERS = 'Others';
}

export class SEGMENT {
  /** BSE Market segments */
  static readonly EQUITY = 'Equity';
  static readonly MF = 'MF';
  static readonly PREFERENCE_SHARES = 'Preference Shares';
  static readonly DEBENTURES_BONDS = 'Debentures and Bonds';
  static readonly EQUITY_INSTITUTIONAL = 'Equity - Institutional Series';
  static readonly COMMERCIAL_PAPERS = 'Commercial Papers';
}

export class STATUS {
  /** Current status of the Financial instrument */
  static readonly ACTIVE = 'Active';
  static readonly SUSPENDED = 'Suspended';
  static readonly DELISTED = 'Delisted';
}

export class INDEX {
  /** BSE Market Indices */
  static readonly SENSEX = 'S&P BSE SENSEX';
  static readonly BSE100 = 'S&P BSE 100';
  static readonly BSE100_ESG = 'S&P BSE 100 ESG INDEX';
  static readonly BSE100_LARGECAP_TMC = 'S&P BSE 100 LARGECAP TMC INDEX';
  static readonly BSE150_MIDCAP = 'S&P BSE 150 MIDCAP INDEX';
  static readonly BSE200 = 'S&P BSE 200';
  static readonly BSE250_LARGEMIDCAP = 'S&P BSE 250 LARGEMIDCAP INDEX';
  static readonly BSE250_SMALLCAP = 'S&P BSE 250 SMALLCAP INDEX';
  static readonly BSE400_MIDSMALLCAP = 'S&P BSE 400 MIDSMALLCAP INDEX';
  static readonly BSE500 = 'S&P BSE 500';
  static readonly ALLCAP = 'S&P BSE ALLCAP';
  static readonly AUTO = 'S&P BSE AUTO';
  static readonly BANKEX = 'S&P BSE BANKEX';
  static readonly BHARAT_22 = 'S&P BSE BHARAT 22 INDEX';
  static readonly CAPITAL_GOODS = 'S&P BSE CAPITAL GOODS';
  static readonly CARBONEX = 'S&P BSE CARBONEX';
  static readonly COMMODITIES = 'S&P BSE COMMODITIES';
  static readonly CONSUMER_DISCRETIONARY = 'S&P BSE CONSUMER DISCRETIONARY';
  static readonly CONSUMER_DURABLES = 'S&P BSE CONSUMER DURABLES';
  static readonly CPSE = 'S&P BSE CPSE';
  static readonly DIVERSIFIED_FINANCIALS_REVENUE_GROWTH = 'S&P BSE DIVERSIFIED FINANCIALS REVENUE GROWTH INDEX';
  static readonly DIVIDEND_STABILITY = 'S&P BSE DIVIDEND STABILITY INDEX';
  static readonly DOLLEX_100 = 'S&P BSE DOLLEX 100';
  static readonly DOLLEX_200 = 'S&P BSE DOLLEX 200';
  static readonly DOLLEX_30 = 'S&P BSE DOLLEX 30';
  static readonly ENERGY = 'S&P BSE ENERGY';
  static readonly ENHANCED_VALUE = 'S&P BSE ENHANCED VALUE INDEX';
  static readonly FAST_MOVING_CONSUMER_GOODS = 'S&P BSE FAST MOVING CONSUMER GOODS';
  static readonly FINANCIAL_SERVICES = 'S&P BSE FINANCIAL SERVICES';
  static readonly GREENEX = 'S&P BSE GREENEX';
  static readonly HEALTHCARE = 'S&P BSE HEALTHCARE';
  static readonly INDIA_INFRASTRUCTURE = 'S&P BSE INDIA INFRASTRUCTURE INDEX';
  static readonly INDIA_MANUFACTURING = 'S&P BSE INDIA MANUFACTURING INDEX';
  static readonly INDUSTRIALS = 'S&P BSE INDUSTRIALS';
  static readonly INFORMATION_TECHNOLOGY = 'S&P BSE INFORMATION TECHNOLOGY';
  static readonly IPO = 'S&P BSE IPO';
  static readonly LARGECAP = 'S&P BSE LARGECAP';
  static readonly LOW_VOLATILITY = 'S&P BSE LOW VOLATILITY INDEX';
  static readonly METAL = 'S&P BSE METAL';
  static readonly MIDCAP = 'S&P BSE MIDCAP';
  static readonly MIDCAP_SELECT = 'S&P BSE MIDCAP SELECT INDEX';
  static readonly MOMENTUM = 'S&P BSE MOMENTUM INDEX';
  static readonly OIL_GAS = 'S&P BSE OIL & GAS';
  static readonly POWER = 'S&P BSE POWER';
  static readonly PRIVATE_BANKS = 'S&P BSE PRIVATE BANKS INDEX';
  static readonly PSU = 'S&P BSE PSU';
  static readonly QUALITY = 'S&P BSE QUALITY INDEX ';
  static readonly REALTY = 'S&P BSE REALTY';
  static readonly SENSEX_50 = 'S&P BSE SENSEX 50';
  static readonly SENSEX_NEXT_50 = 'S&P BSE SENSEX NEXT 50';
  static readonly SERVICES = 'S&P BSE SERVICES';
  static readonly SMALLCAP = 'S&P BSE SMALLCAP';
  static readonly SMALLCAP_SELECT = 'S&P BSE SMALLCAP SELECT INDEX';
  static readonly SME_IPO = 'S&P BSE SME IPO';
  static readonly TECK = 'S&P BSE TECK';
  static readonly TELECOMMUNICATION = 'S&P BSE TELECOMMUNICATION';
  static readonly UTILITIES = 'S&P BSE UTILITIES';
}

export class PURPOSE {
  /** Corp Actions purpose code */
  static readonly BONUS = 'P5';
  static readonly BUYBACK = 'P6';
  static readonly DIVIDEND = 'P9';
  static readonly PREFERENCE_DIVIDEND = 'P10';
  static readonly SPLIT = 'P26';
  static readonly DELISTING = 'P29';
}

export class SECTOR {
  /** BSE Sector names */
  static readonly AUTO = 'Automobile and Auto Components';
  static readonly CAPITAL_GOODS = 'Capital Goods';
  static readonly CHEMICALS = 'Chemicals';
  static readonly CONSTRUCTION = 'Construction';
  static readonly CONSTRUCTION_MATERIALS = 'Construction Materials';
  static readonly CONSUMER_DURABLES = 'Consumer Durables';
  static readonly CONSUMER_SERVICES = 'Consumer Services';
  static readonly DIVERSIFIED = 'Diversified';
  static readonly FMCG = 'Fast Moving Consumer Goods';
  static readonly FIN_SERVICES = 'Financial Services';
  static readonly FOREST_MATERIALS = 'Forest Materials';
  static readonly IT = 'Information Technology';
  static readonly MEDIA = 'Media, Entertainment & Publication';
  static readonly METAL_MINING = 'Metals & Mining';
  static readonly OIL_GAS = 'Oil, Gas & Consumable Fuels';
  static readonly POWER = 'Power';
  static readonly REALTY = 'Realty';
  static readonly SERVICES = 'Services';
  static readonly TELECOM = 'Telecommunication';
  static readonly TEXTILES = 'Textiles';
  static readonly UTILITIES = 'Utilities';
}

export class SECTOR_ISIN {
  /** ISIN code for BSE Sectors */
  static readonly AUTOMOBILE = 'IN020102001';
  static readonly CAPITAL_GOODS = 'IN070205008';
  static readonly CHEMICALS = 'IN010101001';
  static readonly CONSTRUCTION = 'IN070101001';
  static readonly CONSTRUCTION_MATERIALS = 'IN010203001';
  static readonly CONSUMER_DURABLES = 'IN020201003';
  static readonly CONSUMER_SERVICES = 'IN020601001';
  static readonly DIVERSIFIED = 'IN120101001';
  static readonly FMCG = 'IN040101003';
  static readonly FIN_SERVICES = 'IN050103006';
  static readonly FOREST_MATERIALS = 'IN010401001';
  static readonly HEALTHCARE = 'IN060101001';
  static readonly IT = 'IN080102001';
  static readonly MEDIA = 'IN020401001';
  static readonly METALS = 'IN010301001';
  static readonly OIL_GAS = 'IN030103001';
  static readonly POWER = 'IN110101002';
  static readonly REALTY = 'IN020501001';
  static readonly SERVICES = 'IN090104002';
  static readonly TELECOMMUNICATION = 'IN100101003';
  static readonly TEXTILES = 'IN020301002';
  static readonly UTILITIES = 'IN110201005';
}

export class INDUSTRY {
  /** BSE Industry names */
  static readonly TWO_WHEELERS = '2/3 WHEELERS';
  static readonly ABRASIVES_BEARINGS = 'ABRASIVES & BEARINGS';
  static readonly ADVERTISING = 'ADVERTISING & MEDIA AGENCIES';
  static readonly AEROSPACE_DEFENSE = 'AEROSPACE & DEFENSE';
  static readonly AIRLINE = 'AIRLINE';
  static readonly AIRPORT_SERVICES = 'AIRPORT & AIRPORT SERVICES';
  static readonly ALUMINIUM = 'ALUMINIUM';
  static readonly ALUMINIUM_COPPER_ZINC = 'ALUMINIUM, COPPER & ZINC PRODUCTS';
  static readonly AMUSEMENT_PARKS = 'AMUSEMENT PARKS/ OTHER RECREATION';
  static readonly ANIMAL_FEED = 'ANIMAL FEED';
  static readonly ASSET_MANAGEMENT = 'ASSET MANAGEMENT COMPANY';
  static readonly AUTO_COMPONENTS = 'AUTO COMPONENTS & EQUIPMENTS';
  static readonly AUTO_DEALER = 'AUTO -DEALER';
  static readonly BIOTECHNOLOGY = 'BIOTECHNOLOGY';
  static readonly BREWERIES = 'BREWERIES & DISTILLERIES';
  static readonly BPO_KPO = 'BUSINESS PROCESS OUTSOURCING (BPO)/ KNOWLEDGE PROCESS OUTSOURCING (KPO)';
  static readonly CABLES_ELECTRICALS = 'CABLES - ELECTRICALS';
  static readonly CARBON_BLACK = 'CARBON BLACK';
  static readonly CASTINGS_FORGINGS = 'CASTINGS & FORGINGS';
  static readonly CEMENT = 'CEMENT & CEMENT PRODUCTS';
  static readonly CERAMICS = 'CERAMICS';
  static readonly TOBACCO = 'CIGARETTES & TOBACCO PRODUCTS';
  static readonly CIVIL_CONSTRUCTION = 'CIVIL CONSTRUCTION';
  static readonly COAL = 'COAL';
  static readonly COMMERCIAL_VEHICLES = 'COMMERCIAL VEHICLES';
  static readonly COMMODITY_CHEMICALS = 'COMMODITY CHEMICALS';
  static readonly COMPRESSORS_PUMPS_ENGINES = 'COMPRESSORS, PUMPS & DIESEL ENGINES';
  static readonly IT_SOFTWARE = 'COMPUTERS - SOFTWARE & CONSULTING';
  static readonly IT_HARDWARE = 'COMPUTERS HARDWARE & EQUIPMENTS';
  static readonly CONSTRUCTION_VEHICLES = 'CONSTRUCTION VEHICLES';
  static readonly CONSULTING_SERVICES = 'CONSULTING SERVICES';
  static readonly CONSUMER_ELECTRONICS = 'CONSUMER ELECTRONICS';
  static readonly COPPER = 'COPPER';
  static readonly CYCLES = 'CYCLES';
  static readonly DAIRY_PRODUCTS = 'DAIRY PRODUCTS';
  static readonly DATA_PROCESSING = 'DATA PROCESSING SERVICES';
  static readonly DEPOSITORIES_CLEARING_HOUSES = 'DEPOSITORIES, CLEARING HOUSES AND OTHER INTERMEDIARIES';
  static readonly DIGITAL_ENTERTAINMENT = 'DIGITAL ENTERTAINMENT';
  static readonly DISTRIBUTORS = 'DISTRIBUTORS';
  static readonly DIVERSIFIED = 'DIVERSIFIED';
  static readonly DIVERSIFIED_COMMERCIAL = 'DIVERSIFIED COMMERCIAL SERVICES';
  static readonly DIVERSIFIED_CONSUMER = 'DIVERSIFIED CONSUMER PRODUCTS';
  static readonly DIVERSIFIED_FMCG = 'DIVERSIFIED FMCG';
  static readonly DIVERSIFIED_METALS = 'DIVERSIFIED METALS';
  static readonly DIVERSIFIED_RETAIL = 'DIVERSIFIED RETAIL';
  static readonly DREDGING = 'DREDGING';
  static readonly DYES_AND_PIGMENTS = 'DYES AND PIGMENTS';
  static readonly EDIBLE_OIL = 'EDIBLE OIL';
  static readonly EDUCATION = 'EDUCATION';
  static readonly ELEARNING = 'E-LEARNING';
  static readonly ELECTRODES_REFRACTORIES = 'ELECTRODES & REFRACTORIES';
  static readonly ELECTRONIC_MEDIA = 'ELECTRONIC MEDIA';
  static readonly ECOMMERCE = 'E-RETAIL/ E-COMMERCE';
  static readonly EXCHANGE_PLATFORM = 'EXCHANGE AND DATA PLATFORM';
  static readonly EXPLOSIVES = 'EXPLOSIVES';
  static readonly FERRO_SILICA_MANGANESE = 'FERRO & SILICA MANGANESE';
  static readonly FERTILIZERS = 'FERTILIZERS';
  static readonly FILM_PRODUCTION = 'FILM PRODUCTION, DISTRIBUTION & EXHIBITION';
  static readonly FINANCIAL_INSTITUTION = 'FINANCIAL INSTITUTION';
  static readonly FINANCIAL_PRODUCTS = 'FINANCIAL PRODUCTS DISTRIBUTOR';
  static readonly FINTECH = 'FINANCIAL TECHNOLOGY (FINTECH)';
  static readonly FOOD_STORAGE = 'FOOD STORAGE FACILITIES';
  static readonly FOOTWEAR = 'FOOTWEAR';
  static readonly FOREST_PRODUCTS = 'FOREST PRODUCTS';
  static readonly FURNITURE_HOME_FURNISHING = 'FURNITURE, HOME FURNISHING';
  static readonly FURNITURE_HOME_FURNISHING_FLOORING = 'FURNITURE, HOME FURNISHING, FLOORING';
  static readonly GARMENTS_APPARELS = 'GARMENTS & APPARELS';
  static readonly GAS_TRANSMISSION = 'GAS TRANSMISSION/MARKETING';
  static readonly JEWELLERY = 'GEMS, JEWELLERY AND WATCHES';
  static readonly GENERAL_INSURANCE = 'GENERAL INSURANCE';
  static readonly GLASS_CONSUMER = 'GLASS - CONSUMER';
  static readonly GLASS_INDUSTRIAL = 'GLASS - INDUSTRIAL';
  static readonly GRANITES_MARBLES = 'GRANITES & MARBLES';
  static readonly HEALTHCARE = 'HEALTHCARE RESEARCH, ANALYTICS & TECHNOLOGY';
  static readonly HEALTHCARE_SERVICE = 'HEALTHCARE SERVICE PROVIDER';
  static readonly HEAVY_ELECTRICAL = 'HEAVY ELECTRICAL EQUIPMENT';
  static readonly HOLDING_COMPANY = 'HOLDING COMPANY';
  static readonly HOSPITAL = 'HOSPITAL';
  static readonly HOTELS_RESORTS = 'HOTELS & RESORTS';
  static readonly HOUSEHOLD_APPLIANCES = 'HOUSEHOLD APPLIANCES';
  static readonly HOUSEHOLD_PRODUCTS = 'HOUSEHOLD PRODUCTS';
  static readonly HOUSEWARE = 'HOUSEWARE';
  static readonly HOUSING_FINANCE_COMPANY = 'HOUSING FINANCE COMPANY';
  static readonly INDUSTRIAL_GASES = 'INDUSTRIAL GASES';
  static readonly INDUSTRIAL_MACHINERY = 'INDUSTRIAL MACHINERY';
  static readonly INDUSTRIAL_MINERALS = 'INDUSTRIAL MINERALS';
  static readonly INDUSTRIAL_PRODUCTS = 'INDUSTRIAL PRODUCTS';
  static readonly INTEGRATED_POWER_UTILITIES = 'INTEGRATED POWER UTILITIES';
  static readonly INTERNET_CATALOGUE_RETAIL = 'INTERNET & CATALOGUE RETAIL';
  static readonly INVESTMENT_COMPANY = 'INVESTMENT COMPANY';
  static readonly IRON_STEEL = 'IRON & STEEL';
  static readonly IRON_STEEL_PRODUCTS = 'IRON & STEEL PRODUCTS';
  static readonly IT_ENABLED_SERVICES = 'IT ENABLED SERVICES';
  static readonly JUTE_JUTE_PRODUCTS = 'JUTE & JUTE PRODUCTS';
  static readonly LEATHER_AND_LEATHER_PRODUCTS = 'LEATHER AND LEATHER PRODUCTS';
  static readonly LEISURE_PRODUCTS = 'LEISURE PRODUCTS';
  static readonly LIFE_INSURANCE = 'LIFE INSURANCE';
  static readonly LOGISTICS_SOLUTION_PROVIDER = 'LOGISTICS SOLUTION PROVIDER';
  static readonly LPG_CNG_PNG_LNG = 'LPG/CNG/PNG/LNG SUPPLIER';
  static readonly LUBRICANTS = 'LUBRICANTS';
  static readonly MEAT_PRODUCTS_INCLUDING_POULTRY = 'MEAT PRODUCTS INCLUDING POULTRY';
  static readonly MEDIA_ENTERTAINMENT = 'MEDIA & ENTERTAINMENT';
  static readonly MEDICAL_EQUIPMENT_SUPPLIES = 'MEDICAL EQUIPMENT & SUPPLIES';
  static readonly MICROFINANCE_INSTITUTIONS = 'MICROFINANCE INSTITUTIONS';
  static readonly MUTUAL_FUND = 'MUTUAL FUND SCHEME - ETF';
  static readonly NBFC = 'NON BANKING FINANCIAL COMPANY (NBFC)';
  static readonly OFFSHORE_DRILLING = 'OFFSHORE SUPPORT SOLUTION DRILLING';
  static readonly OIL_EQUIPMENT_SERVICES = 'OIL EQUIPMENT & SERVICES';
  static readonly OIL_EXPLORATION_PRODUCTION = 'OIL EXPLORATION & PRODUCTION';
  static readonly OIL_STORAGE_TRANSPORT = 'OIL STORAGE & TRANSPORTATION';
  static readonly OTHER_AGRICULTURAL_PRODUCTS = 'OTHER AGRICULTURAL PRODUCTS';
  static readonly OTHER_BANK = 'OTHER BANK';
  static readonly OTHER_BEVERAGES = 'OTHER BEVERAGES';
  static readonly OTHER_CAPITAL_MARKET_SERVICES = 'OTHER CAPITAL MARKET RELATED SERVICES';
  static readonly OTHER_CONSTRUCTION_MATERIALS = 'OTHER CONSTRUCTION MATERIALS';
  static readonly OTHER_CONSUMER_SERVICES = 'OTHER CONSUMER SERVICES';
  static readonly OTHER_ELECTRICAL_EQUIPMENT = 'OTHER ELECTRICAL EQUIPMENT';
  static readonly OTHER_FINANCIAL_SERVICES = 'OTHER FINANCIAL SERVICES';
  static readonly OTHER_FOOD_PRODUCTS = 'OTHER FOOD PRODUCTS';
  static readonly OTHER_INDUSTRIAL_PRODUCTS = 'OTHER INDUSTRIAL PRODUCTS';
  static readonly OTHER_TELECOM_SERVICES = 'OTHER TELECOM SERVICES';
  static readonly OTHER_TEXTILE_PRODUCTS = 'OTHER TEXTILE PRODUCTS';
  static readonly OTHER_UTILITIES = 'OTHER UTILITIES';
  static readonly PACKAGED_FOODS = 'PACKAGED FOODS';
  static readonly PACKAGING = 'PACKAGING';
  static readonly PAINTS = 'PAINTS';
  static readonly PAPER_PAPER_PRODUCTS = 'PAPER & PAPER PRODUCTS';
  static readonly PASSENGER_CARS_UTILITY_VEHICLES = 'PASSENGER CARS & UTILITY VEHICLES';
  static readonly PERSONAL_CARE = 'PERSONAL CARE';
  static readonly PESTICIDES_AGROCHEMICALS = 'PESTICIDES & AGROCHEMICALS';
  static readonly PETROCHEMICALS = 'PETROCHEMICALS';
  static readonly PHARMACEUTICALS = 'PHARMACEUTICALS';
  static readonly PHARMACY_RETAIL = 'PHARMACY RETAIL';
  static readonly PHOTOGRAPHIC_PRODUCTS = 'PHOTOGRAPHIC PRODUCTS';
  static readonly PIG_IRON = 'PIG IRON';
  static readonly PLASTIC_PRODUCTS_CONSUMER = 'PLASTIC PRODUCTS - CONSUMER';
  static readonly PLASTIC_PRODUCTS_INDUSTRIAL = 'PLASTIC PRODUCTS - INDUSTRIAL';
  static readonly PLYWOOD_BOARDS_LAMINATES = 'PLYWOOD BOARDS/ LAMINATES';
  static readonly PORT_SERVICES = 'PORT & PORT SERVICES';
  static readonly POWER_TRANSMISSION = 'POWER - TRANSMISSION';
  static readonly POWER_GENERATION = 'POWER GENERATION';
  static readonly POWER_TRADING = 'POWER TRADING';
  static readonly PRECIOUS_METALS = 'PRECIOUS METALS';
  static readonly PRINT_MEDIA = 'PRINT MEDIA';
  static readonly PRINTING_PUBLICATION = 'PRINTING & PUBLICATION';
  static readonly PRINTING_INKS = 'PRINTING INKS';
  static readonly PRIVATE_SECTOR_BANK = 'PRIVATE SECTOR BANK';
  static readonly PUBLIC_SECTOR_BANK = 'PUBLIC SECTOR BANK';
  static readonly RAILWAY_WANS = 'RAILWAY WANS';
  static readonly RATINGS = 'RATINGS';
  static readonly REITS = 'REAL ESTATE INVESTMENT TRUSTS (REITS)';
  static readonly REAL_ESTATE = 'REAL ESTATE RELATED SERVICES';
  static readonly REFINERIES_MARKETING = 'REFINERIES & MARKETING';
  static readonly RESIDENTIAL_COMMERCIAL_PROJECTS = 'RESIDENTIAL, COMMERCIAL PROJECTS';
  static readonly RESTAURANTS = 'RESTAURANTS';
  static readonly ROAD_ASSETS = 'ROAD ASSETS–TOLL, ANNUITY, HYBRID-ANNUITY';
  static readonly ROAD_TRANSPORT = 'ROAD TRANSPORT';
  static readonly RUBBER = 'RUBBER';
  static readonly SANITARY_WARE = 'SANITARY WARE';
  static readonly SEAFOOD = 'SEAFOOD';
  static readonly SHIP_BUILDING = 'SHIP BUILDING & ALLIED SERVICES';
  static readonly SHIPPING = 'SHIPPING';
  static readonly SOFTWARE_PRODUCTS = 'SOFTWARE PRODUCTS';
  static readonly SPECIALITY_RETAIL = 'SPECIALITY RETAIL';
  static readonly SPECIALTY_CHEMICALS = 'SPECIALTY CHEMICALS';
  static readonly SPONGE_IRON = 'SPONGE IRON';
  static readonly STATIONARY = 'STATIONARY';
  static readonly STOCKBROKING = 'STOCKBROKING & ALLIED';
  static readonly SUGAR = 'SUGAR';
  static readonly TEA_COFFEE = 'TEA & COFFEE';
  static readonly TELECOM_EQUIPMENT = 'TELECOM -  EQUIPMENT & ACCESSORIES';
  static readonly TELECOM_CELLULAR = 'TELECOM - CELLULAR & FIXED LINE SERVICES';
  static readonly TELECOM_INFRASTRUCTURE = 'TELECOM - INFRASTRUCTURE';
  static readonly TOUR_TRAVEL = 'TOUR, TRAVEL RELATED SERVICES';
  static readonly TRACTORS = 'TRACTORS';
  static readonly TRADING_AUTO_COMPONENTS = 'TRADING - AUTO COMPONENTS';
  static readonly TRADING_CHEMICALS = 'TRADING - CHEMICALS';
  static readonly TRADING_GAS = 'TRADING - GAS';
  static readonly TRADING_METALS = 'TRADING - METALS';
  static readonly TRADING_MINERALS = 'TRADING - MINERALS';
  static readonly TRADING_TEXTILE = 'TRADING - TEXTILE PRODUCTS';
  static readonly TRADING_DISTRIBUTORS = 'TRADING & DISTRIBUTORS';
  static readonly TRADING_COAL = 'TRADING COAL';
  static readonly TRANSPORT_RELATED_SERVICES = 'TRANSPORT RELATED SERVICES';
  static readonly TV_BROADCASTING = 'TV BROADCASTING & SOFTWARE PRODUCTION';
  static readonly TYRES_RUBBER = 'TYRES & RUBBER PRODUCTS';
  static readonly WASTE_MANAGEMENT = 'WASTE MANAGEMENT';
  static readonly WATER_SUPPLY = 'WATER SUPPLY & MANAGEMENT';
  static readonly WELLNESS = 'WELLNESS';
  static readonly ZINC = 'ZINC';
}