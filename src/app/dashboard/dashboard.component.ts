

import {
  Component,
  OnInit,
  OnDestroy,
  NgZone,
  ViewChild,
  DoCheck,
} from '@angular/core';
import COUNTRY_CODES from "../shared/countries"
import STATE_CODES from "../shared/states"

import { combineLatest } from 'rxjs';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

import * as am4maps from "@amcharts/amcharts4/maps";
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";

import {
  GetdataService
} from "../services/getdata.service";
import * as Fuse from 'fuse.js'
import {
  PerfectScrollbarComponent
} from 'ngx-perfect-scrollbar';
import {
  isUndefined
} from 'util';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { trigger, transition, animate, style, state } from '@angular/animations'
import { TranslateService } from '@ngx-translate/core';
//am4core.useTheme(am4themes_dataviz);
am4core.useTheme(am4themes_animated);

const countries = {
  "AD": {
    "country": "Andorra",
    "continent_code": "EU",
    "continent": "Europe",
    "maps": ["andorraLow", "andorraHigh"]
  },
  "AE": {
    "country": "United Arab Emirates",
    "continent_code": "AS",
    "continent": "Asia",
    "maps": ["uaeLow", "uaeHigh"]
  },
  "AF": {
    "country": "Afghanistan",
    "continent_code": "AS",
    "continent": "Asia",
    "maps": []
  },
  "AG": {
    "country": "Antigua and Barbuda",
    "continent_code": "NA",
    "continent": "North America",
    "maps": ["antiguaBarbudaLow", "antiguaBarbudaHigh"]
  },
  "AI": {
    "country": "Anguilla",
    "continent_code": "NA",
    "continent": "North America",
    "maps": ["anguillaLow", "anguillaHigh"]
  },
  "AL": {
    "country": "Albania",
    "continent_code": "EU",
    "continent": "Europe",
    "maps": ["albaniaLow", "albaniaHigh"]
  },
  "AM": {
    "country": "Armenia",
    "continent_code": "EU",
    "continent": "Europe",
    "maps": ["armeniaLow", "armeniaHigh"]
  },
  "AO": {
    "country": "Angola",
    "continent_code": "AF",
    "continent": "Africa",
    "maps": ["angolaLow", "angolaHigh"]
  },
  "AQ": {
    "country": "Antarctica",
    "continent_code": "AN",
    "continent": "Antarctica",
    "maps": []
  },
  "AR": {
    "country": "Argentina",
    "continent_code": "SA",
    "continent": "South America",
    "maps": ["argentinaLow", "argentinaHigh"]
  },
  "AS": {
    "country": "American Samoa",
    "continent_code": "OC",
    "continent": "Oceania",
    "maps": ["americanSamoaLow", "americanSamoaHigh"]
  },
  "AT": {
    "country": "Austria",
    "continent_code": "EU",
    "continent": "Europe",
    "maps": ["austriaLow", "austriaHigh"]
  },
  "AU": {
    "country": "Australia",
    "continent_code": "OC",
    "continent": "Oceania",
    "maps": ["australiaLow", "australiaHigh"]
  },
  "AW": {
    "country": "Aruba",
    "continent_code": "NA",
    "continent": "North America",
    "maps": ["arubaLow", "arubaHigh"]
  },
  "AX": {
    "country": "Aland Islands",
    "continent_code": "EU",
    "continent": "Europe",
    "maps": []
  },
  "AZ": {
    "country": "Azerbaijan",
    "continent_code": "EU",
    "continent": "Europe",
    "maps": ["azerbaijanLow", "azerbaijanHigh"]
  },
  "BA": {
    "country": "Bosnia and Herzegovina",
    "continent_code": "EU",
    "continent": "Europe",
    "maps": ["bosniaHerzegovinaLow", "bosniaHerzegovinaHigh", "bosniaHerzegovinaCantonsLow", "bosniaHerzegovinaCantonsHigh"]
  },
  "BB": {
    "country": "Barbados",
    "continent_code": "NA",
    "continent": "North America",
    "maps": ["barbadosLow", "barbadosHigh"]
  },
  "BD": {
    "country": "Bangladesh",
    "continent_code": "AS",
    "continent": "Asia",
    "maps": ["bangladeshLow", "bangladeshHigh"]
  },
  "BE": {
    "country": "Belgium",
    "continent_code": "EU",
    "continent": "Europe",
    "maps": ["belgiumLow", "belgiumHigh"]
  },
  "BF": {
    "country": "Burkina Faso",
    "continent_code": "AF",
    "continent": "Africa",
    "maps": ["burkinaFasoLow", "burkinaFasoHigh"]
  },
  "BG": {
    "country": "Bulgaria",
    "continent_code": "EU",
    "continent": "Europe",
    "maps": ["bulgariaLow", "bulgariaHigh"]
  },
  "BH": {
    "country": "Bahrain",
    "continent_code": "AS",
    "continent": "Asia",
    "maps": ["bahrainLow", "bahrainHigh"]
  },
  "BI": {
    "country": "Burundi",
    "continent_code": "AF",
    "continent": "Africa",
    "maps": ["burundiLow", "burundiHigh"]
  },
  "BJ": {
    "country": "Benin",
    "continent_code": "AF",
    "continent": "Africa",
    "maps": ["beninLow", "beninHigh"]
  },
  "BL": {
    "country": "Saint Barthelemy",
    "continent_code": "NA",
    "continent": "North America",
    "maps": []
  },
  "BM": {
    "country": "Bermuda",
    "continent_code": "NA",
    "continent": "North America",
    "maps": ["bermudaLow", "bermudaHigh"]
  },
  "BN": {
    "country": "Brunei Darussalam",
    "continent_code": "AS",
    "continent": "Asia",
    "maps": ["bruneiDarussalamLow", "bruneiDarussalamHigh"]
  },
  "BO": {
    "country": "Bolivia, Plurinational State of",
    "continent_code": "SA",
    "continent": "South America",
    "maps": ["boliviaLow", "boliviaHigh"]
  },
  "BQ": {
    "country": "Bonaire, Sint Eustatius and Saba",
    "continent_code": "NA",
    "continent": "North America",
    "maps": ["bonaireSintEustatiusSabaLow", "bonaireSintEustatiusSabaHigh"]
  },
  "BR": {
    "country": "Brazil",
    "continent_code": "SA",
    "continent": "South America",
    "maps": ["brazilLow", "brazilHigh"]
  },
  "BS": {
    "country": "Bahamas",
    "continent_code": "NA",
    "continent": "North America",
    "maps": []
  },
  "BT": {
    "country": "Bhutan",
    "continent_code": "AS",
    "continent": "Asia",
    "maps": ["bhutanLow", "bhutanHigh"]
  },
  "BV": {
    "country": "Bouvet Island",
    "continent_code": "AN",
    "continent": "Antarctica",
    "maps": []
  },
  "BW": {
    "country": "Botswana",
    "continent_code": "AF",
    "continent": "Africa",
    "maps": ["botswanaLow", "botswanaHigh"]
  },
  "BY": {
    "country": "Belarus",
    "continent_code": "EU",
    "continent": "Europe",
    "maps": ["belarusLow", "belarusHigh"]
  },
  "BZ": {
    "country": "Belize",
    "continent_code": "NA",
    "continent": "North America",
    "maps": ["belizeLow", "belizeHigh"]
  },
  "CA": {
    "country": "Canada",
    "continent_code": "NA",
    "continent": "North America",
    "maps": ["canadaLow", "canadaHigh"]
  },
  "CC": {
    "country": "Cocos (Keeling) Islands",
    "continent_code": "AS",
    "continent": "Asia",
    "maps": []
  },
  "CD": {
    "country": "Congo, the Democratic Republic of the",
    "continent_code": "AF",
    "continent": "Africa",
    "maps": ["congoDRLow", "congoDRHigh"]
  },
  "CF": {
    "country": "Central African Republic",
    "continent_code": "AF",
    "continent": "Africa",
    "maps": ["centralAfricanRepublicLow", "centralAfricanRepublicHigh"]
  },
  "CG": {
    "country": "Congo",
    "continent_code": "AF",
    "continent": "Africa",
    "maps": ["congoLow", "congoHigh"]
  },
  "CH": {
    "country": "Switzerland",
    "continent_code": "EU",
    "continent": "Europe",
    "maps": ["switzerlandLow", "switzerlandHigh"]
  },
  "CI": {
    "country": "Cote d'Ivoire",
    "continent_code": "AF",
    "continent": "Africa",
    "maps": []
  },
  "CK": {
    "country": "Cook Islands",
    "continent_code": "OC",
    "continent": "Oceania",
    "maps": []
  },
  "CL": {
    "country": "Chile",
    "continent_code": "SA",
    "continent": "South America",
    "maps": ["chileLow", "chileHigh"]
  },
  "CM": {
    "country": "Cameroon",
    "continent_code": "AF",
    "continent": "Africa",
    "maps": ["cameroonLow", "cameroonHigh"]
  },
  "CN": {
    "country": "China",
    "continent_code": "AS",
    "continent": "Asia",
    "maps": ["chinaLow", "chinaHigh"]
  },
  "CO": {
    "country": "Colombia",
    "continent_code": "SA",
    "continent": "South America",
    "maps": ["colombiaLow", "colombiaHigh", "colombiaMuniLow", "colombiaMuniHigh"]
  },
  "CR": {
    "country": "Costa Rica",
    "continent_code": "NA",
    "continent": "North America",
    "maps": ["costaRicaLow", "costaRicaHigh"]
  },
  "CU": {
    "country": "Cuba",
    "continent_code": "NA",
    "continent": "North America",
    "maps": []
  },
  "CV": {
    "country": "Cape Verde",
    "continent_code": "AF",
    "continent": "Africa",
    "maps": ["capeVerdeLow", "capeVerdeHigh"]
  },
  "CW": {
    "country": "Curacao",
    "continent_code": "NA",
    "continent": "North America",
    "maps": ["curacaoLow", "curacaoHigh"]
  },
  "CX": {
    "country": "Christmas Island",
    "continent_code": "AS",
    "continent": "Asia",
    "maps": []
  },
  "CY": {
    "country": "Cyprus",
    "continent_code": "EU",
    "continent": "Europe",
    "maps": ["cyprusLow", "cyprusHigh", "cyprusNorthCyprusLow", "cyprusNorthCyprusHigh"]
  },
  "CZ": {
    "country": "Czech Republic",
    "continent_code": "EU",
    "continent": "Europe",
    "maps": ["czechiaLow", "czechiaHigh"]
  },
  "DE": {
    "country": "Germany",
    "continent_code": "EU",
    "continent": "Europe",
    "maps": ["germanyLow", "germanyHigh"]
  },
  "DJ": {
    "country": "Djibouti",
    "continent_code": "AF",
    "continent": "Africa",
    "maps": ["djiboutiLow", "djiboutiHigh"]
  },
  "DK": {
    "country": "Denmark",
    "continent_code": "EU",
    "continent": "Europe",
    "maps": ["denmarkLow", "denmarkHigh"]
  },
  "DM": {
    "country": "Dominica",
    "continent_code": "NA",
    "continent": "North America",
    "maps": ["dominicaLow", "dominicaHigh"]
  },
  "DO": {
    "country": "Dominican Republic",
    "continent_code": "NA",
    "continent": "North America",
    "maps": ["dominicanRepublicLow", "dominicanRepublicHigh", "dominicanRepublicMuniLow", "dominicanRepublicMuniHigh"]
  },
  "DZ": {
    "country": "Algeria",
    "continent_code": "AF",
    "continent": "Africa",
    "maps": ["algeriaLow", "algeriaHigh"]
  },
  "EC": {
    "country": "Ecuador",
    "continent_code": "SA",
    "continent": "South America",
    "maps": ["ecuadorLow", "ecuadorHigh"]
  },
  "EE": {
    "country": "Estonia",
    "continent_code": "EU",
    "continent": "Europe",
    "maps": ["estoniaLow", "estoniaHigh"]
  },
  "EG": {
    "country": "Egypt",
    "continent_code": "AF",
    "continent": "Africa",
    "maps": ["egyptLow", "egyptHigh"]
  },
  "EH": {
    "country": "Western Sahara",
    "continent_code": "AF",
    "continent": "Africa",
    "maps": []
  },
  "ER": {
    "country": "Eritrea",
    "continent_code": "AF",
    "continent": "Africa",
    "maps": []
  },
  "ES": {
    "country": "Spain",
    "continent_code": "EU",
    "continent": "Europe",
    "maps": ["spainLow", "spainHigh", "spainProvincesLow", "spainProvincesHigh"]
  },
  "ET": {
    "country": "Ethiopia",
    "continent_code": "AF",
    "continent": "Africa",
    "maps": []
  },
  "FI": {
    "country": "Finland",
    "continent_code": "EU",
    "continent": "Europe",
    "maps": ["finlandLow", "finlandHigh"]
  },
  "FJ": {
    "country": "Fiji",
    "continent_code": "OC",
    "continent": "Oceania",
    "maps": ["fijiEastLow", "fijiEastHigh", "fijiWestLow", "fijiWestHigh"]
  },
  "FK": {
    "country": "Falkland Islands (Malvinas)",
    "continent_code": "SA",
    "continent": "South America",
    "maps": []
  },
  "FM": {
    "country": "Micronesia, Federated States of",
    "continent_code": "OC",
    "continent": "Oceania",
    "maps": []
  },
  "FO": {
    "country": "Faroe Islands",
    "continent_code": "EU",
    "continent": "Europe",
    "maps": ["faroeIslandsLow", "faroeIslandsHigh"]
  },
  "FR": {
    "country": "France",
    "continent_code": "EU",
    "continent": "Europe",
    "maps": ["franceLow", "franceHigh", "franceDepartmentsLow", "franceDepartmentsHigh"]
  },
  "GA": {
    "country": "Gabon",
    "continent_code": "AF",
    "continent": "Africa",
    "maps": ["gabonLow", "gabonHigh"]
  },
  "GB": {
    "country": "United Kingdom",
    "continent_code": "EU",
    "continent": "Europe",
    "maps": ["ukLow", "ukHigh", "ukCountiesLow", "ukCountiesHigh"]
  },
  "GB-CHA": {
    "country": "Channel Islands",
    "continent_code": "EU",
    "continent": "Europe",
    "maps": ["channelIslandsLow", "channelIslandsHigh"]
  },
  "GD": {
    "country": "Grenada",
    "continent_code": "NA",
    "continent": "North America",
    "maps": []
  },
  "GE": {
    "country": "Georgia",
    "continent_code": "EU",
    "continent": "Europe",
    "maps": ["georgiaLow", "georgiaHigh", "georgiaSouthOssetiaLow", "georgiaSouthOssetiaHigh"]
  },
  "GF": {
    "country": "French Guiana",
    "continent_code": "SA",
    "continent": "South America",
    "maps": ["frenchGuianaLow", "frenchGuianaHigh"]
  },
  "GG": {
    "country": "Guernsey",
    "continent_code": "EU",
    "continent": "Europe",
    "maps": []
  },
  "GH": {
    "country": "Ghana",
    "continent_code": "AF",
    "continent": "Africa",
    "maps": []
  },
  "GI": {
    "country": "Gibraltar",
    "continent_code": "EU",
    "continent": "Europe",
    "maps": []
  },
  "GL": {
    "country": "Greenland",
    "continent_code": "NA",
    "continent": "North America",
    "maps": ["greenlandLow", "greenlandHigh"]
  },
  "GM": {
    "country": "Gambia",
    "continent_code": "AF",
    "continent": "Africa",
    "maps": []
  },
  "GN": {
    "country": "Guinea",
    "continent_code": "AF",
    "continent": "Africa",
    "maps": ["guineaLow", "guineaHigh"]
  },
  "GP": {
    "country": "Guadeloupe",
    "continent_code": "NA",
    "continent": "North America",
    "maps": []
  },
  "GQ": {
    "country": "Equatorial Guinea",
    "continent_code": "AF",
    "continent": "Africa",
    "maps": ["equatorialGuineaLow", "equatorialGuineaHigh"]
  },
  "GR": {
    "country": "Greece",
    "continent_code": "EU",
    "continent": "Europe",
    "maps": ["greeceLow", "greeceHigh"]
  },
  "GS": {
    "country": "South Georgia and the South Sandwich Islands",
    "continent_code": "AN",
    "continent": "Antarctica",
    "maps": []
  },
  "GT": {
    "country": "Guatemala",
    "continent_code": "NA",
    "continent": "North America",
    "maps": []
  },
  "GU": {
    "country": "Guam",
    "continent_code": "OC",
    "continent": "Oceania",
    "maps": []
  },
  "GW": {
    "country": "Guinea-Bissau",
    "continent_code": "AF",
    "continent": "Africa",
    "maps": []
  },
  "GY": {
    "country": "Guyana",
    "continent_code": "SA",
    "continent": "South America",
    "maps": []
  },
  "HK": {
    "country": "Hong Kong",
    "continent_code": "AS",
    "continent": "Asia",
    "maps": ["hongKongLow", "hongKongHigh"]
  },
  "HM": {
    "country": "Heard Island and McDonald Islands",
    "continent_code": "AN",
    "continent": "Antarctica",
    "maps": []
  },
  "HN": {
    "country": "Honduras",
    "continent_code": "NA",
    "continent": "North America",
    "maps": ["hondurasLow", "hondurasHigh"]
  },
  "HR": {
    "country": "Croatia",
    "continent_code": "EU",
    "continent": "Europe",
    "maps": ["croatiaLow", "croatiaHigh"]
  },
  "HT": {
    "country": "Haiti",
    "continent_code": "NA",
    "continent": "North America",
    "maps": []
  },
  "HU": {
    "country": "Hungary",
    "continent_code": "EU",
    "continent": "Europe",
    "maps": ["hungaryLow", "hungaryHigh"]
  },
  "ID": {
    "country": "Indonesia",
    "continent_code": "AS",
    "continent": "Asia",
    "maps": ["indonesiaLow", "indonesiaHigh"]
  },
  "IE": {
    "country": "Ireland",
    "continent_code": "EU",
    "continent": "Europe",
    "maps": ["irelandLow", "irelandHigh"]
  },
  "IL": {
    "country": "Israel",
    "continent_code": "AS",
    "continent": "Asia",
    "maps": ["israelLow", "israelHigh", "israelPalestineLow", "israelPalestineHigh"]
  },
  "IM": {
    "country": "Isle of Man",
    "continent_code": "EU",
    "continent": "Europe",
    "maps": []
  },
  "IN": {
    "country": "India",
    "continent_code": "AS",
    "continent": "Asia",
    "maps": ["indiaLow", "indiaHigh"]
  },
  "IO": {
    "country": "British Indian Ocean Territory",
    "continent_code": "AS",
    "continent": "Asia",
    "maps": []
  },
  "IQ": {
    "country": "Iraq",
    "continent_code": "AS",
    "continent": "Asia",
    "maps": []
  },
  "IR": {
    "country": "Iran, Islamic Republic of",
    "continent_code": "AS",
    "continent": "Asia",
    "maps": []
  },
  "IS": {
    "country": "Iceland",
    "continent_code": "EU",
    "continent": "Europe",
    "maps": ["icelandLow", "icelandHigh"]
  },
  "IT": {
    "country": "Italy",
    "continent_code": "EU",
    "continent": "Europe",
    "maps": ["italyLow", "italyHigh"]
  },
  "JE": {
    "country": "Jersey",
    "continent_code": "EU",
    "continent": "Europe",
    "maps": []
  },
  "JM": {
    "country": "Jamaica",
    "continent_code": "NA",
    "continent": "North America",
    "maps": []
  },
  "JO": {
    "country": "Jordan",
    "continent_code": "AS",
    "continent": "Asia",
    "maps": []
  },
  "JP": {
    "country": "Japan",
    "continent_code": "AS",
    "continent": "Asia",
    "maps": ["japanLow", "japanHigh"]
  },
  "KE": {
    "country": "Kenya",
    "continent_code": "AF",
    "continent": "Africa",
    "maps": ["kenyaLow", "kenyaHigh"]
  },
  "KG": {
    "country": "Kyrgyzstan",
    "continent_code": "AS",
    "continent": "Asia",
    "maps": ["kyrgyzstanLow", "kyrgyzstanHigh"]
  },
  "KH": {
    "country": "Cambodia",
    "continent_code": "AS",
    "continent": "Asia",
    "maps": ["cambodiaLow", "cambodiaHigh"]
  },
  "KI": {
    "country": "Kiribati",
    "continent_code": "OC",
    "continent": "Oceania",
    "maps": []
  },
  "KM": {
    "country": "Comoros",
    "continent_code": "AF",
    "continent": "Africa",
    "maps": []
  },
  "KN": {
    "country": "Saint Kitts and Nevis",
    "continent_code": "NA",
    "continent": "North America",
    "maps": []
  },
  "KP": {
    "country": "Korea, Democratic People's Republic of",
    "continent_code": "AS",
    "continent": "Asia",
    "maps": ["northKoreaLow", "northKoreaHigh"]
  },
  "KR": {
    "country": "Korea, Republic of",
    "continent_code": "AS",
    "continent": "Asia",
    "maps": ["southKoreaLow", "southKoreaHigh"]
  },
  "KT": {
    "country": "Saint Kitts and Nevis",
    "continent_code": "AS",
    "continent": "Asia",
    "maps": ["stKittsNevisLow", "stKittsNevisHigh"]
  },
  "KW": {
    "country": "Kuwait",
    "continent_code": "AS",
    "continent": "Asia",
    "maps": []
  },
  "KY": {
    "country": "Cayman Islands",
    "continent_code": "NA",
    "continent": "North America",
    "maps": []
  },
  "KZ": {
    "country": "Kazakhstan",
    "continent_code": "EU",
    "continent": "Europe",
    "maps": ["kazakhstanLow", "kazakhstanHigh"]
  },
  "LA": {
    "country": "Lao People's Democratic Republic",
    "continent_code": "AS",
    "continent": "Asia",
    "maps": []
  },
  "LB": {
    "country": "Lebanon",
    "continent_code": "AS",
    "continent": "Asia",
    "maps": []
  },
  "LC": {
    "country": "Saint Lucia",
    "continent_code": "NA",
    "continent": "North America",
    "maps": ["saintLuciaLow", "saintLuciaHigh"]
  },
  "LI": {
    "country": "Liechtenstein",
    "continent_code": "EU",
    "continent": "Europe",
    "maps": ["liechtensteinLow", "liechtensteinHigh"]
  },
  "LK": {
    "country": "Sri Lanka",
    "continent_code": "AS",
    "continent": "Asia",
    "maps": ["sriLankaLow", "sriLankaHigh"]
  },
  "LR": {
    "country": "Liberia",
    "continent_code": "AF",
    "continent": "Africa",
    "maps": []
  },
  "LS": {
    "country": "Lesotho",
    "continent_code": "AF",
    "continent": "Africa",
    "maps": []
  },
  "LT": {
    "country": "Lithuania",
    "continent_code": "EU",
    "continent": "Europe",
    "maps": ["lithuaniaLow", "lithuaniaHigh"]
  },
  "LU": {
    "country": "Luxembourg",
    "continent_code": "EU",
    "continent": "Europe",
    "maps": []
  },
  "LV": {
    "country": "Latvia",
    "continent_code": "EU",
    "continent": "Europe",
    "maps": ["latviaLow", "latviaHigh"]
  },
  "LY": {
    "country": "Libya",
    "continent_code": "AF",
    "continent": "Africa",
    "maps": []
  },
  "MA": {
    "country": "Morocco",
    "continent_code": "AF",
    "continent": "Africa",
    "maps": ["moroccoLow", "moroccoHigh"]
  },
  "MC": {
    "country": "Monaco",
    "continent_code": "EU",
    "continent": "Europe",
    "maps": []
  },
  "MD": {
    "country": "Moldova, Republic of",
    "continent_code": "EU",
    "continent": "Europe",
    "maps": ["moldovaLow", "moldovaHigh"]
  },
  "ME": {
    "country": "Montenegro",
    "continent_code": "EU",
    "continent": "Europe",
    "maps": []
  },
  "MF": {
    "country": "Saint Martin (French Part)",
    "continent_code": "NA",
    "continent": "North America",
    "maps": []
  },
  "MG": {
    "country": "Madagascar",
    "continent_code": "AF",
    "continent": "Africa",
    "maps": []
  },
  "MH": {
    "country": "Marshall Islands",
    "continent_code": "OC",
    "continent": "Oceania",
    "maps": []
  },
  "MK": {
    "country": "North Macedonia",
    "continent_code": "EU",
    "continent": "Europe",
    "maps": []
  },
  "ML": {
    "country": "Mali",
    "continent_code": "AF",
    "continent": "Africa",
    "maps": ["maliLow", "maliHigh"]
  },
  "MM": {
    "country": "Myanmar",
    "continent_code": "AS",
    "continent": "Asia",
    "maps": []
  },
  "MN": {
    "country": "Mongolia",
    "continent_code": "AS",
    "continent": "Asia",
    "maps": ["mongoliaLow", "mongoliaHigh"]
  },
  "MO": {
    "country": "Macao",
    "continent_code": "AS",
    "continent": "Asia",
    "maps": []
  },
  "MP": {
    "country": "Northern Mariana Islands",
    "continent_code": "OC",
    "continent": "Oceania",
    "maps": []
  },
  "MQ": {
    "country": "Martinique",
    "continent_code": "NA",
    "continent": "North America",
    "maps": []
  },
  "MR": {
    "country": "Mauritania",
    "continent_code": "AF",
    "continent": "Africa",
    "maps": []
  },
  "MS": {
    "country": "Montserrat",
    "continent_code": "NA",
    "continent": "North America",
    "maps": []
  },
  "MT": {
    "country": "Malta",
    "continent_code": "EU",
    "continent": "Europe",
    "maps": ["maltaLow", "maltaHigh"]
  },
  "MU": {
    "country": "Mauritius",
    "continent_code": "AF",
    "continent": "Africa",
    "maps": []
  },
  "MV": {
    "country": "Maldives",
    "continent_code": "AS",
    "continent": "Asia",
    "maps": ["maldivesLow", "maldivesHigh", "maldivesIslandsLow", "maldivesIslandsHigh"]
  },
  "MW": {
    "country": "Malawi",
    "continent_code": "AF",
    "continent": "Africa",
    "maps": []
  },
  "MX": {
    "country": "Mexico",
    "continent_code": "NA",
    "continent": "North America",
    "maps": ["mexicoLow", "mexicoHigh"]
  },
  "MY": {
    "country": "Malaysia",
    "continent_code": "AS",
    "continent": "Asia",
    "maps": ["malaysiaLow", "malaysiaHigh"]
  },
  "MZ": {
    "country": "Mozambique",
    "continent_code": "AF",
    "continent": "Africa",
    "maps": []
  },
  "NA": {
    "country": "Namibia",
    "continent_code": "AF",
    "continent": "Africa",
    "maps": ["namibiaLow", "namibiaHigh"]
  },
  "NC": {
    "country": "New Caledonia",
    "continent_code": "OC",
    "continent": "Oceania",
    "maps": []
  },
  "NE": {
    "country": "Niger",
    "continent_code": "AF",
    "continent": "Africa",
    "maps": []
  },
  "NF": {
    "country": "Norfolk Island",
    "continent_code": "OC",
    "continent": "Oceania",
    "maps": []
  },
  "NG": {
    "country": "Nigeria",
    "continent_code": "AF",
    "continent": "Africa",
    "maps": ["nigeriaLow", "nigeriaHigh"]
  },
  "NI": {
    "country": "Nicaragua",
    "continent_code": "NA",
    "continent": "North America",
    "maps": ["nicaraguaLow", "nicaraguaHigh"]
  },
  "NL": {
    "country": "Netherlands",
    "continent_code": "EU",
    "continent": "Europe",
    "maps": ["netherlandsLow", "netherlandsHigh"]
  },
  "NO": {
    "country": "Norway",
    "continent_code": "EU",
    "continent": "Europe",
    "maps": ["norwayLow", "norwayHigh"]
  },
  "NP": {
    "country": "Nepal",
    "continent_code": "AS",
    "continent": "Asia",
    "maps": ["nepalLow", "nepalHigh"]
  },
  "NR": {
    "country": "Nauru",
    "continent_code": "OC",
    "continent": "Oceania",
    "maps": []
  },
  "NU": {
    "country": "Niue",
    "continent_code": "OC",
    "continent": "Oceania",
    "maps": []
  },
  "NZ": {
    "country": "New Zealand",
    "continent_code": "OC",
    "continent": "Oceania",
    "maps": ["newZealandLow", "newZealandHigh"]
  },
  "OM": {
    "country": "Oman",
    "continent_code": "AS",
    "continent": "Asia",
    "maps": ["omanLow", "omanHigh"]
  },
  "PA": {
    "country": "Panama",
    "continent_code": "NA",
    "continent": "North America",
    "maps": ["panamaLow", "panamaHigh"]
  },
  "PE": {
    "country": "Peru",
    "continent_code": "SA",
    "continent": "South America",
    "maps": ["peruLow", "peruHigh"]
  },
  "PF": {
    "country": "French Polynesia",
    "continent_code": "OC",
    "continent": "Oceania",
    "maps": []
  },
  "PG": {
    "country": "Papua New Guinea",
    "continent_code": "OC",
    "continent": "Oceania",
    "maps": []
  },
  "PH": {
    "country": "Philippines",
    "continent_code": "AS",
    "continent": "Asia",
    "maps": ["philippinesLow", "philippinesHigh"]
  },
  "PK": {
    "country": "Pakistan",
    "continent_code": "AS",
    "continent": "Asia",
    "maps": ["pakistanLow", "pakistanHigh"]
  },
  "PL": {
    "country": "Poland",
    "continent_code": "EU",
    "continent": "Europe",
    "maps": ["polandLow", "polandHigh"]
  },
  "PM": {
    "country": "Saint Pierre and Miquelon",
    "continent_code": "NA",
    "continent": "North America",
    "maps": ["stPierreMiquelonLow", "stPierreMiquelonHigh"]
  },
  "PN": {
    "country": "Pitcairn",
    "continent_code": "OC",
    "continent": "Oceania",
    "maps": []
  },
  "PR": {
    "country": "Puerto Rico",
    "continent_code": "NA",
    "continent": "North America",
    "maps": ["puertoRicoLow", "puertoRicoHigh"]
  },
  "PS": {
    "country": "Palestinian, State of",
    "continent_code": "AS",
    "continent": "Asia",
    "maps": ["palestineLow", "palestineHigh"]
  },
  "PT": {
    "country": "Portugal",
    "continent_code": "EU",
    "continent": "Europe",
    "maps": ["portugalLow", "portugalHigh", "portugalRegionsLow", "portugalRegionsHigh"]
  },
  "PW": {
    "country": "Palau",
    "continent_code": "OC",
    "continent": "Oceania",
    "maps": []
  },
  "PY": {
    "country": "Paraguay",
    "continent_code": "SA",
    "continent": "South America",
    "maps": ["paraguayLow", "paraguayHigh"]
  },
  "QA": {
    "country": "Qatar",
    "continent_code": "AS",
    "continent": "Asia",
    "maps": ["qatarLow", "qatarHigh"]
  },
  "RE": {
    "country": "Reunion",
    "continent_code": "AF",
    "continent": "Africa",
    "maps": []
  },
  "RO": {
    "country": "Romania",
    "continent_code": "EU",
    "continent": "Europe",
    "maps": ["romaniaLow", "romaniaHigh"]
  },
  "RS": {
    "country": "Serbia",
    "continent_code": "EU",
    "continent": "Europe",
    "maps": ["serbiaLow", "serbiaHigh", "serbiaNoKosovoLow", "serbiaNoKosovoHigh"]
  },
  "RU": {
    "country": "Russian Federation",
    "continent_code": "EU",
    "continent": "Europe",
    "maps": ["russiaLow", "russiaHigh", "russiaCrimeaLow", "russiaCrimeaHigh"]
  },
  "RW": {
    "country": "Rwanda",
    "continent_code": "AF",
    "continent": "Africa",
    "maps": []
  },
  "SA": {
    "country": "Saudi Arabia",
    "continent_code": "AS",
    "continent": "Asia",
    "maps": ["saudiArabiaLow", "saudiArabiaHigh"]
  },
  "SB": {
    "country": "Solomon Islands",
    "continent_code": "OC",
    "continent": "Oceania",
    "maps": ["solomonIslandsLow", "solomonIslandsHigh"]
  },
  "SC": {
    "country": "Seychelles",
    "continent_code": "AF",
    "continent": "Africa",
    "maps": ["seychellesLow", "seychellesHigh"]
  },
  "SD": {
    "country": "Sudan",
    "continent_code": "AF",
    "continent": "Africa",
    "maps": ["sudanLow", "sudanHigh"]
  },
  "SE": {
    "country": "Sweden",
    "continent_code": "EU",
    "continent": "Europe",
    "maps": ["swedenLow", "swedenHigh"]
  },
  "SG": {
    "country": "Singapore",
    "continent_code": "AS",
    "continent": "Asia",
    "maps": ["singaporeLow", "singaporeHigh"]
  },
  "SH": {
    "country": "Saint Helena, Ascension and Tristan da Cunha",
    "continent_code": "AF",
    "continent": "Africa",
    "maps": ["saintHelenaLow", "saintHelenaHigh"]
  },
  "SI": {
    "country": "Slovenia",
    "continent_code": "EU",
    "continent": "Europe",
    "maps": ["sloveniaLow", "sloveniaHigh", "sloveniaRegionsLow", "sloveniaRegionsHigh"]
  },
  "SJ": {
    "country": "Svalbard and Jan Mayen",
    "continent_code": "EU",
    "continent": "Europe",
    "maps": ["svalbardLow", "svalbardHigh"]
  },
  "SK": {
    "country": "Slovakia",
    "continent_code": "EU",
    "continent": "Europe",
    "maps": ["slovakiaLow", "slovakiaHigh"]
  },
  "SL": {
    "country": "Sierra Leone",
    "continent_code": "AF",
    "continent": "Africa",
    "maps": []
  },
  "SM": {
    "country": "San Marino",
    "continent_code": "EU",
    "continent": "Europe",
    "maps": ["sanMarinoLow", "sanMarinoHigh"]
  },
  "SN": {
    "country": "Senegal",
    "continent_code": "AF",
    "continent": "Africa",
    "maps": ["senegalLow", "senegalHigh"]
  },
  "SO": {
    "country": "Somalia",
    "continent_code": "AF",
    "continent": "Africa",
    "maps": ["somaliaLow", "somaliaHigh"]
  },
  "SR": {
    "country": "Suriname",
    "continent_code": "SA",
    "continent": "South America",
    "maps": []
  },
  "SS": {
    "country": "South Sudan",
    "continent_code": "AF",
    "continent": "Africa",
    "maps": []
  },
  "ST": {
    "country": "Sao Tome and Principe",
    "continent_code": "AF",
    "continent": "Africa",
    "maps": ["saoTomePrincipeLow", "saoTomePrincipeHigh"]
  },
  "SV": {
    "country": "El Salvador",
    "continent_code": "NA",
    "continent": "North America",
    "maps": ["elSalvadorLow", "elSalvadorHigh"]
  },
  "SX": {
    "country": "Sint Maarten (Dutch Part)",
    "continent_code": "NA",
    "continent": "North America",
    "maps": []
  },
  "SY": {
    "country": "Syrian Arab Republic",
    "continent_code": "AS",
    "continent": "Asia",
    "maps": ["syriaLow", "syriaHigh"]
  },
  "SZ": {
    "country": "Swaziland",
    "continent_code": "AF",
    "continent": "Africa",
    "maps": ["eswatiniLow", "eswatiniHigh"]
  },
  "TC": {
    "country": "Turks and Caicos Islands",
    "continent_code": "NA",
    "continent": "North America",
    "maps": []
  },
  "TD": {
    "country": "Chad",
    "continent_code": "AF",
    "continent": "Africa",
    "maps": ["chadLow", "chadHigh"]
  },
  "TF": {
    "country": "French Southern Territories",
    "continent_code": "AN",
    "continent": "Antarctica",
    "maps": []
  },
  "TG": {
    "country": "Togo",
    "continent_code": "AF",
    "continent": "Africa",
    "maps": []
  },
  "TH": {
    "country": "Thailand",
    "continent_code": "AS",
    "continent": "Asia",
    "maps": ["thailandLow", "thailandHigh"]
  },
  "TJ": {
    "country": "Tajikistan",
    "continent_code": "AS",
    "continent": "Asia",
    "maps": ["tajikistanLow", "tajikistanHigh"]
  },
  "TK": {
    "country": "Tokelau",
    "continent_code": "OC",
    "continent": "Oceania",
    "maps": []
  },
  "TL": {
    "country": "Timor-Leste",
    "continent_code": "AS",
    "continent": "Asia",
    "maps": []
  },
  "TM": {
    "country": "Turkmenistan",
    "continent_code": "AS",
    "continent": "Asia",
    "maps": []
  },
  "TN": {
    "country": "Tunisia",
    "continent_code": "AF",
    "continent": "Africa",
    "maps": ["tunisiaLow", "tunisiaHigh"]
  },
  "TO": {
    "country": "Tonga",
    "continent_code": "OC",
    "continent": "Oceania",
    "maps": []
  },
  "TR": {
    "country": "Turkey",
    "continent_code": "EU",
    "continent": "Europe",
    "maps": ["turkeyLow", "turkeyHigh"]
  },
  "TT": {
    "country": "Trinidad and Tobago",
    "continent_code": "NA",
    "continent": "North America",
    "maps": []
  },
  "TV": {
    "country": "Tuvalu",
    "continent_code": "OC",
    "continent": "Oceania",
    "maps": []
  },
  "TW": {
    "country": "Taiwan, Province of China",
    "continent_code": "AS",
    "continent": "Asia",
    "maps": []
  },
  "TZ": {
    "country": "Tanzania, United Republic of",
    "continent_code": "AF",
    "continent": "Africa",
    "maps": ["tanzaniaLow", "tanzaniaHigh"]
  },
  "UA": {
    "country": "Ukraine",
    "continent_code": "EU",
    "continent": "Europe",
    "maps": ["ukraineLow", "ukraineHigh"]
  },
  "UG": {
    "country": "Uganda",
    "continent_code": "AF",
    "continent": "Africa",
    "maps": []
  },
  "UM": {
    "country": "United States Minor Outlying Islands",
    "continent_code": "OC",
    "continent": "Oceania",
    "maps": []
  },
  "US": {
    "country": "United States",
    "continent_code": "NA",
    "continent": "North America",
    "maps": ["usaLow", "usaHigh", "usaTerritoriesLow", "usaTerritoriesHigh", "usaTerritories2Low", "usaTerritories2High"]
  },
  "UY": {
    "country": "Uruguay",
    "continent_code": "SA",
    "continent": "South America",
    "maps": []
  },
  "UZ": {
    "country": "Uzbekistan",
    "continent_code": "AS",
    "continent": "Asia",
    "maps": ["uzbekinstanLow", "uzbekinstanHigh"]
  },
  "VA": {
    "country": "Holy See (Vatican City State)",
    "continent_code": "EU",
    "continent": "Europe",
    "maps": ["vaticanLow", "vaticanHigh"]
  },
  "VC": {
    "country": "Saint Vincent and the Grenadines",
    "continent_code": "NA",
    "continent": "North America",
    "maps": ["saintVincentLow", "saintVincentHigh"]
  },
  "VE": {
    "country": "Venezuela, Bolivarian Republic of",
    "continent_code": "SA",
    "continent": "South America",
    "maps": ["venezuelaLow", "venezuelaHigh"]
  },
  "VG": {
    "country": "Virgin Islands, British",
    "continent_code": "NA",
    "continent": "North America",
    "maps": []
  },
  "VI": {
    "country": "Virgin Islands, U.S.",
    "continent_code": "NA",
    "continent": "North America",
    "maps": []
  },
  "VN": {
    "country": "Viet Nam",
    "continent_code": "AS",
    "continent": "Asia",
    "maps": ["vietnamLow", "vietnamHigh"]
  },
  "VU": {
    "country": "Vanuatu",
    "continent_code": "OC",
    "continent": "Oceania",
    "maps": []
  },
  "WF": {
    "country": "Wallis and Futuna",
    "continent_code": "OC",
    "continent": "Oceania",
    "maps": []
  },
  "WS": {
    "country": "Samoa",
    "continent_code": "OC",
    "continent": "Oceania",
    "maps": ["samoaLow", "samoaHigh"]
  },
  "YE": {
    "country": "Yemen",
    "continent_code": "AS",
    "continent": "Asia",
    "maps": ["yemenLow", "yemenHigh"]
  },
  "YT": {
    "country": "Mayotte",
    "continent_code": "AF",
    "continent": "Africa",
    "maps": []
  },
  "ZA": {
    "country": "South Africa",
    "continent_code": "AF",
    "continent": "Africa",
    "maps": ["southAfricaLow", "southAfricaHigh"]
  },
  "ZM": {
    "country": "Zambia",
    "continent_code": "AF",
    "continent": "Africa",
    "maps": ["zambiaLow", "zambiaHigh"]
  },
  "ZW": {
    "country": "Zimbabwe",
    "continent_code": "AF",
    "continent": "Africa",
    "maps": ["zimbabweLow", "zimbabweHigh"]
  },
  "XK": {
    "country": "Kosovo",
    "continent_code": "EU",
    "continent": "Europe",
    "maps": ["kosovoLow", "kosovoHigh"]
  }
};


