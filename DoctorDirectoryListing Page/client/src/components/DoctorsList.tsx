import { Loader2 } from "lucide-react";
import DoctorCard from "./DoctorCard";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { Doctor } from "@/types/doctor";

interface DoctorsListProps {
  doctors: Doctor[];
  loading: boolean;
  error: string | null;
}

export default function DoctorsList({ 
  doctors, 
  loading, 
  error 
}: DoctorsListProps) {
  // Show loading spinner
  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // Show error message
  if (error) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error}
        </AlertDescription>
      </Alert>
    );
  }

  // Show empty state
  if (doctors.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 text-center my-4">
        <div className="text-5xl mb-4 text-gray-300 flex justify-center">
          <AlertCircle className="h-16 w-16" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No doctors found</h3>
        <p className="text-gray-600">
          Try adjusting your search or filters to find what you're looking for.
        </p>
      </div>
    );
  }

  // Show doctor list
  return (
    <div className="space-y-4">
      {doctors.map(doctor => (
        <DoctorCard key={doctor.id} doctor={doctor} />
      ))}
    </div>
  );
}
