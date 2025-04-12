declare module 'html-pdf-node' {
  interface Options {
    format?: string;
    path?: string;
    width?: number | string;
    height?: number | string;
    printBackground?: boolean;
    margin?: {
      top?: number | string;
      right?: number | string;
      bottom?: number | string;
      left?: number | string;
    };
  }

  interface File {
    content?: string;
    url?: string;
  }

  export function generatePdf(file: File, options?: Options): Promise<Buffer>;
}
