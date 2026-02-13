import { useNavigation } from "@react-navigation/native"

export const userAdminEmployee = () => {
    const navigation = useNavigation();
      const EmployeeTypeData = [
        { id: "1", title: "Employees", screen: "employees" },
        { id: "2", title: "Employee Contracts", screen: "employeeContracts" },
        { id: "3", title: "Expense", screen: "adminExpense" },
        { id: "4", title: "Employee Calander", screen: "employeeCalander" },
    ];
    return {
        navigation,
        EmployeeTypeData
    }
}