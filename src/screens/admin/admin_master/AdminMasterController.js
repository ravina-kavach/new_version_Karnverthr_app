import { useNavigation } from "@react-navigation/native";

export const useAdminMaster = () => {
    const navigation = useNavigation();
    const masterData = [
        { id: "1", title: "Attendance Policy", screen: "adminAttendancePolicy" },
        { id: "2", title: "Regularization Category", screen: "RegularizationCategory" },
        { id: "3", title: "Department", screen: "DepartmentScreen" },
        { id: "4", title: "Job Positions", screen: "JobPositionScreen" },
        { id: "5", title: "Branch", screen: "BranchScreen" },
        { id: "6", title: "Working Schedule", screen: "WorkingScheduleScreen" },
        { id: "7", title: "Work Entry Type", screen: "WorkEntryTypeScreen" },
        { id: "8", title: "Skills", screen: "SkillsScreen" },
        { id: "9", title: "Industries", screen: "IndustriesScreen" },
        { id: "10", title: "Bank", screen: "BankScreen" },
        { id: "11", title: "HR Contract Type", screen: "HRContractTypeScreen" },
        { id: "12", title: "Geo Configurations", screen: "GeoConfigScreen" },
        { id: "13", title: "Expense Category", screen: "ExpenseCategoryScreen" },
        { id: "14", title: "Accrual Plan", screen: "AccrualPlanScreen" },
    ];
    return {
        masterData,
        navigation
    }
}