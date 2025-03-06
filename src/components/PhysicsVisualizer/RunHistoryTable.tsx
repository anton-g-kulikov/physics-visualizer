import React from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  useBreakpointValue,
  Stack,
  Flex,
  Badge,
  Heading,
} from "@chakra-ui/react";
import { RunHistoryRecord } from "./types";

interface RunHistoryTableProps {
  runHistory: RunHistoryRecord[];
}

export const RunHistoryTable = ({ runHistory }: RunHistoryTableProps) => {
  // Group history records by path color
  const groupedHistory = runHistory.reduce<Record<string, RunHistoryRecord[]>>(
    (acc, run) => {
      (acc[run.pathColor] = acc[run.pathColor] || []).push(run);
      return acc;
    },
    {}
  );

  // Use different display formats based on screen size
  const displayMode = useBreakpointValue({ base: "cards", md: "table" });
  const fontSize = useBreakpointValue({ base: "xs", sm: "sm", md: "md" });
  const tableSize = useBreakpointValue({ base: "sm", md: "md" });

  // Format color name with first letter capitalized
  const formatColor = (color: string) =>
    color.charAt(0).toUpperCase() + color.slice(1);

  if (displayMode === "cards") {
    // Card layout for mobile
    return (
      <Box mt={4} width="100%">
        <Heading size="md" mb={3}>
          Run Results
        </Heading>
        {Object.entries(groupedHistory).map(([color, runs]) => (
          <Box key={color} mb={4}>
            <Badge colorScheme={color} mb={2} fontSize="sm" px={2} py={1}>
              {formatColor(color)}
            </Badge>
            <Stack spacing={3}>
              {runs.map((run) => (
                <Box
                  key={run.id}
                  borderWidth="1px"
                  borderRadius="md"
                  p={3}
                  bg="white"
                  shadow="sm"
                >
                  <Flex justifyContent="space-between" mb={1}>
                    <Text fontSize={fontSize} fontWeight="bold">
                      Date:
                    </Text>
                    <Text fontSize={fontSize}>{run.date}</Text>
                  </Flex>
                  <Flex justifyContent="space-between" mb={1}>
                    <Text fontSize={fontSize} fontWeight="bold">
                      Time to Ascend:
                    </Text>
                    <Text fontSize={fontSize}>{run.timeToAscend} s</Text>
                  </Flex>
                  <Flex justifyContent="space-between">
                    <Text fontSize={fontSize} fontWeight="bold">
                      Terminal Velocity:
                    </Text>
                    <Text fontSize={fontSize}>{run.terminalVelocity} m/s</Text>
                  </Flex>
                </Box>
              ))}
            </Stack>
          </Box>
        ))}
      </Box>
    );
  }

  // Table layout for larger screens
  return (
    <Box
      mt={4}
      p={4}
      border="1px solid gray"
      borderRadius="md"
      width="100%"
      overflowX="auto" // Enable horizontal scrolling on smaller screens
    >
      <Text fontSize="lg" mb={2}>
        Run Results
      </Text>
      <Table variant="simple" size={tableSize}>
        <Thead>
          <Tr>
            <Th>Ramp Color</Th>
            <Th>Date</Th>
            <Th>Time to Ascend (s)</Th>
            <Th>Terminal Velocity (m/s)</Th>
          </Tr>
        </Thead>
        <Tbody>
          {Object.entries(groupedHistory).map(([color, runs]) => (
            <React.Fragment key={color}>
              <Tr fontWeight="bold" bg="gray.100">
                <Td colSpan={4}>{formatColor(color)}</Td>
              </Tr>
              {runs.map((run) => (
                <Tr key={run.id}>
                  <Td>{formatColor(color)}</Td>
                  <Td>{run.date}</Td>
                  <Td>{run.timeToAscend}</Td>
                  <Td>{run.terminalVelocity}</Td>
                </Tr>
              ))}
            </React.Fragment>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};
