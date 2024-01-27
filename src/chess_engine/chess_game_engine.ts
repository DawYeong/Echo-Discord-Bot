import { ChessPieceState, Moves, Piece } from "./utils/chess_models";
import MoveGenerator from "./move_generator";

class ChessGameEngine {
  private board: Map<string, ChessPieceState> = new Map<
    string,
    ChessPieceState
  >();
  private turn: boolean; // true: Black move, false: White move
  //   private
  private valid_moves: Map<string, Array<string>>;

  private prev_move: [Piece, string, string] | null;

  constructor() {
    this.initializeBoard();
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

  private generateAllValidMoves() {
    // this.valid_move_set =
  }

  public printBoard() {
    console.log(this.board);
  }

  // attempt to move, if not in valid set, return false
  public move(): boolean {
    return false;
  }
}

const cge: ChessGameEngine = new ChessGameEngine();

cge.printBoard();
