import React from "react";
import { Button, Flex } from "@chakra-ui/react";
import { Path, PathControlsProps } from "./types";

export const PathControls: React.FC<PathControlsProps> = ({
  paths,
  selectedPath,
  setSelectedPath,
}) => {
  return (
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
  );
};
