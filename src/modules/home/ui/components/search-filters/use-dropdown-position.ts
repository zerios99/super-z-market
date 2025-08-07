import { RefObject } from "react";

export const useDropdownPosition = (
  ref: RefObject<HTMLDivElement | null> | RefObject<HTMLDivElement>
) => {
  const getDropdownPosition = () => {
    if (!ref.current) return { top: 0, left: 0 };

    // claculate the initial postion
    const rect = ref.current.getBoundingClientRect();
    const dropdownWidth = 240;

    // check if dropdown would go off the right edge of the viewport
    let left = rect.left + window.scrollX;
    const top = rect.bottom + window.scrollY;

    // check if dropdown would go off the right edge of the viewport
    if (left + dropdownWidth > window.innerWidth) {
      left = rect.right + window.scrollX - dropdownWidth;

      // if still off-screen, align to the right edge of viewport with some padding
      if (left < 0) {
        left = window.innerWidth - dropdownWidth - 16;
      }
    }
    // Ensure dropdown dosent go off left edge
    if (left < 0) {
      left = 16;
    }
    return { top, left };
  };

  return { getDropdownPosition };
};
