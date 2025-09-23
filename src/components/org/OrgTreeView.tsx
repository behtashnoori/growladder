import { useState } from 'react';
import { ChevronRight, ChevronDown, Plus, Edit, Trash2, Move, Building, Folder, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { OrgUnit } from '@/services/api/orgStructure';

interface OrgTreeViewProps {
  units: OrgUnit[];
  onAddChild?: (parentId: string) => void;
  onEdit?: (unit: OrgUnit) => void;
  onDelete?: (unit: OrgUnit) => void;
  onMove?: (unit: OrgUnit) => void;
  selectedUnitId?: string;
  onSelectUnit?: (unit: OrgUnit) => void;
  expandedNodes: Set<string>;
  onToggleExpand: (nodeId: string) => void;
}

const getUnitIcon = (unitType: string) => {
  switch (unitType) {
    case 'management':
      return <Building className="h-4 w-4 text-blue-600" />;
    case 'department':
      return <Folder className="h-4 w-4 text-green-600" />;
    case 'section':
      return <FileText className="h-4 w-4 text-orange-600" />;
    default:
      return <Building className="h-4 w-4" />;
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

const OrgTreeNode = ({ 
  unit, 
  level = 0, 
  onAddChild, 
  onEdit, 
  onDelete, 
  onMove,
  selectedUnitId,
  onSelectUnit,
  expandedNodes,
  onToggleExpand
}: {
  unit: OrgUnit;
  level?: number;
  onAddChild?: (parentId: string) => void;
  onEdit?: (unit: OrgUnit) => void;
  onDelete?: (unit: OrgUnit) => void;
  onMove?: (unit: OrgUnit) => void;
  selectedUnitId?: string;
  onSelectUnit?: (unit: OrgUnit) => void;
  expandedNodes: Set<string>;
  onToggleExpand: (nodeId: string) => void;
}) => {
  const hasChildren = unit.children && unit.children.length > 0;
  const isExpanded = expandedNodes.has(unit.id);
  const isSelected = selectedUnitId === unit.id;

  return (
    <div className="select-none">
      <div
        className={cn(
          "flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors",
          isSelected && "bg-blue-50 border border-blue-200",
          level > 0 && "ml-4"
        )}
        style={{ marginLeft: `${level * 20}px` }}
        onClick={() => onSelectUnit?.(unit)}
      >
        {/* Expand/Collapse Button */}
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand(unit.id);
            }}
            className="p-1 hover:bg-gray-200 rounded"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        ) : (
          <div className="w-6" />
        )}

        {/* Unit Icon */}
        {getUnitIcon(unit.unitType)}

        {/* Unit Info */}
        <div className="flex-1 flex items-center gap-2">
          <span className="font-medium text-gray-900">{unit.name}</span>
          <Badge variant="outline" className="text-xs">
            {getUnitTypeLabel(unit.unitType)}
          </Badge>
          {unit.isIndependent && (
            <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
              مستقل
            </Badge>
          )}
          {unit.headRoleAllowed && (
            <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
              دارای رئیس
            </Badge>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          {onAddChild && unit.unitType === 'management' && (
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onAddChild(unit.id);
              }}
              className="h-8 px-3 text-sm"
              title="انتخاب اداره‌ها"
            >
              <Plus className="h-4 w-4 ml-1" />
              انتخاب اداره‌ها
            </Button>
          )}
          {onAddChild && unit.unitType === 'department' && (
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onAddChild(unit.id);
              }}
              className="h-8 px-3 text-sm"
              title="انتخاب بخش‌ها"
            >
              <Plus className="h-4 w-4 ml-1" />
              انتخاب بخش‌ها
            </Button>
          )}
          {onEdit && (
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(unit);
              }}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
          {onMove && (
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onMove(unit);
              }}
              className="h-8 w-8 p-0"
            >
              <Move className="h-4 w-4" />
            </Button>
          )}
          {onDelete && (
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(unit);
              }}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div>
          {unit.children!.map((child) => (
            <OrgTreeNode
              key={child.id}
              unit={child}
              level={level + 1}
              onAddChild={onAddChild}
              onEdit={onEdit}
              onDelete={onDelete}
              onMove={onMove}
              selectedUnitId={selectedUnitId}
              onSelectUnit={onSelectUnit}
              expandedNodes={expandedNodes}
              onToggleExpand={onToggleExpand}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const OrgTreeView = ({
  units,
  onAddChild,
  onEdit,
  onDelete,
  onMove,
  selectedUnitId,
  onSelectUnit,
  expandedNodes,
  onToggleExpand
}: OrgTreeViewProps) => {
  // Filter to show only management units (not independent departments)
  const topLevelUnits = units.filter(unit => 
    unit.unitType === 'management'
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          ساختار سازمانی
        </CardTitle>
        <div className="text-sm text-gray-600">
          مدیریت‌ها - روی هر مدیریت کلیک کنید تا اداره‌ها را تنظیم کنید
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {topLevelUnits.map((unit) => (
            <OrgTreeNode
              key={unit.id}
              unit={unit}
              onAddChild={onAddChild}
              onEdit={onEdit}
              onDelete={onDelete}
              onMove={onMove}
              selectedUnitId={selectedUnitId}
              onSelectUnit={onSelectUnit}
              expandedNodes={expandedNodes}
              onToggleExpand={onToggleExpand}
            />
          ))}
          {topLevelUnits.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              ساختار سازمانی تعریف نشده است
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrgTreeView;
