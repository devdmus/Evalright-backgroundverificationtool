import { useState, useEffect } from "react";
<<<<<<< HEAD
import { 
  ArrowLeft, ArrowRight, CheckCircle, Shield, FileText, Landmark, User, Award, 
  Briefcase, Car, Fingerprint, Activity, Globe, MapPin, Users, Droplet, Clock, 
  DollarSign, Key, Search, ShieldAlert, FileSpreadsheet, Eye, Check 
} from "lucide-react";
=======
import { ArrowLeft, CheckCircle, Shield, FileText, Landmark, User, Award, Briefcase, Car } from "lucide-react";
>>>>>>> 0a3811cd9fe814f5e37ab930e0a31979b7a14308
import { Footer } from "../components/Footer";
import { getPageTheme } from "../theme/pageTheme";
import { ORDERS } from "../data/mockData";

interface InviteFormProps {
  isDarkMode?: boolean;
  onNavigate?: (page: any) => void;
}

<<<<<<< HEAD
interface TabItem {
  id: string;
  label: string;
}

const PRODUCT_TAB_NAMES: Record<string, string> = {
  "personal-details": "Personal Details Check",
  "ssn-check": "SSN Check",
  "id-verification-aadhar": "Aadhaar Verification",
  "id-verification-pan": "PAN Verification",
  "id-verification-dl": "DL Verification",
  "id-verification-voterid": "Voter ID Verification",
  "id-verification-passport": "Passport Verification",
  "uan-verification": "UAN Verification",
  "indian-database-check": "Indian Database Check",
  "global-database-check": "Global Database Check",
  "ofac-check": "OFAC Check",
  "criminal-record-check": "Criminal Check",
  "police-verification-check": "Police Verification Check",
  "nationwide-criminal-check": "Nationwide Criminal Check",
  "national-sex-offender-registry-check": "Sex Offender Registry Check",
  "credit-check": "Credit Check",
  "26as-check": "26AS Check",
  "form-16-check": "Form 16 Check",
  "itr-check": "ITR Check",
  "employment-verification": "Employment Verification",
  "education-verification": "Education Verification",
  "reference-check": "Reference Check",
  "freelancing-check": "Freelancing Check",
  "directorship-check": "Directorship Check",
  "cv-check": "CV Check",
  "gap-analysis": "Gap Analysis",
  "address-verification": "Address Verification",
  "supplier-address": "Supplier Address Check",
  "drug-test": "Drug Test",
  "medical-examination-test": "Medical Exam Test",
  "social-media-check": "Social Media Check",
  "right-to-work": "Right to Work Check",
  "emergency": "Emergency Contacts",
  "authorization": "LOA Authorization",
  "exit": "Exit Verification"
};

const PRODUCT_ICONS: Record<string, any> = {
  "personal-info": User,
  "personal-details": User,
  "ssn-check": FileDigitIcon,
  "id-verification-aadhar": Fingerprint,
  "id-verification-pan": FileText,
  "id-verification-dl": Car,
  "id-verification-voterid": Landmark,
  "id-verification-passport": Globe,
  "uan-verification": Key,
  "indian-database-check": Search,
  "global-database-check": Globe,
  "ofac-check": ShieldAlert,
  "criminal-record-check": Shield,
  "police-verification-check": Shield,
  "nationwide-criminal-check": Shield,
  "national-sex-offender-registry-check": Shield,
  "credit-check": DollarSign,
  "26as-check": FileSpreadsheet,
  "form-16-check": FileSpreadsheet,
  "itr-check": FileSpreadsheet,
  "employment-verification": Briefcase,
  "education-verification": Award,
  "reference-check": Users,
  "freelancing-check": Briefcase,
  "directorship-check": User,
  "cv-check": FileText,
  "gap-analysis": Clock,
  "address-verification": MapPin,
  "supplier-address": MapPin,
  "drug-test": Droplet,
  "medical-examination-test": Activity,
  "social-media-check": Users,
  "right-to-work": Globe,
  "emergency": Activity,
  "authorization": FileText,
  "exit": Briefcase,
  "review-details": Eye,
  "consent-sign": FileText
};

function FileDigitIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M9 10h.01" />
      <path d="M15 10h.01" />
      <path d="M12 14h.01" />
      <path d="M9 18h6" />
    </svg>
  );
}

