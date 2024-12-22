/**
 * Why this screen exists:
 * Managing job postings needs to be simple. This screen helps employers:
 * 1. Handle all job listings in one place:
 *    - Create new job posts
 *    - Edit existing posts
 *    - Pause or close positions
 *    - Duplicate successful posts
 * 
 * 2. Monitor posting performance:
 *    - View application counts
 *    - See viewer statistics
 *    - Track candidate quality
 *    - Measure response rates
 * 
 * Think of it as a job board control panel that:
 * - Keeps all job posts organized
 * - Shows which posts are working well
 * - Makes updating jobs quick and easy
 * - Helps improve job descriptions
 * 
 * Without this screen:
 * - Jobs would be scattered and hard to track
 * - Employers couldn't easily update positions
 * - There'd be no way to measure posting success
 * - Managing multiple positions would be chaotic
 * 
 * @fileoverview Manages creation, editing, and monitoring of job postings
 * @package mployv5/screens/employer
 * @lastModified 2024-12-10
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Container from '../../components/common/Container';
import Button from '../../components/common/Button';
import { theme } from '../../theme/theme';
import { jobsApi } from '../../services/api/jobs';
import { useUser } from '../../context/UserContext';

/**
 * @function JobStatusBadge
 * @description Component for displaying job status with appropriate color coding
 * @param {Object} props - Component props
 * @param {string} props.status - Job status ('active', 'draft', 'paused', or 'closed')
 * @returns {JSX.Element} Status badge UI
 */
const JobStatusBadge = ({ status }) => {
  /**
   * @function getStatusColor
   * @description Determines the color for job status badge
   * @returns {string} Color code for the status
   */
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

/**
 * @function JobCard
 * @description Component for displaying individual job posting details
 * @param {Object} props - Component props
 * @param {Object} props.job - Job posting data
 * @param {string} props.job.id - Unique identifier for the job
 * @param {string} props.job.title - Job title
 * @param {string} props.job.description - Job description
 * @param {string} props.job.status - Current status of the job
 * @param {string} props.job.employmentType - Type of employment (full-time, part-time, etc.)
 * @param {string} props.job.experienceLevel - Required experience level
 * @param {Object} props.job.salary - Salary information
 * @returns {JSX.Element} Job card UI
 */
const JobCard = ({ job }) => {
  const navigation = useNavigation();
  const { user } = useUser();
  const isAgency = user?.employerType === 'agency';

  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => navigation.navigate('PostJob', { jobId: job.id })}
    >
      <View style={styles.jobHeader}>
        <View style={styles.jobTitleContainer}>
          <Text style={styles.jobTitle}>{job.title}</Text>
          {isAgency && job.company?.name && (
            <Text style={styles.companyName}>
              {job.company.name}
            </Text>
          )}
        </View>
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

/**
 * @function JobPosts
 * @description Main component for managing and displaying job postings
 * @returns {JSX.Element} Job posts management UI
 */
const JobPosts = () => {
  const navigation = useNavigation();
  const { user } = useUser();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadJobs();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadJobs();
    });

    return unsubscribe;
  }, [navigation]);

  /**
   * @function loadJobs
   * @description Fetches all job postings for the current employer
   * @async
   * @throws {Error} When job data fetching fails
   * @returns {Promise<void>}
   */
  const loadJobs = async () => {
    try {
      setLoading(true);
      const data = await jobsApi.getEmployerJobs(user.uid);
      setJobs(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Job Posts</Text>
          <Text style={styles.subtitle}>
            Manage and track all your job listings
          </Text>

          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => navigation.navigate('PostJob')}
            >
              <Text style={styles.createButtonText}>Create New</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary.main} />
            </View>
          ) : error ? (
            <View style={styles.card}>
              <View style={styles.centerContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity
                  style={[styles.button, styles.retryButton]}
                  onPress={loadJobs}
                >
                  <Text style={styles.buttonText}>Retry</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : jobs.length === 0 ? (
            <View style={styles.card}>
              <View style={styles.centerContainer}>
                <Text style={styles.emptyText}>No jobs posted yet</Text>
                <Text style={styles.emptySubText}>
                  Create your first job posting to start finding candidates
                </Text>
                <TouchableOpacity
                  style={[styles.button, styles.createFirstButton]}
                  onPress={() => navigation.navigate('PostJob')}
                >
                  <Text style={styles.buttonText}>Create First Job</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.jobsList}>
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.lg,
  },
  title: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary.main,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral.grey,
    marginBottom: theme.spacing.xl,
  },
  headerActions: {
    marginBottom: theme.spacing.xl,
  },
  createButton: {
    backgroundColor: theme.colors.primary.main,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    alignSelf: 'flex-start',
  },
  createButtonText: {
    color: theme.colors.neutral.white,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.medium,
  },
  card: {
    backgroundColor: theme.colors.neutral.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    ...Platform.select({
      ios: theme.shadows.md,
      android: {
        elevation: theme.shadows.md.elevation,
      },
    }),
  },
  jobsList: {
    gap: theme.spacing.lg,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  jobTitleContainer: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  jobTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.neutral.darkGrey,
    marginBottom: theme.spacing.xs,
  },
  companyName: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary.main,
    fontWeight: theme.typography.fontWeight.medium,
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
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  errorText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.accent.error,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  button: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primary.main,
  },
  buttonText: {
    color: theme.colors.neutral.white,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.medium,
  },
  retryButton: {
    backgroundColor: theme.colors.accent.error,
  },
  createFirstButton: {
    marginTop: theme.spacing.lg,
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
    marginBottom: theme.spacing.lg,
  },
});

export default JobPosts;
