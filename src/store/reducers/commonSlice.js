import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import Config from 'react-native-config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from './apiInstance'

const errorMassage = (error) => {
    if (error === "Network Error") {
        return "Server not responding. Please try again later."
    }
    return error
}

export const UserToken = createAsyncThunk(
    'auth/UserToken',
    async (payload, thunkAPI) => {
        try {
            const response = await API.post('api/auth', payload);
            if (response.data.status === 'success') {
                const token = response.data.token;
                await AsyncStorage.setItem('USER_TOKEN', token);
                return token;
            }
            return thunkAPI.rejectWithValue(
                response?.data?.errorMessage || 'Authentication failed'
            );
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error?.response?.data?.message || error?.message
            );
        }
    }
);

export const Usersignin = createAsyncThunk(
    'Usersignin',
    async (userdata, thunkAPI) => {
        try {
            const result = await API.post('api/login', {
                email: userdata.email,
                password: userdata.password,
            });
    
            if (result.data.status === 'error') {
                return thunkAPI.rejectWithValue({
                    error: errorMassage(result?.data?.message),
                });
            }

            return result.data;
        } catch (error) {
            return thunkAPI.rejectWithValue({
                error: errorMassage(error.response?.data?.message || error.message),
            });
        }
    }
);

export const UserVerification = createAsyncThunk(
    'UserVerification',
    async (payload, thunkAPI) => {
        try {
            let result = await API.post('api/employee/device-register', payload);
            if (result.data.success) {
                return { ...result.data.data, message: result.data.successMessage };
            } else {
                return thunkAPI.rejectWithValue({ error: errorMassage(result?.data?.errorMessage) });
            }
        } catch (error) {
            if (error.message) {
                return thunkAPI.rejectWithValue({ error: errorMassage(error?.response?.data?.message || error.message) });
            }
        }
    },
);

export const UserAttendance = createAsyncThunk(
    'UserAttendance',
    async (userdata, thunkAPI) => {
        try {
            let result = await API.post('api/employee/attandence', userdata);
            if (result.data.success) {
                return { ...result.data.data, message: result?.data.successMessage, action: result?.data?.action };
            } else {
                return thunkAPI.rejectWithValue({ error: errorMassage(result?.data?.errorMessage) });
            }
        } catch (error) {
            console.log("Error >>>", error.response?.data || error.message);
            return thunkAPI.rejectWithValue({
                error: errorMassage(error.response?.data?.errorMessage || error?.message)
            });
        }
    },
);

export const GetAttandanceList = createAsyncThunk(
    'GetAttandanceList',
    async (userdata, thunkAPI) => {
        try {
            let result = await API.get(`api/user/attendance?user_id=${userdata.id}&month=${userdata.month}&year=${userdata.year}`);
            if (result.data.status === "error") {
                return thunkAPI.rejectWithValue({
                    error: errorMassage(result.data.message)
                });
            }
            return { attandancelist: result.data.data, message: result.data.successMessage };
        } catch (error) {
            console.log("Axios Error:", error);
            return thunkAPI.rejectWithValue({
                error: errorMassage(error.response?.data?.message || error.message)
            });
        }
    },
);

export const ProfileUpdate = createAsyncThunk(
    'ProfileUpdate',
    async (userdata, thunkAPI) => {
        try {
            let result = await axios({
                method: 'POST',
                baseURL: Config.BASE_URL,
                url: `api/profile/update`,
                headers: Authheader,
                data: userdata,
            });
            // console.log('ProfileUpdate result.data >>', result.data);
            if (result.data.success) {
                return result.data.data;
            } else {
                return thunkAPI.rejectWithValue({ error: result.data.errorMessage });
            }
        } catch (error) {
            console.log("error>>>", error)
            console.log('try catch [ ProfileUpdate ] error.message>>', error.message);
            return thunkAPI.rejectWithValue({ error: error.message });
        }
    },
);
export const ForgotPassword = createAsyncThunk(
    'ForgotPassword',
    async (userdata, thunkAPI) => {
        console.log('ForgotPassword userdata >>', userdata);
        try {
            let result = await axios({
                method: 'POST',
                baseURL: Config.BASE_URL,
                url: `fact/reset_password`,
                data: userdata,
            });
            // console.log('ForgotPassword result.data >>', result.data);
            if (result.data.success) {
                return result.data;
            } else {
                return thunkAPI.rejectWithValue({ error: result.data.errorMessage });
            }
        } catch (error) {
            console.log("error>>>", error)
            console.log('try catch [ ProfileUpdate ] error.message>>', error.message);
            return thunkAPI.rejectWithValue({ error: error.message });
        }
    },
);
// =====================================================================

// =====================================================================
export const CategoryList = createAsyncThunk(
    'CategoryList',
    async (userdata, thunkAPI) => {
        // console.log('CategoryList userdata >>', userdata);
        try {
            let result = await axios({
                method: 'GET',
                baseURL: Config.BASE_URL,
                url: 'product/category',
                // headers: Authheader,
                // data: userdata,
            });
            // console.log('CategoryList result.data >>', result.data);
            if (result.data.success) {
                return result.data.data;
            } else {
                return thunkAPI.rejectWithValue({ error: result.data.errorMessage });
            }
        } catch (error) {
            console.log("error>>>", error)
            console.log('try catch [ CategoryList ] error.message>>', error.message);
            return thunkAPI.rejectWithValue({ error: error.message });
        }
    },
);
export const CreateExpenses = createAsyncThunk(
    'CreateExpenses',
    async (userdata, thunkAPI) => {
        console.log('CreateExpenses userdata >>', userdata);
        try {
            let result = await axios({
                method: 'POST',
                baseURL: Config.BASE_URL,
                url: 'hr/expenses',
                headers: Authheader,
                data: userdata,
            });
            // console.log('CreateExpenses result.data >>', result.data);
            if (result.data.success) {
                return result.data;
            } else {
                return thunkAPI.rejectWithValue({ error: result.data.error });
            }
        } catch (error) {
            console.log("error>>>", error)
            console.log('try catch [ CreateExpenses ] error.message>>', error.message);
            return thunkAPI.rejectWithValue({ error: error.message });
        }
    },
);
// =====================================================================

