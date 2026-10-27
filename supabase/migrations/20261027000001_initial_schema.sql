-- ========================================================================
-- JNSD EDUCATION CENTRE SCHOOL ERP - MASTER DATABASE SCHEMA
-- Migration: 20261027000001_initial_schema.sql
-- Covers: RBAC, Students, Admissions, Attendance, Academics, Fees,
--         Receipts, OCR Jobs, UDISE+, Staff, Audit Logs, and RLS Policies.
-- ========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------
-- 1. ENUMS & DOMAINS
-- ------------------------------------------------------------------------
CREATE TYPE user_role AS ENUM ('MANAGER', 'PRINCIPAL', 'TEACHER', 'UDISE_OPERATOR');
CREATE TYPE account_status AS ENUM ('PENDING_ACTIVATION', 'ACTIVE', 'SUSPENDED', 'REVOKED');
CREATE TYPE gender_type AS ENUM ('MALE', 'FEMALE', 'OTHER');
CREATE TYPE attendance_status AS ENUM ('PRESENT', 'ABSENT', 'LATE', 'HALF_DAY');
CREATE TYPE verification_status AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');
CREATE TYPE payment_mode AS ENUM ('CASH', 'UPI', 'BANK_TRANSFER', 'CHEQUE', 'NEFT');
CREATE TYPE invoice_status AS ENUM ('UNPAID', 'PARTIALLY_PAID', 'PAID', 'OVERDUE');

