"use client"; // Needed for Next.js App Router to handle client-side state
import React, { useState } from "react";
import { Box, Flex } from "@chakra-ui/react";
import { EditModeToggle } from "./EditModeToggle";
import { RampControls } from "./RampControls";
import { RampDesigner } from "./RampDesigner";
import { RunHistoryTable } from "./RunHistoryTable";
import { VisualizationCanvas } from "./VisualizationCanvas";
import { LaunchButton } from "./LaunchButton";
import { PathControls } from "./PathControls";
import { EditModePanel } from "./EditModePanel";
import { Path, RunHistoryRecord, PlaneDimensions } from "./types";
import { STORAGE_KEY, initialPaths } from "./constants";
import { usePaths } from "./hooks/usePaths";

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

  return (
    <Flex direction="column" align="center" p={4}>
      <EditModeToggle isEditMode={isEditMode} toggleEditMode={toggleEditMode} />
      <Flex width="100%" justify="space-between" mt={4}>
        {/* <RampDesigner
          planeDimensions={planeDimensions}
          handleDimensionChange={handleDimensionChange}
          resetPaths={resetPaths}
          isAnimating={isAnimating}
        /> */}
      </Flex>
      <VisualizationCanvas
        paths={paths}
        selectedPath={selectedPath}
        isEditMode={isEditMode}
        isAnimating={isAnimating}
        planeDimensions={planeDimensions}
        updateControlPoint={updateControlPoint}
        onRunComplete={handleRunComplete} // Pass the handler here
        setIsAnimating={setIsAnimating}
        setTimeToAscend={(time: string) => {}} // Add this line
        setTerminalVelocity={(velocity: string) => {}} // Add this line
        addRunHistoryRecord={(
          record: Omit<RunHistoryRecord, "id" | "date">
        ) => {}} // Add this line
      />
      <RampControls
        paths={paths}
        selectedPath={selectedPath}
        setSelectedPath={setSelectedPath}
        isAnimating={isAnimating}
        onLaunch={() => setIsAnimating(true)}
      />
      <RunHistoryTable runHistory={runHistory} />
    </Flex>
  );
};

export default PhysicsVisualizer;
