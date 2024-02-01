import {
  ChessPieceState,
  CollisionEvent,
  Moves,
  Piece,
  PieceAction,
} from "./utils/chess_models";
import {
  isLocationInBounds,
  getCollision,
  ROOK_DIRECTIONS,
  BISHOP_DIRECTIONS,
  KNIGHT_DIRECTIONS,
} from "./utils/chess_utils";

class MoveGenerator {
  private curr_board_state: Map<string, ChessPieceState>;
  private prev_move: [Piece, string, string] | null;

  constructor(
    board: Map<string, ChessPieceState>,
    prev_move: [Piece, string, string] | null
  ) {
    this.curr_board_state = board;
    this.prev_move = prev_move;
  }

  private getBackLineMoves(
    piece: ChessPieceState,
    location: string,
    directions: number[][],
    range: number
  ) {
    const moves: Moves = [];
    const curr_location: number[] = location.split(",").map((x) => Number(x));
    let new_location: number[];

    directions.forEach((dir) => {
      for (let i = 1; i <= range; i++) {
        new_location = [
          curr_location[0] + dir[0] * i,
          curr_location[1] + dir[1] * i,
        ];
        const collision = getCollision(
          this.curr_board_state,
          new_location.join(","),
          piece.black
        );

        if (
          isLocationInBounds(new_location) &&
          collision != CollisionEvent.TEAM
        ) {
          moves.push([location, new_location.join(","), PieceAction.STANDARD]);
          // add the move but break afterwards if there is an opponent
          if (collision == CollisionEvent.OPPONENT) break;
        } else break; // break when we see a teammate
      }
    });
    return moves;
  }

  private getPawnMoves(piece: ChessPieceState, location: string): Moves {
    // how to handle en passant?
    // can only perform en passant if the opponent moves pawn 2 squares and in the same rank as this pawn
    // also en passant must be played immediately after opponent has moved pawn
    // need to know: if previous move was a pawn, if it moved 2 spaces (implies it is the first move), is the same rank as pawn
    const pawn_moves: Moves = [];
    // pawns cannot move backwards
    const direction: number = piece.black ? 1 : -1;
    const coords: number[] = location.split(",").map((x) => Number(x));
    // standard movement move up once or twice
    let new_location = [coords[0], coords[1] + direction];
    if (
      isLocationInBounds(new_location) &&
      getCollision(
        this.curr_board_state,
        new_location.join(","),
        piece.black
      ) == CollisionEvent.NO_COLLISION
    )
      pawn_moves.push([location, new_location.join(","), PieceAction.STANDARD]);

    // move 2 spots
    if (piece.num_of_moves == 0 && pawn_moves.length) {
      new_location = [coords[0], coords[1] + direction * 2];
      if (
        isLocationInBounds(new_location) &&
        getCollision(
          this.curr_board_state,
          new_location.join(","),
          piece.black
        ) == CollisionEvent.NO_COLLISION
      )
        pawn_moves.push([
          location,
          new_location.join(","),
          PieceAction.STANDARD,
        ]);
    }

    if (!this.prev_move) return pawn_moves;

    const prev_start = this.prev_move[1].split(",").map((x) => Number(x));
    const prev_end = this.prev_move[2].split(",").map((x) => Number(x));
    const distance_traveled = [
      Math.abs(prev_start[0] - prev_end[0]),
      Math.abs(prev_start[1] - prev_end[1]),
    ];

    // check diagonals + en passant
    [direction, -direction].forEach((dir) => {
      new_location = [coords[0] + dir, coords[1] + direction];
      const en_passant_location = [coords[0] + dir, coords[1]];
      // console.log(
      //   `new_location: ${new_location}, en_passant: ${en_passant_location}`
      // );
      if (
        isLocationInBounds(new_location) &&
        getCollision(
          this.curr_board_state,
          new_location.join(","),
          piece.black
        ) == CollisionEvent.OPPONENT
      )
        pawn_moves.push([
          location,
          new_location.join(","),
          PieceAction.STANDARD,
        ]);

      if (
        isLocationInBounds(en_passant_location) &&
        this.prev_move[0] == Piece.PAWN &&
        this.prev_move[2] == en_passant_location.join(",") &&
        distance_traveled[0] == 0 &&
        distance_traveled[1] == 2
      ) {
        console.log(`HERE: ${new_location}, ${en_passant_location}`);
        pawn_moves.push([
          location,
          new_location.join(","),
          PieceAction.EN_PASSANT,
        ]);
      }
    });

    return pawn_moves;
  }