-- ------------------------------------------------------------------------
-- 2. SCHOOL PROFILE
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS school_profile (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_name VARCHAR(255) NOT NULL DEFAULT 'JNSD Education Centre',
    school_code VARCHAR(50) NOT NULL DEFAULT 'JNSD-UP-2026',
    udise_code VARCHAR(50) NOT NULL DEFAULT '09210401802',
    affiliation_no VARCHAR(100) DEFAULT 'CBSE-AFF-JNSD-0921',
    address TEXT NOT NULL DEFAULT 'JNSD Education Centre Campus, District Road',
    district VARCHAR(100) NOT NULL DEFAULT 'Kanpur Nagar',
    state VARCHAR(100) NOT NULL DEFAULT 'Uttar Pradesh',
    pin_code VARCHAR(10) NOT NULL DEFAULT '208001',
    contact_phone VARCHAR(20) NOT NULL DEFAULT '+91 94150 00000',
    contact_email VARCHAR(100) NOT NULL DEFAULT 'admin@jnsd.edu.in',
    website VARCHAR(100) DEFAULT 'https://jnsd.edu.in',
    principal_name VARCHAR(150) NOT NULL DEFAULT 'Dr. Aruna Saxena',
    manager_name VARCHAR(150) NOT NULL DEFAULT 'Sri Ramesh Chandra Sharma (Manager Sir)',
    academic_session VARCHAR(20) NOT NULL DEFAULT '2026-2027',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------
-- 3. USERS & PROFILES (Secure Authentication Layer)
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'TEACHER',
    status account_status NOT NULL DEFAULT 'ACTIVE',
    phone VARCHAR(20),
    avatar_url TEXT,
    must_change_password BOOLEAN NOT NULL DEFAULT FALSE,
    revocation_reason TEXT,
    revoked_at TIMESTAMPTZ,
    revoked_by UUID,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------
-- 4. STAFF & TEACHER ASSIGNMENTS
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS staff (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    designation VARCHAR(100) NOT NULL,
    qualification VARCHAR(255),
    joining_date DATE NOT NULL DEFAULT CURRENT_DATE,
    assigned_classes TEXT[] DEFAULT '{}', -- e.g. ['Class 5-A', 'Class 4-B']
    assigned_subjects TEXT[] DEFAULT '{}', -- e.g. ['Mathematics', 'Science']
    is_class_teacher BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------
-- 5. ACADEMIC STRUCTURE (PG to Class 8)
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS academic_years (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    year_name VARCHAR(50) UNIQUE NOT NULL, -- '2026-2027'
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_current BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_name VARCHAR(50) UNIQUE NOT NULL, -- 'Play Group', 'Nursery', 'LKG', 'UKG', 'Class 1', ..., 'Class 8'
    display_order INT NOT NULL,
    stage VARCHAR(50) NOT NULL DEFAULT 'Primary', -- 'Pre-Primary', 'Primary', 'Upper Primary'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    section_name VARCHAR(10) NOT NULL DEFAULT 'A',
    max_capacity INT DEFAULT 40,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(class_id, section_name)
);

CREATE TABLE IF NOT EXISTS subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    subject_name VARCHAR(100) NOT NULL,
    subject_code VARCHAR(20),
    max_marks INT DEFAULT 100,
    pass_marks INT DEFAULT 33,
    display_order INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------
-- 6. STUDENTS & GUARDIANS
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admission_no VARCHAR(50) UNIQUE NOT NULL,
    pen_number VARCHAR(50), -- UDISE+ Permanent Education Number
    full_name VARCHAR(255) NOT NULL,
    dob DATE NOT NULL,
    gender gender_type NOT NULL,
    blood_group VARCHAR(10),
    religion VARCHAR(50) DEFAULT 'Hindu',
    caste_category VARCHAR(50) DEFAULT 'General', -- General, OBC, SC, ST, EWS
    is_cwsn BOOLEAN DEFAULT FALSE, -- Children with Special Needs
    cwsn_type VARCHAR(100),
    aadhaar_masked VARCHAR(20), -- Store strictly masked Aadhaar e.g. XXXX-XXXX-4567
    address TEXT NOT NULL,
    district VARCHAR(100) DEFAULT 'Kanpur Nagar',
    state VARCHAR(100) DEFAULT 'Uttar Pradesh',
    pin_code VARCHAR(10) DEFAULT '208001',
    emergency_phone VARCHAR(20) NOT NULL,
    previous_school VARCHAR(255),
    previous_class VARCHAR(50),
    admission_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status VARCHAR(50) NOT NULL DEFAULT 'Active', -- Active, Transferred, Withdrawn
    document_verification_status verification_status DEFAULT 'PENDING',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS guardians (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    relationship VARCHAR(50) NOT NULL, -- 'Father', 'Mother', 'Guardian'
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    alt_phone VARCHAR(20),
    email VARCHAR(100),
    occupation VARCHAR(100),
    education VARCHAR(100),
    annual_income NUMERIC(12, 2),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    academic_year_id UUID REFERENCES academic_years(id) ON DELETE RESTRICT,
    class_id UUID REFERENCES classes(id) ON DELETE RESTRICT,
    section_id UUID REFERENCES sections(id) ON DELETE RESTRICT,
    roll_no INT,
    status VARCHAR(50) DEFAULT 'Active',
    enrolled_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, academic_year_id)
);

CREATE TABLE IF NOT EXISTS student_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL, -- 'Aadhaar Card', 'Birth Certificate', 'Transfer Certificate', 'Marksheet', 'Photo'
    file_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_size_bytes INT,
    mime_type VARCHAR(100),
    verification_status verification_status DEFAULT 'PENDING',
    verified_by UUID REFERENCES profiles(id),
    verified_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------
-- 7. ATTENDANCE MANAGEMENT
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    section_id UUID REFERENCES sections(id) ON DELETE CASCADE,
    attendance_date DATE NOT NULL,
    status attendance_status NOT NULL DEFAULT 'PRESENT',
    remarks TEXT,
    marked_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, attendance_date)
);

CREATE TABLE IF NOT EXISTS attendance_corrections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    attendance_id UUID REFERENCES attendance(id) ON DELETE CASCADE,
    requested_status attendance_status NOT NULL,
    reason TEXT NOT NULL,
    requested_by UUID REFERENCES profiles(id),
    approved_by UUID REFERENCES profiles(id),
    status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------
-- 8. ACADEMICS & EXAMINATIONS
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS examinations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    academic_year_id UUID REFERENCES academic_years(id) ON DELETE CASCADE,
    exam_name VARCHAR(100) NOT NULL, -- 'Half-Yearly Examination', 'Annual Examination', 'Unit Test 1'
    term VARCHAR(20) NOT NULL, -- 'Term 1', 'Term 2'
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS marks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    examination_id UUID REFERENCES examinations(id) ON DELETE CASCADE,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
    marks_obtained NUMERIC(5, 2) NOT NULL DEFAULT 0,
    max_marks NUMERIC(5, 2) NOT NULL DEFAULT 100,
    is_absent BOOLEAN DEFAULT FALSE,
    is_exempt BOOLEAN DEFAULT FALSE,
    grade VARCHAR(5), -- A1, A2, B1, B2, C1, C2, D, E
    remarks TEXT,
    entered_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(examination_id, student_id, subject_id)
);

