export default function NormalButton({children, className="", onClick=()=>{}, disable=false}) {
    return (
        <button 
            className={"bg-black border-2 border-black text-white h-10 px-3 rounded-md hover:bg-white hover:text-black flex items-center justify-center cursor-pointer " + className}
            disabled={disable} 
            onClick={onClick}
        >
            {children}
        </button>
    )
}