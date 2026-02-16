import { useState, useCallback, useEffect } from 'react';
import { COLOR, STATE } from '../../theme/theme';
import { useDispatch, useSelector } from "react-redux";
import { showMessage } from "react-native-flash-message";
import {
    CommonSelector,
    SupportTicketList,
    CreateSupportTicket,
    DeleteSupportTicket
} from '../../store/reducers/commonSlice';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';

export const useRaiseTicket = () => {

    const dispatch = useDispatch();
    const { UsersigninData, GetSupportListData } = useSelector(CommonSelector);

    const [visibleModal, setVisibleModal] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [selectedTicketId, setSelectedTicketId] = useState(null);
    const [token, setToken] = useState(null);
    const [isFetching, setIsFetching] = useState(false);

    const isFocused = useIsFocused();

    const handleOpenModal = () => setVisibleModal(true);
    const handleModal = () => setVisibleModal(false);

    // ================== FETCH TOKEN ==================
    useFocusEffect(
        useCallback(() => {
            getApiToken();
        }, [])
    );

    useEffect(() => {
        if (isFocused && token && UsersigninData?.user_id) {
            dispatch(
                SupportTicketList({
                    token: token,
                    id: UsersigninData.user_id,
                })
            );
        }
    }, [isFocused, token, UsersigninData?.user_id]);

    const getApiToken = async () => {
        try {
            const response = await fetch("http://178.236.185.232:9090/api/auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_name: "ravina" }),
            });

            const data = await response.json();
            if (data?.token) {
                setToken(data.token);
            }
        } catch (error) {
            console.error("API ERROR ======>", error);
        }
    };

    // ================== CREATE TICKET ==================
    const saveTicket = async (data) => {
        try {
            const payload = {
                token: token,
                id: UsersigninData?.user_id,
                data: {
                    name: data?.title,
                    attachment: data?.attachment,
                    description: data?.description,
                }
            };

            const result = await dispatch(CreateSupportTicket(payload)).unwrap();

            if (result?.status === "success") {

                await dispatch(SupportTicketList({
                    token: token,
                    id: UsersigninData.user_id
                }));

                showMessage({
                    icon: 'success',
                    message: result?.message,
                    type: 'success',
                });

                setVisibleModal(false);
            } else {
                showMessage({
                    icon: 'danger',
                    message: result?.message,
                    type: 'danger',
                });
            }

        } catch (error) {
            showMessage({
                icon: 'danger',
                message: error?.message || error?.error,
                type: 'danger',
            });
        }
    };

    // ================== DELETE LOGIC ==================

    const openDeleteModal = (id) => {
        setSelectedTicketId(id);
        setDeleteModalVisible(true);
    };

    const closeDeleteModal = () => {
        setDeleteModalVisible(false);
        setSelectedTicketId(null);
    };

    const confirmDeleteTicket = async () => {
        if (!selectedTicketId) return;

        try {
            const payload = {
                ticketId: selectedTicketId,
                id: UsersigninData.user_id,
                token: token
            };

            const result = await dispatch(DeleteSupportTicket(payload)).unwrap();

            if (result?.status === "success") {
                await dispatch(SupportTicketList({
                    token: token,
                    id: UsersigninData.user_id
                }));

                showMessage({
                    icon: 'success',
                    message: result?.message,
                    type: 'success',
                });

                closeDeleteModal();
            } else {
                showMessage({
                    icon: 'danger',
                    message: result?.message,
                    type: 'danger',
                });
            }

        } catch (error) {
            showMessage({
                icon: 'danger',
                message: error?.message || error?.error,
                type: 'danger',
            });
        }
    };

    // ================== PULL TO REFRESH ==================
    const onRefresh = useCallback(async () => {
        try {
            setIsFetching(true);
            await dispatch(SupportTicketList({
                token: token,
                id: UsersigninData.user_id
            }));
        } finally {
            setIsFetching(false);
        }
    }, [token, UsersigninData?.user_id]);

    // ================== STATUS COLOR ==================
    const getStatusColor = (status) => {
        switch (status) {
            case 'new': return STATE.partial;
            case 'open': return '#F59E0B';
            case 'closed': return '#10B981';
            case 'in_progress': return '#3B82F6';
            case 'rejected': return '#EF4444';
            default: return COLOR.Black1;
        }
    };

    return {
        visibleModal,
        handleModal,
        handleOpenModal,
        saveTicket,
        GetSupportListData,
        isFetching,
        onRefresh,
        getStatusColor,

        // delete
        deleteModalVisible,
        openDeleteModal,
        closeDeleteModal,
        confirmDeleteTicket,
    };
};