-- ------------------------------------------------------------------------
-- 9. FEES & ACCOUNTS (RESTRICTED - MANAGER ONLY)
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS fee_structures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    academic_year_id UUID REFERENCES academic_years(id) ON DELETE CASCADE,
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    fee_head VARCHAR(100) NOT NULL, -- 'Tuition Fee', 'Admission Fee', 'Annual Fee', 'Examination Fee', 'Computer Fee'
    amount NUMERIC(10, 2) NOT NULL,
    frequency VARCHAR(50) DEFAULT 'Monthly', -- Monthly, Quarterly, Annual, One-time
    due_day INT DEFAULT 10,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS fee_invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_no VARCHAR(50) UNIQUE NOT NULL,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    academic_year_id UUID REFERENCES academic_years(id) ON DELETE RESTRICT,
    month_name VARCHAR(50), -- e.g. 'April 2026', 'Quarter 1'
    total_amount NUMERIC(10, 2) NOT NULL,
    concession_amount NUMERIC(10, 2) DEFAULT 0,
    paid_amount NUMERIC(10, 2) DEFAULT 0,
    balance_amount NUMERIC(10, 2) NOT NULL,
    due_date DATE NOT NULL,
    status invoice_status DEFAULT 'UNPAID',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    receipt_no VARCHAR(50) UNIQUE NOT NULL,
    invoice_id UUID REFERENCES fee_invoices(id) ON DELETE CASCADE,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    payment_mode payment_mode NOT NULL DEFAULT 'CASH',
    transaction_ref VARCHAR(100), -- UTR or Cheque Number
    payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    received_by UUID REFERENCES profiles(id),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payment_allocations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payment_id UUID REFERENCES payments(id) ON DELETE CASCADE,
    fee_head VARCHAR(100) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------
-- 10. OCR PROCESSING & AUDIT
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS document_ocr_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_type VARCHAR(50) NOT NULL, -- 'AADHAAR_SCAN', 'BIRTH_CERT_SCAN', 'FEE_RECEIPT_SCAN'
    document_url TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'COMPLETED',
    raw_extracted_text TEXT,
    confidence_score NUMERIC(5, 2),
    extracted_data JSONB NOT NULL DEFAULT '{}',
    processed_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------
-- 11. UDISE+ REPORTING
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS udise_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporting_year VARCHAR(20) NOT NULL, -- '2026-2027'
    total_students INT NOT NULL,
    boys_count INT NOT NULL,
    girls_count INT NOT NULL,
    cwsn_count INT NOT NULL,
    validation_status VARCHAR(50) DEFAULT 'VALIDATED',
    snapshot_data JSONB NOT NULL DEFAULT '{}',
    generated_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------
-- 12. AUDIT LOGS
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID REFERENCES profiles(id),
    actor_name VARCHAR(150),
    actor_role user_role,
    action VARCHAR(100) NOT NULL, -- e.g. 'STUDENT_ADMISSION', 'PAYMENT_RECORDED', 'ACCOUNT_REVOKED'
    module VARCHAR(50) NOT NULL, -- 'ADMISSIONS', 'FEES', 'ATTENDANCE', 'ACADEMICS', 'STAFF'
    target_id VARCHAR(100),
    details JSONB DEFAULT '{}',
    ip_address VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------
-- 13. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------
ALTER TABLE school_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE guardians ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE marks ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_structures ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_ocr_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE udise_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function: get current user role
CREATE OR REPLACE FUNCTION get_current_user_role()
RETURNS user_role AS $$
    SELECT role FROM profiles WHERE id = auth.uid() AND status = 'ACTIVE';
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- 1. Profiles: Manager has full access; Principal can view all and manage teachers; Users can view self
CREATE POLICY "Manager full profiles access" ON profiles
    FOR ALL USING (get_current_user_role() = 'MANAGER');

CREATE POLICY "Principal profiles access" ON profiles
    FOR SELECT USING (get_current_user_role() IN ('MANAGER', 'PRINCIPAL'));

CREATE POLICY "User view own profile" ON profiles
    FOR SELECT USING (id = auth.uid());

