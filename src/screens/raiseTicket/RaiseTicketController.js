import { useState, useMemo, useCallback } from 'react'
import { COLOR } from '../../theme/theme'

export const useRaiseTicket = () => {

    // ===== Ticket Summary =====
    const [ticketSummary, setTicketSummary] = useState([
        { title: 'Open', count: 2 },
        { title: 'In Progress', count: 1 },
        { title: 'Closed', count: 3 },
    ])

    // ===== Ticket List =====
    const [ticketList, setTicketList] = useState([
        {
            id: 1,
            title: 'App Crash Issue',
            description: 'Application crashes while uploading image.',
            status: 'open',
            priority: 'High',
            created_at: new Date(),
        },
        {
            id: 2,
            title: 'Login Not Working',
            description: 'Unable to login with valid credentials.',
            status: 'closed',
            priority: 'Medium',
            created_at: new Date(),
        },
    ])

    // ===== Modal =====
    const [visibleModal, setVisibleModal] = useState(false)

    const handleOpenModal = () => {
        setVisibleModal(true)
    }

    const handleModal = () => {
        setVisibleModal(false)
    }

    // ===== Status Filter =====
    const [selectedStatus, setSelectedStatus] = useState(null)

    const filteredTickets = useMemo(() => {
        if (!selectedStatus) return ticketList
        return ticketList.filter(
            ticket => ticket.status === selectedStatus.value
        )
    }, [ticketList, selectedStatus])

    // ===== Save Ticket =====
    const saveTicket = (data) => {

        const newTicket = {
            id: ticketList.length + 1,
            title: data.title,
            description: data.description,
            status: 'open',
            priority: data.priority,
            created_at: new Date(),
        }

        setTicketList(prev => [newTicket, ...prev])

        // Update summary
        setTicketSummary(prev =>
            prev.map(item =>
                item.title === 'Open'
                    ? { ...item, count: item.count + 1 }
                    : item
            )
        )

        setVisibleModal(false)
    }

    // ===== Refresh =====
    const [isFetching, setIsFetching] = useState(false)

    const onRefresh = useCallback(() => {
        setIsFetching(true)

        setTimeout(() => {
            setIsFetching(false)
        }, 1000)
    }, [])

    // ===== Status Color Logic =====
    const getStatusColor = status => {
        switch (status) {
            case 'open':
                return '#F59E0B'   // amber
            case 'closed':
                return '#10B981'   // green
            case 'in_progress':
                return '#3B82F6'   // blue
            case 'rejected':
                return '#EF4444'   // red
            default:
                return COLOR.TextSecondary
        }
    }

    return {
        ticketSummary,
        ticketList,
        visibleModal,
        handleModal,
        handleOpenModal,
        saveTicket,
        selectedStatus,
        setSelectedStatus,
        filteredTickets,
        isFetching,
        onRefresh,
        getStatusColor,
    }
}
