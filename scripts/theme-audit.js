const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Function to escape special characters in grep patterns
function escapeGrepPattern(pattern) {
  return pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Define patterns to search for
const THEME_PATTERNS = {
  colors: {
    incorrect: [
      'theme.colors.white',
      'theme.colors.text',
      'theme.colors.surface',
      'theme.colors.border',
      'theme.colors.error',
      'theme.colors.primary:',
      'theme.colors.background',
      'theme.colors.gray'
    ],
    correct: {
      'theme.colors.white': 'theme.colors.neutral.white',
      'theme.colors.text': 'theme.colors.neutral.darkGrey',
      'theme.colors.surface': 'theme.colors.neutral.background',
      'theme.colors.border': 'theme.colors.neutral.lightGrey',
      'theme.colors.error': 'theme.colors.accent.error',
      'theme.colors.primary:': 'theme.colors.primary.main',
      'theme.colors.background': 'theme.colors.neutral.background',
      'theme.colors.gray': 'theme.colors.neutral.grey'
    }
  },
  spacing: {
    incorrect: [
      'padding: [0-9]',
      'margin: [0-9]',
      'gap: [0-9]',
      'paddingHorizontal: [0-9]',
      'paddingVertical: [0-9]',
      'marginHorizontal: [0-9]',
      'marginVertical: [0-9]'
    ],
    correct: {
      'padding: [0-9]': 'Use theme.spacing tokens (xs, sm, md, lg, xl)',
      'margin: [0-9]': 'Use theme.spacing tokens (xs, sm, md, lg, xl)',
      'gap: [0-9]': 'Use theme.spacing tokens (xs, sm, md, lg, xl)',
      'paddingHorizontal: [0-9]': 'Use theme.spacing tokens',
      'paddingVertical: [0-9]': 'Use theme.spacing tokens',
      'marginHorizontal: [0-9]': 'Use theme.spacing tokens',
      'marginVertical: [0-9]': 'Use theme.spacing tokens'
    }
  },
  typography: {
    incorrect: [
      'fontSize: [0-9]',
      'fontWeight: [0-9]',
      'lineHeight: [0-9]'
    ],
    correct: {
      'fontSize: [0-9]': 'Use theme.typography.fontSize tokens',
      'fontWeight: [0-9]': 'Use theme.typography.fontWeight tokens',
      'lineHeight: [0-9]': 'Use theme.typography.lineHeight tokens'
    }
  },
  borderRadius: {
    incorrect: [
      'borderRadius: [0-9]'
    ],
    correct: {
      'borderRadius: [0-9]': 'Use theme.borderRadius tokens (sm, md, lg, xl, full)'
    }
  },
  shadows: {
    incorrect: [
      'elevation: [0-9]',
      'shadowRadius: [0-9]',
      'shadowOpacity: 0'
    ],
    correct: {
      'elevation: [0-9]': 'Use theme.shadows tokens (sm, md, lg)',
      'shadowRadius: [0-9]': 'Use theme.shadows tokens',
      'shadowOpacity: 0': 'Use theme.shadows tokens'
    }
  }
};

// Files to ignore during audit
const IGNORED_FILES = [
  'theme.js',        // Base theme definitions
  'shadows.js',      // Shadow system definitions
  'constants.js',    // Constants and base values
  'tokens.js'        // Design tokens
];

// Function to check if file should be ignored
function shouldIgnoreFile(filePath) {
  return IGNORED_FILES.some(ignoredFile => filePath.endsWith(ignoredFile));
}

// Function to search files
function searchFiles(dir, pattern) {
  try {
    pattern = pattern.replace(/\\/g, '');
    const excludePattern = IGNORED_FILES.map(file => `--exclude="${file}"`).join(' ');
    const command = `grep -r "${pattern}" ${dir} ${excludePattern} --include="*.js" --include="*.jsx"`;
    return execSync(command, { encoding: 'utf8' });
  } catch (error) {
    if (error.status === 1) {
      return '';
    }
    throw error;
  }
}

// Main audit function
function auditTheme(sourceDir) {
  const results = {
    issues: [],
    summary: {
      totalFiles: 0,
      filesWithIssues: 0,
      totalIssues: 0,
      ignoredFiles: IGNORED_FILES.length
    }
  };

  // Search for each incorrect pattern
  Object.keys(THEME_PATTERNS).forEach(category => {
    THEME_PATTERNS[category].incorrect.forEach(pattern => {
      const matches = searchFiles(sourceDir, pattern);
      if (matches) {
        matches.split('\n').forEach(match => {
          if (match) {
            const [file, ...rest] = match.split(':');
            if (!shouldIgnoreFile(file)) {
              const line = rest.join(':');
              results.issues.push({
                file: file,
                line: line.trim(),
                pattern: pattern,
                suggestion: THEME_PATTERNS[category].correct[pattern] || 'See theme guide'
              });
            }
          }
        });
      }
    });
  });

  // Update summary
  const affectedFiles = new Set(results.issues.map(issue => issue.file));
  results.summary.filesWithIssues = affectedFiles.size;
  results.summary.totalIssues = results.issues.length;

  return results;
}

// Generate report
function generateReport(results) {
  let report = '# Theme Audit Report\n\n';
  
  report += '## Summary\n';
  report += `- Files with issues: ${results.summary.filesWithIssues}\n`;
  report += `- Total issues found: ${results.summary.totalIssues}\n`;
  report += `- Files ignored: ${results.summary.ignoredFiles} (base theme definitions)\n\n`;

  if (results.issues.length === 0) {
    report += '## Status\n';
    report += 'No issues found! All components are using theme tokens correctly.\n\n';
    return report;
  }

  report += '## Detailed Issues\n\n';
  const groupedByFile = {};
  
  results.issues.forEach(issue => {
    if (!groupedByFile[issue.file]) {
      groupedByFile[issue.file] = [];
    }
    groupedByFile[issue.file].push(issue);
  });

  Object.entries(groupedByFile).forEach(([file, issues]) => {
    report += `### ${file}\n`;
    issues.forEach(issue => {
      report += `- Found: \`${issue.pattern}\`\n`;
      report += `  - Line: ${issue.line}\n`;
      report += `  - Suggestion: Use \`${issue.suggestion}\`\n`;
    });
    report += '\n';
  });

  report += '\n## Ignored Files\n';
  report += 'The following files were ignored as they contain base theme definitions:\n';
  IGNORED_FILES.forEach(file => {
    report += `- ${file}\n`;
  });

  return report;
}

// Run audit if called directly
if (require.main === module) {
  const sourceDir = process.argv[2] || path.join(__dirname, '..', 'frontend', 'src');
  const results = auditTheme(sourceDir);
  const report = generateReport(results);
  
  // Write report to file
  const reportPath = path.join(__dirname, '..', 'docs', 'THEME_AUDIT_REPORT.md');
  fs.writeFileSync(reportPath, report);
  
  console.log(`Audit complete. Report written to ${reportPath}`);
  console.log(`Found ${results.summary.totalIssues} issues in ${results.summary.filesWithIssues} files.`);
  console.log(`Ignored ${results.summary.ignoredFiles} base theme definition files.`);
}
