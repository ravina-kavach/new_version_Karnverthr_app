import { useNavigation } from "@react-navigation/native";
export const useAdminPayroll = () =>{
const navigation = useNavigation();
       const AdminPayrollData = [
        { id: "1", title: "Salary Structure Types", screen: "salaryStructureTypes" },
        { id: "2", title: "Salary Rule Category", screen: "salaryRuleCategory" },
        { id: "3", title: "Salary Structure", screen: "salaryStructure" },
        { id: "4", title: "Salary Rules", screen: "salaryRules" },
        { id: "5", title: "Payslip Other Input Type", screen: "payslipOtherInputType" },
    ];
    return {
        navigation,
        AdminPayrollData
    }
}