=======
>>>>>>> 0a3811cd9fe814f5e37ab930e0a31979b7a14308
export function InviteForm({ isDarkMode = false, onNavigate }: InviteFormProps) {
  const t = getPageTheme(isDarkMode);
  const [inviteId, setInviteId] = useState<string | null>(null);
  const [inviteData, setInviteData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
<<<<<<< HEAD
  const [activeTab, setActiveTab] = useState<string>("personal-info");
  const [validatedTabs, setValidatedTabs] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form States
  const [formData, setFormData] = useState<any>({
    // General
=======

  // Form States
  const [formData, setFormData] = useState({
>>>>>>> 0a3811cd9fe814f5e37ab930e0a31979b7a14308
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phone: "",
    dob: "",
<<<<<<< HEAD
    gender: "",
    fatherName: "",
=======
    adhr: "",
>>>>>>> 0a3811cd9fe814f5e37ab930e0a31979b7a14308
    street: "",
    city: "",
    state: "",
    zip: "",
<<<<<<< HEAD
    country: "India",
    panNumber: "",
    uan: "",

    // Aadhaar
    id_aadhar_name: "",
    id_aadhar_number: "",
    id_aadhar_fatherName: "",
    id_aadhar_dob: "",
    id_aadhar_fileName: "",

    // PAN
    id_pan_name: "",
    id_pan_number: "",
    id_pan_fatherName: "",
    id_pan_dob: "",
    id_pan_fileName: "",

    // DL
    id_dl_name: "",
    id_dl_number: "",
    id_dl_fatherName: "",
    id_dl_dob: "",
    id_dl_address: "",
    id_dl_issueDate: "",
    id_dl_state: "",
    id_dl_fileName: "",

    // Voter ID
    id_voterid_name: "",
    id_voterid_number: "",
    id_voterid_fatherName: "",
    id_voterid_dob: "",
    id_voterid_state: "",
    id_voterid_fileName: "",

    // Passport
    id_passport_name: "",
    id_passport_number: "",
    id_passport_fatherName: "",
    id_passport_dob: "",
    id_passport_issueDate: "",
    id_passport_place: "",
    id_passport_expiry: "",
    id_passport_fileName: "",

    // UAN Verification
    uan_fatherName: "",
    uan_dob: "",
    uan_number: "",

    // Supplier Address
    supplier_name: "",
    supplier_address: "",

    // SSN Check
    ssn_number: "",

    // Social Media
    social_media_name: "",

    // Right to Work
    rtw_name: "",
    rtw_country: "",

    // Reference Check
    ref_name: "",
    ref_association: "",
    ref_organization: "",
    ref_designation: "",
    ref_email: "",
    ref_contactNo: "",
    ref_years: "",

    // Police Verification / Address Verification / Criminal Check / Nationwide Criminal Check / Sex Offender Check
    addr_contactNo: "",
    addr_country: "India",
    addr_city: "",
    addr_pincode: "",
    addr_address: "",
    addr_state: "",
    addr_proofType: "",
    addr_periodFrom: "",
    addr_periodTo: "",
    addr_contactPersonName: "",
    addr_fileName: "",

    crim_contactNo: "",
    crim_country: "India",
    crim_city: "",
    crim_pincode: "",
    crim_address: "",
    crim_state: "",
    crim_proofType: "",
    crim_periodFrom: "",
    crim_periodTo: "",
    crim_fileName: "",

    police_contactNo: "",
    police_country: "India",
    police_city: "",
    police_pincode: "",
    police_address: "",
    police_state: "",
    police_proofType: "",
    police_periodFrom: "",
    police_periodTo: "",
    police_fileName: "",

    sexoff_contactNo: "",
    sexoff_country: "India",
    sexoff_city: "",
    sexoff_pincode: "",
    sexoff_address: "",
    sexoff_state: "",
    sexoff_proofType: "",
    sexoff_periodFrom: "",
    sexoff_periodTo: "",
    sexoff_fileName: "",

    natcrim_contactNo: "",
    natcrim_country: "India",
    natcrim_city: "",
    natcrim_pincode: "",
    natcrim_address: "",
    natcrim_state: "",
    natcrim_proofType: "",
    natcrim_periodFrom: "",
    natcrim_periodTo: "",
    natcrim_fileName: "",

    // OFAC
    ofac_name: "",
    ofac_fatherName: "",
    ofac_dob: "",

    // Medical Exam
    med_name: "",

    // Indian Database Check
    ind_db_name: "",
    ind_db_fatherName: "",
    ind_db_dob: "",

    // Global Database Check
    glob_db_name: "",
    glob_db_fatherName: "",
    glob_db_dob: "",

    // Gap Analysis
    gap_details: "",
    gap_from: "",
    gap_to: "",

    // Freelancing
    free_clientName: "",
    free_tenureFrom: "",
    free_tenureTo: "",

    // Form 16
    f16_pan: "",

    // Credit Check
    credit_name: "",
    credit_dob: "",
    credit_pan: "",

    // 26AS Check
    a26as_pan: "",
    a26as_name: "",

    // Exit Verification
    exit_name: "",
    exit_department: "",
    exit_gender: "",
    exit_mobileNo: "",
    exit_email: "",
    exit_employeeCode: "",
    exit_dateOfJoining: "",
    exit_dateOfLeaving: "",
    exit_designation: "",
    exit_modeOfExit: "",

    // ITR Check
    itr_pan: "",
    itr_assessmentYear: "",

    // CV Check
    cv_fileName: "",

    // Authorization
    auth_text: "",
    auth_fileName: "",

    // Drug test
    drug_name: "",
    drug_clinicZip: "",
    drug_consent: false,

    // Education Verification
    edu_qualification: "",
    edu_specialization: "",
    edu_collegeName: "",
    edu_university: "",
    edu_yearOfGraduated: "",
    edu_periodOfStudyFrom: "",
    edu_periodOfStudyTo: "",
    edu_collegeAddress: "",
    edu_collegeEmails: "",
    edu_contactNo: "",
    edu_city: "",
    edu_state: "",
    edu_pincode: "",
    edu_country: "India",
    edu_marksheetFileName: "",
    edu_degreeFileName: "",

    // Employment Verification
    emp_companyName: "",
    emp_employeeCode: "",
    emp_designation: "",
    emp_employmentType: "",
    emp_dateOfJoining: "",
    emp_dateOfRelieving: "",
    emp_city: "",
    emp_state: "",
    emp_country: "India",
    emp_address: "",
    emp_hrName: "",
    emp_hrEmail: "",
    emp_hrContactNo: "",
    emp_supervisorName: "",
    emp_supervisorEmail: "",
    emp_supervisorContact: "",
    emp_reasonForLeaving: "",
    emp_fileName: "",

    // FCRA E-Signature
=======
    // Driving
    licenseNumber: "",
    licenseState: "",
    // Drug Test
    clinicZip: "",
    drugConsent: false,
    // Education
    schoolName: "",
    degree: "",
    major: "",
    gradDate: "",
    // Employment
    employerName: "",
    jobTitle: "",
    empStart: "",
    empEnd: "",
    supervisorPhone: "",
    // Signature
>>>>>>> 0a3811cd9fe814f5e37ab930e0a31979b7a14308
    fcraConsent: false,
    signatureName: "",
  });

<<<<<<< HEAD
=======
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

>>>>>>> 0a3811cd9fe814f5e37ab930e0a31979b7a14308
  useEffect(() => {
    const id = localStorage.getItem("evalright_active_invite_id");
    setInviteId(id);

    if (id) {
      setLoading(true);
      fetch(`http://localhost:5000/api/invitations/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error("Not found in database");
          return res.json();
        })
        .then((data) => {
          if (data && data.invitation) {
            const matched = data.invitation;
            setInviteData(matched);
            const nameParts = (matched.name || "").split(" ");
<<<<<<< HEAD
            setFormData((prev: any) => ({
=======
            setFormData((prev) => ({
>>>>>>> 0a3811cd9fe814f5e37ab930e0a31979b7a14308
              ...prev,
              firstName: nameParts[0] || "",
              middleName: nameParts.length > 2 ? nameParts.slice(1, -1).join(" ") : "",
              lastName: nameParts.length > 1 ? nameParts[nameParts.length - 1] : "",
              email: matched.email || "",
            }));
          }
          setLoading(false);
        })
        .catch((err) => {
          console.warn("DB invitation load failed, checking local storage fallback:", err);
<<<<<<< HEAD
=======
          // Fallback to local storage
>>>>>>> 0a3811cd9fe814f5e37ab930e0a31979b7a14308
          const saved = localStorage.getItem("evalright_invitations");
          if (saved) {
            try {
              const parsed = JSON.parse(saved);
              const matched = parsed.find((p: any) => p.inviteId === id);
              if (matched) {
                setInviteData(matched);
                const nameParts = (matched.name || "").split(" ");
<<<<<<< HEAD
                setFormData((prev: any) => ({
=======
                setFormData((prev) => ({
>>>>>>> 0a3811cd9fe814f5e37ab930e0a31979b7a14308
                  ...prev,
                  firstName: nameParts[0] || "",
                  middleName: nameParts.length > 2 ? nameParts.slice(1, -1).join(" ") : "",
                  lastName: nameParts.length > 1 ? nameParts[nameParts.length - 1] : "",
                  email: matched.email || "",
                }));
              }
            } catch (e) {
              console.error(e);
            }
          }
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const handleChange = (field: string, value: any) => {
<<<<<<< HEAD
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const products = inviteData?.selectedProducts || [];
  
  // Tab generation
  const tabs: TabItem[] = [
    { id: "personal-info", label: "Personal Information" }
  ];
  
  products.forEach((prodId: string) => {
    if (prodId === "personal-details") return;
    tabs.push({ id: prodId, label: PRODUCT_TAB_NAMES[prodId] || prodId });
  });
  
  tabs.push({ id: "review-details", label: "Review Details" });
  tabs.push({ id: "consent-sign", label: "Consent & Signature" });

  const activeIndex = tabs.findIndex(t => t.id === activeTab);

  // Validation function per tab
  const validateTab = (tabId: string): boolean => {
    setErrorMsg(null);
    switch (tabId) {
      case "personal-info":
        if (!formData.firstName.trim()) return failValidation("First Name is required.");
        if (!formData.lastName.trim()) return failValidation("Last Name is required.");
        if (!formData.email.trim()) return failValidation("Email Address is required.");
        if (!formData.email.includes("@") || !formData.email.includes(".")) return failValidation("Please enter a valid email address.");
        if (!formData.phone.trim()) return failValidation("Contact Number is required.");
        if (!formData.dob.trim()) return failValidation("Date of Birth is required.");
        if (!formData.street.trim()) return failValidation("Street Address is required.");
        if (!formData.city.trim()) return failValidation("City is required.");
        if (!formData.state.trim()) return failValidation("State is required.");
        if (!formData.zip.trim()) return failValidation("Zip Code is required.");
        return true;

      case "id-verification-aadhar":
        if (!formData.id_aadhar_name.trim()) return failValidation("Full Name on Aadhaar Card is required.");
        if (!formData.id_aadhar_number.trim() || formData.id_aadhar_number.length !== 12) {
          return failValidation("A valid 12-digit Aadhaar Number is required.");
        }
        if (!formData.id_aadhar_fileName) return failValidation("Please upload your Aadhaar Card document.");
        return true;

      case "id-verification-pan":
        if (!formData.id_pan_name.trim()) return failValidation("Full Name on PAN Card is required.");
        if (!formData.id_pan_number.trim() || formData.id_pan_number.length !== 10) {
          return failValidation("A valid 10-digit alphanumeric PAN Number is required.");
        }
        if (!formData.id_pan_fileName) return failValidation("Please upload your PAN Card document.");
        return true;

      case "id-verification-dl":
        if (!formData.id_dl_name.trim()) return failValidation("Full Name on Driver's License is required.");
        if (!formData.id_dl_number.trim()) return failValidation("Driver's License Number is required.");
        if (!formData.id_dl_state) return failValidation("Driver's License State of Issuance is required.");
        if (!formData.id_dl_fileName) return failValidation("Please upload your Driver's License document.");
        return true;

      case "id-verification-voterid":
        if (!formData.id_voterid_name.trim()) return failValidation("Full Name on Voter ID is required.");
        if (!formData.id_voterid_number.trim()) return failValidation("Voter ID Number is required.");
        if (!formData.id_voterid_state) return failValidation("Voter ID Issuance State is required.");
        if (!formData.id_voterid_fileName) return failValidation("Please upload your Voter ID Card document.");
        return true;

      case "id-verification-passport":
        if (!formData.id_passport_name.trim()) return failValidation("Full Name on Passport is required.");
        if (!formData.id_passport_number.trim()) return failValidation("Passport Number is required.");
        if (!formData.id_passport_issueDate.trim()) return failValidation("Passport Issue Date is required.");
        if (!formData.id_passport_expiry.trim()) return failValidation("Passport Expiry Date is required.");
        if (!formData.id_passport_fileName) return failValidation("Please upload your Passport document.");
        return true;

      case "uan-verification":
        if (!formData.uan_fatherName.trim()) return failValidation("Father's Name is required.");
        if (!formData.uan_dob.trim()) return failValidation("Date of Birth is required.");
        if (!formData.uan_number.trim()) return failValidation("UAN number is required.");
        return true;

      case "supplier-address":
        if (!formData.supplier_name.trim()) return failValidation("Supplier Name is required.");
        if (!formData.supplier_address.trim()) return failValidation("Supplier Address is required.");
        return true;

      case "ssn-check":
        if (!formData.ssn_number.trim()) return failValidation("SSN Number is required.");
        return true;

      case "social-media-check":
        if (!formData.social_media_name.trim()) return failValidation("Full Name for Social Media scan is required.");
        return true;

      case "right-to-work":
        if (!formData.rtw_name.trim()) return failValidation("Full Name is required.");
        if (!formData.rtw_country.trim()) return failValidation("Country of citizenship is required.");
        return true;

      case "reference-check":
        if (!formData.ref_name.trim()) return failValidation("Reference Contact Name is required.");
        if (!formData.ref_association.trim()) return failValidation("Association/Relationship is required.");
        if (!formData.ref_email.trim()) return failValidation("Reference Email Address is required.");
        if (!formData.ref_contactNo.trim()) return failValidation("Reference Contact Number is required.");
        return true;

      case "address-verification":
        if (!formData.addr_address.trim()) return failValidation("Street Address is required.");
        if (!formData.addr_city.trim()) return failValidation("City is required.");
        if (!formData.addr_state.trim()) return failValidation("State is required.");
        if (!formData.addr_pincode.trim()) return failValidation("Pincode is required.");
        if (!formData.addr_periodFrom.trim()) return failValidation("Period of Stay (From Date) is required.");
        if (!formData.addr_periodTo.trim()) return failValidation("Period of Stay (To Date) is required.");
        if (!formData.addr_fileName) return failValidation("Please upload Address Proof Document.");
        return true;

      case "criminal-record-check":
        if (!formData.crim_address.trim()) return failValidation("Street Address is required.");
        if (!formData.crim_city.trim()) return failValidation("City is required.");
        if (!formData.crim_state.trim()) return failValidation("State is required.");
        if (!formData.crim_pincode.trim()) return failValidation("Pincode is required.");
        if (!formData.crim_periodFrom.trim()) return failValidation("Period of Stay (From Date) is required.");
        if (!formData.crim_periodTo.trim()) return failValidation("Period of Stay (To Date) is required.");
        if (!formData.crim_fileName) return failValidation("Please upload Criminal address verification proof.");
        return true;

      case "police-verification-check":
        if (!formData.police_address.trim()) return failValidation("Street Address is required.");
        if (!formData.police_city.trim()) return failValidation("City is required.");
        if (!formData.police_state.trim()) return failValidation("State is required.");
        if (!formData.police_pincode.trim()) return failValidation("Pincode is required.");
        if (!formData.police_periodFrom.trim()) return failValidation("Period of Stay (From Date) is required.");
        if (!formData.police_periodTo.trim()) return failValidation("Period of Stay (To Date) is required.");
        if (!formData.police_fileName) return failValidation("Please upload Police address verification proof.");
        return true;

      case "nationwide-criminal-check":
        if (!formData.natcrim_address.trim()) return failValidation("Street Address is required.");
        if (!formData.natcrim_city.trim()) return failValidation("City is required.");
        if (!formData.natcrim_state.trim()) return failValidation("State is required.");
        if (!formData.natcrim_pincode.trim()) return failValidation("Pincode is required.");
        if (!formData.natcrim_periodFrom.trim()) return failValidation("Period of Stay (From Date) is required.");
        if (!formData.natcrim_periodTo.trim()) return failValidation("Period of Stay (To Date) is required.");
        if (!formData.natcrim_fileName) return failValidation("Please upload Nationwide criminal address verification proof.");
        return true;

      case "national-sex-offender-registry-check":
        if (!formData.sexoff_address.trim()) return failValidation("Street Address is required.");
        if (!formData.sexoff_city.trim()) return failValidation("City is required.");
        if (!formData.sexoff_state.trim()) return failValidation("State is required.");
        if (!formData.sexoff_pincode.trim()) return failValidation("Pincode is required.");
        if (!formData.sexoff_periodFrom.trim()) return failValidation("Period of Stay (From Date) is required.");
        if (!formData.sexoff_periodTo.trim()) return failValidation("Period of Stay (To Date) is required.");
        if (!formData.sexoff_fileName) return failValidation("Please upload Sex offender registry address verification proof.");
        return true;

      case "ofac-check":
        if (!formData.ofac_name.trim()) return failValidation("Full Name is required.");
        if (!formData.ofac_fatherName.trim()) return failValidation("Father's Name is required.");
        if (!formData.ofac_dob.trim()) return failValidation("Date of Birth is required.");
        return true;

      case "medical-examination-test":
        if (!formData.med_name.trim()) return failValidation("Full Name is required.");
        return true;

      case "indian-database-check":
        if (!formData.ind_db_name.trim()) return failValidation("Full Name is required.");
        if (!formData.ind_db_fatherName.trim()) return failValidation("Father's Name is required.");
        if (!formData.ind_db_dob.trim()) return failValidation("Date of Birth is required.");
        return true;

      case "global-database-check":
        if (!formData.glob_db_name.trim()) return failValidation("Full Name is required.");
        if (!formData.glob_db_fatherName.trim()) return failValidation("Father's Name is required.");
        if (!formData.glob_db_dob.trim()) return failValidation("Date of Birth is required.");
        return true;

      case "gap-analysis":
        if (!formData.gap_details.trim()) return failValidation("Details of gaps are required.");
        if (!formData.gap_from.trim()) return failValidation("Gap period From Date is required.");
        if (!formData.gap_to.trim()) return failValidation("Gap period To Date is required.");
        return true;

      case "freelancing-check":
        if (!formData.free_clientName.trim()) return failValidation("Client Name is required.");
        if (!formData.free_tenureFrom.trim()) return failValidation("Tenure From Date is required.");
        if (!formData.free_tenureTo.trim()) return failValidation("Tenure To Date is required.");
        return true;

      case "form-16-check":
        if (!formData.f16_pan.trim()) return failValidation("PAN Number is required.");
        return true;

      case "credit-check":
        if (!formData.credit_name.trim()) return failValidation("Full Name is required.");
        if (!formData.credit_dob.trim()) return failValidation("Date of Birth is required.");
        if (!formData.credit_pan.trim()) return failValidation("PAN Number is required.");
        return true;

      case "26as-check":
        if (!formData.a26as_pan.trim()) return failValidation("PAN Number is required.");
        if (!formData.a26as_name.trim()) return failValidation("Full Name on 26AS is required.");
        return true;

      case "exit":
        if (!formData.exit_name.trim()) return failValidation("Full Name is required.");
        if (!formData.exit_employeeCode.trim()) return failValidation("Employee Code is required.");
        if (!formData.exit_dateOfJoining.trim()) return failValidation("Date of Joining is required.");
        if (!formData.exit_dateOfLeaving.trim()) return failValidation("Date of Leaving is required.");
        return true;

      case "itr-check":
        if (!formData.itr_pan.trim()) return failValidation("PAN Number is required.");
        if (!formData.itr_assessmentYear.trim()) return failValidation("Assessment Year is required.");
        return true;

      case "cv-check":
        if (!formData.cv_fileName) return failValidation("Please upload your CV / Resume document.");
        return true;

      case "authorization":
        if (!formData.auth_fileName) return failValidation("Please upload signed LOA authorization document.");
        return true;

      case "drug-test":
        if (!formData.drug_name.trim()) return failValidation("Full Name is required.");
        if (!formData.drug_clinicZip.trim()) return failValidation("Preferred clinic Zip / City is required.");
        if (!formData.drug_consent) return failValidation("Please accept the Drug Testing consent to proceed.");
        return true;

      case "education-verification":
        if (!formData.edu_qualification.trim()) return failValidation("Qualification / Degree is required.");
        if (!formData.edu_collegeName.trim()) return failValidation("College/School Name is required.");
        if (!formData.edu_university.trim()) return failValidation("University / Board Name is required.");
        if (!formData.edu_yearOfGraduated.trim()) return failValidation("Year of Graduation is required.");
        if (!formData.edu_periodOfStudyFrom.trim()) return failValidation("Period of Study (From Date) is required.");
        if (!formData.edu_periodOfStudyTo.trim()) return failValidation("Period of Study (To Date) is required.");
        if (!formData.edu_marksheetFileName) return failValidation("Please upload Marksheet Document.");
        return true;

      case "employment-verification":
        if (!formData.emp_companyName.trim()) return failValidation("Company/Employer Name is required.");
        if (!formData.emp_designation.trim()) return failValidation("Designation / Title is required.");
        if (!formData.emp_dateOfJoining.trim()) return failValidation("Date of Joining is required.");
        if (!formData.emp_dateOfRelieving.trim()) return failValidation("Date of Relieving is required.");
        if (!formData.emp_fileName) return failValidation("Please upload Experience Letter or Employment document.");
        return true;

      case "review-details":
        return true;

      case "consent-sign":
        if (!formData.fcraConsent) return failValidation("You must check the authorization box to consent to the background screening.");
        const expectedSignName = `${formData.firstName} ${formData.lastName}`.toLowerCase().trim();
        const enteredSignName = formData.signatureName.toLowerCase().trim();
        if (!enteredSignName || expectedSignName !== enteredSignName) {
          return failValidation(`Please sign the form by typing your full legal name: "${formData.firstName} ${formData.lastName}"`);
        }
        return true;

      default:
        return true;
    }
  };

  const failValidation = (msg: string): boolean => {
    setErrorMsg(msg);
    // Scroll form container to top
    const formEl = document.getElementById("form-card");
    if (formEl) formEl.scrollIntoView({ behavior: "smooth" });
    return false;
  };

  const handleNext = () => {
    const isValid = validateTab(activeTab);
    if (isValid) {
      setValidatedTabs(prev => prev.includes(activeTab) ? prev : [...prev, activeTab]);
      const nextIndex = activeIndex + 1;
      if (nextIndex < tabs.length) {
        setActiveTab(tabs[nextIndex].id);
      }
    }
  };

  const handleBack = () => {
    setErrorMsg(null);
    const prevIndex = activeIndex - 1;
    if (prevIndex >= 0) {
      setActiveTab(tabs[prevIndex].id);
    }
=======
    setFormData((prev) => ({ ...prev, [field]: value }));
>>>>>>> 0a3811cd9fe814f5e37ab930e0a31979b7a14308
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

<<<<<<< HEAD
    // Validate current tab first
    if (!validateTab(activeTab)) return;

    // Validate ALL tabs before final submission
    for (const tab of tabs) {
      if (!validateTab(tab.id)) {
        setActiveTab(tab.id);
=======
    // Validate Required Common Fields
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || !formData.dob.trim() || !formData.adhr.trim() || !formData.street.trim() || !formData.city.trim() || !formData.state.trim() || !formData.zip.trim()) {
      setErrorMsg("Please complete all general personal information fields.");
      return;
    }

    // Validate Aadhaar and DOB simple format
    if (formData.adhr.replace(/\D/g, "").length < 12) {
      setErrorMsg("Please enter a valid 12-digit Aadhaar Number.");
      return;
    }

    // Validate Dynamic Fields based on invitation selection
    const products = inviteData?.selectedProducts || [];
    
    // Check Driving History products
    if (products.some((p: string) => p.includes("driving") || p.includes("cdlis"))) {
      if (!formData.licenseNumber.trim() || !formData.licenseState.trim()) {
        setErrorMsg("Please provide your Driver's License Number and Issuing State.");
>>>>>>> 0a3811cd9fe814f5e37ab930e0a31979b7a14308
        return;
      }
    }

<<<<<<< HEAD
    setSubmitting(true);

    // Backend compatibility mapping
    const payload = {
      ...formData,
      // Fallbacks for specific backend expectations
      adhr: formData.id_aadhar_number || formData.adhr,
      licenseNumber: formData.id_dl_number || formData.licenseNumber,
      licenseState: formData.id_dl_state || formData.licenseState,
      schoolName: formData.edu_collegeName || formData.schoolName,
      degree: formData.edu_qualification || formData.degree,
      major: formData.edu_specialization || formData.major,
      gradDate: formData.edu_periodOfStudyTo || formData.gradDate,
      employerName: formData.emp_companyName || formData.employerName,
      jobTitle: formData.emp_designation || formData.jobTitle,
      empStart: formData.emp_dateOfJoining || formData.empStart,
      empEnd: formData.emp_dateOfRelieving || formData.empEnd,
    };
=======
    // Check Drug Test products
    if (products.some((p: string) => p.includes("panel") || p.includes("drug"))) {
      if (!formData.clinicZip.trim()) {
        setErrorMsg("Please specify a Clinic Zip Code for your drug testing appointment.");
        return;
      }
      if (!formData.drugConsent) {
        setErrorMsg("Please consent to the drug screening authorization.");
        return;
      }
    }

    // Check Education Verification products
    if (products.some((p: string) => p.includes("education"))) {
      if (!formData.schoolName.trim() || !formData.degree.trim() || !formData.gradDate.trim()) {
        setErrorMsg("Please complete all Education History fields.");
        return;
      }
    }

    // Check Employment Verification products
    if (products.some((p: string) => p.includes("employment"))) {
      if (!formData.employerName.trim() || !formData.jobTitle.trim() || !formData.empStart.trim()) {
        setErrorMsg("Please complete all Employment History fields.");
        return;
      }
    }

    // Validate FCRA E-Signature
    if (!formData.fcraConsent) {
      setErrorMsg("You must check the authorization box to consent to the background screening.");
      return;
    }

    const expectedSignName = `${formData.firstName} ${formData.lastName}`.toLowerCase().trim();
    const enteredSignName = formData.signatureName.toLowerCase().trim();
    if (!enteredSignName || expectedSignName !== enteredSignName) {
      setErrorMsg(`Please sign the form by typing your full legal name: "${formData.firstName} ${formData.lastName}"`);
      return;
    }

    setSubmitting(true);
>>>>>>> 0a3811cd9fe814f5e37ab930e0a31979b7a14308

    fetch(`http://localhost:5000/api/invitations/${inviteId}/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
<<<<<<< HEAD
      body: JSON.stringify(payload),
=======
      body: JSON.stringify(formData),
>>>>>>> 0a3811cd9fe814f5e37ab930e0a31979b7a14308
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((data) => {
            throw new Error(data.error || "Failed to save details to the database.");
          });
        }
        return res.json();
      })
      .then((data) => {
        // 1. Update Invitation Status in localStorage
        const savedInvitesStr = localStorage.getItem("evalright_invitations");
        if (savedInvitesStr) {
          try {
            const invites = JSON.parse(savedInvitesStr);
            const idx = invites.findIndex((i: any) => i.inviteId === inviteId);
            if (idx !== -1) {
              invites[idx].status = "Complete";
              invites[idx].emailActivity = "Replied";
              localStorage.setItem("evalright_invitations", JSON.stringify(invites));
            }
          } catch (e) {}
        }

        // 2. Create/Update the final order in localStorage evalright_orders
        const savedOrdersStr = localStorage.getItem("evalright_orders");
        let existingOrders = [];
        if (savedOrdersStr) {
          try {
            existingOrders = JSON.parse(savedOrdersStr);
          } catch (e) {}
        } else {
          existingOrders = [...ORDERS];
        }

        // Map selected products to friendly verification type string
<<<<<<< HEAD
        const productNames = products.map((id: string) => PRODUCT_TAB_NAMES[id] || id);
=======
        const productNames = products.map((id: string) => {
          const known: Record<string, string> = {
            cdlis: "CDLIS",
            "county-criminal": "County Criminal Search",
            "driving-history": "Driving History",
            "education-verification": "Education Verification",
            "employment-verification": "Employment Verification",
            "labcorp-10-panel": "LabCorp - 10 Panel Drug Screen",
          };
          return known[id] || id;
        });
>>>>>>> 0a3811cd9fe814f5e37ab930e0a31979b7a14308
        const verificationType = productNames.join(", ") || "Background Check";

        const idx = existingOrders.findIndex((o: any) => o.inviteId === inviteId || (o.applicantEmail === formData.email && o.status === "PENDING"));

        if (idx !== -1) {
          // Update the existing pending order
          existingOrders[idx] = {
            ...existingOrders[idx],
            firstName: formData.firstName,
            lastName: formData.lastName,
            applicantName: `${formData.firstName} ${formData.lastName}`,
            verificationType,
            status: "IN PROGRESS" as const,
            county: formData.city,
            state: formData.state,
<<<<<<< HEAD
            adhr: (formData.id_aadhar_number || formData.adhr || "000000000000").replace(/.(?=.{4})/g, '*'),
            dob: formData.dob,
            criminalRecordsFound: "Pending Court Records",
            details: payload,
=======
            adhr: formData.adhr.replace(/.(?=.{4})/g, '*'),
            dob: formData.dob,
            criminalRecordsFound: "Pending Court Records",
            details: formData,
>>>>>>> 0a3811cd9fe814f5e37ab930e0a31979b7a14308
          };
        } else {
          // Create new order as fallback
          const newOrder = {
            searchId: "" + Math.floor(8000000 + Math.random() * 1000000),
            reportId: "RP-" + Math.floor(20000 + Math.random() * 10000),
            firstName: formData.firstName,
            lastName: formData.lastName,
            applicantName: `${formData.firstName} ${formData.lastName}`,
            verificationType,
            status: "IN PROGRESS" as const,
            orderedBy: "Applicant (Online Portal)",
            orderDate: new Date().toISOString().substring(0, 10),
            county: formData.city,
            state: formData.state,
<<<<<<< HEAD
            adhr: (formData.id_aadhar_number || formData.adhr || "000000000000").replace(/.(?=.{4})/g, '*'),
            dob: formData.dob,
            applicantEmail: formData.email,
            criminalRecordsFound: "None",
            details: payload,
=======
            adhr: formData.adhr.replace(/.(?=.{4})/g, '*'),
            dob: formData.dob,
            applicantEmail: formData.email,
            criminalRecordsFound: "Pending Court Records",
            details: formData,
>>>>>>> 0a3811cd9fe814f5e37ab930e0a31979b7a14308
          };
          existingOrders = [newOrder, ...existingOrders];
        }

        localStorage.setItem("evalright_orders", JSON.stringify(existingOrders));

        setSubmitting(false);
        setSubmitted(true);
      })
      .catch((err) => {
        console.error("Database submission failed:", err);
<<<<<<< HEAD
        setErrorMsg(err.message || "An error occurred while saving your details.");
=======
        setErrorMsg(err.message || "An error occurred while saving your details to the database.");
>>>>>>> 0a3811cd9fe814f5e37ab930e0a31979b7a14308
        setSubmitting(false);
      });
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F3F4F6" }}>
        <div style={{ color: "rgb(199, 0, 57)", fontSize: "16px", fontWeight: "bold" }}>Loading Background Form...</div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div style={{ minHeight: "100vh", background: "#F3F4F6", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div style={{ background: "#FFFFFF", padding: "40px", borderRadius: "8px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", textAlign: "center", maxWidth: "560px", width: "100%" }}>
            <CheckCircle size={64} color="#10B981" style={{ margin: "0 auto 20px auto" }} />
            <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#1F2937", marginBottom: "12px" }}>Submission Successful</h2>
            <p style={{ fontSize: "15px", color: "#4B5563", lineHeight: 1.6, marginBottom: "30px" }}>
              Thank you! Your background screening details have been successfully saved and authorized. The employer has been notified, and our verification team will start compiling your background check report.
            </p>
            <button
              onClick={() => {
                if (onNavigate) onNavigate("home");
              }}
              style={{
                background: "rgb(199, 0, 57)",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "4px",
                padding: "12px 32px",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: "0 2px 4px rgba(199,0,57,0.2)",
              }}
            >
              Return to Home
            </button>
          </div>
        </div>
        <Footer isDarkMode={isDarkMode} />
      </div>
    );
  }

  if (!inviteData) {
    return (
      <div style={{ minHeight: "100vh", background: "#F3F4F6", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div style={{ background: "#FFFFFF", padding: "40px", borderRadius: "8px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", textAlign: "center", maxWidth: "500px" }}>
            <Shield size={48} color="#EF4444" style={{ margin: "0 auto 20px auto" }} />
            <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#1F2937", marginBottom: "10px" }}>Invalid Invitation</h2>
            <p style={{ fontSize: "14px", color: "#4B5563", marginBottom: "24px" }}>
              We could not locate an active background check invitation with this link. It may have expired or been completed already.
            </p>
            <button onClick={() => onNavigate && onNavigate("home")} style={{ background: "#374151", color: "#FFFFFF", border: "none", borderRadius: "4px", padding: "10px 20px", fontSize: "13px", cursor: "pointer" }}>
              Back to Portal
            </button>
          </div>
        </div>
        <Footer isDarkMode={isDarkMode} />
      </div>
    );
  }

<<<<<<< HEAD
  // Render fields for current active tab
  const renderFields = () => {
    switch (activeTab) {
      case "personal-info":
        return (
          <div>
            <h3 style={sectionHeading}>Personal Information</h3>
            <div style={grid3}>
=======


  const products = inviteData.selectedProducts || [];
  const hasDriving = products.some((p: string) => p.includes("driving") || p.includes("cdlis"));
  const hasDrug = products.some((p: string) => p.includes("panel") || p.includes("drug"));
  const hasEducation = products.some((p: string) => p.includes("education"));
  const hasEmployment = products.some((p: string) => p.includes("employment"));

  return (
    <div style={{ minHeight: "100vh", background: isDarkMode ? "#1A1C21" : "#F3F4F6", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      {/* Branding Top bar */}
      <div style={{ background: "#FFFFFF", borderBottom: "1px solid #E5E7EB", padding: "16px 40px", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <img src="/evalright-logo.jpg" alt="EvalRight Logo" style={{ height: "36px", width: "auto" }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#4B5563" }}>
            <Shield size={14} color="#10B981" />
            <span>Secure SSL Encrypted Portal</span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div style={{ flex: 1, maxWidth: "900px", width: "100%", margin: "32px auto", padding: "0 20px" }}>
        {/* Intro */}
        <div style={{ background: "linear-gradient(135deg, #C70039 0%, #900028 100%)", borderRadius: "8px 8px 0 0", padding: "28px 30px", color: "#FFFFFF" }}>
          <span style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", background: "rgba(255,255,255,0.2)", padding: "4px 8px", borderRadius: "4px", letterSpacing: "0.5px" }}>
            Invitation Code: {inviteData.inviteId}
          </span>
          <h1 style={{ fontSize: "22px", fontWeight: 600, marginTop: "12px", marginBottom: "8px" }}>Background Check Authorization Portal</h1>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.85)", lineHeight: 1.5, margin: 0 }}>
            Dear {inviteData.name}, please complete the dynamic authorization form below. The fields in this form are customized based on the background check searches ordered by the employer.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ background: "#FFFFFF", borderRadius: "0 0 8px 8px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", padding: "30px" }}>
          


          {errorMsg && (
            <div style={{ background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: "4px", padding: "12px 16px", color: "#B91C1C", fontSize: "14px", fontWeight: 500, marginBottom: "24px" }}>
              ⚠️ {errorMsg}
            </div>
          )}

          {/* Section 1: General Personal Info */}
          <div style={{ marginBottom: "32px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 600, color: "rgb(199, 0, 57)", marginBottom: "16px", borderBottom: "2px solid #F3F4F6", paddingBottom: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
              <User size={16} /> 1. Personal Information
            </h3>
            
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr 1.2fr", gap: "16px", marginBottom: "16px" }}>
>>>>>>> 0a3811cd9fe814f5e37ab930e0a31979b7a14308
              <div>
                <label style={formLabel}>First Name *</label>
                <input style={formInput} value={formData.firstName} onChange={(e) => handleChange("firstName", e.target.value)} required />
              </div>
              <div>
                <label style={formLabel}>Middle Name</label>
                <input style={formInput} value={formData.middleName} onChange={(e) => handleChange("middleName", e.target.value)} />
              </div>
              <div>
                <label style={formLabel}>Last Name *</label>
                <input style={formInput} value={formData.lastName} onChange={(e) => handleChange("lastName", e.target.value)} required />
              </div>
            </div>
<<<<<<< HEAD
            <div style={grid3}>
=======

            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr 1.2fr", gap: "16px", marginBottom: "16px" }}>
>>>>>>> 0a3811cd9fe814f5e37ab930e0a31979b7a14308
              <div>
                <label style={formLabel}>Email Address *</label>
                <input style={formInput} type="email" value={formData.email} onChange={(e) => handleChange("email", e.target.value)} required />
              </div>
              <div>
<<<<<<< HEAD
                <label style={formLabel}>Contact Phone *</label>
                <input style={formInput} value={formData.phone} onChange={(e) => handleChange("phone", e.target.value)} required />
              </div>
              <div>
                <label style={formLabel}>Date of Birth * (MM/DD/YYYY)</label>
                <input style={formInput} placeholder="e.g. 05/18/1992" value={formData.dob} onChange={(e) => handleChange("dob", e.target.value)} required />
              </div>
            </div>
            <div style={grid3}>
              <div>
                <label style={formLabel}>Gender *</label>
                <select style={formSelect} value={formData.gender} onChange={(e) => handleChange("gender", e.target.value)} required>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label style={formLabel}>Father's Name *</label>
                <input style={formInput} value={formData.fatherName} onChange={(e) => handleChange("fatherName", e.target.value)} required />
              </div>
              <div>
                <label style={formLabel}>Country *</label>
                <input style={formInput} value={formData.country} onChange={(e) => handleChange("country", e.target.value)} required />
              </div>
            </div>
            <div style={grid4}>
              <div style={{ gridColumn: "span 2" }}>
=======
                <label style={formLabel}>Date of Birth * (MM/DD/YYYY)</label>
                <input style={formInput} placeholder="e.g. 05/18/1992" value={formData.dob} onChange={(e) => handleChange("dob", e.target.value)} required />
              </div>
              <div>
                <label style={formLabel}>Aadhaar Number (ADHR) *</label>
                <input style={formInput} type="password" placeholder="12 digits, e.g. 123456789012" maxLength={12} value={formData.adhr} onChange={(e) => handleChange("adhr", e.target.value.replace(/\D/g, ""))} required />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1.2fr 1fr 1fr", gap: "16px" }}>
              <div>
>>>>>>> 0a3811cd9fe814f5e37ab930e0a31979b7a14308
                <label style={formLabel}>Street Address *</label>
                <input style={formInput} value={formData.street} onChange={(e) => handleChange("street", e.target.value)} required />
              </div>
              <div>
                <label style={formLabel}>City *</label>
                <input style={formInput} value={formData.city} onChange={(e) => handleChange("city", e.target.value)} required />
              </div>
              <div>
                <label style={formLabel}>State *</label>
                <select style={formSelect} value={formData.state} onChange={(e) => handleChange("state", e.target.value)} required>
                  <option value="">Select</option>
                  {INDIA_STATES.map(st => <option key={st} value={st}>{st}</option>)}
                </select>
              </div>
              <div>
                <label style={formLabel}>Zip Code *</label>
                <input style={formInput} maxLength={6} value={formData.zip} onChange={(e) => handleChange("zip", e.target.value.replace(/\D/g, ""))} required />
              </div>
            </div>
<<<<<<< HEAD
          </div>
        );

      case "id-verification-aadhar":
        return (
          <div>
            <h3 style={sectionHeading}>Aadhaar Card Verification</h3>
            <div style={grid2}>
              <div>
                <label style={formLabel}>Full Name (on Aadhaar Card) *</label>
                <input style={formInput} placeholder="As printed on card" value={formData.id_aadhar_name} onChange={(e) => handleChange("id_aadhar_name", e.target.value)} />
              </div>
              <div>
                <label style={formLabel}>Aadhaar Number (12 digits) *</label>
                <input style={formInput} maxLength={12} placeholder="123456789012" value={formData.id_aadhar_number} onChange={(e) => handleChange("id_aadhar_number", e.target.value.replace(/\D/g, ""))} />
              </div>
            </div>
            <div style={grid2}>
              <div>
                <label style={formLabel}>Father's Name (on Aadhaar) *</label>
                <input style={formInput} value={formData.id_aadhar_fatherName} onChange={(e) => handleChange("id_aadhar_fatherName", e.target.value)} />
              </div>
              <div>
                <label style={formLabel}>Date of Birth (on Aadhaar) *</label>
                <input style={formInput} placeholder="DD/MM/YYYY" value={formData.id_aadhar_dob} onChange={(e) => handleChange("id_aadhar_dob", e.target.value)} />
              </div>
            </div>
            <DocumentUploadField 
              label="Upload Aadhaar Card Document *" 
              onChange={(file) => handleChange("id_aadhar_fileName", file ? file.name : "")}
              fileName={formData.id_aadhar_fileName}
            />
          </div>
        );

      case "id-verification-pan":
        return (
          <div>
            <h3 style={sectionHeading}>PAN Card Verification</h3>
            <div style={grid2}>
              <div>
                <label style={formLabel}>Full Name (on PAN Card) *</label>
                <input style={formInput} value={formData.id_pan_name} onChange={(e) => handleChange("id_pan_name", e.target.value)} />
              </div>
              <div>
                <label style={formLabel}>PAN Number (10 characters) *</label>
                <input style={formInput} maxLength={10} placeholder="ABCDE1234F" value={formData.id_pan_number} onChange={(e) => handleChange("id_pan_number", e.target.value.toUpperCase())} />
              </div>
            </div>
            <div style={grid2}>
              <div>
                <label style={formLabel}>Father's Name (on PAN Card) *</label>
                <input style={formInput} value={formData.id_pan_fatherName} onChange={(e) => handleChange("id_pan_fatherName", e.target.value)} />
              </div>
              <div>
                <label style={formLabel}>Date of Birth (on PAN Card) *</label>
                <input style={formInput} placeholder="DD/MM/YYYY" value={formData.id_pan_dob} onChange={(e) => handleChange("id_pan_dob", e.target.value)} />
              </div>
            </div>
            <DocumentUploadField 
              label="Upload PAN Card Document *" 
              onChange={(file) => handleChange("id_pan_fileName", file ? file.name : "")}
              fileName={formData.id_pan_fileName}
            />
          </div>
        );

      case "id-verification-dl":
        return (
          <div>
            <h3 style={sectionHeading}>Driver's License Verification</h3>
            <div style={grid2}>
              <div>
                <label style={formLabel}>Full Name on License *</label>
                <input style={formInput} value={formData.id_dl_name} onChange={(e) => handleChange("id_dl_name", e.target.value)} />
              </div>
              <div>
                <label style={formLabel}>License Number *</label>
                <input style={formInput} value={formData.id_dl_number} onChange={(e) => handleChange("id_dl_number", e.target.value)} />
              </div>
            </div>
            <div style={grid3}>
              <div>
                <label style={formLabel}>Father's Name *</label>
                <input style={formInput} value={formData.id_dl_fatherName} onChange={(e) => handleChange("id_dl_fatherName", e.target.value)} />
              </div>
              <div>
                <label style={formLabel}>Date of Birth *</label>
                <input style={formInput} placeholder="DD/MM/YYYY" value={formData.id_dl_dob} onChange={(e) => handleChange("id_dl_dob", e.target.value)} />
              </div>
              <div>
                <label style={formLabel}>State of Issuance *</label>
                <select style={formSelect} value={formData.id_dl_state} onChange={(e) => handleChange("id_dl_state", e.target.value)}>
                  <option value="">Select State</option>
                  {INDIA_STATES.map(st => <option key={st} value={st}>{st}</option>)}
                </select>
              </div>
            </div>
            <div style={{ marginTop: "16px" }}>
              <label style={formLabel}>Date of Issue</label>
              <input style={formInput} placeholder="MM/DD/YYYY" value={formData.id_dl_issueDate} onChange={(e) => handleChange("id_dl_issueDate", e.target.value)} />
            </div>
            <div style={{ marginTop: "16px" }}>
              <label style={formLabel}>Address on License</label>
              <textarea style={formTextarea} value={formData.id_dl_address} onChange={(e) => handleChange("id_dl_address", e.target.value)} />
            </div>
            <DocumentUploadField 
              label="Upload Driver's License *" 
              onChange={(file) => handleChange("id_dl_fileName", file ? file.name : "")}
              fileName={formData.id_dl_fileName}
            />
          </div>
        );

      case "id-verification-voterid":
        return (
          <div>
            <h3 style={sectionHeading}>Voter ID Verification</h3>
            <div style={grid2}>
              <div>
                <label style={formLabel}>Full Name on Voter ID *</label>
                <input style={formInput} value={formData.id_voterid_name} onChange={(e) => handleChange("id_voterid_name", e.target.value)} />
              </div>
              <div>
                <label style={formLabel}>Voter ID Number *</label>
                <input style={formInput} value={formData.id_voterid_number} onChange={(e) => handleChange("id_voterid_number", e.target.value)} />
              </div>
            </div>
            <div style={grid3}>
              <div>
                <label style={formLabel}>Father's Name *</label>
                <input style={formInput} value={formData.id_voterid_fatherName} onChange={(e) => handleChange("id_voterid_fatherName", e.target.value)} />
              </div>
              <div>
                <label style={formLabel}>Date of Birth *</label>
                <input style={formInput} placeholder="DD/MM/YYYY" value={formData.id_voterid_dob} onChange={(e) => handleChange("id_voterid_dob", e.target.value)} />
              </div>
              <div>
                <label style={formLabel}>State *</label>
                <select style={formSelect} value={formData.id_voterid_state} onChange={(e) => handleChange("id_voterid_state", e.target.value)}>
                  <option value="">Select State</option>
                  {INDIA_STATES.map(st => <option key={st} value={st}>{st}</option>)}
                </select>
              </div>
            </div>
            <DocumentUploadField 
              label="Upload Voter ID Card *" 
              onChange={(file) => handleChange("id_voterid_fileName", file ? file.name : "")}
              fileName={formData.id_voterid_fileName}
            />
          </div>
        );

      case "id-verification-passport":
        return (
          <div>
            <h3 style={sectionHeading}>Passport Verification</h3>
            <div style={grid2}>
              <div>
                <label style={formLabel}>Full Name on Passport *</label>
                <input style={formInput} value={formData.id_passport_name} onChange={(e) => handleChange("id_passport_name", e.target.value)} />
              </div>
              <div>
                <label style={formLabel}>Passport Number *</label>
                <input style={formInput} value={formData.id_passport_number} onChange={(e) => handleChange("id_passport_number", e.target.value)} />
              </div>
            </div>
            <div style={grid2}>
              <div>
                <label style={formLabel}>Father's Name *</label>
                <input style={formInput} value={formData.id_passport_fatherName} onChange={(e) => handleChange("id_passport_fatherName", e.target.value)} />
              </div>
              <div>
                <label style={formLabel}>Date of Birth *</label>
                <input style={formInput} placeholder="DD/MM/YYYY" value={formData.id_passport_dob} onChange={(e) => handleChange("id_passport_dob", e.target.value)} />
              </div>
            </div>
            <div style={grid3}>
              <div>
                <label style={formLabel}>Date of Issue *</label>
                <input style={formInput} placeholder="MM/DD/YYYY" value={formData.id_passport_issueDate} onChange={(e) => handleChange("id_passport_issueDate", e.target.value)} />
              </div>
              <div>
                <label style={formLabel}>Place of Issue *</label>
                <input style={formInput} value={formData.id_passport_place} onChange={(e) => handleChange("id_passport_place", e.target.value)} />
              </div>
              <div>
                <label style={formLabel}>Date of Expiry *</label>
                <input style={formInput} placeholder="MM/DD/YYYY" value={formData.id_passport_expiry} onChange={(e) => handleChange("id_passport_expiry", e.target.value)} />
              </div>
            </div>
            <DocumentUploadField 
              label="Upload Passport Document *" 
              onChange={(file) => handleChange("id_passport_fileName", file ? file.name : "")}
              fileName={formData.id_passport_fileName}
            />
          </div>
        );

      case "uan-verification":
        return (
          <div>
            <h3 style={sectionHeading}>UAN Verification</h3>
            <div style={grid3}>
              <div>
                <label style={formLabel}>UAN Number *</label>
                <input style={formInput} value={formData.uan_number} onChange={(e) => handleChange("uan_number", e.target.value)} />
              </div>
              <div>
                <label style={formLabel}>Father's Name *</label>
                <input style={formInput} value={formData.uan_fatherName} onChange={(e) => handleChange("uan_fatherName", e.target.value)} />
              </div>
              <div>
                <label style={formLabel}>Date of Birth *</label>
                <input style={formInput} placeholder="DD/MM/YYYY" value={formData.uan_dob} onChange={(e) => handleChange("uan_dob", e.target.value)} />
              </div>
            </div>
          </div>
        );

      case "supplier-address":
        return (
          <div>
            <h3 style={sectionHeading}>Supplier Address Check</h3>
            <div>
              <label style={formLabel}>Supplier Name *</label>
              <input style={formInput} value={formData.supplier_name} onChange={(e) => handleChange("supplier_name", e.target.value)} />
            </div>
            <div style={{ marginTop: "16px" }}>
              <label style={formLabel}>Supplier Address *</label>
              <textarea style={formTextarea} value={formData.supplier_address} onChange={(e) => handleChange("supplier_address", e.target.value)} />
            </div>
          </div>
        );

      case "ssn-check":
        return (
          <div>
            <h3 style={sectionHeading}>SSN Check</h3>
            <div>
              <label style={formLabel}>SSN Number *</label>
              <input style={formInput} placeholder="XXX-XX-XXXX" value={formData.ssn_number} onChange={(e) => handleChange("ssn_number", e.target.value)} />
            </div>
          </div>
        );

      case "social-media-check":
        return (
          <div>
            <h3 style={sectionHeading}>Social Media Check</h3>
            <div>
              <label style={formLabel}>Candidate Name *</label>
              <input style={formInput} placeholder="Full Name" value={formData.social_media_name} onChange={(e) => handleChange("social_media_name", e.target.value)} />
            </div>
          </div>
        );

      case "right-to-work":
        return (
          <div>
            <h3 style={sectionHeading}>Right to Work Verification</h3>
            <div style={grid2}>
              <div>
                <label style={formLabel}>Full Name *</label>
                <input style={formInput} value={formData.rtw_name} onChange={(e) => handleChange("rtw_name", e.target.value)} />
              </div>
              <div>
                <label style={formLabel}>Country of Citizenship *</label>
                <input style={formInput} value={formData.rtw_country} onChange={(e) => handleChange("rtw_country", e.target.value)} />
              </div>
            </div>
          </div>
        );

      case "reference-check":
        return (
          <div>
            <h3 style={sectionHeading}>Reference Check</h3>
            <div style={grid2}>
              <div>
                <label style={formLabel}>Reference Contact Name *</label>
                <input style={formInput} value={formData.ref_name} onChange={(e) => handleChange("ref_name", e.target.value)} />
              </div>
              <div>
                <label style={formLabel}>Relationship / Association *</label>
                <input style={formInput} placeholder="e.g. Former Manager" value={formData.ref_association} onChange={(e) => handleChange("ref_association", e.target.value)} />
              </div>
            </div>
            <div style={grid3}>
              <div>
                <label style={formLabel}>Organization/Company Name</label>
                <input style={formInput} value={formData.ref_organization} onChange={(e) => handleChange("ref_organization", e.target.value)} />
              </div>
              <div>
                <label style={formLabel}>Designation</label>
                <input style={formInput} value={formData.ref_designation} onChange={(e) => handleChange("ref_designation", e.target.value)} />
              </div>
              <div>
                <label style={formLabel}>Years Known</label>
                <input style={formInput} type="number" value={formData.ref_years} onChange={(e) => handleChange("ref_years", e.target.value)} />
              </div>
            </div>
            <div style={grid2}>
              <div>
                <label style={formLabel}>Reference Email Address *</label>
                <input style={formInput} type="email" value={formData.ref_email} onChange={(e) => handleChange("ref_email", e.target.value)} />
              </div>
              <div>
                <label style={formLabel}>Reference Contact Phone *</label>
                <input style={formInput} value={formData.ref_contactNo} onChange={(e) => handleChange("ref_contactNo", e.target.value)} />
              </div>
            </div>
          </div>
        );

      case "address-verification":
        return renderAddressCheckFields("Address Verification", "addr");
      case "criminal-record-check":
        return renderAddressCheckFields("Criminal Record Check Address", "crim");
      case "police-verification-check":
        return renderAddressCheckFields("Police Verification Address", "police");
      case "nationwide-criminal-check":
        return renderAddressCheckFields("Nationwide Criminal Check Address", "natcrim");
      case "national-sex-offender-registry-check":
        return renderAddressCheckFields("Sex Offender Registry Address", "sexoff");

      case "ofac-check":
        return renderDBCheckFields("OFAC Watchlist Check", "ofac");
      case "indian-database-check":
        return renderDBCheckFields("Indian Database Check", "ind_db");
      case "global-database-check":
        return renderDBCheckFields("Global Database Check", "glob_db");

      case "medical-examination-test":
        return (
          <div>
            <h3 style={sectionHeading}>Medical Examination Test</h3>
            <div>
              <label style={formLabel}>Full Legal Name *</label>
              <input style={formInput} value={formData.med_name} onChange={(e) => handleChange("med_name", e.target.value)} />
            </div>
          </div>
        );

      case "directorship-check":
        return (
          <div>
            <h3 style={sectionHeading}>Directorship Check</h3>
            <div>
              <label style={formLabel}>Full Legal Name *</label>
              <input style={formInput} value={formData.directorshipFullName} onChange={(e) => handleChange("directorshipFullName", e.target.value)} />
            </div>
          </div>
        );

      case "gap-analysis":
        return (
          <div>
            <h3 style={sectionHeading}>Gap Analysis</h3>
            <div>
              <label style={formLabel}>Details of Gaps (Education or Employment Gaps) *</label>
              <textarea style={formTextarea} placeholder="Describe the reasons for gaps in your resume..." value={formData.gap_details} onChange={(e) => handleChange("gap_details", e.target.value)} />
            </div>
            <div style={grid2}>
              <div>
                <label style={formLabel}>Gap Period From *</label>
                <input style={formInput} placeholder="MM/YYYY" value={formData.gap_from} onChange={(e) => handleChange("gap_from", e.target.value)} />
              </div>
              <div>
                <label style={formLabel}>Gap Period To *</label>
                <input style={formInput} placeholder="MM/YYYY" value={formData.gap_to} onChange={(e) => handleChange("gap_to", e.target.value)} />
              </div>
            </div>
          </div>
        );

      case "freelancing-check":
        return (
          <div>
            <h3 style={sectionHeading}>Freelancing Check</h3>
            <div>
              <label style={formLabel}>Client Name / Project Name *</label>
              <input style={formInput} value={formData.free_clientName} onChange={(e) => handleChange("free_clientName", e.target.value)} />
            </div>
            <div style={grid2}>
              <div>
                <label style={formLabel}>Freelancing Tenure From *</label>
                <input style={formInput} placeholder="MM/YYYY" value={formData.free_tenureFrom} onChange={(e) => handleChange("free_tenureFrom", e.target.value)} />
              </div>
              <div>
                <label style={formLabel}>Freelancing Tenure To *</label>
                <input style={formInput} placeholder="MM/YYYY" value={formData.free_tenureTo} onChange={(e) => handleChange("free_tenureTo", e.target.value)} />
              </div>
            </div>
          </div>
        );

      case "form-16-check":
        return (
          <div>
            <h3 style={sectionHeading}>Form 16 Check</h3>
            <div>
              <label style={formLabel}>PAN Number *</label>
              <input style={formInput} maxLength={10} placeholder="ABCDE1234F" value={formData.f16_pan} onChange={(e) => handleChange("f16_pan", e.target.value.toUpperCase())} />
            </div>
          </div>
        );

      case "credit-check":
        return (
          <div>
            <h3 style={sectionHeading}>Credit Check</h3>
            <div style={grid3}>
              <div>
                <label style={formLabel}>Full Legal Name *</label>
                <input style={formInput} value={formData.credit_name} onChange={(e) => handleChange("credit_name", e.target.value)} />
              </div>
              <div>
                <label style={formLabel}>Date of Birth *</label>
                <input style={formInput} placeholder="MM/DD/YYYY" value={formData.credit_dob} onChange={(e) => handleChange("credit_dob", e.target.value)} />
              </div>
              <div>
                <label style={formLabel}>PAN Number *</label>
                <input style={formInput} maxLength={10} placeholder="ABCDE1234F" value={formData.credit_pan} onChange={(e) => handleChange("credit_pan", e.target.value.toUpperCase())} />
              </div>
            </div>
          </div>
        );

      case "26as-check":
        return (
          <div>
            <h3 style={sectionHeading}>26AS Check</h3>
            <div style={grid2}>
              <div>
                <label style={formLabel}>PAN Number *</label>
                <input style={formInput} maxLength={10} placeholder="ABCDE1234F" value={formData.a26as_pan} onChange={(e) => handleChange("a26as_pan", e.target.value.toUpperCase())} />
              </div>
              <div>
                <label style={formLabel}>Full Name on 26AS *</label>
                <input style={formInput} value={formData.a26as_name} onChange={(e) => handleChange("a26as_name", e.target.value)} />
              </div>
            </div>
          </div>
        );

      case "exit":
        return (
          <div>
            <h3 style={sectionHeading}>Exit Verification</h3>
            <div style={grid2}>
              <div>
                <label style={formLabel}>Full Name *</label>
                <input style={formInput} value={formData.exit_name} onChange={(e) => handleChange("exit_name", e.target.value)} />
              </div>
              <div>
                <label style={formLabel}>Employee Code *</label>
                <input style={formInput} value={formData.exit_employeeCode} onChange={(e) => handleChange("exit_employeeCode", e.target.value)} />
              </div>
            </div>
            <div style={grid3}>
              <div>
                <label style={formLabel}>Designation *</label>
                <input style={formInput} value={formData.exit_designation} onChange={(e) => handleChange("exit_designation", e.target.value)} />
              </div>
              <div>
                <label style={formLabel}>Department</label>
                <input style={formInput} value={formData.exit_department} onChange={(e) => handleChange("exit_department", e.target.value)} />
              </div>
              <div>
                <label style={formLabel}>Gender</label>
                <select style={formSelect} value={formData.exit_gender} onChange={(e) => handleChange("exit_gender", e.target.value)}>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div style={grid2}>
              <div>
                <label style={formLabel}>Mobile Number</label>
                <input style={formInput} value={formData.exit_mobileNo} onChange={(e) => handleChange("exit_mobileNo", e.target.value)} />
              </div>
              <div>
                <label style={formLabel}>Email Address</label>
                <input style={formInput} type="email" value={formData.exit_email} onChange={(e) => handleChange("exit_email", e.target.value)} />
              </div>
            </div>
            <div style={grid3}>
              <div>
                <label style={formLabel}>Date of Joining *</label>
                <input style={formInput} placeholder="MM/DD/YYYY" value={formData.exit_dateOfJoining} onChange={(e) => handleChange("exit_dateOfJoining", e.target.value)} />
              </div>
              <div>
                <label style={formLabel}>Date of Leaving *</label>
                <input style={formInput} placeholder="MM/DD/YYYY" value={formData.exit_dateOfLeaving} onChange={(e) => handleChange("exit_dateOfLeaving", e.target.value)} />
              </div>
              <div>
                <label style={formLabel}>Mode of Exit</label>
                <input style={formInput} placeholder="e.g. Resigned" value={formData.exit_modeOfExit} onChange={(e) => handleChange("exit_modeOfExit", e.target.value)} />
              </div>
            </div>
          </div>
        );

      case "itr-check":
        return (
          <div>
            <h3 style={sectionHeading}>ITR Check</h3>
            <div style={grid2}>
              <div>
                <label style={formLabel}>PAN Number *</label>
                <input style={formInput} maxLength={10} placeholder="ABCDE1234F" value={formData.itr_pan} onChange={(e) => handleChange("itr_pan", e.target.value.toUpperCase())} />
              </div>
              <div>
                <label style={formLabel}>Assessment Year *</label>
                <input style={formInput} placeholder="e.g. 2025-26" value={formData.itr_assessmentYear} onChange={(e) => handleChange("itr_assessmentYear", e.target.value)} />
              </div>
            </div>
          </div>
        );

      case "cv-check":
        return (
          <div>
            <h3 style={sectionHeading}>CV / Resume Verification</h3>
            <p style={subLabel}>Please upload your latest professional CV or Resume for verification.</p>
            <DocumentUploadField 
              label="Upload CV/Resume Document *" 
              onChange={(file) => handleChange("cv_fileName", file ? file.name : "")}
              fileName={formData.cv_fileName}
            />
          </div>
        );

      case "authorization":
        return (
          <div>
            <h3 style={sectionHeading}>Authorization Letter Check</h3>
            <p style={subLabel}>Please download, sign, and upload the formal authorization Letter of Authority (LOA) for background check processing.</p>
            <DocumentUploadField 
              label="Upload Signed Authorization LOA *" 
              onChange={(file) => handleChange("auth_fileName", file ? file.name : "")}
              fileName={formData.auth_fileName}
            />
          </div>
        );

      case "drug-test":
        return (
          <div>
            <h3 style={sectionHeading}>Drug Screening Details</h3>
            <div style={grid2}>
              <div>
                <label style={formLabel}>Full Legal Name *</label>
                <input style={formInput} value={formData.drug_name} onChange={(e) => handleChange("drug_name", e.target.value)} />
              </div>
              <div>
                <label style={formLabel}>Preferred Clinic ZIP Code / City *</label>
                <input style={formInput} placeholder="e.g. 60611" value={formData.drug_clinicZip} onChange={(e) => handleChange("drug_clinicZip", e.target.value)} />
              </div>
            </div>
            <div style={{ marginTop: "20px" }}>
              <label style={{ display: "flex", alignItems: "flex-start", gap: "10px", cursor: "pointer", userSelect: "none" }}>
                <input 
                  type="checkbox" 
                  checked={formData.drug_consent} 
                  onChange={(e) => handleChange("drug_consent", e.target.checked)}
                  style={{ marginTop: "4px", width: "16px", height: "16px", accentColor: "rgb(199, 0, 57)" }} 
                />
                <span style={{ fontSize: "13px", color: "#4B5563", lineHeight: 1.4 }}>
                  I hereby authorize EvalRight and its partner drug screening laboratories to collect a specimen for testing, analyze it for controlled substances, and report the findings back to the requesting employer. *
                </span>
              </label>
            </div>
          </div>
        );

      case "education-verification":
        return (
          <div>
            <h3 style={sectionHeading}>Highest Education Verification</h3>
            <div style={grid2}>
              <div>
                <label style={formLabel}>Qualification / Degree *</label>
                <select style={formSelect} value={formData.edu_qualification} onChange={(e) => handleChange("edu_qualification", e.target.value)}>
                  <option value="">Select Degree</option>
                  <option value="High School">High School Diploma</option>
                  <option value="Associate">Associate's Degree</option>
                  <option value="Bachelor">Bachelor's Degree</option>
                  <option value="Master">Master's Degree</option>
                  <option value="Doctorate">Doctorate / Ph.D.</option>
                </select>
              </div>
              <div>
                <label style={formLabel}>Specialization / Major</label>
                <input style={formInput} placeholder="e.g. Computer Science" value={formData.edu_specialization} onChange={(e) => handleChange("edu_specialization", e.target.value)} />
              </div>
            </div>
            <div style={grid2}>
              <div>
                <label style={formLabel}>School/College Name *</label>
                <input style={formInput} value={formData.edu_collegeName} onChange={(e) => handleChange("edu_collegeName", e.target.value)} />
              </div>
              <div>
                <label style={formLabel}>University / Board Name *</label>
                <input style={formInput} value={formData.edu_university} onChange={(e) => handleChange("edu_university", e.target.value)} />
              </div>
            </div>
            <div style={grid3}>
              <div>
                <label style={formLabel}>Graduation Year *</label>
                <input style={formInput} type="number" placeholder="YYYY" value={formData.edu_yearOfGraduated} onChange={(e) => handleChange("edu_yearOfGraduated", e.target.value)} />
              </div>
              <div>
                <label style={formLabel}>Period of Study (From) *</label>
                <input style={formInput} placeholder="MM/YYYY" value={formData.edu_periodOfStudyFrom} onChange={(e) => handleChange("edu_periodOfStudyFrom", e.target.value)} />
              </div>
              <div>
                <label style={formLabel}>Period of Study (To) *</label>
                <input style={formInput} placeholder="MM/YYYY" value={formData.edu_periodOfStudyTo} onChange={(e) => handleChange("edu_periodOfStudyTo", e.target.value)} />
              </div>
            </div>
            <div style={grid2}>
              <div>
                <label style={formLabel}>College Address</label>
                <input style={formInput} value={formData.edu_collegeAddress} onChange={(e) => handleChange("edu_collegeAddress", e.target.value)} />
              </div>
              <div>
                <label style={formLabel}>College Email Addresses</label>
                <input style={formInput} placeholder="comma separated" value={formData.edu_collegeEmails} onChange={(e) => handleChange("edu_collegeEmails", e.target.value)} />
              </div>
            </div>
            <div style={grid4}>
              <div style={{ gridColumn: "span 2" }}>
                <label style={formLabel}>College Contact Phone</label>
                <input style={formInput} value={formData.edu_contactNo} onChange={(e) => handleChange("edu_contactNo", e.target.value)} />
              </div>
              <div>
                <label style={formLabel}>City</label>
                <input style={formInput} value={formData.edu_city} onChange={(e) => handleChange("edu_city", e.target.value)} />
              </div>
              <div>
                <label style={formLabel}>Pincode</label>
                <input style={formInput} value={formData.edu_pincode} onChange={(e) => handleChange("edu_pincode", e.target.value)} />
              </div>
            </div>
            <div style={grid2}>
              <DocumentUploadField 
                label="Upload Degree Marksheet *" 
                onChange={(file) => handleChange("edu_marksheetFileName", file ? file.name : "")}
                fileName={formData.edu_marksheetFileName}
              />
              <DocumentUploadField 
                label="Upload Degree Certificate (Optional)" 
                onChange={(file) => handleChange("edu_degreeFileName", file ? file.name : "")}
                fileName={formData.edu_degreeFileName}
              />
            </div>
          </div>
        );

      case "employment-verification":
        return (
          <div>
            <h3 style={sectionHeading}>Previous Employment Verification</h3>
            <div style={grid2}>
              <div>
                <label style={formLabel}>Employer / Company Name *</label>
                <input style={formInput} value={formData.emp_companyName} onChange={(e) => handleChange("emp_companyName", e.target.value)} />
              </div>
              <div>
                <label style={formLabel}>Job Title / Designation *</label>
                <input style={formInput} value={formData.emp_designation} onChange={(e) => handleChange("emp_designation", e.target.value)} />
              </div>
            </div>
            <div style={grid3}>
              <div>
                <label style={formLabel}>Employee Code</label>
                <input style={formInput} value={formData.emp_employeeCode} onChange={(e) => handleChange("emp_employeeCode", e.target.value)} />
              </div>
              <div>
                <label style={formLabel}>Employment Type</label>
                <select style={formSelect} value={formData.emp_employmentType} onChange={(e) => handleChange("emp_employmentType", e.target.value)}>
                  <option value="">Select Type</option>
                  <option value="Full-Time">Full-Time</option>
                  <option value="Part-Time">Part-Time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
              <div>
                <label style={formLabel}>Reason for Leaving</label>
                <input style={formInput} value={formData.emp_reasonForLeaving} onChange={(e) => handleChange("emp_reasonForLeaving", e.target.value)} />
              </div>
            </div>
            <div style={grid2}>
              <div>
                <label style={formLabel}>Date of Joining *</label>
                <input style={formInput} placeholder="MM/DD/YYYY" value={formData.emp_dateOfJoining} onChange={(e) => handleChange("emp_dateOfJoining", e.target.value)} />
              </div>
              <div>
                <label style={formLabel}>Date of Relieving *</label>
                <input style={formInput} placeholder="MM/DD/YYYY or 'Present'" value={formData.emp_dateOfRelieving} onChange={(e) => handleChange("emp_dateOfRelieving", e.target.value)} />
              </div>
            </div>
            <div style={grid3}>
              <div>
                <label style={formLabel}>Company Address</label>
                <input style={formInput} value={formData.emp_address} onChange={(e) => handleChange("emp_address", e.target.value)} />
              </div>
              <div>
                <label style={formLabel}>City</label>
                <input style={formInput} value={formData.emp_city} onChange={(e) => handleChange("emp_city", e.target.value)} />
              </div>
              <div>
                <label style={formLabel}>State</label>
                <input style={formInput} value={formData.emp_state} onChange={(e) => handleChange("emp_state", e.target.value)} />
              </div>
            </div>
            <div style={grid3}>
              <div>
                <label style={formLabel}>HR Manager Name</label>
                <input style={formInput} value={formData.emp_hrName} onChange={(e) => handleChange("emp_hrName", e.target.value)} />
              </div>
              <div>
                <label style={formLabel}>HR Manager Email</label>
                <input style={formInput} value={formData.emp_hrEmail} onChange={(e) => handleChange("emp_hrEmail", e.target.value)} />
              </div>
              <div>
                <label style={formLabel}>HR Contact Number</label>
                <input style={formInput} value={formData.emp_hrContactNo} onChange={(e) => handleChange("emp_hrContactNo", e.target.value)} />
              </div>
            </div>
            <div style={grid3}>
              <div>
                <label style={formLabel}>Supervisor Name</label>
                <input style={formInput} value={formData.emp_supervisorName} onChange={(e) => handleChange("emp_supervisorName", e.target.value)} />
              </div>
              <div>
                <label style={formLabel}>Supervisor Email</label>
                <input style={formInput} value={formData.emp_supervisorEmail} onChange={(e) => handleChange("emp_supervisorEmail", e.target.value)} />
              </div>
              <div>
                <label style={formLabel}>Supervisor Contact Phone</label>
                <input style={formInput} value={formData.emp_supervisorContact} onChange={(e) => handleChange("emp_supervisorContact", e.target.value)} />
              </div>
            </div>
            <DocumentUploadField 
              label="Upload Experience Letter / Relieving Letter / Appointment Letter *" 
              onChange={(file) => handleChange("emp_fileName", file ? file.name : "")}
              fileName={formData.emp_fileName}
            />
          </div>
        );

      case "review-details":
        return renderReviewScreen();

      case "consent-sign":
        return (
          <div>
            <h3 style={sectionHeading}>FCRA Disclosure & Authorization</h3>
=======

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "16px" }}>
              <div>
                <DocumentUploadField 
                  label="Upload Aadhaar Card *" 
                  onChange={(file) => console.log("Uploaded Aadhaar Card:", file)}
                />
              </div>
              <div>
                <DocumentUploadField 
                  label="Upload PAN Card" 
                  onChange={(file) => console.log("Uploaded PAN Card:", file)}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Dynamic Requirements based on Order Selections */}
          {(hasDriving || hasDrug || hasEducation || hasEmployment) && (
            <div style={{ marginBottom: "32px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: 600, color: "rgb(199, 0, 57)", marginBottom: "16px", borderBottom: "2px solid #F3F4F6", paddingBottom: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
                <Landmark size={16} /> 2. Order Specific Requirements
              </h3>

              {/* Dynamic Sub-section: Driving Record */}
              {hasDriving && (
                <div style={dynamicCard}>
                  <h4 style={dynamicHeader}>
                    <Car size={16} color="rgb(199, 0, 57)" /> Motor Vehicle / Driving History Details
                  </h4>
                  <p style={dynamicDescription}>The employer has ordered a Driving History background check. Please enter your license details.</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "16px" }}>
                    <div>
                      <label style={formLabel}>Driver's License Number *</label>
                      <input style={formInput} value={formData.licenseNumber} onChange={(e) => handleChange("licenseNumber", e.target.value)} />
                    </div>
                    <div>
                      <label style={formLabel}>State of Issuance *</label>
                      <select style={formSelect} value={formData.licenseState} onChange={(e) => handleChange("licenseState", e.target.value)}>
                        <option value="">Select State</option>
                        {INDIA_STATES.map(st => <option key={st} value={st}>{st}</option>)}
                      </select>
                    </div>
                  </div>
                  <DocumentUploadField 
                    label="Upload Driver's License Document" 
                    onChange={(file) => console.log("Uploaded License:", file)}
                  />
                </div>
              )}

              {/* Dynamic Sub-section: Drug Test */}
              {hasDrug && (
                <div style={dynamicCard}>
                  <h4 style={dynamicHeader}>
                    <Award size={16} color="rgb(199, 0, 57)" /> Drug Screening Authorization
                  </h4>
                  <p style={dynamicDescription}>The employer has requested a Drug Screen test. Please provide a ZIP code so we can schedule you at the closest LabCorp or Quest Diagnostics clinic.</p>
                  
                  <div style={{ marginBottom: "16px" }}>
                    <label style={formLabel}>Preferred Clinic ZIP Code / City *</label>
                    <input style={formInput} placeholder="e.g. 60611" value={formData.clinicZip} onChange={(e) => handleChange("clinicZip", e.target.value)} />
                  </div>

                  <label style={{ display: "flex", alignItems: "flex-start", gap: "10px", cursor: "pointer", userSelect: "none" }}>
                    <input 
                      type="checkbox" 
                      checked={formData.drugConsent} 
                      onChange={(e) => handleChange("drugConsent", e.target.checked)}
                      style={{ marginTop: "4px", width: "16px", height: "16px", accentColor: "rgb(199, 0, 57)" }} 
                    />
                    <span style={{ fontSize: "13px", color: "#4B5563", lineHeight: 1.4 }}>
                      I hereby authorize EvalRight and its partner drug screening laboratories to collect a specimen for testing, analyze it for controlled substances, and report the findings back to the requesting employer. *
                    </span>
                  </label>
                  <DocumentUploadField 
                    label="Upload Drug Test Consent / Prescription Document" 
                    onChange={(file) => console.log("Uploaded Drug Test:", file)}
                  />
                </div>
              )}

              {/* Dynamic Sub-section: Education Verification */}
              {hasEducation && (
                <div style={dynamicCard}>
                  <h4 style={dynamicHeader}>
                    <Award size={16} color="rgb(199, 0, 57)" /> Education History Verification
                  </h4>
                  <p style={dynamicDescription}>The employer has requested an Education Verification. Please supply information regarding your highest degree earned.</p>
                  
                  <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "16px", marginBottom: "16px" }}>
                    <div>
                      <label style={formLabel}>School/University Name *</label>
                      <input style={formInput} placeholder="e.g. University of Illinois" value={formData.schoolName} onChange={(e) => handleChange("schoolName", e.target.value)} />
                    </div>
                    <div>
                      <label style={formLabel}>Degree Earned *</label>
                      <select style={formSelect} value={formData.degree} onChange={(e) => handleChange("degree", e.target.value)}>
                        <option value="">Select Degree</option>
                        <option value="High School">High School Diploma</option>
                        <option value="Associate">Associate's Degree</option>
                        <option value="Bachelor">Bachelor's Degree</option>
                        <option value="Master">Master's Degree</option>
                        <option value="Doctorate">Doctorate / Ph.D.</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "16px" }}>
                    <div>
                      <label style={formLabel}>Major / Field of Study</label>
                      <input style={formInput} placeholder="e.g. Computer Science" value={formData.major} onChange={(e) => handleChange("major", e.target.value)} />
                    </div>
                    <div>
                      <label style={formLabel}>Graduation Date * (MM/YYYY)</label>
                      <input style={formInput} placeholder="e.g. 05/2014" value={formData.gradDate} onChange={(e) => handleChange("gradDate", e.target.value)} />
                    </div>
                  </div>
                  <DocumentUploadField 
                    label="Upload Degree Certificate / Transcript" 
                    onChange={(file) => console.log("Uploaded Education:", file)}
                  />
                </div>
              )}

              {/* Dynamic Sub-section: Employment Verification */}
              {hasEmployment && (
                <div style={dynamicCard}>
                  <h4 style={dynamicHeader}>
                    <Briefcase size={16} color="rgb(199, 0, 57)" /> Previous Employment History
                  </h4>
                  <p style={dynamicDescription}>The employer has requested an Employment Verification. Please supply information regarding your most recent employer.</p>
                  
                  <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "16px", marginBottom: "16px" }}>
                    <div>
                      <label style={formLabel}>Employer / Company Name *</label>
                      <input style={formInput} placeholder="e.g. Acme Corporation" value={formData.employerName} onChange={(e) => handleChange("employerName", e.target.value)} />
                    </div>
                    <div>
                      <label style={formLabel}>Job Title *</label>
                      <input style={formInput} placeholder="e.g. Senior Software Engineer" value={formData.jobTitle} onChange={(e) => handleChange("jobTitle", e.target.value)} />
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
                    <div>
                      <label style={formLabel}>Start Date * (MM/YYYY)</label>
                      <input style={formInput} placeholder="e.g. 09/2019" value={formData.empStart} onChange={(e) => handleChange("empStart", e.target.value)} />
                    </div>
                    <div>
                      <label style={formLabel}>End Date (MM/YYYY or 'Present')</label>
                      <input style={formInput} placeholder="e.g. Present" value={formData.empEnd} onChange={(e) => handleChange("empEnd", e.target.value)} />
                    </div>
                    <div>
                      <label style={formLabel}>Supervisor/HR Contact Phone</label>
                      <input style={formInput} placeholder="e.g. 555-0199" value={formData.supervisorPhone} onChange={(e) => handleChange("supervisorPhone", e.target.value)} />
                    </div>
                  </div>
                  <DocumentUploadField 
                    label="Upload Experience Letter / Paystub" 
                    onChange={(file) => console.log("Uploaded Employment:", file)}
                  />
                </div>
              )}
            </div>
          )}

          {/* Section 3: FCRA Disclosure & Signature */}
          <div style={{ marginBottom: "32px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 600, color: "rgb(199, 0, 57)", marginBottom: "16px", borderBottom: "2px solid #F3F4F6", paddingBottom: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
              <FileText size={16} /> 3. FCRA Disclosure & Authorization
            </h3>

>>>>>>> 0a3811cd9fe814f5e37ab930e0a31979b7a14308
            <div style={{
              background: "#F9FAFB",
              border: "1px solid #E5E7EB",
              borderRadius: "4px",
              padding: "16px",
              height: "150px",
              overflowY: "scroll",
              fontSize: "12px",
              color: "#4B5563",
              lineHeight: 1.6,
<<<<<<< HEAD
              marginBottom: "20px",
              textAlign: "left"
=======
              marginBottom: "20px"
>>>>>>> 0a3811cd9fe814f5e37ab930e0a31979b7a14308
            }}>
              <p style={{ margin: "0 0 10px 0", fontWeight: 700 }}>DISCLOSURE REGARDING BACKGROUND INVESTIGATION</p>
              <p style={{ margin: "0 0 10px 0" }}>
                The employer requesting this form ("the Company") may obtain information about you from a third party consumer reporting agency for employment purposes. Thus, you may be the subject of a "consumer report" and/or an "investigative consumer report" which may include information about your character, general reputation, personal characteristics, and/or mode of living.
              </p>
              <p style={{ margin: "0 0 10px 0" }}>
                These reports may contain information regarding your credit history, criminal history, Aadhaar number verification, motor vehicle records ("driving records"), verification of your education or employment history, or other background checks.
              </p>
              <p style={{ margin: "0 0 10px 0" }}>
                You have the right, upon written request made within a reasonable time, to request whether a consumer report has been run and to request the nature and scope of any investigative consumer report. The Consumer Financial Protection Bureau's "A Summary of Your Rights Under the Fair Credit Reporting Act" is provided along with this document.
              </p>
              <p style={{ margin: 0 }}>
                AUTHORIZATION: By signing below, you authorize the Company and its third party screening agent, EvalRight, to conduct this background screening and obtain consumer reports.
              </p>
            </div>

<<<<<<< HEAD
            <div style={{ marginBottom: "20px", textAlign: "left" }}>
=======
            <div style={{ marginBottom: "20px" }}>
>>>>>>> 0a3811cd9fe814f5e37ab930e0a31979b7a14308
              <label style={{ display: "flex", alignItems: "flex-start", gap: "10px", cursor: "pointer", userSelect: "none" }}>
                <input 
                  type="checkbox" 
                  checked={formData.fcraConsent} 
                  onChange={(e) => handleChange("fcraConsent", e.target.checked)}
                  style={{ marginTop: "4px", width: "16px", height: "16px", accentColor: "rgb(199, 0, 57)" }} 
                />
                <span style={{ fontSize: "13px", color: "#4B5563", lineHeight: 1.4, fontWeight: 500 }}>
                  I have read the FCRA Disclosure and I hereby authorize EvalRight and my potential employer to conduct a background check and obtain consumer reports. *
                </span>
              </label>
            </div>

<<<<<<< HEAD
            <div style={{ maxWidth: "480px", textAlign: "left" }}>
=======
            <div style={{ maxWidth: "480px" }}>
>>>>>>> 0a3811cd9fe814f5e37ab930e0a31979b7a14308
              <label style={formLabel}>E-Signature (Please type your full name: "{formData.firstName} {formData.lastName}") *</label>
              <input 
                style={formInput} 
                placeholder="Type your name to e-sign" 
                value={formData.signatureName} 
                onChange={(e) => handleChange("signatureName", e.target.value)} 
              />
            </div>
          </div>
<<<<<<< HEAD
        );

      default:
        return <div>No fields configured for this section.</div>;
    }
  };

  // Helper renderer for generic database checks (OFAC, Indian/Global db)
  const renderDBCheckFields = (title: string, prefix: string) => {
    return (
      <div>
        <h3 style={sectionHeading}>{title}</h3>
        <div style={grid2}>
          <div>
            <label style={formLabel}>Full Legal Name *</label>
            <input style={formInput} value={formData[`${prefix}_name`]} onChange={(e) => handleChange(`${prefix}_name`, e.target.value)} />
          </div>
          <div>
            <label style={formLabel}>Father's Name *</label>
            <input style={formInput} value={formData[`${prefix}_fatherName`]} onChange={(e) => handleChange(`${prefix}_fatherName`, e.target.value)} />
          </div>
        </div>
        <div style={{ marginTop: "16px" }}>
          <label style={formLabel}>Date of Birth * (MM/DD/YYYY)</label>
          <input style={formInput} placeholder="e.g. 05/18/1992" value={formData[`${prefix}_dob`]} onChange={(e) => handleChange(`${prefix}_dob`, e.target.value)} />
        </div>
      </div>
    );
  };

  // Helper renderer for address & criminal history checks
  const renderAddressCheckFields = (title: string, prefix: string) => {
    return (
      <div>
        <h3 style={sectionHeading}>{title}</h3>
        <div style={grid2}>
          <div>
            <label style={formLabel}>Contact Phone *</label>
            <input style={formInput} value={formData[`${prefix}_contactNo`]} onChange={(e) => handleChange(`${prefix}_contactNo`, e.target.value)} />
          </div>
          <div>
            <label style={formLabel}>Country *</label>
            <input style={formInput} value={formData[`${prefix}_country`]} onChange={(e) => handleChange(`${prefix}_country`, e.target.value)} />
          </div>
        </div>
        <div style={grid3}>
          <div style={{ gridColumn: "span 2" }}>
            <label style={formLabel}>Street Address *</label>
            <input style={formInput} value={formData[`${prefix}_address`]} onChange={(e) => handleChange(`${prefix}_address`, e.target.value)} />
          </div>
          <div>
            <label style={formLabel}>City *</label>
            <input style={formInput} value={formData[`${prefix}_city`]} onChange={(e) => handleChange(`${prefix}_city`, e.target.value)} />
          </div>
        </div>
        <div style={grid3}>
          <div>
            <label style={formLabel}>State *</label>
            <select style={formSelect} value={formData[`${prefix}_state`]} onChange={(e) => handleChange(`${prefix}_state`, e.target.value)}>
              <option value="">Select State</option>
              {INDIA_STATES.map(st => <option key={st} value={st}>{st}</option>)}
            </select>
          </div>
          <div>
            <label style={formLabel}>Pincode *</label>
            <input style={formInput} maxLength={6} value={formData[`${prefix}_pincode`]} onChange={(e) => handleChange(`${prefix}_pincode`, e.target.value.replace(/\D/g, ""))} />
          </div>
          <div>
            <label style={formLabel}>Address Proof Document Type *</label>
            <select style={formSelect} value={formData[`${prefix}_proofType`]} onChange={(e) => handleChange(`${prefix}_proofType`, e.target.value)}>
              <option value="">Select Proof Type</option>
              <option value="Aadhaar Card">Aadhaar Card</option>
              <option value="Electricity Bill">Electricity Bill</option>
              <option value="Voter ID">Voter ID</option>
              <option value="Rental Agreement">Rental Agreement</option>
              <option value="Passport">Passport</option>
            </select>
          </div>
        </div>
        <div style={grid2}>
          <div>
            <label style={formLabel}>Period of Stay From * (MM/YYYY)</label>
            <input style={formInput} placeholder="e.g. 06/2018" value={formData[`${prefix}_periodFrom`]} onChange={(e) => handleChange(`${prefix}_periodFrom`, e.target.value)} />
          </div>
          <div>
            <label style={formLabel}>Period of Stay To * (MM/YYYY)</label>
            <input style={formInput} placeholder="e.g. Present" value={formData[`${prefix}_periodTo`]} onChange={(e) => handleChange(`${prefix}_periodTo`, e.target.value)} />
          </div>
        </div>
        {prefix === "addr" && (
          <div style={{ marginTop: "16px" }}>
            <label style={formLabel}>Contact Person / Reference Name (e.g. Landlord/Neighbor)</label>
            <input style={formInput} value={formData[`addr_contactPersonName`]} onChange={(e) => handleChange(`addr_contactPersonName`, e.target.value)} />
          </div>
        )}
        <DocumentUploadField 
          label="Upload Address Proof Document *" 
          onChange={(file) => handleChange(`${prefix}_fileName`, file ? file.name : "")}
          fileName={formData[`${prefix}_fileName`]}
        />
      </div>
    );
  };

  // Review Details Screen Layout
  const renderReviewScreen = () => {
    return (
      <div>
        <h3 style={sectionHeading}>Review Entered Details</h3>
        <p style={subLabel}>Please review all the information you entered below. If any details are incorrect, click the "Edit" button next to the section to update them.</p>

        {/* Section: Personal Info */}
        <div style={reviewSection}>
          <div style={reviewHeader}>
            <span>1. General Personal Information</span>
            <button type="button" onClick={() => setActiveTab("personal-info")} style={editBtn}>Edit</button>
          </div>
          <div style={reviewGrid}>
            <div style={reviewField}><strong>Full Name:</strong> {formData.firstName} {formData.middleName} {formData.lastName}</div>
            <div style={reviewField}><strong>Email:</strong> {formData.email}</div>
            <div style={reviewField}><strong>Contact Phone:</strong> {formData.phone}</div>
            <div style={reviewField}><strong>DOB:</strong> {formData.dob}</div>
            <div style={reviewField}><strong>Gender:</strong> {formData.gender || "—"}</div>
            <div style={reviewField}><strong>Father's Name:</strong> {formData.fatherName || "—"}</div>
            <div style={{ ...reviewField, gridColumn: "span 2" }}><strong>Address:</strong> {formData.street}, {formData.city}, {formData.state} - {formData.zip}, {formData.country}</div>
          </div>
        </div>

        {/* Dynamic checks review */}
        {products.map((prodId: string) => {
          if (prodId === "personal-details") return null;
          const label = PRODUCT_TAB_NAMES[prodId] || prodId;
          return (
            <div key={prodId} style={reviewSection}>
              <div style={reviewHeader}>
                <span>{label}</span>
                <button type="button" onClick={() => setActiveTab(prodId)} style={editBtn}>Edit</button>
              </div>
              <div style={reviewGrid}>
                {renderReviewFieldsForProduct(prodId)}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Helper to render read-only properties for review page
  const renderReviewFieldsForProduct = (prodId: string) => {
    switch (prodId) {
      case "id-verification-aadhar":
        return (
          <>
            <div style={reviewField}><strong>Name on Aadhaar:</strong> {formData.id_aadhar_name}</div>
            <div style={reviewField}><strong>Aadhaar Number:</strong> {formData.id_aadhar_number}</div>
            <div style={reviewField}><strong>Father's Name:</strong> {formData.id_aadhar_fatherName}</div>
            <div style={reviewField}><strong>Date of Birth:</strong> {formData.id_aadhar_dob}</div>
            <div style={{ ...reviewField, gridColumn: "span 2" }}><strong>File Attachment:</strong> 📄 {formData.id_aadhar_fileName}</div>
          </>
        );
      case "id-verification-pan":
        return (
          <>
            <div style={reviewField}><strong>Name on PAN Card:</strong> {formData.id_pan_name}</div>
            <div style={reviewField}><strong>PAN Number:</strong> {formData.id_pan_number}</div>
            <div style={reviewField}><strong>Father's Name:</strong> {formData.id_pan_fatherName}</div>
            <div style={reviewField}><strong>Date of Birth:</strong> {formData.id_pan_dob}</div>
            <div style={{ ...reviewField, gridColumn: "span 2" }}><strong>File Attachment:</strong> 📄 {formData.id_pan_fileName}</div>
          </>
        );
      case "id-verification-dl":
        return (
          <>
            <div style={reviewField}><strong>Name on License:</strong> {formData.id_dl_name}</div>
            <div style={reviewField}><strong>License Number:</strong> {formData.id_dl_number}</div>
            <div style={reviewField}><strong>State of Issue:</strong> {formData.id_dl_state}</div>
            <div style={reviewField}><strong>Date of Issue:</strong> {formData.id_dl_issueDate || "—"}</div>
            <div style={{ ...reviewField, gridColumn: "span 2" }}><strong>File Attachment:</strong> 📄 {formData.id_dl_fileName}</div>
          </>
        );
      case "id-verification-voterid":
        return (
          <>
            <div style={reviewField}><strong>Name on Voter ID:</strong> {formData.id_voterid_name}</div>
            <div style={reviewField}><strong>Voter ID Number:</strong> {formData.id_voterid_number}</div>
            <div style={reviewField}><strong>State:</strong> {formData.id_voterid_state}</div>
            <div style={{ ...reviewField, gridColumn: "span 2" }}><strong>File Attachment:</strong> 📄 {formData.id_voterid_fileName}</div>
          </>
        );
      case "id-verification-passport":
        return (
          <>
            <div style={reviewField}><strong>Name on Passport:</strong> {formData.id_passport_name}</div>
            <div style={reviewField}><strong>Passport Number:</strong> {formData.id_passport_number}</div>
            <div style={reviewField}><strong>Date of Issue:</strong> {formData.id_passport_issueDate}</div>
            <div style={reviewField}><strong>Expiry Date:</strong> {formData.id_passport_expiry}</div>
            <div style={{ ...reviewField, gridColumn: "span 2" }}><strong>File Attachment:</strong> 📄 {formData.id_passport_fileName}</div>
          </>
        );
      case "uan-verification":
        return (
          <>
            <div style={reviewField}><strong>UAN Number:</strong> {formData.uan_number}</div>
            <div style={reviewField}><strong>Father's Name:</strong> {formData.uan_fatherName}</div>
            <div style={reviewField}><strong>Date of Birth:</strong> {formData.uan_dob}</div>
          </>
        );
      case "supplier-address":
        return (
          <>
            <div style={reviewField}><strong>Supplier Name:</strong> {formData.supplier_name}</div>
            <div style={{ ...reviewField, gridColumn: "span 2" }}><strong>Supplier Address:</strong> {formData.supplier_address}</div>
          </>
        );
      case "ssn-check":
        return <div style={reviewField}><strong>SSN Number:</strong> {formData.ssn_number}</div>;
      case "social-media-check":
        return <div style={reviewField}><strong>Scan Name:</strong> {formData.social_media_name}</div>;
      case "right-to-work":
        return (
          <>
            <div style={reviewField}><strong>Full Name:</strong> {formData.rtw_name}</div>
            <div style={reviewField}><strong>Country:</strong> {formData.rtw_country}</div>
          </>
        );
      case "reference-check":
        return (
          <>
            <div style={reviewField}><strong>Reference Name:</strong> {formData.ref_name}</div>
            <div style={reviewField}><strong>Relationship:</strong> {formData.ref_association}</div>
            <div style={reviewField}><strong>Email:</strong> {formData.ref_email}</div>
            <div style={reviewField}><strong>Phone:</strong> {formData.ref_contactNo}</div>
          </>
        );
      case "education-verification":
        return (
          <>
            <div style={reviewField}><strong>College Name:</strong> {formData.edu_collegeName}</div>
            <div style={reviewField}><strong>Degree / Major:</strong> {formData.edu_qualification} - {formData.edu_specialization}</div>
            <div style={reviewField}><strong>Graduation Year:</strong> {formData.edu_yearOfGraduated}</div>
            <div style={reviewField}><strong>Study Period:</strong> {formData.edu_periodOfStudyFrom} to {formData.edu_periodOfStudyTo}</div>
            <div style={{ ...reviewField, gridColumn: "span 2" }}><strong>Marksheet Attachment:</strong> 📄 {formData.edu_marksheetFileName}</div>
          </>
        );
      case "employment-verification":
        return (
          <>
            <div style={reviewField}><strong>Company Name:</strong> {formData.emp_companyName}</div>
            <div style={reviewField}><strong>Job Title:</strong> {formData.emp_designation}</div>
            <div style={reviewField}><strong>Tenure:</strong> {formData.emp_dateOfJoining} to {formData.emp_dateOfRelieving}</div>
            <div style={{ ...reviewField, gridColumn: "span 2" }}><strong>Employment Document:</strong> 📄 {formData.emp_fileName}</div>
          </>
        );
      case "address-verification":
        return renderReviewAddressFields("addr");
      case "criminal-record-check":
        return renderReviewAddressFields("crim");
      case "police-verification-check":
        return renderReviewAddressFields("police");
      case "nationwide-criminal-check":
        return renderReviewAddressFields("natcrim");
      case "national-sex-offender-registry-check":
        return renderReviewAddressFields("sexoff");

      case "ofac-check":
        return renderReviewDBFields("ofac");
      case "indian-database-check":
        return renderReviewDBFields("ind_db");
      case "global-database-check":
        return renderReviewDBFields("glob_db");

      case "drug-test":
        return (
          <>
            <div style={reviewField}><strong>Full Name:</strong> {formData.drug_name}</div>
            <div style={reviewField}><strong>Preferred Clinic ZIP:</strong> {formData.drug_clinicZip}</div>
            <div style={reviewField}><strong>Consent Accepted:</strong> {formData.drug_consent ? "Yes" : "No"}</div>
          </>
        );
      case "cv-check":
        return <div style={{ ...reviewField, gridColumn: "span 2" }}><strong>Resume Attachment:</strong> 📄 {formData.cv_fileName}</div>;
      case "authorization":
        return <div style={{ ...reviewField, gridColumn: "span 2" }}><strong>LOA Attachment:</strong> 📄 {formData.auth_fileName}</div>;

      default:
        return <div style={reviewField}>Data entered in form.</div>;
    }
  };

  const renderReviewAddressFields = (prefix: string) => {
    return (
      <>
        <div style={reviewField}><strong>Address:</strong> {formData[`${prefix}_address`]}, {formData[`${prefix}_city`]}, {formData[`${prefix}_state`]} - {formData[`${prefix}_pincode`]}</div>
        <div style={reviewField}><strong>Tenure of Stay:</strong> {formData[`${prefix}_periodFrom`]} to {formData[`${prefix}_periodTo`]}</div>
        <div style={reviewField}><strong>Proof Type:</strong> {formData[`${prefix}_proofType`]}</div>
        <div style={{ ...reviewField, gridColumn: "span 2" }}><strong>Address Proof Attachment:</strong> 📄 {formData[`${prefix}_fileName`]}</div>
      </>
    );
  };

  const renderReviewDBFields = (prefix: string) => {
    return (
      <>
        <div style={reviewField}><strong>Full Name:</strong> {formData[`${prefix}_name`]}</div>
        <div style={reviewField}><strong>Father's Name:</strong> {formData[`${prefix}_fatherName`]}</div>
        <div style={reviewField}><strong>Date of Birth:</strong> {formData[`${prefix}_dob`]}</div>
      </>
    );
  };

  return (
    <div style={{ minHeight: "100vh", background: isDarkMode ? "#1A1C21" : "#F3F4F6", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      {/* Branding Top bar */}
      <div style={{ background: "#FFFFFF", borderBottom: "1px solid #E5E7EB", padding: "16px 40px", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <img src="/evalright-logo.jpg" alt="EvalRight Logo" style={{ height: "36px", width: "auto" }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#4B5563" }}>
            <Shield size={14} color="#10B981" />
            <span>Secure SSL Encrypted Portal</span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div style={{ flex: 1, maxWidth: "1100px", width: "100%", margin: "32px auto", padding: "0 20px" }}>
        
        {/* Intro */}
        <div style={{ background: "linear-gradient(135deg, #C70039 0%, #900028 100%)", borderRadius: "8px 8px 0 0", padding: "24px 30px", color: "#FFFFFF", textAlign: "left" }}>
          <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", background: "rgba(255,255,255,0.2)", padding: "4px 8px", borderRadius: "4px", letterSpacing: "0.5px" }}>
            Invitation Code: {inviteData.inviteId}
          </span>
          <h1 style={{ fontSize: "20px", fontWeight: 600, marginTop: "10px", marginBottom: "6px" }}>Candidate Verification Questionnaire</h1>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.85)", lineHeight: 1.5, margin: 0 }}>
            Dear {inviteData.name}, please complete the verification details below. Use the navigation steps on the left to move through each section.
          </p>
        </div>

        {/* Wizard Layout */}
        <div id="form-card" style={{ display: "grid", gridTemplateColumns: "280px 1fr", background: "#FFFFFF", borderRadius: "0 0 8px 8px", boxShadow: "0 4px 20px rgba(0,0,0,0.06)", borderTop: "none", overflow: "hidden" }}>
          
          {/* Left Column: Vertical tabs navigation */}
          <div style={{ background: "#F9FAFB", borderRight: "1px solid #E5E7EB", padding: "20px 0" }}>
            {tabs.map((tab) => {
              const Icon = PRODUCT_ICONS[tab.id] || Shield;
              const isActive = tab.id === activeTab;
              const isCompleted = validatedTabs.includes(tab.id);
              
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setErrorMsg(null);
                    setActiveTab(tab.id);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    padding: "12px 20px",
                    background: isActive ? "#FFFFFF" : "transparent",
                    border: "none",
                    borderLeft: isActive ? "4px solid rgb(199, 0, 57)" : "4px solid transparent",
                    cursor: "pointer",
                    textAlign: "left",
                    color: isActive ? "rgb(199, 0, 57)" : "#4B5563",
                    fontWeight: isActive ? 600 : 500,
                    fontSize: "13px",
                    transition: "all 0.15s ease",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Icon size={16} color={isActive ? "rgb(199, 0, 57)" : "#6B7280"} />
                    <span>{tab.label}</span>
                  </div>
                  {isCompleted && <Check size={14} color="#10B981" style={{ strokeWidth: 3 }} />}
                </button>
              );
            })}
          </div>

          {/* Right Column: Active Form Fields */}
          <form onSubmit={handleSubmit} style={{ padding: "30px 40px", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "500px" }}>
            
            <div>
              {errorMsg && (
                <div style={{ background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: "4px", padding: "12px 16px", color: "#B91C1C", fontSize: "14px", fontWeight: 500, marginBottom: "24px", textAlign: "left" }}>
                  ⚠️ {errorMsg}
                </div>
              )}

              {renderFields()}
            </div>

            {/* Wizard Navigation Footer */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #F3F4F6", marginTop: "40px", paddingTop: "24px" }}>
              <button
                type="button"
                onClick={handleBack}
                disabled={activeIndex === 0}
                style={{
                  background: activeIndex === 0 ? "#F3F4F6" : "#FFFFFF",
                  color: activeIndex === 0 ? "#9CA3AF" : "#374151",
                  border: activeIndex === 0 ? "1px solid #E5E7EB" : "1px solid #D1D5DB",
                  borderRadius: "4px",
                  padding: "10px 20px",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: activeIndex === 0 ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                }}
              >
                <ArrowLeft size={16} /> Back
              </button>

              {activeTab === "consent-sign" ? (
                <button
                  type="submit"
                  disabled={submitting || (inviteData && (inviteData.status === 'completed' || inviteData.status === 'Complete'))}
                  style={{
                    background: (submitting || (inviteData && (inviteData.status === 'completed' || inviteData.status === 'Complete'))) ? "#E5E7EB" : "rgb(199, 0, 57)",
                    color: (submitting || (inviteData && (inviteData.status === 'completed' || inviteData.status === 'Complete'))) ? "#9CA3AF" : "#FFFFFF",
                    border: "none",
                    borderRadius: "4px",
                    padding: "10px 32px",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: (submitting || (inviteData && (inviteData.status === 'completed' || inviteData.status === 'Complete'))) ? "not-allowed" : "pointer",
                    boxShadow: (submitting || (inviteData && (inviteData.status === 'completed' || inviteData.status === 'Complete'))) ? "none" : "0 2px 8px rgba(199, 0, 57, 0.15)"
                  }}
                >
                  {submitting ? "Submitting..." : (inviteData && (inviteData.status === 'completed' || inviteData.status === 'Complete')) ? "Completed" : "Submit Authorization"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNext}
                  style={{
                    background: "rgb(199, 0, 57)",
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: "4px",
                    padding: "10px 24px",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px"
                  }}
                >
                  Next Step <ArrowRight size={16} />
                </button>
              )}
            </div>

          </form>

        </div>
=======

          {/* Submit Button */}
          <div style={{ display: "flex", justifyContent: "flex-end", borderTop: "1px solid #F3F4F6", paddingTop: "24px" }}>
            <button
              type="submit"
              disabled={submitting || (inviteData && (inviteData.status === 'completed' || inviteData.status === 'Complete'))}
              style={{
                background: (submitting || (inviteData && (inviteData.status === 'completed' || inviteData.status === 'Complete'))) ? "#E5E7EB" : "rgb(199, 0, 57)",
                color: (submitting || (inviteData && (inviteData.status === 'completed' || inviteData.status === 'Complete'))) ? "#9CA3AF" : "#FFFFFF",
                border: "none",
                borderRadius: "4px",
                padding: "12px 36px",
                fontSize: "15px",
                fontWeight: 600,
                cursor: (submitting || (inviteData && (inviteData.status === 'completed' || inviteData.status === 'Complete'))) ? "not-allowed" : "pointer",
                transition: "all 0.15s ease",
                boxShadow: (submitting || (inviteData && (inviteData.status === 'completed' || inviteData.status === 'Complete'))) ? "none" : "0 2px 8px rgba(199, 0, 57, 0.15)"
              }}
            >
              {submitting ? "Submitting Authorization..." : (inviteData && (inviteData.status === 'completed' || inviteData.status === 'Complete')) ? "Submission Completed" : "Submit Authorization"}
            </button>
          </div>

        </form>
>>>>>>> 0a3811cd9fe814f5e37ab930e0a31979b7a14308
      </div>

      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}

<<<<<<< HEAD
// ── DocumentUploadField Helper Component ──────────────────────────────────────
=======
>>>>>>> 0a3811cd9fe814f5e37ab930e0a31979b7a14308

interface DocumentUploadFieldProps {
  label: string;
  onChange: (file: File | null) => void;
  disabled?: boolean;
<<<<<<< HEAD
  fileName?: string | null;
}

function DocumentUploadField({ label, onChange, disabled = false, fileName }: DocumentUploadFieldProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      onChange(file);
    } else {
=======
}

function DocumentUploadField({ label, onChange, disabled = false }: DocumentUploadFieldProps) {
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFileName(file.name);
      onChange(file);
    } else {
      setFileName(null);
>>>>>>> 0a3811cd9fe814f5e37ab930e0a31979b7a14308
      onChange(null);
    }
  };

<<<<<<< HEAD
  const handleClear = () => {
    onChange(null);
  };

=======
>>>>>>> 0a3811cd9fe814f5e37ab930e0a31979b7a14308
  return (
    <div style={{ marginTop: "16px", textAlign: "left" }}>
      <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#4B5563", marginBottom: "6px" }}>
        {label}
      </label>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
<<<<<<< HEAD
        {fileName ? (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#F3F4F6", padding: "6px 12px", borderRadius: "4px", border: "1px solid #E5E7EB" }}>
            <span style={{ fontSize: "13px", color: "#1F2937", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "250px" }}>
              📄 {fileName}
            </span>
            <button
              type="button"
              onClick={handleClear}
              disabled={disabled}
              style={{ background: "transparent", border: "none", color: "#EF4444", cursor: "pointer", fontSize: "12px", fontWeight: "bold" }}
            >
              Clear
            </button>
          </div>
        ) : (
          <label
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              height: "38px",
              padding: "0 16px",
              background: disabled ? "#E5E7EB" : "rgb(199, 0, 57)",
              color: disabled ? "#9CA3AF" : "#FFFFFF",
              borderRadius: "4px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: disabled ? "not-allowed" : "pointer",
              border: "none",
              boxShadow: disabled ? "none" : "0 2px 4px rgba(199,0,57,0.15)",
              transition: "all 0.15s ease",
            }}
          >
            Choose File
            <input
              type="file"
              onChange={handleFileChange}
              disabled={disabled}
              style={{ display: "none" }}
            />
          </label>
        )}
=======
        <label
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            height: "38px",
            padding: "0 16px",
            background: disabled ? "#E5E7EB" : "rgb(199, 0, 57)",
            color: disabled ? "#9CA3AF" : "#FFFFFF",
            borderRadius: "4px",
            fontSize: "13px",
            fontWeight: 600,
            cursor: disabled ? "not-allowed" : "pointer",
            border: "none",
            boxShadow: disabled ? "none" : "0 2px 4px rgba(199,0,57,0.15)",
            transition: "all 0.15s ease",
          }}
        >
          Choose File
          <input
            type="file"
            onChange={handleFileChange}
            disabled={disabled}
            style={{ display: "none" }}
          />
        </label>
        <span style={{ fontSize: "13px", color: fileName ? "#1F2937" : "#9CA3AF", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "250px" }}>
          {fileName || "No file selected"}
        </span>
>>>>>>> 0a3811cd9fe814f5e37ab930e0a31979b7a14308
      </div>
    </div>
  );
}

<<<<<<< HEAD
// ── Styles & Form Formatting Helpers ──────────────────────────────────────────

const sectionHeading: React.CSSProperties = {
  fontSize: "16px",
  fontWeight: 700,
  color: "rgb(199, 0, 57)",
  marginBottom: "20px",
  borderBottom: "2px solid #F3F4F6",
  paddingBottom: "8px",
  textAlign: "left"
};

const subLabel: React.CSSProperties = {
  fontSize: "13px",
  color: "#6B7280",
  marginBottom: "20px",
  textAlign: "left",
  lineHeight: 1.4
};
=======
// ── Styles & Data Helpers ──────────────────────────────────────────────────────
>>>>>>> 0a3811cd9fe814f5e37ab930e0a31979b7a14308

const formLabel: React.CSSProperties = {
  display: "block",
  fontSize: "12px",
  fontWeight: 600,
  color: "#4B5563",
  marginBottom: "6px",
  textAlign: "left"
};

const formInput: React.CSSProperties = {
  width: "100%",
  height: "38px",
  border: "1px solid #D1D5DB",
  borderRadius: "4px",
  padding: "0 12px",
  fontSize: "14px",
  color: "#1F2937",
  outline: "none",
  boxSizing: "border-box",
  background: "#FFFFFF",
};

<<<<<<< HEAD
const formTextarea: React.CSSProperties = {
  width: "100%",
  height: "80px",
  border: "1px solid #D1D5DB",
  borderRadius: "4px",
  padding: "8px 12px",
  fontSize: "14px",
  color: "#1F2937",
  outline: "none",
  boxSizing: "border-box",
  background: "#FFFFFF",
  resize: "vertical"
};

=======
>>>>>>> 0a3811cd9fe814f5e37ab930e0a31979b7a14308
const formSelect: React.CSSProperties = {
  width: "100%",
  height: "38px",
  border: "1px solid #D1D5DB",
  borderRadius: "4px",
  padding: "0 12px",
  fontSize: "14px",
  color: "#1F2937",
  outline: "none",
  boxSizing: "border-box",
  background: "#FFFFFF",
  cursor: "pointer"
};

<<<<<<< HEAD
const grid2: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "16px",
  marginBottom: "16px"
};

const grid3: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1.2fr 0.8fr 1.2fr",
  gap: "16px",
  marginBottom: "16px"
};

const grid4: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1.8fr 1.2fr 1fr 1fr",
  gap: "16px",
  marginBottom: "16px"
};

// Review details page styles
const reviewSection: React.CSSProperties = {
  border: "1px solid #E5E7EB",
  borderRadius: "6px",
  marginBottom: "20px",
  overflow: "hidden"
};

const reviewHeader: React.CSSProperties = {
  background: "#F9FAFB",
  borderBottom: "1px solid #E5E7EB",
  padding: "10px 16px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  fontWeight: 600,
  fontSize: "14px",
  color: "#374151"
};

const editBtn: React.CSSProperties = {
  background: "transparent",
  border: "none",
  color: "rgb(199, 0, 57)",
  fontWeight: 600,
  fontSize: "13px",
  cursor: "pointer",
  padding: "2px 8px"
};

const reviewGrid: React.CSSProperties = {
  padding: "16px",
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "12px",
  textAlign: "left",
  fontSize: "13px",
  color: "#4B5563"
};

const reviewField: React.CSSProperties = {
  wordBreak: "break-all"
=======
const dynamicCard: React.CSSProperties = {
  background: "#FAF5F5",
  border: "1px solid #F3E8E8",
  borderRadius: "6px",
  padding: "20px",
  marginBottom: "16px",
  textAlign: "left"
};

const dynamicHeader: React.CSSProperties = {
  margin: "0 0 6px 0",
  fontSize: "14px",
  fontWeight: 700,
  color: "#1F2937",
  display: "flex",
  alignItems: "center",
  gap: "8px"
};

const dynamicDescription: React.CSSProperties = {
  margin: "0 0 16px 0",
  fontSize: "12px",
  color: "#6B7280",
  lineHeight: 1.4
>>>>>>> 0a3811cd9fe814f5e37ab930e0a31979b7a14308
};

const INDIA_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", 
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", 
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", 
  "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", 
  "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", 
  "Lakshadweep", "Puducherry"
];
