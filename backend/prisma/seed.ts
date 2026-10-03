import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Seed Stadiums
  const stadiums = [
    {
      name: 'Tbilisi Sports Arena',
      description: 'Modern indoor sports arena with high quality turf and illumination.',
      location: 'Tbilisi, Saburtalo',
      sport: 'Football',
      imageUrl: '/ფეხბურთი.png',
      price: 15.0,
    },
    {
      name: 'Shevardeni Rugby Stadium',
      description: 'Professional grass rugby pitch with grandstand seating.',
      location: 'Tbilisi, Bagebi',
      sport: 'Rugby',
      imageUrl: '/რაგბი.png',
      price: 15.0,
    },
    {
      name: 'Vake Sports Hall',
      description: 'Full sized wooden hardwood basketball court with scoreboard.',
      location: 'Tbilisi, Vake',
      sport: 'Basketball',
      imageUrl: '/კალათბურთი.png',
      price: 10.0,
    },
    {
      name: 'New Volleyball Arena',
      description: 'Professional indoor volleyball court with spectator seating.',
      location: 'Tbilisi, Digomi',
      sport: 'Volleyball',
      imageUrl: '/ფრენბურთი.png',
      price: 15.0,
    },
    {
      name: 'Mziuri Tennis Courts',
      description: 'Outdoor clay tennis court surrounded by nature.',
      location: 'Tbilisi, Mziuri',
      sport: 'Tennis',
      imageUrl: '/ტენისი.png',
      price: 30.0,
    },
    {
      name: 'Central Badminton Complex',
      description: 'Indoor badminton facility with 4 professional courts.',
      location: 'Tbilisi, Isani',
      sport: 'Badminton',
      imageUrl: '/ბანბიგტონი.png',
      price: 20.0,
    },
  ];

  for (const stadiumData of stadiums) {
    const existing = await prisma.stadium.findFirst({
      where: { name: stadiumData.name },
    });

    if (!existing) {
      await prisma.stadium.create({
        data: stadiumData,
      });
    }
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
