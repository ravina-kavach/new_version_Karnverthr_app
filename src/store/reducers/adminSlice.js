import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import API from './apiInstance';
import APIS_ENDPOINTS from './apiEndPoints';

const errorMassage = (error) => {
    if (error === "Network Error") {
        return "Server not responding. Please try again later.";
    }
    return error;
};

/* =======================================================
   ================= PLAN =================
======================================================= */

export const PlanActivation = createAsyncThunk(
    'PlanActivation',
    async (payload, thunkAPI) => {
        try {
            const result = await API.post(
                APIS_ENDPOINTS.PLAN_ACTIVATION,
                payload
            );

            if (result.data.status === 'error') {
                return thunkAPI.rejectWithValue({
                    error: errorMassage(result?.data?.message),
                });
            }

            return result.data;
        } catch (error) {
            return thunkAPI.rejectWithValue({
                error: errorMassage(
                    error.response?.data?.message || error.message
                ),
            });
        }
    }
);

export const CheckGST = createAsyncThunk(
    'CheckGST',
    async (payload, thunkAPI) => {
        try {
            const result = await API.post(
                APIS_ENDPOINTS.CHECK_GST,
                payload
            );

            if (result.data.status === 'error') {
                return thunkAPI.rejectWithValue({
                    error: errorMassage(result?.data?.message),
                });
            }

            return result.data;
        } catch (error) {
            return thunkAPI.rejectWithValue({
                error: errorMassage(
                    error.response?.data?.message || error.message
                ),
            });
        }
    }
);

/* =======================================================
   ================= ATTENDANCE POLICY =================
======================================================= */

export const AttendancePolicyList = createAsyncThunk(
    'AttendancePolicyList',
    async (userdata, thunkAPI) => {
        console.log("calllll====>")
        try {
            const result = await API.get(
                APIS_ENDPOINTS.ATTENDANCE_POLICY_LIST(userdata.id)
            );

            if (result.data.status === 'error') {
                return thunkAPI.rejectWithValue({
                    error: errorMassage(result?.data?.message),
                });
            }
            console.log("result.data====>",result)
            return result.data;
        } catch (error) {
            console.log("ERROR===>",error)
            return thunkAPI.rejectWithValue({
                error: errorMassage(
                    error.response?.data?.message || error.message
                ),
            });
        }
    }
);

export const CreateAttendancePolicy = createAsyncThunk(
    'CreateAttendancePolicy',
    async (payload, thunkAPI) => {
        try {
            const result = await API.post(
                APIS_ENDPOINTS.CREATE_ATTENDANCE_POLICY,
                payload
            );

            if (result.data.status === 'error') {
                return thunkAPI.rejectWithValue({
                    error: errorMassage(result?.data?.message),
                });
            }

            return result.data;
        } catch (error) {
            return thunkAPI.rejectWithValue({
                error: errorMassage(
                    error.response?.data?.message || error.message
                ),
            });
        }
    }
);

export const UpdateAttendancePolicy = createAsyncThunk(
    'UpdateAttendancePolicy',
    async ({ id, body }, thunkAPI) => {
        try {
            const result = await API.put(
                APIS_ENDPOINTS.UPDATE_ATTENDANCE_POLICY(id),
                body
            );

            if (result.data.status === 'error') {
                return thunkAPI.rejectWithValue({
                    error: errorMassage(result?.data?.message),
                });
            }

            return result.data;
        } catch (error) {
            return thunkAPI.rejectWithValue({
                error: errorMassage(
                    error.response?.data?.message || error.message
                ),
            });
        }
    }
);

export const DeleteAttendancePolicy = createAsyncThunk(
    'DeleteAttendancePolicy',
    async (id, thunkAPI) => {
        try {
            const result = await API.delete(
                APIS_ENDPOINTS.DELETE_ATTENDANCE_POLICY(id)
            );

            if (result.data.status === 'error') {
                return thunkAPI.rejectWithValue({
                    error: errorMassage(result?.data?.message),
                });
            }

            return result.data;
        } catch (error) {
            return thunkAPI.rejectWithValue({
                error: errorMassage(
                    error.response?.data?.message || error.message
                ),
            });
        }
    }
);

/* =======================================================
   ================= DEPARTMENT =================
======================================================= */

export const DepartmentList = createAsyncThunk(
    'DepartmentList',
    async (_, thunkAPI) => {
        try {
            const result = await API.get(
                APIS_ENDPOINTS.DEPARTMENT_ADMIN_LIST
            );

            if (result.data.status === 'error') {
                return thunkAPI.rejectWithValue({
                    error: errorMassage(result?.data?.message),
                });
            }

            return result.data;
        } catch (error) {
            return thunkAPI.rejectWithValue({
                error: errorMassage(
                    error.response?.data?.message || error.message
                ),
            });
        }
    }
);

export const CreateDepartment = createAsyncThunk(
    'CreateDepartment',
    async (payload, thunkAPI) => {
        try {
            const result = await API.post(
                APIS_ENDPOINTS.CREATE_DEPARTMENT,
                payload
            );

            if (result.data.status === 'error') {
                return thunkAPI.rejectWithValue({
                    error: errorMassage(result?.data?.message),
                });
            }

            return result.data;
        } catch (error) {
            return thunkAPI.rejectWithValue({
                error: errorMassage(
                    error.response?.data?.message || error.message
                ),
            });
        }
    }
);

export const UpdateDepartment = createAsyncThunk(
    'UpdateDepartment',
    async ({ id, body }, thunkAPI) => {
        try {
            const result = await API.put(
                APIS_ENDPOINTS.UPDATE_DEPARTMENT(id),
                body
            );

            if (result.data.status === 'error') {
                return thunkAPI.rejectWithValue({
                    error: errorMassage(result?.data?.message),
                });
            }

            return result.data;
        } catch (error) {
            return thunkAPI.rejectWithValue({
                error: errorMassage(
                    error.response?.data?.message || error.message
                ),
            });
        }
    }
);

