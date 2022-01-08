import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiTags
  } from '@nestjs/swagger';
import { Restaurant } from '@prisma/client';
import { RestaurantService } from './restaurant.service';
import { Roles } from '../user/authentication/decorators/roles.decorator';
import { BearerAuthGuard } from '../user/authentication/guards/bearer.guard';
import { RolesGuard } from '../user/authentication/guards/roles.guard';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  CreateRestaurantDto,
  UpdateRestaurantDto,
} from '../generated/dto/restaurant/dto';

@ApiTags('Restaurant')
@ApiBearerAuth('bearer')
@UseGuards(BearerAuthGuard)
@Controller()
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Get('/:page(\\d+)')
  @ApiParam({ name: 'page', type: 'number' })
  async findAll(@Param('page') page: number): Promise<Restaurant[]> {
    if (page <= 0) page = 1;
    page--;
    return this.restaurantService.findAll(page * 20, 20);
  }

  @Get('/:id')
  @ApiParam({ name: 'id', type: 'string' })
  async findOne(@Param('id') id: string): Promise<Restaurant> {
    return this.restaurantService.findOne(id);
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Post()
  @ApiBody({ type: () => CreateRestaurantDto })
  async create(@Body() dto: Partial<Restaurant>) {
    try {
      const newRestaurant = await this.restaurantService.create(dto);

      return {
        success: true,
        message: 'Restaurant created successfully',
        data: newRestaurant.id,
      };
    } catch (err) {
      //TODO Handle
      console.log(err);
      return { success: false, message: err.message };
    }
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Patch('/:id')
  @ApiParam({ name: 'id', type: 'string' })
  @ApiBody({ type: () => UpdateRestaurantDto })
  async update(@Body() dto: Partial<Restaurant>, @Param('id') id: string) {
    try {
      const updatedRestaurant = await this.restaurantService.update(id, dto);

      return {
        success: true,
        message: 'Restaurant updated successfully',
        data: updatedRestaurant.id,
      };
    } catch (err) {
      //TODO Handle
      console.log(err);
      return { success: false, message: err.message };
    }
  }
}
