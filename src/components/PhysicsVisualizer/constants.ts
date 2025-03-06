import { Path } from "./types";

export const GRAVITY = 9.81; // Acceleration due to gravity (m/s²)
export const STORAGE_KEY = "physics-visualizer-paths";

export const initialPaths: Path[] = [
    {
      "id": "path1",
      "color": "orange",
      "points": {
        "start": {
          "x": 0,
          "y": 400
        },
        "cp1": {
          "x": 772.9629516601562,
          "y": 320.66468738374255
        },
        "cp2": {
          "x": 274.6295928955078,
          "y": 119.71232096354166
        },
        "end": {
          "x": 1180,
          "y": 50
        }
      }
    },
    {
      "id": "path2",
      "color": "blue",
      "points": {
        "start": {
          "x": 0,
          "y": 400
        },
        "cp1": {
          "x": 93.98146311442058,
          "y": 0
        },
        "cp2": {
          "x": 428.9814758300781,
          "y": 59.712320963541686
        },
        "end": {
          "x": 1180,
          "y": 50
        }
      }
    },
    {
      "id": "path3",
      "color": "teal",
      "points": {
        "start": {
          "x": 0,
          "y": 400
        },
        "cp1": {
          "x": 1200,
          "y": 304.47421119326634
        },
        "cp2": {
          "x": 767.9629007975261,
          "y": 119.71232096354166
        },
        "end": {
          "x": 1180,
          "y": 50
        }
      }
    },
    {
      "id": "path4",
      "color": "red",
      "points": {
        "start": {
          "x": 0,
          "y": 400
        },
        "cp1": {
          "x": 570.1805555555555,
          "y": 226.1953125
        },
        "cp2": {
          "x": 571.875,
          "y": 226.1953125
        },
        "end": {
          "x": 1180,
          "y": 50
        }
      }
    }
  ];
