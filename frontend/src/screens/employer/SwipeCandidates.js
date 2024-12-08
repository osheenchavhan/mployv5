import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Container from '../../components/common/Container';
import { theme } from '../../theme/theme';

const SwipeCandidates = () => {
  return (
    <Container>
      <View style={styles.container}>
        <Text style={styles.title}>Candidates</Text>
        <Text style={styles.subtitle}>Swipe right to shortlist, left to pass</Text>
        {/* TODO: Implement candidate card swiping functionality */}
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
  },
});

export default SwipeCandidates;