export const GetExpenseList = createAsyncThunk(
    'GetExpenseList',
    async (userdata, thunkAPI) => {
        console.log('GetExpenseList userdata >>', userdata);
        try {
            let result = await axios({
                method: 'GET',
                baseURL: Config.BASE_URL,
                url: 'api/list_of_expense',
                // headers: Authheader,
                params: userdata,
            });
            // console.log('GetExpenseList result.data >>', result.data);
            if (result.data.success) {
                return result.data.records;
            } else {
                return thunkAPI.rejectWithValue({ error: result.data.error });
            }
        } catch (error) {
            console.log("error>>>", error)
            console.log('try catch [ GetExpenseList ] error.message>>', error.message);
            return thunkAPI.rejectWithValue({ error: error.message });
        }
    },
);
export const GetInvoiceList = createAsyncThunk(
    'GetInvoiceList',
    async (userdata, thunkAPI) => {
        console.log('GetInvoiceList userdata >>', userdata);
        try {
            let result = await axios({
                method: 'GET',
                baseURL: Config.BASE_URL,
                url: `api/list_of_invoice`,
                // headers: Authheader,
                params: userdata,
            });
            // console.log('GetInvoiceList result.data >>', result.data);
            if (result.data.success) {
                return result.data.data;
            } else {
                return thunkAPI.rejectWithValue({ error: result.data.error });
            }
        } catch (error) {
            console.log("error>>>", error)
            console.log('try catch [ GetInvoiceList ] error.message>>', error.message);
            return thunkAPI.rejectWithValue({ error: error.message });
        }
    },
);
export const GetInvoiceListMore = createAsyncThunk(
    'GetInvoiceListMore',
    async (userdata, thunkAPI) => {
        console.log('GetInvoiceListMore userdata >>', userdata);
        try {
            let result = await axios({
                method: 'GET',
                baseURL: Config.BASE_URL,
                url: `api/list_of_invoice`,
                // headers: Authheader,
                params: userdata,
            });
            // console.log('GetInvoiceListMore result.data >>', result.data);
            if (result.data.success) {
                return result.data.data;
            } else {
                return thunkAPI.rejectWithValue({ error: result.data.error });
            }
        } catch (error) {
            console.log("error>>>", error)
            console.log('try catch [ GetInvoiceListMore ] error.message>>', error.message);
            return thunkAPI.rejectWithValue({ error: error.message });
        }
    },
);
export const ExpenseApprove = createAsyncThunk(
    'ExpenseApprove',
    async (userdata, thunkAPI) => {
        console.log('ExpenseApprove userdata >>', userdata);
        try {
            let result = await axios({
                method: 'POST',
                baseURL: Config.BASE_URL,
                url: `api/approve_invoice`,
                // headers: Authheader,
                data: userdata,
            });
            // console.log('ExpenseApprove result.data >>', result.data);
            if (result.data.success) {
                return result.data;
            } else {
                return thunkAPI.rejectWithValue({ error: result.data.errorMessage });
            }
        } catch (error) {
            console.log("error>>>", error)
            console.log('try catch [ ExpenseApprove ] error.message>>', error.message);
            return thunkAPI.rejectWithValue({ error: error.message });
        }
    },
);
export const GetLeaveList = createAsyncThunk(
    'GetLeaveList',
    async (userdata, thunkAPI) => {
        console.log('GetLeaveList userdata >>', userdata);
        try {
            let result = await axios({
                method: 'GET',
                baseURL: Config.BASE_URL,
                url: 'api/list_of_leave',
                // headers: Authheader,
                params: userdata,
            });
            // console.log('GetLeaveList result.data >>', result.data);
            if (result.data.success) {
                return result.data;
            } else {
                return thunkAPI.rejectWithValue({ error: result.data.error });
            }
        } catch (error) {
            console.log("error>>>", error)
            console.log('try catch [ GetLeaveList ] error.message>>', error.message);
            return thunkAPI.rejectWithValue({ error: error.message });
        }
    },
);
//==== Get Leave TYpe 
export const GetLeavetype = createAsyncThunk(
    'GetLeavetype',
    async (userdata, thunkAPI) => {
        console.log('GetLeavetype userdata >>', userdata);
        try {
            let result = await axios({
                method: 'GET',
                baseURL: Config.BASE_URL,
                url: 'api/list_of_leave_type',
                headers: Authheader,
                params: userdata,
            });
            // console.log('GetLeavetype result.data >>', result.data);
            if (result.data.success) {
                return result.data.leave_types;
            } else {
                return thunkAPI.rejectWithValue({ error: result.data.errorMessage });
            }
        } catch (error) {
            console.log("error>>>", error)
            console.log('try catch [ GetLeavetype ] error.message>>', error.message);
            return thunkAPI.rejectWithValue({ error: error.message });
        }
    },
);
export const CreateLeave = createAsyncThunk(
    'CreateLeave',
    async (userdata, thunkAPI) => {
        console.log('CreateLeave userdata >>', userdata);
        try {
            let result = await axios({
                method: 'POST',
                baseURL: Config.BASE_URL,
                url: `api/create_leave`,
                // headers: Authheader,
                data: userdata,
            });
            // console.log('CreateLeave result.data >>', result.data);
            if (result.data.success) {
                return result.data;
            } else {
                return thunkAPI.rejectWithValue({ error: result.data.errorMessage });
            }
        } catch (error) {
            console.log("error>>>", error)
            console.log('try catch [ CreateLeave ] error.message>>', error.message);
            return thunkAPI.rejectWithValue({ error: error.message });
        }
    },
);
//==== GEt Calendar event
export const GetCalendarEvents = createAsyncThunk(
    'GetCalendarEvents',
    async (userdata, thunkAPI) => {
        console.log('GetCalendarEvents userdata >>', userdata);
        try {
            let result = await axios({
                method: 'GET',
                baseURL: Config.BASE_URL,
                url: 'api/list_of_own_calendar',
                // headers: Authheader,
                params: userdata,
            });
            // console.log('GetCalendarEvents result.data >>', result.data);
            if (result.data.success) {
                return result.data.data;
            } else {
                return thunkAPI.rejectWithValue({ error: result.data.error });
            }
        } catch (error) {
            console.log("error>>>", error)
            console.log('try catch [ GetCalendarEvents ] error.message>>', error.message);
            return thunkAPI.rejectWithValue({ error: error.message });
        }
    },
);
export const GetCalendarEventsMore = createAsyncThunk(
    'GetCalendarEventsMore',
    async (userdata, thunkAPI) => {
        console.log('GetCalendarEventsMore userdata >>', userdata);
        try {
            let result = await axios({
                method: 'GET',
                baseURL: Config.BASE_URL,
                url: 'api/list_of_own_calendar',
                // headers: Authheader,
                params: userdata,
            });
            // console.log('GetCalendarEventsMore result.data >>', result.data);
            if (result.data.success) {
                return result.data.data;
            } else {
                return thunkAPI.rejectWithValue({ error: result.data.error });
            }
        } catch (error) {
            console.log("error>>>", error)
            console.log('try catch [ GetCalendarEventsMore ] error.message>>', error.message);
            return thunkAPI.rejectWithValue({ error: error.message });
        }
    },
);

//==== GEt attendees list
export const GetAttendeesList = createAsyncThunk(
    'GetAttendeesList',
    async (userdata, thunkAPI) => {
        console.log('GetAttendeesList userdata >>', userdata);
        try {
            let result = await axios({
                method: 'GET',
                baseURL: Config.BASE_URL,
                url: 'api/list_of_partners_for_calendar',
                // headers: Authheader,
                params: userdata,
            });
            // console.log('GetAttendeesList result.data >>', result.data);
            if (result.data.success) {
                return result.data.data;
            } else {
                return thunkAPI.rejectWithValue({ error: result.data.error });
            }
        } catch (error) {
            console.log("error>>>", error)
            console.log('try catch [ GetAttendeesList ] error.message>>', error.message);
            return thunkAPI.rejectWithValue({ error: error.message });
        }
    },
);
export const GetAttendeesListMore = createAsyncThunk(
    'GetAttendeesListMore',
    async (userdata, thunkAPI) => {
        console.log('GetAttendeesListMore userdata >>', userdata);
        try {
            let result = await axios({
                method: 'GET',
                baseURL: Config.BASE_URL,
                url: 'api/list_of_partners_for_calendar',
                // headers: Authheader,
                params: userdata,
            });
            // console.log('GetAttendeesListMore result.data >>', result.data);
            if (result.data.success) {
                return result.data.data;
            } else {
                return thunkAPI.rejectWithValue({ error: result.data.error });
            }
        } catch (error) {
            console.log("error>>>", error)
            console.log('try catch [ GetAttendeesListMore ] error.message>>', error.message);
            return thunkAPI.rejectWithValue({ error: error.message });
        }
    },
);
export const GetRemindersList = createAsyncThunk(
    'GetRemindersList',
    async (userdata, thunkAPI) => {
        console.log('GetRemindersList userdata >>', userdata);
        try {
            let result = await axios({
                method: 'GET',
                baseURL: Config.BASE_URL,
                url: 'api/calendar_event_reminders',
                // headers: Authheader,
                // params: userdata,
            });
            // console.log('GetRemindersList result.data >>', result.data);
            if (result.data.success) {
                return result.data.data;
            } else {
                return thunkAPI.rejectWithValue({ error: result.data.error });
            }
        } catch (error) {
            console.log("error>>>", error)
            console.log('try catch [ GetRemindersList ] error.message>>', error.message);
            return thunkAPI.rejectWithValue({ error: error.message });
        }
    },
);

