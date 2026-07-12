// src/components/common/LoadingSpinner.jsx
const LoadingSpinner = ({ size = "md", color = "blue" }) => {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  const colors = {
    blue: "border-blue-500",
    white: "border-white",
    gray: "border-gray-500",
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`${sizes[size]} animate-spin rounded-full border-4 border-t-transparent ${colors[color]}`}
      />
    </div>
  );
};

export default LoadingSpinner;