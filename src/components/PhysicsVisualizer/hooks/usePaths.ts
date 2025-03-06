import { useState, useEffect } from "react";
import { Path, PlaneDimensions } from "../types";

interface UsePathsReturn {
  paths: Path[];
  setPaths: React.Dispatch<React.SetStateAction<Path[]>>;
  selectedPath: Path;
  setSelectedPath: React.Dispatch<React.SetStateAction<Path>>;
  planeDimensions: PlaneDimensions;
  setPlaneDimensions: React.Dispatch<React.SetStateAction<PlaneDimensions>>;
  updateControlPoint: (
    pathId: string,
    pointKey: string,
    newX: number,
    newY: number
  ) => void;
  resetPaths: () => void;
  handleDimensionChange: (dimension: "x" | "y", value: number) => void;
}

export const usePaths = (
  storageKey: string,
  defaultPaths: Path[]
): UsePathsReturn => {
  // Initialize paths from localStorage or defaults
  const [paths, setPaths] = useState<Path[]>(() => {
    if (typeof window !== "undefined") {
      const savedPaths = localStorage.getItem(storageKey);
      if (savedPaths) {
        try {
          return JSON.parse(savedPaths);
        } catch (error) {
          console.error("Error loading saved paths:", error);
        }
      }
    }
    return defaultPaths;
  });

  // Initialize selected path
  const [selectedPath, setSelectedPath] = useState<Path>(() => {
    if (typeof window !== "undefined") {
      const savedPaths = localStorage.getItem(storageKey);
      if (savedPaths) {
        try {
          return JSON.parse(savedPaths)[0];
        } catch (error) {
          console.error("Error loading selected path:", error);
        }
      }
    }
    return defaultPaths[0];
  });

  // Plane dimensions
  const [planeDimensions, setPlaneDimensions] = useState<PlaneDimensions>({
    x: 1200, // Default width
    y: 400, // Default height
  });

  // Update control point position
  const updateControlPoint = (
    pathId: string,
    pointKey: string,
    newX: number,
    newY: number
  ): void => {
    setPaths((currentPaths) => {
      return currentPaths.map((path) => {
        if (path.id === pathId) {
          const newPath = {
            ...path,
            points: {
              ...path.points,
              [pointKey]: { x: newX, y: newY },
            },
          };

          // If this is the selected path, update it as well
          if (path.id === selectedPath.id) {
            setSelectedPath(newPath);
          }

          return newPath;
        }
        return path;
      });
    });
  };

  // Reset paths to defaults
  const resetPaths = (): void => {
    const endX = planeDimensions.x - 20;

    const dynamicPaths = defaultPaths.map((path) => ({
      ...path,
      points: {
        ...path.points,
        end: {
          ...path.points.end,
          x: endX,
        },
      },
    }));

    setPaths(dynamicPaths);
    setSelectedPath(dynamicPaths[0]);
    localStorage.removeItem(storageKey);
  };

  // Handle dimension changes
  const handleDimensionChange = (dimension: "x" | "y", value: number): void => {
    const numValue = Math.max(100, value || 100);

    setPlaneDimensions((prev) => ({
      ...prev,
      [dimension]: numValue,
    }));

    setPaths((currentPaths) =>
      currentPaths.map((path) => ({
        ...path,
        points: {
          ...path.points,
          end: {
            x: dimension === "x" ? numValue - 50 : path.points.end.x,
            y: path.points.end.y,
          },
        },
      }))
    );
  };

  return {
    paths,
    setPaths,
    selectedPath,
    setSelectedPath,
    planeDimensions,
    setPlaneDimensions,
    updateControlPoint,
    resetPaths,
    handleDimensionChange,
  };
};
