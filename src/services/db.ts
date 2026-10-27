import {
  UserProfile,
  StaffMember,
  Student,
  AttendanceRecord,
  Examination,
  MarksEntry,
  FeeStructure,
  FeeInvoice,
  PaymentReceipt,
  AuditLog,
  UdiseValidationIssue,
  UdiseSnapshot,
  UserRole,
} from '../types';

// ========================================================================
// INITIAL SEED DATA FOR JNSD EDUCATION CENTRE
// ========================================================================

export const INITIAL_STAFF: StaffMember[] = [
  {
    id: 'staff-1',
    userId: 'user-manager-1',
    employeeId: 'JNSD-MGR-001',
    fullName: 'Sri Ramesh Chandra Sharma',
    email: 'manager@jnsd.edu',
    role: 'MANAGER',
    designation: 'Manager Sir (Full Administrative Head)',
    phone: '+91 94150 11223',
    qualification: 'M.Sc., M.Ed., Philanthropist',
    joiningDate: '2015-04-01',
    assignedClasses: ['All Classes (PG-8)'],
    assignedSubjects: ['Administration'],
    isClassTeacher: false,
    status: 'ACTIVE',
  },
  {
    id: 'staff-2',
    userId: 'user-principal-1',
    employeeId: 'JNSD-PRN-002',
    fullName: 'Dr. Aruna Saxena',
    email: 'principal@jnsd.edu',
    role: 'PRINCIPAL',
    designation: 'Principal (Admissions & Academic Head)',
    phone: '+91 94150 33445',
    qualification: 'Ph.D. Education, M.A. English',
    joiningDate: '2018-07-01',
    assignedClasses: ['All Classes (PG-8)'],
    assignedSubjects: ['Academics & Oversight'],
    isClassTeacher: false,
    status: 'ACTIVE',
  },
  {
    id: 'staff-3',
    userId: 'user-teacher-sharma',
    employeeId: 'JNSD-TCH-101',
    fullName: 'Rajesh Sharma',
    email: 'rsharma@jnsd.edu',
    role: 'TEACHER',
    designation: 'Senior TGT Teacher',
    phone: '+91 98390 12345',
    qualification: 'B.Sc. (Maths), B.Ed.',
    joiningDate: '2020-03-15',
    assignedClasses: ['Class 5-A', 'Class 6-A'],
    assignedSubjects: ['Mathematics', 'Science'],
    isClassTeacher: true,
    status: 'ACTIVE',
  },
  {
    id: 'staff-4',
    userId: 'user-teacher-verma',
    employeeId: 'JNSD-TCH-102',
    fullName: 'Sunita Verma',
    email: 'sverma@jnsd.edu',
    role: 'TEACHER',
    designation: 'Primary PRT Teacher',
    phone: '+91 98390 54321',
    qualification: 'M.A. Hindi, D.El.Ed.',
    joiningDate: '2021-08-01',
    assignedClasses: ['Class 1-B', 'Class 2-A'],
    assignedSubjects: ['Hindi', 'English', 'Environmental Studies (EVS)'],
    isClassTeacher: true,
    status: 'ACTIVE',
  },
  {
    id: 'staff-5',
    userId: 'user-teacher-amit',
    employeeId: 'JNSD-TCH-103',
    fullName: 'Amit Shukla',
    email: 'ashukla@jnsd.edu',
    role: 'TEACHER',
    designation: 'Computer & Sports Teacher (Revoked)',
    phone: '+91 98390 99887',
    qualification: 'B.C.A., B.P.Ed.',
    joiningDate: '2022-01-10',
    assignedClasses: ['Class 4-A'],
    assignedSubjects: ['Computer'],
    isClassTeacher: false,
    status: 'REVOKED',
    revocationReason: 'Gross violation of school conduct policy; unauthorized fee handling attempted.',
    revokedAt: '2026-10-15T11:30:00Z',
  },
];

