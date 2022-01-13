import { Injectable } from '@nestjs/common';
import { Restaurant, RestaurantStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RestaurantService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(
    skip: number,
    take: number,
  ): Promise<Array<Restaurant & { _avgrating: number | null }>> {
    const getRestaurants = await this.prismaService.$queryRaw<
      Array<Restaurant & { _avgrating: number | null }>
    >`
      SELECT "Restaurant".*, AVG("Review".rating) as _avgrating
      FROM "Restaurant"
      LEFT JOIN "Review" ON "Review"."restaurantId" = "Restaurant".id
      WHERE "Restaurant".status = 'ACTIVE'
      GROUP BY "Restaurant".id
      ORDER BY _avgrating DESC NULLS LAST
      LIMIT ${take} OFFSET ${skip}`;
    return getRestaurants;
  }

  async findOne(id: string): Promise<Restaurant> {
    return this.prismaService.restaurant.findFirst({
      where: { id, status: RestaurantStatus.ACTIVE },
    });
  }

  async create(restaurantDto: Partial<Restaurant>) {
    const restaurant: Restaurant = {
      id: undefined,
      name: restaurantDto.name,
      address: restaurantDto.address,
      phone: restaurantDto.phone,
      description: restaurantDto.description,
      status: undefined,
      createdAt: undefined,
    };

    try {
      const createdRestaurant = await this.prismaService.restaurant.create({
        data: restaurant,
      });
      return createdRestaurant;
    } catch (err) {
      //TODO HANDLE
      throw err;
    }
  }

  async update(id: string, restaurantDto: Partial<Restaurant>) {
    const restaurant = await this.prismaService.restaurant.findUnique({
      where: { id },
    });

    if (restaurant) {
      const sanitaryRestaurant: Restaurant = {
        ...restaurant,
        name: restaurantDto.name,
        address: restaurantDto.address,
        phone: restaurantDto.phone,
        description: restaurantDto.description,
      };

      try {
        const updatedRestaurant = await this.prismaService.restaurant.update({
          data: sanitaryRestaurant,
          where: { id },
        });
        return updatedRestaurant;
      } catch (err) {
        //TODO HANDLE
        throw err;
      }
    } else throw new Error(`RESTAURANT_NOT_FOUND`);
  }

  async delete(id: string) {
    const restaurant = await this.prismaService.restaurant.findUnique({
      where: { id },
    });

    if (restaurant) {
      try {
        const updatedRestaurant = await this.prismaService.restaurant.update({
          data: { status: RestaurantStatus.INACTIVE },
          where: { id },
        });
        return updatedRestaurant;
      } catch (err) {
        //TODO HANDLE
        throw err;
      }
    } else throw new Error(`RESTAURANT_NOT_FOUND`);
  }
}
