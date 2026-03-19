import { useState } from "react";

export const useTimeSheet = () => {
    const [date, setDate] = useState("2026-03-17");
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [tasks, setTasks] = useState([]);

    const addTask = () => {
        setTasks([...tasks, { title: "", hours: "" }]);
    };

    const updateTask = (index, key, value) => {
        const updated = [...tasks];
        updated[index][key] = value;
        setTasks(updated);
    };
    return {
        date,
        setDate,
        checkIn,
        setCheckIn,
        checkOut,
        setCheckOut,
        tasks,
        setTasks,
        addTask,
        updateTask,
    }
}