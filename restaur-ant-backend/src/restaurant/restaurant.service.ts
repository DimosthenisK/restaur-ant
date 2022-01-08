import { Injectable } from '@nestjs/common';
import { Restaurant } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RestaurantService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(skip: number, take: number): Promise<Restaurant[]> {
    return this.prismaService.restaurant.findMany({ skip, take });
  }

  async findOne(id: string): Promise<Restaurant> {
    return this.prismaService.restaurant.findUnique({ where: { id } });
  }

  async create(restaurantDto: Partial<Restaurant>) {
    const restaurant: Restaurant = {
      id: undefined,
      name: restaurantDto.name,
      address: restaurantDto.address,
      phone: restaurantDto.phone,
      description: restaurantDto.description,
      status: undefined,
    };

    try {
      const createdRestaurant = await this.prismaService.restaurant.create({
        data: restaurant,
      });
      return createdRestaurant;
    } catch (err) {
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
        throw err;
      }
    } else throw new Error(`RESTAURANT_NOT_FOUND`);
  }
}