const continents = {
  "AF": 0,
  "AN": 1,
  "AS": 2,
  "EU": 3,
  "NA": 4,
  "OC": 5,
  "SA": 6
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  animations: [
    trigger('fadeInOutAnimation', [
      state('in', style({ opacity: 1 })),
      transition(':enter', [
        style({ opacity: 0 }),
        animate(600)
      ])
    ])
  ]
})
export class DashboardComponent implements OnInit, OnDestroy, DoCheck {
  @ViewChild(PerfectScrollbarComponent) public directiveScroll: PerfectScrollbarComponent;
  @ViewChild('autoShownModal', { static: false }) autoShownModal: ModalDirective;
  isModalShown = false;
  public modalStep = 1;
  public translations: any = {};
  public fuse: any;
  public stateFuse: any;
  public fuseResults: any[];
  public stateData:any;
  public timeLine: any;

  public caseData = [];
  public recoveriesData = [];
  public deathData = [];

  private pieChart: am4charts.PieChart;
  private mapChart: am4maps.MapChart;
  private lineChart: am4charts.XYChart;
  private radarChart: am4charts.RadarChart;
  public isLoading: boolean = true;
  public isLoadingMap: boolean = true;
  public isLoadingCountries: boolean = true;

  public totalCases;
  public totalDeaths;
  public totalRecoveries;
  public totalCritical;
  public todayCases;
  public todayDeaths;
  public activeCases;
  public casesPer1M;
  public finishedCases;

