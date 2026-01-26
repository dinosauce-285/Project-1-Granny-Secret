export default function Loader({ className = "" }) {
  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <div className="w-12 h-12 border-4 border-olive border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
