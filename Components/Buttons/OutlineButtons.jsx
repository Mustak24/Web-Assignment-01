

export default function OutlineButton({children,  title, style={}, className=''}) {
    return (
        <button style={style} title={title} className={"h-10 px-3 flex items-center justify-center gap-5 border-2 rounded-lg cursor-pointer border-black hover:bg-black hover:text-white transition-all duration-300 active:scale-95 " + className}>
            {children}
        </button>
    )
}