import TrainingForm from "@/components/training/TrainingForm";

const AddTraining = () => {
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold" dir="rtl">
        افزودن دوره گذرانده
      </h2>
      <TrainingForm />
    </div>
  );
};

export default AddTraining;
