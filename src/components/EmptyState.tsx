import React from "react";

interface EmptyStateProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, description, children }) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center space-y-2">
      <h2 className="text-lg font-medium">{title}</h2>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      {children}
    </div>
  );
};

export default EmptyState;