export const ALL_CLASSES = [
  'Play Group',
  'Nursery',
  'LKG',
  'UKG',
  'Class 1',
  'Class 2',
  'Class 3',
  'Class 4',
  'Class 5',
  'Class 6',
  'Class 7',
  'Class 8',
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'stu-1',
    admissionNo: 'JNSD/2026/001',
    penNumber: 'PEN2026UP0921001',
    fullName: 'Aarav Sharma',
    dob: '2015-05-14',
    gender: 'MALE',
    bloodGroup: 'B+',
    religion: 'Hindu',
    casteCategory: 'General',
    isCwsn: false,
    aadhaarMasked: 'XXXX-XXXX-4819',
    address: '14/82 Civil Lines, Kanpur, UP',
    district: 'Kanpur Nagar',
    state: 'Uttar Pradesh',
    pinCode: '208001',
    emergencyPhone: '+91 98391 11222',
    admissionDate: '2026-04-05',
    currentClass: 'Class 5',
    currentSection: 'A',
    rollNo: 1,
    status: 'Active',
    documentVerificationStatus: 'VERIFIED',
    guardians: [
      {
        id: 'g-1',
        relationship: 'Father',
        fullName: 'Pradeep Sharma',
        phone: '+91 98391 11222',
        occupation: 'Bank Officer',
        education: 'Post Graduate',
      },
      {
        id: 'g-2',
        relationship: 'Mother',
        fullName: 'Meenakshi Sharma',
        phone: '+91 98391 11223',
        occupation: 'Homemaker',
        education: 'Graduate',
      },
    ],
    documents: [
      {
        id: 'doc-1',
        documentType: 'Aadhaar Card',
        fileName: 'aarav_aadhaar_masked.pdf',
        fileUrl: '#',
        verificationStatus: 'VERIFIED',
        uploadedAt: '2026-04-05',
      },
      {
        id: 'doc-2',
        documentType: 'Birth Certificate',
        fileName: 'aarav_birth_cert.pdf',
        fileUrl: '#',
        verificationStatus: 'VERIFIED',
        uploadedAt: '2026-04-05',
      },
    ],
  },
  {
    id: 'stu-2',
    admissionNo: 'JNSD/2026/002',
    penNumber: 'PEN2026UP0921002',
    fullName: 'Ananya Verma',
    dob: '2015-08-22',
    gender: 'FEMALE',
    bloodGroup: 'O+',
    religion: 'Hindu',
    casteCategory: 'OBC',
    isCwsn: false,
    aadhaarMasked: 'XXXX-XXXX-9023',
    address: '78 Shastri Nagar, Kanpur, UP',
    district: 'Kanpur Nagar',
    state: 'Uttar Pradesh',
    pinCode: '208005',
    emergencyPhone: '+91 94150 99881',
    admissionDate: '2026-04-06',
    currentClass: 'Class 5',
    currentSection: 'A',
    rollNo: 2,
    status: 'Active',
    documentVerificationStatus: 'VERIFIED',
    guardians: [
      {
        id: 'g-3',
        relationship: 'Father',
        fullName: 'Mahesh Verma',
        phone: '+91 94150 99881',
        occupation: 'Business',
        education: 'Graduate',
      },
      {
        id: 'g-4',
        relationship: 'Mother',
        fullName: 'Sunita Verma',
        phone: '+91 94150 99882',
        occupation: 'Teacher',
        education: 'Post Graduate',
      },
    ],
    documents: [
      {
        id: 'doc-3',
        documentType: 'Birth Certificate',
        fileName: 'ananya_birth_cert.pdf',
        fileUrl: '#',
        verificationStatus: 'VERIFIED',
        uploadedAt: '2026-04-06',
      },
    ],
  },
  {
    id: 'stu-3',
    admissionNo: 'JNSD/2026/003',
    penNumber: 'PEN2026UP0921003',
    fullName: 'Reyansh Yadav',
    dob: '2019-11-10',
    gender: 'MALE',
    bloodGroup: 'A+',
    religion: 'Hindu',
    casteCategory: 'OBC',
    isCwsn: false,
    aadhaarMasked: 'XXXX-XXXX-3341',
    address: '22 Kidwai Nagar, Kanpur, UP',
    district: 'Kanpur Nagar',
    state: 'Uttar Pradesh',
    pinCode: '208011',
    emergencyPhone: '+91 98380 44556',
    admissionDate: '2026-04-10',
    currentClass: 'Class 1',
    currentSection: 'B',
    rollNo: 1,
    status: 'Active',
    documentVerificationStatus: 'VERIFIED',
    guardians: [
      {
        id: 'g-5',
        relationship: 'Father',
        fullName: 'Dharmendra Yadav',
        phone: '+91 98380 44556',
        occupation: 'Govt Service',
        education: 'Graduate',
      },
    ],
    documents: [],
  },
  {
    id: 'stu-4',
    admissionNo: 'JNSD/2026/004',
    fullName: 'Aditi Singh',
    dob: '2021-02-18',
    gender: 'FEMALE',
    bloodGroup: 'AB+',
    religion: 'Hindu',
    casteCategory: 'General',
    isCwsn: false,
    aadhaarMasked: 'XXXX-XXXX-7112',
    address: '102 Swaroop Nagar, Kanpur, UP',
    district: 'Kanpur Nagar',
    state: 'Uttar Pradesh',
    pinCode: '208002',
    emergencyPhone: '+91 99180 22334',
    admissionDate: '2026-04-12',
    currentClass: 'Nursery',
    currentSection: 'A',
    rollNo: 1,
    status: 'Active',
    documentVerificationStatus: 'PENDING',
    guardians: [
      {
        id: 'g-6',
        relationship: 'Father',
        fullName: 'Vikram Singh',
        phone: '+91 99180 22334',
        occupation: 'Advocate',
        education: 'LL.B.',
      },
    ],
    documents: [],
  },
];

export const INITIAL_FEE_STRUCTURES: FeeStructure[] = [
  { id: 'fee-1', className: 'Play Group', feeHead: 'Tuition Fee', amount: 1500, frequency: 'Monthly' },
  { id: 'fee-2', className: 'Play Group', feeHead: 'Admission Fee', amount: 3000, frequency: 'One-time' },
  { id: 'fee-3', className: 'Play Group', feeHead: 'Activity & Sports', amount: 800, frequency: 'Quarterly' },

  { id: 'fee-4', className: 'Nursery', feeHead: 'Tuition Fee', amount: 1600, frequency: 'Monthly' },
  { id: 'fee-5', className: 'Nursery', feeHead: 'Annual Charges', amount: 2500, frequency: 'Annual' },

  { id: 'fee-6', className: 'Class 1', feeHead: 'Tuition Fee', amount: 1800, frequency: 'Monthly' },
  { id: 'fee-7', className: 'Class 1', feeHead: 'Computer/Smart Lab', amount: 400, frequency: 'Monthly' },
  { id: 'fee-8', className: 'Class 1', feeHead: 'Examination Fee', amount: 600, frequency: 'Quarterly' },

  { id: 'fee-9', className: 'Class 5', feeHead: 'Tuition Fee', amount: 2200, frequency: 'Monthly' },
  { id: 'fee-10', className: 'Class 5', feeHead: 'Computer/Smart Lab', amount: 500, frequency: 'Monthly' },
  { id: 'fee-11', className: 'Class 5', feeHead: 'Examination Fee', amount: 700, frequency: 'Quarterly' },
  { id: 'fee-12', className: 'Class 5', feeHead: 'Annual Charges', amount: 3500, frequency: 'Annual' },

  { id: 'fee-13', className: 'Class 8', feeHead: 'Tuition Fee', amount: 2600, frequency: 'Monthly' },
  { id: 'fee-14', className: 'Class 8', feeHead: 'Computer/Smart Lab', amount: 600, frequency: 'Monthly' },
];

