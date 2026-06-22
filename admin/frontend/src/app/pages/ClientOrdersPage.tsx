import { useState, useMemo, useRef, useEffect } from "react";
import { ChevronDown, X, Calendar } from "lucide-react";
import { Footer } from "../components/Footer";

interface OrderItem {
  id: string;
  reportId: string;
  client: string;
  firstName: string;
  lastName: string;
  searchType: string;
  status: string;
  badgeColor: "green" | "yellow" | "red" | "blue" | "gray";
  ssn: string;
  dob: string;
  county: string;
  state: string;
  date: string;
}

const MOCK_ORDERS: OrderItem[] = [
  {
    id: "9639501",
    reportId: "8639501",
    client: "ZScale LLC",
    firstName: "Ganeshram",
    lastName: "Madaswamy",
    searchType: "Nationwide Criminal Database Search",
    status: "Closed",
    badgeColor: "green",
    ssn: "123-45-6789",
    dob: "1985-05-12",
    county: "Harris",
    state: "TX",
    date: "2026-06-18",
  },
  {
    id: "9639502",
    reportId: "8639502",
    client: "ZScale LLC",
    firstName: "Ganeshram",
    lastName: "Madaswamy",
    searchType: "SSN Verification (CBSV)",
    status: "Pending",
    badgeColor: "yellow",
    ssn: "123-45-6789",
    dob: "1985-05-12",
    county: "Harris",
    state: "TX",
    date: "2026-06-18",
  },
  {
    id: "9639034",
    reportId: "8639034",
    client: "ZScale LLC",
    firstName: "Uday Kiran Reddy",
    lastName: "Bommu",
    searchType: "Nationwide Criminal Database Search",
    status: "Closed",
    badgeColor: "green",
    ssn: "987-65-4321",
    dob: "1990-08-25",
    county: "Santa Clara",
    state: "CA",
    date: "2026-06-17",
  },
  {
    id: "9639035",
    reportId: "8639035",
    client: "ZScale LLC",
    firstName: "Uday Kiran Reddy",
    lastName: "Bommu",
    searchType: "SSN Verification (CBSV)",
    status: "Closed",
    badgeColor: "red",
    ssn: "987-65-4321",
    dob: "1990-08-25",
    county: "Santa Clara",
    state: "CA",
    date: "2026-06-17",
  },
  {
    id: "9638910",
    reportId: "8638910",
    client: "Mannat Technologies",
    firstName: "Sri",
    lastName: "Kanth",
    searchType: "County Criminal Search",
    status: "Closed",
    badgeColor: "green",
    ssn: "555-55-5555",
    dob: "1988-11-02",
    county: "Dallas",
    state: "TX",
    date: "2026-06-15",
  },
  {
    id: "9638700",
    reportId: "8638700",
    client: "CLOUD SYSTEMS LLC",
    firstName: "Muralidhar",
    lastName: "P",
    searchType: "Nationwide Criminal Database Search",
    status: "Pending",
    badgeColor: "yellow",
    ssn: "444-44-4444",
    dob: "1992-04-14",
    county: "Wake",
    state: "NC",
    date: "2026-06-12",
  },
  {
    id: "9638550",
    reportId: "8638550",
    client: "VIGILIQ LLC",
    firstName: "Bhanu",
    lastName: "S",
    searchType: "SSN Verification (CBSV)",
    status: "Closed",
    badgeColor: "green",
    ssn: "333-33-3333",
    dob: "1987-09-30",
    county: "Hudson",
    state: "NJ",
    date: "2026-06-10",
  },
  {
    id: "9638400",
    reportId: "8638400",
    client: "Intellan Technologies LLC",
    firstName: "Suresh",
    lastName: "K",
    searchType: "County Criminal Search",
    status: "Cancelled",
    badgeColor: "blue",
    ssn: "222-22-2222",
    dob: "1983-02-18",
    county: "Middlesex",
    state: "NJ",
    date: "2026-06-08",
  },
  {
    id: "9638120",
    reportId: "8638120",
    client: "Jarvis Business Solutions LLC",
    firstName: "Sri",
    lastName: "A",
    searchType: "Nationwide Criminal Database Search",
    status: "Record",
    badgeColor: "gray",
    ssn: "111-11-1111",
    dob: "1991-07-07",
    county: "Orange",
    state: "FL",
    date: "2026-06-05",
  },
  {
    id: "9637900",
    reportId: "8637900",
    client: "BV&S LLC",
    firstName: "Anjali",
    lastName: "P",
    searchType: "Nationwide Criminal Database Search",
    status: "Closed",
    badgeColor: "green",
    ssn: "000-00-0000",
    dob: "1989-12-15",
    county: "Bergen",
    state: "NJ",
    date: "2026-06-02",
  }
];

const CLIENT_OPTIONS = [
  { value: "All", label: "All Clients" },
  { value: "ZScale LLC", label: "ZScale LLC" },
  { value: "Mannat Technologies", label: "Mannat Technologies" },
  { value: "CLOUD SYSTEMS LLC", label: "CLOUD SYSTEMS LLC" },
  { value: "VIGILIQ LLC", label: "VIGILIQ LLC" },
  { value: "Intellan Technologies LLC", label: "Intellan Technologies LLC" },
  { value: "Jarvis Business Solutions LLC", label: "Jarvis Business Solutions LLC" },
  { value: "BV&S LLC", label: "BV&S LLC" },
];

const STATUS_OPTIONS = [
  { value: "All", label: "Any Status" },
  { value: "Pending", label: "Pending" },
  { value: "Closed", label: "Closed" },
  { value: "Record", label: "Record" },
  { value: "Cancelled", label: "Cancelled" },
];

