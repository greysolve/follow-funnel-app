interface TemplateSelectorProps {
  templates: any[];
  selectedTemplateId: string;
  onTemplateSelect: (templateId: string) => void;
  disabled?: boolean;
}

export default function TemplateSelector({
  templates,
  selectedTemplateId,
  onTemplateSelect,
  disabled = false,
}: TemplateSelectorProps) {
  return (
    <div className="p-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Template
      </label>
      <select
        value={selectedTemplateId}
        onChange={(e) => onTemplateSelect(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        disabled={disabled}
      >
        <option value="">Select a template...</option>
        {templates.map((template: any) => (
          <option key={template.id} value={template.id}>
            {template.name || `Template ${template.id}`}
          </option>
        ))}
      </select>
    </div>
  );
}
