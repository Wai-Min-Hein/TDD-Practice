export interface TokenGenerator {
  generate(userId: string): string;
}
