export interface Customer {
    id: number;
    name: string;
    phone: string;
    dob?: string;
    gender?: "MALE" | "FEMALE" | "OTHER";
    address?: string;
    profile_image?: string;
    pincode?: string;
    city?: string;
    state?: string;
    country?: string;
    state_code?: string;
    base_branch_id?: number;
    remarks?: string;
}
