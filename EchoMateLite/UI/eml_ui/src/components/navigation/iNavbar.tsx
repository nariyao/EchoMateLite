interface SearchBarProps {
    onSearch?: (query: string, results?: any) => void;
    apiEndpoint?: string;
}

interface user {
    userId: string;
    username: string;
}


export type { SearchBarProps, user };