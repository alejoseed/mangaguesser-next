declare module "Mangaguesser" {
    export interface MangasResponse {
        CurrentStoredMangaId: string,
        mangas: string[],
        imageUrl: string,
    }
}

export {};