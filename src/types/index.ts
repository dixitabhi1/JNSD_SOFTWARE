export type UserRole = 'MANAGER' | 'PRINCIPAL' | 'TEACHER' | 'UDISE_OPERATOR';

export type AccountStatus = 'PENDING_ACTIVATION' | 'ACTIVE' | 'SUSPENDED' | 'REVOKED';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  status: AccountStatus;
  phone?: string;
  avatarUrl?: string;
  mustChangePassword?: boolean;
  revocationReason?: string;
  revokedAt?: string;
  revokedBy?: string;
  lastLoginAt?: string;
}

export interface StaffMember {
  id: string;
  userId: string;
  employeeId: string;
  fullName: string;
  email: string;
  role: UserRole;
  designation: string;
  phone: string;
  qualification: string;
  joiningDate: string;
  assignedClasses: string[]; // e.g., ["Class 5-A", "Class 4-B"]
  assignedSubjects: string[]; // e.g., ["Mathematics", "Science"]
  isClassTeacher: boolean;
  status: AccountStatus;
  mustChangePassword?: boolean;
  revocationReason?: string;
  revokedAt?: string;
}

export type GenderType = 'MALE' | 'FEMALE' | 'OTHER';

export interface Guardian {
  id: string;
  relationship: 'Father' | 'Mother' | 'Guardian';
  fullName: string;
  phone: string;
  altPhone?: string;
  email?: string;
  occupation?: string;
  education?: string;
  annualIncome?: number;
}

export interface StudentDocument {
  id: string;
  documentType: 'Aadhaar Card' | 'Birth Certificate' | 'Transfer Certificate' | 'Marksheet' | 'Student Photo';
  fileName: string;
  fileUrl: string;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  uploadedAt: string;
  notes?: string;
}

export interface Student {
  id: string;
  admissionNo: string;
  penNumber?: string; // UDISE+ Permanent Education Number
  fullName: string;
  dob: string; // YYYY-MM-DD
  gender: GenderType;
  bloodGroup?: string;
  religion: string;
  casteCategory: 'General' | 'OBC' | 'SC' | 'ST' | 'EWS';
  isCwsn: boolean; // Children with Special Needs
  cwsnType?: string;
  aadhaarMasked?: string; // e.g. XXXX-XXXX-4589
  address: string;
  district: string;
  state: string;
  pinCode: string;
  emergencyPhone: string;
  previousSchool?: string;
  previousClass?: string;
  admissionDate: string;
  currentClass: string; // 'Play Group', 'Nursery', 'LKG', 'UKG', 'Class 1' ... 'Class 8'
  currentSection: string; // 'A', 'B'
  rollNo?: number;
  status: 'Active' | 'Transferred' | 'Withdrawn';
  documentVerificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  guardians: Guardian[];
  documents: StudentDocument[];
}

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'HALF_DAY';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  admissionNo: string;
  rollNo?: number;
  className: string;
  section: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  remarks?: string;
  markedBy?: string;
  updatedAt?: string;
}

export interface SubjectItem {
  id: string;
  className: string;
  name: string;
  code: string;
  maxMarks: number;
  passMarks: number;
}

export interface Examination {
  id: string;
  name: string;
  term: 'Term 1' | 'Term 2' | 'Unit Test 1' | 'Unit Test 2';
  academicYear: string;
  startDate: string;
  endDate: string;
  isPublished: boolean;
}

export interface MarksEntry {
  id: string;
  examId: string;
  studentId: string;
  studentName: string;
  rollNo?: number;
  className: string;
  subjectName: string;
  marksObtained: number;
  maxMarks: number;
  isAbsent?: boolean;
  isExempt?: boolean;
  grade?: string;
  remarks?: string;
}

export type FeeHead = 'Tuition Fee' | 'Admission Fee' | 'Annual Charges' | 'Examination Fee' | 'Computer/Smart Lab' | 'Activity & Sports';

export interface FeeStructure {
  id: string;
  className: string;
  feeHead: FeeHead;
  amount: number;
  frequency: 'Monthly' | 'Quarterly' | 'Annual' | 'One-time';
}

export interface FeeInvoice {
  id: string;
  invoiceNo: string;
  studentId: string;
  studentName: string;
  admissionNo: string;
  className: string;
  section: string;
  monthOrPeriod: string;
  totalAmount: number;
  concessionAmount: number;
  paidAmount: number;
  balanceAmount: number;
  dueDate: string;
  status: 'UNPAID' | 'PARTIALLY_PAID' | 'PAID' | 'OVERDUE';
}

export interface PaymentReceipt {
  id: string;
  receiptNo: string;
  invoiceId: string;
  studentId: string;
  studentName: string;
  admissionNo: string;
  className: string;
  amount: number;
  paymentMode: 'CASH' | 'UPI' | 'BANK_TRANSFER' | 'CHEQUE' | 'NEFT';
  transactionRef?: string;
  paymentDate: string;
  receivedBy: string;
  approvedBy?: string;
  feeBreakdown: { head: string; amount: number }[];
  remarks?: string;
}

export type FeeSubmissionStatus = 'PENDING_MANAGER_APPROVAL' | 'APPROVED' | 'REJECTED';

export interface FeeSubmission {
  id: string;
  invoiceId: string;
  studentId: string;
  studentName: string;
  admissionNo: string;
  className: string;
  amount: number;
  paymentMode: 'CASH' | 'UPI' | 'BANK_TRANSFER' | 'CHEQUE' | 'NEFT';
  transactionRef?: string;
  remarks?: string;
  submittedBy: string;
  submittedByRole: UserRole;
  submittedAt: string;
  status: FeeSubmissionStatus;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  receiptId?: string;
}

export interface OCRExtractedData {
  documentType: 'AADHAAR' | 'BIRTH_CERTIFICATE' | 'TRANSFER_CERTIFICATE' | 'FEE_RECEIPT' | 'UNKNOWN';
  rawText: string;
  confidence: number;
  fields: {
    fullName?: string;
    dob?: string;
    gender?: string;
    address?: string;
    maskedAadhaar?: string;
    registrationNo?: string;
    fatherName?: string;
    motherName?: string;
    receiptNo?: string;
    amount?: number;
    paymentDate?: string;
    paymentMode?: string;
    studentName?: string;
    admissionNo?: string;
    transactionRef?: string;
  };
}

export interface UdiseValidationIssue {
  id: string;
  studentId?: string;
  studentName?: string;
  admissionNo?: string;
  field: string;
  severity: 'ERROR' | 'WARNING';
  message: string;
  category: 'Demographic' | 'Enrollment' | 'Facility' | 'Identification';
}

export interface UdiseSnapshot {
  id: string;
  year: string;
  generatedAt: string;
  totalEnrolled: number;
  boysCount: number;
  girlsCount: number;
  cwsnCount: number;
  categoryBreakdown: { general: number; obc: number; sc: number; st: number; ews: number };
  status: 'DRAFT' | 'VALIDATED' | 'EXPORTED';
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  module: 'ADMISSIONS' | 'ATTENDANCE' | 'ACADEMICS' | 'FEES' | 'STAFF' | 'UDISE' | 'SYSTEM';
  targetId?: string;
  description: string;
}

export interface AppVersionManifest {
  version: string;
  versionCode: number;
  minSupportedVersion: string;
  releaseDate: string;
  releaseChannel: string;
  downloadUrl: string;
  apkChecksumSha256: string;
  packageId: string;
  isRequired: boolean;
  releaseNotes: string[];
}
