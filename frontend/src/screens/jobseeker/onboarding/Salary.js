import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Container from '../../../components/common/Container';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import Chip from '../../../components/common/Chip';
import Slider from '@react-native-community/slider';
import { theme } from '../../../theme/theme';

const SALARY_FORMATS = ['Monthly', 'Yearly'];

const Salary = ({ navigation }) => {
  const [salaryFormat, setSalaryFormat] = useState('Monthly');
  const [minSalary, setMinSalary] = useState('');
  const [maxSalary, setMaxSalary] = useState('');
  const [minThreshold, setMinThreshold] = useState(0);
  const [errors, setErrors] = useState({});

  const handleFinish = () => {
    const newErrors = {};
    if (!minSalary) newErrors.minSalary = 'Minimum salary is required';
    if (!maxSalary) newErrors.maxSalary = 'Maximum salary is required';
    if (Number(minSalary) > Number(maxSalary)) {
      newErrors.maxSalary = 'Maximum salary should be greater than minimum salary';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Navigate to SwipeJobs screen
    navigation.reset({
      index: 0,
      routes: [{ name: 'SwipeJobs' }],
    });
  };

  return (
    <Container>
      <View style={styles.container}>
        <Text style={styles.title}>Salary Expectations</Text>
        <Text style={styles.subtitle}>What are your salary expectations?</Text>
        
        <Text style={styles.label}>Salary Format</Text>
        <View style={styles.formatContainer}>
          {SALARY_FORMATS.map((format) => (
            <Chip
              key={format}
              label={format}
              variant="choice"
              selected={salaryFormat === format}
              onPress={() => setSalaryFormat(format)}
            />
          ))}
        </View>

        <Text style={styles.label}>Expected Salary Range</Text>
        <View style={styles.rangeContainer}>
          <View style={styles.salaryInput}>
            <Text style={styles.currencySymbol}>₹</Text>
            <Input
              placeholder={salaryFormat === 'Monthly' ? "30,000" : "3,60,000"}
              value={minSalary}
              onChangeText={setMinSalary}
              keyboardType="numeric"
              error={errors.minSalary}
              style={{ flex: 1 }}
            />
          </View>
          <Text style={styles.toText}>to</Text>
          <View style={styles.salaryInput}>
            <Text style={styles.currencySymbol}>₹</Text>
            <Input
              placeholder={salaryFormat === 'Monthly' ? "50,000" : "6,00,000"}
              value={maxSalary}
              onChangeText={setMaxSalary}
              keyboardType="numeric"
              error={errors.maxSalary}
              style={{ flex: 1 }}
            />
          </View>
        </View>

        <Text style={styles.label}>Minimum Salary Threshold</Text>
        <Text style={styles.thresholdNote}>Don't show jobs below this amount</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={Number(maxSalary) || 100000}
          value={minThreshold}
          onValueChange={setMinThreshold}
          minimumTrackTintColor={theme.colors.primary.main}
          maximumTrackTintColor={theme.colors.neutral.lightGrey}
          thumbTintColor={theme.colors.primary.main}
        />
        <Text style={styles.thresholdValue}>
          ₹{minThreshold.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
        </Text>

        <View style={styles.buttonContainer}>
          <Button 
            title="Back"
            variant="outline"
            onPress={() => navigation.goBack()}
            style={styles.button}
          />
          <Button 
            title="Finish"
            onPress={handleFinish}
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
  label: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: '500',
    marginBottom: theme.spacing.xs,
    color: theme.colors.neutral.black,
  },
  formatContainer: {
    flexDirection: 'row',
    marginBottom: theme.spacing.lg,
  },
  rangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  salaryInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencySymbol: {
    fontSize: theme.typography.fontSize.lg,
    marginRight: theme.spacing.xs,
    color: theme.colors.neutral.darkGrey,
  },
  toText: {
    marginHorizontal: theme.spacing.sm,
    color: theme.colors.neutral.darkGrey,
  },
  slider: {
    width: '100%',
    height: 40,
    marginBottom: theme.spacing.sm,
  },
  thresholdNote: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral.darkGrey,
    marginBottom: theme.spacing.sm,
  },
  thresholdValue: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.primary.main,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
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

export default Salary;
