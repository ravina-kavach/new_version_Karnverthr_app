const APIS_ENDPOINTS = {
  // ================= AUTH =================
  AUTH_TOKEN: 'api/auth',
  LOGIN: 'api/login',
  DEVICE_REGISTER: 'api/employee/device-register',
  FORGOT_PASSWORD: 'fact/reset_password',

  // ================= USER =================
  USER_DETAILS: (userId) => `employee/employees?user_id=${userId}`,
  PROFILE_UPDATE: (empId, userId) => `employee/${empId}?user_id=${userId}`,

  // ================= ATTENDANCE =================
  ATTENDANCE: 'api/employee/attandence',
  ATTENDANCE_LIST: (userdata) =>
    `api/user/attendance?user_id=${userdata.id}&month=${userdata.month}&year=${userdata.year}`,
  CHECK_ATTENDANCE_STATUS: (email) =>
    `api/checkin_checkout_status?email=${encodeURIComponent(email)}`,
  REGULARIZATION: (userId) =>
    `api/create/regularization?user_id=${userId}`,
  GET_REGULARIZATION: (userId) =>
    `api/regularization?user_id=${userId}`,
  REG_CATEGORIES: (userId) =>
    `api/regcategories?user_id=${userId}`,
  MONTHLY_ATTENDANCE_REPORT: 'api/hr/attendance/monthly',

  // ================= LEAVE =================
  LEAVE_TYPE: (userId) => `api/leave-type?user_id=${userId}`,
  LEAVE_ALLOCATION: (userId) =>
    `employee/employee-dashboard?user_id=${userId}`,
  CREATE_LEAVE: (userId) =>
    `api/create/leave-request?user_id=${userId}`,
  LEAVE_LIST: (userId) =>
    `api/leave-request?user_id=${userId}`,

  // ================= DEPARTMENT =================
  DEPARTMENT_LIST: (userId) =>
    `api/department?user_id=${userId}`,

  // ================= EXPENSE =================
  EXPENSE_CATEGORY: (userId) =>
    `employee/expense-category?user_id=${userId}`,
  EXPENSE_ACCOUNT: (userId) =>
    `employee/expense-account?user_id=${userId}`,
  CREATE_EXPENSE: (userId) =>
    `employee/create/expense?user_id=${userId}`,
  EXPENSE_LIST: (userId) =>
    `employee/expense?user_id=${userId}`,

  // ================= INVOICE =================
  INVOICE_LIST: 'api/list_of_invoice',
  APPROVE_INVOICE: 'api/approve_invoice',

  // ================= CALENDAR =================
  CALENDAR_EVENTS: (userId) =>
    `employee/calendar?user_id=${userId}`,
  CREATE_MEETING: (userId) =>
    `employee/create/calendar?user_id=${userId}`,

  // ================= APPROVAL =================
  APPROVAL_LIST: (userId) =>
    `/api/admin/requests?user_id=${userId}`,
  APPROVE_ACTION: 'api/admin/approve',
  REJECT_ACTION: 'api/admin/reject',
  APPROVAL_CATEGORY: 'approvals/types/api',

  // ================= SHIFT =================
  MONTHLY_SHIFTS: (userId) =>
    `api/WorkingSchedules?user_id=${userId}`,

  // ================= PAYSLIP =================
  PAYSLIP: 'api/print/Payslip',

  // ================= DOCUMENTS =================
  REPORT_DOCS: 'api/documents/list',
};

export default APIS_ENDPOINTS;
