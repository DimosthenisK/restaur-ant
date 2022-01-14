import { Injectable } from '@nestjs/common';
import { Restaurant, User } from '@prisma/client';
import { PrismaService } from './prisma/prisma.service';
import { BcryptService } from './user/authentication/encryption/bcrypt/bcrypt.service';
const Faker = require('@faker-js/faker');

@Injectable()
export class AppService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly bcryptService: BcryptService,
  ) {}
  async seed() {
    const users: User[] = [];
    const restaurants: Restaurant[] = [];

    const adminPassword = Faker.internet.password();
    const admin = await this.prismaService.user.create({
      data: {
        name: Faker.name.findName(),
        email: Faker.internet.email(),
        password: await this.bcryptService.hash(adminPassword),
        role: 'ADMIN',
      },
    });

    for (let i = 0; i < 10; i++) {
      const user = await this.prismaService.user.create({
        data: {
          name: Faker.name.findName(),
          email: Faker.internet.email(),
          password: await this.bcryptService.hash(Faker.internet.password()),
          role: 'USER',
        },
      });
      users.push(user);
    }

    for (let i = 0; i < 10; i++) {
      const restaurant = await this.prismaService.restaurant.create({
        data: {
          name: Faker.company.companyName(),
          address: Faker.address.streetAddress(),
          phone: Faker.phone.phoneNumber(),
          description: Faker.lorem.paragraph(),
        },
      });
      restaurants.push(restaurant);
    }

    for (const restaurant of restaurants) {
      for (let i = 0; i < 5; i++) {
        const review = await this.prismaService.review.create({
          data: {
            rating: Math.floor(Math.random() * 5) + 1,
            comment: Faker.lorem.paragraph(),
            userId: users[Math.floor(Math.random() * users.length)].id,
            restaurantId: restaurant.id,
            dateOfVisit: new Date(),
          },
        });
      }
    }

    return { user: admin, password: adminPassword };
  }
}
