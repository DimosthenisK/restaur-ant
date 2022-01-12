import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Request as ExpressRequest } from 'express';
import { CreateReviewDto, UpdateReviewDto } from './dtos/overrides';
import { ReviewService } from './review.service';
import { Roles } from '../../user/authentication/decorators';
import { BearerAuthGuard, RolesGuard } from '../../user/authentication/guards';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
@ApiTags('Review')
@ApiBearerAuth('bearer')
@UseGuards(BearerAuthGuard)
@Controller()
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @ApiParam({ name: 'restaurantId', type: 'string' })
  @Get('')
  async findAll(@Param('restaurantId') restaurantId: string): Promise<any> {
    return {
      success: true,
      data: await this.reviewService.findForRestaurant(restaurantId),
    };
  }

  @Post()
  @ApiBody({ type: () => CreateReviewDto })
  @ApiParam({ name: 'restaurantId', type: 'string' })
  async create(
    @Body() dto: CreateReviewDto,
    @Param('restaurantId') restaurantId: string,
    @Request() request: ExpressRequest & { user: User },
  ) {
    const userId = request.user.id;
    try {
      console.log(restaurantId, userId, dto);
      const newReview = await this.reviewService.create(
        userId,
        restaurantId,
        dto,
      );

      return {
        success: true,
        message: 'Review created successfully',
        data: newReview.id,
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
  @ApiBody({ type: () => UpdateReviewDto })
  async update(@Body() dto: UpdateReviewDto, @Param('id') id: string) {
    try {
      const updatedReview = await this.reviewService.update(id, dto);

      return {
        success: true,
        message: 'Review updated successfully',
        data: updatedReview.id,
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
      const deletedReview = await this.reviewService.delete(id);

      return {
        success: true,
        message: 'Review deleted successfully',
        data: deletedReview.id,
      };
    } catch (err) {
      //TODO Handle
      console.log(err);
      return { success: false, message: err.message };
    }
  }
}
