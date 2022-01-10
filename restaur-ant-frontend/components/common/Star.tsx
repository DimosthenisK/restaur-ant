export interface StarProps {
  fill: number;
}

export const Star = ({ fill }: StarProps) => {
  let fillTag = "empty";
  if (fill === 1) {
    fillTag = "full";
  } else if (fill > 0.333) {
    fillTag = "half";
  }
  return (
    <svg className="c-star active" width="24" height="24" viewBox="0 0 24 24">
      <use xlinkHref="#star" fill={`url(#${fillTag})`}></use>
    </svg>
  );
};
