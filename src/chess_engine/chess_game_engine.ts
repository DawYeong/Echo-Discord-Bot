import {
  ChessPieceState,
  CollisionEvent,
  Moves,
  Piece,
  PieceAction,
} from "./utils/chess_models";
import MoveGenerator from "./move_generator";
import BoardVisualizer from "./board_visualizer";
import {
  BISHOP_DIRECTIONS,
  KNIGHT_DIRECTIONS,
  NUMBER_TO_COL_MAP,
  NUMBER_TO_ROW_MAP,
  ROOK_DIRECTIONS,
  getCollision,
  isLocationInBounds,
} from "./utils/chess_utils";

class ChessGameEngine {
  private board: Map<string, ChessPieceState> = new Map<
    string,
    ChessPieceState
  >();
  public turn: boolean; // true: Black move, false: White move
  //   private
  public valid_moves: Map<string, [string, PieceAction][]>;

  private prev_move: [Piece, string, string] | null;

  private board_visualizer: BoardVisualizer;

  private king_pos: Array<string>;

  private selected_pos: string;

  constructor() {
    this.initializeBoard();
    this.board_visualizer = new BoardVisualizer(this.board);
    this.king_pos = ["4,7", "4,0"];
    this.selected_pos = null;
  }

  private initializeBoard() {
    // add back-line pieces
    for (let i = 0; i < 2; i++) {
      this.board.set([0, 7 * i].join(","), {
        piece_type: Piece.ROOK,
        num_of_moves: 0,
        black: i % 2 == 0,
      });
      this.board.set([1, 7 * i].join(","), {
        piece_type: Piece.KNIGHT,
        num_of_moves: 0,
        black: i % 2 == 0,
      });
      this.board.set([2, 7 * i].join(","), {
        piece_type: Piece.BISHOP,
        num_of_moves: 0,
        black: i % 2 == 0,
      });
      this.board.set([3, 7 * i].join(","), {
        piece_type: Piece.QUEEN,
        num_of_moves: 0,
        black: i % 2 == 0,
      });
      this.board.set([4, 7 * i].join(","), {
        piece_type: Piece.KING,
        num_of_moves: 0,
        black: i % 2 == 0,
      });
      this.board.set([5, 7 * i].join(","), {
        piece_type: Piece.BISHOP,
        num_of_moves: 0,
        black: i % 2 == 0,
      });
      this.board.set([6, 7 * i].join(","), {
        piece_type: Piece.KNIGHT,
        num_of_moves: 0,
        black: i % 2 == 0,
      });
      this.board.set([7, 7 * i].join(","), {
        piece_type: Piece.ROOK,
        num_of_moves: 0,
        black: i % 2 == 0,
      });
    }

    // add pawns
    for (let i = 0; i < 8; i++) {
      this.board.set([i, 1].join(","), {
        piece_type: Piece.PAWN,
        num_of_moves: 0,
        black: true,
      });
      this.board.set([i, 6].join(","), {
        piece_type: Piece.PAWN,
        num_of_moves: 0,
        black: false,
      });
    }

    // set White to move first
    this.turn = false;
    this.prev_move = null;
  }

  private generateAllMoves(): Moves {
    const moves: Moves = [];
    const move_generator: MoveGenerator = new MoveGenerator(
      this.board,
      this.prev_move
    );
    this.board.forEach((piece: ChessPieceState, location: string) => {
      if (piece.black != this.turn) return;

      moves.push(...move_generator.getMoves(piece, location));
    });
    return moves;
  }

  private isKingSafe(
    board: Map<string, ChessPieceState>,
    king_move?: string
  ): boolean {
    const king_pos = (king_move ? king_move : this.king_pos[+this.turn])
      .split(",")
      .map((x) => Number(x));
    let new_location: number[];
    let collision: CollisionEvent;
    let piece: ChessPieceState;

    // check vertical and horizontal: ROOK, QUEEN
    for (const dir of ROOK_DIRECTIONS) {
      for (let i = 1; i < 8; i++) {
        new_location = [king_pos[0] + dir[0] * i, king_pos[1] + dir[1] * i];
        collision = getCollision(board, new_location.join(","), this.turn);

        if (isLocationInBounds(new_location)) {
          if (collision != CollisionEvent.NO_COLLISION) {
            piece = board.get(new_location.join(","));
            if (
              collision == CollisionEvent.OPPONENT &&
              (piece.piece_type == Piece.ROOK ||
                piece.piece_type == Piece.QUEEN ||
                (piece.piece_type == Piece.KING && i == 1))
            ) {
              return false;
            }
            break;
          }
        } else break;
      }
    }

    // check diagonals: BISHOP, QUEEN, PAWN (1 away)
    for (const dir of BISHOP_DIRECTIONS) {
      for (let i = 1; i < 8; i++) {
        new_location = [king_pos[0] + dir[0] * i, king_pos[1] + dir[1] * i];
        collision = getCollision(board, new_location.join(","), this.turn);

        if (isLocationInBounds(new_location)) {
          if (collision != CollisionEvent.NO_COLLISION) {
            piece = board.get(new_location.join(","));
            if (
              collision == CollisionEvent.OPPONENT &&
              (piece.piece_type == Piece.BISHOP ||
                piece.piece_type == Piece.QUEEN ||
                ((piece.piece_type == Piece.PAWN ||
                  piece.piece_type == Piece.KING) &&
                  i == 1))
            ) {
              return false;
            }
            break;
          }
        } else break;
      }
    }

    // check KNIGHT
    for (const dir of KNIGHT_DIRECTIONS) {
      new_location = [king_pos[0] + dir[0], king_pos[1] + dir[1]];
      collision = getCollision(board, new_location.join(","), this.turn);
      piece = board.get(new_location.join(","));
      if (
        isLocationInBounds(new_location) &&
        collision == CollisionEvent.OPPONENT &&
        piece.piece_type == Piece.KNIGHT
      ) {
        return false;
      }
    }

    return true;
  }

