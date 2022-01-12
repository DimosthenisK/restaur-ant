export interface ActionButtonProps {
  label: string;
  onClick: Function;
  loading?: boolean;
  extraStyles?: string;
}

export const ActionButton = ({
  label,
  onClick,
  loading,
  extraStyles,
}: ActionButtonProps) => {
  return (
    <button
      className={`focus:outline-none transition duration-150 ease-in-out hover:bg-gray-200 shadow bg-white rounded text-red-800 px-4 py-3 mr-2 ${extraStyles}`}
      onClick={() => onClick()}
    >
      {label}
    </button>
  );
};
