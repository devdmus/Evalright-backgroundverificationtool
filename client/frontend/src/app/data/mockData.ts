export const PACKAGES = [
  { id: "basic-screening", name: "Basic Screening", whatsIncluded: "What's Included?" },
  { id: "demo3", name: "Demo3", whatsIncluded: "What's Included?" },
  { id: "new", name: "New", whatsIncluded: "What's Included?" },
  { id: "demo_3", name: "DEMO_3", whatsIncluded: "What's Included?" },
  { id: "evalright-bgv", name: "Evalright_BGV", whatsIncluded: "What's Included?" },
  { id: "standard", name: "Standard", whatsIncluded: "What's Included?" },
  { id: "demo-2", name: "DEMO-2", whatsIncluded: "What's Included?" },
  { id: "nationwide-federal", name: "nationwide + federal", whatsIncluded: "What's Included?" },
];

export const ALA_CARTE_SEARCHES = [
  { id: "ssn-trace", name: "SSN Trace" },
  { id: "county-criminal", name: "County Criminal Search" },
  { id: "federal-criminal", name: "Federal Criminal Search" },
  { id: "employment-verification", name: "Employment Verification" },
  { id: "education-verification", name: "Education Verification" },
  { id: "global-watchlist", name: "Global Watch List" },
  { id: "motor-vehicle", name: "Motor Vehicle Record" },
  { id: "reference-verification", name: "Reference Verification" },
];

export type SearchStatus = "CLOSED" | "CANCELLED" | "PENDING" | "IN PROGRESS";

export interface OrderRecord {
  searchId: string;
  reportId: string;
  firstName: string;
  lastName: string;
  applicantName: string;
  ssn?: string;
  dob?: string;
  verificationType: string;
  status: SearchStatus;
  orderedBy: string;
  orderDate: string;
  county?: string;
  state?: string;
  orderReference?: string;
  applicantEmail?: string;
  criminalRecordsFound?: string;
}

export const ORDERS: OrderRecord[] = [
  { searchId: "8887753", reportId: "RP-20001", firstName: "Mounika", lastName: "Vurugonda Jr", applicantName: "Mounika Vurugonda Jr.", verificationType: "I-9 Verifications (E-Verify)", status: "CANCELLED", orderedBy: "Suresh Ramakoti", orderDate: "2026-05-12", county: "Cook", state: "IL", ssn: "***-**-1234", dob: "1990-03-15", applicantEmail: "mounika.v@email.com", criminalRecordsFound: "None" },
  { searchId: "8514399", reportId: "RP-20002", firstName: "Sindhuja", lastName: "Yedire", applicantName: "Sindhuja Yedire", verificationType: "I-9 Verifications (E-Verify)", status: "CANCELLED", orderedBy: "Suresh Ramakoti", orderDate: "2026-05-14", county: "Los Angeles", state: "CA", ssn: "***-**-2345", dob: "1992-07-22", applicantEmail: "sindhuja.y@email.com", criminalRecordsFound: "None" },
  { searchId: "8232068", reportId: "RP-20003", firstName: "Praveen", lastName: "Kumar", applicantName: "Praveen Kumar", verificationType: "Military Service Verification", status: "CANCELLED", orderedBy: "Suresh Ramakoti", orderDate: "2026-05-15", county: "Harris", state: "TX", ssn: "***-**-3456", dob: "1988-11-08", applicantEmail: "praveen.k@email.com", criminalRecordsFound: "None" },
  { searchId: "8232067", reportId: "RP-20004", firstName: "Praveen", lastName: "Kumar", applicantName: "Praveen Kumar", verificationType: "SSN Trace/Address History", status: "CLOSED", orderedBy: "Suresh Ramakoti", orderDate: "2026-05-16", county: "Maricopa", state: "AZ", ssn: "***-**-4567", dob: "1985-04-30", applicantEmail: "praveen.k@email.com", criminalRecordsFound: "None" },
  { searchId: "8514402", reportId: "RP-20005", firstName: "Michael", lastName: "Brown", applicantName: "Michael Brown", verificationType: "Federal Search", status: "CANCELLED", orderedBy: "Suresh Ramakoti", orderDate: "2026-05-17", county: "King", state: "WA", ssn: "***-**-5678", dob: "1993-09-14", applicantEmail: "michael.b@email.com", criminalRecordsFound: "None" },
  { searchId: "8514403", reportId: "RP-20006", firstName: "Jennifer", lastName: "Davis", applicantName: "Jennifer Davis", verificationType: "I-9 Verifications (E-Verify)", status: "PENDING", orderedBy: "Admin User", orderDate: "2026-05-18", county: "Miami-Dade", state: "FL", ssn: "***-**-6789", dob: "1991-01-25", applicantEmail: "jennifer.d@email.com", criminalRecordsFound: "None" },
  { searchId: "8514404", reportId: "RP-20007", firstName: "Robert", lastName: "Wilson", applicantName: "Robert Wilson", verificationType: "Global Watch List", status: "IN PROGRESS", orderedBy: "Suresh Ramakoti", orderDate: "2026-05-19", county: "Denver", state: "CO", ssn: "***-**-7890", dob: "1987-06-12", applicantEmail: "robert.w@email.com", criminalRecordsFound: "None" },
  { searchId: "8514405", reportId: "RP-20008", firstName: "Lisa", lastName: "Taylor", applicantName: "Lisa Taylor", verificationType: "Reference Verification", status: "CLOSED", orderedBy: "Admin User", orderDate: "2026-05-20", county: "Clark", state: "NV", ssn: "***-**-8901", dob: "1994-12-03", applicantEmail: "lisa.t@email.com", criminalRecordsFound: "None" },
  { searchId: "8514406", reportId: "RP-20009", firstName: "James", lastName: "Anderson", applicantName: "James Anderson", verificationType: "SSN Trace", status: "CLOSED", orderedBy: "Suresh Ramakoti", orderDate: "2026-05-21", county: "Fulton", state: "GA", ssn: "***-**-9012", dob: "1989-08-19", applicantEmail: "james.a@email.com", criminalRecordsFound: "None" },
  { searchId: "8514407", reportId: "RP-20010", firstName: "Patricia", lastName: "Thomas", applicantName: "Patricia Thomas", verificationType: "Employment Verification", status: "IN PROGRESS", orderedBy: "Admin User", orderDate: "2026-05-22", county: "Allegheny", state: "PA", ssn: "***-**-0123", dob: "1996-02-28", applicantEmail: "patricia.t@email.com", criminalRecordsFound: "None" },
  { searchId: "8514408", reportId: "RP-20011", firstName: "Charles", lastName: "Martinez", applicantName: "Charles Martinez", verificationType: "Criminal Search", status: "PENDING", orderedBy: "Suresh Ramakoti", orderDate: "2026-05-23", county: "Wayne", state: "MI", ssn: "***-**-1235", dob: "1984-05-17", applicantEmail: "charles.m@email.com", criminalRecordsFound: "2" },
  { searchId: "8514409", reportId: "RP-20012", firstName: "Nancy", lastName: "Jackson", applicantName: "Nancy Jackson", verificationType: "Education Verification", status: "CANCELLED", orderedBy: "Admin User", orderDate: "2026-05-24", county: "Mecklenburg", state: "NC", ssn: "***-**-2346", dob: "1990-10-09", applicantEmail: "nancy.j@email.com", criminalRecordsFound: "None" },
  { searchId: "8514410", reportId: "RP-20013", firstName: "Kevin", lastName: "Harris", applicantName: "Kevin Harris", verificationType: "I-9 Verifications (E-Verify)", status: "CLOSED", orderedBy: "Suresh Ramakoti", orderDate: "2026-05-25", county: "Bexar", state: "TX", ssn: "***-**-3457", dob: "1986-07-31", applicantEmail: "kevin.h@email.com", criminalRecordsFound: "None" },
  { searchId: "8514411", reportId: "RP-20014", firstName: "Amanda", lastName: "Lee", applicantName: "Amanda Lee", verificationType: "Federal Search", status: "PENDING", orderedBy: "Admin User", orderDate: "2026-05-26", county: "Tarrant", state: "TX", ssn: "***-**-4568", dob: "1995-03-22", applicantEmail: "amanda.l@email.com", criminalRecordsFound: "None" },
  { searchId: "8514412", reportId: "RP-20015", firstName: "Steven", lastName: "Clark", applicantName: "Steven Clark", verificationType: "SSN Trace", status: "CLOSED", orderedBy: "Suresh Ramakoti", orderDate: "2026-05-27", county: "Santa Clara", state: "CA", ssn: "***-**-5679", dob: "1983-11-14", applicantEmail: "steven.c@email.com", criminalRecordsFound: "None" },
  { searchId: "8514413", reportId: "RP-20016", firstName: "Melissa", lastName: "Rodriguez", applicantName: "Melissa Rodriguez", verificationType: "Employment Verification", status: "IN PROGRESS", orderedBy: "Admin User", orderDate: "2026-05-28", county: "Riverside", state: "CA", ssn: "***-**-6780", dob: "1992-04-05", applicantEmail: "melissa.r@email.com", criminalRecordsFound: "None" },
  { searchId: "8514414", reportId: "RP-20017", firstName: "Brian", lastName: "Lewis", applicantName: "Brian Lewis", verificationType: "Criminal Search", status: "CANCELLED", orderedBy: "Suresh Ramakoti", orderDate: "2026-05-29", county: "Orange", state: "CA", ssn: "***-**-7891", dob: "1988-09-28", applicantEmail: "brian.l@email.com", criminalRecordsFound: "None" },
  { searchId: "8514415", reportId: "RP-20018", firstName: "Angela", lastName: "Walker", applicantName: "Angela Walker", verificationType: "Reference Verification", status: "CLOSED", orderedBy: "Admin User", orderDate: "2026-05-30", county: "San Bernardino", state: "CA", ssn: "***-**-8902", dob: "1991-12-20", applicantEmail: "angela.w@email.com", criminalRecordsFound: "None" },
  { searchId: "8514416", reportId: "RP-20019", firstName: "Rajesh", lastName: "Kumar", applicantName: "Rajesh Kumar", verificationType: "I-9 Verifications (E-Verify)", status: "CANCELLED", orderedBy: "Suresh Ramakoti", orderDate: "2026-05-31", county: "Middlesex", state: "NJ", ssn: "***-**-9013", dob: "1987-02-11", applicantEmail: "rajesh.k@email.com", criminalRecordsFound: "None" },
  { searchId: "8514417", reportId: "RP-20020", firstName: "Priya", lastName: "Sharma", applicantName: "Priya Sharma", verificationType: "Education Verification", status: "PENDING", orderedBy: "Admin User", orderDate: "2026-06-01", county: "Bergen", state: "NJ", ssn: "***-**-0124", dob: "1993-06-16", applicantEmail: "priya.s@email.com", criminalRecordsFound: "None" },
  { searchId: "8514418", reportId: "RP-20021", firstName: "Thomas", lastName: "Hall", applicantName: "Thomas Hall", verificationType: "Global Watch List", status: "CLOSED", orderedBy: "Suresh Ramakoti", orderDate: "2026-06-02", county: "Cuyahoga", state: "OH", ssn: "***-**-1236", dob: "1985-08-07", applicantEmail: "thomas.h@email.com", criminalRecordsFound: "None" },
  { searchId: "8514419", reportId: "RP-20022", firstName: "Samantha", lastName: "Young", applicantName: "Samantha Young", verificationType: "SSN Trace", status: "IN PROGRESS", orderedBy: "Admin User", orderDate: "2026-06-02", county: "Franklin", state: "OH", ssn: "***-**-2347", dob: "1996-01-24", applicantEmail: "samantha.y@email.com", criminalRecordsFound: "None" },
  { searchId: "8514420", reportId: "RP-20023", firstName: "Daniel", lastName: "Allen", applicantName: "Daniel Allen", verificationType: "Employment Verification", status: "CANCELLED", orderedBy: "Suresh Ramakoti", orderDate: "2026-06-03", county: "Hamilton", state: "OH", ssn: "***-**-3458", dob: "1989-05-02", applicantEmail: "daniel.a@email.com", criminalRecordsFound: "None" },
  { searchId: "8514421", reportId: "RP-20024", firstName: "Laura", lastName: "Hernandez", applicantName: "Laura Hernandez", verificationType: "I-9 Verifications (E-Verify)", status: "CLOSED", orderedBy: "Admin User", orderDate: "2026-06-03", county: "Pima", state: "AZ", ssn: "***-**-4569", dob: "1994-10-18", applicantEmail: "laura.h@email.com", criminalRecordsFound: "None" },
  { searchId: "8514422", reportId: "RP-20025", firstName: "Matthew", lastName: "King", applicantName: "Matthew King", verificationType: "Criminal Search", status: "PENDING", orderedBy: "Suresh Ramakoti", orderDate: "2026-06-04", county: "Pinellas", state: "FL", ssn: "***-**-5680", dob: "1984-03-09", applicantEmail: "matthew.k@email.com", criminalRecordsFound: "1" },
  { searchId: "8514423", reportId: "RP-20026", firstName: "Jessica", lastName: "Wright", applicantName: "Jessica Wright", verificationType: "Education Verification", status: "CLOSED", orderedBy: "Admin User", orderDate: "2026-06-04", county: "Hillsborough", state: "FL", ssn: "***-**-6781", dob: "1990-07-26", applicantEmail: "jessica.w@email.com", criminalRecordsFound: "None" },
  { searchId: "8514424", reportId: "RP-20027", firstName: "Anthony", lastName: "Lopez", applicantName: "Anthony Lopez", verificationType: "Federal Search", status: "IN PROGRESS", orderedBy: "Suresh Ramakoti", orderDate: "2026-06-05", county: "Palm Beach", state: "FL", ssn: "***-**-7892", dob: "1987-12-13", applicantEmail: "anthony.l@email.com", criminalRecordsFound: "None" },
  { searchId: "8514425", reportId: "RP-20028", firstName: "Karen", lastName: "Hill", applicantName: "Karen Hill", verificationType: "Reference Verification", status: "CANCELLED", orderedBy: "Admin User", orderDate: "2026-06-05", county: "Broward", state: "FL", ssn: "***-**-8903", dob: "1993-04-01", applicantEmail: "karen.h@email.com", criminalRecordsFound: "None" },
  { searchId: "8514426", reportId: "RP-20029", firstName: "Mark", lastName: "Scott", applicantName: "Mark Scott", verificationType: "SSN Trace", status: "CLOSED", orderedBy: "Suresh Ramakoti", orderDate: "2026-06-06", county: "Davidson", state: "TN", ssn: "***-**-9014", dob: "1986-09-20", applicantEmail: "mark.s@email.com", criminalRecordsFound: "None" },
  { searchId: "8514427", reportId: "RP-20030", firstName: "Sandra", lastName: "Green", applicantName: "Sandra Green", verificationType: "Employment Verification", status: "PENDING", orderedBy: "Admin User", orderDate: "2026-06-06", county: "Shelby", state: "TN", ssn: "***-**-0125", dob: "1991-11-07", applicantEmail: "sandra.g@email.com", criminalRecordsFound: "None" },
  { searchId: "8514428", reportId: "RP-20031", firstName: "Donald", lastName: "Adams", applicantName: "Donald Adams", verificationType: "I-9 Verifications (E-Verify)", status: "CLOSED", orderedBy: "Suresh Ramakoti", orderDate: "2026-06-07", county: "Jefferson", state: "KY", ssn: "***-**-1237", dob: "1984-06-14", applicantEmail: "donald.a@email.com", criminalRecordsFound: "None" },
  { searchId: "8514429", reportId: "RP-20032", firstName: "Betty", lastName: "Baker", applicantName: "Betty Baker", verificationType: "Criminal Search", status: "CANCELLED", orderedBy: "Admin User", orderDate: "2026-06-07", county: "St. Louis", state: "MO", ssn: "***-**-2348", dob: "1995-01-31", applicantEmail: "betty.b@email.com", criminalRecordsFound: "None" },
  { searchId: "8514430", reportId: "RP-20033", firstName: "Paul", lastName: "Nelson", applicantName: "Paul Nelson", verificationType: "Education Verification", status: "IN PROGRESS", orderedBy: "Suresh Ramakoti", orderDate: "2026-06-07", county: "Jackson", state: "MO", ssn: "***-**-3459", dob: "1988-08-23", applicantEmail: "paul.n@email.com", criminalRecordsFound: "None" },
  { searchId: "8514431", reportId: "RP-20034", firstName: "Deborah", lastName: "Carter", applicantName: "Deborah Carter", verificationType: "Global Watch List", status: "CLOSED", orderedBy: "Admin User", orderDate: "2026-06-08", county: "Douglas", state: "NE", ssn: "***-**-4570", dob: "1992-05-10", applicantEmail: "deborah.c@email.com", criminalRecordsFound: "None" },
  { searchId: "8514432", reportId: "RP-20035", firstName: "Jason", lastName: "Mitchell", applicantName: "Jason Mitchell", verificationType: "SSN Trace", status: "PENDING", orderedBy: "Suresh Ramakoti", orderDate: "2026-06-08", county: "Polk", state: "IA", ssn: "***-**-5681", dob: "1983-02-27", applicantEmail: "jason.m@email.com", criminalRecordsFound: "None" },
  { searchId: "8514433", reportId: "RP-20036", firstName: "Stephanie", lastName: "Perez", applicantName: "Stephanie Perez", verificationType: "Employment Verification", status: "CLOSED", orderedBy: "Admin User", orderDate: "2026-06-08", county: "Salt Lake", state: "UT", ssn: "***-**-6782", dob: "1990-12-04", applicantEmail: "stephanie.p@email.com", criminalRecordsFound: "None" },
  { searchId: "8514434", reportId: "RP-20037", firstName: "Gary", lastName: "Roberts", applicantName: "Gary Roberts", verificationType: "I-9 Verifications (E-Verify)", status: "CANCELLED", orderedBy: "Suresh Ramakoti", orderDate: "2026-06-08", county: "Ada", state: "ID", ssn: "***-**-7893", dob: "1986-04-18", applicantEmail: "gary.r@email.com", criminalRecordsFound: "None" },
  { searchId: "8514435", reportId: "RP-20038", firstName: "Sharon", lastName: "Turner", applicantName: "Sharon Turner", verificationType: "Federal Search", status: "IN PROGRESS", orderedBy: "Admin User", orderDate: "2026-06-09", county: "Multnomah", state: "OR", ssn: "***-**-8904", dob: "1993-07-05", applicantEmail: "sharon.t@email.com", criminalRecordsFound: "None" },
  { searchId: "8514436", reportId: "RP-20039", firstName: "Jose", lastName: "Phillips", applicantName: "Jose Phillips", verificationType: "Criminal Search", status: "CLOSED", orderedBy: "Suresh Ramakoti", orderDate: "2026-06-09", county: "Pierce", state: "WA", ssn: "***-**-9015", dob: "1987-10-22", applicantEmail: "jose.p@email.com", criminalRecordsFound: "None" },
  { searchId: "8514437", reportId: "RP-20040", firstName: "Dorothy", lastName: "Campbell", applicantName: "Dorothy Campbell", verificationType: "Reference Verification", status: "PENDING", orderedBy: "Admin User", orderDate: "2026-06-09", county: "Snohomish", state: "WA", ssn: "***-**-0126", dob: "1994-03-29", applicantEmail: "dorothy.c@email.com", criminalRecordsFound: "None" },
  { searchId: "8514438", reportId: "RP-20041", firstName: "Eric", lastName: "Evans", applicantName: "Eric Evans", verificationType: "Education Verification", status: "CANCELLED", orderedBy: "Suresh Ramakoti", orderDate: "2026-06-09", county: "Spokane", state: "WA", ssn: "***-**-1238", dob: "1989-01-16", applicantEmail: "eric.e@email.com", criminalRecordsFound: "None" },
];

export const STATUS_STYLES: Record<SearchStatus, { bg: string; color: string; border: string }> = {
  CLOSED: { bg: "#F3F4F6", color: "#374151", border: "#D1D5DB" },
  CANCELLED: { bg: "#FEF2F2", color: "#B7042C", border: "#FECACA" },
  PENDING: { bg: "#FFFBEB", color: "#92400E", border: "#FDE68A" },
  "IN PROGRESS": { bg: "#EFF6FF", color: "#1D4ED8", border: "#BFDBFE" },
};

export const VERIFICATION_TYPES = [
  "SSN Trace",
  "Employment Verification",
  "Education Verification",
  "I-9 Verifications (E-Verify)",
  "Criminal Search",
  "Federal Search",
  "Global Watch List",
  "Reference Verification",
];

export const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY",
];
