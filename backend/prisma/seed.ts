import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Bootstrap platform root Super Admin account only if not already existing.
  // No dummy schools, students, teachers, or parents are seeded for production.
  const superAdminEmail = 'admin@platform.com';

  const superAdmin = await prisma.user.upsert({
    where: { email: superAdminEmail },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      email: superAdminEmail,
      accountType: 'SUPER_ADMIN',
      status: 'ACTIVE',
      profile: {
        create: {
          firstName: 'Platform',
          lastName: 'Administrator',
        },
      },
    },
  });

  console.log('Production initialization complete: Platform Super Admin verified (' + superAdmin.email + ').');
  console.log('Database is clean with zero dummy tenants or mock records.');
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
