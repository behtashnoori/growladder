import { useState, useEffect } from 'react';
import { X, Check, Search, Building, Folder, Plus, Minus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { orgStructureApi, OrgUnit } from '@/services/api/orgStructure';

interface ManagementDepartmentSelectorProps {
  management: OrgUnit;
  onClose: () => void;
  onSave: (selectedDepartmentIds: string[]) => void;
}

const ManagementDepartmentSelector = ({
  management,
  onClose,
  onSave
}: ManagementDepartmentSelectorProps) => {
  const [allDepartments, setAllDepartments] = useState<OrgUnit[]>([]);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Get all departments
        const response = await orgStructureApi.getAvailableUnits('department');
        const departments = response.units;
        setAllDepartments(departments);
        
        // Get currently assigned departments
        const currentlyAssigned = departments.filter(dept => 
          dept.parentId === management.id
        );
        setSelectedDepartments(currentlyAssigned.map(dept => dept.id));
        
      } catch (error) {
        console.error('Error loading departments:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [management.id]);

  // Available departments (not assigned to this management)
  const availableDepartments = allDepartments.filter(dept => 
    dept.parentId !== management.id
  );

  // Currently assigned departments
  const assignedDepartments = allDepartments.filter(dept => 
    dept.parentId === management.id
  );

  // Filter available departments by search
  const filteredAvailableDepartments = availableDepartments.filter(dept =>
    dept.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDepartmentToggle = (departmentId: string) => {
    setSelectedDepartments(prev => 
      prev.includes(departmentId)
        ? prev.filter(id => id !== departmentId)
        : [...prev, departmentId]
    );
  };

  const handleRemoveDepartment = (departmentId: string) => {
    setSelectedDepartments(prev => prev.filter(id => id !== departmentId));
  };

  const handleSave = () => {
    onSave(selectedDepartments);
  };

  const selectedDepartmentsData = allDepartments.filter(dept =>
    selectedDepartments.includes(dept.id)
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-blue-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                مدیریت اداره‌ها برای {management.name}
              </h2>
              <p className="text-sm text-gray-600">
                اداره‌های زیرمجموعه این مدیریت را انتخاب کنید
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex h-[calc(90vh-140px)]">
          {/* Left Panel - Available Departments */}
          <div className="flex-1 p-6 border-r">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Folder className="h-5 w-5 text-green-600" />
                  اداره‌های موجود
                  <Badge variant="secondary" className="text-xs">
                    {filteredAvailableDepartments.length}
                  </Badge>
                </h3>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="جستجو در اداره‌ها..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                />
              </div>

              {/* Available Departments List */}
              <ScrollArea className="h-[400px]">
                {loading ? (
                  <div className="text-center py-8 text-gray-500">
                    در حال بارگذاری...
                  </div>
                ) : filteredAvailableDepartments.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    {searchQuery ? 'نتیجه‌ای یافت نشد' : 'همه اداره‌ها اختصاص یافته‌اند'}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredAvailableDepartments.map((department) => {
                      const isSelected = selectedDepartments.includes(department.id);
                      return (
                        <div
                          key={department.id}
                          className={`
                            flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all border
                            ${isSelected 
                              ? 'bg-blue-50 border-blue-200 shadow-sm' 
                              : 'hover:bg-gray-50 border-gray-200'
                            }
                          `}
                          onClick={() => handleDepartmentToggle(department.id)}
                        >
                          <div className={`
                            w-5 h-5 rounded border-2 flex items-center justify-center transition-colors
                            ${isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}
                          `}>
                            {isSelected && <Check className="h-3 w-3 text-white" />}
                          </div>
                          
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{department.name}</div>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                اداره
                              </Badge>
                              {department.headRoleAllowed && (
                                <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                                  دارای رئیس
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className={`
                            p-1 rounded transition-colors
                            ${isSelected ? 'bg-blue-100' : 'bg-gray-100'}
                          `}>
                            {isSelected ? (
                              <Minus className="h-4 w-4 text-blue-600" />
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

          {/* Right Panel - Assigned Departments */}
          <div className="w-96 p-6 bg-gray-50">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                اداره‌های این مدیریت
                <Badge variant="secondary" className="text-xs">
                  {selectedDepartments.length}
                </Badge>
              </h3>

              <Separator />

              <ScrollArea className="h-[400px]">
                {selectedDepartmentsData.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    هیچ اداره‌ای اختصاص نیافته
                  </div>
                ) : (
                  <div className="space-y-2">
                    {selectedDepartmentsData.map((department) => (
                      <div
                        key={department.id}
                        className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200"
                      >
                        <div className="p-1 bg-green-100 rounded">
                          <Folder className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 text-sm">
                            {department.name}
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <Badge variant="outline" className="text-xs">
                              اداره
                            </Badge>
                            {department.headRoleAllowed && (
                              <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                                دارای رئیس
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveDepartment(department.id)}
                          className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          title="حذف از این مدیریت"
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
            {selectedDepartments.length} اداره اختصاص یافته
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={onClose}>
              لغو
            </Button>
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
              ذخیره تغییرات
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagementDepartmentSelector;