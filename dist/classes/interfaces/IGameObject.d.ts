export interface IGameObject {
    hasNameValueEntry(key: string): boolean;
    getNameValueEntry(key: string): string;
}
