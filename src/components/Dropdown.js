import React from 'react'
import { View , Image} from 'react-native'
import { ColView, Label, RowView } from '../utils/common';
import { COLOR } from '../theme/theme';
import SelectDropdown from 'react-native-select-dropdown';
import { ArrowDown } from '../assets/icons/index.js';
// import Entypo from 'react-native-vector-icons/dist/Entypo';

function Dropdown({ DropdownData = [], Style, Selecteditem, setSelecteditem }) {
      
    return (
        <View>
            {DropdownData.length > 0 && (
                <SelectDropdown
                    data={DropdownData}
                    defaultValue={DropdownData[0]}
                    defaultValueByIndex={0}
                    onSelect={(selectedItem, index) => {
                        setSelecteditem(selectedItem);
                    }}
                    dropdownStyle={{borderRadius:15,maxHeight:150}}
                    dropdownOverlayColor={"rgba(0,0,0,0.1)"}
                    renderButton={(selectedItem, isOpened) => {
                        return (
                            <View style={{ width: 'auto', borderRadius: 10,  height: 45, paddingTop: 10, paddingHorizontal: 10, backgroundColor:COLOR.White1}}>
                                <RowView>
                                    <ColView>
                                        <Label style={{ color: COLOR.Black1, marginRight: 10 }}>{Selecteditem ? Selecteditem.name : DropdownData[0]?.name}</Label>
                                    </ColView>
                                    <ColView style={{ flex: 0 }}>
                                            <Image source={ArrowDown} size={26} style={{ transform: [{ rotate: isOpened ? '180deg': '0deg' }] }}/>
                                    </ColView>
                                </RowView>
                            </View>
                        );
                    }}
                    renderItem={(item, index, isSelected) => {
                        return (
                            <View style={{ borderBottomWidth: 0.5, borderEndColor: COLOR.Black1, backgroundColor: isSelected ? COLOR.background2 : "rgba(0,0,0,0.2)"}}>
                                <Label style={{ textAlign: "center", paddingVertical: 5, color: isSelected ? COLOR.White1 : COLOR.Black1 }}>{item.name}</Label>
                            </View>
                        );
                    }}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    )
}

export default Dropdown