import Image from "next/image";
import { CiLocationOn } from "react-icons/ci";
import { FaChevronDown } from "react-icons/fa";
import { BiSearchAlt } from "react-icons/bi";
import OutlineButton from "./Buttons/OutlineButtons";
import { LuCircleUserRound } from "react-icons/lu";
import UnderlineText from "./Text/UnderlineText";

export default function Navbar() {
    return (
        <nav className="flex flex-col w-screen fixed top-0 left-0 shadow-lg z-[1000] bg-white"> 
            <div className="w-full h-[60px] flex items-center justify-between xl:px-20 px-5 sm:gap-10 gap-5">
                <div className="flex gap-5 sm:gap-10">
                    <div className="sm:size-[60px] size-[40px] relative shrink-0">
                        <Image src={'/apollo-logo.svg'} width={60} height={60} alt="404"  className="w-full h-full object-contain" />
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <CiLocationOn className="stroke-1 size-6 max-sm:hidden" />

                        <div className="flex flex-col">
                            <div className="text-xs opacity-80">Select Location</div>
                            <div className="text-sm font-semibold flex items-center gap-1">
                                <div>Select Address</div>
                                <FaChevronDown/>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 max-w-[500px] h-10 border-1 rounded-md flex items-center px-2 gap-4 max-md:hidden">
                    <BiSearchAlt className="size-5" />
                    <input type="text" placeholder="Search Doctors, Specialities, Conditions etc."  className="flex-1 outline-none" />
                </div>

                <div className="flex items-center justify-center">
                    <div className="max-sm:hidden">
                        <OutlineButton title="login / signup">
                            <div className="flex items-center justify-center gap-2">
                                <div className="text-md font-semibold ">Login</div>
                                <LuCircleUserRound className="size-6" />
                            </div>
                        </OutlineButton>
                    </div>

                    <div className="sm:hidden">
                        <LuCircleUserRound className="size-6" />
                    </div>
                </div>
            </div>

            <hr className="opacity-30 max-sm:hidden"/>

            <div className="flex items-center justify-around gap-5 max-lg:hidden h-12 xl:px-20 px-5">
                {
                    [
                        {title: 'Buy Medicines'}, 
                        {title: 'Find Doctors'}, 
                        {title: 'Lab Tests'}, 
                        {title: "Circle Membership"},
                        {title: "Health Records"},
                        {title: "Diabetes Reversal"},
                        {title: "Buy Insurance"}
                    ].map(({title}) => (
                        <UnderlineText>
                            {title}
                        </UnderlineText>
                    ))
                }
            </div>

            {/* <div className="w-full max-w-[500px] flex items-center gap-4 md:hidden p-2 self-center mr-5">
                <div className="h-10 flex items-center justify-center flex-1 border-1 rounded-md px-2">
                    <BiSearchAlt className="size-5" />
                    <input type="text" placeholder="Search Doctors, Specialities, Conditions etc."  className="flex-1 outline-none" />
                </div>
            </div> */}
        </nav>
    )
}
