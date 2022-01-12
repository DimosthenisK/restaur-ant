import { IsInt, Length, Matches, Max, Min } from 'class-validator';
import { CreateReviewDto as GeneratedCreateReviewDto } from '../../../../generated/dto/review/dto/create-review.dto';

export class CreateReviewDto extends GeneratedCreateReviewDto {
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @Matches(/^\d{4}(-)(((0)[0-9])|((1)[0-2]))(-)([0-2][0-9]|(3)[0-1])$/i, {
    message: '$property must be formatted as yyyy-mm-dd',
  })
  dateOfVisit: Date;

  @Length(1, 500)
  comment: string;
}
