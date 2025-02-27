export const Button = ({
    children,
    backgroundColor = "bg-blue-500",
    textColor = "text-white",
    hoverBackgroundColor = "hover:bg-blue-600",
    hoverTextColor = "hover:text-white",
    className = "",
    ...props
}) => {
    return (
        <button
            className={`
          ${backgroundColor} ${textColor}
          ${hoverBackgroundColor} ${hoverTextColor}
          px-4 py-2 rounded-md transition-colors duration-200 ease-in-out
          ${className}
        `}
            {...props}
        >
            {children}
        </button>
    )
}
