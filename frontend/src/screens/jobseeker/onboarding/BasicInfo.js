import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Container from '../../../components/common/Container';
import Button from '../../../components/common/Button';
import { theme } from '../../../theme/theme';

const BasicInfo = ({ navigation }) => {
  return (
    <Container>
      <View style={styles.container}>
        <Text style={styles.title}>Basic Information</Text>
        <Text style={styles.subtitle}>Tell us about yourself</Text>
        
        {/* TODO: Add form fields for basic information */}
        
        <Button 
          title="Next"
          onPress={() => navigation.navigate('Location')}
          style={styles.button}
        />
      </View>
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
  button: {
    marginTop: 'auto',
  },
});

export default BasicInfo;
