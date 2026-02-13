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
    `api/admin/requests?user_id=${userId}`,
  APPROVE_ACTION: 'api/admin/approve',
  REJECT_ACTION: 'api/admin/reject',
  APPROVAL_CATEGORY: 'approvals/typesapi',

  // ================= SHIFT =================
  MONTHLY_SHIFTS: (userId) =>
    `api/WorkingSchedules?user_id=${userId}`,

  // ================= PAYSLIP =================
  PAYSLIP: 'api/print/Payslip',

  // ================= DOCUMENTS =================
  REPORT_DOCS: 'api/documents/list',


  //************* ADMIN APIS ***************** */

  // ================= AUTH & PLAN =================
  PLAN_ACTIVATION: 'api/activate/plan',
  CHECK_GST: 'api/check_gstnumber',

  // ================= ATTENDANCE POLICY =================
  ATTENDANCE_POLICY_LIST: (userId) => `employee/attendance-policies?user_id=${userId}`,
  CREATE_ATTENDANCE_POLICY: 'employee/create/attendance-policy',
  UPDATE_ATTENDANCE_POLICY: (id) => `employee/attendance-policy/${id}`,
  DELETE_ATTENDANCE_POLICY: (id) => `employee/attendance-policy/${id}`,

  // ================= REGULARIZATION CATEGORY =================
  REG_CATEGORY_LIST: 'api/regcategories',
  CREATE_REG_CATEGORY: 'api/create/regcategory',
  UPDATE_REG_CATEGORY: (id) => `api/regcategories/${id}`,
  DELETE_REG_CATEGORY: (id) => `api/regcategories/${id}`,

  // ================= DEPARTMENT =================
  DEPARTMENT_ADMIN_LIST: 'api/department',
  CREATE_DEPARTMENT: 'api/create/department',
  UPDATE_DEPARTMENT: (id) => `api/department/${id}`,
  DELETE_DEPARTMENT: (id) => `api/department/${id}`,

  // ================= JOB =================
  JOB_LIST: 'api/job/list',
  CONTRACT_TYPES: 'api/contract-types',
  CREATE_JOB: 'api/job/create',
  UPDATE_JOB: (id) => `api/jobs/${id}`,
  DELETE_JOB: (id) => `api/jobs/${id}`,

  // ================= BRANCH (ODOO) =================
  CREATE_BRANCH: (userId) => `api/res_branch/create?user_id=${userId}`,
  UPDATE_BRANCH: (userId) => `api/branch/update?user_id=${userId}`,
  BRANCH_LIST: 'api/branches',
  DELETE_BRANCH: 'api/delete_branch',

  // ================= WORKING SCHEDULE =================
  WORKING_SCHEDULE_LIST: 'api/WorkingSchedules',
  CREATE_WORKING_SCHEDULE: (userId) =>
    `api/create/WorkingSchedules?user_id=${userId}`,
  UPDATE_WORKING_SCHEDULE: (id, userId) =>
    `api/update/workingSchedules/${id}?user_id=${userId}`,
  DELETE_WORKING_SCHEDULE: (id, userId) =>
    `api/delete/workingSchedules/${id}?user_id=${userId}`,

  // ================= WORK ENTRY TYPES =================
  WORK_ENTRY_LIST: 'api/work-entry-types',
  CREATE_WORK_ENTRY: 'api/create/work-entry-type',
  UPDATE_WORK_ENTRY: (id) => `api/work-entry-type/${id}`,
  DELETE_WORK_ENTRY: (id) => `api/work-entry-type/${id}`,

  // ================= WORK LOCATION =================
  WORK_LOCATION_LIST: 'api/work-location',
  CREATE_WORK_LOCATION: (branchId, userId) =>
    `api/create/work-location/${branchId}?user_id=${userId}`,
  UPDATE_WORK_LOCATION: (id) => `api/work-location/${id}`,
  DELETE_WORK_LOCATION: (id) => `api/work-location/${id}`,

  // ================= SKILLS =================
  SKILL_LIST: 'api/skills',
  CREATE_SKILL: 'api/create/skills',
  UPDATE_SKILL: (id) => `api/skills/${id}`,
  DELETE_SKILL: (id) => `api/delete/skills/${id}`,

  // ================= INDUSTRIES =================
  INDUSTRY_LIST: 'api/industries',
  CREATE_INDUSTRY: 'api/create/industries',
  UPDATE_INDUSTRY: (id) => `api/industries/${id}`,
  DELETE_INDUSTRY: (id) => `api/industries/${id}`,

  // ================= BANK MASTER =================
  BANK_LIST: 'api/bank/list',
  CREATE_BANK: 'api/bank/create',
  UPDATE_BANK: (id) => `api/bank/update/${id}`,
  DELETE_BANK: (id) => `api/bank/delete/${id}`,

  // ================= BANK ACCOUNT =================
  BANK_ACCOUNT_LIST: 'api/bank-account/list',
  CREATE_BANK_ACCOUNT: 'api/bank-account/create',
  UPDATE_BANK_ACCOUNT: (id) => `api/bank-account/update/${id}`,
  DELETE_BANK_ACCOUNT: (id) => `api/bank-account/delete/${id}`,

  // ================= GEO LOCATION =================
  CREATE_GEO: (userId) => `api/create/geoLocation?user_id=${userId}`,
  UPDATE_GEO: (id, userId) =>
    `api/geoLocation/${id}?user_id=${userId}`,
  DELETE_GEO: (id) => `api/geoLocation/${id}`,

  // ================= EXPENSE CATEGORY =================
  EXPENSE_CATEGORY_LIST: (userId) =>
    `/employee/expense-category?user_id=${userId}`,
  CREATE_EXPENSE_CATEGORY: (userId) =>
    `/employee/create/expense-categroy?user_id=${userId}`,
  UPDATE_EXPENSE_CATEGORY: (id, userId) =>
    `/employee/update-expense-category/${id}?user_id=${userId}`,
  DELETE_EXPENSE_CATEGORY: (id, userId) =>
    `/employee/delete-expense-category/${id}?user_id=${userId}`,

  // ================= EMPLOYEE (ODOO + NODE) =================
  EMPLOYEE_LIST: 'api/employees',
  CREATE_EMPLOYEE: 'api/employee/create',
  UPDATE_EMPLOYEE: (userId, empId) =>
    `api/update_employee?user_id=${userId}&emp_id=${empId}`,
  DELETE_EMPLOYEE: (id) => `/employee/${id}`,

  // ================= ADMIN ATTENDANCE =================
  ADMIN_ATTENDANCE_LIST: 'api/admin/attendances',
  UPDATE_ADMIN_ATTENDANCE: (id) =>
    `api/admin/updateattendances/${id}`,
  EXPORT_ATTENDANCE_EXCEL:
    'api/admin/attendances/export/excel',
  EXPORT_ATTENDANCE_PDF:
    'api/admin/attendances/export/pdf',

  // ================= LEAVE =================
  LEAVE_TYPE_LIST: 'api/leave-type',
  CREATE_LEAVE_TYPE: 'api/create/leave-type',
  UPDATE_LEAVE_TYPE: (id, userId) =>
    `api/leave-type/${id}?user_id=${userId}`,
  DELETE_LEAVE_TYPE: (id, userId) =>
    `api/leave-type/${id}?user_id=${userId}`,

  LEAVE_REQUEST_LIST: (userId) =>
    `api/leave-request?user_id=${userId}`,
  CREATE_LEAVE_REQUEST: (userId) =>
    `api/create/leave-request?user_id=${userId}`,
  UPDATE_LEAVE_REQUEST: (id, userId) =>
    `api/leave-request/${id}?user_id=${userId}`,
  DELETE_LEAVE_REQUEST: (id, userId) =>
    `api/leave-request/${id}?user_id=${userId}`,

  // ================= PUBLIC HOLIDAY =================
  PUBLIC_HOLIDAY_LIST: (userId) =>
    `api/public-holiday?user_id=${userId}`,
  CREATE_PUBLIC_HOLIDAY: (userId) =>
    `api/create/public-holiday?user_id=${userId}`,
  UPDATE_PUBLIC_HOLIDAY: (id, userId) =>
    `api/public-holiday/${id}?user_id=${userId}`,
  DELETE_PUBLIC_HOLIDAY: (id, userId) =>
    `api/public-holiday/${id}?user_id=${userId}`,

  // ================= PAYROLL =================
  STRUCTURE_TYPE_LIST: 'api/structure-types',
  CREATE_STRUCTURE_TYPE: (userId) =>
    `api/create/structure-type?user_id=${userId}`,
  UPDATE_STRUCTURE_TYPE: (id, userId) =>
    `api/structure-type/${id}?user_id=${userId}`,
  DELETE_STRUCTURE_TYPE: (id) =>
    `api/structure-type/${id}`,

  SALARY_RULE_LIST: 'api/salary-rules',
  CREATE_SALARY_RULE: 'api/create/salary-rule',
  UPDATE_SALARY_RULE: (id) =>
    `api/salary-rule/${id}`,
  DELETE_SALARY_RULE: (id) =>
    `api/salary-rule/${id}`,

  // ================= APPROVAL =================
  APPROVAL_LIST: (userId) =>
    `api/admin/requests?user_id=${userId}`,
  APPROVE_ACTION: 'api/admin/approve',
  REJECT_ACTION: 'api/admin/reject',

};

export default APIS_ENDPOINTS;
