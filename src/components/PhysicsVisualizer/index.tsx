"use client"; // Needed for Next.js App Router to handle client-side state
import React, { useState } from "react";
import { Box, Container, Divider, Flex, VStack } from "@chakra-ui/react";
import { RampControls } from "./RampControls";
import { RunHistoryTable } from "./RunHistoryTable";
import { VisualizationCanvas } from "./VisualizationCanvas";
import { LaunchButton } from "./LaunchButton";
import { PathControls } from "./PathControls";
import { EditModePanel } from "./EditModePanel";
import { Path, RunHistoryRecord, PlaneDimensions } from "./types";
import { STORAGE_KEY, initialPaths } from "./constants";
import { usePaths } from "./hooks/usePaths";
import UserPrediction from "../UserPrediction";

const PhysicsVisualizer: React.FC = () => {
  // Use our custom hook for path management
  const {
    paths,
    selectedPath,
    setSelectedPath,
    planeDimensions,
    updateControlPoint,
    resetPaths,
    handleDimensionChange,
  } = usePaths(STORAGE_KEY, initialPaths);

  // Additional state
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [runHistory, setRunHistory] = useState<RunHistoryRecord[]>([]);
  const [predictionsSubmitted, setPredictionsSubmitted] = useState(false);

  // Toggle edit mode and save paths when exiting
  const toggleEditMode = () => {
    const newEditMode = !isEditMode;
    setIsEditMode(newEditMode);

    if (!newEditMode) {
      // Save paths when exiting edit mode
      localStorage.setItem(STORAGE_KEY, JSON.stringify(paths));

      // Still log paths for convenience
      console.log("// Updated paths with custom curvatures:");
      console.log(JSON.stringify(paths, null, 2));
      console.log("// Copy the above code to use as initialPaths");
      console.log("// Paths also saved to localStorage");
    }
  };

  // Handler for completing a run
  const handleRunComplete = (
    timeToAscend: number,
    terminalVelocity: number
  ) => {
    setIsAnimating(false);

    // Add to history
    const newRecord: RunHistoryRecord = {
      id: runHistory.length + 1,
      date: new Date().toISOString(),
      pathColor: selectedPath.color,
      timeToAscend: timeToAscend.toFixed(2),
      terminalVelocity: terminalVelocity.toFixed(2),
    };
    setRunHistory([...runHistory, newRecord]);
  };

  const handlePredictionSubmit = (predictions: any) => {
    // You can use the predictions as needed in your simulation logic.
    setPredictionsSubmitted(true);
  };

  return (
    <Container maxW="1200px" px={4} centerContent>
      <VStack spacing={6} width="100%" align="center">
        <EditModePanel
          isEditMode={isEditMode}
          toggleEditMode={toggleEditMode}
          planeDimensions={planeDimensions}
          handleDimensionChange={handleDimensionChange}
          resetPaths={resetPaths}
          isAnimating={isAnimating}
        />

        {/* Main visualization area with shadow and border */}
        <Box
          width="100%"
          borderRadius="lg"
          overflow="hidden"
          boxShadow="lg"
          border="1px solid"
          borderColor="gray.200"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <VisualizationCanvas
            paths={paths}
            selectedPath={selectedPath}
            isEditMode={isEditMode}
            isAnimating={isAnimating}
            planeDimensions={planeDimensions}
            updateControlPoint={updateControlPoint}
            onRunComplete={handleRunComplete}
            setIsAnimating={setIsAnimating}
            setTimeToAscend={(time: string) => {}}
            setTerminalVelocity={(velocity: string) => {}}
            addRunHistoryRecord={(
              record: Omit<RunHistoryRecord, "id" | "date">
            ) => {}}
          />
        </Box>

        {/* Controls section with background */}
        <Box
          width="100%"
          p={4}
          borderRadius="md"
          bg="gray.50"
          border="1px solid"
          borderColor="gray.200"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <RampControls
            paths={paths}
            selectedPath={selectedPath}
            setSelectedPath={setSelectedPath}
            isAnimating={isAnimating}
            onLaunch={() => setIsAnimating(true)}
          />
        </Box>

        <Divider my={2} />

        {/* History table with cleaner styling */}
        <Box width="100%" overflowX="auto">
          <RunHistoryTable runHistory={runHistory} />
        </Box>
      </VStack>
      {!predictionsSubmitted && (
        <UserPrediction onPredictionSubmit={handlePredictionSubmit} />
      )}
      <LaunchButton
        isAnimating={isAnimating}
        setIsAnimating={setIsAnimating}
        predictionsSubmitted={predictionsSubmitted}
      />
    </Container>
  );
};

export default PhysicsVisualizer;
