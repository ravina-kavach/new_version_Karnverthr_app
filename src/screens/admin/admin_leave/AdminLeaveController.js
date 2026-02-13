import { useNavigation } from "@react-navigation/native"

export const useAdminLeave = () =>{
    const navigation = useNavigation()
      const AdminLeavesData = [
        { id: "1", title: "Leaves", screen: "leaves" },
        { id: "2", title: "Leave Allocation", screen: "leaveAllocation" },
        { id: "3", title: "Leave Request", screen: "leaveRequest" },
        { id: "4", title: "Leave Types", screen: "leaveTypes" },
        { id: "5", title: "Public Holiday", screen: "publicHoliday" },
        { id: "6", title: "Mandatory Days", screen: "mandatoryDays" },
    ];
    return {
        navigation,
        AdminLeavesData
    }   
}