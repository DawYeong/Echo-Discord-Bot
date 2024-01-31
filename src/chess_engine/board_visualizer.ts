import { Canvas, createCanvas, CanvasRenderingContext2D } from "canvas";
import { ChessPieceState, Piece } from "./utils/chess_models";
import * as fs from "node:fs";
import * as path from "path";

const HEIGHT = 640,
  WIDTH = 640;
const OFFSET = HEIGHT / 8;
const CHAR_START = 65;

const FILENAME = path.join(__dirname, "board_state.png");

class BoardVisualizer {
  private canvas: Canvas;
  private ctx: CanvasRenderingContext2D;
  private font_size: number;

  constructor(board_state: Map<string, ChessPieceState>) {
    this.canvas = createCanvas(HEIGHT + OFFSET, WIDTH + OFFSET);
    this.ctx = this.canvas.getContext("2d");
    this.font_size = 24;

    this.drawBoard(board_state);
  }

  private drawEmptyBoard() {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        this.ctx.fillStyle = (row + col) % 2 ? "#fdcd9c" : "#915f2e";
        this.ctx.fillRect(
          OFFSET / 2 + col * OFFSET,
          OFFSET / 2 + row * OFFSET,
          OFFSET,
          OFFSET
        );
      }
    }

    this.ctx.fillStyle = "#000000";
    this.ctx.font = `${this.font_size}px Arial`;
    for (let i = 0; i < 8; i++) {
      this.ctx.fillText(
        (8 - i).toString(),
        OFFSET / 4,
        (i * HEIGHT) / 8 + OFFSET + this.font_size / 2
      );
      this.ctx.fillText(
        String.fromCharCode(CHAR_START + i),
        (i * WIDTH) / 8 + OFFSET - this.font_size / 2,
        HEIGHT + OFFSET - this.font_size / 2
      );
    }
  }

  private drawBase(x: number, y: number, black: boolean) {
    const baseX = OFFSET / 2 + x * OFFSET;
    const baseY = OFFSET * y + (OFFSET * 3) / 2;
    this.ctx.fillStyle = black ? "#000000" : "#FFFFFF";

    this.ctx.fillRect(baseX + 20, baseY - 15, 40, 12);
    this.ctx.fillRect(baseX + 10, baseY - 15, OFFSET - 20, 3);
    this.ctx.fillRect(baseX + 10, baseY - 10, OFFSET - 20, 3);

    this.ctx.beginPath();
    this.ctx.moveTo(baseX + 10, baseY - 15);
    this.ctx.lineTo(baseX + OFFSET - 10, baseY - 15);
    this.ctx.lineTo(baseX + OFFSET / 2, baseY - 35);
    this.ctx.fill();

    return [baseX, baseY];
  }

  private drawPawn(x: number, y: number, black: boolean) {
    const [baseX, baseY] = this.drawBase(x, y, black);

    this.ctx.fillRect(baseX + 32.5, baseY - 55, 15, 35);

    this.ctx.beginPath();
    this.ctx.arc(baseX + 40, baseY - 55, 16, 0, Math.PI * 2, true);
    this.ctx.fill();
  }

  private drawRook(x: number, y: number, black: boolean) {
    const [baseX, baseY] = this.drawBase(x, y, black);

    this.ctx.fillRect(baseX + 25, baseY - 50, 30, 45);
    this.ctx.fillRect(baseX + 15, baseY - 60, 50, 10);
    this.ctx.fillRect(baseX + 15, baseY - 70, 12, 10);
    this.ctx.fillRect(baseX + 53, baseY - 70, 12, 10);
    this.ctx.fillRect(baseX + 34, baseY - 70, 12, 10);
  }

  private drawKnight(x: number, y: number, black: boolean) {
    const [baseX, baseY] = this.drawBase(x, y, black);

    this.ctx.fillRect(baseX + 10, baseY - 17, OFFSET - 20, 2);

    this.ctx.beginPath();
    this.ctx.moveTo(baseX + 10, baseY - 15);
    this.ctx.lineTo(baseX + OFFSET / 2 - 5, baseY - 50);
    this.ctx.lineTo(baseX + 15, baseY - 60);
    this.ctx.lineTo(baseX + 15, baseY - 65);
    this.ctx.lineTo(baseX + OFFSET / 2 + 10, baseY - 70);
    this.ctx.lineTo(baseX + OFFSET - 10, baseY - 15);
    this.ctx.fill();
  }

  private drawBishop(x: number, y: number, black: boolean) {
    const [baseX, baseY] = this.drawBase(x, y, black);

    this.ctx.fillRect(baseX + 32.5, baseY - 45, 15, 30);
    this.ctx.fillRect(baseX + 25, baseY - 47, 30, 5);

    this.ctx.beginPath();
    this.ctx.ellipse(baseX + 40, baseY - 55, 12, 15, 0, 0, Math.PI * 2);
    this.ctx.ellipse(baseX + 40, baseY - 70, 5, 5, 0, 0, Math.PI * 2);
    // ctx.fill();
    this.ctx.closePath();

    this.ctx.moveTo(baseX + 40, baseY - 55);
    this.ctx.lineTo(baseX + 29, baseY - 60);
    this.ctx.lineTo(baseX + 27.75, baseY - 57);
    // ctx.lineTo(baseX + 50, baseY - 65);
    // ctx.lineTo(baseX + 24, baseY - 60);
    this.ctx.fill();
  }

  private drawQueen(x: number, y: number, black: boolean) {
    const [baseX, baseY] = this.drawBase(x, y, black);

    this.ctx.fillRect(baseX + 32.5, baseY - 45, 15, 30);
    this.ctx.fillRect(baseX + 27.5, baseY - 45, 25, 4);
    this.ctx.fillRect(baseX + OFFSET / 2 - 20, baseY - 53, 40, 3);

    this.ctx.beginPath();
    this.ctx.moveTo(baseX + OFFSET / 2, baseY - 35);
    this.ctx.lineTo(baseX + OFFSET / 2 + 15, baseY - 50);
    this.ctx.lineTo(baseX + OFFSET / 2 - 15, baseY - 50);
    this.ctx.closePath();

    this.ctx.moveTo(baseX + OFFSET / 2 + 15, baseY - 50);
    this.ctx.lineTo(baseX + OFFSET / 2 - 15, baseY - 50);
    this.ctx.lineTo(baseX + OFFSET / 2, baseY - 65);
    this.ctx.closePath();
    this.ctx.fill();

    this.ctx.beginPath();
    this.ctx.ellipse(baseX + OFFSET / 2, baseY - 70, 12, 15, 0, 0, Math.PI);
    this.ctx.fill();

    this.ctx.beginPath();
    this.ctx.moveTo(baseX + 28, baseY - 70);
    this.ctx.lineTo(baseX + 25, baseY - 75);
    this.ctx.lineTo(baseX + 30, baseY - 72);
    this.ctx.lineTo(baseX + 33, baseY - 75);
    this.ctx.lineTo(baseX + 35, baseY - 72);
    this.ctx.lineTo(baseX + 40, baseY - 77);
    this.ctx.lineTo(baseX + 45, baseY - 72);
    this.ctx.lineTo(baseX + 47, baseY - 75);
    this.ctx.lineTo(baseX + 50, baseY - 72);
    this.ctx.lineTo(baseX + 55, baseY - 75);
    this.ctx.lineTo(baseX + 52, baseY - 70);
    this.ctx.closePath();
    this.ctx.fill();

    this.ctx.beginPath();
    this.ctx.ellipse(baseX + 40, baseY - 77, 1.5, 1.5, 0, 0, Math.PI * 2);
    this.ctx.fill();
  }

  private drawKing(x: number, y: number, black: boolean) {
    const [baseX, baseY] = this.drawBase(x, y, black);

    this.ctx.fillRect(baseX + 32.5, baseY - 45, 15, 30);
    this.ctx.fillRect(baseX + 27.5, baseY - 45, 25, 4);
    this.ctx.fillRect(baseX + OFFSET / 2 - 20, baseY - 53, 40, 3);
    this.ctx.fillRect(baseX + OFFSET / 2 - 2.5, baseY - OFFSET + 2.5, 5, 20);
    this.ctx.fillRect(baseX + OFFSET / 2 - 10, baseY - OFFSET + 7.5, 20, 5);

    this.ctx.beginPath();
    this.ctx.moveTo(baseX + OFFSET / 2, baseY - 35);
    this.ctx.lineTo(baseX + OFFSET / 2 + 15, baseY - 50);
    this.ctx.lineTo(baseX + OFFSET / 2 - 15, baseY - 50);
    this.ctx.closePath();

    this.ctx.moveTo(baseX + OFFSET / 2 + 15, baseY - 50);
    this.ctx.lineTo(baseX + OFFSET / 2 - 15, baseY - 50);
    this.ctx.lineTo(baseX + OFFSET / 2, baseY - 65);
    this.ctx.closePath();
    this.ctx.fill();
  }

  private drawSelection(x: number, y: number, piece: boolean) {
    this.ctx.fillStyle = `rgba(${piece ? "255,77,1" : "0,128,0"},0.25`;
    this.ctx.fillRect(
      OFFSET / 2 + x * OFFSET,
      OFFSET / 2 + y * OFFSET,
      OFFSET,
      OFFSET
    );
  }

  private drawPiece(x: number, y: number, piece: ChessPieceState) {
    switch (piece.piece_type) {
      case Piece.PAWN: {
        this.drawPawn(x, y, piece.black);
        break;
      }
      case Piece.ROOK: {
        this.drawRook(x, y, piece.black);
        break;
      }
      case Piece.KNIGHT: {
        this.drawKnight(x, y, piece.black);
        break;
      }
      case Piece.BISHOP: {
        this.drawBishop(x, y, piece.black);
        break;
      }
      case Piece.KING: {
        this.drawKing(x, y, piece.black);
        break;
      }
      case Piece.QUEEN: {
        this.drawQueen(x, y, piece.black);
        break;
      }
      default: {
        break;
      }
    }
  }

  public drawBoard(
    board_state: Map<string, ChessPieceState>,
    selected_piece?: string,
    valid_moves?: string[]
  ): string {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawEmptyBoard();

    board_state.forEach((value: ChessPieceState, key: string) => {
      const pos = key.split(",");
      this.drawPiece(+pos[0], +pos[1], value);
    });

    if (selected_piece) {
      const piece_position = selected_piece.split(",");
      this.drawSelection(+piece_position[0], +piece_position[1], true);
    }

    if (valid_moves) {
      valid_moves.forEach((move) => {
        const move_pos = move.split(",");
        this.drawSelection(+move_pos[0], +move_pos[1], false);
      });
    }

    const buffer = this.canvas.toBuffer("image/png");

    fs.writeFile(FILENAME, buffer, (err) => {
      if (err) console.log(err);
    });

    return FILENAME;
  }
}

export default BoardVisualizer;
