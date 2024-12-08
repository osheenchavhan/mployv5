import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Container from '../../components/common/Container';
import { theme } from '../../theme/theme';

const Profile = () => {
  return (
    <Container>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Company Profile</Text>
        {/* TODO: Implement company profile view and edit functionality */}
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
    marginBottom: theme.spacing.lg,
  },
});

export default Profile;
