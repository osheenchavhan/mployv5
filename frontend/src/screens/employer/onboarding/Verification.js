/**
 * Why this screen exists:
 * Before employers can post jobs, we need to make sure they are legitimate businesses.
 * This screen helps:
 * 1. Collect official business documents like:
 *    - Business registration
 *    - Tax documents
 *    - Professional licenses
 * 
 * 2. Guide employers through the verification process:
 *    - Shows what documents are needed
 *    - Lets them upload files easily
 *    - Explains why verification is important
 * 
 * Think of it as a security checkpoint that:
 * - Protects job seekers from fake job posts
 * - Builds trust in our platform
 * - Ensures only real businesses can post jobs
 * 
 * Without this screen:
 * - Anyone could pretend to be an employer
 * - Job seekers wouldn't know if jobs are legitimate
 * - The platform could be misused for scams
 * 
 * @fileoverview Handles business verification during employer onboarding
 * @package mployv5/screens/employer/onboarding
 * @lastModified 2024-12-10
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import DocumentPicker from 'expo-document-picker';
import Container from '../../../components/common/Container';
import Button from '../../../components/common/Button';
import { theme } from '../../../theme/theme';
import { useEmployerOnboarding } from '../../../context/EmployerOnboardingContext';
import { sendVerificationEmail } from '../../../services/emailService';
import { VERIFICATION_CONSTANTS, ERROR_MESSAGES } from '../../../config/constants';

/**
 * @function Verification
 * @description Main component for handling employer verification process
 * @param {Object} props - Component props
 * @param {Object} props.navigation - React Navigation object for screen navigation
 * @returns {JSX.Element} Verification screen UI
 */
