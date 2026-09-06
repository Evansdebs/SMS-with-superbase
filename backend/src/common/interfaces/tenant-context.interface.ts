export interface TenantContext {
  schoolId: string;
  schoolCode?: string;
  userId: string;
  email: string;
  accountType: 'SUPER_ADMIN' | 'USER';
  profile?: string;
  permissions?: string[];
}
