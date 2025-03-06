import { ChakraProvider, Box, Heading, Text } from "@chakra-ui/react";
import React from "react";
import PhysicsVisualizer from "../components/PhysicsVisualizer/index";

export default function Home() {
  return (
    <ChakraProvider>
      <Box p="8" textAlign="center">
        <Heading>Let's do some physics</Heading>
        <Text mt="4">
          This visualization shows a ball moving along a path. Click on a path to select it, then
          click "Launch Ball" to see the ball move along the path.
        </Text>
        <PhysicsVisualizer />
      </Box>
    </ChakraProvider>
  );
}
