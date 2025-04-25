import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, Building2 } from "lucide-react";
import type { Doctor } from "@/types/doctor";

interface DoctorCardProps {
  doctor: Doctor;
}

export default function DoctorCard({ doctor }: DoctorCardProps) {
  const { 
    name, 
    specialties, 
    experience, 
    fees, 
    clinic, 
    image, 
    videoConsult, 
    inClinic 
  } = doctor;

  return (
    <Card 
      data-testid="doctor-card" 
      className="p-4 hover-shadow grid grid-cols-12 gap-4"
    >
      <div className="col-span-2 md:col-span-1">
        <div className="rounded-full w-16 h-16 overflow-hidden border-2 border-gray-200">
          {image ? (
            <img 
              src={image} 
              alt={`Dr. ${name}`} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-600 font-semibold">
              {name ? name.charAt(0) : "D"}
            </div>
          )}
        </div>
      </div>

      <div className="col-span-10 md:col-span-8">
        <h2 
          data-testid="doctor-name" 
          className="text-lg font-semibold text-primary"
        >
          {name}
        </h2>
        <p 
          data-testid="doctor-specialty" 
          className="text-sm text-gray-600 mb-1"
        >
          {specialties?.join(", ") || "General"}
        </p>
        <p 
          data-testid="doctor-experience" 
          className="text-sm text-gray-700 mb-1"
        >
          {experience || 0} years of experience
        </p>
        
        <div className="flex flex-wrap items-center gap-3 mt-2">
          <div className="flex items-center text-sm">
            <Building2 className="h-4 w-4 text-gray-500 mr-1" />
            <span>{clinic || "Medical Clinic"}</span>
          </div>
          
          {videoConsult && (
            <div className="flex items-center text-sm text-success">
              <Video className="h-4 w-4 mr-1" />
              <span>Video Consult</span>
            </div>
          )}
          
          {inClinic && (
            <div className="flex items-center text-sm text-primary">
              <Building2 className="h-4 w-4 mr-1" />
              <span>In Clinic</span>
            </div>
          )}
        </div>
      </div>

      <div className="col-span-12 md:col-span-3 flex flex-col justify-between items-center md:items-end mt-2 md:mt-0">
        <div className="text-right">
          <p 
            data-testid="doctor-fee" 
            className="text-lg font-semibold text-gray-800"
          >
            ₹ {fees || 0}
          </p>
          <p className="text-sm text-gray-600">Consultation Fee</p>
        </div>
        
        <Button className="w-full md:w-auto mt-2">
          Book Appointment
        </Button>
      </div>
    </Card>
  );
}
