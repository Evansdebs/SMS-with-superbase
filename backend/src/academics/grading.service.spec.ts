import { GradingService } from './grading.service';

describe('GradingService & Ghana BECE Aggregate Engine', () => {
  let service: GradingService;

  beforeEach(() => {
    service = new GradingService();
  });

  describe('Stanine 9-point scale', () => {
    it('should map scores correctly according to WAEC / BECE stanine boundaries', () => {
      expect(service.calculateStanineGrade(92).grade).toBe(1);
      expect(service.calculateStanineGrade(80).grade).toBe(1);
      expect(service.calculateStanineGrade(75).grade).toBe(2);
      expect(service.calculateStanineGrade(68).grade).toBe(3);
      expect(service.calculateStanineGrade(61).grade).toBe(4);
      expect(service.calculateStanineGrade(57).grade).toBe(5);
      expect(service.calculateStanineGrade(52).grade).toBe(6);
      expect(service.calculateStanineGrade(47).grade).toBe(7);
      expect(service.calculateStanineGrade(42).grade).toBe(8);
      expect(service.calculateStanineGrade(38).grade).toBe(9);
      expect(service.calculateStanineGrade(0).grade).toBe(9);
    });
  });

  describe('calculateBECEAggregate', () => {
    it('should sum 4 core subjects and select exactly the best 2 non-core electives', () => {
      const studentSubjects = [
        // 4 Core Subjects
        { subjectName: 'English Language', isCore: true, score: 85 }, // Grade 1
        { subjectName: 'Mathematics', isCore: true, score: 78 },     // Grade 2
        { subjectName: 'Integrated Science', isCore: true, score: 82 }, // Grade 1
        { subjectName: 'Social Studies', isCore: true, score: 72 },   // Grade 2
        // Core sum: 1 + 2 + 1 + 2 = 6

        // 4 Additional Electives
        { subjectName: 'ICT', isCore: false, score: 90 },             // Grade 1 (Best elective 1)
        { subjectName: 'Ghanaian Language', isCore: false, score: 74 },// Grade 2 (Best elective 2)
        { subjectName: 'RME', isCore: false, score: 62 },             // Grade 4 (Should be dropped)
        { subjectName: 'BDT', isCore: false, score: 51 },             // Grade 6 (Should be dropped)
      ];

      const result = service.calculateBECEAggregate(studentSubjects);

      // Best electives: ICT (1) + Ghanaian Language (2) = 3
      // Expected Aggregate: 6 + 3 = 9
      expect(result.aggregate).toBe(9);
      expect(result.coreCount).toBe(4);
      expect(result.electiveCount).toBe(2);

      const ict = result.subjects.find((s) => s.subjectName === 'ICT');
      const ghl = result.subjects.find((s) => s.subjectName === 'Ghanaian Language');
      const rme = result.subjects.find((s) => s.subjectName === 'RME');

      expect(ict?.isSelectedInAggregate).toBe(true);
      expect(ghl?.isSelectedInAggregate).toBe(true);
      expect(rme?.isSelectedInAggregate).toBe(false);
    });
  });
});
