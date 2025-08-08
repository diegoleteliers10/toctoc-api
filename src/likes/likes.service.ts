import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createClient } from '@supabase/supabase-js';
import { Like } from './entities/like.entity';
import type { Repository } from 'typeorm';
import type { LikeResponseDto } from './dto/like-response.dto';

@Injectable()
export class LikesService {
  private supabase = createClient(
    process.env.SUPABASE_URL as string,
    process.env.SUPABASE_SERVICE_ROLE_KEY as string,
  );

  constructor(
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
  ) {}

  async likeOrUnlikeProperty(
    propertyId: string,
    userId: string,
  ): Promise<string | LikeResponseDto> {
    if (userId === propertyId) {
      throw new BadRequestException('No puedes likear tu propia propiedad');
    }
    const like = await this.likeRepository.findOne({
      where: { property_id: propertyId, user_id: userId },
    });
    if (like) {
      await this.likeRepository.delete({ id: like.id }); // Eliminar el like, recordar siempre indicar el id del like o del objeto a eliminar
      return 'Like eliminado';
    } else {
      const newLike = await this.likeRepository.save({
        property_id: propertyId,
        user_id: userId,
      });
      return this.toLikeResponse(newLike);
    }
  }

  private toLikeResponse(like: Like): LikeResponseDto {
    return {
      id: like.id,
      property_id: like.property_id,
      user_id: like.user_id,
      createdAt: like.createdAt,
      updatedAt: like.updatedAt,
    };
  }
}
