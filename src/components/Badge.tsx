export default function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-gradient-to-r from-orange-50 to-red-50 text-orange-700 px-3 py-1 text-xs font-semibold border border-orange-200/50">
      {children}
    </span>
  );
}