export const INITIAL_INVOICES: FeeInvoice[] = [
  {
    id: 'inv-1',
    invoiceNo: 'INV/2026/001',
    studentId: 'stu-1',
    studentName: 'Aarav Sharma',
    admissionNo: 'JNSD/2026/001',
    className: 'Class 5',
    section: 'A',
    monthOrPeriod: 'April 2026',
    totalAmount: 3400,
    concessionAmount: 0,
    paidAmount: 3400,
    balanceAmount: 0,
    dueDate: '2026-04-15',
    status: 'PAID',
  },
  {
    id: 'inv-2',
    invoiceNo: 'INV/2026/002',
    studentId: 'stu-2',
    studentName: 'Ananya Verma',
    admissionNo: 'JNSD/2026/002',
    className: 'Class 5',
    section: 'A',
    monthOrPeriod: 'April 2026',
    totalAmount: 3400,
    concessionAmount: 400, // Staff child concession
    paidAmount: 3000,
    balanceAmount: 0,
    dueDate: '2026-04-15',
    status: 'PAID',
  },
  {
    id: 'inv-3',
    invoiceNo: 'INV/2026/003',
    studentId: 'stu-3',
    studentName: 'Reyansh Yadav',
    admissionNo: 'JNSD/2026/003',
    className: 'Class 1',
    section: 'B',
    monthOrPeriod: 'April 2026',
    totalAmount: 2800,
    concessionAmount: 0,
    paidAmount: 1500,
    balanceAmount: 1300,
    dueDate: '2026-04-15',
    status: 'PARTIALLY_PAID',
  },
  {
    id: 'inv-4',
    invoiceNo: 'INV/2026/004',
    studentId: 'stu-4',
    studentName: 'Aditi Singh',
    admissionNo: 'JNSD/2026/004',
    className: 'Nursery',
    section: 'A',
    monthOrPeriod: 'April 2026',
    totalAmount: 4100,
    concessionAmount: 0,
    paidAmount: 0,
    balanceAmount: 4100,
    dueDate: '2026-04-15',
    status: 'OVERDUE',
  },
];

export const INITIAL_RECEIPTS: PaymentReceipt[] = [
  {
    id: 'rec-1',
    receiptNo: 'REC/2026/001',
    invoiceId: 'inv-1',
    studentId: 'stu-1',
    studentName: 'Aarav Sharma',
    admissionNo: 'JNSD/2026/001',
    className: 'Class 5-A',
    amount: 3400,
    paymentMode: 'UPI',
    transactionRef: 'UPI/314159265358',
    paymentDate: '2026-04-10',
    receivedBy: 'Sri Ramesh Chandra Sharma (Manager Sir)',
    feeBreakdown: [
      { head: 'Tuition Fee (April)', amount: 2200 },
      { head: 'Computer/Smart Lab', amount: 500 },
      { head: 'Examination Fee', amount: 700 },
    ],
    remarks: 'Paid in full via PhonePe UPI',
  },
  {
    id: 'rec-2',
    receiptNo: 'REC/2026/002',
    invoiceId: 'inv-2',
    studentId: 'stu-2',
    studentName: 'Ananya Verma',
    admissionNo: 'JNSD/2026/002',
    className: 'Class 5-A',
    amount: 3000,
    paymentMode: 'CASH',
    paymentDate: '2026-04-12',
    receivedBy: 'Sri Ramesh Chandra Sharma (Manager Sir)',
    feeBreakdown: [
      { head: 'Tuition Fee (April) with Concession', amount: 1800 },
      { head: 'Computer/Smart Lab', amount: 500 },
      { head: 'Examination Fee', amount: 700 },
    ],
    remarks: 'Staff ward concession applied',
  },
];

export const INITIAL_EXAMS: Examination[] = [
  {
    id: 'exam-1',
    name: 'Half-Yearly Examination (Term 1)',
    term: 'Term 1',
    academicYear: '2026-2027',
    startDate: '2026-09-15',
    endDate: '2026-09-26',
    isPublished: true,
  },
  {
    id: 'exam-2',
    name: 'Annual Final Examination (Term 2)',
    term: 'Term 2',
    academicYear: '2026-2027',
    startDate: '2027-02-20',
    endDate: '2027-03-05',
    isPublished: false,
  },
];

