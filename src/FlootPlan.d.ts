export namespace Volt {
  export interface FloorPlan {
    id: string;
    levels: Level[];
  }

  export interface Level {
    id: string;
    magicplanUid: string;
    locations: Location[];
    walls: Wall[];
  }

  export interface Location {
    id: string;
    magicplanUid: string;
    label: string;
    boundary: Boundary;
    windows: WindowStructure[];
    doors?: Door[];
  }

  export interface Boundary {
    id: string;
    points: Point[];
    height?: number;
  }

  export interface Point {
    id: string;
    magicplanUid: string;
    index?: number;
    x: number;
    y: number;
  }

  export interface Door {
    id: string;
    magicplanUid: string;
    label: string;
    hingePositionX: number;
    hingePositionY: number;
    latchPositionX: number;
    latchPositionY: number;
    width: number;
    height: number;
    depth: number;
    direction: number;
    type?: string;
  }

  export interface WindowStructure {
    id: string;
    magicplanUid: string;
    label: string;
    leftPositionX: number;
    leftPositionY: number;
    rightPositionX: number;
    rightPositionY: number;
    width: number;
    height: number;
    depth: number;
    distanceFromFloor: number;
  }

  export interface Wall {
    id: string;
    x1: number;
    x2: number;
    y1: number;
    y2: number;
    height: number;
    type: WallType;
  }

  export type WallType = "EXTERIOR" | "INTERIOR"
}