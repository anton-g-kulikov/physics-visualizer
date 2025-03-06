export interface Point {
  x: number;
  y: number;
}

export interface PathPoints {
  start: Point;
  cp1: Point;
  cp2: Point;
  end: Point;
}

export interface Path {
  id: string;
  color: string;
  points: PathPoints;
}

export interface RunHistoryRecord {
  id: number;
  date: string;
  pathColor: string;
  timeToAscend: string;
  terminalVelocity: string;
}

export interface PlaneDimensions {
  x: number;
  y: number;
}

export interface VisualizationCanvasProps {
  paths: Path[];
  selectedPaths: Path[];
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
  onRunComplete: (times: number[], velocities: number[]) => void; 
}

export interface EditModePanelProps {
  isEditMode: boolean;
  toggleEditMode: () => void;
  planeDimensions: PlaneDimensions;
  handleDimensionChange: (dimension: "x" | "y", value: number) => void;
  resetPaths: () => void;
  isAnimating: boolean;
}

export interface PathControlsProps {
  paths: Path[];
  selectedPath: Path;
  setSelectedPath: (path: Path) => void;
}

export interface RampControlsProps {
  paths: Path[];
  selectedPaths: Path[];
  setSelectedPaths: (paths: Path[]) => void;
  isAnimating: boolean;
  onLaunch: () => void;
}

export interface RampDesignerProps {
  planeDimensions: PlaneDimensions;
  handleDimensionChange: (dimension: "x" | "y", value: number) => void;
  resetPaths: () => void;
  isAnimating: boolean;
}

export interface LaunchButtonProps {
  isAnimating: boolean;
  setIsAnimating: (isAnimating: boolean) => void;
}

export interface RunHistoryTableProps {
  runHistory: RunHistoryRecord[];
}

export interface EditModeToggleProps {
  isEditMode: boolean;
  toggleEditMode: () => void;
}
