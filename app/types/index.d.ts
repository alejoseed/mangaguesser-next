declare module "Mangaguesser" {
    export interface MangasResponse {
        mangas: string[],
        imageUrl: string,
    }

    export interface DailyManga {
        imageUrl: string,
        forDate: string,
    }

    export interface DailyStatus {
        alreadyPlayed: boolean,
        solved: boolean,
        attempts: number,
        attemptsRemaining: number,
    }

    export interface DailyGuessResult {
        correct: boolean,
        similarity?: number,
        attempts: number,
        attemptsRemaining: number,
        alreadyDone?: boolean,
    }
}

export {};