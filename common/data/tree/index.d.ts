export namespace PassiveTree {
  export interface Data {
    bounds: Bounds;
    classes: Class[];
    nodes: Record<string, Node>;
    connections: Connection[];
    ascendancies: Record<string, Ascendancy>;
    masteryEffects: Record<string, MasteryEffect>;
  }

  export interface MasteryEffect {
    stats: string[];
  }

  export interface Bounds {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
  }

  export interface Ascendancy {
    name: string;
    startNodeId: string;
    nodes: Record<string, Node>;
    connections: Connection[];
  }

  export interface Node extends Coord {
    k: "Normal" | "Notable" | "Keystone" | "Mastery" | "Ascendancy_Start";
    text?: string;
  }

  export interface Coord {
    x: number;
    y: number;
  }

  export interface Connection {
    a: string;
    b: string;
    s?: Sweep;
  }

  export interface Sweep {
    w: "CW" | "CCW";
    r: number;
  }

  export interface Class {
    name: string;
    ascendancies: string[];
  }
}