export const INITIAL_MARKS: MarksEntry[] = [
  // Aarav Sharma - Class 5
  {
    id: 'm-1',
    examId: 'exam-1',
    studentId: 'stu-1',
    studentName: 'Aarav Sharma',
    rollNo: 1,
    className: 'Class 5',
    subjectName: 'Mathematics',
    marksObtained: 94,
    maxMarks: 100,
    grade: 'A1',
    remarks: 'Outstanding logical ability',
  },
  {
    id: 'm-2',
    examId: 'exam-1',
    studentId: 'stu-1',
    studentName: 'Aarav Sharma',
    rollNo: 1,
    className: 'Class 5',
    subjectName: 'Science',
    marksObtained: 88,
    maxMarks: 100,
    grade: 'A2',
    remarks: 'Very attentive in practicals',
  },
  {
    id: 'm-3',
    examId: 'exam-1',
    studentId: 'stu-1',
    studentName: 'Aarav Sharma',
    rollNo: 1,
    className: 'Class 5',
    subjectName: 'English',
    marksObtained: 85,
    maxMarks: 100,
    grade: 'A2',
    remarks: 'Good comprehension',
  },
  {
    id: 'm-4',
    examId: 'exam-1',
    studentId: 'stu-1',
    studentName: 'Aarav Sharma',
    rollNo: 1,
    className: 'Class 5',
    subjectName: 'Hindi',
    marksObtained: 89,
    maxMarks: 100,
    grade: 'A2',
    remarks: 'Excellent handwriting',
  },
  {
    id: 'm-5',
    examId: 'exam-1',
    studentId: 'stu-1',
    studentName: 'Aarav Sharma',
    rollNo: 1,
    className: 'Class 5',
    subjectName: 'Social Studies',
    marksObtained: 82,
    maxMarks: 100,
    grade: 'B1',
    remarks: 'Good participation',
  },

  // Ananya Verma - Class 5
  {
    id: 'm-6',
    examId: 'exam-1',
    studentId: 'stu-2',
    studentName: 'Ananya Verma',
    rollNo: 2,
    className: 'Class 5',
    subjectName: 'Mathematics',
    marksObtained: 98,
    maxMarks: 100,
    grade: 'A1',
    remarks: 'Class topper in Mathematics',
  },
  {
    id: 'm-7',
    examId: 'exam-1',
    studentId: 'stu-2',
    studentName: 'Ananya Verma',
    rollNo: 2,
    className: 'Class 5',
    subjectName: 'Science',
    marksObtained: 95,
    maxMarks: 100,
    grade: 'A1',
    remarks: 'Exemplary project work',
  },
  {
    id: 'm-8',
    examId: 'exam-1',
    studentId: 'stu-2',
    studentName: 'Ananya Verma',
    rollNo: 2,
    className: 'Class 5',
    subjectName: 'English',
    marksObtained: 92,
    maxMarks: 100,
    grade: 'A1',
    remarks: 'Superb vocabulary',
  },
  {
    id: 'm-9',
    examId: 'exam-1',
    studentId: 'stu-2',
    studentName: 'Ananya Verma',
    rollNo: 2,
    className: 'Class 5',
    subjectName: 'Hindi',
    marksObtained: 94,
    maxMarks: 100,
    grade: 'A1',
    remarks: 'Fluency in recitation',
  },
  {
    id: 'm-10',
    examId: 'exam-1',
    studentId: 'stu-2',
    studentName: 'Ananya Verma',
    rollNo: 2,
    className: 'Class 5',
    subjectName: 'Social Studies',
    marksObtained: 90,
    maxMarks: 100,
    grade: 'A1',
    remarks: 'Great knowledge of geography',
  },
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    timestamp: '2026-04-05T09:30:00Z',
    actorName: 'Dr. Aruna Saxena',
    actorRole: 'PRINCIPAL',
    action: 'STUDENT_ADMISSION',
    module: 'ADMISSIONS',
    targetId: 'stu-1',
    description: 'Admitted Aarav Sharma to Class 5-A with Admission No. JNSD/2026/001.',
  },
  {
    id: 'log-2',
    timestamp: '2026-04-10T11:15:00Z',
    actorName: 'Sri Ramesh Chandra Sharma',
    actorRole: 'MANAGER',
    action: 'PAYMENT_RECORDED',
    module: 'FEES',
    targetId: 'rec-1',
    description: 'Recorded fee payment ₹3,400 via UPI (Ref: UPI/314159265358) for Aarav Sharma.',
  },
  {
    id: 'log-3',
    timestamp: '2026-10-15T11:30:00Z',
    actorName: 'Sri Ramesh Chandra Sharma',
    actorRole: 'MANAGER',
    action: 'ACCOUNT_REVOKED',
    module: 'STAFF',
    targetId: 'staff-5',
    description: 'Revoked access for Amit Shukla (JNSD-TCH-103) due to policy violation.',
  },
];

// ========================================================================
// PERSISTENT DATABASE REPOSITORY CLASS WITH RBAC ENFORCEMENT
// ========================================================================

const STORAGE_KEYS = {
  STUDENTS: 'jnsd_erp_students_v1',
  STAFF: 'jnsd_erp_staff_v1',
  ATTENDANCE: 'jnsd_erp_attendance_v1',
  EXAMS: 'jnsd_erp_exams_v1',
  MARKS: 'jnsd_erp_marks_v1',
  FEE_STRUCTURES: 'jnsd_erp_fee_structures_v1',
  INVOICES: 'jnsd_erp_invoices_v1',
  RECEIPTS: 'jnsd_erp_receipts_v1',
  AUDIT_LOGS: 'jnsd_erp_audit_logs_v1',
  UDISE_SNAPSHOTS: 'jnsd_erp_udise_snapshots_v1',
};

export class SchoolDatabase {
  private get<T>(key: string, fallback: T): T {
    try {
      const data = localStorage.getItem(key);
      if (!data) return fallback;
      return JSON.parse(data) as T;
    } catch {
      return fallback;
    }
  }