const SEARCH_TYPE_OPTIONS = [
  { value: "All", label: "All Searches" },
  { value: "Nationwide Criminal Database Search", label: "Nationwide Criminal Database Search" },
  { value: "SSN Verification (CBSV)", label: "SSN Verification (CBSV)" },
  { value: "County Criminal Search", label: "County Criminal Search" },
  { value: "Drug Screening 4 Panel (LabCorp)", label: "Drug Screening 4 Panel (LabCorp)" },
  { value: "Drug Screening 5 Panel with Nicotine", label: "Drug Screening 5 Panel with Nicotine" },
  { value: "Education Verification", label: "Education Verification" },
  { value: "Employment Verification", label: "Employment Verification" },
  { value: "ES - 10 Panel (1906)", label: "ES - 10 Panel (1906)" },
  { value: "ES - 10 Panel (1918)", label: "ES - 10 Panel (1918)" },
  { value: "ES - 10 Panel 6AM (2249)", label: "ES - 10 Panel 6AM (2249)" },
  { value: "ES - 10 Panel 6AM/ EXBNZ/ MDMA/ EXOPI/ OXY (6728)", label: "ES - 10 Panel 6AM/ EXBNZ/ MDMA/ EXOPI/ OXY (6728)" },
  { value: "ES - 10 Panel 6AM/ HYDO/ OXY/ MDMA (4089)", label: "ES - 10 Panel 6AM/ HYDO/ OXY/ MDMA (4089)" },
  { value: "ES - 10 Panel 6AM/ OXY/ MEP/ MDMA (3462)", label: "ES - 10 Panel 6AM/ OXY/ MEP/ MDMA (3462)" },
  { value: "ES - 10 Panel ALCOHOL (1208)", label: "ES - 10 Panel ALCOHOL (1208)" },
  { value: "ES - 10 Panel ALCOHOL/ FENT/ MEP/ EXT OPI (4007)", label: "ES - 10 Panel ALCOHOL/ FENT/ MEP/ EXT OPI (4007)" },
  { value: "ES - 10 Panel BUP/ FENT/ MDMA/ MEP/ EXP OPI/ OXY/ TCA/ TRAM (7127)", label: "ES - 10 Panel BUP/ FENT/ MDMA/ MEP/ EXP OPI/ OXY/ TCA/ TRAM (7127)" },
  { value: "ES - 10 Panel BUP/ OXY (2303)", label: "ES - 10 Panel BUP/ OXY (2303)" },
  { value: "ES - 10 Panel COT/ EXP OPI/ ALCOHOL (3485)", label: "ES - 10 Panel COT/ EXP OPI/ ALCOHOL (3485)" },
  { value: "ES - 10 Panel Custom Drug Test", label: "ES - 10 Panel Custom Drug Test" },
  { value: "ES - 10 Panel EXP OPI/ OXY (1910)", label: "ES - 10 Panel EXP OPI/ OXY (1910)" },
  { value: "ES - 10 Panel FEN (8596)", label: "ES - 10 Panel FEN (8596)" },
  { value: "ES - 10 Panel Hair/EXP OPI (H10P)", label: "ES - 10 Panel Hair/EXP OPI (H10P)" },
  { value: "ES - 10 Panel MDMA/ BATHSALTS (3324)", label: "ES - 10 Panel MDMA/ BATHSALTS (3324)" },
  { value: "ES - 10 Panel NO THC/ 6AM/ EXP OPI (4225)", label: "ES - 10 Panel NO THC/ 6AM/ EXP OPI (4225)" },
  { value: "ES - 10 Panel NO THC/ 6AM/ MEQ (4111)", label: "ES - 10 Panel NO THC/ 6AM/ MEQ (4111)" },
  { value: "ES - 10 Panel NO THC/ EXP OPI (6664)", label: "ES - 10 Panel NO THC/ EXP OPI (6664)" },
  { value: "ES - 10 Panel NO THC/ MEQ (4343)", label: "ES - 10 Panel NO THC/ MEQ (4343)" },
  { value: "ES - 10 Panel NO THC/ OXY/ EXP OPI (3477)", label: "ES - 10 Panel NO THC/ OXY/ EXP OPI (3477)" },
  { value: "ES - 10 Panel NO THC/ OXY/ MDMA (4691)", label: "ES - 10 Panel NO THC/ OXY/ MDMA (4691)" },
  { value: "ES - 10 Panel Standard (1204)", label: "ES - 10 Panel Standard (1204)" },
  { value: "ES - 10-Panel NICOTINE (1224)", label: "ES - 10-Panel NICOTINE (1224)" },
  { value: "ES - 11 Panel ALCOHOL/ FENT/ EXP OPI (8548)", label: "ES - 11 Panel ALCOHOL/ FENT/ EXP OPI (8548)" },
  { value: "ES - 11 Panel ExpOPI/NOTHC/OXY/ECS/FEN/TRAM", label: "ES - 11 Panel ExpOPI/NOTHC/OXY/ECS/FEN/TRAM" },
  { value: "ES - 11 Panel No THC/ 6AM/ Exp Opi (8145)", label: "ES - 11 Panel No THC/ 6AM/ Exp Opi (8145)" },
  { value: "ES - 11 Panel NO THC/ FENT/ OXY (6405)", label: "ES - 11 Panel NO THC/ FENT/ OXY (6405)" },
  { value: "ES - 12 Panel NO THC/ MDMA/ OXY/ 6AM (4137)", label: "ES - 12 Panel NO THC/ MDMA/ OXY/ 6AM (4137)" },
  { value: "ES - 16 Panel 6AM/ ALCOHOL/ FEN/ MEP/ OXY/ TRAM (6605)", label: "ES - 16 Panel 6AM/ ALCOHOL/ FEN/ MEP/ OXY/ TRAM (6605)" },
  { value: "ES - 3DR HYCD MDMA/6AM", label: "ES - 3DR HYCD MDMA/6AM" },
  { value: "ES - 4 Panel 6AM/ FENT/ MDMA (6276)", label: "ES - 4 Panel 6AM/ FENT/ MDMA (6276)" },
  { value: "ES - 4 Panel NO THC (1687)", label: "ES - 4 Panel NO THC (1687)" },
  { value: "ES - 4 Panel NO THC/ 6AM/ HYD/ MDMA/ OXY (3488)", label: "ES - 4 Panel NO THC/ 6AM/ HYD/ MDMA/ OXY (3488)" },
  { value: "ES - 5 Panel Alcohol (2447)", label: "ES - 5 Panel Alcohol (2447)" },
  { value: "ES - 5 Panel Hair EXP OPI (H5PEO)", label: "ES - 5 Panel Hair EXP OPI (H5PEO)" },
  { value: "ES - 5 Panel NO THC/ EXP OPI/ ALCOHOL (4645)", label: "ES - 5 Panel NO THC/ EXP OPI/ ALCOHOL (4645)" },
  { value: "ES - 5 Panel Standard (1200)", label: "ES - 5 Panel Standard (1200)" },
  { value: "ES - 6 Panel (2275)", label: "ES - 6 Panel (2275)" },
  { value: "ES - 6 Panel Standard (3121)", label: "ES - 6 Panel Standard (3121)" },
  { value: "ES - 7 Panel", label: "ES - 7 Panel" },
  { value: "ES - 7 Panel (5DSP/OXY/PHN)", label: "ES - 7 Panel (5DSP/OXY/PHN)" },
  { value: "ES - 7 Panel 6AM (2267)", label: "ES - 7 Panel 6AM (2267)" },
  { value: "ES - 7 Panel 6AM/ BUP/ FENT/ MDMA/ EXP OPI/ OXY/ TRAM (5268)", label: "ES - 7 Panel 6AM/ BUP/ FENT/ MDMA/ EXP OPI/ OXY/ TRAM (5268)" },
  { value: "ES - 7 Panel FENT/ BUP (2304)", label: "ES - 7 Panel FENT/ BUP (2304)" },
  { value: "ES - 7 Panel MDMA/ EXP OPI/ OXY/ TCA (7116)", label: "ES - 7 Panel MDMA/ EXP OPI/ OXY/ TCA (7116)" },
  { value: "ES - 7 Panel NO THC (2480)", label: "ES - 7 Panel NO THC (2480)" },
  { value: "ES - 7 Panel NO THC/ BUP/ MDMA/ OXY/ TCA (3249)", label: "ES - 7 Panel NO THC/ BUP/ MDMA/ OXY/ TCA (3249)" },
  { value: "ES - 7 Panel OXY/ MDMA (3124)", label: "ES - 7 Panel OXY/ MDMA (3124)" },
  { value: "ES - 7 Panel Plus MDMA", label: "ES - 7 Panel Plus MDMA" },
  { value: "ES - 7 Panel Standard (1203)", label: "ES - 7 Panel Standard (1203)" },
  { value: "ES - 8 Panel", label: "ES - 8 Panel" },
  { value: "ES - 8 Panel 6AM/ MDMA/ MEQ/ OXY/ NO THC (6480)", label: "ES - 8 Panel 6AM/ MDMA/ MEQ/ OXY/ NO THC (6480)" },
  { value: "ES - 8 Panel BUP/ MDMA/ OXY (4163)", label: "ES - 8 Panel BUP/ MDMA/ OXY (4163)" },
  { value: "ES - 8 Panel FENT/ EXP OPI (4686)", label: "ES - 8 Panel FENT/ EXP OPI (4686)" },
  { value: "ES - 8 Panel HYCD/ MDMA/ OXY (6477)", label: "ES - 8 Panel HYCD/ MDMA/ OXY (6477)" },
  { value: "ES - 8 Panel NO THC/ 6AM (4249)", label: "ES - 8 Panel NO THC/ 6AM (4249)" },
  { value: "ES - 8 Panel NO THC/ 6AM/ MEQ (6766)", label: "ES - 8 Panel NO THC/ 6AM/ MEQ (6766)" },
  { value: "ES - 8 Panel NO THC/ BUP/ MDMA/ MEQ/ OXY (8825)", label: "ES - 8 Panel NO THC/ BUP/ MDMA/ MEQ/ OXY (8825)" },
  { value: "ES - 8 Panel NO THC/ OXY/ MEP (7108)", label: "ES - 8 Panel NO THC/ OXY/ MEP (7108)" },
  { value: "ES - 8 Panel OXY/ 6AM/ MDMA (2333)", label: "ES - 8 Panel OXY/ 6AM/ MDMA (2333)" },
  { value: "ES - 8 Panel Standard (3123)", label: "ES - 8 Panel Standard (3123)" },
  { value: "ES - 9 Panel 6AM/ FENT/ MDMA/ OXY (4758)", label: "ES - 9 Panel 6AM/ FENT/ MDMA/ OXY (4758)" },
  { value: "ES - 9 Panel 6AM/ NO THC/ MDMA/ BUP/ EXP OPI/ OXY (8542)", label: "ES - 9 Panel 6AM/ NO THC/ MDMA/ BUP/ EXP OPI/ OXY (8542)" },
  { value: "ES - 9 Panel 6AM/ NO THC/ MDMA/ BUP/ FENT/ EXP OPI/ OXY (8244)", label: "ES - 9 Panel 6AM/ NO THC/ MDMA/ BUP/ FENT/ EXP OPI/ OXY (8244)" },
  { value: "ES - 9 Panel 6AM/ OXY/ MDMA (6829)", label: "ES - 9 Panel 6AM/ OXY/ MDMA (6829)" },
  { value: "ES - 9 Panel 6AM/ OXY/ MEP (4520)", label: "ES - 9 Panel 6AM/ OXY/ MEP (4520)" },
  { value: "ES - 9 Panel BUP/ MDMA/ OXY/ TCA (4715)", label: "ES - 9 Panel BUP/ MDMA/ OXY/ TCA (4715)" },
  { value: "ES - 9 Panel FENT/ EXOPI (6902)", label: "ES - 9 Panel FENT/ EXOPI (6902)" },
  { value: "ES - 9 Panel FENT/ MEP/ MEQ/ OXY/ TRAM (6544)", label: "ES - 9 Panel FENT/ MEP/ MEQ/ OXY/ TRAM (6544)" },
  { value: "ES - 9 Panel NO THC (1790)", label: "ES - 9 Panel NO THC (1790)" },
  { value: "ES - 9 Panel NO THC (6599)", label: "ES - 9 Panel NO THC (6599)" },
  { value: "ES - 9 Panel NO THC/ OXY (7027)", label: "ES - 9 Panel NO THC/ OXY (7027)" },
  { value: "ES - 9 Panel NO THC/ OXY (8798)", label: "ES - 9 Panel NO THC/ OXY (8798)" },
  { value: "ES - 9 Panel OXY/ MDMA/ OPIEX (4190)", label: "ES - 9 Panel OXY/ MDMA/ OPIEX (4190)" },
  { value: "ES - 9 Panel Standard (1205)", label: "ES - 9 Panel Standard (1205)" },
  { value: "ES - 9DSP/EXP OPI/Custom Levels/OXY/ECS/PHN", label: "ES - 9DSP/EXP OPI/Custom Levels/OXY/ECS/PHN" },
  { value: "ES - ALCOHOL", label: "ES - ALCOHOL" },
  { value: "ES - Audiogram", label: "ES - Audiogram" },
  { value: "ES - Chest X-Ray (1 or 2 Views)", label: "ES - Chest X-Ray (1 or 2 Views)" },
  { value: "ES - Chest X-Ray (2 Views)", label: "ES - Chest X-Ray (2 Views)" },
  { value: "ES - DOT Alcohol (BAT)", label: "ES - DOT Alcohol (BAT)" },
  { value: "ES - DOT Drug Test", label: "ES - DOT Drug Test" },
  { value: "ES - DOT Physical", label: "ES - DOT Physical" },
  { value: "ES - DOT Physical Recertification", label: "ES - DOT Physical Recertification" },
  { value: "ES - DOT Urine Test", label: "ES - DOT Urine Test" },
  { value: "ES - Hep A Titer", label: "ES - Hep A Titer" },
  { value: "ES - Hep A Vaccine #1", label: "ES - Hep A Vaccine #1" },
  { value: "ES - Hep A Vaccine #2", label: "ES - Hep A Vaccine #2" },
  { value: "ES - Hep B Surface Antigen - (Screen for Acute/Chronic Disease)", label: "ES - Hep B Surface Antigen - (Screen for Acute/Chronic Disease)" },
  { value: "ES - Hep B Titer", label: "ES - Hep B Titer" },
  { value: "ES - Hep B Vaccine #1", label: "ES - Hep B Vaccine #1" },
  { value: "ES - Hep B Vaccine #2", label: "ES - Hep B Vaccine #2" },
  { value: "ES - Hep B Vaccine #3", label: "ES - Hep B Vaccine #3" },
  { value: "ES - Hep C Titer", label: "ES - Hep C Titer" },
  { value: "ES - Influenza Vaccine", label: "ES - Influenza Vaccine" },
  { value: "ES - Lift Test", label: "ES - Lift Test" },
  { value: "ES - MMR Titer", label: "ES - MMR Titer" },
  { value: "ES - MMR Vaccine", label: "ES - MMR Vaccine" },
  { value: "ES - MMR Vaccine #2", label: "ES - MMR Vaccine #2" },
  { value: "ES - Mumps Antibody (IgG)", label: "ES - Mumps Antibody (IgG)" },
  { value: "ES - Non DOT Alcohol (BAT)", label: "ES - Non DOT Alcohol (BAT)" },
  { value: "ES - Non-DOT Physical", label: "ES - Non-DOT Physical" },
  { value: "ES - Oral 10 Panel BUP/ MDMA (6037)", label: "ES - Oral 10 Panel BUP/ MDMA (6037)" },
  { value: "ES - Oral 10 Panel EXP OPI/ MDMA (6036)", label: "ES - Oral 10 Panel EXP OPI/ MDMA (6036)" },
  { value: "ES - Oral 10 Panel MDMA/ ALCOHOL (6043)", label: "ES - Oral 10 Panel MDMA/ ALCOHOL (6043)" },
  { value: "ES - Oral 5 Panel (6008)", label: "ES - Oral 5 Panel (6008)" },
  { value: "ES - Oral 6 Panel MDMA/ OXY (6002)", label: "ES - Oral 6 Panel MDMA/ OXY (6002)" },
  { value: "ES - Oral Fluid Drug Screen", label: "ES - Oral Fluid Drug Screen" },
  { value: "ES - Oral Swab Kits", label: "ES - Oral Swab Kits" },
  { value: "ES - Oral THC (6051)", label: "ES - Oral THC (6051)" },
  { value: "ES - OSHA Respirator Questionnaire", label: "ES - OSHA Respirator Questionnaire" },
  { value: "ES - Pulmonary Function Test/Spirometry", label: "ES - Pulmonary Function Test/Spirometry" },
  { value: "ES - Respirator Fit Test, Qualitative", label: "ES - Respirator Fit Test, Qualitative" },
  { value: "ES - Respirator Fit Test, Quantitative", label: "ES - Respirator Fit Test, Quantitative" },
  { value: "ES - Rubella Antibody (IgG)", label: "ES - Rubella Antibody (IgG)" },
  { value: "ES - TB Chest X-Ray", label: "ES - TB Chest X-Ray" },
  { value: "ES - TB/PPD Skin Test - 1 Step Only", label: "ES - TB/PPD Skin Test - 1 Step Only" },
  { value: "ES - TB/PPD Test 1", label: "ES - TB/PPD Test 1" },
  { value: "ES - TB/PPD Test 2", label: "ES - TB/PPD Test 2" },
  { value: "ES - TDAP", label: "ES - TDAP" },
  { value: "ES - TSPOT/TB Blood Test", label: "ES - TSPOT/TB Blood Test" },
  { value: "ES - Urine Fentanyl Only", label: "ES - Urine Fentanyl Only" },
  { value: "ES - Varicella Titer", label: "ES - Varicella Titer" },
  { value: "ES - Varicella Vaccine", label: "ES - Varicella Vaccine" },
  { value: "ES - Varicella Vaccine #2", label: "ES - Varicella Vaccine #2" },
  { value: "ES - Vision Test, Ishihara", label: "ES - Vision Test, Ishihara" },
  { value: "ES - Vision Test, Jaeger", label: "ES - Vision Test, Jaeger" },
  { value: "ES - Vision Test, Snellen", label: "ES - Vision Test, Snellen" },
  { value: "ES - Vision Test, Titmus", label: "ES - Vision Test, Titmus" }
];

