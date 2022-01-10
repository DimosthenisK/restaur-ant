import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Request as ExpressRequest } from 'express';
import { Anonymous, Roles, Self } from './authentication/decorators';
import { BearerAuthGuard, RolesGuard } from './authentication/guards';
import { CreateUserDto, UpdateUserDto } from './dtos/overrides';
import { UserService } from './user.service';
import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

@ApiTags('User')
@Controller('')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Anonymous()
  @Post()
  @ApiBody({ type: () => CreateUserDto })
  async create(@Body() dto: CreateUserDto) {
    try {
      const newUser = await this.userService.create(dto);

      return {
        success: true,
        message: 'User created successfully',
        data: newUser.id,
      };
    } catch (err) {
      //TODO Handle
      console.log(err);
      return { success: false, message: err.message };
    }
  }

  @ApiBearerAuth('bearer')
  @UseGuards(BearerAuthGuard)
  @Self({ userIDParam: 'id' })
  @Patch()
  @ApiBody({ type: () => UpdateUserDto })
  async update(
    @Body() dto: UpdateUserDto,
    @Request() req: ExpressRequest & { user: User },
  ) {
    try {
      const updatedUser = await this.userService.update(req.user.id, dto);

      return {
        success: true,
        message: 'User updated successfully',
        data: updatedUser.id,
      };
    } catch (err) {
      //TODO Handle
      console.log(err);
      return { success: false, message: err.message };
    }
  }

  @ApiBearerAuth('bearer')
  @UseGuards(BearerAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch('/:id')
  @ApiBody({ type: () => UpdateUserDto })
  async updateSpecific(@Param('id') id: string, @Body() dto: Partial<User>) {
    try {
      const updatedUser = await this.userService.update(id, dto);

      return {
        success: true,
        message: 'User updated successfully',
        data: updatedUser.id,
      };
    } catch (err) {
      //TODO Handle
      console.log(err);
      return { success: false, message: err.message };
    }
  }

  @ApiBearerAuth('bearer')
  @UseGuards(BearerAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete('/:id')
  async delete(@Param('id') id: string) {
    try {
      const updatedUser = await this.userService.delete(id);

      return {
        success: true,
        message: 'User deleted successfully',
        data: updatedUser.id,
      };
    } catch (err) {
      //TODO Handle
      console.log(err);
      return { success: false, message: err.message };
    }
  }
}
