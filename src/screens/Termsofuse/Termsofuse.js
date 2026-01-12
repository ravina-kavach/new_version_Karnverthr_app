import React from 'react'
import { View, Linking, ScrollView, Text } from 'react-native'
import { ColView, CommonView, Label, RowView } from '../../utils/common'
import { COLOR } from '../../theme/theme'
import { GlobalFonts } from '../../theme/typography'
import { FontSize } from '../../utils/metrics'
import CommonHeader from '../../components/CommonHeader'

export default function Termsofuse() {

  const ToULabel = ({ label = '' }) => (
    <View style={{ marginBottom: 10 }}>
      <Label
        style={{
          ...GlobalFonts.subtitle,
          color: COLOR.TextPlaceholder,
          fontSize: FontSize.Font14,
          fontWeight: '400',
        }}
      >
        {label}
      </Label>
    </View>
  )

  const ToUTitle = ({ title = '' }) => (
    <View
      style={{
        backgroundColor: COLOR.Black1,
        alignSelf: 'flex-start',
        paddingVertical: 3,
        paddingHorizontal: 15,
        borderRadius: 20,
        marginBottom: 10,
      }}
    >
      <Label style={{ fontWeight: '600', color: COLOR.White1 }}>
        {title}
      </Label>
    </View>
  )

  return (
    <CommonView>
      <CommonHeader title="Terms of Use" />
      <ScrollView style={{ backgroundColor: COLOR.White1 }}>
        <View style={{ marginTop: 10, marginHorizontal: 30, paddingBottom: 30 }}>

          {/* GENERAL TERMS */}
          <ToULabel label="1. You are solely responsible for maintaining the confidentiality of your user account details." />
          <ToULabel label="2. All data we provide is collected from public sources and provided to you upon your request." />
          <ToULabel label="3. We do not own the data. We only collect and collate data on a best-effort basis and are not responsible for errors, correctness, or completeness." />
          <ToULabel label="4. You shall use the data only for your end-use requirements and shall not scrape, resell, reverse engineer, copy, license, or redistribute the data." />
          <ToULabel label="5. You are required to adhere to the obligations of the data sources." />
          <ToULabel label="6. You will pay all applicable fees promptly." />
          <ToULabel label="7. KAVACH may terminate the account upon breach of these Terms." />

          {/* INTRODUCTORY */}
          <ToUTitle title="Introductory" />
          <ToULabel
            label="KAVACH GLOBAL KONNECTS PRIVATE LIMITED is a company incorporated under the Companies Act, 1956 and having its registered office at Office-408, Colonade, Behind Iscon Temple Opp. Iscon Brts Bus Stand, Iscon Ambli Road,Ahmedabad - 380054, Gujarat, India ('KAVACH', which expression shall unless repugnant to the subject or context thereof mean and include its successors and assigns)."
          />

          <View style={{ marginBottom: 10 }}>
            <Text style={{ fontSize: 16, fontWeight: '400' }}>
              <Label>
                KAVACH provides independent financial analytics and information services using public sources (“Services”). These Services are rendered through the KAVACH Platform (
              </Label>
              <Text
                style={{ color: 'blue' }}
                onPress={() => Linking.openURL('https://kavachglobal.com/')}
              >
                https://kavachglobal.com/
              </Text>
              <Label>
                ), a proprietary software and analytics platform owned and operated by KAVACH.
              </Label>
            </Text>
          </View>

          {/* TERMS */}
          <ToUTitle title="Terms" />
          <ToULabel label="These Terms of Service constitute a binding agreement between KAVACH and the User. By accessing or using the Services, the User agrees to be bound by these Terms." />
          <ToULabel label="Headings are for convenience only and shall not affect interpretation." />

          {/* REGISTRATION */}
          <ToUTitle title="1. Registration" />
          <ToULabel label="1.1 Users may be required to register and provide accurate and complete information." />
          <ToULabel label="1.2 Upon registration, KAVACH grants access to the KAVACH PLATFORM. Users are responsible for maintaining account security." />
          <ToULabel label="1.3 KAVACH is not liable for unauthorized account usage." />

          {/* USER RESPONSIBILITIES */}
          <ToUTitle title="2. User Responsibilities" />
          <ToULabel label="2.1 Users shall comply with all applicable laws and regulations." />
          <ToULabel label="2.2 Users shall not misuse, copy, or exploit the Services." />
          <ToULabel label="2.3 Users shall not introduce viruses or malicious content." />

          {/* INTELLECTUAL PROPERTY */}
          <ToUTitle title="3. Intellectual Property" />
          <ToULabel label="All intellectual property rights in the Services belong solely to KAVACH. Unauthorized use is strictly prohibited." />

          {/* LIMITATION */}
          <ToUTitle title="4. Limitation of Liability" />
          <ToULabel label="KAVACH shall not be liable for any indirect, incidental, or consequential damages arising from use of the Services." />

          {/* GOVERNING LAW */}
          <ToUTitle title="5. Governing Law" />
          <ToULabel label="These Terms shall be governed by and construed in accordance with the laws of India. Courts at Ahmedabad shall have exclusive jurisdiction." />

        </View>
      </ScrollView>
    </CommonView>
  )
}
