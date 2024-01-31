import { CollisionEvent, ChessPieceState } from "./chess_models";

export const ROOK_DIRECTIONS: number[][] = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
];

export const BISHOP_DIRECTIONS: number[][] = [
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1],
];

export const KNIGHT_DIRECTIONS: number[][] = [
  [2, 1],
  [-2, -1],
  [1, 2],
  [-1, -2],
  [1, -2],
  [-1, 2],
  [2, -1],
  [-2, 1],
];

type Conversion = {
  [label: string]: string;
};

export const COL_TO_NUMBER_MAP: Conversion = {
  A: "0",
  B: "1",
  C: "2",
  D: "3",
  E: "4",
  F: "5",
  G: "6",
  H: "7",
};

export const NUMBER_TO_COL_MAP: Conversion = {
  "0": "A",
  "1": "B",
  "2": "C",
  "3": "D",
  "4": "E",
  "5": "F",
  "6": "G",
  "7": "H",
};

export const ROW_TO_NUMBER_MAP: Conversion = {
  "8": "0",
  "7": "1",
  "6": "2",
  "5": "3",
  "4": "4",
  "3": "5",
  "2": "6",
  "1": "7",
};

export const NUMBER_TO_ROW_MAP: Conversion = {
  "0": "8",
  "1": "7",
  "2": "6",
  "3": "5",
  "4": "4",
  "5": "3",
  "6": "2",
  "7": "1",
};

export const getCollision = (
  board_state: Map<string, ChessPieceState>,
  new_location: string,
  team: boolean
): CollisionEvent => {
  const board_piece = board_state.get(new_location);

  return !board_piece
    ? CollisionEvent.NO_COLLISION
    : board_piece.black == team
    ? CollisionEvent.TEAM
    : CollisionEvent.OPPONENT;
};

export const isLocationInBounds = (location: number[]): boolean => {
  return (
    location[0] >= 0 && location[0] < 8 && location[1] >= 0 && location[1] < 8
  );
};
