import { Fragments } from "./fragment/types";

export namespace RouteData {
  export type Route = Section[];

  export interface Section {
    name: string;
    steps: Step[];
  }

  export type Step = FragmentStep | GemStep;

  export interface FragmentStep {
    type: "fragment_step";
    parts: Fragments.AnyFragment[];
    subSteps: FragmentStep[];
  }

  export interface GemStep {
    type: "gem_step";
    requiredGem: RequiredGem;
    rewardType: "quest" | "vendor";
  }

  export interface RouteFile {
    name: string;
    contents: string;
  }

  export interface BuildData {
    characterClass: string;
    bandit: "None" | "Oak" | "Kraityn" | "Alira";
    leagueStart: boolean;
    library: boolean;
  }

  export interface BuildTree {
    name: string;
    version: string;
    url: string;
  }

  export interface RequiredGem {
    id: string;
    uid: string;
    note: string;
  }

  export interface GemLink {
    title: string;
    primaryGemIds: string[];
    secondaryGemIds: string[];
  }
}