const Verification = ({ navigation }) => {
  const { formData } = useEmployerOnboarding();
  const [verificationStatus, setVerificationStatus] = useState({
    businessEmail: false,
    companyDocs: false,
    emailSent: false,
    gracePeriod: VERIFICATION_CONSTANTS.GRACE_PERIOD_DAYS
  });
  const [selectedDocuments, setSelectedDocuments] = useState([]);

  const { companyInfo, employerType } = formData;
  const isDirectEmployer = employerType.type === 'direct';
  const userEmail = "user@example.com"; // TODO: Get this from auth context

  /**
   * @function canVerifyByEmail
   * @description Checks if the user's email domain matches their company website domain
   * @returns {boolean} True if domains match and verification by email is possible
   */
  const canVerifyByEmail = () => {
    if (!companyInfo.website || !userEmail) return false;
    const websiteDomain = companyInfo.website.replace(/^https?:\/\//, '').split('/')[0];
    const emailDomain = userEmail.split('@')[1];
    return emailDomain === websiteDomain;
  };

  /**
   * @function handleVerificationEmail
   * @description Sends a verification email to the user's business email
   * @async
   * @throws {Error} When email sending fails
   * @returns {Promise<void>}
   */
  const handleVerificationEmail = async () => {
    try {
      const response = await sendVerificationEmail(userEmail, companyInfo.name);
      setVerificationStatus(prev => ({ ...prev, emailSent: true }));
      Alert.alert(
        "Verification Email Sent",
        "Please check your business email and click the verification link to complete the process."
      );
    } catch (error) {
      Alert.alert("Error", ERROR_MESSAGES.EMAIL_SEND_FAILED);
    }
  };

  /**
   * @function handleDocumentUpload
   * @description Handles document selection and upload for business verification
   * @async
   * @throws {Error} When document upload fails or file size exceeds limit
   * @returns {Promise<void>}
   */
  const handleDocumentUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: VERIFICATION_CONSTANTS.ALLOWED_DOCUMENT_TYPES,
      });
      
      if (!result.canceled && result.assets) {
        // Check file size
        const isValidSize = result.assets.every(
          asset => asset.size <= VERIFICATION_CONSTANTS.MAX_DOCUMENT_SIZE
        );

        if (!isValidSize) {
          Alert.alert("Error", `Maximum file size allowed is ${VERIFICATION_CONSTANTS.MAX_DOCUMENT_SIZE / (1024 * 1024)}MB`);
          return;
        }

        const newDocs = result.assets.map(asset => ({
          uri: asset.uri,
          name: asset.name,
          type: asset.mimeType,
          size: asset.size
        }));
        
        setSelectedDocuments(prev => [...prev, ...newDocs]);
        
        Alert.alert(
          "Documents Uploaded",
          `Your documents have been uploaded and will be verified within ${VERIFICATION_CONSTANTS.DOCUMENT_VERIFICATION_TIME}.`
        );
      }
    } catch (error) {
      Alert.alert("Error", ERROR_MESSAGES.DOCUMENT_UPLOAD_FAILED);
    }
  };

  /**
   * @function renderVerificationMethod
   * @description Renders the appropriate verification UI based on employer type and email status
   * @returns {JSX.Element} Verification method UI component
   */
  const renderVerificationMethod = () => {
    if (isDirectEmployer && canVerifyByEmail()) {
      return (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Business Email Verification</Text>
          <Text style={styles.description}>
            Your email domain matches your company's domain. Verify your account using your business email.
          </Text>
          {!verificationStatus.emailSent ? (
            <Button
              title="Send Verification Email"
              onPress={handleVerificationEmail}
              style={styles.actionButton}
            />
          ) : (
            <Text style={styles.sentText}>Verification email sent. Please check your inbox.</Text>
          )}
        </View>
      );
    }

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {isDirectEmployer ? 'Company Document Verification' : 'Agency Document Verification'}
        </Text>
        <Text style={styles.description}>
          {isDirectEmployer 
            ? 'Please upload any official company documents (registration, tax documents, etc.) to verify your company.'
            : 'Please upload your agency\'s registration documents and any relevant certifications.'}
        </Text>
        <View style={styles.documentList}>
          {selectedDocuments.map((doc, index) => (
            <View key={index} style={styles.documentItem}>
              <MaterialIcons name="description" size={24} color={theme.colors.primary.main} />
              <Text style={styles.documentName} numberOfLines={1}>{doc.name}</Text>
            </View>
          ))}
        </View>
        <Button
          title="Upload Documents"
          onPress={handleDocumentUpload}
          style={styles.actionButton}
        />
      </View>
    );
  };

  /**
   * @function handleContinue
   * @description Handles navigation to Dashboard after verification process
   * @returns {void}
   */
  const handleContinue = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Dashboard' }],
    });
  };

  return (
    <Container>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Verify Your Account</Text>
        <Text style={styles.subtitle}>
          {isDirectEmployer
            ? 'To ensure the security of our platform, we need to verify your company.'
            : 'To ensure the quality of our platform, we need to verify your recruitment agency.'}
        </Text>
        
        {renderVerificationMethod()}
        
        <View style={styles.gracePeriodInfo}>
          <MaterialIcons name="info" size={24} color={theme.colors.primary.main} />
          <Text style={styles.gracePeriodText}>
            You have a {verificationStatus.gracePeriod}-day grace period to complete the verification.
            You can continue using the app during this time.
          </Text>
        </View>

        <Button
          title="Continue to Dashboard"
          onPress={handleContinue}
          style={styles.continueButton}
        />
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  title: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary.main,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral.grey,
    marginBottom: theme.spacing.xl,
  },
  section: {
    backgroundColor: theme.colors.neutral.lightGrey,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    marginBottom: theme.spacing.md,
  },
  description: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral.grey,
    marginBottom: theme.spacing.lg,
  },
  actionButton: {
    marginBottom: theme.spacing.md,
  },
  sentText: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.accent.success,
    marginTop: theme.spacing.sm,
  },
  documentList: {
    marginTop: theme.spacing.md,
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.neutral.white,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
  },
  documentName: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral.darkGrey,
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  gracePeriodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.neutral.lightGrey,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.xl,
  },
  gracePeriodText: {
    flex: 1,
    marginLeft: theme.spacing.sm,
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.accent.warning,
  },
  continueButton: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
});

export default Verification;
