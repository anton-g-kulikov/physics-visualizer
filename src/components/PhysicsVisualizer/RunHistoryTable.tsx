import React from "react";
import { Box, Table, Thead, Tbody, Tr, Th, Td, Text } from "@chakra-ui/react";
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

  return (
    <Box mt={4} p={4} border="1px solid gray" borderRadius="md" width="100%">
      <Text fontSize="lg" mb={2}>
        Run Results
      </Text>
      <Table variant="simple" size="sm">
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
                <Td colSpan={4}>
                  {color.charAt(0).toUpperCase() + color.slice(1)}
                </Td>
              </Tr>
              {runs.map((run) => (
                <Tr key={run.id}>
                  <Td>{color.charAt(0).toUpperCase() + color.slice(1)}</Td>
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