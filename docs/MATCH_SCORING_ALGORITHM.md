# Match Scoring Algorithm Explained

## Overview
This document explains how we calculate a match score between a job seeker and a job posting. Think of it like a compatibility score in a dating app, but for jobs! The higher the score, the better the match.

## How Scoring Works
We look at 5 main things when calculating a match. Each aspect has different importance (weight) in the final score. The total score will be between 0 and 100.

### 1. Skills Match (30% of total score)
This is the most important factor because having the right skills is crucial for any job.

**How we calculate it:**
- We compare the skills required by the job with the skills the job seeker has
- For each skill that matches exactly: 3 points
- For each skill that's similar but not exact: 1 point
  - Example: "React.js" matches exactly with "React.js" (3 points)
  - Example: "React.js" is similar to "React Native" (1 point)
- Bonus: If you have all the required skills: extra 5 points

**Example:**
```
Job requires: React.js, Node.js, MongoDB
Job seeker has: React.js, Express.js, MongoDB, PostgreSQL
Score: (2 exact matches × 3 points) + (1 related skill × 1 point) = 7 points
Final Skills Score = (7 ÷ maximum possible points) × 30
```

### 2. Experience Match (25% of total score)
We look at both the experience level required and years of experience.

**Experience Levels:**
- Entry Level (0-2 years)
- Mid Level (3-5 years)
- Senior Level (6-10 years)
- Executive Level (10+ years)

**How we calculate it:**
- Perfect level match: 25 points
- One level difference: 15 points
- Two levels difference: 5 points
- Extra points for years of experience:
  - Matches or exceeds requirement: +5 points
  - Within 1 year of requirement: +3 points

**Example:**
```
Job requires: Mid Level (3-5 years)
Job seeker: Entry Level with 2.5 years experience
Score: 15 points (one level difference) + 3 points (close to required years)
Final Experience Score = 18 points out of 25
```

### 3. Salary Match (20% of total score)
We compare the salary expectations of both parties.

**How we calculate it:**
- Salary within 10% range: 20 points
- Salary within 20% range: 15 points
- Salary within 30% range: 10 points
- If either marks salary as negotiable: +5 bonus points

**Example:**
```
Job offers: $80,000/year
Job seeker expects: $85,000/year
Difference: 6.25% (within 10% range)
Score: 20 points
If job seeker marked "negotiable": +5 points
Final Salary Score = 25 points (capped at 20)
```

### 4. Location Match (15% of total score)
Location scoring depends on the job type (remote, onsite, or hybrid).

**For Onsite/Hybrid Jobs:**
- Within job seeker's search radius: 15 points
- Location matches job seeker's preferred locations: +5 points
- Job seeker willing to relocate: +3 points

**For Remote Jobs:**
- Automatic 15 points
- If job has occasional onsite requirements:
  - Apply same rules as onsite jobs but with half points

**Example:**
```
Job: Onsite in New York
Job seeker: 
- Lives in New Jersey
- Search radius includes New York
- New York in preferred locations
Score: 15 points (within radius) + 5 points (preferred location)
Final Location Score = 15 points (capped)
```

### 5. Education Match (10% of total score)
We compare educational requirements with job seeker's qualifications.

**How we calculate it:**
- Degree level matches or exceeds requirement: 10 points
- Relevant field of study: +5 points

**Example:**
```
Job requires: Bachelor's in Computer Science
Job seeker has: Master's in Software Engineering
Score: 10 points (exceeds requirement) + 5 points (relevant field)
Final Education Score = 10 points (capped)
```

## Example of Full Score Calculation

Let's calculate a complete match score:

```
Job Posting:
- Required Skills: React.js, Node.js, MongoDB
- Experience: Mid Level (3-5 years)
- Salary: $80,000/year
- Location: Onsite in New York
- Education: Bachelor's in Computer Science

Job Seeker:
- Skills: React.js, Express.js, MongoDB, PostgreSQL
- Experience: Entry Level (2.5 years)
- Expected Salary: $85,000/year (negotiable)
- Location: New Jersey (New York in preferred locations)
- Education: Master's in Software Engineering

Calculation:
1. Skills: 23/30 points
2. Experience: 18/25 points
3. Salary: 20/20 points
4. Location: 15/15 points
5. Education: 10/10 points

Total Score = 86/100 points (Very Good Match!)
```

## Score Interpretation

- 90-100: Excellent Match 🌟
- 80-89: Very Good Match ⭐
- 70-79: Good Match 👍
- 60-69: Fair Match 🤔
- Below 60: Poor Match 👎

## Technical Implementation Notes

1. **Performance Optimization:**
   - We cache user profiles and job details
   - Calculations happen in background jobs
   - Results are stored for quick retrieval

2. **Score Storage:**
   - We store detailed scoring breakdowns
   - This helps with:
     - Showing match details to users
     - Improving the algorithm
     - Analytics and reporting

3. **Regular Updates:**
   - Scores are recalculated when:
     - Job seeker updates their profile
     - Job posting is modified
     - Every 24 hours for active jobs

## Future Improvements

1. **Skill Matching:**
   - Add AI-powered skill relationship understanding
   - Consider skill levels (beginner, intermediate, expert)
   - Weight recent skills higher than older ones

2. **Experience Quality:**
   - Analyze relevance of past roles
   - Consider industry-specific experience
   - Factor in project complexity

3. **Location Intelligence:**
   - Add commute time calculations
   - Consider public transport availability
   - Factor in remote work preferences

4. **Machine Learning:**
   - Learn from successful matches
   - Adjust weights based on industry
   - Personalize scoring based on user behavior

Remember: This algorithm is continuously improved based on:
- User feedback
- Successful matches
- Industry changes
- New features and data points
