import './Button.css'

function Button({
    children,
    className = '',
    disabled = false,
    onClick,
    type = 'button',
    visual = 'button'
}) {
    const visualClass = visual === 'link' ? 'button-link' : 'button';

    return (
        <button
        className={`${visualClass} ${className}`}
        onClick={onClick}
        disabled={disabled}
        type={type}>

            {children}
        </button>
    )
}

export default Button;