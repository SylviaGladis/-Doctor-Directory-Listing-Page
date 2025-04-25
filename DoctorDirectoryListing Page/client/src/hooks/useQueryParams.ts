import { useEffect, useState } from "react";
import { useLocation, useSearch } from "wouter";
import type { ConsultationType, FilterState, SortOption } from "@/types/doctor";

export function useQueryParams(): [FilterState, (filters: FilterState) => void] {
  const [search, setSearch] = useSearch();
  const [, navigate] = useLocation();
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: "",
    consultationType: "",
    specialties: [],
    sortBy: "",
  });

  // Parse URL params when component mounts or URL changes
  useEffect(() => {
    const params = new URLSearchParams(search);
    
    const searchTerm = params.get("search") || "";
    const consultationType = (params.get("consultation") || "") as ConsultationType;
    const specialties = params.getAll("specialty");
    const sortBy = (params.get("sort") || "") as SortOption;
    
    setFilters({
      searchTerm,
      consultationType,
      specialties,
      sortBy,
    });
  }, [search]);

  // Update URL params when filters change
  const updateQueryParams = (newFilters: FilterState) => {
    const params = new URLSearchParams();
    
    if (newFilters.searchTerm) {
      params.set("search", newFilters.searchTerm);
    }
    
    if (newFilters.consultationType) {
      params.set("consultation", newFilters.consultationType);
    }
    
    newFilters.specialties.forEach(specialty => {
      params.append("specialty", specialty);
    });
    
    if (newFilters.sortBy) {
      params.set("sort", newFilters.sortBy);
    }
    
    setSearch(params.toString() ? `?${params.toString()}` : "");
    setFilters(newFilters);
  };

  return [filters, updateQueryParams];
}
