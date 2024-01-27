export enum CollisionEvent {
  TEAM,
  OPPONENT,
  NO_COLLISION,
}

export enum Piece {
  PAWN,
  ROOK,
  KNIGHT,
  BISHOP,
  QUEEN,
  KING,
}

export type ChessPieceState = {
  piece_type: Piece;
  num_of_moves: number;
  black: boolean;
};

export enum PieceAction {
  STANDARD,
  EN_PASSANT,
  CASTLE,
}

export type Moves = Array<[string, string, PieceAction]>;
