import React, { useEffect } from "react";
import { Box, BoxProps } from "@chakra-ui/react";

type Props = {
  onClickOutside(): void;
  children: React.ReactNode;
} & BoxProps;

function useOutsideAlerter(ref: any, onClickOutside: () => void) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target)) {
        onClickOutside();
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, onClickOutside]);
}

export const OutsideClickHandler = ({
  onClickOutside,
  children,
  style,
  ...props
}: Props) => {
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  useOutsideAlerter(wrapperRef, onClickOutside);

  return (
    <Box display="block" ref={wrapperRef} {...props}>
      {children}
    </Box>
  );
};
