import { IsDate, IsInt, Length, Max, Min } from 'class-validator';
import { CreateReviewDto as GeneratedCreateReviewDto } from '../../../../generated/dto/review/dto/create-review.dto';

export class CreateReviewDto extends GeneratedCreateReviewDto {
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsDate()
  dateOfVisit: Date;

  @Length(1, 500)
  comment: string;
}