export const DeleteDepartment = createAsyncThunk(
    'DeleteDepartment',
    async (id, thunkAPI) => {
        try {
            const result = await API.delete(
                APIS_ENDPOINTS.DELETE_DEPARTMENT(id)
            );

            if (result.data.status === 'error') {
                return thunkAPI.rejectWithValue({
                    error: errorMassage(result?.data?.message),
                });
            }

            return result.data;
        } catch (error) {
            return thunkAPI.rejectWithValue({
                error: errorMassage(
                    error.response?.data?.message || error.message
                ),
            });
        }
    }
);

/* =======================================================
   ================= JOB =================
======================================================= */

export const JobList = createAsyncThunk(
    'JobList',
    async (_, thunkAPI) => {
        try {
            const result = await API.get(
                APIS_ENDPOINTS.JOB_LIST
            );

            if (result.data.status === 'error') {
                return thunkAPI.rejectWithValue({
                    error: errorMassage(result?.data?.message),
                });
            }

            return result.data;
        } catch (error) {
            return thunkAPI.rejectWithValue({
                error: errorMassage(
                    error.response?.data?.message || error.message
                ),
            });
        }
    }
);

export const ContractTypes = createAsyncThunk(
    'ContractTypes',
    async (_, thunkAPI) => {
        try {
            const result = await API.get(
                APIS_ENDPOINTS.CONTRACT_TYPES
            );

            if (result.data.status === 'error') {
                return thunkAPI.rejectWithValue({
                    error: errorMassage(result?.data?.message),
                });
            }

            return result.data;
        } catch (error) {
            return thunkAPI.rejectWithValue({
                error: errorMassage(
                    error.response?.data?.message || error.message
                ),
            });
        }
    }
);

export const CreateJob = createAsyncThunk(
    'CreateJob',
    async (payload, thunkAPI) => {
        try {
            const result = await API.post(
                APIS_ENDPOINTS.CREATE_JOB,
                payload
            );

            if (result.data.status === 'error') {
                return thunkAPI.rejectWithValue({
                    error: errorMassage(result?.data?.message),
                });
            }

            return result.data;
        } catch (error) {
            return thunkAPI.rejectWithValue({
                error: errorMassage(
                    error.response?.data?.message || error.message
                ),
            });
        }
    }
);

export const UpdateJob = createAsyncThunk(
    'UpdateJob',
    async ({ id, body }, thunkAPI) => {
        try {
            const result = await API.put(
                APIS_ENDPOINTS.UPDATE_JOB(id),
                body
            );

            if (result.data.status === 'error') {
                return thunkAPI.rejectWithValue({
                    error: errorMassage(result?.data?.message),
                });
            }

            return result.data;
        } catch (error) {
            return thunkAPI.rejectWithValue({
                error: errorMassage(
                    error.response?.data?.message || error.message
                ),
            });
        }
    }
);

export const DeleteJob = createAsyncThunk(
    'DeleteJob',
    async (id, thunkAPI) => {
        try {
            const result = await API.delete(
                APIS_ENDPOINTS.DELETE_JOB(id)
            );

            if (result.data.status === 'error') {
                return thunkAPI.rejectWithValue({
                    error: errorMassage(result?.data?.message),
                });
            }

            return result.data;
        } catch (error) {
            return thunkAPI.rejectWithValue({
                error: errorMassage(
                    error.response?.data?.message || error.message
                ),
            });
        }
    }
);

/* =======================================================
   ================= BRANCH =================
======================================================= */

export const BranchList = createAsyncThunk(
    'BranchList',
    async (_, thunkAPI) => {
        try {
            const result = await API.get(
                APIS_ENDPOINTS.BRANCH_LIST
            );

            if (result.data.status === 'error') {
                return thunkAPI.rejectWithValue({
                    error: errorMassage(result?.data?.message),
                });
            }

            return result.data;
        } catch (error) {
            return thunkAPI.rejectWithValue({
                error: errorMassage(
                    error.response?.data?.message || error.message
                ),
            });
        }
    }
);

export const CreateBranch = createAsyncThunk(
    'CreateBranch',
    async ({ userId, body }, thunkAPI) => {
        try {
            const result = await API.post(
                APIS_ENDPOINTS.CREATE_BRANCH(userId),
                body
            );

            if (result.data.status === 'error') {
                return thunkAPI.rejectWithValue({
                    error: errorMassage(result?.data?.message),
                });
            }

            return result.data;
        } catch (error) {
            return thunkAPI.rejectWithValue({
                error: errorMassage(
                    error.response?.data?.message || error.message
                ),
            });
        }
    }
);

export const UpdateBranch = createAsyncThunk(
    'UpdateBranch',
    async ({ userId, body }, thunkAPI) => {
        try {
            const result = await API.put(
                APIS_ENDPOINTS.UPDATE_BRANCH(userId),
                body
            );

            if (result.data.status === 'error') {
                return thunkAPI.rejectWithValue({
                    error: errorMassage(result?.data?.message),
                });
            }

            return result.data;
        } catch (error) {
            return thunkAPI.rejectWithValue({
                error: errorMassage(
                    error.response?.data?.message || error.message
                ),
            });
        }
    }
);

export const DeleteBranch = createAsyncThunk(
    'DeleteBranch',
    async (payload, thunkAPI) => {
        try {
            const result = await API.post(
                APIS_ENDPOINTS.DELETE_BRANCH,
                payload
            );

            if (result.data.status === 'error') {
                return thunkAPI.rejectWithValue({
                    error: errorMassage(result?.data?.message),
                });
            }

            return result.data;
        } catch (error) {
            return thunkAPI.rejectWithValue({
                error: errorMassage(
                    error.response?.data?.message || error.message
                ),
            });
        }
    }
);

/* =======================================================
   ================= WORKING SCHEDULE =================
======================================================= */

export const WorkingScheduleList = createAsyncThunk(
    'WorkingScheduleList',
    async (_, thunkAPI) => {
        try {
            const result = await API.get(
                APIS_ENDPOINTS.WORKING_SCHEDULE_LIST
            );

            if (result.data.status === 'error') {
                return thunkAPI.rejectWithValue({
                    error: errorMassage(result?.data?.message),
                });
            }

            return result.data;
        } catch (error) {
            return thunkAPI.rejectWithValue({
                error: errorMassage(
                    error.response?.data?.message || error.message
                ),
            });
        }
    }
);

