import React, { useState, useEffect, useCallback } from 'react'
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    Image,
} from 'react-native'
import { GlobalFonts } from '../theme/typography'
import { FontSize } from '../utils/metrics'
import ImagePickerSheet from './ImagePickerSheet'

const RaiseTicketModal = ({
    visible,
    onClose,
    onSave,
}) => {

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [errors, setErrors] = useState({})
    const [pickerVisible, setPickerVisible] = useState(false)
    const [attachment, setAttachment] = useState(null)

    useEffect(() => {
        if (!visible) {
            setTitle('')
            setDescription('')
            setErrors({})
            setAttachment(null)
        }
    }, [visible])

    const validate = () => {
        const newErrors = {}
        const trimmedTitle = title.trim()
        const trimmedDescription = description.trim()

        if (!trimmedTitle) {
            newErrors.title = 'Title is required'
        }

        if (!trimmedDescription) {
            newErrors.description = 'Description is required'
        } else if (trimmedDescription.length < 10) {
            newErrors.description = 'Minimum 10 characters required'
        } else if (trimmedDescription.length > 250) {
            newErrors.description = 'Maximum 250 characters allowed'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = () => {
        if (!validate()) return

        const formData = {
            title: title.trim(),
            description: description.trim(),
            attachment: attachment?.base64 || null,
        }

        onSave(formData)
    }

    const handleAttachment = useCallback((image) => {
        if (image) {
            setAttachment(image);
            setPickerVisible(false)
        }
    }, [])
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            statusBarTranslucent
        >
            <View style={styles.overlay}>
                <View style={styles.container}>

                    <View style={styles.header}>
                        <Text style={styles.titleText}>Raise Ticket</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Text style={styles.close}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Title */}
                    <Text style={styles.label}>Title</Text>
                    <TextInput
                        style={[styles.input, errors.title && styles.inputError]}
                        value={title}
                        onChangeText={setTitle}
                        placeholder="Enter ticket title"
                        placeholderTextColor="#999"
                    />
                    {errors.title && (
                        <Text style={styles.errorText}>{errors.title}</Text>
                    )}

                    {/* Description */}
                    <Text style={styles.label}>Description</Text>
                    <TextInput
                        style={[
                            styles.input,
                            styles.textArea,
                            errors.description && styles.inputError
                        ]}
                        value={description}
                        onChangeText={(text) => {
                            if (text.length <= 250) {
                                setDescription(text)
                            }
                        }}
                        placeholder="Describe your issue..."
                        placeholderTextColor="#999"
                        multiline
                        maxLength={250}
                    />

                    <View style={styles.bottomRow}>
                        <View style={{ flex: 1 }}>
                            {errors.description && (
                                <Text style={styles.errorText}>
                                    {errors.description}
                                </Text>
                            )}
                        </View>

                        <Text
                            style={[
                                styles.counterText,
                                description.length > 200 && styles.counterWarning
                            ]}
                        >
                            {description.length}/250
                        </Text>
                    </View>

                    {/* Attachment Button */}
                    <TouchableOpacity
                        style={styles.attachmentBtn}
                        onPress={() => setPickerVisible(true)}
                    >
                        <Text style={styles.attachmentText}>
                            + Add Attachment
                        </Text>
                    </TouchableOpacity>

                    {/* Attachment Preview */}
                    {attachment && (
                        <View style={styles.previewContainer}>
                            <Image
                                source={{ uri: `data:image/jpeg;base64,${attachment.base64}` }}
                                style={styles.previewImage}
                            />
                            <TouchableOpacity
                                style={styles.removeBtn}
                                onPress={() => setAttachment(null)}
                            >
                                <Text style={styles.removeText}>Remove</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Footer */}
                    <View style={styles.footer}>
                        <TouchableOpacity
                            style={styles.cancelBtn}
                            onPress={onClose}
                        >
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.saveBtn}
                            onPress={handleSubmit}
                        >
                            <Text style={styles.saveText}>Submit</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>

            <ImagePickerSheet
                visible={pickerVisible}
                onClose={() => setPickerVisible(false)}
                onResult={handleAttachment}
            />
        </Modal>
    )
}

const styles = StyleSheet.create({

    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.45)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    container: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10
    },

    titleText: {
        fontSize: 18,
        fontWeight: '600',
    },

    close: {
        fontSize: 18,
        color: '#666'
    },

    label: {
        marginTop: 10,
        marginBottom: 6,
        color: '#555',
        ...GlobalFonts.normalText,
        fontSize: FontSize.Font14,
    },

    input: {
        height: 45,
        borderWidth: 1,
        borderColor: '#E2E2E2',
        borderRadius: 10,
        paddingHorizontal: 12,
        justifyContent: 'center',
    },

    textArea: {
        height: 100,
        textAlignVertical: 'top',
        paddingTop: 10
    },

    inputError: {
        borderColor: '#E53935',
    },

    errorText: {
        color: '#E53935',
        fontSize: 12,
        marginTop: 4,
    },

    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 4,
    },

    counterText: {
        fontSize: 12,
        color: '#999',
    },

    counterWarning: {
        color: '#E53935',
    },

    attachmentBtn: {
        marginTop: 15,
        padding: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        alignItems: 'center'
    },

    attachmentText: {
        fontWeight: '500'
    },

    previewContainer: {
        marginTop: 12,
        alignItems: 'center'
    },

    previewImage: {
        width: 100,
        height: 100,
        borderRadius: 10,
        marginBottom: 8
    },

    removeBtn: {
        paddingHorizontal: 10,
        paddingVertical: 4,
    },

    removeText: {
        color: '#E53935',
        fontWeight: '500'
    },

    footer: {
        flexDirection: 'row',
        marginTop: 20,
    },

    cancelBtn: {
        flex: 1,
        height: 44,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },

    saveBtn: {
        flex: 1,
        height: 44,
        borderRadius: 10,
        backgroundColor: '#1C1C1E',
        alignItems: 'center',
        justifyContent: 'center',
    },

    cancelText: {
        color: '#333'
    },

    saveText: {
        color: '#fff',
        fontWeight: '600'
    }

})

export default RaiseTicketModal
