import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Container from '../../../components/common/Container';
import Button from '../../../components/common/Button';
import { theme } from '../../../theme/theme';

const Location = ({ navigation }) => {
  return (
    <Container>
      <View style={styles.container}>
        <Text style={styles.title}>Location</Text>
        <Text style={styles.subtitle}>Where is your company located?</Text>
        
        {/* TODO: Add location selection functionality */}
        
        <View style={styles.buttonContainer}>
          <Button 
            title="Back"
            variant="outline"
            onPress={() => navigation.goBack()}
            style={styles.button}
          />
          <Button 
            title="Next"
            onPress={() => navigation.navigate('Verification')}
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

export default Location;
