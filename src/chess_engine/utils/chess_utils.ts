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