export const CreateWorkingSchedule = createAsyncThunk(
    'CreateWorkingSchedule',
    async ({ userId, body }, thunkAPI) => {
        try {
            const result = await API.post(
                APIS_ENDPOINTS.CREATE_WORKING_SCHEDULE(userId),
                body
            );

            if (result.data.status === 'error') {
                return thunkAPI.rejectWithValue({
                    error: errorMassage(result?.data?.message),
                });
            }

            return result.data;
        } catch (error) {
            return thunkAPI.rejectWithValue({
                error: errorMassage(
                    error.response?.data?.message || error.message
                ),
            });
        }
    }
);

export const UpdateWorkingSchedule = createAsyncThunk(
    'UpdateWorkingSchedule',
    async ({ id, userId, body }, thunkAPI) => {
        try {
            const result = await API.put(
                APIS_ENDPOINTS.UPDATE_WORKING_SCHEDULE(id, userId),
                body
            );

            if (result.data.status === 'error') {
                return thunkAPI.rejectWithValue({
                    error: errorMassage(result?.data?.message),
                });
            }

            return result.data;
        } catch (error) {
            return thunkAPI.rejectWithValue({
                error: errorMassage(
                    error.response?.data?.message || error.message
                ),
            });
        }
    }
);

export const DeleteWorkingSchedule = createAsyncThunk(
    'DeleteWorkingSchedule',
    async ({ id, userId }, thunkAPI) => {
        try {
            const result = await API.delete(
                APIS_ENDPOINTS.DELETE_WORKING_SCHEDULE(id, userId)
            );

            if (result.data.status === 'error') {
                return thunkAPI.rejectWithValue({
                    error: errorMassage(result?.data?.message),
                });
            }

            return result.data;
        } catch (error) {
            return thunkAPI.rejectWithValue({
                error: errorMassage(
                    error.response?.data?.message || error.message
                ),
            });
        }
    }
);

/* =======================================================
   ================= WORK ENTRY TYPES =================
======================================================= */

export const WorkEntryList = createAsyncThunk(
    'WorkEntryList',
    async (_, thunkAPI) => {
        try {
            const result = await API.get(
                APIS_ENDPOINTS.WORK_ENTRY_LIST
            );

            if (result.data.status === 'error') {
                return thunkAPI.rejectWithValue({
                    error: errorMassage(result?.data?.message),
                });
            }

            return result.data;
        } catch (error) {
            return thunkAPI.rejectWithValue({
                error: errorMassage(
                    error.response?.data?.message || error.message
                ),
            });
        }
    }
);

export const CreateWorkEntry = createAsyncThunk(
    'CreateWorkEntry',
    async (payload, thunkAPI) => {
        try {
            const result = await API.post(
                APIS_ENDPOINTS.CREATE_WORK_ENTRY,
                payload
            );

            if (result.data.status === 'error') {
                return thunkAPI.rejectWithValue({
                    error: errorMassage(result?.data?.message),
                });
            }

            return result.data;
        } catch (error) {
            return thunkAPI.rejectWithValue({
                error: errorMassage(
                    error.response?.data?.message || error.message
                ),
            });
        }
    }
);

export const UpdateWorkEntry = createAsyncThunk(
    'UpdateWorkEntry',
    async ({ id, body }, thunkAPI) => {
        try {
            const result = await API.put(
                APIS_ENDPOINTS.UPDATE_WORK_ENTRY(id),
                body
            );

            if (result.data.status === 'error') {
                return thunkAPI.rejectWithValue({
                    error: errorMassage(result?.data?.message),
                });
            }

            return result.data;
        } catch (error) {
            return thunkAPI.rejectWithValue({
                error: errorMassage(
                    error.response?.data?.message || error.message
                ),
            });
        }
    }
);

export const DeleteWorkEntry = createAsyncThunk(
    'DeleteWorkEntry',
    async (id, thunkAPI) => {
        try {
            const result = await API.delete(
                APIS_ENDPOINTS.DELETE_WORK_ENTRY(id)
            );

            if (result.data.status === 'error') {
                return thunkAPI.rejectWithValue({
                    error: errorMassage(result?.data?.message),
                });
            }

            return result.data;
        } catch (error) {
            return thunkAPI.rejectWithValue({
                error: errorMassage(
                    error.response?.data?.message || error.message
                ),
            });
        }
    }
);

/* =======================================================
   ================= SKILLS =================
======================================================= */

export const SkillList = createAsyncThunk(
    'SkillList',
    async (_, thunkAPI) => {
        try {
            const result = await API.get(
                APIS_ENDPOINTS.SKILL_LIST
            );

            if (result.data.status === 'error') {
                return thunkAPI.rejectWithValue({
                    error: errorMassage(result?.data?.message),
                });
            }

            return result.data;
        } catch (error) {
            return thunkAPI.rejectWithValue({
                error: errorMassage(
                    error.response?.data?.message || error.message
                ),
            });
        }
    }
);

export const CreateSkill = createAsyncThunk(
    'CreateSkill',
    async (payload, thunkAPI) => {
        try {
            const result = await API.post(
                APIS_ENDPOINTS.CREATE_SKILL,
                payload
            );

            if (result.data.status === 'error') {
                return thunkAPI.rejectWithValue({
                    error: errorMassage(result?.data?.message),
                });
            }

            return result.data;
        } catch (error) {
            return thunkAPI.rejectWithValue({
                error: errorMassage(
                    error.response?.data?.message || error.message
                ),
            });
        }
    }
);

export const UpdateSkill = createAsyncThunk(
    'UpdateSkill',
    async ({ id, body }, thunkAPI) => {
        try {
            const result = await API.put(
                APIS_ENDPOINTS.UPDATE_SKILL(id),
                body
            );

            if (result.data.status === 'error') {
                return thunkAPI.rejectWithValue({
                    error: errorMassage(result?.data?.message),
                });
            }

            return result.data;
        } catch (error) {
            return thunkAPI.rejectWithValue({
                error: errorMassage(
                    error.response?.data?.message || error.message
                ),
            });
        }
    }
);

