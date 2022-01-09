import { IsDate, IsInt, IsOptional, Length, Max, Min } from 'class-validator';
import { UpdateReviewDto as GeneratedUpdateReviewDto } from '../../../../generated/dto/review/dto/update-review.dto';

export class UpdateReviewDto extends GeneratedUpdateReviewDto {
  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  rating: number;

  @IsDate()
  @IsOptional()
  dateOfVisit?: Date;

  @Length(1, 500)
  @IsOptional()
  comment?: string;
}
