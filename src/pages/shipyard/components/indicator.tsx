const Indicator = ({ position, style }) => {
    return <div style={{
        position: 'absolute',
        height: 20,
        width: 20,
        top: '-1px',
        marginTop: -12,
        transform: `${position === 'top' ? 'rotate(315deg)' : position === 'right' ? 'rotate(45deg)' : 'rotate(315deg)'}`,
        background: `linear-gradient(${position === 'top' ? '45deg' : position === 'left' ? '315deg' : '45deg'}, transparent 12px, #00aeef 0) top left`,
        ...style,
    }}></div>
}

export default Indicator