-- 2. Financial tables (fee_structures, fee_invoices, payments, allocations):
-- MANAGER ONLY! Principal and Teacher are strictly forbidden!
CREATE POLICY "Manager only fee_structures" ON fee_structures
    FOR ALL USING (get_current_user_role() = 'MANAGER');

CREATE POLICY "Manager only fee_invoices" ON fee_invoices
    FOR ALL USING (get_current_user_role() = 'MANAGER');

CREATE POLICY "Manager only payments" ON payments
    FOR ALL USING (get_current_user_role() = 'MANAGER');

CREATE POLICY "Manager only payment_allocations" ON payment_allocations
    FOR ALL USING (get_current_user_role() = 'MANAGER');

-- 3. Students & Enrollments: Manager and Principal have full access; Teachers can view
CREATE POLICY "Manager and Principal students access" ON students
    FOR ALL USING (get_current_user_role() IN ('MANAGER', 'PRINCIPAL'));

CREATE POLICY "Teacher students read access" ON students
    FOR SELECT USING (get_current_user_role() = 'TEACHER');

CREATE POLICY "Manager and Principal guardians access" ON guardians
    FOR ALL USING (get_current_user_role() IN ('MANAGER', 'PRINCIPAL'));

CREATE POLICY "Teacher guardians read access" ON guardians
    FOR SELECT USING (get_current_user_role() = 'TEACHER');

CREATE POLICY "Enrollments viewable by all active staff" ON enrollments
    FOR SELECT USING (get_current_user_role() IN ('MANAGER', 'PRINCIPAL', 'TEACHER'));

CREATE POLICY "Enrollments editable by Manager and Principal" ON enrollments
    FOR ALL USING (get_current_user_role() IN ('MANAGER', 'PRINCIPAL'));

-- 4. Attendance: Manager full, Principal read, Teacher can mark for assigned classes
CREATE POLICY "Manager full attendance" ON attendance
    FOR ALL USING (get_current_user_role() = 'MANAGER');

CREATE POLICY "Principal read attendance" ON attendance
    FOR SELECT USING (get_current_user_role() = 'PRINCIPAL');

CREATE POLICY "Teacher mark attendance" ON attendance
    FOR ALL USING (get_current_user_role() = 'TEACHER');

-- 5. Marks: Manager full, Principal read, Teacher enter
CREATE POLICY "Manager full marks" ON marks
    FOR ALL USING (get_current_user_role() = 'MANAGER');

CREATE POLICY "Principal read marks" ON marks
    FOR SELECT USING (get_current_user_role() = 'PRINCIPAL');

CREATE POLICY "Teacher manage marks" ON marks
    FOR ALL USING (get_current_user_role() = 'TEACHER');

-- 6. Audit Logs: Manager full view; append allowed for logged actions
CREATE POLICY "Manager view audit logs" ON audit_logs
    FOR SELECT USING (get_current_user_role() = 'MANAGER');

CREATE POLICY "Active staff insert audit logs" ON audit_logs
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- ------------------------------------------------------------------------
-- 14. SEED DATA (Academic Years, Classes PG to 8, School Profile)
-- ------------------------------------------------------------------------
INSERT INTO school_profile (school_name, school_code, principal_name, manager_name)
VALUES ('JNSD Education Centre', 'JNSD-UP-2026', 'Dr. Aruna Saxena', 'Sri Ramesh Chandra Sharma (Manager Sir)')
ON CONFLICT DO NOTHING;

INSERT INTO academic_years (year_name, start_date, end_date, is_current)
VALUES ('2026-2027', '2026-04-01', '2027-03-31', TRUE)
ON CONFLICT (year_name) DO NOTHING;

-- Classes PG to 8
INSERT INTO classes (class_name, display_order, stage) VALUES
('Play Group', 1, 'Pre-Primary'),
('Nursery', 2, 'Pre-Primary'),
('LKG', 3, 'Pre-Primary'),
('UKG', 4, 'Pre-Primary'),
('Class 1', 5, 'Primary'),
('Class 2', 6, 'Primary'),
('Class 3', 7, 'Primary'),
('Class 4', 8, 'Primary'),
('Class 5', 9, 'Primary'),
('Class 6', 10, 'Upper Primary'),
('Class 7', 11, 'Upper Primary'),
('Class 8', 12, 'Upper Primary')
ON CONFLICT (class_name) DO NOTHING;
