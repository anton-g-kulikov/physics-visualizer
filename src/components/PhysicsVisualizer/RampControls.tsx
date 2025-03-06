import React from "react";
import { VStack, Flex, Button } from "@chakra-ui/react";
import { RampControlsProps } from "./types";

export const RampControls: React.FC<RampControlsProps> = ({
  paths,
  selectedPath,
  setSelectedPath,
  isAnimating,
  onLaunch,
}) => {
  return (
    <VStack>
      <Flex mt={4} gap={3}>
        {paths.map((path) => (
          <Button
            key={path.id}
            colorScheme={path.id === selectedPath.id ? path.color : "gray"}
            onClick={() => setSelectedPath(path)}
          >
            {path.color.charAt(0).toUpperCase() + path.color.slice(1)}
          </Button>
        ))}
      </Flex>
      <Button
        mt={4}
        colorScheme="green"
        onClick={onLaunch}
        disabled={isAnimating}
      >
        Launch Ball
      </Button>
    </VStack>
  );
};
