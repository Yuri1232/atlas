declare module "react-native-pdf-lib" {
  export class PDFDocument {
    constructor();
    addPage(options?: { width?: number; height?: number }): PDFPage;
    save(): Promise<string>;
  }

  export interface PDFPage {
    drawText(
      text: string,
      options: {
        x: number;
        y: number;
        size?: number;
        color?: string;
        font?: string;
      }
    ): PDFPage;
    drawLine(options: {
      start: { x: number; y: number };
      end: { x: number; y: number };
      thickness?: number;
      color?: string;
    }): PDFPage;
  }
}