  private set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Failed to persist key: ${key}`, e);
    }
  }

  // ----------------------------------------------------------------------
  // AUDIT LOGGING HELPER
  // ----------------------------------------------------------------------
  public logAudit(actor: UserProfile, action: string, module: AuditLog['module'], description: string, targetId?: string) {
    const logs = this.get<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      actorName: actor.fullName,
      actorRole: actor.role,
      action,
      module,
      targetId,
      description,
    };
    logs.unshift(newLog);
    this.set(STORAGE_KEYS.AUDIT_LOGS, logs);
  }

  public getAuditLogs(actor: UserProfile): AuditLog[] {
    if (actor.role !== 'MANAGER' && actor.role !== 'PRINCIPAL') {
      throw new Error('Access Denied: Only Manager and Principal can view the school audit log.');
    }
    return this.get<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
  }

  // ----------------------------------------------------------------------
  // STAFF & ACCESS MANAGEMENT
  // ----------------------------------------------------------------------
  public getStaff(actor: UserProfile): StaffMember[] {
    if (actor.role !== 'MANAGER' && actor.role !== 'PRINCIPAL') {
      throw new Error('Access Denied: You do not have permission to view staff records.');
    }
    return this.get<StaffMember[]>(STORAGE_KEYS.STAFF, INITIAL_STAFF);
  }

  public createTeacher(
    actor: UserProfile,
    data: {
      fullName: string;
      email: string;
      phone: string;
      qualification: string;
      assignedClasses: string[];
      assignedSubjects: string[];
      isClassTeacher: boolean;
      temporaryPassword?: string;
    }
  ): StaffMember {
    if (actor.role !== 'MANAGER' && actor.role !== 'PRINCIPAL') {
      throw new Error('Access Denied: Only Manager Sir and Principal can create teacher accounts.');
    }

    const staffList = this.get<StaffMember[]>(STORAGE_KEYS.STAFF, INITIAL_STAFF);
    const newCode = `JNSD-TCH-${100 + staffList.length + 1}`;
    const newStaff: StaffMember = {
      id: `staff-${Date.now()}`,
      userId: `user-tch-${Date.now()}`,
      employeeId: newCode,
      fullName: data.fullName,
      email: data.email,
      role: 'TEACHER',
      designation: data.isClassTeacher ? `Class Teacher (${data.assignedClasses.join(', ')})` : 'Subject Teacher',
      phone: data.phone,
      qualification: data.qualification,
      joiningDate: new Date().toISOString().split('T')[0],
      assignedClasses: data.assignedClasses,
      assignedSubjects: data.assignedSubjects,
      isClassTeacher: data.isClassTeacher,
      status: 'ACTIVE',
      mustChangePassword: true,
    };

    staffList.push(newStaff);
    this.set(STORAGE_KEYS.STAFF, staffList);

    this.logAudit(
      actor,
      'TEACHER_PROVISIONED',
      'STAFF',
      `Provisioned teacher account ${newStaff.fullName} (${newCode}) with classes: ${data.assignedClasses.join(', ')}`,
      newStaff.id
    );

    return newStaff;
  }

  public revokeStaffAccess(actor: UserProfile, staffId: string, reason: string): StaffMember {
    if (actor.role !== 'MANAGER' && actor.role !== 'PRINCIPAL') {
      throw new Error('Access Denied: Only Manager Sir and Principal can revoke staff access.');
    }

    const staffList = this.get<StaffMember[]>(STORAGE_KEYS.STAFF, INITIAL_STAFF);
    const target = staffList.find((s) => s.id === staffId);
    if (!target) throw new Error('Staff record not found.');

    if (target.role === 'MANAGER') {
      throw new Error('Forbidden: The Manager account cannot be revoked.');
    }

    // Principal cannot revoke Manager
    if (actor.role === 'PRINCIPAL' && target.role !== 'TEACHER') {
      throw new Error('Principal can only revoke eligible Class Teacher accounts.');
    }

    target.status = 'REVOKED';
    target.revocationReason = reason;
    target.revokedAt = new Date().toISOString();

    this.set(STORAGE_KEYS.STAFF, staffList);

    this.logAudit(
      actor,
      'ACCOUNT_REVOKED',
      'STAFF',
      `Revoked access for ${target.fullName} (${target.employeeId}). Reason: ${reason}`,
      target.id
    );

    return target;
  }

  public suspendStaffAccess(actor: UserProfile, staffId: string, reason: string): StaffMember {
    if (actor.role !== 'MANAGER' && actor.role !== 'PRINCIPAL') {
      throw new Error('Access Denied: Only Manager and Principal can suspend staff.');
    }
    const staffList = this.get<StaffMember[]>(STORAGE_KEYS.STAFF, INITIAL_STAFF);
    const target = staffList.find((s) => s.id === staffId);
    if (!target) throw new Error('Staff not found.');
    if (target.role === 'MANAGER') throw new Error('Cannot suspend Manager Sir.');

    target.status = 'SUSPENDED';
    target.revocationReason = reason;
    this.set(STORAGE_KEYS.STAFF, staffList);

    this.logAudit(actor, 'ACCOUNT_SUSPENDED', 'STAFF', `Suspended access for ${target.fullName}. Reason: ${reason}`, target.id);
    return target;
  }

  public restoreStaffAccess(actor: UserProfile, staffId: string): StaffMember {
    if (actor.role !== 'MANAGER') {
      throw new Error('Access Denied: Only Manager Sir can restore a revoked or suspended staff account.');
    }
    const staffList = this.get<StaffMember[]>(STORAGE_KEYS.STAFF, INITIAL_STAFF);
    const target = staffList.find((s) => s.id === staffId);
    if (!target) throw new Error('Staff not found.');

    target.status = 'ACTIVE';
    target.revocationReason = undefined;
    target.revokedAt = undefined;
    this.set(STORAGE_KEYS.STAFF, staffList);

    this.logAudit(actor, 'ACCOUNT_RESTORED', 'STAFF', `Restored active access for ${target.fullName} (${target.employeeId}).`, target.id);
    return target;
  }

  // ----------------------------------------------------------------------
  // STUDENTS & ADMISSIONS
  // ----------------------------------------------------------------------
  public getStudents(actor: UserProfile, filterClass?: string): Student[] {
    if (actor.status === 'REVOKED' || actor.status === 'SUSPENDED') {
      throw new Error('Account Access Revoked.');
    }

    let students = this.get<Student[]>(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS);

    // If teacher, restrict to assigned classes
    if (actor.role === 'TEACHER') {
      const staffList = this.get<StaffMember[]>(STORAGE_KEYS.STAFF, INITIAL_STAFF);
      const teacher = staffList.find((s) => s.userId === actor.id || s.email === actor.email);
      if (teacher) {
        const assignedClassNames = teacher.assignedClasses.map((c) => c.split('-')[0].trim());
        students = students.filter((s) => assignedClassNames.includes(s.currentClass));
      }
    }

    if (filterClass && filterClass !== 'All') {
      students = students.filter((s) => s.currentClass === filterClass);
    }

    return students;
  }

  public checkDuplicateStudent(fullName: string, dob: string, fatherPhone: string): Student | null {
    const students = this.get<Student[]>(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS);
    const normalizedName = fullName.trim().toLowerCase();
    return (
      students.find(
        (s) =>
          s.fullName.trim().toLowerCase() === normalizedName &&
          (s.dob === dob || s.guardians.some((g) => g.phone.replace(/\D/g, '') === fatherPhone.replace(/\D/g, '')))
      ) || null
    );
  }

  public admitStudent(actor: UserProfile, studentData: Omit<Student, 'id' | 'admissionNo' | 'status'>): Student {
    if (actor.role !== 'MANAGER' && actor.role !== 'PRINCIPAL') {
      throw new Error('Access Denied: Only Manager Sir and Principal can process student admissions.');
    }

    const students = this.get<Student[]>(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS);

    // Generate unique admission number
    const year = new Date().getFullYear();
    const nextSeq = String(students.length + 1).padStart(3, '0');
    const admissionNo = `JNSD/${year}/${nextSeq}`;

    const newStudent: Student = {
      ...studentData,
      id: `stu-${Date.now()}`,
      admissionNo,
      status: 'Active',
      admissionDate: studentData.admissionDate || new Date().toISOString().split('T')[0],
      penNumber: studentData.penNumber || `PEN${year}UP0921${nextSeq}`,
    };

    students.push(newStudent);
    this.set(STORAGE_KEYS.STUDENTS, students);

    // Automatically generate first month's invoice
    this.generateAdmissionInvoice(newStudent);

    this.logAudit(
      actor,
      'STUDENT_ADMISSION',
      'ADMISSIONS',
      `Completed admission for ${newStudent.fullName} into ${newStudent.currentClass}-${newStudent.currentSection}. Admission No: ${newStudent.admissionNo}`,
      newStudent.id
    );

    return newStudent;
  }

  private generateAdmissionInvoice(student: Student) {
    const invoices = this.get<FeeInvoice[]>(STORAGE_KEYS.INVOICES, INITIAL_INVOICES);
    const feeStructures = this.get<FeeStructure[]>(STORAGE_KEYS.FEE_STRUCTURES, INITIAL_FEE_STRUCTURES);
    const applicable = feeStructures.filter((f) => f.className === student.currentClass);

    const total = applicable.reduce((acc, curr) => acc + curr.amount, 0) || 2000;
    const invNo = `INV/${new Date().getFullYear()}/${String(invoices.length + 1).padStart(3, '0')}`;

    const newInvoice: FeeInvoice = {
      id: `inv-${Date.now()}`,
      invoiceNo: invNo,
      studentId: student.id,
      studentName: student.fullName,
      admissionNo: student.admissionNo,
      className: student.currentClass,
      section: student.currentSection,
      monthOrPeriod: 'Current Month',
      totalAmount: total,
      concessionAmount: 0,
      paidAmount: 0,
      balanceAmount: total,
      dueDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
      status: 'UNPAID',
    };

    invoices.push(newInvoice);
    this.set(STORAGE_KEYS.INVOICES, invoices);
  }

  // ----------------------------------------------------------------------
  // ATTENDANCE MANAGEMENT
  // ----------------------------------------------------------------------
  public getAttendance(actor: UserProfile, className: string, section: string, date: string): AttendanceRecord[] {
    if (actor.status === 'REVOKED' || actor.status === 'SUSPENDED') {
      throw new Error('Account Access Revoked.');
    }

    // Teacher check
    if (actor.role === 'TEACHER') {
      const staffList = this.get<StaffMember[]>(STORAGE_KEYS.STAFF, INITIAL_STAFF);
      const teacher = staffList.find((s) => s.userId === actor.id || s.email === actor.email);
      if (teacher) {
        const assigned = teacher.assignedClasses.map((c) => c.replace(/\s+/g, '').toUpperCase());
        const requested = `${className}-${section}`.replace(/\s+/g, '').toUpperCase();
        const baseRequested = className.replace(/\s+/g, '').toUpperCase();
        const canAccess = assigned.some((a) => a.startsWith(baseRequested) || a === requested);
        if (!canAccess) {
          throw new Error(`Access Denied: You are not assigned to take attendance for ${className}-${section}.`);
        }
      }
    }

    const allAttendance = this.get<AttendanceRecord[]>(STORAGE_KEYS.ATTENDANCE, []);
    const matching = allAttendance.filter((a) => a.className === className && a.section === section && a.date === date);

    if (matching.length > 0) return matching;

    // Generate draft attendance records for all active students of that class/section
    const students = this.getStudents(actor, className).filter((s) => s.currentSection === section);
    return students.map((s, idx) => ({
      id: `att-draft-${s.id}-${date}`,
      studentId: s.id,
      studentName: s.fullName,
      admissionNo: s.admissionNo,
      rollNo: s.rollNo || idx + 1,
      className,
      section,
      date,
      status: 'PRESENT',
    }));
  }

  public saveAttendance(actor: UserProfile, records: AttendanceRecord[]): void {
    if (records.length === 0) return;

    if (actor.role === 'TEACHER') {
      const sample = records[0];
      const staffList = this.get<StaffMember[]>(STORAGE_KEYS.STAFF, INITIAL_STAFF);
      const teacher = staffList.find((s) => s.userId === actor.id || s.email === actor.email);
      if (teacher) {
        const assigned = teacher.assignedClasses.map((c) => c.replace(/\s+/g, '').toUpperCase());
        const requested = `${sample.className}-${sample.section}`.replace(/\s+/g, '').toUpperCase();
        const baseRequested = sample.className.replace(/\s+/g, '').toUpperCase();
        if (!assigned.some((a) => a.startsWith(baseRequested) || a === requested)) {
          throw new Error(`Unauthorized: Cannot submit attendance for ${sample.className}-${sample.section}.`);
        }
      }
    }

    const allAttendance = this.get<AttendanceRecord[]>(STORAGE_KEYS.ATTENDANCE, []);
    const recordMap = new Map<string, AttendanceRecord>();
    allAttendance.forEach((a) => recordMap.set(`${a.studentId}_${a.date}`, a));

    records.forEach((r) => {
      recordMap.set(`${r.studentId}_${r.date}`, {
        ...r,
        id: r.id.startsWith('att-draft-') ? `att-${Date.now()}-${r.studentId}` : r.id,
        markedBy: actor.fullName,
        updatedAt: new Date().toISOString(),
      });
    });

    const updatedList = Array.from(recordMap.values());
    this.set(STORAGE_KEYS.ATTENDANCE, updatedList);

    const first = records[0];
    this.logAudit(
      actor,
      'ATTENDANCE_MARKED',
      'ATTENDANCE',
      `Marked attendance for ${first.className}-${first.section} on ${first.date} (${records.length} students).`
    );
  }

  // ----------------------------------------------------------------------
  // ACADEMICS & EXAMINATIONS
  // ----------------------------------------------------------------------
  public getExaminations(): Examination[] {
    return this.get<Examination[]>(STORAGE_KEYS.EXAMS, INITIAL_EXAMS);
  }

  public getMarks(actor: UserProfile, examId: string, className: string, subjectName: string): MarksEntry[] {
    const allMarks = this.get<MarksEntry[]>(STORAGE_KEYS.MARKS, INITIAL_MARKS);
    const existing = allMarks.filter((m) => m.examId === examId && m.className === className && m.subjectName === subjectName);

    if (existing.length > 0) return existing;

    // Generate initial blank sheet for students of this class
    const students = this.getStudents(actor, className);
    return students.map((s, idx) => ({
      id: `mark-draft-${s.id}-${examId}`,
      examId,
      studentId: s.id,
      studentName: s.fullName,
      rollNo: s.rollNo || idx + 1,
      className,
      subjectName,
      marksObtained: 0,
      maxMarks: 100,
      grade: 'E',
    }));
  }

  public saveMarks(actor: UserProfile, marks: MarksEntry[]): void {
    if (marks.length === 0) return;

    // Validate marks limits
    marks.forEach((m) => {
      if (m.marksObtained < 0 || m.marksObtained > m.maxMarks) {
        throw new Error(`Invalid marks (${m.marksObtained}) for ${m.studentName}. Must be between 0 and ${m.maxMarks}.`);
      }
      m.grade = this.calculateCbseGrade((m.marksObtained / m.maxMarks) * 100);
    });

    const allMarks = this.get<MarksEntry[]>(STORAGE_KEYS.MARKS, INITIAL_MARKS);
    const markMap = new Map<string, MarksEntry>();
    allMarks.forEach((m) => markMap.set(`${m.examId}_${m.studentId}_${m.subjectName}`, m));

    marks.forEach((m) => {
      markMap.set(`${m.examId}_${m.studentId}_${m.subjectName}`, {
        ...m,
        id: m.id.startsWith('mark-draft-') ? `mark-${Date.now()}-${m.studentId}` : m.id,
      });
    });

    this.set(STORAGE_KEYS.MARKS, Array.from(markMap.values()));

    const first = marks[0];
    this.logAudit(
      actor,
      'MARKS_ENTERED',
      'ACADEMICS',
      `Entered ${first.subjectName} examination marks for ${first.className} (${marks.length} students).`
    );
  }

  public calculateCbseGrade(percentage: number): string {
    if (percentage >= 91) return 'A1';
    if (percentage >= 81) return 'A2';
    if (percentage >= 71) return 'B1';
    if (percentage >= 61) return 'B2';
    if (percentage >= 51) return 'C1';
    if (percentage >= 41) return 'C2';
    if (percentage >= 33) return 'D';
    return 'E (Needs Improvement)';
  }

  // ----------------------------------------------------------------------
  // FEES & ACCOUNTS (RESTRICTED - MANAGER ONLY!)
  // ----------------------------------------------------------------------
  private assertManagerRole(actor: UserProfile, actionDesc: string) {
    if (actor.role !== 'MANAGER') {
      throw new Error(`Access Denied: Only Manager Sir has authorized access to ${actionDesc}. Access denied for ${actor.role}.`);
    }
  }

  public getFeeStructures(actor: UserProfile): FeeStructure[] {
    this.assertManagerRole(actor, 'Fee Structures');
    return this.get<FeeStructure[]>(STORAGE_KEYS.FEE_STRUCTURES, INITIAL_FEE_STRUCTURES);
  }

  public getFeeInvoices(actor: UserProfile): FeeInvoice[] {
    this.assertManagerRole(actor, 'Fee Invoices & Student Balances');
    return this.get<FeeInvoice[]>(STORAGE_KEYS.INVOICES, INITIAL_INVOICES);
  }

  public getPaymentReceipts(actor: UserProfile): PaymentReceipt[] {
    this.assertManagerRole(actor, 'Payment Receipts and Ledger');
    return this.get<PaymentReceipt[]>(STORAGE_KEYS.RECEIPTS, INITIAL_RECEIPTS);
  }

  public recordFeePayment(
    actor: UserProfile,
    data: {
      invoiceId: string;
      amount: number;
      paymentMode: PaymentReceipt['paymentMode'];
      transactionRef?: string;
      remarks?: string;
    }
  ): PaymentReceipt {
    this.assertManagerRole(actor, 'Record Fee Payments');

    const invoices = this.get<FeeInvoice[]>(STORAGE_KEYS.INVOICES, INITIAL_INVOICES);
    const invoice = invoices.find((inv) => inv.id === data.invoiceId);
    if (!invoice) throw new Error('Invoice not found.');

    if (data.amount <= 0) throw new Error('Payment amount must be greater than zero.');
    if (data.amount > invoice.balanceAmount) {
      throw new Error(`Payment amount (₹${data.amount}) cannot exceed remaining balance (₹${invoice.balanceAmount}).`);
    }

    const receipts = this.get<PaymentReceipt[]>(STORAGE_KEYS.RECEIPTS, INITIAL_RECEIPTS);
    const receiptNo = `REC/${new Date().getFullYear()}/${String(receipts.length + 1).padStart(3, '0')}`;

    // Update invoice balance
    invoice.paidAmount += data.amount;
    invoice.balanceAmount -= data.amount;
    invoice.status = invoice.balanceAmount === 0 ? 'PAID' : 'PARTIALLY_PAID';

    const newReceipt: PaymentReceipt = {
      id: `rec-${Date.now()}`,
      receiptNo,
      invoiceId: invoice.id,
      studentId: invoice.studentId,
      studentName: invoice.studentName,
      admissionNo: invoice.admissionNo,
      className: `${invoice.className}-${invoice.section}`,
      amount: data.amount,
      paymentMode: data.paymentMode,
      transactionRef: data.transactionRef,
      paymentDate: new Date().toISOString().split('T')[0],
      receivedBy: actor.fullName,
      feeBreakdown: [{ head: `Fee Payment (${invoice.monthOrPeriod})`, amount: data.amount }],
      remarks: data.remarks,
    };

    receipts.unshift(newReceipt);
    this.set(STORAGE_KEYS.INVOICES, invoices);
    this.set(STORAGE_KEYS.RECEIPTS, receipts);

    this.logAudit(
      actor,
      'PAYMENT_RECORDED',
      'FEES',
      `Recorded payment ₹${data.amount} via ${data.paymentMode} for ${invoice.studentName}. Receipt: ${receiptNo}`,
      newReceipt.id
    );

    return newReceipt;
  }

  // ----------------------------------------------------------------------
  // UDISE+ REPORTING & VALIDATION
  // ----------------------------------------------------------------------
  public validateUdiseData(): UdiseValidationIssue[] {
    const students = this.get<Student[]>(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS);
    const issues: UdiseValidationIssue[] = [];

    students.forEach((s) => {
      // 1. Mandatory PEN check
      if (!s.penNumber || s.penNumber.trim() === '') {
        issues.push({
          id: `u-pen-${s.id}`,
          studentId: s.id,
          studentName: s.fullName,
          admissionNo: s.admissionNo,
          field: 'penNumber',
          severity: 'WARNING',
          category: 'Identification',
          message: 'UDISE+ Permanent Education Number (PEN) is missing.',
        });
      }

      // 2. Aadhaar verification check
      if (!s.aadhaarMasked || s.aadhaarMasked.trim() === '') {
        issues.push({
          id: `u-aadh-${s.id}`,
          studentId: s.id,
          studentName: s.fullName,
          admissionNo: s.admissionNo,
          field: 'aadhaarMasked',
          severity: 'WARNING',
          category: 'Identification',
          message: 'Aadhaar UID is not recorded or masked.',
        });
      }

      // 3. Date of birth reasonable check
      const age = new Date().getFullYear() - new Date(s.dob).getFullYear();
      if (s.currentClass === 'Play Group' && (age < 2 || age > 4)) {
        issues.push({
          id: `u-age-${s.id}`,
          studentId: s.id,
          studentName: s.fullName,
          admissionNo: s.admissionNo,
          field: 'dob',
          severity: 'ERROR',
          category: 'Demographic',
          message: `Age (${age}) is outside expected range (2-4 yrs) for Play Group.`,
        });
      }

      // 4. Social Category check
      if (!s.casteCategory) {
        issues.push({
          id: `u-cat-${s.id}`,
          studentId: s.id,
          studentName: s.fullName,
          admissionNo: s.admissionNo,
          field: 'casteCategory',
          severity: 'ERROR',
          category: 'Demographic',
          message: 'Social Category (General/OBC/SC/ST/EWS) is required for UDISE+.',
        });
      }

      // 5. Guardian check
      if (!s.guardians || s.guardians.length === 0) {
        issues.push({
          id: `u-g-${s.id}`,
          studentId: s.id,
          studentName: s.fullName,
          admissionNo: s.admissionNo,
          field: 'guardians',
          severity: 'ERROR',
          category: 'Enrollment',
          message: 'At least one parent/guardian contact is mandatory for reporting.',
        });
      }
    });

    return issues;
  }

  public generateUdiseSnapshot(actor: UserProfile): UdiseSnapshot {
    const students = this.get<Student[]>(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS);
    const boys = students.filter((s) => s.gender === 'MALE').length;
    const girls = students.filter((s) => s.gender === 'FEMALE').length;
    const cwsn = students.filter((s) => s.isCwsn).length;

    const breakdown = {
      general: students.filter((s) => s.casteCategory === 'General').length,
      obc: students.filter((s) => s.casteCategory === 'OBC').length,
      sc: students.filter((s) => s.casteCategory === 'SC').length,
      st: students.filter((s) => s.casteCategory === 'ST').length,
      ews: students.filter((s) => s.casteCategory === 'EWS').length,
    };

    const snapshot: UdiseSnapshot = {
      id: `udise-snap-${Date.now()}`,
      year: '2026-2027',
      generatedAt: new Date().toISOString(),
      totalEnrolled: students.length,
      boysCount: boys,
      girlsCount: girls,
      cwsnCount: cwsn,
      categoryBreakdown: breakdown,
      status: 'VALIDATED',
    };

    this.logAudit(
      actor,
      'UDISE_SNAPSHOT_GENERATED',
      'UDISE',
      `Generated official UDISE+ report snapshot for 2026-2027 (${students.length} students enrolled).`
    );

    return snapshot;
  }
}

export const db = new SchoolDatabase();
