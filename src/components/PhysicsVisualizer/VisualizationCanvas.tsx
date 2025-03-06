import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { Box } from "@chakra-ui/react";
import { Path, PlaneDimensions, RunHistoryRecord, PathPoints } from "./types";
import { GRAVITY } from "./constants";

interface VisualizationCanvasProps {
  paths: Path[];
  selectedPath: Path;
  isAnimating: boolean;
  isEditMode: boolean;
  planeDimensions: PlaneDimensions;
  setIsAnimating: (isAnimating: boolean) => void;
  setTimeToAscend: (time: string) => void;
  setTerminalVelocity: (velocity: string) => void;
  updateControlPoint: (
    pathId: string,
    pointKey: string,
    newX: number,
    newY: number
  ) => void;
  addRunHistoryRecord: (record: Omit<RunHistoryRecord, "id" | "date">) => void;
  onRunComplete: (timeToAscend: number, terminalVelocity: number) => void;
}

export const VisualizationCanvas: React.FC<VisualizationCanvasProps> = ({
  paths,
  selectedPath,
  isAnimating,
  isEditMode,
  planeDimensions,
  setIsAnimating,
  setTimeToAscend,
  setTerminalVelocity,
  updateControlPoint,
  addRunHistoryRecord,
  onRunComplete,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous drawing

    // Add margins for better axis display
    const margin = { top: 30, right: 30, bottom: 50, left: 50 };
    const width = 800 - margin.left - margin.right;
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

    // Create scales for x and y using dynamic dimensions based on actual path bounds
    const xScale = d3
      .scaleLinear()
      .domain([0, Math.max(planeDimensions.x, maxX)])
      .range([0, width]);
    const yScale = d3
      .scaleLinear()
      .domain([0, Math.max(planeDimensions.y, maxY)])
      .range([height, 0]);

    // Function to transform points based on scales
    const transformPoint = (point: { x: number; y: number }) => ({
      x: xScale(point.x),
      y: yScale(point.y),
    });

    // Generate transformed path
    const generateTransformedPath = (points: PathPoints) => {
      const { start, cp1, cp2, end } = points;
      const tStart = transformPoint(start);
      const tCp1 = transformPoint(cp1);
      const tCp2 = transformPoint(cp2);
      const tEnd = transformPoint(end);
      return `M${tStart.x},${tStart.y} C${tCp1.x},${tCp1.y} ${tCp2.x},${tCp2.y} ${tEnd.x},${tEnd.y}`;
    };

    // Create axes
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

    // Add x-axis
    g.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis)
      .selectAll("line")
      .attr("stroke", "#e0e0e0");

    // Add y-axis
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

    // Update control lines function
    const updateControlLines = (
      svg: d3.Selection<SVGGElement, unknown, null, undefined>,
      pathId: string
    ): void => {
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

    type DragDatum = {
      pathId: string;
      pointKey: string;
    };

    const dragHandler = d3
      .drag<SVGCircleElement, DragDatum>()
      .on("drag", (event, d) => {
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

      // Show control points and lines for selected path in edit mode
      if (path.id === selectedPath.id && isEditMode) {
        const { start, cp1, cp2, end } = path.points;
        const tStart = transformPoint(start);
        const tCp1 = transformPoint(cp1);
        const tCp2 = transformPoint(cp2);
        const tEnd = transformPoint(end);

        // Start to CP1
        g.append("line")
          .attr("x1", tStart.x)
          .attr("y1", tStart.y)
          .attr("x2", tCp1.x)
          .attr("y2", tCp1.y)
          .attr("stroke", "#999")
          .attr("stroke-dasharray", "4")
          .attr("data-line", `${path.id}-start-cp1`);

        // CP2 to End
        g.append("line")
          .attr("x1", tCp2.x)
          .attr("y1", tCp2.y)
          .attr("x2", tEnd.x)
          .attr("y2", tEnd.y)
          .attr("stroke", "#999")
          .attr("stroke-dasharray", "4")
          .attr("data-line", `${path.id}-cp2-end`);

        // Draw handles as draggable circles
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
    const pathElement = g
      .select(`path[data-id="${selectedPath.id}"]`)
      .node() as SVGPathElement;
    if (!pathElement) return;

    const pathLength = pathElement.getTotalLength();

    // Physics calculations
    const heightChange = Math.abs(
      selectedPath.points.end.y - selectedPath.points.start.y
    );
    const vFinal = Math.sqrt(2 * GRAVITY * heightChange);

    const speedFactor = 0.1; // Lower value = faster animation
    const tAscend = ((2 * pathLength) / vFinal) * speedFactor;

    // Animate ball
    if (isAnimating) {
      ball
        .transition()
        .duration(tAscend * 1000)
        .ease(d3.easeQuadIn)
        .attrTween("cx", function () {
          return function (t: number) {
            const point = pathElement.getPointAtLength(t * pathLength);
            return point.x.toString();
          };
        })
        .attrTween("cy", function () {
          return function (t: number) {
            const point = pathElement.getPointAtLength(t * pathLength);
            return point.y.toString();
          };
        })
        .on("end", () => {
          // Call the onRunComplete callback with physics data
          onRunComplete(tAscend, vFinal);
        });
    }

    // Add inside useEffect, before drawing paths
    console.log("planeDimensions:", planeDimensions);
    console.log(
      "Path points:",
      paths.map((p) => p.points)
    );
  }, [
    paths,
    selectedPath,
    isAnimating,
    isEditMode,
    planeDimensions,
    updateControlPoint,
    onRunComplete,
  ]);

  return (
    <svg
      ref={svgRef}
      width={800}
      height={500}
      style={{
        border: "1px solid gray",
        borderRadius: "8px",
        backgroundColor: "#f9f9f9",
      }}
    />
  );
};
