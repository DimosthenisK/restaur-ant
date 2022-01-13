import { IsInt, IsOptional, Length, Matches, Max, Min } from 'class-validator';
import { UpdateReviewDto as GeneratedUpdateReviewDto } from '../../../../generated/dto/review/dto/update-review.dto';

export class UpdateReviewDto extends GeneratedUpdateReviewDto {
  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  rating: number;

  @Matches(/^\d{4}(-)(((0)[0-9])|((1)[0-2]))(-)([0-2][0-9]|(3)[0-1])$/i, {
    message: '$property must be formatted as yyyy-mm-dd',
  })
  @IsOptional()
  dateOfVisit?: Date;

  @Length(1, 500)
  @IsOptional()
  comment?: string;
}
