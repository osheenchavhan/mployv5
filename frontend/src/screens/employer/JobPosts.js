import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Container from '../../components/common/Container';
import Button from '../../components/common/Button';
import { theme } from '../../theme/theme';

const JobPosts = () => {
  return (
    <Container>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Job Posts</Text>
          <Button
            title="Create New"
            variant="outline"
            style={styles.createButton}
            // TODO: Implement job creation
          />
        </View>
        {/* TODO: Implement job posts list */}
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary.main,
  },
  createButton: {
    minWidth: 120,
  },
});

export default JobPosts;
