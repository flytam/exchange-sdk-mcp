export interface ExchangeAdapter {
  getDoc(method: string): Promise<string>;
  listMethods(): Promise<
    {
      method: string;
      description?: string;
    }[]
  >;
  getReadme(): Promise<string>;
}
