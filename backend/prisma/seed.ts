import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Seed Stadiums
  const stadiums = [
    {
      name: 'ლისი აბანოს სტადიონი (Lisi Baths Stadium)',
      description: 'საუკეთესო საფეხბურთო მოედანი ლისის ტბის მიმდებარედ, განათებითა და გასახდელებით.',
      location: 'თბილისი, საბურთალო',
      sport: 'Football',
      imageUrl: 'https://gamo.ge/img/watermarked/YXNzZXRzL2ltYWdlcy9wcm9kdWN0cy8xNTUud2VicA?p=card',
      price: 110.0,
    },
    {
      name: 'ინტერ აკადემიის მოედანი №3 (Inter Academy Stadium N3)',
      description: 'პროფესიონალური სტანდარტის საფეხბურთო მოედანი დიღომში.',
      location: 'თბილისი, დიღომი',
      sport: 'Football',
      imageUrl: 'https://gamo.ge/img/watermarked/YXNzZXRzL2ltYWdlcy9wcm9kdWN0cy8xODAud2VicA?p=card',
      price: 180.0,
    },
    {
      name: 'ინტერ აკადემიის მოედანი N4 (Inter Academy Stadium N4)',
      description: 'დიდი ზომის საფეხბურთო მოედანი უმაღლესი ხარისხის საფარით.',
      location: 'თბილისი, დიღომი',
      sport: 'Football',
      imageUrl: 'https://gamo.ge/img/watermarked/YXNzZXRzL2ltYWdlcy9wcm9kdWN0cy8xODEud2VicA?p=card',
      price: 200.0,
    },
    {
      name: '“ტფილისი” №1 ("Tfilisi" Stadium N1)',
      description: 'თანამედროვე ხელოვნურსაფარიანი საფეხბურთო მოედანი ვარკეთილში.',
      location: 'თბილისი, ვარკეთილი',
      sport: 'Football',
      imageUrl: 'https://gamo.ge/img/watermarked/YXNzZXRzL2ltYWdlcy9wcm9kdWN0cy8xNTQud2VicA?p=card',
      price: 150.0,
    },
    {
      name: '35-ე სკოლის მოედანი (35th School Main Stadium)',
      description: 'სტანდარტული ზომის საფეხბურთო მოედანი საბურთალოზე.',
      location: 'თბილისი, საბურთალო',
      sport: 'Football',
      imageUrl: 'https://gamo.ge/img/watermarked/YXNzZXRzL2ltYWdlcy9wcm9kdWN0cy8xNTgud2VicA?p=card',
      price: 280.0,
    },
    {
      name: 'ნიუტონის თავისუფალი სკოლის მოედანი (Newton School Stadium)',
      description: 'უმაღლესი ხარისხის ღია საფეხბურთო მოედანი.',
      location: 'თბილისი, საბურთალო',
      sport: 'Football',
      imageUrl: 'https://gamo.ge/img/watermarked/YXNzZXRzL2ltYWdlcy9wcm9kdWN0cy8xNjAud2VicA?p=card',
      price: 200.0,
    },
    {
      name: 'გლდანის სპორტული დარბაზი N1 (Gldani Hall N1)',
      description: 'დახურული დიდი სპორტული დარბაზი გლდანში.',
      location: 'თბილისი, გლდანი',
      sport: 'Football',
      imageUrl: 'https://gamo.ge/img/watermarked/YXNzZXRzL2ltYWdlcy9wcm9kdWN0cy8xNzEud2VicA?p=card',
      price: 140.0,
    },
    {
      name: 'ბაქსვუდის მოედანი - წყნეთი (Buckswood Stadium Tskneti)',
      description: 'სუფთა ჰაერზე მდებარე საფეხბურთო მოედანი წყნეთში.',
      location: 'თბილისი, ვაკე',
      sport: 'Football',
      imageUrl: 'https://gamo.ge/img/watermarked/YXNzZXRzL2ltYWdlcy9wcm9kdWN0cy8xNzYud2VicA?p=card',
      price: 150.0,
    },
    {
      name: 'მარაკანას მოედანი (Marakana Stadium)',
      description: 'პრემიუმ კლასის საფეხბურთო კომპლექსი.',
      location: 'თბილისი, საბურთალო',
      sport: 'Football',
      imageUrl: 'https://gamo.ge/img/watermarked/YXNzZXRzL2ltYWdlcy9wcm9kdWN0cy8xODUud2VicA?p=card',
      price: 550.0,
    },
    {
      name: 'ზაზა ფაჩულიას დარბაზი A (Zaza Pachulia Academy Court A)',
      description: 'ზაზა ფაჩულიას აკადემიის მთავარი საკალათბურთო მოედანი.',
      location: 'თბილისი, დიდუბე',
      sport: 'Basketball',
      imageUrl: 'https://gamo.ge/img/watermarked/YXNzZXRzL2ltYWdlcy9wcm9kdWN0cy8yMTQud2VicA?p=card',
      price: 220.0,
    },
    {
      name: 'ბრუკლინის კალათბურთის აკადემიის დარბაზი (Brooklyn Basketball)',
      description: 'პროფესიონალური საკალათბურთო პარკეტის დარბაზი.',
      location: 'თბილისი, ვაკე',
      sport: 'Basketball',
      imageUrl: 'https://gamo.ge/img/watermarked/YXNzZXRzL2ltYWdlcy9wcm9kdWN0cy8xOTcud2VicA?p=card',
      price: 125.0,
    },
    {
      name: 'კორტები ნუცუბიძეზე (Courts at Nutsubidze)',
      description: 'ღია ჩოგბურთის კორტები ნუცუბიძის პლატოზე.',
      location: 'თბილისი, საბურთალო',
      sport: 'Tennis',
      imageUrl: 'https://gamo.ge/img/watermarked/YXNzZXRzL2ltYWdlcy9wcm9kdWN0cy8xNjYud2VicA?p=card',
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
