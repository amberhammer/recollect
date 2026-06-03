import { useNavigate } from "react-router-dom";

export default function BackButton({ to = "/", className = "" }) {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(to);
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      aria-label="Go back"
      className={`flex items-center gap-2 bg-taupe-300 px-3 py-2 rounded-lg hover:border hover:border-taupe-400 ${className}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="m12 19-7-7 7-7" />
        <path d="M19 12H5" />
      </svg>
      Back
    </button>
  );
}
