import {
  ChakraProvider,
  Box,
  Heading,
  Text,
  Container,
} from "@chakra-ui/react";
import React from "react";
import Head from "next/head";
import PhysicsVisualizer from "../components/PhysicsVisualizer/index";

export default function Home() {
  return (
    <ChakraProvider>
      <Head>
        <title>Balls from Ramps</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <meta
          name="description"
          content="Interactive physics visualization showing balls rolling down ramps"
        />
      </Head>
      <Container maxW="container.xl" px={[2, 4, 8]}>
        <Box py={[4, 6, 8]} textAlign="center">
          <Heading size={["lg", "xl", "2xl"]}>Let's run some balls</Heading>
          <Text mt={4} fontSize={["sm", "md", "lg"]}>
            Select one ramp or all at once, then click "Launch Balls" to
            see the results.
          </Text>
          <PhysicsVisualizer />
        </Box>
      </Container>
    </ChakraProvider>
  );
}
