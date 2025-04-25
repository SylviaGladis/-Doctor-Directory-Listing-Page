import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { debounce } from "@/lib/utils";
import type { Doctor } from "@/types/doctor";

interface HeaderProps {
  doctors: Doctor[];
  onSearch: (searchTerm: string) => void;
  initialSearchTerm?: string;
}

export default function Header({ doctors, onSearch, initialSearchTerm = "" }: HeaderProps) {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [suggestions, setSuggestions] = useState<Doctor[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle outside clicks to close suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Update suggestions based on search term
  const updateSuggestions = (term: string) => {
    if (!term.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const matchingDoctors = doctors
      .filter(doctor => 
        doctor.name.toLowerCase().includes(term.toLowerCase())
      )
      .slice(0, 3);

    setSuggestions(matchingDoctors);
    setShowSuggestions(matchingDoctors.length > 0);
  };

  // Create debounced version of updateSuggestions
  const debouncedUpdateSuggestions = debounce(updateSuggestions, 300);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedUpdateSuggestions(value);
  };

  const handleSuggestionClick = (name: string) => {
    setSearchTerm(name);
    onSearch(name);
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch(searchTerm);
      setShowSuggestions(false);
    }
  };

  return (
    <header className="bg-primary py-3 px-4 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <div className="text-white text-xl font-bold">MediConsult</div>
        <div className="w-full max-w-2xl relative">
          <div className="relative">
            <Input
              data-testid="autocomplete-input"
              ref={inputRef}
              type="text"
              placeholder="Search Symptoms, Doctors, Specialties, Clinics"
              className="w-full py-2 px-4 pr-12 rounded-md focus:outline-none"
              value={searchTerm}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />
            <Button 
              className="absolute right-0 top-0 h-full px-3 bg-transparent hover:bg-transparent text-gray-400"
              variant="ghost"
              onClick={() => onSearch(searchTerm)}
            >
              <Search size={18} />
            </Button>
          </div>
          
          {showSuggestions && (
            <div 
              ref={suggestionsRef}
              className="absolute w-full bg-white mt-1 rounded-md shadow-lg z-10 overflow-hidden"
            >
              {suggestions.map(doctor => (
                <div
                  key={doctor.id}
                  data-testid="suggestion-item"
                  className="flex items-center p-3 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSuggestionClick(doctor.name)}
                >
                  <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden mr-3">
                    {doctor.image ? (
                      <img 
                        src={doctor.image} 
                        alt={doctor.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600">
                        {doctor.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{doctor.name}</div>
                    <div className="text-xs text-gray-600">
                      {doctor.specialties?.[0] || "General"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="text-white">
          <Button className="hidden md:block" variant="outline">
            Login / Signup
          </Button>
        </div>
      </div>
    </header>
  );
}
