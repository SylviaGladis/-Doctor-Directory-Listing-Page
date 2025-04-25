import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn, SPECIALTIES, getSpecialtyTestId } from "@/lib/utils";
import type { FilterState } from "@/types/doctor";

interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export default function FilterPanel({ filters, onFilterChange }: FilterPanelProps) {
  const [openItems, setOpenItems] = useState<string[]>(["consultation", "specialties", "sort"]);

  const updateFilters = (partialFilters: Partial<FilterState>) => {
    onFilterChange({
      ...filters,
      ...partialFilters,
    });
  };

  const handleConsultationChange = (value: string) => {
    updateFilters({ consultationType: value as FilterState["consultationType"] });
  };

  const handleSpecialtyChange = (specialty: string, checked: boolean) => {
    if (checked) {
      updateFilters({ specialties: [...filters.specialties, specialty] });
    } else {
      updateFilters({ 
        specialties: filters.specialties.filter(s => s !== specialty) 
      });
    }
  };

  const handleSortChange = (value: string) => {
    updateFilters({ sortBy: value as FilterState["sortBy"] });
  };

  const clearAllFilters = () => {
    onFilterChange({
      searchTerm: "",
      consultationType: "",
      specialties: [],
      sortBy: "",
    });
  };

  const isItemOpen = (value: string) => openItems.includes(value);

  const toggleItem = (value: string) => {
    if (isItemOpen(value)) {
      setOpenItems(openItems.filter(item => item !== value));
    } else {
      setOpenItems([...openItems, value]);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sticky top-20">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Filters</h2>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-blue-600 hover:text-blue-800 h-auto p-0"
          onClick={clearAllFilters}
        >
          Clear All
        </Button>
      </div>

      <Accordion 
        type="multiple" 
        value={openItems}
        className="space-y-4"
      >
        {/* Consultation Mode Filter */}
        <AccordionItem value="consultation" className="border-b pb-2">
          <div className="flex justify-between items-center">
            <h3 
              data-testid="filter-header-moc" 
              className="font-medium"
            >
              Mode of consultation
            </h3>
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-0 h-8 w-8"
              onClick={() => toggleItem('consultation')}
            >
              {isItemOpen('consultation') ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </Button>
          </div>
          
          <AccordionContent className="pt-2">
            <RadioGroup 
              value={filters.consultationType} 
              onValueChange={handleConsultationChange}
            >
              <div className="flex items-center space-x-2 mb-2">
                <RadioGroupItem 
                  id="video-consult" 
                  value="video-consult" 
                  data-testid="filter-video-consult"
                />
                <Label htmlFor="video-consult">Video Consult</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem 
                  id="in-clinic" 
                  value="in-clinic" 
                  data-testid="filter-in-clinic"
                />
                <Label htmlFor="in-clinic">In Clinic</Label>
              </div>
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>

        {/* Specialty Filter */}
        <AccordionItem value="specialties" className="border-b pb-2">
          <div className="flex justify-between items-center">
            <h3 
              data-testid="filter-header-speciality" 
              className="font-medium"
            >
              Specialities
            </h3>
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-0 h-8 w-8"
              onClick={() => toggleItem('specialties')}
            >
              {isItemOpen('specialties') ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </Button>
          </div>

          <AccordionContent className="pt-2">
            <div className="max-h-60 overflow-y-auto pr-1">
              {SPECIALTIES.map((specialty) => (
                <div key={specialty} className="flex items-center space-x-2 mb-2">
                  <Checkbox 
                    id={`specialty-${specialty}`}
                    checked={filters.specialties.includes(specialty)}
                    onCheckedChange={(checked) => 
                      handleSpecialtyChange(specialty, checked as boolean)
                    }
                    data-testid={getSpecialtyTestId(specialty)}
                  />
                  <Label htmlFor={`specialty-${specialty}`} className="text-sm">
                    {specialty}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Sort Filter */}
        <AccordionItem value="sort" className="border-b-0 pb-0">
          <div className="flex justify-between items-center">
            <h3 
              data-testid="filter-header-sort" 
              className="font-medium"
            >
              Sort By
            </h3>
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-0 h-8 w-8"
              onClick={() => toggleItem('sort')}
            >
              {isItemOpen('sort') ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </Button>
          </div>

          <AccordionContent className="pt-2">
            <RadioGroup 
              value={filters.sortBy} 
              onValueChange={handleSortChange}
            >
              <div className="flex items-center space-x-2 mb-2">
                <RadioGroupItem 
                  id="sort-fees" 
                  value="fees" 
                  data-testid="sort-fees"
                />
                <Label htmlFor="sort-fees">Fees (Low to High)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem 
                  id="sort-experience" 
                  value="experience" 
                  data-testid="sort-experience"
                />
                <Label htmlFor="sort-experience">Experience (High to Low)</Label>
              </div>
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
