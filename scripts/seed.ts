import { PrismaClient } from '@prisma/client';
import { generateMatchSlug } from '../../packages/shared/src';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding SportPulse database...');

  // ── Leagues ──────────────────────────────────────────────────────────────
  const premierLeague = await prisma.league.upsert({
    where: { externalId: '39' },
    create: { externalId: '39', name: 'Premier League', slug: 'premier-league', country: 'England', season: 2024, logo: 'https://media.api-sports.io/football/leagues/39.png' },
    update: {},
  });

  const laLiga = await prisma.league.upsert({
    where: { externalId: '140' },
    create: { externalId: '140', name: 'La Liga', slug: 'la-liga', country: 'Spain', season: 2024, logo: 'https://media.api-sports.io/football/leagues/140.png' },
    update: {},
  });

  const liga1 = await prisma.league.upsert({
    where: { externalId: '253' },
    create: { externalId: '253', name: 'Liga 1 Indonesia', slug: 'liga-1', country: 'Indonesia', season: 2024 },
    update: {},
  });

  // ── Teams ─────────────────────────────────────────────────────────────────
  const arsenal = await prisma.team.upsert({
    where: { externalId: '42' },
    create: { externalId: '42', name: 'Arsenal', slug: 'arsenal', leagueId: premierLeague.id, country: 'England', founded: 1886, logo: 'https://media.api-sports.io/football/teams/42.png' },
    update: {},
  });

  const chelsea = await prisma.team.upsert({
    where: { externalId: '49' },
    create: { externalId: '49', name: 'Chelsea', slug: 'chelsea', leagueId: premierLeague.id, country: 'England', founded: 1905, logo: 'https://media.api-sports.io/football/teams/49.png' },
    update: {},
  });

  const barcelona = await prisma.team.upsert({
    where: { externalId: '529' },
    create: { externalId: '529', name: 'Barcelona', slug: 'barcelona', leagueId: laLiga.id, country: 'Spain', founded: 1899, logo: 'https://media.api-sports.io/football/teams/529.png' },
    update: {},
  });

  const realMadrid = await prisma.team.upsert({
    where: { externalId: '541' },
    create: { externalId: '541', name: 'Real Madrid', slug: 'real-madrid', leagueId: laLiga.id, country: 'Spain', founded: 1902, logo: 'https://media.api-sports.io/football/teams/541.png' },
    update: {},
  });

  // ── Matches ───────────────────────────────────────────────────────────────
  const kickoff1 = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hrs from now
  const slug1 = generateMatchSlug('Arsenal', 'Chelsea', kickoff1);

  await prisma.match.upsert({
    where: { externalId: 'seed-1' },
    create: {
      externalId: 'seed-1',
      homeTeamId: arsenal.id,
      awayTeamId: chelsea.id,
      leagueId: premierLeague.id,
      slug: slug1,
      status: 'SCHEDULED',
      kickoffAt: kickoff1,
      season: 2024,
      round: 'Matchday 35',
    },
    update: {},
  });

  const kickoff2 = new Date(Date.now() - 30 * 60 * 1000); // 30 min ago = LIVE
  const slug2 = generateMatchSlug('Barcelona', 'Real Madrid', kickoff2);

  await prisma.match.upsert({
    where: { externalId: 'seed-2' },
    create: {
      externalId: 'seed-2',
      homeTeamId: barcelona.id,
      awayTeamId: realMadrid.id,
      leagueId: laLiga.id,
      slug: slug2,
      status: 'LIVE',
      kickoffAt: kickoff2,
      homeScore: 1,
      awayScore: 1,
      season: 2024,
      round: 'Matchday 36',
    },
    update: { status: 'LIVE', homeScore: 1, awayScore: 1 },
  });

  // ── Ad Placements ─────────────────────────────────────────────────────────
  const placements = [
    { name: 'Above Fold Leaderboard', slot: 'above-fold', position: 'ABOVE_FOLD' as const },
    { name: 'Mid Content Banner', slot: 'mid-content', position: 'MID_CONTENT' as const },
    { name: 'Sidebar Rectangle', slot: 'sidebar', position: 'SIDEBAR' as const },
    { name: 'Sticky Footer', slot: 'sticky-footer', position: 'STICKY_FOOTER' as const },
  ];

  for (const p of placements) {
    await prisma.adPlacement.upsert({
      where: { name: p.name },
      create: p,
      update: {},
    });
  }

  console.log('✅ Seed complete!');
  console.log(`   - Leagues: 3`);
  console.log(`   - Teams: 4`);
  console.log(`   - Matches: 2 (1 scheduled, 1 live)`);
  console.log(`   - Ad placements: 4`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