  public generateAllValidMoves() {
    this.valid_moves = new Map<string, [string, PieceAction][]>();
    const all_moves: Moves = this.generateAllMoves();
    let to_from: [string, string, PieceAction];
    all_moves.forEach((move) => {
      const temp_map = new Map(this.board);
      const piece = temp_map.get(move[0]);

      if (move[2] == PieceAction.CASTLE && !this.isKingSafe(temp_map)) {
        return;
      }

      // move piece to new location
      temp_map.set(move[1], piece);
      temp_map.delete(move[0]);

      if (move[2] == PieceAction.EN_PASSANT) {
        // move pawn behind enemy piece and take piece
        const new_loc = move[1].split(",").map((x) => Number(x));
        const opp_loc = [new_loc[0], new_loc[1] + (this.turn ? -1 : 1)].join(
          ","
        );
        temp_map.delete(opp_loc);
      }

      if (
        this.isKingSafe(
          temp_map,
          piece.piece_type == Piece.KING ? move[1] : null
        )
      ) {
        // valid move, add to move set
        if (this.valid_moves.has(move[0])) {
          this.valid_moves.get(move[0]).push([move[1], move[2]]);
        } else {
          this.valid_moves.set(move[0], [[move[1], move[2]]]);
        }
      }
    });
  }

  public printBoard() {
    console.log(this.board);
  }

  public getValidPieces(): string[] {
    const piece_entries: string[] = [];
    this.valid_moves.forEach((_, key) => {
      const pos = key.split(",");
      const piece = this.board.get(key);
      piece_entries.push(
        `${NUMBER_TO_COL_MAP[pos[0]]}${NUMBER_TO_ROW_MAP[pos[1]]} ${
          piece.piece_type
        }`
      );
    });
    return piece_entries;
  }

  public getPieceMoves(piece: string): string[] {
    console.log(this.valid_moves.get(piece));
    const piece_moves: string[] = this.valid_moves.get(piece).map((val) => {
      const loc = val[0].split(",");
      return `${NUMBER_TO_COL_MAP[loc[0]]}${NUMBER_TO_ROW_MAP[loc[1]]}`;
    });
    return piece_moves;
  }

  public selectPiece(location: string) {
    const piece_moves = this.valid_moves.get(location);

    this.board_visualizer.drawBoard(
      this.board,
      location,
      piece_moves.map((x) => x[0])
    );
    this.selected_pos = location;
  }

  public move(move_location: string) {
    // get move from valid_moves
    const move = this.valid_moves
      .get(this.selected_pos)
      .find((x) => x[0] == move_location);
    const piece = this.board.get(this.selected_pos);
    piece.num_of_moves += 1;

    if (piece.piece_type == Piece.KING)
      this.king_pos[+this.turn] = move_location;

    switch (move[1]) {
      case PieceAction.STANDARD: {
        //move
        this.board.set(move[0], piece);
        this.board.delete(this.selected_pos);
        break;
      }
      case PieceAction.EN_PASSANT: {
        const new_loc = move[0].split(",").map((x) => Number(x));
        const opp_loc = [new_loc[0], new_loc[1] + (this.turn ? -1 : 1)].join(
          ","
        );
        // const piece = this.board.get(move[0]);
        this.board.set(move_location, piece);
        this.board.delete(this.selected_pos);
        this.board.delete(opp_loc);
        break;
      }
      case PieceAction.CASTLE: {
        // move king
        this.board.set(move_location, piece);
        this.board.delete(this.selected_pos);

        // move rook
        const king_loc = this.selected_pos.split(",").map((x) => Number(x));
        const new_king_loc = move_location.split(",").map((x) => Number(x));
        const rook_loc = [
          king_loc[0] > new_king_loc[0] ? 0 : 7,
          king_loc[1],
        ].join(",");
        const new_rook_loc = [
          king_loc[0] + (king_loc[0] > new_king_loc[0] ? -1 : 1),
          king_loc[1],
        ].join(",");

        const rook_piece = this.board.get(rook_loc);
        this.board.set(new_rook_loc, rook_piece);
        this.board.delete(rook_loc);
        break;
      }
    }
    this.turn = !this.turn;
    this.prev_move = [piece.piece_type, this.selected_pos, move_location];
    console.log(this.king_pos);
  }

  public display(): string {
    return this.board_visualizer.drawBoard(this.board);
  }
}

export default ChessGameEngine;

// const cge = new ChessGameEngine();
// // cge.display();
// cge.generateAllValidMoves();
// console.log(cge.getValidPieces());
// cge.selectPiece("1,7");
