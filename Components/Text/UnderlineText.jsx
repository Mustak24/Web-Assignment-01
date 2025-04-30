
export default function UnderlineText({children}){
    return (
        <div className="flex items-center justify-center h-10 text-nowrap px-2 relative after:absolute after:bottom-1 after:bg-sky-500 after:h-[3px] after:transition-all after:duration-200 after:w-0 hover:after:w-full after:rounded-full hover:text-sky-500 transition-all duration-300 cursor-pointer">
            {children}
        </div>
    )
}