import { Star } from './';

export interface RatingProps {
  rating: number;
}

export const Rating = ({ rating }: RatingProps) => {
  return (
    <p
      className="flex justify-content-center"
      aria-label={`${rating} stars out of 5`}
    >
      <Star fill={rating >= 1 ? 1 : rating} />
      <Star fill={rating >= 2 ? 1 : rating - 1} />
      <Star fill={rating >= 3 ? 1 : rating - 2} />
      <Star fill={rating >= 4 ? 1 : rating - 3} />
      <Star fill={rating === 5 ? 1 : rating - 4} />
    </p>
  );
};
