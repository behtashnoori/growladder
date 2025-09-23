import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Building, Plus, RotateCcw, Info } from 'lucide-react';
import OrgTreeView from '@/components/org/OrgTreeView';
import ManagementDepartmentSelector from '@/components/org/ManagementDepartmentSelector';
import DepartmentSectionSelector from '@/components/org/DepartmentSectionSelector';
import { orgStructureApi, OrgUnit } from '@/services/api/orgStructure';

const OrgStructurePage = () => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [selectedUnit, setSelectedUnit] = useState<OrgUnit | null>(null);
  const [showDepartmentSelector, setShowDepartmentSelector] = useState(false);
  const [showSectionSelector, setShowSectionSelector] = useState(false);
  const [selectedManagement, setSelectedManagement] = useState<OrgUnit | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<OrgUnit | null>(null);
  const [unitToDelete, setUnitToDelete] = useState<OrgUnit | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [treeData, setTreeData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const loadTreeData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await orgStructureApi.getTree();
      setTreeData(data);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTreeData();
  }, []);

  const refetch = () => {
    loadTreeData();
  };

  // No auto-expand to avoid infinite loop
  // Users can manually expand nodes as needed

  const handleToggleExpand = (nodeId: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  const handleInitialize = async () => {
    try {
      const result = await orgStructureApi.initialize();
      toast({
        title: "✅ ساختار سازمانی اولیه ایجاد شد",
        description: `${result.counts.managements} مدیریت، ${result.counts.independentDepartments} اداره مستقل، ${result.counts.sections} بخش ایجاد شد`,
        duration: 5000,
      });
      loadTreeData();
    } catch (error) {
      toast({
        title: "❌ خطا در ایجاد ساختار اولیه",
        description: "خطایی در ایجاد ساختار سازمانی رخ داد",
        variant: "destructive",
      });
    }
  };

  const handleAddChild = (parentId: string) => {
    const parent = findUnitById(treeData?.tree || [], parentId);
    if (!parent) return;

    if (parent.unitType === 'management') {
      setSelectedManagement(parent);
      setShowDepartmentSelector(true);
    } else if (parent.unitType === 'department') {
      setSelectedDepartment(parent);
      setShowSectionSelector(true);
    }
  };

  const handleEditUnit = (unit: OrgUnit) => {
    // TODO: Implement edit functionality
    toast({
      title: "ویرایش واحد",
      description: `ویرایش ${unit.name} - این قابلیت به زودی اضافه خواهد شد`,
    });
  };

  const handleMoveUnit = (unit: OrgUnit) => {
    // TODO: Implement move functionality
    toast({
      title: "انتقال واحد",
      description: `انتقال ${unit.name} - این قابلیت به زودی اضافه خواهد شد`,
    });
  };

  const handleDeleteUnit = (unit: OrgUnit) => {
    setUnitToDelete(unit);
  };

  const confirmDeleteUnit = async () => {
    if (!unitToDelete) return;

    try {
      await orgStructureApi.deleteUnit(unitToDelete.id);
      toast({
        title: "✅ واحد حذف شد",
        description: `${unitToDelete.name} با موفقیت حذف شد`,
      });
      loadTreeData();
    } catch (error: any) {
      toast({
        title: "❌ خطا در حذف واحد",
        description: error.response?.data?.message || "خطایی در حذف واحد رخ داد",
        variant: "destructive",
      });
    } finally {
      setUnitToDelete(null);
    }
  };

  const handleDepartmentSelection = async (selectedDepartmentIds: string[]) => {
    if (!selectedManagement) return;

    try {
      // Remove existing departments first
      const existingDepartments = await orgStructureApi.getAvailableUnits('department');
      const currentDepartments = existingDepartments.units.filter(dept => 
        dept.parentId === selectedManagement.id
      );
      
      for (const dept of currentDepartments) {
        try {
          await orgStructureApi.moveUnit({ unitId: dept.id, newParentId: null });
        } catch (error) {
          // Ignore errors for units that don't exist
        }
      }

      // Add new departments
      for (const departmentId of selectedDepartmentIds) {
        await orgStructureApi.moveUnit({
          unitId: departmentId,
          newParentId: selectedManagement.id
        });
      }

      toast({
        title: "✅ اداره‌ها به‌روزرسانی شدند",
        description: `${selectedDepartmentIds.length} اداره به ${selectedManagement.name} اضافه شد`,
      });

      loadTreeData();
    } catch (error) {
      toast({
        title: "❌ خطا در به‌روزرسانی اداره‌ها",
        description: "خطایی در به‌روزرسانی اداره‌های مدیریت رخ داد",
        variant: "destructive",
      });
    } finally {
      setShowDepartmentSelector(false);
      setSelectedManagement(null);
    }
  };

  const handleSectionSelection = async (selectedSectionIds: string[]) => {
    if (!selectedDepartment) return;

    try {
      // Remove existing sections first
      const existingSections = await orgStructureApi.getAvailableUnits('section');
      const currentSections = existingSections.units.filter(section => 
        section.parentId === selectedDepartment.id
      );
      
      for (const section of currentSections) {
        try {
          await orgStructureApi.moveUnit({ unitId: section.id, newParentId: null });
        } catch (error) {
          // Ignore errors for units that don't exist
        }
      }

      // Add new sections
      for (const sectionId of selectedSectionIds) {
        await orgStructureApi.moveUnit({
          unitId: sectionId,
          newParentId: selectedDepartment.id
        });
      }

      toast({
        title: "✅ بخش‌ها به‌روزرسانی شدند",
        description: `${selectedSectionIds.length} بخش به ${selectedDepartment.name} اضافه شد`,
      });

      loadTreeData();
    } catch (error) {
      toast({
        title: "❌ خطا در به‌روزرسانی بخش‌ها",
        description: "خطایی در به‌روزرسانی بخش‌های اداره رخ داد",
        variant: "destructive",
      });
    } finally {
      setShowSectionSelector(false);
      setSelectedDepartment(null);
    }
  };

  // Helper functions
  const findUnitById = (units: OrgUnit[], id: string): OrgUnit | null => {
    for (const unit of units) {
      if (unit.id === id) return unit;
      if (unit.children) {
        const found = findUnitById(unit.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const getAllChildrenIds = (unit: OrgUnit): string[] => {
    if (!unit.children) return [];
    const ids: string[] = [];
    unit.children.forEach(child => {
      ids.push(child.id);
      ids.push(...getAllChildrenIds(child));
    });
    return ids;
  };

  const getTotalUnits = (units: OrgUnit[]): number => {
    let count = units.length;
    units.forEach(unit => {
      if (unit.children) {
        count += getTotalUnits(unit.children);
      }
    });
    return count;
  };

  if (isLoading) {
    return (
      <div className="p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">در حال بارگذاری ساختار سازمانی...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-red-600 mb-4">خطا در بارگذاری ساختار سازمانی</p>
              <Button onClick={() => refetch()}>تلاش مجدد</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalUnits = getTotalUnits(treeData?.tree || []);

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Building className="h-8 w-8 text-blue-600" />
            ساختار سازمانی
          </h1>
          <p className="text-gray-600 mt-1">
            مدیریت و ویرایش ساختار درختی سازمان
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm">
            {totalUnits} واحد سازمانی
          </Badge>
          <Button
            onClick={handleInitialize}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            ایجاد ساختار اولیه
          </Button>
        </div>
      </div>

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">راهنمای استفاده:</p>
              <ul className="space-y-1 text-blue-700">
                <li>• روی <strong>ایجاد ساختار اولیه</strong> کلیک کنید تا از داده‌های موجود ساختار ایجاد شود</li>
                <li>• روی دکمه <strong>"انتخاب اداره‌ها"</strong> کنار مدیریت‌ها کلیک کنید تا اداره‌ها را به آنها اختصاص دهید</li>
                <li>• روی دکمه <strong>"انتخاب بخش‌ها"</strong> کنار اداره‌ها کلیک کنید تا بخش‌ها را به آنها اختصاص دهید</li>
                <li>• از آیکون‌های کنار هر واحد برای ویرایش، انتقال یا حذف استفاده کنید</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tree View */}
      <OrgTreeView
        units={treeData?.tree || []}
        onAddChild={handleAddChild}
        onEdit={handleEditUnit}
        onDelete={handleDeleteUnit}
        onMove={handleMoveUnit}
        selectedUnitId={selectedUnit?.id}
        onSelectUnit={setSelectedUnit}
        expandedNodes={expandedNodes}
        onToggleExpand={handleToggleExpand}
      />

      {/* Department Selector Modal */}
      {showDepartmentSelector && selectedManagement && (
        <ManagementDepartmentSelector
          management={selectedManagement}
          onClose={() => {
            setShowDepartmentSelector(false);
            setSelectedManagement(null);
          }}
          onSave={handleDepartmentSelection}
        />
      )}

      {/* Section Selector Modal */}
      {showSectionSelector && selectedDepartment && (
        <DepartmentSectionSelector
          department={selectedDepartment}
          onClose={() => {
            setShowSectionSelector(false);
            setSelectedDepartment(null);
          }}
          onSave={handleSectionSelection}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!unitToDelete} onOpenChange={() => setUnitToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>حذف واحد سازمانی</AlertDialogTitle>
            <AlertDialogDescription>
              آیا از حذف "{unitToDelete?.name}" اطمینان دارید؟ این عمل قابل بازگشت نیست.
              {unitToDelete?.children && unitToDelete.children.length > 0 && (
                <span className="block mt-2 text-red-600 font-medium">
                  توجه: این واحد دارای {unitToDelete.children.length} زیرمجموعه است که ابتدا باید حذف شوند.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>لغو</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteUnit}
              className="bg-red-600 hover:bg-red-700"
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default OrgStructurePage;
