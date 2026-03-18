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
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useRaiseTicket = () => {

    const dispatch = useDispatch();
    const { UsersigninData, GetSupportListData } = useSelector(CommonSelector);

    const [visibleModal, setVisibleModal] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [selectedTicketId, setSelectedTicketId] = useState(null);
    const [isFetching, setIsFetching] = useState(false);

    const isFocused = useIsFocused();

    const handleOpenModal = () => setVisibleModal(true);
    const handleModal = () => setVisibleModal(false);

    useEffect(() => {
        const fetchTickets = async () => {
            const token = await AsyncStorage.getItem('USER_ODOO_TOKEN');

            if (isFocused && token && UsersigninData?.user_id) {
                dispatch(
                    SupportTicketList({
                        token: token,
                        id: Number(UsersigninData.user_id),
                    })
                );
            }
        };

        fetchTickets();
    }, [isFocused, UsersigninData?.user_id]);

    const saveTicket = async (data) => {
        const token = await AsyncStorage.getItem('USER_ODOO_TOKEN');
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
        const token = await AsyncStorage.getItem('USER_ODOO_TOKEN');

        console.log("confirmDeleteTicket===>", token)
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
    const onRefresh = useCallback(async () => {
        const token = await AsyncStorage.getItem('USER_ODOO_TOKEN');
        try {
            setIsFetching(true);
            await dispatch(SupportTicketList({
                token: token,
                id: UsersigninData.user_id
            }));
        } finally {
            setIsFetching(false);
        }
    }, [UsersigninData?.user_id]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'new': return STATE.partial;
            case 'in progress': return STATE.pending;
            case 'on hold': return STATE.reported;
            case 'solved': return STATE.approve;
            case 'cancelled': return STATE.reject;
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

        deleteModalVisible,
        openDeleteModal,
        closeDeleteModal,
        confirmDeleteTicket,
    };
};
