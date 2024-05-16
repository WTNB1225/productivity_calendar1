interface Sha {
    username: string;
    access_token: string;
    reposName: string;
    id: number;
    sha: string[];
}

interface User {
  login: string;
  id: number;
  username: string;
}

declare module 'extractShaId' {
  export default function extractShaId(): Promise<Sha | undefined>;
}

declare module 'extractLinesOfCode' {
  export default function extractLinesOfCode(): Promise<number[]>;
}