import React, { useMemo,useState } from 'react';
import moment from 'moment';

export const usePaySlip = () =>{
    const [slips , setSlips] = useState([])
    const [loading,  setLoading] = useState(false)
      const currentYear = moment().year();
      const YEARDATA = useMemo(() => {
      const startYear = currentYear;
      const years = [];
    
      for (let i = 0; i < 2; i++) {
        years.push({
          id: String(i + 1),
          name: String(startYear - i),
        });
      }
    
      return years;
    }, [currentYear]);

      const [SelectedYear, setSelectedYear] = useState(() =>
        YEARDATA.find(y => y.name === String(currentYear))
      );

    return {
        YEARDATA,
        SelectedYear,
        setSelectedYear,
        slips,
        loading
    }
}