export const CreateNewMeeting = createAsyncThunk(
    'CreateNewMeeting',
    async (userdata, thunkAPI) => {
        console.log('CreateNewMeeting userdata >>', userdata);
        try {
            let result = await axios({
                method: 'POST',
                baseURL: Config.BASE_URL,
                url: `api/create_calendar_event`,
                // headers: Authheader,
                data: userdata,
            });
            // console.log('CreateNewMeeting result.data >>', result.data);
            if (result.data.success) {
                return result.data;
            } else {
                return thunkAPI.rejectWithValue({ error: result.data.errorMessage });
            }
        } catch (error) {
            console.log("error>>>", error)
            console.log('try catch [ CreateNewMeeting ] error.message >>', error.message,);
            return thunkAPI.rejectWithValue({ error: error.message });
        }
    },
);
// ------ approval------------
export const ApprovalList = createAsyncThunk(
    'ApprovalList',
    async (userdata, thunkAPI) => {
        console.log('ApprovalList userdata >>', userdata);
        try {
            let result = await axios({
                method: 'GET',
                baseURL: Config.BASE_URL,
                url: 'approvals/requests/api',
                // headers: Authheader,
                params: userdata,
            });
            // console.log('ApprovalList result.data >>', result.data);
            if (result.data.success) {
                return result.data;
            } else {
                return thunkAPI.rejectWithValue({ error: result.data.errorMessage });
            }
        } catch (error) {
            console.log("error>>>", error)
            console.log('try catch [ ApprovalList ] error.message>>', error.message);
            return thunkAPI.rejectWithValue({ error: error.message });
        }
    },
);
export const ApprovalListMore = createAsyncThunk(
    'ApprovalListMore',
    async (userdata, thunkAPI) => {
        console.log('ApprovalListMore userdata >>', userdata);
        try {
            let result = await axios({
                method: 'GET',
                baseURL: Config.BASE_URL,
                url: 'approvals/requests/api',
                // headers: Authheader,
                params: userdata,
            });
            // console.log('ApprovalListMore result.data >>', result.data);
            if (result.data.success) {
                return result.data;
            } else {
                return thunkAPI.rejectWithValue({ error: result.data.error });
            }
        } catch (error) {
            console.log("error>>>", error)
            console.log('try catch [ ApprovalListMore ] error.message>>', error.message);
            return thunkAPI.rejectWithValue({ error: error.message });
        }
    },
);
export const ApproveAction = createAsyncThunk(
    'ApproveAction',
    async (userdata, thunkAPI) => {
        console.log('ApproveAction userdata >>', userdata);
        try {
            let result = await axios({
                method: 'POST',
                baseURL: Config.BASE_URL,
                url: 'approvals/action/api',
                // headers: Authheader,
                data: userdata,
            });
            // console.log('ApproveAction result.data >>', result.data);
            if (result.data.success) {
                return result.data;
            } else {
                return thunkAPI.rejectWithValue({ error: result.data.errorMessage });
            }
        } catch (error) {
            console.log("error>>>", error)
            console.log('try catch [ ApproveAction ] error.message>>', error.message);
            return thunkAPI.rejectWithValue({ error: error.message });
        }
    },
);
export const ApprovalCategory = createAsyncThunk(
    'ApprovalCategory',
    async (userdata, thunkAPI) => {
        console.log('ApprovalCategory userdata >>', userdata);
        try {
            let result = await axios({
                method: 'GET',
                baseURL: Config.BASE_URL,
                url: 'approvals/types/api',
            });
            // console.log('ApprovalCategory result.data >>', result.data);
            if (result.data.success) {
                return result.data;
            } else {
                return thunkAPI.rejectWithValue({ error: result.data.error });
            }
        } catch (error) {
            console.log("error>>>", error)
            console.log('try catch [ ApprovalCategory ] error.message>>', error.message);
            return thunkAPI.rejectWithValue({ error: error.message });
        }
    },
);

export const GetMonthlyAttendanceReport = createAsyncThunk(
    'GetMonthlyAttendanceReport',
    async (userdata, thunkAPI) => {
        console.log('GetMonthlyAttendanceReport userdata >>', userdata);
        try {
            let result = await axios({
                method: 'GET',
                baseURL: Config.BASE_URL,
                url: 'api/hr/attendance/monthly',
                // headers: Authheader,
                params: userdata,
            });
            // console.log('GetMonthlyAttendanceReport result.data >>', result.data);
            if (result.data.success) {
                return result.data;
            } else {
                return thunkAPI.rejectWithValue({ error: result.data.errorMessage });
            }
        } catch (error) {
            console.log("error>>>", error)
            console.log('try catch [ GetMonthlyAttendanceReport ] error.message>>', error.message);
            return thunkAPI.rejectWithValue({ error: error.message });
        }
    },
);

export const GetReportDocs = createAsyncThunk(
    'GetReportDocs',
    async (userdata, thunkAPI) => {
        console.log('GetReportDocs userdata >>', userdata);
        try {
            let result = await axios({
                method: 'GET',
                baseURL: Config.BASE_URL,
                url: 'api/documents/list',
                // headers: Authheader,
                params: userdata,
            });
            // console.log('GetReportDocs result.data >>', result.data);
            if (result.data.success) {
                return result.data.data;
            } else {
                return thunkAPI.rejectWithValue({ error: result.data.errorMessage });
            }
        } catch (error) {
            console.log("error>>>", error)
            console.log('try catch [ GetReportDocs ] error.message>>', error.message);
            return thunkAPI.rejectWithValue({ error: error.message });
        }
    },
);
export const GetReportDocsMore = createAsyncThunk(
    'GetReportDocsMore',
    async (userdata, thunkAPI) => {
        console.log('GetReportDocsMore userdata >>', userdata);
        try {
            let result = await axios({
                method: 'GET',
                baseURL: Config.BASE_URL,
                url: 'api/documents/list',
                // headers: Authheader,
                params: userdata,
            });
            // console.log('GetReportDocsMore result.data >>', result.data);
            if (result.data.success) {
                return result.data.data;
            } else {
                return thunkAPI.rejectWithValue({ error: result.data.errorMessage });
            }
        } catch (error) {
            console.log("error>>>", error)
            console.log('try catch [ GetReportDocsMore ] error.message>>', error.message);
            return thunkAPI.rejectWithValue({ error: error.message });
        }
    },
);

export const GetMonthlyShifts = createAsyncThunk(
    'GetMonthlyShifts',
    async (userdata, thunkAPI) => {
        console.log('GetMonthlyShifts userdata >>', userdata);
        try {
            let result = await axios({
                method: 'GET',
                baseURL: Config.BASE_URL,
                url: 'api/employee/shift',
                // headers: Authheader,
                params: userdata,
            });
            // console.log('GetMonthlyShifts result.data >>', result.data);
            if (result.data.success) {
                return result.data;
            } else {
                return thunkAPI.rejectWithValue({ error: result.data.errorMessage });
            }
        } catch (error) {
            console.log("error>>>", error)
            console.log('try catch [ GetMonthlyShifts ] error.message>>', error.message);
            return thunkAPI.rejectWithValue({ error: error.message });
        }
    },
);

