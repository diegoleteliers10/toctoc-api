import { Body, Controller, Param, Post, Query } from '@nestjs/common';
import { LikesService } from './likes.service';
// import { CreateLikeDto } from './dto/create-like.dto';
import { LikeResponseDto } from './dto/like-response.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  // ApiBody,
} from '@nestjs/swagger';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @ApiTags('likes')
  @ApiOperation({ summary: 'Like or unlike a property' })
  @ApiResponse({ status: 201, description: 'Like or unlike a property' })
  @ApiConsumes('application/json')
  @Post(':propertyId')
  async likeOrUnlikeProperty(
    @Param('propertyId') propertyId: string,
    @Query('userId') userId: string,
  ): Promise<string | LikeResponseDto> {
    return this.likesService.likeOrUnlikeProperty(propertyId, userId);
  }
}
