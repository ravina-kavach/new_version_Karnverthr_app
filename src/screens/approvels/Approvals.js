import { View, FlatList, RefreshControl, ScrollView, Text, TouchableWithoutFeedback } from 'react-native'
import React from 'react'
import { APPROVALS, COLOR, STATE } from '../../theme/theme'
import { useDispatch, useSelector } from 'react-redux';
import { ApprovalCategory, ApprovalList, ApprovalListMore, ApproveAction, CommonSelector, updateState } from '../../store/reducers/commonSlice';
import { useIsFocused } from '@react-navigation/native';
import SelectDropdown from 'react-native-select-dropdown';

// import Entypo from 'react-native-vector-icons/dist/Entypo';
// import Feather from 'react-native-vector-icons/Feather';
import { showMessage } from 'react-native-flash-message';
import { useTranslation } from 'react-i18next';
import NodataFound from '../../components/NodataFound'
import {CommonView,RowView,ColView, Label} from '../../utils/common'

export default function Approvals() {
    const { t, i18n } = useTranslation();
    const IsFocused = useIsFocused();
    const dispatch = useDispatch();
    const [Catagoryfilterdata, setCatagoryfilterdata] = React.useState([]);
    const [SelectedCatagory, setSelectedCatagory] = React.useState('All');
    const { UsersigninData, GetApprovalListData, GetApprovalCategoryListData, isGetApprovalListDataMoreFetching, isApproveAction, isGetApprovalListFetching, GetApprovalListDataPageNumber, GetApprovalListDataTotalCount } = useSelector(CommonSelector);

    React.useEffect(() => {
        if (IsFocused) {
            dispatch(ApprovalList({ 'email': UsersigninData.email, 'page_no': 1 }))
            dispatch(ApprovalCategory())
        }
    }, [IsFocused])

    const onEndReached = (data) => {
        if (!isGetApprovalListDataMoreFetching && GetApprovalListData.length < GetApprovalListDataTotalCount) {
            dispatch(ApprovalListMore({
                'email': UsersigninData.email,
                "page_no": GetApprovalListDataPageNumber,
            }))
        }
    }

    React.useEffect(() => {
        if (SelectedCatagory == 'All') {
            setCatagoryfilterdata(GetApprovalListData)
        } else {
            let data = GetApprovalListData.filter((i) => i.category == SelectedCatagory)
            setCatagoryfilterdata(data)
        }
    }, [SelectedCatagory, GetApprovalListData])

    React.useEffect(() => {
        if (isApproveAction) {
            showMessage({
                icon: "success",
                message: `${t('messages.Approve_request')}`,
                type: "success",
            })
            dispatch(updateState({ isApproveAction: false, }))
        }
    }, [isApproveAction])

    const onRefresh = () => {
        dispatch(ApprovalList({ 'email': UsersigninData.email, 'page_no': 1 }))
    }

    const columns = [
        { key: 'approval_subject', label: `${t('Approvals.Subject')}`, width: 120 },
        { key: 'request_owner', label: `${t('Approvals.Owner')}`, width: 120 },
        { key: 'category', label: `${t('Approvals.Category')}`, width: 140 },
        { key: 'request_start', label: `${t('Approvals.Start')}`, width: 100 },
        { key: 'request_to', label: `${t('Approvals.To')}`, width: 100 },
        { key: 'request_status', label: `${t('Approvals.Status')}`, width: 100 },
        { key: 'approval_action', label: `${t('Approvals.Action')}`, width: 100 },
        { key: 'user', label: `${t('Approvals.User')}`, width: 100 },
    ];

    const renderHeader = () => (
        <RowView style={{ backgroundColor: COLOR.background1 }}>
            {columns.map(col => (
                <View key={col.key} style={{ width: col.width, padding: 8, borderRightWidth: 1, borderColor: '#eee' }}>
                    <Text style={{ fontWeight: 'bold', color: COLOR.White1, textAlign: 'center' }}>{col.label}</Text>
                </View>
            ))}
        </RowView>
    );

    const handleOnApproveAction = (id, status) => {
        dispatch(ApproveAction({ "approval_id": `${id}`, "status": status }))
    }

    const renderTableRow = ({ item }) => (
        <View style={{ borderBottomWidth: 1, borderColor: COLOR.dark4, backgroundColor: COLOR.White1, flexDirection: 'row' }}>
            {columns.map(col => (
                <View key={col.key} style={{ width: col.width, padding: 8, borderRightWidth: 1, borderColor: COLOR.dark5, justifyContent: 'center' }}>
                    {col.key === 'request_status' ? (
                        <Text style={{ backgroundColor: APPROVALS[item.request_status], color: COLOR.White1, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2, textAlign: 'center' }}>
                            {item.request_status}
                        </Text>
                    ) : (
                        <Text style={{ color: COLOR.Black1 }}>{item[col.key]}</Text>
                    )}
                    {(item.request_status == 'pending' && col.key === 'approval_action') ? (
                        <RowView>
                            <ColView>
                                <TouchableWithoutFeedback onPress={() => handleOnApproveAction(item.id, "1")}>
                                    <View style={{ backgroundColor: '#d3f2dc', alignItems: 'center', justifyContent: 'center', padding: 5, borderRadius: 20 }}>
                                        {/* <Feather name="check-square" color={APPROVALS.approved} size={24} /> */}
                                    </View>
                                </TouchableWithoutFeedback>
                            </ColView>
                            <ColView>
                                <TouchableWithoutFeedback onPress={() => handleOnApproveAction(item.id, "0")}>
                                    <View style={{ backgroundColor: '#f2d3d3', alignItems: 'center', justifyContent: 'center', padding: 5, borderRadius: 20 }}>
                                        {/* <Entypo name="cross" color={COLOR.primary1} size={24} /> */}
                                    </View>
                                </TouchableWithoutFeedback>
                            </ColView>
                        </RowView>
                    ) : (
                        <View></View>
                    )}
                </View>
            ))}
        </View>
    );

    return (
        <CommonView>
            <View style={{ marginHorizontal: 15, marginVertical: 10 }}>
                <SelectDropdown
                    data={GetApprovalCategoryListData}
                    defaultButtonText={t('Leaves.Select_Leave_Type')}
                    dropdownIconPosition="right"
                    onSelect={(selectedItem) => setSelectedCatagory(selectedItem.approval_namesubject)}
                    renderButton={(selectedItem, isOpened) => (
                        <View style={{ width: '100%', borderRadius: 10, borderWidth: 0.5, borderColor: COLOR.dark2, height: 40, paddingTop: 6, paddingHorizontal: 10, backgroundColor: COLOR.White1 }}>
                            <RowView>
                                <ColView>
                                    <Label style={{ fontSize: 16, color: selectedItem ? COLOR.Black1 : COLOR.dark2 }}>
                                        {selectedItem ? selectedItem.approval_namesubject : 'All'}
                                    </Label>
                                </ColView>
                                <ColView style={{ flex: 0 }}>
                                    {/* {isOpened ? (
                                        <Entypo name='chevron-up' color={COLOR.dark3} size={26} />
                                    ) : (
                                        <Entypo name='chevron-down' color={COLOR.dark3} size={26} />
                                    )} */}
                                </ColView>
                            </RowView>
                        </View>
                    )}
                    renderItem={(item, index, isSelected) => (
                        <View style={{ borderBottomWidth: 0.5, borderEndColor: COLOR.White1, backgroundColor: isSelected ? COLOR.background1 : COLOR.White1 }}>
                            <Text style={{ textAlign: "center", paddingVertical: 5, color: isSelected ? COLOR.primary1 : COLOR.Black1 }}>{item.approval_namesubject}</Text>
                        </View>
                    )}
                />
            </View>
            <View style={{ flex: 1 }}>
                <ScrollView horizontal>
                    <View>
                        {renderHeader()}
                        <FlatList
                            data={Catagoryfilterdata}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={renderTableRow}
                            onEndReached={onEndReached}
                            contentContainerStyle={{ paddingVertical: 10 }}
                            ListEmptyComponent={() => (
                                <NodataFound />
                            )}
                            ListFooterComponent={isGetApprovalListDataMoreFetching ? (
                                <ActivityIndicator animating={isGetApprovalListDataMoreFetching} color={COLOR.Black1} />
                            ) : null}
                            refreshControl={
                                <RefreshControl refreshing={isGetApprovalListFetching} onRefresh={onRefresh} />
                            }
                        />
                    </View>
                </ScrollView>
            </View>
        </CommonView>
    )
}