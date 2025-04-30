import { useEffect, useState } from "react"
import { MdKeyboardArrowDown } from "react-icons/md";

export default function Selector({opations, className, selectorBoxClassName, selectorRowClassName, selected, onChangeValue=()=>{}, children}) {

    const [selectedVal, setSelectedVal] = useState(selected || opations[0])
    const [isOpen, setOpen] = useState(false);

    useEffect(() => {
        onChangeValue(selectedVal)
    }, [selectedVal])

    return (
        <div onClick={() => setOpen((pre) => !pre)} className={className} style={{position: 'relative'}}>
            <div className="flex gap-2 items-center justify-center">
                {children}
                {selectedVal}
                <MdKeyboardArrowDown className="size-5 transition-all duration-200" style={{rotate: isOpen ? '180deg': '0deg'}} />
            </div>
            <div 
                className={selectorBoxClassName}
                style={{
                    scale: isOpen ? 1 : 0, 
                    opacity: isOpen ? 1 : 0, 
                    visibility: isOpen ? 'visible' : 'hidden', 
                    transition: 'all .3',
                    position: 'absolute',
                    top: '100%',
                    left: '50%',
                    transform: 'translate(-50%)',
                    width: '100%'
                }} 
            >
                {opations.map(val => (
                    <div onClick={() => setSelectedVal(val)} className={selectorRowClassName}>{val}</div>
                ))}
            </div>
        </div>
    )
}