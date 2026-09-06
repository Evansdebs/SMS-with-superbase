import { Injectable, BadRequestException } from '@nestjs/common';

export interface SubjectScoreInput {
  subjectName: string;
  isCore: boolean;
  score: number; // 0 to 100
}

export interface GradedSubject {
  subjectName: string;
  isCore: boolean;
  score: number;
  grade: number;
  remark: string;
  isSelectedInAggregate: boolean;
}

export interface BECEAggregateResult {
  aggregate: number; // Minimum 6 (6 ones), Maximum 54 (6 nines)
  coreCount: number;
  electiveCount: number;
  subjects: GradedSubject[];
  remark: string;
}

@Injectable()
export class GradingService {
  /**
   * Standard Ghana BECE 9-point Stanine grading scale (1 is highest, 9 is fail)
   */
  calculateStanineGrade(score: number): { grade: number; remark: string } {
    const clamped = Math.max(0, Math.min(100, Math.round(score)));

    if (clamped >= 80) return { grade: 1, remark: 'Highest (Distinction)' };
    if (clamped >= 70) return { grade: 2, remark: 'Higher (Distinction)' };
    if (clamped >= 65) return { grade: 3, remark: 'High (Credit)' };
    if (clamped >= 60) return { grade: 4, remark: 'High Average (Credit)' };
    if (clamped >= 55) return { grade: 5, remark: 'Average (Credit)' };
    if (clamped >= 50) return { grade: 6, remark: 'Low Average (Credit)' };
    if (clamped >= 45) return { grade: 7, remark: 'Low (Pass)' };
    if (clamped >= 40) return { grade: 8, remark: 'Lower (Pass)' };
    return { grade: 9, remark: 'Lowest (Fail)' };
  }

  /**
   * Primary School Standard Letter Grade Scale
   */
  calculatePrimaryGrade(score: number): { grade: string; remark: string } {
    const clamped = Math.max(0, Math.min(100, Math.round(score)));

    if (clamped >= 80) return { grade: 'A', remark: 'Excellent' };
    if (clamped >= 70) return { grade: 'B', remark: 'Very Good' };
    if (clamped >= 60) return { grade: 'C', remark: 'Good' };
    if (clamped >= 50) return { grade: 'D', remark: 'Pass' };
    return { grade: 'F', remark: 'Fail' };
  }

  /**
   * Automatic JHS BECE Aggregate Calculation:
   * Mandatory: 4 Core Subjects (English, Mathematics, Science, Social Studies)
   * Selection: Best 2 Additional Electives (lowest Stanine grade number = highest performance)
   * Total Aggregate = sum of 6 grades
   */
  calculateBECEAggregate(inputs: SubjectScoreInput[]): BECEAggregateResult {
    const gradedList: GradedSubject[] = inputs.map((item) => {
      const { grade, remark } = this.calculateStanineGrade(item.score);
      return {
        subjectName: item.subjectName,
        isCore: item.isCore,
        score: item.score,
        grade,
        remark,
        isSelectedInAggregate: false,
      };
    });

    const cores = gradedList.filter((s) => s.isCore);
    const electives = gradedList.filter((s) => !s.isCore);

    // Sort electives by grade ASC (1 is better than 2, 2 is better than 3...)
    electives.sort((a, b) => a.grade - b.grade || b.score - a.score);

    // Pick 4 core subjects
    cores.forEach((c) => (c.isSelectedInAggregate = true));

    // Pick top 2 electives
    const bestElectives = electives.slice(0, 2);
    bestElectives.forEach((e) => (e.isSelectedInAggregate = true));

    const selectedSubjects = [...cores, ...bestElectives];
    const aggregate = selectedSubjects.reduce((sum, s) => sum + s.grade, 0);

    let remark = 'Average';
    if (aggregate <= 10) remark = 'Excellent / Category A Candidate';
    else if (aggregate <= 18) remark = 'Very Good / High Placement';
    else if (aggregate <= 30) remark = 'Good / Satisfactory';
    else if (aggregate <= 36) remark = 'Fair Pass';
    else remark = 'Needs Remedial Support';

    return {
      aggregate,
      coreCount: cores.length,
      electiveCount: bestElectives.length,
      subjects: gradedList,
      remark,
    };
  }
}
