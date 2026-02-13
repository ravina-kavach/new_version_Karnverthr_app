import { useNavigation } from "@react-navigation/native";

export const useAdminMaster = () => {
    const navigation = useNavigation();
    const masterData = [
        { id: "1", title: "Regularization Category", screen: "RegularizationCategory" },
        { id: "2", title: "Department", screen: "DepartmentScreen" },
        { id: "3", title: "Job Positions", screen: "JobPositionScreen" },
        { id: "4", title: "Branch", screen: "BranchScreen" },
        { id: "5", title: "Working Schedule", screen: "WorkingScheduleScreen" },
        { id: "6", title: "Work Entry Type", screen: "WorkEntryTypeScreen" },
        { id: "7", title: "Skills", screen: "SkillsScreen" },
        { id: "8", title: "Industries", screen: "IndustriesScreen" },
        { id: "9", title: "Bank", screen: "BankScreen" },
        { id: "10", title: "HR Contract Type", screen: "HRContractTypeScreen" },
        { id: "11", title: "Geo Configurations", screen: "GeoConfigScreen" },
        { id: "12", title: "Expense Category", screen: "ExpenseCategoryScreen" },
        { id: "13", title: "Accrual Plan", screen: "AccrualPlanScreen" },
    ];
    return {
        masterData,
        navigation
    }
}