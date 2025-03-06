import React from "react";
import { Button } from "@chakra-ui/react";
import { LaunchButtonProps } from "./types";

export const LaunchButton: React.FC<
  LaunchButtonProps & { predictionsSubmitted: boolean }
> = ({ isAnimating, setIsAnimating, predictionsSubmitted }) => {
  return (
    <Button
      mt={4}
      colorScheme="green"
      onClick={() => setIsAnimating(true)}
      isDisabled={isAnimating || !predictionsSubmitted}
      size="lg"
    >
      Launch Ball
    </Button>
  );
};
