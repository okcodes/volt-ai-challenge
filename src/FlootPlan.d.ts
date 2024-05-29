export namespace Volt {
  // Union Types
  export type WallType = 'UNKNOWN' | 'INTERIOR' | 'EXTERIOR';
  export type WindowType = 'UNKNOWN' | 'SLIDING' | 'HUNG' | 'AWNING';
  export type DoorType = 'UNKNOWN' | 'HINGED_DOOR' | 'HINGED_DOUBLE_DOOR' | 'GARAGE' | 'OPENING';

  // Interfaces
  export interface FloorPlan {
    id: string; // uuid
    levels: Level[];
  }

  export interface Level {
    id: string; // uuid
    magicplanUid: string;
    label?: string; // custom name of the level
    floorLevel?: number; // basement, level 1, level 2 ..
    locations: Location[]; // different areas within the Level
    walls: Wall[]; // wall objects within the level
  }

  export interface Wall {
    id: string;
    x1: number;
    x2: number;
    y1: number;
    y2: number;
    height: number;
    thickness?: number;
    type: WallType;
  }

  export interface Location {
    id: string;
    label: string;
    magicplanUid: string;
    boundary: Boundary;
    windows: Window[];
    doors?: Door[];
  }

  export interface Window {
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
    type?: WindowType;
  }

  export interface Door {
    id: string;
    magicplanUid: string;
    twinMagicplanUid?: string;
    leadsTo?: Location[];
    label: string;
    hingePositionX: number;
    hingePositionY: number;
    latchPositionX: number;
    latchPositionY: number;
    width: number;
    height: number;
    depth: number;
    direction: number;
    type?: DoorType;
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
    z?: number;
  }
}
