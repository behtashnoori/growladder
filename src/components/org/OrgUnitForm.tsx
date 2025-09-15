import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { OrgUnit, ROOT_ORG_ID, OrgUnitType } from "@/types/org-unit";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface Props {
  unit?: OrgUnit;
  parents: OrgUnit[];
  onSubmit: (u: OrgUnit) => void;
}

const types: OrgUnitType[] = ["management", "department", "section", "post"];

const OrgUnitForm = ({ unit, parents, onSubmit }: Props) => {
  const { register, handleSubmit, watch, setValue } = useForm<OrgUnit>({
    defaultValues: unit ?? { id: "", name: "", unitType: "department", parentId: undefined, isIndependent: false },
  });

  const isIndependent = watch("isIndependent");

  useEffect(() => {
    if (isIndependent) {
      setValue("parentId", ROOT_ORG_ID);
    }
  }, [isIndependent, setValue]);

  return (
    <form
      onSubmit={handleSubmit((data) => {
        onSubmit({ ...data });
      })}
      className="space-y-4"
      dir="rtl"
    >
      <Input placeholder="کد" {...register("id", { required: true })} />
      <Input placeholder="نام" {...register("name", { required: true })} />
      <Select value={watch("unitType")} onValueChange={(v) => setValue("unitType", v as OrgUnitType)}>
        <SelectTrigger dir="rtl">
          <SelectValue placeholder="نوع" />
        </SelectTrigger>
        <SelectContent dir="rtl">
          {types.map((t) => (
            <SelectItem key={t} value={t}>
              {t}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {!isIndependent && (
        <Select value={watch("parentId") ?? ""} onValueChange={(v) => setValue("parentId", v)}>
          <SelectTrigger dir="rtl">
            <SelectValue placeholder="واحد والد" />
          </SelectTrigger>
          <SelectContent dir="rtl">
            {parents.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      <div className="flex items-center gap-2" dir="rtl">
        <Checkbox checked={isIndependent} onCheckedChange={(c) => setValue("isIndependent", Boolean(c))} />
        <span>اداره مستقل است</span>
      </div>
      <Button type="submit">ذخیره</Button>
    </form>
  );
};

export default OrgUnitForm;
