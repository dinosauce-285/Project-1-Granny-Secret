import 'dotenv/config';
import { prisma } from '../src/prisma.js';

(async () => {
  try {
    await prisma.$connect();
    const res = await prisma.recipe.findMany({ include: { category: true }, orderBy: { createdAt: 'desc' } });
    console.log('OK', res.length);
    if (res.length > 0) console.log(res[0]);
  } catch (e) {
    console.error('PRISMA ERROR');
    console.error(e);
    console.error(e.message);
    console.error(e.code);
    console.error(e.meta);
    if (e.stack) console.error(e.stack);
    process.exit(1);
  } finally {
    try { await prisma.$disconnect(); } catch {}
  }
})();
