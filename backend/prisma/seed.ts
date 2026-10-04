import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Seed Stadiums
  const stadiums = [
    {
      name: 'ლისი აბანოს სტადიონი',
      description: 'საუკეთესო საფეხბურთო მოედანი ლისის ტბის მიმდებარედ, განათებითა და გასახდელებით.',
      location: 'თბილისი, საბურთალო',
      sport: 'Football',
      imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80',
      price: 110.0,
    },
    {
      name: 'ინტერ აკადემიის მოედანი №3',
      description: 'პროფესიონალური სტანდარტის საფეხბურთო მოედანი დიღომში.',
      location: 'თბილისი, დიღომი',
      sport: 'Football',
      imageUrl: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=1200&q=80',
      price: 180.0,
    },
    {
      name: 'ინტერ აკადემიის მოედანი N4',
      description: 'დიდი ზომის საფეხბურთო მოედანი უმაღლესი ხარისხის საფარით.',
      location: 'თბილისი, დიღომი',
      sport: 'Football',
      imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80',
      price: 200.0,
    },
    {
      name: 'ტფილისი №1',
      description: 'თანამედროვე ხელოვნურსაფარიანი საფეხბურთო მოედანი ვარკეთილში.',
      location: 'თბილისი, ვარკეთილი',
      sport: 'Football',
      imageUrl: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?auto=format&fit=crop&w=1200&q=80',
      price: 150.0,
    },
    {
      name: '35-ე სკოლის მოედანი',
      description: 'სტანდარტული ზომის საფეხბურთო მოედანი საბურთალოზე.',
      location: 'თბილისი, საბურთალო',
      sport: 'Football',
      imageUrl: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=1200&q=80',
      price: 280.0,
    },
    {
      name: 'ნიუტონის თავისუფალი სკოლის მოედანი',
      description: 'უმაღლესი ხარისხის ღია საფეხბურთო მოედანი.',
      location: 'თბილისი, საბურთალო',
      sport: 'Football',
      imageUrl: 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?auto=format&fit=crop&w=1200&q=80',
      price: 200.0,
    },
    {
      name: 'გლდანის სპორტული დარბაზი N1',
      description: 'დახურული დიდი სპორტული დარბაზი გლდანში.',
      location: 'თბილისი, გლდანი',
      sport: 'Football',
      imageUrl: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=1200&q=80',
      price: 140.0,
    },
    {
      name: 'ბაქსვუდის მოედანი - წყნეთი',
      description: 'სუფთა ჰაერზე მდებარე საფეხბურთო მოედანი წყნეთში.',
      location: 'თბილისი, ვაკე',
      sport: 'Football',
      imageUrl: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=1200&q=80',
      price: 150.0,
    },
    {
      name: 'მარაკანას მოედანი',
      description: 'პრემიუმ კლასის საფეხბურთო კომპლექსი.',
      location: 'თბილისი, საბურთალო',
      sport: 'Football',
      imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80',
      price: 550.0,
    },
    {
      name: 'ზაზა ფაჩულიას დარბაზი A',
      description: 'ზაზა ფაჩულიას აკადემიის მთავარი საკალათბურთო მოედანი.',
      location: 'თბილისი, დიდუბე',
      sport: 'Basketball',
      imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80',
      price: 220.0,
    },
    {
      name: 'ბრუკლინის კალათბურთის აკადემიის დარბაზი',
      description: 'პროფესიონალური საკალათბურთო პარკეტის დარბაზი.',
      location: 'თბილისი, ვაკე',
      sport: 'Basketball',
      imageUrl: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=1200&q=80',
      price: 125.0,
    },
    {
      name: 'კორტები ნუცუბიძეზე',
      description: 'ღია ჩოგბურთის კორტები ნუცუბიძის პლატოზე.',
      location: 'თბილისი, საბურთალო',
      sport: 'Tennis',
      imageUrl: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=1200&q=80',
      price: 70.0,
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