export const CommonSlice = createSlice({
    name: 'CommonSlice',
    initialState: {
        UsersigninData: {},
        isSignin: false,
        isSigninFetching: false,

        UserAttendanceData: {},
        isAttendanceFetching: false,

        VerfiedUserData: {},
        isVerified: false,
        isVerifiedFetching: false,

        isForgotPassword: false,
        isForgotPasswordFetching: false,


        CategoryListData: [],
        isCategoryList: false,
        isCategoryListFetching: false,

        CreateExpensesData: {},
        isCreateExpenses: false,
        isCreateExpensesFetching: false,

        GetAttandanceListData: [],
        isGetAttandanceList: false,
        isGetAttandanceListFetching: false,

        GetExpenseListData: [],
        isGetExpenseList: false,
        isGetExpenseListFetching: false,

        GetInvoiceListData: [],
        isGetInvoiceList: false,
        isGetInvoiceListFetching: false,
        GetInvoiceListDataPageNumber: 2,
        GetInvoiceListDataTotalCount: "",
        isGetInvoiceListDataMoreFetching: false,

        ProfileUpdateData: {},
        isProfileUpdate: false,
        isProfileUpdateFetching: false,

        GetLeaveListData: {},
        isGetLeaveList: false,
        isGetLeaveListFetching: false,

        GetLeavetypeData: [],
        isGetLeavetype: false,
        isGetLeavetypeFetching: false,

        GetCalendarEventsData: [],
        isGetCalendarEventsData: false,
        isGetCalendarEventsDataFetching: false,
        GetCalendarEventsDataPageNumber: 2,
        GetCalendarEventsDataTotalCount: "",
        isGetCalendarEventsDataMoreFetching: false,

        GetAttendeesListData: [],
        isGetAttendeesListData: false,
        isGetAttendeesListDataFetching: false,
        GetAttendeesListDataPageNumber: 2,
        GetAttendeesListDataTotalCount: "",
        isGetAttendeesListDataMoreFetching: false,

        GetRemindersListData: [],
        isGetRemindersListData: false,
        isGetRemindersListDataFetching: false,

        GetApprovalListData: [],
        isGetApprovalList: false,
        isGetApprovalListFetching: false,
        GetApprovalListDataPageNumber: 2,
        GetApprovalListDataTotalCount: "",
        isGetApprovalListDataMoreFetching: false,

        GetApprovalCategoryListData: [],
        isGetApprovalCategoryList: false,
        isGetApprovalCategoryListFetching: false,

        GetMonthlyAttendanceReportData: [],
        isGetMonthlyAttendanceReport: false,
        isGetMonthlyAttendanceReportFetching: false,

        GetReportDocsData: [],
        isGetReportDocs: false,
        isGetReportDocsFetching: false,
        GetReportDocsDataPageNumber: 2,
        GetReportDocsDataTotalCount: "",
        isGetReportDocsDataMoreFetching: false,

        GetMonthlyShiftsData: [],
        isGetMonthlyShifts: false,
        isGetMonthlyShiftsFetching: false,

        isExpenseApproved: false,
        isExpenseApprovedFetching: false,

        isCreateLeave: false,
        isCreateLeaveFetching: false,

        isApproveAction: false,
        isApproveActionFetching: false,

        isCreateNewMeeting: false,
        isCreateNewMeetingFetching: false,

        isError: false,
        errorMessage: ""
    },
    reducers: {
        updateState: (state, { payload }) => {
            state.isSignin = payload.isSignin !== undefined ? payload.isSignin : state.isSignin;
            state.isGetCheckStatus = payload.isGetCheckStatus !== undefined ? payload.isGetCheckStatus : state.isGetCheckStatus;
            state.isCategoryList = payload.isCategoryList !== undefined ? payload.isCategoryList : state.isCategoryList;
            state.isCreateExpenses = payload.isCreateExpenses !== undefined ? payload.isCreateExpenses : state.isCreateExpenses;
            state.isVerified = payload.isVerified !== undefined ? payload.isVerified : state.isVerified
            state.isGetAttandanceList = payload.isGetAttandanceList !== undefined ? payload.isGetAttandanceList : state.isGetAttandanceList;
            state.isGetExpenseList = payload.isGetExpenseList !== undefined ? payload.isGetExpenseList : state.isGetExpenseList;

            state.isForgotPassword = payload.isForgotPassword !== undefined ? payload.isForgotPassword : state.isForgotPassword;
            state.isProfileUpdate = payload.isProfileUpdate !== undefined ? payload.isProfileUpdate : state.isProfileUpdate;

            state.isGetInvoiceList = payload.isGetInvoiceList !== undefined ? payload.isGetInvoiceList : state.isGetInvoiceList;
            state.isExpenseApproved = payload.isExpenseApproved !== undefined ? payload.isExpenseApproved : state.isExpenseApproved;

            state.isCreateLeave = payload.isCreateLeave !== undefined ? payload.isCreateLeave : state.isCreateLeave;

            state.isGetLeaveList = payload.isGetLeaveList !== undefined ? payload.isGetLeaveList : state.isGetLeaveList;
            state.isGetLeavetype = payload.isGetLeavetype !== undefined ? payload.isGetLeavetype : state.isGetLeavetype;

            state.isGetCalendarEventsData = payload.isGetCalendarEventsData !== undefined ? payload.isGetCalendarEventsData : state.isGetCalendarEventsData;
            state.isGetAttendeesListData = payload.isGetAttendeesListData !== undefined ? payload.isGetAttendeesListData : state.isGetAttendeesListData;
            state.isGetRemindersListData = payload.isGetRemindersListData !== undefined ? payload.isGetRemindersListData : state.isGetRemindersListData;


            state.isCreateNewMeeting = payload.isCreateNewMeeting !== undefined ? payload.isCreateNewMeeting : state.isCreateNewMeeting;
            state.isGetLeavetype = payload.isGetLeavetype !== undefined ? payload.isGetLeavetype : state.isGetLeavetype;

            state.isApproveAction = payload.isApproveAction !== undefined ? payload.isApproveAction : state.isApproveAction;
            state.isGetMonthlyAttendanceReport = payload.isGetMonthlyAttendanceReport !== undefined ? payload.isGetMonthlyAttendanceReport : state.isGetMonthlyAttendanceReport;
            state.isGetMonthlyPaySlip = payload.isGetMonthlyPaySlip !== undefined ? payload.isGetMonthlyPaySlip : state.isGetMonthlyPaySlip;
            state.isGetReportDocs = payload.isGetReportDocs !== undefined ? payload.isGetReportDocs : state.isGetReportDocs;
            state.isGetMonthlyShifts = payload.isGetMonthlyShifts !== undefined ? payload.isGetMonthlyShifts : state.isGetMonthlyShifts;

            state.isError = payload.isError !== undefined ? payload.isError : state.isError;
            state.errorMessage = payload.errorMessage !== undefined ? payload.errorMessage : state.errorMessage;
        },
    },
    extraReducers: builder => {
        //========= Usersignin
        builder.addCase(Usersignin.fulfilled, (state, { payload }) => {
            //console.log("[Usersignin.fulfilled]>>>payload>>>", payload)
            try {
                state.UsersigninData = payload;
                state.isSignin = true;
                state.isSigninFetching = false;
                state.isError = false;
                state.errorMessage = '';
                return state;
            } catch (error) {
                console.log('Error: Usersignin.fulfilled try catch error >>', error);
            }
        });
        builder.addCase(Usersignin.rejected, (state, { payload }) => {
            console.log("[Usersignin.rejected]>>>", payload)
            try {
                state.UsersigninData = {};
                state.isSignin = false;
                state.isSigninFetching = false;
                state.isError = true;
                payload
                    ? (state.errorMessage = payload.error?.message
                        ? payload.error?.message
                        : (payload.error || "Oops! It seems like either your username or password is incorrect")) : "Oops! It seems like either your username or password is incorrect";
            } catch (error) {
                console.log(
                    'Error: [Usersignin.rejected] try catch error >>',
                    error,
                );
            }
        });
        builder.addCase(Usersignin.pending, state => {
            state.isSigninFetching = true;
        });

        //===== UserVerification
        builder.addCase(UserVerification.fulfilled, (state, { payload }) => {
            //console.log("[UserVerification.fulfilled]>>>payload>>>", payload)
            try {
                state.VerfiedUserData = payload;
                state.isVerified = true;
                state.isVerifiedFetching = false;
                state.isError = false;
                state.errorMessage = '';
                return state;
            } catch (error) {
                console.log('Error: UserVerification.fulfilled try catch error >>', error);
            }
        });
        builder.addCase(UserVerification.rejected, (state, { payload }) => {
            console.log("[UserVerification.rejected]>>>", payload)
            try {
                state.VerfiedUserData = {};
                state.isVerified = false;
                state.isVerifiedFetching = false;
                state.isError = true;
                payload
                    ? (state.errorMessage = payload.error?.errorMessage
                        ? payload.error.errorMessage
                        : (payload.error || "Oops! It seems like either your verification code is incorrect")) : "Oops! It seems like either your verification code is incorrect";
            } catch (error) {
                console.log(
                    'Error: [UserVerification.rejected] try catch error >>',
                    error,
                );
            }
        });
        builder.addCase(UserVerification.pending, state => {
            state.isVerifiedFetching = true;
        });

        //==== UserAttendance
        builder.addCase(UserAttendance.fulfilled, (state, { payload }) => {
            //console.log("[UserAttendance.fulfilled]>>>payload>>>", payload)
            try {
                state.UserAttendanceData = payload;
                state.isAttendanceFetching = false;
                state.isError = false;
                state.errorMessage = '';
                return state;
            } catch (error) {
                console.log('Error: UserAttendance.fulfilled try catch error >>', error);
            }
        });
        builder.addCase(UserAttendance.rejected, (state, { payload }) => {
            console.log("[UserAttendance.rejected]>>>", payload)
            try {
                state.UserAttendanceData = {};
                state.isAttendanceFetching = false;
                state.isError = true;
                payload
                    ? (state.errorMessage = payload.error?.message
                        ? payload.error.message
                        : (payload.error || "Oops! It seems like either your verification code is incorrect")) : "Oops! It seems like either your verification code is incorrect";
            } catch (error) {
                console.log(
                    'Error: [UserVerification.rejected] try catch error >>',
                    error,
                );
            }
        });
        builder.addCase(UserAttendance.pending, state => {
            state.isAttendanceFetching = true;
        });

        //========= ProfileUpdate
        builder.addCase(ProfileUpdate.fulfilled, (state, { payload }) => {
            // console.log("[ProfileUpdate.fulfilled]>>>payload>>>", payload)
            try {
                state.ProfileUpdateData = payload;
                state.isProfileUpdate = true;
                state.isProfileUpdateFetching = false;
                state.isError = false;
                state.errorMessage = '';
                return state;
            } catch (error) {
                console.log('Error: ProfileUpdate.fulfilled try catch error >>', error);
            }
        });
        builder.addCase(ProfileUpdate.rejected, (state, { payload }) => {
            console.log("[ProfileUpdate.rejected]>>>", payload)
            try {
                state.ProfileUpdateData = {};
                state.isProfileUpdate = false;
                state.isProfileUpdateFetching = false;
                state.isError = true;
                payload
                    ? (state.errorMessage = payload.error?.message
                        ? payload.error?.message
                        : payload.error)
                    : (state.errorMessage = 'API Response Invalid. Please Check API');
            } catch (error) {
                console.log(
                    'Error: [ProfileUpdate.rejected] try catch error >>',
                    error,
                );
            }
        });
        builder.addCase(ProfileUpdate.pending, state => {
            state.isProfileUpdateFetching = true;
        });
        //========= ForgotPassword
        builder.addCase(ForgotPassword.fulfilled, (state, { payload }) => {
            // console.log("[ForgotPassword.fulfilled]>>>payload>>>", payload)
            try {
                state.isForgotPassword = true;
                state.isForgotPasswordFetching = false;
                state.isError = false;
                state.errorMessage = '';
                return state;
            } catch (error) {
                console.log('Error: ForgotPassword.fulfilled try catch error >>', error);
            }
        });
        builder.addCase(ForgotPassword.rejected, (state, { payload }) => {
            console.log("[ForgotPassword.rejected]>>>", payload)
            try {
                state.isForgotPassword = false;
                state.isForgotPasswordFetching = false;
                state.isError = true;
                payload
                    ? (state.errorMessage = payload.error?.message
                        ? payload.error?.message
                        : payload.error)
                    : (state.errorMessage = 'API Response Invalid. Please Check API');
            } catch (error) {
                console.log(
                    'Error: [ForgotPassword.rejected] try catch error >>',
                    error,
                );
            }
        });
        builder.addCase(ForgotPassword.pending, state => {
            state.isForgotPasswordFetching = true;
        });

        //========= CategoryList
        builder.addCase(CategoryList.fulfilled, (state, { payload }) => {
            // console.log("[CategoryList.fulfilled]>>>payload>>>", payload)
            try {
                state.CategoryListData = payload;
                state.isCategoryList = true;
                state.isCategoryListFetching = false;
                state.isError = false;
                state.errorMessage = '';
                return state;
            } catch (error) {
                console.log('Error: CategoryList.fulfilled try catch error >>', error);
            }
        });
        builder.addCase(CategoryList.rejected, (state, { payload }) => {
            console.log("[CategoryList.rejected]>>>", payload)
            try {
                state.CategoryListData = [];
                state.isCategoryList = false;
                state.isCategoryListFetching = false;
                state.isError = true;
                payload
                    ? (state.errorMessage = payload.error?.message
                        ? payload.error?.message
                        : payload.error)
                    : (state.errorMessage = 'API Response Invalid. Please Check API');
            } catch (error) {
                console.log(
                    'Error: [CategoryList.rejected] try catch error >>',
                    error,
                );
            }
        });
        builder.addCase(CategoryList.pending, state => {
            state.isCategoryListFetching = true;
        });
        //========= CategoryList
        builder.addCase(CreateExpenses.fulfilled, (state, { payload }) => {
            // console.log("[CreateExpenses.fulfilled]>>>payload>>>", payload)
            try {
                state.CreateExpensesData = payload;
                state.isCreateExpenses = true;
                state.isCreateExpensesFetching = false;
                state.isError = false;
                state.errorMessage = '';
                return state;
            } catch (error) {
                console.log('Error: CreateExpenses.fulfilled try catch error >>', error);
            }
        });
        builder.addCase(CreateExpenses.rejected, (state, { payload }) => {
            console.log("[CreateExpenses.rejected]>>>", payload)
            try {
                state.CreateExpensesData = {};
                state.isCreateExpenses = false;
                state.isCreateExpensesFetching = false;
                state.isError = true;
                payload
                    ? (state.errorMessage = payload.error?.message
                        ? payload.error?.message
                        : payload.error)
                    : (state.errorMessage = 'API Response Invalid. Please Check API');
            } catch (error) {
                console.log(
                    'Error: [CreateExpenses.rejected] try catch error >>',
                    error,
                );
            }
        });
        builder.addCase(CreateExpenses.pending, state => {
            state.isCreateExpensesFetching = true;
        });
        //========= GetAttandanceList
        builder.addCase(GetAttandanceList.fulfilled, (state, { payload }) => {
            // console.log("[GetAttandanceList.fulfilled]>>>payload>>>", payload)
            try {
                state.GetAttandanceListData = payload;
                state.isGetAttandanceList = true;
                state.isGetAttandanceListFetching = false;
                state.isError = false;
                state.errorMessage = '';
                return state;
            } catch (error) {
                console.log('Error: GetAttandanceList.fulfilled try catch error >>', error);
            }
        });
        builder.addCase(GetAttandanceList.rejected, (state, { payload }) => {
            console.log("[GetAttandanceList.rejected]>>>", payload)
            try {
                state.GetAttandanceListData = [];
                state.isGetAttandanceList = false;
                state.isGetAttandanceListFetching = false;
                state.isError = true;
                payload
                    ? (state.errorMessage = payload.error?.message
                        ? payload.error?.message
                        : payload.error)
                    : (state.errorMessage = 'API Response Invalid. Please Check API');
            } catch (error) {
                console.log(
                    'Error: [GetAttandanceList.rejected] try catch error >>',
                    error,
                );
            }
        });
        builder.addCase(GetAttandanceList.pending, state => {
            state.isGetAttandanceListFetching = true;
        });
        //========= GetExpenseList
        builder.addCase(GetExpenseList.fulfilled, (state, { payload }) => {
            // console.log("[GetExpenseList.fulfilled]>>>payload>>>", payload)
            try {
                state.GetExpenseListData = payload;
                state.isGetExpenseList = true;
                state.isGetExpenseListFetching = false;
                state.isError = false;
                state.errorMessage = '';
                return state;
            } catch (error) {
                console.log('Error: GetExpenseList.fulfilled try catch error >>', error);
            }
        });
        builder.addCase(GetExpenseList.rejected, (state, { payload }) => {
            console.log("[GetExpenseList.rejected]>>>", payload)
            try {
                state.GetExpenseListData = [];
                state.isGetExpenseList = false;
                state.isGetExpenseListFetching = false;
                state.isError = true;
                payload
                    ? (state.errorMessage = payload.error?.message
                        ? payload.error?.message
                        : payload.error)
                    : (state.errorMessage = 'API Response Invalid. Please Check API');
            } catch (error) {
                console.log(
                    'Error: [GetExpenseList.rejected] try catch error >>',
                    error,
                );
            }
        });
        builder.addCase(GetExpenseList.pending, state => {
            state.isGetExpenseListFetching = true;
        });
        //========= GetInvoiceList
        builder.addCase(GetInvoiceList.fulfilled, (state, { payload }) => {
            // console.log("[GetInvoiceList.fulfilled]>>>payload>>>", payload)
            try {
                state.GetInvoiceListData = payload.invoice_data;
                state.GetInvoiceListDataTotalCount = payload.total_invoices;
                state.isGetInvoiceList = true;
                state.isGetInvoiceListFetching = false;
                state.isError = false;
                state.errorMessage = '';
                return state;
            } catch (error) {
                console.log('Error: GetInvoiceList.fulfilled try catch error >>', error);
            }
        });
        builder.addCase(GetInvoiceList.rejected, (state, { payload }) => {
            console.log("[GetInvoiceList.rejected]>>>", payload)
            try {
                state.GetInvoiceListData = [];
                state.GetInvoiceListDataTotalCount = "";
                state.isGetInvoiceList = false;
                state.isGetInvoiceListFetching = false;
                state.isError = true;
                payload
                    ? (state.errorMessage = payload.error?.message
                        ? payload.error?.message
                        : payload.error)
                    : (state.errorMessage = 'API Response Invalid. Please Check API');
            } catch (error) {
                console.log(
                    'Error: [GetInvoiceList.rejected] try catch error >>',
                    error,
                );
            }
        });
        builder.addCase(GetInvoiceList.pending, state => {
            state.isGetInvoiceListFetching = true;
        });
        //====== GetInvoiceListMore
        builder.addCase(GetInvoiceListMore.fulfilled, (state, { payload }) => {
            // console.log("[GetInvoiceListMore.fulfilled]>>>payload>>>", payload)
            try {
                state.GetInvoiceListData = [...state.GetInvoiceListData, ...payload.invoice_data];
                state.GetInvoiceListDataPageNumber = state.GetInvoiceListDataPageNumber + 1;
                state.isGetInvoiceListDataMoreFetching = false;
                state.isError = false;
                state.errorMessage = '';
                return state;
            } catch (error) {
                console.log('Error: GetInvoiceListMore.fulfilled try catch error >>', error);
            }
        });
        builder.addCase(GetInvoiceListMore.rejected, (state, { payload }) => {
            console.log("[GetInvoiceListMore.rejected]>>>", payload)
            try {
                state.GetInvoiceListData = state.GetInvoiceListData;
                state.GetInvoiceListDataPageNumber = state.GetInvoiceListDataPageNumber;
                state.isGetInvoiceListDataMoreFetching = false;
                state.isError = true;
                payload
                    ? (state.errorMessage = payload.error.errorMessage
                        ? payload.error.errorMessage
                        : payload.error)
                    : (state.errorMessage = 'API Response Invalid. Please Check API');
            } catch (error) {
                console.log(
                    'Error: [GetInvoiceListMore.rejected] try catch error >>',
                    error,
                );
            }
        });
        builder.addCase(GetInvoiceListMore.pending, state => {
            state.isGetInvoiceListDataMoreFetching = true;
        })

        //===== Expense Approve
        builder.addCase(ExpenseApprove.fulfilled, (state, { payload }) => {
            // console.log("[ExpenseApprove.fulfilled]>>>payload>>>", payload)
            try {
                state.isExpenseApproved = true;
                state.isExpenseApprovedFetching = false;
                state.isError = false;
                state.errorMessage = '';
                return state;
            } catch (error) {
                console.log('Error: ExpenseApprove.fulfilled try catch error >>', error);
            }
        });
        builder.addCase(ExpenseApprove.rejected, (state, { payload }) => {
            console.log("[ExpenseApprove.rejected]>>>", payload)
            try {
                state.isExpenseApproved = false;
                state.isExpenseApprovedFetching = false;
                state.isError = true;
                payload
                    ? (state.errorMessage = payload.error?.message
                        ? payload.error?.message
                        : payload.error)
                    : (state.errorMessage = 'API Response Invalid. Please Check API');
            } catch (error) {
                console.log(
                    'Error: [ExpenseApprove.rejected] try catch error >>',
                    error,
                );
            }
        });
        builder.addCase(ExpenseApprove.pending, state => {
            state.isExpenseApprovedFetching = true;
        });

        //==== GetLeaveList
        builder.addCase(GetLeaveList.fulfilled, (state, { payload }) => {
            // console.log("[GetLeaveList.fulfilled]>>>payload>>>", payload)
            try {
                state.GetLeaveListData = payload;
                state.isGetLeaveList = true;
                state.isGetLeaveListFetching = false;
                state.isError = false;
                state.errorMessage = '';
                return state;
            } catch (error) {
                console.log('Error: GetLeaveList.fulfilled try catch error >>', error);
            }
        });
        builder.addCase(GetLeaveList.rejected, (state, { payload }) => {
            console.log("[GetLeaveList.rejected]>>>", payload)
            try {
                state.GetLeaveListData = {};
                state.isGetLeaveList = false;
                state.isGetLeaveListFetching = false;
                state.isError = true;
                payload
                    ? (state.errorMessage = payload.error?.message
                        ? payload.error?.message
                        : payload.error)
                    : (state.errorMessage = 'API Response Invalid. Please Check API');
            } catch (error) {
                console.log(
                    'Error: [GetLeaveList.rejected] try catch error >>',
                    error,
                );
            }
        });
        builder.addCase(GetLeaveList.pending, state => {
            state.isGetLeaveListFetching = true;
        });

        //====== GetLeavetype
        builder.addCase(GetLeavetype.fulfilled, (state, { payload }) => {
            // console.log("[GetLeavetype.fulfilled]>>>payload>>>", payload)
            try {
                state.GetLeavetypeData = [{ "display_name": "All", value: 0, }, ...payload];
                state.isGetLeavetype = true;
                state.isGetLeavetypeFetching = false;
                state.isError = false;
                state.errorMessage = '';
                return state;
            } catch (error) {
                console.log('Error: GetLeavetype.fulfilled try catch error >>', error);
            }
        });
        builder.addCase(GetLeavetype.rejected, (state, { payload }) => {
            console.log("[GetLeavetype.rejected]>>>", payload)
            try {
                state.GetLeavetypeData = [];
                state.isGetLeavetype = false;
                state.isGetLeavetypeFetching = false;
                state.isError = true;
                payload
                    ? (state.errorMessage = payload.error?.message
                        ? payload.error?.message
                        : payload.error)
                    : (state.errorMessage = 'API Response Invalid. Please Check API');
            } catch (error) {
                console.log(
                    'Error: [GetLeavetype.rejected] try catch error >>',
                    error,
                );
            }
        });
        builder.addCase(GetLeavetype.pending, state => {
            state.isGetLeavetypeFetching = true;
        });

        //===== Create Leave
        builder.addCase(CreateLeave.fulfilled, (state, { payload }) => {
            // console.log("[CreateLeave.fulfilled]>>>payload>>>", payload)
            try {
                state.isCreateLeave = true;
                state.isCreateLeaveFetching = false;
                state.isError = false;
                state.errorMessage = '';
                return state;
            } catch (error) {
                console.log('Error: CreateLeave.fulfilled try catch error >>', error);
            }
        });
        builder.addCase(CreateLeave.rejected, (state, { payload }) => {
            console.log("[CreateLeave.rejected]>>>", payload)
            try {
                state.isCreateLeave = false;
                state.isCreateLeaveFetching = false;
                state.isError = true;
                payload
                    ? (state.errorMessage = payload.error?.message
                        ? payload.error?.message
                        : payload.error)
                    : (state.errorMessage = 'API Response Invalid. Please Check API');
            } catch (error) {
                console.log(
                    'Error: [CreateLeave.rejected] try catch error >>',
                    error,
                );
            }
        });
        builder.addCase(CreateLeave.pending, state => {
            state.isCreateLeaveFetching = true;
        });

        //=== GetCalendarEvents
        builder.addCase(GetCalendarEvents.fulfilled, (state, { payload }) => {
            // console.log("[GetCalendarEvents.fulfilled]>>>payload>>>", payload)
            try {
                state.GetCalendarEventsData = payload.events;
                state.GetCalendarEventsDataTotalCount = payload.total_events;
                state.isGetCalendarEventsData = true;
                state.isGetCalendarEventsDataFetching = false;
                state.isError = false;
                state.errorMessage = '';
                return state;
            } catch (error) {
                console.log('Error: GetCalendarEvents.fulfilled try catch error >>', error);
            }
        });
        builder.addCase(GetCalendarEvents.rejected, (state, { payload }) => {
            console.log("[GetCalendarEvents.rejected]>>>", payload)
            try {
                state.GetCalendarEventsData = [];
                state.GetCalendarEventsDataTotalCount = "";
                state.isGetCalendarEventsData = false;
                state.isGetCalendarEventsDataFetching = false;
                state.isError = true;
                payload
                    ? (state.errorMessage = payload.error?.message
                        ? payload.error?.message
                        : payload.error)
                    : (state.errorMessage = 'API Response Invalid. Please Check API');
            } catch (error) {
                console.log(
                    'Error: [GetCalendarEvents.rejected] try catch error >>',
                    error,
                );
            }
        });
        builder.addCase(GetCalendarEvents.pending, state => {
            state.isGetCalendarEventsDataFetching = true;
        });
        builder.addCase(GetCalendarEventsMore.fulfilled, (state, { payload }) => {
            // console.log("[GetCalendarEventsMore.fulfilled]>>>payload>>>", payload)
            try {
                state.GetCalendarEventsData = [...state.GetCalendarEventsData, ...payload.events];
                state.GetCalendarEventsDataPageNumber = state.GetCalendarEventsDataPageNumber + 1;
                state.isGetCalendarEventsDataMoreFetching = false;
                state.isError = false;
                state.errorMessage = '';
                return state;
            } catch (error) {
                console.log('Error: GetCalendarEventsMore.fulfilled try catch error >>', error);
            }
        });
        builder.addCase(GetCalendarEventsMore.rejected, (state, { payload }) => {
            console.log("[GetCalendarEventsMore.rejected]>>>", payload)
            try {
                state.GetCalendarEventsData = state.GetCalendarEventsData;
                state.GetCalendarEventsDataPageNumber = state.GetCalendarEventsDataPageNumber;
                state.isGetCalendarEventsDataMoreFetching = false;
                state.isError = true;
                payload
                    ? (state.errorMessage = payload.error.errorMessage
                        ? payload.error.errorMessage
                        : payload.error)
                    : (state.errorMessage = 'API Response Invalid. Please Check API');
            } catch (error) {
                console.log(
                    'Error: [GetCalendarEventsMore.rejected] try catch error >>',
                    error,
                );
            }
        });
        builder.addCase(GetCalendarEventsMore.pending, state => {
            state.isGetCalendarEventsDataMoreFetching = true;
        });

        //===== GetAttendeesList
        builder.addCase(GetAttendeesList.fulfilled, (state, { payload }) => {
            // console.log("[GetAttendeesList.fulfilled]>>>payload>>>", payload)
            try {
                state.GetAttendeesListData = payload.partners;
                state.GetAttendeesListDataTotalCount = payload.total;
                state.isGetAttendeesListData = true;
                state.isGetAttendeesListDataFetching = false;
                state.isError = false;
                state.errorMessage = '';
                return state;
            } catch (error) {
                console.log('Error: GetAttendeesList.fulfilled try catch error >>', error);
            }
        });
        builder.addCase(GetAttendeesList.rejected, (state, { payload }) => {
            console.log("[GetAttendeesList.rejected]>>>", payload)
            try {
                state.GetAttendeesListData = [];
                state.GetAttendeesListDataTotalCount = "";
                state.isGetAttendeesListData = false;
                state.isGetAttendeesListDataFetching = false;
                state.isError = true;
                payload
                    ? (state.errorMessage = payload.error?.message
                        ? payload.error?.message
                        : payload.error)
                    : (state.errorMessage = 'API Response Invalid. Please Check API');
            } catch (error) {
                console.log(
                    'Error: [GetAttendeesList.rejected] try catch error >>',
                    error,
                );
            }
        });
        builder.addCase(GetAttendeesList.pending, state => {
            state.isGetAttendeesListDataFetching = true;
        });
        builder.addCase(GetAttendeesListMore.fulfilled, (state, { payload }) => {
            // console.log("[GetAttendeesListMore.fulfilled]>>>payload>>>", payload)
            try {
                state.GetAttendeesListData = [...state.GetAttendeesListData, ...payload.partners];
                state.GetAttendeesListDataPageNumber = state.GetAttendeesListDataPageNumber + 1;
                state.isGetAttendeesListDataMoreFetching = false;
                state.isError = false;
                state.errorMessage = '';
                return state;
            } catch (error) {
                console.log('Error: GetAttendeesListMore.fulfilled try catch error >>', error);
            }
        });
        builder.addCase(GetAttendeesListMore.rejected, (state, { payload }) => {
            console.log("[GetAttendeesListMore.rejected]>>>", payload)
            try {
                state.GetCalendarEventsData = state.GetCalendarEventsData;
                state.GetAttendeesListDataPageNumber = state.GetAttendeesListDataPageNumber;
                state.isGetAttendeesListDataMoreFetching = false;
                state.isError = true;
                payload
                    ? (state.errorMessage = payload.error.errorMessage
                        ? payload.error.errorMessage
                        : payload.error)
                    : (state.errorMessage = 'API Response Invalid. Please Check API');
            } catch (error) {
                console.log(
                    'Error: [GetAttendeesListMore.rejected] try catch error >>',
                    error,
                );
            }
        });
        builder.addCase(GetAttendeesListMore.pending, state => {
            state.isGetAttendeesListDataMoreFetching = true;
        });

        builder.addCase(GetRemindersList.fulfilled, (state, { payload }) => {
            // console.log("[GetRemindersList.fulfilled]>>>payload>>>", payload)
            try {
                state.GetRemindersListData = payload;
                state.isGetRemindersListData = true;
                state.isGetRemindersListDataFetching = false;
                state.isError = false;
                state.errorMessage = '';
                return state;
            } catch (error) {
                console.log('Error: GetRemindersList.fulfilled try catch error >>', error);
            }
        });
        builder.addCase(GetRemindersList.rejected, (state, { payload }) => {
            console.log("[GetRemindersList.rejected]>>>", payload)
            try {
                state.GetRemindersListData = [];
                state.isGetRemindersListData = false;
                state.isGetRemindersListDataFetching = false;
                state.isError = true;
                payload
                    ? (state.errorMessage = payload.error?.message
                        ? payload.error?.message
                        : payload.error)
                    : (state.errorMessage = 'API Response Invalid. Please Check API');
            } catch (error) {
                console.log(
                    'Error: [GetRemindersList.rejected] try catch error >>',
                    error,
                );
            }
        });
        builder.addCase(GetRemindersList.pending, state => {
            state.isGetRemindersListDataFetching = true;
        });
        //==== create new meeting
        builder.addCase(CreateNewMeeting.fulfilled, (state, { payload }) => {
            // console.log("[CreateNewMeeting.fulfilled]>>>payload>>>", payload)
            try {
                state.isCreateNewMeeting = true;
                state.isCreateNewMeetingFetching = false;
                state.isError = false;
                state.errorMessage = '';
                return state;
            } catch (error) {
                console.log('Error: CreateNewMeeting.fulfilled try catch error >>', error);
            }
        });
        builder.addCase(CreateNewMeeting.rejected, (state, { payload }) => {
            console.log("[CreateNewMeeting.rejected]>>>", payload)
            try {
                state.isCreateNewMeeting = false;
                state.isCreateNewMeetingFetching = false;
                state.isError = true;
                payload
                    ? (state.errorMessage = payload.error?.message
                        ? payload.error?.message
                        : payload.error)
                    : (state.errorMessage = 'API Response Invalid. Please Check API');
            } catch (error) {
                console.log(
                    'Error: [CreateNewMeeting.rejected] try catch error >>',
                    error,
                );
            }
        });
        builder.addCase(CreateNewMeeting.pending, state => {
            state.isCreateNewMeetingFetching = true;
        });


        //==== approvals list
        builder.addCase(ApprovalList.fulfilled, (state, { payload }) => {
            // console.log("[ApprovalList.fulfilled]>>>payload>>>", payload)
            try {
                state.GetApprovalListData = payload.approvals;
                state.GetApprovalListDataTotalCount = payload.total_record;
                state.isGetApprovalList = true;
                state.isGetApprovalListFetching = false;
                state.isError = false;
                state.errorMessage = '';
                return state;
            } catch (error) {
                console.log('Error: ApprovalList.fulfilled try catch error >>', error);
            }
        });
        builder.addCase(ApprovalList.rejected, (state, { payload }) => {
            console.log("[ApprovalList.rejected]>>>", payload)
            try {
                state.GetApprovalListData = [];
                state.GetApprovalListDataTotalCount = "";
                state.isGetApprovalList = false;
                state.isGetApprovalListFetching = false;
                state.isError = true;
                payload
                    ? (state.errorMessage = payload.error?.message
                        ? payload.error?.message
                        : payload.error)
                    : (state.errorMessage = 'API Response Invalid. Please Check API');
            } catch (error) {
                console.log(
                    'Error: [ApprovalList.rejected] try catch error >>',
                    error,
                );
            }
        });
        builder.addCase(ApprovalList.pending, state => {
            state.isGetApprovalListFetching = true;
        });
        builder.addCase(ApprovalListMore.fulfilled, (state, { payload }) => {
            // console.log("[ApprovalListMore.fulfilled]>>>payload>>>", payload)
            try {
                state.GetApprovalListData = [...state.GetApprovalListData, ...payload.approvals];
                state.GetApprovalListDataPageNumber = state.GetApprovalListDataPageNumber + 1;
                state.isGetApprovalListDataMoreFetching = false;
                state.isError = false;
                state.errorMessage = '';
                return state;
            } catch (error) {
                console.log('Error: ApprovalListMore.fulfilled try catch error >>', error);
            }
        });
        builder.addCase(ApprovalListMore.rejected, (state, { payload }) => {
            console.log("[ApprovalListMore.rejected]>>>", payload)
            try {
                state.GetApprovalListData = state.GetApprovalListData;
                state.GetApprovalListDataPageNumber = state.GetApprovalListDataPageNumber;
                state.isGetApprovalListDataMoreFetching = false;
                state.isError = true;
                payload
                    ? (state.errorMessage = payload.error.errorMessage
                        ? payload.error.errorMessage
                        : payload.error)
                    : (state.errorMessage = 'API Response Invalid. Please Check API');
            } catch (error) {
                console.log(
                    'Error: [ApprovalListMore.rejected] try catch error >>',
                    error,
                );
            }
        });
        builder.addCase(ApprovalListMore.pending, state => {
            state.isGetApprovalListDataMoreFetching = true;
        });

        //==== approvals actions
        builder.addCase(ApproveAction.fulfilled, (state, { payload }) => {
            // console.log("[ApproveAction.fulfilled]>>>payload>>>", payload)
            try {
                state.isApproveAction = true;
                state.isApproveActionFetching = false;
                state.isError = false;
                state.errorMessage = '';
                return state;
            } catch (error) {
                console.log('Error: ApproveAction.fulfilled try catch error >>', error);
            }
        });
        builder.addCase(ApproveAction.rejected, (state, { payload }) => {
            console.log("[ApproveAction.rejected]>>>", payload)
            try {
                state.isApproveAction = false;
                state.isApproveActionFetching = false;
                state.isError = true;
                payload
                    ? (state.errorMessage = payload.error?.message
                        ? payload.error?.message
                        : payload.error)
                    : (state.errorMessage = 'API Response Invalid. Please Check API');
            } catch (error) {
                console.log(
                    'Error: [ApproveAction.rejected] try catch error >>',
                    error,
                );
            }
        });
        builder.addCase(ApproveAction.pending, state => {
            state.isApproveActionFetching = true;
        });

        //==== approval category list
        builder.addCase(ApprovalCategory.fulfilled, (state, { payload }) => {
            // console.log("[ApprovalCategory.fulfilled]>>>payload>>>", payload)
            try {
                state.GetApprovalCategoryListData = payload.approvals;
                state.isGetApprovalCategoryList = true;
                state.isGetApprovalCategoryListFetching = false;
                state.isError = false;
                state.errorMessage = '';
                return state;
            } catch (error) {
                console.log('Error: ApprovalCategory.fulfilled try catch error >>', error);
            }
        });
        builder.addCase(ApprovalCategory.rejected, (state, { payload }) => {
            console.log("[ApprovalCategory.rejected]>>>", payload)
            try {
                state.GetApprovalCategoryListData = [];
                state.isGetApprovalCategoryList = false;
                state.isGetApprovalCategoryListFetching = false;
                state.isError = true;
                payload
                    ? (state.errorMessage = payload.error?.message
                        ? payload.error?.message
                        : payload.error)
                    : (state.errorMessage = 'API Response Invalid. Please Check API');
            } catch (error) {
                console.log(
                    'Error: [ApprovalCategory.rejected] try catch error >>',
                    error,
                );
            }
        });
        builder.addCase(ApprovalCategory.pending, state => {
            state.isGetApprovalCategoryListFetching = true;
        });

        builder.addCase(GetMonthlyAttendanceReport.fulfilled, (state, { payload }) => {
            // console.log("[GetMonthlyAttendanceReport.fulfilled]>>>payload>>>", payload)
            try {
                state.GetMonthlyAttendanceReportData = payload;
                state.isGetMonthlyAttendanceReport = true;
                state.isGetMonthlyAttendanceReportFetching = false;
                state.isError = false;
                state.errorMessage = '';
                return state;
            } catch (error) {
                console.log('Error: GetMonthlyAttendanceReport.fulfilled try catch error >>', error);
            }
        });
        builder.addCase(GetMonthlyAttendanceReport.rejected, (state, { payload }) => {
            console.log("[GetMonthlyAttendanceReport.rejected]>>>", payload)
            try {
                state.GetMonthlyAttendanceReportData = [];
                state.isGetMonthlyAttendanceReport = false;
                state.isGetMonthlyAttendanceReportFetching = false;
                state.isError = true;
                payload
                    ? (state.errorMessage = payload.error?.message
                        ? payload.error?.message
                        : payload.error)
                    : (state.errorMessage = 'API Response Invalid. Please Check API');
            } catch (error) {
                console.log(
                    'Error: [GetMonthlyAttendanceReport.rejected] try catch error >>',
                    error,
                );
            }
        });
        builder.addCase(GetMonthlyAttendanceReport.pending, state => {
            state.isGetMonthlyAttendanceReportFetching = true;
        });

        // get report documents
        builder.addCase(GetReportDocs.fulfilled, (state, { payload }) => {
            console.log("[GetReportDocs.fulfilled]>>>payload>>>", payload)
            try {
                state.GetReportDocsData = payload.documents;
                state.GetReportDocsDataTotalCount = payload.total_reports;
                state.isGetReportDocs = true;
                state.isGetReportDocsFetching = false;
                state.isError = false;
                state.errorMessage = '';
                return state;
            } catch (error) {
                console.log('Error: GetReportDocs.fulfilled try catch error >>', error);
            }
        });
        builder.addCase(GetReportDocs.rejected, (state, { payload }) => {
            console.log("[GetReportDocs.rejected]>>>", payload)
            try {
                state.GetReportDocsData = [];
                state.GetReportDocsDataTotalCount = "";
                state.isGetReportDocs = false;
                state.isGetReportDocsFetching = false;
                state.isError = true;
                payload
                    ? (state.errorMessage = payload.error?.message
                        ? payload.error?.message
                        : payload.error)
                    : (state.errorMessage = 'API Response Invalid. Please Check API');
            } catch (error) {
                console.log(
                    'Error: [GetReportDocs.rejected] try catch error >>',
                    error,
                );
            }
        });
        builder.addCase(GetReportDocs.pending, state => {
            state.isGetReportDocsFetching = true;
        });
        builder.addCase(GetReportDocsMore.fulfilled, (state, { payload }) => {
            // console.log("[GetReportDocsMore.fulfilled]>>>payload>>>", payload)
            try {
                state.GetReportDocsData = [...state.GetReportDocsData, ...payload.documents];
                state.GetReportDocsDataPageNumber = state.GetReportDocsDataPageNumber + 1;
                state.isGetReportDocsDataMoreFetching = false;
                state.isError = false;
                state.errorMessage = '';
                return state;
            } catch (error) {
                console.log('Error: GetReportDocsMore.fulfilled try catch error >>', error);
            }
        });
        builder.addCase(GetReportDocsMore.rejected, (state, { payload }) => {
            console.log("[GetReportDocsMore.rejected]>>>", payload)
            try {
                state.GetReportDocsData = state.GetReportDocsData;
                state.GetReportDocsDataPageNumber = state.GetReportDocsDataPageNumber;
                state.isGetReportDocsDataMoreFetching = false;
                state.isError = true;
                payload
                    ? (state.errorMessage = payload.error.errorMessage
                        ? payload.error.errorMessage
                        : payload.error)
                    : (state.errorMessage = 'API Response Invalid. Please Check API');
            } catch (error) {
                console.log(
                    'Error: [GetReportDocsMore.rejected] try catch error >>',
                    error,
                );
            }
        });
        builder.addCase(GetReportDocsMore.pending, state => {
            state.isGetReportDocsDataMoreFetching = true;
        });


        builder.addCase(GetMonthlyShifts.fulfilled, (state, { payload }) => {
            // console.log("[GetMonthlyShifts.fulfilled]>>>payload>>>", payload)
            try {
                state.GetMonthlyShiftsData = payload.data.shifts_this_month;
                state.isGetMonthlyShifts = true;
                state.isGetMonthlyShiftsFetching = false;
                state.isError = false;
                state.errorMessage = '';
                return state;
            } catch (error) {
                console.log('Error: GetMonthlyShifts.fulfilled try catch error >>', error);
            }
        });
        builder.addCase(GetMonthlyShifts.rejected, (state, { payload }) => {
            console.log("[GetMonthlyShifts.rejected]>>>", payload)
            try {
                state.GetMonthlyShiftsData = [];
                state.isGetMonthlyShifts = false;
                state.isGetMonthlyShiftsFetching = false;
                state.isError = true;
                payload
                    ? (state.errorMessage = payload.error?.message
                        ? payload.error?.message
                        : payload.error)
                    : (state.errorMessage = 'API Response Invalid. Please Check API');
            } catch (error) {
                console.log(
                    'Error: [GetMonthlyShifts.rejected] try catch error >>',
                    error,
                );
            }
        });
        builder.addCase(GetMonthlyShifts.pending, state => {
            state.isGetMonthlyShiftsFetching = true;
        });
    }
});
export const { updateState } = CommonSlice.actions;
export const { clearState } = CommonSlice.actions;
export const CommonSelector = state => state.main.Common;

