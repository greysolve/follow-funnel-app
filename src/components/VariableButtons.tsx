interface Variable {
  label: string;
  value: string;
}

interface VariableButtonsProps {
  variables: Variable[];
  onVariableClick: (value: string) => void;
  disabled?: boolean;
}

export default function VariableButtons({
  variables,
  onVariableClick,
  disabled = false,
}: VariableButtonsProps) {
  return (
    <div className="p-6 border-b border-gray-200">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Insert Variables
      </label>
      <div className="flex flex-wrap gap-2">
        {variables.map((variable) => (
          <button
            key={variable.value}
            type="button"
            onClick={() => onVariableClick(variable.value)}
            disabled={disabled}
            className="px-3 py-1.5 text-sm bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {variable.label}
          </button>
        ))}
      </div>
    </div>
  );
}
