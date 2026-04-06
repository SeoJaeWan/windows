declare module "*.png" {
  const value: string | { src: string; height: number; width: number };
  export default value;
}
