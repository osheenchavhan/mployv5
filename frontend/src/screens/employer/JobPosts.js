import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Container from '../../components/common/Container';
import Button from '../../components/common/Button';
import { theme } from '../../theme/theme';
import { getEmployerJobs } from '../../services/firebase/jobs';
import { useUser } from '../../context/UserContext';

const JobStatusBadge = ({ status }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'active':
        return theme.colors.success;
      case 'draft':
        return theme.colors.warning;
      case 'paused':
        return theme.colors.info;
      case 'closed':
        return theme.colors.accent.error;
      default:
        return theme.colors.neutral.grey;
    }
  };

  return (
    <View style={[styles.badge, { backgroundColor: getStatusColor() }]}>
      <Text style={styles.badgeText}>{status.toUpperCase()}</Text>
    </View>
  );
};

const JobCard = ({ job }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity 
      style={styles.jobCard}
      onPress={() => navigation.navigate('PostJob', { jobId: job.id })}
    >
      <View style={styles.jobHeader}>
        <Text style={styles.jobTitle}>{job.title}</Text>
        <JobStatusBadge status={job.status} />
      </View>
      
      <Text style={styles.jobDescription} numberOfLines={2}>
        {job.description}
      </Text>
      
      <View style={styles.jobFooter}>
        <Text style={styles.jobMeta}>
          {job.employmentType} • {job.experienceLevel}
        </Text>
        <Text style={styles.salary}>
          ₹{job.salary.amount.toLocaleString()}/{job.salary.type}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const JobPosts = () => {
  const navigation = useNavigation();
  const { user } = useUser();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const jobsData = await getEmployerJobs(user.uid);
      setJobs(jobsData);
    } catch (err) {
      console.error('Error loading jobs:', err);
      setError('Failed to load jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Job Posts</Text>
          <Button
            onPress={() => navigation.navigate('PostJob')}
            style={styles.createButton}
          >
            Create New
          </Button>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={theme.colors.primary} />
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <Button onPress={loadJobs} style={styles.retryButton}>
              Retry
            </Button>
          </View>
        ) : jobs.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No jobs posted yet</Text>
            <Text style={styles.emptySubText}>
              Create your first job posting to start finding candidates
            </Text>
          </View>
        ) : (
          jobs.map((job) => <JobCard key={job.id} job={job} />)
        )}
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.neutral.white,
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
  jobCard: {
    backgroundColor: theme.colors.neutral.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    ...Platform.select({
      ios: theme.shadows.md,
      android: {
        elevation: theme.shadows.md.elevation,
      },
    }),
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  jobTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.neutral.darkGrey,
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  badge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
  },
  badgeText: {
    color: theme.colors.neutral.white,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.medium,
  },
  jobDescription: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral.grey,
    marginBottom: theme.spacing.md,
  },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  jobMeta: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral.grey,
  },
  salary: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.primary.main,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  errorText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.accent.error,
    marginTop: theme.spacing.xs,
  },
  retryButton: {
    minWidth: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.xl * 2,
  },
  emptyText: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.neutral.darkGrey,
    marginBottom: theme.spacing.sm,
  },
  emptySubText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral.grey,
    textAlign: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
});

export default JobPosts;
