export interface Customer {
    id: number;
    name: string;
    phone: string;
    age?: number;
    gender?: "MALE" | "FEMALE" | "OTHER";
    address?: string;
    base_branch_id?: number;
}
