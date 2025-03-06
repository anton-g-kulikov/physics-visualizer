"use client"; // Needed for Next.js App Router to handle client-side state
import React from "react";
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import {
  Button,
  Box,
  Flex,
  Text,
  Switch,
  FormControl,
  FormLabel,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";

const GRAVITY = 9.81; // Acceleration due to gravity (m/s²)
const STORAGE_KEY = "physics-visualizer-paths";

// Update the path endpoints to use more of the 800 units width
const initialPaths = [
  {
    id: "path1",
    color: "orange",
    points: {
      start: { x: 0, y: 400 },
      cp1: { x: 467.31480916341144, y: 270.400143577939 },
      cp2: { x: 205.64811706542972, y: 122.78111049107143 },
      end: { x: 580, y: 50 },
    },
  },
  {
    id: "path2",
    color: "blue",
    points: {
      start: { x: 0, y: 400 },
      cp1: { x: 93.98146311442058, y: 0 },
      cp2: { x: 428.9814758300781, y: 59.712320963541686 },
      end: { x: 580, y: 50 },
    },
  },
  {
    id: "path3",
    color: "teal",
    points: {
      start: { x: 0, y: 400 },
      cp1: { x: 594.8148091634115, y: 232.093258812314 },
      cp2: { x: 288.981450398763, y: 170.18851143973214 },
      end: { x: 580, y: 50 },
    },
  },
  {
    id: "path4",
    color: "red",
    points: {
      start: { x: 0, y: 400 },
      cp1: { x: 303.98145039876306, y: 199.71230643136158 },
      cp2: { x: 300.6481170654297, y: 203.52183024088538 },
      end: { x: 580, y: 50 },
    },
  },
];

const PhysicsVisualizer = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  // Replace the paths useState initialization with this:
  const [paths, setPaths] = useState(() => {
    // Try to load paths from localStorage on component mount
    if (typeof window !== "undefined") {
      const savedPaths = localStorage.getItem(STORAGE_KEY);
      if (savedPaths) {
        try {
          return JSON.parse(savedPaths);
        } catch (error) {
          console.error("Error loading saved paths:", error);
        }
      }
    }
    return initialPaths;
  });

  // Update the selectedPath to use the first path from our potentially loaded paths
  const [selectedPath, setSelectedPath] = useState(() => {
    if (typeof window !== "undefined") {
      const savedPaths = localStorage.getItem(STORAGE_KEY);
      if (savedPaths) {
        try {
          return JSON.parse(savedPaths)[0];
        } catch (error) {
          console.error("Error loading selected path:", error);
        }
      }
    }
    return initialPaths[0];
  });

  // Rest of your state variables remain the same
  const [isAnimating, setIsAnimating] = useState(false);
  const [timeToAscend, setTimeToAscend] = useState(0);
  const [terminalVelocity, setTerminalVelocity] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);
  const [runHistory, setRunHistory] = useState<
    Array<{
      id: number;
      date: string;
      pathColor: string;
      timeToAscend: string;
      terminalVelocity: string;
    }>
  >([]);

  // Add these state variables after your other state declarations:
  const [planeDimensions, setPlaneDimensions] = useState({
    x: 1200, // Default width
    y: 400, // Default height
  });

  // Update handleDimensionChange function to maintain path ends 50 units from x-axis end
  const handleDimensionChange = (dimension, value) => {
    if (isAnimating) return;

    // Make sure value is a number and is positive
    const numValue = Math.max(100, parseInt(value, 10) || 100);

    setPlaneDimensions((prev) => ({
      ...prev,
      [dimension]: numValue,
    }));

    // Adjust paths for new dimensions
    setPaths((currentPaths) =>
      currentPaths.map((path) => ({
        ...path,
        points: {
          ...path.points,
          // If x dimension changes, ensure end points are always 50 units from the end
          end: {
            x: dimension === "x" ? numValue - 50 : path.points.end.x,
            y: path.points.end.y,
          },
        },
      }))
    );
  };

  // Generate path string from points
  const generatePath = (points) => {
    const { start, cp1, cp2, end } = points;
    return `M${start.x},${start.y} C${cp1.x},${cp1.y} ${cp2.x},${cp2.y} ${end.x},${end.y}`;
  };

  // Handle for updating control point position
  const updateControlPoint = (pathId, pointKey, newX, newY) => {
    if (isAnimating) return; // Don't update during animation

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

  // Toggle edit mode and log path values when exiting edit mode
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

  // Update resetPaths function to set endpoints based on current dimensions
  const resetPaths = () => {
    const endX = planeDimensions.x - 20;

    // Create paths with dynamic end points
    const dynamicPaths = initialPaths.map((path) => ({
      ...path,
      points: {
        ...path.points,
        end: {
          ...path.points.end,
          x: endX, // Set x to be 50 units from the end
        },
      },
    }));

    setPaths(dynamicPaths);
    setSelectedPath(dynamicPaths[0]);
    localStorage.removeItem(STORAGE_KEY);
  };

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous drawing

    // Add margins for better axis display
    const margin = { top: 30, right: 30, bottom: 50, left: 50 };
    const width = 800 - margin.left - margin.right; // Changed from 500 to 800
    const height = 500 - margin.top - margin.bottom;

    // Create a group element that respects margins
    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Find the actual bounds of all paths to set domain properly
    let minX = Infinity,
      maxX = 0,
      minY = Infinity,
      maxY = 0;
    paths.forEach((path) => {
      Object.values(path.points).forEach((point) => {
        minX = Math.min(minX, point.x);
        maxX = Math.max(maxX, point.x);
        minY = Math.min(minY, point.y);
        maxY = Math.max(maxY, point.y);
      });
    });

    // Add some padding to the domains
    maxX += 20;
    maxY += 20;

    // Create scales for x and y using the dynamic dimensions
    const xScale = d3
      .scaleLinear()
      .domain([0, planeDimensions.x])
      .range([0, width]);
    const yScale = d3
      .scaleLinear()
      .domain([planeDimensions.y, 0])
      .range([0, height]); // Flipped

    // Function to transform points from data space to display space
    const transformPoint = (point) => ({
      x: xScale(point.x),
      y: yScale(point.y),
    });

    // Generate path string from points using the transform
    const generateTransformedPath = (points) => {
      const { start, cp1, cp2, end } = points;
      const tStart = transformPoint(start);
      const tCp1 = transformPoint(cp1);
      const tCp2 = transformPoint(cp2);
      const tEnd = transformPoint(end);
      return `M${tStart.x},${tStart.y} C${tCp1.x},${tCp1.y} ${tCp2.x},${tCp2.y} ${tEnd.x},${tEnd.y}`;
    };

    // Create axes with better styling
    const xAxis = d3
      .axisBottom(xScale)
      .ticks(5)
      .tickSize(-height)
      .tickFormat((d) => `${d}cm`);

    const yAxis = d3
      .axisLeft(yScale)
      .ticks(5)
      .tickSize(-width)
      .tickFormat((d) => `${d} cm`);

    // Add x-axis with improved styling
    g.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis)
      .selectAll("line")
      .attr("stroke", "#e0e0e0");

    // Add y-axis with improved styling
    g.append("g").call(yAxis).selectAll("line").attr("stroke", "#e0e0e0");

    // Add axis labels
    g.append("text")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom - 10)
      .attr("text-anchor", "middle")
      .text("Distance (cm)");

    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -margin.left + 15)
      .attr("text-anchor", "middle")
      .text("Height (cm)");

    // Function to update control lines when handles are moved - use transformed coordinates
    const updateControlLines = (svg, pathId) => {
      const path = paths.find((p) => p.id === pathId);
      if (!path) return;

      const tStart = transformPoint(path.points.start);
      const tCp1 = transformPoint(path.points.cp1);
      const tCp2 = transformPoint(path.points.cp2);
      const tEnd = transformPoint(path.points.end);

      // Update start to CP1 line
      svg
        .select(`[data-line="${pathId}-start-cp1"]`)
        .attr("x1", tStart.x)
        .attr("y1", tStart.y)
        .attr("x2", tCp1.x)
        .attr("y2", tCp1.y);

      // Update CP2 to end line
      svg
        .select(`[data-line="${pathId}-cp2-end"]`)
        .attr("x1", tCp2.x)
        .attr("y1", tCp2.y)
        .attr("x2", tEnd.x)
        .attr("y2", tEnd.y);
    };

    // Create drag behavior for control points with coordinate transformation
    const dragHandler = d3.drag().on("drag", (event, d) => {
      const { pathId, pointKey } = d;

      // Get coordinates relative to the SVG
      const svgCoordinates = d3.pointer(event, svgRef.current);

      // Adjust for the group's margin
      const adjustedX = svgCoordinates[0] - margin.left;
      const adjustedY = svgCoordinates[1] - margin.top;

      // Convert adjusted screen coordinates back to data coordinates
      const newX = Math.max(0, Math.min(maxX, xScale.invert(adjustedX)));
      const newY = Math.max(0, Math.min(maxY, yScale.invert(adjustedY)));

      // Update handle position with transformed coordinates
      d3.select(event.sourceEvent.target)
        .attr("cx", xScale(newX))
        .attr("cy", yScale(newY));

      // Update connecting lines
      updateControlLines(g, pathId);

      // Update the path data in our state
      updateControlPoint(pathId, pointKey, newX, newY);

      // Redraw the path
      const pathData = paths.find((p) => p.id === pathId);
      if (pathData) {
        const pathStr = generateTransformedPath(pathData.points);
        g.select(`path[data-id="${pathId}"]`).attr("d", pathStr);
      }
    });

    // Draw paths with transformed coordinates
    paths.forEach((path) => {
      const pathStr = generateTransformedPath(path.points);

      g.append("path")
        .attr("d", pathStr)
        .attr("stroke", path.color)
        .attr("stroke-width", path.id === selectedPath.id ? 4 : 2)
        .attr("fill", "none")
        .attr("data-id", path.id);

      // Only show control points and lines for selected path IN EDIT MODE
      if (path.id === selectedPath.id && isEditMode) {
        // Draw control point lines (gray dashed)
        const { start, cp1, cp2, end } = path.points;
        const tStart = transformPoint(start);
        const tCp1 = transformPoint(cp1);
        const tCp2 = transformPoint(cp2);
        const tEnd = transformPoint(end);

        // Start to CP1 with transformed coordinates
        g.append("line")
          .attr("x1", tStart.x)
          .attr("y1", tStart.y)
          .attr("x2", tCp1.x)
          .attr("y2", tCp1.y)
          .attr("stroke", "#999")
          .attr("stroke-dasharray", "4")
          .attr("data-line", `${path.id}-start-cp1`);

        // CP2 to End with transformed coordinates
        g.append("line")
          .attr("x1", tCp2.x)
          .attr("y1", tCp2.y)
          .attr("x2", tEnd.x)
          .attr("y2", tEnd.y)
          .attr("stroke", "#999")
          .attr("stroke-dasharray", "4")
          .attr("data-line", `${path.id}-cp2-end`);

        // Draw handles as draggable circles with transformed coordinates
        const handleRadius = 6;

        // Start handle
        g.append("circle")
          .datum({ pathId: path.id, pointKey: "start" })
          .attr("cx", tStart.x)
          .attr("cy", tStart.y)
          .attr("r", handleRadius)
          .attr("fill", path.color)
          .attr("stroke", "white")
          .attr("cursor", "move")
          .attr("class", "handle")
          .call(dragHandler);

        // CP1 handle
        g.append("circle")
          .datum({ pathId: path.id, pointKey: "cp1" })
          .attr("cx", tCp1.x)
          .attr("cy", tCp1.y)
          .attr("r", handleRadius)
          .attr("fill", path.color)
          .attr("stroke", "white")
          .attr("cursor", "move")
          .attr("class", "handle")
          .call(dragHandler);

        // CP2 handle
        g.append("circle")
          .datum({ pathId: path.id, pointKey: "cp2" })
          .attr("cx", tCp2.x)
          .attr("cy", tCp2.y)
          .attr("r", handleRadius)
          .attr("fill", path.color)
          .attr("stroke", "white")
          .attr("cursor", "move")
          .attr("class", "handle")
          .call(dragHandler);

        // End handle
        g.append("circle")
          .datum({ pathId: path.id, pointKey: "end" })
          .attr("cx", tEnd.x)
          .attr("cy", tEnd.y)
          .attr("r", handleRadius)
          .attr("fill", path.color)
          .attr("stroke", "white")
          .attr("cursor", "move")
          .attr("class", "handle")
          .call(dragHandler);
      }
    });

    // Draw ball with transformed starting position
    const ballStart = transformPoint(selectedPath.points.start);
    const ball = g
      .append("circle")
      .attr("r", 10)
      .attr("fill", "black")
      .attr("cx", ballStart.x)
      .attr("cy", ballStart.y);

    // Get path element for animation
    const pathElement = g.select(`path[stroke="${selectedPath.color}"]`).node();
    if (!pathElement) return;

    const pathLength = pathElement.getTotalLength();

    // Physics calculations
    const heightChange = Math.abs(
      selectedPath.points.end.y - selectedPath.points.start.y
    );
    const vFinal = Math.sqrt(2 * GRAVITY * heightChange);
    setTerminalVelocity(vFinal.toFixed(2));

    const speedFactor = 0.1; // Lower value = faster animation
    const tAscend = ((2 * pathLength) / vFinal) * speedFactor;
    setTimeToAscend(tAscend.toFixed(2));

    // Animate ball along the transformed path
    if (isAnimating) {
      ball
        .transition()
        .duration(tAscend * 1000)
        .ease(d3.easeQuadIn)
        .attrTween("cx", function () {
          return function (t) {
            const point = pathElement.getPointAtLength(t * pathLength);
            return point.x;
          };
        })
        .attrTween("cy", function () {
          return function (t) {
            const point = pathElement.getPointAtLength(t * pathLength);
            return point.y;
          };
        })
        .on("end", () => {
          setIsAnimating(false);
          setRunHistory((prev) => [
            ...prev,
            {
              id: new Date().getTime(),
              date: new Date().toLocaleString(),
              pathColor: selectedPath.color,
              timeToAscend: tAscend.toFixed(2),
              terminalVelocity: vFinal.toFixed(2),
            },
          ]);
        });
    }
  }, [selectedPath, isAnimating, paths, isEditMode, planeDimensions]);

  // Group run history records by ramp (path) color
  const groupedHistory = runHistory.reduce<Record<string, typeof runHistory>>(
    (acc, run) => {
      (acc[run.pathColor] = acc[run.pathColor] || []).push(run);
      return acc;
    },
    {}
  );

  return (
    <Flex direction="column" align="center" p={5}>
      <FormControl
        display="flex"
        alignItems="center"
        mt={4}
        justifyContent="space-between"
        width="100%"
      >
        <Flex alignItems="center">
          <FormLabel htmlFor="edit-mode" mb="0">
            Edit the Ramps
          </FormLabel>
          <Switch
            id="edit-mode"
            isChecked={isEditMode}
            onChange={toggleEditMode}
          />
        </Flex>
        <Button colorScheme="red" size="sm" onClick={resetPaths}>
          Reset to Default Paths
        </Button>
      </FormControl>

      {/* Add plane dimensions controls that only appear in edit mode */}
      {isEditMode && (
        <Box
          mt={4}
          p={4}
          border="1px solid gray"
          borderRadius="md"
          width="100%"
        >
          <Text fontSize="lg" mb={2}>
            Plane Dimensions
          </Text>
          <Flex gap={4}>
            <FormControl>
              <FormLabel htmlFor="x-dimension">Width (X) in cm:</FormLabel>
              <input
                id="x-dimension"
                type="number"
                min="100"
                value={planeDimensions.x}
                onChange={(e) => handleDimensionChange("x", e.target.value)}
                style={{
                  width: "100px",
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="y-dimension">Height (Y) in cm:</FormLabel>
              <input
                id="y-dimension"
                type="number"
                min="100"
                value={planeDimensions.y}
                onChange={(e) => handleDimensionChange("y", e.target.value)}
                style={{
                  width: "100px",
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
            </FormControl>
          </Flex>
        </Box>
      )}

      <Box>
        <svg
          ref={svgRef}
          width={800}
          height={500}
          style={{ border: "1px solid gray" }}
        />
      </Box>
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
      <Button
        mt={4}
        colorScheme="green"
        onClick={() => setIsAnimating(true)}
        disabled={isAnimating}
      >
        Launch Ball
      </Button>

      <Box mt={4} p={4} border="1px solid gray" borderRadius="md" width="100%">
        <Text fontSize="lg" mb={2}>
          Run History (Grouped by Ramp Color)
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
    </Flex>
  );
};

export default PhysicsVisualizer;
