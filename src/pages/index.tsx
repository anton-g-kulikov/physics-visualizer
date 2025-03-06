import { ChakraProvider, Box, Heading, Text } from "@chakra-ui/react";
import React from "react";
import PhysicsVisualizer from "../components/PhysicsVisualizer/index";

export default function Home() {
  return (
    <ChakraProvider>
      <Box p="8" textAlign="center">
        <Heading>Let's do some physics</Heading>
        <Text mt="4">
          This visualization shows a balls rolling of the ramps. Click on a button select to a path or all at once, then
          click "Launch Balls" to see the results.
        </Text>
        <PhysicsVisualizer />
      </Box>
    </ChakraProvider>
  );
}
