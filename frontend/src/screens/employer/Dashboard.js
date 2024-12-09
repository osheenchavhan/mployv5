import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Container from '../../components/common/Container';
import { theme } from '../../theme/theme';

const DashboardCard = ({ title, value, icon, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <MaterialIcons name={icon} size={24} color={theme.colors.primary.main} />
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.cardValue}>{value}</Text>
  </TouchableOpacity>
);

const Dashboard = ({ navigation }) => {
  const stats = {
    activeJobs: 0,
    totalApplications: 0,
    shortlisted: 0,
    interviews: 0,
  };

  return (
    <Container>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Dashboard</Text>
            <TouchableOpacity 
              onPress={() => navigation.navigate('Settings')}
              style={styles.settingsButton}
            >
              <MaterialIcons name="settings" size={24} color={theme.colors.primary.main} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity 
            style={styles.createJobButton}
            onPress={() => navigation.navigate('CreateJob')}
          >
            <MaterialIcons name="add" size={24} color={theme.colors.primary.contrast} />
            <Text style={styles.createJobText}>Post a Job</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsGrid}>
          <DashboardCard
            title="Active Jobs"
            value={stats.activeJobs}
            icon="work"
            onPress={() => navigation.navigate('JobPosts')}
          />
          <DashboardCard
            title="Applications"
            value={stats.totalApplications}
            icon="people"
            onPress={() => navigation.navigate('Applications')}
          />
          <DashboardCard
            title="Shortlisted"
            value={stats.shortlisted}
            icon="person-search"
            onPress={() => navigation.navigate('Shortlisted')}
          />
          <DashboardCard
            title="Interviews"
            value={stats.interviews}
            icon="event"
            onPress={() => navigation.navigate('Interviews')}
          />
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityList}>
            <Text style={styles.emptyText}>No recent activity</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionList}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('Profile')}
            >
              <MaterialIcons name="business" size={24} color={theme.colors.primary.main} />
              <Text style={styles.actionText}>Company Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('Settings')}
            >
              <MaterialIcons name="settings" size={24} color={theme.colors.primary.main} />
              <Text style={styles.actionText}>Settings</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    marginBottom: theme.spacing.xl,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  title: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary.main,
  },
  settingsButton: {
    padding: theme.spacing.sm,
  },
  createJobButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary.main,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  createJobText: {
    color: theme.colors.primary.contrast,
    marginLeft: theme.spacing.xs,
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xl,
  },
  card: {
    width: '48%',
    backgroundColor: theme.colors.neutral.lightGrey,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
    alignItems: 'center',
  },
  cardTitle: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral.grey,
    marginTop: theme.spacing.sm,
  },
  cardValue: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary.main,
    marginTop: theme.spacing.xs,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.neutral.darkGrey,
    marginBottom: theme.spacing.md,
  },
  activityList: {
    backgroundColor: theme.colors.neutral.lightGrey,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    minHeight: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral.grey,
  },
  actionList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -theme.spacing.xs,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.neutral.lightGrey,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginHorizontal: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
  },
  actionText: {
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.primary.main,
    marginLeft: theme.spacing.sm,
  },
});

export default Dashboard;
