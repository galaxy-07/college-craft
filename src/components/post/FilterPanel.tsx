
import React from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface FilterPanelProps {
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  onClearFilters: () => void;
  allTags: string[];
}

const FilterPanel = ({
  selectedTags,
  onTagToggle,
  onClearFilters,
  allTags
}: FilterPanelProps) => {
  return (
    <div className="space-y-4 bg-card/50 p-4 rounded-lg border">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Filter by tags</h3>
        {selectedTags.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClearFilters}
            className="h-8 px-2 text-xs"
          >
            Clear all
          </Button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {selectedTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2 w-full">
            {selectedTags.map(tag => (
              <Badge 
                key={tag} 
                variant="secondary"
                className="px-2 py-1 gap-1 cursor-pointer"
                onClick={() => onTagToggle(tag)}
              >
                #{tag}
                <X className="h-3 w-3" />
              </Badge>
            ))}
          </div>
        )}
        
        <ToggleGroup type="multiple" variant="outline" className="flex flex-wrap w-full">
          {allTags
            .filter(tag => !selectedTags.includes(tag))
            .map(tag => (
              <ToggleGroupItem 
                key={tag} 
                value={tag} 
                onClick={() => onTagToggle(tag)}
                className="text-xs h-7"
              >
                #{tag}
              </ToggleGroupItem>
            ))}
        </ToggleGroup>
      </div>
    </div>
  );
};

export default FilterPanel;
