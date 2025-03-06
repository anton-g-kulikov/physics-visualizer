import React from "react";
import { VStack, Flex, Button } from "@chakra-ui/react";
import { RampControlsProps, Path } from "./types";

export const RampControls: React.FC<RampControlsProps> = ({
  paths,
  selectedPaths,
  setSelectedPaths,
  isAnimating,
  onLaunch,
}) => {
  const togglePathSelection = (path: Path) => {
    if (selectedPaths.some((p) => p.id === path.id)) {
      setSelectedPaths(selectedPaths.filter((p) => p.id !== path.id));
    } else {
      setSelectedPaths([...selectedPaths, path]);
    }
  };

  return (
    <VStack>
      <Flex mt={4} gap={3}>
        {paths.map((path) => (
          <Button
            key={path.id}
            colorScheme={
              selectedPaths.some((p) => p.id === path.id) ? path.color : "gray"
            }
            onClick={() => togglePathSelection(path)}
          >
            {path.color.charAt(0).toUpperCase() + path.color.slice(1)}
          </Button>
        ))}
      </Flex>
      <Button
        mt={4}
        width="100%"
        height="50px"
        colorScheme="green"
        onClick={onLaunch}
        disabled={isAnimating || selectedPaths.length === 0}
      >
        {selectedPaths.length > 1
          ? `Launch ${selectedPaths.length} Balls`
          : "Launch Ball"}
      </Button>
    </VStack>
  );
};