export const DeleteSkill = createAsyncThunk(
    'DeleteSkill',
    async (id, thunkAPI) => {
        try {
            const result = await API.delete(
                APIS_ENDPOINTS.DELETE_SKILL(id)
            );

            if (result.data.status === 'error') {
                return thunkAPI.rejectWithValue({
                    error: errorMassage(result?.data?.message),
                });
            }

            return result.data;
        } catch (error) {
            return thunkAPI.rejectWithValue({
                error: errorMassage(
                    error.response?.data?.message || error.message
                ),
            });
        }
    }
);

/* =======================================================
   ================= INDUSTRIES =================
======================================================= */

export const IndustryList = createAsyncThunk(
    'IndustryList',
    async (_, thunkAPI) => {
        try {
            const result = await API.get(
                APIS_ENDPOINTS.INDUSTRY_LIST
            );

            if (result.data.status === 'error') {
                return thunkAPI.rejectWithValue({
                    error: errorMassage(result?.data?.message),
                });
            }

            return result.data;
        } catch (error) {
            return thunkAPI.rejectWithValue({
                error: errorMassage(
                    error.response?.data?.message || error.message
                ),
            });
        }
    }
);

export const CreateIndustry = createAsyncThunk(
    'CreateIndustry',
    async (payload, thunkAPI) => {
        try {
            const result = await API.post(
                APIS_ENDPOINTS.CREATE_INDUSTRY,
                payload
            );

            if (result.data.status === 'error') {
                return thunkAPI.rejectWithValue({
                    error: errorMassage(result?.data?.message),
                });
            }

            return result.data;
        } catch (error) {
            return thunkAPI.rejectWithValue({
                error: errorMassage(
                    error.response?.data?.message || error.message
                ),
            });
        }
    }
);

export const UpdateIndustry = createAsyncThunk(
    'UpdateIndustry',
    async ({ id, body }, thunkAPI) => {
        try {
            const result = await API.put(
                APIS_ENDPOINTS.UPDATE_INDUSTRY(id),
                body
            );

            if (result.data.status === 'error') {
                return thunkAPI.rejectWithValue({
                    error: errorMassage(result?.data?.message),
                });
            }

            return result.data;
        } catch (error) {
            return thunkAPI.rejectWithValue({
                error: errorMassage(
                    error.response?.data?.message || error.message
                ),
            });
        }
    }
);

export const DeleteIndustry = createAsyncThunk(
    'DeleteIndustry',
    async (id, thunkAPI) => {
        try {
            const result = await API.delete(
                APIS_ENDPOINTS.DELETE_INDUSTRY(id)
            );

            if (result.data.status === 'error') {
                return thunkAPI.rejectWithValue({
                    error: errorMassage(result?.data?.message),
                });
            }

            return result.data;
        } catch (error) {
            return thunkAPI.rejectWithValue({
                error: errorMassage(
                    error.response?.data?.message || error.message
                ),
            });
        }
    }
);

/* =======================================================
   ================= BANK MASTER =================
======================================================= */

export const BankList = createAsyncThunk(
    'BankList',
    async (_, thunkAPI) => {
        try {
            const result = await API.get(
                APIS_ENDPOINTS.BANK_LIST
            );

            if (result.data.status === 'error') {
                return thunkAPI.rejectWithValue({
                    error: errorMassage(result?.data?.message),
                });
            }

            return result.data;
        } catch (error) {
            return thunkAPI.rejectWithValue({
                error: errorMassage(
                    error.response?.data?.message || error.message
                ),
            });
        }
    }
);

export const CreateBank = createAsyncThunk(
    'CreateBank',
    async (payload, thunkAPI) => {
        try {
            const result = await API.post(
                APIS_ENDPOINTS.CREATE_BANK,
                payload
            );

            if (result.data.status === 'error') {
                return thunkAPI.rejectWithValue({
                    error: errorMassage(result?.data?.message),
                });
            }

            return result.data;
        } catch (error) {
            return thunkAPI.rejectWithValue({
                error: errorMassage(
                    error.response?.data?.message || error.message
                ),
            });
        }
    }
);

export const UpdateBank = createAsyncThunk(
    'UpdateBank',
    async ({ id, body }, thunkAPI) => {
        try {
            const result = await API.put(
                APIS_ENDPOINTS.UPDATE_BANK(id),
                body
            );

            if (result.data.status === 'error') {
                return thunkAPI.rejectWithValue({
                    error: errorMassage(result?.data?.message),
                });
            }

            return result.data;
        } catch (error) {
            return thunkAPI.rejectWithValue({
                error: errorMassage(
                    error.response?.data?.message || error.message
                ),
            });
        }
    }
);

export const DeleteBank = createAsyncThunk(
    'DeleteBank',
    async (id, thunkAPI) => {
        try {
            const result = await API.delete(
                APIS_ENDPOINTS.DELETE_BANK(id)
            );

            if (result.data.status === 'error') {
                return thunkAPI.rejectWithValue({
                    error: errorMassage(result?.data?.message),
                });
            }

            return result.data;
        } catch (error) {
            return thunkAPI.rejectWithValue({
                error: errorMassage(
                    error.response?.data?.message || error.message
                ),
            });
        }
    }
);

/* =======================================================
   ================= BANK ACCOUNT =================
======================================================= */

export const BankAccountList = createAsyncThunk(
    'BankAccountList',
    async (_, thunkAPI) => {
        try {
            const result = await API.get(
                APIS_ENDPOINTS.BANK_ACCOUNT_LIST
            );

            if (result.data.status === 'error') {
                return thunkAPI.rejectWithValue({
                    error: errorMassage(result?.data?.message),
                });
            }

            return result.data;
        } catch (error) {
            return thunkAPI.rejectWithValue({
                error: errorMassage(
                    error.response?.data?.message || error.message
                ),
            });
        }
    }
);

