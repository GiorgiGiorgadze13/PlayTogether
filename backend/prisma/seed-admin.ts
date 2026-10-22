/**
 * seed-admin.ts
 * One-off script to upsert a real ADMIN user in the database.
 * Run with: npx tsx prisma/seed-admin.ts
 *
 * Safe to run multiple times — uses upsert, will not affect other users or data.
 */
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const ADMIN_EMAIL = 'admin@playtogether.ge';
const ADMIN_PASSWORD = 'Admin@PT2025';
const ADMIN_NAME = 'Admin';

async function main() {
  console.log('Seeding admin user…');

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, salt);

  const admin = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {
      role: 'ADMIN',
      passwordHash,
      name: ADMIN_NAME,
    },
    create: {
      email: ADMIN_EMAIL,
      name: ADMIN_NAME,
      passwordHash,
      role: 'ADMIN',
    },
  });

  console.log(`✅ Admin user ready:`);
  console.log(`   ID:    ${admin.id}`);
  console.log(`   Email: ${admin.email}`);
  console.log(`   Role:  ${admin.role}`);
  console.log(`\nYou can now log in with:`);
  console.log(`   Email:    ${ADMIN_EMAIL}`);
  console.log(`   Password: ${ADMIN_PASSWORD}`);
}

main()
  .catch((e) => {
    console.error('❌ Admin seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
