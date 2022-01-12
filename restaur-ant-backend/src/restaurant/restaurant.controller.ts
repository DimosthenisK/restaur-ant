import { CreateRestaurantDto, UpdateRestaurantDto } from './dtos/overrides';
import { RestaurantService } from './restaurant.service';
import { Roles } from '../user/authentication/decorators';
import { BearerAuthGuard, RolesGuard } from '../user/authentication/guards';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import {
  FindManyRestaurantOkResponse,
  FindOneRestaurantNotFoundResponse,
  FindOneRestaurantOkResponse,
} from './dtos/responses';

@ApiTags('Restaurant')
@ApiBearerAuth('bearer')
@UseGuards(BearerAuthGuard)
@Controller()
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Get('/:page(\\d+)')
  @ApiParam({ name: 'page', type: 'number' })
  @ApiOkResponse({ type: () => FindManyRestaurantOkResponse })
  async findAll(
    @Param('page') page: number,
  ): Promise<FindManyRestaurantOkResponse> {
    if (page <= 0) page = 1;
    page--;
    return {
      success: true,
      page: page + 1,
      data: await this.restaurantService.findAll(page * 12, 12),
    };
  }

  @Get('/:id')
  @ApiParam({ name: 'id', type: 'string' })
  @ApiOkResponse({ type: () => FindOneRestaurantOkResponse })
  @ApiNotFoundResponse({ type: () => FindOneRestaurantNotFoundResponse })
  async findOne(
    @Param('id') id: string,
  ): Promise<FindOneRestaurantOkResponse | FindOneRestaurantNotFoundResponse> {
    const restaurant = await this.restaurantService.findOne(id);
    if (restaurant) {
      return { success: true, data: restaurant };
    } else {
      throw new BadRequestException({
        success: false,
        message: 'Restaurant not found',
        errorCode: 'RESTAURANT_NOT_FOUND',
      });
    }
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Post()
  @ApiBody({ type: () => CreateRestaurantDto })
  async create(@Body() dto: CreateRestaurantDto) {
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
  async update(@Body() dto: UpdateRestaurantDto, @Param('id') id: string) {
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

  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Delete('/:id')
  @ApiParam({ name: 'id', type: 'string' })
  async delete(@Param('id') id: string) {
    try {
      const updatedRestaurant = await this.restaurantService.delete(id);

      return {
        success: true,
        message: 'Restaurant deleted successfully',
        data: updatedRestaurant.id,
      };
    } catch (err) {
      //TODO Handle
      console.log(err);
      return { success: false, message: err.message };
    }
  }
}
