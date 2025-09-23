import { useState, useEffect } from 'react';
import { X, Check, Search, Building, Folder, Plus, Minus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { orgStructureApi, OrgUnit } from '@/services/api/orgStructure';

interface DepartmentSectionSelectorProps {
  department: OrgUnit;
  onClose: () => void;
  onSave: (selectedSectionIds: string[]) => void;
}

const DepartmentSectionSelector = ({
  department,
  onClose,
  onSave
}: DepartmentSectionSelectorProps) => {
  const [allSections, setAllSections] = useState<OrgUnit[]>([]);
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Get all sections
        const response = await orgStructureApi.getAvailableUnits('section');
        const sections = response.units;
        setAllSections(sections);
        
        // Get currently assigned sections
        const currentlyAssigned = sections.filter(section => 
          section.parentId === department.id
        );
        setSelectedSections(currentlyAssigned.map(section => section.id));
        
      } catch (error) {
        console.error('Error loading sections:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [department.id]);

  // Available sections (not assigned to this department)
  const availableSections = allSections.filter(section => 
    section.parentId !== department.id
  );

  // Currently assigned sections
  const assignedSections = allSections.filter(section => 
    section.parentId === department.id
  );

  // Filter available sections by search
  const filteredAvailableSections = availableSections.filter(section =>
    section.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSectionToggle = (sectionId: string) => {
    setSelectedSections(prev => 
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleRemoveSection = (sectionId: string) => {
    setSelectedSections(prev => prev.filter(id => id !== sectionId));
  };

  const handleSave = () => {
    onSave(selectedSections);
  };

  const selectedSectionsData = allSections.filter(section =>
    selectedSections.includes(section.id)
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-green-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Folder className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                مدیریت بخش‌ها برای {department.name}
              </h2>
              <p className="text-sm text-gray-600">
                بخش‌های زیرمجموعه این اداره را انتخاب کنید
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex h-[calc(90vh-140px)]">
          {/* Left Panel - Available Sections */}
          <div className="flex-1 p-6 border-r">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Building className="h-5 w-5 text-blue-600" />
                  بخش‌های موجود
                  <Badge variant="secondary" className="text-xs">
                    {filteredAvailableSections.length}
                  </Badge>
                </h3>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="جستجو در بخش‌ها..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                />
              </div>

              {/* Available Sections List */}
              <ScrollArea className="h-[400px]">
                {loading ? (
                  <div className="text-center py-8 text-gray-500">
                    در حال بارگذاری...
                  </div>
                ) : filteredAvailableSections.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    {searchQuery ? 'نتیجه‌ای یافت نشد' : 'همه بخش‌ها اختصاص یافته‌اند'}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredAvailableSections.map((section) => {
                      const isSelected = selectedSections.includes(section.id);
                      return (
                        <div
                          key={section.id}
                          className={`
                            flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all border
                            ${isSelected 
                              ? 'bg-green-50 border-green-200 shadow-sm' 
                              : 'hover:bg-gray-50 border-gray-200'
                            }
                          `}
                          onClick={() => handleSectionToggle(section.id)}
                        >
                          <div className={`
                            w-5 h-5 rounded border-2 flex items-center justify-center transition-colors
                            ${isSelected ? 'bg-green-600 border-green-600' : 'border-gray-300'}
                          `}>
                            {isSelected && <Check className="h-3 w-3 text-white" />}
                          </div>
                          
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{section.name}</div>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                بخش
                              </Badge>
                              {section.headRoleAllowed && (
                                <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                                  دارای رئیس
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className={`
                            p-1 rounded transition-colors
                            ${isSelected ? 'bg-green-100' : 'bg-gray-100'}
                          `}>
                            {isSelected ? (
                              <Minus className="h-4 w-4 text-green-600" />
                            ) : (
                              <Plus className="h-4 w-4 text-gray-600" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </ScrollArea>
            </div>
          </div>

          {/* Right Panel - Assigned Sections */}
          <div className="w-96 p-6 bg-gray-50">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                بخش‌های این اداره
                <Badge variant="secondary" className="text-xs">
                  {selectedSections.length}
                </Badge>
              </h3>

              <Separator />

              <ScrollArea className="h-[400px]">
                {selectedSectionsData.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    هیچ بخشی اختصاص نیافته
                  </div>
                ) : (
                  <div className="space-y-2">
                    {selectedSectionsData.map((section) => (
                      <div
                        key={section.id}
                        className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200"
                      >
                        <div className="p-1 bg-green-100 rounded">
                          <Building className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 text-sm">
                            {section.name}
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <Badge variant="outline" className="text-xs">
                              بخش
                            </Badge>
                            {section.headRoleAllowed && (
                              <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                                دارای رئیس
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveSection(section.id)}
                          className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          title="حذف از این اداره"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <div className="text-sm text-gray-600">
            {selectedSections.length} بخش اختصاص یافته
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={onClose}>
              لغو
            </Button>
            <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
              ذخیره تغییرات
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentSectionSelector;




