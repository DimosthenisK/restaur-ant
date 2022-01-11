import { useState } from 'react';

export type UseModalProps = boolean;
const useModal = (show: UseModalProps) => {
  const [isShowing, setIsShowing] = useState(show);

  function toggle() {
    setIsShowing(!isShowing);
  }

  return {
    isShowing,
    toggle,
  };
};

export default useModal;
