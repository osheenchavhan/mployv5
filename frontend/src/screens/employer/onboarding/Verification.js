import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Container from '../../../components/common/Container';
import Button from '../../../components/common/Button';
import { theme } from '../../../theme/theme';

const Verification = ({ navigation }) => {
  return (
    <Container>
      <View style={styles.container}>
        <Text style={styles.title}>Verification</Text>
        <Text style={styles.subtitle}>Verify your company details</Text>
        
        {/* TODO: Add company verification form */}
        
        <View style={styles.buttonContainer}>
          <Button 
            title="Back"
            variant="outline"
            onPress={() => navigation.goBack()}
            style={styles.button}
          />
          <Button 
            title="Submit"
            onPress={() => {
              // TODO: Submit verification and navigate to main app
            }}
            style={styles.button}
          />
        </View>
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto',
  },
  button: {
    flex: 1,
    marginHorizontal: theme.spacing.xs,
  },
});

export default Verification;
