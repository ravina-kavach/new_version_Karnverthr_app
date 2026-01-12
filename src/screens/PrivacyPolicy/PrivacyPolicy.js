import React from 'react'
import { View, ScrollView } from 'react-native'
import { CommonView, Label } from '../../utils/common'
import { COLOR } from '../../theme/theme'
import { GlobalFonts } from '../../theme/typography'
import { FontSize } from '../../utils/metrics'
import CommonHeader from '../../components/CommonHeader'

export default function PrivacyPolicy() {

  const PrivacyLabel = ({ label = '' }) => (
    <View style={{ paddingVertical: 20 }}>
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

  const PrivacyTitle = ({ title = '' }) => (
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
      <CommonHeader title="Privacy Policy" />
      <ScrollView
        style={{ backgroundColor: COLOR.White1 }}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View style={{ marginHorizontal: 20 }}>

          <PrivacyLabel
            label="KAVACH GLOBAL KONNECTS PVT LTD is an independent analytics company which provides its registered users (any person who is registered with KAVACH and accepts these terms and proceeds to use the Services offered by KAVACH) information and analytics services about corporate entities in India using publicly available information, including through its proprietary platform. Use of the Services shall be deemed to constitute sufficient proof that the Users have read, understood, and accepted this Privacy Policy."
          />

          <PrivacyTitle title="1) Collection of Personal Information" />
          <PrivacyLabel
            label="KAVACH collects minimal personal information from Users accessing its Services, through online and offline means. Such information may include user credentials, user identifiers, access logs, usage data, and information downloaded by the User (‘Personal Information’)."
          />

          <PrivacyTitle title="2) Purpose of Collection and Use of Personal Information" />
          <PrivacyLabel
            label="KAVACH collects, stores, accesses, and uses Personal Information solely for enabling Users to utilize the Services, monitoring usage, improving service quality, and communicating service-related updates, including product information and promotional communications."
          />

          <PrivacyTitle title="3) Applicability of Policy" />
          <PrivacyLabel
            label="This Privacy Policy applies to all Personal Information collected, stored, and used by KAVACH and is intended to comply only with applicable laws of India."
          />

          <PrivacyTitle title="4) Sharing of Personal Information with Third Parties" />
          <PrivacyLabel
            label="KAVACH maintains strict confidentiality of Personal Information and does not sell, rent, trade, or transfer such information to third parties, except where required by law, court order, regulatory authority, or for enforcement of KAVACH’s legal rights."
          />

          <PrivacyTitle title="5) Choice and Opt-out" />
          <PrivacyLabel
            label="Submission of Personal Information by Users is voluntary. Users may choose not to provide certain Personal Information; however, this may limit or restrict access to some or all Services, for which KAVACH shall not be responsible."
          />

          <PrivacyTitle title="6) Data & System Security" />
          <PrivacyLabel
            label="KAVACH adopts reasonable industry-standard security measures, including encryption and server protection mechanisms, to safeguard Personal Information against unauthorized access, misuse, alteration, disclosure, or destruction."
          />

          <PrivacyTitle title="7) Grievances" />
          <PrivacyLabel
            label="For any questions, concerns, or complaints regarding this Privacy Policy, Users may contact KAVACH at: support@kavachglobal.com. All grievances shall be addressed promptly and without charge."
          />

          <PrivacyTitle title="8) Limitation of Liability" />
          <PrivacyLabel
            label="Notwithstanding anything to the contrary, KAVACH’s aggregate liability for any breach of this Privacy Policy shall be limited to INR 1,000 and shall not include any indirect, incidental, or consequential damages."
          />

          <PrivacyTitle title="9) Amendments" />
          <PrivacyLabel
            label="KAVACH reserves the right to amend this Privacy Policy at its sole discretion. Updated versions shall be effective upon publication on KAVACH’s platform, and continued use of the Services shall constitute acceptance of such changes."
          />

        </View>
      </ScrollView>
    </CommonView>
  )
}