export const CreateBankAccount = createAsyncThunk(
    'CreateBankAccount',
    async (payload, thunkAPI) => {
        try {
            const result = await API.post(
                APIS_ENDPOINTS.CREATE_BANK_ACCOUNT,
                payload
            );

            if (result.data.status === 'error') {
                return thunkAPI.rejectWithValue({
                    error: errorMassage(result?.data?.message),
                });
            }

            return result.data;
        } catch (error) {
            return thunkAPI.rejectWithValue({
                error: errorMassage(
                    error.response?.data?.message || error.message
                ),
            });
        }
    }
);

export const UpdateBankAccount = createAsyncThunk(
    'UpdateBankAccount',
    async ({ id, body }, thunkAPI) => {
        try {
            const result = await API.put(
                APIS_ENDPOINTS.UPDATE_BANK_ACCOUNT(id),
                body
            );

            if (result.data.status === 'error') {
                return thunkAPI.rejectWithValue({
                    error: errorMassage(result?.data?.message),
                });
            }

            return result.data;
        } catch (error) {
            return thunkAPI.rejectWithValue({
                error: errorMassage(
                    error.response?.data?.message || error.message
                ),
            });
        }
    }
);

export const DeleteBankAccount = createAsyncThunk(
    'DeleteBankAccount',
    async (id, thunkAPI) => {
        try {
            const result = await API.delete(
                APIS_ENDPOINTS.DELETE_BANK_ACCOUNT(id)
            );

            if (result.data.status === 'error') {
                return thunkAPI.rejectWithValue({
                    error: errorMassage(result?.data?.message),
                });
            }

            return result.data;
        } catch (error) {
            return thunkAPI.rejectWithValue({
                error: errorMassage(
                    error.response?.data?.message || error.message
                ),
            });
        }
    }
);

/* =======================================================
   ================= EMPLOYEE =================
======================================================= */

export const EmployeeList = createAsyncThunk(
    'EmployeeList',
    async (_, thunkAPI) => {
        try {
            const result = await API.get(
                APIS_ENDPOINTS.EMPLOYEE_LIST
            );

            if (result.data.status === 'error') {
                return thunkAPI.rejectWithValue({
                    error: errorMassage(result?.data?.message),
                });
            }

            return result.data;
        } catch (error) {
            return thunkAPI.rejectWithValue({
                error: errorMassage(
                    error.response?.data?.message || error.message
                ),
            });
        }
    }
);

export const CreateEmployee = createAsyncThunk(
    'CreateEmployee',
    async (payload, thunkAPI) => {
        try {
            const result = await API.post(
                APIS_ENDPOINTS.CREATE_EMPLOYEE,
                payload
            );

            if (result.data.status === 'error') {
                return thunkAPI.rejectWithValue({
                    error: errorMassage(result?.data?.message),
                });
            }

            return result.data;
        } catch (error) {
            return thunkAPI.rejectWithValue({
                error: errorMassage(
                    error.response?.data?.message || error.message
                ),
            });
        }
    }
);

export const UpdateEmployee = createAsyncThunk(
    'UpdateEmployee',
    async ({ userId, empId, body }, thunkAPI) => {
        try {
            const result = await API.put(
                APIS_ENDPOINTS.UPDATE_EMPLOYEE(userId, empId),
                body
            );

            if (result.data.status === 'error') {
                return thunkAPI.rejectWithValue({
                    error: errorMassage(result?.data?.message),
                });
            }

            return result.data;
        } catch (error) {
            return thunkAPI.rejectWithValue({
                error: errorMassage(
                    error.response?.data?.message || error.message
                ),
            });
        }
    }
);

export const DeleteEmployee = createAsyncThunk(
    'DeleteEmployee',
    async (id, thunkAPI) => {
        try {
            const result = await API.delete(
                APIS_ENDPOINTS.DELETE_EMPLOYEE(id)
            );

            if (result.data.status === 'error') {
                return thunkAPI.rejectWithValue({
                    error: errorMassage(result?.data?.message),
                });
            }

            return result.data;
        } catch (error) {
            return thunkAPI.rejectWithValue({
                error: errorMassage(
                    error.response?.data?.message || error.message
                ),
            });
        }
    }
);

/* =======================================================
   ================= ADMIN ATTENDANCE =================
======================================================= */

export const AdminAttendanceList = createAsyncThunk(
    'AdminAttendanceList',
    async (_, thunkAPI) => {
        try {
            const result = await API.get(
                APIS_ENDPOINTS.ADMIN_ATTENDANCE_LIST
            );

            if (result.data.status === 'error') {
                return thunkAPI.rejectWithValue({
                    error: errorMassage(result?.data?.message),
                });
            }

            return result.data;
        } catch (error) {
            return thunkAPI.rejectWithValue({
                error: errorMassage(
                    error.response?.data?.message || error.message
                ),
            });
        }
    }
);

export const UpdateAdminAttendance = createAsyncThunk(
    'UpdateAdminAttendance',
    async ({ id, body }, thunkAPI) => {
        try {
            const result = await API.put(
                APIS_ENDPOINTS.UPDATE_ADMIN_ATTENDANCE(id),
                body
            );

            if (result.data.status === 'error') {
                return thunkAPI.rejectWithValue({
                    error: errorMassage(result?.data?.message),
                });
            }

            return result.data;
        } catch (error) {
            return thunkAPI.rejectWithValue({
                error: errorMassage(
                    error.response?.data?.message || error.message
                ),
            });
        }
    }
);

/* =======================================================
   ================= APPROVAL =================
======================================================= */

export const ApprovalList = createAsyncThunk(
    'ApprovalList',
    async (userId, thunkAPI) => {
        try {
            const result = await API.get(
                APIS_ENDPOINTS.APPROVAL_LIST(userId)
            );

            if (result.data.status === 'error') {
                return thunkAPI.rejectWithValue({
                    error: errorMassage(result?.data?.message),
                });
            }

            return result.data;
        } catch (error) {
            return thunkAPI.rejectWithValue({
                error: errorMassage(
                    error.response?.data?.message || error.message
                ),
            });
        }
    }
);

