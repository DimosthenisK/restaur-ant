export interface StarProps {
  fill: number;
  size?: number;
}

export const Star = ({ fill, size }: StarProps) => {
  if (!size) size = 24;
  let fillTag = "empty";
  if (fill === 1) {
    fillTag = "full";
  } else if (fill > 0.333) {
    fillTag = "half";
  }
  return (
    <svg
      className="c-star active"
      width={size}
      height={size}
      viewBox="0 0 24 24"
    >
      <use xlinkHref="#star" fill={`url(#${fillTag})`}></use>
    </svg>
  );
};
