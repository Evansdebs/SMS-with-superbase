/**
 * Ghana GRA PAYE Income Tax Calculator (2024/2025 bands)
 * Source: Ghana Revenue Authority personal income tax bands
 *
 * Monthly bands:
 *  First GHS 490       → 0%
 *  Next  GHS 110       → 5%
 *  Next  GHS 130       → 10%
 *  Next  GHS 3,000     → 17.5%
 *  Next  GHS 16,395    → 25%
 *  Above GHS 20,000    → 30%
 *
 * NOTE: These bands are stored here as configuration, NOT hard-coded in
 * business logic, so they can be updated when GRA revises them.
 */

export interface TaxBand {
  max: number | null; // null = unlimited
  rate: number;       // decimal e.g. 0.05
}

export const GHANA_PAYE_BANDS_MONTHLY: TaxBand[] = [
  { max: 490,    rate: 0.00  },
  { max: 600,    rate: 0.05  },  // 490 + 110
  { max: 730,    rate: 0.10  },  // 490 + 110 + 130
  { max: 3730,   rate: 0.175 },  // + 3000
  { max: 20125,  rate: 0.25  },  // + 16395
  { max: null,   rate: 0.30  },  // above 20125
];

/**
 * Ghana SSNIT Tier 1 & 2 contribution rates (2024)
 * Tier 1: 13.5% employer + 5.5% employee = 18% total
 * Tier 2: 5.0% managed by private pension trustees (deducted from Tier 1 employer share)
 */
export const GHANA_SSNIT = {
  TIER1_EMPLOYER_RATE: 0.135,
  TIER2_EMPLOYEE_RATE: 0.055,   // 5.5% deducted from employee gross
  // Net SSNIT employee deduction = 5.5%
} as const;

// ─────────────────────────────────────────
// PAYE CALCULATION
// ─────────────────────────────────────────

export function calculateGhanaPAYE(monthlyGross: number): number {
  let taxable = monthlyGross;
  let totalTax = 0;
  let previousBandMax = 0;

  for (const band of GHANA_PAYE_BANDS_MONTHLY) {
    const bandMax = band.max ?? Infinity;
    const bandWidth = bandMax - previousBandMax;
    const amountInBand = Math.min(taxable - previousBandMax, bandWidth);
    if (amountInBand <= 0) break;
    totalTax += amountInBand * band.rate;
    previousBandMax = bandMax;
    if (band.max === null) break;
  }

  return Math.max(0, Math.round(totalTax * 100) / 100);
}

// ─────────────────────────────────────────
// SSNIT CALCULATION
// ─────────────────────────────────────────

export function calculateGhanaSSNIT(monthlyGross: number): {
  tier1Employer: number;
  tier2Employee: number;
} {
  return {
    tier1Employer: Math.round(monthlyGross * GHANA_SSNIT.TIER1_EMPLOYER_RATE * 100) / 100,
    tier2Employee: Math.round(monthlyGross * GHANA_SSNIT.TIER2_EMPLOYEE_RATE * 100) / 100,
  };
}

// ─────────────────────────────────────────
// FULL PAYSLIP CALCULATION
// ─────────────────────────────────────────

export interface PayrollCalculationInput {
  basicSalary: number;
  housingAllowance?: number;
  transportAllowance?: number;
  otherAllowances?: number;
  bonus?: number;
  loansAdvance?: number;
  otherDeductions?: number;
}

export interface PayrollCalculationResult {
  basicSalary: number;
  allowances: number;
  bonus: number;
  grossSalary: number;
  taxableIncome: number;
  paye: number;
  ssnitTier1Employer: number;
  ssnitTier2Employee: number;
  totalDeductions: number;
  netSalary: number;
}

export function calculateGhanaPayroll(input: PayrollCalculationInput): PayrollCalculationResult {
  const allowances =
    (input.housingAllowance ?? 0) +
    (input.transportAllowance ?? 0) +
    (input.otherAllowances ?? 0);
  const bonus = input.bonus ?? 0;
  const grossSalary = input.basicSalary + allowances + bonus;

  // Taxable income = Gross (SSNIT Tier 2 employee deduction is from gross)
  const ssnit = calculateGhanaSSNIT(grossSalary);
  const taxableIncome = grossSalary - ssnit.tier2Employee;

  const paye = calculateGhanaPAYE(taxableIncome);

  const totalDeductions =
    paye +
    ssnit.tier2Employee +
    (input.loansAdvance ?? 0) +
    (input.otherDeductions ?? 0);

  const netSalary = Math.max(0, grossSalary - totalDeductions);

  return {
    basicSalary: input.basicSalary,
    allowances,
    bonus,
    grossSalary: Math.round(grossSalary * 100) / 100,
    taxableIncome: Math.round(taxableIncome * 100) / 100,
    paye: Math.round(paye * 100) / 100,
    ssnitTier1Employer: ssnit.tier1Employer,
    ssnitTier2Employee: ssnit.tier2Employee,
    totalDeductions: Math.round(totalDeductions * 100) / 100,
    netSalary: Math.round(netSalary * 100) / 100,
  };
}