  public sortType = "todayCases";

  public countryCodes = COUNTRY_CODES;
  public stateCodes=STATE_CODES;
  public countries: any = [];
  public states:any=[];
  public updatedState:any=[];
  constructor(private zone: NgZone, private _getDataService: GetdataService, public translate: TranslateService) {
  }

  async ngDoCheck() {
    this.translate.get(['Shared.Other.14', 'Shared.Other.15', 'Shared.Other.16', 'Shared.Other.17', 'Shared.TopCards.1', 'Shared.TopCards.3', 'Shared.TopCards.4'])
      .subscribe(translations => {
        this.setTranslations(translations);
        return 0;
      });

  }
  calculateSum(index, array = this.countries) {
    var total = 0
    for (var i = 0, _len = array.length; i < _len; i++) {
      total += array[i][index]
    }
    console.log("total",total)
    return total
  }

  sortData(data, sortBy) {
    try {
      const sortProp = sortBy;
      data.sort((a, b) => {
        if (a[sortProp] < b[sortProp]) {
          return -1;
        } else if (a[sortProp] > b[sortProp]) {
          return 1;
        }
        return 0;
      })
    } catch (e) {
      console.error("ERROR while sorting", e);
      return data;
    }
    return data
  }

  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.pieChart) {
        this.pieChart.dispose();
      }
      if (this.mapChart) {
        this.mapChart.dispose();
      }
      if (this.lineChart) {
        this.lineChart.dispose();
      }
      if (this.radarChart) {
        this.radarChart.dispose();
      }
    });
  }

  async ngOnInit() {


    await this.ngDoCheck();
    if (!localStorage.getItem("dontShow")) {
      this.showModal();
    }


    combineLatest(
      this._getDataService.getAll(this.sortType),
      this._getDataService.getTimelineGlobal(),
      this._getDataService.getSates()
    )
      .subscribe(([getAllData, getTimelineData, getAllStateData]) => {
        console.log("getAllData",getAllData)
        console.log("getTimelineData",getTimelineData)
        this.isLoading = false;
        this.isLoadingCountries = false;
        this.isLoadingMap = false;
        this.countries = getAllData;
        this.states=getAllStateData;
        console.log("getAllStateData",this.states);
        this.totalCases = this.calculateSum("cases");
        this.totalDeaths = this.calculateSum("deaths");
        this.totalRecoveries = this.calculateSum("recovered");
        this.totalCritical = this.calculateSum("critical");
        this.todayCases = this.calculateSum("todayCases");
        this.todayDeaths = this.calculateSum("todayDeaths");
        this.activeCases = this.calculateSum("active");
        this.casesPer1M = this.calculateSum("casesPerOneMillion");
        this.finishedCases = this.totalDeaths + this.totalRecoveries;

        //Updating states code
          for (let key in this.states) {
            if (this.states.hasOwnProperty(key)) {
              let state = this.states[key];
              
              this.updatedState.push(
                {
                  id: "IN-"+this.states[key].statecode,
                  name:key,
                  total:100,
                  active:40,
                  deaths:1
                });     
            }
          }
          console.log("==updatedState==================",JSON.stringify(this.updatedState));

        this.fuse = new Fuse(this.countries, {
          shouldSort: true,
          threshold: 0.6,
          location: 0,
          distance: 100,
          minMatchCharLength: 1,
          keys: [
            "country"
          ]
        });
        this.stateFuse = new Fuse(this.updatedState, {
          shouldSort: true,
          threshold: 0.6,
          location: 0,
          distance: 100,
          minMatchCharLength: 1,
          keys: [
            "states"
          ]
        });

        this.timeLine = getTimelineData;
        this.loadMap("cases");

      });

  }
  
  

  loadMap(option) {
    this.isLoadingMap = true;
    if (this.mapChart) {
      this.mapChart.dispose();
    }
    let color = "#21AFDD";
    if (option == "recovered") {
      color = "#10c469";
    } else if (option == "critical") {
      color = "#f9c851";
    } else if (option == "deaths") {
      color = "#ff5b5b";
    }
    let mapData = [];
    console.log("this.fuse.list",this.fuse.list)
    this.fuse.list.forEach(element => {
      console.log("element", element)
      if (element[option] != 0) {
        mapData.push({
          id: this.countryCodes[element.country],
          name: element.country,
          deaths: element.deaths,
          active: element.active,
          value: element[option],
          country: element.country,
          color: am4core.color(color)
        });
      }
    });
    console.log("mapData",mapData)

   
    //******************* */Adding for Coutry ********************/
    /* Create map instance */
    let chart = am4core.create("worldChart", am4maps.MapChart);

    // Set map definition
    chart.geodata = am4geodata_worldLow;
    chart.projection = new am4maps.projections.Miller();

    // Create map polygon series for world map  
    let worldSeries = chart.series.push(new am4maps.MapPolygonSeries());
    worldSeries.useGeodata = true;

    worldSeries.exclude = ["AQ"];
    worldSeries.nonScalingStroke = true;
    worldSeries.strokeWidth = 0.5;
    worldSeries.calculateVisualCenter = true;

    var worldPolygon = worldSeries.mapPolygons.template;
    worldPolygon.tooltipText = "{name}\n pooja";
    worldPolygon.nonScalingStroke = true;
    worldPolygon.strokeOpacity = 0.5;
   // worldPolygon.propertyFields.fill = "color";
    worldPolygon.fill = am4core.color("#282d37");
    worldPolygon.stroke = am4core.color("#313a46")
    this.mapChart = chart;

    // Create hover state and set alternative fill color
    var hs = worldPolygon.states.create("hover");
    hs.properties.fill = chart.colors.getIndex(9);

    // Add zoom control
    chart.zoomControl = new am4maps.ZoomControl();

    // Add Home button
    var button = chart.chartContainer.createChild(am4core.Button);
    button.padding(5, 3, 5, 5);
    button.align = "right";
    button.marginRight = 15;
    button.events.on("hit", function() {
      chart.goHome();
    });

    button.icon = new am4core.Sprite();
    button.icon.path = "M16,8 L14,8 L14,16 L10,16 L10,10 L6,10 L6,16 L2,16 L2,8 L0,8 L8,0 L16,8 Z M16,8";

    //creating imageMap for GooglrMap
    let imageMapSeries = chart.series.push(new am4maps.MapImageSeries());
    imageMapSeries.data = mapData;
    imageMapSeries.dataFields.value = "value";

    let imageMapTemplate = imageMapSeries.mapImages.template;
    imageMapTemplate.nonScaling = true;

    let circleMap = imageMapTemplate.createChild(am4core.Circle);
    circleMap.fillOpacity = 0.4;
    circleMap.propertyFields.fill = "color";

    circleMap.tooltipText = `[font-size: 20px; #bd1550; bold]{country}[/]\n
     Total : [bold]{value}[/]
     Confirmed :[bold]{active}[/]
     Deaths :[bold]{deaths}\n
    `;

    chart.events.on("ready", () => {
      this.isLoadingMap = false;
    })

    imageMapSeries.heatRules.push({
      "target": circleMap,
      "property": "radius",
      "min": 4,
      "max": 30,
      "dataField": "value"
    })
    //creating ImageTemplate for Map
    imageMapTemplate.adapter.add("latitude", function (latitude, target) {
      let polygon = worldSeries.getPolygonById(target.dataItem.dataContext["id"]);
      if (polygon) {
        return polygon.visualLatitude;
      }
      return latitude;
    })

    imageMapTemplate.adapter.add("longitude", function (longitude, target) {
      let polygon = worldSeries.getPolygonById(target.dataItem.dataContext["id"]);
      if (polygon) {
        return polygon.visualLongitude;
      }
      return longitude;
    })
    //////////////////////////////
    // Create country specific series (but hide it for now)
    var countrySeries = chart.series.push(new am4maps.MapPolygonSeries());
    countrySeries.useGeodata = true;
    countrySeries.hide();
    countrySeries.geodataSource.events.on("done", function (ev) {
      worldSeries.hide();
      button.hide();
      countrySeries.show();
    });

    var countryPolygon = countrySeries.mapPolygons.template;
    countryPolygon.tooltipText = "{name}\n India";
    countryPolygon.nonScalingStroke = true;
    countryPolygon.strokeOpacity = 0.5;
    countryPolygon.fill = am4core.color("#eee");

// Create hover state and set alternative fill color
  var hs = countryPolygon.states.create("hover");
    hs.properties.fill = chart.colors.getIndex(9);

    console.log("==this.states in map",this.states);
    console.log("==this.updatedstate in map",this.updatedState);

    let stateMapData = [];
    this.stateFuse.list.forEach(element => {
      console.log("==stateFuse element", element);
      // id: this.stateCodes[element.name],
      if (element != 0) {
        stateMapData.push({
          id: element.id,
          name: element.name,
          total:element.total,
          active: element.active,
          deaths:element.deaths,
          value: 'value',
          color: am4core.color(color)
        });
      }
    });
    console.log("==stateMapData", stateMapData);


    ///start Adding for country marker
    let imageStateSeries = chart.series.push(new am4maps.MapImageSeries());
    imageStateSeries.data = stateMapData;
    imageStateSeries.dataFields.value = "value";
    
    let imageStateTemplate = imageStateSeries.mapImages.template;
    imageStateTemplate.nonScaling = true;

    // imageStateTemplate.horizontalCenter = "middle";
    // imageStateTemplate.verticalCenter = "middle";
    // imageStateTemplate.width = 8;
    // imageStateTemplate.height = 8;


    
    let circleState = imageStateTemplate.createChild(am4core.Circle);
    circleState.fillOpacity = 0.7;
    circleState.propertyFields.fill = "#21AFDD";

    circleState.tooltipText = `[font-size: 20px; #bd1550; bold]{name}[/]\n
     Total : [bold]{total}[/]
     Confirmed :[bold]{active}[/]
     Deaths :[bold]{deaths}\n
    `;
    
    imageStateSeries.heatRules.push({
      "target": circleState,
      "property": "radius",
      "min": 2,
      "max": 3,
      "dataField": "value"
    });
    //getting cordinated on click
    chart.seriesContainer.events.on("hit", function(ev) {
      const  cor_latitude= chart.svgPointToGeo(ev.svgPoint).latitude;
      const  cor_longitude= chart.svgPointToGeo(ev.svgPoint).longitude;
 
       console.log("clicked location",cor_latitude);
       console.log("clicked location",cor_longitude);
     });
 
     imageStateTemplate.adapter.add("latitude", function (latitude, target) {
       let polygon = countrySeries.getPolygonById(target.dataItem.dataContext["id"]);
       console.log("IND-polygon-lat",polygon)
       if (polygon) {
         return polygon.visualLatitude;
       }
       return latitude;
     })
 
     
     imageStateTemplate.adapter.add("longitude", function (longitude, target) {
       // console.log("countrySeries.MultiPolygon.template.propertyFields",countrySeries.mapPolygons.template.propertyFields)
       // let polygon = countrySeries.getPolygonById(target.dataItem.dataContext["id"]);
       let polygon = countrySeries.getPolygonById(target.dataItem.dataContext["id"]);
 
       console.log("IND-polygon-lon",polygon)
       if (polygon) {
         return polygon.visualLongitude;
       }
       return longitude;
     })
 ///End Adding for country marker
 

        // Set up click events
        worldPolygon.events.on("hit", function (ev) {
          ev.target.series.chart.zoomToMapObject(ev.target);
          let map = ev.target.dataItem.dataContext["map"];
          var countryCode = ev.target.dataItem.dataContext["id"];
          
          console.log("countryCode",countryCode)
          console.log("map", ev.target.dataItem.dataContext)
          if (map) {
            ev.target.isHover = false;
            countrySeries.geodataSource.url = "https://www.amcharts.com/lib/4/geodata/json/" + map + ".json";
            countrySeries.geodataSource.load();
            console.log("countrySeries.geodataSource.processData,",countrySeries.geodataSource)
            back.show();

    
          }
          
        });



    // Set up data for countries
    var data = [];
    for (var id in countries) {
      console.log("id",id)
      if (countries.hasOwnProperty(id)) {
        console.log("countries",countries)
        var country = countries[id];
        console.log("country",country)
        if (country.maps.length) {
          data.push({
            id: id,
            color: chart.colors.getIndex(continents[country.continent_code]),
            map: country.maps[0]
          });
        }
      }
    }
    worldSeries.data = data;

    // Add zoomout button
    var back = chart.createChild(am4core.ZoomOutButton);
    back.align = "right";
    back.hide();
    back.events.on("hit", function (ev) {
      worldSeries.show();
      button.show();
      chart.goHome();
      countrySeries.hide();
      back.hide();
    });

    



  }

  showModal(): void {
    this.modalStep = 1;
    this.isModalShown = true;
  }

  hideModal(): void {
    this.autoShownModal.hide();
  }

  onHidden(): void {
    this.isModalShown = false;
  }
  nextStep() {
    this.modalStep += 1;
  }
  close(dontShow) {
    if (dontShow) {
      localStorage.setItem("dontShow", "true");
    }
    this.hideModal();
  }
  async setTranslations(translations) {
    this.translations.active = translations['Shared.Other.14'];
    this.translations.recovered = translations['Shared.Other.15'];
    this.translations.deaths = translations['Shared.Other.16'];
    this.translations.critical = translations['Shared.Other.17'];
    this.translations.cases = translations['Shared.Other.14'];
  }

}


