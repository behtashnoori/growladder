import { useState, useEffect } from 'react';
import { Check, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { orgStructureApi, OrgUnit } from '@/services/api/orgStructure';

interface UnitSelectorProps {
  title: string;
  unitType: 'management' | 'department' | 'section';
  selectedUnits: string[];
  onSelectionChange: (unitIds: string[]) => void;
  excludeIds?: string[];
  multiSelect?: boolean;
  onClose?: () => void;
}

const getUnitIcon = (unitType: string) => {
  switch (unitType) {
    case 'management':
      return '🏢';
    case 'department':
      return '🏛️';
    case 'section':
      return '📁';
    default:
      return '🏢';
  }
};

const getUnitTypeLabel = (unitType: string) => {
  switch (unitType) {
    case 'management':
      return 'مدیریت';
    case 'department':
      return 'اداره';
    case 'section':
      return 'بخش';
    default:
      return unitType;
  }
};

const UnitSelector = ({
  title,
  unitType,
  selectedUnits,
  onSelectionChange,
  excludeIds = [],
  multiSelect = true,
  onClose
}: UnitSelectorProps) => {
  const [units, setUnits] = useState<OrgUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadUnits = async () => {
      try {
        setLoading(true);
        const response = await orgStructureApi.getAvailableUnits(unitType);
        const filteredUnits = response.units.filter(
          unit => !excludeIds.includes(unit.id)
        );
        setUnits(filteredUnits);
      } catch (error) {
        console.error('Error loading units:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUnits();
  }, [unitType, excludeIds]);

  const filteredUnits = units.filter(unit =>
    unit.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUnitToggle = (unitId: string) => {
    if (multiSelect) {
      const newSelection = selectedUnits.includes(unitId)
        ? selectedUnits.filter(id => id !== unitId)
        : [...selectedUnits, unitId];
      onSelectionChange(newSelection);
    } else {
      onSelectionChange([unitId]);
    }
  };

  const handleSelectAll = () => {
    if (multiSelect) {
      const allIds = filteredUnits.map(unit => unit.id);
      const newSelection = selectedUnits.length === allIds.length ? [] : allIds;
      onSelectionChange(newSelection);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <span>{getUnitIcon(unitType)}</span>
            {title}
          </CardTitle>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        {multiSelect && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleSelectAll}
            className="w-full"
          >
            {selectedUnits.length === filteredUnits.length ? 'لغو انتخاب همه' : 'انتخاب همه'}
          </Button>
        )}
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder={`جستجو در ${getUnitTypeLabel(unitType)}ها...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10"
          />
        </div>

        {/* Units List */}
        <ScrollArea className="h-64">
          {loading ? (
            <div className="text-center py-4 text-gray-500">
              در حال بارگذاری...
            </div>
          ) : filteredUnits.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              {searchQuery ? 'نتیجه‌ای یافت نشد' : `${getUnitTypeLabel(unitType)}ی موجود نیست`}
            </div>
          ) : (
            <div className="space-y-1">
              {filteredUnits.map((unit) => {
                const isSelected = selectedUnits.includes(unit.id);
                return (
                  <div
                    key={unit.id}
                    className={`
                      flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors
                      ${isSelected ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'}
                    `}
                    onClick={() => handleUnitToggle(unit.id)}
                  >
                    <div className={`
                      w-5 h-5 rounded border-2 flex items-center justify-center
                      ${isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}
                    `}>
                      {isSelected && <Check className="h-3 w-3 text-white" />}
                    </div>
                    
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{unit.name}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {getUnitTypeLabel(unit.unitType)}
                        </Badge>
                        {unit.isIndependent && (
                          <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                            مستقل
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>

        {/* Selection Summary */}
        {selectedUnits.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="text-sm font-medium text-blue-900">
              {selectedUnits.length} {getUnitTypeLabel(unitType)} انتخاب شده
            </div>
            {selectedUnits.length <= 3 && (
              <div className="text-xs text-blue-700 mt-1">
                {selectedUnits.map(id => {
                  const unit = units.find(u => u.id === id);
                  return unit?.name;
                }).join(', ')}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UnitSelector;




