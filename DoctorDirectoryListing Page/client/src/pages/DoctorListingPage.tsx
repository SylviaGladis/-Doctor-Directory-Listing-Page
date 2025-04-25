import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import FilterPanel from "@/components/FilterPanel";
import DoctorsList from "@/components/DoctorsList";
import { useQueryParams } from "@/hooks/useQueryParams";
import type { Doctor, DoctorsState, FilterState } from "@/types/doctor";

export default function DoctorListingPage() {
  const [filters, setFilters] = useQueryParams();
  const [doctorsState, setDoctorsState] = useState<DoctorsState>({
    doctors: [],
    filteredDoctors: [],
    loading: true,
    error: null,
  });
  
  // Fetch doctors data
  const { data, isLoading, error } = useQuery({
    queryKey: ['https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json'],
    staleTime: Infinity, // Only fetch once
  });

  // Update doctors state when data is fetched
  useEffect(() => {
    if (isLoading) {
      setDoctorsState(prev => ({ ...prev, loading: true }));
      return;
    }

    if (error) {
      setDoctorsState(prev => ({ 
        ...prev, 
        loading: false, 
        error: "Failed to load doctors. Please try again." 
      }));
      return;
    }

    if (data) {
      // Transform API data to match our Doctor type
      const transformedData = (data as any[]).map(item => {
        // Parse experience from "X Years of experience" format
        let experienceYears = 0;
        if (typeof item.experience === 'string') {
          const match = item.experience.match(/(\d+)/);
          if (match && match[1]) {
            experienceYears = parseInt(match[1]);
          }
        }

        // Parse fees from "₹ X" format
        let feesAmount = 0;
        if (typeof item.fees === 'string') {
          const match = item.fees.match(/\d+/);
          if (match && match[0]) {
            feesAmount = parseInt(match[0]);
          }
        }

        return {
          id: Number(item.id || 0),
          name: item.name || "",
          specialties: Array.isArray(item.specialities) 
            ? item.specialities.map((s: any) => s.name).filter(Boolean) 
            : [],
          experience: experienceYears,
          fees: feesAmount,
          clinic: typeof item.clinic === 'object' ? item.clinic?.name || "" : "",
          image: item.photo || "",
          videoConsult: Boolean(item.video_consult),
          inClinic: true, // Assuming in-clinic is available if not specified
        } as Doctor;
      });
      
      setDoctorsState(prev => ({ 
        ...prev, 
        doctors: transformedData, 
        loading: false,
        error: null,
      }));
    }
  }, [data, isLoading, error]);

  // Apply filters when doctors or filters change
  useEffect(() => {
    if (doctorsState.doctors.length === 0) return;
    
    let filtered = [...doctorsState.doctors];
    
    // Filter by search term
    if (filters.searchTerm) {
      filtered = filtered.filter(doctor => 
        doctor.name.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }
    
    // Filter by consultation type
    if (filters.consultationType) {
      if (filters.consultationType === 'video-consult') {
        filtered = filtered.filter(doctor => doctor.videoConsult);
      } else if (filters.consultationType === 'in-clinic') {
        filtered = filtered.filter(doctor => doctor.inClinic);
      }
    }
    
    // Filter by specialties
    if (filters.specialties.length > 0) {
      filtered = filtered.filter(doctor => 
        doctor.specialties.some(specialty => 
          filters.specialties.includes(specialty)
        )
      );
    }
    
    // Sort doctors
    if (filters.sortBy) {
      if (filters.sortBy === 'fees') {
        filtered.sort((a, b) => a.fees - b.fees);
      } else if (filters.sortBy === 'experience') {
        filtered.sort((a, b) => b.experience - a.experience);
      }
    }
    
    setDoctorsState(prev => ({ ...prev, filteredDoctors: filtered }));
  }, [doctorsState.doctors, filters]);

  // Handle search
  const handleSearch = (searchTerm: string) => {
    setFilters({ ...filters, searchTerm });
  };

  // Handle filter changes
  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        doctors={doctorsState.doctors} 
        onSearch={handleSearch} 
        initialSearchTerm={filters.searchTerm}
      />

      <main className="container mx-auto px-4 py-6 flex-1">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Filter Panel */}
          <aside className="md:col-span-1">
            <FilterPanel 
              filters={filters} 
              onFilterChange={handleFilterChange} 
            />
          </aside>

          {/* Doctor Listing */}
          <div className="md:col-span-3">
            <div className="mb-4">
              <h1 className="text-2xl font-bold text-gray-800">Doctors Available</h1>
              <p className="text-gray-600">
                {doctorsState.loading 
                  ? "Loading doctors..." 
                  : `${doctorsState.filteredDoctors.length} doctors found`
                }
              </p>
            </div>

            <DoctorsList 
              doctors={doctorsState.filteredDoctors} 
              loading={doctorsState.loading} 
              error={doctorsState.error} 
            />
          </div>
        </div>
      </main>
    </div>
  );
}
