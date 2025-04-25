export interface Doctor {
  id: number;
  name: string;
  specialties: string[];
  experience: number;
  fees: number;
  clinic: string;
  image: string;
  videoConsult: boolean;
  inClinic: boolean;
}

export interface DoctorsState {
  doctors: Doctor[];
  filteredDoctors: Doctor[];
  loading: boolean;
  error: string | null;
}

export type ConsultationType = "video-consult" | "in-clinic" | "";
export type SortOption = "fees" | "experience" | "";

export interface FilterState {
  searchTerm: string;
  consultationType: ConsultationType;
  specialties: string[];
  sortBy: SortOption;
}