export const ApproveAction = createAsyncThunk(
    'ApproveAction',
    async (payload, thunkAPI) => {
        try {
            const result = await API.post(
                APIS_ENDPOINTS.APPROVE_ACTION,
                payload
            );

            if (result.data.status === 'error') {
                return thunkAPI.rejectWithValue({
                    error: errorMassage(result?.data?.message),
                });
            }

            return result.data;
        } catch (error) {
            return thunkAPI.rejectWithValue({
                error: errorMassage(
                    error.response?.data?.message || error.message
                ),
            });
        }
    }
);

export const RejectAction = createAsyncThunk(
    'RejectAction',
    async (payload, thunkAPI) => {
        try {
            const result = await API.post(
                APIS_ENDPOINTS.REJECT_ACTION,
                payload
            );

            if (result.data.status === 'error') {
                return thunkAPI.rejectWithValue({
                    error: errorMassage(result?.data?.message),
                });
            }

            return result.data;
        } catch (error) {
            return thunkAPI.rejectWithValue({
                error: errorMassage(
                    error.response?.data?.message || error.message
                ),
            });
        }
    }
);




export const AdminSlice = createSlice({
    name: 'AdminSlice',
    initialState: {
        // PLAN
        PlanActivationData: {},
        isPlanActivationFetching: false,

        // ATTENDANCE POLICY
        AttendancePolicyListData: [],
        isAttendancePolicyListFetching: false,

        // DEPARTMENT
        DepartmentListData: [],
        isDepartmentListFetching: false,

        // JOB
        JobListData: [],
        isJobListFetching: false,

        // BRANCH
        BranchListData: [],
        isBranchListFetching: false,

        // WORKING SCHEDULE
        WorkingScheduleListData: [],
        isWorkingScheduleListFetching: false,

        // WORK ENTRY
        WorkEntryListData: [],
        isWorkEntryListFetching: false,

        // SKILL
        SkillListData: [],
        isSkillListFetching: false,

        // INDUSTRY
        IndustryListData: [],
        isIndustryListFetching: false,

        // BANK
        BankListData: [],
        isBankListFetching: false,

        // BANK ACCOUNT
        BankAccountListData: [],
        isBankAccountListFetching: false,

        // EMPLOYEE
        EmployeeListData: [],
        isEmployeeListFetching: false,

        // ADMIN ATTENDANCE
        AdminAttendanceListData: [],
        isAdminAttendanceListFetching: false,

        // APPROVAL
        ApprovalListData: [],
        isApprovalListFetching: false,

        isError: false,
        errorMessage: ""
    },
    reducers: {
        updateState: (state, { payload }) => {
           
            // 🔹 PLAN
            state.PlanActivationData = payload.PlanActivationData !== undefined ? payload.PlanActivationData : state.PlanActivationData;
            state.isPlanActivationFetching = payload.isPlanActivationFetching !== undefined ? payload.isPlanActivationFetching : state.isPlanActivationFetching;

            // 🔹 ATTENDANCE POLICY
            state.AttendancePolicyListData = payload.AttendancePolicyListData !== undefined ? payload.AttendancePolicyListData : state.AttendancePolicyListData;
            state.isAttendancePolicyListFetching = payload.isAttendancePolicyListFetching !== undefined ? payload.isAttendancePolicyListFetching : state.isAttendancePolicyListFetching;

            // 🔹 DEPARTMENT
            state.DepartmentListData = payload.DepartmentListData !== undefined ? payload.DepartmentListData : state.DepartmentListData;
            state.isDepartmentListFetching = payload.isDepartmentListFetching !== undefined ? payload.isDepartmentListFetching : state.isDepartmentListFetching;

            // 🔹 JOB
            state.JobListData = payload.JobListData !== undefined ? payload.JobListData : state.JobListData;
            state.isJobListFetching = payload.isJobListFetching !== undefined ? payload.isJobListFetching : state.isJobListFetching;

            // 🔹 BRANCH
            state.BranchListData = payload.BranchListData !== undefined ? payload.BranchListData : state.BranchListData;
            state.isBranchListFetching = payload.isBranchListFetching !== undefined ? payload.isBranchListFetching : state.isBranchListFetching;

            // 🔹 WORKING SCHEDULE
            state.WorkingScheduleListData = payload.WorkingScheduleListData !== undefined ? payload.WorkingScheduleListData : state.WorkingScheduleListData;
            state.isWorkingScheduleListFetching = payload.isWorkingScheduleListFetching !== undefined ? payload.isWorkingScheduleListFetching : state.isWorkingScheduleListFetching;

            // 🔹 WORK ENTRY
            state.WorkEntryListData = payload.WorkEntryListData !== undefined ? payload.WorkEntryListData : state.WorkEntryListData;
            state.isWorkEntryListFetching = payload.isWorkEntryListFetching !== undefined ? payload.isWorkEntryListFetching : state.isWorkEntryListFetching;

            // 🔹 SKILL
            state.SkillListData = payload.SkillListData !== undefined ? payload.SkillListData : state.SkillListData;
            state.isSkillListFetching = payload.isSkillListFetching !== undefined ? payload.isSkillListFetching : state.isSkillListFetching;

            // 🔹 INDUSTRY
            state.IndustryListData = payload.IndustryListData !== undefined ? payload.IndustryListData : state.IndustryListData;
            state.isIndustryListFetching = payload.isIndustryListFetching !== undefined ? payload.isIndustryListFetching : state.isIndustryListFetching;

            // 🔹 BANK
            state.BankListData = payload.BankListData !== undefined ? payload.BankListData : state.BankListData;
            state.isBankListFetching = payload.isBankListFetching !== undefined ? payload.isBankListFetching : state.isBankListFetching;

            // 🔹 BANK ACCOUNT
            state.BankAccountListData = payload.BankAccountListData !== undefined ? payload.BankAccountListData : state.BankAccountListData;
            state.isBankAccountListFetching = payload.isBankAccountListFetching !== undefined ? payload.isBankAccountListFetching : state.isBankAccountListFetching;

            // 🔹 EMPLOYEE
            state.EmployeeListData = payload.EmployeeListData !== undefined ? payload.EmployeeListData : state.EmployeeListData;
            state.isEmployeeListFetching = payload.isEmployeeListFetching !== undefined ? payload.isEmployeeListFetching : state.isEmployeeListFetching;

            // 🔹 ADMIN ATTENDANCE
            state.AdminAttendanceListData = payload.AdminAttendanceListData !== undefined ? payload.AdminAttendanceListData : state.AdminAttendanceListData;
            state.isAdminAttendanceListFetching = payload.isAdminAttendanceListFetching !== undefined ? payload.isAdminAttendanceListFetching : state.isAdminAttendanceListFetching;

            // 🔹 APPROVAL
            state.ApprovalListData = payload.ApprovalListData !== undefined ? payload.ApprovalListData : state.ApprovalListData;
            state.isApprovalListFetching = payload.isApprovalListFetching !== undefined ? payload.isApprovalListFetching : state.isApprovalListFetching;

            state.isError = payload.isError !== undefined ? payload.isError : state.isError;
            state.errorMessage = payload.errorMessage !== undefined ? payload.errorMessage : state.errorMessage;
        },
    },
    extraReducers: builder => {

        //========= PlanActivation
        builder.addCase(PlanActivation.fulfilled, (state, { payload }) => {
            try {
                state.PlanActivationData = payload;
                state.isPlanActivationFetching = false;
                state.isError = false;
                state.errorMessage = '';
            } catch (error) {
                console.log('PlanActivation fulfilled error >>', error);
            }
        });

        builder.addCase(PlanActivation.rejected, (state, { payload }) => {
            try {
                state.PlanActivationData = {};
                state.isPlanActivationFetching = false;
                state.isError = true;
                state.errorMessage = payload?.error || "Something went wrong";
            } catch (error) {
                console.log('PlanActivation rejected error >>', error);
            }
        });

        builder.addCase(PlanActivation.pending, state => {
            state.isPlanActivationFetching = true;
        });

        //========= AttendancePolicyList
        builder.addCase(AttendancePolicyList.fulfilled, (state, { payload }) => {
            try {
                state.AttendancePolicyListData = payload;
                state.isAttendancePolicyListFetching = false;
                state.isError = false;
                state.errorMessage = '';
            } catch (error) {
                console.log('AttendancePolicyList fulfilled error >>', error);
            }
        });

        builder.addCase(AttendancePolicyList.rejected, (state, { payload }) => {
            try {
                state.AttendancePolicyListData = [];
                state.isAttendancePolicyListFetching = false;
                state.isError = true;
                state.errorMessage = payload?.error || "Something went wrong";
            } catch (error) {
                console.log('AttendancePolicyList rejected error >>', error);
            }
        });

        builder.addCase(AttendancePolicyList.pending, state => {
            state.isAttendancePolicyListFetching = true;
        });

        //========= DepartmentList
        builder.addCase(DepartmentList.fulfilled, (state, { payload }) => {
            try {
                state.DepartmentListData = payload;
                state.isDepartmentListFetching = false;
                state.isError = false;
                state.errorMessage = '';
            } catch (error) {
                console.log('DepartmentList fulfilled error >>', error);
            }
        });

        builder.addCase(DepartmentList.rejected, (state, { payload }) => {
            try {
                state.DepartmentListData = [];
                state.isDepartmentListFetching = false;
                state.isError = true;
                state.errorMessage = payload?.error || "Something went wrong";
            } catch (error) {
                console.log('DepartmentList rejected error >>', error);
            }
        });

        builder.addCase(DepartmentList.pending, state => {
            state.isDepartmentListFetching = true;
        });

        //========= JobList
        builder.addCase(JobList.fulfilled, (state, { payload }) => {
            try {
                state.JobListData = payload;
                state.isJobListFetching = false;
                state.isError = false;
                state.errorMessage = '';
            } catch (error) {
                console.log('JobList fulfilled error >>', error);
            }
        });

        builder.addCase(JobList.rejected, (state, { payload }) => {
            try {
                state.JobListData = [];
                state.isJobListFetching = false;
                state.isError = true;
                state.errorMessage = payload?.error || "Something went wrong";
            } catch (error) {
                console.log('JobList rejected error >>', error);
            }
        });

        builder.addCase(JobList.pending, state => {
            state.isJobListFetching = true;
        });


        //========= BranchList
        builder.addCase(BranchList.fulfilled, (state, { payload }) => {
            try {
                state.BranchListData = payload;
                state.isBranchListFetching = false;
                state.isError = false;
                state.errorMessage = '';
            } catch (error) {
                console.log('BranchList fulfilled error >>', error);
            }
        });

        builder.addCase(BranchList.rejected, (state, { payload }) => {
            try {
                state.BranchListData = [];
                state.isBranchListFetching = false;
                state.isError = true;
                state.errorMessage = payload?.error || "Something went wrong";
            } catch (error) {
                console.log('BranchList rejected error >>', error);
            }
        });

        builder.addCase(BranchList.pending, state => {
            state.isBranchListFetching = true;
        });

        //========= WorkingScheduleList
        builder.addCase(WorkingScheduleList.fulfilled, (state, { payload }) => {
            try {
                state.WorkingScheduleListData = payload;
                state.isWorkingScheduleListFetching = false;
                state.isError = false;
                state.errorMessage = '';
            } catch (error) {
                console.log('WorkingScheduleList fulfilled error >>', error);
            }
        });

        builder.addCase(WorkingScheduleList.rejected, (state, { payload }) => {
            try {
                state.WorkingScheduleListData = [];
                state.isWorkingScheduleListFetching = false;
                state.isError = true;
                state.errorMessage = payload?.error || "Something went wrong";
            } catch (error) {
                console.log('WorkingScheduleList rejected error >>', error);
            }
        });

        builder.addCase(WorkingScheduleList.pending, state => {
            state.isWorkingScheduleListFetching = true;
        });


        //========= WorkEntryList
        builder.addCase(WorkEntryList.fulfilled, (state, { payload }) => {
            try {
                state.WorkEntryListData = payload;
                state.isWorkEntryListFetching = false;
                state.isError = false;
                state.errorMessage = '';
            } catch (error) {
                console.log('WorkEntryList fulfilled error >>', error);
            }
        });

        builder.addCase(WorkEntryList.rejected, (state, { payload }) => {
            try {
                state.WorkEntryListData = [];
                state.isWorkEntryListFetching = false;
                state.isError = true;
                state.errorMessage = payload?.error || "Something went wrong";
            } catch (error) {
                console.log('WorkEntryList rejected error >>', error);
            }
        });

        builder.addCase(WorkEntryList.pending, state => {
            state.isWorkEntryListFetching = true;
        });

        //========= SkillList
        builder.addCase(SkillList.fulfilled, (state, { payload }) => {
            try {
                state.SkillListData = payload;
                state.isSkillListFetching = false;
                state.isError = false;
                state.errorMessage = '';
            } catch (error) {
                console.log('SkillList fulfilled error >>', error);
            }
        });

        builder.addCase(SkillList.rejected, (state, { payload }) => {
            try {
                state.SkillListData = [];
                state.isSkillListFetching = false;
                state.isError = true;
                state.errorMessage = payload?.error || "Something went wrong";
            } catch (error) {
                console.log('SkillList rejected error >>', error);
            }
        });

        builder.addCase(SkillList.pending, state => {
            state.isSkillListFetching = true;
        });


        //========= IndustryList
        builder.addCase(IndustryList.fulfilled, (state, { payload }) => {
            try {
                state.IndustryListData = payload;
                state.isIndustryListFetching = false;
                state.isError = false;
                state.errorMessage = '';
            } catch (error) {
                console.log('IndustryList fulfilled error >>', error);
            }
        });

        builder.addCase(IndustryList.rejected, (state, { payload }) => {
            try {
                state.IndustryListData = [];
                state.isIndustryListFetching = false;
                state.isError = true;
                state.errorMessage = payload?.error || "Something went wrong";
            } catch (error) {
                console.log('IndustryList rejected error >>', error);
            }
        });

        builder.addCase(IndustryList.pending, state => {
            state.isIndustryListFetching = true;
        });

        //========= BankList
        builder.addCase(BankList.fulfilled, (state, { payload }) => {
            try {
                state.BankListData = payload;
                state.isBankListFetching = false;
                state.isError = false;
                state.errorMessage = '';
            } catch (error) {
                console.log('BankList fulfilled error >>', error);
            }
        });

        builder.addCase(BankList.rejected, (state, { payload }) => {
            try {
                state.BankListData = [];
                state.isBankListFetching = false;
                state.isError = true;
                state.errorMessage = payload?.error || "Something went wrong";
            } catch (error) {
                console.log('BankList rejected error >>', error);
            }
        });

        builder.addCase(BankList.pending, state => {
            state.isBankListFetching = true;
        });

        //========= BankAccountList
        builder.addCase(BankAccountList.fulfilled, (state, { payload }) => {
            try {
                state.BankAccountListData = payload;
                state.isBankAccountListFetching = false;
                state.isError = false;
                state.errorMessage = '';
            } catch (error) {
                console.log('BankAccountList fulfilled error >>', error);
            }
        });

        builder.addCase(BankAccountList.rejected, (state, { payload }) => {
            try {
                state.BankAccountListData = [];
                state.isBankAccountListFetching = false;
                state.isError = true;
                state.errorMessage = payload?.error || "Something went wrong";
            } catch (error) {
                console.log('BankAccountList rejected error >>', error);
            }
        });

        builder.addCase(BankAccountList.pending, state => {
            state.isBankAccountListFetching = true;
        });

        //========= EmployeeList
        builder.addCase(EmployeeList.fulfilled, (state, { payload }) => {
            try {
                state.EmployeeListData = payload;
                state.isEmployeeListFetching = false;
                state.isError = false;
                state.errorMessage = '';
            } catch (error) {
                console.log('EmployeeList fulfilled error >>', error);
            }
        });

        builder.addCase(EmployeeList.rejected, (state, { payload }) => {
            try {
                state.EmployeeListData = [];
                state.isEmployeeListFetching = false;
                state.isError = true;
                state.errorMessage = payload?.error || "Something went wrong";
            } catch (error) {
                console.log('EmployeeList rejected error >>', error);
            }
        });

        builder.addCase(EmployeeList.pending, state => {
            state.isEmployeeListFetching = true;
        });

        //========= AdminAttendanceList
        builder.addCase(AdminAttendanceList.fulfilled, (state, { payload }) => {
            try {
                state.AdminAttendanceListData = payload;
                state.isAdminAttendanceListFetching = false;
                state.isError = false;
                state.errorMessage = '';
            } catch (error) {
                console.log('AdminAttendanceList fulfilled error >>', error);
            }
        });

        builder.addCase(AdminAttendanceList.rejected, (state, { payload }) => {
            try {
                state.AdminAttendanceListData = [];
                state.isAdminAttendanceListFetching = false;
                state.isError = true;
                state.errorMessage = payload?.error || "Something went wrong";
            } catch (error) {
                console.log('AdminAttendanceList rejected error >>', error);
            }
        });

        builder.addCase(AdminAttendanceList.pending, state => {
            state.isAdminAttendanceListFetching = true;
        });

        //========= ApprovalList
        builder.addCase(ApprovalList.fulfilled, (state, { payload }) => {
            try {
                state.ApprovalListData = payload;
                state.isApprovalListFetching = false;
                state.isError = false;
                state.errorMessage = '';
            } catch (error) {
                console.log('ApprovalList fulfilled error >>', error);
            }
        });

        builder.addCase(ApprovalList.rejected, (state, { payload }) => {
            try {
                state.ApprovalListData = [];
                state.isApprovalListFetching = false;
                state.isError = true;
                state.errorMessage = payload?.error || "Something went wrong";
            } catch (error) {
                console.log('ApprovalList rejected error >>', error);
            }
        });

        builder.addCase(ApprovalList.pending, state => {
            state.isApprovalListFetching = true;
        });
    }
});
export const { updateState } = AdminSlice.actions;
export const { clearState } = AdminSlice.actions;
export const AdminSelector = state => state.main.Admin;

