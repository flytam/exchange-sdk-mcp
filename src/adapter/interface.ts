export interface ExchangeAdapter {
  getDoc(method: string): Promise<any>;
  listMethods(): Promise<
    {
      method: string;
      description?: string;
    }[]
  >;
}
