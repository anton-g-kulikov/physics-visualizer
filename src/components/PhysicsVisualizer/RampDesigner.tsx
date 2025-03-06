import React from "react";
import {
  Box,
  Flex,
  Text,
  Button,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { RampDesignerProps } from "./types";

export const RampDesigner: React.FC<RampDesignerProps> = ({
  planeDimensions,
  handleDimensionChange,
  resetPaths,
  isAnimating,
}) => {
  return (
    <Box
      mt={4}
      p={5}
      border="2px solid"
      borderColor="purple.300"
      borderRadius="lg"
      width="100%"
      bg="gray.50"
      boxShadow="md"
    >
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize="xl" fontWeight="bold" color="purple.600">
          Ramp Designer Settings
        </Text>
        <Button
          colorScheme="red"
          size="md"
          leftIcon={
            <span role="img" aria-label="reset">
              🔄
            </span>
          }
          onClick={resetPaths}
        >
          Reset to Default Paths
        </Button>
      </Flex>

      <Box bg="white" p={4} borderRadius="md" borderWidth="1px">
        <Text fontSize="lg" mb={3} fontWeight="medium" color="gray.700">
          Plane Dimensions
        </Text>
        <Flex gap={6} wrap="wrap">
          <FormControl width="auto">
            <FormLabel htmlFor="x-dimension" fontWeight="medium">
              Width (X) in cm:
            </FormLabel>
            <Flex align="center">
              <input
                id="x-dimension"
                type="number"
                min="600"
                max="2000"
                value={planeDimensions.x}
                onChange={(e) =>
                  handleDimensionChange("x", Number(e.target.value))
                }
                style={{
                  width: "120px",
                  padding: "8px 12px",
                  border: "1px solid #cbd5e0",
                  borderRadius: "6px",
                  fontSize: "16px",
                }}
                disabled={isAnimating}
              />
              <Text ml={2} color="gray.500">
                cm
              </Text>
            </Flex>
          </FormControl>

          <FormControl width="auto">
            <FormLabel htmlFor="y-dimension" fontWeight="medium">
              Height (Y) in cm:
            </FormLabel>
            <Flex align="center">
              <input
                id="y-dimension"
                type="number"
                min="200"
                max="800"
                value={planeDimensions.y}
                onChange={(e) =>
                  handleDimensionChange("y", Number(e.target.value))
                }
                style={{
                  width: "120px",
                  padding: "8px 12px",
                  border: "1px solid #cbd5e0",
                  borderRadius: "6px",
                  fontSize: "16px",
                }}
                disabled={isAnimating}
              />
              <Text ml={2} color="gray.500">
                cm
              </Text>
            </Flex>
          </FormControl>
        </Flex>

        <Text mt={4} fontSize="sm" color="gray.500">
          Drag control points on the selected ramp to adjust its curve. All
          changes are saved automatically when you exit edit mode.
        </Text>
      </Box>
    </Box>
  );
};