  private checkCastle(
    pieces: Array<[string, ChessPieceState]>,
    curr_piece: ChessPieceState
  ): boolean {
    return (
      pieces.length == 1 &&
      pieces[0][1].piece_type == Piece.ROOK &&
      pieces[0][1].black == curr_piece.black &&
      pieces[0][1].num_of_moves == 0
    );
  }

  private getKingMoves(piece: ChessPieceState, location: string) {
    // add standard directions
    const king_moves: Moves = this.getBackLineMoves(
      piece,
      location,
      ROOK_DIRECTIONS.concat(BISHOP_DIRECTIONS),
      1
    );

    // add castle moves
    // left castle and right castle
    // lane must be open, king and rook must not have moved, king must not be in check (can be check outside)

    if (piece.num_of_moves == 0) {
      // right and left
      const curr_location = location.split(",").map((x) => Number(x));
      const items = Array.from(this.curr_board_state.entries());
      const left_pieces: Array<[string, ChessPieceState]> = [];
      const right_pieces: Array<[string, ChessPieceState]> = [];
      items.forEach((entry) => {
        const location = entry[0].split(",").map((x) => Number(x));

        if (location[1] == curr_location[1]) {
          // same row
          if (location[0] < curr_location[0]) left_pieces.push(entry);
          else if (location[0] > curr_location[0]) right_pieces.push(entry);
        }
      });

      if (this.checkCastle(left_pieces, piece))
        king_moves.push([
          location,
          [curr_location[0] - 2, curr_location[1]].join(","),
          PieceAction.CASTLE,
        ]);

      if (this.checkCastle(right_pieces, piece))
        king_moves.push([
          location,
          [curr_location[0] + 2, curr_location[1]].join(","),
          PieceAction.CASTLE,
        ]);
    }

    return king_moves;
  }

  public getMoves(piece: ChessPieceState, location: string): Moves {
    switch (piece.piece_type) {
      case Piece.PAWN: {
        return this.getPawnMoves(piece, location);
      }
      case Piece.ROOK: {
        return this.getBackLineMoves(piece, location, ROOK_DIRECTIONS, 7);
      }
      case Piece.BISHOP: {
        return this.getBackLineMoves(piece, location, BISHOP_DIRECTIONS, 7);
      }
      case Piece.QUEEN: {
        return this.getBackLineMoves(
          piece,
          location,
          ROOK_DIRECTIONS.concat(BISHOP_DIRECTIONS),
          7
        );
      }
      case Piece.KNIGHT: {
        return this.getBackLineMoves(piece, location, KNIGHT_DIRECTIONS, 1);
      }
      case Piece.KING: {
        return this.getKingMoves(piece, location);
      }
      default: {
        return [];
      }
    }
  }
}

export default MoveGenerator;

// const test_board = new Map<string, ChessPieceState>();
// test_board.set("3,3", {
//   piece_type: Piece.PAWN,
//   num_of_moves: 2,
//   black: false,
// });
// test_board.set("4,3", {
//   piece_type: Piece.PAWN,
//   num_of_moves: 1,
//   black: true,
// });

// const mg = new MoveGenerator(test_board, [Piece.PAWN, "4,1", "4,3"]);
// const moves = mg.getMoves(
//   {
//     piece_type: Piece.PAWN,
//     num_of_moves: 2,
//     black: false,
//   },
//   "3,3"
// );

// console.log(moves);
