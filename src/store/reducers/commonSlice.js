import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import Config from 'react-native-config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from './apiInstance'
import APIS_ENDPOINTS from './apiEndPoints'

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
            const response = await API.post(APIS_ENDPOINTS.AUTH_TOKEN, payload);
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
                error?.response?.data?.message
            );
        }
    }
);
export const GetUserDetails = createAsyncThunk(
    'GetUserDetails',
    async (userdata, thunkAPI) => {
        try {
            const result = await API.get(APIS_ENDPOINTS.USER_DETAILS(userdata.id));
            if (result.data.status === 'error') {
                return thunkAPI.rejectWithValue({
                    error: errorMassage(result?.data?.message),
                });
            }
            return result.data.data[0];
        } catch (error) {
            return thunkAPI.rejectWithValue({
                error: errorMassage(error.response?.data?.message || error.message),
            });
        }
    }
);


export const Usersignin = createAsyncThunk(
    'Usersignin',
    async (userdata, thunkAPI) => {
        try {
            const result = await API.post(APIS_ENDPOINTS.LOGIN, {
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
            let result = await API.post(APIS_ENDPOINTS.DEVICE_REGISTER, payload);
            if (result.data.success) {
                return { ...result.data.data, message: result.data?.successMessage };
            } else {
                return thunkAPI.rejectWithValue({ error: errorMassage(result?.data?.errorMessage) });
            }
        } catch (error) {
            if (error.message) {
                const errorMessage = error?.response?.data?.message || error?.message;
                return thunkAPI.rejectWithValue({ error: errorMassage(errorMessage) });
            }
        }
    },
);

export const UserAttendance = createAsyncThunk(
    'UserAttendance',
    async (userdata, thunkAPI) => {
        try {
            let result = await API.post(APIS_ENDPOINTS.ATTENDANCE, userdata)
            if (result.data.success) {
                return { ...result.data.data, message: result?.data.successMessage, action: result?.data?.action };
            } else {
                return thunkAPI.rejectWithValue({ error: errorMassage(error.response?.data?.errorMessage || error.message) });
            }
        } catch (error) {
            return thunkAPI.rejectWithValue({
                error: errorMassage(error.response?.data?.errorMessage || error.message)
            });
        }
    },
);

export const UserAttendanceRegularization = createAsyncThunk(
    'UserAttendanceRegularization',
    async (userdata, thunkAPI) => {
        try {
            const result = await API.post(
                 APIS_ENDPOINTS.REGULARIZATION(userdata.id),
                userdata.data
            );
            return result.data;
        } catch (error) {
            return thunkAPI.rejectWithValue({ error: error.response?.data?.message });
        }
    }
);

export const UserAttendanceRegcategories = createAsyncThunk(
    'UserAttendanceRegcategories',
    async (userdata, thunkAPI) => {
        try {
            let result = await API.get(APIS_ENDPOINTS.REG_CATEGORIES(userdata.id));
            if (result.data.status === 'success') {
                return result.data.data
            } else {
                return thunkAPI.rejectWithValue({ error: errorMassage(result?.data?.errorMessage) });
            }
        } catch (error) {
            console.log("Error >>>", error.response?.data || error.message);
            return error;
        }
    },
);

export const GetAttandanceList = createAsyncThunk(
    'GetAttandanceList',
    async (userdata, thunkAPI) => {
        try {
            let result = await API.get(APIS_ENDPOINTS.ATTENDANCE_LIST(userdata));
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

export const CheckAttandanceStatus = createAsyncThunk(
    'CheckAttandanceStatus',
    async (userdata, thunkAPI) => {
        try {
            const result = await API.get(APIS_ENDPOINTS.CHECK_ATTENDANCE_STATUS(userdata.email));
            if (result.data?.success === false) {
                return thunkAPI.rejectWithValue({
                    error: errorMassage(result.data.errorMessage || 'Something went wrong'),
                });
            }

            return result.data;

        } catch (error) {
            return thunkAPI.rejectWithValue({
                error: errorMassage(
                    error.response?.data?.errorMessage ||
                    error.response?.data?.message ||
                    error.message
                ),
            });
        }
    }
);



//==== Get Leave Type 
export const GetLeavetype = createAsyncThunk(
    'GetLeavetype',
    async (userdata, thunkAPI) => {
        try {
            let result = await API.get(APIS_ENDPOINTS.LEAVE_TYPE(userdata.id));
            if (result.data.status === "error") {
                return thunkAPI.rejectWithValue({
                    error: errorMassage(result.data.message)
                });
            }
            return result.data.data;
        } catch (error) {
            console.log("Axios Error:", error);
            return thunkAPI.rejectWithValue({
                error: errorMassage(error?.response?.data?.message || error.message)
            });
        }
    },
);

export const GetLeaveAllocation = createAsyncThunk(
    'GetLeaveAllocation',
    async (userdata, thunkAPI) => {
        try {
            const result = await API.get(APIS_ENDPOINTS.LEAVE_ALLOCATION(userdata.id));
            if (result.data.success) {
                return result.data.cards;
            }
            return;

        } catch (error) {
            console.log("Axios Error:", error.response);
            return;
        }
    }
);


export const GetDepartmentType = createAsyncThunk(
    'GetDepartmentType',
    async (userdata, thunkAPI) => {
        try {
            let result = await API.get(APIS_ENDPOINTS.DEPARTMENT_LIST(userdata.id));
            if (result.data.status === "error") {
                return thunkAPI.rejectWithValue({
                    error: errorMassage(result.data.message)
                });
            }
            return result.data.data;
        } catch (error) {
            console.log("Axios Error:", error);
            return thunkAPI.rejectWithValue({
                error: errorMassage(error.response?.data?.message || error.message)
            });
        }
    },
);
export const CreateLeave = createAsyncThunk(
    'CreateLeave',
    async (userdata, thunkAPI) => {
        try {
            const result = await API.post(
                APIS_ENDPOINTS.CREATE_LEAVE(userdata.userid),
                userdata.userData
            );

            if (result.data?.status === "success") {
                return {
                    ...result.data.data,
                    message: result.data.message,
                };
            }
            return thunkAPI.rejectWithValue({
                message: result.data?.message
            });

        } catch (error) {
            return thunkAPI.rejectWithValue({
                message:
                    error?.response?.data?.message ||
                    error?.message
            });
        }
    }
);


export const GetLeaveList = createAsyncThunk(
    'GetLeaveList',
    async (userdata, thunkAPI) => {
        try {
            let result = await API.get(APIS_ENDPOINTS.LEAVE_LIST(userdata.id));
            if (result.data.status === "error") {
                return thunkAPI.rejectWithValue({
                    error: errorMassage(result.data.message)
                });
            }
            return result.data.data;
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
        const { empId, id, userData } = userdata;
        try {
            let result = await API.put(APIS_ENDPOINTS.PROFILE_UPDATE(empId,id), userData);
            if (result.data.status === "error") {
                return thunkAPI.rejectWithValue({
                    error: errorMassage(result.data.message)
                });
            }
            return result.data.data;
        } catch (error) {
            console.log("Axios Error:", error);
            return thunkAPI.rejectWithValue({
                error: errorMassage(error.response?.data?.message || error.message)
            });
        }
    },
);

export const ForgotPassword = createAsyncThunk(
    'ForgotPassword',
    async (userdata, thunkAPI) => {
        // console.log('ForgotPassword userdata >>', userdata);
        try {
            // let result = await axios({
            //     method: 'POST',
            //     baseURL: Config.BASE_URL,
            //     url: APIS_ENDPOINTS.FORGOT_PASSWORD,
            //     data: userdata,
            // });
            const result = await API.post(APIS_ENDPOINTS.FORGOT_PASSWORD, userdata);

            // console.log('ForgotPassword result.data >>', result.data);
            if (result.data.success) {
                return result.data;
            } else {
                return thunkAPI.rejectWithValue({ error: result.data.errorMessage });
            }
        } catch (error) {
            console.log("error>>>", error)
            console.log('try catch [ ForgotPassword ] error.message>>', error.message);
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
            let result = await API.get(APIS_ENDPOINTS.EXPENSE_CATEGORY(userdata.id));
            // console.log('CategoryList result.data >>', result);
            if (result.data.status === "error") {
                return thunkAPI.rejectWithValue({
                    error: errorMassage(result.data.message)
                });
            }
            return result.data.data;
        } catch (error) {
            console.log("Axios Error:", error);
            return thunkAPI.rejectWithValue({
                error: errorMassage(error.response?.data?.message || error.message)
            });
        }
    },
);

export const AccountList = createAsyncThunk(
    'AccountList',
    async (userdata, thunkAPI) => {
        try {
            let result = await API.get(APIS_ENDPOINTS.EXPENSE_ACCOUNT(userdata.id));
            // console.log('AccountList result.data >>', result);
            if (result.data.status === "error") {
                return thunkAPI.rejectWithValue({
                    error: errorMassage(result.data.message)
                });
            }
            return result.data.data;
        } catch (error) {
            console.log("Axios Error:", error);
            return thunkAPI.rejectWithValue({
                error: errorMassage(error.response?.data?.message || error.message)
            });
        }
    },
);
export const CreateExpenses = createAsyncThunk(
    'CreateExpenses',
    async (userdata, thunkAPI) => {
        try {
            const result = await API.post(APIS_ENDPOINTS.CREATE_EXPENSE(userdata.userId), userdata.userData);
            if (result.data.status === "success") {
                return {
                    status: result.data.status,
                    message: result.data.message,
                    data: result.data.data,
                };
            } else {
                return thunkAPI.rejectWithValue({
                    error: errorMassage(result.data.message),
                });
            }
        } catch (error) {
            return thunkAPI.rejectWithValue({
                error: errorMassage(
                    error.response?.data?.message || error.message
                ),
            });
        }
    }
);

// =====================================================================

export const GetExpenseList = createAsyncThunk(
    'GetExpenseList',
    async (userdata, thunkAPI) => {
        // console.log('GetExpenseList userdata >>', userdata);
        try {
            let result = await API.get(APIS_ENDPOINTS.EXPENSE_LIST(userdata.id));
            // console.log('GetExpenseList result.data >>', result);
            if (result.data.status === "error") {
                return thunkAPI.rejectWithValue({
                    error: errorMassage(result.data.message)
                });
            }
            return result.data.data;
        } catch (error) {
            console.log("Axios Error:", error);
            return thunkAPI.rejectWithValue({
                error: errorMassage(error.response?.data?.message || error.message)
            });
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


//==== GEt Calendar event
export const GetCalendarEvents = createAsyncThunk(
    'GetCalendarEvents',
    async (userdata, thunkAPI) => {
        // console.log('GetCalendarEvents userdata >>', userdata);
        try {
            let result = await API.get(APIS_ENDPOINTS.CALENDAR_EVENTS(userdata.id));
            // console.log('GetCalendarEvents result.data >>', result);
            if (result.data.success) {
                return result.data.data;
            } else {
                return thunkAPI.rejectWithValue({ error: result.data.error });
            }
        } catch (error) {
            console.log("error>>>", error)
            console.log('try catch [ GetCalendarEvents ] error.message>>', error.message);
            return error;
        }
    },
);

//========= GetMonthlyShifts
export const GetMonthlyShifts = createAsyncThunk(
    'GetMonthlyShifts',
    async (userdata, thunkAPI) => {
        try {
            let result = await API.get(APIS_ENDPOINTS.MONTHLY_SHIFTS(userdata.id));
            if (result.data.status === "success") {
                return result.data.data;
            } else {
                return thunkAPI.rejectWithValue({ error: result.data.error });
            }
        } catch (error) {
            console.log("error>>>", error)
            console.log('try catch [ GetCalendarEvents ] error.message>>', error.message);
            return error;
        }
    },
);


export const CreateNewMeeting = createAsyncThunk(
    'CreateNewMeeting',
    async (userdata, thunkAPI) => {
        console.log('CreateNewMeeting userdata >>', userdata);
        try {
            let result = await API.post(APIS_ENDPOINTS.CREATE_MEETING(userdata.id), userdata.data);
            console.log('CreateNewMeeting result.data >>', result.data);
            if (result.data.success) {
                return result.data
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
        try {
            let result = await API.get(APIS_ENDPOINTS.APPROVAL_LIST(userdata.id));
            if (result.data.status === "success") {
                return result.data.data;
            } else {
                return thunkAPI.rejectWithValue({ error: result.data.error });
            }
        } catch (error) {

            return error
        }
    },
);

export const ApproveActionApprove = createAsyncThunk(
    'ApproveActionApprove',
    async (userdata, thunkAPI) => {
        try {
            console.log('ApproveActionApprove payload >>', userdata);

            const result = await API.post(APIS_ENDPOINTS.APPROVE_ACTION, userdata);
            if (result.data?.status === 'success') {
                return result.data;
            }
            return thunkAPI.rejectWithValue({
                message: result.data?.message,
            });

        } catch (error) {
            const message =
                error?.response?.data?.message ||
                error?.message

            return thunkAPI.rejectWithValue({ message });
        }
    }
);


export const ApproveActionReject = createAsyncThunk(
    'ApproveActionReject',
    async (userdata, thunkAPI) => {
        try {
            let result = await API.post(APIS_ENDPOINTS.REJECT_ACTION, userdata);
            if (result.data?.status === 'success') {
                return result.data;
            }
            return thunkAPI.rejectWithValue({
                message: result.data?.message,
            });
        } catch (error) {
            const message =
                error?.response?.data?.message ||
                error?.message

            return thunkAPI.rejectWithValue({ message });
        }
    },
);

export const GetPaySlip = createAsyncThunk(
    'GetPaySlip',
    async (userdata, thunkAPI) => {
        // console.log('GetPaySlip userdata >>', userdata);
        try {
            let result = await API.post(APIS_ENDPOINTS.PAYSLIP, userdata);
            if (result.data.success) {
                return result.data
            } else {
            return thunkAPI.rejectWithValue({ error: result?.data?.message });
            }
        } catch (error) {
            console.log("error>>>", error.response?.data?.error)
            return thunkAPI.rejectWithValue({ error: error.response?.data?.error || error.message });
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


export const CommonSlice = createSlice({
    name: 'CommonSlice',
    initialState: {
        UsersigninData: {},
        isSignin: false,
        isSigninFetching: false,

        UserDetailsData: {},
        isUserDetailsFetching: false,

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

        AccountListData: [],

        CreateExpensesData: {},
        isCreateExpenses: false,
        isCreateExpensesFetching: false,

        GetAttandanceListData: [],
        isGetAttandanceList: false,
        isGetAttandanceListFetching: false,

        UserAttendanceRegcategoriesData: [],
        UserAttendanceRegurationData: [],
        isFeatchAttendanceReguration: false,

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
        GetLeaveAllocationData: [],
        GetDepartmentTypeData: [],
        isGetLeavetype: false,
        isGetLeavetypeFetching: false,

        GetCalendarEventsData: [],
        isGetCalendarEventsData: false,
        isGetCalendarEventsDataFetching: false,
        GetCalendarEventsDataPageNumber: 2,
        GetCalendarEventsDataTotalCount: "",
        isGetCalendarEventsDataMoreFetching: false,

        GetApprovalListData: [],
        isGetApprovalList: false,
        isGetApprovalListFetching: false,
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

        getPaySlipBase64: null,
        isPaySlipBase64Fetching: false,

        isCreateNewMeeting: false,
        isCreateNewMeetingFetching: false,

        isError: false,
        errorMessage: ""
    },
    reducers: {
        updateState: (state, { payload }) => {
            state.isSignin = payload.isSignin !== undefined ? payload.isSignin : state.isSignin;
            state.attandanceStatusData = payload.attandanceStatusData !== undefined ? payload.attandanceStatusData : state.attandanceStatusData;
            state.isCategoryList = payload.isCategoryList !== undefined ? payload.isCategoryList : state.isCategoryList;
            state.isCreateExpenses = payload.isCreateExpenses !== undefined ? payload.isCreateExpenses : state.isCreateExpenses;
            state.isVerified = payload.isVerified !== undefined ? payload.isVerified : state.isVerified
            state.isGetAttandanceList = payload.isGetAttandanceList !== undefined ? payload.isGetAttandanceList : state.isGetAttandanceList;
            state.isGetExpenseList = payload.isGetExpenseList !== undefined ? payload.isGetExpenseList : state.isGetExpenseList;
            state.isFeatchAttendanceReguration = payload.isFeatchAttendanceReguration !== undefined ? payload.isFeatchAttendanceReguration : state.isFeatchAttendanceReguration;
            state.isForgotPassword = payload.isForgotPassword !== undefined ? payload.isForgotPassword : state.isForgotPassword;
            state.isProfileUpdate = payload.isProfileUpdate !== undefined ? payload.isProfileUpdate : state.isProfileUpdate;
            state.VerfiedUserData = payload.VerfiedUserData !== undefined ? payload.VerfiedUserData : state.VerfiedUserData;
            state.UserDetailsData = payload.UserDetailsData !== undefined ? payload.UserDetailsData : state.UserDetailsData;
            state.UsersigninData = payload.UsersigninData !== undefined ? payload.UsersigninData : state.UsersigninData;
            state.isGetInvoiceList = payload.isGetInvoiceList !== undefined ? payload.isGetInvoiceList : state.isGetInvoiceList;
            state.isExpenseApproved = payload.isExpenseApproved !== undefined ? payload.isExpenseApproved : state.isExpenseApproved;

            state.isCreateLeave = payload.isCreateLeave !== undefined ? payload.isCreateLeave : state.isCreateLeave;
            state.isGetLeaveList = payload.isGetLeaveList !== undefined ? payload.isGetLeaveList : state.isGetLeaveList;
            state.isGetLeavetype = payload.isGetLeavetype !== undefined ? payload.isGetLeavetype : state.isGetLeavetype;

            state.isGetCalendarEventsData = payload.isGetCalendarEventsData !== undefined ? payload.isGetCalendarEventsData : state.isGetCalendarEventsData;
            state.isGetAttendeesListData = payload.isGetAttendeesListData !== undefined ? payload.isGetAttendeesListData : state.isGetAttendeesListData;
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

        //===== GetUserDetails

        builder.addCase(GetUserDetails.fulfilled, (state, { payload }) => {
            //console.log("[GetUserDetails.fulfilled]>>>payload>>>", payload)
            try {
                state.UserDetailsData = payload;
                state.isUserDetailsFetching = false;
                state.isError = false;
                state.errorMessage = '';
                return state;
            } catch (error) {
                console.log('Error: GetUserDetails.fulfilled try catch error >>', error);
            }
        });
        builder.addCase(GetUserDetails.rejected, (state, { payload }) => {
            console.log("[GetUserDetails.rejected]>>>", payload)
            try {
                state.UserDetailsData = {};
                state.isUserDetailsFetching = false;
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
        builder.addCase(GetUserDetails.pending, state => {
            state.isUserDetailsFetching = true;
        });

        //===== UserVerification
        builder.addCase(UserVerification.fulfilled, (state, { payload }) => {
            console.log("[UserVerification.fulfilled]>>>payload>>>", payload)
            try {
                state.VerfiedUserData = payload || {};
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

        //========= CheckAttandanceStatus 

        builder.addCase(CheckAttandanceStatus.fulfilled, (state, { payload }) => {
            //console.log("[CheckAttandanceStatus.fulfilled]>>>payload>>>", payload)
            try {
                state.attandanceStatusData = payload;
                state.isError = false;
                state.errorMessage = '';
                return state;
            } catch (error) {
                console.log('Error: CheckAttandanceStatus.fulfilled try catch error >>', error);
            }
        });
        builder.addCase(CheckAttandanceStatus.rejected, (state, { payload }) => {
            console.log("[CheckAttandanceStatus.rejected]>>>", payload)
            try {
                state.attandanceStatusData = null;
                state.isError = true;
                payload
                    ? (state.errorMessage = payload.error?.message
                        ? payload.error.message
                        : (payload.error)) : "Oops! It seems like either your verification code is incorrect";
            } catch (error) {
                console.log(
                    'Error: [CheckAttandanceStatus.rejected] try catch error >>',
                    error,
                );
            }
        });
        builder.addCase(CheckAttandanceStatus.pending, state => {
            return state
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
                state.CategoryListData = [{ id: 0, name: "Select category" }, ...payload];
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
        //========= AccountList

        builder.addCase(AccountList.fulfilled, (state, { payload }) => {
            // console.log("[AccountList.fulfilled]>>>payload>>>", payload)
            try {
                state.AccountListData = [{ id: 0, name: "Select account" }, ...payload];
                state.isError = false;
                state.errorMessage = '';
                return state;
            } catch (error) {
                console.log('Error: AccountList.fulfilled try catch error >>', error);
            }
        });
        builder.addCase(AccountList.rejected, (state, { payload }) => {
            console.log("[AccountList.rejected]>>>", payload)
            try {
                state.AccountListData = [];
                state.isError = true;
                payload
                    ? (state.errorMessage = payload.error?.message
                        ? payload.error?.message
                        : payload.error)
                    : (state.errorMessage = 'API Response Invalid. Please Check API');
            } catch (error) {
                console.log(
                    'Error: [AccountList.rejected] try catch error >>',
                    error,
                );
            }
        });
        builder.addCase(AccountList.pending, state => {
            return state
        });

        //========= CreateExpenses
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

        //========= UserAttendanceRegularization
        builder.addCase(UserAttendanceRegularization.fulfilled, (state, { payload }) => {
            try {
                state.UserAttendanceRegurationData = payload;
                state.isFeatchAttendanceReguration = false;
                state.isError = false;
                state.errorMessage = '';
                return state;
            } catch (error) {
                console.log('Error: UserAttendanceRegularization.fulfilled try catch error >>', error);
            }
        });
        builder.addCase(UserAttendanceRegularization.rejected, (state, { payload }) => {
            console.log("[UserAttendanceRegularization.rejected]>>>", payload)
            try {
                state.UserAttendanceRegurationData = [];
                state.isFeatchAttendanceReguration = false;
                state.isError = true;
                payload
                    ? (state.errorMessage = payload.error?.message
                        ? payload.error?.message
                        : payload.error)
                    : (state.errorMessage = 'API Response Invalid. Please Check API');
            } catch (error) {
                console.log(
                    'Error: [UserAttendanceRegularization.rejected] try catch error >>',
                    error,
                );
            }
        });
        builder.addCase(UserAttendanceRegularization.pending, state => {
            state.isFeatchAttendanceReguration = true;
        });

        //========= UserAttendanceRegcategories
        builder.addCase(UserAttendanceRegcategories.fulfilled, (state, { payload }) => {
            try {
                state.UserAttendanceRegcategoriesData = [{ id: 0, type: "Select Regularization", client_id: [] }, ...payload];
                state.isError = false;
                state.errorMessage = '';
                return state;
            } catch (error) {
                console.log('Error: UserAttendanceRegcategories.fulfilled try catch error >>', error);
            }
        });
        builder.addCase(UserAttendanceRegcategories.rejected, (state, { payload }) => {
            console.log("[UserAttendanceRegcategories.rejected]>>>", payload)
            try {
                state.UserAttendanceRegcategoriesData = [];
                state.isError = true;
                payload
                    ? (state.errorMessage = payload.error?.message
                        ? payload.error?.message
                        : payload.error)
                    : (state.errorMessage = 'API Response Invalid. Please Check API');
            } catch (error) {
                console.log(
                    'Error: [UserAttendanceRegcategories.rejected] try catch error >>',
                    error,
                );
            }
        });
        builder.addCase(UserAttendanceRegcategories.pending, state => {
            return state
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
                state.GetLeavetypeData = [{ "name": "Select Leave Type", value: 0, }, ...payload];
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
        //===== GetLeaveAllocation
        builder.addCase(GetLeaveAllocation.fulfilled, (state, { payload }) => {
            try {
                state.GetLeaveAllocationData = payload;
                state.isError = false;
                state.errorMessage = '';
                return state;
            } catch (error) {
                console.log('Error: GetLeaveAllocation.fulfilled try catch error >>', error);
            }
        });
        builder.addCase(GetLeaveAllocation.rejected, (state, { payload }) => {
            console.log("[GetLeaveAllocation.rejected]>>>", payload)
            try {
                state.GetLeavetypeData = [];
                state.isError = true;
                payload
                    ? (state.errorMessage = payload.error?.message
                        ? payload.error?.message
                        : payload.error)
                    : (state.errorMessage = 'API Response Invalid. Please Check API');
            } catch (error) {
                console.log(
                    'Error: [GetLeaveAllocation.rejected] try catch error >>',
                    error,
                );
            }
        });
        builder.addCase(GetLeaveAllocation.pending, state => {
            return state
        });

        //===== Department type

        builder.addCase(GetDepartmentType.fulfilled, (state, { payload }) => {
            // console.log("[GetDepartmentType.fulfilled]>>>payload>>>", payload)
            try {
                state.GetDepartmentTypeData = payload;
                state.isError = false;
                state.errorMessage = '';
                return state;
            } catch (error) {
                console.log('Error: GetDepartmentType.fulfilled try catch error >>', error);
            }
        });
        builder.addCase(GetDepartmentType.rejected, (state, { payload }) => {
            console.log("[GetDepartmentType.rejected]>>>", payload)
            try {
                state.GetDepartmentTypeData = [];
                state.isError = true;
                payload
                    ? (state.errorMessage = payload.error?.message
                        ? payload.error?.message
                        : payload.error)
                    : (state.errorMessage = 'API Response Invalid. Please Check API');
            } catch (error) {
                console.log(
                    'Error: [GetDepartmentType.rejected] try catch error >>',
                    error,
                );
            }
        });
        builder.addCase(GetDepartmentType.pending, state => {
            return state
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
                state.GetCalendarEventsData = payload;
                state.GetCalendarEventsDataTotalCount = payload.length;
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
                state.GetApprovalListData = payload;
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
        
        //==== approvals accept action
        builder.addCase(ApproveActionApprove.fulfilled, (state, { payload }) => {
            // console.log("[ApproveActionApprove.fulfilled]>>>payload>>>", payload)
            try {
                state.isApproveAction = true;
                state.isApproveActionFetching = false;
                state.isError = false;
                state.errorMessage = '';
                return state;
            } catch (error) {
                console.log('Error: ApproveActionApprove.fulfilled try catch error >>', error);
            }
        });
        builder.addCase(ApproveActionApprove.rejected, (state, { payload }) => {
            console.log("[ApproveActionApprove.rejected]>>>", payload)
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
                    'Error: [ApproveActionApprove.rejected] try catch error >>',
                    error,
                );
            }
        });
        builder.addCase(ApproveActionApprove.pending, state => {
            state.isApproveActionFetching = true;
        });

        //==== approvals reject action
        builder.addCase(ApproveActionReject.fulfilled, (state, { payload }) => {
            // console.log("[ApproveActionReject.fulfilled]>>>payload>>>", payload)
            try {
                state.isApproveAction = true;
                state.isApproveActionFetching = false;
                state.isError = false;
                state.errorMessage = '';
                return state;
            } catch (error) {
                console.log('Error: ApproveActionReject.fulfilled try catch error >>', error);
            }
        });
        builder.addCase(ApproveActionReject.rejected, (state, { payload }) => {
            console.log("[ApproveActionReject.rejected]>>>", payload)
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
                    'Error: [ApproveActionReject.rejected] try catch error >>',
                    error,
                );
            }
        });
        builder.addCase(ApproveActionReject.pending, state => {
            state.isApproveActionFetching = true;
        });

        //==== GetPaySlip
        builder.addCase(GetPaySlip.fulfilled, (state, { payload }) => {
            // console.log("[GetPaySlip.fulfilled]>>>payload>>>", payload)
            try {
                state.isPaySlipBase64Fetching = false;
                state.getPaySlipBase64 = payload
                state.isError = false;
                state.errorMessage = '';
                return state;
            } catch (error) {
                console.log('Error: GetPaySlip.fulfilled try catch error >>', error);
            }
        });
        builder.addCase(GetPaySlip.rejected, (state, { payload }) => {
            console.log("[GetPaySlip.rejected]>>>", payload)
            try {
                state.isPaySlipBase64Fetching = false;
                state.isError = true;
                payload
                    ? (state.errorMessage = payload.error?.message
                        ? payload.error?.message
                        : payload.error)
                    : (state.errorMessage = 'API Response Invalid. Please Check API');
            } catch (error) {
                console.log(
                    'Error: [GetPaySlip.rejected] try catch error >>',
                    error,
                );
            }
        });
        builder.addCase(GetPaySlip.pending, state => {
            state.isPaySlipBase64Fetching = true;
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
            try {
                state.GetMonthlyShiftsData = payload;
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

