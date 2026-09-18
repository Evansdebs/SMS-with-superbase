import { calculateGhanaPAYE, calculateGhanaSSNIT, calculateGhanaPayroll, GHANA_PAYE_BANDS_MONTHLY } from './payroll.calculator';

describe('Ghana Payroll Calculator', () => {
  // ─── PAYE Tests ───────────────────────────────────────
  describe('calculateGhanaPAYE', () => {
    it('should return 0 for salary within tax-free band (GHS 490)', () => {
      expect(calculateGhanaPAYE(490)).toBe(0);
    });

    it('should apply 5% only on GHS 110 excess above GHS 490', () => {
      const tax = calculateGhanaPAYE(600);
      expect(tax).toBe(5.5); // 110 * 5%
    });

    it('should apply progressive tax on GHS 1,000 salary', () => {
      const tax = calculateGhanaPAYE(1000);
      // 0-490: 0%; 490-600: 5% = 5.5; 600-730: 10% = 13; 730-1000: 17.5% = 47.25
      const expected = 0 + 5.5 + 13 + 47.25;
      expect(tax).toBeCloseTo(expected, 1);
    });

    it('should apply correct progressive tax on GHS 5,000 salary', () => {
      const tax = calculateGhanaPAYE(5000);
      // 0-490: 0
      // 490-600: 5.5
      // 600-730: 13
      // 730-3730: 525 (3000 * 17.5%)
      // 3730-5000: 317.5 (1270 * 25%)
      expect(tax).toBeCloseTo(861, 0);
    });

    it('should not return negative PAYE', () => {
      expect(calculateGhanaPAYE(0)).toBe(0);
      expect(calculateGhanaPAYE(300)).toBe(0);
    });

    it('should apply 30% band for very high salary above GHS 20,125', () => {
      const tax = calculateGhanaPAYE(25000);
      expect(tax).toBeGreaterThan(calculateGhanaPAYE(20125));
    });
  });

  // ─── SSNIT Tests ─────────────────────────────────────
  describe('calculateGhanaSSNIT', () => {
    it('should calculate 13.5% employer tier 1 on GHS 2,000', () => {
      const { tier1Employer } = calculateGhanaSSNIT(2000);
      expect(tier1Employer).toBeCloseTo(270, 2);
    });

    it('should calculate 5.5% employee tier 2 on GHS 2,000', () => {
      const { tier2Employee } = calculateGhanaSSNIT(2000);
      expect(tier2Employee).toBeCloseTo(110, 2);
    });

    it('should handle zero salary', () => {
      const { tier1Employer, tier2Employee } = calculateGhanaSSNIT(0);
      expect(tier1Employer).toBe(0);
      expect(tier2Employee).toBe(0);
    });
  });

  // ─── Full Payroll Calculation ─────────────────────────
  describe('calculateGhanaPayroll', () => {
    it('should correctly compute gross, paye, ssnit and net', () => {
      const result = calculateGhanaPayroll({
        basicSalary: 3000,
        housingAllowance: 500,
        transportAllowance: 200,
      });

      expect(result.grossSalary).toBe(3700);
      expect(result.ssnitTier2Employee).toBeCloseTo(203.5, 1); // 3700 * 5.5%
      expect(result.taxableIncome).toBeCloseTo(3496.5, 0);
      expect(result.paye).toBeGreaterThan(0);
      expect(result.netSalary).toBeLessThan(result.grossSalary);
      expect(result.netSalary).toBeGreaterThan(0);
    });

    it('should deduct loans from net salary', () => {
      const withLoan = calculateGhanaPayroll({ basicSalary: 2000, loansAdvance: 500 });
      const withoutLoan = calculateGhanaPayroll({ basicSalary: 2000 });
      expect(withLoan.netSalary).toBeCloseTo(withoutLoan.netSalary - 500, 1);
    });

    it('net salary should never go below 0', () => {
      const result = calculateGhanaPayroll({ basicSalary: 500, loansAdvance: 99999 });
      expect(result.netSalary).toBeGreaterThanOrEqual(0);
    });

    it('paye + ssnit + deductions should reconcile with gross - net', () => {
      const result = calculateGhanaPayroll({ basicSalary: 4000, housingAllowance: 800 });
      const diff = Math.round((result.grossSalary - result.netSalary) * 100) / 100;
      expect(diff).toBeCloseTo(result.totalDeductions, 1);
    });
  });

  // ─── BECE-like Aggregate ─────────────────────────────
  describe('Ghana Tax Band Configuration', () => {
    it('should have 6 progressive tax bands', () => {
      expect(GHANA_PAYE_BANDS_MONTHLY.length).toBe(6);
    });

    it('should have ascending band maxima', () => {
      const maxima = GHANA_PAYE_BANDS_MONTHLY.filter(b => b.max !== null).map(b => b.max as number);
      for (let i = 1; i < maxima.length; i++) {
        expect(maxima[i]).toBeGreaterThan(maxima[i - 1]);
      }
    });

    it('last band should have null max (unlimited)', () => {
      expect(GHANA_PAYE_BANDS_MONTHLY[GHANA_PAYE_BANDS_MONTHLY.length - 1].max).toBeNull();
    });
  });
});
