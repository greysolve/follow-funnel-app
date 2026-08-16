const buttonClassName =
  'block w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition text-center disabled:opacity-50 disabled:cursor-not-allowed';

export default function StripePlanButton({ href }: { href: string | null }) {
  if (!href) {
    return (
      <button type="button" disabled className={buttonClassName}>
        Select Plan
      </button>
    );
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={buttonClassName}>
      Select Plan
    </a>
  );
}