const SORT_ORDER_OPTIONS = [
  { value: "Status", label: "Status" },
  { value: "Search ID", label: "Search ID" },
  { value: "Search ID (High to Low)", label: "Search ID (High to Low)" },
  { value: "Order Date", label: "Order Date" },
  { value: "Order Date(Newest to Oldest)", label: "Order Date(Newest to Oldest)" },
];

const PER_PAGE_OPTIONS = [
  { value: "20", label: "20 Searches" },
  { value: "30", label: "30 Searches" },
  { value: "40", label: "40 Searches" },
  { value: "50", label: "50 Searches" },
  { value: "60", label: "60 Searches" },
];

const AGE_OPTIONS = [
  { value: "All", label: "All" },
  { value: "under30", label: "Under 30" },
  { value: "30to40", label: "30 - 40" },
  { value: "over40", label: "Over 40" },
];

const CRIMINAL_RECORDS_OPTIONS = [
  { value: "All", label: "All" },
  { value: "Yes", label: "Yes" },
  { value: "No", label: "No" },
];

interface ClientOrdersPageProps {
  isDarkMode?: boolean;
}

export function ClientOrdersPage({ isDarkMode = false }: ClientOrdersPageProps) {
  // Banner state
  const [showBanner, setShowBanner] = useState(true);

  // Form states
  const [client, setClient] = useState("All");
  const [searchId, setSearchId] = useState("");
  const [reportId, setReportId] = useState("");
  const [status, setStatus] = useState("All");
  const [searchType, setSearchType] = useState("All");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [ssn, setSsn] = useState("");
  const [dob, setDob] = useState("");
  const [county, setCounty] = useState("");
  const [stateName, setStateName] = useState("");
  const [orderDateFrom, setOrderDateFrom] = useState("");
  const [orderDateTo, setOrderDateTo] = useState("");
  const [sortOrder, setSortOrder] = useState("Status");
  const [searchesPerPage, setSearchesPerPage] = useState("20");
  const [age, setAge] = useState("All");
  const [criminalRecords, setCriminalRecords] = useState("All");

  // Submitted search query state
  const [queries, setQueries] = useState({
    client: "All",
    searchId: "",
    reportId: "",
    status: "All",
    searchType: "All",
    firstName: "",
    lastName: "",
    ssn: "",
    dob: "",
    county: "",
    stateName: "",
    orderDateFrom: "",
    orderDateTo: "",
    sortOrder: "Status",
    searchesPerPage: "20",
    age: "All",
    criminalRecords: "All",
  });

  const handleSearch = () => {
    setQueries({
      client,
      searchId,
      reportId,
      status,
      searchType,
      firstName,
      lastName,
      ssn,
      dob,
      county,
      stateName,
      orderDateFrom,
      orderDateTo,
      sortOrder,
      searchesPerPage,
      age,
      criminalRecords,
    });
  };

  const handleReset = () => {
    setClient("All");
    setSearchId("");
    setReportId("");
    setStatus("All");
    setSearchType("All");
    setFirstName("");
    setLastName("");
    setSsn("");
    setDob("");
    setCounty("");
    setStateName("");
    setOrderDateFrom("");
    setOrderDateTo("");
    setSortOrder("Status");
    setSearchesPerPage("20");
    setAge("All");
    setCriminalRecords("All");

    setQueries({
      client: "All",
      searchId: "",
      reportId: "",
      status: "All",
      searchType: "All",
      firstName: "",
      lastName: "",
      ssn: "",
      dob: "",
      county: "",
      stateName: "",
      orderDateFrom: "",
      orderDateTo: "",
      sortOrder: "Status",
      searchesPerPage: "20",
      age: "All",
      criminalRecords: "All",
    });
  };

  // Filtered orders logic
  const filteredOrders = useMemo(() => {
    let result = [...MOCK_ORDERS];

    if (queries.client !== "All") {
      result = result.filter(
        (o) => o.client.toLowerCase() === queries.client.toLowerCase()
      );
    }
    if (queries.searchId.trim()) {
      result = result.filter((o) =>
        o.id.toLowerCase().includes(queries.searchId.trim().toLowerCase())
      );
    }
    if (queries.reportId.trim()) {
      result = result.filter((o) =>
        o.reportId.toLowerCase().includes(queries.reportId.trim().toLowerCase())
      );
    }
    if (queries.status !== "All") {
      result = result.filter(
        (o) => o.status.toLowerCase() === queries.status.toLowerCase()
      );
    }
    if (queries.searchType !== "All") {
      result = result.filter((o) => o.searchType === queries.searchType);
    }
    if (queries.firstName.trim()) {
      result = result.filter((o) =>
        o.firstName.toLowerCase().includes(queries.firstName.trim().toLowerCase())
      );
    }
    if (queries.lastName.trim()) {
      result = result.filter((o) =>
        o.lastName.toLowerCase().includes(queries.lastName.trim().toLowerCase())
      );
    }
    if (queries.ssn.trim()) {
      result = result.filter((o) =>
        o.ssn.replace(/-/g, "").includes(queries.ssn.trim().replace(/-/g, ""))
      );
    }
    if (queries.dob.trim()) {
      result = result.filter((o) => o.dob === queries.dob.trim());
    }
    if (queries.county.trim()) {
      result = result.filter((o) =>
        o.county.toLowerCase().includes(queries.county.trim().toLowerCase())
      );
    }
    if (queries.stateName.trim()) {
      result = result.filter((o) =>
        o.state.toLowerCase().includes(queries.stateName.trim().toLowerCase())
      );
    }
    if (queries.orderDateFrom) {
      result = result.filter((o) => o.date >= queries.orderDateFrom);
    }
    if (queries.orderDateTo) {
      result = result.filter((o) => o.date <= queries.orderDateTo);
    }
    if (queries.criminalRecords !== "All") {
      if (queries.criminalRecords === "Yes") {
        result = result.filter((o) => o.badgeColor === "red");
      } else {
        result = result.filter((o) => o.badgeColor !== "red");
      }
    }

    // Sort order
    if (queries.sortOrder === "Status") {
      result.sort((a, b) => a.status.localeCompare(b.status));
    } else if (queries.sortOrder === "Search ID") {
      result.sort((a, b) => a.id.localeCompare(b.id));
    } else if (queries.sortOrder === "Search ID (High to Low)") {
      result.sort((a, b) => b.id.localeCompare(a.id));
    } else if (queries.sortOrder === "Order Date") {
      result.sort((a, b) => a.date.localeCompare(b.date));
    } else if (queries.sortOrder === "Order Date(Newest to Oldest)") {
      result.sort((a, b) => b.date.localeCompare(a.date));
    }

    return result;
  }, [queries]);

  // Page index state
  const [currentPageNum, setCurrentPageNum] = useState(1);

  // Styled colors
  const primaryBrandColor = isDarkMode ? "#DF2A57" : "#C70039";
  const bodyBg = isDarkMode ? "#1A1C21" : "#F4F5F7";
  const cardBg = isDarkMode ? "#252830" : "#ffffff";
  const cardBorder = isDarkMode ? "1px solid #333333" : "1px solid #E5E7EB";
  const textPrimary = isDarkMode ? "#E5E7EB" : "#374151";
  const textLabel = isDarkMode ? "#8391a2" : "#8A8A8A";
  const cardShadow = "0 1px 3px rgba(0,0,0,0.05)";

  // Replicated cell style from AllOrderDetails (with borders matching screenshot)
  const CELL_STYLE: React.CSSProperties = {
    background: isDarkMode ? "#252830" : "#FFFFFF",
    border: isDarkMode ? "1px solid #333333" : "1px solid #E2E8F0",
    borderRadius: "4px",
    padding: "8px 12px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    height: "58px",
    boxSizing: "border-box",
    position: "relative",
  };

  const CELL_LABEL_STYLE: React.CSSProperties = {
    fontSize: "12px",
    color: isDarkMode ? "#8391a2" : "#8A8A8A",
    fontWeight: 400,
    lineHeight: "1.2",
    marginBottom: "3px",
    textAlign: "left",
  };

  const INPUT_ELEMENT_STYLE: React.CSSProperties = {
    border: "none",
    outline: "none",
    background: "transparent",
    width: "100%",
    fontSize: "14px",
    color: isDarkMode ? "#E5E7EB" : "#374151",
    padding: "0",
    margin: "0",
    fontFamily: "inherit",
  };

  // Reusable custom InputField (no placeholder text, matches screenshot blank inputs)
  function InputField({
    label,
    value,
    onChange,
  }: {
    label: string;
    value: string;
    onChange: (val: string) => void;
  }) {
    return (
      <div style={CELL_STYLE}>
        <label style={CELL_LABEL_STYLE}>{label}</label>
        <input
          type="text"
          style={INPUT_ELEMENT_STYLE}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    );
  }

  // Custom Date input field matching completely empty/blank look when value is empty
  function DateInputField({
    label,
    value,
    onChange,
  }: {
    label: string;
    value: string;
    onChange: (val: string) => void;
  }) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [type, setType] = useState("text");

    return (
      <div
        style={{ ...CELL_STYLE, cursor: "pointer" }}
        onClick={() => {
          if (inputRef.current) {
            setType("date");
            inputRef.current.focus();
            if (typeof inputRef.current.showPicker === "function") {
              try {
                inputRef.current.showPicker();
              } catch (e) {
                console.log(e);
              }
            }
          }
        }}
      >
        <label style={CELL_LABEL_STYLE}>{label}</label>
        <input
          ref={inputRef}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setType("date")}
          onBlur={(e) => {
            if (!e.target.value) {
              setType("text");
            }
          }}
          style={INPUT_ELEMENT_STYLE}
        />
      </div>
    );
  }

  // Custom Dropdown item component
  interface DropdownItemProps {
    label: string;
    isSelected: boolean;
    onClick: () => void;
  }

  function DropdownItem({ label, isSelected, onClick }: DropdownItemProps) {
    const [isHovered, setIsHovered] = useState(false);
    const hoverOrSelectedBg = isDarkMode ? "#4A4A4A" : "#7b7b7b";
    const defaultBg = isDarkMode ? "#252830" : "#FFFFFF";

    return (
      <div
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          padding: "8px 12px",
          fontSize: "14px",
          fontFamily: "'Wix Madefor Display', sans-serif",
          color: isHovered || isSelected ? "#FFFFFF" : (isDarkMode ? "#E5E7EB" : "#4B5563"),
          background: isHovered || isSelected ? hoverOrSelectedBg : defaultBg,
          cursor: "pointer",
          transition: "background 0.1s ease, color 0.1s ease",
        }}
      >
        {label}
      </div>
    );
  }

  // Custom Dropdown replicating AllOrderDetails dropdown UI
  interface Option {
    value: string;
    label: string;
  }

  interface CustomDropdownProps {
    label: string;
    value: string;
    options: Option[];
    onChange: (value: string) => void;
    align?: "left" | "right" | "center";
  }

  function CustomDropdown({ label, value, options, onChange, align = "left" }: CustomDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    const selectedOption = options.find((opt) => opt.value === value) || options[0];

    // Align dropdown popup
    let positionStyle: React.CSSProperties = {};
    if (align === "right") {
      positionStyle = {
        right: "-1px",
        left: "auto",
      };
    } else if (align === "center") {
      positionStyle = {
        left: "50%",
        transform: "translateX(-50%)",
      };
    } else {
      positionStyle = {
        left: "-1px",
      };
    }

    return (
      <div
        ref={containerRef}
        onClick={() => setIsOpen(!isOpen)}
        style={{ ...CELL_STYLE, cursor: "pointer" }}
      >
        <label style={CELL_LABEL_STYLE}>{label}</label>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", userSelect: "none" }}>
          <span
            style={{
              fontSize: "14px",
              color: isDarkMode ? "#E5E7EB" : "#374151",
              fontWeight: 400,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {selectedOption ? selectedOption.label : value}
          </span>
          <ChevronDown size={14} style={{ color: isDarkMode ? "#8391a2" : "#6B7280", marginLeft: "4px", flexShrink: 0 }} />
        </div>

        {isOpen && (
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 2px)",
              ...positionStyle,
              minWidth: "100%",
              width: "max-content",
              maxWidth: "450px",
              background: isDarkMode ? "#252830" : "#FFFFFF",
              border: isDarkMode ? "1px solid #333333" : "1px solid #cbd5e1",
              borderRadius: "4px",
              boxSizing: "border-box",
              zIndex: 1000,
              maxHeight: "240px",
              overflowX: "hidden",
              overflowY: "auto",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.15), 0 2px 4px -1px rgba(0, 0, 0, 0.1)",
            }}
          >
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <DropdownItem
                  key={opt.value}
                  label={opt.label}
                  isSelected={isSelected}
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                />
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        background: bodyBg,
      }}
    >
      <div
        style={{
          flex: 1,
          padding: "20px 24px",
          overflowY: "auto",
        }}
      >
        {/* Page Heading */}
        <h1
          style={{
            fontSize: "20px",
            fontWeight: 600,
            color: primaryBrandColor,
            margin: "0 0 20px 0",
          }}
        >
          Client Orders
        </h1>

        {/* ── Filters Grid ────────────────────────────────────────────── */}
        {/* Unified 6-column grid structure perfectly aligning all items */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            gap: "14px",
            marginBottom: "24px",
          }}
        >
          {/* Row 1 */}
          <div style={{ gridColumn: "span 2" }}>
            <CustomDropdown label="Client" value={client} options={CLIENT_OPTIONS} onChange={setClient} />
          </div>
          <div>
            <InputField label="Search ID" value={searchId} onChange={setSearchId} />
          </div>
          <div>
            <InputField label="Report ID" value={reportId} onChange={setReportId} />
          </div>
          <div>
            <CustomDropdown label="Status" value={status} options={STATUS_OPTIONS} onChange={setStatus} align="right" />
          </div>
          <div>
            <CustomDropdown label="Search Type / Name" value={searchType} options={SEARCH_TYPE_OPTIONS} onChange={setSearchType} align="right" />
          </div>

          {/* Row 2 */}
          <div>
            <InputField label="First Name" value={firstName} onChange={setFirstName} />
          </div>
          <div>
            <InputField label="Last Name" value={lastName} onChange={setLastName} />
          </div>
          <div>
            <InputField label="SSN" value={ssn} onChange={setSsn} />
          </div>
          <div>
            <InputField label="DOB" value={dob} onChange={setDob} />
          </div>
          <div>
            <InputField label="County" value={county} onChange={setCounty} />
          </div>
          <div>
            <InputField label="State" value={stateName} onChange={setStateName} />
          </div>

          {/* Row 3 */}
          <div>
            <DateInputField label="Order Date From" value={orderDateFrom} onChange={setOrderDateFrom} />
          </div>
          <div>
            <DateInputField label="Order Date To" value={orderDateTo} onChange={setOrderDateTo} />
          </div>
          <div>
            <CustomDropdown label="Sort Order" value={sortOrder} options={SORT_ORDER_OPTIONS} onChange={setSortOrder} align="left" />
          </div>
          <div>
            <CustomDropdown label="Searches per page" value={searchesPerPage} options={PER_PAGE_OPTIONS} onChange={setSearchesPerPage} align="center" />
          </div>
          <div>
            <CustomDropdown label="Age" value={age} options={AGE_OPTIONS} onChange={setAge} align="right" />
          </div>
          <div>
            <CustomDropdown label="Criminal Records Found" value={criminalRecords} options={CRIMINAL_RECORDS_OPTIONS} onChange={setCriminalRecords} align="right" />
          </div>
        </div>

        {/* ── Buttons Row (Solid search/reset buttons with no icons) ──── */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "12px",
            marginBottom: "24px",
          }}
        >
          <button
            onClick={handleSearch}
            style={{
              background: "#C70039",
              color: "#ffffff",
              border: "none",
              borderRadius: "4px",
              padding: "10px 24px",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 2px 4px rgba(199, 0, 57, 0.15)",
              transition: "background 0.15s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#A3002E")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#C70039")}
          >
            Search
          </button>

          <button
            onClick={handleReset}
            style={{
              background: "#2D1B6B",
              color: "#ffffff",
              border: "none",
              borderRadius: "4px",
              padding: "10px 24px",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 2px 4px rgba(45, 27, 107, 0.15)",
              transition: "background 0.15s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#1F124D")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#2D1B6B")}
          >
            Reset
          </button>
        </div>

        {/* ── Green Records Alert Banner ────────────────────────────────── */}
        {showBanner && (
          <div
            style={{
              background: isDarkMode ? "#1C3524" : "#E2F0D9",
              border: isDarkMode ? "1px solid #285430" : "1px solid #E2F0D9",
              borderRadius: "4px",
              padding: "12px 16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              color: isDarkMode ? "#A3E2AB" : "#385623",
              fontSize: "13.5px",
              fontWeight: 500,
              marginBottom: "24px",
            }}
          >
            <div style={{ flex: 1, textAlign: "center" }}>
              39435 Records Found (showing only first 100 records). Page 1 of 5
            </div>
            <button
              onClick={() => setShowBanner(false)}
              style={{
                background: "transparent",
                border: "none",
                color: isDarkMode ? "#A3E2AB" : "#385623",
                cursor: "pointer",
                padding: "2px",
                display: "flex",
                alignItems: "center",
                opacity: 0.8,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.8")}
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* ── Search Results Card ─────────────────────────────────────── */}
        <div
          style={{
            background: cardBg,
            border: cardBorder,
            borderRadius: "6px",
            boxShadow: cardShadow,
            overflow: "hidden",
            marginBottom: "20px",
          }}
        >
          {/* Results Header */}
          <div
            style={{
              padding: "12px 20px",
              borderBottom: cardBorder,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: isDarkMode ? "#2A2D34" : "#F5F5F5",
            }}
          >
            <h2
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: textPrimary,
                margin: 0,
              }}
            >
              Search Results
            </h2>

            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13.5px", color: textLabel }}>
              <span>Page:</span>
              <div style={{ display: "flex", alignItems: "center", position: "relative", background: cardBg, border: cardBorder, borderRadius: "4px", padding: "4px 24px 4px 10px" }}>
                <select
                  value={currentPageNum}
                  onChange={(e) => setCurrentPageNum(Number(e.target.value))}
                  style={{
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    fontSize: "13px",
                    color: textPrimary,
                    cursor: "pointer",
                    appearance: "none",
                  }}
                >
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                  <option value={5}>5</option>
                </select>
                <ChevronDown size={12} style={{ color: "#9CA3AF", pointerEvents: "none", position: "absolute", right: 8 }} />
              </div>
            </div>
          </div>

          {/* Results List */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            {filteredOrders.length === 0 ? (
              <div style={{ padding: "40px", textAlign: "center", color: textLabel, fontSize: "14px" }}>
                No records found matching the active filters.
              </div>
            ) : (
              filteredOrders.map((order, idx) => {
                // Badge Styles based on status / color
                let badgeBg = "#E2F0D9";
                let badgeColorText = "#385623";

                if (order.badgeColor === "yellow") {
                  badgeBg = "#FFF2CC";
                  badgeColorText = "#7F6000";
                } else if (order.badgeColor === "red") {
                  badgeBg = "#FADBD8";
                  badgeColorText = "#721C24";
                } else if (order.badgeColor === "blue") {
                  badgeBg = "#EBF5FF";
                  badgeColorText = "#0066CC";
                } else if (order.badgeColor === "gray") {
                  badgeBg = "#F3F4F6";
                  badgeColorText = "#374151";
                }

                // Dark mode adaptations for badges
                if (isDarkMode) {
                  if (order.badgeColor === "green") {
                    badgeBg = "#1C3524";
                    badgeColorText = "#A3E2AB";
                  } else if (order.badgeColor === "yellow") {
                    badgeBg = "#42320E";
                    badgeColorText = "#FAD36E";
                  } else if (order.badgeColor === "red") {
                    badgeBg = "#421C16";
                    badgeColorText = "#F3A196";
                  } else if (order.badgeColor === "blue") {
                    badgeBg = "#0F2840";
                    badgeColorText = "#6CB1F2";
                  } else if (order.badgeColor === "gray") {
                    badgeBg = "#30343C";
                    badgeColorText = "#C0C4CC";
                  }
                }

                return (
                  <div
                    key={order.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "12px 20px",
                      borderBottom: idx === filteredOrders.length - 1 ? "none" : cardBorder,
                      background: cardBg,
                      transition: "background 0.1s ease",
                    }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/15"
                  >
                    {/* Left: Search ID */}
                    <div style={{ width: "20%", minWidth: "150px", fontSize: "13.5px", color: textLabel }}>
                      Search ID: <span style={{ fontWeight: 600, color: textPrimary }}>{order.id}</span>
                    </div>

                    {/* Middle: Candidate & Search Type */}
                    <div style={{ flex: 1, padding: "0 20px", fontSize: "13.5px", color: textPrimary }}>
                      <span style={{ fontWeight: 600 }}>{order.firstName} {order.lastName}</span>
                      <span style={{ color: textLabel }}> : {order.searchType}</span>
                    </div>

                    {/* Right Middle: Client */}
                    <div style={{ width: "15%", minWidth: "120px", fontSize: "13.5px", color: textLabel }}>
                      {order.client}
                    </div>

                    {/* Right: Status Badge */}
                    <div
                      style={{
                        background: badgeBg,
                        color: badgeColorText,
                        padding: "4px 12px",
                        borderRadius: "4px",
                        fontSize: "11px",
                        fontWeight: 700,
                        letterSpacing: "0.05em",
                        textAlign: "center",
                        minWidth: "75px",
                        textTransform: "uppercase",
                      }}
                    >
                      {order.status}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
