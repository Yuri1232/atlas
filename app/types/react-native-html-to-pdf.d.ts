declare module "react-native-html-to-pdf" {
  interface Options {
    html: string;
    fileName: string;
    directory: string;
  }

  interface Result {
    filePath: string;
    base64: string;
  }

  const RNHTMLtoPDF: {
    convert(options: Options): Promise<Result>;
  };

  export default RNHTMLtoPDF;
}
