import { describe, it, expect, beforeEach } from 'vitest';
import { db, SchoolDatabase } from '../services/db';
import { parseExtractedText } from '../services/ocr';
import { UserProfile } from '../types';

describe('JNSD EDUCATION CENTRE SCHOOL ERP - TEST SUITE', () => {
  let managerUser: UserProfile;
  let principalUser: UserProfile;
  let teacherUser: UserProfile;
  let revokedUser: UserProfile;

  beforeEach(() => {
    localStorage.clear();

    managerUser = {
      id: 'user-manager-1',
      email: 'manager@jnsd.edu',
      fullName: 'Lalitesh Kumar Dixit (Manager Sir)',
      role: 'MANAGER',
      status: 'ACTIVE',
    };

    principalUser = {
      id: 'user-principal-1',
      email: 'principal@jnsd.edu',
      fullName: 'Ram Jiyawan Yadav (Principal)',
      role: 'PRINCIPAL',
      status: 'ACTIVE',
    };

    teacherUser = {
      id: 'user-teacher-sharma',
      email: 'rsharma@jnsd.edu',
      fullName: 'Rajesh Sharma',
      role: 'TEACHER',
      status: 'ACTIVE',
    };

    revokedUser = {
      id: 'user-teacher-amit',
      email: 'ashukla@jnsd.edu',
      fullName: 'Amit Shukla',
      role: 'TEACHER',
      status: 'REVOKED',
      revocationReason: 'Policy violation',
    };
  });

  // ----------------------------------------------------------------------
  // 1. STRICT ROLE-BASED ACCESS CONTROL (RBAC) & PERMISSION ENFORCEMENT
  // ----------------------------------------------------------------------
  describe('1. Role-Based Access Control & Isolation', () => {
    it('Manager Sir has full authorized access to Fee Invoices and Structures', () => {
      const invoices = db.getFeeInvoices(managerUser);
      expect(invoices.length).toBeGreaterThan(0);

      const structures = db.getFeeStructures(managerUser);
      expect(structures.length).toBeGreaterThan(0);
    });

    it('Manager and Principal can both access Fee Invoices, Structures, and Submissions Queue', () => {
      const invoices = db.getFeeInvoices(principalUser);
      expect(invoices.length).toBeGreaterThan(0);

      const structures = db.getFeeStructures(principalUser);
      expect(structures.length).toBeGreaterThan(0);

      const submissions = db.getFeeSubmissions(principalUser);
      expect(Array.isArray(submissions)).toBe(true);
    });

    it('Principal submission creates a PENDING_MANAGER_APPROVAL record without altering invoice balance', () => {
      const invoices = db.getFeeInvoices(principalUser);
      const target = invoices.find((inv) => inv.balanceAmount > 0)!;
      const initialBalance = target.balanceAmount;

      const subRes = db.recordFeePayment(principalUser, {
        invoiceId: target.id,
        amount: 500,
        paymentMode: 'CASH',
        remarks: 'Test Principal submission',
      });

      expect(subRes.status).toBe('PENDING_MANAGER_APPROVAL');
      if (subRes.status === 'PENDING_MANAGER_APPROVAL') {
        expect(subRes.submission.submittedByRole).toBe('PRINCIPAL');
        expect(subRes.submission.amount).toBe(500);

        // Verify invoice balance did NOT change yet!
        const refreshed = db.getFeeInvoices(managerUser).find((i) => i.id === target.id)!;
        expect(refreshed.balanceAmount).toBe(initialBalance);

        // Now Manager Sir confirms the submission
        const approvedRes = db.approveFeeSubmission(managerUser, subRes.submission.id);
        expect(approvedRes.submission.status).toBe('APPROVED');
        expect(approvedRes.receipt.approvedBy).toBe('Lalitesh Kumar Dixit (Manager Sir)');

        // Now invoice balance IS deducted!
        const finalInvoice = db.getFeeInvoices(managerUser).find((i) => i.id === target.id)!;
        expect(finalInvoice.balanceAmount).toBe(initialBalance - 500);
      }
    });

    it('Class Teachers are strictly blocked from accessing Fees & Accounts', () => {
      expect(() => db.getFeeInvoices(teacherUser)).toThrowError(
        /Access Denied: Only Manager Sir and Principal have authorized access to Fee Invoices/
      );
      expect(() => db.getFeeStructures(teacherUser)).toThrowError(
        /Access Denied: Only Manager Sir and Principal have authorized access to Fee Structures/
      );
    });

    it('Revoked accounts are instantly blocked from accessing student or attendance records', () => {
      expect(() => db.getStudents(revokedUser)).toThrowError(/Account Access Revoked/);
      expect(() => db.getAttendance(revokedUser, 'Class 5', 'A', '2026-04-10')).toThrowError(
        /Account Access Revoked/
      );
    });

    it('Teachers cannot access or submit attendance for unassigned classes', () => {
      // Teacher Rajesh Sharma is assigned Class 5-A, Class 6-A
      expect(() => db.getAttendance(teacherUser, 'Class 8', 'B', '2026-04-10')).toThrowError(
        /Access Denied: You are not assigned to take attendance for Class 8-B/
      );
    });
  });

  // ----------------------------------------------------------------------
  // 2. FINANCIAL CALCULATIONS & LEDGER INTEGRITY
  // ----------------------------------------------------------------------
  describe('2. Fees & Financial Calculations', () => {
    it('Records fee payments, reduces balance accurately, and transitions invoice status', () => {
      const invoicesBefore = db.getFeeInvoices(managerUser);
      const targetInvoice = invoicesBefore.find((inv) => inv.balanceAmount > 0)!;
      const initialBalance = targetInvoice.balanceAmount;
      const initialPaid = targetInvoice.paidAmount;
      const paymentAmount = 500;

      const res = db.recordFeePayment(managerUser, {
        invoiceId: targetInvoice.id,
        amount: paymentAmount,
        paymentMode: 'UPI',
        transactionRef: 'UPI-TEST-12345',
        remarks: 'Test Partial Payment',
      });

      expect(res.status).toBe('CONFIRMED');
      if (res.status === 'CONFIRMED') {
        expect(res.receipt.amount).toBe(paymentAmount);
        expect(res.receipt.receiptNo).toMatch(/^REC\/\d{4}\/\d{3}$/);
      }

      const invoicesAfter = db.getFeeInvoices(managerUser);
      const updated = invoicesAfter.find((inv) => inv.id === targetInvoice.id)!;
      expect(updated.balanceAmount).toBe(initialBalance - paymentAmount);
      expect(updated.paidAmount).toBe(initialPaid + paymentAmount);
    });

    it('Rejects payment amount greater than outstanding balance', () => {
      const invoices = db.getFeeInvoices(managerUser);
      const target = invoices.find((inv) => inv.balanceAmount > 0)!;

      expect(() =>
        db.recordFeePayment(managerUser, {
          invoiceId: target.id,
          amount: target.balanceAmount + 10000,
          paymentMode: 'CASH',
        })
      ).toThrowError(/cannot exceed remaining balance/);
    });

    it('Rejects payment with zero or negative amount', () => {
      const invoices = db.getFeeInvoices(managerUser);
      const target = invoices[0];

      expect(() =>
        db.recordFeePayment(managerUser, {
          invoiceId: target.id,
          amount: 0,
          paymentMode: 'CASH',
        })
      ).toThrowError(/Payment amount must be greater than zero/);
    });
  });

  // ----------------------------------------------------------------------
  // 3. STUDENT ADMISSIONS & DUPLICATE CHECKS
  // ----------------------------------------------------------------------
  describe('3. Student Admission & Digital Records', () => {
    it('Generates formatted admission number sequence (JNSD/YYYY/NNN)', () => {
      const newStudent = db.admitStudent(principalUser, {
        fullName: 'Kavya Singhania',
        dob: '2019-03-20',
        gender: 'FEMALE',
        religion: 'Hindu',
        casteCategory: 'General',
        isCwsn: false,
        address: '15 Swaroop Nagar, Kanpur',
        district: 'Kanpur Nagar',
        state: 'Uttar Pradesh',
        pinCode: '208002',
        emergencyPhone: '+91 98399 88776',
        admissionDate: '2026-04-15',
        currentClass: 'Class 1',
        currentSection: 'A',
        rollNo: 5,
        documentVerificationStatus: 'VERIFIED',
        guardians: [
          {
            id: 'g-test-1',
            relationship: 'Father',
            fullName: 'Rakesh Singhania',
            phone: '+91 98399 88776',
          },
        ],
        documents: [],
      });

      expect(newStudent.admissionNo).toMatch(/^JNSD\/\d{4}\/\d{3}$/);
      expect(newStudent.status).toBe('Active');

      // Check that student appears in directory
      const allStudents = db.getStudents(principalUser);
      expect(allStudents.some((s) => s.id === newStudent.id)).toBe(true);
    });

    it('Detects duplicate students based on Name, DOB, and Father phone number', () => {
      const dup = db.checkDuplicateStudent('Aarav Sharma', '2015-05-14', '9839111222');
      expect(dup).not.toBeNull();
      expect(dup?.fullName).toBe('Aarav Sharma');
      expect(dup?.admissionNo).toBe('JNSD/2026/001');

      const nonDup = db.checkDuplicateStudent('Totally Unique Name', '2018-01-01', '9999999999');
      expect(nonDup).toBeNull();
    });
  });

  // ----------------------------------------------------------------------
  // 4. ACADEMICS & CBSE 8-POINT GRADING SYSTEM
  // ----------------------------------------------------------------------
  describe('4. Academic Records & CBSE Grading', () => {
    it('Accurately maps percentages to CBSE 8-point grading scale', () => {
      expect(db.calculateCbseGrade(95)).toBe('A1');
      expect(db.calculateCbseGrade(91)).toBe('A1');
      expect(db.calculateCbseGrade(90)).toBe('A2');
      expect(db.calculateCbseGrade(81)).toBe('A2');
      expect(db.calculateCbseGrade(75)).toBe('B1');
      expect(db.calculateCbseGrade(65)).toBe('B2');
      expect(db.calculateCbseGrade(55)).toBe('C1');
      expect(db.calculateCbseGrade(45)).toBe('C2');
      expect(db.calculateCbseGrade(35)).toBe('D');
      expect(db.calculateCbseGrade(30)).toMatch(/E/);
    });

    it('Rejects invalid marks outside 0 to maxMarks boundary', () => {
      expect(() =>
        db.saveMarks(managerUser, [
          {
            id: 'm-invalid',
            examId: 'exam-1',
            studentId: 'stu-1',
            studentName: 'Aarav Sharma',
            className: 'Class 5',
            subjectName: 'Mathematics',
            marksObtained: 150, // exceeds 100
            maxMarks: 100,
          },
        ])
      ).toThrowError(/Invalid marks/);
    });
  });

  // ----------------------------------------------------------------------
  // 5. STAFF ACCESS REVOCATION WORKFLOW
  // ----------------------------------------------------------------------
  describe('5. Staff Provisioning & Mandatory Access Revocation', () => {
    it('Allows Principal to create a teacher account with unique employee ID', () => {
      const teacher = db.createTeacher(principalUser, {
        fullName: 'Deepak Saxena',
        email: 'dsaxena@jnsd.edu',
        phone: '+91 94150 77889',
        qualification: 'M.Sc. Physics, B.Ed.',
        assignedClasses: ['Class 7-A', 'Class 8-A'],
        assignedSubjects: ['Science'],
        isClassTeacher: true,
      });

      expect(teacher.employeeId).toMatch(/^JNSD-TCH-\d+$/);
      expect(teacher.status).toBe('ACTIVE');
      expect(teacher.mustChangePassword).toBe(true);
    });

    it('Executes instant revocation of staff account with mandatory audit trail reason', () => {
      const staffList = db.getStaff(managerUser);
      const target = staffList.find((s) => s.role === 'TEACHER' && s.status === 'ACTIVE')!;

      const revoked = db.revokeStaffAccess(managerUser, target.id, 'Unauthorized fee collection misconduct');
      expect(revoked.status).toBe('REVOKED');
      expect(revoked.revocationReason).toBe('Unauthorized fee collection misconduct');
      expect(revoked.revokedAt).toBeDefined();

      // Check audit log
      const logs = db.getAuditLogs(managerUser);
      const revokeLog = logs.find((l) => l.action === 'ACCOUNT_REVOKED' && l.targetId === target.id);
      expect(revokeLog).toBeDefined();
    });

    it('Protects Manager Sir account from accidental revocation', () => {
      const staffList = db.getStaff(managerUser);
      const managerStaff = staffList.find((s) => s.role === 'MANAGER')!;

      expect(() =>
        db.revokeStaffAccess(managerUser, managerStaff.id, 'Accidental revoke attempt')
      ).toThrowError(/The Manager account cannot be revoked/);
    });
  });

  // ----------------------------------------------------------------------
  // 6. UDISE+ MINISTRY OF EDUCATION VALIDATION
  // ----------------------------------------------------------------------
  describe('6. UDISE+ Reporting Validation', () => {
    it('Flags students with missing mandatory PEN or Category fields', () => {
      const issues = db.validateUdiseData();
      expect(Array.isArray(issues)).toBe(true);

      // Student stu-4 has pending PEN in initial seed data
      const penIssue = issues.find((i) => i.field === 'penNumber');
      expect(penIssue).toBeDefined();
      expect(penIssue?.severity).toBe('WARNING');
    });

    it('Generates official aggregate snapshot with gender and category totals', () => {
      const snapshot = db.generateUdiseSnapshot(managerUser);
      expect(snapshot.year).toBe('2026-2027');
      expect(snapshot.totalEnrolled).toBeGreaterThan(0);
      expect(snapshot.boysCount + snapshot.girlsCount).toBe(snapshot.totalEnrolled);
      expect(snapshot.status).toBe('VALIDATED');
    });
  });

  // ----------------------------------------------------------------------
  // 7. OCR DOCUMENT & FEE RECEIPT FIELD PARSER
  // ----------------------------------------------------------------------
  describe('7. OCR Extraction & Normalization', () => {
    it('Correctly extracts and normalizes Aadhaar Card OCR text', () => {
      const sampleText = `
        GOVERNMENT OF INDIA
        Name: Shivansh Mishra
        DOB: 12/08/2016
        Gender: Male
        Address: 45 Mall Road, Kanpur, UP
        Father: Alok Mishra
        XXXX XXXX 6721
      `;

      const result = parseExtractedText(sampleText, 'IDENTITY');
      expect(result.documentType).toBe('AADHAAR');
      expect(result.fields.fullName).toBe('Shivansh Mishra');
      expect(result.fields.dob).toBe('2016-08-12');
      expect(result.fields.gender).toBe('MALE');
      expect(result.fields.maskedAadhaar).toBe('XXXX-XXXX-6721');
    });

    it('Correctly extracts and normalizes Fee Receipt OCR text', () => {
      const sampleText = `
        JNSD EDUCATION CENTRE
        Receipt No: REC-2026-902
        Student: Aarav Sharma
        Adm No: JNSD/2026/001
        Date: 10/04/2026
        Amount: Rs 3400
        Payment Mode: UPI
        UTR: 314159265358
      `;

      const result = parseExtractedText(sampleText, 'FEE_RECEIPT');
      expect(result.documentType).toBe('FEE_RECEIPT');
      expect(result.fields.receiptNo).toBe('REC-2026-902');
      expect(result.fields.amount).toBe(3400);
      expect(result.fields.studentName).toBe('Aarav Sharma');
      expect(result.fields.transactionRef).toBe('314159265358');
    });
  });
});
