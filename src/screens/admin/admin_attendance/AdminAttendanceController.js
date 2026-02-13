import { useNavigation } from "@react-navigation/native"

export  const useAdminAttendance = () =>{
    const navigation = useNavigation();
    
    return {
        navigation
    }
}